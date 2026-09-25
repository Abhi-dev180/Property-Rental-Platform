import { supabaseAdmin } from "../config/supabase";
import { Property, PropertyStatus, PropertyType } from "../types";

const PROPERTY_IMAGE_BUCKET = "property-images";
const MAX_IMAGES_PER_PROPERTY = 8;

export interface PropertyInput {
  title: string;
  description?: string | null;
  propertyType: PropertyType;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number | null;
  rentAmount: number;
  depositAmount?: number | null;
  amenities?: string[];
  status?: PropertyStatus;
}

function toRow(input: Partial<PropertyInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.description !== undefined) row.description = input.description;
  if (input.propertyType !== undefined) row.property_type = input.propertyType;
  if (input.addressLine1 !== undefined) row.address_line1 = input.addressLine1;
  if (input.addressLine2 !== undefined) row.address_line2 = input.addressLine2;
  if (input.city !== undefined) row.city = input.city;
  if (input.state !== undefined) row.state = input.state;
  if (input.postalCode !== undefined) row.postal_code = input.postalCode;
  if (input.country !== undefined) row.country = input.country;
  if (input.bedrooms !== undefined) row.bedrooms = input.bedrooms;
  if (input.bathrooms !== undefined) row.bathrooms = input.bathrooms;
  if (input.areaSqft !== undefined) row.area_sqft = input.areaSqft;
  if (input.rentAmount !== undefined) row.rent_amount = input.rentAmount;
  if (input.depositAmount !== undefined) row.deposit_amount = input.depositAmount;
  if (input.amenities !== undefined) row.amenities = input.amenities;
  if (input.status !== undefined) row.status = input.status;
  return row;
}

function notFound(): never {
  throw Object.assign(new Error("Property not found."), { statusCode: 404 });
}

export async function listProperties(landlordId: string): Promise<Property[]> {
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("*")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false });

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  return (data ?? []) as Property[];
}

export async function getProperty(landlordId: string, propertyId: string): Promise<Property> {
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("landlord_id", landlordId)
    .maybeSingle();

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  if (!data) notFound();
  return data as Property;
}

export async function createProperty(landlordId: string, input: PropertyInput): Promise<Property> {
  const row = toRow(input);
  row.landlord_id = landlordId;
  if (!row.status) row.status = "DRAFT";

  const { data, error } = await supabaseAdmin.from("properties").insert(row).select().single();
  if (error || !data) {
    throw Object.assign(new Error(error?.message ?? "Failed to create property."), { statusCode: 500 });
  }
  return data as Property;
}

export async function updateProperty(
  landlordId: string,
  propertyId: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  const patch = toRow(input);
  if (Object.keys(patch).length === 0) return getProperty(landlordId, propertyId);

  const { data, error } = await supabaseAdmin
    .from("properties")
    .update(patch)
    .eq("id", propertyId)
    .eq("landlord_id", landlordId)
    .select()
    .maybeSingle();

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  if (!data) notFound();
  return data as Property;
}

function pathFromPublicUrl(url: string): string | null {
  const marker = `${PROPERTY_IMAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export async function deleteProperty(landlordId: string, propertyId: string): Promise<void> {
  const property = await getProperty(landlordId, propertyId);

  const paths = property.images.map(pathFromPublicUrl).filter(Boolean) as string[];
  if (paths.length) {
    await supabaseAdmin.storage.from(PROPERTY_IMAGE_BUCKET).remove(paths).catch(() => {});
  }

  const { error } = await supabaseAdmin
    .from("properties")
    .delete()
    .eq("id", propertyId)
    .eq("landlord_id", landlordId);

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
}

function extensionFor(mimetype: string): string {
  switch (mimetype) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "jpg";
  }
}



export async function addPropertyImages(
  landlordId: string,
  propertyId: string,
  files: Express.Multer.File[]
): Promise<Property> {
  const property = await getProperty(landlordId, propertyId);

  if (property.images.length + files.length > MAX_IMAGES_PER_PROPERTY) {
    throw Object.assign(new Error(`A property can have at most ${MAX_IMAGES_PER_PROPERTY} photos.`), { statusCode: 400 });
  }

  const newUrls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `${landlordId}/${propertyId}/photo-${Date.now()}-${i}.${extensionFor(file.mimetype)}`;
    const { error } = await supabaseAdmin.storage
      .from(PROPERTY_IMAGE_BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });
    if (error) throw Object.assign(new Error(`Failed to upload photo: ${error.message}`), { statusCode: 500 });
    const { data: publicUrl } = supabaseAdmin.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(path);
    newUrls.push(publicUrl.publicUrl);
  }

  const images = [...property.images, ...newUrls];
  const { data, error } = await supabaseAdmin
    .from("properties")
    .update({ images })
    .eq("id", propertyId)
    .eq("landlord_id", landlordId)
    .select()
    .single();

  if (error || !data) throw Object.assign(new Error(error?.message ?? "Failed to save photos."), { statusCode: 500 });
  return data as Property;
}

export async function removePropertyImage(
  landlordId: string,
  propertyId: string,
  imageUrl: string
): Promise<Property> {
  const property = await getProperty(landlordId, propertyId);

  const path = pathFromPublicUrl(imageUrl);
  if (path) {
    await supabaseAdmin.storage.from(PROPERTY_IMAGE_BUCKET).remove([path]).catch(() => {});
  }

  const images = property.images.filter((url) => url !== imageUrl);
  const { data, error } = await supabaseAdmin
    .from("properties")
    .update({ images })
    .eq("id", propertyId)
    .eq("landlord_id", landlordId)
    .select()
    .single();

  if (error || !data) throw Object.assign(new Error(error?.message ?? "Failed to remove photo."), { statusCode: 500 });
  return data as Property;
}