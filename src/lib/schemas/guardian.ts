/**
 * src/lib/schemas/guardian.ts
 *
 * Zod runtime defensive validation for Guardian Pass GraphQL responses.
 */

import { z } from "zod";

export const IngressMilestoneSchema = z.object({
  id: z.string(),
  label: z.string(),
  expectedTime: z.string(),
  completedTime: z.string().optional().nullable(),
  status: z
    .enum(["COMPLETED", "PENDING", "OVERDUE", "Completed", "Pending", "Overdue"])
    .default("PENDING"),
});

export const GuardianPortalSchema = z.object({
  token: z.string(),
  travelerName: z.string(),
  destinationCity: z.string(),
  destinationCountry: z.string(),
  status: z.enum(["GREEN", "AMBER", "RED", "Green", "Amber", "Red"]).default("GREEN"),
  nextWindowUtc: z.string(),
  readinessScore: z.number().min(0).max(100),
  readinessGrade: z.string(),
  milestones: z.array(IngressMilestoneSchema).default([]),
  consularHotlines: z.object({
    usEmbassyPhone: z.string().default(""),
    ukEmbassyPhone: z.string().default(""),
    ausEmbassyPhone: z.string().default(""),
  }),
  emergencyNumbers: z.object({
    police: z.string().default("112"),
    ambulance: z.string().default("112"),
    fire: z.string().default("112"),
    touristPolice: z.string().optional().nullable(),
  }),
});

export type ValidatedGuardianPortal = z.infer<typeof GuardianPortalSchema>;

export function parseGuardianPortal(raw: unknown): ValidatedGuardianPortal | null {
  const result = GuardianPortalSchema.safeParse(raw);
  if (!result.success) {
    console.warn(
      "[schemas/guardian] GuardianPortalSchema rejected payload:",
      result.error.format(),
    );
    return null;
  }
  return result.data;
}
