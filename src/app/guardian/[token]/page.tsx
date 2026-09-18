import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";
import { getCountryByIso2 } from "@/data/geo/countries";
import { PageShell } from "@/components/templates/PageShell";
import { Reveal } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { cachedFetchGraphQL } from "@/lib/graphql/cached-fetch";
import { GuardianPortalDocument } from "@/lib/graphql/__generated__/documents";
import type { GuardianPortalQuery } from "@/lib/graphql/__generated__/types";
import { parseGuardianPortal, type ValidatedGuardianPortal } from "@/lib/schemas/guardian";
import { GuardianHeartbeatIsland } from "./GuardianHeartbeatIsland";

interface GuardianPortalProps {
  params: Promise<{ token: string }>;
}

export const loadGuardianPortal = cache(
  async (token: string): Promise<ValidatedGuardianPortal | null> => {
    try {
      const result = await cachedFetchGraphQL<GuardianPortalQuery>({
        query: GuardianPortalDocument,
        variables: { token },
        operationName: "GuardianPortal",
      });

      if (result?.guardianPortal) {
        const parsed = parseGuardianPortal(result.guardianPortal);
        if (parsed) return parsed;
      }
    } catch {
      // Non-fatal fallback
    }

    const dest = getDestinationBySlug(token) || TOP_SOLO_DESTINATIONS[0];
    const country = getCountryByIso2(dest.countryCode);
    return {
      token,
      travelerName: "Alex (Solo Traveler)",
      destinationCity: dest.name,
      destinationCountry: dest.country,
      status: "GREEN",
      nextWindowUtc: "23:30 CEST",
      readinessScore: 94,
      readinessGrade: "Grade A",
      milestones: [
        {
          id: "touchdown",
          label: "Flight Touchdown & Border Control",
          expectedTime: "18:40 CEST",
          completedTime: "18:55 CEST",
          status: "COMPLETED",
        },
        {
          id: "transit",
          label: "Express Rail Transit to Central Terminal",
          expectedTime: "20:30 CEST",
          completedTime: "20:45 CEST",
          status: "COMPLETED",
        },
        {
          id: "lodging",
          label: "Lodging Check-In & Room Securing",
          expectedTime: "23:15 CEST",
          completedTime: null,
          status: "PENDING",
        },
      ],
      consularHotlines: {
        usEmbassyPhone: country?.consularHotlines.usEmbassyPhone || "+1-202-501-4444",
        ukEmbassyPhone: country?.consularHotlines.ukEmbassyPhone || "",
        ausEmbassyPhone: country?.consularHotlines.ausEmbassyPhone || "",
      },
      emergencyNumbers: {
        police: country?.emergencyNumbers.police || dest.emergencyNumbers.generalOrPolice,
        ambulance: country?.emergencyNumbers.ambulance || dest.emergencyNumbers.ambulance,
        fire: country?.emergencyNumbers.fire || "112",
        touristPolice: country?.emergencyNumbers.touristPolice || null,
      },
    };
  },
);

export async function generateStaticParams() {
  return TOP_SOLO_DESTINATIONS.map((d) => ({
    token: d.slug,
  }));
}

export async function generateMetadata({ params }: GuardianPortalProps): Promise<Metadata> {
  const { token } = await params;
  const portal = await loadGuardianPortal(token);
  const cityName = portal?.destinationCity || token;
  const countryName = portal?.destinationCountry || "Destination";

  return {
    title: `Guardian Command Portal · Safe Ingress for ${cityName}`,
    description: `Preview of privacy-first parental monitoring and emergency consular dispatch packet for solo travel in ${cityName}, ${countryName}.`,
  };
}

