# Production Site Alerting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production outage alerts that notify Slack `#mfexport-site-alerts` and `alex.z@meridianexport.com` without requiring dashboard monitoring.

**Architecture:** Add a Node runtime `/api/health` canary, a pure TypeScript site monitor library, a CLI script for GitHub Actions, and a scheduled workflow that sends Slack + Resend email alerts after retry-confirmed failures. Keep this separate from sales lead notifications. Document the primary external-monitor setup and incident runbook.

**Tech Stack:** Next.js 16 App Router route handler, TypeScript, Vitest, GitHub Actions, Slack Bot API `chat.postMessage`, Resend Email API.

---

## File Structure

- Create `app/api/health/route.ts`: Node runtime health canary.
- Create `app/api/health/__tests__/route.test.ts`: health route behavior tests.
- Create `lib/site-alerts/monitor.ts`: route-check configs, response evaluation, retry runner, Slack/email formatting, notification senders.
- Create `lib/site-alerts/__tests__/monitor.test.ts`: pure monitor behavior tests.
- Create `scripts/site-alert-monitor.ts`: CLI entrypoint used by GitHub Actions.
- Create `.github/workflows/site-alert-monitor.yml`: scheduled/manual production monitor.
- Create `docs/runbooks/production-site-alerts.md`: alert routing, response steps, provider setup.

## Tasks

### Task 1: Health Canary

**Files:**
- Create: `app/api/health/route.ts`
- Create: `app/api/health/__tests__/route.test.ts`

- [x] Write a failing test that imports `GET`, calls it, expects status `200`, `Cache-Control: no-store`, and JSON fields `ok: true`, `service: "meridian-freight-website"`.
- [x] Run `npm test -- app/api/health/__tests__/route.test.ts` and verify it fails because the route does not exist.
- [x] Implement the route with `runtime = "nodejs"` and `dynamic = "force-dynamic"`.
- [x] Re-run the route test and verify it passes.

### Task 2: Pure Monitor Library

**Files:**
- Create: `lib/site-alerts/monitor.ts`
- Create: `lib/site-alerts/__tests__/monitor.test.ts`

- [x] Write failing tests for default check list, status/body evaluation, timeout/error result formatting, and Slack/email alert text containing the new Slack channel contract.
- [x] Run `npm test -- lib/site-alerts/__tests__/monitor.test.ts` and verify expected failures.
- [x] Implement the smallest monitor library that passes those tests.
- [x] Re-run monitor tests and verify they pass.

### Task 3: CLI Entrypoint

**Files:**
- Create: `scripts/site-alert-monitor.ts`

- [x] Add a CLI that reads environment variables, runs the monitor, prints a GitHub-friendly summary, sends alert notifications when failures remain, and exits `1` on unhealthy production.
- [x] Add `--dry-run` and `--skip-notify` flags for local verification.
- [x] Run the CLI against production with `--dry-run --skip-notify` and verify it prints route results without sending alerts. Pre-deploy result correctly reports `/api/health` as `404` until this branch ships.

### Task 4: GitHub Scheduled Workflow

**Files:**
- Create: `.github/workflows/site-alert-monitor.yml`

- [x] Add a scheduled workflow for every 10 minutes plus `workflow_dispatch`.
- [x] Use Node 22 and `npm ci`.
- [x] Run `npx tsx scripts/site-alert-monitor.ts`.
- [x] Wire secrets into environment variables without printing values.

### Task 5: Runbook

**Files:**
- Create: `docs/runbooks/production-site-alerts.md`

- [x] Document Slack/email destinations.
- [x] Document GitHub secret names and how they map to Vercel/local secret sources.
- [x] Document primary external monitor provider setup for Better Stack or Checkly.
- [x] Document response steps: verify routes, check last deployment, rollback first for site-wide 5xx, then investigate.

### Task 6: Secrets And Smoke

**Files:**
- No repo file changes unless a workflow issue is found.

- [x] Pull production Vercel env values into a temp file without printing secrets.
- [x] Set GitHub Secrets for Resend and Slack alerting.
- [x] Set `SITE_ALERT_SLACK_CHANNEL_ID=C0B4X51JH9R` and `SITE_ALERT_EMAIL_TO=alex.z@meridianexport.com`.
- [x] Try Slack `conversations.join` for the channel if the token allows it; token lacked the scope, so the `Dan` app was invited to the channel through Slack.
- [x] Send a test Slack and Resend alert through the CLI with a forced failing URL, then confirm delivery via command output and Slack channel readback.

### Task 7: Full Verification

**Files:**
- All changed files.

- [x] Run `npm run type-check`.
- [x] Run `npm run lint`.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run the monitor dry-run against live production. Pre-deploy result correctly reports `/api/health` as `404` until this branch ships.
- [x] Review `git diff --check`.
- [x] Summarize delivered coverage and any remaining external-provider setup.
