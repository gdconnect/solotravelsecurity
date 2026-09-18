"use client";

import { useState, useEffect, useCallback } from "react";
import type { FavoriteItem } from "./types";
import { FAVORITES_UPDATE_EVENT } from "./types";
import {
  getStoredFavorites,
  isFavorite as checkIsFavorite,
  toggleFavorite as toggleStoredFavorite,
  removeFavorite as removeStoredFavorite,
  clearFavorites as clearStoredFavorites,
} from "./storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const refresh = useCallback(() => {
    setFavorites(getStoredFavorites());
  }, []);

  useEffect(() => {
    setIsMounted(true);
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(FAVORITES_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(FAVORITES_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const toggle = useCallback((item: Omit<FavoriteItem, "savedAt">) => {
    const result = toggleStoredFavorite(item);
    setFavorites(getStoredFavorites());
    return result;
  }, []);

  const remove = useCallback((id: string) => {
    removeStoredFavorite(id);
    setFavorites(getStoredFavorites());
  }, []);

  const clear = useCallback(() => {
    clearStoredFavorites();
    setFavorites([]);
  }, []);

  const check = useCallback(
    (id: string) => {
      if (!isMounted) return false;
      return checkIsFavorite(id);
    },
    [isMounted],
  );

  return {
    favorites,
    count: isMounted ? favorites.length : 0,
    isFavorite: check,
    toggleFavorite: toggle,
    removeFavorite: remove,
    clearFavorites: clear,
    isMounted,
  };
}
