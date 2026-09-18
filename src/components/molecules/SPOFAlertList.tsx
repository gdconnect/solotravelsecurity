import { Icon } from "@/components/atoms/Icon";

export interface SPOFAlertListProps {
  spofs: string[];
}

export function SPOFAlertList({ spofs }: SPOFAlertListProps) {
  if (spofs.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-display text-sm font-black">
          <Icon name="check" className="size-4 text-emerald-700 dark:text-emerald-400" />
          Zero Critical Single Points of Failure Detected
        </div>
        <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80">
          Your travel profile demonstrates strong redundancy across payments, connectivity, and
          arrival transit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon name="shieldAlert" className="size-4 text-rose-700 dark:text-rose-400" />
        <h4 className="font-display text-sm font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
          {spofs.length} Critical Single Point{spofs.length > 1 ? "s" : ""} of Failure (SPOF)
        </h4>
      </div>

      <ul className="space-y-2.5">
        {spofs.map((spof, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs leading-relaxed text-rose-950 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
          >
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-black text-rose-800 dark:text-rose-300">
              !
            </span>
            <span>{spof}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
