# Africa Paid-Search Pilot (Phase 2) — Definition of Done

**Feature:** Build + STAGE the Google Ads pilot for **Ghana, Kenya, Tanzania** (Wave 1). Two tracks — English landing pages (this repo) + a staged Google Ads package (`mf-claude-ads`). Grounded in `meridian-marketing-brain/wiki/deliverables/Africa Market Entry - Country Selection and Google Ads Plan.md`.

**HARD CONSTRAINT (blocks "done"):** Nothing goes live. No production deploy of pages, no mutation / enablement / spend on Google Ads account `378-300-2123`. Everything is staged for operator go/no-go. All copy is **first-draft for operator review before go-live** (mirrors the LATAM copy status: "pending client native review before go-live").

**Build order:** Ghana vertical slice first (page + campaign) → fresh-verify → replicate Kenya + Tanzania.

**Verification rule:** items flip to done ONLY when a fresh-context verifier agent checks them against the code/running system (never the builder's narrative).

## Plan-review corrections (staff-eng review, folded in 2026-07-01) — BINDING
1. **URLs are locale-neutral, NOT `/en/...`.** `localePrefix:"as-needed"` + `defaultLocale:"en"` ⇒ English is served **unprefixed**. Canonical African URLs = `/destinations/{country}/{segment}` (a `/en/...` URL 308-redirects → wastes a paid click + breaks the canonical). Sitemap already encodes `PREFIX={ en:"", es:"/es", ru:"/ru" }`. Google Ads final URLs use the unprefixed form.
2. **Generalize, don't duplicate.** One locale-parametric resolver + one Map (import both arrays); widen the record type `locale:"es"|"en"`; match `record.locale === locale` post-lookup so an es routeKey can't cross-resolve (trust-boundary safety). Separate *copy* files (es vs africa) are fine; a separate *resolver/registry* is not.
3. **Production-outage guard: do NOT inflate `EXPECTED_ROUTE_COUNT=14`.** `assertRouteRegistry()` runs at module import; every paid-search page + lead action + sitemap imports it. Keep a Spanish array (assert 14) + a separate African array (assert its own N); invariant is per-locale.
4. **Component AND quote form are hardcoded Spanish** — parameterize the ~15 chrome strings via a locale-keyed UI-labels layer (`labels[record.locale]`); es entries carry today's exact strings ⇒ `es` byte-identical (snapshot-proven). Thread `record.locale` into `PageHero`, `formatCount`, JSON-LD `availableLanguage`, hreflang.
5. **hreflang: African LPs are a standalone `en` group** — emit `locales:["en"], xDefault:"en"`; do NOT cross-link to the Spanish LATAM LPs (different pages, not translations).
6. **Lead action** derives locale server-side from the resolved record (never a client-sent locale); passes it to `getPaidSearchDestination`. English synthesized message + English auto-reply for en.
7. **Internal-link fix**: the `/destinations/{country}` generic hub does NOT exist for GH/KE/TZ (would 404) — drop that internalLink for African records; English labels for the calculator/equipment links.
8. **No per-country static branches** (only Argentina needs one, due to a shadowing static folder). The dynamic `[slug]/[segment]` route serves GH/KE/TZ directly.

### Logged decisions (reversible)
- Router tag for en leads = `#FRT_EN` (LATAM uses `#FRT_ES`) — confirm at go-live.
- UI labels via a locale-keyed module (no `messages/*.json` catalog change).
- Pages are `index:true` (indexable; paid + organic), mirroring LATAM.
- **Sequencing:** staged campaign package (`mf-claude-ads`, Track 2) built FIRST (self-contained, lower risk); the Track-1 locale-parametric page refactor is a separate carefully-verified pass. Final URLs in the campaign package use the corrected `/destinations/{country}/{segment}` form.

---

## Track 1 — Landing pages (`meridian-freight-website`)
Mirror the Spanish LATAM paid-search module as a **parallel English registry**; do NOT change LATAM (`es`) behavior.

- [ ] **T1.1** `content/africa-paid-search-destinations.ts` defines GH/KE/TZ × segments as immutable records mirroring the `LatamPaidSearchDestination` shape, `locale: "en"`, canonicalPath `/destinations/{country}/{segment}` (unprefixed — see correction #1), in a SEPARATE array with its own count invariant (correction #3). — *Verify: unit test asserts route count + no duplicate routeKeys + canonical-path shape (mirror `latam-paid-search-routes.test.ts`).*
- [ ] **T1.2** `content/africa-paid-search-copy.ts` — per-route English copy grounded in the country plan: gate-led H1 (import service, **not** a dealership), differentiators (we clear customs / we inspect the used machine in origin), scope in/out, process, quote-readiness, compliance caveat deferring admissibility to the destination customs broker, FAQ, WhatsApp prefill. — *Verify: unit test asserts every route has non-empty required fields; verifier reads for gate + both differentiators + compliance caveat, and no trademark misuse.*
- [ ] **T1.3** Real official-source URLs per country from the research (Ghana GRA / GSA G-CAP; Kenya KEBS PVoC / KRA; Tanzania TBS PVoC / TRA), each a real authority URL. — *Verify: verifier confirms each URL resolves to the named authority.*
- [ ] **T1.4** `lib/africa-paid-search-routes.ts` resolves EN African routes, returns null for invalid combos, and has a module-load invariant assertion. — *Verify: unit tests mirror the LATAM route tests.*
- [ ] **T1.5** The `[locale]/destinations/[slug]/[segment]` page renders African EN routes (H1, scope, process, compliance-by-CTA, FAQ, official sources, WhatsApp CTA) AND still renders LATAM `es` routes unchanged; invalid combo → true 404 (`dynamicParams=false`; `generateStaticParams` includes the en African params). — *Verify: fresh verifier builds/runs the app and loads `/en/destinations/ghana/<segment>` (renders), an invalid combo (404), and a LATAM `es` route (still renders).*
- [ ] **T1.6** WhatsApp/quote lead server action is locale-aware for African routes: trust-boundary rederivation selects the correct registry by locale (es→LATAM, en→Africa; still re-derived from the routeKey, never client `?country=`), and the synthesized message + **visitor auto-reply are English** for en leads. — *Verify: server-action test mirrors `paid-search-lead.test.ts` for a Ghana route; verifier confirms an en lead yields an English auto-reply.*
- [ ] **T1.9** Shared page component is locale-aware: chrome currently hardcoded Spanish (breadcrumb; eyebrows Proceso/Alcance/Cotización/Cumplimiento local/Fuentes oficiales; buttons; the "Meridian ha coordinado…" stats sentence; JSON-LD `availableLanguage`; `PageHero locale`; `formatCount` locale) renders in **English** for en routes; **`es` output byte-identical** (LATAM unchanged). — *Verify: verifier loads an en African page (English chrome) + a LATAM es page (unchanged); existing es tests still pass.*
- [ ] **T1.7** Sitemap includes the new EN African routes. — *Verify: sitemap test asserts the new canonical paths are present.*
- [ ] **T1.8** `npm run build` and the repo test suite pass; no regression to LATAM/`es` routes or existing tests. — *Verify: run build + tests, show output.*

## Track 2 — Staged Google Ads package (`mf-claude-ads`)
Mirror the live Gate-A doctrine; produce import-ready artifacts, do NOT apply to the account.

- [ ] **T2.1** Per-country Search campaign structure (GH/KE/TZ) staged as artifacts (mirror the existing campaign staging format), English, geo-targeted to the country, final URL = the new EN LP. — *Verify: artifact review + any repo validator/dry-run exits 0.*
- [ ] **T2.2** Equipment-pool PHRASE keywords per country filtered by US-brand + used + model signal; anti-shopper negative cage. — *Verify: verifier checks match types + negatives present + nothing over-broad.*
- [ ] **T2.3** Gate-RSA per ad group: English, gate pinned in H1 (import service, not a dealership), differentiators in copy (we clear customs / we inspect in origin), **trademarks keyword-only** (no John Deere/Caterpillar etc. in ad text), within Google limits (headlines ≤30, descriptions ≤90 chars). — *Verify: fresh verifier checks each RSA against the rules + char limits.*
- [ ] **T2.4** Conversion = WhatsApp qualified lead (mirror existing); per-country daily budgets proposed with one-line rationale. — *Verify: artifact review.*
- [ ] **T2.5** NOTHING applied live: no `mutate.py --apply`, no enablement; campaigns staged/paused/plan-only. — *Verify: no `--apply` in session history; artifacts are plan/CSV only.*

## Global
- [ ] **G.1** No prod deploy, no ad spend, no account mutation this session. — *Verify: `git status` on both repos shows branch/uncommitted work only; no deploy or `--apply` executed.*

---

## Decisions made on the operator's behalf (reversible; logged per the skill)
- **Segments** derived from demand evidence (GH/KE/TZ are agricultural-tractor-led + John Deere parts, with construction as secondary): each country gets `import-machinery-usa` (general) + `farm-tractors-usa`; Kenya/Tanzania also `heavy-equipment-usa` (construction/mining present). Adjust per operator.
- **Locale** `en` (reuse existing site i18n). **WhatsApp intake** reuses the existing site number/attribution system. **Ghana-first** vertical slice before replicating KE/TZ, so copy quality is reviewed once before 3×.
- **Budget** proposed as a capped pilot (per-country daily) in the staged package; operator sets the final number at go-live.
