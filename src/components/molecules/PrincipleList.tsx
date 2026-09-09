import { Icon, type IconName } from "@/components/atoms";

/**
 * MOLECULE — PrincipleList.
 * Renders a vertical list of titled principles with a leading icon chip.
 */
export interface Principle {
  icon: IconName;
  title: string;
  body: string;
}

export function PrincipleList({
  items,
  tone = "amber",
}: {
  items: Principle[];
  tone?: "amber" | "teal" | "coral";
}) {
  const accent = {
    amber: "bg-amber-300 text-slate-950 dark:bg-amber-400",
    teal: "bg-teal-300 text-slate-950 dark:bg-teal-400",
    coral: "bg-rose-400 text-white dark:bg-rose-500",
  }[tone];

  return (
    <ul className="grid gap-3">
      {items.map(({ icon, title, body }) => (
        <li
          key={title}
          className="flex items-start gap-4 rounded-2xl border border-slate-900/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-card dark:border-white/10 dark:bg-slate-900/70"
        >
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-xl ${accent} shadow-sm`}
            aria-hidden="true"
          >
            <Icon name={icon} className="size-5" strokeWidth={2.4} />
          </span>
          <div>
            <p className="font-display text-base font-extrabold text-slate-900 dark:text-amber-50">
              {title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-amber-50/75">
              {body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
