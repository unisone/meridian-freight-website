# Codebase Structure

**Analysis Date:** 2026-05-04

## Directory Layout

```
meridian-freight-website/
├── app/                                # Next.js App Router (RSC by default)
│   ├── layout.tsx                      # Minimal root pass-through (Next 16 requirement)
│   ├── globals.css                     # Tailwind 4 directives + oklch design tokens
│   ├── icon.png                        # Favicon resolved by Next metadata
│   ├── sitemap.ts                      # Sitemap with hreflang alternates
│   ├── robots.ts                       # robots.txt
│   ├── global-error.tsx                # Top-most error boundary (last resort)
│   ├── [locale]/                       # Locale-prefixed marketing routes
│   │   ├── layout.tsx                  # HTML shell, providers, chrome, JSON-LD
│   │   ├── page.tsx                    # Homepage (long-scroll, all sections)
│   │   ├── error.tsx                   # Locale-level error boundary
│   │   ├── global-error.tsx            # Per-locale fallback
│   │   ├── loading.tsx                 # Default loading skeleton
│   │   ├── not-found.tsx               # 404 page
│   │   ├── about/page.tsx
│   │   ├── blog/{page.tsx,[slug]/page.tsx}
│   │   ├── contact/page.tsx
│   │   ├── destinations/{page.tsx,[slug]/page.tsx,argentina/page.tsx}
│   │   ├── equipment/{page.tsx,[slug]/page.tsx}
│   │   ├── faq/page.tsx
│   │   ├── pricing/{page.tsx,calculator/page.tsx,calculator-v2/page.tsx,calculator-v3/page.tsx}
│   │   ├── privacy/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── schedule/{page.tsx,loading.tsx}
│   │   ├── services/{page.tsx,[slug]/page.tsx}
│   │   ├── shared-shipping/page.tsx
│   │   └── terms/page.tsx
│   ├── actions/                        # "use server" Server Actions
│   │   ├── contact.ts                  # Contact form pipeline
│   │   ├── calculator.ts               # Calculator v2 submit
│   │   ├── calculator-data.ts          # Fetches v2 rate book on mount
│   │   ├── calculator-v3.ts            # Calculator v3 submit
│   │   ├── calculator-v3-data.ts       # Fetches v3 rate book on mount
│   │   ├── booking.ts                  # Shared-shipping booking
│   │   └── __tests__/                  # Vitest action tests
│   └── api/                            # Route handlers (webhooks/cron/tracking)
│       ├── cron/{rate-check,sync-containers}/route.ts
│       ├── indexnow/route.ts           # Manual IndexNow ping
│       ├── indexnow-verify/route.ts    # Serves /{key}.txt (rewrite target)
│       └── track/wa-click/route.ts     # WhatsApp click attribution
├── components/                         # Shared marketing components
│   ├── ui/                             # shadcn/ui Radix primitives
│   ├── freight-calculator/             # V2 calculator wizard + helpers
│   ├── freight-calculator-v3/          # V3 calculator wizard
│   ├── destinations/                   # Destination market-page components
│   ├── schedule/                       # Schedule list + booking form
│   ├── shared-shipping/                # Shared shipping UI
│   └── *.tsx                           # Top-level features (header/footer/hero/etc.)
├── content/                            # Typed TS content modules
│   ├── services.ts, equipment.ts, projects.ts, destinations.ts
│   ├── faq.ts, shared-shipping-faq.ts
│   ├── blog.ts, blog-es.ts, blog-ru.ts
│   ├── pricing.ts                      # Static /pricing table only — NOT calculator
│   ├── argentina-market.ts, kazakhstan-market.ts
│   └── sourcing-partners.ts
├── docs/                               # Internal docs (specs, plans, process)
│   ├── plans/                          # Dated implementation plans
│   ├── specs/                          # Feature specs
│   ├── process/                        # SOPs (localization, SEO DoD)
│   ├── sql/                            # Reference SQL (shared-shipping)
│   ├── environments.md                 # Env-var matrix
│   ├── GA4-DASHBOARD-SPEC.md
│   ├── MICRO-INTERACTIONS-SPEC.md
│   ├── PRD-MICRO-INTERACTIONS.md
│   ├── prd-calculator-redesign.md
│   ├── spec-globe-v2.md
│   ├── WEBSITE-DESIGN-REPORT.md
│   └── WEBSITE-DESIGN-REPORT.pdf
├── hooks/                              # Browser-only React hooks
│   ├── use-count-up.ts
│   └── use-scroll-direction.ts
├── i18n/                               # next-intl wiring
│   ├── routing.ts                      # Locales + defaults
│   ├── request.ts                      # getRequestConfig + dynamic message import
│   └── navigation.ts                   # createNavigation → typed Link/redirect/router
├── lib/                                # Domain + infrastructure
│   ├── calculator-v3/                  # V3 engine modules
│   ├── emails/                         # Resend HTML templates
│   ├── types/                          # Shared TS types
│   ├── __tests__/                      # Vitest tests for lib/*
│   ├── constants.ts                    # COMPANY/CONTACT/SITE/SOCIAL/NAV (single source)
│   ├── schemas.ts                      # Zod schemas
│   ├── freight-engine.ts               # Legacy engine (deprecated)
│   ├── freight-engine-v2.ts            # Current 40HC + flatrack engine
│   ├── freight-policy.ts               # Container-type resolver
│   ├── calculator-contract.ts          # Country availability
│   ├── calculator-contract.server.ts   # Rate-book signature
│   ├── supabase-rates.ts               # equipment_packing_rates + ocean_freight_rates
│   ├── supabase-containers.ts          # Container schedule
│   ├── sync-containers.ts              # Cron sync logic
│   ├── google-sheets.ts                # Sheets adapter
│   ├── slack.ts                        # Slack notifier
│   ├── meta-capi.ts                    # Meta CAPI server-side
│   ├── tracking.ts                     # Client tracking helpers
│   ├── wa-attribution.ts               # WhatsApp ref-code attribution
│   ├── logger.ts                       # Structured JSON logger
│   ├── metadata.ts                     # pageMetadata helper
│   ├── motion.ts                       # Animation tokens
│   ├── markdown.ts                     # Markdown parser
│   ├── i18n-utils.ts                   # toBCP47, getOgLocale
│   ├── container-display.ts
│   ├── shared-shipping-route.ts
│   ├── schedule-{contract,display}.ts
│   └── utils.ts                        # cn() shadcn class merger
├── messages/                           # next-intl translation catalogs
│   ├── en.json
│   ├── es.json
│   └── ru.json
├── public/                             # Static assets (served as-is)
│   ├── images/                         # Project + hero photos (.jpg)
│   ├── logos/                          # Company logos (incl. "MF Logos White/")
│   ├── favicon.png, og.jpg
│   ├── llms.txt                        # AI training opt-out
│   ├── google06d7c7c3dca85c23.html     # Google Search Console verification
│   ├── ff99b5ecadb7c3f6bb03c81244f831f3.txt   # Bing verification
│   └── yandex_6a04fca73120c14d.html    # Yandex verification
├── scripts/                            # tsx-run ops utilities
│   ├── audit-calculator-v3.ts          # `npm run audit:calculator-v3`
│   └── submit-indexnow.ts              # Bulk IndexNow submit
├── supabase/                           # Supabase project config + migrations
│   ├── config.toml                     # Local Supabase CLI config
│   └── migrations/                     # Timestamped SQL migrations
├── instrumentation.ts                  # Server/edge Sentry register hook
├── instrumentation-client.ts           # Browser Sentry init
├── proxy.ts                            # next-intl middleware (Next 16 renamed file)
├── sentry.server.config.ts             # Sentry server init
├── sentry.edge.config.ts               # Sentry edge init
├── next.config.ts                      # Headers, redirects, rewrites, withSentry+nextIntl
├── postcss.config.mjs                  # @tailwindcss/postcss wiring
├── eslint.config.mjs                   # Flat config: next/core-web-vitals + next/typescript
├── components.json                     # shadcn config (style: base-nova, RSC, lucide)
├── tsconfig.json                       # Strict TS, "@/*" → project root, ES2017 target
├── vitest.config.ts                    # Node env, "@" alias
├── vercel.json                         # Crons + asset cache headers + trailingSlash:false
├── package.json
├── package-lock.json
├── next-env.d.ts
├── README.md
├── AGENTS.md                           # Repository orientation for agents
├── CLAUDE.md                           # Claude Code SOP + architecture notes
├── LICENSE
├── SEO-REPORT-2026-03-19.md
└── i18n-implementation-report-2026-03-24.pdf
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router — pages, layouts, server actions, API routes, sitemap, robots, error boundaries
- Contains: `[locale]/` (locale-prefixed pages), `actions/` (Server Actions), `api/` (route handlers), root error/sitemap/robots
- Key files: `app/layout.tsx`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/sitemap.ts`, `app/robots.ts`

