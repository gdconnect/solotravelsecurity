#!/usr/bin/env node
/**
 * Post-build: strip Next.js framework JS from the static export.
 * The site has zero client-side React (no "use client" components, no Link,
 * native HTML form for notify). The framework chunks exist only for the
 * React runtime + error boundaries + hydration markers — none of which
 * are needed for a fully static page.
 *
 * For each chunk: replace its contents with an empty IIFE.
 * For the HTML: remove all <script src="/_next/static/chunks/*.js"> tags.
 * Keep: <script type="application/ld+json"> (our structured data).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = join(process.cwd(), "out");
const CHUNKS = join(ROOT, "_next", "static", "chunks");

if (!statSync(ROOT, { throwIfNoEntry: false })) {
  console.error("No out/ directory. Run `npm run build` first.");
  process.exit(1);
}

const NOOP = "/* stripped — no client framework needed for static page */\n";
let stripped = 0;
let bytes = 0;

for (const f of readdirSync(CHUNKS)) {
  if (extname(f) !== ".js") continue;
  const p = join(CHUNKS, f);
  const size = statSync(p).size;
  writeFileSync(p, NOOP);
  stripped++;
  bytes += size - NOOP.length;
}
console.log(`stripped ${stripped} JS chunks, saved ${(bytes / 1024).toFixed(1)} KB`);

// Strip script tags from index.html
const indexPath = join(ROOT, "index.html");
let html = readFileSync(indexPath, "utf8");
const before = html.length;
// Remove <script src="/_next/static/chunks/*.js" ...></script>
// Keep <script type="application/ld+json">…</script>
html = html.replace(
  /<script\s+src="[^"]*_next\/static\/chunks\/[^"]+\.js"[^>]*>\s*<\/script>/g,
  "",
);
// Remove <script>…</script> blocks that hold __next_f push data (RSC payload)
// — for a static page these only contain pre-rendered HTML we already have.
html = html.replace(/<script>\s*self\.__next_f[\s\S]*?<\/script>/g, "");
const saved = before - html.length;
writeFileSync(indexPath, html);
console.log(`stripped script tags from index.html, saved ${saved} bytes`);

// Same for 404.html
const notFound = join(ROOT, "404.html");
try {
  let h = readFileSync(notFound, "utf8");
  const b = h.length;
  h = h.replace(/<script\s+src="[^"]*_next\/static\/chunks\/[^"]+\.js"[^>]*>\s*<\/script>/g, "");
  h = h.replace(/<script>\s*self\.__next_f[\s\S]*?<\/script>/g, "");
  writeFileSync(notFound, h);
  console.log(`stripped script tags from 404.html, saved ${b - h.length} bytes`);
} catch {}
