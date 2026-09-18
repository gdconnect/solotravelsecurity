/**
 * src/lib/engine/decision-tables.ts
 *
 * Multi-variable condition-action decision tables for solo travel security.
 * Replaces ambiguous advice with deterministic, testable tabular protocols.
 */

import type { TripContext, TravelerProfile } from "./types";

export interface DecisionConditionColumn {
  key: string;
  label: string;
  type: "enum" | "boolean" | "range" | "string";
  allowedValues?: string[];
  unit?: string;
}

export interface DecisionActionColumn {
  key: string;
  label: string;
  type: "directive" | "code" | "hardware" | "warning";
}

export interface DecisionRuleRow {
  ruleId: string;
  scenario: string;
  priority: number;
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
}

export interface DecisionTableDefinition {
  id: string;
  title: string;
  description: string;
  pillarId: string;
  conditionColumns: DecisionConditionColumn[];
  actionColumns: DecisionActionColumn[];
  rules: DecisionRuleRow[];
  defaultAction: Record<string, unknown>;
}

/**
 * Generic Decision Table Evaluator.
 * Matches input criteria against priority-ordered rules. Supports wildcards ('*').
 */
export function evaluateDecisionTable<TResult = Record<string, unknown>>(
  table: DecisionTableDefinition,
  inputs: Record<string, unknown>,
): TResult {
  const sortedRules = [...table.rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    let matches = true;

    for (const [condKey, expectedVal] of Object.entries(rule.conditions)) {
      const inputVal = inputs[condKey];

      // Wildcard matches anything
      if (expectedVal === "*") continue;

      if (Array.isArray(expectedVal)) {
        if (!expectedVal.includes(inputVal)) {
          matches = false;
          break;
        }
      } else if (typeof expectedVal === "boolean") {
        if (Boolean(inputVal) !== expectedVal) {
          matches = false;
          break;
        }
      } else if (inputVal !== expectedVal) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { ...table.defaultAction, ...rule.actions } as TResult;
    }
  }

  return table.defaultAction as TResult;
}

// --- Canonical Decision Tables ---

