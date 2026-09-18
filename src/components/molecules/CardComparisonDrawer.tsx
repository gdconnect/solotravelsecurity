"use client";

import { useState, useMemo } from "react";
import { Icon } from "@/components/atoms/Icon";
import { useComparison } from "@/lib/cards/comparison";
import { SEARCH_INDEX } from "@/lib/search";
import { searchItemToCard } from "@/lib/cards/adapters";
import type { CardData } from "@/lib/cards/types";

export function CardComparisonDrawer() {
  const { comparisonIds, count, remove, clear } = useComparison();
  const [modalOpen, setModalOpen] = useState(false);

  // Look up full CardData for each compared item from SEARCH_INDEX
  const comparedCards = useMemo<CardData[]>(() => {
    return comparisonIds
      .map((id) => {
        const item = SEARCH_INDEX.find((i) => i.id === id);
        if (!item) return null;
        return searchItemToCard(item);
      })
      .filter((c): c is CardData => c !== null);
  }, [comparisonIds]);

  if (count === 0) return null;

  return (
    <>
      {/* Floating Bottom Bar */}
      <aside
        aria-label="Comparison Tray"
        className="fixed bottom-14 md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-amber-400 bg-slate-950/95 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-black text-slate-950">
            {count}
          </span>
          <span className="font-display text-xs font-bold text-slate-200">
            Item{count > 1 ? "s" : ""} in Comparison
          </span>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 font-display text-xs font-black text-slate-950 transition hover:bg-amber-400"
        >
          <Icon name="table" className="size-3.5" />
          <span>Compare Side-by-Side</span>
        </button>

        <button
          type="button"
          onClick={clear}
          className="rounded-lg p-1 text-slate-400 hover:text-white"
          aria-label="Clear all compared items"
          title="Clear all"
        >
          <Icon name="x" className="size-4" />
        </button>
      </aside>

      {/* Side-by-Side Comparison Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Situational Evaluation Matrix
                </span>
                <h2 className="font-display text-xl font-black text-slate-900 dark:text-amber-50 sm:text-2xl">
                  Side-by-Side Comparison ({comparedCards.length} Items)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clear}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 font-mono text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Icon name="x" className="size-5" />
                </button>
              </div>
            </div>

            {/* Comparison Grid (Scrollable) */}
            <div className="mt-6 flex-1 overflow-x-auto overflow-y-auto">
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: `repeat(${comparedCards.length}, minmax(280px, 1fr))`,
                }}
              >
                {comparedCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40"
                  >
                    <div className="space-y-4">
                      {/* Top Remove Button */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                          {card.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(card.id)}
                          className="rounded-md p-1 text-slate-400 hover:text-rose-600"
                          title="Remove from comparison"
                        >
                          <Icon name="trash" className="size-3.5" />
                        </button>
                      </div>

                      {/* Title & Price */}
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                          {card.title}
                        </h3>
                        {card.metrics?.price && (
                          <div className="mt-1 font-mono text-sm font-black text-amber-700 dark:text-amber-400">
                            {card.metrics.price.formatted}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {card.description}
                      </p>

                      {/* Key Highlight */}
                      {card.highlight && (
                        <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 p-2.5 text-xs text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-200">
                          <strong className="block font-mono text-[10px] uppercase text-amber-700 dark:text-amber-400">
                            Key Differentiator:
                          </strong>
                          {card.highlight}
                        </div>
                      )}

                      {/* Pros & Cons */}
                      {card.comparison?.pros && card.comparison.pros.length > 0 && (
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400 block mb-1">
                            Key Strengths:
                          </span>
                          <ul className="space-y-1 text-xs text-emerald-800 dark:text-emerald-300">
                            {card.comparison.pros.map((p, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span>✓</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {card.comparison?.cons && card.comparison.cons.length > 0 && (
                        <div>
                          <span className="font-mono text-[10px] font-bold uppercase text-rose-800 dark:text-rose-400 block mb-1">
                            Vulnerabilities / Limits:
                          </span>
                          <ul className="space-y-1 text-xs text-rose-800 dark:text-rose-300">
                            {card.comparison.cons.map((c, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                      {card.actions.primary.isExternal ? (
                        <a
                          href={card.actions.primary.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 font-display text-xs font-black text-slate-950 transition hover:bg-amber-400"
                        >
                          <span>{card.actions.primary.label}</span>
                          <Icon name="externalLink" className="size-3.5" />
                        </a>
                      ) : (
                        <a
                          href={card.actions.primary.href}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 font-display text-xs font-bold text-slate-900 transition hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <span>{card.actions.primary.label}</span>
                          <Icon name="arrowRight" className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
