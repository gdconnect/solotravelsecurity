import type { IconName } from "@/components/atoms/Icon";

export type CardType =
  | "product"
  | "scam"
  | "airport"
  | "micro_zone"
  | "regulatory"
  | "playbook"
  | "country"
  | "topic";

export type CardBadgeTone = "amber" | "green" | "red" | "blue" | "purple" | "neutral";

export interface CardBadge {
  label: string;
  tone?: CardBadgeTone;
  icon?: IconName;
  tooltip?: string;
}

export interface CardMedia {
  type: "icon" | "image" | "map" | "badge";
  src?: string;
  alt?: string;
  iconName?: IconName;
  aspectRatio?: "1:1" | "4:3" | "16:9";
}

export interface CardRatingMetric {
  value: number;
  count: number;
  label?: string;
}

export interface CardPriceMetric {
  formatted: string;
  raw?: number;
  currency?: string;
  tier?: "free" | "under_25" | "25_to_50" | "50_plus";
}

export interface CardRiskMetric {
  tier: "Low" | "Moderate" | "Elevated" | "High" | "Critical";
  score?: number;
}

export interface CardMetrics {
  rating?: CardRatingMetric;
  price?: CardPriceMetric;
  risk?: CardRiskMetric;
}

export interface CardComparison {
  canCompare?: boolean;
  pros?: string[];
  cons?: string[];
  keyDifferentiator?: string;
  benchmarkAgainst?: string;
  comparableItemIds?: string[];
}

export interface CardRelatedRef {
  id: string;
  title: string;
  href: string;
  type?: CardType;
  relation: "mitigates" | "paired_with" | "located_in" | "alternative_to" | "verifies";
}

export interface CardPrimaryAction {
  label: string;
  href: string;
  isExternal?: boolean;
  tone?: "primary" | "secondary" | "accent";
  icon?: IconName;
}

export interface CardActions {
  primary: CardPrimaryAction;
  canFavorite?: boolean;
  canShare?: boolean;
}

/**
 * Universal Contract for Modern Self-Contained Site Cards.
 * Every entity maps cleanly to this structure.
 */
export interface CardData {
  id: string;
  urn: string;
  type: CardType;
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  isExternal?: boolean;
  highlight?: string;
  badges: CardBadge[];
  media?: CardMedia;
  metrics?: CardMetrics;
  comparison?: CardComparison;
  related?: CardRelatedRef[];
  actions: CardActions;
  schemaOrg?: Record<string, unknown>;
}
