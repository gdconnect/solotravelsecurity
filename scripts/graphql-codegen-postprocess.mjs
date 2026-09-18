#!/usr/bin/env node
/**
 * scripts/graphql-codegen-postprocess.mjs
 * 
 * graphql-17 compat shim for @graphql-codegen.
 * With graphql@17, typescript-operations re-emits enums and input objects,
 * colliding with the base plugin's declarations. This script strips duplicates.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const FILE = path.join(ROOT_DIR, "src", "lib", "graphql", "__generated__", "types.ts");

if (!fs.existsSync(FILE)) {
  process.exit(0);
}

const src = fs.readFileSync(FILE, "utf8");
const enumNames = [...src.matchAll(/^export enum (\w+) \{/gm)].map((m) => m[1]);
let out = src;
let stripped = 0;

for (const name of enumNames) {
  const union = new RegExp(`\\nexport type ${name} =(?:[^;]|\\n)*?;\\n`, "g");
  out = out.replace(union, () => {
    stripped += 1;
    return "\n";
  });
}

const typeDecls = [...out.matchAll(/^export type (\w+) =/gm)].map((m) => m[1]);
const seenNames = new Map();
for (const name of typeDecls) seenNames.set(name, (seenNames.get(name) ?? 0) + 1);

let strippedInputs = 0;
for (const [name, count] of seenNames) {
  if (count < 2) continue;
  const marker = `\nexport type ${name} = `;
  let from = out.indexOf(marker);
  for (let i = 1; i < count; i++) {
    from = out.indexOf(marker, from + 1);
    if (from === -1) break;
    const bodyStart = out.indexOf("{", from + marker.length);
    if (bodyStart === -1) break;
    let depth = 0;
    let end = -1;
    for (let j = bodyStart; j < out.length; j++) {
      if (out[j] === "{") depth++;
      else if (out[j] === "}") {
        depth--;
        if (depth === 0) {
          end = j;
          break;
        }
      }
    }
    if (end === -1) break;
    if (out[end + 1] === ";") end += 1;
    out = out.slice(0, from) + out.slice(end + 1);
    strippedInputs += 1;
    from = out.indexOf(marker);
  }
}

if (stripped > 0 || strippedInputs > 0) {
  fs.writeFileSync(FILE, out, "utf8");
}

console.log(
  `[codegen-postprocess] stripped ${stripped} duplicate enum union(s), ${strippedInputs} duplicate input type(s).`
);
