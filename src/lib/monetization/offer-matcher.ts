/**
 * src/lib/monetization/offer-matcher.ts
 *
 * Dynamic User-Offer Matching Engine.
 * Implements DT-OFFER-ELIGIBILITY-01, DT-PAYOUT-ARBITRAGE-02, and SM-OFFER-RELEVANCE-01.
 */

import partnerCatalog from "@/data/monetization/partner-intake-catalog.json";

export interface UserQueryContext {
  archetype: string;
  destinationCity: string;
  destinationCountryIso2: string;
  riskTier: "Low" | "Moderate" | "Elevated" | "High" | "Critical";
  lifecycle:
    | "pre_trip"
    | "night_arrival"
    | "lodging_lockdown"
    | "day_roaming"
    | "nightlife_social"
    | "crisis_escalation";
  healthProfile?:
    | "standard_healthy"
    | "pre_existing_condition"
    | "extreme_sports_scooter"
    | "off_grid_remote";
  deviceCapability?: "esim_capable" | "physical_sim_only";
  subId?: string;
}

export interface MatchedOfferOutput {
  offerId: string;
  brandName: string;
  category: string;
  compositeScore: number;
  lifeSafetyScore: number;
  effectiveCpaUsd: number;
  resolvedUrl: string;
  relAttributes: string;
  placementSlot:
    | "hero_emergency_banner"
    | "spec_matrix_row"
    | "inline_checklist_recommendation"
    | "sticky_bottom_drawer";
  primaryValueProp: string;
  pros: string[];
  cons: string[];
}

export interface UserOfferMatchResult {
  evaluatedAtUtc: string;
  queryContext: UserQueryContext;
  matchedOffers: MatchedOfferOutput[];
  slotPlacements: {
    hero_emergency_banner: string | null;
    spec_matrix_row: string | null;
    inline_checklist_recommendation: string | null;
    sticky_bottom_drawer: string | null;
  };
  ftcDisclosure: string;
  exclusionAudit: { offerId: string; reason: string }[];
}

// Sanctioned countries blocked by international law
const SANCTIONED_COUNTRIES = ["KP", "IR", "SY", "CU"];

/**
 * Resolves tracking URL templates with runtime contextual tokens.
 */
function resolveUrlTemplate(
  template: string,
  context: UserQueryContext,
  clickId: string = "clk_" + Date.now().toString(36),
): string {
  return template
    .replace(/{subid}/g, encodeURIComponent(context.subId || "sts_organic"))
    .replace(/{dest_country}/g, encodeURIComponent(context.destinationCountryIso2))
    .replace(/{dest_city}/g, encodeURIComponent(context.destinationCity))
    .replace(/{archetype}/g, encodeURIComponent(context.archetype))
    .replace(/{click_id}/g, encodeURIComponent(clickId))
    .replace(/{session_id}/g, encodeURIComponent(clickId));
}

/**
 * Evaluates contextual user profile against partner intake catalog and returns slotted offers.
 */
