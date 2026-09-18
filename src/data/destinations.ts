export interface DestinationSecurityProfile {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  riskTier: "Low" | "Moderate" | "Elevated" | "High";
  primaryLanguage: string;
  emergencyNumbers: {
    generalOrPolice: string;
    ambulance: string;
    touristPolice?: string;
  };
  arrivalAirports: {
    code: string;
    name: string;
    dayTransitRecommendation: string;
    nightTransitRecommendation: string;
    transitWarning: string;
    cashAtmStrategy: string;
  }[];
  safeNeighborhoods: string[];
  cautionNeighborhoods: string[];
  topScams: {
    id: string;
    name: string;
    triggerPhrase: string;
    mechanic: string;
    counterAction: string;
  }[];
  safetyPhrases: {
    english: string;
    local: string;
    phonetic: string;
  }[];
}

export const TOP_SOLO_DESTINATIONS: DestinationSecurityProfile[] = [
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    riskTier: "Low",
    primaryLanguage: "Japanese",
    emergencyNumbers: {
      generalOrPolice: "110",
      ambulance: "119",
    },
    arrivalAirports: [
      {
        code: "HND",
        name: "Haneda Airport",
        dayTransitRecommendation:
          "Tokyo Monorail or Keikyu Airport Line straight into the Yamanote loop.",
        nightTransitRecommendation:
          "Late night buses run to major stations until 02:00, or flat-fare licensed airport taxi.",
        transitWarning:
          "Very low street crime. Main vulnerability is missing the last midnight train and paying high taxi fares.",
        cashAtmStrategy:
          "Use 7-Bank or Japan Post ATMs inside terminal; foreign Visa/Mastercard work seamlessly.",
      },
      {
        code: "NRT",
        name: "Narita Airport",
        dayTransitRecommendation:
          "Narita Express (N'EX) to Shinjuku/Tokyo Station or Keisei Skyliner to Ueno.",
        nightTransitRecommendation:
          "Low-Cost Bus (TYO-NRT) to Tokyo Station, or pre-booked hotel transit.",
        transitWarning:
          "Narita is 60km outside Tokyo; a metered taxi without flat rate can exceed $250 USD.",
        cashAtmStrategy: "7-Eleven 7-Bank ATMs in arrivals hall before exiting ticket gates.",
      },
    ],
    safeNeighborhoods: ["Shinjuku (West)", "Shibuya", "Asakusa", "Ginza", "Ueno"],
    cautionNeighborhoods: [
      "Kabukicho (Roentgen touts/bar overcharging)",
      "Roppongi (touting clubs)",
    ],
    topScams: [
      {
        id: "tokyo-bar-touting",
        name: "Kabukicho Bar Touting & Drink Spiking",
        triggerPhrase: "'Hey man, looking for cute girls? No cover charge, cheap drinks.'",
        mechanic:
          "Friendly touts on street corners guide solo travelers to basement bars; drinks are spiked or credit card is charged thousands of dollars under duress.",
        counterAction:
          "Absolute zero-tolerance rule: never enter any establishment suggested by an aggressive street tout.",
      },
    ],
    safetyPhrases: [
      {
        english: "Please call the police",
        local: "警察を呼んでください",
        phonetic: "Keisatsu o yonde kudasai",
      },
      {
        english: "Please turn on the meter",
        local: "メーターをつけてください",
        phonetic: "Meetaa o tsukete kudasai",
      },
      { english: "No, thank you", local: "いいえ、結構です", phonetic: "Iie, kekkou desu" },
      {
        english: "Where is the police box?",
        local: "交番はどこですか？",
        phonetic: "Kouban wa doko desu ka?",
      },
    ],
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    riskTier: "Moderate",
    primaryLanguage: "Thai",
    emergencyNumbers: {
      generalOrPolice: "191",
      ambulance: "1669",
      touristPolice: "1155",
    },
    arrivalAirports: [
      {
        code: "BKK",
        name: "Suvarnabhumi Airport",
        dayTransitRecommendation:
          "Airport Rail Link (ARL) to Phaya Thai station, then connect to BTS Skytrain.",
        nightTransitRecommendation:
          "Public Taxi Desk on Level 1. Press touch-screen kiosk for printed queue slip.",
        transitWarning:
          "Never accept rides from touts in arrivals lobby. Keep your taxi queue ticket—do not hand it to the driver.",
        cashAtmStrategy:
          "Basement level (near Airport Rail Link) has SuperRich currency booths with best exchange rates.",
      },
    ],
    safeNeighborhoods: ["Sukhumvit (Asok / Phrom Phong)", "Siam", "Ari", "Silom"],
    cautionNeighborhoods: [
      "Patpong night market",
      "Khao San Road late at night",
      "Nana Plaza perimeter",
    ],
    topScams: [
      {
        id: "bkk-grand-palace-closed",
        name: "Grand Palace Is Closed Scam",
        triggerPhrase:
          "'Grand Palace closed today for royal ceremony. I take you to Lucky Buddha in tuk-tuk for 50 baht.'",
        mechanic:
          "Friendly local or driver diverts traveler to gem shops or tailor shops where high-pressure sales occur.",
        counterAction:
          "Ignore touts completely. Walk directly to the official ticket gate to verify opening hours.",
      },
      {
        id: "bkk-unmetered-taxi",
        name: "Broken Taxi Meter Bluff",
        triggerPhrase: "'Meter broken, heavy traffic, 500 baht flat rate.'",
        mechanic: "Drivers refuse to switch on the meter to charge 3x to 5x the actual fare.",
        counterAction:
          "Firmly say 'Meter please'. If driver refuses, step out immediately before the vehicle departs.",
      },
    ],
    safetyPhrases: [
      {
        english: "Please turn on the meter",
        local: "กรุณาเปิดมิเตอร์ด้วยครับ/ค่ะ",
        phonetic: "Ka-roo-nah bperd mee-ter doo-ay",
      },
      { english: "Tourist Police", local: "ตำรวจท่องเที่ยว", phonetic: "Dtam-ruat tong-tiao" },
      {
        english: "No need, thank you",
        local: "ไม่เป็นไร ขอบคุณครับ/ค่ะ",
        phonetic: "Mai pen rai, khop khun",
      },
      { english: "Stop here please", local: "จอดที่นี่ครับ/ค่ะ", phonetic: "Jort tee-nee krub/ka" },
    ],
  },
  {
    slug: "rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    riskTier: "Moderate",
    primaryLanguage: "Italian",
    emergencyNumbers: {
      generalOrPolice: "112",
      ambulance: "118",
    },
    arrivalAirports: [
      {
        code: "FCO",
        name: "Rome Fiumicino",
        dayTransitRecommendation:
          "Leonardo Express non-stop train directly into Roma Termini (32 minutes).",
        nightTransitRecommendation:
          "Official city white taxi from outside arrivals queue (€55 fixed flat fare within Aurelian walls).",
        transitWarning:
          "Beware illegal drivers inside arrivals hall chanting 'Taxi? Taxi?'. Only use official white cabs at the marked curb.",
        cashAtmStrategy:
          "Use official bank ATMs inside the terminal. Avoid Euronet standalone yellow/blue cash machines.",
      },
    ],
    safeNeighborhoods: ["Trastevere", "Prati / Vatican", "Monti", "Piazza Navona perimeter"],
    cautionNeighborhoods: [
      "Termini Station surroundings after 22:00",
      "Esquilino perimeter late night",
    ],
    topScams: [
      {
        id: "rome-gladiator-photo",
        name: "Aggressive Centurion Photo Extortion",
        triggerPhrase: "'Come, take picture together, welcome to Rome!'",
        mechanic:
          "Costumed performers near Colosseum pose for photo then aggressively intimidate tourist for €20–€50.",
        counterAction:
          "Keep walking. Do not hand your phone to them; shake head with no eye contact.",
      },
      {
        id: "rome-metro-pickpocket",
        name: "Termini Metro Doorway Jam",
        triggerPhrase: "'Scusa, scusa!' (pushing or dropping tickets at doorway)",
        mechanic:
          "Coordinated groups crowd the train door as you enter, picking pockets during simulated commotion.",
        counterAction:
          "Position back against the wall, hand over zipped pocket, let crowds clear before boarding.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "Aiuto!", phonetic: "Ah-yoo-toe!" },
      {
        english: "Please turn on the meter",
        local: "Accenda il tassametro, per favore",
        phonetic: "Ah-chen-dah eel tahs-sah-meh-tro pehr fah-voh-ray",
      },
      {
        english: "Leave me alone",
        local: "Mi lasci in pace",
        phonetic: "Mee lah-shee een pah-cheh",
      },
      {
        english: "Where is the police station?",
        local: "Dov'è la stazione di polizia?",
        phonetic: "Doh-veh lah stah-tzyoh-neh dee poh-leet-see-ah?",
      },
    ],
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    riskTier: "Moderate",
    primaryLanguage: "Spanish / Catalan",
    emergencyNumbers: {
      generalOrPolice: "112",
      ambulance: "061",
    },
    arrivalAirports: [
      {
        code: "BCN",
        name: "Barcelona-El Prat",
        dayTransitRecommendation: "Aerobús (A1/A2) directly to Plaça de Catalunya, or Metro L9S.",
        nightTransitRecommendation:
          "Official black-and-yellow taxi from outside terminal rank, or NitBus (N17/N18).",
        transitWarning:
          "High pickpocket activity at Plaça de Catalunya and Sants station. Keep bags in front immediately on arrival.",
        cashAtmStrategy: "CaixaBank or Santander ATMs inside the airport terminal.",
      },
    ],
    safeNeighborhoods: ["Eixample (Dreta and Esquerra)", "Gràcia", "Poblenou"],
    cautionNeighborhoods: [
      "El Raval (narrow southern alleys at night)",
      "La Rambla (distraction teams)",
      "Barceloneta beach after midnight",
    ],
    topScams: [
      {
        id: "bcn-bird-poop",
        name: "The Bird Dropping / Liquid Spill Trick",
        triggerPhrase: "'Oh look, you have bird mess on your shoulder, let me help wipe it!'",
        mechanic:
          "Accomplice squirts white liquid or mustard on tourist; a stranger wipes it while removing wallet/phone.",
        counterAction:
          "Step back 2 meters immediately, shout 'No!', do not stop walking, clean it yourself inside a store.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "¡Ayuda!", phonetic: "Ah-yoo-dah!" },
      { english: "Police!", local: "¡Policía!", phonetic: "Poh-lee-thee-ah!" },
      {
        english: "No, leave me alone",
        local: "No, déjame en paz",
        phonetic: "No, deh-hah-meh ehn pahth",
      },
      {
        english: "Turn on the meter please",
        local: "Ponga el taxímetro, por favor",
        phonetic: "Pohn-gah ehl tahk-see-meh-troh pohr fah-vohr",
      },
    ],
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    riskTier: "Moderate",
    primaryLanguage: "French",
    emergencyNumbers: {
      generalOrPolice: "17",
      ambulance: "15",
      touristPolice: "112",
    },
    arrivalAirports: [
      {
        code: "CDG",
        name: "Charles de Gaulle",
        dayTransitRecommendation:
          "RER B train to Gare du Nord / Châtelet-Les Halles (approx 35 min).",
        nightTransitRecommendation:
          "Official taxi line outside terminal (€56 flat fare to Right Bank, €65 to Left Bank).",
        transitWarning:
          "Beware fake ticket sellers at CDG RER automated machines offering to 'help' buy tickets.",
        cashAtmStrategy: "BNP Paribas or HSBC ATMs located airside/landside inside CDG.",
      },
    ],
    safeNeighborhoods: [
      "Le Marais (3rd/4th)",
      "Saint-Germain (6th)",
      "Latin Quarter (5th)",
      "Passy (16th)",
    ],
    cautionNeighborhoods: [
      "Gare du Nord surroundings late night",
      "Stalingrad / Porte de la Chapelle",
      "Châtelet metro corridors at 1 AM",
    ],
    topScams: [
      {
        id: "paris-gold-ring",
        name: "The Found Gold Ring",
        triggerPhrase: "'Excuse me, did you drop this gold ring on the sidewalk?'",
        mechanic:
          "Con artist picks up brass ring in front of you, claims it's real gold, tries to sell it or asks for finder's cash.",
        counterAction:
          "Say firmly 'Ce n'est pas à moi' (It's not mine) and walk on without breaking stride.",
      },
      {
        id: "paris-petition-clipboard",
        name: "Deaf Charity Petition Distraction",
        triggerPhrase: "'Do you speak English? Sign for deaf children charity?'",
        mechanic:
          "Clipboards are held up to block your line of sight while hands pick your pockets or bags underneath.",
        counterAction:
          "Make clear 'No' hand gesture, maintain 2-meter buffer, do not touch clipboard.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "Au secours !", phonetic: "Oh seh-coor!" },
      { english: "Call the police", local: "Appelez la police", phonetic: "Ah-play lah poh-lees" },
      {
        english: "Leave me alone",
        local: "Laissez-moi tranquille",
        phonetic: "Leh-say mwah trahn-keel",
      },
      {
        english: "Please turn on the meter",
        local: "Mettez le compteur s'il vous plaît",
        phonetic: "Meh-tay luh cohn-tuhr seel voo pleh",
      },
    ],
  },
  {
    slug: "bali",
    name: "Bali (Denpasar / Ubud / Canggu)",
    country: "Indonesia",
    countryCode: "ID",
    riskTier: "Moderate",
    primaryLanguage: "Indonesian / Balinese",
    emergencyNumbers: {
      generalOrPolice: "110",
      ambulance: "118",
      touristPolice: "+62 361 754590",
    },
    arrivalAirports: [
      {
        code: "DPS",
        name: "Ngurah Rai International Airport",
        dayTransitRecommendation:
          "Pre-arranged hotel driver or official Grab lounge pick-up station inside parking building.",
        nightTransitRecommendation:
          "Official prepaid taxi counter inside terminal or pre-booked transfer.",
        transitWarning:
          "Aggressive freelance drivers crowd international exit yelling 'Taxi Boss!'. Walk straight through to the Grab Lounge.",
        cashAtmStrategy:
          "Bank Mandiri or BCA ATMs inside terminal building before external exit doors.",
      },
    ],
    safeNeighborhoods: ["Sanur", "Ubud (center)", "Seminyak", "Canggu"],
    cautionNeighborhoods: [
      "Kuta nightlife strip after 01:00",
      "Dark rural roads on scooters at night",
    ],
    topScams: [
      {
        id: "bali-money-changer",
        name: "Unlicensed Money Changer Sleight-of-Hand",
        triggerPhrase: "'Authorized Money Changer - Zero Commission - 5% Higher Rate'",
        mechanic: "Teller drops bills behind counter or folds bills double while counting rapidly.",
        counterAction: "Only use licensed banks with glass cubicles, or use ATMs.",
      },
      {
        id: "bali-bag-snatch-scooter",
        name: "Drive-by Scooter Bag Snatching",
        triggerPhrase: "(Silent approach from rear)",
        mechanic:
          "Scooter pillion passenger snatches phone from your hand or cross-body bag while walking roadside.",
        counterAction:
          "Never hold phone on roadside hand; walk facing oncoming traffic; stow bags under scooter seat.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "Tolong!", phonetic: "Toh-long!" },
      { english: "Police", local: "Polisi", phonetic: "Poh-lee-see" },
      {
        english: "No thank you",
        local: "Tidak, terima kasih",
        phonetic: "Tee-dak teh-ree-mah kah-see",
      },
      { english: "I do not want this", local: "Saya tidak mau", phonetic: "Sah-yah tee-dak mow" },
    ],
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    riskTier: "Low",
    primaryLanguage: "Portuguese",
    emergencyNumbers: {
      generalOrPolice: "112",
      ambulance: "112",
    },
    arrivalAirports: [
      {
        code: "LIS",
        name: "Humberto Delgado Airport",
        dayTransitRecommendation: "Metro (Aeroporto red line directly into Saldanha / downtown).",
        nightTransitRecommendation:
          "Bolt or Uber from departures deck, or official airport taxi rank.",
        transitWarning:
          "Arrivals taxi rank occasionally attempts flat rate overcharges. Ensure driver runs taximeter.",
        cashAtmStrategy: "Multibanco ATMs inside terminal (avoid Euronet standalone machines).",
      },
    ],
    safeNeighborhoods: ["Chiado", "Príncipe Real", "Baixa", "Campo de Ourique"],
    cautionNeighborhoods: [
      "Martim Moniz late night",
      "Intendente back alleys",
      "Cais do Sodré pink street after 03:00",
    ],
    topScams: [
      {
        id: "lisbon-fake-drugs",
        name: "Fake Drug Street Sellers",
        triggerPhrase: "'Hash? Weed? Cocaine?' (whispered in Baixa or Praça do Comércio)",
        mechanic:
          "Selling compressed bay leaves or oregano. If confronted, sellers become aggressive or plainclothes cops observe.",
        counterAction:
          "Firm shake of head, maintain eye level, keep walking. Never engage or examine packages.",
      },
      {
        id: "lisbon-tram-28",
        name: "Tram 28 Organized Pickpocket Teams",
        triggerPhrase: "(Heavy jostling upon boarding historic tram)",
        mechanic:
          "Pickpockets squeeze tourists on crowded tram steps, taking phones and wallets from coats.",
        counterAction:
          "Keep backpack on your chest, hands over zippers, or take standard modern buses/metro instead.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "Socorro!", phonetic: "Soo-coh-hoo!" },
      {
        english: "Call the police",
        local: "Chame a polícia",
        phonetic: "Shah-meh ah poh-lee-see-ah",
      },
      { english: "Leave me alone", local: "Deixe-me em paz", phonetic: "Day-sheh meh aym pahzh" },
      {
        english: "Turn on the meter please",
        local: "Ligue o taxímetro, por favor",
        phonetic: "Lee-geh oo tah-ksee-meh-troh poor fah-voor",
      },
    ],
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    riskTier: "Elevated",
    primaryLanguage: "Spanish",
    emergencyNumbers: {
      generalOrPolice: "911",
      ambulance: "911",
      touristPolice: "+52 55 5207 4155",
    },
    arrivalAirports: [
      {
        code: "MEX",
        name: "Benito Juárez International Airport",
        dayTransitRecommendation:
          "Authorized Airport Taxi Ticket Booth inside terminal (Taxi Autorizado) or Uber pickup at Door 4.",
        nightTransitRecommendation:
          "Authorized Airport Taxi Ticket Booth ONLY. Pre-pay ticket inside; never accept street hails.",
        transitWarning:
          "CRITICAL: Never hail a green/pink street cab (libre) outside airport doors due to express kidnapping risks.",
        cashAtmStrategy:
          "BBVA or Santander ATMs located inside terminal between Gate C and Gate D.",
      },
    ],
    safeNeighborhoods: ["La Condesa", "Roma Norte", "Polanco", "Coyoacán"],
    cautionNeighborhoods: [
      "Tepito",
      "Doctores (east side)",
      "Guerrero",
      "Centro Histórico streets after 21:00",
    ],
    topScams: [
      {
        id: "cdmx-street-taxi",
        name: "Unofficial Street Taxi Intercept",
        triggerPhrase: "'Taxi seguro, joven! Fast ride to Condesa!'",
        mechanic: "Unofficial taxis deviate route to force ATM withdrawals (secuestro exprés).",
        counterAction:
          "Only use pre-paid authorized airport booth tickets with barcode or verified Uber/Didi rides.",
      },
      {
        id: "cdmx-mustard-spill",
        name: "The Spilled Sauce / Distraction Squeeze",
        triggerPhrase: "'Cuidado, se le cayó salsa en la chamarra!'",
        mechanic:
          "Someone spills liquid on your clothing, partner steps up to clean it while removing phone.",
        counterAction:
          "Maintain personal space, firmly yell 'NO', enter an OXXO or 7-Eleven store immediately.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "¡Auxilio!", phonetic: "Owk-see-lyoh!" },
      {
        english: "Call the police",
        local: "Llame a la policía",
        phonetic: "Yah-meh ah lah poh-lee-see-ah",
      },
      { english: "No, leave me alone", local: "No me moleste", phonetic: "No meh moh-lehs-teh" },
      {
        english: "I am taking an authorized taxi",
        local: "Tengo taxi autorizado",
        phonetic: "Tehn-goh tahk-see ow-toh-ree-sah-doh",
      },
    ],
  },
  {
    slug: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    riskTier: "Low",
    primaryLanguage: "Dutch",
    emergencyNumbers: {
      generalOrPolice: "112",
      ambulance: "112",
    },
    arrivalAirports: [
      {
        code: "AMS",
        name: "Amsterdam Schiphol",
        dayTransitRecommendation:
          "Direct Dutch Railways (NS) train from platform under main terminal directly to Amsterdam Centraal (14 min).",
        nightTransitRecommendation:
          "Night network train runs every hour all night between Schiphol and Centraal Station.",
        transitWarning:
          "Centraal Station bike lanes and tram tracks are hazardous if walking jet-lagged. Red asphalt is for bikes—never walk in it.",
        cashAtmStrategy: "Geldmaat ATMs (yellow boxes) inside Schiphol Plaza.",
      },
    ],
    safeNeighborhoods: ["Jordaan", "De Pijp", "Museumkwartier", "Oud-West"],
    cautionNeighborhoods: [
      "Red Light District (De Wallen) late night crowds",
      "Centraal Station rear ferry dock late",
    ],
    topScams: [
      {
        id: "ams-fake-police",
        name: "Bogus Plainclothes Narcotics Inspector",
        triggerPhrase: "'Police, narcotics check. Show your passport and wallet for inspection.'",
        mechanic:
          "Fake badges used to inspect wallet, discreetly sliding banknotes out before handing it back.",
        counterAction:
          "Dutch police rarely conduct street wallet checks in plainclothes. Demand uniformed officers and call 112.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "Help!", phonetic: "Help!" },
      { english: "Call the police", local: "Bel de politie", phonetic: "Bell duh poh-leet-see" },
      {
        english: "Watch out for the bicycle!",
        local: "Pas op voor de fiets!",
        phonetic: "Pahs op voor duh feets!",
      },
      { english: "No thank you", local: "Nee, dank je", phonetic: "Nay, dahnk yuh" },
    ],
  },
  {
    slug: "medellin",
    name: "Medellin",
    country: "Colombia",
    countryCode: "CO",
    riskTier: "Elevated",
    primaryLanguage: "Spanish",
    emergencyNumbers: {
      generalOrPolice: "123",
      ambulance: "123",
      touristPolice: "+57 4 399 9944",
    },
    arrivalAirports: [
      {
        code: "MDE",
        name: "José María Córdova International Airport",
        dayTransitRecommendation:
          "Official white airport taxi with fixed flat rate to El Poblado / Laureles via eastern tunnel (approx 35 min), or Combuses bus.",
        nightTransitRecommendation:
          "Official white airport taxi queue directly outside exit doors or pre-booked hotel driver.",
        transitWarning:
          "Airport is located in Rionegro, 45 minutes up the mountain. Do not take unofficial unmarked vehicles.",
        cashAtmStrategy:
          "Bancolombia or Davivienda ATMs inside the departure level of the airport.",
      },
    ],
    safeNeighborhoods: ["El Poblado (Provenza / Manila)", "Laureles", "Envigado"],
    cautionNeighborhoods: [
      "El Centro (Plaza Botero after dusk)",
      "Parque Lleras late night street edges",
      "Comuna 13 outside daylight tourist routes",
    ],
    topScams: [
      {
        id: "mde-dating-drugging",
        name: "Dating App Social Engineering / Scopolamine",
        triggerPhrase: "'Let's meet for drinks at your apartment or a private quiet spot.'",
        mechanic:
          "Matches on dating apps lure solo travelers to private venues or spiked drinks to rob electronics and bank accounts.",
        counterAction:
          "Never invite strangers to your accommodation. Meet only in public places; watch your drinks poured.",
      },
      {
        id: "mde-dar-papaya",
        name: "Giving Papaya (Dar Papaya) Phone Snatch",
        triggerPhrase: "(Quiet motorbike approach on curb)",
        mechanic:
          "Holding an expensive phone by the curb makes it an instant target for motorbike snatching.",
        counterAction:
          "Never use phone near the roadway. Step inside a cafe or doorway before looking at maps.",
      },
    ],
    safetyPhrases: [
      { english: "Help!", local: "¡Ayuda!", phonetic: "Ah-yoo-dah!" },
      { english: "Police!", local: "¡Policía!", phonetic: "Poh-lee-thee-ah!" },
      {
        english: "Call an ambulance",
        local: "Llame una ambulancia",
        phonetic: "Yah-meh oo-nah ahm-boo-lahn-see-ah",
      },
      {
        english: "No, thank you",
        local: "No gracias, amigo",
        phonetic: "No grah-see-ahs ah-mee-goh",
      },
    ],
  },
];

export function getDestinationBySlug(slug: string): DestinationSecurityProfile | undefined {
  return TOP_SOLO_DESTINATIONS.find((d) => d.slug === slug.toLowerCase());
}

export type ArrivalAirport = DestinationSecurityProfile["arrivalAirports"][number];

/** Finds the destination whose arrivalAirports list contains `code` (case-insensitive). */
export function getDestinationByAirportCode(
  code: string,
): { destination: DestinationSecurityProfile; airport: ArrivalAirport } | undefined {
  const upper = code.toUpperCase();
  for (const destination of TOP_SOLO_DESTINATIONS) {
    const airport = destination.arrivalAirports.find((a) => a.code.toUpperCase() === upper);
    if (airport) return { destination, airport };
  }
  return undefined;
}
