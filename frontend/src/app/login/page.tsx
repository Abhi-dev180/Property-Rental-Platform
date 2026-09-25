"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BlueprintScene } from "@/components/three/BlueprintScene";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message ?? "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-60" />
      <BlueprintScene variant="ambient" />

      <div className="absolute left-6 top-6 z-10">
        <Logo />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-ink/8 bg-white/90 p-8 shadow-[0_30px_80px_-30px_rgba(11,18,32,0.25)] backdrop-blur-sm sm:p-10">
        <h2 className="text-2xl font-semibold tracking-[-0.01em] text-ink">Welcome back</h2>
        <p className="mt-1.5 text-sm text-muted">Log in to your account to continue.</p>

        {/* Segmented tab affordance - Sign up routes to /register */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-ink/5 p-1">
          <span className="rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-ink shadow-sm">
            Login
          </span>
          <Link
            href="/register"
            className="rounded-full px-4 py-2 text-center text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            Sign up
          </Link>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
            <div className="flex items-center gap-2.5 rounded-[6px] border border-ink/15 px-3.5 py-2.5 transition-colors focus-within:border-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted">
                <path d="M3 6.5L12 13L21 6.5M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted/60"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-ink">Password</label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-2.5 rounded-[6px] border border-ink/15 px-3.5 py-2.5 transition-colors focus-within:border-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted">
                <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 text-xs text-muted hover:text-ink"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-ink hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
