"use client";

import { useState, useMemo } from "react";
import { Icon } from "@/components/atoms/Icon";
import type { MatchedProduct, GearCategory } from "@/data/gear/types";
import { buildProductSchemaGraph } from "@/data/gear/matcher";
import { SITE_URL } from "@/lib/schema";
import { SelfContainedCard } from "@/components/molecules";
import { gearToCard } from "@/lib/cards";

interface RecommendationSectionProps {
  products: MatchedProduct[];
  destinationCity: string;
}

const CATEGORY_META: Record<
  GearCategory,
  {
    label: string;
    badgeClass: string;
    icon: "shield" | "zap" | "globe" | "hotel" | "fileText" | "sparkles";
  }
> = {
  perimeter_defense: {
    label: "Perimeter Defense",
    badgeClass:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    icon: "shield",
  },
  transit_security: {
    label: "Transit Security",
    badgeClass:
      "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    icon: "shield",
  },
  digital_connectivity: {
    label: "Digital Connectivity",
    badgeClass:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    icon: "globe",
  },
  asset_protection: {
    label: "Asset Protection",
    badgeClass:
      "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    icon: "shield",
  },
  power_hardware: {
    label: "Power Hardware",
    badgeClass:
      "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    icon: "zap",
  },
  medical_hygiene: {
    label: "Medical & Hygiene",
    badgeClass:
      "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    icon: "shield",
  },
  travel_insurance: {
    label: "Travel Insurance",
    badgeClass:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    icon: "shield",
  },
  books_guides: {
    label: "Field Manuals & Books",
    badgeClass:
      "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    icon: "fileText",
  },
  privacy_saas: {
    label: "Privacy SaaS & VPN",
    badgeClass:
      "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800",
    icon: "zap",
  },
  local_services: {
    label: "Local Vetted Services",
    badgeClass:
      "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800",
    icon: "hotel",
  },
};

export function RecommendationSection({ products, destinationCity }: RecommendationSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<GearCategory>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // Build Schema.org Product & Review graph for SEO
  const schemaGraphs = useMemo(() => {
    return products.map((p) =>
      buildProductSchemaGraph(
        p,
        `${SITE_URL}/report/${encodeURIComponent(destinationCity.toLowerCase())}`,
      ),
    );
  }, [products, destinationCity]);

  if (products.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Embedded Schema.org JSON-LD for rich product / review snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraphs) }}
      />

      {/* Header with Ethical Trust Mandate */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Rule-Engine Matched
            </span>
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
              {products.length} Situation Triggers
            </span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-slate-900 dark:text-white">
            Situational Hardware, Insurance & Field Tools
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Selected dynamically by our deterministic schema validator based on your arrival hour,
            lodging floor, and transit risk profile. Zero sponsored rankings — every item is
            field-verified for solo security.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <Icon name="check" className="size-3.5 text-emerald-600 shrink-0" />
          <span>Transparent affiliate disclosure: commission never influences risk logic.</span>
        </div>
      </div>

      {/* Category Pills Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
              activeCategory === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            All Matched ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                <span>{meta?.label || cat}</span>
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredProducts.map((product) => (
          <SelfContainedCard key={product.sku} card={gearToCard(product)} />
        ))}
      </div>
    </section>
  );
}
