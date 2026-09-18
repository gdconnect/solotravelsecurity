import type { FavoriteItem } from "./types";
import { FAVORITES_STORAGE_KEY, FAVORITES_UPDATE_EVENT } from "./types";

function notifyChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FAVORITES_UPDATE_EVENT));
  }
}

export function getStoredFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteItem[];
  } catch (err) {
    console.error("[favorites] Failed to parse favorites from localStorage:", err);
    return [];
  }
}

export function isFavorite(id: string): boolean {
  const current = getStoredFavorites();
  return current.some((item) => item.id === id);
}

export function addFavorite(item: Omit<FavoriteItem, "savedAt">): void {
  if (typeof window === "undefined") return;
  const current = getStoredFavorites();
  if (current.some((f) => f.id === item.id)) return;

  const newFav: FavoriteItem = {
    ...item,
    savedAt: new Date().toISOString(),
  };

  const updated = [newFav, ...current];
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (err) {
    console.error("[favorites] Failed to save favorite:", err);
  }
}

export function removeFavorite(id: string): void {
  if (typeof window === "undefined") return;
  const current = getStoredFavorites();
  const updated = current.filter((f) => f.id !== id);

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    notifyChange();
  } catch (err) {
    console.error("[favorites] Failed to remove favorite:", err);
  }
}

export function toggleFavorite(item: Omit<FavoriteItem, "savedAt">): boolean {
  if (isFavorite(item.id)) {
    removeFavorite(item.id);
    return false;
  } else {
    addFavorite(item);
    return true;
  }
}

export function clearFavorites(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    notifyChange();
  } catch (err) {
    console.error("[favorites] Failed to clear favorites:", err);
  }
}

export function exportFavoritesJson(): string {
  const current = getStoredFavorites();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      generator: "SoloTravelSecurity.com (Local-First Zero-PII)",
      favoritesCount: current.length,
      favorites: current,
    },
    null,
    2,
  );
}
