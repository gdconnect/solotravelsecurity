import type { CardData, CardBadge, CardPriceMetric } from "./types";
import type { ProductRule, MatchedProduct } from "@/data/gear/types";
import type {
  ThreatScamDossier,
  AirportSecurityHub,
  RegulatoryLandmineDossier,
  MicroZoneDossier,
} from "@/lib/schemas/lego-blocks";
import type { SearchableItem } from "@/lib/search/types";

/**
 * Normalizes a ProductRule into a self-contained CardData object.
 */
export function gearToCard(product: ProductRule | MatchedProduct): CardData {
  const priceNum =
    typeof product.schemaOrg.price === "number"
      ? product.schemaOrg.price
      : parseFloat(product.schemaOrg.price || "0");

  const priceTier: CardPriceMetric["tier"] =
    priceNum === 0 ? "free" : priceNum < 25 ? "under_25" : priceNum <= 50 ? "25_to_50" : "50_plus";

  const badges: CardBadge[] = [
    {
      label: product.category.replace(/_/g, " "),
      tone: "amber",
      icon: "shield",
    },
  ];

  const isPrimary =
    "isPrimaryRecommendation" in product && Boolean(product.isPrimaryRecommendation);
  if (isPrimary) {
    badges.push({
      label: "Top Recommendation",
      tone: "green",
      icon: "sparkles",
    });
  }

  const role = product.howToRole || "tool";

  return {
    id: product.sku,
    urn: `urn:sts:product:${product.sku}`,
    type: "product",
    title: product.name,
    subtitle: product.schemaOrg.author ? `By ${product.schemaOrg.author}` : product.schemaOrg.brand,
    description: product.situationalRationale,
    href: product.schemaOrg.affiliateUrl,
    isExternal: true,
    highlight: `Role: ${role.toUpperCase()}`,
    badges,
    media: {
      type: "icon",
      iconName: "shield",
    },
    metrics: {
      price: {
        formatted: `$${product.schemaOrg.price}`,
        raw: priceNum,
        currency: product.schemaOrg.priceCurrency || "USD",
        tier: priceTier,
      },
      rating: {
        value: product.schemaOrg.rating.value,
        count: product.schemaOrg.rating.count,
        label: "Field Score",
      },
    },
    comparison: {
      canCompare: true,
      pros: product.schemaOrg.pros || [],
      cons: product.schemaOrg.cons || [],
      keyDifferentiator: `Priority Rank #${product.priorityRank} for situational ingress defense`,
    },
    actions: {
      primary: {
        label: `View on Amazon ($${product.schemaOrg.price})`,
        href: product.schemaOrg.affiliateUrl,
        isExternal: true,
        icon: "externalLink",
        tone: "primary",
      },
      canFavorite: true,
      canShare: true,
    },
  };
}

/**
 * Normalizes a ThreatScamDossier into a self-contained CardData object.
 */
export function scamToCard(scam: ThreatScamDossier): CardData {
  const destination =
    scam.associatedDestinations.length > 0
      ? `Active in ${scam.associatedDestinations.join(", ").toUpperCase()}`
      : "Global Threat Vector";

  const description = scam.deceptiveHook?.openingPhrase
    ? `"${scam.deceptiveHook.openingPhrase}" — ${scam.deceptiveHook.psychologicalTrigger}`
    : scam.escapeProtocol.primaryAction;

  return {
    id: scam.id,
    urn: `urn:sts:scam:${scam.id}`,
    type: "scam",
    title: scam.name,
    subtitle: destination,
    description,
    href: `/playbook/scams/${scam.slug}/`,
    isExternal: false,
    highlight: `Rule: ${scam.truthTable.conclusiveRule}`,
    badges: [
      {
        label: scam.vectorCategory.replace(/_/g, " "),
        tone: "red",
        icon: "alertTriangle",
      },
      {
        label: `${scam.severity} Severity`,
        tone: scam.severity === "Critical" || scam.severity === "High" ? "red" : "amber",
      },
    ],
    media: {
      type: "icon",
      iconName: "alertTriangle",
    },
    metrics: {
      risk: {
        tier: scam.severity,
        score: scam.severity === "Critical" ? 95 : scam.severity === "High" ? 80 : 50,
      },
      price: {
        formatted: "Free Defense Protocol",
        raw: 0,
        currency: "USD",
        tier: "free",
      },
    },
    comparison: {
      canCompare: true,
      pros: scam.truthTable.conditions.map((c) => c.conditionText),
      cons: [`Primary trigger: ${scam.deceptiveHook.psychologicalTrigger}`],
      keyDifferentiator: `Escape Protocol: ${scam.escapeProtocol.primaryAction}`,
    },
    actions: {
      primary: {
        label: "Study Avoidance Protocol →",
        href: `/playbook/scams/${scam.slug}/`,
        isExternal: false,
        icon: "arrowRight",
        tone: "primary",
      },
      canFavorite: true,
      canShare: true,
    },
  };
}

