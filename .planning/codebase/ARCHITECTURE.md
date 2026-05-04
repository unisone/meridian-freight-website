<!-- refreshed: 2026-05-04 -->
# Architecture

**Analysis Date:** 2026-05-04

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                  CLIENT (Browser, RSC + Client Components)                   │
│  Header / Footer / Hero / Calculator Wizard / Contact Form / Cookie Consent  │
│  `components/` (shared)   `components/ui/` (shadcn primitives)               │
└────────────────────────────────────┬─────────────────────────────────────────┘
                                     │  next-intl Link / form action / fetch
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              NEXT.JS 16 APP ROUTER (RSC by default, locale-prefixed)         │
│   `app/[locale]/...` static-generated pages (Node runtime, RSC)              │
│   `app/layout.tsx` (root passthrough) → `app/[locale]/layout.tsx` (shell)    │
│   Locale middleware: `proxy.ts` (next-intl) — Next 16 renames middleware.ts  │
└────┬───────────────────────────┬────────────────────────────┬────────────────┘
     │                           │                            │
     ▼                           ▼                            ▼
┌──────────────────┐   ┌──────────────────────┐   ┌──────────────────────────┐
│  Server Actions  │   │  API Route Handlers  │   │  Static Content / SEO    │
│  `app/actions/`  │   │  `app/api/*/route.ts`│   │  `app/sitemap.ts`        │
│  contact /       │   │  cron + tracking +   │   │  `app/robots.ts`         │
│  calculator /    │   │  indexnow            │   │  `content/*.ts` (typed)  │
│  booking         │   │  (Node runtime)      │   │                          │
└────────┬─────────┘   └──────────┬───────────┘   └──────────────────────────┘
         │                        │
         ▼                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                  DOMAIN / INFRA LIBRARY (`lib/`)                              │
│  Freight engines (v1/v2/v3) · Schemas (Zod) · Supabase REST clients · Slack  │
│  Resend email · Meta CAPI · Logger · Tracking · i18n utils · Metadata        │
└──────────────────┬─────────────────────────────────┬─────────────────────────┘
                   │                                 │
                   ▼                                 ▼
┌─────────────────────────────────────┐   ┌──────────────────────────────────┐
│ External Services (REST / SDK)      │   │ Observability                    │
│ Supabase · Resend · Slack · Meta    │   │ Sentry (`instrumentation.ts`,    │
│ CAPI · Vercel Analytics · GA4 ·     │   │ `instrumentation-client.ts`,     │
│ Meta Pixel · IndexNow · Google Ads  │   │ `sentry.{server,edge}.config`)   │
└─────────────────────────────────────┘   └──────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Minimal pass-through; required by Next 16, defers `<html>`/`<body>` to locale layout | `app/layout.tsx` |
| Locale layout | `<html lang>` + `<body>`, fonts, `NextIntlClientProvider`, all chrome (Header, Footer, WhatsApp widget, mobile bar, cookie banner), GA4/Pixel/Vercel Analytics/Sentry mounts, JSON-LD Organization+WebSite | `app/[locale]/layout.tsx` |
| Locale middleware (proxy) | Locale negotiation/redirect via `next-intl/middleware`; matcher excludes `api`, `_next`, `_vercel`, files with extension | `proxy.ts` |
| Server-side instrumentation | Loads server / edge Sentry config based on `NEXT_RUNTIME` | `instrumentation.ts` |
| Client-side instrumentation | Browser Sentry init + replay + router transition capture | `instrumentation-client.ts` |
| Locale layout error boundary | Catches RSC/route errors, sends to Sentry, shows fallback with CTAs | `app/[locale]/error.tsx` |
| Root error boundary | Last-resort global error wrapper | `app/global-error.tsx`, `app/[locale]/global-error.tsx` |
| Loading state | Per-route `loading.tsx` (e.g., schedule) | `app/[locale]/loading.tsx`, `app/[locale]/schedule/loading.tsx` |
| Route segments | RSC pages with `setRequestLocale(locale)` + `getTranslations`, `generateMetadata`, `generateStaticParams` | `app/[locale]/**/page.tsx` |
| Server Actions | `"use server"` mutations: validate (Zod) → Supabase REST → Resend → `after()` background tasks | `app/actions/*.ts` |
| API route handlers | JSON endpoints: WA-click attribution, IndexNow ping/verify, cron jobs (Vercel Cron) | `app/api/**/route.ts` |
| Domain library | Pure-TS freight engines, schemas, contracts, Supabase REST clients, integration adapters | `lib/*.ts`, `lib/calculator-v3/*.ts` |
| Shared UI primitives | shadcn/ui (Radix-based) | `components/ui/*.tsx` |
| Feature components | Client + RSC components for marketing site (header, hero, footer, calculator wizard, contact form, schedule, destinations) | `components/*.tsx`, `components/freight-calculator/`, `components/freight-calculator-v3/`, `components/destinations/`, `components/schedule/`, `components/shared-shipping/` |
| Hooks | Browser-only React hooks | `hooks/use-count-up.ts`, `hooks/use-scroll-direction.ts` |
| Content | Typed TS modules for services, projects, equipment, FAQ, blog, market pages, sourcing partners | `content/*.ts` |
| i18n config | next-intl routing + request config + typed navigation wrapper | `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts` |
| Translations | Top-level message catalogs (single JSON per locale) | `messages/{en,es,ru}.json` |
| Database migrations | Supabase SQL migrations (timestamped) | `supabase/migrations/*.sql` |

