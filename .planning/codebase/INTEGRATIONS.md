# External Integrations

**Analysis Date:** 2026-05-04

## APIs & External Services

**Email (transactional):**
- Resend — Owner notification + visitor auto-reply for contact form, calculator, and bookings
  - SDK: `resend` ^6.12.0
  - Imports: `app/actions/contact.ts`, `app/actions/booking.ts`, `app/actions/calculator.ts` (via shared helper)
  - Auth env var: `RESEND_API_KEY`
  - Required: yes — owner email MUST succeed; visitor auto-reply is best-effort

**Database (lead storage + freight pricing):**
- Supabase — Postgres + REST (PostgREST) used WITHOUT the `@supabase/supabase-js` SDK; raw `fetch` against `${SUPABASE_URL}/rest/v1/<table>` with `apikey` + `Authorization: Bearer <SERVICE_ROLE>` headers
  - Files: `lib/supabase-rates.ts` (read `equipment_packing_rates`, `ocean_freight_rates`), `lib/supabase-containers.ts`, `lib/sync-containers.ts`, `app/actions/contact.ts` / `app/actions/booking.ts` (INSERT into `leads`, `space_booking_requests`)
  - Auth env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Migrations: `supabase/migrations/20260326220648_shared_shipping_tables.sql`, `20260403150000_add_container_count.sql`, `20260420230000_add_calculator_v3_metadata.sql`
  - Required: optional — calculator and lead storage gracefully degrade if unset

**Notifications:**
- Slack (Web API) — Lead intake notifications, weekly rate-freshness alerts
  - File: `lib/slack.ts` — direct `fetch` to `https://slack.com/api/chat.postMessage`
  - Auth env vars: `SLACK_BOT_TOKEN`, `SLACK_FORM_INTAKE_CHANNEL_ID` (fallback `SLACK_CHANNEL_ID`)
  - Required: optional — best-effort, fails silently

**Analytics — first-party / consent-aware:**
- Google Analytics 4 (gtag.js + Consent Mode v2)
  - File: `components/google-analytics.tsx` — loads `https://www.googletagmanager.com/gtag/js?id=${gaId}` via `next/script`
  - Helpers: `lib/tracking.ts` (`trackGA4Event`, `trackContactClick`, `trackCtaClick`, `trackCalcFunnel`, `getGA4ClientId`, `captureAttribution`)
  - Two GA4 properties (main + LP) — only main wired here
  - Auth env var: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (validated for trailing whitespace at build time in `next.config.ts`)
  - Required: optional
- Meta Pixel (client-side)
  - File: `components/meta-pixel.tsx` — loads `https://connect.facebook.net/en_US/fbevents.js`
  - Default `fbq('consent', 'revoke')`, upgraded on cookie acceptance
  - Auth env var: `NEXT_PUBLIC_META_PIXEL_ID` (build-time newline guard in `next.config.ts`)
  - Required: optional
- Meta Conversions API (server-side)
  - File: `lib/meta-capi.ts` — `https://graph.facebook.com/v21.0/{PIXEL_ID}/events`, SHA-256 hashed PII
  - Used by `app/actions/contact.ts` and `app/actions/calculator.ts` for server-side `Lead` events
  - Auth env vars: `META_PIXEL_ID` (fallback `NEXT_PUBLIC_META_PIXEL_ID`), `META_ACCESS_TOKEN`
  - Required: optional — best-effort, runs in `after()` background block
- Google Ads
  - Same `gtag.js` script as GA4; conversion IDs configured separately
  - Env vars: `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GADS_LEAD_LABEL`, `NEXT_PUBLIC_GADS_WHATSAPP_LABEL`
- Vercel Analytics (audience)
  - File: `components/vercel-analytics.tsx` — wraps `<Analytics />` from `@vercel/analytics/next` with `beforeSend` locale normalization (strips `/es/`, `/ru/` prefixes)
  - Server `track()` from `@vercel/analytics/server` used in `app/actions/contact.ts` + `app/actions/calculator.ts` (`lead_submitted` events) inside `after()` block
  - Auth: none (Vercel project context)
  - Required: yes (Vercel-managed)
- Vercel Speed Insights (Web Vitals)
  - File: `app/[locale]/layout.tsx` (`<SpeedInsights />` from `@vercel/speed-insights/next`)
  - Auth: none
  - Required: yes (Vercel-managed)

