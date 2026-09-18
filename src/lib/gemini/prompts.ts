/**
 * src/lib/gemini/prompts.ts
 *
 * Grounded Prompt Templates & System Instructions for Gemini API.
 * Engineered for Google Search Grounding (`tools: [{ googleSearch: {} }]`)
 * and strict JSON Schema output enforcement (`responseMimeType: "application/json"`).
 */

import {
  AirportSecurityHubSchema,
  ThreatScamDossierSchema,
  RegulatoryLandmineSchema,
} from "../schemas/lego-blocks";
import { zodToGeminiSchema } from "./schema-compiler";
import type { GeminiResponseSchema } from "./types";

export interface HarvesterPromptDefinition {
  systemInstruction: string;
  generatePrompt: (context: Record<string, string | number>) => string;
  schema: GeminiResponseSchema;
  searchQueries: (context: Record<string, string | number>) => string[];
}

/**
 * 1. Airport Ingress & Late-Night Curfew Harvester
 */
export const AirportIngressHarvester: HarvesterPromptDefinition = {
  systemInstruction: [
    "You are an elite Solo Travel Security Transport Auditor.",
    "Your mission is to perform live Google Search Grounding to extract deterministic, factual arrival logistics for international airports.",
    "CRITICAL ANTI-HALLUCINATION RULES:",
    "1. Only cite verified official municipal transit schedules, official airport authority pages, and verified embassy advisories.",
    "2. If an express train stops at 23:23 (e.g. Leonardo Express at FCO), state exactly 23:23. Do not round to midnight.",
    "3. Identify the EXACT door number and floor level for official municipality taxi ranks (e.g. Terminal 3 Door 4).",
    "4. Detail official livery markings (color, seal, roof light) so travelers can falsify unmarked private touts.",
    "5. Output must conform strictly to the provided JSON schema.",
  ].join("\n"),

  generatePrompt: (context) => `
Conduct grounded search investigation for:
Airport: ${context.airportName} (${context.iata} / ${context.icao})
City: ${context.city}, ${context.country}

Extract:
1. Primary international arrival terminal and total terminal count.
2. Late-night curfew times: exact time the last express rail and metro departs the airport.
3. Official municipal taxi booth: exact terminal door, level, fare structure (flat rate in EUR or local currency), and visual livery identifiers.
4. App-based rideshare staging: legal status (Uber/Grab/Bolt), pickup floor/bay.
5. Hallway tout scam mechanics: phrases rogue touts shout inside the customs exit.
6. Legitimate domestic bank ATMs vs predatory high-fee ATMs to avoid.
`,

  schema: zodToGeminiSchema(AirportSecurityHubSchema),

  searchQueries: (context) => [
    `${context.iata} airport official taxi stand door terminal`,
    `${context.iata} express train last departure time schedule midnight`,
    `${context.iata} airport arrival hall taxi tout scam warnings`,
    `${context.iata} airport rideshare uber pickup location`,
  ],
};

/**
 * 2. Threat & Scam Truth Table Harvester
 */
export const ThreatScamTruthTableHarvester: HarvesterPromptDefinition = {
  systemInstruction: [
    "You are a Forensic Social Engineering Analyst specializing in tourist scams and street deception.",
    "Your objective is to decompose scams into observable, falsifiable binary conditions (Truth Tables).",
    "RULES:",
    "1. Scams are repeatable scripts. Extract the exact opening hook phrases scammers use.",
    "2. Isolate 2 to 4 observable physical conditions that prove illegitimacy with zero ambiguity.",
    "3. Provide respectful, assertive, non-escalatory phonetic refusal scripts in the local language.",
    "4. Output must conform strictly to the provided JSON schema.",
  ].join("\n"),

  generatePrompt: (context) => `
Analyze the following travel deception vector:
Threat/Scam: ${context.scamName}
Vector Category: ${context.vectorCategory}
Target Destination: ${context.destination} (Hotspots: ${context.hotspot})

Deconstruct:
1. The deceptive pretext and exact opening line used to bait the traveler.
2. The cognitive vulnerability exploited (fear, politeness, greed, fatigue).
3. The falsification truth table: binary observable tests (e.g. "Demands cash fine on spot?").
4. Phonetic local escape line and English translation.
`,

  schema: zodToGeminiSchema(ThreatScamDossierSchema),

  searchQueries: (context) => [
    `${context.destination} ${context.scamName} tourist police report`,
    `${context.destination} common travel scams truth table`,
    `${context.destination} street scam exact script phrase avoid`,
  ],
};

