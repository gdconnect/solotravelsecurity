/**
 * src/lib/schemas/truth-table.ts
 *
 * Zod runtime defensive validation for Truth Tables.
 */

import { z } from "zod";

export const TruthPropositionSchema = z.object({
  symbol: z.string().startsWith("P"),
  key: z.string(),
  name: z.string(),
  description: z.string(),
});

export const TruthOutputVariableSchema = z.object({
  key: z.string(),
  type: z.enum(["actionCode", "threatLevel", "script", "posture"]),
  description: z.string(),
});

export const TruthTableRowSchema = z.object({
  rowId: z.string(),
  inputs: z.record(z.string(), z.union([z.boolean(), z.literal("*")])),
  outputs: z.record(z.string(), z.string()),
  formalRationale: z.string().optional(),
});

export const TruthTableSchema = z.object({
  id: z.string().startsWith("TT-"),
  title: z.string(),
  description: z.string(),
  scenarioCategory: z.string(),
  propositions: z.array(TruthPropositionSchema),
  outputVariables: z.array(TruthOutputVariableSchema),
  rows: z.array(TruthTableRowSchema),
  completenessVerified: z.boolean(),
});

export type ValidatedTruthTable = z.infer<typeof TruthTableSchema>;

export function parseTruthTable(raw: unknown): ValidatedTruthTable | null {
  const result = TruthTableSchema.safeParse(raw);
  if (!result.success) {
    console.warn("[schemas/truth-table] TruthTableSchema rejected payload:", result.error.format());
    return null;
  }
  return result.data;
}
