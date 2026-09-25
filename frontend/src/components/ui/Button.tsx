import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "gold" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink-soft shadow-[0_10px_30px_-12px_rgba(11,18,32,0.45)]",
  gold: "bg-gold text-ink hover:brightness-105 shadow-[0_10px_30px_-12px_rgba(201,151,43,0.55)]",
  outline: "border border-ink/15 text-ink hover:border-ink/40 bg-white/60",
  ghost: "text-ink hover:bg-ink/5",
};

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
