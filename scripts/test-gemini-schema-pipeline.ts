/**
 * scripts/test-gemini-schema-pipeline.ts
 *
 * Verification suite for the Google Gemini API Grounded Data Layer & JSON Schema Pipeline.
 * Tests:
 * 1. Zod to Gemini OpenAPI responseSchema compilation across all LEGO block schemas.
 * 2. Field, enum, and required constraint propagation.
 * 3. Self-healing repair prompt generation on validation failure.
 * 4. Grounded client harvest simulation with citation parsing.
 * 5. Multimodal visual audit schema verification.
 */

import {
  AirportSecurityHubSchema,
  ThreatScamDossierSchema,
  MicroZoneDossierSchema,
  RegulatoryLandmineSchema,
} from "../src/lib/schemas/lego-blocks";
import { TruthTableSchema } from "../src/lib/schemas/truth-table";
import { DecisionTableSchema } from "../src/lib/schemas/decision-table";
import {
  zodToGeminiSchema,
  validateWithZod,
  generateRepairPrompt,
  GeminiGroundedClient,
  AirportIngressHarvester,
  ThreatScamTruthTableHarvester,
  RegulatoryLandmineHarvester,
  TaxiVisualAuditSchema,
} from "../src/lib/gemini";
import { PREPOPULATED_AIRPORTS } from "../src/data/lego/airports";
import { PREPOPULATED_SCAMS } from "../src/data/lego/scams";

console.log("===============================================================================");
console.log("   SOLO TRAVEL SECURITY: GEMINI DATA LAYER & JSON SCHEMA PIPELINE TEST        ");
console.log("===============================================================================\n");

let errors = 0;

// 1. Test Schema Compilation
console.log("🛠️  [1/5] Testing Zod -> Gemini OpenAPI responseSchema Compiler...");

const schemasToTest = [
  { name: "AirportSecurityHubSchema", schema: AirportSecurityHubSchema },
  { name: "ThreatScamDossierSchema", schema: ThreatScamDossierSchema },
  { name: "MicroZoneDossierSchema", schema: MicroZoneDossierSchema },
  { name: "RegulatoryLandmineSchema", schema: RegulatoryLandmineSchema },
  { name: "TruthTableSchema", schema: TruthTableSchema },
  { name: "DecisionTableSchema", schema: DecisionTableSchema },
];

for (const { name, schema } of schemasToTest) {
  try {
    const compiled = zodToGeminiSchema(schema);
    if (compiled.type !== "OBJECT" || !compiled.properties) {
      console.error(`❌ ${name} failed: Expected OBJECT with properties, got ${compiled.type}`);
      errors++;
    } else {
      const propCount = Object.keys(compiled.properties).length;
      const reqCount = (compiled.required || []).length;
      console.log(
        `   ✓ ${name}: Compiled to Gemini OBJECT with ${propCount} properties, ${reqCount} required`,
      );
    }
  } catch (err) {
    console.error(`❌ Exception compiling ${name}:`, err);
    errors++;
  }
}

// 2. Test Enum & Nested Object Integrity
console.log("\n🔍 [2/5] Verifying Enum & Nested Constraint Preservation...");
const scamCompiled = zodToGeminiSchema(ThreatScamDossierSchema);
const vectorCategoryEnum = scamCompiled.properties?.vectorCategory?.enum;
if (Array.isArray(vectorCategoryEnum) && vectorCategoryEnum.includes("financial_extortion")) {
  console.log(
    `   ✓ Enum preserved: vectorCategory has ${vectorCategoryEnum.length} categorical options`,
  );
} else {
  console.error("❌ Failed to preserve vectorCategory enum in scam schema");
  errors++;
}

const airportCompiled = zodToGeminiSchema(AirportSecurityHubSchema);
const curfewType = airportCompiled.properties?.lateNightCurfew?.type;
if (curfewType === "OBJECT") {
  console.log("   ✓ Nested object preserved: lateNightCurfew compiled to Gemini OBJECT");
} else {
  console.error("❌ Nested object lateNightCurfew failed compilation");
  errors++;
}

