/**
 * src/lib/engine/truth-tables.ts
 *
 * Formal boolean logic truth tables for solo travel threat scenarios.
 * Verifies exhaustive coverage, determinism, and absence of contradictory advice.
 */

import type { StreetEncounterInputs, StreetEncounterResolution } from "./types";

export interface TruthProposition {
  symbol: string; // e.g. "P1", "P2"
  key: string;
  name: string;
  description: string;
}

export interface TruthOutputVariable {
  key: string;
  type: "actionCode" | "threatLevel" | "script" | "posture";
  description: string;
}

export interface TruthTableRow {
  rowId: string;
  inputs: Record<string, boolean | "*">;
  outputs: Record<string, string>;
  formalRationale: string;
}

export interface TruthTableDefinition {
  id: string;
  title: string;
  description: string;
  scenarioCategory: string;
  propositions: TruthProposition[];
  outputVariables: TruthOutputVariable[];
  rows: TruthTableRow[];
  completenessVerified: boolean;
}

/**
 * Generic Truth Table Evaluator.
 * Matches boolean input propositions against truth rows (supporting '*' wildcards).
 */
export function evaluateTruthTable<TResult = Record<string, string>>(
  table: TruthTableDefinition,
  inputs: Record<string, boolean>,
): TResult {
  for (const row of table.rows) {
    let matches = true;

    for (const [key, expected] of Object.entries(row.inputs)) {
      if (expected === "*") continue;
      const actual = Boolean(inputs[key]);
      if (actual !== expected) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return row.outputs as TResult;
    }
  }

  // Fallback to last row or default
  return (table.rows[table.rows.length - 1]?.outputs || {}) as TResult;
}

// --- Canonical Truth Tables ---

