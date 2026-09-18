"use client";

import { useState, useMemo, useEffect, useCallback, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  SEARCH_INDEX,
  filterSearchItems,
  calculateFacetCounts,
  CATEGORY_LABELS,
} from "@/lib/search";
import type {
  SearchFilterState,
  FacetItemType,
  FacetFormat,
  FacetPriceTier,
  FacetRiskTier,
} from "@/lib/search";
import { getStoredTrips, getActiveTripId, getStoredPersona } from "@/lib/personalization/storage";
import type { TripPlan, TravelerPersona } from "@/lib/personalization/types";
import { Icon } from "@/components/atoms/Icon";
import { Badge } from "@/components/atoms";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { SelfContainedCard, CardComparisonDrawer } from "@/components/molecules";
import { searchItemToCard } from "@/lib/cards";

export function FacetedSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local state for active trip context (Zero-PII local-first)
  const [activeTripContext, setActiveTripContext] = useState<{
    trip: TripPlan;
    persona: TravelerPersona;
  } | null>(null);

  // Initialize filter state from URL params
  const [filterState, setFilterState] = useState<SearchFilterState>(() => {
    const q = searchParams.get("q") || "";
    const types = (searchParams.getAll("type") as FacetItemType[]).filter(Boolean);
    const categories = searchParams.getAll("category").filter(Boolean);
    const archetypes = searchParams.getAll("archetype").filter(Boolean);
    const riskTiers = (searchParams.getAll("risk") as FacetRiskTier[]).filter(Boolean);
    const formats = (searchParams.getAll("format") as FacetFormat[]).filter(Boolean);
    const priceTiers = (searchParams.getAll("price") as FacetPriceTier[]).filter(Boolean);
    const sortBy = (searchParams.get("sort") as any) || "relevance";
    const personalizedOnly = searchParams.get("personalized") === "1";

    return {
      query: q,
      types,
      categories,
      archetypes,
      riskTiers,
      formats,
      priceTiers,
      sortBy,
      personalizedOnly,
    };
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load client-side trip context for Zero-PII personalization
  useEffect(() => {
    try {
      const trips = getStoredTrips();
      const activeId = getActiveTripId();
      const persona = getStoredPersona();
      const trip = trips.find((t) => t.id === activeId) || trips[0];
      if (trip && persona) {
        setActiveTripContext({ trip, persona });
      }
    } catch {
      // LocalStorage access error fallback
    }
  }, []);

  // Synchronize state changes to URL query string
  const updateUrlParams = useCallback(
    (newState: SearchFilterState) => {
      const params = new URLSearchParams();
      if (newState.query) params.set("q", newState.query);
      newState.types.forEach((t) => params.append("type", t));
      newState.categories.forEach((c) => params.append("category", c));
      newState.archetypes.forEach((a) => params.append("archetype", a));
      newState.riskTiers.forEach((r) => params.append("risk", r));
      newState.formats.forEach((f) => params.append("format", f));
      newState.priceTiers.forEach((p) => params.append("price", p));
      if (newState.sortBy !== "relevance") params.set("sort", newState.sortBy);
      if (newState.personalizedOnly) params.set("personalized", "1");

      const queryStr = params.toString();
      const target = queryStr ? `${pathname}?${queryStr}` : pathname;
      startTransition(() => {
        router.replace(target, { scroll: false });
      });
    },
    [pathname, router],
  );

  const handleFilterChange = (updater: (prev: SearchFilterState) => SearchFilterState) => {
    setFilterState((prev) => {
      const updated = updater(prev);
      updateUrlParams(updated);
      return updated;
    });
  };

  const handleTextSearch = (val: string) => {
    handleFilterChange((prev) => ({ ...prev, query: val }));
  };

  const toggleFacet = (
    key: keyof Pick<
      SearchFilterState,
      "types" | "categories" | "formats" | "priceTiers" | "riskTiers" | "archetypes"
    >,
    value: string,
  ) => {
    handleFilterChange((prev) => {
      const list = prev[key] as string[];
      const nextList = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: nextList };
    });
  };

  const clearAllFilters = () => {
    handleFilterChange(() => ({
      query: "",
      types: [],
      categories: [],
      archetypes: [],
      riskTiers: [],
      formats: [],
      priceTiers: [],
      sortBy: "relevance",
      personalizedOnly: false,
    }));
  };

  // Filtered results
  const filteredResults = useMemo(() => {
    return filterSearchItems(SEARCH_INDEX, filterState, activeTripContext);
  }, [filterState, activeTripContext]);

  // Live hybrid disjunctive facet counts
  const facetCounts = useMemo(() => {
    return calculateFacetCounts(filteredResults, SEARCH_INDEX, filterState, activeTripContext);
  }, [filteredResults, filterState, activeTripContext]);

  const activeFilterCount =
    (filterState.query ? 1 : 0) +
    filterState.types.length +
    filterState.categories.length +
    filterState.archetypes.length +
    filterState.formats.length +
    filterState.priceTiers.length +
    filterState.riskTiers.length +
    (filterState.personalizedOnly ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Playbook", href: "/playbook/" },
          { label: "Faceted Intelligence & Gear Search" },
        ]}
        className="mb-6"
      />

      {/* Header & Hero */}
      <div className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="amber">
                <Icon name="search" className="size-3" />
                Faceted Directory Engine
              </Badge>
              <span className="font-mono text-xs text-slate-500">
                {SEARCH_INDEX.length} Modular LEGO Blocks Indexed
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-black text-slate-900 sm:text-4xl dark:text-amber-50">
              Travel Security & Gear Intelligence
            </h1>
            <p className="mt-1 max-w-3xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Filter vetted perimeter defense tools, scam truth tables, airport curfew protocols,
              and customs regulations with zero cloud tracking.
            </p>
          </div>

          {/* Zero-PII Privacy Shield Badge */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            <Icon
              name="shield"
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <div>
              <span className="font-bold">Zero-PII Privacy Shield:</span>{" "}
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Queries & saved items run 100% locally in your browser.
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Personalization Trigger */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={filterState.query}
              onChange={(e) => handleTextSearch(e.target.value)}
              placeholder="Search by keyword, product name, scam type, airport, or threat vector..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-medium text-slate-900 shadow-2xs transition placeholder:text-slate-400 focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-amber-50 dark:placeholder:text-slate-600"
            />
            {filterState.query && (
              <button
                type="button"
                onClick={() => handleTextSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search query"
              >
                <Icon name="x" className="size-4" />
              </button>
            )}
          </div>

          {/* Personalize Button */}
          {activeTripContext && (
            <button
              type="button"
              onClick={() =>
                handleFilterChange((prev) => ({
                  ...prev,
                  personalizedOnly: !prev.personalizedOnly,
                }))
              }
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-display text-xs font-bold transition shadow-2xs ${
                filterState.personalizedOnly
                  ? "border-amber-400 bg-amber-400 text-slate-950 font-black"
                  : "border-slate-200 bg-white text-slate-700 hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              <Icon name="zap" className="size-3.5 text-amber-500" />
              <span>
                {filterState.personalizedOnly
                  ? `Personalized for ${activeTripContext.trip.destinationCity} (Active)`
                  : `Tailor for My Trip (${activeTripContext.trip.destinationCity})`}
              </span>
            </button>
          )}

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-display text-xs font-bold text-slate-700 shadow-2xs lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Icon name="sliders" className="size-3.5 text-amber-500" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-500">Active filters:</span>

            {filterState.query && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 font-mono text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                &quot;{filterState.query}&quot;
                <button
                  type="button"
                  onClick={() => handleTextSearch("")}
                  className="hover:text-amber-700"
                >
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            )}

            {filterState.personalizedOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-200 px-2.5 py-1 font-mono text-xs font-black text-amber-950 dark:bg-amber-900 dark:text-amber-100">
                Personalized Trip Filter
                <button
                  type="button"
                  onClick={() => handleFilterChange((p) => ({ ...p, personalizedOnly: false }))}
                >
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            )}

            {filterState.types.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Type: {t}
                <button type="button" onClick={() => toggleFacet("types", t)}>
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            ))}

            {filterState.categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                {CATEGORY_LABELS[c] || c}
                <button type="button" onClick={() => toggleFacet("categories", c)}>
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            ))}

            {filterState.formats.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Format: {f}
                <button type="button" onClick={() => toggleFacet("formats", f)}>
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            ))}

            {filterState.priceTiers.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Price: {p}
                <button type="button" onClick={() => toggleFacet("priceTiers", p)}>
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            ))}

            {filterState.riskTiers.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Risk: {r}
                <button type="button" onClick={() => toggleFacet("riskTiers", r)}>
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            ))}

            {filterState.archetypes.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Archetype: {a}
                <button type="button" onClick={() => toggleFacet("archetypes", a)}>
                  <Icon name="x" className="size-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={clearAllFilters}
              className="font-display text-xs font-bold text-rose-600 underline hover:text-rose-500 dark:text-rose-400"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main 2-Column Search Layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Sidebar Facets (Desktop + Mobile Drawer) */}
        <aside
          className={`space-y-6 lg:block ${
            mobileFiltersOpen
              ? "fixed inset-0 z-50 overflow-y-auto bg-white p-6 dark:bg-slate-900"
              : "hidden"
          } lg:relative lg:p-0 lg:bg-transparent`}
        >
          {mobileFiltersOpen && (
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 lg:hidden dark:border-slate-800">
              <span className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                Filter Facets
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-slate-500"
              >
                <Icon name="x" className="size-5" />
              </button>
            </div>
          )}

          {/* Group 1: Item Type */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Item Type
            </h2>
            <div className="mt-3 space-y-2">
              {facetCounts.types.map((t) => (
                <label
                  key={t.value}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterState.types.includes(t.value as FacetItemType)}
                      onChange={() => toggleFacet("types", t.value)}
                      className="rounded border-slate-300 accent-amber-500"
                    />
                    <span>{t.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{t.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 2: Taxonomy Category */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Taxonomy Pillar
            </h2>
            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
              {facetCounts.categories.map((c) => (
                <label
                  key={c.value}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterState.categories.includes(c.value)}
                      onChange={() => toggleFacet("categories", c.value)}
                      className="rounded border-slate-300 accent-amber-500"
                    />
                    <span className="truncate">{c.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{c.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 3: Format */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Format & Medium
            </h2>
            <div className="mt-3 space-y-2">
              {facetCounts.formats.map((f) => (
                <label
                  key={f.value}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterState.formats.includes(f.value as FacetFormat)}
                      onChange={() => toggleFacet("formats", f.value)}
                      className="rounded border-slate-300 accent-amber-500"
                    />
                    <span>{f.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{f.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 4: Price Tier */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Price Range
            </h2>
            <div className="mt-3 space-y-2">
              {facetCounts.priceTiers.map((p) => (
                <label
                  key={p.value}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterState.priceTiers.includes(p.value as FacetPriceTier)}
                      onChange={() => toggleFacet("priceTiers", p.value)}
                      className="rounded border-slate-300 accent-amber-500"
                    />
                    <span>{p.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{p.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 5: Risk Level */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Operational Risk Tier
            </h2>
            <div className="mt-3 space-y-2">
              {facetCounts.riskTiers.map((r) => (
                <label
                  key={r.value}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterState.riskTiers.includes(r.value as FacetRiskTier)}
                      onChange={() => toggleFacet("riskTiers", r.value)}
                      className="rounded border-slate-300 accent-amber-500"
                    />
                    <span>{r.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{r.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 6: Traveler Archetype */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Traveler Archetype
            </h2>
            <div className="mt-3 space-y-2">
              {facetCounts.archetypes.map((a) => (
                <label
                  key={a.value}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterState.archetypes.includes(a.value)}
                      onChange={() => toggleFacet("archetypes", a.value)}
                      className="rounded border-slate-300 accent-amber-500"
                    />
                    <span>{a.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{a.count}</span>
                </label>
              ))}
            </div>
          </div>

          {mobileFiltersOpen && (
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full rounded-xl bg-amber-400 py-3 font-display text-xs font-black text-slate-950 lg:hidden"
            >
              Apply Filters ({filteredResults.length} matches)
            </button>
          )}
        </aside>

        {/* Right Search Results Column */}
        <main className="lg:col-span-3">
          {/* Results Bar: Total count + Sort dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
                {filteredResults.length} Result{filteredResults.length === 1 ? "" : "s"} Found
              </span>
              {isPending && <Icon name="loader" className="size-3.5 animate-spin text-amber-500" />}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-mono text-xs text-slate-500">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={filterState.sortBy}
                onChange={(e) =>
                  handleFilterChange((p) => ({ ...p, sortBy: e.target.value as any }))
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-display text-xs font-bold text-slate-800 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="relevance">Default Priority</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {filteredResults.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
              <Icon name="search" className="mx-auto size-8 text-slate-400" />
              <h2 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-amber-50">
                No matching security items found
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Try widening your query or clearing some of the active facet filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-bold text-slate-950 hover:bg-amber-300"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {filteredResults.map((item) => (
                <SelfContainedCard key={item.id} card={searchItemToCard(item)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Side-by-Side Comparison Drawer */}
      <CardComparisonDrawer />
    </div>
  );
}
