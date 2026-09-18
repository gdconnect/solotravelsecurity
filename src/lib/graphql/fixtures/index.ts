/**
 * src/lib/graphql/fixtures/index.ts
 *
 * Deterministic offline fixture registry for GraphQL operations.
 * Allows unit tests, Storybook, CI builds, and local audits to execute
 * without an active connection to the Laravel Lighthouse backend.
 */

import { getAllCountries, getCountryByIso2 } from "@/data/geo/countries";
import { GEAR_CATALOG } from "@/data/gear/matcher";
import { SECURITY_PILLARS, LIFECYCLE_PHASES } from "@/data/taxonomy";
import { generateSituationalChecklist } from "@/lib/engine/checklist-generator";
import { DECISION_TABLE_CATALOG } from "@/lib/engine/decision-tables";
import { TRUTH_TABLE_CATALOG } from "@/lib/engine/truth-tables";
import { SEARCH_INDEX, filterSearchItems, calculateFacetCounts } from "@/lib/search";
import type { SearchFilterState } from "@/lib/search/types";

export type FixtureHandler = (vars?: any) => unknown;

const formatMapIn: Record<string, string> = {
  PHYSICAL_GEAR: "physical_gear",
  DIGITAL_TOOL: "digital_tool",
  TRUTH_TABLE: "truth_table",
  FIELD_PROTOCOL: "field_protocol",
  CUSTOMS_RULE: "customs_rule",
};

const priceMapIn: Record<string, string> = {
  FREE: "free",
  UNDER_25: "under_25",
  BETWEEN_25_AND_50: "25_to_50",
  ABOVE_50: "50_plus",
};

const formatMapOut: Record<string, string> = {
  physical_gear: "PHYSICAL_GEAR",
  digital_tool: "DIGITAL_TOOL",
  truth_table: "TRUTH_TABLE",
  field_protocol: "FIELD_PROTOCOL",
  customs_rule: "CUSTOMS_RULE",
};

const priceMapOut: Record<string, string> = {
  free: "FREE",
  under_25: "UNDER_25",
  "25_to_50": "BETWEEN_25_AND_50",
  "50_plus": "ABOVE_50",
};

interface FixtureFavorite {
  id: string;
  type: string;
  title: string;
  url: string;
  category: string;
  description: string;
  price: string | null;
  rating: number | null;
  badge: string | null;
  savedAt: string;
  notes: string | null;
}

const sessionFavoritesStore = new Map<string, FixtureFavorite[]>();

