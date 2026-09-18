"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { FavoriteButton } from "@/components/atoms";
import type { CardData, CardBadgeTone } from "@/lib/cards/types";
import { useComparison } from "@/lib/cards/comparison";

interface SelfContainedCardProps {
  card: CardData;
  layout?: "auto" | "compact" | "horizontal";
  showCompare?: boolean;
}

const BADGE_TONE_STYLES: Record<CardBadgeTone, string> = {
  amber:
    "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  green:
    "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  red: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
  blue: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  purple:
    "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  neutral:
    "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function SelfContainedCard({
  card,
  layout: _layout = "auto",
  showCompare = true,
}: SelfContainedCardProps) {
  const { isComparing, toggle: toggleCompare } = useComparison();
  const [copied, setCopied] = useState(false);
  const [prosOpen, setProsOpen] = useState(false);

  const comparing = isComparing(card.id);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const fullUrl = card.href.startsWith("http")
        ? card.href
        : `${window.location.origin}${card.href}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <article
      data-card-id={card.id}
      data-card-type={card.type}
      className={`@container group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
        comparing
          ? "border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-400"
          : "border-slate-200 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500/50"
      }`}
    >
      <div className="space-y-4">
        {/* Top Action Bar: Media Icon, Badges, Compare Checkbox & Favorite */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {card.badges.map((badge, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${
                  BADGE_TONE_STYLES[badge.tone || "neutral"]
                }`}
              >
                {badge.icon && <Icon name={badge.icon} className="size-3" />}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>

          {/* Right: Auxiliary Controls (Stop Propagation for Stretched Link Pattern) */}
          <div className="relative z-10 flex items-center gap-2">
            {/* Compare Checkbox */}
            {showCompare && card.comparison?.canCompare && (
              <label
                onClick={(e) => e.stopPropagation()}
                className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10px] font-bold text-slate-600 transition-colors hover:border-amber-400 hover:bg-amber-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  checked={comparing}
                  onChange={() => toggleCompare(card.id)}
                  className="rounded border-slate-300 accent-amber-500"
                />
                <span className="hidden @[320px]:inline">Compare</span>
              </label>
            )}

            {/* Share Button */}
            {card.actions.canShare && (
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share or copy link"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <Icon name={copied ? "check" : "share"} className="size-3.5" />
              </button>
            )}

            {/* Favorite Bookmark Button */}
            {card.actions.canFavorite && (
              <FavoriteButton
                item={{
                  id: card.id,
                  type:
                    card.type === "micro_zone" ||
                    card.type === "country" ||
                    card.type === "playbook"
                      ? "topic"
                      : card.type,
                  title: card.title,
                  url: card.href,
                  category: card.badges[0]?.label || card.type,
                  description: card.description,
                  price: card.metrics?.price?.formatted,
                  rating: card.metrics?.rating?.value,
                  badge: card.badges[0]?.label,
                }}
                size="sm"
              />
            )}
          </div>
        </div>

        {/* Title, Subtitle, and Stretched Link */}
        <div>
          {card.subtitle && (
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {card.subtitle}
            </div>
          )}

          <h3 className="mt-1 font-display text-base font-black text-slate-900 transition-colors group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300 sm:text-lg">
            {card.isExternal ? (
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 after:content-[''] focus:outline-hidden"
              >
                {card.title}
              </a>
            ) : (
              <Link
                href={card.href}
                className="after:absolute after:inset-0 after:content-[''] focus:outline-hidden"
              >
                {card.title}
              </Link>
            )}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
          {card.description}
        </p>

        {/* Highlight Callout Box */}
        {card.highlight && (
          <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-2.5 text-xs text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-200">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
              Tactical Highlight
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{card.highlight}</span>
          </div>
        )}

        {/* Pros & Cons / Comparison Differentiators */}
        {card.comparison && (card.comparison.pros?.length || card.comparison.cons?.length) ? (
          <div className="relative z-10 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProsOpen((p) => !p);
              }}
              className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <span>Field Verification Analysis</span>
              <Icon name={prosOpen ? "chevronUp" : "chevronDown"} className="size-3" />
            </button>

            {prosOpen && (
              <div className="mt-2 space-y-2 text-xs">
                {card.comparison.pros && card.comparison.pros.length > 0 && (
                  <ul className="space-y-1 text-emerald-800 dark:text-emerald-300">
                    {card.comparison.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Icon name="check" className="size-3 mt-0.5 shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {card.comparison.cons && card.comparison.cons.length > 0 && (
                  <ul className="space-y-1 text-rose-800 dark:text-rose-300">
                    {card.comparison.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Related Entity Chips */}
        {card.related && card.related.length > 0 && (
          <div className="relative z-10 flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-mono text-[10px] text-slate-400">Related:</span>
            {card.related.map((rel) => (
              <Link
                key={rel.id}
                href={rel.href}
                onClick={(e) => e.stopPropagation()}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 hover:border-amber-400 hover:text-amber-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                {rel.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Metrics & Primary Action */}
      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Metrics: Price, Rating, Risk */}
          <div className="flex items-center gap-3 font-mono text-xs">
            {card.metrics?.price && (
              <span className="font-black text-slate-900 dark:text-white">
                {card.metrics.price.formatted}
              </span>
            )}

            {card.metrics?.rating && (
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <span>★</span>
                <span>{card.metrics.rating.value}</span>
                {card.metrics.rating.count > 0 && (
                  <span className="text-slate-400 text-[10px]">({card.metrics.rating.count})</span>
                )}
              </span>
            )}

            {card.metrics?.risk && (
              <span
                className={`font-bold ${
                  card.metrics.risk.tier === "Critical" || card.metrics.risk.tier === "High"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {card.metrics.risk.tier} Risk
              </span>
            )}
          </div>

          {/* Primary Action Button (Elevated z-10 for clickability) */}
          <div className="relative z-10">
            {card.actions.primary.isExternal ? (
              <a
                href={card.actions.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 font-display text-xs font-black text-slate-950 shadow-2xs transition hover:bg-amber-400"
              >
                <span>{card.actions.primary.label}</span>
                {card.actions.primary.icon && (
                  <Icon name={card.actions.primary.icon} className="size-3.5" />
                )}
              </a>
            ) : (
              <Link
                href={card.actions.primary.href}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 font-display text-xs font-bold text-slate-900 transition hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300"
              >
                <span>{card.actions.primary.label}</span>
                {card.actions.primary.icon && (
                  <Icon name={card.actions.primary.icon} className="size-3.5" />
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
