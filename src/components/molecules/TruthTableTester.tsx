"use client";

import { useState } from "react";
import { resolveStreetEncounter } from "@/lib/engine/truth-tables";
import type { StreetEncounterInputs } from "@/lib/engine/types";
import { Icon } from "@/components/atoms/Icon";

export function TruthTableTester() {
  const [inputs, setInputs] = useState<StreetEncounterInputs>({
    unsolicited: true,
    personalSpaceBreachedUnder1Meter: false,
    claimsAuthorityWithoutUniform: false,
    demandsMoneyOrPassportOrMovement: false,
    forceOrWeaponPresented: false,
  });

  const toggle = (key: keyof StreetEncounterInputs) => {
    setInputs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const result = resolveStreetEncounter(inputs);

  const threatBadges = {
    green:
      "bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
    yellow:
      "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
    amber:
      "bg-orange-500/10 text-orange-800 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300",
    orange:
      "bg-rose-500/10 text-rose-800 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300",
    crimson: "bg-rose-900/30 text-rose-800 border-rose-600 dark:bg-rose-900/40 dark:text-rose-200",
  }[result.threatLevel];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Deterministic Logic Engine
        </span>
        <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
          Street Confrontation & De-escalation Truth Table
        </h3>
        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
          Toggle encounter parameters to observe the exact, non-negotiable operational response.
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Toggle Inputs */}
        <div className="space-y-2.5">
          <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Encounter Booleans
          </span>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Unsolicited Approach (Out of nowhere)
            </span>
            <input
              type="checkbox"
              checked={inputs.unsolicited}
              onChange={() => toggle("unsolicited")}
              className="size-4 accent-amber-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Personal Space Breached (&lt; 1 meter)
            </span>
            <input
              type="checkbox"
              checked={inputs.personalSpaceBreachedUnder1Meter}
              onChange={() => toggle("personalSpaceBreachedUnder1Meter")}
              className="size-4 accent-amber-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Claims Authority Without Uniform/Vehicle
            </span>
            <input
              type="checkbox"
              checked={inputs.claimsAuthorityWithoutUniform}
              onChange={() => toggle("claimsAuthorityWithoutUniform")}
              className="size-4 accent-amber-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Demands Cash / Passport / Move Location
            </span>
            <input
              type="checkbox"
              checked={inputs.demandsMoneyOrPassportOrMovement}
              onChange={() => toggle("demandsMoneyOrPassportOrMovement")}
              className="size-4 accent-amber-500"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-rose-300 bg-rose-50/50 p-3 transition dark:border-rose-900/50 dark:bg-rose-950/20">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
              Force or Weapon Presented (Duress)
            </span>
            <input
              type="checkbox"
              checked={inputs.forceOrWeaponPresented}
              onChange={() => toggle("forceOrWeaponPresented")}
              className="size-4 accent-rose-600"
            />
          </label>
        </div>

        {/* Output Resolution Box */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Resolved Directive
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${threatBadges}`}
              >
                Threat Level: {result.threatLevel}
              </span>
            </div>

            <h4 className="mt-3 font-display text-base font-black text-slate-900 dark:text-amber-50">
              {result.actionCode.replace(/_/g, " ")}
            </h4>

            <div className="mt-3 rounded-lg border border-amber-300/40 bg-amber-500/10 p-3 dark:border-amber-400/20 dark:bg-amber-500/15">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Verbal Script
              </span>
              <p className="mt-1 font-mono text-sm font-black text-slate-900 dark:text-amber-100">
                {result.script}
              </p>
            </div>

            <div className="mt-3">
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                Physical Posture & Movement
              </span>
              <p className="mt-1 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                {result.posture}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 text-[10px] text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <Icon name="shield" className="mr-1 inline size-3 text-amber-700 dark:text-amber-400" />
            Deterministic logic eliminates cognitive freeze during adrenaline spikes.
          </div>
        </div>
      </div>
    </div>
  );
}