/**
 * 3. Customs & Controlled Medication Landmine Harvester
 */
export const RegulatoryLandmineHarvester: HarvesterPromptDefinition = {
  systemInstruction: [
    "You are an International Customs & Penal Law Regulatory Specialist.",
    "Solo travelers frequently face arrest or deportation for bringing common over-the-counter or prescription medications that are strictly banned in destination countries.",
    "RULES:",
    "1. Cite official Ministry of Health, Customs, and Narcotics Control agencies.",
    "2. Identify the active pharmaceutical ingredient (e.g., Dexamphetamine, Pseudoephedrine, CBD, Codeine).",
    "3. State the exact legal status, penalty severity (fine vs prison/deportation), and specific import permit required (e.g., Japan Yakkan Shoumei / Yunyu Kakunin-sho).",
    "4. Output must conform strictly to the provided JSON schema.",
  ].join("\n"),

  generatePrompt: (context) => `
Investigate customs and legal restrictions for:
Country: ${context.country} (${context.countryCode})
Subject/Substance: ${context.substanceOrItem} (e.g., Adderall, Vaping, Drones, Satellite Communicators)

Extract:
1. Legal status: strictly_banned, permit_required, restricted_quantity, or legal.
2. Governing statute and responsible enforcement authority.
3. Penalty for unauthorized importation (confiscation, heavy fine, criminal detention).
4. Required advance paperwork or doctor's declaration format.
`,

  schema: zodToGeminiSchema(RegulatoryLandmineSchema),

  searchQueries: (context) => [
    `${context.country} customs restricted medication banned list official`,
    `${context.country} Ministry of Health bring ${context.substanceOrItem} solo traveler`,
    `${context.country} entry penalties prohibited items customs`,
  ],
};

/**
 * 4. Multimodal Taxi Livery & Meter Auditor Schema
 * Designed for Gemini Vision evaluation of traveler-uploaded images.
 */
export const TaxiVisualAuditSchema: GeminiResponseSchema = {
  type: "OBJECT",
  description: "Forensic visual audit of a taxi exterior livery or interior dashboard meter",
  properties: {
    isLikelyOfficial: {
      type: "BOOLEAN",
      description: "True if all municipal livery marks and valid taximeter are present",
    },
    confidenceScore: {
      type: "NUMBER",
      description: "Confidence from 0.0 to 1.0",
    },
    vehicleAnalysis: {
      type: "OBJECT",
      properties: {
        vehicleColor: { type: "STRING" },
        municipalEmblemPresent: { type: "BOOLEAN" },
        licensePlateType: { type: "STRING" },
        roofLightPresent: { type: "BOOLEAN" },
      },
      required: ["vehicleColor", "municipalEmblemPresent"],
    },
    meterAnalysis: {
      type: "OBJECT",
      properties: {
        meterVisible: { type: "BOOLEAN" },
        meterRunning: { type: "BOOLEAN" },
        displayedFare: { type: "NUMBER" },
        tariffCode: {
          type: "STRING",
          description: "e.g. Tariff 1 (day), Tariff 2 (night), Tariff 3",
        },
        redFlags: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Observable red flags like covered meter, smartphone running fake meter app",
        },
      },
      required: ["meterVisible", "redFlags"],
    },
    immediateDirective: {
      type: "STRING",
      description:
        "Direct tactical instruction to traveler (e.g., 'Exit immediately', 'Ask driver to reset meter to Tariff 1')",
    },
  },
  required: [
    "isLikelyOfficial",
    "confidenceScore",
    "vehicleAnalysis",
    "meterAnalysis",
    "immediateDirective",
  ],
};
