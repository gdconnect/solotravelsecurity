"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import { Icon } from "@/components/atoms/Icon";

export function HeaderFavoritesBadge() {
  const { count, isMounted } = useFavorites();

  return (
    <Link
      href="/portal/"
      title="View your saved items & private favorites"
      className="relative inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-900/5 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-rose-400"
    >
      <Icon name="heart" className="size-4" />
      {isMounted && count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[9px] font-black text-white shadow-xs animate-in zoom-in-50">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
