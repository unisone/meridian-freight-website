# DONE — LATAM per-country indexation & discovery fixes

**Goal:** Remove every *controllable* reason the 7 LATAM import "money" pages (`/es/destinations/{country}/importacion-maquinaria-usa`) + the import pillar aren't discovered and indexed by Google — the prerequisite for per-country organic ranking in the markets where Gate-A Google Ads runs (AR, BO, CL, PE, PY, UY, VE).

**Honest boundary:** This cannot *guarantee* ranking. Crawl/index timing is Google's call, and import search demand is ~0/mo across these markets (proven via Keyword Planner). Definition of done = "every page is fully discoverable, indexable, and technically optimal, with measurement in place" — i.e., no remaining reason *we* control.

**Grounding:** GSC URL Inspection 2026-06-30 — 0/7 money pages indexed; AR/CL/PE/VE money + pillar "URL unknown to Google"; BO/PY/UY "discovered, not indexed". Root cause = internal-link discovery gaps (verified in code below). See `mf-claude-ads/campaigns/seo-organic/2026-06-30-per-country-ranking-plan.md`.

## Acceptance checklist (behavior + how verified)

1. **Homepage block links all 7 countries.** `components/import-by-country.tsx` `IMPORT_PAGES` includes Peru + Venezuela (was 5, → 7) with unique ES anchors and hrefs `/destinations/{peru,venezuela}/importacion-maquinaria-usa`. *Verify:* fresh agent renders `/es` SSR HTML and confirms 7 crawlable `<a href="/es/destinations/{country}/importacion-maquinaria-usa">`; `next build` green.
2. **The import pillar is no longer an orphan.** At least one inbound internal link to `/es/blog/importar-maquinaria-agricola-usa` exists from an indexed surface (the homepage import-by-country section). *Verify:* grep shows a real `<Link>`/`<a>` to the pillar from a rendered page (was 0 inbound, only a policy-config reference).
3. **Pillar links the Peru + Venezuela spokes.** The pillar body links PE & VE money pages (was Peru 0 refs, Venezuela 1). *Verify:* pillar content contains crawlable links to both PE & VE money pages.
4. **All 7 money pages are index-eligible.** Each renders: self-referencing canonical, hreflang `es` + `x-default`, robots **index** (NOT noindex), and JSON-LD. *Verify:* fresh agent inspects `generateMetadata`/rendered `<head>` for each of the 7; flags any noindex/missing canonical.
5. **Sitemap completeness holds.** All 7 money pages + 7 segment pages + pillar present with sane `lastmod`. *Verify:* `app/__tests__/sitemap-latam.test.ts` + `sitemap-reciprocity.test.ts` green; grep generated sitemap.
6. **Nothing regressed.** `next build` + typecheck pass; sitemap/route/prefill test suites green. *Verify:* run the build + targeted tests, show output.
7. **Fresh-verifier sign-off.** A subagent given ONLY this checklist + the built system flips each item with evidence.

## Out of scope NOW (documented — correct sequencing, not loose ends)

- **Manual GSC "Request Indexing"** for the 5 "unknown" pages — GSC UI action; cannot be done in code (the Indexing API is officially JobPosting/BroadcastEvent-only). → **Operator action**, handed off with the exact URL list.
- **Full PE/VE Spanish import guides** (`content/latam-import-guides.ts`, the #172 pattern) — deliberately deferred until the 2026-07-06 GSC re-pull confirms pages are indexing. Building more uncrawled pages now is wasted effort (discovery-first, per the plan). **Trigger:** indexation lift confirmed.
- **Ranking itself** — Google's crawl decision + ~0/mo demand are outside our control.

## Decisions made on the user's behalf (each reversible)

- Pillar made discoverable via a link in the homepage import-by-country section (cleanest indexed surface; matches the existing A2 pattern).
- Deploy posture: per the batched question (branch+PR vs main).
