"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, LandlordVerification, Property } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { InlineBanner } from "@/components/profile/InlineBanner";
import { PropertyStatusBadge } from "@/components/properties/PropertyStatusBadge";

export default function PropertiesPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [verification, setVerification] = useState<LandlordVerification | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role !== "LANDLORD") { router.replace("/dashboard"); return; }

    let cancelled = false;
    (async () => {
      try {
        const [{ properties }, { verification }] = await Promise.all([
          api.listProperties(),
          api.getLandlordVerification(),
        ]);
        if (!cancelled) { setProperties(properties); setVerification(verification); }
      } catch (err: any) {
        if (!cancelled) setLoadError(err.message ?? "Failed to load properties.");
      }
    })();
    return () => { cancelled = true; };
  }, [authLoading, user, router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this property? This can't be undone.")) return;
    setDeleteError(null);
    setDeletingId(id);
    try {
      await api.deleteProperty(id);
      setProperties((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    } catch (err: any) {
      setDeleteError(err.message ?? "Failed to delete property.");
    } finally {
      setDeletingId(null);
    }
  }

  if (authLoading || !user || user.role !== "LANDLORD") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas text-ink">
        <p className="text-sm tracking-wide text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <AppShell user={user} onLogout={logout} eyebrow="For landlords" title="Properties">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gold">For landlords</p>
          <h1 className="mt-1 text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.35rem]">Your properties</h1>
          <p className="mt-2 max-w-lg text-[15px] text-muted-2">Create, edit, and manage every listing you own from here.</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button variant="primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Add property
          </Button>
        </Link>
      </div>

      {loadError && <div className="mt-6"><InlineBanner kind="error" message={loadError} /></div>}
      {deleteError && <div className="mt-6"><InlineBanner kind="error" message={deleteError} /></div>}

      {verification && verification.status !== "VERIFIED" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold-soft/40 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">
              {verification.status === "PENDING" ? "Your landlord verification is pending review." : "Get verified to build trust with tenants."}
            </p>
            <p className="mt-0.5 text-sm text-muted-2">
              {verification.status === "PENDING" ? "You can still create and manage properties while we review your details." : "Verified landlords stand out. It only takes a couple of minutes."}
            </p>
          </div>
          {verification.status !== "PENDING" && (
            <Link href="/dashboard/profile#verification" className="shrink-0 rounded-[6px] bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Complete verification
            </Link>
          )}
        </div>
      )}

      {properties === null ? (
        <p className="mt-10 text-sm text-muted">Loading your properties...</p>
      ) : properties.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <p className="text-[15px] font-medium text-ink">No properties yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">Add your first property to start managing listings, rent, and tenants in one place.</p>
          <Link href="/dashboard/properties/new" className="mt-5 inline-block">
            <Button variant="gold">Add your first property</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="group overflow-hidden rounded-2xl border border-ink/8 bg-white transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(11,18,32,0.25)]">
              <div className="relative flex h-36 items-center justify-center bg-ink">
                {property.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/30">
                    <path d="M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="absolute left-2.5 top-2.5"><PropertyStatusBadge status={property.status} /></span>
              </div>

              <div className="p-4">
                <p className="truncate text-[15px] font-semibold text-ink">{property.title}</p>
                <p className="mt-0.5 truncate text-sm text-muted">{property.city}{property.state ? `, ${property.state}` : ""}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[15px] font-semibold text-primary">${property.rent_amount.toLocaleString()}<span className="text-xs font-normal text-muted">/mo</span></p>
                  <p className="text-xs text-muted">{property.bedrooms} bedrooms &middot; {property.bathrooms} bathrooms</p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-3">
                  <Link href={`/dashboard/properties/${property.id}/edit`} className="flex-1 rounded-[6px] border border-ink/15 px-3 py-1.5 text-center text-sm font-medium text-ink transition-colors hover:border-ink/40">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    disabled={deletingId === property.id}
                    className="rounded-[6px] px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/8 disabled:opacity-50"
                  >
                    {deletingId === property.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}