/**
 * Normalizes an AirportSecurityHub into a self-contained CardData object.
 */
export function airportToCard(hub: AirportSecurityHub): CardData {
  return {
    id: hub.iata.toLowerCase(),
    urn: `urn:sts:airport:${hub.iata.toLowerCase()}`,
    type: "airport",
    title: `${hub.iata} — ${hub.name}`,
    subtitle: `${hub.city}, ${hub.country}`,
    description: `Express rail curfew: ${hub.lateNightCurfew.expressRailLastDeparture}. Official taxi desk: ${hub.officialTaxi.exactKioskLocation}.`,
    href: `/playbook/airports/${hub.iata.toLowerCase()}/`,
    isExternal: false,
    highlight: `Curfew Vulnerability: After ${hub.lateNightCurfew.curfewVulnerabilityHour}:00 Local`,
    badges: [
      {
        label: "Airport Ingress Hub",
        tone: "blue",
        icon: "mapPin",
      },
      {
        label: hub.officialTaxi.fareStructure.replace(/_/g, " ").toUpperCase(),
        tone: "green",
      },
    ],
    media: {
      type: "icon",
      iconName: "mapPin",
    },
    metrics: {
      risk: {
        tier: hub.lateNightCurfew.curfewVulnerabilityHour <= 23 ? "High" : "Moderate",
        score: 65,
      },
    },
    comparison: {
      canCompare: true,
      pros: [
        `Express rail: ${hub.lateNightCurfew.expressRailLastDeparture}`,
        `Official livery marks verified`,
      ],
      cons: [hub.officialTaxi.paymentMethodRisk],
      keyDifferentiator: `Late-night curfew at ${hub.lateNightCurfew.curfewVulnerabilityHour}:00`,
    },
    actions: {
      primary: {
        label: "View Airport Ingress Guide →",
        href: `/playbook/airports/${hub.iata.toLowerCase()}/`,
        isExternal: false,
        icon: "arrowRight",
        tone: "primary",
      },
      canFavorite: true,
      canShare: true,
    },
  };
}

/**
 * Normalizes a RegulatoryLandmineDossier into a self-contained CardData object.
 */
export function regulatoryToCard(reg: RegulatoryLandmineDossier): CardData {
  return {
    id: reg.id,
    urn: `urn:sts:regulatory:${reg.id}`,
    type: "regulatory",
    title: reg.title,
    subtitle: `${reg.countryName} Host Nation Law`,
    description: reg.proceduralAction,
    href: `/playbook/countries/${reg.countryCode.toLowerCase()}/`,
    isExternal: false,
    highlight: `Status: ${reg.legalStatus.replace(/_/g, " ").toUpperCase()}`,
    badges: [
      {
        label: "Host Nation Decree",
        tone: "purple",
        icon: "alertTriangle",
      },
      {
        label: reg.countryName,
        tone: "neutral",
      },
    ],
    media: {
      type: "icon",
      iconName: "alertTriangle",
    },
    metrics: {
      risk: {
        tier: "Critical",
        score: 95,
      },
    },
    comparison: {
      canCompare: true,
      pros: ["Zero ambiguity legal clarity"],
      cons: [reg.penaltySummary],
      keyDifferentiator: reg.permitName ? `Permit: ${reg.permitName}` : "Strict Zero-Tolerance",
    },
    actions: {
      primary: {
        label: "Inspect Country Legal Guidelines →",
        href: `/playbook/countries/${reg.countryCode.toLowerCase()}/`,
        isExternal: false,
        icon: "arrowRight",
        tone: "primary",
      },
      canFavorite: true,
      canShare: true,
    },
  };
}

