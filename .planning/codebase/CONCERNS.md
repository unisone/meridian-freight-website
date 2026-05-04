# Codebase Concerns

**Analysis Date:** 2026-05-04

## Tech Debt

### 🔴 Three coexisting freight calculator engine versions (v1, v2, v3)

- **Issue:** Three generations of the freight engine + calculator wizard ship in production simultaneously. v1 is dead code (still tested), v2 is the previous public surface still wired to a route, v3 is the current target.
- **Files:**
  - `lib/freight-engine.ts` (v1) — only referenced by `lib/__tests__/freight-engine.test.ts`. Confirmed via grep: zero imports outside tests.
  - `lib/freight-engine-v2.ts` (v2) — still imported by `app/actions/calculator.ts:5`, `components/freight-calculator/calculator-wizard.tsx:39`, `components/freight-calculator/calculator-estimate-card.tsx:9`, `components/freight-calculator/port-coordinates.ts:6`. Also re-exports `formatDollar` consumed by the v3 action (`app/actions/calculator-v3.ts:17`).
  - `lib/calculator-v3/*.ts` (v3) — engine, policy, routes, route-health, import-cost, contracts, lead-metadata, landed-cost-profiles, route-transit-fallbacks. Total ≈ 9 files, ~3,500 lines.
  - `components/freight-calculator/calculator-wizard.tsx` (986 lines) — old wizard, only mounted by `app/[locale]/pricing/calculator-v2/page.tsx`.
  - `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines) — current wizard, mounted by both `app/[locale]/pricing/calculator/page.tsx` and `app/[locale]/pricing/calculator-v3/page.tsx`.
- **Impact:**
  - Two indexable URLs serve the v3 wizard (`/pricing/calculator` and `/pricing/calculator-v3`), risking duplicate-content / canonical confusion.
  - v2 route (`/pricing/calculator-v2`) is publicly reachable and may be indexed.
  - `formatDollar` helper still cross-imported from v2 into v3 — couples v3 lifecycle to v2 file.
  - Test surface inflated: v1, v2, v3 freight engine tests all run.
- **Fix approach:**
  1. Delete `lib/freight-engine.ts` and `lib/__tests__/freight-engine.test.ts` (verified unused outside tests).
  2. Inline or move `formatDollar` into `lib/calculator-v3/` (e.g. `lib/calculator-v3/format.ts`); remove the v3 → v2 import.
  3. Decommission `app/[locale]/pricing/calculator-v2/page.tsx` — either 308-redirect to `/pricing/calculator` or remove.
  4. Decide canonical URL: keep `/pricing/calculator` and 308-redirect `/pricing/calculator-v3` to it (or vice versa). Update `metadata.alternates` in the surviving page.
  5. Once v2 page is gone, delete `components/freight-calculator/calculator-wizard.tsx`, `calculator-estimate-card.tsx`, `lib/freight-engine-v2.ts`, `app/actions/calculator.ts`, `app/actions/calculator-data.ts`, and `lib/__tests__/freight-engine-v2.test.ts`.

### 🟡 `calculator-v3-wizard.tsx` is a 2,030-line client component

- **Issue:** Single file owns the entire multi-step wizard: step state, validation, route picking, equipment picking, globe rendering hook-up, estimate card, email gate, analytics, and submission. Largest file in the repo by ~2x.
- **Files:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines).
- **Impact:** Hard to test, hard to code-split, every change risks regressions across unrelated steps. Ships as a single client bundle to anyone landing on `/pricing/calculator`.
- **Fix approach:** Split per step (origin/equipment/destination/contact/result) with a shared reducer or context; lift `RouteGlobe` to a sibling and lazy-load via `next/dynamic` (already done for v2's globe — apply same pattern here).

### 🟡 v2 globe still mounted in v2 wizard, v3 wizard does not appear to use the same dynamic-loaded globe boundary

- **Issue:** `components/freight-calculator/route-globe.tsx` and `components/destinations-globe.tsx` correctly wrap `react-globe.gl` in `next/dynamic({ ssr: false })`. The v3 wizard at 2,030 lines should be inspected for whether it pays the same care; the v3 directory only contains `calculator-v3-wizard.tsx` (no dedicated `route-globe-v3.tsx`).
- **Files:**
  - `components/destinations-globe.tsx:7` — `dynamic(() => import("react-globe.gl"), { ssr: false })`. Good.
  - `components/freight-calculator/route-globe.tsx:7` — same. Good.
  - `components/freight-calculator-v3/calculator-v3-wizard.tsx` — verify globe import is dynamic (not yet confirmed; risk of pulling three.js into the main client bundle).
- **Impact:** If v3 wizard imports `react-globe.gl` statically, every visitor to `/pricing/calculator` downloads three.js (~600KB gzipped) on first paint.
- **Fix approach:** Grep the v3 wizard for `react-globe.gl`; if static, move to a dynamic import or to a sibling component that the wizard loads via `next/dynamic`.

### 🟡 ESLint config disables nothing project-wide, but 4 inline disables exist — three are `no-explicit-any` workarounds for missing third-party types

- **Issue:** `any` is escape-hatched in three places because `react-globe.gl` and `motion`'s `MarginType` are not properly typed. One `react-hooks/exhaustive-deps` disable.
- **Files:**
  - `components/destinations-globe.tsx:127` + `:128` — `useRef<any>` for the globe instance.
  - `components/freight-calculator/route-globe.tsx:109` + `:110` — same.
  - `components/scroll-reveal.tsx:46` + `:47` — `margin as any` for `motion`'s `MarginType`.
  - `components/schedule/schedule-list.tsx:137` — `react-hooks/exhaustive-deps` disabled.
- **Impact:** Low surface — only 3 `any`s in the entire `app/` + `components/` + `lib/` tree (per `grep -c`). `exhaustive-deps` disable can mask stale-closure bugs.
- **Fix approach:**
  - For globe refs: declare a minimal interface (`{ controls(): { autoRotate: boolean; autoRotateSpeed: number; ... } }`) instead of `any`.
  - For `MarginType`: define a local type alias matching `motion`'s expected shape.
  - For `schedule-list.tsx:137`: re-audit the dependency array; if intentional, document why with a comment instead of (or alongside) the disable.

### 🟢 Empty-catch best-effort error handling pattern

- **Issue:** 5 occurrences of `.catch(() => {})` swallow errors silently. These are documented as "best-effort" background work, but errors don't reach Sentry.
- **Files:**
  - `app/actions/contact.ts:223`
  - `app/actions/calculator.ts:448`
  - `app/actions/calculator-v3.ts:749`
  - `app/actions/booking.ts:254`
  - `components/whatsapp-widget.tsx:36`
- **Impact:** Tracking/analytics failures (`vercelTrack`, etc.) silently disappear. If a third-party endpoint starts 500ing, the team won't know.
- **Fix approach:** Replace `.catch(() => {})` with `.catch((err) => logger.warn({ route, err }))` or `Sentry.captureException(err)`.

## Known Bugs

### 🟡 Five orphaned ES translation keys with diacritics in identifiers

- **Symptoms:** `messages/es.json` contains 5 keys present in **no other locale** and **never referenced by any TSX/TS file**:
  - `ContactPage.fácilityHeading` (`messages/es.json:357`)
  - `DestinationsPage.regiónLatinAmerica` (`messages/es.json:387`)
  - `DestinationsPage.regiónAfrica`
  - `DestinationsPage.regiónEuropeCentralAsia`
  - `DestinationsPage.regiónAsiaOceania`
- **Trigger:** Likely accidental copy/paste of Spanish prose into JSON keys (keys should never contain accented characters).
- **Workaround:** None needed at runtime — they're dead. But the EN/RU equivalents (`facilityHeading`, `regionLatinAmerica`, etc.) may exist with correct ASCII names; ES is missing translations under those keys, causing fallback to EN.
- **Fix:** Diff against EN keys, rename `fácility` → `facility` and `región` → `region` in `messages/es.json`. Verify the corresponding TSX call sites resolve correctly afterwards.

## Security Considerations

### 🔴 PII in `.local-reports/` (Argentina prospect data)

- **Risk:** `.local-reports/argentina-prospects-private-2026-04-20.csv` and `.json` contain real prospect names, phone numbers, WhatsApp IDs, emails, Bitrix CRM URLs/IDs, deal IDs, conversation excerpts, and intent scores for ~hundreds of contacts.
- **Files:**
  - `.local-reports/argentina-prospects-private-2026-04-20.csv` (235 KB, mode 600)
  - `.local-reports/argentina-prospects-private-2026-04-20.json` (1.0 MB, mode 600)
- **Current mitigation:** `.gitignore` covers `.local-reports/` (verified via `git check-ignore`). File mode is 600.
- **Recommendations:**
  - Add an explicit pre-commit guard (`git status` check in CI) confirming this directory never appears.
  - Rotate the dataset out of the working tree to a dedicated tools repo or encrypted bucket — keeping CRM dumps inside a public-facing marketing-website repo is a leak waiting to happen if `.gitignore` is ever edited or the dir is added with `git add -f`.
  - Document a redaction/expiry policy.

### 🟢 CSP allows `'unsafe-inline'` for scripts and styles

- **Risk:** `next.config.ts:30` includes `'unsafe-inline'` in `script-src`, defeating script-injection mitigation. Same for `style-src`.
- **Files:** `next.config.ts:30,79`
- **Current mitigation:** Restricted host allowlist (Google Tag Manager, Meta Pixel, Sentry, Vercel) limits the blast radius of approved hosts.
- **Recommendations:** Migrate inline GA/Pixel snippets to nonces (`next/script` + nonce header) so `'unsafe-inline'` can be dropped from `script-src`.

### 🟢 Build-time env validation is a runtime `throw new Error`

- **Risk:** `next.config.ts:14-23` throws synchronously if `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, or `NEXT_PUBLIC_GOOGLE_ADS_ID` contain trailing whitespace. Good defensive guard, but only covers 3 vars.
- **Files:** `next.config.ts:7-23`
- **Recommendations:** Extend to all `NEXT_PUBLIC_*` vars used in inline `<Script>` tags. Consider Zod-based env schema (à la `lib/schemas.ts`).

