// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { AppShell } from "@/components/layout/AppShell";
// import type { ReactNode } from "react";

// type RoleCopy = {
//   eyebrow: string;
//   title: string;
//   body: string;
//   icon: ReactNode;
// };

// const ROLE_COPY: Record<string, RoleCopy> = {
//   TENANT: {
//     eyebrow: "For tenants",
//     title: "Your rentals, in one place",
//     body: "Active leases, applications you have submitted, rent payments, and maintenance requests will live here soon.",
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//         <path d="M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   LANDLORD: {
//     eyebrow: "For landlords",
//     title: "Your properties, in one place",
//     body: "Listings, applications to review, rent collection, and maintenance tracking will live here soon.",
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//         <rect x="4" y="7" width="7" height="13" stroke="currentColor" strokeWidth="1.6" />
//         <rect x="13" y="3" width="7" height="17" stroke="currentColor" strokeWidth="1.6" />
//         <path d="M6.5 10h2M6.5 13h2M6.5 16h2M15.5 6h2M15.5 9h2M15.5 12h2M15.5 15h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
//       </svg>
//     ),
//   },
//   ADMIN: {
//     eyebrow: "For admins",
//     title: "The platform, in one place",
//     body: "Users, landlords, properties, reports, and verification requests will live here soon.",
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//         <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
//         <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
// };

// const STAT_BARS = [62, 74, 58, 81, 69, 90, 77];

// export default function DashboardPage() {
//   const { user, loading, logout } = useAuth();

//   if (loading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-canvas text-ink">
//         <p className="text-sm tracking-wide text-muted">Loading your dashboard...</p>
//       </main>
//     );
//   }

//   if (!user) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-center text-ink">
//         <p className="max-w-sm text-muted">
//           Your session expired. Please log in again to continue.
//         </p>
//       </main>
//     );
//   }

//   const copy = ROLE_COPY[user.role] ?? ROLE_COPY.TENANT;
//   const firstName = user.full_name.split(" ")[0];

//   return (
//     <AppShell user={user} onLogout={logout} eyebrow={copy.eyebrow} title="Overview">
//       <div className="flex flex-wrap items-end justify-between gap-4">
//         <div>
//           <p className="text-sm font-medium text-gold">{copy.eyebrow}</p>
//           <h1 className="mt-1 text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.35rem]">
//             Welcome back, {firstName}
//           </h1>
//         </div>
//         {user.is_verified && (
//           <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//               <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             Verified account
//           </span>
//         )}
//       </div>

//       <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
//         <section className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-8 shadow-[0_1px_2px_rgba(11,18,32,0.04)] lg:col-span-2">
//           <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary-soft text-primary">
//             {copy.icon}
//           </div>
//           <h2 className="text-xl font-semibold text-ink">{copy.title}</h2>
//           <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-muted-2">{copy.body}</p>

//           {/* Decorative activity chart, matches the app's data-forward feel */}
//           <div className="mt-8 flex h-24 items-end gap-2">
//             {STAT_BARS.map((h, i) => (
//               <div key={i} className="flex-1 rounded-t-[3px] bg-primary/15" style={{ height: `${h}%` }}>
//                 <div
//                   className="h-2 rounded-t-[3px] bg-gradient-to-t from-primary to-gold"
//                   style={{ opacity: i === STAT_BARS.length - 1 ? 1 : 0 }}
//                 />
//               </div>
//             ))}
//           </div>
//           <p className="mt-3 text-xs text-muted">Activity preview - live data arrives with upcoming features.</p>
//         </section>

//         <div className="flex flex-col gap-5">
//           <section className="rounded-2xl border border-ink/8 bg-white p-6">
//             <h3 className="text-sm font-medium text-muted">Account</h3>
//             <p className="mt-2 text-[15px] text-ink">{user.email}</p>
//             <p className="mt-2 inline-flex items-center gap-1.5 text-sm">
//               <span className={`h-1.5 w-1.5 rounded-full ${user.is_verified ? "bg-success" : "bg-muted/40"}`} />
//               <span className="text-muted">{user.is_verified ? "Verified" : "Not yet verified"}</span>
//             </p>
//             <a
//               href="/dashboard/profile"
//               className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
//             >
//               Edit profile
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//                 <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </a>
//           </section>

