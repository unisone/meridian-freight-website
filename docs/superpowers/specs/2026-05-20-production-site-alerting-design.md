# Production Site Alerting Design

## Goal

Meridian must receive Slack and email notifications when `meridianexport.com` production is down or returning broken runtime responses. The system is alert-first: nobody should need to watch Sentry, Vercel, Better Stack, Checkly, or any dashboard to learn about an outage.

## Current Context

The May 19, 2026 outage returned site-wide `500` responses from `MIDDLEWARE_INVOCATION_FAILED`. The root page can be a weak canary because Vercel edge cache may keep `/` green while dynamic Next.js routes and API lambdas fail. Existing repo coverage includes Sentry initialization, Vercel crons for business data checks, and a GitHub production smoke workflow after pushes to `main`; none of these provide always-on external production alerting.

## Alert Destinations

- Slack: `#mfexport-site-alerts`
- Slack channel ID: `C0B4X51JH9R`
- Email: `alex.z@meridianexport.com`
- Email sender: `Meridian Freight <contact@meridianexport.com>` via Resend

## Monitoring Strategy

### Primary Layer: External Synthetic Monitor

Use a dedicated external uptime provider such as Better Stack or Checkly to check production from outside Vercel every 1-3 minutes. Configure Slack and email alert channels directly in that provider. This is the best operational layer because it still works when the Vercel app/runtime cannot execute code.

Monitor these routes:

- `/api/health`
- `/es/blog/paraguay-import-guide`
- `/es/destinations/argentina`
- `/pricing/calculator`
- `/schedule`
- `/`

The homepage is included only as a control route. Runtime-sensitive routes carry the real outage signal.

Alert rules:

- Alert after 2-3 consecutive failures.
- Failure means `5xx`, `4xx` except an explicitly expected status, timeout, DNS error, SSL error, or missing expected response body.
- Send recovery notifications to Slack and email.
- Include failed route, status/error, attempt count, timestamp, and runbook pointer.

### Repo-Owned Fallback Layer

Add a scheduled GitHub Actions workflow that runs every 10 minutes and manually. It checks the same critical routes from GitHub-hosted infrastructure, retries inside the run to avoid one-off network noise, and sends Slack + Resend email alerts if failures remain. This is a backup, not the only monitor, because scheduled GitHub Actions can be delayed and does not provide perfect outage-state deduplication.

The workflow uses GitHub Secrets:

- `SITE_ALERT_SLACK_BOT_TOKEN`
- `SITE_ALERT_SLACK_CHANNEL_ID`
- `SITE_ALERT_RESEND_API_KEY`
- `SITE_ALERT_EMAIL_TO`

## App Runtime Canary

Add `GET /api/health` with `runtime = "nodejs"` and `dynamic = "force-dynamic"` so it exercises a Node runtime route handler instead of serving only static/cacheable content. It returns JSON:

```json
{
  "ok": true,
  "service": "meridian-freight-website",
  "environment": "production",
  "timestamp": "2026-05-20T00:00:00.000Z"
}
```

The response must set `Cache-Control: no-store`.

## Alert Message Contract

Slack alert format:

- `:rotating_light: Meridian production site monitor FAILED`
- Base URL
- Failed checks with path, status/error, duration
- Successful check count
- Started/finished timestamps
- Runbook pointer: `docs/runbooks/production-site-alerts.md`

Email alert format:

- Subject starts with `[ALERT] Meridian production site monitor failed`
- HTML body mirrors Slack content with a compact table.
- Plain text body is included for reliability.

Recovery format:

- Subject starts with `[RECOVERY] Meridian production site monitor healthy`
- Slack starts with `:white_check_mark:`
- Includes checked route count and timestamp.

## Edge Cases

- One transient route failure must not alert unless retries still fail.
- Fetches must time out so the monitor cannot hang indefinitely.
- Wrong body content should fail even if status is `200`.
- A Vercel auth wall, proxy error page, or empty response should fail body validation.
- Notification failures should be visible in the GitHub job summary and fail the workflow.
- Alert code must not reuse sales/lead notification routing.
- Secrets must never be committed or printed.

## Verification

- Unit tests for route body/status evaluation and alert formatting.
- Unit test for `/api/health`.
- Local monitor dry-run against live production without sending notifications.
- Test alert send to Slack and email after GitHub secrets are configured.
- Required repo gates: `npm run type-check`, `npm run lint`, `npm test`, `npm run build`.
