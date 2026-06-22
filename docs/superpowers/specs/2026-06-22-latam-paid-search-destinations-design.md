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

### Blocker (resolved in-spec; one owner action)
- **FMC/IATA premise corrected** (§5, §13.3). Owner action before Gate-B traffic: verify the registrations are genuine/current OR remove site-wide. Pre-existing condition; not a preview-build blocker.

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
