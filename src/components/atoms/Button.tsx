import Link from "next/link";
import type { ReactNode } from "react";

/**
 * ATOM — Button.
 * Editorial pill: soft layered shadow, confident lift on hover.
 * Editorial charcoal + amber palette for solo travel security brand.
 */
type Variant = "primary" | "amber" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-amber-50 font-extrabold shadow-card hover:shadow-lift hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300",
  amber:
    "bg-amber-400 text-slate-950 shadow-card hover:shadow-glow-amber hover:-translate-y-0.5 font-extrabold dark:bg-amber-300",
  white:
    "bg-white text-slate-900 ring-1 ring-slate-900/15 shadow-card hover:shadow-lift dark:bg-slate-100 dark:text-slate-900",
  ghost:
    "bg-transparent text-slate-900 dark:text-amber-50 hover:bg-slate-900/5 dark:hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2.5 min-h-[44px] text-sm",
  md: "px-6 py-3 min-h-[48px] text-base",
  lg: "px-8 py-4 min-h-[52px] text-lg",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  id?: string;
  prefetch?: boolean;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  suppressHydrationWarning?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  id,
  prefetch,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  suppressHydrationWarning,
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-tight transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (href) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        className={cls}
        id={id}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        suppressHydrationWarning={suppressHydrationWarning}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      suppressHydrationWarning={suppressHydrationWarning}
      className={cls}
    >
      {children}
    </button>
  );
}
