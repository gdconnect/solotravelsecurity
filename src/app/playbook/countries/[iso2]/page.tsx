import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCountries, getCountryByIso2 } from "@/data/geo/countries";
import { getDestinationBySlug, type DestinationSecurityProfile } from "@/data/destinations";
import { buildCountrySchemaGraph } from "@/lib/geo/schema-builder";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, SectionHeading, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { cachedFetchGraphQL } from "@/lib/graphql/cached-fetch";
import { CountryByIso2Document } from "@/lib/graphql/__generated__/documents";
import type { CountryByIso2Query } from "@/lib/graphql/__generated__/types";
import { parseCountryDossier, type ValidatedCountryDossier } from "@/lib/schemas/country";

interface CountryPageProps {
  params: Promise<{ iso2: string }>;
}

export const loadCountryDossier = cache(
  async (iso2: string): Promise<ValidatedCountryDossier | null> => {
    const upper = iso2.toUpperCase();
    try {
      const result = await cachedFetchGraphQL<CountryByIso2Query>({
        query: CountryByIso2Document,
        variables: { iso2: upper },
        operationName: "CountryByIso2",
      });

      if (result?.country) {
        const parsed = parseCountryDossier(result.country);
        if (parsed) return parsed;
      }
    } catch {
      // Non-fatal: fall back to local dataset below
    }

    const fallback = getCountryByIso2(upper);
    if (!fallback) return null;
    return parseCountryDossier(fallback);
  },
);

