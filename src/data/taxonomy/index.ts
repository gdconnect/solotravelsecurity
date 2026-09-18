/**
 * src/data/taxonomy/index.ts
 *
 * Formal ontological taxonomy for Solo Travel Security.
 * Defines the 7 sovereign security pillars, 9 lifecycle phases,
 * traveler archetypes, operational risk tiers, and tactical threat vectors.
 */

export interface SecurityPillar {
  id: string;
  name: string;
  slug: string;
  description: string;
  weight: number; // Percentage contribution to baseline readiness score
  icon: string;
  primaryDirectives: string[];
}

export interface LifecyclePhase {
  id: string;
  name: string;
  slug: string;
  order: number;
  description: string;
  typicalWindow: string;
}

export interface OperationalRiskTier {
  tier: "LOW" | "MODERATE" | "ELEVATED" | "HIGH";
  label: string;
  numericalLevel: number;
  description: string;
  baselinePosture: string;
}

export const SECURITY_PILLARS: SecurityPillar[] = [
  {
    id: "PIL-PERIMETER",
    name: "Physical Perimeter & Lodging Defense",
    slug: "perimeter-defense",
    description:
      "Physical sanctuary vetting, hotel and rental room lockdown, window access mitigation, and non-destructive door wedges.",
    weight: 20,
    icon: "lock",
    primaryDirectives: [
      "Select rooms on floors 2 to 4 (above street reach, below fire ladder ceiling)",
      "Deploy a high-grip mechanical rubber doorstop under the entry door",
      "Inspect peepholes, connecting door latches, and window locks within 180 seconds of entry",
    ],
  },
  {
    id: "PIL-FINANCIAL",
    name: "Financial Redundancy & Anti-Theft",
    slug: "financial-redundancy",
    description:
      "Multi-pocket card segregation, independent bank rails, emergency cash reserves, and ATM skimming defenses.",
    weight: 20,
    icon: "creditCard",
    primaryDirectives: [
      "Never carry all payment cards in one pouch or wallet",
      "Maintain a concealed emergency reserve of $100–200 in hard currency (USD/EUR)",
      "Carry a decoy bait wallet with expired cards and small bills for street compliance",
    ],
  },
  {
    id: "PIL-COMMS",
    name: "Connectivity & Home Contact Escalation",
    slug: "communications-escalation",
    description:
      "Preloaded eSIM connectivity, redundant battery packs, structured guardian check-in windows, and silent duress tripwires.",
    weight: 15,
    icon: "signal",
    primaryDirectives: [
      "Activate roaming or eSIM prior to aircraft touchdown so data is live upon gate arrival",
      "Establish a designated home guardian contact with strict check-in windows",
      "Carry a laminated paper card with emergency numbers independent of phone battery",
    ],
  },
  {
    id: "PIL-TRANSIT",
    name: "Transit Ingress & First-Mile Navigation",
    slug: "transit-ingress",
    description:
      "Vetting airport arrivals, avoiding curbside touts, licensed taxi validation, and GPS route tracking to accommodation.",
    weight: 15,
    icon: "navigation",
    primaryDirectives: [
      "Pre-book verified transit or use official ticketed dispatch booths inside the terminal",
      "Never accept rides from unsolicited drivers approaching in arrival corridors",
      "Track taxi progress on an offline map with pre-downloaded destination pins",
    ],
  },
  {
    id: "PIL-THREAT",
    name: "Street Threat Vectors & Conflict De-escalation",
    slug: "threat-deescalation",
    description:
      "Spatial boundary management, handling bogus police, distraction scam evasion, and assertive verbal scripts.",
    weight: 10,
    icon: "shield",
    primaryDirectives: [
      "Pivot 90 degrees and present open palm when personal space is breached under 1 meter",
      "Never hand documents or wallets to unbadged people claiming police authority",
      "Drop into an open commercial business if followed or targeted by street solicitations",
    ],
  },
  {
    id: "PIL-DIGITAL",
    name: "Digital Privacy & Cyber Hygiene",
    slug: "digital-privacy",
    description:
      "Hardware workstation security, WireGuard VPN enforcement, public USB data-blockers, and zero-trust Wi-Fi.",
    weight: 10,
    icon: "laptop",
    primaryDirectives: [
      "Route all public cafe and airport traffic through a trusted encrypted VPN tunnel",
      "Use USB-A/C data-blockers (power-only dongles) on public charging kiosks",
      "Enable cloud-based remote wipe capabilities on laptop and mobile devices",
    ],
  },
  {
    id: "PIL-CONSULAR",
    name: "Consular, Medical & Legal Jurisdiction",
    slug: "consular-medical",
    description:
      "Direct consular emergency hotlines, travel health insurance evacuation policies, and local police jurisdictions.",
    weight: 10,
    icon: "alertCircle",
    primaryDirectives: [
      "Program embassy crisis line and national police into phone speed-dial",
      "Carry emergency medical evacuation insurance policy numbers on physical person",
      "Know whether destination operates dedicated Tourist Police squads",
    ],
  },
];

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    id: "PHS-PRETRIP",
    name: "Pre-Trip Recon & Vetting",
    slug: "pre-trip",
    order: 1,
    description: "Intelligence gathering, consular registration, and hotel floor requests.",
    typicalWindow: "T-30 days to T-7 days",
  },
  {
    id: "PHS-STAGING",
    name: "Packing & Redundancy Staging",
    slug: "staging",
    order: 2,
    description: "Physical wallet splitting, offline map cache, and eSIM profile installation.",
    typicalWindow: "T-24 hours to departure",
  },
  {
    id: "PHS-AIRSIDE",
    name: "Border Crossing & Airside Transit",
    slug: "airside-transit",
    order: 3,
    description: "Customs navigation, data roaming activation, and airside ATM cash draw.",
    typicalWindow: "Flight Touchdown to Terminal Exit",
  },
  {
    id: "PHS-INGRESS",
    name: "First-Mile Ground Transit",
    slug: "ground-ingress",
    order: 4,
    description: "Airport to lodging transit, vehicle verification, and offline GPS monitoring.",
    typicalWindow: "0 to 90 minutes post-touchdown",
  },
  {
    id: "PHS-LODGING",
    name: "Lodging Perimeter Audit (180s Test)",
    slug: "lodging-audit",
    order: 5,
    description: "Room lock inspection, wedge deployment, and emergency fire stair check.",
    typicalWindow: "Within 3 minutes of entering room",
  },
  {
    id: "PHS-DAYROAM",
    name: "Daytime Autonomous Roaming",
    slug: "day-roaming",
    order: 6,
    description: "Daytime street navigation, distraction scam evasion, and asset security.",
    typicalWindow: "08:00 to 18:00 local time",
  },
  {
    id: "PHS-NIGHTROAM",
    name: "Nightlife, Social & Evening Roaming",
    slug: "night-roaming",
    order: 7,
    description: "Drink surveillance, ride booking from inside venues, and transit curfew.",
    typicalWindow: "18:00 to 04:00 local time",
  },
  {
    id: "PHS-CRISIS",
    name: "Active Threat & Crisis Escalation",
    slug: "crisis-escalation",
    order: 8,
    description: "Consular dispatch, lost phone recovery, and emergency evacuation protocols.",
    typicalWindow: "Immediate incident response",
  },
  {
    id: "PHS-EGRESS",
    name: "Egress & Post-Trip Debrief",
    slug: "egress-return",
    order: 9,
    description: "Safe return transit, account security review, and contact notification.",
    typicalWindow: "Departure flight & home arrival",
  },
];