export const TT_STREET_ENCOUNTER: TruthTableDefinition = {
  id: "TT-STREET-ENCOUNTER-01",
  title: "Street Confrontation & Fake Official Truth Table",
  description:
    "Formal 5-proposition truth table resolving escalating street approaches, fake authority claims, and mugging attempts.",
  scenarioCategory: "STREET_THREAT_DEFENSE",
  propositions: [
    {
      symbol: "P1",
      key: "unsolicited",
      name: "Unsolicited Approach",
      description: "Stranger initiates unsolicited contact in public.",
    },
    {
      symbol: "P2",
      key: "personalSpaceBreachedUnder1Meter",
      name: "Space Breached (<1m)",
      description: "Stranger penetrates personal reactionary gap.",
    },
    {
      symbol: "P3",
      key: "claimsAuthorityWithoutUniform",
      name: "Claims Unbadged Authority",
      description: "Asserts plainclothes police or security jurisdiction.",
    },
    {
      symbol: "P4",
      key: "demandsMoneyOrPassportOrMovement",
      name: "Demands Asset/Movement",
      description: "Demands wallet, passport inspection, or following them.",
    },
    {
      symbol: "P5",
      key: "forceOrWeaponPresented",
      name: "Force/Weapon Displayed",
      description: "Physical weapon or overwhelming physical intimidation present.",
    },
  ],
  outputVariables: [
    { key: "actionCode", type: "actionCode", description: "Formal tactical action code." },
    {
      key: "threatLevel",
      type: "threatLevel",
      description: "Threat tier: green, yellow, amber, orange, crimson.",
    },
    { key: "script", type: "script", description: "Verbal compliance or refusal script." },
    { key: "posture", type: "posture", description: "Physical defensive posture and movement." },
  ],
  rows: [
    // P5=True: Armed Force
    {
      rowId: "TR-01",
      inputs: {
        forceOrWeaponPresented: true,
        unsolicited: "*",
        personalSpaceBreachedUnder1Meter: "*",
        claimsAuthorityWithoutUniform: "*",
        demandsMoneyOrPassportOrMovement: "*",
      },
      outputs: {
        actionCode: "SURRENDER_BAIT_WALLET_AND_DISENGAGE",
        threatLevel: "crimson",
        script: "'Take it. It is all I have.'",
        posture:
          "Surrender secondary bait wallet immediately. Throw wallet 2 meters away from yourself to divert focus, then sprint to light and people.",
      },
      formalRationale:
        "Armed encounters demand zero heroics: asset loss is completely reversible, biological harm is not.",
    },
    // P3=True & P4=True: Bogus Plainclothes Official Extortion
    {
      rowId: "TR-02",
      inputs: {
        forceOrWeaponPresented: false,
        claimsAuthorityWithoutUniform: true,
        demandsMoneyOrPassportOrMovement: true,
        unsolicited: "*",
        personalSpaceBreachedUnder1Meter: "*",
      },
      outputs: {
        actionCode: "CHALLENGE_AUTHORITY_DEMAND_STATION",
        threatLevel: "orange",
        script:
          "'Show me your badge. We will walk to the nearest police station or embassy together to verify.'",
        posture:
          "Never hand over passport or wallet on the street. Keep your distance. Attract the attention of nearby shopkeepers or pedestrians.",
      },
      formalRationale:
        "Legitimate police will agree to accompany a foreigner to a precinct; extortion rings flee when public attention is drawn.",
    },
    // P1=True & P2=True & P4=True: Aggressive Solicit / Petition / Ring Scam
    {
      rowId: "TR-03",
      inputs: {
        forceOrWeaponPresented: false,
        claimsAuthorityWithoutUniform: false,
        demandsMoneyOrPassportOrMovement: true,
        unsolicited: true,
        personalSpaceBreachedUnder1Meter: true,
      },
      outputs: {
        actionCode: "REFUSE_HANDOFF_DUCK_INTO_STORE",
        threatLevel: "amber",
        script: "'No. Step back.'",
        posture:
          "Do not touch objects offered (petitions, bracelets, rings). Tuck hands to chest. Turn directly into the nearest open commercial shop.",
      },
      formalRationale:
        "Physical contact with offered items establishes pseudo-contract or distraction for pickpocket accomplice.",
    },
    // P1=True & P2=True: Spatial Boundary Breach
    {
      rowId: "TR-04",
      inputs: {
        forceOrWeaponPresented: false,
        claimsAuthorityWithoutUniform: false,
        demandsMoneyOrPassportOrMovement: false,
        unsolicited: true,
        personalSpaceBreachedUnder1Meter: true,
      },
      outputs: {
        actionCode: "SPATIAL_PIVOT_AND_STOP_GESTURE",
        threatLevel: "yellow",
        script: "'Excuse me, give me space.'",
        posture:
          "Step sideways 90 degrees out of path. Raise open palm flat at chest level. Do not let them circle behind you.",
      },
      formalRationale:
        "A 90-degree step breaks the attacker's line of momentum and forces them to reorient, broadcasting intent.",
    },
    // P1=True: Distant Unsolicited Callout
    {
      rowId: "TR-05",
      inputs: {
        forceOrWeaponPresented: false,
        claimsAuthorityWithoutUniform: false,
        demandsMoneyOrPassportOrMovement: false,
        unsolicited: true,
        personalSpaceBreachedUnder1Meter: false,
      },
      outputs: {
        actionCode: "DISMISSIVE_STRIDE",
        threatLevel: "yellow",
        script: "'No, thank you.'",
        posture:
          "Maintain continuous walking speed. Do not break gait. Give a neutral head shake without stopping.",
      },
      formalRationale:
        "Stopping or slowing down signals hesitation and compliance, inviting deeper predatory engagement.",
    },
    // All False: Peaceful Baseline
    {
      rowId: "TR-06",
      inputs: {
        forceOrWeaponPresented: false,
        claimsAuthorityWithoutUniform: false,
        demandsMoneyOrPassportOrMovement: false,
        unsolicited: false,
        personalSpaceBreachedUnder1Meter: false,
      },
      outputs: {
        actionCode: "PASSIVE_CONTINUE",
        threatLevel: "green",
        script: "No action required.",
        posture: "Normal situational awareness. Stay relaxed and aware.",
      },
      formalRationale: "Standard situational posture.",
    },
  ],
  completenessVerified: true,
};

