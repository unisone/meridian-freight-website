# Meridian Africa Wave-1 — Master Execution Plan & Tracker

**Single source of truth for the build.** Supersedes and absorbs: `docs/plans/africa-paid-search/DONE.md` (prior website checklist + staff-eng review) and `mf-claude-ads/campaigns/paid-africa/2026-07-01-africa-wave1-build-spec.md` (6-phase spec). Grounded in the approved strategy in `meridian-marketing-brain/wiki/deliverables/`.

**Scope (CEO-approved 2026-07-01, all-in):** ship the Ghana + Kenya + Tanzania market entry end to end — website pages, indexation, staged Google Ads, tracking, and **live launch behind the tracking-verified gate**. This lifts the prior plan's "nothing goes live" constraint.

**Two non-negotiable gates (from the feature-delivery skill):**
1. Every task below has a written verification method. It flips to ✅ only when a **fresh-context verifier agent** confirms it against the running system — never the builder's say-so.
2. **Launch gate (Phase 5):** no live ad spend until pages are live AND click→WhatsApp→conversion tracking is verified end-to-end AND the operator confirms go.

**Build order:** Ghana vertical slice (page + campaign) → fresh-verify → replicate Kenya + Tanzania. Quality reviewed once before 3×.

**Status legend:** ✅ done · 🔄 in progress · ⬜ pending · 🔒 gated (waiting on an upstream gate) · ⏸️ deferred

---

## Planning & research — ✅ COMPLETE (done in prior steps this session)

| # | Artifact | Status | Location |
|---|---|---|---|
| P-1 | Country selection & feasibility gating (16 countries) | ✅ | brain: `Africa Market Entry - Country Selection and Google Ads Plan.md` |
| P-2 | Live demand + SERP competitor baseline (GH/KE/TZ/EG/MA) | ✅ | brain: `Africa Demand and SERP Baseline 2026-07-01.md` |
| P-3 | Positioning & content strategy (10-page plan) | ✅ | brain: `Africa Market Entry - Positioning and Content Strategy.md` |
| P-4 | Prioritized organic SEO plan + GSC Day-0 baseline | ✅ | `mf-claude-ads/campaigns/seo-organic/2026-07-01-africa-wave1-seo-plan.md` |
| P-5 | Content engine (pillar/spokes, QA gates, 3 briefs) | ✅ | brain: `Africa Content Engine - Wave 1.md` |
| P-6 | 6-phase build spec | ✅ | `mf-claude-ads/campaigns/paid-africa/2026-07-01-africa-wave1-build-spec.md` |
| P-7 | Website DONE.md + staff-eng plan review (8 corrections) | ✅ | `docs/plans/africa-paid-search/DONE.md` |
| P-8 | Client/CEO market-entry report (md + branded PDF) | ✅ | brain deliverable + `_attachments/Meridian-Africa-Market-Entry-Plan-2026-07-01.pdf` |
| P-9 | Firecrawl + DataForSEO wired (Keychain MCPs, verified) | ✅ | `~/.claude/bin/{firecrawl,dataforseo}-mcp` |

**Binding staff-eng corrections carried into the build (from P-7):** URLs are locale-neutral (`/destinations/{country}/{segment}`, not `/en/...`) · one locale-parametric resolver, widen record type to `"es"|"en"`, match `record.locale` post-lookup · **keep separate per-locale route arrays each asserting its own count — do NOT inflate the ES `EXPECTED_ROUTE_COUNT` (module-load invariant / prod-outage guard)** · parameterize the ~15 hardcoded-Spanish chrome strings via a locale-keyed labels layer, es output byte-identical · African LPs are a standalone `en` hreflang group · lead action derives locale server-side from the resolved record · English synthesized message + English auto-reply for en leads.

---

## Phase 0 — Repo hygiene (finish stray WIP, clean start) — ✅ DONE

Uncommitted work was investigated by a fresh agent: **230/230 vitest passing, typecheck clean (exit 0), no TODO/stub markers, all 4 code groups complete and tested.** No loose ends to finish. Committed in logical groups; bulky QA snapshots + session tooling gitignored (not source).

| # | Task | Status | Evidence |
|---|---|---|---|
| 0.1 | Investigate + test all uncommitted WIP | ✅ | agent: 230/230 vitest, tsc exit 0, per-group complete |
| 0.2 | Finish loose ends | ✅ | none found — all groups internally consistent + tested |
| 0.3 | Commit WIP in logical groups | ✅ | `da07a33` cron-auth · `c14de8e` 404 · `a8e3edc` a11y/config · `04d458a` calculator · `7e4c5fd` docs |
| 0.4 | Cut `feat/africa-wave1` branch | ✅ | branch = feat/africa-wave1; plans committed `f6cefc9`; tree clean |

---

## Phase 1 — /destinations health — ✅ RESOLVED (no outage; 404 hygiene already fixed)