## Performance Bottlenecks

### 🟡 Bundle bloat risk in v3 calculator client component

- **Problem:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines, `"use client"`) is the entry for `/pricing/calculator`, the lead-magnet route. Imports likely include validation, route catalog, translations, motion, and globe.
- **Files:** `components/freight-calculator-v3/calculator-v3-wizard.tsx`
- **Cause:** Monolithic client component pulls everything for every step into one chunk.
- **Improvement path:** Per-step code-splitting via dynamic imports keyed on wizard `step`. Move heavy deps (globe, motion variants, route catalog) behind `next/dynamic`.

### 🟢 173 PNGs at repo root (~38 MB working-directory bloat)

- **Problem:** 173 `.png` files committed-style at the project root: `audit-*.png`, `qa-*.png`, `verify-*.png`, `current-site-*.png`, `after-*.png`, `before-*.png`, `*-v2.png`, `*-v3.png`, `.tmp-calculator-v3-*.png`, etc. Total ~38 MB.
- **Files:** Repo root, e.g. `audit-about.png`, `verify-ru-combines-1280.png`, `.tmp-calculator-v3-mobile.png`. Plus 4.4 MB in `.playwright-mcp/` (160 entries) and 9.9 MB in `output/playwright/` with `v2-*` / `v3-*` / `v3-public-*` prefixes hinting at repeated visual-QA passes.
- **Cause:** Iterative visual-QA workflow drops screenshots into the repo root rather than a dedicated path.
- **Current mitigation:** `.gitignore` rules `*.png` + `audit-*.png` + `*-page.png` + `*-mobile.png` keep them out of git (with explicit allow-listing for `app/icon.png`, `public/favicon.png`, `public/logos/...`). Verified via `git check-ignore audit-about.png`.
- **Improvement path:**
  - Move all ad-hoc screenshots to `output/screenshots/<date>/` and add periodic cleanup script.
  - Delete the 173 root PNGs and 4 `.tmp-calculator-v3-*.png` files now (they are not tracked by git — safe to remove).
  - Clean up `output/playwright/` and `.playwright-mcp/` between sprints.

