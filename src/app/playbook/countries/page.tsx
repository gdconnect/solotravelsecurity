import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { getAllCountries } from "@/data/geo/countries";
import type { EnrichedCountry } from "@/lib/geo/types";
import { CountryDirectoryGrid } from "@/components/organisms/CountryDirectoryGrid";
import { SITE_URL } from "@/lib/schema";
import { cachedFetchGraphQL } from "@/lib/graphql/cached-fetch";
import { AllCountriesDocument } from "@/lib/graphql/__generated__/documents";
import type { AllCountriesQuery } from "@/lib/graphql/__generated__/types";
import { parseCountrySummaryList } from "@/lib/schemas/country";

export const loadCountriesDirectory = cache(async (): Promise<EnrichedCountry[]> => {
  try {
    const result = await cachedFetchGraphQL<AllCountriesQuery>({
      query: AllCountriesDocument,
      operationName: "AllCountries",
    });

    if (result?.countries && result.countries.length > 0) {
      const validated = parseCountrySummaryList(result.countries);
      if (validated) {
        return getAllCountries();
      }
    }
  } catch {
    // Non-fatal fallback
  }

  return getAllCountries();
});

export const metadata: Metadata = {
  title: "Country Security Dossiers & National Protocols | Solo Travel Security",
  description:
    "Authoritative national security intelligence for solo travelers: nationwide police and ambulance dispatch, consular crisis contacts, electrical plug compatibility, and currency norms.",
  openGraph: {
    title: "Country Security Dossiers | Solo Travel Security",
    description:
      "Authoritative national security intelligence for solo travelers across 20+ countries: emergency dispatch, power standards, and baseline threat models.",
    type: "website",
  },
};

export default async function CountriesIndexPage() {
  const countries = await loadCountriesDirectory();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/playbook/countries/`,
        name: "Country Security Dossiers & National Protocols",
        description:
          "Authoritative national security intelligence for solo travelers: nationwide emergency dispatch, consular hotlines, and electrical grid standards.",
        url: `${SITE_URL}/playbook/countries/`,
        hasPart: countries.map((c) => ({
          "@type": "Country",
          name: c.name,
          identifier: c.iso2,
          url: `${SITE_URL}/playbook/countries/${c.iso2.toLowerCase()}/`,
          sameAs: `https://www.wikidata.org/wiki/${c.wikidataId}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Playbook", item: `${SITE_URL}/playbook/` },
          { "@type": "ListItem", position: 3, name: "Countries" },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumbs */}
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
              <span className="font-bold text-amber-700 dark:text-amber-400">Countries</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="amber">
              <Icon name="globe" className="size-3" />
              Sovereign Intelligence Hub
            </Badge>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              {countries.length} Nations Inoculated
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            National Security
            <span className="block text-amber-700 dark:text-amber-300">Dossiers & Protocols.</span>
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            Geospatial intelligence layered with verified life-safety numbers, electrical standards,
            consular crisis trees, and baseline solo travel threat models. Backed by Wikidata entity
            disambiguation.
          </p>
        </Reveal>

        {/* Directory Grid */}
        <div className="mt-12">
          <CountryDirectoryGrid countries={countries} />
        </div>
      </div>
    </PageShell>
  );
}
