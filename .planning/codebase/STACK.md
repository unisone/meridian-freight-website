# Technology Stack

**Analysis Date:** 2026-05-04

## Languages

**Primary:**
- TypeScript ^6 — All application code (`.ts`, `.tsx`). Strict mode enabled in `tsconfig.json` (`"strict": true`)
- TSX (React 19 JSX) — All UI components under `components/` and route segments under `app/`

**Secondary:**
- SQL — Supabase migrations under `supabase/migrations/`
- CSS — Tailwind 4 design tokens via `@theme inline` in `app/globals.css`
- MJS — ESLint flat config (`eslint.config.mjs`), PostCSS config (`postcss.config.mjs`)

**Compile target:** `target: "ES2017"` per `tsconfig.json`. Module resolution `bundler` with JSX `react-jsx`.

## Runtime

**Environment:**
- Node.js 22 (pinned in `.github/workflows/ci.yml` via `actions/setup-node@v6` with `node-version: "22"`)
- Vercel serverless + Edge runtimes (declared via `instrumentation.ts` checking `NEXT_RUNTIME === "nodejs" | "edge"`)

**Package Manager:**
- npm (lockfile `package-lock.json` present)
- No Yarn / pnpm lockfiles detected
- `overrides` block in `package.json` pins `@swc/helpers ^0.5.21` and `lodash-es ^4.18.1`

## Frameworks

**Core:**
- Next.js 16.2.4 — App Router, RSC, Server Actions, `after()` background processing. Configured in `next.config.ts` and wrapped with `withSentryConfig(withNextIntl(nextConfig))`
- React 19.2.5 + react-dom 19.2.5 — Required by Next 16
- next-intl ^4.9.1 — i18n routing for `en`, `es`, `ru`. Plugin loaded in `next.config.ts` via `createNextIntlPlugin("./i18n/request.ts")`. Middleware in `proxy.ts` (note: file is named `proxy.ts`, not the conventional `middleware.ts`)
- Tailwind CSS ^4 (`@tailwindcss/postcss` ^4) — Configured exclusively via `postcss.config.mjs` and `@theme inline` block in `app/globals.css` (no `tailwind.config.ts`)

**UI:**
- shadcn ^4.3.1 — `components.json` style `base-nova`, RSC enabled, baseColor `neutral`, components live in `components/ui/`
- @base-ui/react ^1.4.1 — Headless UI primitives (Radix successor)
- lucide-react ^1.8.0 — Icon library (set as `iconLibrary` in `components.json`)
- motion ^12.38.0 — Animation library (formerly Framer Motion)
- class-variance-authority ^0.7.1 — Variant API for shadcn components
- clsx ^2.1.1 + tailwind-merge ^3.5.0 — `cn()` helper class composition (`lib/utils.ts`)
- tw-animate-css ^1.4.0 — Tailwind v4 animation utilities
- react-globe.gl ^2.37.1 — 3D globe visualization for destinations / route map (`components/destinations-globe.tsx`)
- @types/three ^0.184.0 — Type companion to react-globe.gl (Three.js)

**Validation:**
- zod ^4.3.6 — Form / payload schemas in `lib/schemas.ts` and API route validators (e.g., `app/api/track/wa-click/route.ts`)

**Email:**
- resend ^6.12.0 — Transactional email (used in `app/actions/contact.ts`, `app/actions/booking.ts`)

**Observability:**
- @sentry/nextjs ^10.49.0 — Error tracking and performance, source map upload via `withSentryConfig`
- @vercel/analytics ^2.0.1 — First-party analytics, custom server + client `track()` calls
- @vercel/speed-insights ^2.0.0 — Web Vitals via `<SpeedInsights />` in locale layout

**Testing:**
- vitest ^4.1.4 — Unit test runner. Config: `vitest.config.ts` (`environment: "node"`, `globals: true`, `@/*` alias to project root)

**Build/Dev:**
- next 16.2.4 — `next dev` (Turbopack), `next build`, `next start`
- tsx ^4.21.0 — TS script runner (used by `npm run audit:calculator-v3 → scripts/audit-calculator-v3.ts`)
- typescript ^6 — Type checking via `tsc --noEmit` (`npm run type-check`)
- eslint ^9.39.4 + eslint-config-next 16.2.4 — Flat config in `eslint.config.mjs`, extends `core-web-vitals` + `typescript`

## Key Dependencies

**Critical:**
- next 16.2.4 — Web framework
- react 19.2.5 / react-dom 19.2.5 — UI runtime
- next-intl ^4.9.1 — Multi-locale routing & message dictionaries (`messages/en.json`, `messages/es.json`, `messages/ru.json`)
- @sentry/nextjs ^10.49.0 — Error / perf monitoring; build wrapper uploads source maps
- resend ^6.12.0 — Owner email is mandatory for lead pipeline; failure aborts submission
- zod ^4.3.6 — Boundary validation for all server actions and API routes
- motion ^12.38.0 — Scroll animations, transitions across marketing surfaces

