import { Shield } from "lucide-react";

/**
 * ATOM — Logo.
 * Wordmark + shield glyph. No external image dependency.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="grid size-9 place-items-center rounded-xl bg-slate-900 text-amber-300 shadow-card dark:bg-amber-300 dark:text-slate-950"
        aria-hidden="true"
      >
        <Shield className="size-5" strokeWidth={2.4} />
      </span>
      <span className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-amber-50">
        Solo Travel<span className="text-amber-500 dark:text-amber-300">Security</span>
      </span>
    </div>
  );
}
