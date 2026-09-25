"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { leaseApi, LeaseWithProperty } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { LeaseStatusBadge } from "@/components/leases/LeaseStatusBadge";

export default function MyLeasesPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [leases, setLeases] = useState<LeaseWithProperty[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role !== "TENANT") { router.replace("/landlord/leases"); return; }
    load();
  }, [authLoading, user]);

  async function load() {
    setError(null);
    try {
      const { leases } = await leaseApi.listMine();
      setLeases(leases);
    } catch (err: any) {
      setError(err.message ?? "Failed to load leases.");
      setLeases([]);
    }
  }

  async function handleSign(id: string) {
    setSigningId(id);
    try {
      await leaseApi.sign(id);
      await load();
    } catch (err: any) {
      setError(err.message ?? "Failed to sign lease.");
    } finally {
      setSigningId(null);
    }
  }

  if (authLoading || !user || user.role !== "TENANT") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas text-ink">
        <p className="text-sm tracking-wide text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <AppShell user={user} onLogout={logout} eyebrow="For tenants" title="My Leases">
      <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.35rem]">
        Your leases
      </h1>
      <p className="mt-2 max-w-lg text-[15px] text-muted-2">
        Leases your landlord has created for you appear here.
      </p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {leases === null ? (
        <p className="mt-10 text-sm text-muted">Loading leases...</p>
      ) : leases.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center">
          <p className="text-[15px] font-medium text-ink">No leases yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
            Once a landlord approves your application and creates a lease, it'll show up here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {leases.map((lease) => (
            <div key={lease.id} className="rounded-[10px] border border-ink/8 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-semibold text-ink">{lease.properties?.title ?? "Property"}</p>
                <LeaseStatusBadge status={lease.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-muted text-xs">Rent</p><p className="text-ink font-medium">${lease.rent_amount.toLocaleString()}/mo</p></div>
                <div><p className="text-muted text-xs">Deposit</p><p className="text-ink font-medium">${lease.security_deposit.toLocaleString()}</p></div>
                <div><p className="text-muted text-xs">Start</p><p className="text-ink font-medium">{lease.lease_start_date}</p></div>
                <div><p className="text-muted text-xs">End</p><p className="text-ink font-medium">{lease.lease_end_date}</p></div>
              </div>

              {lease.status === "DRAFT" && (
                <div className="mt-4 flex items-center gap-3">
                  {lease.signed_by_tenant ? (
                    <span className="text-sm text-emerald-700">You've signed — waiting on landlord.</span>
                  ) : (
                    <button
                      disabled={signingId === lease.id}
                      onClick={() => handleSign(lease.id)}
                      className="rounded-[6px] bg-ink px-4 py-2 text-sm text-white hover:bg-ink-soft disabled:opacity-50"
                    >
                      {signingId === lease.id ? "Signing..." : "Sign lease"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}