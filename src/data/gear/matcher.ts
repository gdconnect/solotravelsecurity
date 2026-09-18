import type { SituationalContext, ProductRule, MatchedProduct } from "./types";
import catalogData from "./catalog.json";
import { SITE_URL } from "@/lib/schema";

export const GEAR_CATALOG: ProductRule[] = catalogData as unknown as ProductRule[];

/**
 * Deep subset evaluation: checks if an object satisfies a JSON Schema subset constraint.
 * Supports: enum arrays, string/number literals, min/max ranges, anyOf, and nested properties.
 */
export function matchesCriteria(target: unknown, schema: unknown): boolean {
  if (!schema || typeof schema !== "object") return true;

  const s = schema as Record<string, unknown>;

  // Check enum constraints
  if (Array.isArray(s.enum)) {
    return s.enum.includes(target);
  }

  // Check anyOf constraints
  if (Array.isArray(s.anyOf)) {
    return s.anyOf.some((subSchema) => matchesCriteria(target, subSchema));
  }

  // Check numeric boundaries
  if (typeof target === "number") {
    if (typeof s.minimum === "number" && target < s.minimum) return false;
    if (typeof s.maximum === "number" && target > s.maximum) return false;
  }

  // Check nested properties
  if (s.properties && typeof s.properties === "object") {
    if (!target || typeof target !== "object") return false;
    const targetObj = target as Record<string, unknown>;
    const propSchemas = s.properties as Record<string, unknown>;

    for (const [key, propSchema] of Object.entries(propSchemas)) {
      if (!matchesCriteria(targetObj[key], propSchema)) {
        return false;
      }
    }
  }

  // Check required properties
  if (Array.isArray(s.required)) {
    if (!target || typeof target !== "object") return false;
    const targetObj = target as Record<string, unknown>;
    for (const reqKey of s.required) {
      if (targetObj[reqKey] === undefined || targetObj[reqKey] === null) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Evaluates the active catalog against a traveler's situational context.
 * Returns matching products ordered by urgency/priorityRank.
 */
export function evaluateProductsForSituation(
  context: SituationalContext,
  catalog: ProductRule[] = GEAR_CATALOG,
): MatchedProduct[] {
  const matches: MatchedProduct[] = [];

  for (const product of catalog) {
    if (matchesCriteria(context, product.triggerCriteria)) {
      matches.push({
        ...product,
        isPrimaryRecommendation: false,
      });
    }
  }

  // Sort by priority rank (1 = highest urgency)
  matches.sort((a, b) => a.priorityRank - b.priorityRank);

  if (matches.length > 0) {
    matches[0].isPrimaryRecommendation = true;
  }

  return matches;
}

/**
 * Builds Schema.org JSON-LD Product & Review graph with Google Pros & Cons support.
 */
export function buildProductSchemaGraph(product: ProductRule, canonicalUrl: string) {
  const productId = `${canonicalUrl}#product-${product.sku.toLowerCase()}`;

  const itemType = product.schemaOrg.itemType || "Product";

  const graph: Record<string, unknown> = {
    "@type": itemType,
    "@id": productId,
    name: product.name,
    description: product.situationalRationale,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.schemaOrg.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.schemaOrg.price,
      priceCurrency: product.schemaOrg.priceCurrency,
      availability: product.schemaOrg.availability || "https://schema.org/InStock",
      url: product.schemaOrg.affiliateUrl,
      seller: {
        "@type": "Organization",
        name: product.schemaOrg.brand,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.schemaOrg.rating.value,
      reviewCount: product.schemaOrg.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Organization",
        name: "Solo Travel Security Field Lab",
        url: SITE_URL,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.schemaOrg.rating.value,
        bestRating: 5,
      },
      positiveNotes: {
        "@type": "ItemList",
        itemListElement: product.schemaOrg.pros.map((pro, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: pro,
        })),
      },
      negativeNotes: {
        "@type": "ItemList",
        itemListElement: product.schemaOrg.cons.map((con, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: con,
        })),
      },
    },
  };

  if (product.schemaOrg.image) {
    graph.image = product.schemaOrg.image;
  }

  if (product.schemaOrg.gtin13) {
    graph.gtin13 = product.schemaOrg.gtin13;
  }

  if (product.schemaOrg.author) {
    graph.author = {
      "@type": "Person",
      name: product.schemaOrg.author,
    };
  }

  if (product.schemaOrg.isbn) {
    graph.isbn = product.schemaOrg.isbn;
  }

  return graph;
}

/**
 * Maps matched products into Schema.org HowTo tool and supply arrays.
 */
export function buildHowToGearElements(products: ProductRule[]) {
  const tools: Array<{ "@type": string; name: string }> = [];
  const supplies: Array<{ "@type": string; name: string }> = [];

  for (const p of products) {
    if (p.howToRole === "supply") {
      supplies.push({
        "@type": "HowToSupply",
        name: p.name,
      });
    } else {
      tools.push({
        "@type": "HowToTool",
        name: p.name,
      });
    }
  }

  return { tools, supplies };
}