export function matchUserWithOffers(context: UserQueryContext): UserOfferMatchResult {
  const evaluatedAtUtc = new Date().toISOString();
  const exclusionAudit: { offerId: string; reason: string }[] = [];
  const eligibleCandidateList: { score: number; offer: any }[] = [];

  const isSanctioned = SANCTIONED_COUNTRIES.includes(context.destinationCountryIso2.toUpperCase());

  for (const offer of partnerCatalog.offers) {
    // 1. Sanctions Check
    if (isSanctioned) {
      exclusionAudit.push({ offerId: offer.offerId, reason: "DESTINATION_SANCTIONED_OFAC" });
      continue;
    }

    // 2. Hardware Compatibility Check
    if (
      offer.targetingRules.requiresEsimHardware &&
      context.deviceCapability === "physical_sim_only"
    ) {
      exclusionAudit.push({ offerId: offer.offerId, reason: "DEVICE_LACKS_ESIM_HARDWARE" });
      continue;
    }

    // 3. Country Exclusion Check
    if (
      offer.targetingRules.excludedCountries.includes(context.destinationCountryIso2.toUpperCase())
    ) {
      exclusionAudit.push({ offerId: offer.offerId, reason: "COUNTRY_EXCLUDED_BY_PARTNER" });
      continue;
    }

    // 4. Risk Tier Match
    if (!offer.targetingRules.eligibleRiskTiers.includes(context.riskTier)) {
      exclusionAudit.push({ offerId: offer.offerId, reason: "RISK_TIER_MISMATCH" });
      continue;
    }

    // 5. Archetype Match
    if (!offer.targetingRules.eligibleArchetypes.includes(context.archetype)) {
      exclusionAudit.push({ offerId: offer.offerId, reason: "ARCHETYPE_MISMATCH" });
      continue;
    }

    // 6. Scooter / Extreme Sports Exclusion Check
    if (
      context.healthProfile === "extreme_sports_scooter" &&
      !offer.targetingRules.coversScooterMotorcycle &&
      ["travel_health_insurance", "medical_evac"].includes(offer.category)
    ) {
      exclusionAudit.push({ offerId: offer.offerId, reason: "NO_SCOOTER_MOTORCYCLE_COVERAGE" });
      continue;
    }

    // 7. Calculate SM-OFFER-RELEVANCE-01 Composite Score
    const lifeSafety = offer.editorialReview.lifeSafetyScore; // 0 - 100
    const expectedRpm =
      1000 *
      0.03 *
      offer.commercialTerms.historicalConversionRate *
      (offer.commercialTerms.cpaAmountUsd || 10);
    const commercialYieldScore = Math.min(100.0, expectedRpm * 15.0);

    let contextualAffinity = 80.0;
    if (context.lifecycle === "night_arrival" && offer.category === "preloaded_esim") {
      contextualAffinity = 100.0;
    } else if (
      ["High", "Critical"].includes(context.riskTier) &&
      offer.category === "medical_evac"
    ) {
      contextualAffinity = 100.0;
    } else if (
      context.archetype === "first-time-solo" &&
      offer.category === "parent_guardian_service"
    ) {
      contextualAffinity = 100.0;
    } else if (context.healthProfile === "off_grid_remote" && offer.category === "satellite_sos") {
      contextualAffinity = 100.0;
    }

    const frictionScore = [
      "preloaded_esim",
      "travel_health_insurance",
      "medical_evac",
      "parent_guardian_service",
    ].includes(offer.category)
      ? 95.0
      : 60.0;

    const compositeScore =
      Math.round(
        (0.35 * lifeSafety +
          0.3 * commercialYieldScore +
          0.2 * contextualAffinity +
          0.15 * frictionScore) *
          10,
      ) / 10;

    eligibleCandidateList.push({ score: compositeScore, offer });
  }

  // Sort candidate offers by composite score descending
  eligibleCandidateList.sort((a, b) => b.score - a.score);

  // Assign placement slots based on scores and categories
  const slotPlacements: {
    hero_emergency_banner: string | null;
    spec_matrix_row: string | null;
    inline_checklist_recommendation: string | null;
    sticky_bottom_drawer: string | null;
  } = {
    hero_emergency_banner: null,
    spec_matrix_row: null,
    inline_checklist_recommendation: null,
    sticky_bottom_drawer: null,
  };

  const matchedOffers: MatchedOfferOutput[] = [];

  for (let i = 0; i < eligibleCandidateList.length; i++) {
    const { score, offer } = eligibleCandidateList[i];
    let slot:
      | "hero_emergency_banner"
      | "spec_matrix_row"
      | "inline_checklist_recommendation"
      | "sticky_bottom_drawer" = "spec_matrix_row";

    if (i === 0 && score >= 85.0) {
      slot = "hero_emergency_banner";
      slotPlacements.hero_emergency_banner = offer.offerId;
    } else if (i === 1) {
      slot = "sticky_bottom_drawer";
      slotPlacements.sticky_bottom_drawer = offer.offerId;
    } else if (i === 2) {
      slot = "inline_checklist_recommendation";
      slotPlacements.inline_checklist_recommendation = offer.offerId;
    } else {
      slot = "spec_matrix_row";
      if (!slotPlacements.spec_matrix_row) slotPlacements.spec_matrix_row = offer.offerId;
    }

    matchedOffers.push({
      offerId: offer.offerId,
      brandName: offer.title,
      category: offer.category,
      compositeScore: score,
      lifeSafetyScore: offer.editorialReview.lifeSafetyScore,
      effectiveCpaUsd: offer.commercialTerms.cpaAmountUsd || 0,
      resolvedUrl: resolveUrlTemplate(offer.trackingConfig.urlTemplate, context),
      relAttributes: offer.trackingConfig.relAttributes || "nofollow sponsored noopener noreferrer",
      placementSlot: slot,
      primaryValueProp: offer.shortTagline,
      pros: offer.editorialReview.pros,
      cons: offer.editorialReview.cons,
    });
  }

  return {
    evaluatedAtUtc,
    queryContext: context,
    matchedOffers,
    slotPlacements,
    ftcDisclosure:
      "Editorial Disclosure: SoloTravelSecurity objectively evaluates and lab-tests all safety gear and emergency services. When you acquire vetted solutions through our links, we may receive compensation at no added cost to you.",
    exclusionAudit,
  };
}
