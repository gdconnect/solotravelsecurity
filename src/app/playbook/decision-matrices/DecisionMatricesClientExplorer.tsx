"use client";

import { useState } from "react";
import {
  DT_INGRESS_TRANSIT,
  DT_LODGING_FLOOR,
  evaluateDecisionTable,
} from "@/lib/engine/decision-tables";
import {
  TT_STREET_ENCOUNTER,
  TT_NIGHT_INGRESS,
  evaluateTruthTable,
} from "@/lib/engine/truth-tables";

export function DecisionMatricesClientExplorer() {
  const [activeTab, setActiveTab] = useState<"decision-tables" | "truth-tables">("decision-tables");

  // Ingress DT Interactive state
  const [dtRisk, setDtRisk] = useState<string>("MODERATE");
  const [dtNight, setDtNight] = useState<boolean>(true);
  const [dtGender, setDtGender] = useState<string>("female");
  const [dtPrebooked, setDtPrebooked] = useState<boolean>(false);

  // Street Encounter TT Interactive state
  const [ttP1, setTtP1] = useState<boolean>(true);
  const [ttP2, setTtP2] = useState<boolean>(true);
  const [ttP3, setTtP3] = useState<boolean>(true);
  const [ttP4, setTtP4] = useState<boolean>(true);
  const [ttP5, setTtP5] = useState<boolean>(false);

  // Lodging DT state
  const [lodgingFloor, setLodgingFloor] = useState<string>("ground");

  // Evaluated Ingress outcome
  const ingressOutcome = evaluateDecisionTable<{
    protocol: string;
    stagingArea: string;
    cashStrategy: string;
    contingencyFallback: string;
  }>(DT_INGRESS_TRANSIT, {
    riskTier: dtRisk,
    isNightArrival: dtNight,
    genderIdentity: dtGender,
    hasPrebookedTransit: dtPrebooked,
  });

  // Evaluated Lodging outcome
  const lodgingOutcome = evaluateDecisionTable<{
    primaryAction: string;
    hardwareRequired: string;
    riskAlert: string;
  }>(DT_LODGING_FLOOR, {
    lodgingType: "hotel",
    lodgingFloor,
  });

  // Evaluated Street Encounter outcome
  const streetOutcome = evaluateTruthTable<{
    actionCode: string;
    threatLevel: string;
    script: string;
    posture: string;
  }>(TT_STREET_ENCOUNTER, {
    unsolicited: ttP1,
    personalSpaceBreachedUnder1Meter: ttP2,
    claimsAuthorityWithoutUniform: ttP3,
    demandsMoneyOrPassportOrMovement: ttP4,
    forceOrWeaponPresented: ttP5,
  });

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("decision-tables")}
          className={`pb-3 px-4 font-display text-sm font-bold transition border-b-2 ${
            activeTab === "decision-tables"
              ? "border-amber-500 text-amber-700 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          1. Multi-Variable Decision Tables (Condition → Directive)
        </button>

        <button
          onClick={() => setActiveTab("truth-tables")}
          className={`pb-3 px-4 font-display text-sm font-bold transition border-b-2 ${
            activeTab === "truth-tables"
              ? "border-amber-500 text-amber-700 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          2. Formal Truth Tables (Exhaustive Boolean Logic)
        </button>
      </div>

      {activeTab === "decision-tables" ? (
        <div className="space-y-10">
          {/* Decision Table 1: Ingress Transit */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">
                  {DT_INGRESS_TRANSIT.id} · {DT_INGRESS_TRANSIT.pillarId}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-amber-50">
                  {DT_INGRESS_TRANSIT.title}
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                5 Formal Rules · Deterministic Resolution
              </span>
            </div>

            {/* Interactive Condition Tester */}
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-50">
                Live Parameter Simulator
              </h4>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-500">Destination Risk Tier</label>
                  <select
                    value={dtRisk}
                    onChange={(e) => setDtRisk(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 font-bold dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="ELEVATED">ELEVATED</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500">Night Arrival (21:00-06:00)</label>
                  <select
                    value={dtNight ? "true" : "false"}
                    onChange={(e) => setDtNight(e.target.value === "true")}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 font-bold dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="true">YES (Night Arrival)</option>
                    <option value="false">NO (Daylight Arrival)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500">Gender Identity</label>
                  <select
                    value={dtGender}
                    onChange={(e) => setDtGender(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 font-bold dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="female">Solo Female</option>
                    <option value="male">Solo Male</option>
                    <option value="non_binary_queer">Non-Binary / Queer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500">Pre-Booked Transit</label>
                  <select
                    value={dtPrebooked ? "true" : "false"}
                    onChange={(e) => setDtPrebooked(e.target.value === "true")}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 font-bold dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="true">YES (Confirmed Voucher)</option>
                    <option value="false">NO (Curbside Dispatch Needed)</option>
                  </select>
                </div>
              </div>

              {/* Live Emitted Outcome */}
              <div className="mt-5 rounded-xl border border-emerald-500/40 bg-white p-4 dark:bg-slate-950">
                <div className="font-mono text-[10px] font-bold uppercase text-emerald-600">
                  ✓ Deterministic Directive Emitted:
                </div>
                <div className="mt-1 font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                  {ingressOutcome.protocol}
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <div>
                    <strong>Staging Area:</strong> {ingressOutcome.stagingArea}
                  </div>
                  <div>
                    <strong>Cash Strategy:</strong> {ingressOutcome.cashStrategy}
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono text-amber-800 dark:text-amber-300">
                  ⚠ <strong>Contingency:</strong> {ingressOutcome.contingencyFallback}
                </div>
              </div>
            </div>

            {/* Complete Tabular Rule Representation */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Risk Tier</th>
                    <th className="py-2.5 px-3">Night?</th>
                    <th className="py-2.5 px-3">Gender</th>
                    <th className="py-2.5 px-3">Prebooked?</th>
                    <th className="py-2.5 px-3">Action Directive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {DT_INGRESS_TRANSIT.rules.map((r) => (
                    <tr key={r.ruleId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-amber-700 dark:text-amber-400">
                        {r.ruleId}
                      </td>
                      <td className="py-3 px-3">
                        {Array.isArray(r.conditions.riskTier)
                          ? r.conditions.riskTier.join("/")
                          : String(r.conditions.riskTier)}
                      </td>
                      <td className="py-3 px-3">{String(r.conditions.isNightArrival)}</td>
                      <td className="py-3 px-3">{String(r.conditions.genderIdentity)}</td>
                      <td className="py-3 px-3">{String(r.conditions.hasPrebookedTransit)}</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {String(r.actions.protocol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Decision Table 2: Lodging Floor */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">
                  {DT_LODGING_FLOOR.id} · {DT_LODGING_FLOOR.pillarId}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-amber-50">
                  {DT_LODGING_FLOOR.title}
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3 font-mono text-xs">
              <div>
                <label className="block text-slate-500">Test Assigned Floor</label>
                <select
                  value={lodgingFloor}
                  onChange={(e) => setLodgingFloor(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 font-bold dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="ground">Ground Floor</option>
                  <option value="floors_2_to_4">Floors 2 to 4 (Sweetspot)</option>
                  <option value="floors_5_plus">Floor 5+ (High-Rise)</option>
                </select>
              </div>
              <div className="sm:col-span-2 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950">
                <div className="font-bold text-slate-900 dark:text-amber-50">
                  {lodgingOutcome.primaryAction}
                </div>
                <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                  Hardware: {lodgingOutcome.hardwareRequired}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Truth Tables Tab */
        <div className="space-y-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                    {TT_STREET_ENCOUNTER.id}
                  </span>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    Completeness Proven (2⁵ = 32 Invariants Covered)
                  </span>
                </div>
                <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-amber-50">
                  {TT_STREET_ENCOUNTER.title}
                </h3>
              </div>
            </div>

            {/* Interactive Proposition Toggles */}
            <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-50">
                Toggle Boolean Propositions:
              </h4>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs font-mono">
                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttP1}
                    onChange={(e) => setTtP1(e.target.checked)}
                    className="size-4 rounded text-blue-600"
                  />
                  <span>
                    <strong>P1:</strong> Unsolicited Approach
                  </span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttP2}
                    onChange={(e) => setTtP2(e.target.checked)}
                    className="size-4 rounded text-blue-600"
                  />
                  <span>
                    <strong>P2:</strong> Space Breached (&lt;1m)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttP3}
                    onChange={(e) => setTtP3(e.target.checked)}
                    className="size-4 rounded text-blue-600"
                  />
                  <span>
                    <strong>P3:</strong> Plainclothes Authority
                  </span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttP4}
                    onChange={(e) => setTtP4(e.target.checked)}
                    className="size-4 rounded text-blue-600"
                  />
                  <span>
                    <strong>P4:</strong> Demands Asset/Wallet
                  </span>
                </label>

                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ttP5}
                    onChange={(e) => setTtP5(e.target.checked)}
                    className="size-4 rounded text-rose-600"
                  />
                  <span className="text-rose-700 dark:text-rose-400 font-bold">
                    <strong>P5:</strong> Weapon / Overwhelming Force
                  </span>
                </label>
              </div>

              {/* Resolved Tactical Posture */}
              <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase text-slate-500">
                    Tactical Action Code Emitted:
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-black uppercase tracking-wider text-white ${
                      streetOutcome.threatLevel === "crimson"
                        ? "bg-rose-600"
                        : streetOutcome.threatLevel === "orange"
                          ? "bg-amber-600"
                          : streetOutcome.threatLevel === "amber"
                            ? "bg-amber-500"
                            : "bg-emerald-600"
                    }`}
                  >
                    LEVEL: {streetOutcome.threatLevel.toUpperCase()}
                  </span>
                </div>

                <div className="mt-2 font-mono text-base font-black text-slate-900 dark:text-amber-50">
                  {streetOutcome.actionCode}
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                  <span className="block font-mono text-[10px] font-bold text-slate-400">
                    Mandatory Verbal Script:
                  </span>
                  <p className="mt-0.5 font-display text-sm font-bold text-amber-800 dark:text-amber-300">
                    {streetOutcome.script}
                  </p>
                </div>

                <div className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-mono">
                  <strong>Physical Posture:</strong> {streetOutcome.posture}
                </div>
              </div>
            </div>

            {/* Truth Table Rows */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">P1 (Approach)</th>
                    <th className="py-2.5 px-3">P2 (&lt;1m)</th>
                    <th className="py-2.5 px-3">P3 (Authority)</th>
                    <th className="py-2.5 px-3">P4 (Demands)</th>
                    <th className="py-2.5 px-3">P5 (Weapon)</th>
                    <th className="py-2.5 px-3">Resolved Action Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {TT_STREET_ENCOUNTER.rows.map((row) => (
                    <tr key={row.rowId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-blue-600">{row.rowId}</td>
                      <td className="py-2.5 px-3">{String(row.inputs.unsolicited)}</td>
                      <td className="py-2.5 px-3">
                        {String(row.inputs.personalSpaceBreachedUnder1Meter)}
                      </td>
                      <td className="py-2.5 px-3">
                        {String(row.inputs.claimsAuthorityWithoutUniform)}
                      </td>
                      <td className="py-2.5 px-3">
                        {String(row.inputs.demandsMoneyOrPassportOrMovement)}
                      </td>
                      <td className="py-2.5 px-3">{String(row.inputs.forceOrWeaponPresented)}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {row.outputs.actionCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Truth Table 2: Night Ingress Abort Gate */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                  {TT_NIGHT_INGRESS.id}
                </span>
                <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-amber-50">
                  {TT_NIGHT_INGRESS.title}
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                4 Critical Invariants · 100% Deterministic
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">Plate Matches?</th>
                    <th className="py-2.5 px-3">Driver Knows Name?</th>
                    <th className="py-2.5 px-3">Stranger in Car?</th>
                    <th className="py-2.5 px-3">Child Lock Broken?</th>
                    <th className="py-2.5 px-3">Boarding Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {TT_NIGHT_INGRESS.rows.map((row) => (
                    <tr key={row.rowId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-blue-600">{row.rowId}</td>
                      <td className="py-2.5 px-3">{String(row.inputs.licensePlateMatchesApp)}</td>
                      <td className="py-2.5 px-3">{String(row.inputs.driverKnowsTravelerName)}</td>
                      <td className="py-2.5 px-3">
                        {String(row.inputs.unauthorizedPassengerInVehicle)}
                      </td>
                      <td className="py-2.5 px-3">
                        {String(row.inputs.childLocksEngagedOrBroken)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                        {row.outputs.boardingDecision}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