**Correction:** the earlier "whole EN /destinations section is broken in production" was a **grep false positive** — the matched string "Something went wrong" ships in the next-intl message payload on every *healthy* page, not as a rendered error boundary. Verified on production 2026-07-01:
- `/destinations`, `/destinations/kazakhstan`, `/destinations/brazil` → HTTP 200, real hero H1s ("Ship Machinery to Kazakhstan"), 13–20 route markers, **no error-boundary H1**. Pages are healthy.
- Agent confirmed: `git diff main...HEAD` for all destinations code is empty; dev-server render succeeds; `getAllDestinations`/slug pages fall back / `notFound()` safely, never throw.

**One real item — already built, ships on deploy:** production returns a **soft-404** (HTTP 200 + "page not found" content) for unknown slugs. The committed 404 work (`c14de8e`: `globalNotFound` + localized not-found) makes these return a real HTTP 404 (verified locally). No new code needed.

| # | Task | Status | Evidence |
|---|---|---|---|
| 1.1 | Confirm outage claim | ✅ | production probe: healthy render, false positive corrected |
| 1.2 | Real 404 for unknown slugs | ✅ (code) / ⬜ (deploy) | fixed in `c14de8e`; verify HTTP 404 in prod after Phase 3 deploy |
| 1.3 | Add ≥1 EN destination URL to uptime monitor + smoke test | ⬜ | `ops/site-uptime-monitor/monitor.mjs` + `.github/workflows/smoke-test.yml` include it (do in Phase 3 with the new Africa URLs) |
| 1.4 | (Optional) prod-side RCA if any real error surfaces in Sentry/Vercel logs | ⏸️ | separate prod investigation only if Sentry shows a real thrown digest — none evidenced |

---

## Phase 2 — Wave-1 pages (Ghana slice first, then KE/TZ) — 🔄 IN PROGRESS

**Ghana slice ✅ BUILT + VERIFIED + COMMITTED (`adcf8ec`).** Fresh adversarial verifier: 8/9 PASS with hard evidence (es non-regression proven by git-stash A/B render diff — the highest risk, cleared; EN LPs, hub, true 404s, trust boundary, separate per-locale count invariants, sitemap all PASS). One blocker caught + fixed: dead GSA "G-CAP" URL → live `gsa.gov.gh/import-inspection/` (verifier V8). 254/254 tests, tsc clean.
**Kenya + Tanzania 🔄 replicating** (data rows + copy + hubs on the verified shared infra; count invariant 2→6).

