/**
 * src/data/checklists/index.ts
 *
 * Canonical repository of solo travel security checklist items.
 * Each item has formal taxonomic linkage, criticality weighting,
 * Single Point of Failure (SPOF) tags, and verification criteria.
 */

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  pillarId: string;
  phaseId: string;
  criticality: "CRITICAL" | "HIGH" | "STANDARD" | "RECOMMENDED";
  isSPOF: boolean;
  verificationType:
    | "MANUAL_CHECK"
    | "PHOTO_PROOF"
    | "LOCATION_GEO_PING"
    | "CONSULAR_REG_ID"
    | "HARDWARE_TEST"
    | "TRUSTED_CONTACT_CONFIRMATION";
  applicableArchetypes: string[]; // ['all'] or specific archetype slugs
  minimumRiskTier: "LOW" | "MODERATE" | "ELEVATED" | "HIGH";
  decisionTableRef?: string;
  truthTableRef?: string;
  scoringDeductionPoints: number;
  recommendedGearSkus?: string[];
}

export const MASTER_CHECKLIST_ITEMS: ChecklistItem[] = [
  // --- 1. FINANCIAL REDUNDANCY (PIL-FINANCIAL) ---
  {
    id: "CHK-FIN-001",
    title: "Dual-Rail Payment Card Segregation",
    description:
      "Carry at least two debit/credit cards tied to completely independent banking institutions, physically split into separate bags. If one card is swallowed or compromised, immediate purchasing power remains intact.",
    pillarId: "PIL-FINANCIAL",
    phaseId: "PHS-STAGING",
    criticality: "CRITICAL",
    isSPOF: true,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    decisionTableRef: "DT-FIN-RED-01",
    scoringDeductionPoints: 25,
    recommendedGearSkus: ["GEAR-CARD-SPLIT-01"],
  },
  {
    id: "CHK-FIN-002",
    title: "Concealed Hard Currency Reserve ($100–200 USD/EUR)",
    description:
      "Stash crisp, uncreased international reserve currency in a hidden waterproof compartment or inside footwear. Serves as ultimate fallback when local ATM networks crash or cards are frozen.",
    pillarId: "PIL-FINANCIAL",
    phaseId: "PHS-STAGING",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 8,
  },
  {
    id: "CHK-FIN-003",
    title: "Street Bait Wallet Armed",
    description:
      "Assemble a sacrificial secondary wallet containing an expired credit card, non-sensitive loyalty card, and a few small local bills. In an armed mugging, surrender this immediately and preserve primary assets.",
    pillarId: "PIL-FINANCIAL",
    phaseId: "PHS-STAGING",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["solo-female", "budget-backpacker", "first-time-solo"],
    minimumRiskTier: "MODERATE",
    truthTableRef: "TT-STREET-ENCOUNTER-01",
    scoringDeductionPoints: 10,
    recommendedGearSkus: ["GEAR-BAIT-WALLET-01"],
  },
  {
    id: "CHK-FIN-004",
    title: "Airside Perimeter ATM Withdrawal Only",
    description:
      "Withdraw local currency at bank-branded ATMs located inside the arrival security perimeter before exiting past customs glass doors. Completely avoids outdoor street skimming rings.",
    pillarId: "PIL-FINANCIAL",
    phaseId: "PHS-AIRSIDE",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "MODERATE",
    scoringDeductionPoints: 10,
  },

  // --- 2. TRANSIT INGRESS & FIRST-MILE (PIL-TRANSIT) ---
  {
    id: "CHK-TRN-001",
    title: "Verified Arrival Transit Gate Engagement",
    description:
      "Pre-book verified transport or use official ticketed dispatch booths inside the arrivals terminal. Absolutely never follow unbadged curbside touts offering rides into unlit parking decks.",
    pillarId: "PIL-TRANSIT",
    phaseId: "PHS-INGRESS",
    criticality: "CRITICAL",
    isSPOF: true,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "MODERATE",
    decisionTableRef: "DT-INGRESS-TRANSIT-01",
    truthTableRef: "TT-NIGHT-INGRESS-01",
    scoringDeductionPoints: 20,
  },
  {
    id: "CHK-TRN-002",
    title: "Offline City Vector Map Downloaded & Pinned",
    description:
      "Save high-resolution offline vector maps (Maps.me or Google Maps offline) with accommodation, local police station, and embassy pinned before takeoff. Eliminates disorientation upon landing.",
    pillarId: "PIL-TRANSIT",
    phaseId: "PHS-STAGING",
    criticality: "HIGH",
    isSPOF: true,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 10,
  },
  {
    id: "CHK-TRN-003",
    title: "Vehicle License & Driver Identity Triangulation",
    description:
      "Before loading luggage into a taxi or rideshare trunk, inspect license plate, verify driver photo and name on official app, and ensure interior passenger child-locks are disengaged.",
    pillarId: "PIL-TRANSIT",
    phaseId: "PHS-INGRESS",
    criticality: "CRITICAL",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["solo-female", "first-time-solo"],
    minimumRiskTier: "MODERATE",
    truthTableRef: "TT-NIGHT-INGRESS-01",
    scoringDeductionPoints: 15,
  },

  // --- 3. PHYSICAL PERIMETER & LODGING DEFENSE (PIL-PERIMETER) ---
  {
    id: "CHK-PER-001",
    title: "Sanctuary Floor Placement (Floors 2 to 4)",
    description:
      "Secure room assignment on floors 2 through 4. Ground floor units suffer 4x higher burglary rates; floors above 5 exceed municipal ladder reach during emergency high-rise fires.",
    pillarId: "PIL-PERIMETER",
    phaseId: "PHS-LODGING",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "PHOTO_PROOF",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    decisionTableRef: "DT-LODGING-FLOOR-01",
    scoringDeductionPoints: 15,
  },
  {
    id: "CHK-PER-002",
    title: "Mechanical Rubber Wedge Deployed Under Entry Door",
    description:
      "Position a high-friction vulcanized rubber doorstop on the interior side of the guestroom entry door before sleeping. Mechanically blocks master keys, duplicate cards, and under-door hook tools.",
    pillarId: "PIL-PERIMETER",
    phaseId: "PHS-LODGING",
    criticality: "CRITICAL",
    isSPOF: false,
    verificationType: "HARDWARE_TEST",
    applicableArchetypes: ["solo-female", "budget-backpacker", "first-time-solo"],
    minimumRiskTier: "LOW",
    truthTableRef: "TT-ROOM-PERIMETER-01",
    scoringDeductionPoints: 15,
    recommendedGearSkus: ["GEAR-DOOR-STOP-01"],
  },
  {
    id: "CHK-PER-003",
    title: "Connecting Room Door & Window Latch Audit (180s Test)",
    description:
      "Within 3 minutes of baggage drop: check adjoining interior door deadbolts, test patio door sliding tracks, verify exterior window locks, and test peephole for reverse-viewer tampering.",
    pillarId: "PIL-PERIMETER",
    phaseId: "PHS-LODGING",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    truthTableRef: "TT-ROOM-PERIMETER-01",
    scoringDeductionPoints: 12,
  },
  {
    id: "CHK-PER-004",
    title: "Emergency Fire Stair Door Count",
    description:
      "Walk from guestroom door to nearest emergency fire exit stairwell. Count number of doorway frames along the wall to ensure zero-visibility navigation during a heavy smoke evacuation.",
    pillarId: "PIL-PERIMETER",
    phaseId: "PHS-LODGING",
    criticality: "STANDARD",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 5,
  },

  // --- 4. CONNECTIVITY & COMMS (PIL-COMMS) ---
  {
    id: "CHK-COM-001",
    title: "Preloaded Travel eSIM Active Upon Gate Touchdown",
    description:
      "Install and activate destination data profile before boarding flight. Eliminates dead-zone transit paralysis while queuing for local airport kiosks.",
    pillarId: "PIL-COMMS",
    phaseId: "PHS-AIRSIDE",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 12,
    recommendedGearSkus: ["GEAR-ESIM-AIRALO-01"],
  },
  {
    id: "CHK-COM-002",
    title: "Designated Guardian Home Contact with Shared Itinerary",
    description:
      "Appoint one trusted individual at home who holds complete flight numbers, lodging addresses, local embassy numbers, and agrees to an escalation SLA if check-in is overdue by 3 hours.",
    pillarId: "PIL-COMMS",
    phaseId: "PHS-PRETRIP",
    criticality: "CRITICAL",
    isSPOF: true,
    verificationType: "TRUSTED_CONTACT_CONFIRMATION",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 20,
  },
  {
    id: "CHK-COM-003",
    title: "Laminated Physical Emergency Wallet Card",
    description:
      "Print and carry a business card-sized summary of embassy phone, national police, hotel name in local script, and blood type tucked behind the phone case or in shoe insole.",
    pillarId: "PIL-COMMS",
    phaseId: "PHS-STAGING",
    criticality: "STANDARD",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 5,
  },
  {
    id: "CHK-COM-004",
    title: "Reserve 10,000mAh Power Bank Staged in Daypack",
    description:
      "Never leave accommodation without an independent charged power bank and durable cable. A depleted smartphone battery turns minor navigation hiccups into major vulnerabilities.",
    pillarId: "PIL-COMMS",
    phaseId: "PHS-DAYROAM",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 8,
    recommendedGearSkus: ["GEAR-ANKER-10K-01"],
  },

  // --- 5. STREET THREAT VECTORS (PIL-THREAT) ---
  {
    id: "CHK-THR-001",
    title: "Spatial Boundary & Open-Palm Deflection Trained",
    description:
      "Commit to immediate 90-degree step-aside and chest-height open-palm gesture whenever an unsolicited stranger closes distance to under 1 meter. Prevents pickpocket surrounding maneuvers.",
    pillarId: "PIL-THREAT",
    phaseId: "PHS-DAYROAM",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "MODERATE",
    truthTableRef: "TT-STREET-ENCOUNTER-01",
    scoringDeductionPoints: 10,
  },
  {
    id: "CHK-THR-002",
    title: "Zero Acceptance of Unbadged Plainclothes Authority",
    description:
      "Never show or surrender passport or wallet to individuals claiming to be undercover narcotics or immigration police on the street. Demand to walk directly to the nearest uniform police station.",
    pillarId: "PIL-THREAT",
    phaseId: "PHS-DAYROAM",
    criticality: "CRITICAL",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "MODERATE",
    truthTableRef: "TT-STREET-ENCOUNTER-01",
    scoringDeductionPoints: 15,
  },
  {
    id: "CHK-THR-003",
    title: "Drink Surveillance & Cap Preservation Protocol",
    description:
      "Order bottled beverages opened in direct sight; never set a beverage on a table or accept drinks ordered outside visual perimeter. Never leave a venue with an impromptu social acquaintance alone.",
    pillarId: "PIL-THREAT",
    phaseId: "PHS-NIGHTROAM",
    criticality: "CRITICAL",
    isSPOF: true,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["solo-female", "budget-backpacker", "first-time-solo"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 20,
    recommendedGearSkus: ["GEAR-DRINK-CAP-01"],
  },

  // --- 6. DIGITAL PRIVACY & DATA HYGIENE (PIL-DIGITAL) ---
  {
    id: "CHK-DIG-001",
    title: "Hardware USB Data Blocker for Public Kiosks",
    description:
      "Interpose a physical data-pin severed adapter between public airport USB charging receptacles and your smartphone to prevent Juice-Jacking malware exploitation.",
    pillarId: "PIL-DIGITAL",
    phaseId: "PHS-AIRSIDE",
    criticality: "STANDARD",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["digital-nomad"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 5,
    recommendedGearSkus: ["GEAR-USB-BLOCKER-01"],
  },
  {
    id: "CHK-DIG-002",
    title: "WireGuard / Self-Hosted Encrypted VPN Tunnel Enforced",
    description:
      "Configure automatic 'kill switch' VPN routing on laptop and mobile devices across all untrusted public cafe and hotel Wi-Fi networks.",
    pillarId: "PIL-DIGITAL",
    phaseId: "PHS-DAYROAM",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["digital-nomad", "all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 8,
  },

  // --- 7. CONSULAR & EMERGENCY JURISDICTION (PIL-CONSULAR) ---
  {
    id: "CHK-CON-001",
    title: "National Consular Registration Completed (STEP / Smartraveller)",
    description:
      "Enroll itinerary in government travel notification registry (US STEP, UK Travel Advice, Australian Smartraveller) to facilitate consular crisis location during natural disasters or civil unrest.",
    pillarId: "PIL-CONSULAR",
    phaseId: "PHS-PRETRIP",
    criticality: "HIGH",
    isSPOF: false,
    verificationType: "CONSULAR_REG_ID",
    applicableArchetypes: ["all"],
    minimumRiskTier: "MODERATE",
    scoringDeductionPoints: 10,
  },
  {
    id: "CHK-CON-002",
    title: "Verified Repatriation Medical Evacuation Insurance",
    description:
      "Confirm travel insurance policy includes minimum $250,000 emergency medical transportation and international air ambulance extraction.",
    pillarId: "PIL-CONSULAR",
    phaseId: "PHS-PRETRIP",
    criticality: "CRITICAL",
    isSPOF: true,
    verificationType: "MANUAL_CHECK",
    applicableArchetypes: ["all"],
    minimumRiskTier: "LOW",
    scoringDeductionPoints: 25,
    recommendedGearSkus: ["GEAR-SAFETYWING-01"],
  },
];
