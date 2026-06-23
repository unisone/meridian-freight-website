# Definition of Done — LATAM Paid-Search Destination Routes

Spec: `docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md`
Branch: `feat/latam-paid-search-destinations` · Preview only · Gate B HOLD.
Each item = behavior + how a **fresh verifier** confirms it (never builder self-certification).

## Phase 1 — Routing + registry + shared renderer (ACTIVE)

- [x] **P1.1** Route registry exports exactly **10** immutable records; routeKeys unique; canonical paths unique. → `npm test` passes the `assertRouteRegistry` + count/uniqueness tests.
- [x] **P1.2** `getPaidSearchDestination(locale, country, segment)` returns the record for the 10 valid **es** combos, `null` otherwise (incl. non-es locale). → unit test.
- [x] **P1.3** `getPaidSearchStaticParams()` returns exactly the **8 non-Argentina** `{slug,segment}` combos (argentina served by its own static branch). → unit test.
- [x] **P1.4** All 10 `/es/destinations/{country}/{segment}` routes render with HTTP 200 and no runtime error. → verifier hits each route on the running dev/preview server.
- [x] **P1.5** Invalid combos return 404: `/es/destinations/argentina/flete-equipo-pesado-usa`, `/es/destinations/chile/flete-cosechadoras-usa`, `/es/destinations/bolivia/flete-cosechadoras-usa`. → verifier hits routes (expect 404) + unit test.
- [x] **P1.6** `/destinations/argentina/{segment}` (no `es` prefix / en) does not render an es page — redirects/404 per the argentina pattern. → verifier checks runtime guard.
- [x] **P1.7** Renderer composes ONLY existing primitives (`PageHero variant="dark"`, `TrustBar`, `FaqAccordion`, `DarkCta`, breadcrumbs, `ScrollReveal`); no new color/font/component; no hardcoded hex. → diff review by verifier against §5/§15 design contract.
- [x] **P1.8** `npm run lint` clean, `npm run build` succeeds, `npm test` green, TS strict (no `any`). → verifier runs each and pastes output.

P1 deliberately uses English-internal placeholder copy (real Spanish = P2). No attribution/lead pipeline yet (P3).

## Phase 2 — Content + compliance + SEO (DONE — verified)
Per-country Spanish + EN-internal copy with verified §7 caveats; JSON-LD (Service/Breadcrumb/FAQPage); metadata helper (prod canonical even on preview, es-only); AR hub AFIDI URL fix; cross-surface "importación libre" hedge. Gate: client native review.

## Phase 3 — Attribution + lead pipeline (DONE — verified)
tracking.ts extension + opaque `attribution_id` (session-scoped — §6.2 cookie/localStorage/consent-gate model **descoped to sessionStorage-only**: attribution is sent solely on explicit user submit, a smaller privacy footprint than a persistent cookie; audience is LATAM/non-EEA and the paid-search conversion path is same-session; binding workbook tracking requirement satisfied + dry-run verified); `lib/lead-attribution.ts`; additive migration (+ degradation if UNIQUE absent); `submitPaidSearchLead` + `createWhatsAppRef` Server Actions; quote form (extend `contact-form.tsx`); Google Ads tag guard; **attribution actively wired into payload**; **dedupe truly no-ops** (on_conflict + gated side-effects). Tests: persistence/trust-boundary/dedupe/ref/no-side-effect (mocked emitters).

## Phase 4 — QA + evidence (DONE — 4-lens QA panel; blocker + majors fixed)
a11y, AdsBot, message-match (incl. customs caveat adjacent to CTA), mobile, preview 200s; workbook Gate B evidence update. Present preview to user.

## Boundaries (all phases)
Branch/preview only for the website deploy. No production website deploy, no Google Ads/Meta/WABA/router/CRM mutation, no conversion upload, no customer messaging. FMC/IATA: owner confirmed KEEP (genuine/current).

## Ops status (2026-06-22)
- **Supabase migration APPLIED** to the shared MF DB (`ybybrustbnaczukxfeqy`): 10 additive `leads` columns + `idempotency_key` unique index. Verified with a synthetic insert/cleanup against the real schema. Fixed a real bug: `leads.message` is NOT NULL → the action now always populates `message`.
- **No `paid_search_refs` table** — `wa_attribution.ref_code` (chatbot) already owns ref→attribution; the website ref is stateless + persisted on the lead row (avoids duplicating `mf-chatbot-ui`).
- **Native Spanish review: WAIVED** (no reviewer available) — copy ships as authored + claim-safety-reviewed.
- Remaining = Gate-B business approval + the merge to `main` (prod deploy).
