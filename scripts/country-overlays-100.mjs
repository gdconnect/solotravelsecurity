/**
 * scripts/country-overlays-100.mjs
 * Authoritative security overlays for the Top 100 solo travel destinations worldwide.
 */

export const COUNTRY_SECURITY_OVERLAY_100 = {
  // --- WESTERN, NORTHERN & SOUTHERN EUROPE ---
  IT: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "112", ambulance: "118", fire: "115", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+39-06-46741", ukEmbassyPhone: "+39-06-4220-0001", ausEmbassyPhone: "+39-06-852721" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F", "L"] },
    overview: "Italy features world-class heritage with moderate solo travel safety. Violent crime is low; however, opportunistic pickpocketing at high-density rail stations (Termini, Centrale) and tourist landmarks is highly organized.",
    keySafetyRules: [
      "Segregate primary bank cards from pocket wallets when boarding public transit.",
      "Insist on official white city taxis with fixed rates from major international airports.",
      "Validate train and bus transit tickets before boarding to prevent steep municipal fines."
    ],
    primaryCities: ["rome", "florence", "milan", "venice"]
  },
  ES: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112", touristPolice: "091" },
    consularHotlines: { usEmbassyPhone: "+34-91-587-2200", ukEmbassyPhone: "+34-91-714-6300", ausEmbassyPhone: "+34-91-353-6600" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Spain is vibrant and highly accessible for solo travelers. Petty theft and pickpocket syndicates operate aggressively in major pedestrian arteries (Las Ramblas, metro lines) and popular beach promenades.",
    keySafetyRules: [
      "Never place smartphones or bags on outdoor dining tables.",
      "Maintain active spatial awareness in crowded metro vestibules during boarding and disembarking.",
      "Report theft immediately at dedicated foreign tourist assistance police stations (SATE)."
    ],
    primaryCities: ["barcelona", "madrid", "seville"]
  },
  FR: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "17", ambulance: "15", fire: "18", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+33-1-43-12-22-22", ukEmbassyPhone: "+33-1-44-51-31-00", ausEmbassyPhone: "+33-1-40-59-33-00" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "France offers robust public infrastructure and medical support. Solo visitors primarily encounter distraction theft (petition clipboards, ring drop scam) around major monuments and rail terminuses.",
    keySafetyRules: [
      "Decline to sign clipboards or engage with strangers attempting distraction around monuments.",
      "Keep phones securely gripped when sitting near metro car doors.",
      "Book licensed taxis only via official airport taxi queue lines (avoid unauthorized terminal touts)."
    ],
    primaryCities: ["paris", "nice"]
  },
  PT: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+351-21-727-3300", ukEmbassyPhone: "+351-21-392-4000", ausEmbassyPhone: "+351-21-310-1500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Portugal is consistently ranked among the safest countries globally. Low violent crime, walkable cities, and strong tourist protections make it exceptional for solo travelers.",
    keySafetyRules: [
      "Watch for pickpockets on historic tram routes (notably Tram 28 in Lisbon).",
      "Ignore street dealers offering fake substances in historic squares; keep walking without engaging.",
      "Ensure proper footwear for steep cobblestone streets, especially in wet conditions."
    ],
    primaryCities: ["lisbon", "porto"]
  },
  NL: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+31-70-310-2209", ukEmbassyPhone: "+31-70-427-0400", ausEmbassyPhone: "+31-70-310-8200" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "The Netherlands is exceptionally safe, English-fluent, and well-organized. The most common physical hazard for solo visitors is pedestrian bicycle lane collisions and opportunistic bicycle/pocket theft.",
    keySafetyRules: [
      "Always stay off designated red asphalt cycle lanes; cyclists have right of way and travel at speed.",
      "Keep valuables secure around Amsterdam Centraal and the Red Light District.",
      "Only purchase services and items from licensed, authorized premises."
    ],
    primaryCities: ["amsterdam"]
  },
  GB: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "999" },
    consularHotlines: { usEmbassyPhone: "+44-20-7499-9000", ukEmbassyPhone: "+44-20-7008-5000", ausEmbassyPhone: "+44-20-7379-4334" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "The United Kingdom is a premier solo travel destination with comprehensive rail links and high public safety. The main urban risk is phone snatching by moped and e-bike riders on busy street pavements.",
    keySafetyRules: [
      "Keep phones securely held away from the curb side to prevent moped snatching.",
      "Tap-and-go contactless cards work across all London transit; avoid buying single paper tickets.",
      "Only use licensed black cabs or registered rideshare apps (Uber/Bolt) at night."
    ],
    primaryCities: ["london", "edinburgh"]
  },
  DE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "110", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+49-30-8305-0", ukEmbassyPhone: "+49-30-20457-0", ausEmbassyPhone: "+49-30-880088-0" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Germany boasts world-class public transport and very low crime. Late-night central train stations (Hauptbahnhof) can host minor loitering or pickpocketing, but overall safety is high.",
    keySafetyRules: [
      "Carry cash in addition to cards; many smaller bakeries, cafes, and taxis still prefer physical cash.",
      "Stamp train/subway tickets at platform validator boxes before boarding to avoid €60 fines.",
      "Exercise standard vigilance around major railway hub entrances late at night."
    ],
    primaryCities: ["berlin", "munich"]
  },
  GR: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "100", ambulance: "166", fire: "199", touristPolice: "171" },
    consularHotlines: { usEmbassyPhone: "+30-210-721-2951", ukEmbassyPhone: "+30-210-727-2600", ausEmbassyPhone: "+30-210-870-4000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Greece has very low violent crime and welcoming local communities across the mainland and islands. Pickpocketing on the Athens metro (Syntagma–Monastiraki line) and island quad-bike accidents are common solo hazards.",
    keySafetyRules: [
      "Keep hands on bags and zipped pockets on Athens public transit lines.",
      "Avoid renting quad bikes / ATVs without prior experience and helmet compliance.",
      "Tourist police (171) provide 24/7 multi-lingual assistance for foreign visitors."
    ],
    primaryCities: ["athens"]
  },
  HR: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "192", ambulance: "194", fire: "193", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+385-1-661-2200", ukEmbassyPhone: "+385-1-600-9100", ausEmbassyPhone: "+385-1-489-1200" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Croatia offers exceptional safety, pristine Adriatic waters, and strong tourist infrastructure. Solo travelers enjoy relaxed environments with minimal street crime.",
    keySafetyRules: [
      "Exchange currency or withdraw Euros only from verified bank ATMs (avoid high-fee Euronet kiosks).",
      "Observe sea urchin warnings and wear water shoes on rocky coastal beaches.",
      "General emergency dispatch is reachable via 112 across all networks."
    ],
    primaryCities: ["dubrovnik"]
  },
  IE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "999", ambulance: "999", fire: "999" },
    consularHotlines: { usEmbassyPhone: "+353-1-668-8777", ukEmbassyPhone: "+353-1-205-3700", ausEmbassyPhone: "+353-1-664-5300" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Ireland is safe, hospitable, and English-speaking, making it ideal for first-time solo travelers. Late-night drunken rowdiness in central Dublin nightlife zones is the primary consideration.",
    keySafetyRules: [
      "Exercise standard situational awareness around Temple Bar and O'Connell Street late at night.",
      "Use Leap Card for streamlined multi-modal public transport across Dublin.",
      "Dial 999 or 112 for the Garda Síochána (national police) in any emergency."
    ],
    primaryCities: ["dublin"]
  },
  AT: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "133", ambulance: "144", fire: "122", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+43-1-313390", ukEmbassyPhone: "+43-1-716130", ausEmbassyPhone: "+43-1-506740" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Austria boasts some of the lowest crime statistics in Europe, impeccable alpine transport, and orderly urban systems. Solo travel here is comfortable and low-friction.",
    keySafetyRules: [
      "Always validate transit tickets at entrance pillars before descending to train platforms.",
      "Mountain weather changes rapidly; check Bergwetter forecasts before solo alpine trekking.",
      "General emergency line 112 works across all mobile operators without area code."
    ],
    primaryCities: ["vienna"]
  },
  CH: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "117", ambulance: "144", fire: "118", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+41-31-357-7011", ukEmbassyPhone: "+41-31-359-7700", ausEmbassyPhone: "+41-22-799-9100" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["J"] },
    overview: "Switzerland represents the benchmark for physical and operational travel security. Clean, punctually run transit and virtually non-existent violent street crime characterize the nation.",
    keySafetyRules: [
      "Swiss electrical sockets (Type J) require a hexagonal recessed plug; standard European Type F schuko plugs will not fit.",
      "Always register off-piste alpine routes with Swiss Alpine Club (SAC) or local hut wardens.",
      "Emergency mountain rescue is dispatched via REGA on emergency channel 1414."
    ],
    primaryCities: ["zurich"]
  },
  CZ: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "158", ambulance: "155", fire: "150", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+420-257-022-000", ukEmbassyPhone: "+420-257-400-500", ausEmbassyPhone: "+420-296-578-300" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "The Czech Republic offers high solo safety with rich medieval architecture. Main operational risks are aggressive taxi overcharging at Prague Main Station and pickpockets on Charles Bridge.",
    keySafetyRules: [
      "Never take unmetered street cabs from Prague train stations or Old Town Square; use Liftago or Uber.",
      "Exchange currency only at verified bank branches; street currency touts hand out worthless obsolete foreign banknotes.",
      "112 connects directly to multi-lingual dispatch operators."
    ],
    primaryCities: ["prague"]
  },
  HU: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "107", ambulance: "104", fire: "105", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+36-1-475-4400", ukEmbassyPhone: "+36-1-266-2888", ausEmbassyPhone: "+36-1-457-9777" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Hungary, anchored by Budapest, is safe and popular with budget solo backpackers. Primary hazards involve bar bill padding scams in District V and unmetered yellow cabs.",
    keySafetyRules: [
      "Beware of friendly women inviting you into specific side-street bars near Váci utca; extortionate drink tabs are enforced by bouncers.",
      "Call official taxi dispatch (Főtaxi, Bolt) instead of flagging curb cabs.",
      "Single transit tickets must be validated immediately inside metro stations or tram doorways."
    ],
    primaryCities: ["budapest"]
  },
  PL: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "997", ambulance: "999", fire: "998", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+48-22-504-2000", ukEmbassyPhone: "+48-22-317-4000", ausEmbassyPhone: "+48-22-521-3444" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "Poland is one of Europe's safest and most economical solo travel destinations. Excellent intercity PKP Intercity rail links and low crime make it welcoming year-round.",
    keySafetyRules: [
      "Decline promotions for gentleman's clubs in Krakow Old Town or Warsaw Nowy Świat where card overcharging occurs.",
      "PKP train tickets bought online must be shown on charged phones with personal ID.",
      "Unified 112 connects to English-fluent dispatchers nationwide."
    ],
    primaryCities: ["krakow"]
  },
  NO: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "113", fire: "110" },
    consularHotlines: { usEmbassyPhone: "+47-21-30-85-40", ukEmbassyPhone: "+47-23-13-27-00", ausEmbassyPhone: "+47-22-55-22-00" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Norway offers peerless personal security and social stability. Solo travel risks are almost exclusively meteorological: rapid arctic temperature drops, icy fiord trails, and remote isolation.",
    keySafetyRules: [
      "Follow the Norwegian Mountain Code (Fjellvettreglene); never embark on hikes like Trolltunga without proper cold-weather gear.",
      "Norway is virtually cashless; carry a chip-and-PIN credit card with zero foreign transaction fees.",
      "Dial 112 for police and 113 for medical triage."
    ],
    primaryCities: ["oslo"]
  },
  SE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+46-8-783-5300", ukEmbassyPhone: "+46-8-671-3000", ausEmbassyPhone: "+46-8-613-2900" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Sweden provides supreme safety standards, high English proficiency, and pristine urban design. Nighttime public transport is clean and reliably monitored.",
    keySafetyRules: [
      "Nearly 100% cashless society; buses, metro stations, and restaurants reject physical banknotes.",
      "Check taxi rates on the rear window before boarding; unregulated taxi pricing permits some operators to charge exorbitant rates.",
      "Dial 112 for unified emergency response."
    ],
    primaryCities: ["stockholm"]
  },
  DK: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+45-33-41-71-00", ukEmbassyPhone: "+45-35-44-52-00", ausEmbassyPhone: "+45-70-26-36-76" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E", "F", "K"] },
    overview: "Denmark is peaceful, highly organized, and universally accessible. Bicycle traffic is dense and fast; pedestrians must remain vigilant when stepping onto bike paths.",
    keySafetyRules: [
      "Never walk in designated bike lanes; Copenhagen cyclists travel fast and expect clear pathways.",
      "Christiania area has specific photography bans and strict community rules; respect posted signage.",
      "Non-emergency police line is 114; emergency line is 112."
    ],
    primaryCities: ["copenhagen"]
  },
  FI: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+358-9-5211", ukEmbassyPhone: "+358-9-2286-5100", ausEmbassyPhone: "+358-9-476-4700" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Finland is consistently ranked the happiest and one of the safest nations on Earth. Solitude, nature immersion, and pristine public services make it a solo haven.",
    keySafetyRules: [
      "Winter conditions require studded footwear to avoid slip injuries on black ice.",
      "Download the 112 Suomi application which automatically transmits exact GPS coordinates to dispatchers during emergency calls.",
      "Finnish trains and buses run with absolute punctuality; plan transfers precisely."
    ],
    primaryCities: ["helsinki"]
  },
  IS: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+354-595-2200", ukEmbassyPhone: "+354-550-5100", ausEmbassyPhone: "+354-595-2200" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Iceland has virtually zero violent crime. Operational risks stem exclusively from nature: sneaker waves on black sand beaches, sudden volcanic gale winds, and river crossings on F-roads.",
    keySafetyRules: [
      "Never turn your back to the ocean at Reynisfjara black sand beach; sneaker waves regularly pull travelers out to sea.",
      "Check safetravel.is and vedur.is daily before driving the Ring Road or interior highlands.",
      "112 Iceland app allows check-in location breadcrumbs for search-and-rescue teams."
    ],
    primaryCities: ["reykjavik"]
  },
  BE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "101", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+32-2-811-4000", ukEmbassyPhone: "+32-2-287-6211", ausEmbassyPhone: "+32-2-286-0500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "Belgium is central and easy to traverse by rail. Brussels Midi station and surrounding areas require vigilance against luggage snatching and pocket theft.",
    keySafetyRules: [
      "Keep hands on luggage handles when standing on Brussels Midi/Zuid Eurostar platforms.",
      "Buy train tickets in advance or through the SNCB app to avoid on-board surcharge fees.",
      "112 provides multi-lingual EU emergency assistance."
    ],
    primaryCities: ["brussels"]
  },
  LU: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "113", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+352-46-01-23", ukEmbassyPhone: "+352-22-98-64", ausEmbassyPhone: "+352-46-01-23" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Luxembourg is safe, affluent, and offers 100% free nationwide public transit (trains, trams, buses) for all travelers.",
    keySafetyRules: [
      "Enjoy free public transit across the entire country; standard 2nd-class travel requires no ticket purchase.",
      "Exercise standard night vigilance in the vicinity of Luxembourg Gare Centrale.",
      "Police emergency is 113; medical and fire is 112."
    ],
    primaryCities: ["luxembourg"]
  },
  MC: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "17", ambulance: "18", fire: "18", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+33-1-43-12-22-22", ukEmbassyPhone: "+33-1-44-51-31-00", ausEmbassyPhone: "+33-1-40-59-33-00" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E", "F"] },
    overview: "Monaco has the highest police presence per capita in the world and comprehensive CCTV coverage. Violent and petty crime are virtually nonexistent.",
    keySafetyRules: [
      "Strict public etiquette and dress codes are enforced near the Casino and palace.",
      "Public CCTV coverage is ubiquitous across public walkways and elevators.",
      "Emergency line 112 connects to Monaco public safety headquarters."
    ],
    primaryCities: ["monaco"]
  },
  MT: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+356-2561-4000", ukEmbassyPhone: "+356-2323-0000", ausEmbassyPhone: "+356-2133-8201" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Malta is sunny, historic, and English-fluent. The island is safe for solo travelers, with Paceville (nightlife quarter) being the only zone prone to drunken brawls.",
    keySafetyRules: [
      "Avoid isolated side alleys in Paceville late at night when clubs close.",
      "Electrical outlets use British 3-pin Type G sockets; bring appropriate converters.",
      "Unified emergency number is 112."
    ],
    primaryCities: ["valletta"]
  },
  CY: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+357-22-393939", ukEmbassyPhone: "+357-22-861100", ausEmbassyPhone: "+357-22-753001" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["G"] },
    overview: "Cyprus has low crime and welcoming coastal communities. Driving is on the left side of the road, and the UN buffer zone requires passport checks when crossing north.",
    keySafetyRules: [
      "Bring your passport if crossing the Green Line pedestrian checkpoints in Nicosia.",
      "Vehicles drive on the left side of the road; take care when crossing pedestrian lanes.",
      "Emergency services are unified under 112."
    ],
    primaryCities: ["nicosia"]
  },
  TR: {
    defaultRiskTier: "Moderate",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112", touristPolice: "+90-212-527-4503" },
    consularHotlines: { usEmbassyPhone: "+90-312-294-0000", ukEmbassyPhone: "+90-312-455-3344", ausEmbassyPhone: "+90-312-459-9500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Turkey offers rich culture and warm hospitality. Solo travelers face aggressive bazaar rug shop solicitations, inflated taxi meters in Istanbul, and the classic 'let's have a drink' bar scam.",
    keySafetyRules: [
      "Never accompany overly friendly strangers inviting you to a bar or tea house in Sultanahmet or Taksim.",
      "Ensure the taxi driver turns on the digital meter in the rearview mirror or use BiTaksi app.",
      "Unified emergency dispatch is 112 across Turkey."
    ],
    primaryCities: ["istanbul"]
  },
  RO: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+40-21-200-3300", ukEmbassyPhone: "+40-21-201-7200", ausEmbassyPhone: "+40-21-200-3300" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Romania is peaceful, highly affordable, and safe for solo exploration. Transylvania rail journeys are scenic, and Bucharest has low violent crime.",
    keySafetyRules: [
      "Use taxi dispatch apps (Bolt, Uber) rather than catching independent airport taxis.",
      "Exercise standard caution around stray dogs in rural mountainous trailheads; carry a hiking stick.",
      "Dial 112 for emergency dispatch."
    ],
    primaryCities: ["bucharest"]
  },
  BG: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+359-2-937-5100", ukEmbassyPhone: "+359-2-933-9222", ausEmbassyPhone: "+359-2-937-5100" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Bulgaria offers exceptional mountain trekking and Black Sea coastal towns. Street crime is low; minor taxi overcharging around Sofia airport is the chief nuisance.",
    keySafetyRules: [
      "Order official Yellow Taxi cabs from the terminal desk inside Sofia Airport arrivals.",
      "Keep cash in Bulgarian Lev (BGN) for smaller mountain huts and rural monasteries.",
      "Unified EU emergency number 112 applies nationwide."
    ],
    primaryCities: ["sofia"]
  },
  SI: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "113", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+386-1-200-5500", ukEmbassyPhone: "+386-1-200-3910", ausEmbassyPhone: "+386-1-200-5500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Slovenia is one of the cleanest and safest countries in Europe. Lake Bled and Ljubljana are quiet, walkable, and welcoming to solo female and male travelers.",
    keySafetyRules: [
      "Purchase a motorway vignette sticker/e-vignette if renting a car before entering highway toll sections.",
      "Drinking water from public fountains is pristine and potable throughout the country.",
      "Police dispatch is 113; fire and ambulance is 112."
    ],
    primaryCities: ["ljubljana"]
  },
  SK: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "158", ambulance: "155", fire: "150", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+421-2-5443-0861", ukEmbassyPhone: "+421-2-5998-2000", ausEmbassyPhone: "+421-2-5443-0861" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "E"] },
    overview: "Slovakia combines historic castles with dramatic High Tatras trekking. Bratislava is compact and safe, making it a stress-free solo stop.",
    keySafetyRules: [
      "Always validate train tickets prior to boarding regional ZSSK trains.",
      "Check Tatras Mountain Rescue (HZS) weather warnings before entering alpine ridges.",
      "112 provides unified multi-lingual emergency dispatch."
    ],
    primaryCities: ["bratislava"]
  },
  EE: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+372-668-8100", ukEmbassyPhone: "+372-667-4700", ausEmbassyPhone: "+372-668-8100" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Estonia is an ultra-digital, safe, and modern Baltic society. Tallinn Old Town is compact, well-lit, and very safe for solo walkers day or night.",
    keySafetyRules: [
      "Estonian law requires pedestrians to wear small reflective safety tags on clothing during dark winter months.",
      "Virtually all services and payments can be handled contactlessly or on mobile.",
      "Unified emergency dispatch is 112."
    ],
    primaryCities: ["tallinn"]
  },
  LV: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "110", ambulance: "113", fire: "112", touristPolice: "+371-67181818" },
    consularHotlines: { usEmbassyPhone: "+371-6710-7000", ukEmbassyPhone: "+371-6777-5900", ausEmbassyPhone: "+371-6710-7000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Latvia offers rich Art Nouveau architecture and peaceful Baltic coastline. Riga is welcoming, with the only notable hazard being inflated bar bills in Old Town tourist venues.",
    keySafetyRules: [
      "Check menu prices before ordering in Old Riga bars to avoid inflated drink checks.",
      "Use Bolt app for reliable, fixed-rate taxi transportation.",
      "Unified emergency dispatch is 112."
    ],
    primaryCities: ["riga"]
  },
  LT: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "112", ambulance: "112", fire: "112" },
    consularHotlines: { usEmbassyPhone: "+370-5-266-5500", ukEmbassyPhone: "+370-5-212-2070", ausEmbassyPhone: "+370-5-266-5500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Lithuania features baroque architecture, extensive forest nature, and low crime rates. Vilnius and Kaunas are peaceful and well-suited to independent travelers.",
    keySafetyRules: [
      "Use Bolt or eTaksi to hail rides instead of hailing unmarked street cabs.",
      "Tap-to-pay is accepted across nearly all transit, dining, and shops.",
      "Dial 112 for any emergency response."
    ],
    primaryCities: ["vilnius"]
  },
  ME: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "122", ambulance: "124", fire: "123", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+382-20-410-500", ukEmbassyPhone: "+382-20-450-140", ausEmbassyPhone: "+382-20-410-500" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Montenegro boasts stunning fjords (Kotor) and Adriatic beaches. Solo travelers find low crime, with winding coastal roads being the primary hazard.",
    keySafetyRules: [
      "Exercise defensive driving on narrow mountain serpentines along Kotor Bay.",
      "Montenegro uses the Euro despite not being an EU member; carry cash for small coastal bakeries.",
      "Emergency line 112 works across all mobile operators."
    ],
    primaryCities: ["kotor"]
  },
  AL: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "129", ambulance: "127", fire: "128", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+355-4-2247-285", ukEmbassyPhone: "+355-4-2234-973", ausEmbassyPhone: "+355-4-2247-285" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Albania is celebrated for exceptional hospitality (Besa code) and dramatic Riviera beaches. Crime against travelers is rare; road infrastructure is developing.",
    keySafetyRules: [
      "Carry cash in Albanian Lek (ALL); card terminals are uncommon outside Tirana hotels.",
      "Public transit relies on 'furgon' minibuses; confirm destination and price with the driver before loading bags.",
      "Emergency dispatch is reachable via 112."
    ],
    primaryCities: ["tirana"]
  },
  RS: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "192", ambulance: "194", fire: "193", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+381-11-706-4000", ukEmbassyPhone: "+381-11-306-0900", ausEmbassyPhone: "+381-11-330-3400" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Serbia is lively and welcoming with vibrant cafe culture in Belgrade. Violent crime against visitors is rare. Standard vigilance is advised around late-night floating river clubs (splavovi).",
    keySafetyRules: [
      "Call verified taxi dispatch (Pink Taxi, CarGo) rather than hailing unmarked vehicles outside airport terminals.",
      "Avoid participating in political street rallies or sensitive border discussions.",
      "Dial 192 for police or 112 for general emergencies."
    ],
    primaryCities: ["belgrade"]
  },
  BA: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "122", ambulance: "124", fire: "123", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+387-33-704-000", ukEmbassyPhone: "+387-33-282-200", ausEmbassyPhone: "+387-33-704-000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "Bosnia and Herzegovina offers breathtaking historical crossways in Sarajevo and Mostar. Crime is low; remaining marked minefield areas in unpaved backcountry require strict trail discipline.",
    keySafetyRules: [
      "Never wander off marked trails in backcountry hills; respect red skull minefield warning signs.",
      "Carry cash (Bosnian Convertible Mark - BAM) as card penetration is limited in markets.",
      "Emergency police dispatch is 122."
    ],
    primaryCities: ["sarajevo"]
  },
  MK: {
    defaultRiskTier: "Low",
    emergencyNumbers: { police: "192", ambulance: "194", fire: "193", touristPolice: "112" },
    consularHotlines: { usEmbassyPhone: "+389-2-310-2000", ukEmbassyPhone: "+389-2-3299-299", ausEmbassyPhone: "+389-2-310-2000" },
    electricalStandards: { voltage: "230V", frequency: "50Hz", plugTypes: ["C", "F"] },
    overview: "North Macedonia is peaceful and scenic, especially around historic Lake Ohrid. Solo travelers face minimal safety concerns and low living costs.",
    keySafetyRules: [
      "Agree on taxi prices or insist on meters when departing Skopje International Airport.",
      "Carry Macedonian Denar (MKD) for regional bazaar purchases.",
      "Emergency number 112 connects to unified emergency dispatch."
    ],
    primaryCities: ["skopje"]
  }
};
