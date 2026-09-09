import type { ReactNode } from "react";

/**
 * ATOM — Badge.
 * Sticker-style label for editorial eyebrow text. Slight tilt for character.
 */
const TONES: Record<string, string> = {
  amber:
    "bg-amber-300 text-slate-950 ring-1 ring-amber-950/20 shadow-sm dark:bg-amber-400 dark:text-slate-950",
  mint: "bg-emerald-300 text-slate-950 ring-1 ring-emerald-950/20 shadow-sm dark:bg-emerald-400",
  white:
    "bg-white/95 text-slate-900 ring-1 ring-slate-900/15 shadow-sm dark:bg-slate-800/95 dark:text-amber-50 dark:ring-white/20",
  ink: "bg-slate-900 text-amber-50 ring-1 ring-white/15 shadow-sm dark:bg-slate-950",
  coral: "bg-rose-500 text-white ring-1 ring-white/20 shadow-sm",
  teal: "bg-teal-400 text-slate-950 ring-1 ring-teal-950/20 shadow-sm dark:bg-teal-300",
};

interface BadgeProps {
  children: ReactNode;
  tone?: keyof typeof TONES;
  tilt?: "left" | "right" | "none";
  className?: string;
}

export function Badge({ children, tone = "amber", tilt = "left", className = "" }: BadgeProps) {
  const rotation = tilt === "left" ? "-rotate-2" : tilt === "right" ? "rotate-2" : "";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] transition-transform duration-200 ${TONES[tone]} ${rotation} ${className}`}
    >
      {children}
    </span>
  );
}