**Infrastructure:**
- @vercel/analytics ^2.0.1 — Audience + custom event analytics (client + server)
- @vercel/speed-insights ^2.0.0 — Web Vitals (TTFB, LCP, INP, CLS)
- react-globe.gl ^2.37.1 + @types/three ^0.184.0 — 3D globe in destinations / freight calculator hero
- @base-ui/react ^1.4.1 — Headless primitives consumed by shadcn UI
- shadcn ^4.3.1 + class-variance-authority ^0.7.1 + clsx ^2.1.1 + tailwind-merge ^3.5.0 + tw-animate-css ^1.4.0 — Design system stack
- lucide-react ^1.8.0 — Icons
- @tailwindcss/postcss ^4 + tailwindcss ^4 — Styling pipeline

**Dev / type-only:**
- @types/node ^25, @types/react ^19, @types/react-dom ^19, @types/three ^0.184.0
- tsx ^4.21.0 (script runner)
- vitest ^4.1.4 (tests)

## Configuration

**Root configuration files:**
- `next.config.ts` — Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy), redirects (`/destinations/argentina` → `/es/destinations/argentina`), rewrites (IndexNow `/:key.txt` → `/api/indexnow-verify`), `images.remotePatterns` (allows `img.youtube.com`), build-time env-var newline guard for `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`. Wrapped in `withSentryConfig(withNextIntl(...))`
- `tsconfig.json` — Strict, `target: ES2017`, `moduleResolution: bundler`, `paths: { "@/*": ["./*"] }`, `plugins: [{ name: "next" }]`
- `postcss.config.mjs` — Single plugin: `@tailwindcss/postcss`
- `eslint.config.mjs` — Flat config extending `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`; ignores `.next/`, `.vercel/`, `out/`, `build/`, `next-env.d.ts`
- `vitest.config.ts` — Node env, globals, `@` alias to project root
- `components.json` — shadcn config (style `base-nova`, RSC, baseColor `neutral`, lucide icons)
- `vercel.json` — Two cron schedules (`/api/cron/rate-check` weekly Mon 09:00, `/api/cron/sync-containers` every 15 min); cache-control headers for `/images/*`, `/logos/*`, `/llms.txt`; `trailingSlash: false`
- `instrumentation.ts` — Next.js instrumentation hook; loads `sentry.server.config` (Node) or `sentry.edge.config` (Edge); exports `Sentry.captureRequestError` as `onRequestError`
- `instrumentation-client.ts` — Client-side `Sentry.init` (10% trace sample in prod, 100% replay on error, `replayIntegration`); exports `Sentry.captureRouterTransitionStart` as `onRouterTransitionStart`
- `sentry.server.config.ts` — Server `Sentry.init` (10% traces)
- `sentry.edge.config.ts` — Edge `Sentry.init` (10% traces)
- `proxy.ts` — next-intl middleware (matcher excludes `/api`, `/_next`, `/_vercel`, anything with a file extension); note non-standard filename
- `i18n/routing.ts` — Locales `["en","es","ru"]`, default `en`, `localePrefix: "as-needed"`, `localeDetection: false`
- `i18n/request.ts`, `i18n/navigation.ts` — next-intl request handler + Link/redirect helpers
- `next-env.d.ts` — Auto-generated Next types
- `tsconfig.tsbuildinfo` — Incremental build cache (committed; could be gitignored)

**Environment files:**
- `.env.example` — Tracked template enumerating expected vars (no secrets)
- `.env.local` — Present (gitignored) — local secrets
- No `.env.production` / `.env.development` — Vercel manages prod/preview env

**CI / deploy:**
- `.github/workflows/ci.yml` — Lint + build + test on PR / push to `main` (Node 22, ubuntu-latest, 10-min timeout)
- `.github/workflows/auto-merge-dependabot.yml`
- `.github/workflows/cleanup-branches.yml`
- `.github/workflows/lighthouse.yml` (uses `.github/lighthouse-budget.json`)
- `.github/workflows/smoke-test.yml`
- `.github/dependabot.yml`
- `.github/pull_request_template.md`

**Database:**
- `supabase/config.toml`
- `supabase/migrations/20260326220648_shared_shipping_tables.sql`
- `supabase/migrations/20260403150000_add_container_count.sql`
- `supabase/migrations/20260420230000_add_calculator_v3_metadata.sql`

## Platform Requirements

**Development:**
- Node.js 22.x (matching CI)
- npm (lockfile committed)
- macOS / Linux / WSL — standard Next.js dev requirements
- Optional: Vercel CLI (`vercel env pull` to populate `.env.local`)
- Optional: Supabase CLI for local migrations against `supabase/config.toml`

**Production:**
- Vercel hosting (project: `meridian-freight-export`, domain `meridianexport.com`)
- Two runtimes used: Node.js (default) for Server Actions / API routes, Edge for middleware (next-intl proxy)
- Vercel Cron jobs (declared in `vercel.json`) — require `CRON_SECRET` Authorization header

**Build outputs:**
- 16+ pages, all SSG via `generateStaticParams` (locale × route) — confirmed in `app/[locale]/layout.tsx` and per-page `generateStaticParams`
- Sentry source maps uploaded at build time when `SENTRY_AUTH_TOKEN` is set (`silent: !process.env.CI`)

---

*Stack analysis: 2026-05-04*