### 🟢 Stale calculator-v3 audit screenshots and `output/`

- **Problem:** `output/playwright/` contains 11+ files mixing `v2-rollback`, `v3-preview`, `v3-production`, `v3-public-production` prefixes — evidence of multiple deploy/rollback cycles whose artifacts were never cleaned.
- **Files:** `output/playwright/rollback-v2-production-calculator.png`, `output/playwright/v3-preview-*.png`, `output/playwright/v3-production-*.png`, `output/playwright/v3-public-production-*.png`.
- **Cause:** No retention policy for QA artifacts.
- **Improvement path:** Add `output/` to `.gitignore` (currently not there) and treat as fully ephemeral, or commit a `.gitkeep` and document expected naming.

## Fragile Areas

### 🟡 v2 wizard still wired to live URL and live freight-engine, but no longer the headline UX

- **Files:** `app/[locale]/pricing/calculator-v2/page.tsx`, `components/freight-calculator/calculator-wizard.tsx`, `app/actions/calculator.ts`, `lib/freight-engine-v2.ts`.
- **Why fragile:** v2 still relies on `lib/supabase-rates.ts` rate fetch, but new rate-table schema changes are likely landing for v3 first. v2 silently breaks if the schema diverges.
- **Safe modification:** Run `npm test` (Vitest covers v2 contract via `lib/__tests__/freight-engine-v2.test.ts`). When adding/removing rate columns in Supabase, search for `freight-engine-v2` and decide whether to maintain compat or retire v2.
- **Test coverage:** v2 has 69 tests per `CLAUDE.md`; v1 still has tests; v3 has 4 test files. Coverage is uneven across the three engines.

