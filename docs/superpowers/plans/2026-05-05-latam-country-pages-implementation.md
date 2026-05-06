# LATAM Country Buyer Hubs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Spanish-only strategic buyer hubs for Paraguay, Uruguay, and Bolivia that replace the thin Spanish generic destination experience while preserving English/Russian generic destination coverage.

**Architecture:** Add a typed country-market content module and a reusable server-rendered page component. Route `/es/destinations/paraguay`, `/es/destinations/uruguay`, and `/es/destinations/bolivia` through the new component from the existing dynamic destination route, while keeping `/destinations/*` and `/ru/destinations/*` on the generic destination template. Metadata, sitemap, JSON-LD, CTAs, and content tests must enforce the strategy spec without presenting the Spanish buyer hubs as direct translations of generic EN/RU pages.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui, lucide-react, next-intl, Vitest.

---

## File Structure

- Create `content/latam-market-pages.ts`: typed source of truth for Paraguay, Uruguay, and Bolivia buyer hub copy, official source links, CTA labels, schema inputs, route steps, compliance sections, and FAQ.
- Create `content/__tests__/latam-market-pages.test.ts`: pure content contract tests for slugs, Spanish-only paths, source links, CTA tracking keys, banned proof claims, and country-specific strategy.
- Create `components/destinations/latam-market-page.tsx`: reusable server component that renders one country hub from the typed content module and emits WebPage, Service, and FAQPage JSON-LD. BreadcrumbList stays owned by `PageHero`/`Breadcrumbs`.
- Modify `app/[locale]/destinations/[slug]/page.tsx`: branch Spanish LATAM slugs to the market component and metadata while keeping generic EN/RU route behavior.
- Modify `app/sitemap.ts`: add explicit Spanish buyer hub sitemap entries and remove false Spanish alternates from generic destination entries for these three slugs.
- Optionally modify `app/[locale]/destinations/page.tsx` only if rendered Spanish destination index needs a stronger internal-link callout after inspection.
- Keep `next.config.ts` unchanged unless QA proves redirects are needed. For these pages, English and Russian generic pages remain live, so no redirect is expected.

## Task 1: Content Model And Content Contracts

**Files:**
- Create: `content/__tests__/latam-market-pages.test.ts`
- Create: `content/latam-market-pages.ts`

- [x] **Step 1: Write failing content contract tests**

Add tests that import `latamMarketPages`, `getLatamMarketPage`, and `latamMarketSlugs`.

Required assertions:

- slugs are exactly `["paraguay", "uruguay", "bolivia"]`
- every page has `locale` starting with `es-`
- every page path is `/es/destinations/${slug}`
- every page has at least 3 official source links
- every page has at least 5 FAQ entries
- every page has exactly 4 equipment focus items
- Paraguay content mentions `Ley 7565/2025` and does not say `pending`
- Uruguay content mentions `DGSA` and `Resolucion 98/016`
- Bolivia content says broker/importer confirmation is required and does not present a universal 10-year import cap
- no page contains banned phrases: `trusted by Paraguay`, `trusted by Uruguay`, `trusted by Bolivia`, `best price`, `cheapest`, `guaranteed`, `sin complicaciones`, `fácil`, `proof`, `fake`, `placeholder`, `TBD`

Run: `npm test -- content/__tests__/latam-market-pages.test.ts`
Expected: FAIL because the content module does not exist yet.

- [x] **Step 2: Implement `content/latam-market-pages.ts`**

Create a typed module with:

- `LatamMarketSlug`
- `LatamMarketPageContent`
- `latamMarketPages`
- `latamMarketSlugs`
- `getLatamMarketPage(slug: string)`
- `isLatamMarketSlug(slug: string)`

The content must include the strategic copy for each country in Spanish, using the approved recommendations:

- Paraguay: used U.S. ag machinery, Ley 7565/2025, five-year age rule, prior import license, cleaning/treatment/certificate/inspection, Hidrovia/Asuncion/Villeta route, importer/despachante confirmation.
- Uruguay: Montevideo, DGSA Resolucion 98/016, clean machinery, phytosanitary certificate, inspection/re-export risk, U.S. as second agricultural equipment supplier behind Brazil, despachante confirmation for tax/NCM.
- Bolivia: Santa Cruz, landlocked route through transit port planning, SENASAG and broker-confirmed documentation, Trade.gov best-prospect machinery categories, careful tax-benefit language rather than universal import-cap language.

All user-visible labels required by the component must live in this content file, not hardcoded inside JSX.

- [x] **Step 3: Run content contract tests**

Run: `npm test -- content/__tests__/latam-market-pages.test.ts`
Expected: PASS.

## Task 2: Reusable LATAM Market Page Component

**Files:**
- Create: `components/destinations/latam-market-page.tsx`
- Read-only reference: `app/[locale]/destinations/argentina/page.tsx`

- [x] **Step 1: Implement the component**

Create `LatamMarketPage({ content }: { content: LatamMarketPageContent })`.

