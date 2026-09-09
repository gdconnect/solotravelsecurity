import type { MetadataRoute } from "next";

/**
 * Site-wide constants and JSON-LD helpers.
 *
 * Rules followed throughout:
 * - markup mirrors visible content only (no invented geo/contact),
 * - one @graph per page with stable @ids.
 */

export const SITE_NAME = "Solo Travel Security";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://solotravelsecurity.example";
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
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
