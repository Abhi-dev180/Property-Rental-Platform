import { supabaseAdmin } from "../config/supabase";
import { PublicPropertyRow } from "../types";

export interface PublicSearchParams {
  search?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  amenities?: string[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "distance";
  page?: number;
  limit?: number;
}

export interface PublicSearchResult {
  properties: PublicPropertyRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function searchProperties(params: PublicSearchParams): Promise<PublicSearchResult> {
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(Math.max(params.limit ?? 12, 1), 50);

  const { data, error } = await supabaseAdmin.rpc("search_properties", {
    p_search: params.search ?? null,
    p_city: params.city ?? null,
    p_property_type: params.propertyType ?? null,
    p_min_price: params.minPrice ?? null,
    p_max_price: params.maxPrice ?? null,
    p_min_bedrooms: params.minBedrooms ?? null,
    p_min_bathrooms: params.minBathrooms ?? null,
    p_amenities: params.amenities && params.amenities.length ? params.amenities : null,
    p_lat: params.lat ?? null,
    p_lng: params.lng ?? null,
    p_radius_km: params.radiusKm ?? null,
    p_sort: params.sort ?? "newest",
    p_page: page,
    p_limit: limit,
  });

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });

  const rows = (data ?? []) as any[];
  const total = rows[0]?.out_total_count ? Number(rows[0].out_total_count) : 0;

  return {
    properties: rows.map((r) => ({
      ...r,
      images: Array.isArray(r.images) ? r.images : [],
      distance_km: r.out_distance_km,
    })),
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

export async function getPublicProperty(propertyId: string): Promise<PublicPropertyRow | null> {
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("status", "AVAILABLE")
    .maybeSingle();

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  if (!data) return null;
  return {
    ...data,
    images: Array.isArray((data as any).images) ? (data as any).images : [],
    distance_km: null,
    total_count: 1,
  } as PublicPropertyRow;
}

export async function attachFavoriteFlags(
  properties: PublicPropertyRow[],
  userId: string | undefined
): Promise<(PublicPropertyRow & { is_favorited: boolean })[]> {
  if (!userId || properties.length === 0) {
    return properties.map((p) => ({ ...p, is_favorited: false }));
  }

  const ids = properties.map((p) => p.id);
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("property_id")
    .eq("user_id", userId)
    .in("property_id", ids);

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });

  const favoritedIds = new Set((data ?? []).map((f) => f.property_id));
  return properties.map((p) => ({ ...p, is_favorited: favoritedIds.has(p.id) }));
}