export const DT_INGRESS_TRANSIT: DecisionTableDefinition = {
  id: "DT-INGRESS-TRANSIT-01",
  title: "First-Mile Arrival Transit Protocol Matrix",
  description:
    "Deterministic decision matrix determining safe transit modes from airport/train hub to initial accommodation.",
  pillarId: "PIL-TRANSIT",
  conditionColumns: [
    {
      key: "riskTier",
      label: "Destination Risk Tier",
      type: "enum",
      allowedValues: ["LOW", "MODERATE", "ELEVATED", "HIGH"],
    },
    { key: "isNightArrival", label: "Night Arrival (21:00-06:00)", type: "boolean" },
    {
      key: "genderIdentity",
      label: "Gender Identity",
      type: "enum",
      allowedValues: ["female", "male", "non_binary_queer", "prefer_not_to_say"],
    },
    { key: "hasPrebookedTransit", label: "Pre-Booked Verified Transit", type: "boolean" },
  ],
  actionColumns: [
    { key: "protocol", label: "Recommended Transit Protocol", type: "directive" },
    { key: "stagingArea", label: "Arrival Staging Waiting Area", type: "directive" },
    { key: "cashStrategy", label: "Cash Acquisition Strategy", type: "directive" },
    { key: "contingencyFallback", label: "Disruption Fallback", type: "warning" },
  ],
  rules: [
    // Rule 1: High risk environment always mandates vetted security transfer
    {
      ruleId: "R-HIGH-ALL",
      scenario: "High Risk Tier Destination",
      priority: 100,
      conditions: {
        riskTier: "HIGH",
        isNightArrival: "*",
        genderIdentity: "*",
        hasPrebookedTransit: "*",
      },
      actions: {
        protocol:
          "Pre-vetted private security transfer with verified dispatch code and driver photo.",
        stagingArea: "Remain airside inside baggage reclaim until driver sends matching pin photo.",
        cashStrategy:
          "Carry crisp reserve currency; do not use public street ATMs under any circumstance.",
        contingencyFallback:
          "If escort fails to arrive, book airside transit hotel; do NOT exit terminal.",
      },
    },
    // Rule 2: Moderate/Elevated at night or solo female
    {
      ruleId: "R-MOD-NIGHT-FEMALE",
      scenario: "Moderate or Elevated Risk at Night / Solo Female",
      priority: 80,
      conditions: {
        riskTier: ["MODERATE", "ELEVATED"],
        isNightArrival: true,
        genderIdentity: "*",
        hasPrebookedTransit: "*",
      },
      actions: {
        protocol:
          "Pre-arranged hotel transfer or official prepaid kiosk voucher inside arrivals hall ONLY.",
        stagingArea: "Lit indoor arrivals concourse near information desk.",
        cashStrategy: "Use indoor bank-branded terminal ATM with hand shielding before exit doors.",
        contingencyFallback:
          "If driver is missing, do NOT accept curbside offers. Walk back inside to information desk.",
      },
    },
    // Rule 3: Moderate daytime with prebooked transit
    {
      ruleId: "R-MOD-DAY-PREBOOKED",
      scenario: "Moderate Risk Daytime with Prebooked Transit",
      priority: 60,
      conditions: {
        riskTier: ["MODERATE", "ELEVATED"],
        isNightArrival: false,
        genderIdentity: "*",
        hasPrebookedTransit: true,
      },
      actions: {
        protocol:
          "Proceed directly to pre-arranged meeting point. Cross-verify driver name on placard.",
        stagingArea: "Designated meeting column inside terminal.",
        cashStrategy: "Airside terminal ATM withdrawal.",
        contingencyFallback:
          "Fallback to official prepaid terminal taxi booth inside arrivals hall.",
      },
    },
    // Rule 4: Low risk night arrival
    {
      ruleId: "R-LOW-NIGHT",
      scenario: "Low Risk Tier at Night",
      priority: 40,
      conditions: {
        riskTier: "LOW",
        isNightArrival: true,
        genderIdentity: "*",
        hasPrebookedTransit: "*",
      },
      actions: {
        protocol:
          "Official Airport Taxi Queue or App Dispatch (Uber/Grab/Bolt) from marked pickup zone.",
        stagingArea: "Indoor passenger waiting area until app indicates driver has pulled up.",
        cashStrategy: "Use indoor terminal ATM; avoid outdoor street cash machines after dark.",
        contingencyFallback:
          "Remain inside the lit passenger arrivals hall until driver confirms arrival on app.",
      },
    },
    // Rule 5: Low risk daytime
    {
      ruleId: "R-LOW-DAY",
      scenario: "Low Risk Tier Daytime",
      priority: 20,
      conditions: {
        riskTier: "LOW",
        isNightArrival: false,
        genderIdentity: "*",
        hasPrebookedTransit: "*",
      },
      actions: {
        protocol: "Express Airport Train / Official Metro. Clean, rapid, zero tout exposure.",
        stagingArea: "Follow direct train/metro wayfinding signs inside terminal.",
        cashStrategy: "Pull modest local cash at arrival terminal ATM inside security perimeter.",
        contingencyFallback:
          "Head to official airport taxi queue if trains are delayed; ignore freelance drivers.",
      },
    },
  ],
  defaultAction: {
    protocol:
      "Prepaid taxi booth inside arrivals hall. Insist on printed voucher receipt before walking out.",
    stagingArea: "Lit indoor arrivals concourse.",
    cashStrategy:
      "Withdraw moderate cash at arrivals terminal ATM. Stash half in secondary pouch immediately.",
    contingencyFallback:
      "Book rideshare from terminal pickup zone; verify license plate and driver name before unlocking doors.",
  },
};

