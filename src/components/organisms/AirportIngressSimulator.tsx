"use client";

import { useState, useMemo } from "react";
import type { AirportSecurityHub } from "@/lib/schemas/lego-blocks";
import {
  calculateIngressRiskScore,
  evaluateTransitDecisionTable,
} from "@/lib/engine/lego-combiner";
import { Icon } from "@/components/atoms/Icon";
import { ScoreMeter, Badge } from "@/components/atoms";

interface AirportIngressSimulatorProps {
  hub: AirportSecurityHub;
}

export function AirportIngressSimulator({ hub }: AirportIngressSimulatorProps) {
  const [arrivalHour, setArrivalHour] = useState<number>(23); // Default to 23:00 (peak curfew exposure)
  const [archetype, setArchetype] = useState<string>("solo-female");
  const [luggage, setLuggage] = useState<
    "light_backpack" | "single_roller" | "heavy_multiple_bags"
  >("single_roller");
  const [budgetTier, setBudgetTier] = useState<"budget" | "balanced" | "safety_first">(
    "safety_first",
  );

  const riskAssessment = useMemo(() => {
    return calculateIngressRiskScore(hub, arrivalHour, archetype, luggage);
  }, [hub, arrivalHour, archetype, luggage]);

  const decision = useMemo(() => {
    return evaluateTransitDecisionTable(hub, arrivalHour, riskAssessment.tier, budgetTier);
  }, [hub, arrivalHour, riskAssessment.tier, budgetTier]);

  const isPastCurfew =
    hub.lateNightCurfew.curfewVulnerabilityHour > 0 &&
    (arrivalHour >= hub.lateNightCurfew.curfewVulnerabilityHour || arrivalHour <= 5);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <Badge tone="amber">
            <Icon name="sliders" className="size-3" />
            Interactive Ingress Decision Engine
          </Badge>
          <h2 className="mt-2 font-display text-xl font-black text-slate-900 sm:text-2xl dark:text-amber-50">
            Simulate Your Arrival at {hub.iata}
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            Combine your arrival hour, archetype, and luggage profile to trigger deterministic
            transit protocols.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Ingress Vulnerability
            </span>
            <span
              className={`font-display text-2xl font-black ${
                riskAssessment.tier === "Critical"
                  ? "text-rose-600 dark:text-rose-400"
                  : riskAssessment.tier === "High"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {riskAssessment.score}/100 ({riskAssessment.tier})
            </span>
          </div>
          <ScoreMeter
            score={Math.max(0, 100 - riskAssessment.score)}
            grade={
              riskAssessment.score >= 75
                ? "D"
                : riskAssessment.score >= 50
                  ? "C"
                  : riskAssessment.score >= 30
                    ? "B"
                    : "A"
            }
            size="md"
          />
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Arrival Hour */}
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Arrival Time: {String(arrivalHour).padStart(2, "0")}:00
          </label>
          <input
            type="range"
            min={0}
            max={23}
            value={arrivalHour}
            onChange={(e) => setArrivalHour(Number(e.target.value))}
            className="mt-2 w-full accent-amber-500"
          />
          <div className="flex justify-between font-mono text-[10px] text-slate-600 dark:text-slate-400">
            <span>00:00 (Midnight)</span>
            <span>12:00</span>
            <span>23:00 (Late)</span>
          </div>
        </div>

        {/* 2. Archetype */}
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Traveler Archetype
          </label>
          <select
            value={archetype}
            onChange={(e) => setArchetype(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-amber-50"
          >
            <option value="solo-female">Solo Female Traveler</option>
            <option value="first-time-solo">First-Time Solo Explorer</option>
            <option value="digital-nomad">Digital Nomad with Gear</option>
            <option value="experienced">Experienced Solo Traveler</option>
          </select>
        </div>

        {/* 3. Luggage Profile */}
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Luggage Encumbrance
          </label>
          <select
            value={luggage}
            onChange={(e) => setLuggage(e.target.value as any)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-amber-50"
          >
            <option value="light_backpack">Light Backpack Only (High Mobility)</option>
            <option value="single_roller">Single Carry-on Roller (Standard)</option>
            <option value="heavy_multiple_bags">Heavy 2+ Checked Bags (Low Mobility)</option>
          </select>
        </div>

        {/* 4. Priority Tier */}
        <div>
          <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Decision Priority
          </label>
          <select
            value={budgetTier}
            onChange={(e) => setBudgetTier(e.target.value as any)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-amber-50"
          >
            <option value="safety_first">Safety First (Zero Risk)</option>
            <option value="balanced">Balanced (Pragmatic)</option>
            <option value="budget">Cost Conscious (Transit Priority)</option>
          </select>
        </div>
      </div>

      {/* Decision Table Output */}
      <div className="mt-8 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-center gap-2">
          <Icon name="check" className="size-4 text-amber-600 dark:text-amber-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Deterministic Decision Table Match:
          </span>
          <span className="rounded-md bg-amber-200/80 px-2 py-0.5 font-display text-xs font-black text-amber-950 dark:bg-amber-900 dark:text-amber-100">
            {decision.recommendedMode}
          </span>
        </div>

        {isPastCurfew && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            <Icon name="alertTriangle" className="mt-0.5 size-4 shrink-0 text-rose-500" />
            <div>
              <strong>Late Night Rail Curfew Warning:</strong> Public express trains have terminated
              for the night (Last train: {hub.lateNightCurfew.expressRailLastDeparture}). Hallway
              touts operate heavily during this window. Follow the exact protocol below.
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Execution Steps:
          </span>
          <ol className="space-y-2">
            {decision.protocolSteps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-[10px] font-bold text-slate-950">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {decision.safeWaitingOption && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Icon name="clock" className="size-3.5 text-blue-500" />
              <span>Safe Overnight Staging Harbor:</span>
            </div>
            <p className="mt-1 leading-relaxed text-blue-900 dark:text-blue-300">
              {decision.safeWaitingOption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
