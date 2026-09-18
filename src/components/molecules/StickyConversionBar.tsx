"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/atoms/Icon";
import { FavoriteButton } from "@/components/atoms";

interface StickyConversionBarProps {
  destinationName: string;
  archetypeName: string;
  vectorTitle: string;
  pageUrl: string;
  pageId: string;
}

export function StickyConversionBar({
  destinationName,
  archetypeName,
  vectorTitle,
  pageUrl,
  pageId,
}: StickyConversionBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px down
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || isDismissed) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Action Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-500/30 bg-slate-950/95 px-4 py-3 text-white backdrop-blur-md shadow-2xl transition-all duration-300 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        {/* Context Summary */}
        <div className="hidden md:flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Icon name="shield" className="size-4" />
          </span>
          <div>
            <div className="font-display text-xs font-black text-amber-300">
              {archetypeName} in {destinationName}
            </div>
            <div className="font-mono text-[11px] text-slate-400 truncate max-w-xs">
              {vectorTitle}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2.5">
          <button
            type="button"
            onClick={() => scrollToSection("assessment")}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 font-display text-xs font-black text-slate-950 shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Icon name="sliders" className="size-3.5" />
            <span>30s Audit</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("emergency-card")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 font-display text-xs font-bold text-slate-200 transition-colors hover:bg-slate-800"
          >
            <Icon name="download" className="size-3.5 text-amber-400" />
            <span>Wallet Card</span>
          </button>

          <div className="border-l border-slate-800 pl-2">
            <FavoriteButton
              item={{
                id: pageId,
                type: "topic",
                title: `${archetypeName} in ${destinationName}: ${vectorTitle}`,
                url: pageUrl,
                category: "field_playbook",
                description: `Complete security and transit protocol for ${archetypeName} in ${destinationName}.`,
                badge: "Playbook",
              }}
              size="sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="ml-1 rounded-md p-1.5 text-slate-400 hover:text-white"
            aria-label="Dismiss quick conversion bar"
          >
            <Icon name="x" className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
