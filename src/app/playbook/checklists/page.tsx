import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { cachedFetchGraphQL } from "@/lib/graphql/cached-fetch";
import { GenerateChecklistDocument } from "@/lib/graphql/__generated__/documents";
import type { GenerateChecklistQuery } from "@/lib/graphql/__generated__/types";
import { RiskTier } from "@/lib/graphql/__generated__/types";
import { parseGeneratedChecklist, type ValidatedGeneratedChecklist } from "@/lib/schemas/checklist";
import { generateSituationalChecklist } from "@/lib/engine/checklist-generator";
import { ChecklistClientEngine } from "./ChecklistClientEngine";
import { SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Situational Solo Travel Security Checklists & Inoculation Matrices",
  description:
    "Exhaustive procedural security checklists calibrated by traveler archetype, destination risk tier, and travel lifecycle phase. Enforced by mathematical scoring and Single Point of Failure (SPOF) immunity gates.",
  openGraph: {
    title: "Solo Travel Security Checklists & Scoring Matrices",
    description:
      "Actionable procedural guardrails across 7 security pillars: physical perimeter, financial redundancy, first-mile transit, and scam deflection.",
    type: "website",
  },
};

const loadInitialChecklist = cache(async (): Promise<ValidatedGeneratedChecklist> => {
  try {
    const result = await cachedFetchGraphQL<GenerateChecklistQuery>({
      query: GenerateChecklistDocument,
      variables: {
        input: {
          archetype: "solo-female",
          destinationRiskTier: RiskTier.Moderate,
        },
      },
      operationName: "GenerateChecklist",
    });

    if (result?.generateChecklist) {
      const validated = parseGeneratedChecklist(result.generateChecklist);
      if (validated) return validated;
    }
  } catch {
    // Non-fatal fallback to local engine
  }

  return generateSituationalChecklist({
    archetype: "solo-female",
    destinationRiskTier: "MODERATE",
  });
});

export default async function ChecklistsIndexPage() {
  const initialChecklist = await loadInitialChecklist();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/playbook/checklists/#list`,
        name: "Solo Travel Security Action Checklists",
        description:
          "Situational procedural security protocols across physical perimeter, financial redundancy, transit ingress, and conflict de-escalation.",
        numberOfItems: initialChecklist.totalItems,
        itemListElement: initialChecklist.items.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.title,
          description: item.description,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Playbook", item: `${SITE_URL}/playbook/` },
          { "@type": "ListItem", position: 3, name: "Checklists & Scoring Matrices" },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumb nav */}
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
                Checklists & Scoring Matrices
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="amber">
              <Icon name="shield" className="size-3" />
              Taxonomy & Procedural Engine
            </Badge>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              7 Pillars · 9 Phases · 10 Threat Vectors
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            Situational Security
            <span className="block text-amber-700 dark:text-amber-300">Checklists & Matrices.</span>
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            Move from vague advice to mathematically verified risk management. Every directive is
            anchored to formal Decision Tables, multi-dimensional scoring weights, and Single Point
            of Failure (SPOF) immunity gates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/playbook/decision-matrices"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-display text-xs font-bold text-slate-800 shadow-xs transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon name="table" className="size-3.5 text-amber-600" />
              Inspect Decision Tables & Truth Tables →
            </Link>
          </div>
        </Reveal>

        {/* Interactive Engine Island */}
        <div className="mt-12">
          <ChecklistClientEngine initialChecklist={initialChecklist} />
        </div>
      </div>
    </PageShell>
  );
}
