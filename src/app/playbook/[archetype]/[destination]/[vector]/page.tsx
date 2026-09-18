import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";
import { ARCHETYPES, getArchetypeBySlug } from "@/data/archetypes";
import { SECURITY_VECTORS, getVectorBySlug } from "@/data/vectors";
import { PREPOPULATED_AIRPORTS } from "@/data/lego/airports";
import { PREPOPULATED_MICRO_ZONES } from "@/data/lego/micro-zones";
import { PREPOPULATED_REGULATORY_LANDMINES } from "@/data/lego/regulatory";
import { evaluateProductsForSituation } from "@/data/gear/matcher";
import type { RiskTier } from "@/lib/engine/types";
import { PageShell } from "@/components/templates/PageShell";
import { Reveal, Badge, JsonLd, FavoriteButton } from "@/components/atoms";
import {
  Breadcrumbs,
  InlineAssessment,
  CutoutEmergencyCard,
  MicroZoneCard,
  FaqAccordion,
  StickyConversionBar,
  RelatedPlaybooksGrid,
} from "@/components/molecules";
import type { FaqItem } from "@/components/molecules";
import { RecommendationSection, AirportIngressSimulator } from "@/components/organisms";
import { Icon } from "@/components/atoms/Icon";
import { SITE_URL } from "@/lib/schema";

interface PageProps {
  params: Promise<{
    archetype: string;
    destination: string;
    vector: string;
  }>;
}

