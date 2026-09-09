/**
 * ATOM — Logo.
 * Wordmark + inline shield glyph. No JS, no external resources.
 * Amber-700 / amber-400 on slate-50 / slate-950 = WCAG AA contrast (4.7:1 light, 8.1:1 dark).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="grid size-9 place-items-center rounded-xl bg-slate-900 text-amber-400 shadow-card dark:bg-amber-300 dark:text-slate-950"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </span>
      <span className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-amber-50">
        Solo Travel<span className="text-amber-700 dark:text-amber-300">Security</span>
      </span>
    </span>
  );
}
