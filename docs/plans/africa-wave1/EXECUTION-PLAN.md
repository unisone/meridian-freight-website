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
| 1.2 | Real 404 for unknown slugs | ✅ | CLOSED via PR #184 (`6d164d1`): locale-aware getDestinationStaticParams + dynamicParams=false on the country route (streamed-notFound root cause). Verified in prod 2026-07-02: 13/13 matrix PASS — /destinations/zzz-nope 404, /es/destinations/ghana 404, /ru/destinations/ghana 404; all real pages (EN/ES/RU + LATAM LPs + Africa) 200 |
| 1.3 | Add ≥1 EN destination URL to uptime monitor + smoke test | ✅ | `8a0d14f`: ghana-lp-en + kenya-destination-en in monitor; Africa URLs in smoke-test; post-merge smoke run PASSED |
| 1.4 | (Optional) prod-side RCA if any real error surfaces in Sentry/Vercel logs | ⏸️ | separate prod investigation only if Sentry shows a real thrown digest — none evidenced |

---

## Phase 2 — Wave-1 pages (Ghana slice first, then KE/TZ) — ✅ DONE

**Ghana slice ✅ (`adcf8ec`).** Fresh adversarial verifier: 8/9 PASS with hard evidence (es non-regression proven by git-stash A/B render diff — highest risk, cleared). One blocker caught + fixed: dead GSA "G-CAP" URL → live `gsa.gov.gh/import-inspection/`.
**Kenya + Tanzania ✅ (`77c96f3`).** Data-only on verified infra (LATAM + Ghana + shared infra untouched, confirmed by diff). Count invariant 2→6. Official URLs KRA/KEBS/TRA/TBS verified live (200). Render-verified in a dev server: all 6 LPs + 3 hubs render EN gate H1; invalid combo → 404; Kenya KEBS Route-A/PVoC/Mombasa wedge present. **261/261 tests, tsc clean.**
Copy is first-draft for operator review (Kenya ~8yr age-limit + TZ mandatory-PVoC framing flagged for broker confirmation; hedged as per-shipment in copy). 6 routes live on branch: {ghana,kenya,tanzania}/{farm-tractors-usa,heavy-equipment-usa} + 3 hubs.

