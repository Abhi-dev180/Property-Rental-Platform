import { supabaseAdmin } from "../config/supabase";

export async function addFavorite(userId: string, propertyId: string) {
  const { error } = await supabaseAdmin
    .from("favorites")
    .upsert({ user_id: userId, property_id: propertyId }, { onConflict: "user_id,property_id" });
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
}

export async function removeFavorite(userId: string, propertyId: string) {
  const { error } = await supabaseAdmin
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("property_id", propertyId);
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
}

export async function listFavorites(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("property_id, created_at, properties(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  return (data ?? []).map((row: any) => ({ ...row.properties, favorited_at: row.created_at }));
}