export const GRAPHQL_FIXTURES: Record<string, FixtureHandler> = {
  AllCountries: (vars) => {
    let list = getAllCountries();
    if (vars.region && typeof vars.region === "string") {
      list = list.filter((c) => c.region.toLowerCase() === (vars.region as string).toLowerCase());
    }
    if (vars.riskTier && typeof vars.riskTier === "string") {
      list = list.filter(
        (c) => c.defaultRiskTier.toUpperCase() === (vars.riskTier as string).toUpperCase(),
      );
    }
    return {
      countries: list.map((c) => ({
        iso2: c.iso2,
        iso3: c.iso3,
        name: c.name,
        nativeName: c.nativeName,
        capital: c.capital,
        currencyCode: c.currencyCode,
        currencySymbol: c.currencySymbol,
        region: c.region,
        defaultRiskTier: c.defaultRiskTier.toUpperCase(),
        emergencyNumbers: c.emergencyNumbers,
        electricalStandards: c.electricalStandards,
      })),
    };
  },

  CountryByIso2: (vars) => {
    const iso2 = (vars.iso2 as string)?.toUpperCase() ?? "IT";
    const country = getCountryByIso2(iso2);
    if (!country) return { country: null };

    return {
      country: {
        ...country,
        defaultRiskTier: country.defaultRiskTier.toUpperCase(),
        primaryCities: (country.primaryCities || []).map((slug) => ({
          slug,
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          primaryAirportCode: "XXX",
          riskTier: country.defaultRiskTier.toUpperCase(),
        })),
      },
    };
  },

  GuardianPortal: (vars) => {
    const token = (vars.token as string) ?? "rome";
    return {
      guardianPortal: {
        token,
        travelerName: "Jane Doe",
        destinationCity: "Rome",
        destinationCountry: "Italy",
        status: "GREEN",
        nextWindowUtc: "2026-09-10T22:00:00Z",
        readinessScore: 94,
        readinessGrade: "A",
        milestones: [
          {
            id: "touchdown",
            label: "Touchdown at FCO & Airside Cellular Verification",
            expectedTime: "18:30 Local",
            completedTime: "18:24 Local",
            status: "COMPLETED",
          },
          {
            id: "transit",
            label: "Official Transit Dispatch Departure",
            expectedTime: "19:15 Local",
            completedTime: "19:10 Local",
            status: "COMPLETED",
          },
          {
            id: "lodging",
            label: "Hotel Safe Haven Physical Check-in",
            expectedTime: "20:00 Local",
            completedTime: null,
            status: "PENDING",
          },
        ],
        consularHotlines: {
          usEmbassyPhone: "+39-06-46741",
          ukEmbassyPhone: "+39-06-4220-0001",
          ausEmbassyPhone: "+39-06-852721",
        },
        emergencyNumbers: {
          police: "112",
          ambulance: "118",
          fire: "115",
          touristPolice: "112",
        },
      },
    };
  },

  MatchedProducts: () => {
    return {
      matchedProducts: GEAR_CATALOG.slice(0, 4).map((p, idx) => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        howToRole: p.howToRole || "tool",
        priorityRank: p.priorityRank,
        situationalRationale: p.situationalRationale,
        isPrimaryRecommendation: idx === 0,
        price: p.schemaOrg.price,
        priceCurrency: p.schemaOrg.priceCurrency,
        affiliateUrl: p.schemaOrg.affiliateUrl,
        brand: p.schemaOrg.brand,
        author: p.schemaOrg.author,
        isbn: p.schemaOrg.isbn,
        ratingValue: p.schemaOrg.rating.value,
        ratingCount: p.schemaOrg.rating.count,
        pros: p.schemaOrg.pros,
        cons: p.schemaOrg.cons,
      })),
    };
  },

  ConfirmHeartbeat: (vars) => {
    return {
      confirmIngressHeartbeat: {
        token: vars.token as string,
        status: "GREEN",
        nextWindowUtc: new Date(Date.now() + 3600000).toISOString(),
        milestones: [
          {
            id: (vars.milestoneId as string) || "lodging",
            label: "Verified Ingress Milestone",
            expectedTime: "Now",
            completedTime: "Just now",
            status: "COMPLETED",
          },
        ],
      },
    };
  },

  TaxonomyTree: () => {
    return {
      securityPillars: SECURITY_PILLARS,
      lifecyclePhases: LIFECYCLE_PHASES,
    };
  },

  GenerateChecklist: (vars) => {
    const result = generateSituationalChecklist(vars?.input || {});
    return {
      generateChecklist: result,
    };
  },

  DecisionTables: () => {
    return {
      decisionTables: Object.values(DECISION_TABLE_CATALOG),
    };
  },

  SecurityTruthTables: () => {
    return {
      truthTables: Object.values(TRUTH_TABLE_CATALOG),
    };
  },

  SearchFacetedItems: (vars) => {
    const filterInput = vars?.filter || {};
    const state: SearchFilterState = {
      query: filterInput.query || "",
      types: filterInput.types || [],
      categories: filterInput.categories || [],
      formats: (filterInput.formats || []).map((f: string) => formatMapIn[f] || f.toLowerCase()),
      priceTiers: (filterInput.priceTiers || []).map(
        (p: string) => priceMapIn[p] || p.toLowerCase(),
      ),
      riskTiers: filterInput.riskTiers || [],
      archetypes: filterInput.archetypes || [],
      personalizedOnly: false,
      sortBy: filterInput.sortBy || "relevance",
    };

    const filtered = filterSearchItems(SEARCH_INDEX, state);
    const facetCounts = calculateFacetCounts(filtered, SEARCH_INDEX);

    return {
      searchFacetedItems: {
        totalCount: filtered.length,
        items: filtered.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          url: item.url,
          type: item.type,
          category: item.category,
          categoryLabel: item.categoryLabel,
          pillarId: item.pillarId || null,
          description: item.description,
          tagline: item.tagline || null,
          archetypes: item.archetypes,
          riskTiers: item.riskTiers,
          destinations: item.destinations || [],
          format: formatMapOut[item.format] || "PHYSICAL_GEAR",
          priceTier: priceMapOut[item.priceTier] || "FREE",
          priceFormatted: item.priceFormatted || null,
          rating: item.rating || null,
          ratingCount: item.ratingCount || null,
          affiliateUrl: item.affiliateUrl || null,
          pros: item.pros || [],
          cons: item.cons || [],
          keyHighlight: item.keyHighlight || null,
        })),
        facetCounts: {
          types: facetCounts.types,
          categories: facetCounts.categories,
          formats: facetCounts.formats.map((f) => ({
            value: formatMapOut[f.value] || f.value,
            label: f.label,
            count: f.count,
          })),
          priceTiers: facetCounts.priceTiers.map((p) => ({
            value: priceMapOut[p.value] || p.value,
            label: p.label,
            count: p.count,
          })),
          riskTiers: facetCounts.riskTiers,
        },
      },
    };
  },

  UserFavorites: (vars) => {
    const token = (vars?.sessionToken as string) || "default";
    const items = sessionFavoritesStore.get(token) || [
      {
        id: "door-stop-alarm",
        type: "product",
        title: "Wedge Door Stop Alarm with 120dB Siren",
        url: "/playbook/gear/wedge-door-stop-alarm",
        category: "Perimeter Defense",
        description: "Dual-mode physical wedge and 120dB high-decibel intrusion siren.",
        price: "$14.99",
        rating: 4.8,
        badge: "Perimeter Defense",
        savedAt: "2026-09-10T12:00:00.000Z",
        notes: "Saved for upcoming solo trip",
      },
    ];
    return {
      userFavorites: items,
    };
  },

  SaveFavorite: (vars) => {
    const token = (vars?.sessionToken as string) || "default";
    const itemInput = vars?.item || {};
    const current = sessionFavoritesStore.get(token) || [];
    const savedItem: FixtureFavorite = {
      id: itemInput.id,
      type: itemInput.type,
      title: itemInput.title,
      url: itemInput.url,
      category: itemInput.category,
      description: itemInput.description,
      price: itemInput.price ?? null,
      rating: itemInput.rating ?? null,
      badge: itemInput.badge ?? null,
      savedAt: new Date().toISOString(),
      notes: itemInput.notes ?? null,
    };
    const existingIdx = current.findIndex((i) => i.id === itemInput.id);
    if (existingIdx >= 0) {
      current[existingIdx] = savedItem;
    } else {
      current.unshift(savedItem);
    }
    sessionFavoritesStore.set(token, current);
    return {
      saveFavorite: savedItem,
    };
  },

  RemoveFavorite: (vars) => {
    const token = (vars?.sessionToken as string) || "default";
    const itemId = vars?.itemId as string;
    const current = sessionFavoritesStore.get(token) || [];
    sessionFavoritesStore.set(
      token,
      current.filter((i) => i.id !== itemId),
    );
    return {
      removeFavorite: true,
    };
  },

  ClearFavorites: (vars) => {
    const token = (vars?.sessionToken as string) || "default";
    sessionFavoritesStore.set(token, []);
    return {
      clearFavorites: true,
    };
  },

  BreadcrumbsForRoute: (vars) => {
    const path = (vars?.path as string) || "/";
    const segments = path.split("/").filter(Boolean);
    const crumbs = [{ label: "Home", href: "/", position: 1 }];
    let accum = "";
    segments.forEach((seg, idx) => {
      accum += `/${seg}`;
      const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      crumbs.push({
        label,
        href: idx === segments.length - 1 ? (null as unknown as string) : `${accum}/`,
        position: idx + 2,
      });
    });
    return {
      breadcrumbsForRoute: crumbs,
    };
  },
};
