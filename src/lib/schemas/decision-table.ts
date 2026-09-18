/**
 * src/lib/schemas/decision-table.ts
 *
 * Zod runtime defensive validation for Decision Tables.
 */

import { z } from "zod";

export const DecisionConditionColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["enum", "boolean", "range", "string"]),
  allowedValues: z.array(z.string()).optional(),
  unit: z.string().optional(),
});

export const DecisionActionColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["directive", "code", "hardware", "warning"]),
});

export const DecisionRuleRowSchema = z.object({
  ruleId: z.string(),
  scenario: z.string(),
  priority: z.number().int(),
  conditions: z.record(z.string(), z.unknown()),
  actions: z.record(z.string(), z.unknown()),
});

export const DecisionTableSchema = z.object({
  id: z.string().startsWith("DT-"),
  title: z.string(),
  description: z.string(),
  pillarId: z.string(),
  conditionColumns: z.array(DecisionConditionColumnSchema),
  actionColumns: z.array(DecisionActionColumnSchema),
  rules: z.array(DecisionRuleRowSchema),
  defaultAction: z.record(z.string(), z.unknown()),
});

export type ValidatedDecisionTable = z.infer<typeof DecisionTableSchema>;

export function parseDecisionTable(raw: unknown): ValidatedDecisionTable | null {
  const result = DecisionTableSchema.safeParse(raw);
  if (!result.success) {
    console.warn(
      "[schemas/decision-table] DecisionTableSchema rejected payload:",
      result.error.format(),
    );
    return null;
  }
  return result.data;
}
