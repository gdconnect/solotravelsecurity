import type { MicroZoneDossier } from "@/lib/schemas/lego-blocks";

export const PREPOPULATED_MICRO_ZONES: MicroZoneDossier[] = [
  {
    id: "zone-rome-termini",
    name: "Termini Station & Esquilino District",
    citySlug: "rome",
    countryCode: "IT",
    dayRiskTier: 2,
    nightRiskTier: 4,
    soloFemaleWalkabilityRating: 2,

    redFlagCorridors: [
      "Via Giovanni Giolitti (south side of rail terminal along track 24) after 22:00",
      "Piazza dei Cinquecento bus terminal after 23:00",
      "Piazza Vittorio Emanuele II perimeter gardens at night",
    ],

    safeThoroughfares: [
      "Via Cavour (well-lit commercial avenue with regular police patrols)",
      "Via Nazionale (busy shopping boulevard with active transit)",
    ],

    sanctuaries: [
      {
        type: "pharmacy",
        name: "Farmacia Termini (24h continuous service)",
        notes:
          "Located inside the lower shopping gallery of Stazione Termini. Staffed 24/7 with emergency bell.",
      },
      {
        type: "police_box",
        name: "Polizia Ferroviaria (Polfer Termini)",
        notes: "Stationed on track platform level near Track 1. Uniformed armed officers 24/7.",
      },
      {
        type: "hotel_lobby",
        name: "Hotel Quirinale Lobby",
        notes: "Via Nazionale 7. 24h concierge, brightly lit, security staff at entrance.",
      },
    ],

    lodgingRecommendation: {
      isRecommendedForSolo: false,
      recommendedSubPockets: [
        "Monti district (10-minute walk west of Termini) - cobblestone alleys, vibrant dining, far safer evening feel.",
      ],
      warnings:
        "While budget hostels cluster around Giolitti/Marsala, late-night solo walking with luggage exposes travelers to aggressive touts and pickpockets.",
    },
  },

  {
    id: "zone-tokyo-kabukicho",
    name: "Kabukicho Nightlife District (Shinjuku)",
    citySlug: "tokyo",
    countryCode: "JP",
    dayRiskTier: 1,
    nightRiskTier: 3,
    soloFemaleWalkabilityRating: 3,

    redFlagCorridors: [
      "Ichiban-gai alleyways past the neon red gate between 00:00 and 04:00",
      "Backstreets surrounding the Cine City Plaza / Godzilla Building",
      "Secondary side alleys heading toward Okubo with uncredentialed touts",
    ],

    safeThoroughfares: [
      "Yasukuni Dori (wide multi-lane arterial avenue with continuous taxi ranks and lighting)",
      "Shinjuku Station East Exit plaza (high foot traffic, well patrolled)",
    ],

    sanctuaries: [
      {
        type: "police_box",
        name: "Kabukicho Koban (Police Box)",
        notes:
          "Located directly at the entrance of Kabukicho 1-Chome near the neon sign. Staffed 24/7 by Metropolitan Police.",
      },
      {
        type: "convenience_store",
        name: "7-Eleven Kabukicho Center Store",
        notes: "24/7 staffed, security cameras, ATM, immediate sanctuary if followed.",
      },
      {
        type: "hotel_lobby",
        name: "Hotel Gracery Shinjuku Lobby (8F)",
        notes:
          "Elevator requires room key late at night, but 8th floor terrace and front desk are staffed around the clock.",
      },
    ],

    lodgingRecommendation: {
      isRecommendedForSolo: true,
      recommendedSubPockets: [
        "Nishi-Shinjuku (West Exit government district) - quiet, wide sidewalks, luxury and business hotels with high security.",
        "Shinjuku-Sanchome - charming dining, upscale department stores, significantly calmer vibe.",
      ],
      warnings:
        "Never follow street promoters offering bar discounts or 'free seating' in Kabukicho. Strict zero-tolerance for street touts.",
    },
  },

  {
    id: "zone-bangkok-sukhumvit-nana",
    name: "Lower Sukhumvit (Soi 4 to Soi 11)",
    citySlug: "bangkok",
    countryCode: "TH",
    dayRiskTier: 2,
    nightRiskTier: 3,
    soloFemaleWalkabilityRating: 3,

    redFlagCorridors: [
      "Soi 4 (Nana Plaza alley) after midnight with heavy motorcycle taxi congestion",
      "Footbridges over Sukhumvit Road between BTS Nana and BTS Asok after 01:00",
      "Unlit sub-sois (dead-end alleys) off Soi 11",
    ],

    safeThoroughfares: [
      "Main Sukhumvit Road underneath the BTS Skytrain viaduct (continuous vehicular traffic)",
      "Soi 11 main street up to the Aloft Hotel (well-lit, active security personnel)",
    ],

    sanctuaries: [
      {
        type: "convenience_store",
        name: "7-Eleven Sukhumvit Soi 11 Corner",
        notes: "Air-conditioned 24/7 refuge with ATM and high visibility.",
      },
      {
        type: "transit_station",
        name: "BTS Nana / BTS Asok Security Desks",
        notes: "Staffed during operating hours (06:00 - 00:00).",
      },
      {
        type: "hotel_lobby",
        name: "The Westin Grande Sukhumvit Lobby",
        notes:
          "Directly connected to BTS Asok / MRT Sukhumvit interchange. 24h manned security barrier.",
      },
    ],

    lodgingRecommendation: {
      isRecommendedForSolo: true,
      recommendedSubPockets: [
        "Sukhumvit Soi 15-19 (quiet residential side sois close to Terminal 21)",
        "Phrom Phong (Soi 24/39) - upscale Japanese expat enclave with immaculate safety record.",
      ],
      warnings:
        "Keep valuables zipped across chest when walking near street vendor bottlenecks along Sukhumvit sidewalk.",
    },
  },

  {
    id: "zone-paris-montmartre",
    name: "Montmartre & Barbès-Rochechouart",
    citySlug: "paris",
    countryCode: "FR",
    dayRiskTier: 2,
    nightRiskTier: 4,
    soloFemaleWalkabilityRating: 2,

    redFlagCorridors: [
      "Boulevard de Barbès and Metro Barbès-Rochechouart perimeter after dark",
      "Staircases on Rue Foyatier and Rue Ronsard leading to Sacré-Cœur at twilight",
      "Boulevard de Clichy sex shop stretch between Blanche and Pigalle after 01:00",
    ],

    safeThoroughfares: [
      "Rue Lepic (charming bistro street, high neighborhood surveillance)",
      "Rue des Abbesses (bustling village square, bright bakery and cafe lighting)",
    ],

    sanctuaries: [
      {
        type: "pharmacy",
        name: "Pharmacie Européenne (24h / 7d)",
        notes: "6 Place Clichy. Staffed around the clock, bright storefront, security bell.",
      },
      {
        type: "police_box",
        name: "Commissariat Central de Police du 18e",
        notes: "79 Rue de Clignancourt. Main police headquarters for 18th arrondissement.",
      },
    ],

    lodgingRecommendation: {
      isRecommendedForSolo: true,
      recommendedSubPockets: [
        "Abbesses micro-quarter (south slope of the hill) - artistic, vibrant, community feel.",
      ],
      warnings:
        "Avoid booking low-cost hotels east of the train tracks toward Barbès, Château Rouge, or Porte de la Chapelle.",
    },
  },
];

export function getMicroZoneById(id: string): MicroZoneDossier | undefined {
  return PREPOPULATED_MICRO_ZONES.find((z) => z.id === id);
}

export function getMicroZonesForCity(citySlug: string): MicroZoneDossier[] {
  return PREPOPULATED_MICRO_ZONES.filter(
    (z) => z.citySlug.toLowerCase() === citySlug.toLowerCase(),
  );
}
