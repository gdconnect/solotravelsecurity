import type { EnrichedCountry, EnrichedCityGeo } from "./types";
import type { ValidatedCountryDossier } from "@/lib/schemas/country";
import { SITE_URL } from "@/lib/schema";

export function buildCountrySchemaGraph(country: EnrichedCountry | ValidatedCountryDossier) {
  const countryId = `${SITE_URL}/playbook/countries/${country.iso2.toLowerCase()}#country`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Country",
      "@id": countryId,
      name: country.name,
      identifier: country.iso2,
      alternateName: country.nativeName || undefined,
      sameAs: country.wikidataId
        ? `https://www.wikidata.org/wiki/${country.wikidataId}`
        : undefined,
      geo: {
        "@type": "GeoCoordinates",
        latitude: country.coordinates.latitude,
        longitude: country.coordinates.longitude,
      },
      currenciesAccepted: country.currencyCode,
      telephoneCode: country.phonePrefix,
    },
    {
      "@type": "EmergencyService",
      "@id": `${countryId}/emergency-police`,
      name: `${country.name} Police Emergency Dispatch`,
      telephone: country.emergencyNumbers.police,
      areaServed: { "@id": countryId },
    },
    {
      "@type": "EmergencyService",
      "@id": `${countryId}/emergency-medical`,
      name: `${country.name} Ambulance & Medical Emergency`,
      telephone: country.emergencyNumbers.ambulance,
      areaServed: { "@id": countryId },
    },
    {
      "@type": "EmergencyService",
      "@id": `${countryId}/emergency-fire`,
      name: `${country.name} Fire & Rescue Dispatch`,
      telephone: country.emergencyNumbers.fire,
      areaServed: { "@id": countryId },
    },
  ];

  if (country.emergencyNumbers.touristPolice) {
    graph.push({
      "@type": "EmergencyService",
      "@id": `${countryId}/emergency-tourist-police`,
      name: `${country.name} Tourist Police Assistance`,
      telephone: country.emergencyNumbers.touristPolice,
      areaServed: { "@id": countryId },
    });
  }

  // FAQPage for instant Google Rich Results
  graph.push({
    "@type": "FAQPage",
    "@id": `${countryId}/faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the emergency numbers in ${country.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `In ${country.name}, dial ${country.emergencyNumbers.police} for Police, ${country.emergencyNumbers.ambulance} for Ambulance/Medical, and ${country.emergencyNumbers.fire} for Fire.${country.emergencyNumbers.touristPolice ? ` Dedicated Tourist Police is reachable at ${country.emergencyNumbers.touristPolice}.` : ""}`,
        },
      },
      {
        "@type": "Question",
        name: `What electrical plugs and voltage are used in ${country.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${country.name} operates on ${country.electricalStandards.voltage} and ${country.electricalStandards.frequency}, using plug types: ${country.electricalStandards.plugTypes.join(", ")}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the solo travel security rating for ${country.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            country.overview ||
            `${country.name} has an operational solo travel risk classification of ${country.defaultRiskTier}. Always verify arrival transit and register consular emergency contacts.`,
        },
      },
    ],
  });

  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Playbook", item: `${SITE_URL}/playbook/` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Countries",
        item: `${SITE_URL}/playbook/countries/`,
      },
      { "@type": "ListItem", position: 4, name: country.name },
    ],
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildCitySchemaGraph(
  city: EnrichedCityGeo,
  country: EnrichedCountry,
  options?: {
    scamCount?: number;
    airportGuidance?: string;
  },
) {
  const cityId = `${SITE_URL}/playbook/destinations/${city.slug}#city`;
  const countryId = `${SITE_URL}/playbook/countries/${country.iso2.toLowerCase()}#country`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": ["City", "TouristDestination"],
      "@id": cityId,
      name: city.name,
      sameAs: [
        `https://www.wikidata.org/wiki/${city.wikidataId}`,
        `https://en.wikipedia.org/wiki/${encodeURIComponent(city.name)}`,
      ],
      containedInPlace: {
        "@type": "Country",
        "@id": countryId,
        name: country.name,
        identifier: country.iso2,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.coordinates.latitude,
        longitude: city.coordinates.longitude,
      },
    },
    {
      "@type": "SpecialAnnouncement",
      "@id": `${cityId}/safety-advisory`,
      name: `${city.name} Solo Travel Security Advisory`,
      text: `Operational risk assessment: ${city.riskTier}. Pre-arranged transit recommended for arrival via ${city.primaryAirportCode}. ${options?.airportGuidance || ""}`.trim(),
      category: "https://schema.org/SafetyAdvisory",
      spatialCoverage: { "@id": cityId },
    },
    {
      "@type": "FAQPage",
      "@id": `${cityId}/faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: `What is the solo travel risk tier for ${city.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${city.name} is assessed at ${city.riskTier} operational risk. Primary entry airport is ${city.primaryAirportCode}.`,
          },
        },
        {
          "@type": "Question",
          name: `What is the national emergency number in ${city.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Dial ${country.emergencyNumbers.police} for Police, ${country.emergencyNumbers.ambulance} for Ambulance/Medical dispatch in ${city.name}.`,
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Playbook", item: `${SITE_URL}/playbook/` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Destinations",
          item: `${SITE_URL}/playbook#destinations`,
        },
        { "@type": "ListItem", position: 4, name: city.name },
      ],
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
