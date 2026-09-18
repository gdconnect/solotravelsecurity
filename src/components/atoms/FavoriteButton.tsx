"use client";

import type { MouseEvent } from "react";
import { useFavorites } from "@/lib/favorites";
import type { FavoriteItem } from "@/lib/favorites";
import { Icon } from "@/components/atoms/Icon";

export interface FavoriteButtonProps {
  item: Omit<FavoriteItem, "savedAt">;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({
  item,
  size = "md",
  showLabel = false,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isMounted } = useFavorites();
  const active = isMounted && isFavorite(item.id);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  const sizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-2 text-sm",
    lg: "px-3 py-2 text-sm",
  }[size];

  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-4.5",
  }[size];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        active ? `Remove ${item.title} from favorites` : `Save ${item.title} to favorites`
      }
      title={active ? "Saved in your private browser kit" : "Save to your private browser kit"}
      className={`group relative inline-flex items-center gap-1.5 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
        active
          ? "border-rose-300 bg-rose-50 text-rose-600 shadow-2xs dark:border-rose-900/80 dark:bg-rose-950/40 dark:text-rose-400"
          : "border-slate-200 bg-white/90 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200"
      } ${sizeClasses} ${className}`}
    >
      <Icon
        name="heart"
        className={`${iconSizes} transition-transform group-hover:scale-110 ${
          active
            ? "fill-rose-500 stroke-rose-500 dark:fill-rose-400 dark:stroke-rose-400"
            : "fill-none stroke-current"
        }`}
      />
      {showLabel && (
        <span className="font-display text-xs font-bold">{active ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}