export async function generateStaticParams() {
  return getAllCountries().map((c) => ({
    iso2: c.iso2.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { iso2 } = await params;
  const country = await loadCountryDossier(iso2);

  if (!country) {
    return { title: "Country Security Dossier | Solo Travel Security" };
  }

  const title = `${country.name} Solo Travel Security Dossier & Emergency Protocols (${country.iso2})`;
  const description = `Authoritative safety intelligence for solo travelers in ${country.name}: verified emergency numbers (${country.emergencyNumbers.police} Police), consular hotlines, electrical plugs (${country.electricalStandards.plugTypes.join(", ")}), and threat models.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function CountryDossierPage({ params }: CountryPageProps) {
  const { iso2 } = await params;
  const country = await loadCountryDossier(iso2);

  if (!country) {
    notFound();
  }

  const schemaGraph = buildCountrySchemaGraph(country);
  const citySlugs = (country.primaryCities || []).map((c) => (typeof c === "string" ? c : c.slug));
  const curatedCities = citySlugs
    .map((slug) => getDestinationBySlug(slug))
    .filter((d): d is DestinationSecurityProfile => Boolean(d));

  return (
    <PageShell>
      <JsonLd data={schemaGraph} />

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
              <Link
                href="/playbook/countries"
                className="hover:text-amber-700 dark:hover:text-amber-400"
              >
                Countries
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="font-bold text-amber-700 dark:text-amber-400">{country.name}</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="amber">
              <Icon name="globe" className="size-3" />
              {country.region} · {country.subregion}
            </Badge>
            <span
              className={`rounded-full border px-3 py-0.5 font-mono text-xs font-bold uppercase ${
                country.defaultRiskTier.toLowerCase() === "low"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                  : country.defaultRiskTier.toLowerCase() === "moderate"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
              }`}
            >
              {country.defaultRiskTier} Operational Risk
            </span>
            {country.wikidataId && (
              <a
                href={`https://www.wikidata.org/wiki/${country.wikidataId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 hover:border-amber-400 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-amber-300"
              >
                Wikidata: {country.wikidataId}
                <Icon name="externalLink" className="size-2.5" />
              </a>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            {country.name} Solo Travel
            <span className="block text-amber-700 dark:text-amber-300">Security Dossier.</span>
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
            <span>
              Capital:{" "}
              <strong className="text-slate-800 dark:text-slate-200">{country.capital}</strong>
            </span>
            <span>·</span>
            <span>
              ISO Codes:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {country.iso2} / {country.iso3}
              </strong>
            </span>
            {country.nativeName && country.nativeName !== country.name && (
              <>
                <span>·</span>
                <span>
                  Native:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {country.nativeName}
                  </strong>
                </span>
              </>
            )}
          </div>

          {country.overview && (
            <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
              {country.overview}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {curatedCities.length > 0 && curatedCities[0] && (
              <Link
                href={`/report/${curatedCities[0].slug}/`}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-black text-slate-950 transition hover:bg-amber-300"
              >
                <Icon name="shield" className="size-4" />
                Generate {country.name} Security Audit
              </Link>
            )}
            <Link
              href="/playbook"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-display text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Browse All Field Playbooks
            </Link>
          </div>
        </Reveal>

        {/* SECTION 1: Emergency & Consular Hotlines */}
        <section className="mt-16">
          <SectionHeading
            index="01"
            eyebrow="Life Safety"
            title="Emergency & Consular Dispatch"
            lede="Pre-programmed deterministic emergency numbers. Dial immediately in extremis or incident containment."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Police */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 dark:border-rose-500/30 dark:bg-rose-950/20">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Police Dispatch
              </span>
              <div className="mt-2 font-display text-3xl font-black text-rose-900 dark:text-rose-200">
                {country.emergencyNumbers.police}
              </div>
              <p className="mt-1 text-xs text-rose-800 dark:text-rose-300 font-medium">
                National emergency law enforcement
              </p>
              <a
                href={`tel:${country.emergencyNumbers.police}`}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-rose-700 hover:underline dark:text-rose-400"
              >
                <Icon name="phone" className="size-3" />
                Tap to Call
              </a>
            </div>

            {/* Medical / Ambulance */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 dark:border-emerald-500/30 dark:bg-emerald-950/20">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Ambulance / Medical
              </span>
              <div className="mt-2 font-display text-3xl font-black text-emerald-900 dark:text-emerald-200">
                {country.emergencyNumbers.ambulance}
              </div>
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Emergency trauma & paramedic response
              </p>
              <a
                href={`tel:${country.emergencyNumbers.ambulance}`}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                <Icon name="phone" className="size-3" />
                Tap to Call
              </a>
            </div>

            {/* Fire & Rescue */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 dark:border-amber-500/30 dark:bg-amber-950/20">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Fire & Rescue
              </span>
              <div className="mt-2 font-display text-3xl font-black text-amber-900 dark:text-amber-200">
                {country.emergencyNumbers.fire}
              </div>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 font-medium">
                Civil defense & structural extraction
              </p>
              <a
                href={`tel:${country.emergencyNumbers.fire}`}
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
              >
                <Icon name="phone" className="size-3" />
                Tap to Call
              </a>
            </div>

            {/* Tourist Police or International Calling */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {country.emergencyNumbers.touristPolice ? "Tourist Police" : "Country Dialing"}
              </span>
              <div className="mt-2 font-display text-2xl font-black text-slate-900 dark:text-slate-100">
                {country.emergencyNumbers.touristPolice || country.phonePrefix}
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
                {country.emergencyNumbers.touristPolice
                  ? "English-speaking tourist liaison"
                  : `International phone prefix (${country.phonePrefix})`}
              </p>
              {country.emergencyNumbers.touristPolice && (
                <a
                  href={`tel:${country.emergencyNumbers.touristPolice}`}
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-600 hover:underline dark:text-amber-400"
                >
                  <Icon name="phone" className="size-3" />
                  Tap to Call
                </a>
              )}
            </div>
          </div>

          {/* Consular Hotlines Box */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
              Consular Crisis Hotlines (24/7 Citizen Emergency)
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              For lost passports, detention, severe medical evacuations, or missing travelers:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  United States Embassy
                </span>
                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-slate-100">
                  {country.consularHotlines.usEmbassyPhone}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  United Kingdom (FCDO)
                </span>
                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-slate-100">
                  {country.consularHotlines.ukEmbassyPhone}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950">
                <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Australia (Smartraveller)
                </span>
                <div className="mt-1 font-mono font-bold text-slate-900 dark:text-slate-100">
                  {country.consularHotlines.ausEmbassyPhone}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Power, Currency & Technical Infrastructure */}
        <section className="mt-16">
          <SectionHeading
            index="02"
            eyebrow="Infrastructure Readiness"
            title="Electrical & Financial Standards"
            lede="Prevent bricked electronics and ATM transaction lockouts before departing transit hubs."
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {/* Electrical Standards */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Icon name="zap" className="size-4" />
                </div>
                <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                  Electrical Grid Specifications
                </h3>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Standard Voltage</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {country.electricalStandards.voltage}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Frequency</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {country.electricalStandards.frequency}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Supported Plug Types</span>
                  <div className="flex flex-wrap gap-1">
                    {country.electricalStandards.plugTypes.map((plug) => (
                      <span
                        key={plug}
                        className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-bold text-amber-800 dark:text-amber-300"
                      >
                        Type {plug}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                Dual-voltage devices (laptops, modern smartphones) require plug adapters only.
                High-draw heating appliances (hairdryers) require a step-down converter if traveling
                from 110V/120V countries.
              </p>
            </div>

            {/* Financial Infrastructure */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon name="card" className="size-4" />
                </div>
                <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                  Currency & Payment Protocol
                </h3>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Currency Code</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {country.currencyCode}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Currency Symbol</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {country.currencySymbol}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Official Unit</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {country.currencyName}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
                Always decline Dynamic Currency Conversion (DCC) at ATMs and POS terminals — always
                choose to be billed in {country.currencyCode} to avoid 4–7% bank markups.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Key Field Safety Rules */}
        {country.keySafetyRules && country.keySafetyRules.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              index="03"
              eyebrow="Tactical Rules"
              title={`Solo Traveler Operating Principles in ${country.name}`}
              lede="Calm, disciplined field protocols distilled for this territory."
            />

            <div className="mt-8 space-y-3">
              {country.keySafetyRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-slate-950">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: Associated Curated Cities */}
        {curatedCities.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              index="04"
              eyebrow="Field Dossiers"
              title={`Curated City Guides in ${country.name}`}
              lede="Deep-dive airport transit guides, scam inoculations, and neighborhood safety perimeters."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {curatedCities.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/playbook/destinations/${dest.slug}/`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                        City Hub
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                          dest.riskTier === "Low"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                            : dest.riskTier === "Moderate"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                        }`}
                      >
                        {dest.riskTier} Risk
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-black text-slate-900 transition group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                      {dest.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      Airports: {dest.arrivalAirports.map((a) => a.code).join(", ")} ·{" "}
                      {dest.topScams.length} Scams Inoculated
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    <span>Open City Safety Dossier</span>
                    <Icon
                      name="arrowRight"
                      className="size-3.5 transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: Schema.org FAQ Visual Verification */}
        <section className="mt-16">
          <SectionHeading
            index="05"
            eyebrow="Knowledge Graph"
            title={`Frequently Asked Security Questions: ${country.name}`}
            lede="Structured data answers indexed in search engines and AI entity engines."
          />

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                What are the primary emergency numbers in {country.name}?
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                In {country.name}, dial <strong>{country.emergencyNumbers.police}</strong> for
                Police, <strong>{country.emergencyNumbers.ambulance}</strong> for Medical/Ambulance,
                and <strong>{country.emergencyNumbers.fire}</strong> for Fire.
                {country.emergencyNumbers.touristPolice && (
                  <span>
                    {" "}
                    Dedicated English-speaking Tourist Police is reachable at{" "}
                    <strong>{country.emergencyNumbers.touristPolice}</strong>.
                  </span>
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                What electrical plugs and voltage are used across {country.name}?
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {country.name} operates on a standard voltage of{" "}
                <strong>{country.electricalStandards.voltage}</strong> at{" "}
                <strong>{country.electricalStandards.frequency}</strong>. Supported wall socket
                types include: <strong>{country.electricalStandards.plugTypes.join(", ")}</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                What is the solo travel safety classification for {country.name}?
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {country.overview ||
                  `${country.name} is assessed at ${country.defaultRiskTier} operational risk for independent solo travelers. Always verify arrival transit and register consular emergency contacts.`}
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
