import type { ThreatScamDossier } from "@/lib/schemas/lego-blocks";

export const PREPOPULATED_SCAMS: ThreatScamDossier[] = [
  {
    id: "scam-airport-hallway-taxi",
    slug: "airport-hallway-rogue-taxi",
    name: "Airport Arrival Hall Unlicensed Rogue Taxi Tout",
    vectorCategory: "counterfeit_official",
    severity: "High",
    associatedDestinations: ["rome", "paris", "bangkok", "barcelona"],
    primaryHotspots: [
      "Rome FCO Terminal 3 Arrivals Hall",
      "Paris CDG Terminal 2E Baggage Exit",
      "Bangkok BKK Level 2 Customs Exit",
    ],

    deceptiveHook: {
      openingPhrase:
        "Taxi? Rome center / Paris center? Official taxi, no waiting in the long line outside!",
      psychologicalTrigger:
        "Exploitation of traveler fatigue, foreign language anxiety, and fear of long queues.",
      mechanicStepByStep: [
        "Tout intercepts traveler immediately after passing customs exit doors inside the terminal.",
        "Holds an official-looking black clipboard or lanyard with a generic 'VIP TRANSPORT' or 'AIRPORT SHUTTLE' badge.",
        "Claims the official outdoor taxi rank is delayed by hours or that trains are on strike.",
        "Walks traveler to an unmarked private passenger vehicle parked in a short-term garage.",
        "At destination, demands 3x to 5x the legal flat rate (€150-250 instead of €50), refusing to open the trunk until cash is paid.",
      ],
    },

    truthTable: {
      conditions: [
        {
          id: "COND-01",
          conditionText:
            "Approached by person standing inside the terminal hallway (rather than waiting at the outdoor designated taxi curb)?",
          isScamIndicator: true,
        },
        {
          id: "COND-02",
          conditionText:
            "Driver vehicle lacks municipal coat of arms, official taxi roof dome, and external calibrated license number?",
          isScamIndicator: true,
        },
        {
          id: "COND-03",
          conditionText:
            "Demands cash upfront or refuses to confirm the legal municipality flat fare before loading bags?",
          isScamIndicator: true,
        },
      ],
      conclusiveRule:
        "IF any condition is TRUE -> 100% Guaranteed Unlicensed Rogue Driver. Do not engage; walk directly to the official outdoor kiosk.",
    },

    escapeProtocol: {
      primaryAction:
        "Maintain forward walking momentum. Do not break stride or stop to listen. Keep hand on rolling bag handle.",
      localRefusalPhrase: {
        english: "No thank you, I have an official booking.",
        local: "No grazie, vado al taxi ufficiale.",
        phonetic: "No GRAHT-syeh, VAH-doh ahl TAHK-see oof-fee-CHAH-leh.",
      },
      escalationContact:
        "112 (European Emergency Service) or locate nearest Polizia di Stato airport officer.",
    },
  },

  {
    id: "scam-sacre-coeur-bracelet",
    slug: "sacre-coeur-string-friendship-bracelet",
    name: "Sacré-Cœur String 'Friendship' Bracelet Extortion",
    vectorCategory: "financial_extortion",
    severity: "Moderate",
    associatedDestinations: ["paris"],
    primaryHotspots: [
      "Staircases ascending to Sacré-Cœur Basilica in Montmartre",
      "Funiculaire de Montmartre lower staircase",
    ],

    deceptiveHook: {
      openingPhrase: "Hey my friend! Where are you from? Free gift for you, welcome to Paris!",
      psychologicalTrigger:
        "Manufactured social reciprocity, sudden physical touch, and spatial encirclement.",
      mechanicStepByStep: [
        "A team of 3-5 young men stands in a cordon along the staircase bottleneck.",
        "Scammer approaches with a bright smile, extending hand for a friendly handshake or high-five.",
        "As soon as contact is made, skillfully ties a multi-colored braided thread tightly around the traveler's wrist or finger.",
        "Quickly braids it into a knot that cannot be slipped off without scissors.",
        "The tone abruptly shifts from friendly to aggressive: demands €20-50 for the 'handmade souvenir'.",
        "Associates encircle the traveler to physically impede forward movement until money is handed over.",
      ],
    },

    truthTable: {
      conditions: [
        {
          id: "COND-01",
          conditionText:
            "Stranger on public stairs attempts to initiate physical contact or place thread/seeds in your hand?",
          isScamIndicator: true,
        },
        {
          id: "COND-02",
          conditionText:
            "Group positioned across a pedestrian choke-point rather than a licensed vendor stall?",
          isScamIndicator: true,
        },
      ],
      conclusiveRule:
        "IF stranger reaches toward your hands on public stairs -> Immediate tactical perimeter breach attempt. Tuck hands into pockets immediately.",
    },

    escapeProtocol: {
      primaryAction:
        "Keep hands firmly inside coat/pants pockets before reaching the stairs. Look straight ahead with neutral eyes. If touched, pull hand back sharply and say 'NON' loudly.",
      localRefusalPhrase: {
        english: "No! Let go of me!",
        local: "Non! Lâchez-moi!",
        phonetic: "NOH! Lah-SHAY MWAH!",
      },
      escalationContact:
        "17 (Police Secours) or head directly toward the staffed Funiculaire station booth.",
    },
  },

  {
    id: "scam-grand-palace-closed",
    slug: "bangkok-grand-palace-temple-is-closed",
    name: "Grand Palace 'Temple Is Closed' Gem & Tailor Redirect",
    vectorCategory: "financial_extortion",
    severity: "Moderate",
    associatedDestinations: ["bangkok"],
    primaryHotspots: [
      "Perimeter walls of Grand Palace (Wat Phra Kaew), Bangkok",
      "Wat Pho entrance gates",
      "Sanam Luang public plaza",
    ],

    deceptiveHook: {
      openingPhrase:
        "Excuse me, where are you going? Oh, the Grand Palace is closed this morning for monk prayer ceremony!",
      psychologicalTrigger:
        "Apparent helpfulness from a well-dressed local speaking fluent English, exploiting schedule disorientation.",
      mechanicStepByStep: [
        "Well-dressed individual standing 100 meters before the entrance politely asks the traveler where they are from.",
        "Informs the traveler with calm authority that the palace is closed until 13:30 due to a special royal/Buddhist holiday.",
        "Offers to help: 'Today only, government sponsors special 40 Baht tuk-tuk tour to Lucky Buddha and export gem center.'",
        "Flags down a participating tuk-tuk driver who takes the traveler to a minor temple, then to an export gem shop and custom tailor.",
        "High-pressure sales pitch convinces traveler to buy synthetic glass gems as 'investment sapphires' or overpriced synthetic suits.",
      ],
    },

    truthTable: {
      conditions: [
        {
          id: "COND-01",
          conditionText:
            "Person on street claims major government landmark is closed, but you are not at the official ticket booth window?",
          isScamIndicator: true,
        },
        {
          id: "COND-02",
          conditionText:
            "Offer of an impossibly cheap tuk-tuk tour (e.g. 20-40 THB for 2 hours) coupled with an unscheduled retail stop?",
          isScamIndicator: true,
        },
      ],
      conclusiveRule:
        "IF anyone outside the palace claims it is closed -> 100% Guaranteed Tuk-Tuk Commission Racket. The palace is open 08:30-15:30 daily.",
    },

    escapeProtocol: {
      primaryAction:
        "Smile politely, do not argue, and continue walking directly to the official gate ticket turnstile.",
      localRefusalPhrase: {
        english: "No thank you, I will check the official ticket gate myself.",
        local: "Mai pen rai khrub / ka (No problem / no thank you).",
        phonetic: "MY PEN RYE KHRUB (male) / KA (female).",
      },
      escalationContact: "1155 (Thailand Tourist Police - 24/7 English dispatch).",
    },
  },

  {
    id: "scam-fake-police-badge",
    slug: "counterfeit-plainclothes-police-badge",
    name: "Counterfeit Plainclothes 'Tourist Police' Badge Inspection",
    vectorCategory: "counterfeit_official",
    severity: "Critical",
    associatedDestinations: ["rome", "barcelona", "paris"],
    primaryHotspots: [
      "Streets near Rome Termini Station (Via Cavour, Via Giolitti)",
      "Barcelona Ciutat Vella and Born alleys",
      "Paris Gare du Nord perimeter",
    ],

    deceptiveHook: {
      openingPhrase:
        "Police! Narcotics and counterfeit euro inspection. Show your passport and wallet now.",
      psychologicalTrigger:
        "Intimidation through false legal authority, threatening detention or deportation.",
      mechanicStepByStep: [
        "An associate (often disguised as a tourist) stops the traveler asking for directions or a lighter.",
        "Two men in plain civilian clothes suddenly approach, flashing a fake leather badge case for 0.5 seconds.",
        "Claim they are undercover police investigating illegal drug sales or counterfeit currency circulating in the area.",
        "Demand traveler produce their wallet and passport to 'verify serial numbers'.",
        "While quickly inspecting the wallet, their sleight-of-hand palming extracts high-denomination banknotes or credit cards, returning the wallet closed.",
      ],
    },

    truthTable: {
      conditions: [
        {
          id: "COND-01",
          conditionText:
            "Officers in civilian plainclothes refuse to present official photo ID card with verifiable badge number?",
          isScamIndicator: true,
        },
        {
          id: "COND-02",
          conditionText:
            "Demands physical possession of your wallet or inspects cash banknotes on the street?",
          isScamIndicator: true,
        },
        {
          id: "COND-03",
          conditionText:
            "Refuses your offer to walk 50 meters together to the nearest uniformed police station / vehicle?",
          isScamIndicator: true,
        },
      ],
      conclusiveRule:
        "REAL POLICE NEVER INSPECT CASH CURRENCY ON THE STREET. Any demand to touch your cash = Counterfeit Impersonation Extortion.",
    },

    escapeProtocol: {
      primaryAction:
        "NEVER surrender your wallet or passport into their hands. Hold your ground, keep wallet in front zippered pocket, and state loudly: 'Let us go together to the police station or call 112 right now.'",
      localRefusalPhrase: {
        english: "I will not give you my wallet. Let us go to the police station.",
        local: "Non le do il portafoglio. Andiamo al commissariato di polizia.",
        phonetic:
          "Nohn leh doh eel por-tah-FOHL-yoh. Ahn-DYAH-moh ahl kohm-mees-sah-RYAH-toh dee poh-leet-SEE-ah.",
      },
      escalationContact: "112 (Immediately dial on your phone and hold screen visible).",
    },
  },

  {
    id: "scam-nightlife-drink-spiking",
    slug: "nightlife-drink-spiking-bill-extortion",
    name: "Nightlife Friendly Escort Drink Spiking & Bill Extortion",
    vectorCategory: "nightlife_drink_spiking",
    severity: "Critical",
    associatedDestinations: ["tokyo", "bangkok"],
    primaryHotspots: [
      "Tokyo Shinjuku Kabukicho & Roppongi Gaien-Higashi Dori",
      "Bangkok Nana Plaza / Soi Cowboy side alleys",
    ],

    deceptiveHook: {
      openingPhrase:
        "Hey handsome! Traveling alone? Come have a quick drink with me at my favorite bar around the corner, cheap beer!",
      psychologicalTrigger:
        "Sexual appeal, social flattery, and artificial loneliness relief for solo travelers.",
      mechanicStepByStep: [
        "A charming local or foreign tout approaches a solo traveler outside mainstream venues.",
        "Invites traveler to a quiet second-floor or basement bar with 'no cover charge'.",
        "Traveler orders a standard beer or cocktail; bartender pours behind an elevated partition.",
        "Drink is laced with benzodiazepines (Rohypnol) or sleep-inducing agents.",
        "Traveler becomes disoriented and compliant. Massive bottle orders (Dom Pérignon) are opened.",
        "Bouncers corner the traveler demanding $2,000-$5,000 USD. Traveler is marched to an ATM to withdraw maximum daily limits under duress.",
      ],
    },

    truthTable: {
      conditions: [
        {
          id: "COND-01",
          conditionText:
            "Stranger invites you into a venue not visible from street level (basement or upper floor)?",
          isScamIndicator: true,
        },
        {
          id: "COND-02",
          conditionText:
            "Venue lacks printed menu with explicit itemized tax and seating fee prices?",
          isScamIndicator: true,
        },
        {
          id: "COND-03",
          conditionText: "Drink is prepared out of your continuous direct line of sight?",
          isScamIndicator: true,
        },
      ],
      conclusiveRule:
        "IF accompanied by street tout into unverified upper/basement bar -> 95% Risk of Spiking or Extortion. ZERO TOLERANCE: Never enter a venue introduced by a street barker.",
    },

    escapeProtocol: {
      primaryAction:
        "Refuse invitations from street barkers unconditionally. If already inside and feeling sudden uncoordinated dizziness, immediately walk to the exit, vomit in private restroom if possible, and dial emergency dispatch.",
      localRefusalPhrase: {
        english: "No thanks, I'm meeting my group down the street.",
        local: "Kekko desu. Tomodachi to machiawase shitemasu.",
        phonetic: "Keck-KOH deh-soo. Toh-moh-DAH-chee toh mah-chee-ah-WAH-seh shee-teh-mah-soo.",
      },
      escalationContact: "110 (Japan Police) or 1155 (Thailand Tourist Police).",
    },
  },
];

export function getScamBySlug(slug: string): ThreatScamDossier | undefined {
  return PREPOPULATED_SCAMS.find((s) => s.slug === slug);
}

export function getScamsForDestination(destinationSlug: string): ThreatScamDossier[] {
  return PREPOPULATED_SCAMS.filter((s) =>
    s.associatedDestinations.includes(destinationSlug.toLowerCase()),
  );
}
