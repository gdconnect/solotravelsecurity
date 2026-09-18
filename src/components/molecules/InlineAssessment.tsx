"use client";

import { useEffect, useRef, useState } from "react";
import { useMachine } from "@xstate/react";
import { quizMachine } from "@/lib/machines/quiz-machine";
import { ScoreMeter } from "@/components/atoms/ScoreMeter";
import { SPOFAlertList } from "@/components/molecules/SPOFAlertList";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import type { RiskTier } from "@/lib/engine/types";
import Link from "next/link";

export interface InlineAssessmentProps {
  initialDestinationCity?: string;
  initialDestinationCountry?: string;
  initialDestinationRiskTier?: RiskTier;
  initialArchetype?: string;
}

export function InlineAssessment({
  initialDestinationCity = "Rome",
  initialDestinationCountry = "IT",
  initialDestinationRiskTier = "Moderate",
  initialArchetype = "solo-female",
}: InlineAssessmentProps) {
  const [snapshot, send] = useMachine(quizMachine);
  const initializedRef = useRef(false);

  // Local step form states
  const [arrivalHour, setArrivalHour] = useState(22); // default late night
  const [transitMode, setTransitMode] = useState<"flight" | "train" | "bus">("flight");
  const [prebookedTransit, setPrebookedTransit] = useState(false);

  const [lodgingType, setLodgingType] = useState<"hotel" | "hostel" | "rental_airbnb">(
    "rental_airbnb",
  );
  const [lodgingFloor, setLodgingFloor] = useState<"ground" | "floors_2_to_4" | "floors_5_plus">(
    "ground",
  );

  const [cardCount, setCardCount] = useState(1);
  const [cardsSegregated, setCardsSegregated] = useState(false);
  const [cellularType, setCellularType] = useState<"esim" | "roaming" | "wifi_only">("wifi_only");
  const [hasEmergencyContact, setHasEmergencyContact] = useState(true);

  // Pre-fill initial context from props once
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      send({
        type: "INIT_PRELOAD",
        payload: {
          destinationCity: initialDestinationCity,
          destinationCountry: initialDestinationCountry,
          destinationRiskTier: initialDestinationRiskTier,
          archetype: initialArchetype,
        },
      });
    }
  }, [
    initialDestinationCity,
    initialDestinationCountry,
    initialDestinationRiskTier,
    initialArchetype,
    send,
  ]);

  const handleArrivalNext = () => {
    send({
      type: "SUBMIT_ARRIVAL",
      arrivalHour,
      transitMode,
      prebookedTransit,
    });
  };

  const handleLodgingNext = () => {
    send({
      type: "SUBMIT_LODGING",
      lodgingType,
      lodgingFloor,
    });
  };

  const handleRedundancySubmit = () => {
    send({
      type: "SUBMIT_REDUNDANCY",
      cardCount,
      cardsSegregated,
      cellularType,
      hasEmergencyContact,
    });
  };

  const isStepArrival = snapshot.matches("stepArrival");
  const isStepLodging = snapshot.matches("stepLodging");
  const isStepRedundancy = snapshot.matches("stepRedundancy");
  const isComplete = snapshot.matches("evaluationComplete");

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      {/* Quiz Progress Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Rapid 90-Second Assessment · {snapshot.context.destinationCity}
          </span>
          <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
            Solo Travel Readiness Audit
          </h3>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs font-black text-slate-600 dark:text-slate-400">
          <span className={isStepArrival ? "text-amber-700 dark:text-amber-400" : ""}>1</span> /
          <span className={isStepLodging ? "text-amber-700 dark:text-amber-400" : ""}>2</span> /
          <span className={isStepRedundancy ? "text-amber-700 dark:text-amber-400" : ""}>3</span>
        </div>
      </div>

      {/* STEP 1: Arrival & Transit */}
      {isStepArrival && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
              Phase 1: Arrival Window & Transit Mode
            </h4>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              When and how are you touching down in {snapshot.context.destinationCity}?
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Arrival Hour (Local Time):</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-black">
                {String(arrivalHour).padStart(2, "0")}:00 (
                {arrivalHour >= 21 || arrivalHour < 6 ? "Night Ingress" : "Daylight"})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={arrivalHour}
              onChange={(e) => setArrivalHour(Number(e.target.value))}
              className="mt-2 w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Transit Arrival Mode:
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["flight", "train", "bus"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransitMode(mode)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize transition ${
                    transitMode === mode
                      ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:border-amber-400 dark:text-amber-300"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              I have pre-arranged verified airport transit / hotel driver
            </span>
            <input
              type="checkbox"
              checked={prebookedTransit}
              onChange={(e) => setPrebookedTransit(e.target.checked)}
              className="size-4 accent-amber-500"
            />
          </label>

          <Button variant="amber" onClick={handleArrivalNext} className="w-full justify-center">
            Continue to Lodging Vetting →
          </Button>
        </div>
      )}

      {/* STEP 2: Lodging */}
      {isStepLodging && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
              Phase 2: Lodging & Sanctuary Perimeter
            </h4>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              Where will you be sleeping in {snapshot.context.destinationCity}?
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Lodging Category:
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  { key: "hotel", label: "Hotel (Manned desk)" },
                  { key: "rental_airbnb", label: "Rental / Airbnb" },
                  { key: "hostel", label: "Hostel (Shared)" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLodgingType(item.key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    lodgingType === item.key
                      ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:border-amber-400 dark:text-amber-300"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Room Floor Level:
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  { key: "ground", label: "Ground Floor" },
                  { key: "floors_2_to_4", label: "Floors 2 to 4 (Sweet spot)" },
                  { key: "floors_5_plus", label: "Floor 5+" },
                ] as const
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLodgingFloor(item.key)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    lodgingFloor === item.key
                      ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:border-amber-400 dark:text-amber-300"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <Button variant="amber" onClick={handleLodgingNext} className="w-full justify-center">
            Continue to Redundancy Check →
          </Button>
        </div>
      )}

      {/* STEP 3: Redundancy & Escalation */}
      {isStepRedundancy && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
              Phase 3: Financial & Communication Redundancy
            </h4>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              Testing for Single Points of Failure (SPOFs) before takeoff.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              How many payment cards are you bringing?
            </label>
            <div className="mt-2 flex gap-3">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCardCount(num)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-black transition ${
                    cardCount === num
                      ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:border-amber-400 dark:text-amber-300"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {num} Card{num > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {cardCount > 1 && (
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Cards are segregated in separate pockets / bags (not in one wallet)
              </span>
              <input
                type="checkbox"
                checked={cardsSegregated}
                onChange={(e) => setCardsSegregated(e.target.checked)}
                className="size-4 accent-amber-500"
              />
            </label>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Cellular Connectivity Strategy:
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { key: "esim" as const, label: "Preloaded eSIM" },
                { key: "roaming" as const, label: "Home Roaming" },
                { key: "wifi_only" as const, label: "Wi-Fi Only (No SIM)" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCellularType(item.key)}
                  className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${
                    cellularType === item.key
                      ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:border-amber-400 dark:text-amber-300"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Designated emergency contact holds a verified copy of my itinerary
            </span>
            <input
              type="checkbox"
              checked={hasEmergencyContact}
              onChange={(e) => setHasEmergencyContact(e.target.checked)}
              className="size-4 accent-amber-500"
            />
          </label>

          <Button
            variant="amber"
            onClick={handleRedundancySubmit}
            className="w-full justify-center"
          >
            Generate Security Audit Result →
          </Button>
        </div>
      )}

      {/* COMPLETED: Score & SPOF Result */}
      {isComplete && (
        <div className="space-y-6 text-center">
          <ScoreMeter
            score={snapshot.context.score}
            grade={
              snapshot.context.score >= 90
                ? "A"
                : snapshot.context.score >= 75
                  ? "B"
                  : snapshot.context.score >= 55
                    ? "C"
                    : "D"
            }
          />

          <div className="text-left">
            <SPOFAlertList spofs={snapshot.context.spofs} />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href={`/report/${snapshot.context.destinationCity.toLowerCase()}?score=${snapshot.context.score}&hour=${snapshot.context.arrivalHour}&floor=${snapshot.context.lodgingFloor}&cards=${snapshot.context.cardCount}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-black text-slate-950 transition hover:bg-amber-300"
            >
              <Icon name="shield" className="size-4" />
              View Personalised Dossier
            </Link>

            <button
              type="button"
              onClick={() => send({ type: "RESTART" })}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 font-display text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Retake Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
