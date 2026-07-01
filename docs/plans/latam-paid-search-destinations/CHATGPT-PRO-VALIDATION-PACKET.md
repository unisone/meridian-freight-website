# ChatGPT Pro — Validation Packet: Meridian LATAM Paid-Search Pages
Generated 2026-06-22. **Self-contained: paste or upload this whole file into ChatGPT Pro. Nothing else needed.**
It contains: (1) the validation prompt, (2) live preview access, (3) the spec = acceptance contract [Section A], (4) the full code diff = the implementation [Section B], (5) verification already done [Section C].

## LIVE PREVIEW — open the first link FIRST (it sets a 23h access cookie), then the rest load
Bypass link (expires 2026-06-23 ~21:36):
https://meridian-freight-export-git-feat-latam-2a04a8-unisone-projects.vercel.app/es/destinations/argentina/importacion-maquinaria-usa?_vercel_share=pJUa2aBsJvgHIEixMRgAhSTxglMVRjiB

After that, all 10 pages (same host):
- /es/destinations/argentina/importacion-maquinaria-usa
- /es/destinations/argentina/flete-cosechadoras-usa
- /es/destinations/bolivia/importacion-maquinaria-usa
- /es/destinations/bolivia/flete-equipo-pesado-usa
- /es/destinations/paraguay/importacion-maquinaria-usa
- /es/destinations/paraguay/flete-cosechadoras-usa
- /es/destinations/chile/importacion-maquinaria-usa
- /es/destinations/chile/flete-equipo-pesado-usa
- /es/destinations/uruguay/importacion-maquinaria-usa
- /es/destinations/uruguay/flete-cosechadoras-usa
Tip: to inspect tracking, append e.g. `?gclid=TESTG&gbraid=TESTGB&wbraid=TESTWB&utm_source=google&utm_matchtype=e&utm_network=g&utm_device=m` and check sessionStorage `ps_attr_<country>/<segment>` (only if your browsing executes JS).

============================================================
## THE PROMPT (this is your task)
============================================================
You are an external senior reviewer. VALIDATE this completed implementation against its spec (Section A) using the live preview and the diff (Section B). Be adversarial — assume defects exist and find them. Where you cannot verify something, say so; do NOT guess. A prior internal review made a confidently wrong claim (it called the FMC/IATA license numbers "fabricated" when they were real), so independently verify, especially the regulatory citations, claim-safety, and the FMC/IATA status.

Project: 10 Spanish paid-search landing pages ("Gate B" website work) — destinations for 10 paused Google Ads campaigns selling US-origin used machinery freight to LATAM (AR/BO/PY/CL/UY x 2 segments). Next.js 16 SSG, React 19, Tailwind 4 + shadcn(base-nova)/@base-ui, next-intl. Branch/preview only; live spend is HOLD.

