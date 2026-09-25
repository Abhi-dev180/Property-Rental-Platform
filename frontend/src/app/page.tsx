import Link from "next/link";
import { BlueprintScene } from "@/components/three/BlueprintScene";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const AUDIENCES = [
  {
    label: "Tenants",
    copy: "Search verified listings, apply in minutes, and pay rent without chasing anyone down.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Landlords",
    copy: "List properties, screen applicants, and track rent and maintenance in one dashboard.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="7" width="7" height="13" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13" y="3" width="7" height="17" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 10h2M6.5 13h2M6.5 16h2M15.5 6h2M15.5 9h2M15.5 12h2M15.5 15h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Admins",
    copy: "Oversee every user, property, and report across the platform from a single view.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    copy: "Sign up as a tenant to search, or a landlord to list. Takes under a minute.",
  },
  {
    number: "02",
    title: "Find your match",
    copy: "Tenants browse and apply. Landlords review applications and approve leases.",
  },
  {
    number: "03",
    title: "Manage it all in one place",
    copy: "Rent, maintenance, and messages stay organized long after move-in day.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-ink/8 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-ink/80 transition-colors hover:text-ink">
              Log in
            </Link>
            <Link href="/register">
              <Button variant="primary" className="px-4 py-2">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/8">
        <div className="bp-grid pointer-events-none absolute inset-0 opacity-70" />
        <BlueprintScene variant="hero" className="opacity-90" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft/50 px-3 py-1 text-xs font-medium text-[#8a6a1c]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Trusted by tenants and landlords alike
            </span>
            <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[3.25rem]">
              Renting shouldn&apos;t feel like <span className="gold-text">guesswork</span>.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-2">
              One platform for finding a place, managing a property, or running the
              whole thing - built for tenants, landlords, and admins alike.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button variant="primary">Create your account</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
            </div>
          </div>

          {/* Listing card mock, in the new palette */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[14px] border border-ink/10 bg-white/40" />
            <div className="relative overflow-hidden rounded-[14px] border border-ink/8 bg-white shadow-[0_30px_70px_-30px_rgba(11,18,32,0.35)]">
              <div className="relative flex h-40 items-center justify-center bg-ink">
                <div className="grid grid-cols-6 gap-1 opacity-30">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="h-2 w-2 rounded-[1px] bg-gold" />
                  ))}
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink">
                  For rent
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-ink">Maple Street Loft</p>
                    <p className="text-sm text-muted">2 bed &middot; 1 bath</p>
                  </div>
                  <p className="text-[15px] font-semibold text-primary">
                    $1,450<span className="text-xs font-normal text-muted">/mo</span>
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12.5l5 5L20 7" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-xs text-muted">Verified landlord</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience strip */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-medium text-gold">Built for everyone in the process</p>
        <div className="mt-8 grid grid-cols-1 divide-y divide-ink/10 border-t border-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {AUDIENCES.map((a) => (
            <div key={a.label} className="group px-1 py-8 transition-colors sm:px-6 sm:py-0 sm:pt-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary-soft text-primary transition-transform group-hover:scale-105">
                {a.icon}
              </div>
              <h3 className="text-[15px] font-semibold text-ink">{a.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-2">{a.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden border-y border-ink/8 bg-ink text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium text-gold">How it works</p>
          <h2 className="mt-2 max-w-lg text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">
            Three steps from search to move-in.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.number}>
                <span className="text-4xl font-semibold text-gold/40">{s.number}</span>
                <h3 className="mt-3 text-[15px] font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-2">
          Create a free account in under a minute - no credit card required.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href="/register">
            <Button variant="gold" className="px-6 py-3">
              Create your account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink/8">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted">
          RentEase - a property rental &amp; management platform.
        </div>
      </footer>
    </div>
  );
}
