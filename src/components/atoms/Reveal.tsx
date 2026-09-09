"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * ATOM — Reveal.
 * Scroll-triggered entrance with singleton IntersectionObserver (KISS/DRY).
 * Respects prefers-reduced-motion without layout thrashing.
 */
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver() {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "60px 0px" },
    );
  }
  return sharedObserver;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const obs = getSharedObserver();
    if (!obs) {
      el.classList.add("is-visible");
      return;
    }

    obs.observe(el);
    return () => {
      obs.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
