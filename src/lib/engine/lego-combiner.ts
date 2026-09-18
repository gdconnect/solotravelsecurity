import type { AirportSecurityHub, IngressPlaybookResult } from "@/lib/schemas/lego-blocks";
import { getAirportByIata } from "@/data/lego/airports";
import { getScamsForDestination } from "@/data/lego/scams";
import { getDestinationBySlug } from "@/data/destinations";

export interface CombinerOptions {
  iata: string;
  arrivalHour: number; // 0 - 23
  archetypeSlug: string; // 'solo-female' | 'first-time-solo' | 'digital-nomad' | etc.
  luggageProfile?: "light_backpack" | "single_roller" | "heavy_multiple_bags";
  budgetTier?: "budget" | "balanced" | "safety_first";
}

/**
 * Calculates a quantitative Ingress Risk Score (0 - 100) based on
 * airport layout, arrival hour, curfew status, traveler vulnerability, and luggage encumbrance.
 */
export function calculateIngressRiskScore(
  hub: AirportSecurityHub,
  arrivalHour: number,
  archetypeSlug: string,
  luggageProfile: "light_backpack" | "single_roller" | "heavy_multiple_bags" = "single_roller",
): { score: number; tier: "Low" | "Moderate" | "High" | "Critical" } {
  let score = 15; // Base baseline for any airport arrival

  // 1. Arrival Hour / Curfew Penalties
  const isNight = arrivalHour >= 22 || arrivalHour <= 5;
  const isAfterCurfew =
    hub.lateNightCurfew.curfewVulnerabilityHour > 0 &&
    (arrivalHour >= hub.lateNightCurfew.curfewVulnerabilityHour || arrivalHour <= 5);

  if (isNight) score += 20;
  if (isAfterCurfew) score += 25;

  // 2. Airport Hallway Tout Severity
  if (hub.scamToutWarning.activeInTerminal) {
    score += 15;
  }

  // 3. Archetype Vulnerability Adjustments
  if (archetypeSlug === "first-time-solo") {
    score += 10;
  } else if (archetypeSlug === "solo-female" && isNight) {
    score += 10;
  }

  // 4. Luggage Encumbrance
  if (luggageProfile === "heavy_multiple_bags") {
    score += 10;
  } else if (luggageProfile === "light_backpack") {
    score -= 5;
  }

  const finalScore = Math.min(100, Math.max(0, score));

  let tier: "Low" | "Moderate" | "High" | "Critical" = "Low";
  if (finalScore >= 75) tier = "Critical";
  else if (finalScore >= 50) tier = "High";
  else if (finalScore >= 30) tier = "Moderate";

  return { score: finalScore, tier };
}

/**
 * Executes a deterministic Decision Table to recommend the optimal transit mode
 * and step-by-step staging protocol.
 */
export function evaluateTransitDecisionTable(
  hub: AirportSecurityHub,
  arrivalHour: number,
  riskTier: "Low" | "Moderate" | "High" | "Critical",
  budgetTier: "budget" | "balanced" | "safety_first" = "balanced",
): {
  recommendedMode: string;
  protocolSteps: string[];
  safeWaitingOption?: string;
} {
  const isPastCurfew =
    hub.lateNightCurfew.curfewVulnerabilityHour > 0 &&
    (arrivalHour >= hub.lateNightCurfew.curfewVulnerabilityHour || arrivalHour <= 5);

  // RULE 1: Critical Risk or Past Curfew -> Lock down to Official Kiosk or Pre-Booked
  if (isPastCurfew || riskTier === "Critical") {
    const steps = [
      `DO NOT exit the secure terminal into public parking or unstaffed areas.`,
      `Ignore any individual inside the baggage claim or hallway asking if you need a taxi, shuttle, or claiming trains are cancelled.`,
      `Head directly to the official dispatch desk: ${hub.officialTaxi.exactKioskLocation}.`,
      `Verify vehicle marks before loading luggage: ${hub.officialTaxi.officialVehicleVisualMarks[0]}.`,
    ];

    if (hub.officialTaxi.fareStructure === "flat_rate" && hub.officialTaxi.flatRateCityCenterEur) {
      steps.push(
        `Confirm the flat rate of €${hub.officialTaxi.flatRateCityCenterEur} before sitting in the vehicle.`,
      );
    }

    const safeWaiting =
      hub.safeWaitingZones.length > 0
        ? `If arriving exhausted between 01:00 and 05:00, stage at ${hub.safeWaitingZones[0].name} (${hub.safeWaitingZones[0].location}) until daylight.`
        : undefined;

    return {
      recommendedMode: "Official Municipality Taxi Booth or Pre-Booked Licensed Transfer",
      protocolSteps: steps,
      safeWaitingOption: safeWaiting,
    };
  }

  // RULE 2: Daytime / Evening with active express rail
  if (
    hub.lateNightCurfew.expressRailLastDeparture !== "None" &&
    !isPastCurfew &&
    budgetTier !== "safety_first"
  ) {
    return {
      recommendedMode: "Airport Express Rail / Dedicated Dedicated Track",
      protocolSteps: [
        `Clear customs and follow overhead illuminated signs for the Airport Train / Rail Link.`,
        `Purchase ticket via official ticket vending machine or contactless card tap; avoid ununiformed touts offering to 'help' buy tickets.`,
        `Board the direct express train to the primary city terminal. Keep backpack in front of you while standing.`,
        `Upon reaching central station, do not linger on the platform; proceed directly to your connecting line or pre-mapped exit.`,
      ],
    };
  }

  // RULE 3: Balanced / Rideshare
  if (!hub.rideshare.isGeofencedOrBanned && hub.rideshare.servicesAllowed.length > 0) {
    return {
      recommendedMode: `Licensed App Rideshare (${hub.rideshare.servicesAllowed.join(", ")})`,
      protocolSteps: [
        `Order the vehicle via the app while still inside the air-conditioned, well-lit terminal.`,
        `Wait inside until the driver is within 2 minutes of the pickup zone: ${hub.rideshare.designatedPickupZone}.`,
        `Match the license plate number on the car with the plate displayed in your app before opening the door.`,
        `Ask the driver 'Who are you picking up?'—never state your name first.`,
      ],
    };
  }

  // Default Fallback
  return {
    recommendedMode: "Official Metered Airport Taxi Desk",
    protocolSteps: [
      `Locate the official taxi booth at: ${hub.officialTaxi.exactKioskLocation}.`,
      `Ensure driver starts the meter upon departure.`,
    ],
  };
}

