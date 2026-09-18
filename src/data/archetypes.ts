export interface ArchetypeProfile {
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  heroHeadline: string;
  coreConcerns: string[];
  recommendedGear: string[];
}

export const ARCHETYPES: ArchetypeProfile[] = [
  {
    slug: "solo-female",
    name: "Solo Female Traveler",
    shortLabel: "Solo Female",
    description:
      "Tailored situational awareness, transport verification, lodging entry security, and harassment de-escalation.",
    heroHeadline: "Calm, assertive autonomy for women exploring the world solo.",
    coreConcerns: [
      "Late night arrival & unverified taxi risks",
      "Ground floor room & intrusion vulnerabilities",
      "Persistent street harassment & spatial boundary violations",
      "Drink spiking & social engineering in nightlife zones",
    ],
    recommendedGear: [
      "High-decibel personal alarm or whistle",
      "Rubber wedge doorstop for interior hotel/rental door",
      "Cross-body anti-slash bag with lockable zippers",
      "Secondary bait wallet with expired cards & small bills",
    ],
  },
  {
    slug: "first-time-solo",
    name: "First-Time Solo Explorer",
    shortLabel: "First-Time Solo",
    description:
      "Structured guardrails, transit navigation, scam literacy, and calm habits to replace beginner anxiety.",
    heroHeadline: "The step-by-step operating system for your very first solo trip.",
    coreConcerns: [
      "Overwhelm and sensory overload in transit hubs",
      "Falling for classic friendly stranger distraction scams",
      "Losing phone or bank card with zero redundancy",
      "Feeling isolated or panic when unexpected hiccups occur",
    ],
    recommendedGear: [
      "Two payment cards stashed in separate bags",
      "Preloaded eSIM with active data upon touchdown",
      "Physical paper emergency contact card tucked in shoe or passport cover",
      "Compact 10,000mAh power bank to avoid dead phone battery",
    ],
  },
  {
    slug: "digital-nomad",
    name: "Digital Nomad & Remote Worker",
    shortLabel: "Digital Nomad",
    description:
      "Workstation asset security, public Wi-Fi hygiene, dual eSIM failover, and long-term rental lockdown.",
    heroHeadline: "Protect your livelihood, laptops, and credentials while working anywhere.",
    coreConcerns: [
      "Laptop theft in cafes, co-workings, and transit buses",
      "Credential theft / session hijacking over unencrypted public Wi-Fi",
      "Single-point-of-failure 2FA phone lockouts while abroad",
      "Unvetted Airbnb host access and insecure long-stay locks",
    ],
    recommendedGear: [
      "Hardware 2FA Security Key (YubiKey) with offline recovery codes",
      "Kensington laptop cable lock or motion-alarm bag anchor",
      "Privacy screen filter for working in public transit & cafes",
      "Secondary backup phone with cloned 2FA authenticators",
    ],
  },
  {
    slug: "budget-backpacker",
    name: "Budget Backpacker & Hosteller",
    shortLabel: "Backpacker",
    description:
      "Shared dorm security, night transit survival, cash stash distribution, and border crossing hygiene.",
    heroHeadline: "Travel light, stay safe, and protect your gear in shared spaces.",
    coreConcerns: [
      "Hostel dorm theft during showers or night sleep",
      "Overnight bus baggage compartment slashing or theft",
      "Border crossing extortion and unofficial fee scams",
      "ATM skimming and currency exchange sleight-of-hand",
    ],
    recommendedGear: [
      "Heavy-duty brass combination padlock for hostel lockers",
      "Hidden under-clothing waist/neck passport pouch",
      "Pack-safe wire mesh or steel cable for transit luggage lock",
      "Offline translation & currency converter apps pre-downloaded",
    ],
  },
  {
    slug: "senior-solo",
    name: "Independent Senior Solo Traveler",
    shortLabel: "Senior Solo",
    description:
      "Mobility-aware routing, medical triage preparedness, gentle transit transitions, and scam defense.",
    heroHeadline: "Dignified, comfortable, and thoroughly prepared solo exploration.",
    coreConcerns: [
      "Uneven pavements, stairs without handrails, and transit fatigue",
      "Aggressive luggage touts and baggage handling scams",
      "Medical prescription loss or emergency healthcare access",
      "Complex smartphone navigation under low-light conditions",
    ],
    recommendedGear: [
      "High-visibility medical alert card with translated allergies",
      "Hardcopy paper itineraries and transit maps in large print",
      "Pre-booked airport meet-and-assist transit services",
      "Lightweight ergonomic spinner luggage with built-in locks",
    ],
  },
];

export function getArchetypeBySlug(slug: string): ArchetypeProfile | undefined {
  return ARCHETYPES.find((a) => a.slug === slug.toLowerCase());
}