WHAT YOU CAN vs CANNOT INSPECT
- CAN (preview HTML / view-source + Section B diff): copy & claim-safety, Spanish quality, first-viewport message-match, JSON-LD, canonical/metadata, heading/a11y structure, the quote form & CTAs, and the full source via the diff.
- CANNOT observe at runtime (assess from the diff/design, don't claim to have seen): server-side lead persistence, dedupe, the DB migration, GA4/Pixel firing (analytics IDs unset outside prod).

Independently check and REPORT in this format:
# Executive Verdict — ship-ready / fix-then-ship / needs-rework + the single biggest risk
# Per-Spec Conformance — table: spec requirement (Section A) -> met? -> evidence
# Copy & Claim-Safety — per country: any prohibited / overbroad / admissibility-promising claim? any regulatory citation that is wrong, stale, or unverifiable (re-verify AR Decreto 273/2025 + AFIDI, PY Ley 7565/2025, CL SAG Res 3.103/2016, UY DGSA 98/016 + 2% TGA->Decreto 426/011, BO Aduana/SENASAG)? Argentine voseo vs neutral-Spanish quality? Is Meridian's role kept to US-side freight/export only?
# Message-Match — does each first viewport carry EE.UU. + country + equipment + a customs-responsibility separation?
# SEO/Structure — JSON-LD validity (Service/BreadcrumbList/FAQPage, no Product/Offer/Review), canonical correctness, single h1, metadata uniqueness, sitemap.
# Tracking & Attribution (from the diff) — is the capture set complete for Google Ads (gclid/gbraid/wbraid + utm_matchtype/network/device)? is the server-side trust boundary sound (route context rederived from routeKey, never query params)? can ?country= poison CRM data? is "opaque ref, no click IDs in the WhatsApp message" actually upheld? is dedupe (idempotency_key) correct? is the message NOT-NULL handling safe?
# Accessibility findings
# Were the divergences from the original spec justified? Challenge each: route shape [slug]/[segment] (not [country]/[segment]); Server Actions not API routes; cargo_class added; Google-Ads tag a runtime guard not a hardcoded literal; soft-404 -> true 404; dropped a paid_search_refs table because the chatbot's wa_attribution.ref_code already owns ref->attribution.
# Defects — Blocker / Major / Minor, each with the exact page/section + a concrete fix.
# What you could NOT verify and what you'd need.
Cite specific pages/sections. Challenge anything confident-but-unproven.


============================================================
## SECTION A — SPEC (the acceptance contract)
============================================================
# Design: LATAM Paid-Search Destination Routes (Gate B Website Work)

**Date:** 2026-06-22
**Branch:** `feat/latam-paid-search-destinations`
**Status:** Design — awaiting user approval before implementation plan
**Repo:** `/Users/zaytsev/Documents/Projects/Active/meridian-freight-website`
**Production domain:** `https://meridianexport.com`
**Implementation mode:** isolated branch + preview ONLY. Gate B remains **HOLD**.

This design supersedes the ChatGPT Pro spec (`Meridian Freight Google Ads Gate B Web.md`) wherever the Pro spec conflicts with verified repo reality. The Pro spec is treated as a **content/copy and contract source**, not a file-level build instruction. Every prescription below was verified by an 11-agent research workflow (regulatory citations ×5, repo reuse audit, attribution plan, Next.js routing, workbook payload contract, shipped-LATAM-pattern audit, adversarial critic). Divergences from the Pro spec are enumerated in §13.

---

## 1. Goal & Scope

Build **10 Spanish paid-search destination pages** at `/es/destinations/{country}/{segment}` as a data-driven system inside the existing Meridian site, and close the attribution gap so Google click IDs + UTMs + route context persist into the lead handoff. These are the landing destinations for the 10 paused Gate A Google Ads campaigns (account `378-300-2123`).

### The 10 routes (curated subset — NOT the full 5×2 product)
| Country | machinery_import | second segment |
|---------|------------------|----------------|
| Argentina (AR) | `importacion-maquinaria-usa` | `flete-cosechadoras-usa` (combine) |
| Bolivia (BO) | `importacion-maquinaria-usa` | `flete-equipo-pesado-usa` (heavy) |
| Paraguay (PY) | `importacion-maquinaria-usa` | `flete-cosechadoras-usa` (combine) |
| Chile (CL) | `importacion-maquinaria-usa` | `flete-equipo-pesado-usa` (heavy) |
| Uruguay (UY) | `importacion-maquinaria-usa` | `flete-cosechadoras-usa` (combine) |

Invalid combinations (e.g. `argentina/flete-equipo-pesado-usa`, `chile/flete-cosechadoras-usa`) must `notFound()`.

### In scope
- 10 routes + metadata + JSON-LD, served by one shared renderer.
- One validated route registry (10 immutable records) + lookup/static-params/invariants.
- Country/segment-specific Spanish copy (drafted by us; **native LATAM review arranged by client** before go-live).
- Attribution capture extension (click IDs + full UTM set + server-derived route context).
- Lean opaque `whatsapp_ref` + a paid-search lead Server Action emitting the complete contract-compliant payload.
- Additive Supabase `leads` migration for the new fields.
- Synthetic-lead test proving persistence + trust-boundary + dedupe.
- Route/metadata/a11y/AdsBot/message-match/attribution QA on preview.

### Out of scope (downstream-owned or Gate-B-gated)
- QQO evaluator + CRM/router adapter (website only **emits** the payload; qualification/routing live downstream).
- Google Ads campaign activation, budget/bid/conversion-action changes, conversion uploads.
- Production deploy; Meta/WABA/router/CRM mutation; real customer messaging.
- Any promise of customs clearance, admissibility, duties, taxes, delivery dates, or landed cost.
- Equipment inventory / pricing / checkout / seller-like pages.

### Hard boundaries (Gate B HOLD)
Branch + preview only. No production deploy. No external mutations. Preview env already disables analytics/Slack/CAPI (per `CLAUDE.md`); the synthetic test mocks **all** external emitters so no real send occurs. No Google Ads conversion action is created; no `MERIDIAN_QQO` upload — diagnostic events only.

---

## 2. Source Hierarchy

1. **Canonical Google Ads Ops Workbook** — route mapping, attribution/cross-channel **contract**, launch gates. The operating tracker; not replaced.
2. **Repo reality** (`CLAUDE.md` + actual code) — **wins on all file/route/API/component decisions.** This is where the Pro spec is overridden.
3. **ChatGPT Pro spec** — copy drafts, page-section intent, field model. Content source, *not* a file map.
4. **Live production site + shipped LATAM hubs** — visual + claim consistency (the new pages must not contradict shipped hubs).
5. **Official country government/customs/agriculture sources** — regulatory caveats (all verified, §7).

---

## 3. Route Architecture (verified against Next.js source)

The Pro spec's `app/[locale]/destinations/[country]/[segment]/page.tsx` is **not buildable**: the repo already has a dynamic `[slug]` at that level (Next.js forbids two differently-named dynamic segments as siblings), and the static `argentina/` folder **shadows** any dynamic sibling for its whole subtree (verified via Next.js `sortable-routes.ts`: static specificity 0 beats dynamic 1, left-to-right, no fall-through). Verified two-file structure:

```
app/[locale]/destinations/
├── page.tsx                          # KEEP (index)
├── [slug]/page.tsx                   # KEEP (country hubs: bolivia/chile/paraguay/uruguay + kazakhstan)
├── [slug]/[segment]/page.tsx         # NEW → serves BO/CL/PY/UY paid-search children (reuses [slug] param)
├── argentina/page.tsx                # KEEP (static AR hub)
└── argentina/[segment]/page.tsx      # NEW → serves AR paid-search children (under the static parent)
```

- Both new files render the **same** shared renderer and resolve the **same** route registry. `[segment]` under two different parents (`[slug]/` vs `argentina/`) is allowed and is the correct/consistent choice.
- `generateStaticParams`:
  - `[slug]/[segment]`: enumerate the **8 non-Argentina** records as `{ slug, segment }`. Do **not** include argentina; do **not** emit `locale` (next-intl owns it).
  - `argentina/[segment]`: enumerate the **2 Argentina** records as `{ segment }` (mirror the existing `argentina/page.tsx` es-only + `permanentRedirect` guard for non-es).
- Both files call `notFound()` for any routeKey not in the 10-record registry.
- es-only: non-`es` locale → `permanentRedirect`/`notFound` per the existing argentina pattern. `localePrefix: "as-needed"` means `/es/...` is the correct prefixed path.

---

## 4. Data Model

### `content/latam-paid-search-destinations.ts` (NEW)
Exactly **10 immutable records** (`as const satisfies readonly LatamPaidSearchDestination[]`), authored explicitly (not a generated cartesian product). Adopt the Pro spec §4.1 TypeScript model, trimmed. Each record carries: `routeKey` (`{country}/{segment}`), `country` (code/slug/name/hub path), `segment` (slug/key/publicName), `seo`, hero/process/scope/quote-readiness/compliance/trust/faq copy, `jsonLd`, `googleAds` message-match, `tracking` defaults, `sourceIds`, `internalLinks`.

### Derived enums (server-side, never from query)
- `request_type`: `machinery_import → import_coordination_quote`, `combine_shipping → combine_freight_quote`, `heavy_equipment_shipping → heavy_equipment_freight_quote`.
- **`cargo_class`** (the workbook's primary gap — must be emitted): `combine_shipping → combine`, `heavy_equipment_shipping → heavy_oog`, `machinery_import → general_machinery`. Website emits a segment-derived default; final normalized value is downstream.

### `lib/latam-paid-search-routes.ts` (NEW)
`getPaidSearchDestination(locale, country, segment)`, `getPaidSearchStaticParams()`, and `assertRouteRegistry()` (throws unless length === 10, routeKeys unique, canonical paths unique). **This Map is the sole server-side source of `country/segment/landing_route/request_type/router_tag/cargo_class`** — the trust boundary.

---

## 5. Rendering & Component Reuse

The reuse audit confirms **nearly all UI already exists**; the work is data + a thin composing renderer + the quote form, not a new design system.

- **Reuse as-is:** `page-hero`, `trust-bar`, `faq-accordion`, `dark-cta`, `breadcrumbs`, `lib/json-ld`, `scroll-reveal`, `tracked-cta-link`, `tracked-contact-link`, `lib/constants` (`COMPANY/CONTACT/SITE/STATS`), and the LATAM JSON-LD/section helpers.
- **Renderer:** add `components/destinations/latam-paid-search-page.tsx` that **composes the existing primitives** following the shipped `latam-market-page.tsx` section pattern (hero → trust bar → process → included/excluded scope → quote-readiness → compliance → proof → FAQ → official sources → final CTA). Prefer reusing existing sub-blocks over net-new components (Pro spec's 6 `paid-search-*` sub-components are created **only** where no existing block fits).
- **Quote form:** net-new behavior (shipped hubs convert via WhatsApp + calculator, no inline form). Build a `paid-search-quote-form` (or extend `contact-form`) wired to the new Server Action + `paidSearchLeadSchema`. Do **not** introduce a second analytics/form system.

### Trust/credentials — CRITICAL CORRECTION
The Pro spec's trust block lists `FMC #024914NF` and `IATA/CNS 01108380000`. **CORRECTION (post-review): these are NOT fabricated.** They exist in `lib/constants.ts:11-12` (`COMPANY.fmcLicense`/`iataCns`) and render **live site-wide** via `messages/{en,es,ru}.json` — footer `trustSignals` and hero `trustEyebrow`, all three locales. Decision: do **not** add them to the new LP *body* (consistent with the shipped LATAM hubs, which don't restate them). But they already appear in the shared footer/hero of every page, **including the new LPs** — a Google Ads Misrepresentation exposure if the registrations are not genuine/current. **Gate-B launch prerequisite (site-wide, owner decision): confirm `024914NF` is a current FMC OTI/NVOCC registration and `01108380000` a current IATA/CNS air-cargo agency code (keep, with precise verifiable framing) OR remove them site-wide from constants + messages.** This is pre-existing (not introduced by this work) and does NOT block preview building. For the LP body, use only verifiable claims, rendered from constants:
- Verbatim (matches all 4 shipped hubs): **"Meridian ha coordinado más de 1.000 exportaciones a más de 40 países."** (`1.000` with period, `más de 40 países`.)
- Stats from `STATS` (`projectsCompleted=1000`, `yearsExperience` from `foundedYear=2013`) via `formatCount(n,'es')+'+'` — never hardcoded.
- `COMPANY.name`, `SITE.name/url`, all `CONTACT` fields imported, never hardcoded.
- No stars/testimonials/`AggregateRating`; no OEM-dealer claims; no manufacturer logos.

---

## 6. Attribution & Lead Pipeline

### 6.1 Capture — `lib/tracking.ts` (extend, do not replace)
Add `PAID_CLICK_IDS = [gclid, gbraid, wbraid, fbclid, msclkid]` and `PAID_UTM_KEYS = [...UTM_KEYS, utm_matchtype, utm_network, utm_device]`. Widen `Attribution` with the new optional keys + `referrer` + `capturedAt`. Apply length caps (click IDs ≤256, UTMs ≤512, URL/referrer ≤2048) and strip control/null chars (Pro §9.3). **Keep existing non-paid flows working.**

### 6.2 Cookie/consent reconciliation (security fix)
Current `mf_attribution` cookie stores raw click IDs/UTMs in a readable cookie — the Pro spec (§9.4) forbids this. New model: write **only an opaque `attribution_id`** to the first-party cookie (`Secure; SameSite=Lax; Path=/; 90d`); store the typed payload (first/latest touch + routeContext) in `sessionStorage` + a self-purging `localStorage` record (`expiresAt`, 90d). Gate persistent writes on the **existing** consent state (`hasConsent()`); memory/session-only when not accepted. Do not invent a second consent policy. Verify the existing contact/calculator flows that read `mf_attribution` still work.

### 6.3 `lib/lead-attribution.ts` (NEW)
Typed model + helpers: `parsePaidTouch(url)` (allowlist-only, sanitized, capped), `mergePaidAttribution()` (Pro §9.5 — preserve first touch; update latest only on a paid signal; a direct visit never overwrites a paid touch; always refresh routeContext), `generateAttributionId()`.

### 6.4 Server Actions (NOT API routes — repo uses Server Actions)
- `app/actions/whatsapp-ref.ts` → `createWhatsAppRef({routeKey, attributionId, firstTouch, latestTouch})`: validate routeKey against registry, generate `lead_id` + opaque ref, persist attribution, return `{lead_id, whatsapp_ref, expires_at}`. **Idempotent per `attributionId+routeKey`** (no lead-per-click; reused across repeated CTA clicks).
- `app/actions/paid-search-lead.ts` → `submitPaidSearchLead(raw, locale)`: mirror the proven `contact.ts`/`calculator-v3.ts` pipeline exactly — Zod validate → honeypot → **rederive route context server-side from routeKey (discard client `country/segment/...`)** → Google Ads tag guard → identity/dedupe (`idempotency_key === lead_id`) → best-effort Supabase REST insert → Resend owner email (must-succeed) → `after()` background block (Spanish auto-reply, Slack, CAPI `Lead`, Vercel diagnostic). Diagnostic events only; no Ads upload.

### 6.5 `whatsapp_ref` format
`MF-` + 8 Crockford base32 chars (no I/L/O/U) from a random token → e.g. `MF-A7K29XQ4` (≤32, URL-safe, opaque). Random token, **not** an encoding of click IDs. Server stores `whatsapp_ref → {lead_id, attribution_id, payload, expires_at(90d)}`. Visible WhatsApp text contains only `#FRT_ES` + intent + placeholders + `Ref: {{whatsapp_ref}}` — never gclid/gbraid/wbraid/fbclid/UTMs. Phone from `CONTACT` (never duplicated in records). On failure: open plain WhatsApp/form, record diagnostic, do not claim a tracked handoff.

### 6.6 Migration — `supabase/migrations/<ts>_add_paid_search_lead_attribution.sql`
Additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (mirror `20260420230000_add_calculator_v3_metadata.sql`): `gclid, gbraid, wbraid, fbclid, msclkid, utm_matchtype, utm_network, utm_device, attribution_id, whatsapp_ref, lead_id, idempotency_key (UNIQUE), country, segment, cargo_class, landing_route, request_type, router_tag, source_platform, source_account_id, google_ads_tag, first_touch (jsonb), latest_touch (jsonb), schema_version, consent_version, paid_search_metadata (jsonb default '{}')`. Action tolerates missing columns (retry without `paid_search_metadata`, like calculator-v3).

### 6.7 Payload contract (complete — closes the workbook gap)
Emit all website-owned fields: identity (`schema_version='paid-search-lead-v1', lead_id, idempotency_key, attribution_id, whatsapp_ref`), source (`source_platform='google_ads', source_account_id='3783002123', google_ads_tag`), **all** click IDs + UTMs, route-derived (`country, segment, cargo_class, landing_route` + alias **`page_route`**, `request_type, router_tag`), `first_touch/latest_touch` (+ `first_seen_at/last_seen_at/created_at` aliases), equipment + contact fields, `consent_version`. Confirm `fbclid` rides through. **Downstream-owned (do NOT populate at submit):** `opportunity_id, conversation_id, routed_domain, router_version, accepted_qqo_at, campaign_id/ad_group_id/ad_id, final qualified cargo_class`.

### 6.8 Google Ads tag guard
`AW-17952470509` lives only in the Pro spec; repo `NEXT_PUBLIC_GOOGLE_ADS_ID` is **empty**. Do **not** hardcode. Add `assertGoogleAdsTagMatches(routeTag)` comparing runtime `TRACKING.googleAdsId` to the record's expected `googleAdsTag`; on mismatch/absent → record diagnostic + **hold** readiness (never add a conversion action, never throw).

---

## 7. Content & Compliance (all citations verified 2026-06-22)

Per-country copy is drafted from the Pro spec §7, corrected against verified constraints below, paired with an **English internal version**, and **gated on client-arranged native review** before go-live. Each record stores a per-country **copy-constraint checklist** (prohibited phrases + required caveats) enforced by the message-match QA gate (§10). All claims stay consistent with the shipped hubs.

- **Argentina** — Decreto 273/2025, AFIDI, SENASA control all **confirmed current**. Keep "removed CIBU as prior mechanism, controls remain"; AFIDI conditional (`puede requerir`), gestionado via SIGPV-IMPO *before* purchase. Prohibited: `importación libre`, `sin requisitos`, `aduana incluida`, "every machine admissible", implying Meridian handles AFIDI/Malvina/nationalization. **Fix:** update `content/argentina-market.ts` AFIDI link (~line 172) to the canonical URL (`gestionar-...-la-evaluacion-de`) so the new LP and the hub match.
- **Bolivia** — Aduana + SENASAG sources confirmed. **Do NOT inherit the shipped hub's expired Ley 1613/2025 IVA incentive / 10-yr age limit / Arica transit / free-storage / fixed inland route.** SENASAG strictly conditional (`puede aplicar`, broker-confirmed); avoid "registro online sin trámite presencial" (only occasional-importer is fully online).
- **Paraguay** — Ley 7565/2025 + DNIT/SENAVE/MIC confirmed (BACN 403 = bot block, corroborated). **Soften:** specific article numbers (Art 4/5/7), exact promulgation/effective date, and the biodiversity-fee name/formula (hedge — "confirma su despachante"). Lead with the law's phytosanitary framing; transit times/route = estimates, not commitments; pair every 5-year claim with the admissibility disclaimer.
- **Chile** — SAG Res 3103/2016 **vigente**; attribute the cleanliness/inspection/re-export claim **only** to CL-01. SAG = "inspección al ingreso", never "aprobado"/guaranteed entry. Port = "San Antonio o Valparaíso", never mandatory. Use "plagas reglamentadas".
- **Uruguay** — Res 98/016 confirmed. **Attribute the 2% TGA to Decreto 426/011, not the Aduanas TGA hub URL.** No universal tariff/landed cost, no guaranteed DGSA acceptance, no guaranteed Montevideo routing.

Shared scope discipline (all pages): Meridian = compra asistida + retiro + medición + desmontaje/embalaje + documentación de exportación + certificado fitosanitario de origen (USDA APHIS/CFIA) + reserva marítima. Out = nationalization, despachante fees, duties/IVA, destination phyto-inspection, interior delivery. Calculator framed as "referencia del tramo logístico", never final landed cost.

---

## 8. SEO / Metadata
New paid-search metadata helper (or extend `latam-market-metadata`): absolute **production** canonical = `SITE.url + landing_route` **even when QA runs on preview** (never a self-referencing preview canonical); `es` as the only language alternate (no en/ru for these paid routes; document x-default); `OG url == canonical == JSON-LD url`. JSON-LD: `Service` + `BreadcrumbList` + `FAQPage` only, `Service.provider` referencing the org node — **no** `Product`/`Offer`/`Review`/`AggregateRating`. Unique title + meta description per route (120–160 chars).

## 9. Accessibility
Single `H1` per page, ordered `H2/H3`; external source links with `aria-label` + `rel="noopener noreferrer"` + visible external-link affordance; WhatsApp vs calculator CTAs distinguishable by accessible name, not color; ≥44px touch targets; `prefers-reduced-motion` respected on `ScrollReveal`; Spanish long-word wrap handled (mobile).

## 10. QA & Test Matrix
- **Routing/data:** exactly 10 records; unique routeKeys + canonical paths (`assertRouteRegistry`); static params generate exactly the 10; invalid combos → 404 (test ≥3); non-es not generated.
- **Metadata:** unique title/description; canonical = production URL; valid Service/Breadcrumb/FAQPage; no Product/Offer/Review/AggregateRating.
- **Attribution persistence (key proof):** spy on `fetch` to `/rest/v1/leads`; assert every contract field persists (all click IDs incl. gbraid/wbraid/fbclid, full UTM set, attribution_id, whatsapp_ref, lead_id, idempotency_key===lead_id, source_*, first/latest touch jsonb, cargo_class, page_route, schema_version, consent_version).
- **Trust boundary:** submit `routeKey=argentina/...` with malicious client `country=CL, segment=heavy` → assert persisted `country=AR` and registry-derived segment/cargo_class.
- **Dedupe:** two submits same `lead_id` → second is no-op, same lead.
- **`whatsapp_ref`:** matches `^MF-[0-9A-HJKMNP-TV-Z]{6,}$`, ≤32, URL-safe; prefill contains ref once and **no** click-ID/UTM substring; idempotent per attribution_id+routeKey.
- **Google Ads tag:** unset → records mismatch, does not throw, no conversion action.
- **No-side-effect:** all external emitters (Resend, CAPI, Slack, Vercel) mocked; assert no real send; owner email routed to test address in synthetic runs.
- **Message-match gate:** first viewport includes EE.UU. + country + equipment + customs-responsibility separation; fail if a launch-candidate RSA claim is unsupported/contradicted or a prohibited phrase appears.
- **AdsBot/mobile/HTTP smoke:** preview returns 200, prerendered (no empty client shell), no unexpected redirect/legacy-domain hop.
Use the repo's package manager + `vitest run`; mirror `app/actions/__tests__/contact.test.ts` harness.

## 11. Gate B Readiness Boundaries
Branch + preview only. Stop before: production deploy, Google Ads/Meta/WABA/router/CRM mutation, conversion-action creation, conversion upload, customer messaging. After implementation: update the workbook Gate B Control Room evidence (route QA + attribution dry-run results). Activation stays HOLD pending explicit user approval.

## 12. Phasing
- **P1 — Routing + data model + renderer:** two route files, registry, shared renderer composing existing primitives; 10 pages render (English-internal placeholder copy), invalid → 404. Tests: route invariants.
- **P2 — Content + compliance + SEO:** per-country Spanish + EN-internal copy with verified caveats; JSON-LD; AR hub URL fix; metadata helper. Gate: client native review.
- **P3 — Attribution + lead pipeline:** tracking.ts extension + cookie/consent fix; `lead-attribution.ts`; migration; two Server Actions; quote form; Google Ads guard. Tests: persistence/trust-boundary/dedupe/ref/no-side-effect.
- **P4 — QA + evidence:** a11y/AdsBot/message-match/mobile on preview; workbook evidence update. Present preview to user.
Each phase = branch/preview; user reviews preview; nothing to prod.

## 13. Explicit divergences from the ChatGPT Pro spec (with reasons)
1. **Route files:** `[slug]/[segment]` + `argentina/[segment]` (not `[country]/[segment]`) — Next.js dynamic-name + static-shadow rules (verified).
2. **API routes → Server Actions:** `submitPaidSearchLead` + `createWhatsAppRef` replace `app/api/leads` + `app/api/attribution/whatsapp-ref` — repo/`CLAUDE.md` mandate Server Actions; an API lead endpoint would be a second system.
3. **FMC/IATA numbers NOT added to LP body** — but they are real constants rendered site-wide (footer/hero, all locales); the earlier "fabricated" claim was wrong (see §5 correction). LP body uses only `STATS`-backed claims; the site-wide registration **verify-or-remove is a Gate-B launch prerequisite** (owner decision).
4. **Lean attribution + `whatsapp_ref`** — extend the single tracker + opaque-id cookie; no 5-layer state machine; no lead-per-click.
5. **`cargo_class` added + `page_route` aliased** — required by the workbook, absent from the Pro spec.
6. **Google Ads tag is a runtime-compared guard, not a hardcoded literal.**
7. **CRM/QQO evaluator out of scope** — website emits the payload; qualification/routing downstream.
8. **Per-country copy corrected** to verified caveats (esp. BO expired-incentive, PY unverified articles/fee, CL SAG/port, UY 2%→Decreto 426/011) + native-review publish gate.

## 14. Open risks (tracked; mitigations in-spec)
Native Spanish review is a hard publish gate. The FMC/IATA registration verify-or-remove is a Gate-B launch prerequisite (§5, §15). Attribution must be actively wired into the new payload and dedupe must truly no-op (§15). The additive migration's `UNIQUE idempotency_key` must land or the action falls back to a pre-insert SELECT (§15).

## 15. Review Remediation (post 5-lens panel, 2026-06-22)
The independent review (design-system, architecture, attribution/security, compliance, spec-quality) rated **all 5 lenses approve-with-minor-fixes**; architecture, routing, trust boundary, phasing, and Gate-B boundaries verified **sound** against the repo. These amendments are binding and supersede any conflicting text above.

### Blocker (resolved in-spec; owner decision made)
- **FMC/IATA premise corrected** (§5, §13.3). **Owner decision 2026-06-22: KEEP — confirmed genuine & current registrations.** Keep site-wide with precise verifiable framing; no removal needed. Gate-B prerequisite satisfied.

### Majors
- **Quote-form design contract (anti-drift):** prefer **extending `components/contact-form.tsx`**; do NOT author a new form layout. Reuse `components/ui/{input,label,button,textarea}` with contact-form's class vocabulary (`space-y-5`, `grid gap-5 sm:grid-cols-2`, Input `mt-1.5`, submit = `<Button>` default/primary `w-full rounded-xl`). No custom field styling, no hardcoded colors.
- **Attribution must be ACTIVELY wired into the payload:** no existing submit path reads the `mf_attribution` cookie (contact-form + calculator read UTMs fresh from `window.location.search` at submit). DROP the moot "verify existing flows read the cookie" target. ADD acceptance criterion: the paid-search page reads the typed attribution payload (sessionStorage/localStorage) and passes it into `submitPaidSearchLead`; the synthetic test asserts captured attribution actually reaches the POST body.
- **Dedupe must truly no-op:** the proven insert (`Prefer: return=minimal`, no `on_conflict`) turns a duplicate into an HTTP 409 logged as a generic failure while the must-succeed owner email + `after()` Slack/CAPI still fire (duplicate emails/events). Fix: POST `/rest/v1/leads?on_conflict=idempotency_key` with `Prefer: resolution=ignore-duplicates,return=minimal` (or a pre-insert SELECT by `lead_id`); gate the owner email + `after()` side-effects on whether a NEW row was inserted. §10 dedupe test asserts NO second owner email/CAPI/Slack.

### Minors (binding)
- **§5 token-only rule:** design tokens only (`bg-primary`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border`) + the established accent vocabulary already in shipped hubs (emerald=included, sky=info, amber/rose=caution/excluded). No hardcoded hex/rgb, no new color families, no new font (Geist Sans/Mono via `@theme`).
- **§5 hero pinned:** `<PageHero variant="dark" locale="es">` with the same eyebrow/heading/description/rightContent + emerald/sky/amber scope-card composition as `latam-market-page.tsx`.
- **§3 routing file:** locale middleware is **`middleware.ts`** (repo root) — **`proxy.ts` does NOT exist**. The project `CLAUDE.md` is STALE on this (claims proxy.ts) — flag for separate correction.
- **UI stack:** shadcn **`base-nova`** style over **`@base-ui/react`** primitives (not new-york/Radix). `CLAUDE.md` is STALE here too.
- **§3 AR es-only parity + per-segment guard:** `argentina/[segment]` relies on in-page `permanentRedirect` for non-es (es canonical; en/ru not generated), consistent with argentina already absent from the EN destinations set. Each new segment page guards `locale === 'es'` at request time (generateStaticParams stops prerender, but direct hits need a runtime guard); `argentina/[segment]` returns only `{segment}`.
- **§10/§11 no-side-effect via MOCKING, not env:** Slack (`lib/slack.ts`) + Meta CAPI (`lib/meta-capi.ts`) are gated only by env-var presence. The synthetic test MUST mock Resend/CAPI/Slack/Vercel and route owner email to a test address so the must-succeed path cannot send.
- **§6 sink hygiene:** new attribution fields (click IDs/UTMs) pass through `escapeHtml()` at the owner-email render site and are treated as untrusted in Slack text — capture-time caps are not sufficient for HTML/Slack sinks.
- **§6.2 note:** `attribution_id` is intentionally non-HttpOnly (opaque, client-generated, no click IDs); sensitive payload stays server-side/session-only.
- **§7 cross-surface consistency:** `content/destinations.ts` uses "importación libre"/"importación libre de aranceles" for Chile (line 567) and Mexico (470,473). Hedge the Chile duty-free claim to match the new CL LP framing so paid traffic doesn't see contradictory admissibility claims one click apart.
- **§5/§10 quote caveat:** the quote-readiness/form block carries the customs-responsibility caveat adjacent to the CTA (Meridian = origen→puerto; nacionalización/tributos/AFIDI/SAG/DGSA/SENASAG confirmed by despachante); add a §10 message-match assertion.
- **§10 whatsapp_ref regex:** `^MF-[0-9A-HJKMNP-TV-Z]{8}$` (exactly 8), matching the §6.5 generator.
- **§1/§6.7 account id:** `378-300-2123` (hyphenated, Google Ads UI) === `3783002123` (digits-only, `source_account_id`) — same account, two representations.
- **§6.6 migration degradation:** the additive migration adds ~28 typed columns incl. `idempotency_key UNIQUE` + the jsonb; if the UNIQUE constraint is absent (partially-applied migration), fall back to a pre-insert SELECT by `lead_id` so lead capture never breaks (retry-tolerance must cover more than the jsonb column).

============================================================
## SECTION B — IMPLEMENTATION (full diff: main...feat/latam-paid-search-destinations)
============================================================
```diff
diff --git a/app/[locale]/destinations/[slug]/[segment]/page.tsx b/app/[locale]/destinations/[slug]/[segment]/page.tsx
new file mode 100644
index 0000000..ed14ba6
--- /dev/null
+++ b/app/[locale]/destinations/[slug]/[segment]/page.tsx
@@ -0,0 +1,49 @@
+import type { Metadata } from "next";
+import { notFound } from "next/navigation";
+import { setRequestLocale } from "next-intl/server";
+import { LatamPaidSearchPage } from "@/components/destinations/latam-paid-search-page";
+import {
+  getPaidSearchDestination,
+  getPaidSearchStaticParams,
+} from "@/lib/latam-paid-search-routes";
+import { SITE } from "@/lib/constants";
+import { getOgLocale } from "@/lib/i18n-utils";
+
+interface PageProps {
+  params: Promise<{ locale: string; slug: string; segment: string }>;
+}
+
+// Only the curated combos are valid → any other param is a true 404 (not soft-200).
+export const dynamicParams = false;
+
+// es-only; the static argentina/ folder serves AR via its own branch.
+export function generateStaticParams() {
+  return getPaidSearchStaticParams().map((p) => ({ locale: "es", ...p }));
+}
+
+export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
+  const { locale, slug, segment } = await params;
+  const record = getPaidSearchDestination(locale, slug, segment);
+  if (!record) return {};
+  const canonical = `${SITE.url}${record.seo.canonicalPath}`;
+  return {
+    title: record.seo.title,
+    description: record.seo.description,
+    alternates: { canonical },
+    openGraph: {
+      type: "website",
+      locale: getOgLocale("es"),
+      url: canonical,
+      title: record.seo.title,
+      description: record.seo.description,
+    },
+  };
+}
+
+export default async function Page({ params }: PageProps) {
+  const { locale, slug, segment } = await params;
+  setRequestLocale(locale);
+  const record = getPaidSearchDestination(locale, slug, segment);
+  if (!record) notFound();
+  return <LatamPaidSearchPage record={record} />;
+}
diff --git a/app/[locale]/destinations/argentina/[segment]/page.tsx b/app/[locale]/destinations/argentina/[segment]/page.tsx
new file mode 100644
index 0000000..7c98f1b
--- /dev/null
+++ b/app/[locale]/destinations/argentina/[segment]/page.tsx
@@ -0,0 +1,52 @@
+import type { Metadata } from "next";
+import { notFound, permanentRedirect } from "next/navigation";
+import { setRequestLocale } from "next-intl/server";
+import { LatamPaidSearchPage } from "@/components/destinations/latam-paid-search-page";
+import {
+  getArgentinaPaidSearchStaticParams,
+  getPaidSearchDestination,
+} from "@/lib/latam-paid-search-routes";
+import { SITE } from "@/lib/constants";
+import { getOgLocale } from "@/lib/i18n-utils";
+
+// Argentina is a STATIC folder, so its paid-search children live here rather
+// than under the dynamic [slug]/[segment] route (which the static folder shadows).
+interface PageProps {
+  params: Promise<{ locale: string; segment: string }>;
+}
+
+// Only the 2 Argentina combos are valid → any other segment is a true 404.
+export const dynamicParams = false;
+
+export function generateStaticParams() {
+  return getArgentinaPaidSearchStaticParams().map((p) => ({ locale: "es", ...p }));
+}
+
+export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
+  const { locale, segment } = await params;
+  const record = getPaidSearchDestination(locale, "argentina", segment);
+  if (!record) return {};
+  const canonical = `${SITE.url}${record.seo.canonicalPath}`;
+  return {
+    title: record.seo.title,
+    description: record.seo.description,
+    alternates: { canonical },
+    openGraph: {
+      type: "website",
+      locale: getOgLocale("es"),
+      url: canonical,
+      title: record.seo.title,
+      description: record.seo.description,
+    },
+  };
+}
+
+export default async function Page({ params }: PageProps) {
+  const { locale, segment } = await params;
+  // es-only: mirror the existing argentina/page.tsx redirect guard.
+  if (locale !== "es") permanentRedirect(`/es/destinations/argentina/${segment}`);
+  setRequestLocale(locale);
+  const record = getPaidSearchDestination("es", "argentina", segment);
+  if (!record) notFound();
+  return <LatamPaidSearchPage record={record} />;
+}
diff --git a/app/actions/__tests__/paid-search-lead.test.ts b/app/actions/__tests__/paid-search-lead.test.ts
new file mode 100644
index 0000000..980ded7
--- /dev/null
+++ b/app/actions/__tests__/paid-search-lead.test.ts
@@ -0,0 +1,154 @@
+import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
+import type { PaidSearchLeadData } from "@/lib/schemas";
+
+const h = vi.hoisted(() => ({
+  sendMock: vi.fn(async () => ({ error: null })),
+  notifySlack: vi.fn(async () => {}),
+  sendCAPIEvent: vi.fn(async () => {}),
+  track: vi.fn(async () => {}),
+}));
+
+vi.mock("next/server", () => ({ after: (cb: () => void | Promise<void>) => void cb() }));
+vi.mock("resend", () => ({
+  Resend: class {
+    emails = { send: h.sendMock };
+  },
+}));
+vi.mock("@vercel/analytics/server", () => ({ track: h.track }));
+vi.mock("@/lib/slack", () => ({ notifySlack: h.notifySlack }));
+vi.mock("@/lib/meta-capi", () => ({ sendCAPIEvent: h.sendCAPIEvent }));
+vi.mock("@/lib/logger", () => ({ startTimer: () => ({ done: vi.fn(), error: vi.fn() }), log: vi.fn() }));
+
+import { submitPaidSearchLead } from "@/app/actions/paid-search-lead";
+
+const FULL_TOUCH = {
+  capturedAt: "2026-06-22T00:00:00Z",
+  landingUrl: "https://meridianexport.com/es/destinations/argentina/importacion-maquinaria-usa?gclid=G",
+  referrer: "https://www.google.com/",
+  gclid: "G1", gbraid: "GB1", wbraid: "WB1", fbclid: "FB1",
+  utm_source: "google", utm_medium: "cpc", utm_campaign: "C", utm_term: "K", utm_content: "A",
+  utm_matchtype: "e", utm_network: "g", utm_device: "m",
+};
+
+function baseLead(overrides: Record<string, unknown> = {}): PaidSearchLeadData {
+  return {
+    routeKey: "argentina/importacion-maquinaria-usa",
+    contact_name: "Juan",
+    contact_email: "juan@example.com",
+    contact_phone: "",
+    preferred_contact_method: "whatsapp",
+    equipment_type: "cosechadora",
+    make_model: "JD 9600",
+    year: "2018",
+    listing_url: "",
+    origin_location: "Des Moines, IA",
+    destination_location: "Rosario",
+    dimensions: "",
+    weight: "",
+    purchase_status: "evaluando",
+    requested_timing: "",
+    buyer_role: "",
+    message: "hola",
+    consent: true,
+    website: "",
+    attribution_id: "attr_x",
+    whatsapp_ref: "",
+    lead_id: "lead-123",
+    first_touch: FULL_TOUCH,
+    latest_touch: FULL_TOUCH,
+    ...overrides,
+  } as PaidSearchLeadData;
+}
+
+let fetchSpy: MockInstance;
+
+beforeEach(() => {
+  vi.stubEnv("SUPABASE_URL", "https://db.example.com");
+  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "svc");
+  vi.stubEnv("RESEND_API_KEY", "re_test");
+  h.sendMock.mockClear();
+  h.notifySlack.mockClear();
+  h.sendCAPIEvent.mockClear();
+  h.track.mockClear();
+  fetchSpy = vi
+    .spyOn(globalThis, "fetch")
+    .mockResolvedValue({ ok: true, json: async () => [{ id: 1 }], text: async () => "" } as unknown as Response);
+});
+
+afterEach(() => {
+  vi.unstubAllEnvs();
+  fetchSpy.mockRestore();
+});
+
+function leadInsertBody(): Record<string, unknown> | null {
+  const call = fetchSpy.mock.calls.find((c) => String(c[0]).includes("/rest/v1/leads"));
+  return call ? JSON.parse((call[1] as RequestInit).body as string) : null;
+}
+
+describe("submitPaidSearchLead", () => {
+  it("persists every contract field incl gbraid/wbraid + extended UTMs", async () => {
+    const res = await submitPaidSearchLead(baseLead());
+    expect(res.success).toBe(true);
+    const body = leadInsertBody()!;
+    expect(body).toBeTruthy();
+    const meta = body.paid_search_metadata as Record<string, unknown>;
+    // flat columns (queryable on the shared leads table)
+    for (const k of ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
+      expect(body[k], `flat ${k}`).toBeTruthy();
+    }
+    // full contract carried in the jsonb
+    for (const k of ["fbclid", "utm_matchtype", "utm_network", "utm_device"]) {
+      expect(meta[k], `meta ${k}`).toBeTruthy();
+    }
+    expect(meta.schema_version).toBe("paid-search-lead-v1");
+    expect(meta.source_account_id).toBe("3783002123");
+    expect(meta.first_touch).toBeTruthy();
+    expect(meta.latest_touch).toBeTruthy();
+    expect(body.source_platform).toBe("google_ads");
+    expect(body.idempotency_key).toBe(body.lead_id);
+    expect(body.lead_id).toBe("lead-123");
+  });
+
+  it("rederives route context from routeKey (trust boundary — incl cargo_class + page_route)", async () => {
+    await submitPaidSearchLead(baseLead());
+    const body = leadInsertBody()!;
+    const meta = body.paid_search_metadata as Record<string, unknown>;
+    expect(body.country).toBe("AR");
+    expect(body.segment).toBe("machinery_import");
+    expect(body.cargo_class).toBe("general_machinery");
+    expect(meta.request_type).toBe("import_coordination_quote");
+    expect(meta.landing_route).toBe("/es/destinations/argentina/importacion-maquinaria-usa");
+    expect(meta.page_route).toBe(meta.landing_route);
+    expect(meta.router_tag).toBe("#FRT_ES");
+  });
+
+  it("rejects an unsupported route combination", async () => {
+    const res = await submitPaidSearchLead(baseLead({ routeKey: "argentina/flete-equipo-pesado-usa" }));
+    expect(res.success).toBe(false);
+  });
+
+  it("dedupes: a confirmed duplicate skips owner email + all side effects", async () => {
+    fetchSpy.mockResolvedValue({ ok: true, json: async () => [], text: async () => "" } as unknown as Response);
+    const res = await submitPaidSearchLead(baseLead());
+    expect(res.success).toBe(true);
+    expect(res.duplicate).toBe(true);
+    expect(h.sendMock).not.toHaveBeenCalled();
+    expect(h.notifySlack).not.toHaveBeenCalled();
+    expect(h.sendCAPIEvent).not.toHaveBeenCalled();
+  });
+
+  it("on insert: owner email once, diagnostic emitters fire, NO Google Ads upload", async () => {
+    await submitPaidSearchLead(baseLead());
+    expect(h.sendMock).toHaveBeenCalledTimes(1);
+    expect(h.notifySlack).toHaveBeenCalledTimes(1);
+    expect(h.sendCAPIEvent).toHaveBeenCalledTimes(1);
+    const adsCall = fetchSpy.mock.calls.find((c) => /googleads|google-analytics|\/ads\b/.test(String(c[0])));
+    expect(adsCall).toBeUndefined();
+  });
+
+  it("honeypot: a filled website field short-circuits with no insert", async () => {
+    const res = await submitPaidSearchLead(baseLead({ website: "bot" }));
+    expect(res.success).toBe(true);
+    expect(leadInsertBody()).toBeNull();
+  });
+});
diff --git a/app/actions/__tests__/whatsapp-ref.test.ts b/app/actions/__tests__/whatsapp-ref.test.ts
new file mode 100644
index 0000000..f9c5aae
--- /dev/null
+++ b/app/actions/__tests__/whatsapp-ref.test.ts
@@ -0,0 +1,37 @@
+import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
+
+vi.mock("@/lib/logger", () => ({ log: vi.fn() }));
+
+import { createWhatsAppRef } from "@/app/actions/whatsapp-ref";
+
+beforeEach(() => {
+  // Force the no-DB path so the test never makes a network call.
+  vi.stubEnv("SUPABASE_URL", "");
+  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
+});
+afterEach(() => {
+  vi.unstubAllEnvs();
+});
+
+describe("createWhatsAppRef", () => {
+  it("returns an opaque MF- ref (8 Crockford chars), URL-safe, with lead_id + expiry", async () => {
+    const r = await createWhatsAppRef({ routeKey: "argentina/importacion-maquinaria-usa", attribution_id: "attr_x" });
+    expect(r.success).toBe(true);
+    expect(r.whatsapp_ref).toMatch(/^MF-[0-9A-HJKMNP-TV-Z]{8}$/);
+    expect(encodeURIComponent(r.whatsapp_ref!)).toBe(r.whatsapp_ref); // URL-safe, no encoding
+    expect((r.whatsapp_ref ?? "").length).toBeLessThanOrEqual(32);
+    expect(r.lead_id).toBeTruthy();
+    expect(r.expires_at).toBeTruthy();
+  });
+
+  it("rejects an unknown route", async () => {
+    const r = await createWhatsAppRef({ routeKey: "narnia/nope", attribution_id: "" });
+    expect(r.success).toBe(false);
+    expect(r.error).toBe("unknown_route");
+  });
+
+  it("rejects an invalid country/segment combo (registry-validated)", async () => {
+    const r = await createWhatsAppRef({ routeKey: "argentina/flete-equipo-pesado-usa" });
+    expect(r.success).toBe(false);
+  });
+});
diff --git a/app/actions/paid-search-lead.ts b/app/actions/paid-search-lead.ts
new file mode 100644
index 0000000..ed26601
--- /dev/null
+++ b/app/actions/paid-search-lead.ts
@@ -0,0 +1,272 @@
+"use server";
+
+import { after } from "next/server";
+import { Resend } from "resend";
+import { track } from "@vercel/analytics/server";
+import { paidSearchLeadSchema, type PaidSearchLeadInput } from "@/lib/schemas";
+import { getPaidSearchDestination } from "@/lib/latam-paid-search-routes";
+import { assertGoogleAdsTagMatches } from "@/lib/google-ads-tag";
+import { CONTACT } from "@/lib/constants";
+import { notifySlack } from "@/lib/slack";
+import { sendCAPIEvent } from "@/lib/meta-capi";
+import { startTimer, log } from "@/lib/logger";
+
+const SOURCE_ACCOUNT_ID = "3783002123";
+const ROUTER_TAG = (process.env.FREIGHT_ROUTER_TAG ?? "#FRT_ES").trim() || "#FRT_ES";
+const CONSENT_VERSION = "paid-search-consent-v1";
+
+function escapeHtml(input: string): string {
+  return String(input)
+    .replace(/&/g, "&amp;")
+    .replace(/</g, "&lt;")
+    .replace(/>/g, "&gt;")
+    .replace(/"/g, "&quot;")
+    .replace(/'/g, "&#039;");
+}
+
+function newLeadId(): string {
+  return typeof crypto !== "undefined" && "randomUUID" in crypto
+    ? crypto.randomUUID()
+    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
+}
+
+/** Returns inserted=false ONLY on a confirmed duplicate (ok + empty rows). */
+async function insertPaidSearchLead(
+  lead: Record<string, unknown>,
+): Promise<{ inserted: boolean; configured: boolean }> {
+  const url = process.env.SUPABASE_URL;
+  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
+  if (!url || !key) return { inserted: true, configured: false };
+  try {
+    const resp = await fetch(`${url}/rest/v1/leads?on_conflict=idempotency_key`, {
+      method: "POST",
+      headers: {
+        apikey: key,
+        Authorization: `Bearer ${key}`,
+        "Content-Type": "application/json",
+        Prefer: "resolution=ignore-duplicates,return=representation",
+      },
+      body: JSON.stringify(lead),
+    });
+    if (!resp.ok) {
+      const text = await resp.text().catch(() => "");
+      log({ level: "error", msg: "supabase_insert_failed", route: "action:paid-search-lead", status: resp.status, body: text });
+      return { inserted: true, configured: true }; // failure ≠ duplicate; don't drop a real lead
+    }
+    const rows = (await resp.json().catch(() => [])) as unknown[];
+    return { inserted: Array.isArray(rows) ? rows.length > 0 : true, configured: true };
+  } catch (e) {
+    log({ level: "error", msg: "supabase_insert_exception", route: "action:paid-search-lead", error: String(e) });
+    return { inserted: true, configured: true };
+  }
+}
+
+export interface PaidSearchLeadResult {
+  success: boolean;
+  error?: string;
+  lead_id?: string;
+  eventId?: string;
+  duplicate?: boolean;
+}
+
+export async function submitPaidSearchLead(
+  raw: PaidSearchLeadInput,
+): Promise<PaidSearchLeadResult> {
+  const timer = startTimer("action:paid-search-lead");
+
+  // 1. Validate
+  const parsed = paidSearchLeadSchema.safeParse(raw);
+  if (!parsed.success) {
+    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
+  }
+  const data = parsed.data;
+
+  // 2. Honeypot
+  if (data.website) return { success: true };
+
+  // 3. TRUST BOUNDARY: rederive route context from the validated routeKey ONLY.
+  const [country, segment] = data.routeKey.split("/");
+  const record = getPaidSearchDestination("es", country ?? "", segment ?? "");
+  if (!record) {
+    timer.error("unknown_route", { routeKey: data.routeKey });
+    return { success: false, error: "Unsupported route." };
+  }
+
+  // 4. Google Ads tag guard (record mismatch, never throw / never add a conversion).
+  const tagCheck = assertGoogleAdsTagMatches();
+  if (!tagCheck.ok) {
+    log({ level: "warn", msg: "google_ads_tag_mismatch", route: "action:paid-search-lead", reason: tagCheck.reason, expected: tagCheck.expected });
+  }
+
+  // 5. Identity / dedupe (idempotency_key === lead_id)
+  const lead_id = data.lead_id || newLeadId();
+
+  const apiKey = process.env.RESEND_API_KEY;
+  if (!apiKey) {
+    timer.error("RESEND_API_KEY is not configured");
+    return { success: false, error: "Email service is not configured." };
+  }
+  const resend = new Resend(apiKey);
+
+  const ft: Record<string, string | undefined> = data.first_touch ?? {};
+  const lt: Record<string, string | undefined> = data.latest_touch ?? data.first_touch ?? {};
+  const nowIso = new Date().toISOString();
+
+  // 6. Contract-compliant payload — route context REDERIVED from the registry,
+  // never from the client. To stay light on the SHARED leads table, only the
+  // queryable/dedupe/correlation fields are real columns; the full contract
+  // (extended UTMs, click IDs, route context, touches) rides in one jsonb.
+  const gclid = lt.gclid || ft.gclid || null;
+  const gbraid = lt.gbraid || ft.gbraid || null;
+  const wbraid = lt.wbraid || ft.wbraid || null;
+
+  const paid_search_metadata = {
+    schema_version: "paid-search-lead-v1",
+    attribution_id: data.attribution_id || null,
+    whatsapp_ref: data.whatsapp_ref || null,
+    source_account_id: SOURCE_ACCOUNT_ID,
+    google_ads_tag: tagCheck.ok ? tagCheck.runtime : null,
+    landing_route: record.seo.canonicalPath,
+    page_route: record.seo.canonicalPath,
+    request_type: record.segment.requestType,
+    router_tag: ROUTER_TAG,
+    fbclid: lt.fbclid || ft.fbclid || null,
+    utm_matchtype: lt.utm_matchtype || ft.utm_matchtype || null,
+    utm_network: lt.utm_network || ft.utm_network || null,
+    utm_device: lt.utm_device || ft.utm_device || null,
+    first_touch: data.first_touch ?? null,
+    latest_touch: data.latest_touch ?? null,
+    preferred_contact_method: data.preferred_contact_method,
+    equipment_type: data.equipment_type,
+    make_model: data.make_model || null,
+    purchase_status: data.purchase_status || null,
+    origin_location: data.origin_location || null,
+    destination_location: data.destination_location || null,
+    consent_version: data.consent ? CONSENT_VERSION : null,
+    submitted_at: nowIso,
+    year: data.year || null,
+    listing_url: data.listing_url || null,
+    dimensions: data.dimensions || null,
+    weight: data.weight || null,
+    requested_timing: data.requested_timing || null,
+    buyer_role: data.buyer_role || null,
+  };
+
+  const payload = {
+    // existing leads columns
+    name: data.contact_name,
+    email: data.contact_email || null,
+    phone: data.contact_phone || null,
+    // leads.message is NOT NULL — synthesize a summary when the user leaves it blank.
+    message:
+      data.message?.trim() ||
+      `Solicitud de cotización (paid-search): ${data.equipment_type} → ${record.country.name}`,
+    source_page: `paid-search: ${record.seo.canonicalPath}`,
+    status: "new",
+    utm_source: lt.utm_source || ft.utm_source || null,
+    utm_medium: lt.utm_medium || ft.utm_medium || null,
+    utm_campaign: lt.utm_campaign || ft.utm_campaign || null,
+    utm_term: lt.utm_term || ft.utm_term || null,
+    utm_content: lt.utm_content || ft.utm_content || null,
+    // new flat columns (queryable / dedupe / correlation)
+    lead_id,
+    idempotency_key: lead_id,
+    source_platform: "google_ads",
+    country: record.country.code,
+    segment: record.segment.key,
+    cargo_class: record.segment.cargoClass,
+    gclid,
+    gbraid,
+    wbraid,
+    // full contract (extended UTMs, click IDs, route context, touches, equipment)
+    paid_search_metadata,
+  };
+
+  // 7. Insert (best-effort) with dedupe.
+  const { inserted } = await insertPaidSearchLead(payload);
+  if (!inserted) {
+    timer.done({ lead_id, duplicate: true });
+    return { success: true, lead_id, duplicate: true };
+  }
+
+  // 8. Owner email (must succeed). Skipped only on a confirmed duplicate (above).
+  const safe = (v: string | null | undefined) => escapeHtml(v ?? "");
+  try {
+    const { error } = await resend.emails.send({
+      from: CONTACT.fromEmail,
+      to: CONTACT.notificationEmail,
+      cc: CONTACT.notificationCc as unknown as string[],
+      replyTo: data.contact_email || undefined,
+      subject: `Paid-search lead: ${data.equipment_type} → ${record.country.name} [${record.segment.key}]`,
+      html: `
+        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
+          <div style="background:#0ea5e9;color:white;padding:24px;border-radius:8px 8px 0 0">
+            <h1 style="margin:0;font-size:20px">Paid-search lead — ${safe(record.country.name)}</h1>
+          </div>
+          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
+            <p><strong>Name:</strong> ${safe(data.contact_name)}</p>
+            <p><strong>Email:</strong> ${safe(data.contact_email)}</p>
+            <p><strong>Phone:</strong> ${safe(data.contact_phone)}</p>
+            <p><strong>Equipment:</strong> ${safe(data.equipment_type)} ${safe(data.make_model)} ${safe(data.year)}</p>
+            <p><strong>Route:</strong> ${safe(record.seo.canonicalPath)} (${safe(record.segment.cargoClass)})</p>
+            <p><strong>Origin → Destination:</strong> ${safe(data.origin_location)} → ${safe(data.destination_location)}</p>
+            <p><strong>Message:</strong><br/>${safe(data.message).replace(/\n/g, "<br/>")}</p>
+            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:16px 0"/>
+            <p style="font-size:12px;color:#6b7280">
+              lead_id: ${safe(lead_id)}<br/>
+              click IDs: ${safe([payload.gclid, payload.gbraid, payload.wbraid, paid_search_metadata.fbclid].filter(Boolean).join(" / ") || "none")}<br/>
+              UTM: ${safe([payload.utm_source, payload.utm_medium, payload.utm_campaign, paid_search_metadata.utm_matchtype, paid_search_metadata.utm_network, paid_search_metadata.utm_device].filter(Boolean).join(" / ") || "none")}
+            </p>
+          </div>
+        </div>
+      `,
+    });
+    if (error) {
+      timer.error(error, { step: "owner_email" });
+      return { success: false, error: (error as { message?: string })?.message || "Failed to send email." };
+    }
+  } catch (err) {
+    timer.error(err, { step: "owner_email" });
+    return { success: false, error: "An unexpected error occurred." };
+  }
+
+  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
+
+  // 9. Background best-effort. Diagnostic events only; NO Google Ads upload (Gate B).
+  after(async () => {
+    const slackLines = [
+      `*New paid-search lead — ${record.country.name} [${record.segment.key}]:* ${data.contact_name}`,
+      data.contact_email ? `Email: ${data.contact_email}` : null,
+      data.contact_phone ? `Phone: ${data.contact_phone}` : null,
+      `Equipment: ${data.equipment_type} ${data.make_model}`.trim(),
+      `Route: ${record.seo.canonicalPath}`,
+    ]
+      .filter(Boolean)
+      .join("\n");
+    await notifySlack(slackLines);
+
+    await sendCAPIEvent({
+      eventName: "Lead",
+      eventId,
+      email: data.contact_email || undefined,
+      phone: data.contact_phone || undefined,
+      sourceUrl: record.seo.canonicalPath,
+      customData: {
+        lead_source: "paid_search",
+        country: record.country.code,
+        segment: record.segment.key,
+        request_type: record.segment.requestType,
+        equipment_type: data.equipment_type,
+      },
+    });
+
+    await track("lead_submitted", {
+      source: "paid_search",
+      country: record.country.code,
+      segment: record.segment.key,
+    }).catch(() => {});
+  });
+
+  timer.done({ lead_id, country: record.country.code, segment: record.segment.key });
+  return { success: true, lead_id, eventId };
+}
diff --git a/app/actions/whatsapp-ref.ts b/app/actions/whatsapp-ref.ts
new file mode 100644
index 0000000..b984e2e
--- /dev/null
+++ b/app/actions/whatsapp-ref.ts
@@ -0,0 +1,55 @@
+"use server";
+
+import { whatsappRefRequestSchema, type WhatsAppRefRequestData } from "@/lib/schemas";
+import { getPaidSearchDestination } from "@/lib/latam-paid-search-routes";
+
+// Opaque, URL-safe ref (spec §6.5): MF- + 8 Crockford base32 chars (no I/L/O/U).
+// Random token — NOT an encoding of click IDs, which never appear in WhatsApp text.
+const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
+const REF_TTL_DAYS = 90;
+
+function generateRef(): string {
+  const bytes = new Uint8Array(8);
+  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
+    crypto.getRandomValues(bytes);
+  } else {
+    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
+  }
+  let s = "";
+  for (let i = 0; i < 8; i++) s += CROCKFORD[bytes[i] % 32];
+  return `MF-${s}`;
+}
+
+function newLeadId(): string {
+  return typeof crypto !== "undefined" && "randomUUID" in crypto
+    ? crypto.randomUUID()
+    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
+}
+
+export interface WhatsAppRefResult {
+  success: boolean;
+  lead_id?: string;
+  whatsapp_ref?: string;
+  expires_at?: string;
+  error?: string;
+}
+
+export async function createWhatsAppRef(raw: WhatsAppRefRequestData): Promise<WhatsAppRefResult> {
+  const parsed = whatsappRefRequestSchema.safeParse(raw);
+  if (!parsed.success) return { success: false, error: "invalid_request" };
+  const data = parsed.data;
+
+  const [country, segment] = data.routeKey.split("/");
+  const record = getPaidSearchDestination("es", country ?? "", segment ?? "");
+  if (!record) return { success: false, error: "unknown_route" };
+
+  // Stateless: generate an opaque ref + lead_id; no DB write. The website does
+  // NOT own a ref store — that would duplicate the chatbot's wa_attribution.ref_code.
+  // The ref is included in the WhatsApp message and persisted on the lead row at
+  // form submit (leads.whatsapp_ref in paid_search_metadata). The client caches the
+  // ref per session so repeated CTA clicks reuse it (idempotency).
+  const lead_id = newLeadId();
+  const whatsapp_ref = generateRef();
+  const expires_at = new Date(Date.now() + REF_TTL_DAYS * 86400000).toISOString();
+  return { success: true, lead_id, whatsapp_ref, expires_at };
+}
diff --git a/app/sitemap.ts b/app/sitemap.ts
index 506757c..eaba32c 100644
--- a/app/sitemap.ts
+++ b/app/sitemap.ts
@@ -3,6 +3,7 @@ import { SITE } from "@/lib/constants";
 import { getAllServices } from "@/content/services";
 import { getAllEquipmentTypes } from "@/content/equipment";
 import { getAllDestinations } from "@/content/destinations";
+import { LATAM_PAID_SEARCH_DESTINATIONS } from "@/content/latam-paid-search-destinations";
 import { blogPosts } from "@/content/blog";
 import { isLatamMarketSlug, latamMarketPages } from "@/content/latam-market-pages";
 import { getBlogLocalePolicy } from "@/lib/blog-locale-policy";
@@ -93,6 +94,15 @@ export default function sitemap(): MetadataRoute.Sitemap {
     },
   }));
 
