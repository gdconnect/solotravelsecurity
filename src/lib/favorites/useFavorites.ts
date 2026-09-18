"use client";

import { useCallback, useMemo } from "react";
import type { FavoriteItem } from "./types";
import { FAVORITES_UPDATE_EVENT } from "./types";
import {
  getStoredFavorites,
  toggleFavorite as toggleStoredFavorite,
  removeFavorite as removeStoredFavorite,
  clearFavorites as clearStoredFavorites,
} from "./storage";
import { useStorageVersion } from "@/lib/use-storage-version";

const FAVORITES_EVENTS = [FAVORITES_UPDATE_EVENT] as const;

export function useFavorites() {
  const version = useStorageVersion(FAVORITES_EVENTS);
  const isMounted = version >= 0;

  const favorites = useMemo<FavoriteItem[]>(
    () => (version >= 0 ? getStoredFavorites() : []),
    [version],
  );

  // Storage writers dispatch FAVORITES_UPDATE_EVENT, which bumps `version`.
  const toggle = useCallback(
    (item: Omit<FavoriteItem, "savedAt">) => toggleStoredFavorite(item),
    [],
  );
  const remove = useCallback((id: string) => removeStoredFavorite(id), []);
  const clear = useCallback(() => clearStoredFavorites(), []);
  const check = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites]);

  return {
    favorites,
    count: favorites.length,
    isFavorite: check,
    toggleFavorite: toggle,
    removeFavorite: remove,
    clearFavorites: clear,
    isMounted,
  };
}
