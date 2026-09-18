"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  generateSituationalChecklist,
  type GeneratedChecklist,
} from "@/lib/engine/checklist-generator";
import { SECURITY_PILLARS, LIFECYCLE_PHASES } from "@/data/taxonomy";
import { ARCHETYPES } from "@/data/archetypes";
import { Icon } from "@/components/atoms/Icon";

interface ChecklistClientEngineProps {
  initialChecklist: GeneratedChecklist;
}

export function ChecklistClientEngine({ initialChecklist }: ChecklistClientEngineProps) {
  const [archetype, setArchetype] = useState<string>(
    initialChecklist.params.archetype || "solo-female",
  );
  const [riskTier, setRiskTier] = useState<"LOW" | "MODERATE" | "ELEVATED" | "HIGH">(
    initialChecklist.params.destinationRiskTier || "MODERATE",
  );
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [criticalOnly, setCriticalOnly] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Load persisted checklist state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sts_completed_checklists");
      if (saved) {
        setCompletedIds(new Set(JSON.parse(saved)));
      }
    } catch {
      // Non-fatal
    }
  }, []);

  const toggleItem = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem("sts_completed_checklists", JSON.stringify(Array.from(next)));
      } catch {
        // Non-fatal
      }
      return next;
    });
  };

  // Re-generate checklist when filters change
  const currentChecklist = useMemo(() => {
    return generateSituationalChecklist({
      archetype,
      destinationRiskTier: riskTier,
      phaseId: selectedPhase === "all" ? undefined : selectedPhase,
      pillarId: selectedPillar === "all" ? undefined : selectedPillar,
      criticalOnly,
    });
  }, [archetype, riskTier, selectedPhase, selectedPillar, criticalOnly]);

  // Real-time Scoring Matrix calculation
  const scoringAudit = useMemo(() => {
    const totalItems = currentChecklist.items.length;
    if (totalItems === 0) return { score: 100, grade: "A", unverifiedSPOFs: [] };

    let totalDeductionsPossible = 0;
    let activeDeductions = 0;
    const unverifiedSPOFs: string[] = [];

    for (const item of currentChecklist.items) {
      totalDeductionsPossible += item.scoringDeductionPoints;
      const isResolved = completedIds.has(item.id);

      if (!isResolved) {
        activeDeductions += item.scoringDeductionPoints;
        if (item.isSPOF) {
          unverifiedSPOFs.push(item.title);
        }
      }
    }

    // Normalized score out of 100
    let rawScore = Math.max(0, 100 - activeDeductions);
    const hasSPOF = unverifiedSPOFs.length > 0;

    // Enforce SPOF ceiling: Score is capped at 49 (Grade D / Inoculation Incomplete)
    if (hasSPOF && rawScore > 49) {
      rawScore = 49;
    }

    const grade = rawScore >= 90 ? "A" : rawScore >= 75 ? "B" : rawScore >= 55 ? "C" : "D";

    return {
      score: rawScore,
      grade,
      hasSPOF,
      unverifiedSPOFs,
      completedCount: currentChecklist.items.filter((i) => completedIds.has(i.id)).length,
      totalCount: totalItems,
    };
  }, [currentChecklist, completedIds]);

  return (
    <div className="space-y-8">
      {/* 1. Context Matrix Calibrator Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Taxonomy & Situation Calibrator
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-amber-50">
              Operational Threat Inoculation Matrix
            </h2>
          </div>

          {/* Critical Only Filter Toggle */}
          <button
            onClick={() => setCriticalOnly(!criticalOnly)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition ${
              criticalOnly
                ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                : "border-slate-200 text-slate-600 hover:border-amber-400 dark:border-slate-800 dark:text-slate-300"
            }`}
          >
            <Icon name="shield" className="size-3.5" />
            {criticalOnly ? "Showing Critical / SPOFs Only" : "Filter: All Standard & Critical"}
          </button>
        </div>

        {/* Filter Grid */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Archetype Selector */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              Traveler Archetype
            </label>
            <select
              value={archetype}
              onChange={(e) => setArchetype(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-50"
            >
              <option value="all">Universal (All Archetypes)</option>
              {ARCHETYPES.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Tier Selector */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              Destination Risk Tier
            </label>
            <select
              value={riskTier}
              onChange={(e) => setRiskTier(e.target.value as any)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-50"
            >
              <option value="LOW">LOW Risk (e.g., Tokyo, Zurich)</option>
              <option value="MODERATE">MODERATE Risk (e.g., Rome, Paris)</option>
              <option value="ELEVATED">ELEVATED Risk (e.g., Bangkok, Bogota)</option>
              <option value="HIGH">HIGH Threat (e.g., Hostile Corridors)</option>
            </select>
          </div>

          {/* Lifecycle Phase Filter */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              Lifecycle Phase
            </label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-50"
            >
              <option value="all">All Lifecycle Phases</option>
              {LIFECYCLE_PHASES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.order}. {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Security Pillar Filter */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              Security Pillar
            </label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 dark:text-amber-50"
            >
              <option value="all">All 7 Security Pillars</option>
              {SECURITY_PILLARS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.weight}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Scoring Matrix Banner */}
      <div
        className={`rounded-3xl border p-6 transition ${
          scoringAudit.hasSPOF
            ? "border-amber-500/40 bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-950/20"
            : "border-emerald-500/40 bg-emerald-500/10 dark:border-emerald-500/30 dark:bg-emerald-950/20"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white ${
                  scoringAudit.hasSPOF ? "bg-amber-600" : "bg-emerald-600"
                }`}
              >
                READINESS GRADE {scoringAudit.grade} · {scoringAudit.score}/100
              </span>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                {scoringAudit.completedCount} of {scoringAudit.totalCount} Protocols Verified
              </span>
            </div>

            <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-amber-50">
              {scoringAudit.hasSPOF
                ? "Incomplete Inoculation: Critical Single Point of Failure (SPOF) Active"
                : "Operational Inoculation Verified: Zero Single Points of Failure"}
            </h3>

            {scoringAudit.hasSPOF ? (
              <p className="mt-1 text-xs text-amber-900 dark:text-amber-300">
                Score is mathematically capped at 49 until unverified SPOF directives are resolved:
                <strong className="ml-1 font-bold">
                  {scoringAudit.unverifiedSPOFs.join(", ")}
                </strong>
              </p>
            ) : (
              <p className="mt-1 text-xs text-emerald-900 dark:text-emerald-300">
                All mission-critical redundancy gates satisfied. Travel profile is hardened against
                primary threat vectors.
              </p>
            )}
          </div>

          <div className="shrink-0 text-center sm:text-right">
            <div className="inline-block rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
              <span className="block font-mono text-[10px] font-bold uppercase text-slate-500">
                Readiness Score
              </span>
              <span className="font-display text-3xl font-black text-slate-900 dark:text-amber-50">
                {scoringAudit.score}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Actionable Checklist Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
            Situational Action Protocols ({currentChecklist.items.length})
          </h3>
          <span className="font-mono text-xs text-slate-500">
            Click checkbox to verify protocol completion
          </span>
        </div>

        {currentChecklist.items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 p-8 text-center text-xs font-mono text-slate-500 dark:border-slate-800">
            No checklist items match current filter criteria.
          </div>
        ) : (
          currentChecklist.items.map((item) => {
            const isChecked = completedIds.has(item.id);
            const isCritical = item.criticality === "CRITICAL";

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition ${
                  isChecked
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-80 dark:border-emerald-500/20"
                    : isCritical
                      ? "border-slate-300 bg-white shadow-xs dark:border-slate-700 dark:bg-slate-900"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-label={`Toggle ${item.title}`}
                    className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                      isChecked
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 hover:border-amber-400 dark:border-slate-600"
                    }`}
                  >
                    {isChecked && <Icon name="check" className="size-4" />}
                  </button>

                  <div className="flex-1">
                    {/* Header & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {item.id}
                      </span>

                      {item.isSPOF && (
                        <span className="rounded-md bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                          SPOF IMMUNITY GATE
                        </span>
                      )}

                      <span
                        className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          isCritical
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {item.criticality}
                      </span>

                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Method: {item.verificationType.replace(/_/g, " ")}
                      </span>

                      <span className="ml-auto font-mono text-xs font-bold text-slate-500">
                        Penalty: -{item.scoringDeductionPoints} pts
                      </span>
                    </div>

                    {/* Directive Title */}
                    <h4
                      className={`mt-2 font-display text-base font-bold transition ${
                        isChecked
                          ? "line-through text-slate-500 dark:text-slate-400"
                          : "text-slate-900 dark:text-amber-50"
                      }`}
                    >
                      {item.title}
                    </h4>

                    {/* Detailed Rationale */}
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>

                    {/* Operational Cross-References (Decision Table & Truth Table Links) */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono">
                      {item.decisionTableRef && (
                        <Link
                          href="/playbook/decision-matrices"
                          className="inline-flex items-center gap-1 text-amber-700 hover:underline dark:text-amber-400 font-bold"
                        >
                          <Icon name="table" className="size-3" />
                          Governed by {item.decisionTableRef} →
                        </Link>
                      )}

                      {item.truthTableRef && (
                        <Link
                          href="/playbook/decision-matrices"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400 font-bold"
                        >
                          <Icon name="shield" className="size-3" />
                          Validated by {item.truthTableRef} →
                        </Link>
                      )}

                      {item.recommendedGearSkus && item.recommendedGearSkus.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                          Hardware: {item.recommendedGearSkus.join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
