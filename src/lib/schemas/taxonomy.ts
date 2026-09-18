/**
 * src/lib/schemas/taxonomy.ts
 *
 * Zod runtime defensive validation for taxonomy structures.
 */

import { z } from "zod";

export const SecurityPillarSchema = z.object({
  id: z.string().startsWith("PIL-"),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  weight: z.number().min(0).max(100),
  icon: z.string(),
  primaryDirectives: z.array(z.string()).default([]),
});

export const LifecyclePhaseSchema = z.object({
  id: z.string().startsWith("PHS-"),
  name: z.string(),
  slug: z.string(),
  order: z.number().int().positive(),
  description: z.string(),
  typicalWindow: z.string().default(""),
});

export const OperationalRiskTierSchema = z.object({
  tier: z.enum(["LOW", "MODERATE", "ELEVATED", "HIGH"]),
  label: z.string(),
  numericalLevel: z.number().min(1).max(4),
  description: z.string(),
  baselinePosture: z.string(),
});

export type ValidatedSecurityPillar = z.infer<typeof SecurityPillarSchema>;
export type ValidatedLifecyclePhase = z.infer<typeof LifecyclePhaseSchema>;
export type ValidatedOperationalRiskTier = z.infer<typeof OperationalRiskTierSchema>;

export function parseSecurityPillars(raw: unknown): ValidatedSecurityPillar[] | null {
  const result = z.array(SecurityPillarSchema).safeParse(raw);
  if (!result.success) {
    console.warn(
      "[schemas/taxonomy] SecurityPillarSchema rejected payload:",
      result.error.format(),
    );
    return null;
  }
  return result.data;
}
