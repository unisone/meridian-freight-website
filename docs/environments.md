# Environment Strategy

Last updated: 2026-04-21

## Three Environments

| Environment | Trigger | Domain | Purpose |
|-------------|---------|--------|---------|
| **Production** | Push to `main` | `meridianexport.com` | Live site |
| **Preview** | Push to any non-main branch / PR | `*.vercel.app` (auto-generated) | Feature testing |
| **Development** | `vercel env pull` → `.env.local` | `localhost:3000` | Local dev |

## Environment Variable Scoping

### Production only (14 vars)

These are intentionally **absent** from Preview and Development to prevent data pollution:

| Category | Variables | Why production-only |
|----------|-----------|-------------------|
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Test traffic pollutes GA4 reports |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN` | Test events corrupt ad attribution and CAPI conversions |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` | Preview form submits would spam the real channel |
| SEO | `INDEXNOW_KEY`, `INDEXNOW_SECRET` | Don't submit preview URLs to search engines |
| SEO | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Verification only matters on production domain |
| Google Sheets | `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SHEET_TAB_NAME`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Don't write test data to production spreadsheet |

### All environments (core infra)

| Variables | Rationale |
|-----------|-----------|
| `RESEND_API_KEY` | Form testing needs email delivery in preview |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Calculator needs DB; test leads are easily identifiable |
| `CRON_SECRET` | Cron only fires on production, but endpoint auth is harmless |
| `SENTRY_*` (7 vars) | Managed by Sentry Vercel integration; useful for preview error tracking |

## Graceful Degradation

The app handles missing env vars without crashing:

| Missing var | Behavior |
|-------------|----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 script not rendered |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel script not rendered |
| `META_ACCESS_TOKEN` | CAPI events silently skipped |
| `SLACK_BOT_TOKEN` | Slack notifications silently skipped |
| `GOOGLE_*` | Google Sheets sync silently skipped |
| `SUPABASE_URL` | Calculator shows "unavailable" with contact CTAs |
| `INDEXNOW_KEY` | IndexNow submission skipped |

## CI Pipeline

GitHub Actions runs on every PR to `main` and every push to `main`:

```
.github/workflows/ci.yml
├── npm ci          (clean install)
├── npm run lint    (ESLint)
├── npm run build   (Next.js production build, no analytics env vars)
└── npm test        (Vitest unit tests)
```

- `concurrency` cancels superseded runs on the same PR
- No Sentry/analytics tokens in CI — validates clean-room builds
- Timeout: 10 minutes

## Workflow

```
1. Create feature branch from main
2. Push → Preview deployment auto-created (no analytics, no Slack, no CAPI)
3. Test on preview URL (forms work: email + Supabase, no side effects)
4. Open PR → CI runs (lint + build + test)
5. Merge to main → auto-deploys to production (full analytics + tracking)
6. If broken → vercel rollback (instant, sub-second)
```

## Calculator Rollback

The freight calculator has an app-level rollback route in addition to Vercel deployment rollback:

| Route | Purpose | SEO |
|-------|---------|-----|
| `/pricing/calculator` | Production default, currently V3 | `index, follow` |
| `/pricing/calculator-v2` | V2 rollback route | `noindex, nofollow` |
| `/pricing/calculator-v3` | V3 preview/debug route | `noindex, nofollow` |

For a critical calculator issue, use the fastest safe option:

1. Run `vercel rollback` to restore the previous known-good production deployment.
2. If a code hotfix is safer, switch `app/[locale]/pricing/calculator/page.tsx` back to the existing V2 `CalculatorWizard` and deploy.
3. Keep `/pricing/calculator-v2` available while V3 stabilizes.
4. Re-run calculator smoke tests and `npm run audit:calculator-v3` before switching back to V3.

## Adding New Environment Variables

```bash
# Production-only (analytics, tracking, notifications):
printf 'value' | vercel env add VAR_NAME production

# All environments (core infra):
printf 'value' | vercel env add VAR_NAME production
printf 'value' | vercel env add VAR_NAME preview
printf 'value' | vercel env add VAR_NAME development

# IMPORTANT: Use printf, not echo (echo appends \n that breaks inline JS)

# After adding, pull locally:
vercel env pull .env.local
```
