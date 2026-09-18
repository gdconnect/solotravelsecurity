import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/templates/PageShell";
import { FacetedSearchClient } from "./FacetedSearchClient";
import { Icon } from "@/components/atoms/Icon";

export const metadata: Metadata = {
  title: "Faceted Search & Intelligence Directory | Solo Travel Security",
  description:
    "Explore and filter solo travel security tools, airport curfew protocols, scam truth tables, and customs regulations with zero cloud tracking.",
};

export default function FacetedSearchPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="mx-auto flex max-w-5xl items-center justify-center py-32 font-mono text-xs text-slate-500">
            <Icon name="loader" className="mr-2 size-4 animate-spin text-amber-500" />
            Loading Security Intelligence Index...
          </div>
        }
      >
        <FacetedSearchClient />
      </Suspense>
    </PageShell>
  );
}