**`app/[locale]/`:**
- Purpose: All public marketing pages (RSC + static-generated)
- Contains: 16 route segments (homepage, about, blog, contact, destinations, equipment, faq, pricing×3 calculators, privacy, projects, schedule, services, shared-shipping, terms)
- Key files: `app/[locale]/layout.tsx` (shell), `app/[locale]/page.tsx` (homepage), `app/[locale]/services/[slug]/page.tsx` (dynamic)

**`app/actions/`:**
- Purpose: Server Actions (`"use server"`) for form submissions and data loading
- Contains: contact pipeline, calculator v2/v3 (data + submit), booking
- Key files: `app/actions/contact.ts`, `app/actions/calculator.ts`, `app/actions/calculator-v3.ts`, `app/actions/booking.ts`

**`app/api/`:**
- Purpose: API route handlers for non-form server endpoints (cron, tracking pixels, search-engine verification)
- Contains: `cron/rate-check`, `cron/sync-containers`, `track/wa-click`, `indexnow`, `indexnow-verify`
- Key files: `app/api/cron/rate-check/route.ts`, `app/api/track/wa-click/route.ts`

**`components/`:**
- Purpose: Shared UI components (RSC + client islands) for marketing site features
- Contains: top-level features (header/footer/hero/contact-form/etc.), feature folders (`freight-calculator/`, `freight-calculator-v3/`, `destinations/`, `schedule/`, `shared-shipping/`), shadcn primitives in `ui/`
- Key files: `components/header.tsx`, `components/footer.tsx`, `components/contact-form.tsx`, `components/freight-calculator/calculator-wizard.tsx`, `components/cookie-consent.tsx`

