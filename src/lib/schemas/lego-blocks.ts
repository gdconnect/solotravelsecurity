import { z } from "zod";

/**
 * 1. Airport & Ingress Transit Hub Schema
 * Atomic LEGO block for arrival and transit gates.
 */
export const AirportSecurityHubSchema = z.object({
  iata: z.string().length(3),
  icao: z.string().length(4),
  name: z.string().min(1),
  city: z.string().min(1),
  citySlug: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().length(2),
  terminalsCount: z.number().int().positive(),
  primaryInternationalTerminal: z.string(),

  // Late-night transit cutoff parameters
  lateNightCurfew: z.object({
    expressRailLastDeparture: z.string().describe("HH:MM formatted 24h time or 'None'"),
    metroLastDeparture: z.string().describe("HH:MM formatted 24h time or 'None'"),
    nightBusAvailable: z.boolean(),
    nightBusRouteDetails: z.string().optional(),
    curfewVulnerabilityHour: z
      .number()
      .int()
      .min(0)
      .max(23)
      .describe("Hour from which public transit is non-viable"),
  }),

  // Official Taxi Staging Protocol (Anti-Tout Inoculation)
  officialTaxi: z.object({
    exactKioskLocation: z.string().describe("Precise physical location inside or outside terminal"),
    curbFloorLevel: z.string().describe("Ground floor vs upper departure level"),
    fareStructure: z.enum(["flat_rate", "metered", "zone_tiered"]),
    flatRateCityCenterEur: z.number().optional(),
    flatRateCityCenterLocal: z
      .object({
        amount: z.number(),
        currency: z.string(),
      })
      .optional(),
    officialVehicleVisualMarks: z
      .array(z.string())
      .describe("Livery, stickers, license plate details"),
    paymentMethodRisk: z.string().describe("Credit card acceptance vs cash-only driver claims"),
  }),

  // App Rideshare Protocol
  rideshare: z.object({
    servicesAllowed: z.array(z.string()).describe("e.g., ['Uber', 'Grab', 'Bolt']"),
    designatedPickupZone: z.string().describe("Exact parking structure, bay, or door"),
    isGeofencedOrBanned: z.boolean(),
    notes: z.string(),
  }),

  // Safe Staging & Waiting Areas (For late-night arrivals)
  safeWaitingZones: z.array(
    z.object({
      name: z.string(),
      location: z.string(),
      is24_7: z.boolean(),
      airsideOrLandside: z.enum(["airside", "landside"]),
      notes: z.string(),
    }),
  ),

  // Hallway Trap / Scam Inoculation
  scamToutWarning: z.object({
    activeInTerminal: z.boolean(),
    typicalToutHooks: z
      .array(z.string())
      .describe("Phrases touts say: 'Train is broken', 'Taxi line is 2 hours', etc."),
    chokePoints: z.array(z.string()).describe("Hallways or exits where touts loiter"),
  }),

  // Connectivity & Banking in Arrival Hall
  arrivalHallLogistics: z.object({
    officialSimCounters: z.array(z.string()),
    simMarkupWarning: z.string().optional(),
    officialBankAtms: z.array(z.string()).describe("Legitimate domestic bank ATM brands"),
    predatoryAtmsToAvoid: z.array(z.string()).describe("High-fee dynamic conversion ATM operators"),
  }),
});

export type AirportSecurityHub = z.infer<typeof AirportSecurityHubSchema>;

/**
 * 2. Threat & Scam Dossier Schema
 * Atomic LEGO block for deceptive attack vectors and observable truth tables.
 */
export const ThreatScamDossierSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  vectorCategory: z.enum([
    "financial_extortion",
    "counterfeit_official",
    "distraction_theft",
    "rigged_meter_taxi",
    "nightlife_drink_spiking",
    "fake_booking_rental",
    "honeytrap_romance",
  ]),
  severity: z.enum(["Low", "Moderate", "High", "Critical"]),
  associatedDestinations: z.array(z.string()).describe("City slugs or country codes"),
  primaryHotspots: z
    .array(z.string())
    .describe("Specific train stations, monuments, or nightlife strips"),

  // Deceptive Hook & Social Engineering Mechanics
  deceptiveHook: z.object({
    openingPhrase: z.string().describe("Verbatim opening line used by scammer"),
    psychologicalTrigger: z
      .string()
      .describe("E.g., false authority, reciprocity, urgency, fake friendliness"),
    mechanicStepByStep: z.array(z.string()),
  }),

  // Truth Table / Observable Falsification Conditions
  truthTable: z.object({
    conditions: z.array(
      z.object({
        id: z.string(),
        conditionText: z.string().describe("Observable physical or verbal fact"),
        isScamIndicator: z.boolean(),
      }),
    ),
    conclusiveRule: z.string().describe("Logical conclusion if conditions match"),
  }),

  // Immediate Actionable Escape Protocol
  escapeProtocol: z.object({
    primaryAction: z
      .string()
      .describe("Physical action: walk away, cross street, demand supervisor"),
    localRefusalPhrase: z.object({
      english: z.string(),
      local: z.string(),
      phonetic: z.string(),
    }),
    escalationContact: z.string().describe("Tourist police or general dispatch number"),
  }),
});

export type ThreatScamDossier = z.infer<typeof ThreatScamDossierSchema>;

