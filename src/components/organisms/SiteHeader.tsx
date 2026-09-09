import Link from "next/link";
import { Logo } from "@/components/atoms";

/**
 * ORGANISM — SiteHeader.
 * Minimal header for a one-page coming-soon site.
 * Brand mark left, email-jump anchor right. No mobile drawer (KISS).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-slate-50/85 backdrop-blur-xl transition-colors duration-200 dark:border-white/10 dark:bg-slate-950/85">
      <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-950"
        >
          <Logo />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-4">
          <Link
            href="#about"
            className="hidden rounded-full px-3 py-2 text-sm font-extrabold text-slate-700 transition hover:bg-slate-900/5 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:inline-block dark:text-amber-50/80 dark:hover:bg-white/10 dark:hover:text-amber-50"
          >
            About
          </Link>
          <Link
            href="#notify"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-4 text-sm font-extrabold text-amber-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 dark:focus-visible:ring-offset-slate-950"
          >
            Notify me
          </Link>
        </nav>
      </div>
    </header>
  );
}
