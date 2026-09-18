import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PREPOPULATED_AIRPORTS, getAirportByIata } from "@/data/lego/airports";
import { getScamsForDestination } from "@/data/lego/scams";
import {
  getDestinationBySlug,
  getDestinationByAirportCode,
  TOP_SOLO_DESTINATIONS,
} from "@/data/destinations";
import { SparseAirportPage } from "./SparseAirportPage";
import { generateAirportPseoMetadata } from "@/lib/engine/lego-combiner";
import { PageShell } from "@/components/templates/PageShell";
import { Reveal, Badge, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { AirportIngressSimulator } from "@/components/organisms/AirportIngressSimulator";
import { CutoutEmergencyCard } from "@/components/molecules/CutoutEmergencyCard";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { RecommendationSection } from "@/components/organisms/RecommendationSection";
import { evaluateProductsForSituation } from "@/data/gear/matcher";

interface PageProps {
  params: Promise<{
    iata: string;
  }>;
}

export async function generateStaticParams() {
  // Every airport code any destination links to gets a page: full hub when
  // one exists, otherwise the sparse essentials page.
  const codes = new Set(PREPOPULATED_AIRPORTS.map((a) => a.iata.toLowerCase()));
  for (const d of TOP_SOLO_DESTINATIONS) {
    for (const a of d.arrivalAirports) codes.add(a.code.toLowerCase());
  }
  return [...codes].map((iata) => ({ iata }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { iata } = await params;
  const hub = getAirportByIata(iata);

  if (!hub) {
    const sparse = getDestinationByAirportCode(iata);
    if (!sparse) return { title: "Airport Ingress Playbook | Solo Travel Security" };
    const title = `${sparse.airport.name} (${sparse.airport.code}) Arrival Essentials for ${sparse.destination.name} | Solo Travel Security`;
    const description = `Day and night transit guidance, cash strategy, and emergency numbers for solo travelers landing at ${sparse.airport.code} for ${sparse.destination.name}.`;
    return { title, description, openGraph: { title, description, type: "article" } };
  }

  const { title, description, keywords } = generateAirportPseoMetadata(hub, "Solo Traveler");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function AirportPseoPage({ params }: PageProps) {
  const { iata } = await params;
  const hub = getAirportByIata(iata);

  if (!hub) {
    const sparse = getDestinationByAirportCode(iata);
    if (!sparse) notFound();
    return <SparseAirportPage destination={sparse.destination} airport={sparse.airport} />;
  }

  const dest = getDestinationBySlug(hub.citySlug);
  const relevantScams = getScamsForDestination(hub.citySlug);
  const matchedProducts = evaluateProductsForSituation({
    trip: {
      destinationCity: hub.city,
      destinationCountry: hub.country,
      destinationCountryIso2: hub.countryCode,
      destinationRiskTier: dest?.riskTier || "Moderate",
      arrivalHour: 23,
      transitMode: "flight",
      lodgingType: "hotel",
      lodgingFloor: "floors_2_to_4",
    },
    profile: {
      genderIdentity: "female",
      experienceLevel: "first_time",
      gearValueTier: "moderate_laptop_phone",
      cellularType: "esim_preloaded",
    },
  });

  // Schema.org JSON-LD (Airport + FAQPage + HowTo)
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Airport",
        name: hub.name,
        iataCode: hub.iata,
        icaoCode: hub.icao,
        address: {
          "@type": "PostalAddress",
          addressLocality: hub.city,
          addressCountry: hub.countryCode,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `When does the last train depart ${hub.name} (${hub.iata})?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The last express train departs at ${hub.lateNightCurfew.expressRailLastDeparture}. After this time, travelers must use night buses, licensed app rideshare, or official municipality taxi dispatch desks.`,
            },
          },
          {
            "@type": "Question",
            name: `Where is the official taxi rank at ${hub.iata} to avoid rogue touts?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: hub.officialTaxi.exactKioskLocation,
            },
          },
          {
            "@type": "Question",
            name: `What is the official taxi fare from ${hub.iata} to ${hub.city} center?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: hub.officialTaxi.flatRateCityCenterEur
                ? `The official flat rate is €${hub.officialTaxi.flatRateCityCenterEur} for central destinations. Never accept unmetered quotes from drivers inside the terminal.`
                : `Taxis operate on a calibrated meter with standard airport surcharges. Insist on the meter before luggage is loaded.`,
            },
          },
          {
            "@type": "Question",
            name: `Are Uber or rideshare apps permitted at ${hub.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: hub.rideshare.isGeofencedOrBanned
                ? `Standard rideshare is restricted. Use official licensed taxis or pre-booked transfers.`
                : `Permitted services include ${hub.rideshare.servicesAllowed.join(", ")}. Designated pickup is located at: ${hub.rideshare.designatedPickupZone}`,
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: `How to Safely Ingress ${hub.city} from ${hub.iata} Late at Night`,
        description: `Operational step-by-step instructions for solo travelers arriving after dark at ${hub.name}.`,
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Secure Local Connectivity & Cash",
            text: `Connect to official terminal Wi-Fi or activate your pre-loaded eSIM. If withdrawing cash, use official bank ATMs (${hub.arrivalHallLogistics.officialBankAtms.join(", ")}) and reject Euronet dynamic currency conversion.`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Bypass Terminal Hallway Touts",
            text: `Walk straight through the baggage exit hall with forward momentum. Ignore anyone offering private taxis or claiming trains are cancelled.`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Proceed to Official Outdoor Dispatch Desk",
            text: hub.officialTaxi.exactKioskLocation,
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Verify Vehicle Markings & Payment Terms",
            text: `Verify vehicle markings (${hub.officialTaxi.officialVehicleVisualMarks[0]}) and confirm card payment capability or flat fare before getting in.`,
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLdData} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: "Playbook", href: "/playbook/" },
            { label: "Destinations", href: "/playbook/destinations/" },
            { label: hub.city, href: `/playbook/destinations/${hub.citySlug}/` },
            { label: `${hub.iata} Ingress` },
          ]}
          className="mb-6"
        />

        {/* Hero Header */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-amber-400 px-3 py-1 font-mono text-base font-black text-slate-950 shadow-2xs">
              {hub.iata}
            </span>
            <Badge tone="amber">
              <Icon name="shield" className="size-3" />
              Ingress & Transit Defense Hub
            </Badge>
            <span className="font-mono text-xs font-bold text-slate-500">
              ICAO: {hub.icao} · {hub.terminalsCount} Terminals
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-amber-50">
            {hub.name}
            <span className="block text-amber-600 dark:text-amber-300">
              Late-Night Arrival & Taxi Safety Guide ({hub.city})
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            Field-tested transit blueprints, train curfew schedules, official taxi stand
            coordinates, and rogue tout truth tables for solo travelers arriving at {hub.iata}.
          </p>
        </Reveal>

        {/* Quick Ingress Key Metrics Bar */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Express Rail Curfew
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-slate-900 dark:text-amber-50">
                {hub.lateNightCurfew.expressRailLastDeparture}
              </span>
              <span className="text-xs text-slate-500">Last departure</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              Public rail ceases after this time. Night bus or taxi mandatory.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Taxi Fare
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-2xl font-black text-amber-600 dark:text-amber-400">
                {hub.officialTaxi.flatRateCityCenterEur
                  ? `€${hub.officialTaxi.flatRateCityCenterEur} Flat`
                  : hub.officialTaxi.flatRateCityCenterLocal
                    ? `${hub.officialTaxi.flatRateCityCenterLocal.amount} ${hub.officialTaxi.flatRateCityCenterLocal.currency}`
                    : "Metered"}
              </span>
              <span className="text-xs text-slate-500">to city center</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              {hub.officialTaxi.fareStructure === "flat_rate"
                ? "Legally fixed price. Unmetered tout quotes are invalid."
                : "Metered fare. Demand meter activation before loading bags."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Rideshare Pick-Up
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                {hub.rideshare.servicesAllowed[0] || "Licensed Taxi Only"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              {hub.rideshare.designatedPickupZone}
            </p>
          </div>
        </div>

        {/* SECTION 1: Interactive Ingress Simulator / Decision Table */}
        <section className="mt-12">
          <AirportIngressSimulator hub={hub} />
        </section>

        {/* SECTION 2: Official Taxi vs. Rogue Tout Comparison Matrix */}
        <section className="mt-16">
          <div className="flex items-center gap-2">
            <Badge tone="amber">Anti-Tout Inoculation</Badge>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-slate-900 sm:text-3xl dark:text-amber-50">
            Official Taxi Stand vs. Rogue Hallway Touts
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Touts operate inside the terminal exit hall targeting disoriented solo arrivals. Here is
            how to distinguish them instantly.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 font-mono uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Security Check</th>
                    <th className="px-5 py-3.5 text-emerald-700 dark:text-emerald-300">
                      ✓ Official Municipality Taxi
                    </th>
                    <th className="px-5 py-3.5 text-rose-700 dark:text-rose-300">
                      ✗ Rogue Hallway Driver (Scam)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                  <tr>
                    <td className="px-5 py-3.5 font-bold">Staging Location</td>
                    <td className="px-5 py-3.5 text-emerald-700 dark:text-emerald-400 font-medium">
                      {hub.officialTaxi.exactKioskLocation}
                    </td>
                    <td className="px-5 py-3.5 text-rose-600 dark:text-rose-400">
                      Inside baggage claim, sliding exit doors, or corridor holding clipboards.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold">Vehicle Livery & Markings</td>
                    <td className="px-5 py-3.5">
                      <ul className="list-disc pl-4 space-y-1">
                        {hub.officialTaxi.officialVehicleVisualMarks.map((mark, i) => (
                          <li key={i}>{mark}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-3.5 text-rose-600 dark:text-rose-400">
                      Unmarked private sedan, tinted windows, generic magnetic roof sign, parked in
                      distant garage.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold">Pricing Model</td>
                    <td className="px-5 py-3.5">
                      {hub.officialTaxi.fareStructure === "flat_rate"
                        ? `Official fixed rate (€${hub.officialTaxi.flatRateCityCenterEur || 50}).`
                        : "Calibrated dashboard taximeter with standard airport surcharge."}
                    </td>
                    <td className="px-5 py-3.5 text-rose-600 dark:text-rose-400">
                      Vague quotes: &quot;Around €60&quot; which escalates to €150–250 upon arrival
                      in the city.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold">Card Payment Mandate</td>
                    <td className="px-5 py-3.5">{hub.officialTaxi.paymentMethodRisk}</td>
                    <td className="px-5 py-3.5 text-rose-600 dark:text-rose-400">
                      Cash only. Will drive to dark unmonitored ATMs to extract funds.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 3: Threat Truth Tables & Escape Protocols */}
        {relevantScams.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-2">
              <Badge tone="rose">Observable Threat Inoculation</Badge>
            </div>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900 sm:text-3xl dark:text-amber-50">
              Verified Scams & Observable Truth Tables ({hub.city})
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Run step-by-step falsification checks against common deceptive hooks encountered
              during ingress.
            </p>

            <div className="mt-6 space-y-6">
              {relevantScams.map((scam) => (
                <div
                  key={scam.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-rose-500 font-bold">
                        {scam.vectorCategory.replace(/_/g, " ")} · Severity: {scam.severity}
                      </span>
                      <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                        {scam.name}
                      </h3>
                    </div>
                    <div className="rounded-lg bg-rose-50 px-3 py-1 font-mono text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                      Hook: &quot;{scam.deceptiveHook.openingPhrase}&quot;
                    </div>
                  </div>

                  {/* Truth Table Conditions */}
                  <div className="mt-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Observable Truth Table Falsification Checks:
                    </span>
                    <ul className="mt-2 space-y-2">
                      {scam.truthTable.conditions.map((cond) => (
                        <li
                          key={cond.id}
                          className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
                        >
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                            {cond.id}:
                          </span>
                          <span>{cond.conditionText}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-xl bg-amber-100/60 p-3 font-mono text-xs font-bold text-amber-950 dark:bg-amber-950/40 dark:text-amber-200">
                      Rule: {scam.truthTable.conclusiveRule}
                    </div>
                  </div>

                  {/* Escape Script */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200">
                    <div>
                      <span className="font-bold">Verbal Escape Line:</span>{" "}
                      <span className="font-mono italic">
                        &quot;{scam.escapeProtocol.localRefusalPhrase.local}&quot;
                      </span>{" "}
                      ({scam.escapeProtocol.localRefusalPhrase.phonetic})
                    </div>
                    <div className="font-mono text-[11px]">
                      Emergency: <strong>{scam.escapeProtocol.escalationContact}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: Safe Staging & Waiting Zones */}
        <section className="mt-16">
          <div className="flex items-center gap-2">
            <Badge tone="blue">Overnight Harbors</Badge>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-slate-900 sm:text-3xl dark:text-amber-50">
            24/7 Safe Waiting Zones Inside {hub.iata}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            If you land between 01:00 and 05:00 and prefer to avoid nocturnal street ingress, stage
            at these verified secure locations.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {hub.safeWaitingZones.map((zone, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-amber-50">
                    {zone.name}
                  </h3>
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                    {zone.airsideOrLandside.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-500">📍 {zone.location}</p>
                <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {zone.notes}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Arrival Hall Logistics: Connectivity & Safe ATMs */}
        <section className="mt-16">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 sm:p-8">
            <h2 className="font-display text-xl font-black text-slate-900 sm:text-2xl dark:text-amber-50">
              Arrival Hall Logistics & ATM Protection
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Protect against payment card skimmers and 18% dynamic currency conversion markups.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  ✓ Verified Domestic Bank ATMs
                </span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {hub.arrivalHallLogistics.officialBankAtms.map((atm, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="check" className="size-3.5 text-emerald-500" />
                      <span>{atm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  ✗ Predatory Kiosks to Avoid
                </span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {hub.arrivalHallLogistics.predatoryAtmsToAvoid.map((atm, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="x" className="size-3.5 text-rose-500" />
                      <span>{atm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Printable Emergency Cutout Card */}
        <section className="mt-16">
          <div className="flex items-center gap-2">
            <Badge tone="amber">Analog Redundancy</Badge>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-slate-900 sm:text-3xl dark:text-amber-50">
            Printable Wallet Cutout Card ({hub.city})
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Cut out this wallet-sized card to carry inside your phone case or behind your ID in case
            your phone battery dies upon landing.
          </p>

          <div className="mt-6 max-w-sm">
            <CutoutEmergencyCard
              destinationCity={hub.city}
              destinationCountry={hub.country}
              policeNumber={dest?.emergencyNumbers.generalOrPolice || "112"}
              ambulanceNumber={dest?.emergencyNumbers.ambulance || "112"}
              touristPoliceNumber={dest?.emergencyNumbers.touristPolice}
              localPhrases={dest?.safetyPhrases || []}
            />
          </div>
        </section>

        {/* SECTION 7: Curated Gear & Services */}
        <section className="mt-16">
          <RecommendationSection products={matchedProducts} destinationCity={hub.city} />
        </section>

        {/* Back Link */}
        <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800">
          <Link
            href="/playbook/"
            className="inline-flex items-center gap-2 font-display text-sm font-bold text-amber-600 hover:text-amber-500"
          >
            ← Return to Field Playbook Directory
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