The component must:

- render `PageHero` with `locale="es"` and `currentPath` derived from content
- use `TrackedContactLink` for WhatsApp CTAs
- use `TrackedCtaLink` for calculator/equipment/service CTAs
- render a scope split, route section, compliance section, equipment section, "send us this" block, process, credibility, FAQ, and final CTA
- emit JSON-LD scripts for WebPage, Service, and FAQPage; do not duplicate BreadcrumbList because `PageHero` already renders breadcrumbs
- keep visible section labels and CTA text from `content`, not JSX literals
- avoid claiming country-specific shipment history
- use site constants for organization, contact, stats, and OG image

- [x] **Step 2: Check for JSX hardcoded public strings**

Run a targeted grep:

`rg -n ">[A-Za-zÁÉÍÓÚáéíóúÑñ¿¡][^<{]*<|aria-label=\"[^\"]+\"|alt=\"[^\"]+\"" components/destinations/latam-market-page.tsx`

Expected: any matches are reviewed. Intentional values must be non-public technical labels or replaced by content fields.

- [x] **Step 3: Run TypeScript**

Run: `npm run type-check`
Expected: PASS after component creation.

## Task 3: Route, Metadata, Hreflang, And Sitemap Integration

**Files:**
- Modify: `app/[locale]/destinations/[slug]/page.tsx`
- Modify: `app/sitemap.ts`

- [x] **Step 1: Add Spanish route branch**

In `app/[locale]/destinations/[slug]/page.tsx`, import `getLatamMarketPage` and `LatamMarketPage`.

In `generateMetadata`:

- if `locale === "es"` and the slug has a LATAM market page, return country-specific title, description, keywords, canonical, Spanish-only language alternate, Open Graph, and Twitter metadata.
- keep Kazakhstan and generic branches intact.
- for generic destination metadata on these three slugs, keep EN/RU generic alternates but do not advertise the Spanish buyer hub as equivalent translation content.

In default page render:

- if `locale === "es"` and the slug has a LATAM market page, return `<LatamMarketPage content={page} />`.
- keep Kazakhstan and generic branches intact.

- [x] **Step 2: Add sitemap entries**

In `app/sitemap.ts`:

- import `latamMarketPages`
- add one explicit sitemap entry per LATAM market page with URL set to each Spanish path, weekly change frequency, priority `0.85`, and Spanish-only alternates matching metadata.
- ensure generic destination sitemap entries for Paraguay, Uruguay, and Bolivia do not list `/es/destinations/{slug}` as a language alternate because those Spanish pages are richer buyer hubs, not equivalent translations.

- [x] **Step 3: Build route/metadata test opportunity if practical**

If a pure test can import sitemap without Next runtime friction, add or extend a test to assert:

- sitemap includes `/es/destinations/paraguay`, `/es/destinations/uruguay`, `/es/destinations/bolivia`
- their alternates include the Spanish canonical URL and generic destination entries for these slugs do not list Spanish alternates.

If importing `app/sitemap.ts` creates runtime friction, skip the automated sitemap test and verify by `npm run build` plus manual inspection of generated route output.

- [x] **Step 4: Run validation**

Run:

- `npm test -- content/__tests__/latam-market-pages.test.ts`
- `npm run type-check`
- `npm run lint`

Expected: all pass.

## Task 4: Render QA And Copy QA

**Files:**
- No required file changes unless QA finds issues.

- [x] **Step 1: Run production build**

Run: `npm run build`
Expected: PASS. Note existing non-blocking warnings separately.

- [x] **Step 2: Start dev server**

Run: `npm run dev -- --port 3001`
Expected: dev server starts on `http://localhost:3001`.

- [x] **Step 3: Browser QA**

Use browser automation or Playwright against:

- `http://localhost:3001/es/destinations/paraguay`
- `http://localhost:3001/es/destinations/uruguay`
- `http://localhost:3001/es/destinations/bolivia`

Check:

- page loads
- no visible placeholders
- no unsupported English labels in the page body
- no layout overlap at desktop and mobile widths
- primary WhatsApp and calculator CTAs are present
- source links are clickable and visible
- FAQ renders
- structured data scripts exist
- generic English pages still load at `/destinations/paraguay`, `/destinations/uruguay`, `/destinations/bolivia`

- [x] **Step 4: Browser console QA**

Check browser console for red errors on each new page.

Expected: no material runtime errors.

## Task 5: Final Verification And Branch Handoff

**Files:**
- No code changes unless verification finds issues.

- [x] **Step 1: Run full gates**

Run:

- `npm run type-check`
- `npm run lint`
- `npm test`
- `npm run build`

Expected: all pass.

- [x] **Step 2: Commit implementation**

Commit only the LATAM page files and plan/spec changes from this worktree.

Suggested commit:

`feat(destinations): add latam buyer hubs`

- [ ] **Step 3: Report localhost preview**

Report:

- branch
- commit
- dev server URL
- changed routes
- verification commands and results
- any known caveats
