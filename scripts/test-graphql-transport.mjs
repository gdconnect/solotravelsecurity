#!/usr/bin/env node
/**
 * scripts/test-graphql-transport.mjs
 * 
 * Verifies that the isomorphic GraphQL transport executes in fixture mode,
 * returns typed data, and successfully parses through Zod runtime boundaries.
 */

import { fetchGraphQL } from "../src/lib/graphql/fetch.ts";
import {
  CountryByIso2Document,
  AllCountriesDocument,
  GuardianPortalDocument,
  MatchedProductsDocument,
  TaxonomyTreeDocument,
  GenerateChecklistDocument,
  DecisionTablesDocument,
  SecurityTruthTablesDocument,
  SearchFacetedItemsDocument,
  BreadcrumbsForRouteDocument,
  UserFavoritesDocument,
  SaveFavoriteDocument,
  RemoveFavoriteDocument,
} from "../src/lib/graphql/__generated__/documents.ts";
import { parseCountryDossier } from "../src/lib/schemas/country.ts";
import { parseGuardianPortal } from "../src/lib/schemas/guardian.ts";
import { parseSecurityPillars } from "../src/lib/schemas/taxonomy.ts";
import { parseGeneratedChecklist } from "../src/lib/schemas/checklist.ts";
import { parseDecisionTable } from "../src/lib/schemas/decision-table.ts";
import { parseTruthTable } from "../src/lib/schemas/truth-table.ts";

