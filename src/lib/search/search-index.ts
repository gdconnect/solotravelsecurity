import type {
  SearchableItem,
  SearchFilterState,
  FacetGroupCounts,
  FacetPriceTier,
  FacetFormat,
  FacetRiskTier,
  FacetItemType,
} from "./types";
import { GEAR_CATALOG } from "@/data/gear/matcher";
import { PREPOPULATED_SCAMS } from "@/data/lego/scams";
import { PREPOPULATED_AIRPORTS } from "@/data/lego/airports";
import { PREPOPULATED_MICRO_ZONES } from "@/data/lego/micro-zones";
import { PREPOPULATED_REGULATORY_LANDMINES } from "@/data/lego/regulatory";
import { SECURITY_VECTORS } from "@/data/vectors";
import type { TripPlan, TravelerPersona } from "@/lib/personalization/types";

export const CATEGORY_LABELS: Record<string, string> = {
  perimeter_defense: "Perimeter Defense",
  transit_security: "Transit Security",
  digital_connectivity: "Digital Connectivity",
  asset_protection: "Asset Protection",
  power_hardware: "Power & Hardware",
  medical_hygiene: "Medical & Hygiene",
  travel_insurance: "Travel Insurance",
  books_guides: "Books & Field Guides",
  privacy_saas: "Privacy & VPN SaaS",
  local_services: "Verified Local Services",
  counterfeit_official: "Counterfeit Officials",
  financial_extortion: "Financial Extortion",
  distraction_theft: "Distraction Theft",
  nightlife_drink_spiking: "Nightlife & Drink Safety",
  airport_curfew: "Airport Ingress & Curfews",
  customs_regulation: "Customs & Drug Laws",
  general_vector: "Universal Security Vector",
};

function determinePriceTier(priceStr?: string): FacetPriceTier {
  if (!priceStr) return "free";
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num === 0) return "free";
  if (num < 25) return "under_25";
  if (num <= 50) return "25_to_50";
  return "50_plus";
}

