#!/usr/bin/env node
/**
 * scripts/ingest-dr5hn.mjs
 * 
 * Ingestion and enrichment pipeline for dr5hn/countries-states-cities-database.
 * Merges authoritative geospatial data (ISO codes, coordinates, currencies, calling codes, Wikidata IDs)
 * with deterministic solo travel security intelligence (emergency dispatch, consular hotlines, electrical standards, risk tiers).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CACHE_FILE = path.join(ROOT_DIR, ".cache", "dr5hn-countries.json");
const OUTPUT_COUNTRIES_JSON = path.join(ROOT_DIR, "src", "data", "geo", "countries.json");
const OUTPUT_COUNTRIES_TS = path.join(ROOT_DIR, "src", "data", "geo", "countries.ts");
const OUTPUT_CITIES_JSON = path.join(ROOT_DIR, "src", "data", "geo", "cities.json");
const OUTPUT_CITIES_TS = path.join(ROOT_DIR, "src", "data", "geo", "cities.ts");

const DR5HN_COUNTRIES_URL =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json";

// Curated solo travel security overlay for top destinations
const COUNTRY_SECURITY_OVERLAY = {
  JP: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "110", ambulance: "119", fire: "119" },
    consularHotlines: {
      usEmbassyPhone: "+81-3-3224-5000",
      ukEmbassyPhone: "+81-3-5211-1100",
      ausEmbassyPhone: "+81-3-5232-4111",
    },
    electricalStandards: { voltage: "100V", frequency: "50/60Hz", plugTypes: ["A", "B"] },
    overview:
      "Japan remains one of the world's safest countries for solo travelers. Violent crime is extremely rare. Primary risks revolve around late-night entertainment district bar touting (Kabukicho/Roppongi) and natural hazards (earthquakes).",
    keySafetyRules: [
      "Never follow street touts or bar promoters in nightlife districts.",
      "Keep cash on hand; smaller establishments and rural transit rely on physical currency.",
      "Download emergency earthquake apps (e.g. Yurekuru Call / Safety tips for travelers).",
    ],
    primaryCities: ["tokyo"],
  },
  TH: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "191", ambulance: "1669", fire: "199", touristPolice: "1155" },
    consularHotlines: {
      usEmbassyPhone: "+66-2-205-4000",
      ukEmbassyPhone: "+66-2-305-8333",
      ausEmbassyPhone: "+66-2-344-6300",
    },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["A", "B", "C", "F", "O"] },
    overview:
      "Thailand is welcoming with extensive solo traveler infrastructure. Chief operational threats include road traffic accidents (especially motorbike rentals), transit overcharging, and commercial gem/temple closure scams.",
    keySafetyRules: [
      "Always demand metered taxis or use ride-hailing apps (Grab/Bolt) rather than accepting roadside flat quotes.",
      "Dial 1155 for English-speaking Tourist Police for dispute resolution.",
      "Never surrender your original passport as rental collateral for motorbikes or jet skis.",
    ],
    primaryCities: ["bangkok"],
  },
  IT: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "112", ambulance: "118", fire: "115", touristPolice: "112" },
    consularHotlines: {
      usEmbassyPhone: "+39-06-46741",
      ukEmbassyPhone: "+39-06-4220-0001",
      ausEmbassyPhone: "+39-06-852721",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F", "L"] },
    overview:
      "Italy features world-class heritage with moderate solo travel safety. Violent crime is low; however, opportunistic pickpocketing at high-density rail stations (Termini, Centrale) and tourist landmarks is highly organized.",
    keySafetyRules: [
      "Segregate primary bank cards from pocket wallets when boarding public transit.",
      "Insist on official white city taxis with fixed rates from major international airports.",
      "Validate train and bus transit tickets before boarding to prevent steep municipal fines.",
    ],
    primaryCities: ["rome"],
  },
  ES: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112", touristPolice: "091" },
    consularHotlines: {
      usEmbassyPhone: "+34-91-587-2200",
      ukEmbassyPhone: "+34-91-714-6300",
      ausEmbassyPhone: "+34-91-353-6600",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "Spain is vibrant and highly accessible for solo travelers. Petty theft and pickpocket syndicates operate aggressively in major pedestrian arteries (Las Ramblas, metro lines) and popular beach promenades.",
    keySafetyRules: [
      "Never place smartphones or bags on outdoor dining tables.",
      "Maintain active spatial awareness in crowded metro vestibules during boarding and disembarking.",
      "Report theft immediately at dedicated foreign tourist assistance police stations (SATE).",
    ],
    primaryCities: ["barcelona"],
  },
  FR: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "17", ambulance: "15", fire: "18", touristPolice: "112" },
    consularHotlines: {
      usEmbassyPhone: "+33-1-43-12-22-22",
      ukEmbassyPhone: "+33-1-44-51-31-00",
      ausEmbassyPhone: "+33-1-40-59-33-00",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview:
      "France offers robust public infrastructure and medical support. Solo visitors primarily encounter distraction theft (petition clipboards, ring drop scam) around major monuments and rail terminuses.",
    keySafetyRules: [
      "Decline to sign clipboards or engage with strangers attempting distraction around monuments.",
      "Keep phones securely gripped when sitting near metro car doors.",
      "Book licensed taxis only via official airport taxi queue lines (avoid unauthorized terminal touts).",
    ],
    primaryCities: ["paris"],
  },
  ID: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "110", ambulance: "118", fire: "113", touristPolice: "+62-361-224111" },
    consularHotlines: {
      usEmbassyPhone: "+62-21-5083-1000",
      ukEmbassyPhone: "+62-21-2356-5200",
      ausEmbassyPhone: "+62-21-2550-5555",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "Indonesia, particularly Bali and Lombok, is a global nomad and solo travel hub. Key exposures include scooter accidents, ATM card skimming, counterfeit alcohol, and bag snatching by passing motorbikes.",
    keySafetyRules: [
      "Use only bank-branch ATMs (Mandiri, BCA) rather than freestanding roadside kiosks.",
      "Wear helmets and avoid operating scooters without an international driving permit and insurance.",
      "Never carry bags on the roadside shoulder where drive-by snatching can occur.",
    ],
    primaryCities: ["bali"],
  },
  PT: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: {
      usEmbassyPhone: "+351-21-727-3300",
      ukEmbassyPhone: "+351-21-392-4000",
      ausEmbassyPhone: "+351-21-310-1500",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "Portugal is consistently ranked among the safest countries globally. Low violent crime, walkable cities, and strong tourist protections make it exceptional for solo travelers.",
    keySafetyRules: [
      "Watch for pickpockets on historic tram routes (notably Tram 28 in Lisbon).",
      "Ignore street dealers offering fake substances in historic squares; keep walking without engaging.",
      "Ensure proper footwear for steep cobblestone streets, especially in wet conditions.",
    ],
    primaryCities: ["lisbon"],
  },
  MX: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911", touristPolice: "078" },
    consularHotlines: {
      usEmbassyPhone: "+52-55-5080-2000",
      ukEmbassyPhone: "+52-55-1670-3200",
      ausEmbassyPhone: "+52-55-1101-2200",
    },
    electricalStandards: { voltage: "127V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview:
      "Mexico features deep cultural richness and hospitality, but solo travelers require disciplined situational boundaries. Risk varies drastically by state and neighborhood; stick to verified zones and avoid unmetered street hailing.",
    keySafetyRules: [
      "Never hail random street taxis; use authorized airport taxi booths (sitio) or verified ride apps (Uber/Didi).",
      "Stick to safe, well-lit districts (Condesa, Roma, Polanco) and avoid walking alone after dark in unfamiliar zones.",
      "Use ATMs inside secure bank lobbies or shopping malls during daytime hours.",
    ],
    primaryCities: ["mexico-city"],
  },
  NL: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: {
      usEmbassyPhone: "+31-70-310-2209",
      ukEmbassyPhone: "+31-70-427-0400",
      ausEmbassyPhone: "+31-70-310-8200",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "The Netherlands is exceptionally safe, English-fluent, and well-organized. The most common physical hazard for solo visitors is pedestrian bicycle lane collisions and opportunistic bicycle/pocket theft.",
    keySafetyRules: [
      "Always stay off designated red asphalt cycle lanes; cyclists have right of way and travel at speed.",
      "Keep valuables secure around Amsterdam Centraal and the Red Light District.",
      "Only purchase services and items from licensed, authorized premises.",
    ],
    primaryCities: ["amsterdam"],
  },
  CO: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "123", ambulance: "123", fire: "119", touristPolice: "+57-1-3374413" },
    consularHotlines: {
      usEmbassyPhone: "+57-1-275-2000",
      ukEmbassyPhone: "+57-1-326-8300",
      ausEmbassyPhone: "+57-1-631-4300",
    },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview:
      "Colombia offers breathtaking landscapes and warm culture, but demands strict operational discipline for solo travelers. Chief concerns include dating app drugging (scopolamine/burundanga) and robbery in isolated sectors.",
    keySafetyRules: [
      "Adhere strictly to 'No dar papaya' — never flash expensive electronics, luxury watches, or thick cash.",
      "Never meet strangers from dating apps in private accommodations; insist on public, security-staffed venues.",
      "Use app-based transit (Uber, Cabify) rather than hailing taxis off the street at night.",
    ],
    primaryCities: ["medellin"],
  },
  GB: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "999" },
    consularHotlines: {
      usEmbassyPhone: "+44-20-7499-9000",
      ukEmbassyPhone: "+44-20-7008-5000",
      ausEmbassyPhone: "+44-20-7379-4334",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview:
      "The United Kingdom is a premier solo travel destination with comprehensive rail links and high public safety. The main urban risk is phone snatching by moped and e-bike riders on busy street pavements.",
    keySafetyRules: [
      "Keep phones securely held away from the curb side to prevent moped snatching.",
      "Tap-and-go contactless cards work across all London transit; avoid buying single paper tickets.",
      "Only use licensed black cabs or registered rideshare apps (Uber/Bolt) at night.",
    ],
    primaryCities: [],
  },
  US: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: {
      usEmbassyPhone: "+1-202-501-4444",
      ukEmbassyPhone: "+1-202-588-6500",
      ausEmbassyPhone: "+1-202-797-3000",
    },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview:
      "The United States provides vast solo travel opportunities with high emergency service reliability. Solo travelers should understand neighborhood boundary nuances in major metropolitan areas.",
    keySafetyRules: [
      "Research specific neighborhood micro-boundaries before booking lodging.",
      "Carry medical travel insurance; out-of-pocket emergency healthcare costs in the US are among the highest in the world.",
      "Dial 911 for unified police, medical, and fire dispatch anywhere in the country.",
    ],
    primaryCities: [],
  },
  DE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "110", ambulance: "112", fire: "112" },
    consularHotlines: {
      usEmbassyPhone: "+49-30-8305-0",
      ukEmbassyPhone: "+49-30-20457-0",
      ausEmbassyPhone: "+49-30-880088-0",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "Germany boasts world-class public transport and very low crime. Late-night central train stations (Hauptbahnhof) can host minor loitering or pickpocketing, but overall safety is high.",
    keySafetyRules: [
      "Carry cash in addition to cards; many smaller bakeries, cafes, and taxis still prefer physical cash.",
      "Stamp train/subway tickets at platform validator boxes before boarding to avoid €60 fines.",
      "Exercise standard vigilance around major railway hub entrances late at night.",
    ],
    primaryCities: [],
  },
  VN: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "113", ambulance: "115", fire: "114" },
    consularHotlines: {
      usEmbassyPhone: "+84-24-3850-5000",
      ukEmbassyPhone: "+84-24-3936-0500",
      ausEmbassyPhone: "+84-24-3774-0100",
    },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["A", "C"] },
    overview:
      "Vietnam is welcoming, affordable, and safe from violent crime. Solo travelers encounter chaotic street traffic, motorcycle bag-snatching, and currency confusion with multi-zero Dong banknotes.",
    keySafetyRules: [
      "Cross roads at a steady, predictable pace so oncoming motorbikes can flow around you.",
      "Use Grab app for both cars and motorbike taxis to lock in upfront fares.",
      "Double-check currency notes (distinguish 20,000 and 500,000 VND which have similar coloring).",
    ],
    primaryCities: [],
  },
  CR: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: {
      usEmbassyPhone: "+506-2519-2000",
      ukEmbassyPhone: "+506-2258-2025",
      ausEmbassyPhone: "+506-2220-3000",
    },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview:
      "Costa Rica is renowned for eco-tourism and wildlife. Petty theft from rental vehicles and unattended belongings on beaches are the most common vulnerabilities for solo travelers.",
    keySafetyRules: [
      "Never leave luggage, passports, or daypacks unattended in parked cars or on public beaches.",
      "Only take official red taxis (with yellow triangle decal) or Uber.",
      "Be cautious with strong rip currents on Pacific and Caribbean beaches; swim only in designated areas.",
    ],
    primaryCities: [],
  },
  AU: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "000", ambulance: "000", fire: "000" },
    consularHotlines: {
      usEmbassyPhone: "+61-2-6214-5600",
      ukEmbassyPhone: "+61-2-6270-6666",
      ausEmbassyPhone: "1300-555-135",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["I"] },
    overview:
      "Australia is exceptionally safe for solo travelers with well-policed cities and excellent infrastructure. Environmental risks (surf conditions, extreme heat, wildlife in remote outback) require situational care.",
    keySafetyRules: [
      "Always swim between the red and yellow flags on patrolled surf beaches.",
      "Carry ample water and offline GPS navigation when exploring regional or outback trails.",
      "Emergency dispatch is 000 (triple zero) from any mobile or landline.",
    ],
    primaryCities: [],
  },
  NZ: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "111", ambulance: "111", fire: "111" },
    consularHotlines: {
      usEmbassyPhone: "+64-4-462-6000",
      ukEmbassyPhone: "+64-4-924-2888",
      ausEmbassyPhone: "+64-4-473-6411",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["I"] },
    overview:
      "New Zealand is consistently rated among the world's most peaceful and solo-traveler-friendly nations. Outdoor wilderness preparedness and driving on the left side of the road are the primary focus areas.",
    keySafetyRules: [
      "Check Department of Conservation (DOC) alerts before embarking on wilderness hiking tracks.",
      "Adapt to driving on the left; give yourself ample buffer time on winding single-lane mountain passes.",
      "Dial 111 for police, fire, and search-and-rescue emergencies.",
    ],
    primaryCities: [],
  },
  GR: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "100", ambulance: "166", fire: "199", touristPolice: "171" },
    consularHotlines: {
      usEmbassyPhone: "+30-210-721-2951",
      ukEmbassyPhone: "+30-210-727-2600",
      ausEmbassyPhone: "+30-210-870-4000",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "Greece has very low violent crime and welcoming local communities across the mainland and islands. Pickpocketing on the Athens metro (Syntagma–Monastiraki line) and island quad-bike accidents are common solo hazards.",
    keySafetyRules: [
      "Keep hands on bags and zipped pockets on Athens public transit lines.",
      "Avoid renting quad bikes / ATVs without prior experience and helmet compliance.",
      "Tourist police (171) provide 24/7 multi-lingual assistance for foreign visitors.",
    ],
    primaryCities: [],
  },
  HR: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "192", ambulance: "194", fire: "193", touristPolice: "112" },
    consularHotlines: {
      usEmbassyPhone: "+385-1-661-2200",
      ukEmbassyPhone: "+385-1-600-9100",
      ausEmbassyPhone: "+385-1-489-1200",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview:
      "Croatia offers exceptional safety, pristine Adriatic waters, and strong tourist infrastructure. Solo travelers enjoy relaxed environments with minimal street crime.",
    keySafetyRules: [
      "Exchange currency or withdraw Euros only from verified bank ATMs (avoid high-fee Euronet kiosks).",
      "Observe sea urchin warnings and wear water shoes on rocky coastal beaches.",
      "General emergency dispatch is reachable via 112 across all networks.",
    ],
    primaryCities: [],
  },
  IE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "999" },
    consularHotlines: {
      usEmbassyPhone: "+353-1-668-8777",
      ukEmbassyPhone: "+353-1-205-3700",
      ausEmbassyPhone: "+353-1-664-5300",
    },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview:
      "Ireland is safe, hospitable, and English-speaking, making it ideal for first-time solo travelers. Late-night drunken rowdiness in central Dublin nightlife zones is the primary consideration.",
    keySafetyRules: [
      "Exercise standard situational awareness around Temple Bar and O'Connell Street late at night.",
      "Use Leap Card for streamlined multi-modal public transport across Dublin.",
      "Dial 999 or 112 for the Garda Síochána (national police) in any emergency.",
    ],
    primaryCities: [],
  },
};

// Curated City Geospatial & Security Metadata
const CURATED_CITIES = [
  {
    slug: "tokyo",
    name: "Tokyo",
    countryCode: "JP",
    coordinates: { latitude: 35.6895, longitude: 139.6917 },
    wikidataId: "Q1490",
    population: 13960000,
    riskTier: "Low",
    primaryAirportCode: "HND",
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    countryCode: "TH",
    coordinates: { latitude: 13.7563, longitude: 100.5018 },
    wikidataId: "Q1861",
    population: 10539000,
    riskTier: "Moderate",
    primaryAirportCode: "BKK",
  },
  {
    slug: "rome",
    name: "Rome",
    countryCode: "IT",
    coordinates: { latitude: 41.8919, longitude: 12.5113 },
    wikidataId: "Q220",
    population: 2873000,
    riskTier: "Moderate",
    primaryAirportCode: "FCO",
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    countryCode: "ES",
    coordinates: { latitude: 41.3851, longitude: 2.1734 },
    wikidataId: "Q1492",
    population: 1620000,
    riskTier: "Moderate",
    primaryAirportCode: "BCN",
  },
  {
    slug: "paris",
    name: "Paris",
    countryCode: "FR",
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    wikidataId: "Q90",
    population: 2161000,
    riskTier: "Moderate",
    primaryAirportCode: "CDG",
  },
  {
    slug: "bali",
    name: "Bali (Denpasar)",
    countryCode: "ID",
    coordinates: { latitude: -8.6705, longitude: 115.2126 },
    wikidataId: "Q4648",
    population: 4362000,
    riskTier: "Moderate",
    primaryAirportCode: "DPS",
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    countryCode: "PT",
    coordinates: { latitude: 38.7223, longitude: -9.1393 },
    wikidataId: "Q597",
    population: 504718,
    riskTier: "Low",
    primaryAirportCode: "LIS",
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    countryCode: "MX",
    coordinates: { latitude: 19.4326, longitude: -99.1332 },
    wikidataId: "Q1489",
    population: 9209944,
    riskTier: "Elevated",
    primaryAirportCode: "MEX",
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    countryCode: "NL",
    coordinates: { latitude: 52.3676, longitude: 4.9041 },
    wikidataId: "Q727",
    population: 872680,
    riskTier: "Low",
    primaryAirportCode: "AMS",
  },
  {
    slug: "medellin",
    name: "Medellín",
    countryCode: "CO",
    coordinates: { latitude: 6.2442, longitude: -75.5812 },
    wikidataId: "Q48278",
    population: 2569007,
    riskTier: "Elevated",
    primaryAirportCode: "MDE",
  },
];

async function fetchOrReadDr5hnData() {
  if (fs.existsSync(CACHE_FILE)) {
    console.log(`[ingest] Reading dr5hn countries from cache: ${CACHE_FILE}`);
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  }

  console.log(`[ingest] Downloading dr5hn countries from GitHub...`);
  const resp = await fetch(DR5HN_COUNTRIES_URL, {
    headers: { "User-Agent": "SoloTravelSecurity-Ingest/1.0" },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch dr5hn countries: ${resp.status} ${resp.statusText}`);
  }

  const rawData = await resp.json();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(rawData, null, 2), "utf-8");
  console.log(`[ingest] Cached ${rawData.length} countries to ${CACHE_FILE}`);
  return rawData;
}

async function main() {
  console.log("[ingest] Starting dr5hn ingestion & enrichment pipeline...");

  const rawCountries = await fetchOrReadDr5hnData();

  // Map to index by iso2 code
  const rawCountryMap = new Map();
  for (const c of rawCountries) {
    if (c.iso2) {
      rawCountryMap.set(c.iso2.toUpperCase(), c);
    }
  }

  const enrichedCountries = [];

  for (const [iso2, overlay] of Object.entries(COUNTRY_SECURITY_OVERLAY)) {
    const raw = rawCountryMap.get(iso2);
    if (!raw) {
      console.warn(`[ingest] Warning: ISO2 ${iso2} not found in dr5hn dataset!`);
      continue;
    }

    const enriched = {
      iso2: raw.iso2,
      iso3: raw.iso3,
      name: raw.name,
      nativeName: raw.native || raw.name,
      capital: raw.capital,
      currencyCode: raw.currency,
      currencySymbol: raw.currency_symbol || "$",
      currencyName: raw.currency_name || raw.currency,
      phonePrefix: raw.phonecode ? (raw.phonecode.startsWith("+") ? raw.phonecode : `+${raw.phonecode}`) : "",
      region: raw.region,
      subregion: raw.subregion,
      wikidataId: raw.wikiDataId || "",
      coordinates: {
        latitude: parseFloat(raw.latitude),
        longitude: parseFloat(raw.longitude),
      },
      defaultRiskTier: overlay.defaultRiskTier,
      emergencyNumbers: overlay.emergencyNumbers,
      consularHotlines: overlay.consularHotlines,
      electricalStandards: overlay.electricalStandards,
      overview: overlay.overview,
      keySafetyRules: overlay.keySafetyRules,
      primaryCities: overlay.primaryCities || [],
    };

    enrichedCountries.push(enriched);
  }

  // Sort alphabetically by country name
  enrichedCountries.sort((a, b) => a.name.localeCompare(b.name));

  // Write countries.json
  fs.writeFileSync(OUTPUT_COUNTRIES_JSON, JSON.stringify(enrichedCountries, null, 2), "utf-8");
  console.log(`[ingest] Wrote ${enrichedCountries.length} countries to ${OUTPUT_COUNTRIES_JSON}`);

  // Write countries.ts
  const tsContent = `// Auto-generated by scripts/ingest-dr5hn.mjs - DO NOT EDIT MANUALLY
import type { EnrichedCountry } from "@/lib/geo/types";
import rawData from "./countries.json";

export const ENRICHED_COUNTRIES: EnrichedCountry[] = rawData as EnrichedCountry[];

export function getAllCountries(): EnrichedCountry[] {
  return ENRICHED_COUNTRIES;
}

export function getCountryByIso2(iso2: string): EnrichedCountry | undefined {
  const upper = iso2.toUpperCase();
  return ENRICHED_COUNTRIES.find((c) => c.iso2 === upper);
}

export function getCountryByName(name: string): EnrichedCountry | undefined {
  const lower = name.toLowerCase();
  return ENRICHED_COUNTRIES.find((c) => c.name.toLowerCase() === lower);
}
`;
  fs.writeFileSync(OUTPUT_COUNTRIES_TS, tsContent, "utf-8");
  console.log(`[ingest] Wrote typed accessor to ${OUTPUT_COUNTRIES_TS}`);

  // Write cities.json
  fs.writeFileSync(OUTPUT_CITIES_JSON, JSON.stringify(CURATED_CITIES, null, 2), "utf-8");
  console.log(`[ingest] Wrote ${CURATED_CITIES.length} cities to ${OUTPUT_CITIES_JSON}`);

  // Write cities.ts
  const citiesTsContent = `// Auto-generated by scripts/ingest-dr5hn.mjs - DO NOT EDIT MANUALLY
import type { EnrichedCityGeo } from "@/lib/geo/types";
import rawCities from "./cities.json";

export const ENRICHED_CITIES: EnrichedCityGeo[] = rawCities as EnrichedCityGeo[];

export function getAllEnrichedCities(): EnrichedCityGeo[] {
  return ENRICHED_CITIES;
}

export function getEnrichedCityBySlug(slug: string): EnrichedCityGeo | undefined {
  return ENRICHED_CITIES.find((c) => c.slug === slug);
}

export function getCitiesByCountryCode(countryCode: string): EnrichedCityGeo[] {
  const upper = countryCode.toUpperCase();
  return ENRICHED_CITIES.filter((c) => c.countryCode === upper);
}
`;
  fs.writeFileSync(OUTPUT_CITIES_TS, citiesTsContent, "utf-8");
  console.log(`[ingest] Wrote typed city accessor to ${OUTPUT_CITIES_TS}`);

  console.log("[ingest] Ingestion and enrichment pipeline completed successfully!");
}

main().catch((err) => {
  console.error("[ingest] Fatal error:", err);
  process.exit(1);
});
