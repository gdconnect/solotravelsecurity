/**
 * src/lib/guardian/sla-engine.ts
 *
 * Guardian SLA Contract & Escalation State Machine Engine.
 * Implements Decision Table DT-GUARDIAN-SLA-01 and Guardian SLA Matrix.
 */

import guardianMatrix from "@/data/search/guardian-sla-matrix.json";

export type GuardianStatus = "GREEN" | "AMBER" | "RED";

export interface SlaEscalationStep {
  stepNumber: number;
  triggerDelayMinutes: number;
  actionChannel: string;
  targetRecipient: string;
  payloadType: string;
}

export interface GuardianContract {
  contractId: string;
  tier: "free_tripwire" | "single_trip_pass" | "annual_explorer" | "family_syndicate";
  travelerId: string;
  travelerName: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsorPhone: string;
  destinationCity: string;
  destinationCountry: string;
  checkInFrequencyHours: number;
  silentGracePeriodMinutes: number;
  status: GuardianStatus;
  lastHeartbeatUtc: string;
  nextWindowUtc: string;
  escalationLadder: SlaEscalationStep[];
  consularPacket: {
    embassyName: string;
    crisisPhone: string;
    localEmergencyNumbers: {
      police: string;
      ambulance: string;
      touristPolice?: string;
    };
    lastKnownLodgingAddress: string;
  };
}

export interface EscalationEvaluationResult {
  currentStatus: GuardianStatus;
  nextStatus: GuardianStatus;
  actionRequired: boolean;
  actionChannel: string;
  transmitConsularPacket: boolean;
  message: string;
}

/**
 * Generates a formal Guardian SLA Contract for a parent/sponsor.
 */
export function createGuardianContract(
  travelerName: string,
  sponsorName: string,
  sponsorEmail: string,
  sponsorPhone: string,
  destinationCity: string,
  destinationCountry: string,
  tier:
    | "free_tripwire"
    | "single_trip_pass"
    | "annual_explorer"
    | "family_syndicate" = "single_trip_pass",
  checkInFrequencyHours: number = 24,
): GuardianContract {
  const selectedTier =
    guardianMatrix.tiers.find((t) => t.tierId === tier) || guardianMatrix.tiers[1];
  const now = new Date();
  const nextWindow = new Date(now.getTime() + checkInFrequencyHours * 3600 * 1000);

  return {
    contractId: `SLA-${destinationCity.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    tier,
    travelerId: `TRV-${Date.now().toString(36).toUpperCase()}`,
    travelerName,
    sponsorName,
    sponsorEmail,
    sponsorPhone,
    destinationCity,
    destinationCountry,
    checkInFrequencyHours,
    silentGracePeriodMinutes: selectedTier.features.silentGracePeriodMinutes,
    status: "GREEN",
    lastHeartbeatUtc: now.toISOString(),
    nextWindowUtc: nextWindow.toISOString(),
    escalationLadder: guardianMatrix.escalationLadderDefaults as SlaEscalationStep[],
    consularPacket: {
      embassyName: `Embassy Crisis Desk in ${destinationCountry}`,
      crisisPhone: "+1-202-501-4444",
      localEmergencyNumbers: {
        police: "112",
        ambulance: "112",
        touristPolice: "1155",
      },
      lastKnownLodgingAddress: `Verified Lodging Sanctuary in ${destinationCity}`,
    },
  };
}

/**
 * Evaluates minutes overdue against DT-GUARDIAN-SLA-01 escalation ladder.
 */
export function evaluateGuardianHeartbeat(
  overdueMinutes: number,
  currentStatus: GuardianStatus,
): EscalationEvaluationResult {
  if (overdueMinutes <= 0) {
    return {
      currentStatus: "GREEN",
      nextStatus: "GREEN",
      actionRequired: false,
      actionChannel: "none",
      transmitConsularPacket: false,
      message: "Check-in window active. System status is normal.",
    };
  }

  if (overdueMinutes <= 30) {
    return {
      currentStatus,
      nextStatus: "GREEN",
      actionRequired: true,
      actionChannel: "sms_traveler",
      transmitConsularPacket: false,
      message: "Silent grace period: Dispatched friendly SMS nudge to traveler.",
    };
  }

  if (overdueMinutes <= 60) {
    return {
      currentStatus,
      nextStatus: "AMBER",
      actionRequired: true,
      actionChannel: "email_sponsor",
      transmitConsularPacket: false,
      message: "Check-in overdue by 60m: Notifying sponsor via email (Amber status).",
    };
  }

  if (overdueMinutes <= 120) {
    return {
      currentStatus,
      nextStatus: "RED",
      actionRequired: true,
      actionChannel: "sms_sponsor",
      transmitConsularPacket: true,
      message: "Urgent: 120m overdue. Escalating to sponsor SMS and prepping consular packet.",
    };
  }

  return {
    currentStatus: "RED",
    nextStatus: "RED",
    actionRequired: true,
    actionChannel: "consular_dispatch_packet",
    transmitConsularPacket: true,
    message: "Critical Escalation: Transmitted emergency dossier and embassy hotlines to sponsor.",
  };
}
