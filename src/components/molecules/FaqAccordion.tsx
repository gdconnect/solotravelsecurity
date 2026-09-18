"use client";

import { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { JsonLd } from "@/components/atoms";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  description?: string;
}

export function FaqAccordion({
  items,
  title = "Frequently Asked Questions",
  description = "Field-tested answers and verified protocols for solo travelers.",
}: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // First open by default

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  // Automated Schema.org FAQPage JSON-LD graph
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-14 space-y-6">
      <JsonLd data={faqSchema} />

      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Search Intelligence & Field Inoculation
        </span>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-amber-50">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{description}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                aria-expanded={isOpen}
              >
                <span className="font-display text-sm font-bold text-slate-900 sm:text-base dark:text-amber-50">
                  {item.question}
                </span>
                <span className="ml-4 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Icon
                    name={isOpen ? "chevronUp" : "chevronDown"}
                    className="size-4 text-slate-600 dark:text-slate-400"
                  />
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="text-xs leading-relaxed text-slate-700 sm:text-sm dark:text-slate-300">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