**`components/ui/`:**
- Purpose: shadcn/ui Radix primitives — accessible building blocks
- Contains: 22 primitives (accordion, alert, alert-dialog, badge, button, card, collapsible, dialog, dropdown-menu, input, label, navigation-menu, progress, scroll-area, select, separator, sheet, skeleton, table, tabs, textarea, tooltip)
- Key files: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/dialog.tsx`

**`content/`:**
- Purpose: Typed TS content modules (services, projects, equipment, FAQ, blog, market pages, sourcing partners). Treated as static content baked into the build.
- Contains: 13 files including locale variants (`blog.ts`, `blog-es.ts`, `blog-ru.ts`) and market pages (`argentina-market.ts`, `kazakhstan-market.ts`)
- Key files: `content/services.ts`, `content/equipment.ts`, `content/faq.ts`, `content/destinations.ts`, `content/projects.ts`. `content/pricing.ts` is for the `/pricing` table page only — **never use it for calculator math**.

**`docs/`:**
- Purpose: Internal product/engineering documentation
- Contains: `plans/` (dated implementation plans), `specs/` (feature specs), `process/` (SOPs), `sql/` (reference DDL), top-level reports (SEO, design, GA4, micro-interactions PRD)
- Key files: `docs/environments.md`, `docs/specs/2026-04-21-freight-calculator-v3-production-spec.md`, `docs/GA4-DASHBOARD-SPEC.md`

**`hooks/`:**
- Purpose: Custom React hooks (browser-only)
- Contains: `use-count-up.ts`, `use-scroll-direction.ts`
- Key files: same

**`i18n/`:**
- Purpose: next-intl configuration glue
- Contains: routing definition, request config (locale resolution + dynamic message import), typed navigation wrappers
- Key files: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`

