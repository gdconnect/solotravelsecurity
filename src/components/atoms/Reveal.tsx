import type { CSSProperties, ReactNode } from "react";

/**
 * ATOM — Reveal.
 * Pure CSS entrance animation: each .reveal plays `reveal-in` once when the
 * element is first connected to the DOM. No JS, no IntersectionObserver, no
 * hydration cost. `animation-delay` honours `delay` for staggered reveals.
 *
 * Respects prefers-reduced-motion via the global CSS guard in globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`reveal-on-mount ${className}`}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