**Error Monitoring:**
- Sentry
  - SDK: `@sentry/nextjs` ^10.49.0
  - Files: `instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `app/global-error.tsx`, `app/[locale]/error.tsx`
  - 10% trace sampling (1.0 in dev), 100% replay on error, 0% session replay otherwise
  - Build-time source map upload via `withSentryConfig` in `next.config.ts`
  - Auth env vars (runtime): `NEXT_PUBLIC_SENTRY_DSN`. Build-time: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
  - Required: optional — Sentry dormant if `NEXT_PUBLIC_SENTRY_DSN` is unset

**Search engine indexing:**
- IndexNow (Bing / Yandex)
  - Routes: `app/api/indexnow/route.ts` (bulk submit), `app/api/indexnow-verify/route.ts` (key verification — `next.config.ts` rewrites `/:key.txt` to this route)
  - Script: `scripts/submit-indexnow.ts` (run via `tsx`)
  - Auth env vars: `INDEXNOW_KEY`, `INDEXNOW_SECRET`
  - Required: optional
- Google Search Console — verification file `public/google06d7c7c3dca85c23.html`; meta tag fallback via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Bing Webmaster Tools — verification file `public/ff99b5ecadb7c3f6bb03c81244f831f3.txt`; meta tag fallback via `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- Yandex — hardcoded verification token `"6a04fca73120c14d"` in `app/[locale]/layout.tsx`

**Google Sheets (operational data sync):**
- Google Sheets REST API v4 — direct `fetch`, no `googleapis` SDK
  - File: `lib/google-sheets.ts` — Service Account JWT signing using Web Crypto (RS256)
  - Used by `lib/sync-containers.ts` (called from `/api/cron/sync-containers`) to sync shared-container booking inventory
  - Auth env vars: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SHEET_TAB_NAME`
  - Required: required for `sync-containers` cron to function; not in `.env.example` (undocumented secret)

**Embedded third-party content:**
- Google Maps embed (iframe) — `app/[locale]/contact/page.tsx` uses `https://www.google.com/maps?q=42.1172,-92.9835&z=14&output=embed` (no API key required for `output=embed`)
- YouTube (privacy-enhanced) — `components/video-section.tsx` embeds `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`; thumbnails from `img.youtube.com` (whitelisted in `next.config.ts` `images.remotePatterns`); `<link rel="preconnect">` in `app/[locale]/layout.tsx`

## Data Storage

**Databases:**
- Supabase (Postgres) via PostgREST
  - Connection: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars
  - Client: raw `fetch` (no SDK) — see `lib/supabase-rates.ts:10-23` for the auth helpers
  - Tables in use:
    - `leads` (contact form, calculator, booking inserts)
    - `equipment_packing_rates` (read by calculator)
    - `ocean_freight_rates` (read by calculator)
    - `shared_containers` (read for booking portal, written by sync cron)
    - `space_booking_requests` (booking portal inserts)

**File Storage:**
- Local filesystem only (`public/`) — no S3, GCS, or Supabase Storage integration detected
- Static assets: `public/images/`, `public/logos/`, `public/og.jpg`, `public/llms.txt`

**Caching:**
- HTTP cache headers via `vercel.json` (`/images/*` and `/logos/*` immutable 1-year, `/llms.txt` 24h)
- No Redis / Upstash / Vercel KV detected
- next-intl `setRequestLocale` enables RSC caching of locale-rendered output

## Authentication & Identity

**Auth Provider:**
- None — public marketing site, no user accounts, no login flow
- Cron endpoints protected by shared-secret Bearer header (`CRON_SECRET`) — see `app/api/cron/rate-check/route.ts:14-19`
- Supabase access uses service-role key only (no Row Level Security paths exposed; service role bypasses RLS)

## Monitoring & Observability

**Error Tracking:**
- Sentry (`@sentry/nextjs`) — client + server + edge runtime initialized via `instrumentation*.ts`

**Performance:**
- Sentry traces (10% sample)
- Vercel Speed Insights (`<SpeedInsights />` in `app/[locale]/layout.tsx`)
- Vercel Analytics audience + custom events

**Logs:**
- Structured JSON logging via `lib/logger.ts` — `startTimer(route)`, `log({ level, msg, route, ... })` — emitted to stdout/stderr for Vercel Runtime Logs