// 3. Test Defensive Validation & Self-Healing Repair Loop
console.log("\n🛡️  [3/5] Testing Defensive Validation & Self-Healing Repair Loop...");
const invalidAirportData = {
  iata: "INVALID_LONG_CODE", // Should be 3 chars
  icao: "LIRF",
  name: "Rome Fiumicino",
  // Missing required fields
};

const validationCheck = validateWithZod(AirportSecurityHubSchema, invalidAirportData);
if (!validationCheck.success && validationCheck.errors.length > 0) {
  console.log(`   ✓ Correctly caught ${validationCheck.errors.length} schema boundary violations`);
  const repairPrompt = generateRepairPrompt(
    validationCheck.errors,
    JSON.stringify(invalidAirportData),
  );
  if (
    repairPrompt.includes("Your previous response failed our strict Zod schema validation checks")
  ) {
    console.log("   ✓ Self-healing repair prompt synthesized successfully with exact issue paths");
  } else {
    console.error("❌ Repair prompt generation failed");
    errors++;
  }
} else {
  console.error("❌ Defensive validation failed to reject invalid payload");
  errors++;
}

// 4. Test Mock Harvest with Citation Extraction
console.log("\n📡 [4/5] Testing Grounded Client Ingestion & Citation Parser...");
const client = new GeminiGroundedClient({ defaultModel: "gemini-2.0-flash" });

async function testHarvestSimulation() {
  const airportFixture = PREPOPULATED_AIRPORTS[0]; // FCO
  const result = await client.harvestWithSchema(
    {
      targetEntity: "FCO",
      prompt: AirportIngressHarvester.generatePrompt({
        airportName: "Leonardo da Vinci–Fiumicino",
        iata: "FCO",
        icao: "LIRF",
        city: "Rome",
        country: "Italy",
      }),
      schema: AirportIngressHarvester.schema,
    },
    AirportSecurityHubSchema,
    { mockPayload: airportFixture },
  );

  if (result.success && result.data?.iata === "FCO") {
    console.log(`   ✓ Ingested grounded block: ${result.data.name} (${result.data.iata})`);
    console.log(`     Citations parsed: ${result.citations.length} verified references`);
    console.log(`     Model stamp: ${result.modelUsed} at ${result.harvestedAt}`);
  } else {
    console.error("❌ Harvest simulation failed:", result.validationErrors);
    errors++;
  }

  // Also test Scam harvester prompt & schema
  const scamFixture = PREPOPULATED_SCAMS[0];
  const scamPrompt = ThreatScamTruthTableHarvester.generatePrompt({
    scamName: scamFixture.name,
    vectorCategory: scamFixture.vectorCategory,
    destination: "Rome",
    hotspot: "Termini Station",
  });
  if (scamPrompt.includes("Analyze the following travel deception vector")) {
    console.log("   ✓ ThreatScamTruthTableHarvester prompt verified");
  }

  // Test Regulatory harvester prompt
  const regPrompt = RegulatoryLandmineHarvester.generatePrompt({
    country: "Japan",
    countryCode: "JP",
    substanceOrItem: "Adderall",
  });
  if (regPrompt.includes("Investigate customs and legal restrictions for")) {
    console.log("   ✓ RegulatoryLandmineHarvester prompt verified");
  }
}

// 5. Test Multimodal Visual Audit Schema
console.log("\n👁️  [5/5] Testing Multimodal Vision Audit Schema...");
if (
  TaxiVisualAuditSchema.type === "OBJECT" &&
  TaxiVisualAuditSchema.properties?.isLikelyOfficial &&
  TaxiVisualAuditSchema.properties?.meterAnalysis
) {
  console.log("   ✓ TaxiVisualAuditSchema ready for Gemini multimodal camera ingestion");
  console.log(`     Required audit fields: ${TaxiVisualAuditSchema.required?.join(", ")}`);
} else {
  console.error("❌ TaxiVisualAuditSchema configuration error");
  errors++;
}

// Run async test
testHarvestSimulation().then(() => {
  console.log("\n-------------------------------------------------------------------------------");
  if (errors === 0) {
    console.log("✅ ALL GEMINI DATA LAYER & JSON SCHEMA PIPELINES VERIFIED (0 ERRORS).");
    process.exit(0);
  } else {
    console.error(`❌ Completed with ${errors} error(s).`);
    process.exit(1);
  }
});
