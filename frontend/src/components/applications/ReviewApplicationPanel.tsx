"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { applicationApi, RentalApplication } from "@/lib/api";

export function ReviewApplicationPanel({
  application,
  onReviewed,
}: {
  application: RentalApplication;
  onReviewed: (updated: RentalApplication) => void;
}) {
  const [mode, setMode] = useState<"idle" | "rejecting">("idle");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function approve() {
    if (!confirm("Approve this application? The property will be marked as RENTED and all other pending applications for it will be auto-rejected.")) return;
    setBusy("approve"); setError(null);
    try {
      const { application: updated } = await applicationApi.review(application.id, { status: "APPROVED" });
      onReviewed(updated);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed."); }
    finally { setBusy(null); }
  }

  async function reject() {
    if (!reason.trim()) { setError("Please provide a rejection reason."); return; }
    setBusy("reject"); setError(null);
    try {
      const { application: updated } = await applicationApi.review(application.id, {
        status: "REJECTED",
        rejectionReason: reason.trim(),
      });
      onReviewed(updated);
      setMode("idle");
      setReason("");
    } catch (e) { setError(e instanceof Error ? e.message : "Failed."); }
    finally { setBusy(null); }
  }

  return (
    <section className="mt-6 rounded-[10px] border border-[#c9972b]/40 bg-[#c9972b]/5 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#7a5a12]">
        Review this application
      </h2>

      {mode === "idle" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={approve}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-[8px] bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Approve
          </button>
          <button
            onClick={() => setMode("rejecting")}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-[8px] border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" /> Reject
          </button>
        </div>
      )}

      {mode === "rejecting" && (
        <div className="space-y-3">
          <textarea
            rows={3}
            maxLength={500}
            placeholder="Reason for rejection (required)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-sm focus:border-[#2455eb] focus:outline-none focus:ring-1 focus:ring-[#2455eb]"
          />
          <div className="flex gap-3">
            <button
              onClick={reject}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {busy === "reject" && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm rejection
            </button>
            <button
              onClick={() => { setMode("idle"); setReason(""); setError(null); }}
              disabled={busy !== null}
              className="rounded-[8px] border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}