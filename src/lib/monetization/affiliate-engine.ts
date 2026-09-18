/**
 * src/lib/monetization/affiliate-engine.ts
 *
 * Deterministic High-Yield Affiliate Monetization Engine.
 * Implements Decision Table DT-AFFILIATE-ROUTING-01 and Truth Table TT-AFFILIATE-COMPLIANCE-01.
 */

import affiliateCatalog from "@/data/search/affiliate-yield-catalog.json";
import paretoDecisionTables from "@/data/search/pareto-decision-tables.json";

export interface AffiliatePartner {
  partnerId: string;
  brandName: string;
  categoryId: string;
  payoutType: string;
  payoutAmountUsd: number;
  cookieWindowDays: number;
  targetRiskTiers: string[];
  targetArchetypes?: string[];
  primaryValueProp: string;
  affiliateUrlTemplate: string;
}

export interface AffiliateRecommendationResult {
  primaryPartner: AffiliatePartner | null;
  secondaryPartner: AffiliatePartner | null;
  expectedCpaUsd: number;
  placementPriority: string;
  ftcDisclaimer: string;
}

/**
 * Evaluates contextual factors to return top high-ticket affiliate monetization partners.
 */
export function getAffiliateRecommendations(
  destinationRiskTier: string = "Moderate",
  travelerArchetype: string = "solo-female",
  remoteOffGrid: boolean = false,
): AffiliateRecommendationResult {
  const partnersMap = new Map<string, AffiliatePartner>(
    affiliateCatalog.partners.map((p) => [p.partnerId, p as AffiliatePartner]),
  );

  // Default fallback: SafetyWing + Airalo
  let primaryId = "AFF-SAFETYWING";
  let secondaryId = "AFF-AIRALO";
  let expectedCpa = 75.0;
  let placement = "spec_matrix_top";

  // Match against DT-AFFILIATE-ROUTING-01 rules
  const routingTable = paretoDecisionTables.decisionTables.find(
    (dt) => dt.id === "DT-AFFILIATE-ROUTING-01",
  );

  if (routingTable) {
    for (const rule of routingTable.rules) {
      const cond = rule.conditions as {
        destinationRiskTier?: string;
        travelerArchetype?: string;
        remoteOffGrid?: boolean;
      };

      const matchRisk =
        !cond.destinationRiskTier || cond.destinationRiskTier === destinationRiskTier;
      const matchArchetype =
        !cond.travelerArchetype || cond.travelerArchetype === travelerArchetype;
      const matchRemote = cond.remoteOffGrid === undefined || cond.remoteOffGrid === remoteOffGrid;

      if (matchRisk && matchArchetype && matchRemote) {
        const act = rule.actions as unknown as {
          primaryPartnerId: string;
          secondaryPartnerId: string;
          expectedCpaUsd: number;
          placementPriority: string;
        };
        primaryId = act.primaryPartnerId;
        secondaryId = act.secondaryPartnerId;
        expectedCpa = act.expectedCpaUsd;
        placement = act.placementPriority;
        break;
      }
    }
  }

  return {
    primaryPartner: partnersMap.get(primaryId) || null,
    secondaryPartner: partnersMap.get(secondaryId) || null,
    expectedCpaUsd: expectedCpa,
    placementPriority: placement,
    ftcDisclaimer: affiliateCatalog.complianceRules.disclaimerText,
  };
}

/**
 * Standard compliant rel attributes for commercial links
 */
export const COMPLIANT_AFFILIATE_REL = "nofollow sponsored noopener noreferrer";
