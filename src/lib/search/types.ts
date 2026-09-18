export type FacetItemType = "product" | "scam" | "airport" | "micro_zone" | "topic" | "regulatory";

export type FacetFormat =
  | "physical_gear"
  | "digital_tool"
  | "truth_table"
  | "field_protocol"
  | "customs_rule";

export type FacetPriceTier = "free" | "under_25" | "25_to_50" | "50_plus";

export type FacetRiskTier = "Low" | "Moderate" | "Elevated" | "High" | "Critical";

export interface SearchableItem {
  id: string;
  title: string;
  slug: string;
  url: string;
  type: FacetItemType;
  category: string;
  categoryLabel: string;
  pillarId?: string;
  description: string;
  tagline?: string;
  archetypes: string[];
  riskTiers: FacetRiskTier[];
  destinations?: string[];
  format: FacetFormat;
  priceTier: FacetPriceTier;
  priceFormatted?: string;
  rating?: number;
  ratingCount?: number;
  affiliateUrl?: string;
  pros?: string[];
  cons?: string[];
  keyHighlight?: string;
}

export interface SearchFilterState {
  query: string;
  types: FacetItemType[];
  categories: string[];
  archetypes: string[];
  riskTiers: FacetRiskTier[];
  formats: FacetFormat[];
  priceTiers: FacetPriceTier[];
  sortBy: "relevance" | "rating" | "price_asc" | "price_desc" | "title";
  personalizedOnly: boolean;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetGroupCounts {
  types: FacetOption[];
  categories: FacetOption[];
  archetypes: FacetOption[];
  riskTiers: FacetOption[];
  formats: FacetOption[];
  priceTiers: FacetOption[];
}