### 🟡 `proxy.ts` instead of `middleware.ts` for next-intl

- **Why this is named `proxy.ts`, not `middleware.ts`:** Next.js 16 renamed the convention from `middleware.ts` → `proxy.ts` as part of the Vercel Proxy refactor. **This is correct for Next.js 16** and not a bug. The file at `proxy.ts` registers `next-intl` middleware.
- **Files:** `proxy.ts:1-7`
- **Why noted:** Engineers familiar only with Next.js ≤15 may delete or rename this file thinking it's a typo. Document the convention in `CLAUDE.md` / `AGENTS.md`.
- **Safe modification:** Do not rename to `middleware.ts` — Next.js 16 expects `proxy.ts`.

### 🟢 `formatDollar` cross-import couples v3 actions to v2 lib

- **Files:** `app/actions/calculator-v3.ts:17` imports from `@/lib/freight-engine-v2`.
- **Why fragile:** Removing `lib/freight-engine-v2.ts` will break the v3 server action.
- **Safe modification:** Move `formatDollar` to a neutral location (e.g. `lib/calculator-v3/format.ts` or `lib/utils.ts`) before deleting v2.

## Scaling Limits

### 🟢 Single-locale Supabase rate cache implicit

- **Current capacity:** Calculator pulls rates per request (server action). No documented caching layer between Next.js and Supabase REST.
- **Limit:** Bursts on `/pricing/calculator` (e.g. paid-traffic landings) translate 1:1 to Supabase queries.
- **Scaling path:** Add `unstable_cache` or `revalidate` on `getCalculatorData` server action, keyed on rate-book signature.

## Dependencies at Risk

### 🟢 `lucide-react` pinned at `^1.8.0`

- **Risk:** lucide-react jumped from 0.x to 1.x in 2026. The major-version transition introduced breaking changes. Worth verifying the project's icon imports still resolve cleanly after `npm update`.
- **Files:** `package.json:18`
- **Impact:** Build/type errors if icon names changed; nothing critical at runtime.
- **Migration plan:** None required if lockfile is healthy. Pin to a tested version if upgrading.

### 🟢 React 19 + Next 16 + TS 6 — bleeding edge

- **Risk:** `react: 19.2.5`, `next: 16.2.4`, `typescript: ^6`, `@types/node: ^25` all on latest majors. Limited library ecosystem coverage; some shadcn/Radix components may lag.
- **Files:** `package.json`
- **Impact:** Future deps may not yet support these majors. `react-globe.gl` is at `^2.37.1` and might pre-date React 19's stricter `useRef` typing — confirmed by the `useRef<any>` workaround.
- **Migration plan:** None now; monitor `react-globe.gl` for typed-ref support; revisit `@types/node ^25` once Node 24 LTS lands.

### 🟢 `@base-ui/react ^1.4.1` and `shadcn ^4.3.1` cohabit

