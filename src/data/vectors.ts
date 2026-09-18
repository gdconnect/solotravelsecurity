export interface SecurityVectorProfile {
  slug: string;
  title: string;
  shortLabel: string;
  tagline: string;
  primaryJob: string;
  coreRule: string;
  actionProtocol: {
    step: number;
    title: string;
    instruction: string;
  }[];
}

export const SECURITY_VECTORS: SecurityVectorProfile[] = [
  {
    slug: "night-arrival-transit",
    title: "Zero-Hour Night Arrival & Transit Protocol",
    shortLabel: "Night Arrival",
    tagline: "Navigate touchdown to door locked during the most vulnerable 120 minutes.",
    primaryJob:
      "Eliminate transit disorientation, taxi scams, and predatory touts when landing after dark.",
    coreRule:
      "Pre-book or use official terminal counters only. Never walk past the glass arrival doors into darkness without a confirmed transport method.",
    actionProtocol: [
      {
        step: 1,
        title: "Airside ATM & Connectivity",
        instruction:
          "Before passing customs exit, confirm active eSIM connection and draw modest local cash inside the secure terminal perimeter.",
      },
      {
        step: 2,
        title: "Ignore Arrival Hall Touts",
        instruction:
          "Never respond to unbadged people asking 'Taxi? Where you going?'. Walk with purpose directly to official queue or app pickup bay.",
      },
      {
        step: 3,
        title: "Vehicle Verification Gate",
        instruction:
          "Check license plate, driver name, and demand taximeter engagement or verify prepaid voucher before placing luggage inside trunk.",
      },
      {
        step: 4,
        title: "Door-to-Door Watch",
        instruction:
          "Track the ride on your offline map GPS. If vehicle deviates significantly into unlit territory, phone home contact or simulate call immediately.",
      },
    ],
  },
  {
    slug: "hotel-room-perimeter",
    title: "Sanctuary Vetting & Lodging Perimeter Audit",
    shortLabel: "Room Security",
    tagline: "The 180-second inspection protocol to secure your room before unpacking.",
    primaryJob:
      "Verify locks, secondary latches, floor positioning, and fire egress so you sleep peacefully.",
    coreRule:
      "Target floors 2 to 4 (above street reach, below maximum fire rescue ladders). Deploy a mechanical doorstop.",
    actionProtocol: [
      {
        step: 1,
        title: "Door Hardware Inspection",
        instruction:
          "Test deadbolt, verify chain/swing bar, and look through peephole to ensure reverse peephole viewers cannot see inside.",
      },
      {
        step: 2,
        title: "Perimeter & Window Egress",
        instruction:
          "Confirm window latches lock securely. If on ground or adjacent balcony floor, keep windows locked whenever asleep or away.",
      },
      {
        step: 3,
        title: "Fire Stairwell Count",
        instruction:
          "Step back into hallway and physically count doors to the nearest fire exit. Verify exit door pushes open and is not padlocked.",
      },
      {
        step: 4,
        title: "Visitor Refusal Protocol",
        instruction:
          "Never open the door to unexpected room service, maintenance, or deliveries without phoning reception first to verify.",
      },
    ],
  },
  {
    slug: "street-scams",
    title: "Streetwise Scam Inoculation & De-escalation",
    shortLabel: "Scam Defense",
    tagline: "Recognize diversion tactics and social engineering before money leaves your hand.",
    primaryJob:
      "Neutralize high-pressure sales, distraction pickpockets, and fake authority figures calmly.",
    coreRule:
      "Politeness is the scammer's greatest leverage. A firm 'No thank you' with continuous forward walking neutralizes 90% of encounters.",
    actionProtocol: [
      {
        step: 1,
        title: "Unsolicited Approach Filter",
        instruction:
          "Anyone who approaches you out of nowhere has an agenda. Do not stop, do not engage in trivia, keep moving.",
      },
      {
        step: 2,
        title: "Hands-Off Boundary",
        instruction:
          "Never let anyone place an object (bracelet, petition, baby, ring) into your hand or onto your clothes.",
      },
      {
        step: 3,
        title: "Bogus Authority Defense",
        instruction:
          "Plainclothes police demanding wallet or passport inspection is an immediate red flag. Demand to walk together to the nearest police station.",
      },
      {
        step: 4,
        title: "Physical Diversion Pivot",
        instruction:
          "If someone spills liquid or bumps you violently, step 2 meters away immediately, clamp hands over pockets, and enter a store.",
      },
    ],
  },
  {
    slug: "laptop-gear-security",
    title: "Digital Nomad Asset & Workstation Hygiene",
    shortLabel: "Asset Security",
    tagline: "Protect your laptop, credentials, and livelihood while working remotely.",
    primaryJob:
      "Prevent grab-and-run cafe theft, public Wi-Fi compromise, and 2FA lockout disasters.",
    coreRule:
      "Never leave laptop unattended in a public venue—even for a 30-second restroom break. Always pack it into your daypack.",
    actionProtocol: [
      {
        step: 1,
        title: "Cafe Positioning",
        instruction:
          "Sit facing the entrance door with your back to a solid wall. Never sit roadside or by open patio walkways where scooters can snatch items.",
      },
      {
        step: 2,
        title: "Public Network Lockdown",
        instruction:
          "Never connect to cafe Wi-Fi without active VPN or encrypted DNS. Use personal phone hotspot for sensitive banking operations.",
      },
      {
        step: 3,
        title: "Hardware 2FA Key Redundancy",
        instruction:
          "Carry a primary YubiKey on your keychain and store an identical backup YubiKey + paper recovery codes in your luggage.",
      },
      {
        step: 4,
        title: "Full Disk Encryption",
        instruction:
          "Ensure FileVault (macOS) or BitLocker (Windows) is active, with a strict 2-minute sleep lock and find-my-device remote wipe enabled.",
      },
    ],
  },
  {
    slug: "two-cards-backup",
    title: "Financial Redundancy: Two Cards, Two Pockets",
    shortLabel: "Money Redundancy",
    tagline: "Absolute prevention of being stranded penniless in a foreign country.",
    primaryJob: "Ensure a blocked card or stolen wallet never terminates your journey.",
    coreRule:
      "One card in your day pocket, one card locked in your luggage. Never let both cards exist in the same physical space.",
    actionProtocol: [
      {
        step: 1,
        title: "Separate Institution Distribution",
        instruction:
          "Ensure Card 1 and Card 2 are issued by two completely different banking institutions to protect against single-bank fraud freezes.",
      },
      {
        step: 2,
        title: "The Hidden Emergency Reserve",
        instruction:
          "Fold a crisp $100 USD or €100 EUR banknote into the lining of your daypack or inside shoe insole for zero-ATM emergency scenarios.",
      },
      {
        step: 3,
        title: "ATM Perimeter Hygiene",
        instruction:
          "Only withdraw money from indoor bank ATMs during business hours. Cover PIN pad with your secondary hand.",
      },
      {
        step: 4,
        title: "Rapid Freeze Contacts",
        instruction:
          "Store your bank's international collect-call phone numbers offline in your notes app and on a printed card.",
      },
    ],
  },
  {
    slug: "emergency-check-in",
    title: "Check-In Tripwire & Escalation Ladder",
    shortLabel: "Check-In Ladder",
    tagline: "Reassure loved ones back home with a quiet, pre-agreed dead-man safety ladder.",
    primaryJob:
      "Eliminate constant worrying messages with a strict, non-paranoid escalation protocol.",
    coreRule:
      "A single missed check-in triggers a timed sequence of verified steps rather than immediate panic.",
    actionProtocol: [
      {
        step: 1,
        title: "Single Designated Primary Contact",
        instruction:
          "Appoint one calm family member or trusted friend as point of contact. Provide them with full itinerary, hotel addresses, and policy numbers.",
      },
      {
        step: 2,
        title: "Fixed Time Windows",
        instruction:
          "Agree on one daily check-in window (e.g. 20:00 local time) with an agreed 2-hour grace period before any inquiry begins.",
      },
      {
        step: 3,
        title: "Stage 1 Quiet Verification",
        instruction:
          "If check-in is missed past grace period, primary contact phones hotel reception desk for a room check before calling authorities.",
      },
      {
        step: 4,
        title: "Pre-Escrowed Emergency Pack",
        instruction:
          "Contact holds an encrypted digital vault containing passport copy, travel insurance policy number, and consular hotline.",
      },
    ],
  },
];

export function getVectorBySlug(slug: string): SecurityVectorProfile | undefined {
  return SECURITY_VECTORS.find((v) => v.slug === slug.toLowerCase());
}
