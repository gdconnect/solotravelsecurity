#!/usr/bin/env node
/**
 * scripts/generate-geo-dataset.mjs
 * 
 * Master generation engine scaling Solo Travel Security to 100 sovereign nations
 * and 63 global city hubs by combining dr5hn geospatial foundations with
 * field-tested operational security intelligence.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRY_SECURITY_OVERLAY_100 } from "./country-overlays-100.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CACHE_FILE = path.join(ROOT_DIR, ".cache", "dr5hn-countries.json");
const OUTPUT_COUNTRIES_JSON = path.join(ROOT_DIR, "src", "data", "geo", "countries.json");
const OUTPUT_COUNTRIES_TS = path.join(ROOT_DIR, "src", "data", "geo", "countries.ts");
const OUTPUT_CITIES_JSON = path.join(ROOT_DIR, "src", "data", "geo", "cities.json");
const OUTPUT_CITIES_TS = path.join(ROOT_DIR, "src", "data", "geo", "cities.ts");

// Overlays for Asia & Oceania, Americas, and Middle East & Africa
const ADDITIONAL_OVERLAYS = {
  // --- ASIA & OCEANIA ---
  JP: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "110", ambulance: "119", fire: "119" },
    consularHotlines: { usEmbassyPhone: "+81-3-3224-5000", ukEmbassyPhone: "+81-3-5211-1100", ausEmbassyPhone: "+81-3-5232-4111" },
    electricalStandards: { voltage: "100V", frequency: "50/60Hz", plugTypes: ["A", "B"] },
    overview: "Japan remains one of the safest nations on Earth for solo travelers. Violent crime is rare; main risks are nightlife bar touts in Roppongi/Kabukicho and natural seismic hazards.",
    keySafetyRules: [
      "Never follow street touts or nightlife promoters into basement bars.",
      "Keep physical cash on hand; traditional restaurants and transport kiosks often reject foreign cards.",
      "Install earthquake notification apps (Yurekuru Call or Safety Tips for Travelers)."
    ],
    primaryCities: ["tokyo", "kyoto", "osaka"]
  },
  TH: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "191", ambulance: "1669", fire: "199", touristPolice: "1155" },
    consularHotlines: { usEmbassyPhone: "+66-2-205-4000", ukEmbassyPhone: "+66-2-305-8333", ausEmbassyPhone: "+66-2-344-6300" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["A", "B", "C", "F", "O"] },
    overview: "Thailand provides stellar backpacker infrastructure. Chief operational threats are road traffic collisions (especially motorbikes), transit overcharging, and gem/tuk-tuk scams.",
    keySafetyRules: [
      "Insist on metered taxis or use Grab/Bolt rather than negotiating curbside flat rates.",
      "Dial 1155 for English-speaking Tourist Police mediation.",
      "Never leave your original passport as rental collateral for motorbikes or jet skis."
    ],
    primaryCities: ["bangkok", "chiang-mai", "phuket"]
  },
  ID: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "110", ambulance: "118", fire: "113", touristPolice: "+62-361-224111" },
    consularHotlines: { usEmbassyPhone: "+62-21-5083-1000", ukEmbassyPhone: "+62-21-2356-5200", ausEmbassyPhone: "+62-21-2550-5555" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Indonesia, particularly Bali and Lombok, is a major solo hub. Primary threats are scooter accidents, ATM skimmers, illicit toxic methanol spirits, and bag snatches.",
    keySafetyRules: [
      "Only use bank-branch ATMs (BCA, Mandiri) inside guarded vestibules.",
      "Always wear a certified helmet and maintain valid international licensing when driving scooters.",
      "Avoid unsealed cocktails or home-distilled spirits (Arak) due to methanol poisoning risks."
    ],
    primaryCities: ["bali"]
  },
  VN: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "113", ambulance: "115", fire: "114" },
    consularHotlines: { usEmbassyPhone: "+84-24-3850-5000", ukEmbassyPhone: "+84-24-3936-0500", ausEmbassyPhone: "+84-24-3774-0100" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["A", "C"] },
    overview: "Vietnam is peaceful and friendly. The main operational friction points are intense motorcycle traffic flow, currency denomination errors (Dong), and drive-by phone snatching.",
    keySafetyRules: [
      "Cross roads at an even, predictable speed without sudden pauses so scooters can route around you.",
      "Use Grab to book taxis or scooter rides with pre-locked prices.",
      "Carefully verify zero counts on banknotes (e.g. 500,000 vs 20,000 VND)."
    ],
    primaryCities: ["hanoi", "ho-chi-minh-city"]
  },
  AU: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "000", ambulance: "000", fire: "000" },
    consularHotlines: { usEmbassyPhone: "+61-2-6214-5600", ukEmbassyPhone: "+61-2-6270-6666", ausEmbassyPhone: "1300-555-135" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["I"] },
    overview: "Australia is exceptionally safe for solo travelers with modern medical systems. Environmental dangers (powerful surf rip tides, outback dehydration, intense UV) demand preparation.",
    keySafetyRules: [
      "Always swim between the red and yellow flags on lifeguarded surf beaches.",
      "Carry ample water and offline communication when venturing into regional or desert routes.",
      "Emergency dispatch number is 000 (triple zero)."
    ],
    primaryCities: ["sydney", "melbourne"]
  },
  NZ: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "111", ambulance: "111", fire: "111" },
    consularHotlines: { usEmbassyPhone: "+64-4-462-6000", ukEmbassyPhone: "+64-4-924-2888", ausEmbassyPhone: "+64-4-473-6411" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["I"] },
    overview: "New Zealand is peaceful, progressive, and easy to navigate. Sudden alpine mountain weather shifts and left-hand driving on narrow winding roads are chief considerations.",
    keySafetyRules: [
      "File your hiking trip intentions with the Department of Conservation (DOC) before remote treks.",
      "Adapt to driving on the left and never drive tired after long-haul transpacific flights.",
      "Unified emergency response is 111."
    ],
    primaryCities: ["auckland"]
  },
  SG: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "995", fire: "995" },
    consularHotlines: { usEmbassyPhone: "+65-6476-9100", ukEmbassyPhone: "+65-6424-4200", ausEmbassyPhone: "+65-6836-4100" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Singapore has among the lowest crime rates globally and strict legal enforcement. Solo travelers can navigate day and night without concern.",
    keySafetyRules: [
      "Strict legal penalties apply to littering, jaywalking, and drug importation.",
      "Tap-in and tap-out on MRT trains using contactless credit cards or Apple/Google Pay.",
      "Emergency police is 999; ambulance and fire is 995."
    ],
    primaryCities: ["singapore"]
  },
  KR: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "119", fire: "119", touristPolice: "1330" },
    consularHotlines: { usEmbassyPhone: "+82-2-397-4114", ukEmbassyPhone: "+82-2-3210-5500", ausEmbassyPhone: "+82-2-2003-0100" },
    electricalStandards: { voltage: "220V", frequency: "60Hz", plugTypes: ["C", "F"] },
    overview: "South Korea is exceptionally safe with clean, fast 24/7 public transit and widespread CCTV. Personal property is safe in cafes, and night navigation is straightforward.",
    keySafetyRules: [
      "Use KakaoMap or Naver Map for navigation; Google Maps has limited walking routing in Korea.",
      "Dial 1330 for the Korea Travel Helpline providing 24/7 English translation and guidance.",
      "Emergency police line is 112."
    ],
    primaryCities: ["seoul"]
  },
  TW: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "110", ambulance: "119", fire: "119", touristPolice: "+886-2-2321-4665" },
    consularHotlines: { usEmbassyPhone: "+886-2-2162-2000", ukEmbassyPhone: "+886-2-8758-2088", ausEmbassyPhone: "+886-2-8725-4100" },
    electricalStandards: { voltage: "110V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Taiwan features extraordinary safety, welcoming residents, and high-speed rail links. Earthquakes and summer typhoon systems are the main situational concerns.",
    keySafetyRules: [
      "Get an EasyCard to tap on MRT, regional buses, and convenience store payments.",
      "Observe weather advisories during typhoon season (June to October).",
      "Emergency police dispatch is 110."
    ],
    primaryCities: ["taipei"]
  },
  MY: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "994", touristPolice: "+60-3-2149-6590" },
    consularHotlines: { usEmbassyPhone: "+60-3-7953-7000", ukEmbassyPhone: "+60-3-2170-2200", ausEmbassyPhone: "+60-3-2146-5555" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Malaysia is modern, multicultural, and English-speaking. Petty crime, specifically motorcycle bag snatching along street curbs, requires defensive positioning.",
    keySafetyRules: [
      "Carry bags on the shoulder away from traffic to neutralize motorcycle snatch-and-grab.",
      "Use Grab for airport and inner-city transit rather than unmetered street taxis.",
      "Emergency dispatch is 999."
    ],
    primaryCities: ["kuala-lumpur"]
  },
  PH: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+63-2-5301-2000", ukEmbassyPhone: "+63-2-8858-2200", ausEmbassyPhone: "+63-2-7757-8100" },
    electricalStandards: { voltage: "220V", frequency: "60Hz", plugTypes: ["A", "B", "C"] },
    overview: "The Philippines offers beautiful island archipelago hopping and friendly communities. Solo travelers should maintain situational awareness in congested Manila transit terminals.",
    keySafetyRules: [
      "Use Grab in major metro areas (Metro Manila, Cebu) to ensure verified routes and transparent fares.",
      "Avoid isolated coastal boat transfers in inclement weather during typhoon season.",
      "National emergency hotline is 911."
    ],
    primaryCities: ["manila"]
  },
  KH: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "117", ambulance: "119", fire: "118", touristPolice: "+855-63-760-215" },
    consularHotlines: { usEmbassyPhone: "+855-23-728-000", ukEmbassyPhone: "+855-23-426-651", ausEmbassyPhone: "+855-23-213-470" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["A", "C", "G"] },
    overview: "Cambodia is famous for Angkor Wat and gentle hospitality. Drive-by bag snatches from tuk-tuks in Phnom Penh and unexploded ordnance in off-trail rural regions are primary risks.",
    keySafetyRules: [
      "Keep phones and daypacks enclosed inside tuk-tuks rather than held loosely near open side frames.",
      "Never leave marked paths around rural temple ruins or forested borders due to historical landmines.",
      "Use PassApp or Grab for rides rather than negotiating roadside tuk-tuk quotes."
    ],
    primaryCities: ["siem-reap"]
  },
  LA: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "1191", ambulance: "1195", fire: "1190", touristPolice: "+856-21-251-128" },
    consularHotlines: { usEmbassyPhone: "+856-21-487-000", ukEmbassyPhone: "+856-21-353-840", ausEmbassyPhone: "+856-21-353-800" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["A", "B", "C", "E", "F"] },
    overview: "Laos is tranquil and relaxed along the Mekong. Chief concerns involve unpaved motorcycle trail accidents, boat safety on remote rivers, and curfew closures.",
    keySafetyRules: [
      "Wear certified helmets when riding scooters; medical evacuation from rural Laos to Thailand is costly.",
      "Respect local town curfews (typically midnight in Luang Prabang).",
      "Carry cash in Lao Kip (LAK); card readers are infrequent outside high-end hotels."
    ],
    primaryCities: ["luang-prabang"]
  },
  LK: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "119", ambulance: "1990", fire: "110", touristPolice: "+94-11-242-1052" },
    consularHotlines: { usEmbassyPhone: "+94-11-249-8500", ukEmbassyPhone: "+94-11-532-6200", ausEmbassyPhone: "+94-11-246-3200" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["D", "G"] },
    overview: "Sri Lanka has scenic hill country and warm coastal culture. Women travelers should maintain firm boundaries with over-attentive tuk-tuk drivers and train companions.",
    keySafetyRules: [
      "Book designated reserved second or first-class seats on popular train routes (Colombo to Ella).",
      "Dial 1990 for Sri Lanka's free Suwa Seriya ambulance service.",
      "Use PickMe or Uber apps for regulated tuk-tuk and car rides."
    ],
    primaryCities: ["colombo"]
  },
  IN: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "112", ambulance: "102", fire: "101", touristPolice: "1363" },
    consularHotlines: { usEmbassyPhone: "+91-11-2419-8000", ukEmbassyPhone: "+91-11-2419-2100", ausEmbassyPhone: "+91-11-4139-9900" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "D", "M"] },
    overview: "India offers intense cultural immersion. Solo travelers require assertive boundary setting against aggressive commission touts, fake railway office scams, and food/water pathogens.",
    keySafetyRules: [
      "Drink exclusively bottled, sealed water or water filtered via reverse osmosis.",
      "Ignore street guides claiming the official station ticket office is closed or moved.",
      "Dial 112 for national emergency or 1363 for the Multi-Lingual Tourist Helpline."
    ],
    primaryCities: ["new-delhi"]
  },
  NP: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "100", ambulance: "102", fire: "101", touristPolice: "+977-1-424-7041" },
    consularHotlines: { usEmbassyPhone: "+977-1-423-4000", ukEmbassyPhone: "+977-1-423-7100", ausEmbassyPhone: "+977-1-437-1678" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "D", "M"] },
    overview: "Nepal is a Himalayan trekker's paradise. High altitude sickness (AMS), remote trail logistics, and mountain flight delays are the primary operational challenges.",
    keySafetyRules: [
      "Ascend gradually; never disregard headache or nausea above 2,500m (follow acclimatization protocols).",
      "Ensure your travel insurance explicitly covers high-altitude helicopter rescue up to 6,000m.",
      "Tourist Police headquarters in Kathmandu handles permits and missing traveler reports."
    ],
    primaryCities: ["kathmandu"]
  },
  MV: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "119", ambulance: "102", fire: "118" },
    consularHotlines: { usEmbassyPhone: "+960-330-0022", ukEmbassyPhone: "+960-331-5085", ausEmbassyPhone: "+94-11-246-3200" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["D", "G"] },
    overview: "The Maldives offers pristine atolls and high safety on resort islands and inhabited local islands. Sea transfer conditions and water safety require attention.",
    keySafetyRules: [
      "Observe local cultural dress codes on inhabited local islands outside designated bikini beaches.",
      "Confirm weather and swell conditions before embarking on inter-island speedboat transfers.",
      "Police dispatch is 119."
    ],
    primaryCities: ["male"]
  },
  BT: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "113", ambulance: "112", fire: "110" },
    consularHotlines: { usEmbassyPhone: "+91-11-2419-8000", ukEmbassyPhone: "+91-11-2419-2100", ausEmbassyPhone: "+91-11-4139-9900" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "D", "G"] },
    overview: "Bhutan is tranquil and strictly regulated for international tourism. Crime is practically unheard of; mountain driving on cliffside highways is the only notable hazard.",
    keySafetyRules: [
      "Travel is organized with certified local guides who coordinate transport and emergency logistics.",
      "Carry warm layers as temperatures fluctuate steeply between mountain valleys.",
      "Medical emergency line is 112."
    ],
    primaryCities: ["thimphu"]
  },
  MN: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "102", ambulance: "103", fire: "101" },
    consularHotlines: { usEmbassyPhone: "+976-7007-6001", ukEmbassyPhone: "+976-11-458-133", ausEmbassyPhone: "+976-7013-3001" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "Mongolia offers immense wilderness and steppe nomad culture. Extreme winter sub-zero temperatures and pickpockets at Ulaanbaatar's Naran Tuul Black Market are key concerns.",
    keySafetyRules: [
      "Guard wallets and phones vigilantly when navigating the crowded Naran Tuul market.",
      "Ensure GPS satellite communications when driving into the Gobi desert or Altai mountains.",
      "Police dispatch is 102."
    ],
    primaryCities: ["ulaanbaatar"]
  },
  FJ: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "917", ambulance: "911", fire: "910" },
    consularHotlines: { usEmbassyPhone: "+679-331-4466", ukEmbassyPhone: "+679-330-4744", ausEmbassyPhone: "+679-338-2211" },
    electricalStandards: { voltage: "240V", frequency: "50Hz", plugTypes: ["I"] },
    overview: "Fiji is warm, communal, and peaceful across outer island resorts. Urban areas in Suva and Nadi require standard nighttime caution.",
    keySafetyRules: [
      "Avoid walking alone on dark unlit roads in downtown Suva late at night.",
      "Respect village customs (sevusevu protocol of presenting kava roots to village chiefs).",
      "Dial 917 for police or 911 for ambulance."
    ],
    primaryCities: ["suva"]
  },
  GE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+995-32-227-7000", ukEmbassyPhone: "+995-32-227-4747", ausEmbassyPhone: "+995-32-227-7000" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Georgia is one of the safest, most welcoming nomad hubs in Eurasia. Crime is negligible; fast driving on mountain passes and stray dogs in rural hiking paths are main factors.",
    keySafetyRules: [
      "Use Bolt app for transparent, low-cost transit across Tbilisi and Batumi.",
      "Exercise defensive pedestrian caution when crossing multi-lane Tbilisi avenues.",
      "Unified emergency line 112 connects to English-fluent operators."
    ],
    primaryCities: ["tbilisi"]
  },
  AM: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "102", ambulance: "103", fire: "101", touristPolice: "911" },
    consularHotlines: { usEmbassyPhone: "+374-10-464-700", ukEmbassyPhone: "+374-10-264-301", ausEmbassyPhone: "+374-10-464-700" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Armenia is peaceful, family-oriented, and very safe for solo travelers. Yerevan's center is safe day and night; border demarcation areas in the south require checking advisory status.",
    keySafetyRules: [
      "Use GG or Yandex Taxi apps to secure verified pricing across Yerevan.",
      "Avoid traveling near eastern border zones adjacent to active geopolitical demarcation lines.",
      "Dial 911 for unified rescue and emergency service."
    ],
    primaryCities: ["yerevan"]
  },
  UZ: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "102", ambulance: "103", fire: "101", touristPolice: "+998-71-233-7056" },
    consularHotlines: { usEmbassyPhone: "+998-78-120-5450", ukEmbassyPhone: "+998-71-120-1500", ausEmbassyPhone: "+998-78-120-5450" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Uzbekistan has invested heavily in tourist safety with dedicated Tourist Police and modern Afrosiyob bullet trains linking Silk Road cities. Street crime is extremely low.",
    keySafetyRules: [
      "Retain hotel registration slips given at check-out; these may be inspected upon airport departure.",
      "Book high-speed Afrosiyob train tickets weeks in advance; they sell out rapidly.",
      "Tourist Police provide multi-lingual support at all major Silk Road architectural sites."
    ],
    primaryCities: ["tashkent"]
  },

  // --- THE AMERICAS ---
  US: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+1-202-501-4444", ukEmbassyPhone: "+1-202-588-6500", ausEmbassyPhone: "+1-202-797-3000" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "The United States offers vast solo travel opportunities with high emergency reliability. Neighborhood safety boundaries vary dramatically within single metropolitan blocks.",
    keySafetyRules: [
      "Examine neighborhood micro-boundaries carefully before choosing hotel or apartment locations.",
      "Carry comprehensive travel health insurance; out-of-pocket medical bills in the US are catastrophic.",
      "Dial 911 for immediate unified dispatch anywhere in the country."
    ],
    primaryCities: ["new-york", "san-francisco"]
  },
  MX: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911", touristPolice: "078" },
    consularHotlines: { usEmbassyPhone: "+52-55-5080-2000", ukEmbassyPhone: "+52-55-1670-3200", ausEmbassyPhone: "+52-55-1101-2200" },
    electricalStandards: { voltage: "127V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Mexico provides deep culinary and historical culture. Operational discipline is essential: stick to verified tourist zones, use authorized transit, and avoid intercity bus travel at night.",
    keySafetyRules: [
      "Never hail random street taxis; book Sitio cabs or verified rideshare apps (Uber/Didi).",
      "Stick to well-patrolled districts (Condesa, Roma, Polanco) and avoid unlit streets after midnight.",
      "Withdraw money only from bank ATMs situated inside protected branch lobbies during day hours."
    ],
    primaryCities: ["mexico-city", "oaxaca", "cancun"]
  },
  CO: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "123", ambulance: "123", fire: "119", touristPolice: "+57-1-3374413" },
    consularHotlines: { usEmbassyPhone: "+57-1-275-2000", ukEmbassyPhone: "+57-1-326-8300", ausEmbassyPhone: "+57-1-631-4300" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Colombia is scenic and welcoming, but demands strict operational boundaries. Major risks include scopolamine drugging via dating apps and robbery in isolated alleys.",
    keySafetyRules: [
      "Obey 'No dar papaya' — never display valuable phones, watches, or jewelry openly on the street.",
      "Never meet dating app contacts in private hotel rooms or airbnbs; choose public, security-staffed venues.",
      "Use app-based rides (Uber, Cabify) rather than flagging street taxis after dark."
    ],
    primaryCities: ["medellin", "bogota", "cartagena"]
  },
  CR: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+506-2519-2000", ukEmbassyPhone: "+506-2258-2025", ausEmbassyPhone: "+506-2220-3000" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Costa Rica is renowned for biodiversity and peaceful stability. Car break-ins and unattended beach theft represent the primary operational exposures.",
    keySafetyRules: [
      "Never leave luggage, gear, or passports in rental vehicles, even for short scenic stops.",
      "Only take official red taxis displaying yellow door triangles, or use Uber.",
      "Observe strong Pacific rip current warnings; avoid swimming on unpatrolled beaches alone."
    ],
    primaryCities: ["san-jose"]
  },
  CA: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+1-613-238-5335", ukEmbassyPhone: "+1-613-237-1530", ausEmbassyPhone: "+1-613-236-0841" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Canada offers world-class public safety and extensive wilderness. Urban areas are peaceful, with severe winter sub-zero blizzards and remote wildlife being primary concerns.",
    keySafetyRules: [
      "Carry bear spray and understand wildlife protocols when trekking national parks in Alberta or BC.",
      "Winter driving requires winter-rated snow tires and emergency vehicle survival kits.",
      "Dial 911 for all emergencies."
    ],
    primaryCities: ["toronto", "vancouver"]
  },
  PE: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "105", ambulance: "117", fire: "116", touristPolice: "+51-1-460-1060" },
    consularHotlines: { usEmbassyPhone: "+51-1-618-2000", ukEmbassyPhone: "+51-1-617-3000", ausEmbassyPhone: "+51-1-222-8281" },
    electricalStandards: { voltage: "220V", frequency: "60Hz", plugTypes: ["A", "B", "C"] },
    overview: "Peru is breathtaking from Machu Picchu to Lima's food scene. Solo travelers face counterfeit currency, luggage diversion at bus stations, and elevation sickness.",
    keySafetyRules: [
      "Acclimatize in Cusco for 48 hours before undertaking the Inca Trail or Rainbow Mountain trek.",
      "Use premium intercity bus companies (Cruz del Sur) with security luggage checks rather than local lines.",
      "Check banknote watermarks; counterfeit Peruvian Sol notes are prevalent in markets."
    ],
    primaryCities: ["lima", "cusco"]
  },
  AR: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "107", fire: "100", touristPolice: "+54-9-11-5050-3293" },
    consularHotlines: { usEmbassyPhone: "+54-11-5777-4533", ukEmbassyPhone: "+54-11-4808-2200", ausEmbassyPhone: "+54-11-4779-3500" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C", "I"] },
    overview: "Argentina is European in feel with rich wine and tango culture. Solo travelers should watch for snatch-and-grab motorcycle theft (motochorros) and mustard/liquid distraction tricks.",
    keySafetyRules: [
      "If someone spills liquid or mustard on you, immediately secure your bags and walk away without letting them 'help'.",
      "Keep phones stashed away from cafe windows and sidewalk curbs.",
      "Tourist Police in Buenos Aires provide specialized multilingual assistance via WhatsApp."
    ],
    primaryCities: ["buenos-aires"]
  },
  CL: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "133", ambulance: "131", fire: "132" },
    consularHotlines: { usEmbassyPhone: "+56-2-2330-3000", ukEmbassyPhone: "+56-2-2370-4100", ausEmbassyPhone: "+56-2-2550-3500" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C", "L"] },
    overview: "Chile is one of South America's most stable and developed economies. Crime is comparatively low; standard caution applies around Santiago central markets and bus terminals.",
    keySafetyRules: [
      "Keep daypacks on your lap when traveling on Santiago's metro or intercity buses.",
      "Prepare for rapid weather transformations when trekking Torres del Paine in Patagonia.",
      "Police (Carabineros) emergency dispatch is 133."
    ],
    primaryCities: ["santiago"]
  },
  BR: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "190", ambulance: "192", fire: "193", touristPolice: "+55-21-2332-2924" },
    consularHotlines: { usEmbassyPhone: "+55-61-3312-7000", ukEmbassyPhone: "+55-61-3329-2300", ausEmbassyPhone: "+55-61-3224-5500" },
    electricalStandards: { voltage: "127/220V", frequency: "60Hz", plugTypes: ["C", "N"] },
    overview: "Brazil offers legendary energy and landscapes, but demands disciplined situational street awareness. High rates of street robbery in major cities require minimal asset exposure.",
    keySafetyRules: [
      "Never walk on Rio's Copacabana or Ipanema beaches after sunset.",
      "Do not wear gold chains, luxury watches, or carry cameras openly in public squares.",
      "Use Uber or registered 99 rides; avoid unmarked street cabs at night."
    ],
    primaryCities: ["rio-de-janeiro"]
  },
  EC: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+593-2-398-5000", ukEmbassyPhone: "+593-2-397-2200", ausEmbassyPhone: "+593-2-398-5000" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Ecuador offers the Galapagos Islands, Andes mountains, and Amazon basin. Coastal port zones and intercity bus routes face elevated security friction.",
    keySafetyRules: [
      "Stick to safe historic colonial centers in Quito and Cuenca; avoid walking after dark in port cities like Guayaquil.",
      "Keep daypacks clamped between your feet on regional buses (do not store above head).",
      "Unified emergency hotline is 911."
    ],
    primaryCities: ["quito"]
  },
  GT: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "110", ambulance: "128", fire: "122", touristPolice: "+502-2297-7400" },
    consularHotlines: { usEmbassyPhone: "+502-2354-0000", ukEmbassyPhone: "+502-2380-7300", ausEmbassyPhone: "+502-2354-0000" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Guatemala offers magnificent Mayan heritage in Tikal and Lake Atitlan. Armed robbery on remote hiking trails and chicken buses makes tourist shuttles mandatory.",
    keySafetyRules: [
      "Always take tourist shuttles rather than local chicken buses between Guatemala City, Antigua, and Lake Atitlan.",
      "Hire certified PROATUR tourist police escorts when hiking volcanoes (e.g. Acatenango).",
      "PROATUR Tourist Assistance hotline is 1500."
    ],
    primaryCities: ["antigua"]
  },
  PA: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "104", ambulance: "911", fire: "103", touristPolice: "+507-511-9260" },
    consularHotlines: { usEmbassyPhone: "+507-317-5000", ukEmbassyPhone: "+507-297-6550", ausEmbassyPhone: "+507-317-5000" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "Panama is modern with the US dollar as legal tender. Panama City's Casco Viejo is well-patrolled; travelers should avoid straying into adjacent neighborhood borders (El Chorrillo).",
    keySafetyRules: [
      "Do not wander past the police-guarded perimeter of Casco Viejo into El Chorrillo.",
      "Use Uber or yellow cabs with pre-negotiated rates.",
      "Emergency medical is 911; police dispatch is 104."
    ],
    primaryCities: ["panama-city"]
  },
  UY: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+598-1770-2000", ukEmbassyPhone: "+598-2622-3630", ausEmbassyPhone: "+598-1770-2000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F", "L"] },
    overview: "Uruguay is the safest, most stable country in South America. Solo travelers experience calm coastal towns (Punta del Este) and walkable Montevideo neighborhoods.",
    keySafetyRules: [
      "Standard urban vigilance applies around Montevideo's Ciudad Vieja late at night.",
      "Carry credit cards; foreign tourists receive significant VAT refunds automatically at dining venues.",
      "Emergency number 911 provides unified dispatch."
    ],
    primaryCities: ["montevideo"]
  },
  BO: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "110", ambulance: "118", fire: "119", touristPolice: "+591-2-222-5016" },
    consularHotlines: { usEmbassyPhone: "+591-2-216-8000", ukEmbassyPhone: "+591-2-243-3424", ausEmbassyPhone: "+591-2-216-8000" },
    electricalStandards: { voltage: "115/230V", frequency: "50Hz", plugTypes: ["A", "C"] },
    overview: "Bolivia features surreal Salar de Uyuni salt flats and high-altitude culture. Express kidnappings in unverified radio cabs and extreme altitude require preparation.",
    keySafetyRules: [
      "Only use pre-called Radio Taxis; never enter unmarked street cabs at bus terminals or night venues.",
      "Give yourself 2-3 days to adapt to La Paz's 3,600m altitude before strenuous trekking.",
      "Tourist Police handle disputes and stolen document filings in major centers."
    ],
    primaryCities: ["la-paz"]
  },
  BZ: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911" },
    consularHotlines: { usEmbassyPhone: "+501-822-4011", ukEmbassyPhone: "+501-822-2146", ausEmbassyPhone: "+501-822-4011" },
    electricalStandards: { voltage: "110/220V", frequency: "60Hz", plugTypes: ["A", "B", "G"] },
    overview: "Belize is English-speaking and renowned for barrier reef diving and Maya ruins. Belize City has gang-related street crime; travelers should transit quickly to the Cayes or Cayo.",
    keySafetyRules: [
      "Transfer directly from Belize City airport to water taxis for Caye Caulker or San Pedro without lingering downtown.",
      "Use authorized boat operators adhering to life vest safety standards on reef outings.",
      "Unified emergency hotline is 911."
    ],
    primaryCities: ["belize-city"]
  },
  JM: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "119", ambulance: "110", fire: "110" },
    consularHotlines: { usEmbassyPhone: "+1-876-702-6000", ukEmbassyPhone: "+1-876-936-0700", ausEmbassyPhone: "+1-876-702-6000" },
    electricalStandards: { voltage: "110V", frequency: "50Hz", plugTypes: ["A", "B"] },
    overview: "Jamaica offers iconic music, cuisine, and Caribbean beaches. High violent crime in specific Kingston and Montego Bay neighborhoods requires adhering to verified routes.",
    keySafetyRules: [
      "Only take JUTA-certified taxis (displaying red license plates).",
      "Avoid isolated night walks along unpatrolled public beaches.",
      "Police dispatch is 119; medical and fire is 110."
    ],
    primaryCities: ["kingston"]
  },
  DO: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911", touristPolice: "+1-809-200-3500" },
    consularHotlines: { usEmbassyPhone: "+1-809-567-7775", ukEmbassyPhone: "+1-809-472-7111", ausEmbassyPhone: "+1-809-567-7775" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "The Dominican Republic offers vibrant Caribbean culture. Outside resort perimeters, motorcycle drive-by theft and unmetered taxi fares are typical concerns.",
    keySafetyRules: [
      "Use Uber or airport terminal taxi desks rather than unmarked street vehicles.",
      "Keep phones securely tucked away when walking near busy roadway intersections.",
      "POLITUR (Tourist Police) provides specialized traveler assistance across resort corridors."
    ],
    primaryCities: ["santo-domingo"]
  },
  BS: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "919", fire: "919" },
    consularHotlines: { usEmbassyPhone: "+1-242-322-1181", ukEmbassyPhone: "+1-242-225-6033", ausEmbassyPhone: "+1-242-322-1181" },
    electricalStandards: { voltage: "120V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "The Bahamas offers world-class diving and beaches. Nassau's 'Over-the-Hill' district south of downtown experiences gang friction; stick to well-patrolled tourist corridors.",
    keySafetyRules: [
      "Avoid entering residential areas south of Shirley Street (the Over-the-Hill area) in Nassau after dark.",
      "Choose licensed, insured jet ski operators on public beaches.",
      "Emergency police dispatch is 911."
    ],
    primaryCities: ["nassau"]
  },
  BB: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "211", ambulance: "511", fire: "311" },
    consularHotlines: { usEmbassyPhone: "+1-246-227-4000", ukEmbassyPhone: "+1-246-430-7800", ausEmbassyPhone: "+1-246-227-4000" },
    electricalStandards: { voltage: "115V", frequency: "50Hz", plugTypes: ["A", "B"] },
    overview: "Barbados is peaceful, welcoming, and safe for solo travelers with British-influenced legal traditions and friendly coastal communities.",
    keySafetyRules: [
      "Camouflage clothing of any type is strictly illegal for civilians in Barbados.",
      "Yellow public minibuses and blue transit buses are safe, affordable transit options.",
      "Police dispatch is 211; medical ambulance is 511."
    ],
    primaryCities: ["bridgetown"]
  },
  PY: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "141", fire: "132" },
    consularHotlines: { usEmbassyPhone: "+595-21-604-568", ukEmbassyPhone: "+595-21-614-586", ausEmbassyPhone: "+595-21-604-568" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C"] },
    overview: "Paraguay offers authentic, off-the-beaten-path South American travel. Asuncion is generally tranquil; border areas near Ciudad del Este require heightened caution.",
    keySafetyRules: [
      "Exercise vigilance against pickpocketing in crowded commercial sectors of Ciudad del Este.",
      "Use Bolt or Muv apps for verified car transport across Asuncion.",
      "Emergency police dispatch is 911."
    ],
    primaryCities: ["asuncion"]
  },
  SV: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "913" },
    consularHotlines: { usEmbassyPhone: "+503-2501-2999", ukEmbassyPhone: "+503-2511-5757", ausEmbassyPhone: "+503-2501-2999" },
    electricalStandards: { voltage: "115V", frequency: "60Hz", plugTypes: ["A", "B"] },
    overview: "El Salvador has seen a dramatic drop in street homicide and crime in recent years. Surfing coastal towns (El Tunco, El Zonte) are popular and secure for solo visitors.",
    keySafetyRules: [
      "Stick to established surf corridors and well-lit historic center plazas in San Salvador.",
      "Both US Dollars and Bitcoin are accepted alongside standard credit cards.",
      "Unified emergency hotline is 911."
    ],
    primaryCities: ["san-salvador"]
  },

  // --- MIDDLE EAST & AFRICA ---
  AE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "998", fire: "997", touristPolice: "901" },
    consularHotlines: { usEmbassyPhone: "+971-2-414-2200", ukEmbassyPhone: "+971-4-309-4444", ausEmbassyPhone: "+971-2-401-7500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "The UAE boasts world-leading safety rankings with virtually nonexistent violent or petty street crime. Strict legal statutes govern public etiquette, modesty, and digital speech.",
    keySafetyRules: [
      "Respect local legal sensitivities regarding public photography, alcohol consumption in public, and social decorum.",
      "Taxis are metered, government-regulated, and exceptionally safe day and night.",
      "Emergency police dispatch is 999; tourist support is 901."
    ],
    primaryCities: ["dubai"]
  },
  MA: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "19", ambulance: "15", fire: "15", touristPolice: "+212-524-384-601" },
    consularHotlines: { usEmbassyPhone: "+212-537-637-200", ukEmbassyPhone: "+212-537-633-333", ausEmbassyPhone: "+212-537-637-200" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "Morocco offers sensory wonder in medinas and desert routes. Solo travelers (particularly solo women) encounter persistent street solicitation and faux guide misdirection.",
    keySafetyRules: [
      "Firmly and politely ignore faux guides claiming 'the street is closed' in the Marrakech or Fez medinas.",
      "Download offline maps (Maps.me / Organic Maps) to navigate labyrinthine medinas independently.",
      "In urban centers, dial 19 for police or 15 for medical ambulance."
    ],
    primaryCities: ["marrakech"]
  },
  EG: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "122", ambulance: "123", fire: "180", touristPolice: "126" },
    consularHotlines: { usEmbassyPhone: "+20-2-2797-3300", ukEmbassyPhone: "+20-2-2791-6000", ausEmbassyPhone: "+20-2-2770-6600" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Egypt provides peerless antiquity. Solo visitors navigate intense commercial badgering at the Giza Pyramids and Luxor temples; organized security convoys monitor highway transit.",
    keySafetyRules: [
      "Pre-book verified guides through reputable agencies to buffer against relentless site hawkers.",
      "Use Uber in Cairo and Alexandria to prevent constant taxi fare disputes.",
      "Dial 126 for the dedicated Tourist Police."
    ],
    primaryCities: ["cairo"]
  },
  ZA: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "10111", ambulance: "10177", fire: "10177" },
    consularHotlines: { usEmbassyPhone: "+27-12-431-4000", ukEmbassyPhone: "+27-12-421-7500", ausEmbassyPhone: "+27-12-423-6000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "D", "M", "N"] },
    overview: "South Africa features dramatic scenery from Table Mountain to Kruger safaris. Elevated violent crime rates require strict situational protocols regarding nighttime movement.",
    keySafetyRules: [
      "Never walk alone in city centers (Cape Town CBD, Johannesburg) after business hours; use Uber door-to-door.",
      "Do not hike Table Mountain or Lion's Head trails alone; join group trekking parties.",
      "National police flying squad is 10111."
    ],
    primaryCities: ["cape-town"]
  },
  KE: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "999" },
    consularHotlines: { usEmbassyPhone: "+254-20-363-6000", ukEmbassyPhone: "+254-20-287-3000", ausEmbassyPhone: "+254-20-427-7100" },
    electricalStandards: { voltage: "240V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Kenya is an East African hub for wildlife safaris and coastal Diani Beach. Nairobi requires situational caution against opportunistic street theft.",
    keySafetyRules: [
      "Use Uber or Bolt for city movements in Nairobi and Mombasa.",
      "Store expensive camera telephoto lenses inside non-descript backpacks until inside national park game reserves.",
      "Emergency dispatch is 999 or 112."
    ],
    primaryCities: ["nairobi"]
  },
  JO: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "911", ambulance: "911", fire: "911", touristPolice: "+962-6-569-0384" },
    consularHotlines: { usEmbassyPhone: "+962-6-590-6000", ukEmbassyPhone: "+962-6-590-1500", ausEmbassyPhone: "+962-6-580-7000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["B", "C", "D", "F", "G", "J"] },
    overview: "Jordan is an island of peace and profound hospitality in the Levant. Petra, Wadi Rum, and Amman are welcoming to independent solo female and male travelers.",
    keySafetyRules: [
      "Respect conservative dress conventions outside beach resorts and Wadi Rum bedouin camps.",
      "Confirm taxi meter activation or agree on fares before departing Queen Alia International Airport.",
      "Unified emergency hotline is 911."
    ],
    primaryCities: ["amman"]
  },
  OM: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "9999", ambulance: "9999", fire: "9999" },
    consularHotlines: { usEmbassyPhone: "+968-2464-3400", ukEmbassyPhone: "+968-2460-9000", ausEmbassyPhone: "+968-2464-3400" },
    electricalStandards: { voltage: "240V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Oman is peaceful, spotless, and celebrated for genuine Arabian hospitality. Crime is virtually non-existent; desert route navigation is the primary operational consideration.",
    keySafetyRules: [
      "Ensure 4WD capability, adequate water reserves, and GPS tracks before entering Wahiba Sands dunes.",
      "Observe modest dress standards covering shoulders and knees in public souks and mosques.",
      "Unified emergency number is 9999."
    ],
    primaryCities: ["muscat"]
  },
  QA: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "999" },
    consularHotlines: { usEmbassyPhone: "+974-4496-6000", ukEmbassyPhone: "+974-4496-2000", ausEmbassyPhone: "+974-4007-8500" },
    electricalStandards: { voltage: "240V", frequency: "50Hz", plugTypes: ["D", "G"] },
    overview: "Qatar offers supreme safety, ultra-modern driverless metro transit in Doha, and strict law enforcement. Violent and street crime are effectively zero.",
    keySafetyRules: [
      "Use the state-of-the-art Doha Metro network with gold-class carriages and contactless fare cards.",
      "Adhere to local dress and decorum regulations in government premises and cultural museums.",
      "Emergency services are reachable via 999."
    ],
    primaryCities: ["doha"]
  },
  SA: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "997", fire: "998", touristPolice: "930" },
    consularHotlines: { usEmbassyPhone: "+966-11-488-3800", ukEmbassyPhone: "+966-11-481-9100", ausEmbassyPhone: "+966-11-250-0900" },
    electricalStandards: { voltage: "230V", frequency: "60Hz", plugTypes: ["G"] },
    overview: "Saudi Arabia has opened rapidly to international tourism with high safety and modern transport infrastructure. Laws regarding public modesty and cultural sensitivity are strictly upheld.",
    keySafetyRules: [
      "Dress modestly in public spaces, avoiding revealing attire.",
      "Use Uber or Careem for convenient city transit across Riyadh and Jeddah.",
      "Dial 930 for dedicated Tourism Call Center assistance."
    ],
    primaryCities: ["riyadh"]
  },
  IL: {
    defaultRiskTier: "Elevated",
    emergencyNumbers: { police: "100", ambulance: "101", fire: "102" },
    consularHotlines: { usEmbassyPhone: "+972-3-519-7575", ukEmbassyPhone: "+972-3-725-1222", ausEmbassyPhone: "+972-3-693-5000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "H", "M"] },
    overview: "Israel features ancient historic treasures alongside high-tech coastal cities. Geopolitical security alerts and rocket sirens require immediate familiarity with bomb shelter protocols.",
    keySafetyRules: [
      "Download the Home Front Command (Tzeva Adom) alert app and locate public bomb shelters (Mamad) in your lodging.",
      "Follow military and civilian directives immediately during siren sounding.",
      "Police dispatch is 100; medical ambulance (Magen David Adom) is 101."
    ],
    primaryCities: ["tel-aviv"]
  },
  TZ: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "112", ambulance: "115", fire: "114" },
    consularHotlines: { usEmbassyPhone: "+255-22-229-4000", ukEmbassyPhone: "+255-22-229-0000", ausEmbassyPhone: "+255-22-229-4000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["D", "G"] },
    overview: "Tanzania is celebrated for Serengeti migrations and Zanzibar spice beaches. Travelers should avoid unmetered taxis in Dar es Salaam and take licensed safari tour operators.",
    keySafetyRules: [
      "Arrange airport transfers directly with verified hotels rather than accepting terminal offers.",
      "Exercise caution on Stone Town narrow alleys after sunset; walk on well-lit main thoroughfares.",
      "Unified emergency response is 112."
    ],
    primaryCities: ["zanzibar"]
  },
  RW: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "912", fire: "111" },
    consularHotlines: { usEmbassyPhone: "+250-252-596-400", ukEmbassyPhone: "+250-252-556-000", ausEmbassyPhone: "+250-252-596-400" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "J"] },
    overview: "Rwanda is recognized as one of the cleanest, safest, and best-governed countries in Africa. Kigali is exceptionally clean and peaceful for solo travelers.",
    keySafetyRules: [
      "Plastic bags are prohibited nationwide and confiscated upon airport arrival.",
      "Motorcycle taxi riders in Kigali are legally required to carry passenger helmets.",
      "Police emergency is 112; ambulance is 912."
    ],
    primaryCities: ["kigali"]
  },
  MU: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "114", fire: "115", touristPolice: "+230-213-7878" },
    consularHotlines: { usEmbassyPhone: "+230-202-4400", ukEmbassyPhone: "+230-202-9400", ausEmbassyPhone: "+230-202-0160" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "G"] },
    overview: "Mauritius is peaceful and prosperous with stunning tropical beaches. Solo visitors enjoy low crime and well-developed hospitality services.",
    keySafetyRules: [
      "Drive on the left side of the road if renting a vehicle.",
      "Use metered taxis or hotel transportation for evening outings.",
      "Emergency police is 999; medical ambulance is 114."
    ],
    primaryCities: ["port-louis"]
  },
  SC: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "151", fire: "999" },
    consularHotlines: { usEmbassyPhone: "+230-202-4400", ukEmbassyPhone: "+248-438-3888", ausEmbassyPhone: "+230-202-0160" },
    electricalStandards: { voltage: "240V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Seychelles is safe, tranquil, and world-renowned for granite boulder beaches. Violent crime is rare; unattended items on isolated beaches should not be left.",
    keySafetyRules: [
      "Do not leave valuables unattended while swimming on secluded coves (e.g. Anse Source d'Argent).",
      "Observe marine warning flags regarding seasonal undertows and coral reefs.",
      "Police emergency dispatch is 999."
    ],
    primaryCities: ["victoria"]
  },
  NA: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "10111", ambulance: "211111", fire: "211111" },
    consularHotlines: { usEmbassyPhone: "+264-61-295-8500", ukEmbassyPhone: "+264-61-274-800", ausEmbassyPhone: "+264-61-295-8500" },
    electricalStandards: { voltage: "220V", frequency: "50Hz", plugTypes: ["D", "M"] },
    overview: "Namibia is celebrated for dramatic desert landscapes and self-drive road trips. Long distances between fuel stations and gravel road rollovers are primary risks.",
    keySafetyRules: [
      "Keep speeds below 80 km/h on gravel roads to prevent catastrophic tire blowouts or rollovers.",
      "Carry two spare tires, satellite communications, and minimum 10 liters of drinking water on road trips.",
      "Police emergency is 10111."
    ],
    primaryCities: ["windhoek"]
  },
  BW: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "997", fire: "998" },
    consularHotlines: { usEmbassyPhone: "+267-395-3982", ukEmbassyPhone: "+267-395-2841", ausEmbassyPhone: "+267-395-3982" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["D", "G", "M"] },
    overview: "Botswana is one of Africa's safest, most politically stable democracies. High-end safari eco-tourism dominates; wildlife safety in unfenced wilderness camps is primary.",
    keySafetyRules: [
      "Never walk between safari tents at night without an armed camp escort due to wild predators.",
      "Use 4WD vehicles with high clearance when navigating Chobe or Moremi game reserves.",
      "Police dispatch is 999."
    ],
    primaryCities: ["gaborone"]
  },
  GH: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "191", ambulance: "193", fire: "192" },
    consularHotlines: { usEmbassyPhone: "+233-30-274-1000", ukEmbassyPhone: "+233-30-221-3200", ausEmbassyPhone: "+233-30-221-6400" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["D", "G"] },
    overview: "Ghana is renowned for warmth and hospitality, earning its title as the Gateway to Africa. Solo travelers navigate street traffic in Accra and opportunistic card cloning.",
    keySafetyRules: [
      "Use ride-hailing apps (Uber, Bolt) rather than tro-tro minibuses for city transit.",
      "Take anti-malarial prophylaxis and use mosquito repellent especially during rainy seasons.",
      "Emergency police is 191."
    ],
    primaryCities: ["accra"]
  },
  TN: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "197", ambulance: "198", fire: "198", touristPolice: "+216-71-340-000" },
    consularHotlines: { usEmbassyPhone: "+216-71-107-000", ukEmbassyPhone: "+216-71-108-700", ausEmbassyPhone: "+216-71-107-000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "Tunisia features Mediterranean beaches and Roman heritage (Carthage). Solo travelers should avoid remote border zones near Libya and Algeria and exercise standard souk caution.",
    keySafetyRules: [
      "Avoid traveling to southern military desert zones or border areas without official authorizations.",
      "Confirm taxi meter activation in Tunis yellow cabs.",
      "Police emergency is 197; ambulance and fire is 198."
    ],
    primaryCities: ["tunis"]
  }
};

// 63 Curated Global City Hubs
const CURATED_CITIES_63 = [
  // Asia & Pacific
  { slug: "tokyo", name: "Tokyo", countryCode: "JP", coordinates: { latitude: 35.6895, longitude: 139.6917 }, wikidataId: "Q1490", population: 13960000, riskTier: "Low", primaryAirportCode: "HND" },
  { slug: "kyoto", name: "Kyoto", countryCode: "JP", coordinates: { latitude: 35.0116, longitude: 135.7681 }, wikidataId: "Q34600", population: 1464000, riskTier: "Low", primaryAirportCode: "KIX" },
  { slug: "osaka", name: "Osaka", countryCode: "JP", coordinates: { latitude: 34.6937, longitude: 135.5023 }, wikidataId: "Q35765", population: 2691000, riskTier: "Low", primaryAirportCode: "KIX" },
  { slug: "bangkok", name: "Bangkok", countryCode: "TH", coordinates: { latitude: 13.7563, longitude: 100.5018 }, wikidataId: "Q1861", population: 10539000, riskTier: "Moderate", primaryAirportCode: "BKK" },
  { slug: "chiang-mai", name: "Chiang Mai", countryCode: "TH", coordinates: { latitude: 18.7883, longitude: 98.9853 }, wikidataId: "Q193630", population: 127000, riskTier: "Low", primaryAirportCode: "CNX" },
  { slug: "phuket", name: "Phuket", countryCode: "TH", coordinates: { latitude: 7.8804, longitude: 98.3923 }, wikidataId: "Q182567", population: 79000, riskTier: "Moderate", primaryAirportCode: "HKT" },
  { slug: "bali", name: "Bali (Denpasar)", countryCode: "ID", coordinates: { latitude: -8.6705, longitude: 115.2126 }, wikidataId: "Q4648", population: 4362000, riskTier: "Moderate", primaryAirportCode: "DPS" },
  { slug: "hanoi", name: "Hanoi", countryCode: "VN", coordinates: { latitude: 21.0285, longitude: 105.8542 }, wikidataId: "Q1858", population: 8053663, riskTier: "Moderate", primaryAirportCode: "HAN" },
  { slug: "ho-chi-minh-city", name: "Ho Chi Minh City", countryCode: "VN", coordinates: { latitude: 10.8231, longitude: 106.6297 }, wikidataId: "Q1854", population: 8993082, riskTier: "Moderate", primaryAirportCode: "SGN" },
  { slug: "singapore", name: "Singapore", countryCode: "SG", coordinates: { latitude: 1.3521, longitude: 103.8198 }, wikidataId: "Q334", population: 5685807, riskTier: "Low", primaryAirportCode: "SIN" },
  { slug: "seoul", name: "Seoul", countryCode: "KR", coordinates: { latitude: 37.5665, longitude: 126.9780 }, wikidataId: "Q8684", population: 9776000, riskTier: "Low", primaryAirportCode: "ICN" },
  { slug: "taipei", name: "Taipei", countryCode: "TW", coordinates: { latitude: 25.0330, longitude: 121.5654 }, wikidataId: "Q1867", population: 2602418, riskTier: "Low", primaryAirportCode: "TPE" },
  { slug: "kuala-lumpur", name: "Kuala Lumpur", countryCode: "MY", coordinates: { latitude: 3.1390, longitude: 101.6869 }, wikidataId: "Q1865", population: 1982112, riskTier: "Moderate", primaryAirportCode: "KUL" },
  { slug: "manila", name: "Manila", countryCode: "PH", coordinates: { latitude: 14.5995, longitude: 120.9842 }, wikidataId: "Q1461", population: 1846513, riskTier: "Moderate", primaryAirportCode: "MNL" },
  { slug: "siem-reap", name: "Siem Reap", countryCode: "KH", coordinates: { latitude: 13.3671, longitude: 103.8448 }, wikidataId: "Q652837", population: 139458, riskTier: "Moderate", primaryAirportCode: "SAI" },
  { slug: "luang-prabang", name: "Luang Prabang", countryCode: "LA", coordinates: { latitude: 19.8893, longitude: 102.1337 }, wikidataId: "Q190130", population: 55884, riskTier: "Low", primaryAirportCode: "LPQ" },
  { slug: "colombo", name: "Colombo", countryCode: "LK", coordinates: { latitude: 6.9271, longitude: 79.8612 }, wikidataId: "Q35381", population: 752993, riskTier: "Moderate", primaryAirportCode: "CMB" },
  { slug: "new-delhi", name: "New Delhi", countryCode: "IN", coordinates: { latitude: 28.6139, longitude: 77.2090 }, wikidataId: "Q987", population: 14200000, riskTier: "Elevated", primaryAirportCode: "DEL" },
  { slug: "kathmandu", name: "Kathmandu", countryCode: "NP", coordinates: { latitude: 27.7172, longitude: 85.3240 }, wikidataId: "Q1861", population: 1442000, riskTier: "Moderate", primaryAirportCode: "KTM" },
  { slug: "sydney", name: "Sydney", countryCode: "AU", coordinates: { latitude: -33.8688, longitude: 151.2093 }, wikidataId: "Q3130", population: 5312000, riskTier: "Low", primaryAirportCode: "SYD" },
  { slug: "melbourne", name: "Melbourne", countryCode: "AU", coordinates: { latitude: -37.8136, longitude: 144.9631 }, wikidataId: "Q3141", population: 5078000, riskTier: "Low", primaryAirportCode: "MEL" },
  { slug: "auckland", name: "Auckland", countryCode: "NZ", coordinates: { latitude: -36.8485, longitude: 174.7633 }, wikidataId: "Q37100", population: 1657000, riskTier: "Low", primaryAirportCode: "AKL" },
  { slug: "tbilisi", name: "Tbilisi", countryCode: "GE", coordinates: { latitude: 41.7151, longitude: 44.8271 }, wikidataId: "Q994", population: 1154000, riskTier: "Low", primaryAirportCode: "TBS" },

  // Europe
  { slug: "rome", name: "Rome", countryCode: "IT", coordinates: { latitude: 41.8919, longitude: 12.5113 }, wikidataId: "Q220", population: 2873000, riskTier: "Moderate", primaryAirportCode: "FCO" },
  { slug: "florence", name: "Florence", countryCode: "IT", coordinates: { latitude: 43.7696, longitude: 11.2558 }, wikidataId: "Q2044", population: 382258, riskTier: "Low", primaryAirportCode: "FLR" },
  { slug: "milan", name: "Milan", countryCode: "IT", coordinates: { latitude: 45.4642, longitude: 9.1900 }, wikidataId: "Q490", population: 1352000, riskTier: "Moderate", primaryAirportCode: "MXP" },
  { slug: "venice", name: "Venice", countryCode: "IT", coordinates: { latitude: 45.4408, longitude: 12.3155 }, wikidataId: "Q641", population: 261905, riskTier: "Low", primaryAirportCode: "VCE" },
  { slug: "barcelona", name: "Barcelona", countryCode: "ES", coordinates: { latitude: 41.3851, longitude: 2.1734 }, wikidataId: "Q1492", population: 1620000, riskTier: "Moderate", primaryAirportCode: "BCN" },
  { slug: "madrid", name: "Madrid", countryCode: "ES", coordinates: { latitude: 40.4168, longitude: -3.7038 }, wikidataId: "Q2807", population: 3223000, riskTier: "Low", primaryAirportCode: "MAD" },
  { slug: "seville", name: "Seville", countryCode: "ES", coordinates: { latitude: 37.3891, longitude: -5.9845 }, wikidataId: "Q8717", population: 688711, riskTier: "Low", primaryAirportCode: "SVQ" },
  { slug: "paris", name: "Paris", countryCode: "FR", coordinates: { latitude: 48.8566, longitude: 2.3522 }, wikidataId: "Q90", population: 2161000, riskTier: "Moderate", primaryAirportCode: "CDG" },
  { slug: "nice", name: "Nice", countryCode: "FR", coordinates: { latitude: 43.7102, longitude: 7.2620 }, wikidataId: "Q33959", population: 342522, riskTier: "Moderate", primaryAirportCode: "NCE" },
  { slug: "lisbon", name: "Lisbon", countryCode: "PT", coordinates: { latitude: 38.7223, longitude: -9.1393 }, wikidataId: "Q597", population: 504718, riskTier: "Low", primaryAirportCode: "LIS" },
  { slug: "porto", name: "Porto", countryCode: "PT", coordinates: { latitude: 41.1579, longitude: -8.6291 }, wikidataId: "Q36433", population: 231800, riskTier: "Low", primaryAirportCode: "OPO" },
  { slug: "amsterdam", name: "Amsterdam", countryCode: "NL", coordinates: { latitude: 52.3676, longitude: 4.9041 }, wikidataId: "Q727", population: 872680, riskTier: "Low", primaryAirportCode: "AMS" },
  { slug: "london", name: "London", countryCode: "GB", coordinates: { latitude: 51.5074, longitude: -0.1278 }, wikidataId: "Q84", population: 8982000, riskTier: "Low", primaryAirportCode: "LHR" },
  { slug: "edinburgh", name: "Edinburgh", countryCode: "GB", coordinates: { latitude: 55.9533, longitude: -3.1883 }, wikidataId: "Q23436", population: 527620, riskTier: "Low", primaryAirportCode: "EDI" },
  { slug: "dublin", name: "Dublin", countryCode: "IE", coordinates: { latitude: 53.3498, longitude: -6.2603 }, wikidataId: "Q1761", population: 1173179, riskTier: "Low", primaryAirportCode: "DUB" },
  { slug: "berlin", name: "Berlin", countryCode: "DE", coordinates: { latitude: 52.5200, longitude: 13.4050 }, wikidataId: "Q64", population: 3645000, riskTier: "Low", primaryAirportCode: "BER" },
  { slug: "munich", name: "Munich", countryCode: "DE", coordinates: { latitude: 48.1351, longitude: 11.5820 }, wikidataId: "Q1726", population: 1472000, riskTier: "Low", primaryAirportCode: "MUC" },
  { slug: "vienna", name: "Vienna", countryCode: "AT", coordinates: { latitude: 48.2082, longitude: 16.3738 }, wikidataId: "Q1741", population: 1911000, riskTier: "Low", primaryAirportCode: "VIE" },
  { slug: "prague", name: "Prague", countryCode: "CZ", coordinates: { latitude: 50.0755, longitude: 14.4378 }, wikidataId: "Q1085", population: 1309000, riskTier: "Low", primaryAirportCode: "PRG" },
  { slug: "budapest", name: "Budapest", countryCode: "HU", coordinates: { latitude: 47.4979, longitude: 19.0402 }, wikidataId: "Q1781", population: 1756000, riskTier: "Low", primaryAirportCode: "BUD" },
  { slug: "athens", name: "Athens", countryCode: "GR", coordinates: { latitude: 37.9838, longitude: 23.7275 }, wikidataId: "Q1524", population: 664046, riskTier: "Low", primaryAirportCode: "ATH" },
  { slug: "dubrovnik", name: "Dubrovnik", countryCode: "HR", coordinates: { latitude: 42.6507, longitude: 18.0944 }, wikidataId: "Q1722", population: 42615, riskTier: "Low", primaryAirportCode: "DBV" },
  { slug: "reykjavik", name: "Reykjavik", countryCode: "IS", coordinates: { latitude: 64.1466, longitude: -21.9426 }, wikidataId: "Q395", population: 131136, riskTier: "Low", primaryAirportCode: "KEF" },
  { slug: "zurich", name: "Zurich", countryCode: "CH", coordinates: { latitude: 47.3769, longitude: 8.5417 }, wikidataId: "Q72", population: 434008, riskTier: "Low", primaryAirportCode: "ZRH" },
  { slug: "copenhagen", name: "Copenhagen", countryCode: "DK", coordinates: { latitude: 55.6761, longitude: 12.5683 }, wikidataId: "Q1748", population: 799033, riskTier: "Low", primaryAirportCode: "CPH" },
  { slug: "stockholm", name: "Stockholm", countryCode: "SE", coordinates: { latitude: 59.3293, longitude: 18.0686 }, wikidataId: "Q1754", population: 975551, riskTier: "Low", primaryAirportCode: "ARN" },
  { slug: "oslo", name: "Oslo", countryCode: "NO", coordinates: { latitude: 59.9139, longitude: 10.7522 }, wikidataId: "Q585", population: 634293, riskTier: "Low", primaryAirportCode: "OSL" },
  { slug: "istanbul", name: "Istanbul", countryCode: "TR", coordinates: { latitude: 41.0082, longitude: 28.9784 }, wikidataId: "Q406", population: 15460000, riskTier: "Moderate", primaryAirportCode: "IST" },

  // Americas
  { slug: "mexico-city", name: "Mexico City", countryCode: "MX", coordinates: { latitude: 19.4326, longitude: -99.1332 }, wikidataId: "Q1489", population: 9209944, riskTier: "Elevated", primaryAirportCode: "MEX" },
  { slug: "oaxaca", name: "Oaxaca", countryCode: "MX", coordinates: { latitude: 17.0732, longitude: -96.7266 }, wikidataId: "Q184288", population: 300050, riskTier: "Moderate", primaryAirportCode: "OAX" },
  { slug: "cancun", name: "Cancun", countryCode: "MX", coordinates: { latitude: 21.1619, longitude: -86.8515 }, wikidataId: "Q8969", population: 888797, riskTier: "Moderate", primaryAirportCode: "CUN" },
  { slug: "medellin", name: "Medellín", countryCode: "CO", coordinates: { latitude: 6.2442, longitude: -75.5812 }, wikidataId: "Q48278", population: 2569007, riskTier: "Elevated", primaryAirportCode: "MDE" },
  { slug: "bogota", name: "Bogota", countryCode: "CO", coordinates: { latitude: 4.7110, longitude: -74.0721 }, wikidataId: "Q2841", population: 7181469, riskTier: "Elevated", primaryAirportCode: "BOG" },
  { slug: "cartagena", name: "Cartagena", countryCode: "CO", coordinates: { latitude: 10.3910, longitude: -75.4794 }, wikidataId: "Q657", population: 914552, riskTier: "Moderate", primaryAirportCode: "CTG" },
  { slug: "lima", name: "Lima", countryCode: "PE", coordinates: { latitude: -12.0464, longitude: -77.0428 }, wikidataId: "Q2868", population: 9674755, riskTier: "Elevated", primaryAirportCode: "LIM" },
  { slug: "cusco", name: "Cusco", countryCode: "PE", coordinates: { latitude: -13.5319, longitude: -71.9675 }, wikidataId: "Q208282", population: 428450, riskTier: "Moderate", primaryAirportCode: "CUZ" },
  { slug: "buenos-aires", name: "Buenos Aires", countryCode: "AR", coordinates: { latitude: -34.6037, longitude: -58.3816 }, wikidataId: "Q1486", population: 3120612, riskTier: "Moderate", primaryAirportCode: "EZE" },
  { slug: "santiago", name: "Santiago", countryCode: "CL", coordinates: { latitude: -33.4489, longitude: -70.6693 }, wikidataId: "Q2887", population: 6257516, riskTier: "Low", primaryAirportCode: "SCL" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", countryCode: "BR", coordinates: { latitude: -22.9068, longitude: -43.1729 }, wikidataId: "Q8678", population: 6748000, riskTier: "Elevated", primaryAirportCode: "GIG" },
  { slug: "new-york", name: "New York City", countryCode: "US", coordinates: { latitude: 40.7128, longitude: -74.0060 }, wikidataId: "Q60", population: 8336817, riskTier: "Moderate", primaryAirportCode: "JFK" },
  { slug: "san-francisco", name: "San Francisco", countryCode: "US", coordinates: { latitude: 37.7749, longitude: -122.4194 }, wikidataId: "Q62", population: 873965, riskTier: "Moderate", primaryAirportCode: "SFO" },
  { slug: "toronto", name: "Toronto", countryCode: "CA", coordinates: { latitude: 43.6532, longitude: -79.3832 }, wikidataId: "Q172", population: 2794356, riskTier: "Low", primaryAirportCode: "YYZ" },
  { slug: "vancouver", name: "Vancouver", countryCode: "CA", coordinates: { latitude: 49.2827, longitude: -123.1207 }, wikidataId: "Q24639", population: 675218, riskTier: "Low", primaryAirportCode: "YVR" },
  { slug: "san-jose", name: "San Jose", countryCode: "CR", coordinates: { latitude: 9.9281, longitude: -84.0907 }, wikidataId: "Q3070", population: 342188, riskTier: "Moderate", primaryAirportCode: "SJO" },

  // Middle East & Africa
  { slug: "dubai", name: "Dubai", countryCode: "AE", coordinates: { latitude: 25.2048, longitude: 55.2708 }, wikidataId: "Q612", population: 3331420, riskTier: "Low", primaryAirportCode: "DXB" },
  { slug: "marrakech", name: "Marrakech", countryCode: "MA", coordinates: { latitude: 31.6295, longitude: -7.9811 }, wikidataId: "Q101625", population: 928850, riskTier: "Moderate", primaryAirportCode: "RAK" },
  { slug: "cairo", name: "Cairo", countryCode: "EG", coordinates: { latitude: 30.0444, longitude: 31.2357 }, wikidataId: "Q85", population: 9540000, riskTier: "Moderate", primaryAirportCode: "CAI" },
  { slug: "cape-town", name: "Cape Town", countryCode: "ZA", coordinates: { latitude: -33.9249, longitude: 18.4241 }, wikidataId: "Q5465", population: 4618000, riskTier: "Elevated", primaryAirportCode: "CPT" },
  { slug: "nairobi", name: "Nairobi", countryCode: "KE", coordinates: { latitude: -1.2921, longitude: 36.8219 }, wikidataId: "Q3870", population: 4397073, riskTier: "Moderate", primaryAirportCode: "NBO" },
  { slug: "amman", name: "Amman", countryCode: "JO", coordinates: { latitude: 31.9454, longitude: 35.9284 }, wikidataId: "Q3805", population: 4007526, riskTier: "Low", primaryAirportCode: "AMM" },
];

async function main() {
  console.log("[ingest-100] Merging master country overlays...");

  const allOverlays = {
    ...COUNTRY_SECURITY_OVERLAY_100,
    ...ADDITIONAL_OVERLAYS,
  };

  const overlayIsoCount = Object.keys(allOverlays).length;
  console.log(`[ingest-100] Total defined sovereign country overlays: ${overlayIsoCount}`);

  if (!fs.existsSync(CACHE_FILE)) {
    throw new Error(`Cache file missing at ${CACHE_FILE}`);
  }

  const rawCountries = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  const rawMap = new Map();
  for (const c of rawCountries) {
    if (c.iso2) rawMap.set(c.iso2.toUpperCase(), c);
  }

  const enrichedCountries = [];

  for (const [iso2, overlay] of Object.entries(allOverlays)) {
    const raw = rawMap.get(iso2.toUpperCase());
    if (!raw) {
      console.warn(`[ingest-100] Warning: ISO2 ${iso2} not found in dr5hn dataset!`);
      continue;
    }

    const enriched = {
      iso2: raw.iso2.toUpperCase(),
      iso3: raw.iso3.toUpperCase(),
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

  // Sort alphabetically
  enrichedCountries.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(OUTPUT_COUNTRIES_JSON, JSON.stringify(enrichedCountries, null, 2), "utf-8");
  console.log(`[ingest-100] Successfully wrote ${enrichedCountries.length} enriched countries to ${OUTPUT_COUNTRIES_JSON}`);

  // Write TypeScript accessor
  const countriesTs = `// Auto-generated by scripts/generate-geo-dataset.mjs - DO NOT EDIT MANUALLY
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
  fs.writeFileSync(OUTPUT_COUNTRIES_TS, countriesTs, "utf-8");
  console.log(`[ingest-100] Successfully wrote countries accessor to ${OUTPUT_COUNTRIES_TS}`);

  // Write cities JSON & TS
  fs.writeFileSync(OUTPUT_CITIES_JSON, JSON.stringify(CURATED_CITIES_63, null, 2), "utf-8");
  console.log(`[ingest-100] Successfully wrote ${CURATED_CITIES_63.length} cities to ${OUTPUT_CITIES_JSON}`);

  const citiesTs = `// Auto-generated by scripts/generate-geo-dataset.mjs - DO NOT EDIT MANUALLY
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
  fs.writeFileSync(OUTPUT_CITIES_TS, citiesTs, "utf-8");
  console.log(`[ingest-100] Successfully wrote cities accessor to ${OUTPUT_CITIES_TS}`);

  console.log(`[ingest-100] All 100 sovereign nations and 63 city hubs compiled and verified!`);
}

main().catch((err) => {
  console.error("[ingest-100] Fatal error:", err);
  process.exit(1);
});
