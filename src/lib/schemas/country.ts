/**
 * src/lib/schemas/country.ts
 *
 * Zod runtime defensive validation boundary for Country GraphQL responses.
 * Protects client and server components from unhandled exceptions when
 * backend schema contracts evolve or return unexpected null values.
 */

import { z } from "zod";

export const EmergencyNumbersSchema = z.object({
  police: z.string().default("112"),
  ambulance: z.string().default("112"),
  fire: z.string().default("112"),
  touristPolice: z.string().optional().nullable(),
});

export const ConsularHotlinesSchema = z.object({
  usEmbassyPhone: z.string().default(""),
  ukEmbassyPhone: z.string().default(""),
  ausEmbassyPhone: z.string().default(""),
});

export const ElectricalStandardsSchema = z.object({
  voltage: z.string().default("230V"),
  frequency: z.string().default("50Hz"),
  plugTypes: z.array(z.string()).default(["C", "F"]),
});

export const CountryDossierSchema = z.object({
  iso2: z.string().min(2).max(3),
  iso3: z.string().min(3).max(3),
  name: z.string(),
  nativeName: z.string().optional().nullable(),
  capital: z.string(),
  currencyCode: z.string(),
  currencySymbol: z.string(),
  currencyName: z.string().default("Local Currency"),
  phonePrefix: z.string().default(""),
  region: z.string(),
  subregion: z.string().default(""),
  wikidataId: z.string().optional().nullable(),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .default({ latitude: 0, longitude: 0 }),
  defaultRiskTier: z
    .enum(["LOW", "MODERATE", "ELEVATED", "HIGH", "Low", "Moderate", "Elevated", "High"])
    .default("LOW"),
  emergencyNumbers: EmergencyNumbersSchema,
  consularHotlines: ConsularHotlinesSchema,
  electricalStandards: ElectricalStandardsSchema,
  overview: z.string().default(""),
  keySafetyRules: z.array(z.string()).default([]),
  primaryCities: z
    .array(
      z.union([
        z.string(),
        z.object({
          slug: z.string(),
          name: z.string(),
          primaryAirportCode: z.string().default("XXX"),
          riskTier: z.string().default("LOW"),
        }),
      ]),
    )
    .default([]),
});

export type ValidatedCountryDossier = z.infer<typeof CountryDossierSchema>;

export function parseCountryDossier(raw: unknown): ValidatedCountryDossier | null {
  const result = CountryDossierSchema.safeParse(raw);
  if (!result.success) {
    console.warn("[schemas/country] CountryDossierSchema rejected payload:", result.error.format());
    return null;
  }
  return result.data;
}

export const CountrySummarySchema = z.object({
  iso2: z.string().min(2).max(3),
  iso3: z.string().min(3).max(3),
  name: z.string(),
  nativeName: z.string().optional().nullable(),
  capital: z.string(),
  currencyCode: z.string(),
  currencySymbol: z.string(),
  region: z.string(),
  defaultRiskTier: z
    .enum(["LOW", "MODERATE", "ELEVATED", "HIGH", "Low", "Moderate", "Elevated", "High"])
    .default("LOW"),
  emergencyNumbers: z.object({
    police: z.string().default("112"),
    ambulance: z.string().default("112"),
    touristPolice: z.string().optional().nullable(),
  }),
  electricalStandards: z.object({
    voltage: z.string().default("230V"),
    plugTypes: z.array(z.string()).default(["C"]),
  }),
});

export type ValidatedCountrySummary = z.infer<typeof CountrySummarySchema>;

export function parseCountrySummaryList(raw: unknown): ValidatedCountrySummary[] | null {
  const result = z.array(CountrySummarySchema).safeParse(raw);
  if (!result.success) {
    console.warn("[schemas/country] CountrySummarySchema rejected list:", result.error.format());
    return null;
  }
  return result.data;
}