## Pattern Overview

**Overall:** Next.js 16 App Router marketing site, **fully statically generated** (`generateStaticParams` over `routing.locales` × dynamic slugs). React Server Components by default; client components are explicit with `"use client"`. Server-side mutations run as **Server Actions** (preferred over API routes), with API routes reserved for webhooks/cron/tracking that need raw `Request`/`Response` semantics. Single shared monorepo-style codebase under one Next app — **no separate API package**.

**Key Characteristics:**
- **i18n-first routing:** all marketing pages live under `app/[locale]/...`. Three locales: `en` (default, no prefix), `es`, `ru`. `localePrefix: "as-needed"`, `localeDetection: false`, `alternateLinks: false`.
- **RSC default + targeted client islands:** chrome (header, footer, cookie consent, calculator wizard, scroll/animation effects, analytics scripts) is `"use client"`; pages, content sections, layouts are RSC.
- **Server Actions over API routes** for form submissions; only WA-click tracking, IndexNow, and cron jobs use route handlers.
- **Background fan-out via `next/server`'s `after()`** to keep critical-path latency low. Pattern documented in `app/actions/contact.ts`, `app/actions/calculator.ts`, `app/actions/booking.ts`.
- **Single source of truth** for contact info: `lib/constants.ts` (`COMPANY`, `CONTACT`, `SITE`, `SOCIAL`, `NAV_ITEMS`, `TRACKING`). Components MUST import — no hardcoding.
- **Wrapped Next config:** `withSentryConfig(withNextIntl(nextConfig))` in `next.config.ts` — Sentry source-map upload + next-intl plugin pointed at `./i18n/request.ts`.

## Layers

**Presentation (RSC pages + Client islands):**
- Purpose: render UI, drive form interactions, fire client-side analytics
- Location: `app/[locale]/**/page.tsx`, `components/`, `components/ui/`
- Contains: route segments, layouts, RSC sections, client wizards, shadcn primitives
- Depends on: `lib/`, `content/`, `i18n/`, `hooks/`, `messages/`
- Used by: end users via browser

**Server Action layer (`"use server"` mutations):**
- Purpose: validate + persist + fan-out side effects
- Location: `app/actions/*.ts` (+ `app/actions/__tests__/*.test.ts`)
- Contains: `submitContactForm`, `submitCalculator` (v2), `submitCalculatorV3`, `submitBooking`, `getCalculatorData`, `getCalculatorV3Data`
- Depends on: `lib/schemas.ts` (Zod), `lib/freight-engine-v2.ts`, `lib/calculator-v3/*`, `lib/supabase-rates.ts`, `lib/slack.ts`, `lib/meta-capi.ts`, `lib/logger.ts`, Resend SDK, `next/server` `after()`, `@vercel/analytics/server`
- Used by: Client components (`contact-form.tsx`, `calculator-wizard.tsx`, `calculator-v3-wizard.tsx`, `schedule-booking-form.tsx`)