function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];

  // 1. Ingest Product Catalog
  for (const product of GEAR_CATALOG) {
    const priceTier = determinePriceTier(product.schemaOrg.price);
    const isDigital =
      product.category === "digital_connectivity" ||
      product.category === "privacy_saas" ||
      product.category === "travel_insurance";

    items.push({
      id: product.sku,
      title: product.name,
      slug: product.sku.toLowerCase(),
      url: product.schemaOrg.affiliateUrl,
      type: "product",
      category: product.category,
      categoryLabel: CATEGORY_LABELS[product.category] || product.category,
      description: product.situationalRationale,
      archetypes: ["solo-female", "first-time-solo", "digital-nomad", "all"],
      riskTiers: ["Low", "Moderate", "Elevated", "High", "Critical"],
      format: isDigital ? "digital_tool" : "physical_gear",
      priceTier,
      priceFormatted: product.schemaOrg.price ? `$${product.schemaOrg.price}` : undefined,
      rating: product.schemaOrg.rating?.value,
      ratingCount: product.schemaOrg.rating?.count,
      affiliateUrl: product.schemaOrg.affiliateUrl,
      pros: product.schemaOrg.pros,
      cons: product.schemaOrg.cons,
      keyHighlight: product.schemaOrg.pros?.[0] || product.category,
    });
  }

  // 2. Ingest Prepopulated Scams & Truth Tables
  for (const scam of PREPOPULATED_SCAMS) {
    items.push({
      id: scam.id,
      title: scam.name,
      slug: scam.slug,
      url: `/playbook/destinations/${scam.associatedDestinations[0] || "rome"}/`,
      type: "scam",
      category: scam.vectorCategory,
      categoryLabel: CATEGORY_LABELS[scam.vectorCategory] || scam.vectorCategory,
      description: scam.deceptiveHook.psychologicalTrigger,
      tagline: scam.deceptiveHook.openingPhrase,
      archetypes: ["solo-female", "first-time-solo", "digital-nomad", "all"],
      riskTiers: [
        scam.severity === "Critical" ? "Critical" : scam.severity === "High" ? "High" : "Moderate",
      ],
      destinations: scam.associatedDestinations,
      format: "truth_table",
      priceTier: "free",
      keyHighlight: `Truth Table: ${scam.truthTable.conditions.length} verifiable checks`,
    });
  }

  // 3. Ingest Airport Ingress Hubs
  for (const airport of PREPOPULATED_AIRPORTS) {
    items.push({
      id: `hub-${airport.iata.toLowerCase()}`,
      title: `${airport.name} (${airport.iata}) Ingress Guide`,
      slug: airport.iata.toLowerCase(),
      url: `/playbook/airports/${airport.iata.toLowerCase()}/`,
      type: "airport",
      category: "airport_curfew",
      categoryLabel: "Airport Ingress & Curfews",
      description: `Late-night arrival guide, express train curfew (${airport.lateNightCurfew.expressRailLastDeparture}), official taxi booth coordinates, and tout bypass blueprints for ${airport.city}.`,
      archetypes: ["solo-female", "first-time-solo", "digital-nomad", "all"],
      riskTiers: ["Moderate", "High", "Critical"],
      destinations: [airport.citySlug],
      format: "field_protocol",
      priceTier: "free",
      keyHighlight: `Rail Curfew: ${airport.lateNightCurfew.expressRailLastDeparture}`,
    });
  }

  // 4. Ingest Security Vectors
  for (const vec of SECURITY_VECTORS) {
    items.push({
      id: `vector-${vec.slug}`,
      title: vec.title,
      slug: vec.slug,
      url: `/playbook/topics/${vec.slug}/`,
      type: "topic",
      category: "general_vector",
      categoryLabel: "Universal Security Vector",
      description: vec.primaryJob,
      tagline: vec.tagline,
      archetypes: ["solo-female", "first-time-solo", "digital-nomad", "all"],
      riskTiers: ["Low", "Moderate", "Elevated", "High"],
      format: "field_protocol",
      priceTier: "free",
      keyHighlight: `${vec.actionProtocol.length} Protocol Steps`,
    });
  }

  // 5. Ingest Regulatory Landmines
  for (const reg of PREPOPULATED_REGULATORY_LANDMINES) {
    items.push({
      id: reg.id,
      title: `${reg.title} (${reg.countryName})`,
      slug: reg.id,
      url: `/playbook/countries/${reg.countryCode.toLowerCase()}/`,
      type: "regulatory",
      category: "customs_regulation",
      categoryLabel: "Customs & Drug Laws",
      description: reg.proceduralAction,
      archetypes: ["first-time-solo", "digital-nomad", "all"],
      riskTiers: ["High", "Critical"],
      format: "customs_rule",
      priceTier: "free",
      keyHighlight: `Status: ${reg.legalStatus.replace(/_/g, " ").toUpperCase()}`,
    });
  }

  // 6. Ingest Micro-Zones & Safe Sanctuaries
  for (const zone of PREPOPULATED_MICRO_ZONES) {
    items.push({
      id: zone.id,
      title: `${zone.name} Safety Profile (${zone.citySlug.toUpperCase()})`,
      slug: zone.id,
      url: `/playbook/destinations/${zone.citySlug}/`,
      type: "micro_zone",
      category: "transit_security",
      categoryLabel: "Micro-Zone & Street Safety",
      description: `Day Risk: Tier ${zone.dayRiskTier}, Night Risk: Tier ${zone.nightRiskTier}. Solo Female Walkability: ${zone.soloFemaleWalkabilityRating}/5. Red flag corridors: ${zone.redFlagCorridors.join("; ")}.`,
      tagline: `Safe Thoroughfares: ${zone.safeThoroughfares[0] || "Main Thoroughfare"}`,
      archetypes: ["solo-female", "first-time-solo", "digital-nomad", "all"],
      riskTiers: [
        zone.nightRiskTier >= 4 ? "Critical" : zone.nightRiskTier === 3 ? "High" : "Moderate",
      ],
      destinations: [zone.citySlug],
      format: "field_protocol",
      priceTier: "free",
      keyHighlight: `Sanctuaries: ${zone.sanctuaries.length} 24/7 safe havens`,
    });
  }

  return items;
}

export const SEARCH_INDEX: SearchableItem[] = buildSearchIndex();

