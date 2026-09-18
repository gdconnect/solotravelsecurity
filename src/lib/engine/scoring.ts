/**
 * src/lib/engine/scoring.ts
 *
 * Multi-dimensional weighted scoring matrix engine for Solo Travel Security.
 * Evaluates readiness across the 7 sovereign pillars, applies deterministic
 * risk penalties, and enforces Single Point of Failure (SPOF) score ceilings.
 */

import type { TravelerProfile, TripContext, SecurityAuditResult } from "./types";
import { resolveArrivalTransit, resolveLodgingAction } from "./decision-tables";
import { SECURITY_PILLARS } from "@/data/taxonomy";

export interface PillarScore {
  pillarId: string;
  name: string;
  weight: number;
  earned: number;
  max: number;
  percentage: number;
}

export interface DetailedSecurityAuditResult extends SecurityAuditResult {
  isCappedBySPOF: boolean;
  scoreCapReason: string | null;
  pillarBreakdown: PillarScore[];
  resolvedChecklistIds: string[];
}

export function calculateSoloReadiness(
  profile: TravelerProfile,
  trip: TripContext,
): DetailedSecurityAuditResult {
  let score = 100;
  const spofs: string[] = [];
  let isCapped = false;
  let capReason: string | null = null;

  // Track pillar sub-scores
  const pillarScores: Record<string, { earned: number; max: number }> = {
    "PIL-FINANCIAL": { earned: 20, max: 20 },
    "PIL-PERIMETER": { earned: 20, max: 20 },
    "PIL-COMMS": { earned: 15, max: 15 },
    "PIL-TRANSIT": { earned: 15, max: 15 },
    "PIL-THREAT": { earned: 10, max: 10 },
    "PIL-DIGITAL": { earned: 10, max: 10 },
    "PIL-CONSULAR": { earned: 10, max: 10 },
  };

  // --- 1. FINANCIAL REDUNDANCY PILLAR (20%) ---
  if (profile.financialRedundancy.cardCount < 2) {
    score -= 25;
    pillarScores["PIL-FINANCIAL"].earned -= 15;
    spofs.push(
      "Single Payment Card (Critical SPOF): If swallowed by an ATM or blocked by fraud algorithms, you have zero immediate funds.",
    );
    isCapped = true;
    capReason = "Single payment card leaves zero backup in foreign jurisdiction.";
  } else if (!profile.financialRedundancy.cardsSegregatedPockets) {
    score -= 15;
    pillarScores["PIL-FINANCIAL"].earned -= 10;
    spofs.push(
      "Single Pocket Fault: Multiple cards carried in one bag. If lost or pickpocketed, all are lost simultaneously.",
    );
  }

  if (!profile.financialRedundancy.hasEmergencyCashReserve) {
    score -= 8;
    pillarScores["PIL-FINANCIAL"].earned -= 5;
    spofs.push(
      "Zero Emergency Hard Cash: No stashed reserve ($100 USD/EUR) for power or card network outages.",
    );
  }

  // --- 2. TRANSIT INGRESS & FIRST-MILE PILLAR (15%) ---
  const isNightArrival = trip.arrivalHour >= 21 || trip.arrivalHour < 6;
  if (isNightArrival && trip.destinationRiskTier !== "Low" && !trip.hasPrebookedVerifiedTransit) {
    score -= 20;
    pillarScores["PIL-TRANSIT"].earned -= 12;
    spofs.push(
      "Blind Night Ingress (Critical SPOF): Arriving after dark in an unfamiliar hub without verified transport.",
    );
    isCapped = true;
    capReason = "Unverified night transit in moderate/high risk tier is primary predation window.";
  }

  if (!trip.hasOfflineMapDownloaded) {
    score -= 10;
    pillarScores["PIL-TRANSIT"].earned -= 6;
    spofs.push(
      "No Offline Map: Reliance on live data in arrival corridors creates hesitation marks and orientation panic.",
    );
  }

  // --- 3. COMMUNICATION & ESCALATION PILLAR (15%) ---
  if (
    !profile.communicationPlan.hasDesignatedHomeContact ||
    !profile.communicationPlan.hasSharedItinerary
  ) {
    score -= 20;
    pillarScores["PIL-COMMS"].earned -= 12;
    spofs.push(
      "Isolation SPOF: No trusted contact back home holds a verified copy of your itinerary and lodging.",
    );
    isCapped = true;
    capReason = "Zero remote guardian contact leaves emergency search without reference pins.";
  }

  if (profile.communicationPlan.cellularType === "wifi_only") {
    score -= 12;
    pillarScores["PIL-COMMS"].earned -= 8;
    spofs.push(
      "Connectivity Blackout: Wi-Fi-only transit leaves you unable to verify drivers or summon consular help.",
    );
  }

  // --- 4. LODGING & PERIMETER DEFENSE PILLAR (20%) ---
  if (trip.lodgingFloor === "ground") {
    score -= 15;
    pillarScores["PIL-PERIMETER"].earned -= 12;
    spofs.push(
      "Ground-Floor Exposure: Ground rooms have the highest historical break-in and window tampering rate.",
    );
  } else if (trip.lodgingFloor === "unknown") {
    score -= 5;
    pillarScores["PIL-PERIMETER"].earned -= 4;
  }

  // --- 5. STREET THREAT & DE-ESCALATION PILLAR (10%) ---
  if (profile.experienceLevel === "first_time" && trip.destinationRiskTier === "High") {
    score -= 10;
    pillarScores["PIL-THREAT"].earned -= 6;
    spofs.push(
      "High Exposure Ratio: First-time solo trip in an elevated risk environment requires strict procedural discipline.",
    );
  }

  // Clamp raw score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Enforce SPOF ceiling: If any critical SPOF is triggered, cap score at 49 (Grade D / High Exposure)
  if (isCapped && score > 49) {
    score = 49;
  }

  // Calculate pillar percentages
  const pillarBreakdown: PillarScore[] = SECURITY_PILLARS.map((p) => {
    const raw = pillarScores[p.id] || { earned: p.weight, max: p.weight };
    const earned = Math.max(0, Math.min(raw.max, raw.earned));
    return {
      pillarId: p.id,
      name: p.name,
      weight: p.weight,
      earned,
      max: raw.max,
      percentage: Math.round((earned / raw.max) * 100),
    };
  });

  const grade: "A" | "B" | "C" | "D" =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 55 ? "C" : "D";

  const arrivalDecision = resolveArrivalTransit(trip, profile, isNightArrival);
  const lodgingAction = resolveLodgingAction(trip);

  return {
    soloReadinessScore: score,
    grade,
    criticalSPOFs: spofs,
    isCappedBySPOF: isCapped,
    scoreCapReason: capReason,
    pillarBreakdown,
    recommendedArrivalTransit: arrivalDecision,
    lodgingActionRequired: lodgingAction,
    resolvedChecklistIds: [
      ...(profile.financialRedundancy.cardCount >= 2 ? ["CHK-FIN-001"] : []),
      ...(profile.financialRedundancy.hasEmergencyCashReserve ? ["CHK-FIN-002"] : []),
      ...(trip.hasPrebookedVerifiedTransit ? ["CHK-TRN-001"] : []),
      ...(trip.hasOfflineMapDownloaded ? ["CHK-TRN-002"] : []),
      ...(profile.communicationPlan.hasDesignatedHomeContact ? ["CHK-COM-002"] : []),
      ...(trip.lodgingFloor === "floors_2_to_4" ? ["CHK-PER-001"] : []),
    ],
  };
}
