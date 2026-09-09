# Solo Travel Security 🛡️✈️

**Coming soon** — a field-tested playbook for solo travellers moving through
unfamiliar places with awareness, planning and calm.

Built with **Next.js + OpenNext** for **Cloudflare Workers**, styled with
**Tailwind CSS v4**, structured with **atomic design** (Brad Frost).

This is the pre-launch landing page: a one-page coming-soon screen with the
manifesto paragraph, six operating principles, and an email-notify capture
form. No backend yet — all content lives in typed components under `src/`.

## Getting started

```bash
npm install
npm run dev        # local Next.js dev server → http://localhost:3005
```

Or with [`just`](https://github.com/casey/just):

```bash
just dev           # local dev server on port 3005
just lint          # ESLint + Oxlint
just oxlint        # ultra-fast linting with Oxlint
just format        # format code with oxfmt
just typecheck     # TypeScript check (tsc --noEmit)
just actionlint    # lint GitHub Actions workflows
just build         # production Next.js build
just preview       # build worker + preview locally with Wrangler
just deploy        # build + deploy to Cloudflare Workers
```

## Cloudflare (OpenNext)

```bash
npm run preview    # build the worker + preview locally (wrangler)
npm run deploy     # build + deploy to Cloudflare Workers
npm run upload     # build + upload a version without deploying
npm run cf-typegen # regenerate CloudflareEnv types
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
- **@opennextjs/cloudflare** → Cloudflare Workers (Workers Assets + Images)
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
