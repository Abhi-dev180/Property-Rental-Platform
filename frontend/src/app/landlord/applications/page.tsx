// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Loader2, Inbox } from "lucide-react";
// import { applicationApi, ApplicationStatus, ApplicationWithProperty } from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { ApplicationCard } from "@/components/applications/ApplicationCard";

// const TABS: { value: ApplicationStatus | "ALL"; label: string }[] = [
//   { value: "PENDING",   label: "Pending" },
//   { value: "APPROVED",  label: "Approved" },
//   { value: "REJECTED",  label: "Rejected" },
//   { value: "WITHDRAWN", label: "Withdrawn" },
//   { value: "ALL",       label: "All" },
// ];

// export default function LandlordApplicationsPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [tab, setTab] = useState<ApplicationStatus | "ALL">("PENDING");
//   const [apps, setApps] = useState<ApplicationWithProperty[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!user) { router.push("/login?redirect=/landlord/applications"); return; }
//     if (user.role !== "LANDLORD" && user.role !== "ADMIN") { router.push("/"); return; }
//   }, [user, authLoading, router]);

//   useEffect(() => {
//     if (authLoading || !user) return;
//     setApps(null);
//     applicationApi
//       .listForLandlord(tab === "ALL" ? undefined : tab)
//       .then((r) => setApps(r.applications))
//       .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."));
//   }, [tab, user, authLoading]);

//   return (
//     <main className="mx-auto max-w-4xl px-4 py-8">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-[#0b1220]">Applications</h1>
//         <p className="mt-1 text-sm text-slate-500">Review applications for your properties.</p>
//       </div>

//       <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200">
//         {TABS.map((t) => (
//           <button
//             key={t.value}
//             onClick={() => setTab(t.value)}
//             className={`-mb-px rounded-t-[6px] border-b-2 px-4 py-2 text-sm font-medium transition ${
//               tab === t.value
//                 ? "border-[#2455eb] text-[#2455eb]"
//                 : "border-transparent text-slate-500 hover:text-[#0b1220]"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {error && (
//         <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {apps === null && (
//         <div className="flex items-center gap-2 text-slate-500">
//           <Loader2 className="h-4 w-4 animate-spin" /> Loading…
//         </div>
//       )}

//       {apps && apps.length === 0 && (
//         <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-slate-300 bg-white py-16 text-center">
//           <Inbox className="mb-3 h-10 w-10 text-slate-300" />
//           <p className="text-slate-600">No {tab !== "ALL" ? tab.toLowerCase() : ""} applications.</p>
//         </div>
//       )}

//       {apps && apps.length > 0 && (
//         <div className="space-y-3">
//           {apps.map((a) => (
//             <ApplicationCard key={a.id} application={a} hrefPrefix="/applications" showApplicant />
//           ))}
//         </div>
//       )}