**`lib/`:**
- Purpose: Domain logic + infrastructure adapters (pure TS, no JSX)
- Contains: freight engines, schemas, Supabase REST clients, integration adapters (Slack, Resend, Meta CAPI, Google Sheets), constants, types, utils, structured logger, metadata helper, animation tokens. Sub-folders: `calculator-v3/`, `emails/`, `types/`, `__tests__/`.
- Key files: `lib/constants.ts`, `lib/schemas.ts`, `lib/freight-engine-v2.ts`, `lib/calculator-v3/engine.ts`, `lib/supabase-rates.ts`, `lib/slack.ts`, `lib/meta-capi.ts`, `lib/logger.ts`, `lib/metadata.ts`, `lib/utils.ts`

**`messages/`:**
- Purpose: next-intl translation catalogs
- Contains: one flat JSON per locale (`en.json`, `es.json`, `ru.json`) keyed by namespace (e.g., `Common`, `HomePage`, `ContactForm`, `Metadata`, `ErrorPage`)
- Key files: `messages/en.json`, `messages/es.json`, `messages/ru.json`

**`public/`:**
- Purpose: Static assets served at site root
- Contains: project/hero `.jpg` images in `public/images/`, brand logos in `public/logos/` (with sub-folder `public/logos/MF Logos White/`), favicon, OG image, `llms.txt`, search-engine verification files
- Key files: `public/og.jpg`, `public/llms.txt`, `public/logos/MF Logos White/`

**`scripts/`:**
- Purpose: One-off ops scripts run via `tsx`
- Contains: `audit-calculator-v3.ts` (`npm run audit:calculator-v3`), `submit-indexnow.ts` (manual)
- Key files: same

**`supabase/`:**
- Purpose: Supabase project config + SQL migrations (Supabase CLI managed)
- Contains: `config.toml`, `migrations/*.sql` (3 timestamped files as of 2026-05-04)
- Key files: `supabase/migrations/20260326220648_shared_shipping_tables.sql`, `supabase/migrations/20260420230000_add_calculator_v3_metadata.sql`

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Minimal root layout (Next 16 requires; no HTML chrome)
- `app/[locale]/layout.tsx`: True app shell (HTML, fonts, providers, chrome, analytics, JSON-LD)
- `app/[locale]/page.tsx`: Homepage (long-scroll composition)
- `proxy.ts`: Locale middleware (Next 16 renames `middleware.ts` → `proxy.ts`)
- `instrumentation.ts`: Server/edge Sentry boot
- `instrumentation-client.ts`: Browser Sentry boot

**Configuration:**
- `next.config.ts`: Headers, redirects, rewrites, env-var safety, Sentry + next-intl plugin wrap
- `tsconfig.json`: TS strict, `@/*` → project root
- `vitest.config.ts`: Vitest config (Node env, `@` alias)
- `eslint.config.mjs`: Flat ESLint with `next/core-web-vitals` + `next/typescript`
- `components.json`: shadcn (style `base-nova`, RSC, lucide, neutral baseColor, CSS vars)
- `postcss.config.mjs`: `@tailwindcss/postcss`
- `vercel.json`: Vercel cron schedules + image cache headers + `trailingSlash: false`
- `app/globals.css`: Tailwind directives + design tokens (`@theme inline`, oklch)
- `.env.example`, `.env.local`: env-var manifest (never commit `.env.local`)

**Routing:**
- Static pages: `app/[locale]/<segment>/page.tsx`
- Dynamic pages: `app/[locale]/{services,equipment,destinations,blog}/[slug]/page.tsx`
- Calculator variants: `app/[locale]/pricing/{calculator,calculator-v2,calculator-v3}/page.tsx`
- API routes: `app/api/<group>/<endpoint>/route.ts`
- Sitemap/robots: `app/sitemap.ts`, `app/robots.ts`

