import Link from "next/link";

export function Logo({
  size = "md",
  dark = false,
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
  href?: string | null;
}) {
  const dims = size === "lg" ? "h-9 w-9 text-base" : size === "sm" ? "h-6 w-6 text-xs" : "h-7 w-7 text-sm";
  const wordmarkSize = size === "lg" ? "text-lg" : "text-[15px]";

  const content = (
    <span className="flex items-center gap-2.5">
      <span
        className={`flex shrink-0 items-center justify-center rounded-[8px] font-bold ${dims}`}
        style={{
          background: "linear-gradient(135deg, var(--color-gold), #a67c1f)",
          color: "var(--color-ink)",
        }}
      >
        R
      </span>
      <span
        className={`font-semibold tracking-[-0.01em] ${wordmarkSize}`}
        style={{ color: dark ? "var(--color-surface)" : "var(--color-ink)" }}
      >
        RentEase
      </span>
    </span>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
