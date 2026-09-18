import { setup, assign } from "xstate";
import type { RiskTier } from "../engine/types";

export interface QuizContext {
  destinationCity: string;
  destinationCountry: string;
  destinationRiskTier: RiskTier;
  archetype: string;
  arrivalHour: number;
  transitMode: "flight" | "train" | "bus";
  prebookedTransit: boolean;
  lodgingType: "hotel" | "hostel" | "rental_airbnb";
  lodgingFloor: "ground" | "floors_2_to_4" | "floors_5_plus" | "unknown";
  cardCount: number;
  cardsSegregated: boolean;
  cellularType: "esim" | "roaming" | "wifi_only";
  hasEmergencyContact: boolean;
  score: number;
  spofs: string[];
}

export type QuizEvents =
  | { type: "INIT_PRELOAD"; payload: Partial<QuizContext> }
  | {
      type: "SUBMIT_ARRIVAL";
      arrivalHour: number;
      transitMode: "flight" | "train" | "bus";
      prebookedTransit: boolean;
    }
  | {
      type: "SUBMIT_LODGING";
      lodgingType: "hotel" | "hostel" | "rental_airbnb";
      lodgingFloor: "ground" | "floors_2_to_4" | "floors_5_plus" | "unknown";
    }
  | {
      type: "SUBMIT_REDUNDANCY";
      cardCount: number;
      cardsSegregated: boolean;
      cellularType: "esim" | "roaming" | "wifi_only";
      hasEmergencyContact: boolean;
    }
  | { type: "RESTART" };

export const quizMachine = setup({
  types: {
    context: {} as QuizContext,
    events: {} as QuizEvents,
  },
  actions: {
    computeScore: assign(({ context }) => {
      let score = 100;
      const spofs: string[] = [];

      if (context.cardCount < 2) {
        score -= 25;
        spofs.push(
          "Single Payment Card (Critical SPOF): If swallowed or blocked, you have zero immediate funds.",
        );
      }
      if (!context.cardsSegregated) {
        score -= 15;
        spofs.push("Cards Kept Together: If your bag or wallet is stolen, all cards are lost.");
      }
      if (
        context.arrivalHour >= 21 &&
        !context.prebookedTransit &&
        context.destinationRiskTier !== "Low"
      ) {
        score -= 20;
        spofs.push(
          "Unverified Late Night Ingress: Entering an unfamiliar city at night without pre-arranged transit.",
        );
      }
      if (context.lodgingFloor === "ground") {
        score -= 15;
        spofs.push("Ground-Floor Room: Ground level has the highest rate of physical intrusion.");
      }
      if (context.cellularType === "wifi_only") {
        score -= 15;
        spofs.push(
          "No Cellular Data in Transit: Leaves you unable to verify drivers or summon help.",
        );
      }
      if (!context.hasEmergencyContact) {
        score -= 10;
        spofs.push("No Off-Site Emergency Contact: No trusted person holds your itinerary.");
      }

      return {
        score: Math.max(0, score),
        spofs,
      };
    }),
  },
}).createMachine({
  id: "soloSecurityQuiz",
  initial: "stepArrival",
  context: {
    destinationCity: "Rome",
    destinationCountry: "IT",
    destinationRiskTier: "Moderate",
    archetype: "solo-female",
    arrivalHour: 14,
    transitMode: "flight",
    prebookedTransit: false,
    lodgingType: "hotel",
    lodgingFloor: "floors_2_to_4",
    cardCount: 2,
    cardsSegregated: true,
    cellularType: "esim",
    hasEmergencyContact: true,
    score: 100,
    spofs: [],
  },
  states: {
    stepArrival: {
      on: {
        INIT_PRELOAD: {
          actions: assign(({ event }) => event.payload),
        },
        SUBMIT_ARRIVAL: {
          actions: assign(({ event }) => ({
            arrivalHour: event.arrivalHour,
            transitMode: event.transitMode,
            prebookedTransit: event.prebookedTransit,
          })),
          target: "stepLodging",
        },
      },
    },
    stepLodging: {
      on: {
        SUBMIT_LODGING: {
          actions: assign(({ event }) => ({
            lodgingType: event.lodgingType,
            lodgingFloor: event.lodgingFloor,
          })),
          target: "stepRedundancy",
        },
      },
    },
    stepRedundancy: {
      on: {
        SUBMIT_REDUNDANCY: {
          actions: [
            assign(({ event }) => ({
              cardCount: event.cardCount,
              cardsSegregated: event.cardsSegregated,
              cellularType: event.cellularType,
              hasEmergencyContact: event.hasEmergencyContact,
            })),
            "computeScore",
          ],
          target: "evaluationComplete",
        },
      },
    },
    evaluationComplete: {
      on: {
        RESTART: "stepArrival",
      },
    },
  },
});
