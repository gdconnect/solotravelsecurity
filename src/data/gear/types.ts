import type { RiskTier, GenderIdentity, ExperienceLevel } from "@/lib/engine/types";

export type GearCategory =
  | "perimeter_defense"
  | "transit_security"
  | "digital_connectivity"
  | "asset_protection"
  | "power_hardware"
  | "medical_hygiene"
  | "travel_insurance"
  | "books_guides"
  | "privacy_saas"
  | "local_services";

export interface SituationalContext {
  trip: {
    destinationCity: string;
    destinationCountry: string;
    destinationCountryIso2: string;
    destinationRiskTier: RiskTier;
    arrivalHour: number; // 0-23
    transitMode: "flight" | "train" | "bus" | "ferry";
    lodgingType: "hotel" | "hostel_dorm" | "hostel_private" | "rental_airbnb";
    lodgingFloor: "ground" | "floors_2_to_4" | "floors_5_plus" | "unknown";
    hasPrebookedVerifiedTransit?: boolean;
    hasOfflineMapDownloaded?: boolean;
  };
  profile: {
    genderIdentity: GenderIdentity;
    experienceLevel: ExperienceLevel;
    gearValueTier: "minimal_phone_only" | "moderate_laptop_phone" | "high_value_cameras";
    cellularType: "esim_preloaded" | "physical_sim_airport" | "roaming" | "wifi_only";
    backupPhoneAvailable?: boolean;
    cardsSegregatedPockets?: boolean;
    hasEmergencyCashReserve?: boolean;
  };
}

export interface ProductSchemaOrg {
  itemType?: "Product" | "Book" | "FinancialProduct" | "SoftwareApplication" | "LocalBusiness";
  brand: string;
  author?: string;
  gtin13?: string;
  isbn?: string;
  image?: string;
  price: string;
  priceCurrency: string;
  availability?: string;
  affiliateUrl: string;
  rating: {
    value: number;
    count: number;
  };
  pros: string[];
  cons: string[];
}

export interface ProductRule {
  sku: string;
  name: string;
  category: GearCategory;
  howToRole?: "tool" | "supply";
  priorityRank: number;
  situationalRationale: string;
  triggerCriteria: Record<string, unknown>;
  schemaOrg: ProductSchemaOrg;
}

export interface MatchedProduct extends ProductRule {
  isPrimaryRecommendation: boolean;
}
