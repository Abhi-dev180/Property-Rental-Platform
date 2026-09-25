import { supabaseAdmin } from "../config/supabase";
import { Lease, LeaseStatus } from "../types";

export interface LeaseInput {
  applicationId?: string;
  propertyId?: string;
  tenantId?: string;
  rentAmount: number;
  securityDeposit: number;
  leaseStartDate: string;
  leaseDurationMonths: number;
  terms?: string;
}

const ALLOWED_TRANSITIONS: Record<LeaseStatus, LeaseStatus[]> = {
  DRAFT: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["TERMINATED", "EXPIRED"],
  EXPIRED: [],
  TERMINATED: [],
  CANCELLED: [],
};

async function getLeaseOrThrow(id: string): Promise<Lease> {
  const { data, error } = await supabaseAdmin.from("leases").select("*").eq("id", id).maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  if (!data) throw Object.assign(new Error("Lease not found."), { statusCode: 404 });
  return data as Lease;
}

export async function createLease(landlordId: string, input: LeaseInput): Promise<Lease> {
  let propertyId = input.propertyId;
  let tenantId = input.tenantId;
  let applicationId: string | null = null;

  if (input.applicationId) {
    const { data: application, error } = await supabaseAdmin
      .from("rental_applications")
      .select("*")
      .eq("id", input.applicationId)
      .maybeSingle();
    if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
    if (!application) throw Object.assign(new Error("Application not found."), { statusCode: 404 });
    if (application.status !== "APPROVED") {
      throw Object.assign(new Error("A lease can only be created from an approved application."), { statusCode: 409 });
    }
    propertyId = application.property_id;
    tenantId = application.tenant_id;
    applicationId = application.id;
  }

  if (!propertyId || !tenantId) {
    throw Object.assign(new Error("propertyId and tenantId are required (or provide applicationId)."), { statusCode: 400 });
  }

  const { data: property, error: propertyError } = await supabaseAdmin
    .from("properties")
    .select("id, landlord_id")
    .eq("id", propertyId)
    .maybeSingle();
  if (propertyError) throw Object.assign(new Error(propertyError.message), { statusCode: 500 });
  if (!property) throw Object.assign(new Error("Property not found."), { statusCode: 404 });
  if (property.landlord_id !== landlordId) {
    throw Object.assign(new Error("You do not manage this property."), { statusCode: 403 });
  }

  const startDate = new Date(input.leaseStartDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + input.leaseDurationMonths);

  const { data, error } = await supabaseAdmin
    .from("leases")
    .insert({
      application_id: applicationId,
      property_id: propertyId,
      tenant_id: tenantId,
      landlord_id: landlordId,
      rent_amount: input.rentAmount,
      security_deposit: input.securityDeposit,
      lease_start_date: input.leaseStartDate,
      lease_end_date: endDate.toISOString().slice(0, 10),
      lease_duration_months: input.leaseDurationMonths,
      terms: input.terms ?? null,
    })
    .select()
    .single();

  if (error || !data) throw Object.assign(new Error("Failed to create lease."), { statusCode: 500 });
  return data as Lease;
}

export async function getLeaseDetail(id: string, requesterId: string, role: string): Promise<Lease> {
  const lease = await getLeaseOrThrow(id);
  if (role !== "ADMIN" && lease.tenant_id !== requesterId && lease.landlord_id !== requesterId) {
    throw Object.assign(new Error("You do not have access to this lease."), { statusCode: 403 });
  }
  return lease;
}

export async function listMyLeasesTenant(tenantId: string) {
  const { data, error } = await supabaseAdmin
    .from("leases")
    .select("*, properties(title, city, images)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  return data ?? [];
}

export async function listMyLeasesLandlord(landlordId: string) {
  const { data, error } = await supabaseAdmin
    .from("leases")
    .select("*, properties(title, city, images), users!leases_tenant_id_fkey(full_name, email, phone)")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false });
  if (error) throw Object.assign(new Error(error.message), { statusCode: 500 });
  return data ?? [];
}

export async function updateLeaseStatus(id: string, landlordId: string, status: LeaseStatus): Promise<Lease> {
  const lease = await getLeaseOrThrow(id);
  if (lease.landlord_id !== landlordId) {
    throw Object.assign(new Error("You do not manage this lease."), { statusCode: 403 });
  }
  if (!ALLOWED_TRANSITIONS[lease.status].includes(status)) {
    throw Object.assign(new Error(`Cannot move a lease from ${lease.status} to ${status}.`), { statusCode: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from("leases")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw Object.assign(new Error("Failed to update lease status."), { statusCode: 500 });

  if (status === "TERMINATED" || status === "EXPIRED") {
    await supabaseAdmin.from("properties").update({ status: "AVAILABLE" }).eq("id", lease.property_id);
  }

  return data as Lease;
}

export async function signLease(id: string, userId: string): Promise<Lease> {
  const lease = await getLeaseOrThrow(id);
  const isTenant = lease.tenant_id === userId;
  const isLandlord = lease.landlord_id === userId;
  if (!isTenant && !isLandlord) {
    throw Object.assign(new Error("You are not a party to this lease."), { statusCode: 403 });
  }
  if (lease.status !== "DRAFT") {
    throw Object.assign(new Error("Only draft leases can be signed."), { statusCode: 409 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (isTenant) update.signed_by_tenant = true;
  if (isLandlord) update.signed_by_landlord = true;

  const bothSigned =
    (isTenant ? true : lease.signed_by_tenant) && (isLandlord ? true : lease.signed_by_landlord);
  if (bothSigned) update.status = "ACTIVE";

  const { data, error } = await supabaseAdmin.from("leases").update(update).eq("id", id).select().single();
  if (error || !data) throw Object.assign(new Error("Failed to sign lease."), { statusCode: 500 });
  return data as Lease;
}