- **Risk:** Both `@base-ui/react` (the new Radix successor) and `shadcn` ship as runtime deps. The shadcn CLI is normally a devDependency.
- **Files:** `package.json:14, 25`
- **Impact:** `shadcn` in `dependencies` means it ships with production builds (~few hundred KB).
- **Migration plan:** Move `shadcn` to `devDependencies` if it's only used for code generation.

## Missing Critical Features

### 🟡 No automated screenshot/visual-regression hygiene

- **Problem:** 173 root PNGs + `output/playwright/` + `.playwright-mcp/` show heavy reliance on manual visual QA, but no committed Playwright config or CI gate.
- **Blocks:** Reliable regression detection across the v2 → v3 migration. Each refactor risks visual regressions that only the human catches.
- **Fix approach:** Adopt Playwright + `@playwright/test` snapshot matching, store baselines under `tests/__snapshots__/`, gate PRs on snapshot diffs.

### 🟢 SEO-REPORT-2026-03-19.md tracks open action items not migrated to issue tracker

- **Problem:** `SEO-REPORT-2026-03-19.md:172-200` lists 10 manual action items (Google Search Console, Bing Webmaster, Google Reviews, more destinations, etc.) — none tracked in `.planning/`, GitHub issues, or Linear.
- **Files:** `SEO-REPORT-2026-03-19.md`
- **Blocks:** Items will rot. Already 6+ weeks since report.
- **Fix approach:** Migrate items to Linear (project Meridian Freight, MER) or `.planning/backlog.md`.

## Test Coverage Gaps

### 🟡 No component or e2e tests for the v3 wizard

- **What's not tested:** `components/freight-calculator-v3/calculator-v3-wizard.tsx` (2,030 lines, the conversion-critical surface) has no test file. Vitest config (`vitest.config.ts`) plus 14 test files cover only `lib/` engines and `app/actions/`.
- **Files:** No `__tests__/calculator-v3-wizard.test.tsx` exists.
- **Risk:** Step transitions, validation gating, email-gate behavior, route reset logic — all client-side state — can regress silently.
- **Priority:** High. This is the lead-magnet UI.

### 🟡 No tests for server actions other than the legacy three

- **What's not tested:** `app/actions/calculator-v3.ts` (754 lines) and `app/actions/calculator-v3-data.ts` are not in `app/actions/__tests__/`. Only `booking.test.ts`, `contact.test.ts`, and `calculator.test.ts` (legacy) exist.
- **Files:** `app/actions/__tests__/` (only 3 test files; missing v3, indexnow, track routes, cron jobs).
- **Risk:** Lead-pipeline regressions in v3 (Supabase insert, Resend email, Slack, Meta CAPI) won't be caught.
- **Priority:** High.

### 🟢 No tests for Supabase clients

- **What's not tested:** `lib/supabase-rates.ts`, `lib/supabase-containers.ts` (659 lines) — both are network-bound and untested. `lib/sync-containers.ts` (691 lines) has tests but the underlying Supabase wrapper does not.
- **Files:** `lib/supabase-rates.ts`, `lib/supabase-containers.ts`.
- **Risk:** Schema drift goes undetected until production.
- **Priority:** Medium.

### 🟢 No accessibility test pass

- **What's not tested:** No axe / pa11y / Lighthouse-CI gate. 17 `<button>` elements across `components/` were not auditied for `aria-label` on icon-only buttons.
- **Files:** `components/header.tsx`, `components/whatsapp-widget.tsx`, navigation components, etc.
- **Risk:** WCAG 2.1 AA non-compliance for screen-reader users; potential ADA/Section 508 exposure.
- **Priority:** Medium.

---

## Severity Summary

- 🔴 High (2): Three coexisting calculator engines; PII in `.local-reports/`.
- 🟡 Medium (10): Calculator wizard size; v3 globe boundary check; eslint inline disables; orphaned ES translation keys; v3 wizard test gap; v3 server-action test gap; v2 wizard fragility; `proxy.ts` discoverability; `formatDollar` cross-import; missing visual-regression hygiene.
- 🟢 Low (10): Best-effort empty catches; CSP unsafe-inline; env-validation coverage; root-PNG bloat; `output/` hygiene; Supabase caching headroom; lucide-react major bump; bleeding-edge stack; shadcn dep classification; SEO action-item tracking; Supabase client tests; a11y testing.

---

*Concerns audit: 2026-05-04*