Two layers per country, all English, locale-neutral URLs. **Decision (logged):** build the organic hubs too (strategy + SEO plan want them; also removes the prior plan's internal-link-404 workaround).

### 2a. Organic country hubs — `/destinations/{ghana|kenya|tanzania}`
| # | Task | Status | Verify |
|---|---|---|---|
| 2a.1 | EN entries in `content/destinations.ts` (`destinationsEn`): ports Tema/Mombasa/Dar es Salaam, region, carriers, transit, meta, FAQ. No es/ru variants | ⬜ | page renders 200; sitemap `locales:["en"]` |
| 2a.2 | Hub content: regulatory clarity (PVoC Route A / G-CAP / TBS) + scope card ("Meridian covers / stays local") + WhatsApp CTA; NO fabricated African shipment stories | ⬜ | verifier reads for scope card, both differentiators, compliance caveat, no invented deal claims |
| 2a.3 | Hubs linked from `/destinations` index + a new EN homepage links block (the ES `import-by-country.tsx` is es-gated — do not reuse) | ⬜ | verifier: links present + resolve 200 |

### 2b. Paid landing pages — `/destinations/{country}/{segment}` (EN) — absorbs prior DONE.md T1.1–T1.9
Segments: `farm-tractors-usa` + `heavy-equipment-usa` (KE/TZ), `farm-tractors-usa` + `import-machinery-usa` per demand; final set confirmed against KW data in build.
| # | Task (prior ref) | Status | Verify |
|---|---|---|---|
| 2b.1 | `content/africa-paid-search-destinations.ts` — GH/KE/TZ × segments, `locale:"en"`, canonical `/destinations/{c}/{s}`, **separate array + own count invariant** (T1.1) | ⬜ | unit test: route count + no dup routeKeys + canonical shape |
| 2b.2 | `content/africa-paid-search-copy.ts` — EN copy: gate H1 (import service, not a dealership), differentiators, scope, process, quote-readiness, compliance caveat, FAQ (from live related-searches), WhatsApp prefill w/ `{{whatsapp_ref}}` (T1.2) | ⬜ | unit test non-empty required fields; verifier reads for gate+differentiators+caveat, no TM misuse |
| 2b.3 | Real official-source URLs (Ghana GRA/GSA G-CAP; Kenya KEBS PVoC/KRA; Tanzania TBS PVoC/TRA) (T1.3) | ⬜ | verifier confirms each URL resolves to named authority |
| 2b.4 | `lib/africa-paid-search-routes.ts` — locale-parametric resolver, null on invalid, module-load invariant (T1.4) | ⬜ | unit tests mirror LATAM route tests |
| 2b.5 | `[slug]/[segment]` page renders EN African routes AND unchanged ES LATAM routes; invalid combo → true 404 (T1.5) | ⬜ | verifier builds/runs: loads GH route, invalid=404, ES route unchanged |
| 2b.6 | Lead server action locale-aware: server-side re-derivation (es→LATAM, en→Africa; never client `?country=`); English synthesized msg + English auto-reply (T1.6) | ⬜ | server-action test for a Ghana route; verifier confirms EN auto-reply |
| 2b.7 | Shared page component + quote form locale-aware via labels layer; **es output byte-identical** (T1.9) | ⬜ | verifier loads EN African page (EN chrome) + ES page (unchanged); es snapshot tests pass |
| 2b.8 | Router tag `#FRT_EN` for EN leads (logged decision) | ⬜ | lead metadata carries `#FRT_EN` for en |

---

## Phase 3 — Indexation & guides — 🔒 GATED on Phase 2

| # | Task | Status | Verify |
|---|---|---|---|
| 3.1 | Sitemap includes all new EN routes (hubs + LPs) (T1.7) | ⬜ | sitemap test asserts canonical paths present |
| 3.2 | Deploy to prod; GSC Request Indexing for all new URLs same day | ⬜ | GSC submission log/screenshots |
| 3.3 | 3 EN guides in `content/blog.ts`: Kenya cost/PVoC · Ghana used tractors · KEBS origin-inspection explainer; interlinked hub↔guide | ⬜ | guides live 200, sitemapped, links resolve |
| 3.4 | Rank-tracking baseline (4 measured SERPs) registered as diff-anchor | ⬜ | snapshot stored, re-runnable |

---

## Phase 4 — Staged Google Ads (GH/KE/TZ) — 🔒 GATED on Phase 2 (URLs live) — absorbs prior DONE.md T2.1–T2.5

Mirror the live Gate-A doctrine. Build in `mf-claude-ads`. Absorb the existing staged Ghana build (`campaigns/paid-africa/2026-07-01-ghana-gate-a-build.md`); patch its cage with the **parcel-negative theme** (live-SERP finding).
| # | Task (prior ref) | Status | Verify |
|---|---|---|---|
| 4.1 | Per-country Search campaigns (GH/KE/TZ), English, country geo PRESENCE, final URL = the new EN LP (T2.1) | ⬜ | artifact review + validator/dry-run exit 0 |
| 4.2 | Equipment-pool PHRASE keywords (US-brand+used+model) + anti-shopper cage **+ parcel theme** per country (T2.2) | ⬜ | verifier: match types + negatives present, nothing over-broad |
| 4.3 | Gate-RSA per ad group: EN gate H1, differentiators in copy, trademarks keyword-only, char limits (H≤30/D≤90) (T2.3) | ⬜ | fresh verifier checks each RSA vs rules + limits |
| 4.4 | Conversion = WhatsApp qualified lead (existing OCI 7659985632); per-country daily budgets w/ rationale (T2.4) | ⬜ | artifact review |
| 4.5 | `mutate.py ops.json` **dry-run passes 0 errors**; campaigns staged PAUSED; register in Ads Brain Approval Queue | ⬜ | dry-run output exit 0; no `--apply` yet |

---

## Phase 5 — Tracking verify & LIVE launch — 🔒 GATED on Phases 2–4 + operator go

| # | Task | Status | Verify |
|---|---|---|---|
| 5.1 | Gate-B tracking end-to-end on an Africa LP: `?gclid=TEST` → `paid_search_refs` row → lead email carries UTM/gclid | ⬜ | verifier exercises the flow; evidence of the row + email |
| 5.2 | Africa cluster added to Dual Surface Scorecard (metrics `no data` until they exist) | ⬜ | scorecard shows the cluster |
| 5.3 | Operator sets final budgets + confirms go/no-go | ⬜ | recorded operator confirmation |
| 5.4 | `mutate.py ops.json --apply` → read-back verify → enable campaigns | ⬜ | live read-back: campaigns ENABLED, budgets set |
| 5.5 | Post-launch smoke: LPs 200, conversion action live, first-day spend within cap | ⬜ | verifier read of account + LPs |

---

## Verification protocol
Each phase ends with a **fresh-context verifier agent** whose only inputs are this checklist + the running system/code. It returns per-item verdicts with evidence. Failures → fix → re-verify. Items without verifier evidence are reported NOT VERIFIED, never ✅. Code review (diff) runs in parallel per repo convention.

## Decisions log (reversible)
- Build the organic `/destinations/{country}` hubs (strategy/SEO want them; removes prior internal-link 404 workaround). — 2026-07-01
- Router tag `#FRT_EN` for EN Africa leads. — inherited from prior plan
- Pages `index:true` (paid + organic), mirroring LATAM.
- UI labels via locale-keyed module (no `messages/*.json` change).
- Ghana-first vertical slice before KE/TZ.
- Budgets proposed GH $12 / KE $12 / TZ $10 per day (~$1,035/mo pilot); operator sets final at 5.3.

## Risks / honest caveats
- Regulatory facts (duties, age caps, FX) carry per-shipment broker-confirmation caveats; no landed-cost promises.
- No African deal history — never cite specific African shipments.
- Thin search demand — pilot sized accordingly.
- Swahili demand `no data` — English-first.
