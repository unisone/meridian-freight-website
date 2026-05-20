# Production Site Alerts Runbook

## Alert Destinations

- Slack channel: `#mfexport-site-alerts`
- Slack channel ID: `C0B4X51JH9R`
- Email recipient: `alex.z@meridianexport.com`
- Email sender: `Meridian Freight <contact@meridianexport.com>` via Resend

## What The Monitor Checks

The production monitor checks routes that exercise static, dynamic, localized, calculator, schedule, and Node route-handler behavior:

- `https://meridianexport.com/api/health`
- `https://meridianexport.com/es/blog/paraguay-import-guide`
- `https://meridianexport.com/es/destinations/argentina`
- `https://meridianexport.com/pricing/calculator`
- `https://meridianexport.com/schedule`
- `https://meridianexport.com/`

The homepage is a control route only. Dynamic routes and `/api/health` carry the stronger signal because the May 19, 2026 outage showed cached root-page checks can miss runtime failures.

## GitHub Fallback Monitor

Workflow: `.github/workflows/site-alert-monitor.yml`

Schedule: every 10 minutes, plus manual `workflow_dispatch`.

Required GitHub Secrets:

- `SITE_ALERT_SLACK_BOT_TOKEN`: Slack bot token allowed to post to `#mfexport-site-alerts`.
- `SITE_ALERT_SLACK_CHANNEL_ID`: `C0B4X51JH9R`.
- `SITE_ALERT_RESEND_API_KEY`: Resend API key.
- `SITE_ALERT_EMAIL_TO`: `alex.z@meridianexport.com`.

Workflow state:

- The workflow stores the last `healthy` or `failed` state in GitHub Actions cache under `.site-alert-state/status`.
- This state lets recovery emails only send after a prior failed run and prevents repeated outage alerts every 10 minutes while the site remains down.

Noise control:

- The first failed run sends a Slack/email outage alert and marks the monitor as `failed`.
- Continued failed runs do not repeat Slack/email alerts every 10 minutes.
- The first healthy run after a failed state sends one recovery alert and marks the monitor as `healthy`.
- If Slack or Resend delivery fails, the workflow keeps the previous state so the next run retries the missed outage or recovery notification.

## Primary External Monitor Setup

The GitHub workflow is a backup. The primary monitor should be an external uptime provider such as Better Stack or Checkly because it runs outside Vercel and outside this application.

Configure:

1. Create one monitor per route listed above, or one multi-step/API check covering all routes.
2. Check interval: 1-3 minutes.
3. Failure threshold: 2-3 consecutive failures.
4. Timeout: 10-15 seconds.
5. Alert channels: Slack `#mfexport-site-alerts` and email `alex.z@meridianexport.com`.
6. Send recovery notifications.
7. Treat `/api/health`, localized blog/destination pages, `/pricing/calculator`, and `/schedule` as the primary signals.

## When An Alert Fires

1. Open the alert details and identify which routes failed.
2. Check whether failures are broad:
   - `/api/health` plus dynamic pages failing usually means application/runtime/deployment issue.
   - Only one content page failing usually means route/content regression.
   - DNS/SSL failures point to domain/certificate/provider status.
3. Probe production directly:

```bash
curl -I https://meridianexport.com/api/health
curl -I https://meridianexport.com/es/blog/paraguay-import-guide
curl -I https://meridianexport.com/pricing/calculator
```

4. Check current Vercel production deployment and logs.
5. For site-wide `5xx` after a deployment, rollback first, then investigate:

```bash
vercel rollback
```

6. After rollback or fix, confirm critical routes return expected statuses and wait for the recovery alert.

## Manual Monitor Test

Dry-run without notifications:

```bash
SITE_ALERT_ATTEMPTS=1 SITE_ALERT_RETRY_DELAY_MS=1 npx tsx scripts/site-alert-monitor.ts --dry-run --skip-notify
```

Forced failure test with notifications:

```bash
SITE_ALERT_ATTEMPTS=1 SITE_ALERT_RETRY_DELAY_MS=1 npx tsx scripts/site-alert-monitor.ts --force-failure
```

Only run the forced failure command when Slack/email test notifications are expected.