async function test() {
  process.env.NEXT_PUBLIC_USE_FIXTURES = "1";
  console.log("[test-graphql] Testing isomorphic GraphQL transport in fixture mode...");

  // 1. Test CountryByIso2
  const countryResult = await fetchGraphQL({
    query: CountryByIso2Document,
    variables: { iso2: "IT" },
  });

  if (!countryResult || !countryResult.country) {
    throw new Error("CountryByIso2 returned empty payload in fixture mode");
  }
  console.log(`[test-graphql] CountryByIso2 resolved: ${countryResult.country.name} (${countryResult.country.iso2})`);

  // 2. Validate through Zod defensive boundary
  const validatedCountry = parseCountryDossier(countryResult.country);
  if (!validatedCountry) {
    throw new Error("CountryDossierSchema failed to parse CountryByIso2 fixture");
  }
  console.log(`[test-graphql] Zod CountryDossierSchema validated: ${validatedCountry.name}, Police: ${validatedCountry.emergencyNumbers.police}`);

  // 3. Test AllCountries
  const allCountriesResult = await fetchGraphQL({
    query: AllCountriesDocument,
    variables: { region: "Europe" },
  });
  console.log(`[test-graphql] AllCountries resolved: ${allCountriesResult.countries.length} European nations`);

  // 4. Test GuardianPortal
  const guardianResult = await fetchGraphQL({
    query: GuardianPortalDocument,
    variables: { token: "rome" },
  });
  const validatedGuardian = parseGuardianPortal(guardianResult.guardianPortal);
  if (!validatedGuardian) {
    throw new Error("GuardianPortalSchema failed to parse GuardianPortal fixture");
  }
  console.log(`[test-graphql] GuardianPortal resolved & validated: Status ${validatedGuardian.status}, Score: ${validatedGuardian.readinessScore}`);

  // 5. Test MatchedProducts
  const matchedResult = await fetchGraphQL({
    query: MatchedProductsDocument,
    variables: {
      context: {
        arrivalHour: 22,
        lodgingFloor: "ground",
        lodgingType: "hotel",
        destinationRiskTier: "MODERATE",
      },
    },
  });
  console.log(`[test-graphql] MatchedProducts resolved: ${matchedResult.matchedProducts.length} situation recommendations`);

  // 6. Test TaxonomyTree
  const taxonomyResult = await fetchGraphQL({
    query: TaxonomyTreeDocument,
  });
  const validatedPillars = parseSecurityPillars(taxonomyResult.securityPillars);
  if (!validatedPillars || validatedPillars.length < 7) {
    throw new Error("TaxonomyTree failed to resolve 7 pillars");
  }
  console.log(`[test-graphql] TaxonomyTree validated: ${validatedPillars.length} security pillars, ${taxonomyResult.lifecyclePhases.length} lifecycle phases`);

  // 7. Test GenerateChecklist
  const checklistResult = await fetchGraphQL({
    query: GenerateChecklistDocument,
    variables: {
      input: {
        archetype: "solo-female",
        destinationRiskTier: "MODERATE",
      },
    },
  });
  const validatedChecklist = parseGeneratedChecklist(checklistResult.generateChecklist);
  if (!validatedChecklist || validatedChecklist.totalItems === 0) {
    throw new Error("GenerateChecklist failed to return valid checklist payload");
  }
  console.log(
    `[test-graphql] GenerateChecklist validated: ${validatedChecklist.totalItems} items (${validatedChecklist.criticalCount} critical, ${validatedChecklist.spofCount} SPOF flags)`
  );

  // 8. Test DecisionTables
  const decisionResult = await fetchGraphQL({
    query: DecisionTablesDocument,
  });
  if (!decisionResult.decisionTables || decisionResult.decisionTables.length === 0) {
    throw new Error("DecisionTables returned empty list");
  }
  const validatedDT = parseDecisionTable(decisionResult.decisionTables[0]);
  if (!validatedDT) {
    throw new Error("DecisionTableSchema failed to parse first decision table");
  }
  console.log(`[test-graphql] DecisionTables validated: ${decisionResult.decisionTables.length} tables (${validatedDT.title})`);

  // 9. Test SecurityTruthTables
  const truthResult = await fetchGraphQL({
    query: SecurityTruthTablesDocument,
  });
  if (!truthResult.truthTables || truthResult.truthTables.length === 0) {
    throw new Error("SecurityTruthTables returned empty list");
  }
  const validatedTT = parseTruthTable(truthResult.truthTables[0]);
  if (!validatedTT) {
    throw new Error("TruthTableSchema failed to parse first truth table");
  }
  console.log(`[test-graphql] SecurityTruthTables validated: ${truthResult.truthTables.length} tables (${validatedTT.title})`);

  // 10. Test SearchFacetedItems
  const searchResult = await fetchGraphQL({
    query: SearchFacetedItemsDocument,
    variables: { filter: { query: "wedge", types: ["product"] } },
  });
  if (!searchResult.searchFacetedItems || searchResult.searchFacetedItems.items.length === 0) {
    throw new Error("SearchFacetedItems returned empty items");
  }
  console.log(
    `[test-graphql] SearchFacetedItems validated: ${searchResult.searchFacetedItems.totalCount} items found, ${searchResult.searchFacetedItems.facetCounts.types.length} type facets`
  );

  // 11. Test BreadcrumbsForRoute
  const breadcrumbResult = await fetchGraphQL({
    query: BreadcrumbsForRouteDocument,
    variables: { path: "/playbook/airports/fco" },
  });
  if (!breadcrumbResult.breadcrumbsForRoute || breadcrumbResult.breadcrumbsForRoute.length < 3) {
    throw new Error("BreadcrumbsForRoute returned invalid crumbs");
  }
  console.log(`[test-graphql] BreadcrumbsForRoute validated: ${breadcrumbResult.breadcrumbsForRoute.length} levels resolved`);

  // 12. Test SaveFavorite
  const saveFavResult = await fetchGraphQL({
    query: SaveFavoriteDocument,
    variables: {
      sessionToken: "sts_anon_test_123",
      item: {
        id: "rfid-wallet",
        type: "product",
        title: "Faraday Signal-Blocking RFID Wallet",
        url: "/playbook/gear/rfid-wallet",
        category: "Digital Security",
        description: "Blocks 13.56 MHz RFID / NFC sniffing",
        price: "$19.99",
        rating: 4.9,
        badge: "Digital Security",
        notes: "Crucial for crowded terminals",
      },
    },
  });
  if (!saveFavResult.saveFavorite || saveFavResult.saveFavorite.id !== "rfid-wallet") {
    throw new Error("SaveFavorite failed to return saved item");
  }
  console.log(`[test-graphql] SaveFavorite validated: Saved "${saveFavResult.saveFavorite.title}"`);

  // 13. Test UserFavorites
  const userFavsResult = await fetchGraphQL({
    query: UserFavoritesDocument,
    variables: { sessionToken: "sts_anon_test_123" },
  });
  if (!userFavsResult.userFavorites || userFavsResult.userFavorites.length === 0) {
    throw new Error("UserFavorites returned empty list after save");
  }
  console.log(`[test-graphql] UserFavorites validated: ${userFavsResult.userFavorites.length} favorite(s) retrieved`);

  // 14. Test RemoveFavorite
  const removeFavResult = await fetchGraphQL({
    query: RemoveFavoriteDocument,
    variables: { sessionToken: "sts_anon_test_123", itemId: "rfid-wallet" },
  });
  if (!removeFavResult.removeFavorite) {
    throw new Error("RemoveFavorite returned false");
  }
  console.log(`[test-graphql] RemoveFavorite validated: Successfully removed favorite`);

  console.log(
    "[test-graphql] All 14 GraphQL operations, faceted search, breadcrumbs, favorites, taxonomy, checklists, decision tables, truth tables, and Zod defensive boundaries verified successfully!"
  );
}

test().catch((err) => {
  console.error("[test-graphql] Test failed:", err);
  process.exit(1);
});
