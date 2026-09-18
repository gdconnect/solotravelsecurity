export type FavoriteItemType =
  | "product"
  | "scam"
  | "airport"
  | "topic"
  | "checklist"
  | "regulatory";

export interface FavoriteItem {
  id: string;
  type: FavoriteItemType;
  title: string;
  url: string;
  category: string;
  description: string;
  price?: string;
  rating?: number;
  badge?: string;
  savedAt: string; // ISO 8601 string
}

export const FAVORITES_STORAGE_KEY = "sts_favorites";
export const FAVORITES_UPDATE_EVENT = "sts_favorites_update";