/**
 * Normalizes a MicroZoneDossier into a self-contained CardData object.
 */
export function microZoneToCard(zone: MicroZoneDossier): CardData {
  return {
    id: zone.id,
    urn: `urn:sts:microzone:${zone.id}`,
    type: "micro_zone",
    title: zone.name,
    subtitle: `${zone.citySlug.toUpperCase()} Micro-Zone`,
    description: `Day Risk: Tier ${zone.dayRiskTier} → Night Risk: Tier ${zone.nightRiskTier}. Solo Female Walkability: ${zone.soloFemaleWalkabilityRating}/5.`,
    href: `/playbook/destinations/${zone.citySlug}/`,
    isExternal: false,
    highlight: `Avoid after dark: ${zone.redFlagCorridors[0]}`,
    badges: [
      {
        label: `Day: Tier ${zone.dayRiskTier}`,
        tone: "green",
      },
      {
        label: `Night: Tier ${zone.nightRiskTier}`,
        tone: zone.nightRiskTier >= 4 ? "red" : "amber",
      },
    ],
    media: {
      type: "icon",
      iconName: "map",
    },
    metrics: {
      risk: {
        tier: zone.nightRiskTier >= 4 ? "Critical" : "Elevated",
        score: zone.nightRiskTier * 20,
      },
    },
    comparison: {
      canCompare: true,
      pros: [`Safe thoroughfares: ${zone.safeThoroughfares[0]}`],
      cons: [`Red-flag: ${zone.redFlagCorridors[0]}`],
      keyDifferentiator: `${zone.sanctuaries.length} emergency 24h sanctuaries identified`,
    },
    actions: {
      primary: {
        label: "View City Safety Heatmap →",
        href: `/playbook/destinations/${zone.citySlug}/`,
        isExternal: false,
        icon: "arrowRight",
        tone: "primary",
      },
      canFavorite: true,
      canShare: true,
    },
  };
}

/**
 * Normalizes a generic SearchableItem into a self-contained CardData object.
 */
export function searchItemToCard(item: SearchableItem): CardData {
  const isExternal = Boolean(item.affiliateUrl && item.type === "product");
  const href = isExternal ? (item.affiliateUrl as string) : item.url;

  return {
    id: item.id,
    urn: `urn:sts:${item.type}:${item.slug}`,
    type: item.type as CardData["type"],
    title: item.title,
    subtitle: item.tagline || item.categoryLabel,
    description: item.description,
    href,
    isExternal,
    highlight: item.keyHighlight || undefined,
    badges: [
      {
        label: item.type.toUpperCase(),
        tone:
          item.type === "product"
            ? "amber"
            : item.type === "scam"
              ? "red"
              : item.type === "airport"
                ? "blue"
                : item.type === "micro_zone"
                  ? "purple"
                  : "neutral",
        icon:
          item.type === "product"
            ? "shield"
            : item.type === "scam"
              ? "alertTriangle"
              : item.type === "airport"
                ? "mapPin"
                : item.type === "micro_zone"
                  ? "map"
                  : "fileText",
      },
      {
        label: item.categoryLabel,
        tone: "neutral",
      },
    ],
    media: {
      type: "icon",
      iconName:
        item.type === "product"
          ? "shield"
          : item.type === "scam"
            ? "alertTriangle"
            : item.type === "airport"
              ? "mapPin"
              : item.type === "micro_zone"
                ? "map"
                : "fileText",
    },
    metrics: {
      price: item.priceFormatted
        ? {
            formatted: item.priceFormatted,
            tier: item.priceTier,
          }
        : undefined,
      rating: item.rating
        ? {
            value: item.rating,
            count: item.ratingCount || 1,
            label: "Score",
          }
        : undefined,
    },
    comparison: {
      canCompare: true,
      pros: item.pros || [],
      cons: item.cons || [],
      keyDifferentiator: item.keyHighlight || undefined,
    },
    actions: {
      primary: {
        label: isExternal
          ? `Buy / View Item (${item.priceFormatted || "Outbound"})`
          : "Open Protocol →",
        href,
        isExternal,
        icon: isExternal ? "externalLink" : "arrowRight",
        tone: "primary",
      },
      canFavorite: true,
      canShare: true,
    },
  };
}