/**
 * Assembles the full Ingress Playbook by combining:
 * Airport Hub + Time + Persona + Decision Table + Threat Scams + Truth Tables
 */
export function assembleAirportIngressPlaybook(
  options: CombinerOptions,
): IngressPlaybookResult | undefined {
  const hub = getAirportByIata(options.iata);
  if (!hub) return undefined;

  const { score, tier } = calculateIngressRiskScore(
    hub,
    options.arrivalHour,
    options.archetypeSlug,
    options.luggageProfile,
  );

  const transitDecision = evaluateTransitDecisionTable(
    hub,
    options.arrivalHour,
    tier,
    options.budgetTier,
  );

  const destination = getDestinationBySlug(hub.citySlug);
  const relevantScams = getScamsForDestination(hub.citySlug);

  // Extract all truth table checks from relevant scams
  const truthTableChecks: string[] = [];
  relevantScams.forEach((scam) => {
    scam.truthTable.conditions.forEach((c) => {
      truthTableChecks.push(`[${scam.name}] ${c.conditionText}`);
    });
  });

  return {
    hub,
    arrivalHour: options.arrivalHour,
    archetypeSlug: options.archetypeSlug,
    ingressRiskScore: score,
    riskTier: tier,
    recommendedTransitMode: transitDecision.recommendedMode,
    transitProtocolSteps: transitDecision.protocolSteps,
    safeWaitingOption: transitDecision.safeWaitingOption,
    relevantScams,
    truthTableChecks,
    printableEmergencyData: {
      policeNumber: destination?.emergencyNumbers.generalOrPolice || "112",
      ambulanceNumber: destination?.emergencyNumbers.ambulance || "112",
      embassyNumber: "+1-202-501-4444", // International consular assistance
      officialTaxiKiosk: hub.officialTaxi.exactKioskLocation,
      localAddressNative: undefined,
    },
  };
}

/**
 * Helper to build high-converting pSEO metadata for an Airport + Late Night combination
 */
export function generateAirportPseoMetadata(
  hub: AirportSecurityHub,
  archetypeLabel: string = "Solo Female",
) {
  const title = `${hub.iata} Airport Late Night Arrival: ${archetypeLabel} Safety Guide (${hub.city})`;
  const description = `Field-tested late night arrival guide for ${hub.name} (${hub.iata}). Official taxi stand coordinates, train curfew (${hub.lateNightCurfew.expressRailLastDeparture}), rogue tout truth tables, and safe 24h waiting zones.`;

  return {
    title,
    description,
    keywords: [
      `${hub.iata} late night arrival`,
      `${hub.name} taxi scam`,
      `${hub.city} airport midnight transit`,
      `${archetypeLabel.toLowerCase()} safe arrival ${hub.city}`,
      `${hub.iata} official taxi booth`,
      `${hub.iata} train curfew`,
    ],
  };
}
