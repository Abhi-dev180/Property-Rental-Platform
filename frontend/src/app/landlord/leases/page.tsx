// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { leaseApi, applicationApi, LeaseWithProperty, ApplicationWithProperty } from "@/lib/api";
// import { AppShell } from "@/components/layout/AppShell";
// import { LeaseStatusBadge } from "@/components/leases/LeaseStatusBadge";

// export default function LandlordLeasesPage() {
//   const { user, loading: authLoading, logout } = useAuth();
//   const [leases, setLeases] = useState<LeaseWithProperty[] | null>(null);
//   const [approvedApps, setApprovedApps] = useState<ApplicationWithProperty[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const [creatingFor, setCreatingFor] = useState<ApplicationWithProperty | null>(null);
//   const [rentAmount, setRentAmount] = useState("");
//   const [securityDeposit, setSecurityDeposit] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [durationMonths, setDurationMonths] = useState(12);
//   const [terms, setTerms] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (authLoading || !user) return;
//     load();
//   }, [authLoading, user]);

//   async function load() {
//     setError(null);
//     try {
//       const [leaseRes, appRes] = await Promise.all([
//         leaseApi.listForLandlord(),
//         applicationApi.listForLandlord("APPROVED"),
//       ]);
//       setLeases(leaseRes.leases);
//       // only offer applications that don't already have a lease
//       const leasedApplicationIds = new Set(leaseRes.leases.map((l) => l.application_id).filter(Boolean));
//       setApprovedApps(appRes.applications.filter((a) => !leasedApplicationIds.has(a.id)));
//     } catch (err: any) {
//       setError(err.message ?? "Failed to load leases.");
//     }
//   }

//   async function handleCreate(e: React.FormEvent) {
//     e.preventDefault();
//     if (!creatingFor) return;
//     setSubmitting(true);
//     setError(null);
//     try {
//       await leaseApi.create({
//         applicationId: creatingFor.id,
//         rentAmount: Number(rentAmount),
//         securityDeposit: Number(securityDeposit),
//         leaseStartDate: startDate,
//         leaseDurationMonths: durationMonths,
//         terms: terms || undefined,
//       });
//       setCreatingFor(null);
//       setRentAmount(""); setSecurityDeposit(""); setStartDate(""); setDurationMonths(12); setTerms("");
//       await load();
//     } catch (err: any) {
//       setError(err.message ?? "Failed to create lease.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   async function handleStatusChange(id: string, status: "TERMINATED" | "CANCELLED") {
//     if (!confirm(`Mark this lease as ${status.toLowerCase()}?`)) return;
//     try {
//       await leaseApi.updateStatus(id, status);
//       await load();
//     } catch (err: any) {
//       setError(err.message ?? "Failed to update lease.");
//     }
//   }

//   if (authLoading || !user) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-canvas text-ink">
//         <p className="text-sm tracking-wide text-muted">Loading...</p>
//       </main>
//     );
//   }

//   return (
//     <AppShell user={user} onLogout={logout} eyebrow="For landlords" title="Leases">
//       <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.35rem]">
//         Leases
//       </h1>
//       <p className="mt-2 max-w-lg text-[15px] text-muted-2">
//         Create leases from approved applications, and manage lease status.
//       </p>

//       {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