//       <div className="mt-8 text-center">
//         <Link href="/dashboard" className="text-sm text-[#2455eb] hover:underline">
//           ← Back to dashboard
//         </Link>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Inbox,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";
import {
  applicationApi,
  ApplicationStatus,
  ApplicationWithProperty,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { StatusBadge } from "@/components/ui/StatusBadge";

type TabValue = ApplicationStatus | "ALL";

const TABS: { value: TabValue; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
  { value: "ALL", label: "All" },
];

const STRIPE: Record<ApplicationStatus, string> = {
  PENDING: "bg-[#c9972b]",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-slate-300",
};

function firstImage(images: unknown): string | null {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") {
    return images[0];
  }
  return null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function initials(name: string | null, email: string): string {
  const src = (name ?? email).trim();
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function LandlordApplicationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [tab, setTab] = useState<TabValue>("PENDING");
  const [apps, setApps] = useState<ApplicationWithProperty[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  const [rejectingApp, setRejectingApp] = useState<ApplicationWithProperty | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  async function load(showSpinner = true) {
    if (showSpinner) setApps(null);
    else setRefreshing(true);
    setError(null);
    try {
      const r = await applicationApi.listForLandlord();
      setApps(r.applications);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applications.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/landlord/applications");
      return;
    }
    if (user.role !== "LANDLORD" && user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const counts = useMemo(() => {
    const base: Record<TabValue, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
      ALL: 0,
    };
    if (!apps) return base;
    for (const a of apps) {
      base[a.status] += 1;
      base.ALL += 1;
    }
    return base;
  }, [apps]);

  const visible = useMemo(() => {
    if (!apps) return null;
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => tab === "ALL" || a.status === tab)
      .filter((a) => {
        if (!q) return true;
        const hay = [
          a.properties?.title,
          a.properties?.city,
          a.users?.full_name,
          a.users?.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [apps, tab, query]);

  async function approve(app: ApplicationWithProperty) {
    if (
      !confirm(
        "Approve this application? The property will be marked as RENTED and other pending applications for it will be auto-rejected."
      )
    )
      return;
    setActingId(app.id);
    try {
      await applicationApi.review(app.id, { status: "APPROVED" });
      await load(false); // refetch — approving has side effects on other apps
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to approve.");
    } finally {
      setActingId(null);
    }
  }

  async function confirmReject(reason: string) {
    if (!rejectingApp) return;
    const app = rejectingApp;
    setActingId(app.id);
    try {
      await applicationApi.review(app.id, {
        status: "REJECTED",
        rejectionReason: reason,
      });
      setRejectingApp(null);
      await load(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to reject.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9972b]">
            For landlords
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#0b1220]">
                Applications
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Review and respond to rental applications across your listings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {counts.PENDING > 0 && (
                <div className="flex items-center gap-2 rounded-[8px] border border-[#c9972b]/30 bg-[#c9972b]/8 px-3 py-2 text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9972b] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c9972b]" />
                  </span>
                  <span className="font-medium text-[#7a5a12]">
                    {counts.PENDING} awaiting review
                  </span>
                </div>
              )}
              <button
                onClick={() => load(false)}
                disabled={refreshing}
                aria-label="Refresh"
                className="rounded-[8px] border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-[#0b1220] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-16">
        {/* ─── Tabs + search ──────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 -mx-4 mb-5 border-b border-slate-200 bg-slate-50/80 px-4 backdrop-blur">
          <div className="flex flex-col gap-3 pt-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {TABS.map((t) => {
                const active = tab === t.value;
                const n = counts[t.value];
                return (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`inline-flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[#0b1220] text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {t.label}
                    <span
                      className={`min-w-[1.4rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/80 text-slate-600"
                      }`}
                    >
                      {n}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search property or applicant…"
                className="w-full rounded-[8px] border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-[#0b1220] placeholder:text-slate-400 focus:border-[#2455eb] focus:outline-none focus:ring-1 focus:ring-[#2455eb]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Error ──────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ─── Loading ────────────────────────────────────────────────── */}
        {visible === null && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-[10px] border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* ─── Empty ──────────────────────────────────────────────────── */}
        {visible && visible.length === 0 && (
          <EmptyState tab={tab} query={query} onClear={() => setQuery("")} />
        )}

        {/* ─── List ───────────────────────────────────────────────────── */}
        {visible && visible.length > 0 && (
          <div className="space-y-3">
            {visible.map((a) => (
              <ApplicationRow
                key={a.id}
                app={a}
                acting={actingId === a.id}
                onApprove={() => approve(a)}
                onReject={() => setRejectingApp(a)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-[#2455eb] hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>

      {rejectingApp && (
        <RejectDialog
          applicant={
            rejectingApp.users?.full_name ?? rejectingApp.users?.email ?? "this applicant"
          }
          busy={actingId === rejectingApp.id}
          onCancel={() => setRejectingApp(null)}
          onConfirm={confirmReject}
        />
      )}
    </main>
  );
}

/* ─── Row ────────────────────────────────────────────────────────────── */

function ApplicationRow({
  app,
  acting,
  onApprove,
  onReject,
}: {
  app: ApplicationWithProperty;
  acting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const img = firstImage(app.properties?.images);
  const applicantName = app.users?.full_name ?? app.users?.email ?? "Applicant";
  const inits = initials(app.users?.full_name ?? null, app.users?.email ?? "");
  const canAct = app.status === "PENDING";

  return (
    <article className="group relative overflow-hidden rounded-[10px] border border-slate-200 bg-white transition hover:border-[#2455eb]/40 hover:shadow-[0_10px_30px_-16px_rgba(11,18,32,0.25)]">
      {/* status stripe */}
      <span
        className={`absolute inset-y-0 left-0 w-1 ${STRIPE[app.status]}`}
        aria-hidden
      />

      <div className="flex flex-col gap-4 pl-4 pr-4 py-4 sm:flex-row sm:items-center sm:pl-5">
        {/* left: property + applicant */}
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-[6px] bg-slate-100">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-wide text-slate-400">
                No photo
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-[#0b1220]">
                  {app.properties?.title ?? "Property"}
                </h3>
                {app.properties?.city && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {app.properties.city}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <StatusBadge status={app.status} />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2455eb]/10 text-[10px] font-semibold text-[#2455eb]">
                {inits}
              </span>
              <p className="min-w-0 truncate text-xs">
                <span className="font-medium text-[#0b1220]">
                  {applicantName}
                </span>
                {app.users?.email && app.users.full_name && (
                  <span className="text-slate-400"> · {app.users.email}</span>
                )}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Meta
                icon={Calendar}
                label={`Move-in ${new Date(
                  app.desired_move_in_date
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
              />
              <Meta icon={Briefcase} label={`${app.lease_duration_months} mo lease`} />
              {app.monthly_income != null && (
                <Meta
                  icon={DollarSign}
                  label={`${formatMoney(app.monthly_income)}/mo income`}
                />
              )}
            </div>

            <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
              Applied {timeAgo(app.created_at)}
            </p>
          </div>
        </div>

        {/* right: actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:w-40 sm:flex-col sm:items-stretch sm:border-l sm:border-slate-100 sm:pl-4">
          {canAct && (
            <>
              <button
                onClick={onApprove}
                disabled={acting}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:flex-none"
              >
                {acting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                Approve
              </button>
              <button
                onClick={onReject}
                disabled={acting}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 sm:flex-none"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </>
          )}
          <Link
            href={`/applications/${app.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0b1220] transition hover:border-[#2455eb]/40 hover:text-[#2455eb] sm:flex-none"
          >
            Review
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Meta({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[6px] bg-slate-100/80 px-2 py-1 text-[11px] font-medium text-slate-600">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────── */

function EmptyState({
  tab,
  query,
  onClear,
}: {
  tab: TabValue;
  query: string;
  onClear: () => void;
}) {
  const searching = query.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Inbox className="h-6 w-6 text-slate-400" />
      </div>
      <p className="mt-4 font-medium text-[#0b1220]">
        {searching
          ? "No applications match your search"
          : tab === "ALL"
          ? "No applications yet"
          : `No ${tab.toLowerCase()} applications`}
      </p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {searching
          ? "Try a different name, email, or property."
          : tab === "PENDING"
          ? "You're all caught up — nothing waiting on your review."
          : "Applications will appear here as tenants submit them."}
      </p>
      {searching && (
        <button
          onClick={onClear}
          className="mt-4 rounded-[8px] border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

/* ─── Reject dialog ──────────────────────────────────────────────────── */

function RejectDialog({
  applicant,
  busy,
  onCancel,
  onConfirm,
}: {
  applicant: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function submit() {
    if (!reason.trim()) {
      setErr("Please provide a reason.");
      return;
    }
    onConfirm(reason.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220]/60 p-4"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-[10px] bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#0b1220]">
          Reject application
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Letting <span className="font-medium text-[#0b1220]">{applicant}</span> know
          why helps them improve future applications.
        </p>
        <textarea
          rows={4}
          maxLength={500}
          autoFocus
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErr(null);
          }}
          placeholder="e.g. The unit has already been rented to another applicant."
          className="mt-4 w-full rounded-[8px] border border-slate-300 px-3 py-2 text-sm focus:border-[#2455eb] focus:outline-none focus:ring-1 focus:ring-[#2455eb]"
        />
        {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-[8px] border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm rejection
          </button>
        </div>
      </div>
    </div>
  );
}