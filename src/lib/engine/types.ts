export type RiskTier = "Low" | "Moderate" | "Elevated" | "High";
export type GenderIdentity = "female" | "male" | "non_binary_queer" | "prefer_not_to_say";
export type ExperienceLevel = "first_time" | "occasional" | "seasoned_nomad";

export interface TravelerProfile {
  experienceLevel: ExperienceLevel;
  genderIdentity: GenderIdentity;
  riskAppetite: "cautious_calm" | "balanced" | "adventurous";
  gearValueTier: "minimal_phone_only" | "moderate_laptop_phone" | "high_value_cameras";
  languageFluencyLocal: "none" | "basic_phrases" | "conversational_fluent";
  financialRedundancy: {
    cardCount: number;
    bankCount: number;
    cardsSegregatedPockets: boolean;
    backupPhoneAvailable: boolean;
    hasEmergencyCashReserve: boolean;
  };
  communicationPlan: {
    hasDesignatedHomeContact: boolean;
    hasSharedItinerary: boolean;
    cellularType: "esim_preloaded" | "physical_sim_airport" | "roaming" | "wifi_only";
  };
}

export interface TripContext {
  destinationCity: string;
  destinationCountry: string;
  destinationRiskTier: RiskTier;
  arrivalHour: number; // 0-23
  transitMode: "flight" | "train" | "bus" | "ferry";
  lodgingType: "hotel" | "hostel_dorm" | "hostel_private" | "rental_airbnb";
  lodgingFloor: "ground" | "floors_2_to_4" | "floors_5_plus" | "unknown";
  hasOfflineMapDownloaded: boolean;
  hasPrebookedVerifiedTransit: boolean;
}

export interface SecurityAuditResult {
  soloReadinessScore: number; // 0-100
  grade: "A" | "B" | "C" | "D";
  criticalSPOFs: string[];
  recommendedArrivalTransit: {
    protocol: string;
    cashStrategy: string;
    contingencyFallback: string;
  };
  lodgingActionRequired: string;
}

export interface StreetEncounterInputs {
  unsolicited: boolean;
  personalSpaceBreachedUnder1Meter: boolean;
  claimsAuthorityWithoutUniform: boolean;
  demandsMoneyOrPassportOrMovement: boolean;
  forceOrWeaponPresented: boolean;
}

export type DeescalationAction =
  | "PASSIVE_CONTINUE"
  | "DISMISSIVE_STRIDE"
  | "SPATIAL_PIVOT_AND_STOP_GESTURE"
  | "REFUSE_HANDOFF_DUCK_INTO_STORE"
  | "CHALLENGE_AUTHORITY_DEMAND_STATION"
  | "SURRENDER_BAIT_WALLET_AND_DISENGAGE";

export interface StreetEncounterResolution {
  actionCode: DeescalationAction;
  script: string;
  posture: string;
  threatLevel: "green" | "yellow" | "amber" | "orange" | "crimson";
}