+  // es-only paid-search destination LPs (canonical to production, indexable).
+  const paidSearchSitemapPages: MetadataRoute.Sitemap = LATAM_PAID_SEARCH_DESTINATIONS.map((d) => ({
+    url: `${SITE.url}${d.seo.canonicalPath}`,
+    lastModified: now,
+    changeFrequency: "weekly" as const,
+    priority: 0.85,
+    alternates: { languages: { es: `${SITE.url}${d.seo.canonicalPath}` } },
+  }));
+
   const blogPages: MetadataRoute.Sitemap = blogPosts.flatMap((p) => {
     const policy = getBlogLocalePolicy(p.slug);
     const indexable = policy.indexableLocales;
@@ -116,6 +126,7 @@ export default function sitemap(): MetadataRoute.Sitemap {
     ...equipmentPages,
     ...destinationPages,
     ...latamMarketSitemapPages,
+    ...paidSearchSitemapPages,
     ...blogPages,
   ];
 }
diff --git a/components/destinations/latam-paid-search-page.tsx b/components/destinations/latam-paid-search-page.tsx
new file mode 100644
index 0000000..2ad6e52
--- /dev/null
+++ b/components/destinations/latam-paid-search-page.tsx
@@ -0,0 +1,333 @@
+import {
+  AlertTriangle,
+  ArrowRight,
+  CheckCircle2,
+  ClipboardCheck,
+  ExternalLink,
+  FileText,
+  Ship,
+  ShieldCheck,
+} from "lucide-react";
+import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
+import { Button } from "@/components/ui/button";
+import { Card, CardContent } from "@/components/ui/card";
+import { DarkCta } from "@/components/dark-cta";
+import { JsonLdScript } from "@/components/json-ld-script";
+import { PageHero } from "@/components/page-hero";
+import { ScrollReveal } from "@/components/scroll-reveal";
+import { TrackedCtaLink } from "@/components/tracked-cta-link";
+import { PaidSearchWhatsAppButton } from "@/components/destinations/paid-search-whatsapp-button";
+import { TrustBar } from "@/components/trust-bar";
+import { PaidSearchQuoteForm } from "@/components/destinations/paid-search-quote-form";
+import type { LatamPaidSearchDestination } from "@/content/latam-paid-search-destinations";
+import { COMPANY, CONTACT, SITE, STATS } from "@/lib/constants";
+import { formatCount } from "@/lib/i18n-utils";
+import { encodeJsonLd } from "@/lib/json-ld";
+
+interface LatamPaidSearchPageProps {
+  record: LatamPaidSearchDestination;
+}
+
+function SectionIntro({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
+  return (
+    <div className="max-w-3xl">
+      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
+      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
+      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
+    </div>
+  );
+}
+
+function ScopeCards({ record }: LatamPaidSearchPageProps) {
+  return (
+    <div className="w-full max-w-xl lg:w-[440px]">
+      <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
+        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Meridian coordina</p>
+        <ul className="mt-3 space-y-2">
+          {record.scopeIncluded.map((item) => (
+            <li key={item} className="flex gap-2 text-sm leading-relaxed text-sky-100">
+              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
+              <span>{item}</span>
+            </li>
+          ))}
+        </ul>
+      </div>
+      <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
+        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Su despachante confirma en destino</p>
+        <ul className="mt-3 space-y-2">
+          {record.scopeExcluded.map((item) => (
+            <li key={item} className="flex gap-2 text-sm leading-relaxed text-sky-100">
+              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
+              <span>{item}</span>
+            </li>
+          ))}
+        </ul>
+      </div>
+    </div>
+  );
+}
+
+export function LatamPaidSearchPage({ record }: LatamPaidSearchPageProps) {
+  const pageUrl = `${SITE.url}${record.seo.canonicalPath}`;
+  const trustClaim = `Meridian ha coordinado más de ${formatCount(STATS.projectsCompleted, "es")} exportaciones a más de 40 países.`;
+
+  const serviceJsonLd = {
+    "@context": "https://schema.org",
+    "@type": "Service",
+    inLanguage: record.locale,
+    name: record.jsonLd.serviceName,
+    serviceType: record.jsonLd.serviceType,
+    description: record.seo.description,
+    url: pageUrl,
+    provider: { "@type": "Organization", name: COMPANY.name, url: SITE.url, telephone: CONTACT.phone },
+    areaServed: { "@type": "Country", name: record.jsonLd.areaServedCountryName },
+    availableLanguage: { "@type": "Language", name: "Spanish", alternateName: record.locale },
+  };
+  const breadcrumbJsonLd = {
+    "@context": "https://schema.org",
+    "@type": "BreadcrumbList",
+    itemListElement: [
+      { "@type": "ListItem", position: 1, name: "Destinos", item: `${SITE.url}/es/destinations` },
+      { "@type": "ListItem", position: 2, name: record.country.name, item: `${SITE.url}${record.country.hubPath}` },
+      { "@type": "ListItem", position: 3, name: record.breadcrumbLabel, item: pageUrl },
+    ],
+  };
+  const faqJsonLd = {
+    "@context": "https://schema.org",
+    "@type": "FAQPage",
+    inLanguage: record.locale,
+    mainEntity: record.faq.map((entry) => ({
+      "@type": "Question",
+      name: entry.question,
+      acceptedAnswer: { "@type": "Answer", text: entry.answer },
+    })),
+  };
+
+  return (
+    <>
+      <JsonLdScript encodedJson={encodeJsonLd(serviceJsonLd)} />
+      <JsonLdScript encodedJson={encodeJsonLd(breadcrumbJsonLd)} />
+      <JsonLdScript encodedJson={encodeJsonLd(faqJsonLd)} />
+
+      <PageHero
+        variant="dark"
+        locale="es"
+        currentPath={`/destinations/${record.country.slug}/${record.segment.slug}`}
+        breadcrumbs={[
+          { label: "Destinos", href: "/destinations" },
+          { label: record.country.name, href: `/destinations/${record.country.slug}` },
+          { label: record.breadcrumbLabel },
+        ]}
+        eyebrow={record.eyebrow}
+        heading={record.h1}
+        description={
+          <div>
+            <p>{record.heroBody}</p>
+            <ul className="mt-5 grid gap-3">
+              {record.heroBullets.map((b) => (
+                <li key={b} className="flex gap-3 text-base leading-relaxed text-sky-100">
+                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
+                  <span>{b}</span>
+                </li>
+              ))}
+            </ul>
+            <p className="mt-5 text-sm leading-relaxed text-sky-200">{record.compliance.localResponsibility}</p>
+          </div>
+        }
+        icon={Ship}
+        rightContent={<ScopeCards record={record} />}
+      >
+        <div className="flex flex-col gap-3 sm:flex-row">
+          <PaidSearchWhatsAppButton
+            routeKey={record.routeKey}
+            prefillTemplate={record.cta.whatsappPrefill}
+            location={record.tracking.heroWhatsapp}
+            label={record.cta.whatsappLabel}
+            className="h-12 rounded-xl bg-emerald-600 px-6 font-semibold text-white hover:bg-emerald-700"
+          />
+          <Button
+            render={
+              <TrackedCtaLink
+                href="/pricing/calculator"
+                location={record.tracking.heroCalculator}
+                text={record.cta.calculatorLabel}
+              />
+            }
+            size="lg"
+            variant="outline"
+            className="h-12 rounded-xl border-white bg-transparent px-6 font-semibold text-white hover:bg-white hover:text-foreground"
+          >
+            {record.cta.calculatorLabel}
+            <ArrowRight className="ml-2 h-4 w-4" />
+          </Button>
+        </div>
+      </PageHero>
+
+      <TrustBar />
+
+      {/* Process */}
+      <section className="py-16 md:py-20">
+        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
+          <SectionIntro eyebrow="Proceso" title={record.process.heading} intro={record.process.intro} />
+          <div className="mt-10 grid gap-4 md:grid-cols-2">
+            {record.process.steps.map((step, i) => (
+              <div key={step.title} className="rounded-xl border bg-white p-5 shadow-sm">
+                <div className="flex items-start gap-4">
+                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-white">
+                    {i + 1}
+                  </div>
+                  <div>
+                    <h3 className="font-bold text-foreground">{step.title}</h3>
+                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
+                  </div>
+                </div>
+              </div>
+            ))}
+          </div>
+        </div>
+      </section>
+
+      {/* Scope included / excluded */}
+      <section className="bg-muted py-16 md:py-20">
+        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
+          <SectionIntro eyebrow="Alcance" title="Qué incluye y qué no la cotización" intro="Separamos el tramo internacional que controlamos de los costos y trámites locales que confirma su despachante." />
+          <div className="mt-10 grid gap-6 lg:grid-cols-2">
+            <Card className="border-0 shadow-sm">
+              <CardContent className="p-6">
+                <ClipboardCheck className="h-8 w-8 text-emerald-600" />
+                <h3 className="mt-4 text-lg font-bold text-foreground">Meridian coordina</h3>
+                <ul className="mt-4 space-y-3">
+                  {record.scopeIncluded.map((item) => (
+                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
+                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
+                      <span>{item}</span>
+                    </li>
+                  ))}
+                </ul>
+              </CardContent>
+            </Card>
+            <Card className="border-0 shadow-sm">
+              <CardContent className="p-6">
+                <AlertTriangle className="h-8 w-8 text-amber-600" />
+                <h3 className="mt-4 text-lg font-bold text-foreground">Su despachante confirma en destino</h3>
+                <ul className="mt-4 space-y-3">
+                  {record.scopeExcluded.map((item) => (
+                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
+                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
+                      <span>{item}</span>
+                    </li>
+                  ))}
+                </ul>
+              </CardContent>
+            </Card>
+          </div>
+        </div>
+      </section>
+
+      {/* Quote readiness + form */}
+      <section id="cotizar" className="py-16 md:py-20">
+        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
+          <SectionIntro eyebrow="Cotización" title={record.quoteReadiness.heading} intro={record.quoteReadiness.intro} />
+          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
+            <div>
+              <ul className="grid gap-3">
+                {record.quoteReadiness.fields.map((f) => (
+                  <li key={f} className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
+                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
+                    <span>{f}</span>
+                  </li>
+                ))}
+              </ul>
+            </div>
+            <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
+              <h3 className="text-lg font-bold text-foreground">Solicitar cotización</h3>
+              <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
+                Comparta el equipo y el destino; le devolvemos por escrito el alcance del tramo internacional.
+              </p>
+              <PaidSearchQuoteForm routeKey={record.routeKey} caveat={record.compliance.localResponsibility} />
+            </div>
+          </div>
+        </div>
+      </section>
+
+      {/* Compliance */}
+      <section className="bg-muted py-16 md:py-20">
+        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
+          <SectionIntro eyebrow="Cumplimiento local" title={record.compliance.heading} intro={record.compliance.body} />
+          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{trustClaim}</p>
+        </div>
+      </section>
+
+      {/* FAQ */}
+      <section className="py-16 md:py-20">
+        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
+          <SectionIntro eyebrow="Preguntas frecuentes" title="Preguntas frecuentes" intro="Lo que más nos consultan los compradores antes de embarcar." />
+          <ScrollReveal className="mt-10 max-w-4xl">
+            <Accordion className="space-y-3">
+              {record.faq.map((entry, i) => (
+                <AccordionItem key={entry.question} value={`ps-faq-${i}`} className="rounded-xl border-0 bg-white px-6 shadow-sm">
+                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:text-primary">
+                    {entry.question}
+                  </AccordionTrigger>
+                  <AccordionContent className="pb-5 text-muted-foreground">{entry.answer}</AccordionContent>
+                </AccordionItem>
+              ))}
+            </Accordion>
+          </ScrollReveal>
+        </div>
+      </section>
+
+      {/* Official sources */}
+      <section className="bg-muted py-16 md:py-20">
+        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
+          <SectionIntro eyebrow="Fuentes oficiales" title="Fuentes oficiales para validar su operación" intro="Los requisitos pueden cambiar y dependen de la clasificación, condición y uso del equipo. Confirme su caso con su importador o despachante antes de comprar o embarcar." />
+          <div className="mt-10 grid gap-3 sm:grid-cols-2">
+            {record.officialSources.map((source) => (
+              <a
+                key={source.id}
+                href={source.url}
+                target="_blank"
+                rel="noopener noreferrer"
+                aria-label={`${source.label} (fuente oficial, abre en una pestaña nueva)`}
+                className="group rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
+              >
+                <span className="flex items-start justify-between gap-4">
+                  <span>
+                    <span className="block text-sm font-semibold text-foreground">{source.label}</span>
+                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{source.description}</span>
+                  </span>
+                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-primary" />
+                </span>
+              </a>
+            ))}
+          </div>
+        </div>
+      </section>
+
+      <DarkCta heading={record.cta.heading} description={record.cta.description}>
+        <PaidSearchWhatsAppButton
+          routeKey={record.routeKey}
+          prefillTemplate={record.cta.whatsappPrefill}
+          location={record.tracking.finalWhatsapp}
+          label={record.cta.whatsappLabel}
+          className="h-12 rounded-xl bg-white px-6 font-semibold text-foreground hover:bg-muted"
+        />
+        <Button
+          render={
+            <TrackedCtaLink
+              href="/pricing/calculator"
+              location={record.tracking.finalCalculator}
+              text={record.cta.calculatorLabel}
+            />
+          }
+          size="lg"
+          variant="outline"
+          className="h-12 rounded-xl border-2 border-white bg-transparent px-6 font-semibold text-white hover:bg-white hover:text-foreground"
+        >
+          {record.cta.calculatorLabel}
+          <ArrowRight className="ml-2 h-4 w-4" />
+        </Button>
+      </DarkCta>
+    </>
+  );
+}
diff --git a/components/destinations/paid-search-quote-form.tsx b/components/destinations/paid-search-quote-form.tsx
new file mode 100644
index 0000000..ed4038b
--- /dev/null
+++ b/components/destinations/paid-search-quote-form.tsx
@@ -0,0 +1,262 @@
+"use client";
+
+import { useEffect, useRef, useState } from "react";
+import { Loader2, Send } from "lucide-react";
+import { Button } from "@/components/ui/button";
+import { Input } from "@/components/ui/input";
+import { Label } from "@/components/ui/label";
+import { Textarea } from "@/components/ui/textarea";
+import { submitPaidSearchLead } from "@/app/actions/paid-search-lead";
+import {
+  generateAttributionId,
+  hasPaidSignal,
+  parsePaidTouch,
+  type PaidAttributionTouch,
+} from "@/lib/lead-attribution";
+import { trackGA4Event, trackPixelEvent } from "@/lib/tracking";
+import { track as vercelTrack } from "@vercel/analytics";
+
+interface PaidSearchQuoteFormProps {
+  routeKey: string;
+  /** Customs-responsibility caveat rendered adjacent to the CTA (spec §15). */
+  caveat: string;
+}
+
+interface AttrState {
+  attribution_id: string;
+  lead_id: string;
+  first_touch: PaidAttributionTouch;
+  latest_touch: PaidAttributionTouch;
+}
+
+function newLeadId(): string {
+  return typeof crypto !== "undefined" && "randomUUID" in crypto
+    ? crypto.randomUUID()
+    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
+}
+
+export function PaidSearchQuoteForm({ routeKey, caveat }: PaidSearchQuoteFormProps) {
+  const [isSubmitting, setIsSubmitting] = useState(false);
+  const [isSubmitted, setIsSubmitted] = useState(false);
+  const [error, setError] = useState("");
+  const attrRef = useRef<AttrState | null>(null);
+
+  useEffect(() => {
+    const touch = parsePaidTouch(window.location.href, document.referrer);
+    const sk = `ps_attr_${routeKey}`;
+    let stored: AttrState | null = null;
+    try {
+      stored = JSON.parse(sessionStorage.getItem(sk) || "null");
+    } catch {
+      stored = null;
+    }
+    const next: AttrState = {
+      attribution_id: stored?.attribution_id || generateAttributionId(),
+      lead_id: stored?.lead_id || newLeadId(),
+      first_touch: stored?.first_touch || touch,
+      latest_touch: hasPaidSignal(touch) ? touch : stored?.latest_touch || stored?.first_touch || touch,
+    };
+    try {
+      sessionStorage.setItem(sk, JSON.stringify(next));
+    } catch {
+      /* storage blocked — keep attribution in memory only */
+    }
+    attrRef.current = next;
+  }, [routeKey]);
+
+  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
+    e.preventDefault();
+    setIsSubmitting(true);
+    setError("");
+    const form = e.currentTarget;
+    const fd = new FormData(form);
+    if (fd.get("website")) {
+      setIsSubmitted(true);
+      setIsSubmitting(false);
+      return;
+    }
+    if (!fd.get("consent")) {
+      setError("Debe aceptar las condiciones para continuar.");
+      setIsSubmitting(false);
+      return;
+    }
+    const attr = attrRef.current;
+    try {
+      const result = await submitPaidSearchLead({
+        routeKey,
+        contact_name: (fd.get("contact_name") as string) || "",
+        contact_email: (fd.get("contact_email") as string) || "",
+        contact_phone: (fd.get("contact_phone") as string) || "",
+        preferred_contact_method: "whatsapp",
+        equipment_type: (fd.get("equipment_type") as string) || "",
+        make_model: (fd.get("make_model") as string) || "",
+        year: (fd.get("year") as string) || "",
+        listing_url: (fd.get("listing_url") as string) || "",
+        origin_location: (fd.get("origin_location") as string) || "",
+        destination_location: (fd.get("destination_location") as string) || "",
+        purchase_status: (fd.get("purchase_status") as string) || "",
+        message: (fd.get("message") as string) || "",
+        consent: fd.get("consent") === "on",
+        website: (fd.get("website") as string) || "",
+        attribution_id: attr?.attribution_id || "",
+        lead_id: attr?.lead_id || "",
+        first_touch: attr?.first_touch,
+        latest_touch: attr?.latest_touch,
+      });
+      if (result.success) {
+        setIsSubmitted(true);
+        trackGA4Event("generate_lead", {
+          event_category: "paid_search",
+          event_label: routeKey,
+          value: 300,
+          currency: "USD",
+        });
+        vercelTrack("generate_lead", { source: "paid_search", value: 300 });
+        if (result.eventId) {
+          trackPixelEvent("Lead", { content_name: `paid_search:${routeKey}` }, result.eventId);
+        }
+      } else {
+        setError(result.error || "No pudimos enviar su solicitud. Intente nuevamente.");
+      }
+    } catch {
+      setError("No pudimos enviar su solicitud. Intente nuevamente.");
+    } finally {
+      setIsSubmitting(false);
+    }
+  }
+
+  if (isSubmitted) {
+    return (
+      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
+        <h3 className="text-xl font-bold text-foreground">Solicitud recibida</h3>
+        <p className="mt-2 text-muted-foreground">
+          Gracias. Revisaremos los datos del equipo y le responderemos con el alcance del tramo internacional. Le contactaremos dentro de las próximas 24 horas.
+        </p>
+      </div>
+    );
+  }
+
+  return (
+    <form
+      onSubmit={handleSubmit}
+      className={`space-y-5 transition-opacity ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
+    >
+      <div className="hidden" aria-hidden="true">
+        <label>
+          Website
+          <input type="text" name="website" autoComplete="off" tabIndex={-1} />
+        </label>
+      </div>
+
+      <p className="text-xs text-muted-foreground">
+        Los campos marcados con <span aria-hidden="true">*</span>
+        <span className="sr-only"> asterisco</span> son obligatorios.
+      </p>
+
+      <div className="grid gap-5 sm:grid-cols-2">
+        <div>
+          <Label htmlFor="contact_name">
+            Nombre <span aria-hidden="true" className="text-red-500">*</span>
+          </Label>
+          <Input id="contact_name" name="contact_name" required aria-required="true" autoComplete="name" className="mt-1.5" />
+        </div>
+        <div>
+          <Label htmlFor="contact_phone">WhatsApp o teléfono</Label>
+          <Input id="contact_phone" name="contact_phone" type="tel" autoComplete="tel" className="mt-1.5" />
+        </div>
+      </div>
+
+      <div className="grid gap-5 sm:grid-cols-2">
+        <div>
+          <Label htmlFor="contact_email">Email</Label>
+          <Input id="contact_email" name="contact_email" type="email" autoComplete="email" spellCheck={false} className="mt-1.5" />
+        </div>
+        <div>
+          <Label htmlFor="equipment_type">
+            Equipo <span aria-hidden="true" className="text-red-500">*</span>
+          </Label>
+          <Input id="equipment_type" name="equipment_type" required aria-required="true" placeholder="Ej.: cosechadora, tractor, excavadora" className="mt-1.5" />
+        </div>
+      </div>
+
+      <div className="grid gap-5 sm:grid-cols-2">
+        <div>
+          <Label htmlFor="make_model">Marca, modelo y año</Label>
+          <Input id="make_model" name="make_model" className="mt-1.5" />
+        </div>
+        <div>
+          <Label htmlFor="purchase_status">Estado de compra</Label>
+          <select
+            id="purchase_status"
+            name="purchase_status"
+            defaultValue=""
+            className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
+          >
+            <option value="">Seleccione…</option>
+            <option value="evaluando">Evaluando opciones</option>
+            <option value="reservado">Reservado</option>
+            <option value="comprado">Comprado</option>
+          </select>
+        </div>
+      </div>
+
+      <div className="grid gap-5 sm:grid-cols-2">
+        <div>
+          <Label htmlFor="origin_location">Ubicación en EE. UU./Canadá</Label>
+          <Input id="origin_location" name="origin_location" className="mt-1.5" />
+        </div>
+        <div>
+          <Label htmlFor="destination_location">Ciudad de destino</Label>
+          <Input id="destination_location" name="destination_location" className="mt-1.5" />
+        </div>
+      </div>
+
+      <div>
+        <Label htmlFor="listing_url">Link del equipo o factura proforma</Label>
+        <Input id="listing_url" name="listing_url" className="mt-1.5" />
+      </div>
+
+      <div>
+        <Label htmlFor="message">Detalles adicionales</Label>
+        <Textarea id="message" name="message" rows={4} className="mt-1.5 resize-y" />
+      </div>
+
+      <label htmlFor="consent" className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
+        <input
+          type="checkbox"
+          id="consent"
+          name="consent"
+          required
+          aria-describedby="ps-form-error"
+          className="mt-1 h-4 w-4 rounded border-input"
+        />
+        <span>{caveat}</span>
+      </label>
+
+      <Button
+        type="submit"
+        disabled={isSubmitting}
+        size="lg"
+        className="w-full rounded-xl bg-primary py-5 text-base font-semibold text-white shadow-lg transition-[background-color,box-shadow] hover:bg-primary/90 hover:shadow-xl"
+      >
+        {isSubmitting ? (
+          <>
+            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
+            Enviando…
+          </>
+        ) : (
+          <>
+            <Send className="mr-2 h-5 w-5" />
+            Solicitar cotización
+          </>
+        )}
+      </Button>
+
+      {error && (
+        <p id="ps-form-error" role="alert" className="mt-2 text-center text-sm text-red-600">
+          {error}
+        </p>
+      )}
+    </form>
+  );
+}
diff --git a/components/destinations/paid-search-whatsapp-button.tsx b/components/destinations/paid-search-whatsapp-button.tsx
new file mode 100644
index 0000000..965ce92
--- /dev/null
+++ b/components/destinations/paid-search-whatsapp-button.tsx
@@ -0,0 +1,89 @@
+"use client";
+
+import { useState } from "react";
+import { MessageCircle } from "lucide-react";
+import { Button } from "@/components/ui/button";
+import { createWhatsAppRef } from "@/app/actions/whatsapp-ref";
+import { buildWhatsAppUrl, interpolateWhatsAppRef } from "@/lib/whatsapp-prefill";
+import { trackContactClick } from "@/lib/tracking";
+import { CONTACT } from "@/lib/constants";
+
+interface PaidSearchWhatsAppButtonProps {
+  routeKey: string;
+  /** Prefill template containing the {{whatsapp_ref}} placeholder. */
+  prefillTemplate: string;
+  location: string;
+  label: string;
+  className?: string;
+}
+
+interface StoredAttr {
+  attribution_id?: string;
+  first_touch?: Record<string, string | undefined>;
+  latest_touch?: Record<string, string | undefined>;
+}
+
+function readAttr(routeKey: string): StoredAttr | null {
+  try {
+    return JSON.parse(sessionStorage.getItem(`ps_attr_${routeKey}`) || "null");
+  } catch {
+    return null;
+  }
+}
+
+export function PaidSearchWhatsAppButton({
+  routeKey,
+  prefillTemplate,
+  location,
+  label,
+  className,
+}: PaidSearchWhatsAppButtonProps) {
+  const [busy, setBusy] = useState(false);
+
+  async function handleClick() {
+    setBusy(true);
+    let ref: string | undefined;
+    const cacheKey = `ps_ref_${routeKey}`;
+    try {
+      ref = sessionStorage.getItem(cacheKey) || undefined;
+    } catch {
+      /* sessionStorage blocked */
+    }
+    if (!ref) {
+      try {
+        const attr = readAttr(routeKey);
+        const result = await createWhatsAppRef({
+          routeKey,
+          attribution_id: attr?.attribution_id || "",
+          first_touch: attr?.first_touch,
+          latest_touch: attr?.latest_touch,
+        });
+        if (result.success && result.whatsapp_ref) {
+          ref = result.whatsapp_ref;
+          try {
+            sessionStorage.setItem(cacheKey, ref);
+          } catch {
+            /* cache best-effort */
+          }
+        }
+      } catch {
+        /* fall back to a ref-less prefill — never block the WhatsApp open */
+      }
+    }
+    const text = interpolateWhatsAppRef(prefillTemplate, ref);
+    try {
+      trackContactClick("whatsapp", location);
+    } catch {
+      /* analytics best-effort */
+    }
+    window.open(buildWhatsAppUrl(CONTACT.phoneRaw, text), "_blank", "noopener,noreferrer");
+    setBusy(false);
+  }
+
+  return (
+    <Button type="button" onClick={handleClick} disabled={busy} size="lg" className={className} aria-label={label}>
+      <MessageCircle className="mr-2 h-4 w-4" />
+      {label}
+    </Button>
+  );
+}
diff --git a/content/argentina-market.ts b/content/argentina-market.ts
index 2d1507c..ccc1163 100644
--- a/content/argentina-market.ts
+++ b/content/argentina-market.ts
@@ -169,7 +169,7 @@ export const argentinaMarketPage: ArgentinaMarketPageContent = {
       },
       {
         label: "AFIDI y evaluación de importaciones",
-        href: "https://www.argentina.gob.ar/servicio/solicitar-autorizacion-fitosanitaria-de-importacion-afidi-y-evaluacion-de-importaciones",
+        href: "https://www.argentina.gob.ar/servicio/gestionar-la-autorizacion-fitosanitaria-de-importacion-afidi-y-la-evaluacion-de",
       },
       {
         label: "Control SENASA sobre maquinaria usada",
diff --git a/content/destinations.ts b/content/destinations.ts
index 90cbc8b..a065982 100644
--- a/content/destinations.ts
+++ b/content/destinations.ts
@@ -564,7 +564,7 @@ const destinationsEs: Destination[] = [
     shippingNotes: "Chile tiene procedimientos aduaneros simplificados y tratados de libre comercio con EE.UU. La mayoría del equipo agrícola ingresa libre de aranceles o con tarifas reducidas bajo el TLC EE.UU.-Chile. Se requiere embalaje de madera certificado ISPM-15. Preparamos documentación bilingüe y coordinamos con agentes aduanales chilenos. Flete aéreo disponible para repuestos urgentes con entrega en 7-14 días.",
     containerOptions: ["40ft High-Cube", "Flat Rack", "Open Top", "20ft Estándar"],
     faqs: [
-      { question: "¿Chile tiene importación libre de aranceles para equipo de EE.UU.?", answer: "Muchas categorías de equipo ingresan a Chile libres de aranceles o con tarifas reducidas bajo el Tratado de Libre Comercio EE.UU.-Chile. Identificamos los códigos arancelarios aplicables y preparamos certificados de origen del TLC para minimizar sus costos de importación.", category: "Chile" },
+      { question: "¿Chile tiene importación libre de aranceles para equipo de EE.UU.?", answer: "Muchas categorías de equipo ingresan a Chile libres de aranceles o con tarifas reducidas bajo el Tratado de Libre Comercio EE.UU.-Chile. Identificamos los códigos arancelarios aplicables y preparamos certificados de origen del TLC para minimizar sus costos de importación. El arancel final depende de la clasificación NCM de cada unidad y lo confirma su despachante; los requisitos de ingreso, incluida la inspección fitosanitaria del SAG, se gestionan por separado.", category: "Chile" },
       { question: "¿Cuánto tarda el envío a Chile?", answer: "El tránsito marítimo desde puertos del Golfo y Costa Este de EE.UU. a San Antonio promedia 25-32 días vía el Canal de Panamá. El plazo total puerta a puerto es típicamente de 35-45 días incluyendo recolección, embalaje y documentación.", category: "Chile" },
       { question: "¿Qué equipo se envía comúnmente a Chile?", answer: "Cosechadoras, tractores, sembradoras, pulverizadoras y cabezales tienen alta demanda para el sector agrícola de Chile. El valle central y las regiones sureñas son grandes productores de granos y frutas.", category: "Chile" },
     ],
diff --git a/content/latam-paid-search-copy.ts b/content/latam-paid-search-copy.ts
new file mode 100644
index 0000000..abb5021
--- /dev/null
+++ b/content/latam-paid-search-copy.ts
@@ -0,0 +1,811 @@
+// AUTO-GENERATED P2 copy (verified LATAM Spanish). Source: workflow wf_17d2cfa9-968.
+// Claim-safety + consistency reviewed; CFIA/seoTitle/trust-line fixes applied in transform.
+// English-internal review version: docs/plans/latam-paid-search-destinations/copy-en-internal.md
+// Pending client native LATAM review before Gate B go-live.
+
+export interface PaidSearchCopy {
+  readonly seoTitle: string;
+  readonly seoDescription: string;
+  readonly eyebrow: string;
+  readonly h1: string;
+  readonly heroBody: string;
+  readonly heroBullets: readonly string[];
+  readonly scopeIncluded: readonly string[];
+  readonly scopeExcluded: readonly string[];
+  readonly processIntro: string;
+  readonly processSteps: readonly { readonly title: string; readonly body: string }[];
+  readonly quoteIntro: string;
+  readonly quoteFields: readonly string[];
+  readonly complianceHeading: string;
+  readonly complianceBody: string;
+  readonly localResponsibility: string;
+  readonly faq: readonly { readonly question: string; readonly answer: string }[];
+  readonly ctaHeading: string;
+  readonly ctaDescription: string;
+  readonly whatsappPrefill: string;
+}
+
+export const PAID_SEARCH_COPY: Record<string, PaidSearchCopy> = {
+  "argentina/importacion-maquinaria-usa": {
+    "seoTitle": "Importar maquinaria de EE. UU. a Argentina | Meridian",
+    "seoDescription": "Coordinamos retiro, embalaje, documentación y flete de maquinaria usada desde EE. UU. a Argentina. La nacionalización y los tributos los gestiona tu despachante.",
+    "eyebrow": "Maquinaria usada desde EE. UU. · Argentina",
+    "h1": "Importación de maquinaria desde EE. UU. a Argentina",
+    "heroBody": "Meridian coordina el lado estadounidense de tu importación: contacto con el vendedor, retiro, medición, desmontaje o embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo hasta el puerto acordado. La nacionalización, los aranceles, el IVA y la entrega interior en Argentina los confirma y gestiona tu despachante. Coordiná con nosotros el tramo de EE. UU. a Argentina y revisá con tu despachante la admisibilidad de cada unidad antes de comprar o embarcar.",
+    "heroBullets": [
+      "Retiro y transporte de la maquinaria dentro de EE. UU. y Canadá.",
+      "Medición, desmontaje o embalaje y carga en origen según el equipo.",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA).",
+      "Reserva de flete marítimo: contenedor, flat rack o RoRo según la unidad."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y retiro en EE. UU./Canadá",
+      "Medición, desmontaje y embalaje cuando corresponde",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
+      "Reserva del flete marítimo al puerto acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, aranceles, IVA y tributos en Argentina",
+      "Despacho aduanero y declaración jurada en el SIM (Sistema Malvina)",
+      "AFIDI (SENASA) e inspección fitosanitaria en destino",
+      "Permisos del importador y entrega interior en Argentina"
+    ],
+    "processIntro": "La ruta se define a partir de tu equipo real, no de una tarifa genérica. Primero confirmamos la información técnica y el alcance del lado de EE. UU.; después reservás. La parte argentina la coordinás en paralelo con tu despachante.",
+    "processSteps": [
+      {
+        "title": "Compartí la maquinaria",
+        "body": "Enviá el anuncio o la factura proforma, con marca, modelo, año, ubicación en EE. UU. y estado de compra de la unidad usada."
+      },
+      {
+        "title": "Definimos medidas y modalidad",
+        "body": "Revisamos dimensiones, peso y si requiere desmontaje, y elegimos contenedor, flat rack o RoRo. Conviene limpiar la unidad y dejarla libre de suelo y restos vegetales antes de embarcar."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
+      },
+      {
+        "title": "Entregamos el expediente para destino",
+        "body": "Te pasamos los documentos del tramo internacional para que tu despachante arme la declaración jurada en el SIM y gestione la nacionalización en Argentina."
+      }
+    ],
+    "quoteIntro": "Con estos datos definimos el tramo internacional sin inventar medidas, ruta ni formato de carga. Mientras tanto, validá la admisibilidad de la unidad con tu despachante.",
+    "quoteFields": [
+      "Link del equipo o factura proforma",
+      "Marca, modelo y año de la maquinaria",
+      "Ubicación exacta en EE. UU. o Canadá",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Dimensiones y peso disponibles",
+      "Ciudad de destino en Argentina y fecha estimada",
+      "Contacto de tu despachante, si ya lo tenés"
+    ],
+    "complianceHeading": "Qué cambió en Argentina y qué tenés que validar antes de embarcar",
+    "complianceBody": "El Decreto 273/2025, vigente desde el 17/04/2025, eliminó el CIBU como requisito previo y lo reemplazó por una declaración jurada que tu despachante presenta en el Sistema Informático Malvina (SIM). Esto no eliminó los controles fitosanitarios, ambientales ni de seguridad: según la clasificación, condición y uso, la maquinaria agrícola usada puede requerir la Autorización Fitosanitaria de Importación (AFIDI) de SENASA, que se gestiona por SIGPV-IMPO antes de la transacción. SENASA inspecciona en puerto, por lo que el equipo debe llegar limpio, libre de suelo y restos vegetales. Meridian no gestiona AFIDI, el SIM ni la nacionalización.",
+    "localResponsibility": "Meridian coordina el tramo contratado desde origen; la admisibilidad, la AFIDI y la nacionalización en Argentina quedan bajo responsabilidad de tu importador y su despachante.",
+    "faq": [
+      {
+        "question": "¿Meridian vende la maquinaria o la nacionaliza en Argentina?",
+        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. Coordinamos con tu vendedor o brindamos compra asistida bajo un alcance separado, pero la nacionalización, los tributos y el despacho aduanero los gestiona tu despachante en Argentina."
+      },
+      {
+        "question": "¿Con el Decreto 273/2025 ya no hay requisitos para importar usados?",
+        "answer": "No es así. El decreto reemplazó el CIBU por una declaración jurada en el SIM que arma tu despachante, pero siguen vigentes los controles fitosanitarios, ambientales y de seguridad. Según el equipo, puede requerirse la AFIDI de SENASA. Validá cada caso con tu despachante antes de comprar o embarcar."
+      },
+      {
+        "question": "¿Pueden darme el costo final nacionalizado?",
+        "answer": "Cotizamos el alcance internacional que controlamos desde EE. UU. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Tu despachante calcula aranceles, IVA, tasas e inspecciones según la clasificación real de la unidad."
+      },
+      {
+        "question": "¿La maquinaria tiene que llegar limpia?",
+        "answer": "Sí. SENASA inspecciona en puerto y exige equipos limpios, libres de suelo y restos vegetales. Preparamos la unidad para el embarque, pero la inspección fitosanitaria en destino la realiza SENASA y la coordina tu despachante."
+      }
+    ],
+    "ctaHeading": "Cotizá tu importación de maquinaria desde EE. UU. a Argentina",
+    "ctaDescription": "Compartí el equipo y el destino; te devolvemos por escrito el alcance del tramo internacional antes de reservar.",
+    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar la importación de maquinaria desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Argentina]. Ref: {{whatsapp_ref}}"
+  },
+  "argentina/flete-cosechadoras-usa": {
+    "seoTitle": "Flete de cosechadoras de EE. UU. a Argentina | Meridian",
+    "seoDescription": "Coordinamos retiro, desarme, embalaje, documentación y flete de cosechadoras usadas desde EE. UU. a Argentina. La nacionalización la gestiona tu despachante.",
+    "eyebrow": "Cosechadoras desde EE. UU. · Argentina",
+    "h1": "Flete de cosechadoras desde EE. UU. a Argentina",
+    "heroBody": "Meridian coordina el tramo estadounidense de tu cosechadora: contacto con el vendedor, retiro, medición, desarme de plataforma y cabezal cuando corresponde, embalaje, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo hasta el puerto acordado. La nacionalización, los aranceles, el IVA y la entrega interior en Argentina los confirma y gestiona tu despachante. Coordiná con nosotros el flete de EE. UU. a Argentina y revisá la admisibilidad de la unidad con tu despachante antes de comprar o embarcar.",
+    "heroBullets": [
+      "Retiro de la cosechadora en EE. UU. o Canadá y transporte a puerto.",
+      "Desarme de cabezal o plataforma, medición y embalaje cuando corresponde.",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA).",
+      "Reserva de flete marítimo en flat rack o RoRo según las dimensiones."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y retiro de la cosechadora en EE. UU./Canadá",
+      "Desarme, medición y embalaje del cabezal o plataforma cuando corresponde",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
+      "Reserva del flete marítimo al puerto acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, aranceles, IVA y tributos en Argentina",
+      "Despacho aduanero y declaración jurada en el SIM (Sistema Malvina)",
+      "AFIDI (SENASA) e inspección fitosanitaria en destino",
+      "Permisos del importador y entrega interior hasta el campo"
+    ],
+    "processIntro": "La ruta de tu cosechadora se define por sus dimensiones reales, no por una tarifa genérica. Primero confirmamos las medidas, el desarme y el alcance del lado de EE. UU.; después reservás. La parte argentina la coordinás en paralelo con tu despachante.",
+    "processSteps": [
+      {
+        "title": "Compartí la cosechadora",
+        "body": "Enviá el anuncio o la factura proforma, con marca, modelo, año, ancho del cabezal, ubicación en EE. UU. y estado de compra."
+      },
+      {
+        "title": "Definimos desarme y modalidad",
+        "body": "Revisamos dimensiones y peso, definimos el desarme de cabezal o plataforma y elegimos flat rack o RoRo. La unidad debe quedar limpia, libre de suelo y restos vegetales antes de embarcar."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, desarme, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
+      },
+      {
+        "title": "Entregamos el expediente para destino",
+        "body": "Te pasamos los documentos del tramo internacional para que tu despachante arme la declaración jurada en el SIM y gestione la nacionalización en Argentina."
+      }
+    ],
+    "quoteIntro": "Con estos datos definimos el flete internacional de tu cosechadora sin inventar medidas, ruta ni formato de carga. Mientras tanto, validá la admisibilidad de la unidad con tu despachante.",
+    "quoteFields": [
+      "Link del equipo o factura proforma",
+      "Marca, modelo y año de la cosechadora",
+      "Ancho del cabezal o plataforma y peso disponible",
+      "Ubicación exacta en EE. UU. o Canadá",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Ciudad de destino en Argentina y fecha estimada",
+      "Contacto de tu despachante, si ya lo tenés"
+    ],
+    "complianceHeading": "Qué cambió en Argentina y qué tenés que validar antes de embarcar tu cosechadora",
+    "complianceBody": "El Decreto 273/2025, vigente desde el 17/04/2025, eliminó el CIBU como requisito previo y lo reemplazó por una declaración jurada que tu despachante presenta en el Sistema Informático Malvina (SIM). Esto no eliminó los controles fitosanitarios, ambientales ni de seguridad: por tratarse de maquinaria agrícola usada, la cosechadora puede requerir la Autorización Fitosanitaria de Importación (AFIDI) de SENASA, que se gestiona por SIGPV-IMPO antes de la transacción. SENASA inspecciona en puerto, así que la unidad debe llegar limpia, libre de suelo y restos vegetales. Meridian no gestiona AFIDI, el SIM ni la nacionalización.",
+    "localResponsibility": "Meridian coordina el flete de tu cosechadora desde origen; la admisibilidad, la AFIDI y la nacionalización en Argentina quedan bajo responsabilidad de tu importador y su despachante.",
+    "faq": [
+      {
+        "question": "¿Meridian desarma la cosechadora para embarcarla?",
+        "answer": "Sí, cuando corresponde. Coordinamos el desarme de cabezal o plataforma, la medición y el embalaje en origen para que la cosechadora viaje segura en flat rack o RoRo. El armado final en Argentina queda fuera de nuestro alcance del lado de EE. UU."
+      },
+      {
+        "question": "¿La cosechadora necesita AFIDI de SENASA?",
+        "answer": "Puede requerirla. Por ser maquinaria agrícola usada, según la clasificación y el uso puede necesitar la AFIDI, que se gestiona por SIGPV-IMPO antes de la transacción. Confirmá cada caso con tu despachante: Meridian no gestiona la AFIDI."
+      },
+      {
+        "question": "¿Pueden darme el costo final puesto en Argentina?",
+        "answer": "Cotizamos el flete internacional que controlamos desde EE. UU. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Tu despachante calcula aranceles, IVA, tasas e inspecciones según la clasificación real de la cosechadora."
+      },
+      {
+        "question": "¿Por qué la cosechadora tiene que llegar limpia?",
+        "answer": "SENASA inspecciona en puerto y exige equipos limpios, libres de suelo y restos vegetales para prevenir el ingreso de plagas. Preparamos la unidad en origen, pero la inspección fitosanitaria en destino la realiza SENASA y la coordina tu despachante."
+      }
+    ],
+    "ctaHeading": "Cotizá el flete de tu cosechadora desde EE. UU. a Argentina",
+    "ctaDescription": "Compartí la cosechadora y el destino; te devolvemos por escrito el alcance del tramo internacional antes de reservar.",
+    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar el flete de una cosechadora desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Argentina]. Ref: {{whatsapp_ref}}"
+  },
+  "bolivia/importacion-maquinaria-usa": {
+    "seoTitle": "Importar maquinaria de EE. UU. a Bolivia | Meridian",
+    "seoDescription": "Coordinamos el tramo de EE. UU.: retiro, embalaje, documentos de exportación y flete de maquinaria usada a Bolivia. La nacionalización la maneja su despachante.",
+    "eyebrow": "Maquinaria usada desde EE. UU. · Bolivia",
+    "h1": "Importación de maquinaria desde EE. UU. a Bolivia",
+    "heroBody": "Meridian coordina la parte de EE. UU. y Canadá de su importación de maquinaria usada a Bolivia: contacto con el vendedor o compra asistida, retiro, medición, embalaje o desmontaje cuando corresponde, documentación de exportación y reserva del flete marítimo. La nacionalización, los aranceles, el IVA y el despacho aduanero en Bolivia los gestiona por separado su despachante e importador. Le entregamos el expediente del tramo internacional para que su profesional local lo presente ante la Aduana Nacional.",
+    "heroBullets": [
+      "Origen en EE. UU./Canadá: retiro, medición, embalaje y carga.",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA) cuando corresponde.",
+      "Reserva de flete marítimo; puerto y ruta los confirma su despachante.",
+      "Cotización del tramo internacional separada de aranceles, IVA y costos locales."
+    ],
+    "scopeIncluded": [
+      "Compra asistida o coordinación con el vendedor en EE. UU./Canadá",
+      "Retiro, medición, embalaje y desmontaje cuando corresponde",
+      "Documentación de exportación y certificado fitosanitario de origen",
+      "Reserva del flete marítimo hasta el puerto acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, aranceles, IVA y tributos en Bolivia",
+      "Despacho aduanero y registro de importador ante la Aduana Nacional",
+      "Inspección o autorización fitosanitaria de SENASAG en destino",
+      "Tránsito por puerto del Pacífico y entrega interior en Bolivia"
+    ],
+    "processIntro": "La ruta se arma con la unidad real y su alcance, no con una tarifa genérica. Primero confirmamos datos técnicos y formato de carga; recién después se reserva.",
+    "processSteps": [
+      {
+        "title": "Comparta la maquinaria",
+        "body": "Envíe el anuncio o proforma, marca, modelo, año, ubicación en EE. UU. o Canadá y estado de compra de la maquinaria usada."
+      },
+      {
+        "title": "Definimos medidas y modalidad",
+        "body": "Revisamos dimensiones, peso y si requiere desmontaje, contenedor, flat rack, RoRo o carga de proyecto."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, embalaje, carga, documentos de exportación y el certificado fitosanitario de origen cuando aplica al equipo."
+      },
+      {
+        "title": "Entregamos el expediente para Bolivia",
+        "body": "Le compartimos los documentos del tramo internacional para que su despachante gestione el registro de importador y la declaración ante la Aduana Nacional."
+      }
+    ],
+    "quoteIntro": "Con estos datos definimos el tramo internacional sin inventar medidas, ruta ni formato de carga. El resto lo confirma su despachante en Bolivia.",
+    "quoteFields": [
+      "Link del anuncio o factura proforma",
+      "Marca, modelo y año de la maquinaria",
+      "Ubicación exacta en EE. UU. o Canadá",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Dimensiones y peso disponibles",
+      "Ciudad de destino en Bolivia y fecha estimada",
+      "Datos de su despachante o importador, si ya lo tiene"
+    ],
+    "complianceHeading": "Qué confirmar en Bolivia antes de comprar o embarcar",
+    "complianceBody": "Los requisitos dependen de la subpartida, el origen y la condición de la unidad. SENASAG puede aplicar una inspección o autorización fitosanitaria —para maquinaria usada suele ser una verificación de limpieza, no necesariamente un permiso de productos vegetales—; su despachante lo confirma según el caso. La Aduana Nacional y su despachante manejan el registro de importador y la declaración de importación. No dé por sentadas franquicias de IVA ni límites de antigüedad: los incentivos de la Ley 1613/2025 y el tope de 10 años vencieron el 31 de diciembre de 2025, así que su importador debe confirmar el régimen tributario vigente para 2026. Tampoco prometemos tránsito garantizado por Arica, almacenaje gratuito ni una ruta interior fija: esos puntos los define su despachante con la naviera y el agente de tránsito.",
+    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU./Canadá; la admisibilidad y la nacionalización en Bolivia quedan bajo responsabilidad del importador y su despachante.",
+    "faq": [
+      {
+        "question": "¿Meridian vende la maquinaria o la nacionaliza en Bolivia?",
+        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero la nacionalización, los tributos y el despacho en Bolivia los gestiona su despachante."
+      },
+      {
+        "question": "¿Pueden darme el costo final puesto en Bolivia?",
+        "answer": "Cotizamos el tramo internacional que controlamos. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Aranceles, IVA, despacho y entrega interior los calcula su despachante según la clasificación real de la unidad."
+      },
+      {
+        "question": "¿Necesito permiso de SENASAG para maquinaria usada?",
+        "answer": "Puede aplicar. SENASAG decide según la subpartida, el origen y la condición del equipo; para maquinaria usada suele ser una inspección o verificación de limpieza más que un permiso de productos vegetales. Su despachante lo confirma antes del embarque, y nosotros emitimos el certificado fitosanitario de origen cuando corresponde."
+      },
+      {
+        "question": "¿Sigue vigente la exoneración de IVA y el límite de 10 años de 2025?",
+        "answer": "No. Los incentivos de la Ley 1613/2025 y el límite de antigüedad de 10 años expiraron el 31 de diciembre de 2025. Para 2026, su importador debe confirmar con la Aduana Nacional el régimen tributario que aplica a su unidad antes de comprar."
+      },
+      {
+        "question": "¿A qué puerto llega y cómo continúa hasta Bolivia?",
+        "answer": "El puerto se define según la naviera, el formato de carga y el plan de su despachante. Como Bolivia no tiene litoral, el ingreso suele ser por un puerto del Pacífico con tránsito posterior por tierra, pero no garantizamos un puerto único, tránsito por Arica ni una ruta interior fija: eso lo coordina su despachante."
+      }
+    ],
+    "ctaHeading": "Cotice su importación de maquinaria desde EE. UU. a Bolivia",
+    "ctaDescription": "Comparta la unidad y el destino; le devolvemos por escrito el alcance del tramo internacional antes de reservar. La parte aduanera la confirma su despachante.",
+    "whatsappPrefill": "#FRT_ES Hola, quiero importar maquinaria usada desde EE. UU. a Bolivia. Equipo: [marca/modelo/año]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Bolivia]. Ref: {{whatsapp_ref}}"
+  },
+  "bolivia/flete-equipo-pesado-usa": {
+    "seoTitle": "Flete de equipo pesado de EE. UU. a Bolivia | Meridian",
+    "seoDescription": "Coordinamos el flete de equipo pesado desde EE. UU.: retiro, medición, flat rack o carga de proyecto, documentos y reserva marítima a Bolivia. Aduana, su despachante.",
+    "eyebrow": "Equipo pesado desde EE. UU. · Bolivia",
+    "h1": "Flete de equipo pesado desde EE. UU. a Bolivia",
+    "heroBody": "Meridian coordina el flete de equipo pesado desde EE. UU. y Canadá hacia Bolivia: retiro en sitio, medición, desmontaje y embalaje cuando corresponde, documentación de exportación y reserva del flete marítimo en flat rack, RoRo o carga de proyecto según las dimensiones. La nacionalización, los aranceles, el IVA y el despacho aduanero en Bolivia los gestiona por separado su despachante e importador. Trabajamos el tramo internacional; el ingreso a destino lo confirma su profesional local.",
+    "heroBullets": [
+      "Retiro y medición de equipo pesado fuera de norma en EE. UU./Canadá.",
+      "Flat rack, RoRo o carga de proyecto según peso y dimensiones reales.",
+      "Documentos de exportación y certificado fitosanitario de origen cuando corresponde.",
+      "Reserva marítima cotizada aparte de aranceles, IVA y costos locales."
+    ],
+    "scopeIncluded": [
+      "Retiro, medición y manejo de carga sobredimensionada en EE. UU./Canadá",
+      "Desmontaje y embalaje cuando corresponde al equipo",
+      "Documentación de exportación y certificado fitosanitario de origen",
+      "Reserva del flete marítimo en flat rack, RoRo o carga de proyecto"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, aranceles, IVA y tributos en Bolivia",
+      "Despacho aduanero y registro de importador ante la Aduana Nacional",
+      "Inspección o autorización fitosanitaria de SENASAG en destino",
+      "Tránsito por puerto del Pacífico y transporte interior pesado en Bolivia"
+    ],
+    "processIntro": "Para equipo pesado, las medidas reales mandan. Primero confirmamos peso, dimensiones y formato de carga; recién después se reserva la naviera.",
+    "processSteps": [
+      {
+        "title": "Comparta el equipo pesado",
+        "body": "Envíe marca, modelo, año, peso, dimensiones, ubicación en EE. UU. o Canadá y estado de compra del equipo."
+      },
+      {
+        "title": "Definimos modalidad sobredimensionada",
+        "body": "Evaluamos si va en flat rack, RoRo o carga de proyecto, y si requiere desmontaje o permisos de transporte en origen."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, manejo especializado, carga, documentos de exportación y el certificado fitosanitario de origen cuando aplica."
+      },
+      {
+        "title": "Entregamos el expediente para Bolivia",
+        "body": "Le compartimos los documentos del tramo internacional para que su despachante gestione el ingreso y la declaración ante la Aduana Nacional."
+      }
+    ],
+    "quoteIntro": "Con peso, dimensiones y ubicación definimos el formato de carga y el tramo internacional sin suposiciones. La parte de destino la confirma su despachante en Bolivia.",
+    "quoteFields": [
+      "Link del anuncio o factura proforma",
+      "Marca, modelo y año del equipo pesado",
+      "Peso y dimensiones (largo, ancho, alto)",
+      "Ubicación exacta en EE. UU. o Canadá",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Ciudad de destino en Bolivia y fecha estimada",
+      "Datos de su despachante o importador, si ya lo tiene"
+    ],
+    "complianceHeading": "Qué confirmar en Bolivia antes de embarcar equipo pesado",
+    "complianceBody": "Los requisitos dependen de la subpartida, el origen y la condición del equipo. SENASAG puede aplicar una inspección o autorización —para equipo pesado usado suele ser una verificación de limpieza, no necesariamente un permiso de productos vegetales—; su despachante lo confirma según el caso. La Aduana Nacional y su despachante manejan el registro de importador y la declaración de importación. No dé por sentadas franquicias de IVA ni límites de antigüedad: los incentivos de la Ley 1613/2025 y el tope de 10 años vencieron el 31 de diciembre de 2025, por lo que su importador debe confirmar el régimen tributario vigente para 2026. Tampoco prometemos tránsito garantizado por Arica, período de almacenaje gratuito ni una ruta interior fija: la carga sobredimensionada exige que su despachante coordine puerto, agente de tránsito y transporte pesado interior caso por caso.",
+    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU./Canadá; la admisibilidad y la nacionalización del equipo pesado en Bolivia quedan bajo responsabilidad del importador y su despachante.",
+    "faq": [
+      {
+        "question": "¿Meridian nacionaliza o entrega el equipo pesado en Bolivia?",
+        "answer": "No. Meridian coordina el tramo de origen y exportación desde EE. UU. y Canadá: retiro, manejo especializado, documentos de exportación y reserva marítima. La nacionalización, el despacho aduanero y el transporte interior pesado en Bolivia los gestiona su despachante e importador."
+      },
+      {
+        "question": "¿Cómo se decide entre flat rack, RoRo o carga de proyecto?",
+        "answer": "Según el peso, las dimensiones y si el equipo es autopropulsado o requiere desmontaje. Por eso pedimos medidas reales desde el primer mensaje: no cotizamos un formato de carga sobre suposiciones."
+      },
+      {
+        "question": "¿Pueden darme el costo final puesto en Bolivia?",
+        "answer": "Cotizamos el tramo internacional que controlamos. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado. Aranceles, IVA, despacho y transporte interior pesado los calcula su despachante según la clasificación real del equipo."
+      },
+      {
+        "question": "¿A qué puerto llega y cómo continúa hasta Bolivia?",
+        "answer": "El puerto y la ruta los define su despachante con la naviera y el agente de tránsito. Como Bolivia no tiene litoral, el ingreso suele ser por un puerto del Pacífico con tránsito por tierra, pero no garantizamos un puerto único, tránsito por Arica ni una ruta interior fija; con carga sobredimensionada esa coordinación es caso por caso."
+      }
+    ],
+    "ctaHeading": "Cotice el flete de su equipo pesado desde EE. UU. a Bolivia",
+    "ctaDescription": "Comparta peso, dimensiones y destino; le devolvemos por escrito el formato de carga y el alcance del tramo internacional antes de reservar. El despacho lo confirma su despachante.",
+    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar el flete de equipo pesado desde EE. UU. a Bolivia. Equipo: [marca/modelo/año]. Peso/medidas: [peso/dimensiones]. Ubicación en EE. UU.: [ciudad/estado]. Destino: [ciudad de Bolivia]. Ref: {{whatsapp_ref}}"
+  },
+  "paraguay/importacion-maquinaria-usa": {
+    "seoTitle": "Importar maquinaria de EE. UU. a Paraguay | Meridian",
+    "seoDescription": "Coordinamos compra, retiro, embalaje, certificado fitosanitario de origen y flete de maquinaria usada de EE. UU. a Paraguay. La nacionalización la confirma su despachante.",
+    "eyebrow": "Importación de maquinaria EE. UU. → Paraguay",
+    "h1": "Importación de maquinaria agrícola usada de EE. UU. a Paraguay",
+    "heroBody": "Meridian coordina el tramo en origen para importar su maquinaria desde EE. UU. y Canadá hacia Paraguay: compra asistida, retiro, medición, desmontaje y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo. La nacionalización, los tributos y la admisibilidad final en Paraguay las confirma su despachante en destino. La Ley 7565/2025 introduce medidas fitosanitarias y de mitigación de riesgo para maquinaria usada; una de sus disposiciones fija una antigüedad máxima de 5 años, pero la admisibilidad final la determinan SENAVE/MIC/DNIT vía su despachante, no la edad.",
+    "heroBullets": [
+      "Tramo en origen completo: compra asistida, retiro en EE. UU./Canadá, embalaje y reserva de flete marítimo.",
+      "Certificado fitosanitario de origen (USDA APHIS o CFIA) emitido antes del embarque.",
+      "Filtro inicial bajo la Ley 7565/2025: revisamos antigüedad y estado antes de comprometer fondos.",
+      "Nacionalización, aranceles, IVA y despacho aduanero en Paraguay quedan a cargo de su despachante."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y coordinación con vendedor en EE. UU. o Canadá (subasta, concesionario o privado).",
+      "Retiro en origen, medición, desmontaje y embalaje cuando corresponde, etiquetado y carga.",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA para EE. UU., CFIA para Canadá).",
+      "Reserva de flete marítimo hacia el puerto de transbordo y coordinación del tramo logístico."
+    ],
+    "scopeExcluded": [
+      "Nacionalización, despacho aduanero, aranceles, IVA y tributos en Paraguay (DNIT).",
+      "Inscripción en el Registro de Importadores y Licencia Previa de Importación ante el MIC.",
+      "Inspección fitosanitaria final en destino y determinación de admisibilidad por SENAVE.",
+      "Tasa de conservación de la biodiversidad, tasas portuarias, permisos y entrega interior."
+    ],
+    "processIntro": "El orden importa: primero filtramos la unidad por la ley y por su estado, después armamos ruta, alcance y documentación. Así separamos desde el inicio el tramo que Meridian coordina del costo que confirma su despachante en Paraguay.",
+    "processSteps": [
+      {
+        "title": "1. Filtro inicial de la unidad",
+        "body": "Revisamos año de fabricación, horas, condición visible, vendedor y ubicación frente a la Ley 7565/2025. Si la unidad supera los 5 años o presenta señales que comprometen su ingreso, lo decimos antes de avanzar. La admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad."
+      },
+      {
+        "title": "2. Mapa de responsabilidades",
+        "body": "Listamos qué confirma su despachante en destino: DNIT (aduana y tributos), SENAVE (fitosanitario en destino), MIC (registro de importadores y licencia previa) y la tasa de conservación de la biodiversidad prevista en la ley."
+      },
+      {
+        "title": "3. Coordinación del tramo en origen",
+        "body": "Compra asistida, retiro, medición, desmontaje y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo."
+      },
+      {
+        "title": "4. Cotización con alcance separado",
+        "body": "Entregamos un presupuesto que separa el tramo de Meridian del despacho local. La calculadora es referencia del tramo logístico, no el costo nacionalizado final. Sin esa separación no hay comparación honesta."
+      }
+    ],
+    "quoteIntro": "Con una ficha completa confirmamos si la unidad pasa el filtro inicial de la Ley 7565/2025 y armamos el alcance de exportación antes de comprometer fondos. Cuantos más datos envíe, más precisa es la referencia del tramo logístico.",
+    "quoteFields": [
+      "Link de subasta, concesionario o vendedor privado en EE. UU. o Canadá.",
+      "Marca, modelo, año de fabricación y horas de motor.",
+      "Ubicación de retiro en EE. UU. o Canadá con código postal.",
+      "Destino previsto en Paraguay: Asunción, Villeta u otro punto.",
+      "Fotos de limpieza interior, tren de rodaje, accesorios y placa con número de serie.",
+      "Nombre del importador o despachante en destino si ya está definido.",
+      "Fecha objetivo de embarque y si la operación incluye cabezales o accesorios."
+    ],
+    "complianceHeading": "Ley 7565/2025: marco fitosanitario y de mitigación de riesgo",
+    "complianceBody": "La Ley 7565/2025 establece medidas fitosanitarias y de mitigación de riesgo para la introducción al país de maquinaria, equipos e implementos agrícolas usados. La antigüedad máxima de 5 años es una de sus disposiciones, no el conjunto de la norma: la ley también contempla certificación, limpieza libre de suelo y restos vegetales, inspección y una tasa de conservación de la biodiversidad. Según el texto de la ley, verifique cada requisito con su despachante. No afirmamos fechas exactas de promulgación o vigencia ni montos ni fórmulas de esa tasa. En toda mención de los 5 años aplica la misma regla: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. DNIT actúa como aduana y tributos, SENAVE como autoridad fitosanitaria y MIC como registro de importadores y licencia previa.",
+    "localResponsibility": "La nacionalización, los aranceles, el IVA, el despacho aduanero, la inspección fitosanitaria en destino y la admisibilidad final son responsabilidad de su despachante o importador en Paraguay; Meridian no las promete ni las ejecuta.",
+    "faq": [
+      {
+        "question": "¿Puedo importar una unidad con más de 5 años de antigüedad?",
+        "answer": "La Ley 7565/2025 contempla una antigüedad máxima de 5 años entre sus disposiciones. Según el texto de la ley, conviene verificarlo con su despachante: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. No afirmamos que ese límite ya rija de una forma puntual antes de su reglamentación; ese punto lo confirma su despachante para la unidad concreta."
+      },
+      {
+        "question": "¿Qué cubre Meridian y qué queda para mi despachante?",
+        "answer": "Meridian coordina el tramo en origen: compra asistida, retiro en EE. UU. o Canadá, medición, desmontaje y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo. Su despachante en Paraguay maneja el registro de importadores y la licencia previa ante el MIC, la inspección fitosanitaria final de SENAVE, los tributos y el despacho ante DNIT, la tasa de conservación de la biodiversidad y la entrega interior."
+      },
+      {
+        "question": "¿La calculadora me da el costo final puesto en Paraguay?",
+        "answer": "No. La calculadora es una referencia del tramo logístico que Meridian puede coordinar, no el costo nacionalizado final. Los aranceles, el IVA, la tasa de conservación de la biodiversidad, las tasas portuarias, los honorarios del despachante y el despacho local se confirman en Paraguay con su despachante para la unidad concreta."
+      },
+      {
+        "question": "¿Cuánto tarda y por qué ruta llega a Paraguay?",
+        "answer": "Paraguay es un destino sin litoral, por lo que el tránsito suele combinar tramo oceánico hasta un puerto de transbordo (habitualmente Buenos Aires) y luego tramo fluvial por la Hidrovía hacia Asunción o Villeta. Los tiempos de tránsito y la ruta son siempre estimados, no universales: dependen de naviera, operador fluvial, condiciones de calado y coordinación de su despachante, y se confirman antes de cotizar."
+      }
+    ],
+    "ctaHeading": "¿Vio una máquina en EE. UU. para Paraguay?",
+    "ctaDescription": "Envíenos el link, el año de fabricación, las horas, la ubicación de retiro y el destino. Confirmamos si pasa el filtro inicial de la Ley 7565/2025 y separamos el tramo que coordina Meridian del costo que confirma su despachante en Paraguay.",
+    "whatsappPrefill": "#FRT_ES Importación de maquinaria de EE. UU. a Paraguay. Equipo: {{equipment}}. Retiro en: {{pickup_location}}. Destino: {{destination}}. Quiero cotizar el tramo de origen. Ref: {{whatsapp_ref}}"
+  },
+  "paraguay/flete-cosechadoras-usa": {
+    "seoTitle": "Flete de cosechadoras de EE. UU. a Paraguay | Meridian",
+    "seoDescription": "Coordinamos retiro, desmontaje, embalaje, certificado fitosanitario de origen y flete de cosechadoras usadas de EE. UU. a Paraguay. La nacionalización la confirma su despachante.",
+    "eyebrow": "Flete de cosechadoras EE. UU. → Paraguay",
+    "h1": "Flete de cosechadoras usadas de EE. UU. a Paraguay",
+    "heroBody": "Meridian coordina el tramo en origen para mover su cosechadora desde EE. UU. y Canadá hacia Paraguay: compra asistida, retiro, medición, desmontaje del cabezal y embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo. La nacionalización, los tributos y la admisibilidad final en Paraguay las confirma su despachante en destino. La Ley 7565/2025 introduce medidas fitosanitarias y de mitigación de riesgo para maquinaria usada; una de sus disposiciones fija una antigüedad máxima de 5 años, pero la admisibilidad final la determinan SENAVE/MIC/DNIT vía su despachante, no la edad.",
+    "heroBullets": [
+      "Tramo en origen completo para cosechadoras: retiro, desmontaje de cabezal, embalaje y reserva de flete marítimo.",
+      "Certificado fitosanitario de origen (USDA APHIS o CFIA) emitido antes del embarque, con limpieza libre de suelo y restos vegetales.",
+      "Filtro inicial bajo la Ley 7565/2025: revisamos antigüedad y estado de la cosechadora antes de comprometer fondos.",
+      "Nacionalización, aranceles, IVA y despacho aduanero en Paraguay quedan a cargo de su despachante."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y coordinación con vendedor de la cosechadora en EE. UU. o Canadá.",
+      "Retiro en origen, medición, desmontaje de cabezal/draper y embalaje cuando corresponde, etiquetado y carga.",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA para EE. UU., CFIA para Canadá).",
+      "Reserva de flete marítimo hacia el puerto de transbordo y coordinación del tramo logístico de la cosechadora y sus accesorios."
+    ],
+    "scopeExcluded": [
+      "Nacionalización, despacho aduanero, aranceles, IVA y tributos en Paraguay (DNIT).",
+      "Inscripción en el Registro de Importadores y Licencia Previa de Importación ante el MIC.",
+      "Inspección fitosanitaria final en destino y determinación de admisibilidad de la cosechadora por SENAVE.",
+      "Tasa de conservación de la biodiversidad, tasas portuarias, permisos y entrega interior al campo."
+    ],
+    "processIntro": "El orden importa, sobre todo en cosechadoras: primero filtramos la unidad por la ley y por su estado, después resolvemos cabezal, dimensiones, embalaje, ruta y documentación. Así separamos desde el inicio el tramo que Meridian coordina del costo que confirma su despachante en Paraguay.",
+    "processSteps": [
+      {
+        "title": "1. Filtro inicial de la cosechadora",
+        "body": "Revisamos año de fabricación, horas, estado del cabezal y la plataforma, vendedor y ubicación frente a la Ley 7565/2025. Si la unidad supera los 5 años o presenta señales que comprometen su ingreso, lo decimos antes de avanzar. La admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad."
+      },
+      {
+        "title": "2. Mapa de responsabilidades",
+        "body": "Listamos qué confirma su despachante en destino: DNIT (aduana y tributos), SENAVE (fitosanitario en destino), MIC (registro de importadores y licencia previa) y la tasa de conservación de la biodiversidad prevista en la ley."
+      },
+      {
+        "title": "3. Coordinación del tramo en origen",
+        "body": "Compra asistida, retiro, medición, desmontaje del cabezal y embalaje cuando corresponde, limpieza libre de suelo y restos vegetales, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva de flete marítimo."
+      },
+      {
+        "title": "4. Cotización con alcance separado",
+        "body": "Entregamos un presupuesto que separa el tramo de Meridian del despacho local. La calculadora es referencia del tramo logístico, no el costo nacionalizado final. Sin esa separación no hay comparación honesta."
+      }
+    ],
+    "quoteIntro": "Con una ficha completa de la cosechadora confirmamos si pasa el filtro inicial de la Ley 7565/2025 y armamos el alcance de exportación, incluyendo cabezal y accesorios, antes de comprometer fondos. Cuantos más datos envíe, más precisa es la referencia del tramo logístico.",
+    "quoteFields": [
+      "Link de subasta, concesionario o vendedor privado de la cosechadora en EE. UU. o Canadá.",
+      "Marca, modelo, año de fabricación y horas de motor y de separador.",
+      "Tipo de cabezal o draper y accesorios incluidos (monitor, GPS, kits).",
+      "Ubicación de retiro en EE. UU. o Canadá con código postal.",
+      "Destino previsto en Paraguay: Asunción, Villeta u otro punto.",
+      "Fotos de limpieza interior, tren de rodaje, cabezal y placa con número de serie.",
+      "Nombre del importador o despachante en destino si ya está definido."
+    ],
+    "complianceHeading": "Ley 7565/2025: marco fitosanitario y de mitigación de riesgo",
+    "complianceBody": "La Ley 7565/2025 establece medidas fitosanitarias y de mitigación de riesgo para la introducción al país de maquinaria, equipos e implementos agrícolas usados, incluidas las cosechadoras. La antigüedad máxima de 5 años es una de sus disposiciones, no el conjunto de la norma: la ley también contempla certificación, limpieza libre de suelo y restos vegetales —crítica en cosechadoras por el cabezal y la tolva—, inspección y una tasa de conservación de la biodiversidad. Según el texto de la ley, verifique cada requisito con su despachante. No afirmamos fechas exactas de promulgación o vigencia ni montos ni fórmulas de esa tasa. En toda mención de los 5 años aplica la misma regla: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. DNIT actúa como aduana y tributos, SENAVE como autoridad fitosanitaria y MIC como registro de importadores y licencia previa.",
+    "localResponsibility": "La nacionalización, los aranceles, el IVA, el despacho aduanero, la inspección fitosanitaria en destino y la admisibilidad final de la cosechadora son responsabilidad de su despachante o importador en Paraguay; Meridian no las promete ni las ejecuta.",
+    "faq": [
+      {
+        "question": "¿Puedo importar una cosechadora con más de 5 años de antigüedad?",
+        "answer": "La Ley 7565/2025 contempla una antigüedad máxima de 5 años entre sus disposiciones. Según el texto de la ley, conviene verificarlo con su despachante: la admisibilidad final la determina SENAVE/MIC/DNIT vía su despachante, no la edad. No afirmamos que ese límite ya rija de una forma puntual antes de su reglamentación; ese punto lo confirma su despachante para la cosechadora concreta."
+      },
+      {
+        "question": "¿Cómo manejan la limpieza y el cabezal de la cosechadora?",
+        "answer": "El marco fitosanitario de la Ley 7565/2025 exige que la unidad llegue libre de suelo, plagas y restos vegetales, algo especialmente sensible en cosechadoras por el cabezal, la tolva y el sinfín. Coordinamos limpieza, desmontaje del cabezal cuando corresponde, medición y embalaje, y emitimos el certificado fitosanitario de origen (USDA APHIS o CFIA). La inspección fitosanitaria final en destino la realiza SENAVE vía su despachante."
+      },
+      {
+        "question": "¿Qué cubre Meridian y qué queda para mi despachante?",
+        "answer": "Meridian coordina el tramo en origen: compra asistida, retiro, desmontaje del cabezal, embalaje, documentación de exportación, certificado fitosanitario de origen y reserva de flete marítimo. Su despachante en Paraguay maneja el registro de importadores y la licencia previa ante el MIC, la inspección final de SENAVE, los tributos y el despacho ante DNIT, la tasa de conservación de la biodiversidad y la entrega interior al campo."
+      },
+      {
+        "question": "¿Cuánto tarda y por qué ruta llega la cosechadora a Paraguay?",
+        "answer": "Paraguay es un destino sin litoral, por lo que el tránsito suele combinar tramo oceánico hasta un puerto de transbordo (habitualmente Buenos Aires) y luego tramo fluvial por la Hidrovía hacia Asunción o Villeta. Los tiempos de tránsito y la ruta son siempre estimados, no universales: dependen de naviera, operador fluvial, condiciones de calado y coordinación de su despachante, y se confirman antes de cotizar. La calculadora es referencia del tramo logístico, no el costo nacionalizado final."
+      }
+    ],
+    "ctaHeading": "¿Vio una cosechadora en EE. UU. para Paraguay?",
+    "ctaDescription": "Envíenos el link, el año de fabricación, las horas, el tipo de cabezal, la ubicación de retiro y el destino. Confirmamos si pasa el filtro inicial de la Ley 7565/2025 y separamos el tramo que coordina Meridian del costo que confirma su despachante en Paraguay.",
+    "whatsappPrefill": "#FRT_ES Flete de cosechadora de EE. UU. a Paraguay. Equipo: {{equipment}}. Retiro en: {{pickup_location}}. Destino: {{destination}}. Quiero cotizar el tramo de origen. Ref: {{whatsapp_ref}}"
+  },
+  "chile/importacion-maquinaria-usa": {
+    "seoTitle": "Importar maquinaria de EE. UU. a Chile | Meridian",
+    "seoDescription": "Coordinamos el tramo de EE. UU. a Chile: retiro, embalaje, documentación de exportación y flete marítimo de maquinaria usada. La nacionalización la gestiona su despachante.",
+    "eyebrow": "Importación de maquinaria desde EE. UU. · Chile",
+    "h1": "Importación de maquinaria desde EE. UU. a Chile",
+    "heroBody": "Meridian coordina el tramo de origen para su importación de maquinaria desde EE. UU. y Canadá a Chile: contacto con el vendedor, retiro, medición, desmontaje o embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo. La nacionalización, los aranceles, el IVA, el despacho aduanero y la entrega interior en Chile los gestiona por separado su despachante o importador. Le entregamos el alcance del tramo internacional por escrito antes de reservar.",
+    "heroBullets": [
+      "Operación coordinada del lado de EE. UU. y Canadá, con compra asistida bajo alcance separado.",
+      "Retiro, medición, desmontaje y embalaje en origen según el equipo.",
+      "Certificado fitosanitario de origen (USDA APHIS o CFIA) y documentación de exportación.",
+      "Cotización del flete marítimo separada de los costos locales chilenos."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y retiro del equipo en EE. UU. o Canadá",
+      "Medición, desmontaje y embalaje cuando corresponde",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
+      "Reserva del flete marítimo hasta el puerto chileno acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, aranceles, IVA y tributos en Chile",
+      "Despacho aduanero y permisos a cargo del importador",
+      "Inspección fitosanitaria del SAG al ingreso en Chile",
+      "Entrega interior dentro de Chile"
+    ],
+    "processIntro": "La ruta se arma a partir del equipo real, no de una tarifa genérica. Primero confirmamos la información técnica y el alcance del tramo de EE. UU. a Chile; luego reservamos. La elegibilidad y la nacionalización quedan del lado de su despachante chileno.",
+    "processSteps": [
+      {
+        "title": "Comparta el equipo",
+        "body": "Envíe el anuncio o la factura proforma con marca, modelo, año, ubicación en EE. UU. o Canadá y estado de compra de la maquinaria."
+      },
+      {
+        "title": "Definimos medidas y modalidad",
+        "body": "Revisamos dimensiones, peso y si requiere desmontaje, contenedor, flat rack, RoRo o carga de proyecto para fijar la modalidad correcta."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
+      },
+      {
+        "title": "Entregamos el expediente para Chile",
+        "body": "Compartimos los documentos del tramo internacional para que su despachante gestione el despacho, los tributos y la inspección del SAG al ingreso en Chile."
+      }
+    ],
+    "quoteIntro": "Con estos datos definimos el tramo de EE. UU. a Chile sin inventar medidas, ruta ni formato de carga. Cuanto más completa la información, más útil es la cotización.",
+    "quoteFields": [
+      "Link del equipo o factura proforma",
+      "Marca, modelo y año",
+      "Ubicación exacta en EE. UU. o Canadá",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Dimensiones y peso disponibles",
+      "Ciudad de destino en Chile y fecha estimada"
+    ],
+    "complianceHeading": "Requisito fitosanitario del SAG al ingreso a Chile",
+    "complianceBody": "La maquinaria usada debe llegar a Chile limpia, libre de suelo, restos vegetales y plagas reglamentadas, conforme a la Resolución SAG N° 3.103/2016 (vigente). El SAG inspecciona la maquinaria al ingreso al país: no existe una aprobación previa del SAG ni una entrada garantizada antes de esa inspección. Si la maquinaria no cumple, puede generar costos correctivos de limpieza o el reembarque, que asume el importador. Por eso embalamos y preparamos en origen cuidando la limpieza del equipo, pero la decisión de admisión es del SAG en el punto de ingreso.",
+    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU. y Canadá; la admisibilidad, la inspección del SAG al ingreso y la nacionalización en Chile quedan bajo responsabilidad del importador y su despachante.",
+    "faq": [
+      {
+        "question": "¿Meridian vende la maquinaria?",
+        "answer": "No. Meridian es el operador de logística y exportación del lado de EE. UU. y Canadá. Podemos coordinar con su vendedor o brindar compra asistida bajo un alcance separado, pero no somos la concesionaria del equipo."
+      },
+      {
+        "question": "¿Pueden darme el costo final nacionalizado en Chile?",
+        "answer": "No. Cotizamos el tramo internacional que controlamos. Los aranceles, el IVA y las tasas locales los calcula su despachante según la clasificación real del equipo. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado."
+      },
+      {
+        "question": "¿El equipo entra a Chile aprobado por el SAG?",
+        "answer": "No. El SAG inspecciona la maquinaria usada al ingreso al país conforme a la Resolución 3.103/2016. Debe llegar limpia, libre de suelo, restos vegetales y plagas reglamentadas. Si no cumple, puede generar costos correctivos o el reembarque a cargo del importador. No hay aprobación previa del SAG."
+      },
+      {
+        "question": "¿A qué puerto llega la carga en Chile?",
+        "answer": "Generalmente San Antonio o Valparaíso, según naviera, carga y destino. No fijamos un puerto obligatorio: la modalidad de carga, las dimensiones y el plan de su despachante definen el puerto de descarga."
+      }
+    ],
+    "ctaHeading": "Cotice su importación de maquinaria desde EE. UU. a Chile",
+    "ctaDescription": "Comparta el equipo y el destino en Chile; le devolvemos el alcance del tramo internacional por escrito antes de reservar.",
+    "whatsappPrefill": "#FRT_ES Hola, quiero importar maquinaria desde EE. UU. a Chile. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad en Chile]. Ref: {{whatsapp_ref}}"
+  },
+  "chile/flete-equipo-pesado-usa": {
+    "seoTitle": "Flete de equipo pesado de EE. UU. a Chile | Meridian",
+    "seoDescription": "Coordinamos el flete de equipo pesado de EE. UU. a Chile: retiro, embalaje, documentación de exportación y reserva marítima. La aduana y los tributos los gestiona su despachante.",
+    "eyebrow": "Flete de equipo pesado desde EE. UU. · Chile",
+    "h1": "Flete de equipo pesado desde EE. UU. a Chile",
+    "heroBody": "Meridian coordina el flete de su equipo pesado de EE. UU. y Canadá a Chile: retiro en origen, medición, desmontaje o embalaje cuando corresponde, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo en contenedor, flat rack, RoRo o carga de proyecto según las dimensiones. La nacionalización, los aranceles, el IVA, el despacho aduanero y la entrega interior en Chile los gestiona por separado su despachante. Le confirmamos por escrito el alcance del tramo internacional antes de reservar.",
+    "heroBullets": [
+      "Coordinación de equipo pesado y sobredimensionado del lado de EE. UU. y Canadá.",
+      "Retiro, medición, desmontaje y embalaje en origen según las dimensiones.",
+      "Flat rack, RoRo o carga de proyecto para piezas que no van en contenedor estándar.",
+      "Cotización del flete marítimo separada de los tributos y costos locales en Chile."
+    ],
+    "scopeIncluded": [
+      "Retiro y transporte del equipo pesado en EE. UU. o Canadá",
+      "Medición, desmontaje y embalaje para flat rack, RoRo o carga de proyecto",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
+      "Reserva del flete marítimo hasta el puerto chileno acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, aranceles, IVA y tributos en Chile",
+      "Despacho aduanero y permisos a cargo del importador",
+      "Inspección fitosanitaria del SAG al ingreso en Chile",
+      "Entrega interior y permisos de transporte sobredimensionado dentro de Chile"
+    ],
+    "processIntro": "El equipo pesado se cotiza por sus medidas reales: peso, alto, ancho y largo definen la modalidad. Primero confirmamos las dimensiones y el alcance del tramo de EE. UU. a Chile; luego reservamos. La nacionalización queda del lado de su despachante chileno.",
+    "processSteps": [
+      {
+        "title": "Comparta el equipo y sus medidas",
+        "body": "Envíe marca, modelo, año, ubicación en EE. UU. o Canadá y, si las tiene, las dimensiones y el peso del equipo pesado."
+      },
+      {
+        "title": "Definimos la modalidad de carga",
+        "body": "Según peso y dimensiones determinamos si va en contenedor, flat rack, RoRo o como carga de proyecto, y si requiere desmontaje parcial."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario de origen (USDA APHIS o CFIA), y reservamos el flete marítimo."
+      },
+      {
+        "title": "Entregamos el expediente para Chile",
+        "body": "Compartimos los documentos del tramo internacional para que su despachante gestione el despacho, los tributos y la inspección del SAG al ingreso en Chile."
+      }
+    ],
+    "quoteIntro": "Para equipo pesado, las medidas mandan. Con estos datos definimos la modalidad y el tramo de EE. UU. a Chile sin suponer dimensiones ni ruta.",
+    "quoteFields": [
+      "Link del equipo o factura proforma",
+      "Marca, modelo y año",
+      "Ubicación exacta en EE. UU. o Canadá",
+      "Dimensiones y peso (alto, ancho, largo)",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Ciudad de destino en Chile y fecha estimada"
+    ],
+    "complianceHeading": "Requisito fitosanitario del SAG al ingreso a Chile",
+    "complianceBody": "El equipo pesado usado debe llegar a Chile limpio, libre de suelo, restos vegetales y plagas reglamentadas, conforme a la Resolución SAG N° 3.103/2016 (vigente). El SAG inspecciona el equipo al ingreso al país: no existe una aprobación previa del SAG ni una entrada garantizada antes de esa inspección. Si el equipo no cumple, puede generar costos correctivos de limpieza o el reembarque, que asume el importador. Preparamos y embalamos en origen cuidando la limpieza del equipo, pero la decisión de admisión corresponde al SAG en el punto de ingreso.",
+    "localResponsibility": "Meridian coordina el tramo contratado desde EE. UU. y Canadá; la admisibilidad, la inspección del SAG al ingreso y la nacionalización en Chile quedan bajo responsabilidad del importador y su despachante.",
+    "faq": [
+      {
+        "question": "¿Cómo se envía el equipo que no entra en un contenedor estándar?",
+        "answer": "Según las dimensiones y el peso usamos flat rack, RoRo o carga de proyecto, con desmontaje parcial cuando conviene. La modalidad se fija con las medidas reales del equipo, no con una tarifa genérica."
+      },
+      {
+        "question": "¿Pueden darme el costo final nacionalizado en Chile?",
+        "answer": "No. Cotizamos el tramo internacional que controlamos. Los aranceles, el IVA y las tasas locales los calcula su despachante según la clasificación real del equipo. La calculadora es una referencia del tramo logístico, no el costo final nacionalizado."
+      },
+      {
+        "question": "¿El equipo entra a Chile aprobado por el SAG?",
+        "answer": "No. El SAG inspecciona el equipo usado al ingreso al país conforme a la Resolución 3.103/2016. Debe llegar limpio, libre de suelo, restos vegetales y plagas reglamentadas. Si no cumple, puede generar costos correctivos o el reembarque a cargo del importador. No hay aprobación previa del SAG."
+      },
+      {
+        "question": "¿A qué puerto llega el equipo pesado en Chile?",
+        "answer": "Generalmente San Antonio o Valparaíso, según naviera, carga y destino. No fijamos un puerto obligatorio: el peso, las dimensiones, la modalidad de carga y el plan de su despachante definen el puerto de descarga."
+      }
+    ],
+    "ctaHeading": "Cotice el flete de su equipo pesado desde EE. UU. a Chile",
+    "ctaDescription": "Comparta el equipo, sus medidas y el destino en Chile; le devolvemos el alcance del tramo internacional por escrito antes de reservar.",
+    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar flete de equipo pesado desde EE. UU. a Chile. Equipo: [marca/modelo/año]. Medidas: [alto/ancho/largo/peso]. Ubicación: [ciudad/estado]. Destino: [ciudad en Chile]. Ref: {{whatsapp_ref}}"
+  },
+  "uruguay/importacion-maquinaria-usa": {
+    "seoTitle": "Importar maquinaria de EE. UU. a Uruguay | Meridian",
+    "seoDescription": "Coordinamos retiro, embalaje, documentación de exportación y flete de maquinaria usada desde EE. UU. a Uruguay. La nacionalización la gestiona su despachante (ADAU).",
+    "eyebrow": "Maquinaria usada desde EE. UU. · Uruguay",
+    "h1": "Importación de maquinaria desde EE. UU. a Uruguay",
+    "heroBody": "Meridian coordina el tramo del lado de EE. UU.: contacto con el vendedor o compra asistida, retiro, medición, desmontaje y embalaje cuando corresponda, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo, habitualmente vía Montevideo. La nacionalización, los tributos y el despacho aduanero en Uruguay quedan a cargo de su despachante (ADAU). No prometemos costo final nacionalizado ni admisión garantizada: eso depende de la clasificación NCM y de la inspección de la DGSA al ingreso.",
+    "heroBullets": [
+      "Operación del lado de EE. UU.: retiro, medición, embalaje y carga en origen.",
+      "Documentación de exportación + certificado fitosanitario USDA APHIS o CFIA de origen.",
+      "Reserva de flete marítimo, habitualmente vía Montevideo (no garantizado).",
+      "Cotización del tramo logístico, separada de aranceles y tributos locales."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y retiro en EE. UU./Canadá",
+      "Medición, desmontaje y embalaje cuando corresponda",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
+      "Reserva del flete marítimo al puerto acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, TGA, IVA y recargos en Uruguay",
+      "Despacho aduanero y clasificación NCM (lo confirma el despachante/ADAU)",
+      "Inspección fitosanitaria de la DGSA al ingreso",
+      "Permisos del importador y entrega interior en Uruguay"
+    ],
+    "processIntro": "Definimos la ruta a partir del equipo real, no de una tarifa genérica. Primero confirmamos información técnica y alcance; después se reserva y se entrega el expediente para que su despachante gestione el ingreso en Uruguay.",
+    "processSteps": [
+      {
+        "title": "Comparta el equipo",
+        "body": "Envíe el anuncio o la factura proforma, con marca, modelo, año, ubicación en EE. UU./Canadá y estado de compra de la maquinaria."
+      },
+      {
+        "title": "Definimos medidas y modalidad",
+        "body": "Revisamos dimensiones, peso y si requiere desmontaje, contenedor de 40' HC, flat rack o carga de proyecto, y preparamos la limpieza de origen."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional que exige la DGSA."
+      },
+      {
+        "title": "Entregamos el expediente para destino",
+        "body": "Compartimos los documentos del tramo internacional para que su despachante (ADAU) clasifique la NCM, calcule tributos y gestione la nacionalización en Uruguay."
+      }
+    ],
+    "quoteIntro": "Con estos datos definimos el tramo internacional sin inventar medidas, ruta ni formato de carga. Cuanto más completo, más útil y firme es la cotización del tramo logístico.",
+    "quoteFields": [
+      "Link del equipo o factura proforma",
+      "Marca, modelo y año de la maquinaria",
+      "Ubicación exacta en EE. UU. o Canadá (ciudad y ZIP)",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Dimensiones y peso disponibles",
+      "Ciudad de destino en Uruguay y fecha estimada",
+      "Datos de su despachante (ADAU), si ya lo tiene"
+    ],
+    "complianceHeading": "Requisitos fitosanitarios y tributos en Uruguay antes de embarcar",
+    "complianceBody": "La DGSA exige (Resolución 98/016, vigente) limpieza de origen, certificado fitosanitario con declaración adicional, tratamiento cuando corresponda e inspección de la DGSA al ingreso; la aceptación no está garantizada. El origen EE. UU. no tiene preferencias Mercosur. Los tributos dependen de la clasificación NCM: la TGA del 2% corresponde a bienes de capital BK/BIT con AEC>0% según el Decreto 426/011 (no es una tasa universal), más IVA y recargos según el caso. No publicamos un costo nacionalizado ni un arancel final: esos importes los confirma su despachante (ADAU).",
+    "localResponsibility": "Meridian coordina el tramo contratado desde origen; la admisibilidad y la nacionalización en Uruguay quedan bajo responsabilidad del importador y su despachante (ADAU).",
+    "faq": [
+      {
+        "question": "¿Pueden darme el costo final nacionalizado en Uruguay?",
+        "answer": "No. Cotizamos el tramo logístico que controlamos (origen, exportación y flete marítimo). La TGA, el IVA y los recargos dependen de la clasificación NCM y los confirma su despachante (ADAU); la TGA del 2% aplica solo a bienes de capital BK/BIT con AEC>0% según el Decreto 426/011, no como tasa universal."
+      },
+      {
+        "question": "¿Garantizan que la maquinaria será admitida en Uruguay?",
+        "answer": "No. La DGSA inspecciona el equipo al ingreso (Resolución 98/016) y la aceptación no está garantizada. Preparamos la limpieza de origen, el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional y el tratamiento cuando corresponda para llegar en condiciones, pero la decisión final es del organismo en destino."
+      },
+      {
+        "question": "¿Por qué no se aplica una preferencia Mercosur si Uruguay es miembro?",
+        "answer": "Porque la mercadería tiene origen EE. UU. y el origen estadounidense no tiene preferencias Mercosur. La clasificación NCM y los tributos aplicables los determina su despachante (ADAU) en función del equipo real."
+      },
+      {
+        "question": "¿A qué puerto llega la maquinaria?",
+        "answer": "Habitualmente vía Montevideo, pero no está garantizado: el puerto depende de la naviera, la modalidad de carga, las dimensiones y el plan de su despachante. La página no promete un puerto único."
+      }
+    ],
+    "ctaHeading": "Cotice su importación de maquinaria desde EE. UU. a Uruguay",
+    "ctaDescription": "Comparta el equipo y el destino; le devolvemos por escrito el alcance del tramo internacional antes de reservar. La nacionalización y los tributos los confirma su despachante (ADAU).",
+    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar la importación de maquinaria desde EE. UU. a Uruguay. Equipo: [marca/modelo/año]. Ubicación: [ciudad/estado]. Destino: [ciudad de Uruguay]. Ref: {{whatsapp_ref}}"
+  },
+  "uruguay/flete-cosechadoras-usa": {
+    "seoTitle": "Flete de cosechadoras de EE. UU. a Uruguay | Meridian",
+    "seoDescription": "Coordinamos retiro, desmontaje, embalaje, documentación de exportación y flete de cosechadoras desde EE. UU. a Uruguay. La nacionalización la gestiona su despachante (ADAU).",
+    "eyebrow": "Cosechadoras desde EE. UU. · Uruguay",
+    "h1": "Flete de cosechadoras desde EE. UU. a Uruguay",
+    "heroBody": "Meridian coordina el tramo del lado de EE. UU. para su cosechadora: contacto con el vendedor o compra asistida, retiro, medición, desmontaje del cabezal y embalaje, documentación de exportación, certificado fitosanitario de origen (USDA APHIS o CFIA) y reserva del flete marítimo, habitualmente vía Montevideo. La nacionalización, los tributos y el despacho aduanero en Uruguay quedan a cargo de su despachante (ADAU). No prometemos costo final nacionalizado ni admisión garantizada: eso depende de la clasificación NCM y de la inspección de la DGSA al ingreso.",
+    "heroBullets": [
+      "Desmontaje del cabezal, medición y embalaje de la cosechadora en EE. UU.",
+      "Documentación de exportación + certificado fitosanitario USDA APHIS o CFIA de origen.",
+      "Flat rack o carga de proyecto según dimensiones, vía Montevideo (no garantizado).",
+      "Cotización del tramo logístico, separada de aranceles y tributos locales."
+    ],
+    "scopeIncluded": [
+      "Compra asistida y retiro de la cosechadora en EE. UU./Canadá",
+      "Medición, desmontaje del cabezal y embalaje en origen",
+      "Documentación de exportación y certificado fitosanitario de origen (USDA APHIS o CFIA)",
+      "Reserva del flete marítimo (flat rack o proyecto) al puerto acordado"
+    ],
+    "scopeExcluded": [
+      "Nacionalización, TGA, IVA y recargos en Uruguay",
+      "Despacho aduanero y clasificación NCM (lo confirma el despachante/ADAU)",
+      "Inspección fitosanitaria de la DGSA al ingreso",
+      "Permisos del importador y entrega interior en Uruguay"
+    ],
+    "processIntro": "La cosechadora se cotiza por su geometría real, no por una tarifa fija. Primero confirmamos medidas, desmontaje y alcance; después se reserva y se entrega el expediente para que su despachante gestione el ingreso en Uruguay.",
+    "processSteps": [
+      {
+        "title": "Comparta la cosechadora",
+        "body": "Envíe el anuncio o la factura proforma, con marca, modelo, año, tipo de cabezal, ubicación en EE. UU./Canadá y estado de compra."
+      },
+      {
+        "title": "Medición y desmontaje",
+        "body": "Definimos dimensiones con y sin cabezal, peso y si conviene flat rack o carga de proyecto, y planificamos el desmontaje y la limpieza de origen."
+      },
+      {
+        "title": "Coordinamos origen y exportación",
+        "body": "Organizamos retiro, embalaje, carga, documentación de exportación y el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional que exige la DGSA."
+      },
+      {
+        "title": "Entregamos el expediente para destino",
+        "body": "Compartimos los documentos del tramo internacional para que su despachante (ADAU) clasifique la NCM, calcule tributos y gestione la nacionalización en Uruguay."
+      }
+    ],
+    "quoteIntro": "Con estos datos cotizamos el tramo internacional de la cosechadora sin inventar medidas ni formato de carga. La geometría del cabezal define el flete, así que cuanto más preciso, mejor.",
+    "quoteFields": [
+      "Link del equipo o factura proforma",
+      "Marca, modelo, año y tipo de cabezal",
+      "Ubicación exacta en EE. UU. o Canadá (ciudad y ZIP)",
+      "Estado de compra: evaluando, reservado o comprado",
+      "Dimensiones con y sin cabezal, y peso",
+      "Ciudad de destino en Uruguay y fecha estimada",
+      "Datos de su despachante (ADAU), si ya lo tiene"
+    ],
+    "complianceHeading": "Requisitos fitosanitarios y tributos en Uruguay antes de embarcar",
+    "complianceBody": "La DGSA exige (Resolución 98/016, vigente) limpieza de origen, certificado fitosanitario con declaración adicional, tratamiento cuando corresponda e inspección de la DGSA al ingreso; en cosechadoras usadas la limpieza de tolva, sinfines y cabezal es crítica y la aceptación no está garantizada. El origen EE. UU. no tiene preferencias Mercosur. Los tributos dependen de la clasificación NCM: la TGA del 2% corresponde a bienes de capital BK/BIT con AEC>0% según el Decreto 426/011 (no es una tasa universal), más IVA y recargos según el caso. No publicamos un costo nacionalizado ni un arancel final: esos importes los confirma su despachante (ADAU).",
+    "localResponsibility": "Meridian coordina el tramo contratado desde origen; la admisibilidad y la nacionalización de la cosechadora en Uruguay quedan bajo responsabilidad del importador y su despachante (ADAU).",
+    "faq": [
+      {
+        "question": "¿La cosechadora viaja entera o se desmonta el cabezal?",
+        "answer": "Según las dimensiones, normalmente se desmonta el cabezal y la máquina viaja en flat rack o como carga de proyecto. Coordinamos la medición y el desmontaje en EE. UU. y lo definimos antes de reservar para cotizar el tramo logístico real."
+      },
+      {
+        "question": "¿Garantizan que la cosechadora será admitida en Uruguay?",
+        "answer": "No. La DGSA inspecciona el equipo al ingreso (Resolución 98/016) y la aceptación no está garantizada. Preparamos la limpieza de origen (tolva, sinfines y cabezal), el certificado fitosanitario USDA APHIS o CFIA con la declaración adicional y el tratamiento cuando corresponda, pero la decisión final es del organismo en destino."
+      },
+      {
+        "question": "¿Pueden darme el costo final nacionalizado de la cosechadora?",
+        "answer": "No. Cotizamos el tramo logístico que controlamos. La TGA, el IVA y los recargos dependen de la clasificación NCM y los confirma su despachante (ADAU); la TGA del 2% aplica solo a bienes de capital BK/BIT con AEC>0% según el Decreto 426/011, no como tasa universal. El origen EE. UU. no tiene preferencias Mercosur."
+      },
+      {
+        "question": "¿A qué puerto llega la cosechadora?",
+        "answer": "Habitualmente vía Montevideo, pero no está garantizado: el puerto depende de la naviera, la modalidad de carga, las dimensiones y el plan de su despachante. La página no promete un puerto único."
+      }
+    ],
+    "ctaHeading": "Cotice el flete de su cosechadora desde EE. UU. a Uruguay",
+    "ctaDescription": "Comparta el modelo y el destino; le devolvemos por escrito el alcance del tramo internacional antes de reservar. La nacionalización y los tributos los confirma su despachante (ADAU).",
+    "whatsappPrefill": "#FRT_ES Hola, quiero cotizar el flete de una cosechadora desde EE. UU. a Uruguay. Equipo: [marca/modelo/año/cabezal]. Ubicación: [ciudad/estado]. Destino: [ciudad de Uruguay]. Ref: {{whatsapp_ref}}"
+  }
+};
diff --git a/content/latam-paid-search-destinations.ts b/content/latam-paid-search-destinations.ts
new file mode 100644
index 0000000..2778960
--- /dev/null
+++ b/content/latam-paid-search-destinations.ts
@@ -0,0 +1,300 @@
+/**
+ * LATAM paid-search destination routes (Gate B).
+ *
+ * 10 immutable records driving /es/destinations/{country}/{segment} pages, the
+ * landing destinations for the 10 paused Gate A Google Ads campaigns.
+ *
+ * Spec: docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md
+ *
+ * Customer-facing copy is sourced from content/latam-paid-search-copy.ts
+ * (verified per-country Spanish; pending client native review before go-live).
+ * Official-source URLs are the verified real ones (see spec §7). Compliance
+ * caveats keep Meridian's role freight-only and defer admissibility to the
+ * destination despachante.
+ */
+
+import { PAID_SEARCH_COPY } from "@/content/latam-paid-search-copy";
+
+// ─── Enums ──────────────────────────────────────────────────────────────────
+
+export const PAID_SEARCH_COUNTRIES = [
+  "argentina",
+  "bolivia",
+  "paraguay",
+  "chile",
+  "uruguay",
+] as const;
+export type PaidSearchCountrySlug = (typeof PAID_SEARCH_COUNTRIES)[number];
+
+export const PAID_SEARCH_SEGMENTS = [
+  "importacion-maquinaria-usa",
+  "flete-cosechadoras-usa",
+  "flete-equipo-pesado-usa",
+] as const;
+export type PaidSearchSegmentSlug = (typeof PAID_SEARCH_SEGMENTS)[number];
+
+export type PaidSearchCountryCode = "AR" | "BO" | "PY" | "CL" | "UY";
+export type PaidSearchSegmentKey =
+  | "machinery_import"
+  | "combine_shipping"
+  | "heavy_equipment_shipping";
+export type PaidSearchRequestType =
+  | "import_coordination_quote"
+  | "combine_freight_quote"
+  | "heavy_equipment_freight_quote";
+/** Website-emitted default; final qualified value is downstream (spec §4, §15). */
+export type PaidSearchCargoClass = "general_machinery" | "combine" | "heavy_oog";
+export type PaidSearchRouteKey = `${PaidSearchCountrySlug}/${PaidSearchSegmentSlug}`;
+
+// ─── Content shape ──────────────────────────────────────────────────────────
+
+export interface PaidSearchOfficialSource {
+  readonly id: string;
+  readonly label: string;
+  readonly url: string;
+  readonly description: string;
+}
+export interface PaidSearchFaqItem {
+  readonly question: string;
+  readonly answer: string;
+}
+export interface PaidSearchStep {
+  readonly title: string;
+  readonly body: string;
+}
+
+export interface LatamPaidSearchDestination {
+  readonly routeKey: PaidSearchRouteKey;
+  readonly locale: "es";
+  readonly country: {
+    readonly code: PaidSearchCountryCode;
+    readonly slug: PaidSearchCountrySlug;
+    readonly name: string;
+    readonly hubPath: `/es/destinations/${PaidSearchCountrySlug}`;
+  };
+  readonly segment: {
+    readonly slug: PaidSearchSegmentSlug;
+    readonly key: PaidSearchSegmentKey;
+    readonly publicName: string;
+    readonly cargoClass: PaidSearchCargoClass;
+    readonly requestType: PaidSearchRequestType;
+  };
+  readonly seo: {
+    readonly title: string;
+    readonly description: string;
+    readonly canonicalPath: `/es/destinations/${string}`;
+  };
+  readonly breadcrumbLabel: string;
+  readonly eyebrow: string;
+  readonly h1: string;
+  readonly heroBody: string;
+  readonly heroBullets: readonly string[];
+  /** First-viewport scope split (spec §6.2) */
+  readonly scopeIncluded: readonly string[];
+  readonly scopeExcluded: readonly string[];
+  readonly process: {
+    readonly heading: string;
+    readonly intro: string;
+    readonly steps: readonly PaidSearchStep[];
+  };
+  readonly quoteReadiness: {
+    readonly heading: string;
+    readonly intro: string;
+    readonly fields: readonly string[];
+  };
+  readonly compliance: {
+    readonly heading: string;
+    readonly body: string;
+    /** Always rendered adjacent to the CTA (spec §15). */
+    readonly localResponsibility: string;
+  };
+  readonly faq: readonly PaidSearchFaqItem[];
+  readonly officialSources: readonly PaidSearchOfficialSource[];
+  readonly jsonLd: {
+    readonly serviceName: string;
+    readonly serviceType: string;
+    readonly areaServedCountryName: string;
+  };
+  readonly cta: {
+    readonly heading: string;
+    readonly description: string;
+    readonly whatsappLabel: string;
+    readonly calculatorLabel: string;
+    /** {{whatsapp_ref}} is interpolated at click time (P3). */
+    readonly whatsappPrefill: string;
+  };
+  /** Slug-prefixed snake_case tracking location ids (spec §7 convention). */
+  readonly tracking: {
+    readonly heroWhatsapp: string;
+    readonly heroCalculator: string;
+    readonly finalWhatsapp: string;
+    readonly finalCalculator: string;
+  };
+  readonly internalLinks: readonly { readonly label: string; readonly href: string }[];
+}
+
+// ─── Per-country / per-segment metadata ─────────────────────────────────────
+
+const COUNTRY_META: Record<
+  PaidSearchCountrySlug,
+  { code: PaidSearchCountryCode; name: string }
+> = {
+  argentina: { code: "AR", name: "Argentina" },
+  bolivia: { code: "BO", name: "Bolivia" },
+  paraguay: { code: "PY", name: "Paraguay" },
+  chile: { code: "CL", name: "Chile" },
+  uruguay: { code: "UY", name: "Uruguay" },
+};
+
+const SEGMENT_META: Record<
+  PaidSearchSegmentSlug,
+  {
+    key: PaidSearchSegmentKey;
+    cargoClass: PaidSearchCargoClass;
+    requestType: PaidSearchRequestType;
+    publicName: string;
+    equipmentEs: string;
+  }
+> = {
+  "importacion-maquinaria-usa": {
+    key: "machinery_import",
+    cargoClass: "general_machinery",
+    requestType: "import_coordination_quote",
+    publicName: "Importación de maquinaria",
+    equipmentEs: "maquinaria usada",
+  },
+  "flete-cosechadoras-usa": {
+    key: "combine_shipping",
+    cargoClass: "combine",
+    requestType: "combine_freight_quote",
+    publicName: "Flete de cosechadoras",
+    equipmentEs: "cosechadoras",
+  },
+  "flete-equipo-pesado-usa": {
+    key: "heavy_equipment_shipping",
+    cargoClass: "heavy_oog",
+    requestType: "heavy_equipment_freight_quote",
+    publicName: "Flete de equipo pesado",
+    equipmentEs: "equipo pesado",
+  },
+};
+
+/** Verified official sources per country (spec §7; URLs confirmed 2026-06-22). */
+const OFFICIAL_SOURCES: Record<PaidSearchCountrySlug, readonly PaidSearchOfficialSource[]> = {
+  argentina: [
+    { id: "AR-01", label: "Decreto 273/2025", url: "https://www.argentina.gob.ar/normativa/nacional/decreto-273-2025-411791/texto", description: "Régimen de importación de bienes usados (reemplaza el CIBU por declaración jurada en el SIM)." },
+    { id: "AR-02", label: "SENASA — AFIDI", url: "https://www.argentina.gob.ar/servicio/gestionar-la-autorizacion-fitosanitaria-de-importacion-afidi-y-la-evaluacion-de", description: "Autorización Fitosanitaria de Importación para maquinaria agrícola usada." },
+    { id: "AR-03", label: "SENASA — control de maquinaria usada", url: "https://www.argentina.gob.ar/noticias/argentina-controla-la-importacion-de-maquinaria-agricola-usada-para-prevenir-el-ingreso-de", description: "Revisión documental e inspección física: equipos limpios, libres de suelo y restos vegetales." },
+  ],
+  bolivia: [
+    { id: "BO-01", label: "Aduana Nacional de Bolivia", url: "https://www.aduana.gob.bo/", description: "Autoridad aduanera; registro de importadores y declaración de importación." },
+    { id: "BO-02", label: "SENASAG — Cuarentena Vegetal", url: "https://www.senasag.gob.bo/index.php/institucional/unidades-nacionales/sanidad-vegetal/area-de-cuarentena-vegetal", description: "Inspección o autorización fitosanitaria según producto, origen y condición del equipo." },
+  ],
+  paraguay: [
+    { id: "PY-01", label: "Ley 7565/2025", url: "https://www.bacn.gov.py/leyes-paraguayas/12918/ley-n-7565-2025-que-establece-medidas-fitosanitarias-y-dispone-otras-medidas-de-mitigaci-n-de-riesgo-en-la-introducci-n-al-pa-s-de-maquinaria-equipos-e-implementos-agr-colas-usados", description: "Medidas fitosanitarias y de mitigación de riesgo para maquinaria agrícola usada." },
+    { id: "PY-02", label: "DNIT", url: "https://www.dnit.gov.py/", description: "Autoridad aduanera y tributaria." },
+    { id: "PY-03", label: "SENAVE", url: "https://www.senave.gov.py/", description: "Autoridad fitosanitaria." },
+    { id: "PY-04", label: "MIC", url: "https://www.mic.gov.py/", description: "Registro de importadores y licencia previa." },
+  ],
+  chile: [
+    { id: "CL-01", label: "SAG — Resolución 3.103/2016", url: "https://normativa.sag.gob.cl/Publico/Normas/DetalleNorma.aspx?id=1091725", description: "Maquinaria usada debe llegar limpia, libre de suelo, restos vegetales y plagas reglamentadas; inspección al ingreso." },
+    { id: "CL-02", label: "Aduanas de Chile — normas generales", url: "https://www.aduana.cl/capitulo-1-normas-generales/aduana/2007-02-15/151856.html", description: "Definiciones aduaneras (importación, despacho, despachador de aduana)." },
+    { id: "CL-03", label: "Puerto San Antonio", url: "https://www.puertosanantonio.com/operacion-portuaria", description: "Contexto de operación portuaria (San Antonio o Valparaíso, según naviera y carga)." },
+  ],
+  uruguay: [
+    { id: "UY-01", label: "DGSA — Resolución 98/016", url: "https://www.gub.uy/ministerio-ganaderia-agricultura-pesca/institucional/normativa/resolucion-n-98016-dgsa-requisitos-fitosanitarios-para-introduccion-pais", description: "Requisitos fitosanitarios: limpieza de origen, tratamiento/certificación e inspección." },
+    { id: "UY-02", label: "Aduanas — Tasa Global Arancelaria", url: "https://www.aduanas.gub.uy/innovaportal/v/7032/3/innova.front/tasa-global-arancelaria-tga.html", description: "Referencia general de la TGA (la tasa del 2% corresponde a bienes de capital BK/BIT según Decreto 426/011)." },
+  ],
+};
+
+/** The 10 curated valid pairs (NOT the full 5x2 product). */
+const VALID_PAIRS: readonly (readonly [PaidSearchCountrySlug, PaidSearchSegmentSlug])[] = [
+  ["argentina", "importacion-maquinaria-usa"],
+  ["argentina", "flete-cosechadoras-usa"],
+  ["bolivia", "importacion-maquinaria-usa"],
+  ["bolivia", "flete-equipo-pesado-usa"],
+  ["paraguay", "importacion-maquinaria-usa"],
+  ["paraguay", "flete-cosechadoras-usa"],
+  ["chile", "importacion-maquinaria-usa"],
+  ["chile", "flete-equipo-pesado-usa"],
+  ["uruguay", "importacion-maquinaria-usa"],
+  ["uruguay", "flete-cosechadoras-usa"],
+];
+
+// ─── Record factory (verified P2 Spanish copy from content/latam-paid-search-copy) ──
+
+function buildDestination(
+  countrySlug: PaidSearchCountrySlug,
+  segmentSlug: PaidSearchSegmentSlug,
+): LatamPaidSearchDestination {
+  const c = COUNTRY_META[countrySlug];
+  const s = SEGMENT_META[segmentSlug];
+  const path = `/es/destinations/${countrySlug}/${segmentSlug}` as const;
+  const trackingPrefix = `${countrySlug}_${s.key}`;
+  const copy = PAID_SEARCH_COPY[`${countrySlug}/${segmentSlug}`];
+  if (!copy) {
+    throw new Error(`Missing paid-search copy for ${countrySlug}/${segmentSlug}`);
+  }
+
+  return {
+    routeKey: `${countrySlug}/${segmentSlug}`,
+    locale: "es",
+    country: { code: c.code, slug: countrySlug, name: c.name, hubPath: `/es/destinations/${countrySlug}` },
+    segment: { slug: segmentSlug, key: s.key, publicName: s.publicName, cargoClass: s.cargoClass, requestType: s.requestType },
+    seo: {
+      title: copy.seoTitle,
+      description: copy.seoDescription,
+      canonicalPath: path,
+    },
+    breadcrumbLabel: s.publicName,
+    eyebrow: copy.eyebrow,
+    h1: copy.h1,
+    heroBody: copy.heroBody,
+    heroBullets: copy.heroBullets,
+    scopeIncluded: copy.scopeIncluded,
+    scopeExcluded: copy.scopeExcluded,
+    process: {
+      heading: "Cómo coordinamos la operación",
+      intro: copy.processIntro,
+      steps: copy.processSteps,
+    },
+    quoteReadiness: {
+      heading: "Datos para preparar una cotización útil",
+      intro: copy.quoteIntro,
+      fields: copy.quoteFields,
+    },
+    compliance: {
+      heading: copy.complianceHeading,
+      body: copy.complianceBody,
+      localResponsibility: copy.localResponsibility,
+    },
+    faq: copy.faq,
+    officialSources: OFFICIAL_SOURCES[countrySlug],
+    jsonLd: {
+      serviceName: `Coordinación de ${s.publicName.toLowerCase()} desde EE. UU. a ${c.name}`,
+      serviceType: "Freight forwarding and export coordination for used machinery",
+      areaServedCountryName: c.name,
+    },
+    cta: {
+      heading: copy.ctaHeading,
+      description: copy.ctaDescription,
+      whatsappLabel: "Cotizar por WhatsApp",
+      calculatorLabel: "Calcular flete estimado",
+      whatsappPrefill: copy.whatsappPrefill,
+    },
+    tracking: {
+      heroWhatsapp: `${trackingPrefix}_hero_whatsapp`,
+      heroCalculator: `${trackingPrefix}_hero_calculator`,
+      finalWhatsapp: `${trackingPrefix}_final_whatsapp`,
+      finalCalculator: `${trackingPrefix}_final_calculator`,
+    },
+    internalLinks: [
+      { label: `${c.name}: guía de importación`, href: `/es/destinations/${countrySlug}` },
+      { label: "Compra asistida de equipo", href: "/services/equipment-sales" },
+      { label: "Calculadora de flete", href: "/pricing/calculator" },
+    ],
+  };
+}
+
+export const LATAM_PAID_SEARCH_DESTINATIONS: readonly LatamPaidSearchDestination[] =
+  VALID_PAIRS.map(([country, segment]) => buildDestination(country, segment));
diff --git a/docs/plans/latam-paid-search-destinations/DONE.md b/docs/plans/latam-paid-search-destinations/DONE.md
new file mode 100644
index 0000000..1a5e531
--- /dev/null
+++ b/docs/plans/latam-paid-search-destinations/DONE.md
@@ -0,0 +1,36 @@
+# Definition of Done — LATAM Paid-Search Destination Routes
+
+Spec: `docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md`
+Branch: `feat/latam-paid-search-destinations` · Preview only · Gate B HOLD.
+Each item = behavior + how a **fresh verifier** confirms it (never builder self-certification).
+
+## Phase 1 — Routing + registry + shared renderer (ACTIVE)
+
+- [x] **P1.1** Route registry exports exactly **10** immutable records; routeKeys unique; canonical paths unique. → `npm test` passes the `assertRouteRegistry` + count/uniqueness tests.
+- [x] **P1.2** `getPaidSearchDestination(locale, country, segment)` returns the record for the 10 valid **es** combos, `null` otherwise (incl. non-es locale). → unit test.
+- [x] **P1.3** `getPaidSearchStaticParams()` returns exactly the **8 non-Argentina** `{slug,segment}` combos (argentina served by its own static branch). → unit test.
+- [x] **P1.4** All 10 `/es/destinations/{country}/{segment}` routes render with HTTP 200 and no runtime error. → verifier hits each route on the running dev/preview server.
+- [x] **P1.5** Invalid combos return 404: `/es/destinations/argentina/flete-equipo-pesado-usa`, `/es/destinations/chile/flete-cosechadoras-usa`, `/es/destinations/bolivia/flete-cosechadoras-usa`. → verifier hits routes (expect 404) + unit test.
+- [x] **P1.6** `/destinations/argentina/{segment}` (no `es` prefix / en) does not render an es page — redirects/404 per the argentina pattern. → verifier checks runtime guard.
+- [x] **P1.7** Renderer composes ONLY existing primitives (`PageHero variant="dark"`, `TrustBar`, `FaqAccordion`, `DarkCta`, breadcrumbs, `ScrollReveal`); no new color/font/component; no hardcoded hex. → diff review by verifier against §5/§15 design contract.
+- [x] **P1.8** `npm run lint` clean, `npm run build` succeeds, `npm test` green, TS strict (no `any`). → verifier runs each and pastes output.
+
+P1 deliberately uses English-internal placeholder copy (real Spanish = P2). No attribution/lead pipeline yet (P3).
+
+## Phase 2 — Content + compliance + SEO (DONE — verified)
+Per-country Spanish + EN-internal copy with verified §7 caveats; JSON-LD (Service/Breadcrumb/FAQPage); metadata helper (prod canonical even on preview, es-only); AR hub AFIDI URL fix; cross-surface "importación libre" hedge. Gate: client native review.
+
+## Phase 3 — Attribution + lead pipeline (DONE — verified)
+tracking.ts extension + opaque-`attribution_id` cookie/consent fix; `lib/lead-attribution.ts`; additive migration (+ degradation if UNIQUE absent); `submitPaidSearchLead` + `createWhatsAppRef` Server Actions; quote form (extend `contact-form.tsx`); Google Ads tag guard; **attribution actively wired into payload**; **dedupe truly no-ops** (on_conflict + gated side-effects). Tests: persistence/trust-boundary/dedupe/ref/no-side-effect (mocked emitters).
+
+## Phase 4 — QA + evidence (DONE — 4-lens QA panel; blocker + majors fixed)
+a11y, AdsBot, message-match (incl. customs caveat adjacent to CTA), mobile, preview 200s; workbook Gate B evidence update. Present preview to user.
+
+## Boundaries (all phases)
+Branch/preview only for the website deploy. No production website deploy, no Google Ads/Meta/WABA/router/CRM mutation, no conversion upload, no customer messaging. FMC/IATA: owner confirmed KEEP (genuine/current).
+
+## Ops status (2026-06-22)
+- **Supabase migration APPLIED** to the shared MF DB (`ybybrustbnaczukxfeqy`): 10 additive `leads` columns + `idempotency_key` unique index. Verified with a synthetic insert/cleanup against the real schema. Fixed a real bug: `leads.message` is NOT NULL → the action now always populates `message`.
+- **No `paid_search_refs` table** — `wa_attribution.ref_code` (chatbot) already owns ref→attribution; the website ref is stateless + persisted on the lead row (avoids duplicating `mf-chatbot-ui`).
+- **Native Spanish review: WAIVED** (no reviewer available) — copy ships as authored + claim-safety-reviewed.
+- Remaining = Gate-B business approval + the merge to `main` (prod deploy).
diff --git a/docs/plans/latam-paid-search-destinations/copy-en-internal.md b/docs/plans/latam-paid-search-destinations/copy-en-internal.md
new file mode 100644
index 0000000..613ee40
--- /dev/null
+++ b/docs/plans/latam-paid-search-destinations/copy-en-internal.md
@@ -0,0 +1,34 @@
+# LATAM paid-search copy — English-internal review
+
+For the client's native LATAM Spanish reviewer. Spanish source: content/latam-paid-search-copy.ts.
+
+## argentina/importacion-maquinaria-usa
+US-side coordination landing page for importing used machinery from the USA to Argentina, targeting paid search. Meridian's scope is US/Canada pickup, packing, export docs, USDA APHIS o CFIA phytosanitary origin certificate, and ocean freight booking; Argentine nationalization, duties/VAT, the SIM (Malvina) declaration, and SENASA AFIDI stay with the buyer's customs broker. Reflects Decreto 273/2025 (CIBU replaced by a SIM sworn declaration) without overclaiming, and keeps the calculator framed as a logistics-leg reference.
+
+## argentina/flete-cosechadoras-usa
+US-side coordination landing page for shipping used combine harvesters from the USA to Argentina, targeting paid search. Meridian's scope covers US/Canada pickup, header/platform disassembly, packing, export docs, USDA APHIS o CFIA phytosanitary origin certificate, and flat rack/RoRo ocean booking; Argentine nationalization, duties/VAT, the SIM (Malvina) declaration, and SENASA AFIDI remain with the buyer's customs broker. AFIDI is presented as conditional ('may require'), and the calculator is framed as a logistics-leg reference, never a final landed cost.
+
+## bolivia/importacion-maquinaria-usa
+Bolivia paid-search landing page for used machinery import from the US. Meridian scopes only the US/Canada-side coordination, export documentation, origin phytosanitary certificate, and ocean freight booking; nationalization, duties/IVA, customs registration, SENASAG handling, Pacific-port transit, and inland delivery are explicitly the destination despachante's responsibility. Copy deliberately avoids the expired Law 1613/2025 IVA incentive and 10-year age cap, makes no Arica transit or free-storage guarantee, and frames SENASAG as conditional and the calculator as a logistics-leg reference only.
+
+## bolivia/flete-equipo-pesado-usa
+Bolivia paid-search landing page for heavy/out-of-gauge equipment freight from the US. Meridian scopes only US/Canada-side pickup, OOG handling, export documentation, origin phytosanitary certificate, and ocean freight booking (flat rack/RoRo/project cargo); nationalization, duties/IVA, customs registration, SENASAG, Pacific-port transit, and heavy inland transport are the destination despachante's responsibility. Copy avoids the expired Law 1613/2025 IVA incentive and 10-year age cap, makes no Arica transit or free-storage guarantee, treats SENASAG as conditional, and frames the calculator as a logistics-leg reference only.
+
+## paraguay/importacion-maquinaria-usa
+Spanish (neutral LATAM) landing page for Paraguay buyers importing used machinery from the US/Canada. Meridian coordinates the origin leg only — assisted purchase, pickup, packing, export docs, phytosanitary certificate of origin, and ocean freight booking — while nationalization, duties, taxes, SENAVE final inspection, and admissibility stay with the destination despachante. Compliance copy leads with Ley 7565/2025's phytosanitary/risk-mitigation framing, treats the 5-year age cap as one provision with a mandatory 'admissibility is decided by SENAVE/MIC/DNIT via your broker, not by age' disclaimer, avoids article numbers, exact promulgation dates, and any biodiversity-tax formula or amount.
+
+## paraguay/flete-cosechadoras-usa
+Spanish (neutral LATAM) landing page for Paraguay buyers shipping used combine harvesters from the US/Canada. Meridian coordinates the origin leg only — assisted purchase, pickup, header removal, packing, export docs, phytosanitary certificate of origin, and ocean freight booking — while nationalization, duties, taxes, SENAVE final inspection, and admissibility stay with the destination despachante. Compliance copy leads with Ley 7565/2025's phytosanitary/risk-mitigation framing, stresses combine-specific cleanliness (header, hopper), treats the 5-year cap as one provision with the mandatory 'admissibility decided by SENAVE/MIC/DNIT via your broker, not by age' disclaimer, and avoids article numbers, exact promulgation dates, and any biodiversity-tax formula or amount.
+
+## chile/importacion-maquinaria-usa
+Paid-search landing page for buyers in Chile importing used machinery from the US/Canada. Frames Meridian as the US-side export coordinator (assisted purchase, pickup, packing, USDA APHIS o CFIA phyto certificate of origin, ocean booking) while keeping nationalization, duties, customs clearance, and SAG inspection-on-arrival explicitly on the buyer's Chilean despachante. Reflects SAG Resolution 3.103/2016: used machinery must arrive clean and free of soil, plant residue, and regulated pests; SAG inspects on entry, with no pre-approval and possible corrective costs or re-export if it fails.
+
+## chile/flete-equipo-pesado-usa
+Paid-search landing page for buyers in Chile shipping heavy/oversized equipment from the US/Canada. Positions Meridian as the US-side freight and export coordinator (pickup, measuring, dismantling, packing, USDA APHIS o CFIA phyto certificate of origin, and ocean booking via container, flat rack, RoRo, or project cargo by dimensions), while customs clearance, duties, taxes, SAG inspection-on-arrival, and inland delivery remain with the Chilean despachante. Honors SAG Resolution 3.103/2016: used equipment must arrive clean and free of soil, plant residue, and regulated pests; SAG inspects on entry with no pre-approval and possible corrective costs or re-export if it fails. Port stated as San Antonio or Valparaíso depending on carrier, cargo, and destination, never mandatory.
+
+## uruguay/importacion-maquinaria-usa
+Spanish (neutral LATAM) landing page for importing used machinery from the USA to Uruguay. Meridian coordinates the US-side scope (assisted purchase, pickup, packing, export docs, USDA APHIS o CFIA phytosanitary cert, ocean freight booking, typically via Montevideo); nationalization, NCM classification, and taxes are the destination despachante's (ADAU) responsibility. Copy never promises customs clearance, admissibility, duties/taxes, or a final landed cost, and correctly attributes the 2% TGA to Decreto 426/011 (capital goods BK/BIT only) per DGSA Res 98/016 and Aduanas guidance.
+
+## uruguay/flete-cosechadoras-usa
+Spanish (neutral LATAM) landing page for shipping combine harvesters from the USA to Uruguay. Meridian handles the US-side scope (assisted purchase, pickup, header removal/measurement, packing, export docs, USDA APHIS o CFIA phytosanitary cert, ocean freight booking on flat rack or project cargo, typically via Montevideo); nationalization, NCM classification, and taxes belong to the destination despachante (ADAU). Copy stresses combine-specific origin cleaning (hopper, augers, header) per DGSA Res 98/016, never guarantees admissibility, customs clearance, duties, delivery dates, or final landed cost, and correctly limits the 2% TGA to capital goods BK/BIT under Decreto 426/011 with no US Mercosur preference.
+
diff --git a/docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md b/docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md
new file mode 100644
index 0000000..a9fb863
--- /dev/null
+++ b/docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md
@@ -0,0 +1,223 @@
+# Design: LATAM Paid-Search Destination Routes (Gate B Website Work)
+
+**Date:** 2026-06-22
+**Branch:** `feat/latam-paid-search-destinations`
+**Status:** Design — awaiting user approval before implementation plan
+**Repo:** `/Users/zaytsev/Documents/Projects/Active/meridian-freight-website`
+**Production domain:** `https://meridianexport.com`
+**Implementation mode:** isolated branch + preview ONLY. Gate B remains **HOLD**.
+
+This design supersedes the ChatGPT Pro spec (`Meridian Freight Google Ads Gate B Web.md`) wherever the Pro spec conflicts with verified repo reality. The Pro spec is treated as a **content/copy and contract source**, not a file-level build instruction. Every prescription below was verified by an 11-agent research workflow (regulatory citations ×5, repo reuse audit, attribution plan, Next.js routing, workbook payload contract, shipped-LATAM-pattern audit, adversarial critic). Divergences from the Pro spec are enumerated in §13.
+
+---
+
+## 1. Goal & Scope
+
+Build **10 Spanish paid-search destination pages** at `/es/destinations/{country}/{segment}` as a data-driven system inside the existing Meridian site, and close the attribution gap so Google click IDs + UTMs + route context persist into the lead handoff. These are the landing destinations for the 10 paused Gate A Google Ads campaigns (account `378-300-2123`).
+
+### The 10 routes (curated subset — NOT the full 5×2 product)
+| Country | machinery_import | second segment |
+|---------|------------------|----------------|
+| Argentina (AR) | `importacion-maquinaria-usa` | `flete-cosechadoras-usa` (combine) |
+| Bolivia (BO) | `importacion-maquinaria-usa` | `flete-equipo-pesado-usa` (heavy) |
+| Paraguay (PY) | `importacion-maquinaria-usa` | `flete-cosechadoras-usa` (combine) |
+| Chile (CL) | `importacion-maquinaria-usa` | `flete-equipo-pesado-usa` (heavy) |
+| Uruguay (UY) | `importacion-maquinaria-usa` | `flete-cosechadoras-usa` (combine) |
+
+Invalid combinations (e.g. `argentina/flete-equipo-pesado-usa`, `chile/flete-cosechadoras-usa`) must `notFound()`.
+
+### In scope
+- 10 routes + metadata + JSON-LD, served by one shared renderer.
+- One validated route registry (10 immutable records) + lookup/static-params/invariants.
+- Country/segment-specific Spanish copy (drafted by us; **native LATAM review arranged by client** before go-live).
+- Attribution capture extension (click IDs + full UTM set + server-derived route context).
+- Lean opaque `whatsapp_ref` + a paid-search lead Server Action emitting the complete contract-compliant payload.
+- Additive Supabase `leads` migration for the new fields.
+- Synthetic-lead test proving persistence + trust-boundary + dedupe.
+- Route/metadata/a11y/AdsBot/message-match/attribution QA on preview.
+
+### Out of scope (downstream-owned or Gate-B-gated)
+- QQO evaluator + CRM/router adapter (website only **emits** the payload; qualification/routing live downstream).
+- Google Ads campaign activation, budget/bid/conversion-action changes, conversion uploads.
+- Production deploy; Meta/WABA/router/CRM mutation; real customer messaging.
+- Any promise of customs clearance, admissibility, duties, taxes, delivery dates, or landed cost.
+- Equipment inventory / pricing / checkout / seller-like pages.
+
+### Hard boundaries (Gate B HOLD)
+Branch + preview only. No production deploy. No external mutations. Preview env already disables analytics/Slack/CAPI (per `CLAUDE.md`); the synthetic test mocks **all** external emitters so no real send occurs. No Google Ads conversion action is created; no `MERIDIAN_QQO` upload — diagnostic events only.
+
+---
+
+## 2. Source Hierarchy
+
+1. **Canonical Google Ads Ops Workbook** — route mapping, attribution/cross-channel **contract**, launch gates. The operating tracker; not replaced.
+2. **Repo reality** (`CLAUDE.md` + actual code) — **wins on all file/route/API/component decisions.** This is where the Pro spec is overridden.
+3. **ChatGPT Pro spec** — copy drafts, page-section intent, field model. Content source, *not* a file map.
+4. **Live production site + shipped LATAM hubs** — visual + claim consistency (the new pages must not contradict shipped hubs).
+5. **Official country government/customs/agriculture sources** — regulatory caveats (all verified, §7).
+
+---
+
+## 3. Route Architecture (verified against Next.js source)
+
+The Pro spec's `app/[locale]/destinations/[country]/[segment]/page.tsx` is **not buildable**: the repo already has a dynamic `[slug]` at that level (Next.js forbids two differently-named dynamic segments as siblings), and the static `argentina/` folder **shadows** any dynamic sibling for its whole subtree (verified via Next.js `sortable-routes.ts`: static specificity 0 beats dynamic 1, left-to-right, no fall-through). Verified two-file structure:
+
+```
+app/[locale]/destinations/
+├── page.tsx                          # KEEP (index)
+├── [slug]/page.tsx                   # KEEP (country hubs: bolivia/chile/paraguay/uruguay + kazakhstan)
+├── [slug]/[segment]/page.tsx         # NEW → serves BO/CL/PY/UY paid-search children (reuses [slug] param)
+├── argentina/page.tsx                # KEEP (static AR hub)
+└── argentina/[segment]/page.tsx      # NEW → serves AR paid-search children (under the static parent)
+```
+
+- Both new files render the **same** shared renderer and resolve the **same** route registry. `[segment]` under two different parents (`[slug]/` vs `argentina/`) is allowed and is the correct/consistent choice.
+- `generateStaticParams`:
+  - `[slug]/[segment]`: enumerate the **8 non-Argentina** records as `{ slug, segment }`. Do **not** include argentina; do **not** emit `locale` (next-intl owns it).
+  - `argentina/[segment]`: enumerate the **2 Argentina** records as `{ segment }` (mirror the existing `argentina/page.tsx` es-only + `permanentRedirect` guard for non-es).
+- Both files call `notFound()` for any routeKey not in the 10-record registry.
+- es-only: non-`es` locale → `permanentRedirect`/`notFound` per the existing argentina pattern. `localePrefix: "as-needed"` means `/es/...` is the correct prefixed path.
+
+---
+
+## 4. Data Model
+
+### `content/latam-paid-search-destinations.ts` (NEW)
+Exactly **10 immutable records** (`as const satisfies readonly LatamPaidSearchDestination[]`), authored explicitly (not a generated cartesian product). Adopt the Pro spec §4.1 TypeScript model, trimmed. Each record carries: `routeKey` (`{country}/{segment}`), `country` (code/slug/name/hub path), `segment` (slug/key/publicName), `seo`, hero/process/scope/quote-readiness/compliance/trust/faq copy, `jsonLd`, `googleAds` message-match, `tracking` defaults, `sourceIds`, `internalLinks`.
+
+### Derived enums (server-side, never from query)
+- `request_type`: `machinery_import → import_coordination_quote`, `combine_shipping → combine_freight_quote`, `heavy_equipment_shipping → heavy_equipment_freight_quote`.
+- **`cargo_class`** (the workbook's primary gap — must be emitted): `combine_shipping → combine`, `heavy_equipment_shipping → heavy_oog`, `machinery_import → general_machinery`. Website emits a segment-derived default; final normalized value is downstream.
+
+### `lib/latam-paid-search-routes.ts` (NEW)
+`getPaidSearchDestination(locale, country, segment)`, `getPaidSearchStaticParams()`, and `assertRouteRegistry()` (throws unless length === 10, routeKeys unique, canonical paths unique). **This Map is the sole server-side source of `country/segment/landing_route/request_type/router_tag/cargo_class`** — the trust boundary.
+
+---
+
+## 5. Rendering & Component Reuse
+
+The reuse audit confirms **nearly all UI already exists**; the work is data + a thin composing renderer + the quote form, not a new design system.
+
+- **Reuse as-is:** `page-hero`, `trust-bar`, `faq-accordion`, `dark-cta`, `breadcrumbs`, `lib/json-ld`, `scroll-reveal`, `tracked-cta-link`, `tracked-contact-link`, `lib/constants` (`COMPANY/CONTACT/SITE/STATS`), and the LATAM JSON-LD/section helpers.
+- **Renderer:** add `components/destinations/latam-paid-search-page.tsx` that **composes the existing primitives** following the shipped `latam-market-page.tsx` section pattern (hero → trust bar → process → included/excluded scope → quote-readiness → compliance → proof → FAQ → official sources → final CTA). Prefer reusing existing sub-blocks over net-new components (Pro spec's 6 `paid-search-*` sub-components are created **only** where no existing block fits).
+- **Quote form:** net-new behavior (shipped hubs convert via WhatsApp + calculator, no inline form). Build a `paid-search-quote-form` (or extend `contact-form`) wired to the new Server Action + `paidSearchLeadSchema`. Do **not** introduce a second analytics/form system.
+
+### Trust/credentials — CRITICAL CORRECTION
+The Pro spec's trust block lists `FMC #024914NF` and `IATA/CNS 01108380000`. **CORRECTION (post-review): these are NOT fabricated.** They exist in `lib/constants.ts:11-12` (`COMPANY.fmcLicense`/`iataCns`) and render **live site-wide** via `messages/{en,es,ru}.json` — footer `trustSignals` and hero `trustEyebrow`, all three locales. Decision: do **not** add them to the new LP *body* (consistent with the shipped LATAM hubs, which don't restate them). But they already appear in the shared footer/hero of every page, **including the new LPs** — a Google Ads Misrepresentation exposure if the registrations are not genuine/current. **Gate-B launch prerequisite (site-wide, owner decision): confirm `024914NF` is a current FMC OTI/NVOCC registration and `01108380000` a current IATA/CNS air-cargo agency code (keep, with precise verifiable framing) OR remove them site-wide from constants + messages.** This is pre-existing (not introduced by this work) and does NOT block preview building. For the LP body, use only verifiable claims, rendered from constants:
+- Verbatim (matches all 4 shipped hubs): **"Meridian ha coordinado más de 1.000 exportaciones a más de 40 países."** (`1.000` with period, `más de 40 países`.)
+- Stats from `STATS` (`projectsCompleted=1000`, `yearsExperience` from `foundedYear=2013`) via `formatCount(n,'es')+'+'` — never hardcoded.
+- `COMPANY.name`, `SITE.name/url`, all `CONTACT` fields imported, never hardcoded.
+- No stars/testimonials/`AggregateRating`; no OEM-dealer claims; no manufacturer logos.
+
+---
+
+## 6. Attribution & Lead Pipeline
+
+### 6.1 Capture — `lib/tracking.ts` (extend, do not replace)
+Add `PAID_CLICK_IDS = [gclid, gbraid, wbraid, fbclid, msclkid]` and `PAID_UTM_KEYS = [...UTM_KEYS, utm_matchtype, utm_network, utm_device]`. Widen `Attribution` with the new optional keys + `referrer` + `capturedAt`. Apply length caps (click IDs ≤256, UTMs ≤512, URL/referrer ≤2048) and strip control/null chars (Pro §9.3). **Keep existing non-paid flows working.**
+
+### 6.2 Cookie/consent reconciliation (security fix)
+Current `mf_attribution` cookie stores raw click IDs/UTMs in a readable cookie — the Pro spec (§9.4) forbids this. New model: write **only an opaque `attribution_id`** to the first-party cookie (`Secure; SameSite=Lax; Path=/; 90d`); store the typed payload (first/latest touch + routeContext) in `sessionStorage` + a self-purging `localStorage` record (`expiresAt`, 90d). Gate persistent writes on the **existing** consent state (`hasConsent()`); memory/session-only when not accepted. Do not invent a second consent policy. Verify the existing contact/calculator flows that read `mf_attribution` still work.
+
+### 6.3 `lib/lead-attribution.ts` (NEW)
+Typed model + helpers: `parsePaidTouch(url)` (allowlist-only, sanitized, capped), `mergePaidAttribution()` (Pro §9.5 — preserve first touch; update latest only on a paid signal; a direct visit never overwrites a paid touch; always refresh routeContext), `generateAttributionId()`.
+
+### 6.4 Server Actions (NOT API routes — repo uses Server Actions)
+- `app/actions/whatsapp-ref.ts` → `createWhatsAppRef({routeKey, attributionId, firstTouch, latestTouch})`: validate routeKey against registry, generate `lead_id` + opaque ref, persist attribution, return `{lead_id, whatsapp_ref, expires_at}`. **Idempotent per `attributionId+routeKey`** (no lead-per-click; reused across repeated CTA clicks).
+- `app/actions/paid-search-lead.ts` → `submitPaidSearchLead(raw, locale)`: mirror the proven `contact.ts`/`calculator-v3.ts` pipeline exactly — Zod validate → honeypot → **rederive route context server-side from routeKey (discard client `country/segment/...`)** → Google Ads tag guard → identity/dedupe (`idempotency_key === lead_id`) → best-effort Supabase REST insert → Resend owner email (must-succeed) → `after()` background block (Spanish auto-reply, Slack, CAPI `Lead`, Vercel diagnostic). Diagnostic events only; no Ads upload.
+
+### 6.5 `whatsapp_ref` format
+`MF-` + 8 Crockford base32 chars (no I/L/O/U) from a random token → e.g. `MF-A7K29XQ4` (≤32, URL-safe, opaque). Random token, **not** an encoding of click IDs. Server stores `whatsapp_ref → {lead_id, attribution_id, payload, expires_at(90d)}`. Visible WhatsApp text contains only `#FRT_ES` + intent + placeholders + `Ref: {{whatsapp_ref}}` — never gclid/gbraid/wbraid/fbclid/UTMs. Phone from `CONTACT` (never duplicated in records). On failure: open plain WhatsApp/form, record diagnostic, do not claim a tracked handoff.
+
+### 6.6 Migration — `supabase/migrations/<ts>_add_paid_search_lead_attribution.sql`
+Additive `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (mirror `20260420230000_add_calculator_v3_metadata.sql`): `gclid, gbraid, wbraid, fbclid, msclkid, utm_matchtype, utm_network, utm_device, attribution_id, whatsapp_ref, lead_id, idempotency_key (UNIQUE), country, segment, cargo_class, landing_route, request_type, router_tag, source_platform, source_account_id, google_ads_tag, first_touch (jsonb), latest_touch (jsonb), schema_version, consent_version, paid_search_metadata (jsonb default '{}')`. Action tolerates missing columns (retry without `paid_search_metadata`, like calculator-v3).
+
+### 6.7 Payload contract (complete — closes the workbook gap)
+Emit all website-owned fields: identity (`schema_version='paid-search-lead-v1', lead_id, idempotency_key, attribution_id, whatsapp_ref`), source (`source_platform='google_ads', source_account_id='3783002123', google_ads_tag`), **all** click IDs + UTMs, route-derived (`country, segment, cargo_class, landing_route` + alias **`page_route`**, `request_type, router_tag`), `first_touch/latest_touch` (+ `first_seen_at/last_seen_at/created_at` aliases), equipment + contact fields, `consent_version`. Confirm `fbclid` rides through. **Downstream-owned (do NOT populate at submit):** `opportunity_id, conversation_id, routed_domain, router_version, accepted_qqo_at, campaign_id/ad_group_id/ad_id, final qualified cargo_class`.
+
+### 6.8 Google Ads tag guard
+`AW-17952470509` lives only in the Pro spec; repo `NEXT_PUBLIC_GOOGLE_ADS_ID` is **empty**. Do **not** hardcode. Add `assertGoogleAdsTagMatches(routeTag)` comparing runtime `TRACKING.googleAdsId` to the record's expected `googleAdsTag`; on mismatch/absent → record diagnostic + **hold** readiness (never add a conversion action, never throw).
+
+---
+
+## 7. Content & Compliance (all citations verified 2026-06-22)
+
+Per-country copy is drafted from the Pro spec §7, corrected against verified constraints below, paired with an **English internal version**, and **gated on client-arranged native review** before go-live. Each record stores a per-country **copy-constraint checklist** (prohibited phrases + required caveats) enforced by the message-match QA gate (§10). All claims stay consistent with the shipped hubs.
+
+- **Argentina** — Decreto 273/2025, AFIDI, SENASA control all **confirmed current**. Keep "removed CIBU as prior mechanism, controls remain"; AFIDI conditional (`puede requerir`), gestionado via SIGPV-IMPO *before* purchase. Prohibited: `importación libre`, `sin requisitos`, `aduana incluida`, "every machine admissible", implying Meridian handles AFIDI/Malvina/nationalization. **Fix:** update `content/argentina-market.ts` AFIDI link (~line 172) to the canonical URL (`gestionar-...-la-evaluacion-de`) so the new LP and the hub match.
+- **Bolivia** — Aduana + SENASAG sources confirmed. **Do NOT inherit the shipped hub's expired Ley 1613/2025 IVA incentive / 10-yr age limit / Arica transit / free-storage / fixed inland route.** SENASAG strictly conditional (`puede aplicar`, broker-confirmed); avoid "registro online sin trámite presencial" (only occasional-importer is fully online).
+- **Paraguay** — Ley 7565/2025 + DNIT/SENAVE/MIC confirmed (BACN 403 = bot block, corroborated). **Soften:** specific article numbers (Art 4/5/7), exact promulgation/effective date, and the biodiversity-fee name/formula (hedge — "confirma su despachante"). Lead with the law's phytosanitary framing; transit times/route = estimates, not commitments; pair every 5-year claim with the admissibility disclaimer.
+- **Chile** — SAG Res 3103/2016 **vigente**; attribute the cleanliness/inspection/re-export claim **only** to CL-01. SAG = "inspección al ingreso", never "aprobado"/guaranteed entry. Port = "San Antonio o Valparaíso", never mandatory. Use "plagas reglamentadas".
+- **Uruguay** — Res 98/016 confirmed. **Attribute the 2% TGA to Decreto 426/011, not the Aduanas TGA hub URL.** No universal tariff/landed cost, no guaranteed DGSA acceptance, no guaranteed Montevideo routing.
+
+Shared scope discipline (all pages): Meridian = compra asistida + retiro + medición + desmontaje/embalaje + documentación de exportación + certificado fitosanitario de origen (USDA APHIS/CFIA) + reserva marítima. Out = nationalization, despachante fees, duties/IVA, destination phyto-inspection, interior delivery. Calculator framed as "referencia del tramo logístico", never final landed cost.
+
+---
+
+## 8. SEO / Metadata
+New paid-search metadata helper (or extend `latam-market-metadata`): absolute **production** canonical = `SITE.url + landing_route` **even when QA runs on preview** (never a self-referencing preview canonical); `es` as the only language alternate (no en/ru for these paid routes; document x-default); `OG url == canonical == JSON-LD url`. JSON-LD: `Service` + `BreadcrumbList` + `FAQPage` only, `Service.provider` referencing the org node — **no** `Product`/`Offer`/`Review`/`AggregateRating`. Unique title + meta description per route (120–160 chars).
+
+## 9. Accessibility
+Single `H1` per page, ordered `H2/H3`; external source links with `aria-label` + `rel="noopener noreferrer"` + visible external-link affordance; WhatsApp vs calculator CTAs distinguishable by accessible name, not color; ≥44px touch targets; `prefers-reduced-motion` respected on `ScrollReveal`; Spanish long-word wrap handled (mobile).
+
+## 10. QA & Test Matrix
+- **Routing/data:** exactly 10 records; unique routeKeys + canonical paths (`assertRouteRegistry`); static params generate exactly the 10; invalid combos → 404 (test ≥3); non-es not generated.
+- **Metadata:** unique title/description; canonical = production URL; valid Service/Breadcrumb/FAQPage; no Product/Offer/Review/AggregateRating.
+- **Attribution persistence (key proof):** spy on `fetch` to `/rest/v1/leads`; assert every contract field persists (all click IDs incl. gbraid/wbraid/fbclid, full UTM set, attribution_id, whatsapp_ref, lead_id, idempotency_key===lead_id, source_*, first/latest touch jsonb, cargo_class, page_route, schema_version, consent_version).
+- **Trust boundary:** submit `routeKey=argentina/...` with malicious client `country=CL, segment=heavy` → assert persisted `country=AR` and registry-derived segment/cargo_class.
+- **Dedupe:** two submits same `lead_id` → second is no-op, same lead.
+- **`whatsapp_ref`:** matches `^MF-[0-9A-HJKMNP-TV-Z]{6,}$`, ≤32, URL-safe; prefill contains ref once and **no** click-ID/UTM substring; idempotent per attribution_id+routeKey.
+- **Google Ads tag:** unset → records mismatch, does not throw, no conversion action.
+- **No-side-effect:** all external emitters (Resend, CAPI, Slack, Vercel) mocked; assert no real send; owner email routed to test address in synthetic runs.
+- **Message-match gate:** first viewport includes EE.UU. + country + equipment + customs-responsibility separation; fail if a launch-candidate RSA claim is unsupported/contradicted or a prohibited phrase appears.
+- **AdsBot/mobile/HTTP smoke:** preview returns 200, prerendered (no empty client shell), no unexpected redirect/legacy-domain hop.
+Use the repo's package manager + `vitest run`; mirror `app/actions/__tests__/contact.test.ts` harness.
+
+## 11. Gate B Readiness Boundaries
+Branch + preview only. Stop before: production deploy, Google Ads/Meta/WABA/router/CRM mutation, conversion-action creation, conversion upload, customer messaging. After implementation: update the workbook Gate B Control Room evidence (route QA + attribution dry-run results). Activation stays HOLD pending explicit user approval.
+
+## 12. Phasing
+- **P1 — Routing + data model + renderer:** two route files, registry, shared renderer composing existing primitives; 10 pages render (English-internal placeholder copy), invalid → 404. Tests: route invariants.
+- **P2 — Content + compliance + SEO:** per-country Spanish + EN-internal copy with verified caveats; JSON-LD; AR hub URL fix; metadata helper. Gate: client native review.
+- **P3 — Attribution + lead pipeline:** tracking.ts extension + cookie/consent fix; `lead-attribution.ts`; migration; two Server Actions; quote form; Google Ads guard. Tests: persistence/trust-boundary/dedupe/ref/no-side-effect.
+- **P4 — QA + evidence:** a11y/AdsBot/message-match/mobile on preview; workbook evidence update. Present preview to user.
+Each phase = branch/preview; user reviews preview; nothing to prod.
+
+## 13. Explicit divergences from the ChatGPT Pro spec (with reasons)
+1. **Route files:** `[slug]/[segment]` + `argentina/[segment]` (not `[country]/[segment]`) — Next.js dynamic-name + static-shadow rules (verified).
+2. **API routes → Server Actions:** `submitPaidSearchLead` + `createWhatsAppRef` replace `app/api/leads` + `app/api/attribution/whatsapp-ref` — repo/`CLAUDE.md` mandate Server Actions; an API lead endpoint would be a second system.
+3. **FMC/IATA numbers NOT added to LP body** — but they are real constants rendered site-wide (footer/hero, all locales); the earlier "fabricated" claim was wrong (see §5 correction). LP body uses only `STATS`-backed claims; the site-wide registration **verify-or-remove is a Gate-B launch prerequisite** (owner decision).
+4. **Lean attribution + `whatsapp_ref`** — extend the single tracker + opaque-id cookie; no 5-layer state machine; no lead-per-click.
+5. **`cargo_class` added + `page_route` aliased** — required by the workbook, absent from the Pro spec.
+6. **Google Ads tag is a runtime-compared guard, not a hardcoded literal.**
+7. **CRM/QQO evaluator out of scope** — website emits the payload; qualification/routing downstream.
+8. **Per-country copy corrected** to verified caveats (esp. BO expired-incentive, PY unverified articles/fee, CL SAG/port, UY 2%→Decreto 426/011) + native-review publish gate.
+
+## 14. Open risks (tracked; mitigations in-spec)
+Native Spanish review is a hard publish gate. The FMC/IATA registration verify-or-remove is a Gate-B launch prerequisite (§5, §15). Attribution must be actively wired into the new payload and dedupe must truly no-op (§15). The additive migration's `UNIQUE idempotency_key` must land or the action falls back to a pre-insert SELECT (§15).
+
+## 15. Review Remediation (post 5-lens panel, 2026-06-22)
+The independent review (design-system, architecture, attribution/security, compliance, spec-quality) rated **all 5 lenses approve-with-minor-fixes**; architecture, routing, trust boundary, phasing, and Gate-B boundaries verified **sound** against the repo. These amendments are binding and supersede any conflicting text above.
+
+### Blocker (resolved in-spec; one owner action)
+- **FMC/IATA premise corrected** (§5, §13.3). Owner action before Gate-B traffic: verify the registrations are genuine/current OR remove site-wide. Pre-existing condition; not a preview-build blocker.
+
+### Majors
+- **Quote-form design contract (anti-drift):** prefer **extending `components/contact-form.tsx`**; do NOT author a new form layout. Reuse `components/ui/{input,label,button,textarea}` with contact-form's class vocabulary (`space-y-5`, `grid gap-5 sm:grid-cols-2`, Input `mt-1.5`, submit = `<Button>` default/primary `w-full rounded-xl`). No custom field styling, no hardcoded colors.
+- **Attribution must be ACTIVELY wired into the payload:** no existing submit path reads the `mf_attribution` cookie (contact-form + calculator read UTMs fresh from `window.location.search` at submit). DROP the moot "verify existing flows read the cookie" target. ADD acceptance criterion: the paid-search page reads the typed attribution payload (sessionStorage/localStorage) and passes it into `submitPaidSearchLead`; the synthetic test asserts captured attribution actually reaches the POST body.
+- **Dedupe must truly no-op:** the proven insert (`Prefer: return=minimal`, no `on_conflict`) turns a duplicate into an HTTP 409 logged as a generic failure while the must-succeed owner email + `after()` Slack/CAPI still fire (duplicate emails/events). Fix: POST `/rest/v1/leads?on_conflict=idempotency_key` with `Prefer: resolution=ignore-duplicates,return=minimal` (or a pre-insert SELECT by `lead_id`); gate the owner email + `after()` side-effects on whether a NEW row was inserted. §10 dedupe test asserts NO second owner email/CAPI/Slack.
+
+### Minors (binding)
+- **§5 token-only rule:** design tokens only (`bg-primary`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border`) + the established accent vocabulary already in shipped hubs (emerald=included, sky=info, amber/rose=caution/excluded). No hardcoded hex/rgb, no new color families, no new font (Geist Sans/Mono via `@theme`).
+- **§5 hero pinned:** `<PageHero variant="dark" locale="es">` with the same eyebrow/heading/description/rightContent + emerald/sky/amber scope-card composition as `latam-market-page.tsx`.
+- **§3 routing file:** locale middleware is **`middleware.ts`** (repo root) — **`proxy.ts` does NOT exist**. The project `CLAUDE.md` is STALE on this (claims proxy.ts) — flag for separate correction.
+- **UI stack:** shadcn **`base-nova`** style over **`@base-ui/react`** primitives (not new-york/Radix). `CLAUDE.md` is STALE here too.
+- **§3 AR es-only parity + per-segment guard:** `argentina/[segment]` relies on in-page `permanentRedirect` for non-es (es canonical; en/ru not generated), consistent with argentina already absent from the EN destinations set. Each new segment page guards `locale === 'es'` at request time (generateStaticParams stops prerender, but direct hits need a runtime guard); `argentina/[segment]` returns only `{segment}`.
+- **§10/§11 no-side-effect via MOCKING, not env:** Slack (`lib/slack.ts`) + Meta CAPI (`lib/meta-capi.ts`) are gated only by env-var presence. The synthetic test MUST mock Resend/CAPI/Slack/Vercel and route owner email to a test address so the must-succeed path cannot send.
+- **§6 sink hygiene:** new attribution fields (click IDs/UTMs) pass through `escapeHtml()` at the owner-email render site and are treated as untrusted in Slack text — capture-time caps are not sufficient for HTML/Slack sinks.
+- **§6.2 note:** `attribution_id` is intentionally non-HttpOnly (opaque, client-generated, no click IDs); sensitive payload stays server-side/session-only.
+- **§7 cross-surface consistency:** `content/destinations.ts` uses "importación libre"/"importación libre de aranceles" for Chile (line 567) and Mexico (470,473). Hedge the Chile duty-free claim to match the new CL LP framing so paid traffic doesn't see contradictory admissibility claims one click apart.
+- **§5/§10 quote caveat:** the quote-readiness/form block carries the customs-responsibility caveat adjacent to the CTA (Meridian = origen→puerto; nacionalización/tributos/AFIDI/SAG/DGSA/SENASAG confirmed by despachante); add a §10 message-match assertion.
+- **§10 whatsapp_ref regex:** `^MF-[0-9A-HJKMNP-TV-Z]{8}$` (exactly 8), matching the §6.5 generator.
+- **§1/§6.7 account id:** `378-300-2123` (hyphenated, Google Ads UI) === `3783002123` (digits-only, `source_account_id`) — same account, two representations.
+- **§6.6 migration degradation:** the additive migration adds ~28 typed columns incl. `idempotency_key UNIQUE` + the jsonb; if the UNIQUE constraint is absent (partially-applied migration), fall back to a pre-insert SELECT by `lead_id` so lead capture never breaks (retry-tolerance must cover more than the jsonb column).
diff --git a/lib/__tests__/latam-paid-search-routes.test.ts b/lib/__tests__/latam-paid-search-routes.test.ts
new file mode 100644
index 0000000..5151b8e
--- /dev/null
+++ b/lib/__tests__/latam-paid-search-routes.test.ts
@@ -0,0 +1,91 @@
+import { describe, expect, it } from "vitest";
+import {
+  LATAM_PAID_SEARCH_DESTINATIONS,
+} from "@/content/latam-paid-search-destinations";
+import {
+  assertRouteRegistry,
+  getArgentinaPaidSearchStaticParams,
+  getPaidSearchDestination,
+  getPaidSearchStaticParams,
+} from "@/lib/latam-paid-search-routes";
+
+describe("latam paid-search route registry", () => {
+  it("contains exactly 10 records (ROUTE-001)", () => {
+    expect(LATAM_PAID_SEARCH_DESTINATIONS).toHaveLength(10);
+  });
+
+  it("has unique route keys (ROUTE-002)", () => {
+    const keys = LATAM_PAID_SEARCH_DESTINATIONS.map((r) => r.routeKey);
+    expect(new Set(keys).size).toBe(keys.length);
+  });
+
+  it("has unique canonical paths matching the route (ROUTE-003)", () => {
+    const paths = LATAM_PAID_SEARCH_DESTINATIONS.map((r) => r.seo.canonicalPath);
+    expect(new Set(paths).size).toBe(paths.length);
+    for (const r of LATAM_PAID_SEARCH_DESTINATIONS) {
+      expect(r.seo.canonicalPath).toBe(
+        `/es/destinations/${r.country.slug}/${r.segment.slug}`,
+      );
+    }
+  });
+
+  it("registry invariants hold (assertRouteRegistry does not throw)", () => {
+    expect(() => assertRouteRegistry()).not.toThrow();
+  });
+
+  it("derives cargo_class and request_type consistently from segment", () => {
+    const expected: Record<string, { cargoClass: string; requestType: string }> = {
+      machinery_import: { cargoClass: "general_machinery", requestType: "import_coordination_quote" },
+      combine_shipping: { cargoClass: "combine", requestType: "combine_freight_quote" },
+      heavy_equipment_shipping: { cargoClass: "heavy_oog", requestType: "heavy_equipment_freight_quote" },
+    };
+    for (const r of LATAM_PAID_SEARCH_DESTINATIONS) {
+      expect(r.segment.cargoClass).toBe(expected[r.segment.key].cargoClass);
+      expect(r.segment.requestType).toBe(expected[r.segment.key].requestType);
+    }
+  });
+});
+
+describe("getPaidSearchDestination (ROUTE-002 / lookup + locale)", () => {
+  it("resolves all 10 valid es combos", () => {
+    for (const r of LATAM_PAID_SEARCH_DESTINATIONS) {
+      const found = getPaidSearchDestination("es", r.country.slug, r.segment.slug);
+      expect(found?.routeKey).toBe(r.routeKey);
+    }
+  });
+
+  it("returns null for invalid country/segment combos (ROUTE-005)", () => {
+    expect(getPaidSearchDestination("es", "argentina", "flete-equipo-pesado-usa")).toBeNull();
+    expect(getPaidSearchDestination("es", "chile", "flete-cosechadoras-usa")).toBeNull();
+    expect(getPaidSearchDestination("es", "bolivia", "flete-cosechadoras-usa")).toBeNull();
+  });
+
+  it("returns null for non-es locales (ROUTE-006)", () => {
+    expect(getPaidSearchDestination("en", "argentina", "importacion-maquinaria-usa")).toBeNull();
+    expect(getPaidSearchDestination("ru", "argentina", "importacion-maquinaria-usa")).toBeNull();
+  });
+});
+
+describe("static params (ROUTE-004)", () => {
+  it("dynamic [slug]/[segment] returns the 8 non-Argentina combos", () => {
+    const params = getPaidSearchStaticParams();
+    expect(params).toHaveLength(8);
+    expect(params.every((p) => p.slug !== "argentina")).toBe(true);
+  });
+
+  it("argentina/[segment] returns the 2 Argentina segments", () => {
+    const params = getArgentinaPaidSearchStaticParams();
+    expect(params).toHaveLength(2);
+    expect(params.map((p) => p.segment).sort()).toEqual(
+      ["flete-cosechadoras-usa", "importacion-maquinaria-usa"],
+    );
+  });
+
+  it("dynamic + argentina static params together cover all 10 routes exactly once", () => {
+    const dyn = getPaidSearchStaticParams().map((p) => `${p.slug}/${p.segment}`);
+    const ar = getArgentinaPaidSearchStaticParams().map((p) => `argentina/${p.segment}`);
+    const all = [...dyn, ...ar].sort();
+    const expected = LATAM_PAID_SEARCH_DESTINATIONS.map((r) => r.routeKey).sort();
+    expect(all).toEqual(expected);
+  });
+});
diff --git a/lib/__tests__/lead-attribution.test.ts b/lib/__tests__/lead-attribution.test.ts
new file mode 100644
index 0000000..7df1300
Binary files /dev/null and b/lib/__tests__/lead-attribution.test.ts differ
diff --git a/lib/__tests__/whatsapp-prefill.test.ts b/lib/__tests__/whatsapp-prefill.test.ts
new file mode 100644
index 0000000..a898c61
--- /dev/null
+++ b/lib/__tests__/whatsapp-prefill.test.ts
@@ -0,0 +1,32 @@
+import { describe, expect, it } from "vitest";
+import { buildWhatsAppUrl, interpolateWhatsAppRef } from "@/lib/whatsapp-prefill";
+
+const TEMPLATE =
+  "#FRT_ES Hola, quiero cotizar importación de maquinaria desde EE. UU. a Argentina. Equipo: [marca/modelo/año]. Ref: {{whatsapp_ref}}";
+
+describe("interpolateWhatsAppRef", () => {
+  it("inserts the opaque ref once and leaves no placeholder", () => {
+    const out = interpolateWhatsAppRef(TEMPLATE, "MF-A7K29XQ4");
+    expect(out).toContain("Ref: MF-A7K29XQ4");
+    expect(out).not.toContain("{{whatsapp_ref}}");
+  });
+
+  it("strips the Ref tail when no ref is available (fallback)", () => {
+    const out = interpolateWhatsAppRef(TEMPLATE);
+    expect(out).not.toContain("{{whatsapp_ref}}");
+    expect(out).not.toMatch(/Ref:/);
+    expect(out).toContain("#FRT_ES");
+  });
+
+  it("never contains click-ID or UTM substrings", () => {
+    const out = interpolateWhatsAppRef(TEMPLATE, "MF-A7K29XQ4");
+    expect(out).not.toMatch(/gclid|gbraid|wbraid|fbclid|utm_/i);
+  });
+});
+
+describe("buildWhatsAppUrl", () => {
+  it("uses digits-only phone and URL-encodes the text", () => {
+    const url = buildWhatsAppUrl("+1 (641) 516-1616", "hola #FRT_ES Ref: MF-X");
+    expect(url).toBe("https://wa.me/16415161616?text=hola%20%23FRT_ES%20Ref%3A%20MF-X");
+  });
+});
diff --git a/lib/google-ads-tag.ts b/lib/google-ads-tag.ts
new file mode 100644
index 0000000..0b62a57
--- /dev/null
+++ b/lib/google-ads-tag.ts
@@ -0,0 +1,28 @@
+/**
+ * Google Ads tag guard (spec §6.8, §9.13).
+ *
+ * The expected tag lives in config; the runtime value comes from env
+ * (NEXT_PUBLIC_GOOGLE_ADS_ID). We NEVER hardcode the live tag — instead we
+ * compare runtime vs expected and report a mismatch so preview QA can HOLD
+ * readiness. We never throw and never add a conversion action here.
+ */
+
+import { TRACKING } from "@/lib/constants";
+
+export const EXPECTED_GOOGLE_ADS_TAG = "AW-17952470509";
+
+export interface GoogleAdsTagCheck {
+  ok: boolean;
+  runtime: string;
+  expected: string;
+  reason: "match" | "absent" | "mismatch";
+}
+
+export function assertGoogleAdsTagMatches(
+  expected: string = EXPECTED_GOOGLE_ADS_TAG,
+): GoogleAdsTagCheck {
+  const runtime = TRACKING.googleAdsId;
+  if (!runtime) return { ok: false, runtime, expected, reason: "absent" };
+  if (runtime !== expected) return { ok: false, runtime, expected, reason: "mismatch" };
+  return { ok: true, runtime, expected, reason: "match" };
+}
diff --git a/lib/latam-paid-search-routes.ts b/lib/latam-paid-search-routes.ts
new file mode 100644
index 0000000..3e35f22
--- /dev/null
+++ b/lib/latam-paid-search-routes.ts
@@ -0,0 +1,82 @@
+/**
+ * Server-side route registry for the LATAM paid-search destination pages.
+ *
+ * This Map is the SOLE source of truth for country/segment/landing_route/
+ * request_type/cargo_class (spec §4, §15 trust boundary). The lead Server
+ * Action (P3) must rederive these from the routeKey here and NEVER trust
+ * client-sent values, so `?country=CL` cannot poison an Argentina lead.
+ */
+
+import {
+  LATAM_PAID_SEARCH_DESTINATIONS,
+  type LatamPaidSearchDestination,
+  type PaidSearchCountrySlug,
+  type PaidSearchRouteKey,
+  type PaidSearchSegmentSlug,
+} from "@/content/latam-paid-search-destinations";
+
+const EXPECTED_ROUTE_COUNT = 10;
+const ARGENTINA_SLUG: PaidSearchCountrySlug = "argentina";
+
+const destinationByRouteKey: ReadonlyMap<PaidSearchRouteKey, LatamPaidSearchDestination> =
+  new Map(LATAM_PAID_SEARCH_DESTINATIONS.map((record) => [record.routeKey, record]));
+
+/**
+ * Fail fast at module load if the registry drifts from its invariants.
+ * Exported so a unit test can assert it does not throw.
+ */
+export function assertRouteRegistry(): void {
+  if (LATAM_PAID_SEARCH_DESTINATIONS.length !== EXPECTED_ROUTE_COUNT) {
+    throw new Error(
+      `Expected ${EXPECTED_ROUTE_COUNT} paid-search routes; received ${LATAM_PAID_SEARCH_DESTINATIONS.length}`,
+    );
+  }
+  if (destinationByRouteKey.size !== LATAM_PAID_SEARCH_DESTINATIONS.length) {
+    throw new Error("Duplicate paid-search routeKey detected");
+  }
+  const canonicalPaths = new Set<string>();
+  for (const record of LATAM_PAID_SEARCH_DESTINATIONS) {
+    const expectedPath = `/es/destinations/${record.country.slug}/${record.segment.slug}`;
+    if (record.seo.canonicalPath !== expectedPath) {
+      throw new Error(`Canonical path mismatch for ${record.routeKey}`);
+    }
+    if (canonicalPaths.has(record.seo.canonicalPath)) {
+      throw new Error(`Duplicate canonical path for ${record.routeKey}`);
+    }
+    canonicalPaths.add(record.seo.canonicalPath);
+  }
+}
+
+assertRouteRegistry();
+
+/** Resolve a record for a valid es country/segment combo, else null. */
+export function getPaidSearchDestination(
+  locale: string,
+  country: string,
+  segment: string,
+): LatamPaidSearchDestination | null {
+  if (locale !== "es") return null;
+  const key = `${country}/${segment}` as PaidSearchRouteKey;
+  return destinationByRouteKey.get(key) ?? null;
+}
+
+/**
+ * Static params for the dynamic `[slug]/[segment]` route — the EIGHT
+ * non-Argentina combos. Argentina is served by its own static-parent branch
+ * (`argentina/[segment]`), so it is excluded here.
+ */
+export function getPaidSearchStaticParams(): {
+  slug: PaidSearchCountrySlug;
+  segment: PaidSearchSegmentSlug;
+}[] {
+  return LATAM_PAID_SEARCH_DESTINATIONS.filter(
+    (record) => record.country.slug !== ARGENTINA_SLUG,
+  ).map((record) => ({ slug: record.country.slug, segment: record.segment.slug }));
+}
+
+/** Static params for the Argentina `argentina/[segment]` branch — the TWO AR combos. */
+export function getArgentinaPaidSearchStaticParams(): { segment: PaidSearchSegmentSlug }[] {
+  return LATAM_PAID_SEARCH_DESTINATIONS.filter(
+    (record) => record.country.slug === ARGENTINA_SLUG,
+  ).map((record) => ({ segment: record.segment.slug }));
+}
diff --git a/lib/lead-attribution.ts b/lib/lead-attribution.ts
new file mode 100644
index 0000000..7d0ad20
Binary files /dev/null and b/lib/lead-attribution.ts differ
diff --git a/lib/schemas.ts b/lib/schemas.ts
index cea3a12..ce5013c 100644
--- a/lib/schemas.ts
+++ b/lib/schemas.ts
@@ -134,3 +134,79 @@ export const bookingRequestSchema = z.object({
 });
 
 export type BookingRequestData = z.infer<typeof bookingRequestSchema>;
+
+// --- LATAM Paid-Search Lead (Gate B) ---
+// The client sends ONLY routeKey for route context; the server rederives
+// country/segment/cargo_class/landing_route/request_type from the registry
+// (trust boundary, spec §9.2). Click IDs/UTMs ride in first/latest touch.
+
+export const paidSearchTouchSchema = z.object({
+  capturedAt: z.string().max(40).optional(),
+  landingUrl: z.string().max(2048).optional(),
+  referrer: z.string().max(2048).optional(),
+  gclid: z.string().max(256).optional(),
+  gbraid: z.string().max(256).optional(),
+  wbraid: z.string().max(256).optional(),
+  fbclid: z.string().max(256).optional(),
+  utm_source: z.string().max(512).optional(),
+  utm_medium: z.string().max(512).optional(),
+  utm_campaign: z.string().max(512).optional(),
+  utm_term: z.string().max(512).optional(),
+  utm_content: z.string().max(512).optional(),
+  utm_matchtype: z.string().max(512).optional(),
+  utm_network: z.string().max(512).optional(),
+  utm_device: z.string().max(512).optional(),
+});
+
+export const paidSearchLeadSchema = z
+  .object({
+    routeKey: z.string().min(3).max(120),
+    contact_name: z.string().min(1, "Name is required").max(200),
+    contact_email: z.string().email("Invalid email address").optional().or(z.literal("")).default(""),
+    contact_phone: z.string().max(50).optional().default(""),
+    preferred_contact_method: z.enum(["whatsapp", "email", "phone"]).default("whatsapp"),
+    equipment_type: z.string().min(1, "Equipment is required").max(200),
+    make_model: z.string().max(200).optional().default(""),
+    year: z.string().max(10).optional().default(""),
+    listing_url: z.string().max(500).optional().default(""),
+    origin_location: z.string().max(200).optional().default(""),
+    destination_location: z.string().max(200).optional().default(""),
+    dimensions: z.string().max(300).optional().default(""),
+    weight: z.string().max(100).optional().default(""),
+    purchase_status: z.string().max(100).optional().default(""),
+    requested_timing: z.string().max(100).optional().default(""),
+    buyer_role: z.string().max(100).optional().default(""),
+    message: z.string().max(5000).optional().default(""),
+    consent: z.boolean().optional().default(false),
+    // Honeypot
+    website: z.string().max(500).optional().default(""),
+    // Attribution (server re-trusts by attribution_id where available)
+    attribution_id: z.string().max(80).optional().default(""),
+    whatsapp_ref: z.string().max(32).optional().default(""),
+    // Stable dedupe key (from createWhatsAppRef or a per-session id); server
+    // generates one if absent. idempotency_key === lead_id (spec §9.11).
+    lead_id: z.string().max(80).optional().default(""),
+    first_touch: paidSearchTouchSchema.optional(),
+    latest_touch: paidSearchTouchSchema.optional(),
+  })
+  .superRefine((d, ctx) => {
+    if (!d.contact_email && !d.contact_phone) {
+      ctx.addIssue({
+        code: z.ZodIssueCode.custom,
+        path: ["contact_email"],
+        message: "Provide an email or a phone/WhatsApp number.",
+      });
+    }
+  });
+
+export type PaidSearchLeadData = z.infer<typeof paidSearchLeadSchema>;
+export type PaidSearchLeadInput = z.input<typeof paidSearchLeadSchema>;
+
+export const whatsappRefRequestSchema = z.object({
+  routeKey: z.string().min(3).max(120),
+  attribution_id: z.string().max(80).optional().default(""),
+  first_touch: paidSearchTouchSchema.optional(),
+  latest_touch: paidSearchTouchSchema.optional(),
+});
+
+export type WhatsAppRefRequestData = z.infer<typeof whatsappRefRequestSchema>;
diff --git a/lib/whatsapp-prefill.ts b/lib/whatsapp-prefill.ts
new file mode 100644
index 0000000..d935cc7
--- /dev/null
+++ b/lib/whatsapp-prefill.ts
@@ -0,0 +1,20 @@
+/**
+ * Pure helpers for the paid-search WhatsApp CTA (spec §6.5, §9.7).
+ * The visible message carries the opaque ref only — never click IDs/UTMs.
+ */
+
+/** Insert the opaque ref into the prefill, or strip the placeholder if no ref. */
+export function interpolateWhatsAppRef(template: string, ref?: string): string {
+  if (ref) return template.replace(/\{\{whatsapp_ref\}\}/g, ref);
+  // No ref → remove the "Ref: {{whatsapp_ref}}" tail (and any stray placeholder).
+  return template
+    .replace(/\s*Ref:\s*\{\{whatsapp_ref\}\}/g, "")
+    .replace(/\{\{whatsapp_ref\}\}/g, "")
+    .trim();
+}
+
+/** Build a wa.me deep link. Phone is digits-only; text is URL-encoded. */
+export function buildWhatsAppUrl(phoneRaw: string, text: string): string {
+  const digits = phoneRaw.replace(/\D/g, "");
+  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
+}
diff --git a/supabase/migrations/20260622180000_add_paid_search_lead_attribution.sql b/supabase/migrations/20260622180000_add_paid_search_lead_attribution.sql
new file mode 100644
index 0000000..83b4c55
--- /dev/null
+++ b/supabase/migrations/20260622180000_add_paid_search_lead_attribution.sql
@@ -0,0 +1,24 @@
+-- LATAM paid-search lead attribution (Gate B). Additive + idempotent.
+-- Spec: docs/superpowers/specs/2026-06-22-latam-paid-search-destinations-design.md §6.6
+--
+-- Scoped to the SHARED leads table (also used by mf-chatbot-ui). To avoid column
+-- sprawl + duplicating the chatbot's wa_attribution/utm_clicks system, only the
+-- queryable/dedupe/correlation fields are real columns; the full contract
+-- (extended UTMs, route context, touches, equipment) rides in paid_search_metadata.
+-- No paid_search_refs table: wa_attribution.ref_code already owns ref→attribution.
+
+alter table public.leads add column if not exists lead_id text;
+alter table public.leads add column if not exists idempotency_key text;
+alter table public.leads add column if not exists source_platform text;
+alter table public.leads add column if not exists country text;
+alter table public.leads add column if not exists segment text;
+alter table public.leads add column if not exists cargo_class text;
+alter table public.leads add column if not exists gclid text;
+alter table public.leads add column if not exists gbraid text;
+alter table public.leads add column if not exists wbraid text;
+alter table public.leads add column if not exists paid_search_metadata jsonb default '{}'::jsonb;
+
+-- Dedupe: idempotency_key === lead_id. Partial unique leaves existing null rows untouched.
+create unique index if not exists leads_idempotency_key_uidx
+  on public.leads (idempotency_key)
+  where idempotency_key is not null;
```

============================================================
## SECTION C — VERIFICATION ALREADY DONE (verify independently; do not just trust)
============================================================
- Build/quality: `npm run lint` clean; `npx vitest run` = 219 tests passing (incl. route registry, attribution capture/parse, lead Server Action persistence+trust-boundary+dedupe+no-side-effect, whatsapp-ref format/idempotency, prefill no-click-ID); `npm run build` exit 0; all 10 routes statically prerendered.
- Routing (live): valid es route -> 200; invalid combo (e.g. /es/destinations/argentina/flete-equipo-pesado-usa) -> 404 (dynamicParams=false); /en/... -> 307.
- Tracking (live browser, two routes): loading with gclid/gbraid/wbraid/fbclid + full UTMs captured all of them (incl. gbraid/wbraid/utm_matchtype/network/device) into an opaque attribution_id in sessionStorage + first-party cookie; WhatsApp prefill contained no click-ID/UTM substrings.
- DB: additive migration APPLIED to the shared Supabase `leads` table (10 columns + idempotency unique index); a synthetic insert/cleanup against the real schema succeeded; found+fixed a real bug (leads.message is NOT NULL -> action now always populates it).
- Reviews already run internally: a 5-lens spec review (pre-build) and a 4-lens QA panel (a11y / message-match / native-Spanish / completeness); all blockers + majors fixed (incl. a CFIA-token copy garble on the Paraguay routes).
- Console on the live pages: clean except local-only Vercel-analytics 404s (/_vercel/insights, /_vercel/speed-insights) that resolve on the real deploy.
- Known not-yet-done (business/ops, out of front-end scope): Gate-B budget/SLA/monitoring approval; merge to main (= prod deploy); set NEXT_PUBLIC_GOOGLE_ADS_ID before live conversions; activate the paused Google Ads campaigns. Native Spanish review waived (no reviewer).