**API endpoints:**
- `POST /api/track/wa-click` → `app/api/track/wa-click/route.ts`
- `GET /api/cron/rate-check` → `app/api/cron/rate-check/route.ts` (Vercel cron, weekly)
- `GET /api/cron/sync-containers` → `app/api/cron/sync-containers/route.ts` (every 15 min)
- `POST /api/indexnow` → `app/api/indexnow/route.ts`
- `GET /{key}.txt` → rewritten to `app/api/indexnow-verify/route.ts`

**Server Actions (forms):**
- Contact: `app/actions/contact.ts` `submitContactForm`
- Calculator v2 submit: `app/actions/calculator.ts` `submitCalculator`
- Calculator v2 mount data: `app/actions/calculator-data.ts` `getCalculatorData`
- Calculator v3 submit: `app/actions/calculator-v3.ts`
- Calculator v3 mount data: `app/actions/calculator-v3-data.ts`
- Booking: `app/actions/booking.ts`

**Types:**
- Calculator types: `lib/types/calculator.ts`
- Shared shipping types: `lib/types/shared-shipping.ts`
- Calculator v3 contracts: `lib/calculator-v3/contracts.ts`
- Schedule contract: `lib/schedule-contract.ts`
- Form data types: derived from Zod schemas in `lib/schemas.ts` via `z.infer`

**Utilities:**
- shadcn class merger: `lib/utils.ts` (`cn()`)
- Logger: `lib/logger.ts` (`log`, `startTimer`)
- i18n helpers: `lib/i18n-utils.ts` (`toBCP47`, `getOgLocale`)
- Metadata helper: `lib/metadata.ts` (`pageMetadata`)
- Motion tokens: `lib/motion.ts` (`DURATION`, `EASE`)
- Tracking: `lib/tracking.ts`

**Tests:**
- `lib/__tests__/*.test.ts` — engine + contract tests (e.g., `freight-engine-v2.test.ts`, `freight-engine-v3.test.ts`, `calculator-contract.test.ts`, `i18n-utils.test.ts`, `schedule-display.test.ts`, `sync-containers.test.ts`)
- `app/actions/__tests__/*.test.ts` — Server Action tests (`contact.test.ts`, `calculator.test.ts`, `booking.test.ts`)

**Database:**
- Migrations: `supabase/migrations/*.sql`
- Reference DDL: `docs/sql/shared-shipping-tables.sql`
- Tables in code: `leads`, `equipment_packing_rates`, `ocean_freight_rates`, container/shared-shipping tables (per migrations)

## Naming Conventions

**Files:**
- React components, route segments, layouts, hooks, server actions, lib utilities: **kebab-case `.ts` / `.tsx`**.
  Examples: `calculator-wizard.tsx`, `contact-form.tsx`, `use-scroll-direction.ts`, `freight-engine-v2.ts`, `wa-attribution.ts`.
- Test files: `<name>.test.ts` next to the unit, but co-located in a sibling `__tests__/` folder (`lib/__tests__/`, `app/actions/__tests__/`).
- Route folder names: kebab-case + reserved Next conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `global-error.tsx`).
- Dynamic segments: `[slug]`, `[locale]`. Catch-all/group conventions are NOT used.
- Sentry/instrumentation/proxy: at repo root with the canonical names Next expects (`proxy.ts`, `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`).
- SQL migrations: `<unix-like-timestamp>_<snake_case_description>.sql` (Supabase CLI default).
- Doc plans: `YYYY-MM-DD-<slug>.md` under `docs/plans/`.

