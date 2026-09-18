"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { EnrichedCountry } from "@/lib/geo/types";
import { Icon } from "@/components/atoms/Icon";

interface CountryDirectoryGridProps {
  countries: EnrichedCountry[];
}

export function CountryDirectoryGrid({ countries }: CountryDirectoryGridProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return countries.filter((c) => {
      const matchesTier = tierFilter === "all" || c.defaultRiskTier === tierFilter;
      if (!matchesTier) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q) ||
        c.currencyCode.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.nativeName.toLowerCase().includes(q)
      );
    });
  }, [countries, search, tierFilter]);

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Icon
            name="search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries, capitals, currencies..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-50 dark:placeholder:text-slate-500 dark:focus:border-amber-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tier filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60">
          {(["all", "Low", "Moderate", "Elevated"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition whitespace-nowrap ${
                tierFilter === tier
                  ? "bg-white text-slate-900 shadow-xs dark:bg-amber-400 dark:text-slate-950"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {tier === "all" ? `All (${countries.length})` : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Results stats */}
      <div className="mt-4 flex items-center justify-between font-mono text-xs text-slate-500 dark:text-slate-400">
        <span>Showing {filtered.length} sovereign security profiles</span>
        {search && <span>Filtered by &ldquo;{search}&rdquo;</span>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Icon name="compass" className="mx-auto size-8 text-slate-400 dark:text-slate-600" />
          <h3 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-amber-50">
            No countries found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search term or risk tier filter.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setTierFilter("all");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country) => (
            <Link
              key={country.iso2}
              href={`/playbook/countries/${country.iso2.toLowerCase()}/`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {country.iso2}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {country.capital}
                    </span>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      country.defaultRiskTier === "Low"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                        : country.defaultRiskTier === "Moderate"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    {country.defaultRiskTier} Risk
                  </span>
                </div>

                {/* Country title */}
                <h3 className="mt-2 font-display text-xl font-black text-slate-900 transition group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                  {country.name}
                </h3>
                {country.nativeName && country.nativeName !== country.name && (
                  <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
                    {country.nativeName}
                  </p>
                )}

                {/* Emergency dispatch strip */}
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Police</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {country.emergencyNumbers.police}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Ambulance</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {country.emergencyNumbers.ambulance}
                    </span>
                  </div>
                  {country.emergencyNumbers.touristPolice && (
                    <div className="mt-1 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">Tourist Police</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {country.emergencyNumbers.touristPolice}
                      </span>
                    </div>
                  )}
                </div>

                {/* Infrastructure specs */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon name="card" className="size-3 text-amber-500" />
                    {country.currencyCode} ({country.currencySymbol})
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="flex items-center gap-1">
                    <Icon name="zap" className="size-3 text-amber-500" />
                    {country.electricalStandards.voltage}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Plugs: {country.electricalStandards.plugTypes.join(", ")}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Icon name="globe" className="size-3 text-amber-600 dark:text-amber-400" />
                  {country.primaryCities && country.primaryCities.length > 0
                    ? `${country.primaryCities.length} Field Dossier${country.primaryCities.length > 1 ? "s" : ""}`
                    : "National Protocol"}
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700 transition group-hover:translate-x-1 dark:text-amber-400">
                  View Dossier
                  <Icon name="arrowRight" className="size-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