export async function generateStaticParams() {
  const params: { archetype: string; destination: string; vector: string }[] = [];

  for (const destination of TOP_SOLO_DESTINATIONS) {
    for (const archetype of ARCHETYPES) {
      for (const vector of SECURITY_VECTORS) {
        params.push({
          destination: destination.slug,
          archetype: archetype.slug,
          vector: vector.slug,
        });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { archetype: archSlug, destination: destSlug, vector: vecSlug } = await params;
  const dest = getDestinationBySlug(destSlug);
  const arch = getArchetypeBySlug(archSlug);
  const vec = getVectorBySlug(vecSlug);

  if (!dest || !arch || !vec) {
    return { title: "Field Playbook | Solo Travel Security" };
  }

  const title = `${arch.shortLabel} in ${dest.name}: ${vec.shortLabel} Protocol`;
  const description = `Field-tested safety playbook for ${arch.name.toLowerCase()}s in ${dest.name}, ${dest.country}. ${vec.tagline} Verified transit, scams, and emergency guidance.`;

  // Inventory Gating Check (Decision Table DT-SKAG-GATE-01):
  // Count matching modular LEGO blocks: airport hub, micro-zone, regulatory landmines, local scams
  let itemCount = 0;
  if (PREPOPULATED_AIRPORTS.some((hub) => hub.citySlug.toLowerCase() === dest.slug.toLowerCase())) {
    itemCount++;
  }
  if (PREPOPULATED_MICRO_ZONES.some((z) => z.citySlug.toLowerCase() === dest.slug.toLowerCase())) {
    itemCount++;
  }
  if (
    PREPOPULATED_REGULATORY_LANDMINES.some(
      (r) => r.countryCode.toUpperCase() === dest.countryCode.toUpperCase(),
    )
  ) {
    itemCount++;
  }
  if (dest.topScams && dest.topScams.length > 0) {
    itemCount++;
  }

  // Gated: Tier 1/2 Hubs with >= 3 verified LEGO blocks qualify for index,follow
  const isIndexable = itemCount >= 3;
  const canonicalUrl = isIndexable
    ? `${SITE_URL}/playbook/${arch.slug}/${dest.slug}/${vec.slug}/`
    : `${SITE_URL}/playbook/destinations/${dest.slug}/`;

  return {
    title,
    description,
    robots: {
      index: isIndexable,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "Solo Travel Security",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PlaybookSKAGPage({ params }: PageProps) {
  const { archetype: archSlug, destination: destSlug, vector: vecSlug } = await params;
  const dest = getDestinationBySlug(destSlug);
  const arch = getArchetypeBySlug(archSlug);
  const vec = getVectorBySlug(vecSlug);

  if (!dest || !arch || !vec) {
    notFound();
  }

  const pageSlug = `${arch.slug}/${dest.slug}/${vec.slug}`;
  const pageUrl = `${SITE_URL}/playbook/${pageSlug}/`;
  const pageId = `playbook-${arch.slug}-${dest.slug}-${vec.slug}`;

  // 1. Ingest matching LEGO Blocks
  const airportHub = PREPOPULATED_AIRPORTS.find(
    (hub) =>
      hub.citySlug.toLowerCase() === dest.slug.toLowerCase() ||
      dest.arrivalAirports.some((a) => a.code.toUpperCase() === hub.iata),
  );

  const microZone = PREPOPULATED_MICRO_ZONES.find(
    (z) => z.citySlug.toLowerCase() === dest.slug.toLowerCase(),
  );

  const regulatoryLandmines = PREPOPULATED_REGULATORY_LANDMINES.filter(
    (r) => r.countryCode.toUpperCase() === dest.countryCode.toUpperCase(),
  );

  // 2. Ingest matched gear recommendations
  const matchedProducts = evaluateProductsForSituation({
    trip: {
      destinationCity: dest.name,
      destinationCountry: dest.country,
      destinationCountryIso2: dest.countryCode,
      destinationRiskTier: dest.riskTier as RiskTier,
      arrivalHour: vec.slug === "night-arrival-transit" ? 23 : 14,
      transitMode: "flight",
      lodgingType: "hotel",
      lodgingFloor: vec.slug === "hotel-room-perimeter" ? "ground" : "floors_2_to_4",
    },
    profile: {
      genderIdentity: arch.slug === "solo-female" ? "female" : "prefer_not_to_say",
      experienceLevel: arch.slug === "first-time-solo" ? "first_time" : "occasional",
      gearValueTier:
        vec.slug === "laptop-gear-security" ? "moderate_laptop_phone" : "minimal_phone_only",
      cellularType: "esim_preloaded",
    },
  });

  // 3. Compose dynamic FAQs
  const faqItems: FaqItem[] = [
    {
      question: `What is the safest arrival transit option in ${dest.name} for solo travelers?`,
      answer:
        (airportHub
          ? `At ${airportHub.iata}, use the official taxi line at ${airportHub.officialTaxi.exactKioskLocation} (${airportHub.officialTaxi.fareStructure.replace(/_/g, " ")}). Avoid hallway touts.`
          : undefined) ||
        dest.arrivalAirports[0]?.nightTransitRecommendation ||
        "Use official municipal airport taxi desks or pre-booked authorized transit. Avoid unmetered hallway touts.",
    },
    {
      question: `What street scams should ${arch.name.toLowerCase()}s watch for in ${dest.name}?`,
      answer:
        dest.topScams.map((s) => `${s.name}: ${s.counterAction}`).join(" ") ||
        "Always keep valuables zippered and decline unsolicited guidance or friendship bracelets.",
    },
    {
      question: `Which neighborhoods in ${dest.name} require heightened caution after dark?`,
      answer: microZone
        ? `In ${microZone.name}, avoid ${microZone.redFlagCorridors[0]}. Prefer safe thoroughfares like ${microZone.safeThoroughfares[0]}.`
        : `Exercise heightened awareness around transit terminals and caution zones (${dest.cautionNeighborhoods.join(", ")}).`,
    },
    {
      question: `What are the official emergency telephone numbers in ${dest.name}?`,
      answer: `Police/General: ${dest.emergencyNumbers.generalOrPolice}, Ambulance: ${dest.emergencyNumbers.ambulance}${
        dest.emergencyNumbers.touristPolice
          ? `, Tourist Police: ${dest.emergencyNumbers.touristPolice}`
          : ""
      }.`,
    },
  ];

  if (regulatoryLandmines.length > 0) {
    faqItems.push({
      question: `Are there strict customs bans or legal landmines in ${dest.country}?`,
      answer: `${regulatoryLandmines[0].title}: ${regulatoryLandmines[0].penaltySummary} ${regulatoryLandmines[0].proceduralAction}`,
    });
  }

  // 4. Generate Schema.org JSON-LD graph (Breadcrumbs + HowTo + EmergencyService)
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Playbook",
            item: `${SITE_URL}/playbook/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: dest.name,
            item: `${SITE_URL}/playbook/destinations/${dest.slug}/`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${arch.shortLabel} - ${vec.shortLabel}`,
          },
        ],
      },
      {
        "@type": "HowTo",
        name: `${arch.shortLabel} ${vec.title} in ${dest.name}`,
        description: vec.primaryJob,
        step: vec.actionProtocol.map((s) => ({
          "@type": "HowToStep",
          name: s.title,
          text: s.instruction,
          position: s.step,
        })),
      },
      {
        "@type": "EmergencyService",
        name: `${dest.name} Emergency Services`,
        telephone: dest.emergencyNumbers.generalOrPolice,
        areaServed: {
          "@type": "City",
          name: dest.name,
        },
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLdData} />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* DRY Accessible Breadcrumb with Schema.org JSON-LD */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Playbook", href: "/playbook/" },
            { label: dest.name, href: `/playbook/destinations/${dest.slug}/` },
            { label: `${arch.shortLabel} — ${vec.shortLabel}` },
          ]}
        />

        {/* SKAG High-Converting Editorial Header */}
        <Reveal>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="amber">
                <Icon name="map" className="size-3" />
                {dest.name}, {dest.country}
              </Badge>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                Risk Tier: {dest.riskTier}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-0.5 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                Profile: {arch.shortLabel}
              </span>
            </div>

            {/* Bookmark button */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline font-mono text-xs text-slate-500 dark:text-slate-400">
                Save Protocol:
              </span>
              <FavoriteButton
                item={{
                  id: pageId,
                  type: "topic",
                  title: `${arch.name} in ${dest.name}: ${vec.title}`,
                  url: pageUrl,
                  category: "field_playbook",
                  description: `${vec.tagline} Built specifically for ${arch.name.toLowerCase()}s.`,
                  badge: dest.name,
                }}
                size="md"
              />
            </div>
          </div>

          <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-amber-50">
            {arch.name} in {dest.name}:
            <span className="block text-amber-700 dark:text-amber-300">{vec.title}</span>
          </h1>

          <p className="mt-4 text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            {vec.tagline} Field-engineered for {arch.name.toLowerCase()}s entering or navigating{" "}
            {dest.name} with clarity, verification checkpoints, and zero-PII security.
          </p>
        </Reveal>

        {/* Embedded Interactive Quiz (Pre-seeded via XState) */}
        <div id="assessment" className="mt-10 scroll-mt-20">
          <InlineAssessment
            initialDestinationCity={dest.name}
            initialDestinationCountry={dest.countryCode}
            initialDestinationRiskTier={dest.riskTier}
            initialArchetype={arch.slug}
          />
        </div>

        {/* Action Protocol Steps */}
        <section className="mt-14 space-y-6">
          <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Deterministic Field Steps
            </span>
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-amber-50">
              The {vec.shortLabel} Protocol
            </h2>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              Core Rule:{" "}
              <span className="font-bold text-slate-900 dark:text-white">{vec.coreRule}</span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {vec.actionProtocol.map((step) => (
              <div
                key={step.step}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-black text-slate-950">
                    {step.step}
                  </span>
                  <h3 className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Airport & Transit Intelligence */}
        {airportHub && vec.slug === "night-arrival-transit" ? (
          <div className="mt-14">
            <AirportIngressSimulator hub={airportHub} />
          </div>
        ) : dest.arrivalAirports.length > 0 ? (
          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
              <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                Arrival Transit Hygiene ({dest.arrivalAirports[0].code})
              </h3>
              <Link
                href={`/playbook/airports/${dest.arrivalAirports[0].code.toLowerCase()}/`}
                className="font-mono text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
              >
                Full Airport Hub Dossier →
              </Link>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <span className="block font-mono text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">
                  Daylight Ingress
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {dest.arrivalAirports[0].dayTransitRecommendation}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <span className="block font-mono text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">
                  Night Ingress (21:00–06:00)
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {dest.arrivalAirports[0].nightTransitRecommendation}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-xs text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-200">
              <strong className="font-black">Transit Warning:</strong>{" "}
              {dest.arrivalAirports[0].transitWarning}
            </div>
          </section>
        ) : null}

        {/* Micro-Zone Crime Heatmap & 24h Safe Havens */}
        {microZone && (
          <div className="mt-14">
            <MicroZoneCard zone={microZone} />
          </div>
        )}

        {/* Regulatory Landmines & Strict Customs Prohibitions */}
        {regulatoryLandmines.length > 0 && (
          <section className="mt-14 rounded-2xl border border-rose-300/40 bg-rose-50/50 p-6 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center gap-2 border-b border-rose-200 pb-3 dark:border-rose-900/50 text-rose-900 dark:text-rose-200">
              <Icon name="alertTriangle" className="size-5 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400">
                  Host Nation Regulatory Warning
                </span>
                <h3 className="font-display text-lg font-black">{regulatoryLandmines[0].title}</h3>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              <strong className="font-bold">Penalties:</strong>{" "}
              {regulatoryLandmines[0].penaltySummary}
            </p>

            <div className="mt-3 rounded-lg bg-white/80 p-3 text-xs leading-relaxed text-slate-900 dark:bg-slate-900/80 dark:text-slate-100">
              <strong className="font-bold text-amber-700 dark:text-amber-400">
                Action Required:
              </strong>{" "}
              {regulatoryLandmines[0].proceduralAction}
            </div>
          </section>
        )}

        {/* Local Scam Inoculation */}
        {dest.topScams.length > 0 && (
          <section className="mt-14 space-y-4">
            <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Street Scam Literacy
              </span>
              <h3 className="font-display text-xl font-black text-slate-900 dark:text-amber-50">
                Top Scams in {dest.name} Targeting Solo Visitors
              </h3>
            </div>

            <div className="space-y-3">
              {dest.topScams.map((scam) => (
                <div
                  key={scam.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
                      {scam.name}
                    </h4>
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
        )}

        {/* Curated Situational Gear (Affiliate & Saved Kit Integration) */}
        {matchedProducts.length > 0 && (
          <div className="mt-14">
            <RecommendationSection
              products={matchedProducts.slice(0, 4)}
              destinationCity={dest.name}
            />
          </div>
        )}

        {/* Dynamic FAQ Accordion with Schema.org FAQPage */}
        <FaqAccordion
          items={faqItems}
          title={`Frequently Asked Questions: ${dest.name} Solo Security`}
          description={`Essential guidance for ${arch.name.toLowerCase()}s staying or arriving in ${dest.name}.`}
        />

        {/* Cutout Emergency Pocket Card */}
        <div id="emergency-card" className="mt-14 scroll-mt-20">
          <CutoutEmergencyCard
            destinationCity={dest.name}
            destinationCountry={dest.country}
            policeNumber={dest.emergencyNumbers.generalOrPolice}
            ambulanceNumber={dest.emergencyNumbers.ambulance}
            touristPoliceNumber={dest.emergencyNumbers.touristPolice}
            localPhrases={dest.safetyPhrases}
          />
        </div>

        {/* Programmatic Internal Linking Mesh */}
        <RelatedPlaybooksGrid
          currentArchetypeSlug={arch.slug}
          currentDestinationSlug={dest.slug}
          currentVectorSlug={vec.slug}
        />
      </article>

      {/* Sticky Mobile Conversion Bar */}
      <StickyConversionBar
        destinationName={dest.name}
        archetypeName={arch.shortLabel}
        vectorTitle={vec.title}
        pageUrl={pageUrl}
        pageId={pageId}
      />
    </PageShell>
  );
}
