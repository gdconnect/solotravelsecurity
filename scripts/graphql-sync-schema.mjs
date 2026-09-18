#!/usr/bin/env node
/**
 * scripts/graphql-sync-schema.mjs
 * 
 * Advisory cross-repo schema sync with the Laravel Lighthouse backend.
 * Compares the backend's `php artisan lighthouse:print-schema` output
 * against `src/lib/graphql/schema.graphql`.
 * 
 * Usage:
 *   node scripts/graphql-sync-schema.mjs          # Refresh snapshot
 *   node scripts/graphql-sync-schema.mjs --check  # CI drift probe
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BACKEND_SCHEMA_PATHS = [
  process.env.BACKEND_SCHEMA_PATH,
  path.resolve(ROOT_DIR, "..", "solotravelsecurity-backend", "graphql", "schema.graphql"),
  path.resolve(ROOT_DIR, "..", "solotravelsecurity_backend", "graphql", "schema.graphql"),
  path.resolve(ROOT_DIR, "..", "solotravelsecurity-api", "graphql", "schema.graphql"),
  path.resolve(ROOT_DIR, "..", "backend", "graphql", "schema.graphql"),
].filter(Boolean);

const LOCAL_SCHEMA = path.join(ROOT_DIR, "src", "lib", "graphql", "schema.graphql");
const checkOnly = process.argv.includes("--check");

let backendPath = null;
for (const p of BACKEND_SCHEMA_PATHS) {
  if (p && fs.existsSync(p)) {
    backendPath = p;
    break;
  }
}

if (!backendPath) {
  console.log(
    `[graphql-sync] advisory: No backend schema export found at [${BACKEND_SCHEMA_PATHS.join(", ")}] — nothing to compare.`
  );
  process.exit(0);
}

const local = fs.existsSync(LOCAL_SCHEMA) ? fs.readFileSync(LOCAL_SCHEMA, "utf8") : "";
const backend = fs.readFileSync(backendPath, "utf8");

if (local.trim() === backend.trim()) {
  console.log(`[graphql-sync] Schema snapshot matches backend export (${backendPath}).`);
  process.exit(0);
}

if (checkOnly) {
  console.error(
    `[graphql-sync] DRIFT DETECTED: src/lib/graphql/schema.graphql differs from ${backendPath}.`
  );
  process.exit(1);
}

fs.writeFileSync(LOCAL_SCHEMA, backend, "utf8");
console.log(`[graphql-sync] Refreshed src/lib/graphql/schema.graphql from ${backendPath}.`);