//           <section className="rounded-2xl border border-ink/8 bg-white p-6">
//             <h3 className="text-sm font-medium text-muted">What&apos;s next</h3>
//             <p className="mt-2 text-[15px] leading-relaxed text-muted-2">
//               {user.role === "LANDLORD"
//                 ? "Add your properties and applications will live here next."
//                 : "Search listings and submit applications will live here next."}
//             </p>
//           </section>
//         </div>
//       </div>
//     </AppShell>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileText,
  Heart,
  Inbox,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { applicationApi } from "@/lib/api";

/* ─── Role configuration ─────────────────────────────────────────────── */

type Role = "TENANT" | "LANDLORD" | "ADMIN";

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tone: "primary" | "gold" | "neutral";
};

type Stat = {
  key: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

type ChecklistItem = { label: string; done: boolean; href?: string };

type RoleConfig = {
  eyebrow: string;
  hero: string;
  primaryCta: { label: string; href: string; description: string; icon: LucideIcon };
  quickActions: QuickAction[];
  stats: Stat[];
  checklist: ChecklistItem[];
};

const CONFIG: Record<Role, RoleConfig> = {
  TENANT: {
    eyebrow: "For tenants",
    hero: "Find a place that feels like home — track every application in one place.",
    primaryCta: {
      label: "Browse properties",
      href: "/properties",
      description: "Search available rentals, filter by city, price, and distance.",
      icon: Search,
    },
    quickActions: [
      { label: "My applications", description: "Track status & documents", href: "/applications", icon: FileText, tone: "primary" },
      { label: "Saved homes", description: "Your favorited listings", href: "/favorites", icon: Heart, tone: "gold" },
      { label: "Edit profile", description: "Photo, contact & bio", href: "/dashboard/profile", icon: UserCircle2, tone: "neutral" },
    ],
    stats: [
      { key: "apps", label: "Active applications", hint: "Awaiting landlord review", icon: FileText },
      { key: "saved", label: "Saved properties", hint: "Favorited listings", icon: Heart },
      { key: "payments", label: "Upcoming payments", hint: "Arrives with leases", icon: TrendingUp },
      { key: "requests", label: "Open requests", hint: "Maintenance", icon: Sparkles },
    ],
    checklist: [
      { label: "Create your account", done: true },
      { label: "Complete your profile", done: false, href: "/dashboard/profile" },
      { label: "Browse available properties", done: false, href: "/properties" },
      { label: "Submit your first application", done: false, href: "/properties" },
    ],
  },
  LANDLORD: {
    eyebrow: "For landlords",
    hero: "Everything about your listings, applications, and tenants — all in one place.",
    primaryCta: {
      label: "Manage properties",
      href: "/dashboard/properties",
      description: "Add, edit, or archive your listings. Photos, pricing, availability.",
      icon: Building2,
    },
    quickActions: [
      { label: "Applications", description: "Review new requests", href: "/landlord/applications", icon: Inbox, tone: "primary" },
      { label: "Add a property", description: "List a new rental", href: "/dashboard/properties/new", icon: Plus, tone: "gold" },
      { label: "Edit profile", description: "Account & verification", href: "/dashboard/profile", icon: UserCircle2, tone: "neutral" },
    ],
    stats: [
      { key: "listings", label: "Active listings", hint: "Published properties", icon: Building2 },
      { key: "pending", label: "Pending applications", hint: "Awaiting your review", icon: Inbox },
      { key: "revenue", label: "Monthly revenue", hint: "Arrives with leases", icon: TrendingUp },
      { key: "occupancy", label: "Occupancy", hint: "Arrives with leases", icon: Sparkles },
    ],
    checklist: [
      { label: "Create your account", done: true },
      { label: "Complete landlord verification", done: false, href: "/dashboard/profile" },
      { label: "Add your first property", done: false, href: "/dashboard/properties/new" },
      { label: "Review your first application", done: false, href: "/landlord/applications" },
    ],
  },
  ADMIN: {
    eyebrow: "For admins",
    hero: "Platform health, verification queue, and everything in between.",
    primaryCta: {
      label: "Open admin tools",
      href: "/admin",
      description: "Users, landlord verifications, listings, and flagged content.",
      icon: ShieldCheck,
    },
    quickActions: [
      { label: "Verifications", description: "Review landlord requests", href: "/admin/verifications", icon: ShieldCheck, tone: "primary" },
      { label: "Users", description: "Manage accounts", href: "/admin/users", icon: UserCircle2, tone: "gold" },
      { label: "Reports", description: "Platform activity", href: "/admin/reports", icon: TrendingUp, tone: "neutral" },
    ],
    stats: [
      { key: "users", label: "Total users", hint: "Tenants & landlords", icon: UserCircle2 },
      { key: "verif", label: "Pending verifications", hint: "Awaiting review", icon: ShieldCheck },
      { key: "listings", label: "Active listings", hint: "Across the platform", icon: Building2 },
      { key: "reports", label: "Open reports", hint: "Flagged content", icon: FileText },
    ],
    checklist: [
      { label: "Review verification queue", done: false, href: "/admin/verifications" },
      { label: "Moderate reported listings", done: false, href: "/admin/reports" },
      { label: "Audit platform activity", done: false, href: "/admin/reports" },
    ],
  },
};

/* ─── Helpers ────────────────────────────────────────────────────────── */

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function initialsOf(name: string | null | undefined, fallback: string): string {
  const src = (name ?? fallback).trim();
  const parts = src.split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [liveCount, setLiveCount] = useState<{ key: string; value: number } | null>(null);

  // Best-effort live count for the "applications" stat. Fails silently.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const pull = async () => {
      try {
        if (user.role === "LANDLORD" || user.role === "ADMIN") {
          const r = await applicationApi.listForLandlord("PENDING");
          if (!cancelled) setLiveCount({ key: "pending", value: r.applications.length });
        } else if (user.role === "TENANT") {
          const r = await applicationApi.listMine();
          const active = r.applications.filter((a) => a.status === "PENDING").length;
          if (!cancelled) setLiveCount({ key: "apps", value: active });
        }
      } catch {
        /* silent — dashboard still renders */
      }
    };

    pull();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas text-ink">
        <p className="text-sm tracking-wide text-muted">Loading your dashboard…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas px-6 text-center text-ink">
        <p className="max-w-sm text-muted">
          Your session expired. Please log in again to continue.
        </p>
      </main>
    );
  }

  const copy = CONFIG[(user.role as Role) ?? "TENANT"] ?? CONFIG.TENANT;
  const firstName = (user.full_name ?? user.email ?? "there").split(" ")[0];
  const initials = initialsOf(user.full_name, user.email ?? "?");

  return (
    <AppShell user={user} onLogout={logout} eyebrow={copy.eyebrow} title="Overview">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-ink">
        {/* blueprint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* gold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#c9972b]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#2455eb]/20 blur-3xl"
        />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9972b]">
                {copy.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl">
                {greeting()}, {firstName}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60 sm:text-[15px]">
                {copy.hero}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#c9972b]/15 ring-2 ring-white/10">
                <span className="text-sm font-semibold tracking-wide text-[#c9972b]">
                  {initials}
                </span>
              </div>
              {user.is_verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={copy.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#2455eb] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-12px_rgba(36,85,235,0.9)] transition hover:bg-[#1c46c9]"
            >
              <copy.primaryCta.icon className="h-4 w-4" />
              {copy.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              Edit profile
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stat strip ───────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {copy.stats.map((s) => (
          <StatCard
            key={s.key}
            stat={s}
            liveValue={liveCount?.key === s.key ? liveCount.value : undefined}
          />
        ))}
      </div>

      {/* ─── Main grid ────────────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column (2/3) */}
        <div className="space-y-5 lg:col-span-2">
          {/* Primary action card */}
          <section className="relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#2455eb]/5 blur-2xl"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#2455eb]/10 text-[#2455eb]">
                  <copy.primaryCta.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
                  {copy.primaryCta.label}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-2">
                  {copy.primaryCta.description}
                </p>
              </div>
              <Link
                href={copy.primaryCta.href}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-[8px] bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 sm:self-auto"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Quick actions */}
          <section className="rounded-2xl border border-ink/8 bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight text-ink">
                Jump back in
              </h2>
              <span className="text-xs text-muted">Your shortcuts</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {copy.quickActions.map((a) => (
                <QuickActionCard key={a.href} action={a} />
              ))}
            </div>
          </section>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-5">
          {/* Account */}
          <section className="rounded-2xl border border-ink/8 bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Account
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2455eb]/10 text-sm font-semibold text-[#2455eb]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {user.full_name ?? "—"}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.is_verified ? "bg-emerald-500" : "bg-muted/40"
                }`}
              />
              <span className="text-muted">
                {user.is_verified ? "Verified account" : "Not yet verified"}
              </span>
            </p>
            <Link
              href="/dashboard/profile"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#c9972b] transition hover:gap-1.5"
            >
              Edit profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* Getting started checklist */}
          <section className="rounded-2xl border border-ink/8 bg-white p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Getting started
              </h3>
              <span className="text-xs text-muted">
                {copy.checklist.filter((c) => c.done).length}/{copy.checklist.length}
              </span>
            </div>
            <div className="space-y-1">
              {copy.checklist.map((item, i) => (
                <ChecklistRow key={item.label} item={item} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function StatCard({ stat, liveValue }: { stat: Stat; liveValue?: number }) {
  const Icon = stat.icon;
  const hasLive = liveValue !== undefined;
  const display = hasLive ? liveValue.toLocaleString() : "—";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-4 transition hover:border-[#2455eb]/30 hover:shadow-[0_10px_28px_-16px_rgba(36,85,235,0.35)] sm:p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#2455eb]/8 text-[#2455eb]">
          <Icon className="h-4 w-4" />
        </div>
        {!hasLive && (
          <span className="rounded-full bg-ink/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            Soon
          </span>
        )}
        {hasLive && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
            Live
          </span>
        )}
      </div>
      <p className="mt-4 text-[13px] font-medium text-muted">{stat.label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">
        {display}
      </p>
      <p className="mt-1 text-xs text-muted-2">{stat.hint}</p>
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  const toneClasses: Record<QuickAction["tone"], string> = {
    primary: "bg-[#2455eb]/10 text-[#2455eb]",
    gold: "bg-[#c9972b]/12 text-[#c9972b]",
    neutral: "bg-ink/[0.05] text-ink",
  };

  return (
    <Link
      href={action.href}
      className="group flex flex-col gap-3 rounded-[10px] border border-ink/8 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#2455eb]/30 hover:shadow-[0_10px_24px_-14px_rgba(11,18,32,0.25)]"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${toneClasses[action.tone]}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-medium text-ink">
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">
          {action.description}
        </span>
      </span>
    </Link>
  );
}

function ChecklistRow({ item, index }: { item: ChecklistItem; index: number }) {
  const body = (
    <div className="flex items-center gap-3 py-2.5">
      {item.done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/15 text-[9px] font-semibold text-muted-2">
          {index + 1}
        </span>
      )}
      <span
        className={
          item.done
            ? "flex-1 text-sm text-muted line-through"
            : "flex-1 text-sm text-ink"
        }
      >
        {item.label}
      </span>
      {!item.done && item.href && (
        <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </div>
  );

  if (!item.done && item.href) {
    return (
      <Link
        href={item.href}
        className="group -mx-2 block rounded-[8px] px-2 transition hover:bg-ink/[0.03]"
      >
        {body}
      </Link>
    );
  }
  return body;
}
