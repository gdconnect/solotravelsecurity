import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";
import { getEnrichedCityBySlug } from "@/data/geo/cities";
import { getCountryByIso2 } from "@/data/geo/countries";
import { buildCitySchemaGraph } from "@/lib/geo/schema-builder";
import { ARCHETYPES } from "@/data/archetypes";
import { SECURITY_VECTORS } from "@/data/vectors";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, SectionHeading, JsonLd } from "@/components/atoms";
import { CutoutEmergencyCard } from "@/components/molecules";
import { Icon } from "@/components/atoms/Icon";

interface DestinationHubProps {
  params: Promise<{ destination: string }>;
}

export async function generateStaticParams() {
  return TOP_SOLO_DESTINATIONS.map((d) => ({
    destination: d.slug,
  }));
}

export async function generateMetadata({ params }: DestinationHubProps): Promise<Metadata> {
  const { destination: slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) {
    return { title: "Destination Dossier | Solo Travel Security" };
  }

  const title = `${dest.name} Solo Travel Security Guide & Playbook (${dest.country})`;
  const description = `Field-tested safety playbook for solo travelers in ${dest.name}. Official airport transit, top scams, emergency numbers (${dest.emergencyNumbers.generalOrPolice}), and safe neighborhoods.`;

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

export default async function DestinationHubPage({ params }: DestinationHubProps) {
  const { destination: slug } = await params;
  const dest = getDestinationBySlug(slug);

  if (!dest) {
    notFound();
  }

  const enrichedCity = getEnrichedCityBySlug(slug);
  const enrichedCountry = getCountryByIso2(dest.countryCode);

  const jsonLd =
    enrichedCity && enrichedCountry
      ? buildCitySchemaGraph(enrichedCity, enrichedCountry, {
          scamCount: dest.topScams.length,
          airportGuidance: dest.arrivalAirports[0]?.dayTransitRecommendation,
        })
      : {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://solotravelsecurity.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Playbook",
                  item: "https://solotravelsecurity.com/playbook",
                },
                { "@type": "ListItem", position: 3, name: dest.name },
              ],
            },
            {
              "@type": "Place",
              name: dest.name,
              address: {
                "@type": "PostalAddress",
                addressCountry: dest.countryCode,
              },
            },
          ],
        };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumb row */}
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
                href={`/playbook/countries/${dest.countryCode.toLowerCase()}/`}
                className="hover:text-amber-700 dark:hover:text-amber-400"
              >
                {dest.country}
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-amber-700 dark:text-amber-400 font-bold">{dest.name}</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/playbook/countries/${dest.countryCode.toLowerCase()}/`}
              className="group inline-flex items-center"
            >
              <Badge tone="amber">
                <Icon name="globe" className="size-3" />
                {dest.country} Dossier →
              </Badge>
            </Link>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
              Risk Tier: {dest.riskTier}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            {dest.name} Solo Travel
            <span className="block text-amber-700 dark:text-amber-300">Security Playbook.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            Complete field intelligence for navigating {dest.name} alone: official airport transit
            rules, top scams, neighborhood boundaries, and emergency ladders.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/report/${dest.slug}/`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-black text-slate-950 transition hover:bg-amber-300"
            >
              <Icon name="shield" className="size-4" />
              Generate Personalised {dest.name} Dossier
            </Link>
            <Link
              href={`/playbook/solo-female/${dest.slug}/night-arrival-transit/`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-display text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Take Rapid 90-Sec Audit
            </Link>
          </div>
        </Reveal>

        {/* SECTION 1: Transit & Airport Ingress */}
        <section className="mt-16">
          <SectionHeading
            index="01"
            eyebrow="Zero-Hour Ingress"
            title="Airport & Transit Hygiene"
            lede="Touchdown protocols to eliminate predatory touts, unlicensed vehicles, and currency friction."
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {dest.arrivalAirports.map((ap) => (
              <div
                key={ap.code}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                    {ap.name} ({ap.code})
                  </h3>
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                    Terminal Gate
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <div>
                    <strong className="block font-mono text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Day Transit (07:00–20:00)
                    </strong>
                    {ap.dayTransitRecommendation}
                  </div>
                  <div>
                    <strong className="block font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Night Transit (21:00–06:00)
                    </strong>
                    {ap.nightTransitRecommendation}
                  </div>
                  <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-950 dark:text-amber-200">
                    <strong className="font-bold">Warning:</strong> {ap.transitWarning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Scam Directory */}
        <section className="mt-16">
          <SectionHeading
            index="02"
            eyebrow="Threat Literacy"
            title={`Top Scams in ${dest.name}`}
            lede="Recognize conversational hooks and distraction mechanics before money or possessions leave your hands."
          />

          <div className="mt-8 space-y-4">
            {dest.topScams.map((scam) => (
              <div
                key={scam.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                    {scam.name}
                  </h3>
                  <span className="font-mono text-xs italic text-amber-700 dark:text-amber-400">
                    Trigger: {scam.triggerPhrase}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  <strong className="font-bold text-slate-900 dark:text-white">Mechanic:</strong>{" "}
                  {scam.mechanic}
                </p>
                <div className="mt-3 rounded-lg bg-emerald-500/10 p-2.5 text-xs text-emerald-950 dark:bg-emerald-500/15 dark:text-emerald-200">
                  <strong className="font-bold">Counter-Action:</strong> {scam.counterAction}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SKAG Topic Cluster Matrix for this Destination */}
        <section className="mt-16">
          <SectionHeading
            index="03"
            eyebrow="Targeted Guides"
            title={`${dest.name} Playbooks by Profile & Topic`}
            lede="Hyper-specific operational dossiers for different travelers moving through the city."
          />

          <div className="mt-8 space-y-6">
            {ARCHETYPES.map((arch) => (
              <div
                key={arch.slug}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                  {arch.name} in {dest.name}
                </h3>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                  {arch.description}
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {SECURITY_VECTORS.map((vec) => (
                    <Link
                      key={vec.slug}
                      href={`/playbook/${arch.slug}/${dest.slug}/${vec.slug}/`}
                      className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold text-slate-800 transition hover:border-amber-400 hover:bg-amber-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <span className="truncate">{vec.shortLabel} Protocol</span>
                      <Icon
                        name="arrowRight"
                        className="size-3 text-amber-700 transition group-hover:translate-x-1 dark:text-amber-400"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Emergency Card Cutout */}
        <div className="mt-16">
          <CutoutEmergencyCard
            destinationCity={dest.name}
            destinationCountry={dest.country}
            policeNumber={dest.emergencyNumbers.generalOrPolice}
            ambulanceNumber={dest.emergencyNumbers.ambulance}
            touristPoliceNumber={dest.emergencyNumbers.touristPolice}
            localPhrases={dest.safetyPhrases}
          />
        </div>
      </div>
    </PageShell>
  );
}