/**
 * 3. Micro-Zone & Neighborhood Security Tier Schema
 * Atomic LEGO block for street-level safety differentials.
 */
export const MicroZoneDossierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  citySlug: z.string().min(1),
  countryCode: z.string().length(2),
  dayRiskTier: z.number().int().min(1).max(5).describe("1=Very Safe, 5=High Risk"),
  nightRiskTier: z.number().int().min(1).max(5),
  soloFemaleWalkabilityRating: z.number().int().min(1).max(5),

  // Street-level specifics
  redFlagCorridors: z.array(z.string()).describe("Specific streets or corners to avoid after dark"),
  safeThoroughfares: z.array(z.string()).describe("Well-lit, high-foot-traffic routes"),

  // 24/7 Sanctuary Network (Immediate refuge points)
  sanctuaries: z.array(
    z.object({
      type: z.enum([
        "convenience_store",
        "police_box",
        "pharmacy",
        "hotel_lobby",
        "transit_station",
      ]),
      name: z.string(),
      notes: z.string(),
    }),
  ),

  // Accommodation guidance
  lodgingRecommendation: z.object({
    isRecommendedForSolo: z.boolean(),
    recommendedSubPockets: z.array(z.string()),
    warnings: z.string(),
  }),
});

export type MicroZoneDossier = z.infer<typeof MicroZoneDossierSchema>;

/**
 * 4. First-Mile / Last-Mile Transit Modality Schema
 */
export const TransitModalitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  citySlug: z.string().min(1),
  modalityType: z.enum([
    "metro",
    "train",
    "city_bus",
    "night_bus",
    "official_taxi",
    "rideshare",
    "tuk_tuk_moto",
  ]),
  operatingHours: z.object({
    standardWeekday: z.string(),
    weekend: z.string(),
    nightFrequencyMinutes: z.number().optional(),
  }),
  farePaymentType: z.enum([
    "contactless_emv",
    "closed_loop_smartcard",
    "paper_ticket_only",
    "cash_only",
    "app_billed",
  ]),
  vulnerabilityIndex: z.number().int().min(1).max(5),
  pickpocketRisk: z.enum(["Low", "Moderate", "High", "Extreme"]),
  safetyVerificationRules: z.array(z.string()),
});

export type TransitModalityDossier = z.infer<typeof TransitModalitySchema>;

/**
 * 5. Regulatory, Legal & Health Landmine Schema
 * Atomic LEGO block for customs, medication restrictions, and legal traps.
 */
export const RegulatoryLandmineSchema = z.object({
  id: z.string().min(1),
  countryCode: z.string().length(2),
  countryName: z.string().min(1),
  category: z.enum([
    "medication_controlled",
    "vaping_customs",
    "alcohol_curfew",
    "id_carriage",
    "photo_drone_ban",
  ]),
  title: z.string().min(1),
  restrictedSubstancesOrItems: z.array(z.string()),
  legalStatus: z.enum([
    "strictly_banned",
    "permit_required",
    "quantity_limited",
    "curfew_enforced",
  ]),
  permitName: z.string().optional().describe("E.g., Yakkan Shoumei in Japan"),
  permitLeadTimeDays: z.number().int().optional(),
  permitApplicationUrl: z.string().optional(),
  penaltySummary: z.string().describe("Fine, immediate detention, deportation"),
  proceduralAction: z.string().describe("Exact operational instruction for traveler"),
});

export type RegulatoryLandmineDossier = z.infer<typeof RegulatoryLandmineSchema>;

/**
 * 6. Lodging Perimeter Security Audit Matrix Schema
 */
export const LodgingAuditSchema = z.object({
  lodgingType: z.enum(["hotel", "hostel_dorm", "capsule", "airbnb_apartment", "guesthouse"]),
  floorLevelSweetSpot: z.object({
    idealMinFloor: z.number().int(),
    idealMaxFloor: z.number().int(),
    groundFloorVulnerability: z.string(),
    highFloorFireRisk: z.string(),
  }),
  lockInspectionProtocol: z.array(z.string()),
  recommendedBarrierGear: z
    .array(z.string())
    .describe("Door stop alarm, portable lock, rubber wedge"),
  checkInScript: z.string().describe("Discreet room request script"),
});

export type LodgingAuditMatrix = z.infer<typeof LodgingAuditSchema>;

/**
 * Combined Playbook Result (Assembled from LEGO blocks)
 */
export const IngressPlaybookResultSchema = z.object({
  hub: AirportSecurityHubSchema,
  arrivalHour: z.number().int().min(0).max(23),
  archetypeSlug: z.string(),
  ingressRiskScore: z.number().int().min(0).max(100),
  riskTier: z.enum(["Low", "Moderate", "High", "Critical"]),
  recommendedTransitMode: z.string(),
  transitProtocolSteps: z.array(z.string()),
  safeWaitingOption: z.string().optional(),
  relevantScams: z.array(ThreatScamDossierSchema),
  truthTableChecks: z.array(z.string()),
  printableEmergencyData: z.object({
    policeNumber: z.string(),
    ambulanceNumber: z.string(),
    embassyNumber: z.string().optional(),
    officialTaxiKiosk: z.string(),
    localAddressNative: z.string().optional(),
  }),
});

export type IngressPlaybookResult = z.infer<typeof IngressPlaybookResultSchema>;