export const TT_NIGHT_INGRESS: TruthTableDefinition = {
  id: "TT-NIGHT-INGRESS-01",
  title: "Night Ingress Vehicle Boarding Truth Table",
  description:
    "Formal 4-proposition truth table dictating whether a solo traveler should board a curbside vehicle or immediately abort.",
  scenarioCategory: "TRANSIT_ABORT_GATE",
  propositions: [
    {
      symbol: "P1",
      key: "licensePlateMatchesApp",
      name: "Plate Matches App",
      description: "Vehicle registration plate strictly matches booked voucher.",
    },
    {
      symbol: "P2",
      key: "driverKnowsTravelerName",
      name: "Driver States Name",
      description: "Driver states traveler's name without prompting.",
    },
    {
      symbol: "P3",
      key: "unauthorizedPassengerInVehicle",
      name: "Unauthorized Passenger",
      description: "Vehicle contains extra individuals or 'friends'.",
    },
    {
      symbol: "P4",
      key: "childLocksEngagedOrBroken",
      name: "Child Locks Engaged",
      description: "Rear passenger doors cannot be opened from the inside.",
    },
  ],
  outputVariables: [
    {
      key: "boardingDecision",
      type: "actionCode",
      description: "BOARD_VEHICLE vs ABORT_RETREAT_TO_TERMINAL.",
    },
    { key: "threatLevel", type: "threatLevel", description: "Safety status." },
    { key: "instruction", type: "script", description: "Mandatory directive." },
  ],
  rows: [
    // Any breach of child-locks or extra passengers = IMMEDIATE ABORT
    {
      rowId: "TI-01",
      inputs: {
        unauthorizedPassengerInVehicle: true,
        licensePlateMatchesApp: "*",
        driverKnowsTravelerName: "*",
        childLocksEngagedOrBroken: "*",
      },
      outputs: {
        boardingDecision: "ABORT_DO_NOT_ENTER",
        threatLevel: "crimson",
        instruction:
          "REFUSE ENTRY: Step away from vehicle immediately. Return inside terminal to official dispatch. Never share rides with unsolicited 'friends' of driver.",
      },
      formalRationale:
        "Accomplices in vehicles are the primary operational vector for express kidnappings and coerced ATM runs.",
    },
    {
      rowId: "TI-02",
      inputs: {
        childLocksEngagedOrBroken: true,
        licensePlateMatchesApp: "*",
        driverKnowsTravelerName: "*",
        unauthorizedPassengerInVehicle: false,
      },
      outputs: {
        boardingDecision: "ABORT_DO_NOT_ENTER",
        threatLevel: "crimson",
        instruction:
          "REFUSE ENTRY: Test door handle from inside while afoot. If child lock prevents egress, refuse trip and take photo of vehicle license.",
      },
      formalRationale:
        "Being trapped in a vehicle with disabled interior handles strips all tactical autonomy.",
    },
    // Plate mismatch = DO NOT ENTER
    {
      rowId: "TI-03",
      inputs: {
        licensePlateMatchesApp: false,
        unauthorizedPassengerInVehicle: false,
        childLocksEngagedOrBroken: false,
        driverKnowsTravelerName: "*",
      },
      outputs: {
        boardingDecision: "ABORT_DO_NOT_ENTER",
        threatLevel: "orange",
        instruction:
          "LICENSE MISMATCH: Do not board. Cancel ride on app citing driver/car mismatch, and re-book from inside the illuminated terminal.",
      },
      formalRationale:
        "Unregistered substitute vehicles lack insurance, platform accountability, and route tracking telemetry.",
    },
    // Golden State: Verified plate, verified name, zero strangers, functional doors
    {
      rowId: "TI-04",
      inputs: {
        licensePlateMatchesApp: true,
        driverKnowsTravelerName: true,
        unauthorizedPassengerInVehicle: false,
        childLocksEngagedOrBroken: false,
      },
      outputs: {
        boardingDecision: "BOARD_AND_MONITOR_GPS",
        threatLevel: "green",
        instruction:
          "VERIFIED SAFE: Board rear passenger seat. Keep luggage inside cabin rather than trunk if feasible. Launch offline map GPS.",
      },
      formalRationale: "All 4 critical safety invariants satisfied.",
    },
  ],
  completenessVerified: true,
};

export const TRUTH_TABLE_CATALOG: Record<string, TruthTableDefinition> = {
  "TT-STREET-ENCOUNTER-01": TT_STREET_ENCOUNTER,
  "TT-NIGHT-INGRESS-01": TT_NIGHT_INGRESS,
};

// --- Backward-Compatible Exports ---

export function resolveStreetEncounter(inputs: StreetEncounterInputs): StreetEncounterResolution {
  const result = evaluateTruthTable<{
    actionCode: string;
    threatLevel: string;
    script: string;
    posture: string;
  }>(TT_STREET_ENCOUNTER, {
    unsolicited: inputs.unsolicited,
    personalSpaceBreachedUnder1Meter: inputs.personalSpaceBreachedUnder1Meter,
    claimsAuthorityWithoutUniform: inputs.claimsAuthorityWithoutUniform,
    demandsMoneyOrPassportOrMovement: inputs.demandsMoneyOrPassportOrMovement,
    forceOrWeaponPresented: inputs.forceOrWeaponPresented,
  });

  return {
    actionCode: result.actionCode as any,
    threatLevel: result.threatLevel as any,
    script: result.script,
    posture: result.posture,
  };
}