export const OPERATIONAL_RISK_TIERS: OperationalRiskTier[] = [
  {
    tier: "LOW",
    label: "Low Operational Risk",
    numericalLevel: 1,
    description:
      "Stable civil environment, modern transit infrastructure, reliable emergency response.",
    baselinePosture:
      "Standard situational awareness. Relaxed autonomy with basic card segregation.",
  },
  {
    tier: "MODERATE",
    label: "Moderate Risk / High Petty Crime",
    numericalLevel: 2,
    description:
      "Elevated pickpocketing, taxi meter manipulation, street distraction rings, and bag snatches.",
    baselinePosture:
      "Active discipline. High-traffic spatial buffers, prepaid transit only, mandatory room wedge.",
  },
  {
    tier: "ELEVATED",
    label: "Elevated Risk / High Vulnerability",
    numericalLevel: 3,
    description:
      "Frequent opportunistic extortion, bogus police, night transport ambush, aggressive touts.",
    baselinePosture:
      "Strict defensive discipline. Pre-arranged hotel transfers, zero night walking in side streets.",
  },
  {
    tier: "HIGH",
    label: "High Security Threat Environment",
    numericalLevel: 4,
    description:
      "High kidnapping or violent robbery threat, civil instability, compromised police integrity.",
    baselinePosture:
      "Vetted security escort only. Embassy-registered tripwires, hardened airside transit hotels.",
  },
];
