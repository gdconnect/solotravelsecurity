"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllCountries } from "@/data/geo/countries";
import { getAllEnrichedCities } from "@/data/geo/cities";
import { Icon } from "@/components/atoms/Icon";

interface SearchResultItem {
  id: string;
  type: "city" | "country";
  title: string;
  subtitle: string;
  riskTier: string;
  badge: string;
  url: string;
  emergencyNumber: string;
}

export function CitySearchCombobox({
  placeholder = "Search destination city or country (e.g. Rome, Tokyo, Japan)...",
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const countries = useMemo(() => getAllCountries(), []);
  const cities = useMemo(() => getAllEnrichedCities(), []);

  // Build searchable index
  const allItems: SearchResultItem[] = useMemo(() => {
    const cityItems: SearchResultItem[] = cities.map((c) => {
      const country = countries.find((co) => co.iso2 === c.countryCode);
      return {
        id: `city-${c.slug}`,
        type: "city",
        title: c.name,
        subtitle: country
          ? `${country.name} · ${c.primaryAirportCode} Airport`
          : `${c.primaryAirportCode} Airport`,
        riskTier: c.riskTier,
        badge: c.primaryAirportCode,
        url: `/playbook/destinations/${c.slug}/`,
        emergencyNumber: country ? country.emergencyNumbers.police : "112",
      };
    });

    const countryItems: SearchResultItem[] = countries.map((co) => ({
      id: `country-${co.iso2.toLowerCase()}`,
      type: "country",
      title: co.name,
      subtitle: `Capital: ${co.capital} · Currency: ${co.currencyCode} (${co.currencySymbol})`,
      riskTier: co.defaultRiskTier,
      badge: co.iso2,
      url: `/playbook/countries/${co.iso2.toLowerCase()}/`,
      emergencyNumber: co.emergencyNumbers.police,
    }));

    return [...cityItems, ...countryItems];
  }, [cities, countries]);

  // Filter based on input
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [allItems, query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item: SearchResultItem) {
    setIsOpen(false);
    setQuery("");
    router.push(item.url);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <Icon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="city-search-listbox"
          aria-autocomplete="list"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-50 dark:placeholder:text-slate-500 dark:focus:border-amber-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Esc
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <ul
          id="city-search-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          {results.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <li
                key={item.id}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => handleSelect(item)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-3 transition ${
                  isSelected
                    ? "bg-amber-50 text-slate-950 dark:bg-amber-400/10 dark:text-amber-50"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      item.type === "city"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                    }`}
                  >
                    <Icon name={item.type === "city" ? "mapPin" : "globe"} className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                        {item.title}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      item.riskTier === "Low"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                        : item.riskTier === "Moderate"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    {item.riskTier}
                  </span>
                  <Icon name="arrowRight" className="size-3.5 text-slate-400" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
