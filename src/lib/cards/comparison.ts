"use client";

import { useState, useEffect, useCallback } from "react";

export const COMPARISON_STORAGE_KEY = "sts_comparison_items";
export const COMPARISON_UPDATE_EVENT = "sts_comparison_update";
export const MAX_COMPARISON_ITEMS = 3;

function notifyComparisonChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMPARISON_UPDATE_EVENT));
  }
}

export function getStoredComparisonIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARISON_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function isInComparison(id: string): boolean {
  return getStoredComparisonIds().includes(id);
}

export function addToComparison(id: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getStoredComparisonIds();
  if (current.includes(id)) return true;
  if (current.length >= MAX_COMPARISON_ITEMS) {
    return false; // Reached maximum capacity
  }
  const updated = [...current, id];
  try {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated));
    notifyComparisonChange();
    return true;
  } catch {
    return false;
  }
}

export function removeFromComparison(id: string): void {
  if (typeof window === "undefined") return;
  const current = getStoredComparisonIds();
  const updated = current.filter((i) => i !== id);
  try {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated));
    notifyComparisonChange();
  } catch {
    // ignore
  }
}

export function toggleComparison(id: string): boolean {
  if (isInComparison(id)) {
    removeFromComparison(id);
    return false;
  } else {
    return addToComparison(id);
  }
}

export function clearComparison(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(COMPARISON_STORAGE_KEY);
    notifyComparisonChange();
  } catch {
    // ignore
  }
}

/**
 * SSR-safe reactive React hook for card comparison.
 */
export function useComparison() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setComparisonIds(getStoredComparisonIds());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener(COMPARISON_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(COMPARISON_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const toggle = useCallback((id: string) => {
    return toggleComparison(id);
  }, []);

  const clear = useCallback(() => {
    clearComparison();
  }, []);

  return {
    comparisonIds,
    isLoaded,
    count: comparisonIds.length,
    isComparing: (id: string) => comparisonIds.includes(id),
    toggle,
    remove: removeFromComparison,
    clear,
  };
}
