import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { DecisionMatricesClientExplorer } from "./DecisionMatricesClientExplorer";
import { SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Deterministic Decision Tables & Formal Truth Tables | Solo Travel Security",
  description:
    "Explore the mathematical logic powering Solo Travel Security: multi-variable condition-action decision tables and exhaustive 5-proposition truth tables with zero contradictions.",
  openGraph: {
    title: "Decision Tables & Truth Tables | Solo Travel Security",
    description:
      "Mathematical risk modeling replacing vague safety tips with exhaustive truth tables and deterministic protocols.",
    type: "website",
  },
};

export default function DecisionMatricesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/playbook/decision-matrices/#page`,
        name: "Deterministic Decision Tables & Formal Truth Tables",
        description:
          "Formal condition-action rules and boolean logic matrices resolving solo travel threats.",
        url: `${SITE_URL}/playbook/decision-matrices/`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Playbook", item: `${SITE_URL}/playbook/` },
          { "@type": "ListItem", position: 3, name: "Decision Tables & Truth Tables" },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-400">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/playbook" className="hover:text-amber-700 dark:hover:text-amber-400">
                Playbook
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                Decision Tables & Truth Tables
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="amber">
              <Icon name="table" className="size-3" />
              Formal Logic & Verification
            </Badge>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              Zero Unhandled Edge Cases · 100% Deterministic
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            Decision Tables &
            <span className="block text-amber-700 dark:text-amber-300">Formal Truth Tables.</span>
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            High-stakes travel decisions cannot rely on intuition or narrative blogs. We employ
            multi-variable decision tables and formal boolean truth tables to guarantee
            mathematically sound, non-contradictory security actions for every environmental state.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/playbook/checklists"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-xs font-black text-slate-950 transition hover:bg-amber-300"
            >
              <Icon name="check" className="size-4" />
              Open Interactive Checklists & Scoring Matrix →
            </Link>
          </div>
        </Reveal>

        {/* Interactive Explorer */}
        <div className="mt-12">
          <DecisionMatricesClientExplorer />
        </div>
      </div>
    </PageShell>
  );
}