//       {approvedApps.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-sm font-semibold text-ink">Approved applications awaiting a lease</h2>
//           <div className="mt-3 space-y-2">
//             {approvedApps.map((app) => (
//               <div key={app.id} className="flex items-center justify-between rounded-[8px] border border-gold/30 bg-gold-soft/30 px-4 py-3">
//                 <span className="text-sm text-ink">{app.properties?.title ?? "Property"}</span>
//                 <button
//                   onClick={() => setCreatingFor(app)}
//                   className="rounded-[6px] bg-ink px-3 py-1.5 text-sm text-white hover:bg-ink-soft"
//                 >
//                   Create lease
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {creatingFor && (
//         <form onSubmit={handleCreate} className="mt-6 rounded-[10px] border border-ink/12 bg-white p-5 space-y-4">
//           <p className="font-semibold text-ink">New lease for {creatingFor.properties?.title}</p>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium text-ink">Monthly rent</label>
//               <input required type="number" className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-ink">Security deposit</label>
//               <input required type="number" className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-ink">Start date</label>
//               <input required type="date" className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-ink">Duration (months)</label>
//               <input required type="number" min={1} max={60} className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} />
//             </div>
//           </div>
//           <div>
//             <label className="text-sm font-medium text-ink">Terms (optional)</label>
//             <textarea rows={3} className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={terms} onChange={(e) => setTerms(e.target.value)} />
//           </div>
//           <div className="flex gap-2">
//             <button type="submit" disabled={submitting} className="rounded-[6px] bg-ink px-4 py-2 text-sm text-white hover:bg-ink-soft disabled:opacity-50">
//               {submitting ? "Creating..." : "Create lease"}
//             </button>
//             <button type="button" onClick={() => setCreatingFor(null)} className="text-sm text-muted">Cancel</button>
//           </div>
//         </form>
//       )}

//       <div className="mt-10 space-y-4">
//         {leases === null ? (
//           <p className="text-sm text-muted">Loading leases...</p>
//         ) : leases.length === 0 ? (
//           <p className="text-sm text-muted">No leases created yet.</p>
//         ) : (
//           leases.map((lease) => (
//             <div key={lease.id} className="rounded-[10px] border border-ink/8 bg-white p-5">
//               <div className="flex flex-wrap items-start justify-between gap-3">
//                 <div>
//                   <p className="font-semibold text-ink">{lease.properties?.title ?? "Property"}</p>
//                   {lease.users && <p className="text-sm text-muted">Tenant: {lease.users.full_name} · {lease.users.email}</p>}
//                 </div>
//                 <LeaseStatusBadge status={lease.status} />
//               </div>

//               <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
//                 <div><p className="text-muted text-xs">Rent</p><p className="text-ink font-medium">${lease.rent_amount.toLocaleString()}/mo</p></div>
//                 <div><p className="text-muted text-xs">Deposit</p><p className="text-ink font-medium">${lease.security_deposit.toLocaleString()}</p></div>
//                 <div><p className="text-muted text-xs">Start</p><p className="text-ink font-medium">{lease.lease_start_date}</p></div>
//                 <div><p className="text-muted text-xs">End</p><p className="text-ink font-medium">{lease.lease_end_date}</p></div>
//               </div>

//               {lease.status === "DRAFT" && (
//                 <button onClick={() => handleStatusChange(lease.id, "CANCELLED")} className="mt-4 rounded-[6px] border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">
//                   Cancel draft
//                 </button>
//               )}
//               {lease.status === "ACTIVE" && (
//                 <button onClick={() => handleStatusChange(lease.id, "TERMINATED")} className="mt-4 rounded-[6px] border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">
//                   Terminate lease
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </AppShell>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { leaseApi, applicationApi, LeaseWithProperty, ApplicationWithProperty } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { LeaseStatusBadge } from "@/components/leases/LeaseStatusBadge";

export default function LandlordLeasesPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [leases, setLeases] = useState<LeaseWithProperty[] | null>(null);
  const [approvedApps, setApprovedApps] = useState<ApplicationWithProperty[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationMonths, setDurationMonths] = useState(12);
  const [terms, setTerms] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role !== "LANDLORD") { router.replace("/leases"); return; }
    load();
  }, [authLoading, user]);

  async function load() {
    setError(null);
    try {
      const [leaseRes, appRes] = await Promise.all([
        leaseApi.listForLandlord(),
        applicationApi.listForLandlord("APPROVED"),
      ]);
      setLeases(leaseRes.leases);
      setApprovedApps(appRes.applications); // show ALL approved apps, not just unleased ones
    } catch (err: any) {
      setError(err.message ?? "Failed to load leases.");
      setLeases([]);
    }
  }

  const leasedApplicationIds = new Set((leases ?? []).map((l) => l.application_id).filter(Boolean));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAppId) return;
    setSubmitting(true);
    setError(null);
    try {
      await leaseApi.create({
        applicationId: selectedAppId,
        rentAmount: Number(rentAmount),
        securityDeposit: Number(securityDeposit),
        leaseStartDate: startDate,
        leaseDurationMonths: durationMonths,
        terms: terms || undefined,
      });
      setShowForm(false);
      setSelectedAppId(""); setRentAmount(""); setSecurityDeposit(""); setStartDate(""); setDurationMonths(12); setTerms("");
      await load();
    } catch (err: any) {
      setError(err.message ?? "Failed to create lease.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, status: "TERMINATED" | "CANCELLED") {
    if (!confirm(`Mark this lease as ${status.toLowerCase()}?`)) return;
    try {
      await leaseApi.updateStatus(id, status);
      await load();
    } catch (err: any) {
      setError(err.message ?? "Failed to update lease.");
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
    <AppShell user={user} onLogout={logout} eyebrow="For landlords" title="Leases">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.35rem]">Leases</h1>
          <p className="mt-2 max-w-lg text-[15px] text-muted-2">Create leases from approved applications, and manage lease status.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-[6px] bg-ink px-4 py-2 text-sm text-white hover:bg-ink-soft"
        >
          + Create lease
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {showForm && (
        <div className="mt-6 rounded-[10px] border border-ink/12 bg-white p-5">
          {approvedApps.length === 0 ? (
            <p className="text-sm text-muted">
              You don't have any approved applications yet. Approve a tenant's application first from the{" "}
              <a href="/landlord/applications" className="text-primary underline">Applications</a> page.
            </p>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-ink">Approved application</label>
                <select
                  required
                  className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary"
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                >
                  <option value="">Select an application...</option>
                  {approvedApps.map((app) => (
                    <option key={app.id} value={app.id} disabled={leasedApplicationIds.has(app.id)}>
                      {app.properties?.title ?? "Property"} — {app.users?.full_name ?? app.users?.email ?? "Tenant"}
                      {leasedApplicationIds.has(app.id) ? " (already has a lease)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-ink">Monthly rent</label>
                  <input required type="number" className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Security deposit</label>
                  <input required type="number" className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Start date</label>
                  <input required type="date" className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Duration (months)</label>
                  <input required type="number" min={1} max={60} className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-ink">Terms (optional)</label>
                <textarea rows={3} className="mt-1 w-full rounded-[6px] border border-ink/12 px-3 py-2 text-sm outline-none focus:border-primary" value={terms} onChange={(e) => setTerms(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={submitting || !selectedAppId} className="rounded-[6px] bg-ink px-4 py-2 text-sm text-white hover:bg-ink-soft disabled:opacity-50">
                  {submitting ? "Creating..." : "Create lease"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="mt-10 space-y-4">
        {leases === null ? (
          <p className="text-sm text-muted">Loading leases...</p>
        ) : leases.length === 0 ? (
          <p className="text-sm text-muted">No leases created yet.</p>
        ) : (
          leases.map((lease) => (
            <div key={lease.id} className="rounded-[10px] border border-ink/8 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{lease.properties?.title ?? "Property"}</p>
                  {lease.users && <p className="text-sm text-muted">Tenant: {lease.users.full_name} · {lease.users.email}</p>}
                </div>
                <LeaseStatusBadge status={lease.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-muted text-xs">Rent</p><p className="text-ink font-medium">${lease.rent_amount.toLocaleString()}/mo</p></div>
                <div><p className="text-muted text-xs">Deposit</p><p className="text-ink font-medium">${lease.security_deposit.toLocaleString()}</p></div>
                <div><p className="text-muted text-xs">Start</p><p className="text-ink font-medium">{lease.lease_start_date}</p></div>
                <div><p className="text-muted text-xs">End</p><p className="text-ink font-medium">{lease.lease_end_date}</p></div>
              </div>

              {lease.status === "DRAFT" && (
                <button onClick={() => handleStatusChange(lease.id, "CANCELLED")} className="mt-4 rounded-[6px] border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">
                  Cancel draft
                </button>
              )}
              {lease.status === "ACTIVE" && (
                <button onClick={() => handleStatusChange(lease.id, "TERMINATED")} className="mt-4 rounded-[6px] border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">
                  Terminate lease
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}