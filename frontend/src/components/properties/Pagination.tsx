"use client";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-10">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-[6px] border border-ink/15 px-4 py-2 text-sm text-ink hover:border-ink/40 disabled:opacity-40 transition"
      >
        Previous
      </button>
      <span className="text-sm text-muted">Page {page} of {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-[6px] bg-ink px-4 py-2 text-sm text-white hover:bg-ink-soft disabled:opacity-40 transition"
      >
        Next
      </button>
    </div>
  );
}