**Components & exports:**
- React component identifier: **PascalCase** (`ContactForm`, `CalculatorWizard`, `ScrollReveal`).
- Named exports preferred (`export function Header() {}`); default exports reserved for Next route conventions (`page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, `route.ts`'s `GET`/`POST` are named).
- Hook identifier: `useXxx` camelCase (`useCountUp`, `useScrollDirection`).
- Server Action identifier: camelCase verbs (`submitContactForm`, `submitCalculator`, `getCalculatorData`).

**Variables & types:**
- Constants object literals: SCREAMING_SNAKE-style only when truly immutable enum-like (`COMPANY`, `CONTACT`, `SITE`, `SOCIAL`, `NAV_ITEMS`, `TRACKING` in `lib/constants.ts` — exported as `as const` objects with PascalCase grouping).
- TS types/interfaces: PascalCase (`ContactFormData`, `FreightEstimateV2`, `EquipmentPackingRate`).
- Zod schemas: camelCase suffixed with `Schema` (`contactFormSchema`, `calculatorV2Schema`).
- Locale codes: lowercase `"en" | "es" | "ru"` (single source: `i18n/routing.ts`).

**Route groups:**
- No Next route groups (`(group)`) currently in use. Locale segmentation via `[locale]` plus the typed `Link` from `@/i18n/navigation` is the only logical grouping.

**CSS classes:**
- Tailwind utility-first; component-level classes assembled with `cn()` from `lib/utils.ts`. Design tokens (`bg-background`, `text-foreground`, `bg-muted`, `text-primary`) defined in `app/globals.css`.

## Where to Add New Code

**New marketing page:**
- Route folder: `app/[locale]/<page-slug>/page.tsx`
- Add `setRequestLocale(locale)` first line of the component, export `generateMetadata` (use `pageMetadata` from `lib/metadata.ts`) and `generateStaticParams` if dynamic.
- Sitemap: extend `app/sitemap.ts` (add entry with `withAlternates(...)` if it should ship in all locales).
- Translations: add namespace + keys to `messages/{en,es,ru}.json`.

**New dynamic content type:**
- Typed module: `content/<thing>.ts` exporting `getAll<Thing>(locale)` + `get<Thing>BySlug(slug, locale)`.
- Page: `app/[locale]/<thing>/page.tsx` (index) + `app/[locale]/<thing>/[slug]/page.tsx` (detail).
- Wire into sitemap (`app/sitemap.ts`).

**New form / mutation:**
- Server Action: `app/actions/<feature>.ts` with `"use server"`, Zod schema in `lib/schemas.ts`, structured logging via `lib/logger.ts`. Defer Slack/CAPI/auto-reply to `after()` from `next/server`.
- Client form: `components/<feature>-form.tsx` (`"use client"`), import the action, render validation errors, fire client tracking via `lib/tracking.ts`.
- Tests: `app/actions/__tests__/<feature>.test.ts` and a Zod boundary test.

**New shared component:**
- Generic feature: `components/<name>.tsx` (camelCase verb if action, PascalCase identifier).
- shadcn primitive: only via `npx shadcn@latest add <primitive>` writing to `components/ui/`. Match alias in `components.json`.
- Feature group: nested folder under `components/` (mirror `freight-calculator/`, `schedule/`, `shared-shipping/`).

**New API endpoint (route handler):**
- Folder: `app/api/<group>/<endpoint>/route.ts`. Default to Node runtime. Validate with Zod, return `NextResponse.json(...)`.
- Cron: register schedule in `vercel.json` `crons` array; verify `Authorization: Bearer ${CRON_SECRET}`.

**New domain logic / integration:**
- File: `lib/<concern>.ts`. Pure functions only; no JSX. Import `process.env.*` at call time (don't capture to module-level vars unless inside a per-call function).
- Integration adapter: mirror existing pattern (`lib/slack.ts`, `lib/meta-capi.ts`, `lib/supabase-rates.ts`) — best-effort `try/catch` + logger.

**New translation strings:**
- Add to all three locales: `messages/en.json`, `messages/es.json`, `messages/ru.json` under the same namespace key. Server-side: `getTranslations("Namespace")`. Client-side: `useTranslations("Namespace")`.

**New shadcn primitive:**
- `npx shadcn@latest add <name>` (style `base-nova`, will land in `components/ui/<name>.tsx` per `components.json`).

**New env var:**
- Add to `.env.example` with placeholder + comment. Document in `CLAUDE.md` env table and `docs/environments.md`. Reference via `process.env.<NAME>` in server-only code; never expose service-role keys to the browser.
- For inline-`<script>`-embedded vars (analytics IDs starting with `NEXT_PUBLIC_`), set via `printf 'value' | vercel env add NAME env` to avoid newline corruption.

**New Supabase migration:**
- File: `supabase/migrations/<timestamp>_<description>.sql` (Supabase CLI: `supabase migration new <description>`). Apply via `supabase db push`.
- Document any schema/column the calculator needs in `lib/types/calculator.ts` + `CLAUDE.md`'s "Key DB Fields" table.

**New test:**
- Engine / pure logic: `lib/__tests__/<unit>.test.ts`.
- Server Action: `app/actions/__tests__/<action>.test.ts`. Run via `npm test`.

## How Locales Are Organized

- **Declared once** in `i18n/routing.ts`:
  ```ts
  defineRouting({ locales: ["en","es","ru"] as const, defaultLocale: "en",
                  localePrefix: "as-needed", localeDetection: false, alternateLinks: false })
  ```
- **URL convention** (`localePrefix: "as-needed"`):
  - English: NO prefix (`/services`, `/contact`, `/pricing/calculator`).
  - Spanish: `/es/services`, `/es/contact`, …
  - Russian: `/ru/services`, `/ru/contact`, …
- **Page tree**: every page lives under `app/[locale]/...`. The `[locale]` param is awaited from `params: Promise<{ locale }>` and passed to `setRequestLocale(locale)` before any translation call.
- **Static generation**: `generateStaticParams` returns `routing.locales.map(l => ({ locale: l }))`; combined with content slugs for dynamic segments.
- **Translations** live in **flat JSON per locale** at `messages/{en,es,ru}.json`. Namespaces (top-level keys) match component/page domains: `Common`, `Metadata`, `HomePage`, `ContactForm`, `ErrorPage`, etc.
- **Loading translations**: `i18n/request.ts` dynamically imports `messages/${locale}.json` per request; the next-intl plugin wires this via `next.config.ts` (`createNextIntlPlugin("./i18n/request.ts")`).
- **Internal navigation**: import `{ Link }` from `@/i18n/navigation`. Never use `next/link` directly — it bypasses locale prefixing.
- **Locale-specific content**:
  - Per-locale market pages: `app/[locale]/destinations/argentina/page.tsx` (Spanish-canonical; redirects from non-`es` to `/es/destinations/argentina` via `next.config.ts`).
  - Per-locale blog content modules: `content/blog.ts`, `content/blog-es.ts`, `content/blog-ru.ts`.
  - Per-locale email subjects/bodies: hard-coded objects keyed by locale inside server actions (`AUTO_REPLY_SUBJECTS`, `AUTO_REPLY_BODY` in `app/actions/contact.ts`).
- **SEO hreflang**: `app/sitemap.ts` adds `alternates.languages` for `en`/`es`/`ru` per static path. Locale layout's `metadata.alternates.languages` mirrors this.
- **JSON-LD `inLanguage`**: derived from `toBCP47(locale)` (`lib/i18n-utils.ts`) and `getOgLocale(locale)` for Open Graph.
- **Structured-data descriptions per locale**: see `getStructuredDataDescription()` in `app/[locale]/layout.tsx`.

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase mapping output (this file + `ARCHITECTURE.md`)
- Generated: Yes (by `/gsd-map-codebase`)
- Committed: per-team policy (typically committed)

**`.next/`, `.vercel/`, `.serena/`, `.local-reports/`, `.playwright-mcp/`, `output/`:**
- Purpose: build / tooling caches and local artifacts
- Generated: Yes
- Committed: No (gitignored)

**`node_modules/`:**
- Purpose: npm-installed dependencies
- Generated: Yes
- Committed: No

**`.github/`:**
- Purpose: CI workflows + PR template
- Contains: `workflows/ci.yml`, `workflows/auto-merge-dependabot.yml`, `pull_request_template.md`
- Committed: Yes

**`public/logos/MF Logos White/`:**
- Purpose: Brand white-on-dark logo variants (note the space in the folder name — quote in shell commands)
- Committed: Yes

**`supabase/.temp/`:**
- Purpose: Supabase CLI scratch
- Generated: Yes
- Committed: No

**Root-level `.tmp-*.png` and `audit-*.png` / `before-*.png` / `after-*.png`:**
- Purpose: Ad-hoc local screenshots from previous audits/tests
- Generated: Yes (manual)
- Committed: typically not — clean up before PR

---

*Structure analysis: 2026-05-04*