export function filterSearchItems(
  items: SearchableItem[],
  filter: SearchFilterState,
  tripContext?: { trip: TripPlan; persona: TravelerPersona } | null,
): SearchableItem[] {
  let filtered = [...items];

  // 1. Text Search Filter (Case-insensitive substring search across title, description, category, tags)
  if (filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inCat = item.categoryLabel.toLowerCase().includes(q);
      const inTagline = item.tagline?.toLowerCase().includes(q);
      const inHighlight = item.keyHighlight?.toLowerCase().includes(q);
      const inPros = item.pros?.some((p) => p.toLowerCase().includes(q));
      return inTitle || inDesc || inCat || inTagline || inHighlight || inPros;
    });
  }

  // 2. Item Type Facet
  if (filter.types.length > 0) {
    filtered = filtered.filter((item) => filter.types.includes(item.type));
  }

  // 3. Category Facet
  if (filter.categories.length > 0) {
    filtered = filtered.filter((item) => filter.categories.includes(item.category));
  }

  // 4. Format Facet
  if (filter.formats.length > 0) {
    filtered = filtered.filter((item) => filter.formats.includes(item.format));
  }

  // 5. Price Tier Facet
  if (filter.priceTiers.length > 0) {
    filtered = filtered.filter((item) => filter.priceTiers.includes(item.priceTier));
  }

  // 6. Risk Tier Facet
  if (filter.riskTiers.length > 0) {
    filtered = filtered.filter((item) => item.riskTiers.some((r) => filter.riskTiers.includes(r)));
  }

  // 7. Archetype Facet
  if (filter.archetypes.length > 0) {
    filtered = filtered.filter((item) =>
      item.archetypes.some((a) => a === "all" || filter.archetypes.includes(a)),
    );
  }

  // 8. Personalization Filter / Boost
  if (filter.personalizedOnly && tripContext) {
    const activeCity = tripContext.trip.destinationCity.toLowerCase();
    const activeRisk = tripContext.trip.destinationRiskTier;

    filtered = filtered.filter((item) => {
      // Direct destination match
      if (item.destinations?.some((d) => d.toLowerCase().includes(activeCity))) return true;
      // High-priority risk match
      if (item.riskTiers.includes(activeRisk as FacetRiskTier)) return true;
      // Universal tools
      if (
        item.type === "product" &&
        (item.category === "perimeter_defense" || item.category === "digital_connectivity")
      )
        return true;
      return false;
    });
  }

  // 9. Sorting
  filtered.sort((a, b) => {
    if (filter.sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (filter.sortBy === "price_asc") {
      const pA = a.priceFormatted ? parseFloat(a.priceFormatted.replace(/[^0-9.]/g, "")) : 0;
      const pB = b.priceFormatted ? parseFloat(b.priceFormatted.replace(/[^0-9.]/g, "")) : 0;
      return pA - pB;
    }
    if (filter.sortBy === "price_desc") {
      const pA = a.priceFormatted ? parseFloat(a.priceFormatted.replace(/[^0-9.]/g, "")) : 0;
      const pB = b.priceFormatted ? parseFloat(b.priceFormatted.replace(/[^0-9.]/g, "")) : 0;
      return pB - pA;
    }
    if (filter.sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    // Default: relevance / priority
    return 0;
  });

  return filtered;
}

export function calculateFacetCounts(
  currentFilteredItems: SearchableItem[],
  allItems: SearchableItem[] = SEARCH_INDEX,
  filter?: SearchFilterState,
  tripContext?: { trip: TripPlan; persona: TravelerPersona } | null,
): FacetGroupCounts {
  // Hybrid Active-Only Disjunctive Faceting:
  // For any facet group with >= 1 active selection, compute prospective counts by relaxing ONLY that group.
  // For any facet group with 0 selections, extract counts directly from currentFilteredItems (0 extra cost).

  const typesPool =
    filter && filter.types.length > 0
      ? filterSearchItems(allItems, { ...filter, types: [] }, tripContext)
      : currentFilteredItems;

  const categoriesPool =
    filter && filter.categories.length > 0
      ? filterSearchItems(allItems, { ...filter, categories: [] }, tripContext)
      : currentFilteredItems;

  const formatsPool =
    filter && filter.formats.length > 0
      ? filterSearchItems(allItems, { ...filter, formats: [] }, tripContext)
      : currentFilteredItems;

  const priceTiersPool =
    filter && filter.priceTiers.length > 0
      ? filterSearchItems(allItems, { ...filter, priceTiers: [] }, tripContext)
      : currentFilteredItems;

  const riskTiersPool =
    filter && filter.riskTiers.length > 0
      ? filterSearchItems(allItems, { ...filter, riskTiers: [] }, tripContext)
      : currentFilteredItems;

  const archetypesPool =
    filter && filter.archetypes.length > 0
      ? filterSearchItems(allItems, { ...filter, archetypes: [] }, tripContext)
      : currentFilteredItems;

  const typesMap = new Map<string, number>();
  for (const item of typesPool) {
    typesMap.set(item.type, (typesMap.get(item.type) || 0) + 1);
  }

  const categoriesMap = new Map<string, number>();
  for (const item of categoriesPool) {
    categoriesMap.set(item.category, (categoriesMap.get(item.category) || 0) + 1);
  }

  const formatsMap = new Map<string, number>();
  for (const item of formatsPool) {
    formatsMap.set(item.format, (formatsMap.get(item.format) || 0) + 1);
  }

  const priceTiersMap = new Map<string, number>();
  for (const item of priceTiersPool) {
    priceTiersMap.set(item.priceTier, (priceTiersMap.get(item.priceTier) || 0) + 1);
  }

  const riskTiersMap = new Map<string, number>();
  for (const item of riskTiersPool) {
    for (const r of item.riskTiers) {
      riskTiersMap.set(r, (riskTiersMap.get(r) || 0) + 1);
    }
  }

  const archetypesMap = new Map<string, number>();
  for (const item of archetypesPool) {
    for (const a of item.archetypes) {
      archetypesMap.set(a, (archetypesMap.get(a) || 0) + 1);
    }
  }

  const formatLabels: Record<FacetFormat, string> = {
    physical_gear: "Physical Hardware",
    digital_tool: "Digital App / SaaS",
    truth_table: "Scam Truth Table",
    field_protocol: "Field Playbook",
    customs_rule: "Legal / Customs Rule",
  };

  const typeLabels: Record<FacetItemType, string> = {
    product: "Products & Gear",
    scam: "Scams & Threat Dossiers",
    airport: "Airport Ingress Hubs",
    micro_zone: "Micro-Zone Street Profiles",
    topic: "Security Vectors",
    regulatory: "Customs & Regulations",
  };

  const priceLabels: Record<FacetPriceTier, string> = {
    free: "Free Open Protocol",
    under_25: "Under $25",
    "25_to_50": "$25 - $50",
    "50_plus": "$50+",
  };

  const universalArchCount = archetypesMap.get("all") || 0;

  return {
    types: (
      ["product", "scam", "airport", "micro_zone", "topic", "regulatory"] as FacetItemType[]
    ).map((t) => ({
      value: t,
      label: typeLabels[t] || t,
      count: typesMap.get(t) || 0,
    })),
    categories: Array.from(new Set(allItems.map((i) => i.category))).map((c) => ({
      value: c,
      label: CATEGORY_LABELS[c] || c,
      count: categoriesMap.get(c) || 0,
    })),
    formats: (
      [
        "physical_gear",
        "digital_tool",
        "truth_table",
        "field_protocol",
        "customs_rule",
      ] as FacetFormat[]
    ).map((f) => ({
      value: f,
      label: formatLabels[f] || f,
      count: formatsMap.get(f) || 0,
    })),
    priceTiers: (["free", "under_25", "25_to_50", "50_plus"] as FacetPriceTier[]).map((p) => ({
      value: p,
      label: priceLabels[p] || p,
      count: priceTiersMap.get(p) || 0,
    })),
    riskTiers: (["Low", "Moderate", "Elevated", "High", "Critical"] as FacetRiskTier[]).map(
      (r) => ({
        value: r,
        label: `${r} Risk`,
        count: riskTiersMap.get(r) || 0,
      }),
    ),
    archetypes: [
      {
        value: "solo-female",
        label: "Solo Female",
        count: (archetypesMap.get("solo-female") || 0) + universalArchCount,
      },
      {
        value: "first-time-solo",
        label: "First-Time Solo",
        count: (archetypesMap.get("first-time-solo") || 0) + universalArchCount,
      },
      {
        value: "digital-nomad",
        label: "Digital Nomad",
        count: (archetypesMap.get("digital-nomad") || 0) + universalArchCount,
      },
    ],
  };
}
