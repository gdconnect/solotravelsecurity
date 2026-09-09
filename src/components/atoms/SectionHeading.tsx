import type { ReactNode } from "react";
import { Badge } from "./Badge";

/**
 * ATOM — SectionHeading.
 * Kicker chip, oversized display title, quiet lede. Optional ghost index.
 */
interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
  index?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  index,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      <span className="flex items-center gap-3">
        {index && (
          <span
            aria-hidden="true"
            className="text-outline font-display text-2xl font-extrabold text-slate-900 dark:text-amber-50"
          >
            {index}
          </span>
        )}
        <Badge>{eyebrow}</Badge>
      </span>
      <h2 className="max-w-3xl text-balance font-display text-4xl font-black leading-[1.02] tracking-tight text-slate-900 dark:text-amber-50 sm:text-5xl">
        {title}
      </h2>
      {lede && (
        <p className="max-w-xl text-base font-medium leading-relaxed text-slate-700 dark:text-amber-50/75 sm:text-lg">
          {lede}
        </p>
      )}
    </div>
  );
}
