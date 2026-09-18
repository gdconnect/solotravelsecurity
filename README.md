# Solo Travel Security 🛡️✈️

**Coming soon** — a field-tested playbook for solo travellers moving through
unfamiliar places with awareness, planning and calm.

Built with **Next.js** (static export) on **Cloudflare Workers** static assets, styled with
**Tailwind CSS v4**, structured with **atomic design** (Brad Frost).

This is the pre-launch landing page: a one-page coming-soon screen with the
manifesto paragraph, six operating principles, and an email-notify capture
form. No backend yet — all content lives in typed components under `src/`.

## Getting started

```bash
npm install
npm run dev        # local Next.js dev server → https://solotravelsecurity.localhost (port 3020)
```

Or with [`just`](https://github.com/casey/just):

```bash
just dev           # local dev server → https://solotravelsecurity.localhost (port 3020)
just lint          # ESLint + Oxlint
just oxlint        # ultra-fast linting with Oxlint
just format        # format code with oxfmt
just typecheck     # TypeScript check (tsc --noEmit)
just actionlint    # lint GitHub Actions workflows
just build         # production Next.js build
just preview       # build + preview the static output locally with Wrangler
just deploy        # build + deploy to Cloudflare Workers
```

## Cloudflare (static assets)

`next build` writes `out/`; `wrangler.jsonc` serves it as static assets (no Worker
runtime, no bindings). `public/_headers` is honoured.

```bash
npm run preview    # build + serve out/ locally (wrangler dev)
npm run deploy     # build + deploy out/ to Cloudflare Workers
```

## Project structure

```
src/
  app/                       # Routes (just /, sitemap.ts, robots.ts, layout.tsx, globals.css)
  components/
    atoms/                   # Button, Badge, JsonLd, Logo, Reveal, SectionHeading
    molecules/               # EmailNotify, PrincipleList, StatRow
    organisms/               # SiteHeader, SiteFooter, Hero, ManifestoSection, NotifyBanner
    templates/               # PageShell (header → content → footer)
  lib/                       # schema (SITE_URL, JSON-LD graph builder, sitemap)
public/
  _headers, icon.svg, robots.txt, llms.txt
.github/workflows/ci.yml     # Lint, typecheck, build on PR + push
```

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Static export** (`output: "export"`) → Cloudflare Workers static assets
- **Tailwind CSS v4** with `@theme` design tokens
- **Bricolage Grotesque** + **Nunito** via `next/font/google`
- **lucide-react** icons (no emoji, no raster)
- **lefthook** pre-commit / pre-push hooks (oxlint, oxfmt, actionlint, typecheck, build)
- **Oxlint + ESLint + oxfmt** for fast feedback
- **CI** GitHub Actions: actionlint → oxlint → eslint → tsc → next build

## SEO & sharing

- Per-page Open Graph + Twitter cards via `app/layout.tsx` Metadata API
- `sitemap.xml` + `robots.txt` (generated from `src/lib/schema.ts`)
- `llms.txt` for AI crawlers
- JSON-LD graph on every page (Organization + WebSite + WebPage)
- Accessibility: skip link, visible focus ring, `prefers-reduced-motion` support, ARIA-labelled sections, AA contrast palette

## Content model

This is a one-page site at launch. The content is hand-authored in the
organism components themselves — `Hero`, `ManifestoSection`, and
`NotifyBanner`. When the full playbook launches, JSON-LD schemas and data
will move to typed JSON files under `src/data/` mirroring the watoto pattern.

## License

Content © Solo Travel Security. Code: MIT.
