/**
 * src/lib/schemas/checklist.ts
 *
 * Zod runtime defensive validation for Checklist items and Generated Checklists.
 */

import { z } from "zod";

export const ChecklistItemSchema = z.object({
  id: z.string().startsWith("CHK-"),
  title: z.string(),
  description: z.string(),
  pillarId: z.string(),
  phaseId: z.string(),
  criticality: z.enum(["CRITICAL", "HIGH", "STANDARD", "RECOMMENDED"]),
  isSPOF: z.boolean(),
  verificationType: z.enum([
    "MANUAL_CHECK",
    "PHOTO_PROOF",
    "LOCATION_GEO_PING",
    "CONSULAR_REG_ID",
    "HARDWARE_TEST",
    "TRUSTED_CONTACT_CONFIRMATION",
  ]),
  applicableArchetypes: z.array(z.string()).default(["all"]),
  minimumRiskTier: z.enum(["LOW", "MODERATE", "ELEVATED", "HIGH"]).default("LOW"),
  decisionTableRef: z.string().optional(),
  truthTableRef: z.string().optional(),
  scoringDeductionPoints: z.number().min(0).max(50),
  recommendedGearSkus: z.array(z.string()).optional(),
});

export const GeneratedChecklistGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  items: z.array(ChecklistItemSchema),
});

export const GeneratedChecklistSchema = z.object({
  generatedAt: z.string(),
  params: z.object({
    archetype: z.string().optional(),
    destinationRiskTier: z.enum(["LOW", "MODERATE", "ELEVATED", "HIGH"]).optional(),
    phaseId: z.string().optional(),
    pillarId: z.string().optional(),
    criticalOnly: z.boolean().optional(),
  }),
  totalItems: z.number().int().min(0),
  criticalCount: z.number().int().min(0),
  spofCount: z.number().int().min(0),
  items: z.array(ChecklistItemSchema),
  byPillar: z.array(GeneratedChecklistGroupSchema),
  byPhase: z.array(GeneratedChecklistGroupSchema),
});

export type ValidatedChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type ValidatedGeneratedChecklist = z.infer<typeof GeneratedChecklistSchema>;

export function parseChecklistItem(raw: unknown): ValidatedChecklistItem | null {
  const result = ChecklistItemSchema.safeParse(raw);
  if (!result.success) {
    console.warn("[schemas/checklist] ChecklistItemSchema rejected item:", result.error.format());
    return null;
  }
  return result.data;
}

export function parseGeneratedChecklist(raw: unknown): ValidatedGeneratedChecklist | null {
  const result = GeneratedChecklistSchema.safeParse(raw);
  if (!result.success) {
    console.warn(
      "[schemas/checklist] GeneratedChecklistSchema rejected payload:",
      result.error.format(),
    );
    return null;
  }
  return result.data;
}
