import type { ReactNode } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { SiteHeader } from "@/components/organisms/SiteHeader";

/**
 * TEMPLATE — PageShell.
 * The single page frame: skip link → header → content → footer.
 * (Templates = page-level composition of organisms, per Brad Frost.)
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 font-body text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-amber-50">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
