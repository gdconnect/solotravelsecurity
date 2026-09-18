import type { AirportSecurityHub } from "@/lib/schemas/lego-blocks";

export const PREPOPULATED_AIRPORTS: AirportSecurityHub[] = [
  {
    iata: "FCO",
    icao: "LIRF",
    name: "Leonardo da Vinci–Fiumicino Airport",
    city: "Rome",
    citySlug: "rome",
    country: "Italy",
    countryCode: "IT",
    terminalsCount: 2,
    primaryInternationalTerminal: "Terminal 3",

    lateNightCurfew: {
      expressRailLastDeparture: "23:23",
      metroLastDeparture: "None",
      nightBusAvailable: true,
      nightBusRouteDetails:
        "TAM and Terravision airport shuttles run hourly to Termini Station throughout the night.",
      curfewVulnerabilityHour: 23,
    },

    officialTaxi: {
      exactKioskLocation:
        "Terminal 1 and Terminal 3 external curb arrivals area. Follow official 'TAXI' yellow floor markers directly to the sheltered dispatcher booth. Do not accept rides inside the terminal.",
      curbFloorLevel: "Ground Floor (Arrivals level)",
      fareStructure: "flat_rate",
      flatRateCityCenterEur: 50,
      officialVehicleVisualMarks: [
        "White vehicle body with 'Comune di Roma' or 'Comune di Fiumicino' coat of arms on front doors",
        "Taxi license number displayed prominently on external doors and rear left bumper",
        "Calibrated taximeter mounted on the dashboard",
        "Roof-mounted luminous TAXI sign (not magnetic)",
      ],
      paymentMethodRisk:
        "Drivers are legally mandated to accept electronic POS credit card payments under Italian law. Some drivers falsely claim the machine is 'guasto' (broken); demand card payment before luggage is loaded.",
    },

    rideshare: {
      servicesAllowed: ["Uber Black", "FreeNow (Official Taxi Dispatch)"],
      designatedPickupZone: "Terminal 3 Short-Term Parking structure (Sosta Breve T3), Level 1.",
      isGeofencedOrBanned: false,
      notes:
        "Standard UberX is not permitted in Italy. Only licensed NCC limousine drivers (Uber Black/Van) or metered taxis via FreeNow operate legally.",
    },

    safeWaitingZones: [
      {
        name: "Terminal 3 Landside Eataly & Staffed Cafes",
        location: "Terminal 3 Arrivals mezzanine",
        is24_7: true,
        airsideOrLandside: "landside",
        notes: "Brightly lit, continuous Polizia di Stato patrol presence, high foot traffic.",
      },
      {
        name: "Airside Transit Lounge & Rest Area",
        location: "Terminal 3 Boarding Area E",
        is24_7: true,
        airsideOrLandside: "airside",
        notes:
          "If arriving late on an international leg with checked baggage clearance, stay airside until 05:30 if you wish to avoid night transit.",
      },
    ],

    scamToutWarning: {
      activeInTerminal: true,
      typicalToutHooks: [
        "Taxi, Rome center? Big discount, no waiting in line!",
        "The Leonardo Express train is on strike / canceled tonight.",
        "Official taxi queue has a 2-hour delay; follow me to the VIP car.",
      ],
      chokePoints: [
        "Terminal 3 baggage claim sliding exit doors into public arrivals hall",
        "Corridor between Terminal 3 and the covered rail station walkway",
      ],
    },

    arrivalHallLogistics: {
      officialSimCounters: ["TIM Official Store (T3 Arrivals)", "Vodafone (T3 Arrivals)"],
      simMarkupWarning:
        "Airport tourist SIM packages carry a 30-40% markup over city center retail stores. Consider an eSIM pre-loaded prior to departure.",
      officialBankAtms: ["UniCredit Bank ATM inside T3 Arrivals", "Banca Popolare di Sondrio"],
      predatoryAtmsToAvoid: [
        "Euronet standalone kiosks with dynamic 14-18% currency conversion markups.",
      ],
    },
  },

  {
    iata: "HND",
    icao: "RJTT",
    name: "Tokyo Haneda International Airport",
    city: "Tokyo",
    citySlug: "tokyo",
    country: "Japan",
    countryCode: "JP",
    terminalsCount: 3,
    primaryInternationalTerminal: "Terminal 3",

    lateNightCurfew: {
      expressRailLastDeparture:
        "23:48 (Tokyo Monorail to Hamamatsucho) / 23:51 (Keikyu Airport Line)",
      metroLastDeparture: "23:51",
      nightBusAvailable: true,
      nightBusRouteDetails:
        "Airport Limousine night buses run to Shinjuku, Shibuya, and Ikebukuro at 00:20, 01:40, and 02:20.",
      curfewVulnerabilityHour: 0,
    },

    officialTaxi: {
      exactKioskLocation:
        "Terminal 3, 2nd Floor Arrivals curb, Lane 1 (Fixed-fare Tokyo Taxi Association desk).",
      curbFloorLevel: "2nd Floor Arrivals curb",
      fareStructure: "flat_rate",
      flatRateCityCenterLocal: {
        amount: 8900,
        currency: "JPY",
      },
      officialVehicleVisualMarks: [
        "Japan Taxi deep indigo JPN TAXI models with yellow/green taxi roof lantern (Nihon Kotsu, Kokusai, etc.)",
        "Driver wears white gloves, formal uniform, and name plaque with registration photo on dashboard",
        "Automatic rear passenger doors opening and closing without touching handle",
      ],
      paymentMethodRisk:
        "Extremely low risk. All licensed Tokyo taxis accept Suica/Pasmo IC cards, major foreign credit cards, and cash with exact receipt printed automatically.",
    },

    rideshare: {
      servicesAllowed: ["Uber (dispatches standard licensed Japanese taxis)", "GO Taxi App"],
      designatedPickupZone: "Terminal 3, Passenger Pick-Up Lane 2.",
      isGeofencedOrBanned: false,
      notes: "Uber in Tokyo operates as a dispatch broker for licensed commercial taxi fleets.",
    },

    safeWaitingZones: [
      {
        name: "Haneda Airport Garden Onsen & 24h Complex",
        location: "Directly connected to Terminal 3 2F walkway",
        is24_7: true,
        airsideOrLandside: "landside",
        notes:
          "Features Izumi Tenku no Yu 24h rooftop natural onsen, rest lounges, and private sleep pods. Ideal for solo travelers arriving after 00:00.",
      },
      {
        name: "Terminal 3 4F Edo Market 24h Convenience Store",
        location: "Terminal 3 Level 4 Edo Ko-ji",
        is24_7: true,
        airsideOrLandside: "landside",
        notes:
          "7-Eleven and Lawson with 24/7 staffing, seating counters, and secure international ATMs.",
      },
    ],

    scamToutWarning: {
      activeInTerminal: false,
      typicalToutHooks: [],
      chokePoints: [],
    },

    arrivalHallLogistics: {
      officialSimCounters: [
        "NTT Docomo counter",
        "SoftBank Global Rental",
        "BIC Camera SIM Vending Machines",
      ],
      simMarkupWarning: "Airport vending machines are reliable but require passport scan at kiosk.",
      officialBankAtms: ["Seven Bank ATM (Terminal 3 2F/3F)", "Japan Post Bank ATM"],
      predatoryAtmsToAvoid: [],
    },
  },

  {
    iata: "BKK",
    icao: "VTBS",
    name: "Suvarnabhumi Airport",
    city: "Bangkok",
    citySlug: "bangkok",
    country: "Thailand",
    countryCode: "TH",
    terminalsCount: 1,
    primaryInternationalTerminal: "Main Passenger Terminal",

    lateNightCurfew: {
      expressRailLastDeparture: "00:00 (Airport Rail Link to Phaya Thai Station)",
      metroLastDeparture: "00:00",
      nightBusAvailable: false,
      nightBusRouteDetails:
        "No reliable night buses operate into central Sukhumvit/Silom after midnight.",
      curfewVulnerabilityHour: 23,
    },

    officialTaxi: {
      exactKioskLocation:
        "Level 1 (Ground Floor), Gates 4 and 7. Walk to the automated queue touch-screen kiosk to pull a paper ticket showing the designated parking bay number (1-50).",
      curbFloorLevel:
        "Level 1 (Ground Floor) - NEVER Level 4 (Departures) or Level 2 (Arrivals hallway)",
      fareStructure: "metered",
      officialVehicleVisualMarks: [
        "Two-tone vehicle livery (Yellow/Green or Pink/Blue)",
        "Official 'TAXI METER' roof dome sign",
        "Driver profile card with photograph displayed on front passenger side dashboard",
      ],
      paymentMethodRisk:
        "High risk of drivers refusing to turn on the meter ('No meter, 500 Baht flat'). Insist firmly: 'Use meter, please' (Chai meter dai mai khrub/ka). Note: 50 THB airport surcharge and expressway toll fees are paid legitimately in addition to the meter.",
    },

    rideshare: {
      servicesAllowed: ["Grab", "Bolt"],
      designatedPickupZone: "Level 1, Gate 4 Grab Staging Lounge.",
      isGeofencedOrBanned: false,
      notes:
        "Grab is fully legalized at BKK and provides an upfront fare guarantee, making it ideal for first-time solo arrivals after midnight.",
    },

    safeWaitingZones: [
      {
        name: "Miracle Co-Working Space & Transit Hotel",
        location: "Level 3 Concourse / Basement Level near Airport Rail Link",
        is24_7: true,
        airsideOrLandside: "landside",
        notes: "Air-conditioned secure waiting zone with power plugs and refreshments.",
      },
      {
        name: "Magic Food Point 24h Staffed Canteen",
        location: "Level 1, Gate 8",
        is24_7: true,
        airsideOrLandside: "landside",
        notes: "24/7 airport staff food court. Well-lit, active security guards, budget-friendly.",
      },
    ],

    scamToutWarning: {
      activeInTerminal: true,
      typicalToutHooks: [
        "Official airport limousine to Bangkok, cheap VIP car!",
        "Public taxi queue is closed tonight / meter broken.",
        "Where are you going? Hotel is closed for renovation.",
      ],
      chokePoints: [
        "Level 2 Customs Exit sliding glass doors (touts holding generic black clipboards labeled 'LIMOUSINE')",
        "Level 2 hallway escalators heading down to Level 1",
      ],
    },

    arrivalHallLogistics: {
      officialSimCounters: ["AIS Official Counter (Level 2 Arrivals)", "TrueMove H", "dtac"],
      simMarkupWarning:
        "Tourist SIM packages at the airport cost 299-599 THB for 8-15 days. Legitimately priced, but lines can be long at 01:00.",
      officialBankAtms: [
        "Kasikorn Bank (Green ATM)",
        "Siam Commercial Bank (Purple ATM)",
        "Bangkok Bank (Blue ATM)",
      ],
      predatoryAtmsToAvoid: ["Standalone unbranded non-bank exchange kiosks."],
    },
  },

  {
    iata: "CDG",
    icao: "LFPG",
    name: "Paris Charles de Gaulle Airport",
    city: "Paris",
    citySlug: "paris",
    country: "France",
    countryCode: "FR",
    terminalsCount: 3,
    primaryInternationalTerminal: "Terminal 2E",

    lateNightCurfew: {
      expressRailLastDeparture: "22:50 (RER B train to Gare du Nord / Châtelet-Les Halles)",
      metroLastDeparture: "None",
      nightBusAvailable: true,
      nightBusRouteDetails:
        "Noctilien night buses N140 and N143 depart from Roissypole to Paris Gare de l'Est between 00:30 and 04:30.",
      curfewVulnerabilityHour: 23,
    },

    officialTaxi: {
      exactKioskLocation:
        "Terminal 2E, Exit Door 10a. Follow the official blue and white 'Taxis' pictograms painted on the terminal floor directly outside the building. Never follow any individual inside the baggage claim or customs exit hall.",
      curbFloorLevel: "Ground Floor (Arrivals curb)",
      fareStructure: "flat_rate",
      flatRateCityCenterEur: 56, // Right Bank 56€ / Left Bank 65€
      officialVehicleVisualMarks: [
        "Lighted taxi sign on the roof (green light = free, red light = occupied)",
        "Taximeter visible inside vehicle displaying fare rates A, B, or C",
        "License parking plate affixed to the front right wing of the vehicle",
      ],
      paymentMethodRisk:
        "French law strictly mandates that all licensed Paris taxis accept credit card payments regardless of amount. If a driver claims 'card machine is broken', point to the law sticker on the rear passenger window.",
    },

    rideshare: {
      servicesAllowed: ["Uber", "Bolt", "G7 Taxi App"],
      designatedPickupZone: "Terminal 2E Pro Parking Drop-Off Bay 1.",
      isGeofencedOrBanned: false,
      notes:
        "Official G7 Taxi app allows ordering licensed Paris flat-rate taxis with zero tout exposure.",
    },

    safeWaitingZones: [
      {
        name: "YOTELAIR Transit Hotel & Lounge",
        location: "Terminal 2E Satellite S4 (Airside)",
        is24_7: true,
        airsideOrLandside: "airside",
        notes: "Offers 4-hour micro-room bookings, private showers, and quiet sleeping cabins.",
      },
      {
        name: "Sheraton Paris Airport Hotel Lobby",
        location: "Directly atop Terminal 2 RER train station",
        is24_7: true,
        airsideOrLandside: "landside",
        notes:
          "Accessible landside without exiting into night streets. Staffed 24/7, high security.",
      },
    ],

    scamToutWarning: {
      activeInTerminal: true,
      typicalToutHooks: [
        "Taxi? Taxi to Paris? Official taxi here!",
        "RER B train is full of pickpockets tonight, take my car.",
        "There is a problem on the rail tracks to Paris center.",
      ],
      chokePoints: [
        "Immediately outside customs exit doors in Terminal 2E, 2F, and Terminal 1",
        "Underground corridor leading to RER B ticket counter",
      ],
    },

    arrivalHallLogistics: {
      officialSimCounters: ["Relay Newsstands (Bouygues Telecom / Orange Holiday SIM)"],
      simMarkupWarning:
        "Physical tourist SIMs at CDG Relay shops cost €40-50 for 20GB. Pre-installing an eSIM is recommended for solo arrivals.",
      officialBankAtms: ["HSBC ATM inside Terminal 2E", "BNP Paribas ATM Terminal 2F"],
      predatoryAtmsToAvoid: ["Travelex and Euronet ATMs offering dynamic conversion rates."],
    },
  },

  {
    iata: "BCN",
    icao: "LEBL",
    name: "Josep Tarradellas Barcelona-El Prat Airport",
    city: "Barcelona",
    citySlug: "barcelona",
    country: "Spain",
    countryCode: "ES",
    terminalsCount: 2,
    primaryInternationalTerminal: "Terminal 1",

    lateNightCurfew: {
      expressRailLastDeparture: "23:38 (Rodalies R2 Nord from Terminal 2)",
      metroLastDeparture: "00:00 (Mon-Thu) / 02:00 (Fri) / 24h continuous on Saturday (L9 Sud)",
      nightBusAvailable: true,
      nightBusRouteDetails:
        "NitBus N17 (Terminal 1) and N16 (Terminal 2) run every 20 minutes to Plaça de Catalunya all night.",
      curfewVulnerabilityHour: 0,
    },

    officialTaxi: {
      exactKioskLocation:
        "Terminal 1, Ground Floor curb right outside arrivals exit. Terminal 2, opposite T2B exit.",
      curbFloorLevel: "Ground Floor",
      fareStructure: "metered",
      officialVehicleVisualMarks: [
        "Iconic black and yellow livery (black doors/hood, yellow sides/roof)",
        "Luminous green roof light with numbers 1, 2, or 3 indicating active rate tariff",
        "Official Institut Metropolità del Taxi license crest on front doors",
      ],
      paymentMethodRisk:
        "All Barcelona taxis must accept card payments by law. Minimum airport supplement of €4.50 applies legitimately.",
    },

    rideshare: {
      servicesAllowed: ["Cabify", "FreeNow", "Uber"],
      designatedPickupZone: "Terminal 1 Parking G Level 0.",
      isGeofencedOrBanned: false,
      notes:
        "Cabify and FreeNow offer transparent pricing; standard yellow/black taxis are ubiquitous and heavily regulated.",
    },

    safeWaitingZones: [
      {
        name: "Sleep&Fly Transit Rooms & Lounge",
        location: "Terminal 1, Level 1 Business Center (Landside)",
        is24_7: true,
        airsideOrLandside: "landside",
        notes: "Secure hourly rooms, showers, and dedicated security guards.",
      },
    ],

    scamToutWarning: {
      activeInTerminal: true,
      typicalToutHooks: [
        "Aerobus is canceled due to strike, private ride to center?",
        "Metro does not go to your hotel, follow me.",
      ],
      chokePoints: ["Terminal 1 arrivals exit ramp leading toward Aerobús stop"],
    },

    arrivalHallLogistics: {
      officialSimCounters: ["Crystal Media shop (Orange / Vodafone SIMs)"],
      simMarkupWarning: "Retail prices inside airport carry 20-30% premium.",
      officialBankAtms: ["CaixaBank ATM inside Terminal 1 Arrivals", "BBVA ATM"],
      predatoryAtmsToAvoid: ["Euronet kiosks near baggage reclaim."],
    },
  },
];

export function getAirportByIata(iata: string): AirportSecurityHub | undefined {
  return PREPOPULATED_AIRPORTS.find((a) => a.iata.toUpperCase() === iata.toUpperCase());
}

export function getAirportsByCitySlug(citySlug: string): AirportSecurityHub[] {
  return PREPOPULATED_AIRPORTS.filter((a) => a.citySlug.toLowerCase() === citySlug.toLowerCase());
}
