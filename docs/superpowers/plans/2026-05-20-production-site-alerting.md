# Production Site Alerting Implementation Plan

> Updated May 20, 2026: GitHub scheduled monitoring is explicitly rejected for this site and has been removed. Do not use this plan to recreate a GitHub Actions uptime monitor.

**Goal:** Provide production outage alerting that reaches Slack `#mfexport-site-alerts` and `alex.z@meridianexport.com` without requiring anyone to watch a dashboard.

**Architecture:** Keep a repo-owned `/api/health` canary that synthetic monitors can request. Use Vercel-native alerts for platform-observed error/usage anomalies and an outside-in uptime provider for true public website availability checks.

---

## File Structure

- `app/api/health/route.ts`: Node runtime health canary.
- `app/api/health/__tests__/route.test.ts`: health route behavior tests.
- `docs/runbooks/production-site-alerts.md`: alert routing, Vercel setup notes, outside-in provider setup, and incident response.

Removed and intentionally not used:

- `.github/workflows/site-alert-monitor.yml`
- `scripts/site-alert-monitor.ts`
- `lib/site-alerts/monitor.ts`
- `lib/site-alerts/__tests__/monitor.test.ts`

## Tasks

### Task 1: Health Canary

**Files:**
- `app/api/health/route.ts`
- `app/api/health/__tests__/route.test.ts`

- [x] Test `GET`, status `200`, `Cache-Control: no-store`, and JSON fields `ok: true`, `service: "meridian-freight-website"`.
- [x] Implement the route with `runtime = "nodejs"` and `dynamic = "force-dynamic"`.
- [x] Verify the route test passes.

### Task 2: Remove GitHub Scheduled Monitor

**Files:**
- Delete `.github/workflows/site-alert-monitor.yml`
- Delete `scripts/site-alert-monitor.ts`
- Delete `lib/site-alerts/monitor.ts`
- Delete `lib/site-alerts/__tests__/monitor.test.ts`

- [x] Remove the GitHub scheduled workflow.
- [x] Remove repo code used only by that workflow.
- [x] Update docs so future work does not point back to GitHub Actions for uptime.

### Task 3: Vercel And External Alert Setup

**Files:**
- `docs/runbooks/production-site-alerts.md`

- [ ] Enable Vercel Alerts in the Vercel dashboard under `Observability` -> `Alerts`.
- [ ] Subscribe email and Slack to Vercel error/usage anomaly alerts.
- [ ] Configure an outside-in uptime provider to check `/api/health` and critical production routes.
- [ ] Send a provider-level test alert to Slack and email.

### Task 4: Verification

**Files:**
- All changed files.

- [ ] Run `npm run type-check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Probe `https://meridianexport.com/api/health`.
