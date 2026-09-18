import type { MetadataRoute } from "next";
import { TOP_SOLO_DESTINATIONS } from "@/data/destinations";
import { ARCHETYPES } from "@/data/archetypes";
import { SECURITY_VECTORS } from "@/data/vectors";

import { ENRICHED_COUNTRIES } from "@/data/geo/countries";
export { buildCountrySchemaGraph, buildCitySchemaGraph } from "./geo/schema-builder";

/**
 * Site-wide constants and JSON-LD helpers.
 *
 * Rules followed throughout:
 * - markup mirrors visible content only (no invented geo/contact),
 * - one @graph per page with stable @ids.
 */

export const SITE_NAME = "Solo Travel Security";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://solotravelsecurity.com";
export const SITE_DESCRIPTION =
  "Solo Travel Security is a forthcoming field-tested playbook for solo travellers — situational awareness, scam literacy, transit hygiene and calm decision-making.";

export type Graph = Record<string, unknown>;

export function siteGraph(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#org`,
        name: SITE_NAME,
        url: SITE_URL,
        slogan: "Awareness, not paranoia.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#site`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}#org` },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": SITE_URL,
        url: SITE_URL,
        name: `${SITE_NAME} — Coming soon`,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}#site` },
        inLanguage: "en",
      },
    ],
  };
}

export function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/playbook/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/playbook/countries/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/parents/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/playbook/destinations/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/notify/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const countryHubEntries: MetadataRoute.Sitemap = ENRICHED_COUNTRIES.map((c) => ({
    url: `${SITE_URL}/playbook/countries/${c.iso2.toLowerCase()}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.88,
  }));

  const cityHubEntries: MetadataRoute.Sitemap = TOP_SOLO_DESTINATIONS.map((d) => ({
    url: `${SITE_URL}/playbook/destinations/${d.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const archetypeHubEntries: MetadataRoute.Sitemap = ARCHETYPES.map((a) => ({
    url: `${SITE_URL}/playbook/archetypes/${a.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const topicHubEntries: MetadataRoute.Sitemap = SECURITY_VECTORS.map((v) => ({
    url: `${SITE_URL}/playbook/topics/${v.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const reportEntries: MetadataRoute.Sitemap = TOP_SOLO_DESTINATIONS.map((d) => ({
    url: `${SITE_URL}/report/${d.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const skagEntries: MetadataRoute.Sitemap = [];
  for (const dest of TOP_SOLO_DESTINATIONS) {
    for (const arch of ARCHETYPES) {
      for (const vec of SECURITY_VECTORS) {
        skagEntries.push({
          url: `${SITE_URL}/playbook/${arch.slug}/${dest.slug}/${vec.slug}/`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return [
    ...baseEntries,
    ...countryHubEntries,
    ...cityHubEntries,
    ...archetypeHubEntries,
    ...topicHubEntries,
    ...reportEntries,
    ...skagEntries,
  ];
}
