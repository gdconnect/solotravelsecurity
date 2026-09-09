/**
 * MOLECULE — StatRow.
 * A row of three editorial-style numerals, used for social proof / focus.
 */
export interface Stat {
  value: string;
  label: string;
  sub?: string;
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-slate-900/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70"
        >
          <dt className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-amber-50/60">
            {s.label}
          </dt>
          <dd className="mt-2 font-display text-3xl font-black tracking-tight text-slate-900 dark:text-amber-50">
            {s.value}
          </dd>
          {s.sub && (
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-amber-50/65">{s.sub}</p>
          )}
        </div>
      ))}
    </dl>
  );
}