**Route handler layer (`route.ts`):**
- Purpose: webhooks, cron, attribution endpoints
- Location: `app/api/cron/{rate-check,sync-containers}/route.ts`, `app/api/track/wa-click/route.ts`, `app/api/indexnow/route.ts`, `app/api/indexnow-verify/route.ts`
- Contains: `GET`/`POST` handlers, request-secret verification (cron uses `Bearer ${CRON_SECRET}`), Zod parsing
- Depends on: `lib/wa-attribution.ts`, `lib/sync-containers.ts`, `lib/slack.ts`, `lib/logger.ts`
- Used by: Vercel Cron (`vercel.json`), browser tracking pixels, search-engine IndexNow verifiers

**Domain / infrastructure (`lib/`):**
- Purpose: business logic + integration adapters
- Location: `lib/*.ts`, `lib/calculator-v3/*.ts`, `lib/types/*.ts`, `lib/emails/*.ts`
- Contains: freight engines (`freight-engine.ts` legacy, `freight-engine-v2.ts` current 40HC+flatrack, `lib/calculator-v3/engine.ts` next-gen with import-cost), Zod schemas (`lib/schemas.ts`), Supabase REST clients (`lib/supabase-rates.ts`, `lib/supabase-containers.ts`), Resend email templates (`lib/emails/booking-confirmation.ts`), Slack adapter (`lib/slack.ts`), Meta CAPI (`lib/meta-capi.ts`), structured JSON logger (`lib/logger.ts`), tracking helpers (`lib/tracking.ts`), Google Sheets sync (`lib/google-sheets.ts`), markdown parser (`lib/markdown.ts`), motion tokens (`lib/motion.ts`), metadata helper (`lib/metadata.ts`), single-source contact constants (`lib/constants.ts`), `lib/utils.ts` (`cn()` shadcn helper)
- Depends on: external SDKs (`resend`, `@sentry/nextjs`, `zod`), Supabase REST via `fetch`, env vars
- Used by: pages, server actions, route handlers, tests (`lib/__tests__/*.test.ts`)

**Content (typed data):**
- Purpose: static content as TS modules (services, projects, FAQ, equipment, destinations, blog, sourcing partners, market pages)
- Location: `content/*.ts`
- Contains: typed arrays + lookup helpers (`getServiceBySlug`, `getAllEquipmentTypes`, `getHomepageFaq`, …), localized variants (`content/blog.ts`, `content/blog-es.ts`, `content/blog-ru.ts`)
- Used by: RSC pages, sitemap, structured data builders

**Translation catalogs:**
- Purpose: UI strings for next-intl namespaces
- Location: `messages/{en,es,ru}.json` (single flat JSON per locale)
- Used by: `getTranslations(namespace)` (server) + `useTranslations(namespace)` (client)