export default async function GuardianPortalPage({ params }: GuardianPortalProps) {
  const { token } = await params;
  const portal = await loadGuardianPortal(token);

  if (!portal) {
    notFound();
  }

  const policeNumber = portal.emergencyNumbers.police;
  const ambulanceNumber = portal.emergencyNumbers.ambulance;
  const consularPhone = portal.consularHotlines.usEmbassyPhone || "+1-202-501-4444";

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Link
              href="/parents"
              className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            >
              <Icon name="arrowRight" className="size-3 rotate-180" />
              For Parents
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              Guardian Pass ID: GRD-{portal.token.slice(0, 5).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
              Preview Portal · Demo Data
            </span>
          </div>
        </div>

        {/* Live Reassuring Status Banner */}
        <Reveal>
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 dark:border-emerald-500/40 dark:bg-emerald-950/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white">
                  STATUS: {portal.status} · ALL INGRESS CHECKPOINTS CLEAR
                </span>
                <h1 className="mt-3 font-display text-3xl font-black text-slate-900 sm:text-4xl dark:text-amber-50">
                  {portal.travelerName} in {portal.destinationCity}, {portal.destinationCountry}
                </h1>
                <p className="mt-2 text-sm font-medium text-emerald-900 dark:text-emerald-200">
                  Touchdown and transit ingress checkpoints confirmed.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-emerald-500/30 bg-white/80 p-4 text-center backdrop-blur-xs dark:bg-slate-900/80">
                <span className="block font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                  Next Ingress Window
                </span>
                <span className="mt-1 block font-display text-2xl font-black text-slate-900 dark:text-amber-50">
                  {portal.nextWindowUtc}
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  Hotel Check-in Expected
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Main Grid: 2 Columns */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Left Column: Live Timeline & Child Readiness */}
          <div className="space-y-8">
            <GuardianHeartbeatIsland initialPortal={portal} />

            {/* Child Safety Readiness Scorecard */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                    Pre-Trip Safety Scorecard
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Protocols verified by your traveler prior to departure.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-center">
                  <span className="font-display text-xl font-black text-emerald-800 dark:text-emerald-300">
                    94/100
                  </span>
                  <span className="block font-mono text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    Grade A
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs font-mono">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <Icon name="check" className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Cards Segregated (2 Wallets)
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <Icon name="check" className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Offline City Maps Saved
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <Icon name="check" className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Preloaded Travel eSIM Active
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <Icon name="check" className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Local Scam Directory Briefed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Zero-Panic Emergency Dispatch Desk */}
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-rose-500/30 bg-white p-6 shadow-sm dark:border-rose-500/40 dark:bg-slate-900">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Direct Emergency Rescue Packet
              </span>
              <h3 className="mt-1 font-display text-xl font-black text-slate-900 dark:text-amber-50">
                Emergency Dispatch Hotlines
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Pre-programmed direct lines for {portal.destinationCity}. Tap to call immediately in
                the event of an unconfirmed alert.
              </p>

              <div className="mt-5 space-y-3">
                {/* Consular hotline */}
                <a
                  href={`tel:${consularPhone}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      Embassy Consular Crisis Desk
                    </span>
                    <div className="font-mono font-bold text-slate-900 dark:text-amber-50">
                      {consularPhone}
                    </div>
                  </div>
                  <span className="rounded-lg bg-amber-400 p-2 text-slate-950">
                    <Icon name="phone" className="size-4" />
                  </span>
                </a>

                {/* Local Police */}
                <a
                  href={`tel:${policeNumber}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      National Police ({portal.destinationCountry})
                    </span>
                    <div className="font-mono font-bold text-slate-900 dark:text-amber-50">
                      {policeNumber}
                    </div>
                  </div>
                  <span className="rounded-lg bg-rose-500 p-2 text-white">
                    <Icon name="phone" className="size-4" />
                  </span>
                </a>

                {/* Local Ambulance */}
                <a
                  href={`tel:${ambulanceNumber}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      Medical / Ambulance
                    </span>
                    <div className="font-mono font-bold text-slate-900 dark:text-amber-50">
                      {ambulanceNumber}
                    </div>
                  </div>
                  <span className="rounded-lg bg-emerald-500 p-2 text-white">
                    <Icon name="phone" className="size-4" />
                  </span>
                </a>
              </div>
            </div>

            {/* Privacy & Autonomy Note */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Icon name="shield" className="size-4 text-amber-500" />
                <h4 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                  Privacy & Autonomy Shield
                </h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                This portal does not continuously track your child&apos;s live GPS coordinates.
                Checkpoints are recorded upon explicit one-tap traveler verification. This preserves
                their travel freedom while giving you guaranteed contingency readiness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
