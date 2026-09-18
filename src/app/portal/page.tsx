import type { Metadata } from "next";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { TravelerPortalClient } from "./TravelerPortalClient";
import { SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Solo Traveler Private Command Portal · Personalized Ingress & Vault",
  description:
    "Device-local personal workspace for solo travelers. Manage pre-, during-, and post-trip security checklists, smart situational reminders, emergency medical translations, and offline cutouts.",
  openGraph: {
    title: "Solo Traveler Private Command Portal",
    description:
      "Deterministic, privacy-first security management for solo travelers. Zero server tracking.",
    type: "website",
  },
};

export default function TravelerPortalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/portal#app`,
        name: "Solo Traveler Private Command Portal",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Any",
        description:
          "Device-local, client-side trip lifecycle management and situational security protocols for solo travelers.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header Breadcrumbs & Eyebrow */}
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge tone="amber">
                <Icon name="shield" className="size-3" />
                Personal Command Center
              </Badge>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                / Lifecycle Operations
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-emerald-700 dark:text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-bold uppercase tracking-wider">
                Local-First · Stored Only on This Device
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-black text-slate-900 sm:text-4xl dark:text-amber-50">
              Your Solo Travel Ingress Command.
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Every trip carries unique vulnerabilities. Manage your pre-departure staging,
              first-mile transit gates, daily sunset postures, and post-trip card skimming audits in
              a private, on-device workspace.
            </p>
          </div>
        </Reveal>

        {/* Client Interactive Island */}
        <TravelerPortalClient />
      </div>
    </PageShell>
  );
}