Two layers per country, all English, locale-neutral URLs. **Decision (logged):** build the organic hubs too (strategy + SEO plan want them; also removes the prior plan's internal-link-404 workaround).

### 2a. Organic country hubs — `/destinations/{ghana|kenya|tanzania}`
| # | Task | Status | Verify |
|---|---|---|---|
| 2a.1 | EN entries in `content/destinations.ts` (`destinationsEn`): ports Tema/Mombasa/Dar es Salaam, region, carriers, transit, meta, FAQ. No es/ru variants | ✅ | verified: 3 hubs render 200 in prod; sitemap en-only |
| 2a.2 | Hub content: regulatory clarity (PVoC Route A / G-CAP / TBS) + scope card ("Meridian covers / stays local") + WhatsApp CTA; NO fabricated African shipment stories | ✅ | copy QA + fact-check passed (all 9 regulatory claims confirmed); no invented deal claims |
| 2a.3 | Hubs linked from `/destinations` index + a new EN homepage links block (the ES `import-by-country.tsx` is es-gated — do not reuse) | ✅ | hubs linked from /destinations index (verified live) |

### 2b. Paid landing pages — `/destinations/{country}/{segment}` (EN) — absorbs prior DONE.md T1.1–T1.9
Segments: `farm-tractors-usa` + `heavy-equipment-usa` (KE/TZ), `farm-tractors-usa` + `import-machinery-usa` per demand; final set confirmed against KW data in build.
| # | Task (prior ref) | Status | Verify |
|---|---|---|---|
| 2b.1 | `content/africa-paid-search-destinations.ts` — GH/KE/TZ × segments, `locale:"en"`, canonical `/destinations/{c}/{s}`, **separate array + own count invariant** (T1.1) | ✅ | registry live, separate array, invariant N=6; tests green |
| 2b.2 | `content/africa-paid-search-copy.ts` — EN copy: gate H1 (import service, not a dealership), differentiators, scope, process, quote-readiness, compliance caveat, FAQ (from live related-searches), WhatsApp prefill w/ `{{whatsapp_ref}}` (T1.2) | ✅ | 6 LP copies live; gate+differentiators+caveat verified by content QA; {{whatsapp_ref}} intact |
| 2b.3 | Real official-source URLs (Ghana GRA/GSA G-CAP; Kenya KEBS PVoC/KRA; Tanzania TBS PVoC/TRA) (T1.3) | ✅ | all 6 authority URLs verified live (dead G-CAP link caught+fixed pre-ship) |
| 2b.4 | `lib/africa-paid-search-routes.ts` — locale-parametric resolver, null on invalid, module-load invariant (T1.4) | ✅ | resolver live; invalid combos 404 in prod |
| 2b.5 | `[slug]/[segment]` page renders EN African routes AND unchanged ES LATAM routes; invalid combo → true 404 (T1.5) | ✅ | verified in prod: EN routes 200, ES routes unchanged, invalid → 404 |
| 2b.6 | Lead server action locale-aware: server-side re-derivation (es→LATAM, en→Africa; never client `?country=`); English synthesized msg + English auto-reply (T1.6) | ✅ | locale-aware lead action shipped; #FRT_EN + EN auto-reply; trust boundary verified |
| 2b.7 | Shared page component + quote form locale-aware via labels layer; **es output byte-identical** (T1.9) | ✅ | labels layer shipped; es proven byte-identical (A/B render diff); per-country brokerTerm preserved in rebase |
| 2b.8 | Router tag `#FRT_EN` for EN leads (logged decision) | ✅ | #FRT_EN in prefill (verified in prod LP HTML) |

---

## Phase 3 — Indexation & guides — ✅ DONE (GSC Request-Indexing accelerant = optional operator step)

| # | Task | Status | Evidence |
|---|---|---|---|
| 3.1 | Sitemap includes all new EN routes (hubs + LPs) | ✅ | render-verified in sitemap.xml (en-only groups) |
| 3.3 | 3 EN guides (`058fa98`): Kenya cost/PVoC · Ghana tractors · KEBS explainer, interlinked | ✅ | all 3 render 200, internal links present, sitemap en-only (no es/ru leak); 261 tests |
| 3.5 | Monitor + smoke-test Africa URLs (`8a0d14f`) | ✅ | Ghana LP/hub + Kenya hub/LP added |
| 3.2 | Deploy to prod; GSC submission | ✅ deploy / 🔶 accelerant | deployed (PR #183); sitemap live w/ all 12 URLs; GSC Day-0 baseline captured (all "unknown to Google"). URL-level Request Indexing = GSC-UI-only manual accelerant (operator, optional — sitemap auto-crawl covers it) |
| 3.4 | Rank-tracking baseline (4 measured SERPs) as diff-anchor | ✅ | stored in brain `Africa Demand and SERP Baseline 2026-07-01`; re-pull folded into the 2026-07-06 program checkpoint (with LATAM) |

**Website build COMPLETE on `feat/africa-wave1`:** 6 LPs + 3 hubs + 3 guides + monitor, all verified, clean tree, 261 tests, tsc clean, `npm run build` exit 0 (9 EN routes prerendered). Commits: `adcf8ec` Ghana · `77c96f3` KE/TZ · `8a0d14f` monitor · `058fa98` guides.

### ✅ DEPLOY BLOCKER RESOLVED — reconciled onto current main (2026-07-01)
`feat/africa-deploy` = feat/africa-wave1 rebased onto `origin/main` (pillar dupes dropped). Conflicts resolved incl. the non-trivial one: main's per-country `brokerTerm` × my locale-labels refactor → the 3 broker labels are now `(broker)=>string`; es keeps per-country terms, en gets English. Post-rebase type fix `bf0557c`. **Re-verified:** tsc clean, 266/266 tests, `npm run build` exit 0, render check confirms AR=despachante / CL=agente de aduana / VE=agente aduanal / GH=customs broker / KE=clearing agent. **Ready to push to prod.**

**DEPLOY STATUS (2026-07-01):** reconciled branch `feat/africa-deploy` pushed; **PR #183 opened (superseded — merged as `91468e8`, see SHIPPED section) to `main`** (operator chose PR-review gate over direct push — https://github.com/unisone/meridian-freight-website/pull/183). Vercel prod deploy fires on merge. Post-merge: verify 9 URLs live + GSC Request Indexing. Phase 4 (ad staging, no spend) + Phase 5 (tracking + live-spend gate) still pending.

<details><summary>Original blocker (for the record)</summary>
`feat/africa-wave1` branched off a **stale main**. Real `origin/main` is **8 PRs ahead** (#176–#182: import-authority pillar, LATAM indexation, blog soft-404 fix, WebGL globe guard, uptime-monitor fixes). The branch also contains **stale duplicates** of already-merged work: the 2 pillar commits (`e011158`/`7e89d19`) duplicate **#176**. A straight merge would clobber #181/#182 and double the pillar post. **Do not merge as-is.**

**Reconciliation recipe (turnkey; ~6 keep-both conflicts):**
1. `git checkout -b feat/africa-deploy feat/africa-wave1`
2. `git rebase --onto origin/main 7e89d19` — replays the 14 hygiene+Africa+docs commits onto current main; drops the 2 pillar dupes.
3. Resolve conflicts (Africa additions + main's changes coexist) in: `app/sitemap.ts`, `components/destinations/latam-paid-search-page.tsx`, `content/blog.ts`, `lib/blog-locale-policy.ts`, `ops/site-uptime-monitor/monitor.mjs`, `.github/workflows/smoke-test.yml`. NOTE: main's #182 renamed the Paraguay guide slug to `import-farm-machinery-united-states-paraguay` in monitor+smoke — keep main's version, add Africa URLs on top.
4. Re-verify: `npm run build` (exit 0) + `npx vitest run` (all pass) + dev-server render of the 9 Africa routes.
5. THEN deploy (merge/push to main → Vercel) + GSC Request Indexing. **Live ad spend stays gated (Phase 5).**
</details>

---

## Phase 4 — Staged Google Ads (GH/KE/TZ) — ✅ STAGED + VALIDATED (apply gated on operator GO)

**4a STAGED ✅ (mf-claude-ads `4ea0795`):** all 3 campaigns authored — Ghana (parcel-cage patched), Kenya (KEBS PVoC Route-A wedge), Tanzania (dealer cage filled from a live TZ SERP 2026-07-02). PAUSED-on-create, budgets BLOCKED (operator), nothing applied. **4b (ops.json + `mutate.py` validate-only dry-run) is gated on PR #183 merge** — the campaign final URLs must resolve (pages live) before URL validation passes.

Mirror the live Gate-A doctrine. Build in `mf-claude-ads`. Absorb the existing staged Ghana build (`campaigns/paid-africa/2026-07-01-ghana-gate-a-build.md`); patch its cage with the **parcel-negative theme** (live-SERP finding).
| # | Task (prior ref) | Status | Verify |
|---|---|---|---|
| 4.1 | Per-country Search campaigns (GH/KE/TZ), English, country geo PRESENCE, final URL = the new EN LP (T2.1) | ✅ | 3 build docs + ops.json (GH 92 / KE 50 / TZ 98 ops); geo 2288/2404/2834, EN, PRESENCE, Search-only; final URLs live |
| 4.2 | Equipment-pool PHRASE keywords (US-brand+used+model) + anti-shopper cage **+ parcel theme** per country (T2.2) | ✅ | PHRASE pools + EXACT floors + cages incl. parcel theme; self-conflict fixed (generator-invented bare 'for sale' negative removed from all 3) |
| 4.3 | Gate-RSA per ad group: EN gate H1, differentiators in copy, trademarks keyword-only, char limits (H≤30/D≤90) (T2.3) | ✅ | RSAs verified per-codepoint (H≤30/D≤90), gate pinned H1, zero trademarks in ad text |
| 4.4 | Conversion = WhatsApp qualified lead (existing OCI 7659985632); per-country daily budgets w/ rationale (T2.4) | ✅ | OCI 7659985632 (live-verified ENABLED); budgets proposed GH$12/KE$12/TZ$10 — operator sets final |
| 4.5 | `mutate.py ops.json` **dry-run passes 0 errors**; campaigns staged PAUSED; register in Ads Brain Approval Queue | ✅ | mutate.py validate-only exit 0 × 3; campaigns PAUSED-on-create; NO --apply run; see mf-claude-ads `campaigns/paid-africa/OPS-STAGING-STATUS.md` |

---

## Phase 5 — Tracking verify & LIVE launch — 🔒 GATED on Phases 2–4 + operator go

| # | Task | Status | Verify |
|---|---|---|---|
| 5.1 | Gate-B tracking end-to-end on an Africa LP: `?gclid=TEST` → `paid_search_refs` row → lead email carries UTM/gclid | ⬜ | verifier exercises the flow; evidence of the row + email |
| 5.2 | Africa cluster added to Dual Surface Scorecard | ✅ | added 2026-07-01 (marketing-brain `98abb00`): LEAD indexation/impressions/position rows + LAG #FRT_EN leads, Day-0 anchors, all `no data` until real |
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

---

## PRE-SHIP QA — ✅ COMPLETE (2026-07-01)

Four-dimension review (fresh specialist agents), all converged **production-ready after fixes**:
- **Content/copy** — "unusually disciplined"; gate + differentiators + compliance hedging correct; no fabrication, no trademark misuse. 2 HIGH polish + mediums.
- **Regulatory fact-check** — **all 9 claims CONFIRMED** vs current 2025–2026 sources (KEBS PVoC Route A, Kenya 8yr rule = passenger-vehicle only & correctly hedged, Tanzania TBS PVoC, Ghana GRA zero-rate + GSA import inspection, ports, carriers, all 6 gov URLs live). 0 inaccuracies.
- **On-page/technical SEO** — ship-ready after 1 HIGH (hub hreflang). Canonicals, LP/guide hreflang, schema, sitemap en-only, internal linking, OG all passed.
- **Design/UX/a11y** — production-ready, no blockers. Pages equivalent to verified LATAM; mobile-solid (sticky CTA bar), WCAG AA contrast, aria/labels present, no literal `{{whatsapp_ref}}`. 1 HIGH (doubled title).

**Fixes applied + verified (`d49a6b4`):** hub hreflang (blocker), doubled title (blocker), clearance-scope standardization, language-bullet de-noise, Kenya hero split, 6-LP heroBody de-duplication, phytosanitary precision, breadcrumb-schema de-dupe. tsc 0 · 266 tests · LATAM byte-identical · render-verified (Africa hubs en+x-default only, non-Africa unchanged, es 200).

**⚠ Carry to Phase 5 (tracking):** the site CSP blocks Meta Pixel (`form-action`/`frame-src` exclude facebook.com). Does NOT affect the WhatsApp→gclid→OCI conversion spine the campaigns judge on, but confirm whether Pixel should be allow-listed or is intentionally off before relying on Meta conversion data.

**Website: QA-complete, ready to ship. Google Ads: 3 campaigns staged + PAUSED, untouched, gated on operator go/no-go.**

---

## ✅ SHIPPED TO PRODUCTION (2026-07-01)

PR #183 merged to main (`91468e8`) → Vercel prod deploy. **Verified live on meridianexport.com:**
- 12/12 Africa URLs return HTTP 200 with real content (3 hubs + 6 LPs + 3 guides).
- Unknown destination slug → real HTTP 404 (soft-404 fix shipped).
- All 12 URLs present in the production sitemap.
- GSC Day-0 baseline: all "unknown to Google" (just deployed; sitemap live+registered → auto-crawl expected 1–7 days). URL-level Request Indexing = optional GSC-UI operator accelerant (no API).
- IndexNow secret not available locally → skipped (sitemap covers Google, the primary market).

**Checkpoint:** re-inspect the 12 URLs in GSC at +7d to measure discovered→indexed→ranked, alongside the LATAM cadence.

## Google Ads — STAGED + PAUSED (awaiting operator go/no-go)
3 campaign build docs + **validated ops.json** in `mf-claude-ads/campaigns/paid-africa/` (GH 92 / KE 69 / TZ 101 ops; mutate.py validate-only exit 0 ×3; self-conflict + cage-completion fixes applied; see `OPS-STAGING-STATUS.md`). **Not applied — zero spend.** On operator GO: ops.json → `mutate.py` validate-only dry-run → apply PAUSED → verify Gate-B tracking on a live Africa LP → enable. Budgets GH$12/KE$12/TZ$10 per day proposed; operator sets final.