**Persistence:**
- Purpose: lead capture, freight rates, container schedules, shared shipping bookings
- Location: Supabase (managed) — schema in `supabase/migrations/*.sql` + `docs/sql/shared-shipping-tables.sql`
- Tables referenced from code: `leads`, `equipment_packing_rates`, `ocean_freight_rates`, plus shared-shipping/container tables
- Access: server-only via Supabase REST (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`); never from the browser

## Data Flow

### Primary Request Path (locale-prefixed page)

1. Request hits Vercel; `proxy.ts` (`createMiddleware(routing)`) rewrites/redirects to a locale segment per `next-intl` `routing.localePrefix: "as-needed"`.
2. Next 16 router resolves to `app/[locale]/.../page.tsx`. `params: Promise<{ locale }>` is awaited; `setRequestLocale(locale)` from `next-intl/server` (`app/[locale]/page.tsx:69-70`).
3. RSC fetches translations via `getTranslations(namespace)` and content via `content/*.ts` helpers.
4. Layout `app/[locale]/layout.tsx:172-222` wraps children with `NextIntlClientProvider`, `MotionProvider`, `TooltipProvider`, `Header`, `Footer`, `WhatsAppWidget`, `MobileBottomBar`, `CookieConsent`, plus analytics mounts.
5. Static rendering: every dynamic segment exposes `generateStaticParams()` over `routing.locales` × content slugs (e.g., `app/[locale]/services/[slug]/page.tsx:37-39`).
6. Output: pre-rendered HTML + JSON-LD scripts injected as `<script type="application/ld+json">`.

### Server Action — Lead Pipeline (contact + calculator)

Source of truth: `app/actions/contact.ts`, `app/actions/calculator.ts`, `app/actions/calculator-v3.ts`.

1. Client form submits to action via `<form action={…}>`-style call from `components/contact-form.tsx:25-…` / `components/freight-calculator/calculator-wizard.tsx`.
2. Action validates with Zod (`lib/schemas.ts` — `contactFormSchema`, `calculatorV2Schema`, `calculatorV3Schema`).
3. Honeypot check (`data.website` non-empty → silent success).
4. **Critical-path** (awaited):
   - Supabase INSERT into `leads` via REST (`fetch` to `${SUPABASE_URL}/rest/v1/leads` with `apikey` + `Authorization: Bearer ${SERVICE_ROLE}`) — best-effort, errors logged.
   - Resend owner email — **must succeed** (returns error to user otherwise).
5. Action returns `{ success: true, eventId }` to client.
6. **Background** via `after()` from `next/server` (latency-saving fan-out):
   - Resend visitor auto-reply (per-locale subject/body in `AUTO_REPLY_SUBJECTS` / `AUTO_REPLY_BODY`).
   - Slack notification via `notifySlack()` (`lib/slack.ts`).
   - Meta CAPI `Lead` event via `sendCAPIEvent()` (`lib/meta-capi.ts`) — hashed PII.
   - Vercel Analytics server-side `track('lead_submitted', …)` (`@vercel/analytics/server`).
7. Logger (`lib/logger.ts`) emits structured JSON for every step (`startTimer(route)` → `done()`/`error()`).

### Calculator v2 Specific Flow

1. Client mounts wizard → calls `getCalculatorData()` server action → fetches `equipment_packing_rates` + `ocean_freight_rates` via `lib/supabase-rates.ts` and computes `rateBookSignature` (`lib/calculator-contract.server.ts`).
2. User selects equipment + size + destination + ZIP → `calculateFreightV2()` runs **client-side preview** (`lib/freight-engine-v2.ts`).
3. User submits email → `submitCalculator` server action **re-fetches** rates, **re-resolves** canonical container type via `lib/freight-policy.ts`, **re-calculates server-side** (client estimate is never trusted), then runs the lead pipeline above.
4. If `rateBookSignature` differs from current → returns `refreshedEstimate` and requires resubmission.

### i18n Routing Flow

1. `i18n/routing.ts` declares locales `["en","es","ru"]`, default `en`, `localePrefix: "as-needed"`.
2. `i18n/navigation.ts` exports a typed `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` via `createNavigation(routing)`. **All internal links use this `Link`**, not `next/link` directly.
3. `i18n/request.ts` resolves the request locale and dynamically imports `messages/${locale}.json`.
4. `next-intl/plugin` wires `i18n/request.ts` into the Next compiler (`next.config.ts:5`).
5. `proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) runs `createMiddleware(routing)`.
6. Inside RSC pages, `setRequestLocale(locale)` is called BEFORE any `getTranslations` to enable static rendering.

### Sentry Error Pipeline

1. Server: `instrumentation.ts` `register()` imports `sentry.server.config.ts` or `sentry.edge.config.ts` based on `NEXT_RUNTIME`. `onRequestError = Sentry.captureRequestError` for RSC error capture.
2. Client: `instrumentation-client.ts` calls `Sentry.init({ dsn, tracesSampleRate, replaysOnErrorSampleRate: 1.0, integrations: [Sentry.replayIntegration()] })` and exports `onRouterTransitionStart = Sentry.captureRouterTransitionStart` for App Router transitions.
3. Error boundaries (`app/[locale]/error.tsx`, `app/global-error.tsx`, `app/[locale]/global-error.tsx`) re-throw via `Sentry.captureException(error)` in `useEffect`.
4. Build-time: `next.config.ts` wraps the config with `withSentryConfig(...)` to upload source maps when `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT` are present.
5. Sentry is dormant if `NEXT_PUBLIC_SENTRY_DSN` is unset (init runs but reports nothing).

### Supabase Data Flow (read-only freight rates)

```
RSC / Server Action  ─→  lib/supabase-rates.ts (fetchEquipmentRates, fetchOceanRates)
                         lib/supabase-containers.ts (container schedule)
                         lib/sync-containers.ts (cron sync logic)
                              │
                              ▼
                         fetch(`${SUPABASE_URL}/rest/v1/<table>?…`,
                               { headers: { apikey, Authorization: Bearer SERVICE_ROLE }})
                              │
                              ▼
                         Supabase Postgres
```
Graceful degradation: if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing, helpers return `null` and the calculator UI shows "unavailable" with contact CTAs.

### Cron Jobs (Vercel Cron)

`vercel.json` registers two crons; handlers live under `app/api/cron/`:
- `rate-check` (`0 9 * * 1`, weekly Mon 09:00 UTC) → `app/api/cron/rate-check/route.ts` checks `updated_at` freshness on `ocean_freight_rates` + `equipment_packing_rates`, alerts Slack if stale > 45 days.
- `sync-containers` (`*/15 * * * *`, every 15 min) → `app/api/cron/sync-containers/route.ts` reconciles container schedule via `lib/sync-containers.ts`.
Both verify `Authorization: Bearer ${CRON_SECRET}` header.

### Tracking / Analytics Flow

- `components/google-analytics.tsx`, `components/meta-pixel.tsx`, `components/vercel-analytics.tsx`, `components/engagement-tracking.tsx` mount in locale layout.
- `lib/tracking.ts` exposes `trackGA4Event`, `trackPixelEvent`, `trackContactClick`, `trackCtaClick`, `trackCalcFunnel`, `trackGoogleAdsConversion`, `getGA4ClientId`, `captureAttribution`, `getAttribution`, `generateEventId`.
- Components import these helpers; consent state lives in `localStorage['cookie-consent']` (`components/cookie-consent.tsx`).
- Server-side: `@vercel/analytics/server` `track()` + Meta CAPI inside `after()`.

**State Management:**
- No global client store. Local `useState`/`useReducer` per island; URL/route is the source of truth for cross-page state.
- Server state via RSC (`getCalculatorData()` action returns rate book to wizard mount).
- Client cookies + `localStorage`/`sessionStorage` for UTM attribution (`mf_attribution` 30d cookie, `cookie-consent`, `mf-wa-attribution`).

## Key Abstractions

**Typed Server Action contract:**
- Purpose: deterministic mutation interface — `(raw, locale) => Promise<{ success, error?, eventId? }>`
- Examples: `app/actions/contact.ts:80-…`, `app/actions/calculator.ts`, `app/actions/booking.ts`
- Pattern: `"use server"` + Zod parse → typed `Result` discriminated union returned

**Freight engine (versioned):**
- Purpose: deterministic, testable freight cost computation
- Examples: `lib/freight-engine.ts` (legacy, deprecated), `lib/freight-engine-v2.ts` (current website 40HC + flatrack), `lib/calculator-v3/engine.ts` (v3 + import cost + landed cost)
- Pattern: pure functions over typed inputs; **server re-runs** on submit, never trusts client output. Tests in `lib/__tests__/freight-engine{,-v2,-v3}.test.ts`

**Rate-book contract + signature:**
- Purpose: detect stale client estimates after Supabase rates update
- Examples: `lib/calculator-contract.ts`, `lib/calculator-contract.server.ts`
- Pattern: `buildRateBookSignature(rates)` produces a hash; client passes back; server compares and forces refresh if mismatched

**Routing/policy resolver:**
- Purpose: protect against stale `container_type` in DB
- Examples: `lib/freight-policy.ts` (combines/sprayers → flatrack; tractors/headers/tillage → fortyhc)
- Pattern: pure resolver wrapping raw DB value before display/calculation

**i18n typed Link wrapper:**
- Purpose: locale-aware navigation (auto-prefix `/es`, `/ru`)
- Example: `i18n/navigation.ts` exports `Link` from `createNavigation(routing)`
- Pattern: components import `{ Link }` from `@/i18n/navigation` instead of `next/link`

**Single-source constants:**
- Purpose: prevent contact-info drift
- Example: `lib/constants.ts` (`COMPANY`, `CONTACT`, `SITE`, `SOCIAL`, `NAV_ITEMS`, `TRACKING`)
- Pattern: marked `as const`; components import named exports — no hardcoded phone/email/URL anywhere

**Page metadata helper:**
- Purpose: consistent canonical + OG + Twitter metadata
- Example: `lib/metadata.ts` `pageMetadata({ title, description, path, keywords })`
- Pattern: each page passes `path`, helper builds `${SITE.url}${path}` canonical and OG image

**Structured logger:**
- Purpose: greppable Vercel runtime logs
- Example: `lib/logger.ts` — `log({ level, msg, route, ms, … })` outputs JSON; `startTimer(route)` returns `{ done, error }` with auto-duration

**TrackedContactLink / TrackedCtaLink:**
- Purpose: client-only `<a>` wrapper for tracking inside RSCs
- Example: `components/tracked-contact-link.tsx`, `components/tracked-cta-link.tsx`
- Pattern: marked `"use client"`, attaches `onClick` → `trackContactClick()` / `trackCtaClick()`

**ScrollReveal / ScrollProgress / MotionProvider:**
- Purpose: motion (`motion`/framer-motion) animation primitives
- Example: `components/scroll-reveal.tsx`, `components/scroll-progress.tsx`, `components/motion-provider.tsx`, `lib/motion.ts` (`DURATION`, `EASE` tokens)

**shadcn/ui primitives:**
- Purpose: accessible Radix-based building blocks
- Example: `components/ui/{button,card,sheet,dialog,tooltip,navigation-menu,select,tabs,…}.tsx`
- Pattern: configured via `components.json` (style `base-nova`, RSC enabled, lucide icons, neutral baseColor, CSS vars, alias `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`)

## Entry Points

**Vercel HTTP request:**
- Location: `proxy.ts` (locale middleware via `next-intl`)
- Triggers: every request not matching `^/(api|_next|_vercel|.*\..*)`
- Responsibilities: locale detection / redirect / rewrite

**Root layout (server):**
- Location: `app/layout.tsx`
- Triggers: every Next render
- Responsibilities: trivial pass-through (`return children`); locale layout owns `<html>`/`<body>`

**Locale layout (server):**
- Location: `app/[locale]/layout.tsx`
- Triggers: every page under `/[locale]/...`
- Responsibilities: HTML shell, Geist font variables, `setRequestLocale`, providers, JSON-LD, all global UI chrome, analytics + Sentry mounts, `metadata`/`viewport` exports, `generateStaticParams` over locales

**Pages:**
- Location: `app/[locale]/**/page.tsx` (16 segments + dynamic `[slug]` and `[locale]`)
- Triggers: matched routes
- Responsibilities: RSC rendering, `generateMetadata`, `generateStaticParams`, page-level JSON-LD

**Server-side instrumentation:**
- Location: `instrumentation.ts`
- Triggers: server boot
- Responsibilities: load Sentry server/edge config; export `onRequestError`

**Client-side instrumentation:**
- Location: `instrumentation-client.ts`
- Triggers: browser hydrate
- Responsibilities: Sentry client init + replay + router transition capture

**Server Actions:**
- Location: `app/actions/{contact,calculator,calculator-data,calculator-v3,calculator-v3-data,booking}.ts`
- Triggers: form submit / RSC fetch
- Responsibilities: validate, persist, fan out side-effects via `after()`

**API route handlers:**
- Location: `app/api/{cron/rate-check,cron/sync-containers,track/wa-click,indexnow,indexnow-verify}/route.ts`
- Triggers: Vercel Cron, browser POST, search-engine GET
- Responsibilities: secret-gated webhooks + tracking endpoints

**Sitemap / robots:**
- Location: `app/sitemap.ts`, `app/robots.ts`
- Triggers: `/sitemap.xml`, `/robots.txt`
- Responsibilities: generate sitemap with hreflang alternates over content

**Cron registry:**
- Location: `vercel.json` (`crons` array)
- Triggers: Vercel platform on schedule
- Responsibilities: dispatch to `app/api/cron/*/route.ts`

**One-off scripts:**
- Location: `scripts/audit-calculator-v3.ts`, `scripts/submit-indexnow.ts`
- Triggers: `npm run audit:calculator-v3`, manual `tsx scripts/submit-indexnow.ts`
- Responsibilities: ops/maintenance (calc audit, IndexNow bulk submit)

## Architectural Constraints

- **Runtime:** all RSC pages, server actions, and `route.ts` handlers run on the **Node.js runtime** by default. No `export const runtime = "edge"` is set anywhere; the only edge surface is Sentry's `sentry.edge.config.ts` (loaded by `instrumentation.ts` when `NEXT_RUNTIME === "edge"` for matched edge handlers, currently unused).
- **Threading:** single-threaded Node per request; no worker threads; no module-level mutable singletons in `lib/` (Resend client is constructed per-call inside actions).
- **Global state:** no app-level singleton store. Layout-level providers: `NextIntlClientProvider`, `MotionProvider`, `TooltipProvider`. Module-level constants are `as const` and immutable.
- **Statically generated:** every dynamic segment defines `generateStaticParams()`; locale layout returns `routing.locales.map(...)`. There is no `force-dynamic`, no ISR `revalidate` configured. Calculator data fetches happen at request time inside server actions, not at page render time.
- **Edge functions / middleware:** `proxy.ts` runs as edge middleware (Next default) — keep it dependency-free (only imports `next-intl/middleware` + `i18n/routing.ts`).
- **CSP:** `next.config.ts` ships strict CSP with explicit allowlists for GA, Meta Pixel/CAPI, Google Ads, Sentry, Supabase, Vercel Analytics/Speed Insights, YouTube. Adding a new third-party requires updating `scriptSrc` / `connectSrc` / `img-src` / `frame-src` arrays.
- **Inline-script env-var safety:** `next.config.ts:10-25` aborts the build if `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, or `NEXT_PUBLIC_GOOGLE_ADS_ID` contain whitespace/newlines (defends against `echo '…' | vercel env add` newline trap).
- **Supabase access is server-only:** never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. There is no anon-key client; all reads go through `lib/supabase-{rates,containers}.ts` from server contexts.
- **Argentina market-page redirect:** non-`es` paths permanently redirect to `/es/destinations/argentina` (`next.config.ts:96-112`). Other market pages (Kazakhstan) are accessible per locale.
- **IndexNow rewrite:** `/{key}.txt` rewrites to `/api/indexnow-verify?key=:key` (`next.config.ts:114-122`).
- **Locale prefix policy:** `localePrefix: "as-needed"` means English URLs have NO prefix (`/services`, `/contact`); Spanish/Russian have `/es/...`, `/ru/...`. Sitemap and `pageMetadata` must compute path with this in mind.
- **Always use the typed `Link`** from `@/i18n/navigation` for internal navigation. `next/link` skips locale handling.

## Anti-Patterns

### Hardcoded contact info

**What happens:** Component embeds `+1 (641) 516-1616`, `wa.me/...`, or `alex.r@meridianexport.com` directly in JSX/string.
**Why it's wrong:** The previous CRA site used a different phone number and required cross-codebase audits to fix. CONTACT details are localized through `lib/constants.ts` and reused across emails, JSON-LD, footer, and CTAs.
**Do this instead:** `import { CONTACT, COMPANY, SOCIAL } from "@/lib/constants"` and use `CONTACT.phone`, `CONTACT.whatsappUrl`, `CONTACT.emailHref`, etc. (`lib/constants.ts:15-…`).

### Trusting the client freight estimate on submit

**What happens:** Server action persists the price the wizard sent.
**Why it's wrong:** Rates change in Supabase between mount and submit, and a malicious client can rewrite the estimate. Customer expectations diverge from quoted reality.
**Do this instead:** Always re-fetch rates and re-run `calculateFreightV2()` / `calculator-v3/engine.ts` on the server (see `app/actions/calculator.ts`). Compare `rateBookSignature` with the current server signature (`lib/calculator-contract.server.ts`) and force refresh on mismatch.

### Using raw `container_type` from Supabase

**What happens:** Code branches directly on `equipment_packing_rates.container_type`.
**Why it's wrong:** Stale rows misclassify protected types (combines, sprayers must be `flatrack`; tractors/headers/tillage must be `fortyhc`).
**Do this instead:** Always run the value through `resolveQuoteContainerType` from `lib/freight-policy.ts` first.

### Using `next/link` for marketing pages

**What happens:** `import Link from "next/link"` then `<Link href="/services" />`.
**Why it's wrong:** Loses next-intl locale prefix; sends Russian/Spanish users to English path.
**Do this instead:** `import { Link } from "@/i18n/navigation"`.

### Awaiting Slack / CAPI / auto-reply on the critical path

**What happens:** `await notifySlack(...)` / `await sendCAPIEvent(...)` before returning success.
**Why it's wrong:** Adds 700–1300 ms perceived latency; one slow integration blocks the user.
**Do this instead:** Wrap in `after(async () => { ... })` from `next/server` (see `app/actions/contact.ts`, `app/actions/calculator.ts`).

### Forgetting `setRequestLocale` in a new RSC page

**What happens:** Page uses `getTranslations` without `setRequestLocale(locale)` first.
**Why it's wrong:** Forces dynamic rendering and breaks static generation; can also miss the active locale.
**Do this instead:** Always call `setRequestLocale(locale)` before any `getTranslations` in `page.tsx` (`app/[locale]/page.tsx:69-71`).

### Reading `process.env.SUPABASE_*` from a client component

**What happens:** Wizard or form imports a helper that reads the service role key.
**Why it's wrong:** Service role bypasses RLS — leaking it to the browser is a P0 security incident.
**Do this instead:** Keep all Supabase calls in `lib/supabase-*.ts` consumed only by server actions / `route.ts` handlers. UI consumes the result via the action's return value.

### Exposing inline analytics IDs without env-var trim

**What happens:** Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` via `echo '…' | vercel env add`.
**Why it's wrong:** `echo` appends `\n`; the trailing newline lands inside an inline `<script>` template literal and breaks GA initialization (real bug, ~$811 ad spend lost previously).
**Do this instead:** Use `printf '<value>' | vercel env add NAME environment`. The build will refuse to start if the value isn't trimmed (`next.config.ts:10-25`).

## Error Handling

**Strategy:** layered with explicit boundaries.

**Patterns:**
- Server actions return a discriminated `{ success, error?, eventId? }`; the client renders the error string. They NEVER throw to the boundary.
- Boundary fallbacks: `app/[locale]/error.tsx` + `app/global-error.tsx` + `app/[locale]/global-error.tsx`. Each uses `Sentry.captureException(error)` inside `useEffect`.
- `not-found.tsx` lives at the locale layer (`app/[locale]/not-found.tsx`) and surfaces 404s.
- Best-effort side-effects (Supabase insert, Slack, Meta CAPI, auto-reply) **never** fail the user; errors are logged via `lib/logger.ts` JSON output and forwarded to Sentry (server-side `console.error` is captured by Sentry's Next.js integration).
- API routes (`app/api/.../route.ts`) return `NextResponse.json({ error }, { status })` with explicit codes; cron returns 401 if `CRON_SECRET` mismatches.
- Build-time guard: `next.config.ts` throws if inline-script env vars contain whitespace.

## Cross-Cutting Concerns

**Logging:** structured JSON via `lib/logger.ts`. Use `startTimer(route)` for any server action / route handler — emits `start` / `done` (with `ms`) / `failed` records keyed by `route`.

**Validation:** Zod at every system boundary — `lib/schemas.ts` (form schemas), `lib/calculator-v3/contracts.ts` (locale codes, localized text), inline `z.object(...)` inside route handlers (`app/api/track/wa-click/route.ts`). Never accept raw form input.

**Authentication:** none for end users (marketing site). Server-only secrets (cron, Supabase service role, Resend) live in env vars. Cron endpoints verify `Authorization: Bearer ${CRON_SECRET}`.

**Authorization:** N/A — public read-only marketing site. Lead writes go through trusted server actions.

**i18n:** `next-intl` end-to-end. Translations: `messages/{en,es,ru}.json`. Locales declared in `i18n/routing.ts`. Server uses `setRequestLocale` + `getTranslations`; client uses `useTranslations` / `useLocale`. Dates/numbers: prefer `Intl.*` formatters — none are abstracted yet.

**Tracking & analytics:** `lib/tracking.ts` is the single touchpoint; combines GA4, Meta Pixel (consent-mode-aware), Vercel Analytics, Google Ads, Meta CAPI server-side. `components/cookie-consent.tsx` flips consent state in `localStorage`.

**Email:** Resend SDK (`new Resend(apiKey)` constructed per-call inside server actions). Templates inline as HTML strings in actions; reusable booking template in `lib/emails/booking-confirmation.ts`. From-address standardized to `CONTACT.fromEmail` (`Meridian Freight <contact@meridianexport.com>`).

**SEO:** `app/sitemap.ts` (with hreflang alternates over `routing.locales`), `app/robots.ts`, `lib/metadata.ts` (`pageMetadata()`), per-page JSON-LD scripts (`app/[locale]/page.tsx`, services, FAQ, video). `next.config.ts` adds security headers + IndexNow rewrite.

**Styling:** Tailwind 4 via `@tailwindcss/postcss` (`postcss.config.mjs`); design tokens in `app/globals.css` `:root` block (oklch). No dark mode. shadcn primitives use `bg-background`, `text-foreground`. Geist fonts via `next/font/google` declared in locale layout.

**Animation:** `motion` library (formerly framer-motion) gated by `MotionProvider`; tokens (`DURATION`, `EASE`) in `lib/motion.ts`.

---

*Architecture analysis: 2026-05-04*