export const DT_LODGING_FLOOR: DecisionTableDefinition = {
  id: "DT-LODGING-FLOOR-01",
  title: "Sanctuary Vetting & Floor Allocation Matrix",
  description:
    "Evaluates floor assignment and accommodation type to determine mandatory security actions and hardware deployment.",
  pillarId: "PIL-PERIMETER",
  conditionColumns: [
    {
      key: "lodgingType",
      label: "Lodging Type",
      type: "enum",
      allowedValues: ["hotel", "hostel_dorm", "hostel_private", "rental_airbnb"],
    },
    {
      key: "lodgingFloor",
      label: "Assigned Floor",
      type: "enum",
      allowedValues: ["ground", "floors_2_to_4", "floors_5_plus", "unknown"],
    },
  ],
  actionColumns: [
    { key: "primaryAction", label: "Mandatory Action Directive", type: "directive" },
    { key: "hardwareRequired", label: "Hardware Equipment Required", type: "hardware" },
    { key: "riskAlert", label: "Perimeter Vulnerability Level", type: "warning" },
  ],
  rules: [
    {
      ruleId: "R-GROUND-ALL",
      scenario: "Ground Floor Room",
      priority: 90,
      conditions: { lodgingType: "*", lodgingFloor: "ground" },
      actions: {
        primaryAction:
          "MANDATORY ACTION: Request upper-floor room (floors 2–4) at front desk upon check-in. If unavailable, deploy rubber wedge on main door and verify all window latches are locked.",
        hardwareRequired: "Vulcanized rubber doorstop wedge, secondary portable travel lock.",
        riskAlert:
          "ELEVATED PERIMETER RISK: Ground rooms suffer 4x higher burglary and window tampering rates.",
      },
    },
    {
      ruleId: "R-SWEETSPOT-ALL",
      scenario: "Floors 2 to 4 (The Security Sweetspot)",
      priority: 80,
      conditions: { lodgingType: "*", lodgingFloor: "floors_2_to_4" },
      actions: {
        primaryAction:
          "OPTIMAL PLACEMENT: Verify peephole is clear, test interior deadbolt/swing latch, deploy wedge, and count doors to closest fire stairwell.",
        hardwareRequired: "Vulcanized rubber doorstop wedge.",
        riskAlert:
          "MINIMAL EXPOSURE: Above street climbing reach and within fire ladder rescue envelope.",
      },
    },
    {
      ruleId: "R-HIGHRISE-ALL",
      scenario: "Floor 5 and Above (High-Rise)",
      priority: 70,
      conditions: { lodgingType: "*", lodgingFloor: "floors_5_plus" },
      actions: {
        primaryAction:
          "FIRE DISCIPLINE: Count doorway frames along wall to fire escape stairs. Verify fire exit door is unlocked from the guest corridor side.",
        hardwareRequired: "Rubber wedge, smoke hood (optional for high-rise).",
        riskAlert:
          "FIRE EVACUATION SENSITIVE: Exceeds standard municipal fire ladder truck reaches (30 meters).",
      },
    },
  ],
  defaultAction: {
    primaryAction:
      "STANDARD AUDIT: Inspect deadbolt, deploy rubber wedge, and count doors to fire stairs.",
    hardwareRequired: "Vulcanized rubber doorstop wedge.",
    riskAlert: "STANDARD BASELINE.",
  },
};

export const DECISION_TABLE_CATALOG: Record<string, DecisionTableDefinition> = {
  "DT-INGRESS-TRANSIT-01": DT_INGRESS_TRANSIT,
  "DT-LODGING-FLOOR-01": DT_LODGING_FLOOR,
};

// --- Backward-Compatible Exports ---

export function resolveArrivalTransit(
  trip: TripContext,
  profile: TravelerProfile,
  isNightArrival: boolean,
): {
  protocol: string;
  cashStrategy: string;
  contingencyFallback: string;
} {
  const result = evaluateDecisionTable<{
    protocol: string;
    cashStrategy: string;
    contingencyFallback: string;
  }>(DT_INGRESS_TRANSIT, {
    riskTier: trip.destinationRiskTier.toUpperCase(),
    isNightArrival,
    genderIdentity: profile.genderIdentity,
    hasPrebookedTransit: trip.hasPrebookedVerifiedTransit,
  });

  return {
    protocol: result.protocol,
    cashStrategy: result.cashStrategy,
    contingencyFallback: result.contingencyFallback,
  };
}

export function resolveLodgingAction(trip: TripContext): string {
  const result = evaluateDecisionTable<{ primaryAction: string }>(DT_LODGING_FLOOR, {
    lodgingType: trip.lodgingType,
    lodgingFloor: trip.lodgingFloor,
  });

  return result.primaryAction;
}
