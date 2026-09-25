import { supabaseAdmin } from "../config/supabase";
import { ApplicationStatus, RentalApplication } from "../types";
import * as storageService from "./storage.service";

export interface ApplicationInput {
  propertyId: string;
  desiredMoveInDate: string;
  leaseDurationMonths: number;
  monthlyIncome?: number;
  employmentStatus?: string;
  employerName?: string;
  additionalNotes?: string;
}

export async function createApplication(tenantId: string, input: ApplicationInput): Promise<RentalApplication> {
  // property must exist and be available
  const { data: property, error: propertyError } = await supabaseAdmin
    .from("properties")
    .select("id, status, landlord_id")
    .eq("id", input.propertyId)
    .maybeSingle();

  if (propertyError) throw Object.assign(new Error(propertyError.message), { statusCode: 500 });
  if (!property) throw Object.assign(new Error("Property not found."), { statusCode: 404 });
  if (property.status !== "AVAILABLE") {
    throw Object.assign(new Error("This property is not currently accepting applications."), { statusCode: 409 });
  }
  if (property.landlord_id === tenantId) {
    throw Object.assign(new Error("You cannot apply to your own property."), { statusCode: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("rental_applications")
    .insert({
      property_id: input.propertyId,
      tenant_id: tenantId,
      desired_move_in_date: input.desiredMoveInDate,
      lease_duration_months: input.leaseDurationMonths,
      monthly_income: input.monthlyIncome ?? null,
      employment_status: input.employmentStatus ?? null,
      employer_name: input.employerName ?? null,
      additional_notes: input.additionalNotes ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") { // unique_violation — duplicate pending application
      throw Object.assign(new Error("You already have a pending application for this property."), { statusCode: 409 });
    }
    throw Object.assign(new Error(error.message), { statusCode: 500 });
  }

  return data as RentalApplication;
}

export async function addApplicationDocuments(
  applicationId: string,
  tenantId: string,
  files: { idProof?: Express.Multer.File[]; incomeProof?: Express.Multer.File[]; referenceLetter?: Express.Multer.File[] }
) {
  const app = await getApplicationOrThrow(applicationId);
  if (app.tenant_id !== tenantId) {
    throw Object.assign(new Error("You can only upload documents to your own application."), { statusCode: 403 });
  }

  const uploads = [
    ...(files.idProof ?? []),
    ...(files.incomeProof ?? []),
    ...(files.referenceLetter ?? []),
  ];

  const results = [];
  for (const file of uploads) {
    const doc = await storageService.uploadDocument({
      ownerId: tenantId,
      category: "APPLICATION_DOCUMENT",
      relatedId: applicationId,
      file,
    });
    results.push(doc);
  }
  return results;
}

async function getApplicationOrThrow(id: string): Promise<RentalApplication> {
  const { data, error } = await supabaseAdmin
    .from("rental_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  if (!data) throw Object.assign(new Error("Application not found."), { statusCode: 404 });
  return data as RentalApplication;
}

export async function getApplicationDetail(applicationId: string, requesterId: string, requesterRole: string) {
  const app = await getApplicationOrThrow(applicationId);

  // authorization: the tenant who applied, OR the landlord who owns the property, OR admin
  if (requesterRole !== "ADMIN" && app.tenant_id !== requesterId) {
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("landlord_id")
      .eq("id", app.property_id)
      .maybeSingle();
    if (!property || property.landlord_id !== requesterId) {
      throw Object.assign(new Error("You do not have access to this application."), { statusCode: 403 });
    }
  }

  const docs = await storageService.listDocuments({ category: "APPLICATION_DOCUMENT", relatedId: applicationId });
  const documentsWithUrls = await Promise.all(
    docs.map(async (d) => ({ ...d, url: await storageService.getSignedUrl(d) }))
  );

  return { application: app, documents: documentsWithUrls };
}

export async function listMyApplications(tenantId: string): Promise<RentalApplication[]> {
  const { data, error } = await supabaseAdmin
    .from("rental_applications")
    .select("*, properties(title, city, rent_amount, images)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  return (data ?? []) as any;
}



export async function listLandlordApplications(landlordId: string, status?: ApplicationStatus): Promise<any[]> {
  let query = supabaseAdmin
    .from("rental_applications")
    .select("*, properties!inner(title, city, landlord_id), users!rental_applications_tenant_id_fkey(full_name, email, phone)")
    .eq("properties.landlord_id", landlordId)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  return data ?? [];
}

export async function withdrawApplication(applicationId: string, tenantId: string): Promise<RentalApplication> {
  const app = await getApplicationOrThrow(applicationId);
  if (app.tenant_id !== tenantId) {
    throw Object.assign(new Error("You can only withdraw your own application."), { statusCode: 403 });
  }
  if (app.status !== "PENDING") {
    throw Object.assign(new Error("Only pending applications can be withdrawn."), { statusCode: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from("rental_applications")
    .update({ status: "WITHDRAWN", updated_at: new Date().toISOString() })
    .eq("id", applicationId)
    .select()
    .single();

  if (error || !data) throw Object.assign(new Error("Failed to withdraw application."), { statusCode: 500 });
  return data as RentalApplication;
}

export async function updateApplicationStatus(
  applicationId: string,
  landlordId: string,
  status: "APPROVED" | "REJECTED",
  rejectionReason?: string
): Promise<RentalApplication> {
  const app = await getApplicationOrThrow(applicationId);

  const { data: property, error: propertyError } = await supabaseAdmin
    .from("properties")
    .select("id, landlord_id, status")
    .eq("id", app.property_id)
    .single();

  if (propertyError || !property) throw Object.assign(new Error("Property not found."), { statusCode: 404 });
  if (property.landlord_id !== landlordId) {
    throw Object.assign(new Error("You do not manage this property."), { statusCode: 403 });
  }
  if (app.status !== "PENDING") {
    throw Object.assign(new Error("Only pending applications can be reviewed."), { statusCode: 409 });
  }
  if (status === "REJECTED" && !rejectionReason) {
    throw Object.assign(new Error("A rejection reason is required."), { statusCode: 400 });
  }

  const { data: updated, error } = await supabaseAdmin
    .from("rental_applications")
    .update({
      status,
      rejection_reason: status === "REJECTED" ? rejectionReason : null,
      reviewed_by: landlordId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (error || !updated) throw Object.assign(new Error("Failed to update application."), { statusCode: 500 });

  // On approval: mark the property RENTED and auto-reject other pending applications for it
  if (status === "APPROVED") {
    await supabaseAdmin.from("properties").update({ status: "RENTED" }).eq("id", app.property_id);
    await supabaseAdmin
      .from("rental_applications")
      .update({
        status: "REJECTED",
        rejection_reason: "Another application for this property was approved.",
        reviewed_by: landlordId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("property_id", app.property_id)
      .eq("status", "PENDING")
      .neq("id", applicationId);
  }

  return updated as RentalApplication;
}