## CI/CD & Deployment

**Hosting:**
- Vercel — project `meridian-freight-export`, primary domain `meridianexport.com`
- Production = `main` branch; preview = all other branches / PRs

**CI Pipeline:**
- GitHub Actions (`.github/workflows/`):
  - `ci.yml` — lint + build + test on PR and push to `main` (Node 22)
  - `auto-merge-dependabot.yml` — auto-merges Dependabot PRs after CI passes
  - `lighthouse.yml` — Lighthouse CI with `lighthouse-budget.json`
  - `smoke-test.yml` — post-deploy smoke check
  - `cleanup-branches.yml` — branch maintenance

**Cron jobs (Vercel — declared in `vercel.json`):**
- `/api/cron/rate-check` — weekly (Mon 09:00 UTC) — checks freshness of Supabase rate tables, alerts Slack if older than 45 days. File: `app/api/cron/rate-check/route.ts`
- `/api/cron/sync-containers` — every 15 minutes — pulls shared-container inventory from Google Sheets into Supabase. File: `app/api/cron/sync-containers/route.ts`
- Both gated by `Authorization: Bearer ${CRON_SECRET}`

## Environment Configuration

**Required env vars (lead pipeline functional):**
- `RESEND_API_KEY` — must be set; owner email is mandatory for form submission

**Optional but recommended (graceful degradation if unset):**
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — calculator shows "unavailable" if missing
- `SLACK_BOT_TOKEN`, `SLACK_FORM_INTAKE_CHANNEL_ID` (fallback `SLACK_CHANNEL_ID`)
- `NEXT_PUBLIC_SENTRY_DSN` — Sentry dormant if unset
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GADS_LEAD_LABEL`, `NEXT_PUBLIC_GADS_WHATSAPP_LABEL`
- `INDEXNOW_KEY`, `INDEXNOW_SECRET`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `CRON_SECRET` — cron endpoints return 401 if unset
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SHEET_TAB_NAME` — required for `sync-containers` cron (NOT documented in `.env.example`)

**Build-time only:**
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` — source map upload during `next build`

**Environment scoping (Vercel):**
- Analytics + Meta CAPI + Slack + IndexNow + SEO verification + Google Sheets are production-only
- Supabase, Resend, Sentry, CRON_SECRET available in all environments
- Preview deployments intentionally have no analytics/Slack/CAPI side effects

**Secrets location:**
- Local: `.env.local` (gitignored)
- CI/Production: Vercel project env (per environment scope)
- Template: `.env.example` (committed, no values)

**Build-time newline guard:**
- `next.config.ts` lines 10-25 throw at build time if `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, or `NEXT_PUBLIC_GOOGLE_ADS_ID` contain trailing whitespace (root cause: `echo` instead of `printf` when piping to `vercel env add`)

## Webhooks & Callbacks

**Incoming HTTP routes (`app/api/`):**
- `POST /api/track/wa-click` — WhatsApp click attribution capture, validates with Zod, stores via `lib/wa-attribution.ts` (`app/api/track/wa-click/route.ts`)
- `GET /api/cron/rate-check` — Vercel cron (Bearer-gated)
- `GET /api/cron/sync-containers` — Vercel cron (Bearer-gated)
- `POST /api/indexnow` — Bulk URL submission to IndexNow endpoints
- `GET /api/indexnow-verify` — IndexNow key verification (also reachable via `/{key}.txt` rewrite)

No public-facing webhook receivers (e.g., Stripe / Resend / Slack events) are configured.

**Outgoing calls (server → external):**
- Resend API (`resend` SDK)
- Supabase REST (`fetch`)
- Slack `chat.postMessage` (`fetch`)
- Meta Graph API CAPI (`fetch`)
- Google Sheets v4 + Google OAuth token endpoint (`fetch` with JWT)
- IndexNow submission endpoints (`fetch`)
- Vercel Analytics server `track()`
- Sentry ingest (via SDK)

**Form submission flow (Server Actions, not API routes):**
- `app/actions/contact.ts` — contact form
- `app/actions/calculator.ts` — freight calculator
- `app/actions/booking.ts` — shared container booking
- Pattern: validate → honeypot → Supabase insert → Resend owner email → respond → `after()` runs Resend auto-reply, Slack, Meta CAPI, Vercel server `track()`

---

*Integration audit: 2026-05-04*
