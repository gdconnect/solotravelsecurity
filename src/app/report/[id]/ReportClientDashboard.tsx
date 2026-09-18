"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import type { DestinationSecurityProfile } from "@/data/destinations";
import { ScoreMeter } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import {
  IngressTimeline,
  SPOFAlertList,
  TruthTableTester,
  CutoutEmergencyCard,
} from "@/components/molecules";
import { RecommendationSection } from "@/components/organisms";
import { calculateSoloReadiness } from "@/lib/engine/scoring";
import type { TravelerProfile, TripContext } from "@/lib/engine/types";
import { evaluateProductsForSituation } from "@/data/gear/matcher";
import type { SituationalContext } from "@/data/gear/types";
import { TripwirePanel } from "./TripwirePanel";

interface ReportClientDashboardProps {
  destination: DestinationSecurityProfile;
}

export function ReportClientDashboard({ destination }: ReportClientDashboardProps) {
  const searchParams = useSearchParams();

  const hourParam = searchParams.get("hour");
  const floorParam = searchParams.get("floor");
  const cardsParam = searchParams.get("cards");

  const arrivalHour = hourParam ? Number.parseInt(hourParam, 10) : 22;
  const lodgingFloor = (floorParam as "ground" | "floors_2_to_4" | "floors_5_plus") || "ground";
  const cardCount = cardsParam ? Number.parseInt(cardsParam, 10) : 1;

  const audit = useMemo(() => {
    const profile: TravelerProfile = {
      experienceLevel: "first_time",
      genderIdentity: "female",
      riskAppetite: "cautious_calm",
      gearValueTier: "moderate_laptop_phone",
      languageFluencyLocal: "none",
      financialRedundancy: {
        cardCount,
        bankCount: Math.min(cardCount, 2),
        cardsSegregatedPockets: cardCount > 1,
        backupPhoneAvailable: false,
        hasEmergencyCashReserve: false,
      },
      communicationPlan: {
        hasDesignatedHomeContact: true,
        hasSharedItinerary: true,
        cellularType: "esim_preloaded",
      },
    };

    const trip: TripContext = {
      destinationCity: destination.name,
      destinationCountry: destination.countryCode,
      destinationRiskTier: destination.riskTier,
      arrivalHour,
      transitMode: "flight",
      lodgingType: "hotel",
      lodgingFloor,
      hasOfflineMapDownloaded: false,
      hasPrebookedVerifiedTransit: false,
    };

    return calculateSoloReadiness(profile, trip);
  }, [destination, arrivalHour, lodgingFloor, cardCount]);

  const matchedProducts = useMemo(() => {
    const context: SituationalContext = {
      trip: {
        destinationCity: destination.name,
        destinationCountry: destination.country,
        destinationCountryIso2: destination.countryCode,
        destinationRiskTier: destination.riskTier,
        arrivalHour,
        transitMode: "flight",
        lodgingType: "hotel",
        lodgingFloor,
        hasPrebookedVerifiedTransit: false,
        hasOfflineMapDownloaded: false,
      },
      profile: {
        genderIdentity: "female",
        experienceLevel: "first_time",
        gearValueTier: "moderate_laptop_phone",
        cellularType: "esim_preloaded",
        cardsSegregatedPockets: cardCount > 1,
        backupPhoneAvailable: false,
        hasEmergencyCashReserve: false,
      },
    };

    return evaluateProductsForSituation(context);
  }, [destination, arrivalHour, lodgingFloor, cardCount]);

  return (
    <div className="space-y-12">
      {/* SECTION 1: Score & Critical SPOF Radar */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-center font-mono text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Overall Readiness
          </h3>
          <div className="mt-4">
            <ScoreMeter score={audit.soloReadinessScore} grade={audit.grade} size="md" />
          </div>
        </div>

        <div className="space-y-4">
          <SPOFAlertList spofs={audit.criticalSPOFs} />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            <strong className="font-bold text-slate-900 dark:text-white">Lodging Mandate:</strong>{" "}
            {audit.lodgingActionRequired}
          </div>
        </div>
      </div>

      {/* SECTION 2: 120-Minute Arrival Timeline */}
      <section>
        <IngressTimeline
          destinationCity={destination.name}
          arrivalHour={arrivalHour}
          transitProtocol={audit.recommendedArrivalTransit.protocol}
          cashStrategy={audit.recommendedArrivalTransit.cashStrategy}
          contingencyFallback={audit.recommendedArrivalTransit.contingencyFallback}
        />
      </section>

      {/* SECTION 3: Streetwise Truth Table Engine */}
      <section>
        <TruthTableTester />
      </section>

      {/* SECTION 4: Dead-Man Tripwire (preview, no alerts sent) */}
      <section>
        <TripwirePanel destinationCity={destination.name} />
      </section>

      {/* SECTION 5: The Guardian Pass (Parent Peace of Mind) */}
      <section className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 dark:border-amber-400/30 dark:from-amber-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-slate-950">
                Stop Frantic Texts
              </span>
              <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                The Guardian Pass
              </span>
            </div>
            <h3 className="mt-2 font-display text-xl font-black text-slate-900 dark:text-amber-50">
              Keep Mom & Dad Informed Without Sacrificing Independence
            </h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Give your family a clean, reassuring live portal with your verified touchdown
              heartbeats, transit ingress timeline, and pre-loaded emergency embassy contacts. Zero
              battery-draining GPS surveillance.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={`/guardian/${destination.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-xs font-black text-slate-950 transition hover:bg-amber-300 shadow-sm"
            >
              <span>Preview Parent Portal</span>
              <Icon name="arrowRight" className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: Polymorphic Situational Recommendations */}
      <RecommendationSection products={matchedProducts} destinationCity={destination.name} />

      {/* SECTION 7: Cutout Emergency Card */}
      <section>
        <CutoutEmergencyCard
          destinationCity={destination.name}
          destinationCountry={destination.country}
          policeNumber={destination.emergencyNumbers.generalOrPolice}
          ambulanceNumber={destination.emergencyNumbers.ambulance}
          touristPoliceNumber={destination.emergencyNumbers.touristPolice}
          localPhrases={destination.safetyPhrases}
        />
      </section>
    </div>
  );
}
