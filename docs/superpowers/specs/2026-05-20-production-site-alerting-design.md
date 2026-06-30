# Production Site Alerting Design

## Goal

Meridian must receive Slack and email notifications when `meridianexport.com` production is down or returning broken runtime responses. The system is alert-first: nobody should need to watch Sentry, Vercel, or any dashboard to learn about an outage.

## Current Context

The May 19, 2026 outage returned site-wide `500` responses from `MIDDLEWARE_INVOCATION_FAILED`. The root page can be a weak canary because Vercel edge cache may keep `/` green while dynamic Next.js routes and API lambdas fail.

The repo now owns only the production health canary. Scheduled GitHub Actions monitoring was removed and must not be reintroduced as the uptime monitor.

## Alert Destinations

- Slack: `#mfexport-site-alerts`
- Slack channel ID: `C0B4X51JH9R`
- Email: `alex.z@meridianexport.com`

## Monitoring Strategy

### Layer 1: Vercel-Native Alerts

Enable Vercel Alerts for the production project so Vercel sends email, Slack, or webhook notifications for platform-observed anomalies.

Native Vercel alert types currently cover:

- Error anomalies: abnormal `5xx` function invocation rate.
- Usage anomalies: abnormal usage spikes.

This is useful but incomplete for outage detection because it is not a synthetic outside-in URL check.

### Layer 2: Outside-In Synthetic Monitor

Use a dedicated external uptime provider such as Better Stack, Checkly, Pingdom, or a similar provider to request production URLs from outside Vercel every 1-3 minutes. Configure Slack and email alert channels directly in that provider.

Monitor these routes:

- `/api/health`
- `/es/blog/import-farm-machinery-united-states-paraguay`
- `/es/destinations/argentina`
- `/pricing/calculator`
- `/schedule`
- `/`

The homepage is included only as a control route. Runtime-sensitive routes carry the real outage signal.

Alert rules:

- Alert after 2-3 consecutive failures.
- Failure means `5xx`, unexpected `4xx`, timeout, DNS error, TLS error, empty response, proxy/auth wall, or missing expected response body.
- Send recovery notifications to Slack and email.
- Include failed route, status/error, attempt count, timestamp, and runbook pointer.

## App Runtime Canary

`GET /api/health` uses `runtime = "nodejs"` and `dynamic = "force-dynamic"` so it exercises a Node route handler instead of serving only static/cacheable content. It returns JSON:

```json
{
  "ok": true,
  "service": "meridian-freight-website",
  "environment": "production",
  "timestamp": "2026-05-20T00:00:00.000Z"
}
```

The response must set `Cache-Control: no-store`.

## Edge Cases

- One transient route failure should not alert unless retries still fail.
- Checks must time out so the monitor cannot hang indefinitely.
- Wrong body content should fail even if status is `200`.
- A Vercel auth wall, proxy error page, or empty response should fail body validation.
- Alert code must not reuse sales/lead notification routing.
- Secrets must never be committed or printed.
- Do not use GitHub scheduled workflows as the uptime monitor.

## Verification

- Unit test for `/api/health`.
- Live production probe for `/api/health`.
- Required repo gates: `npm run type-check`, `npm run lint`, `npm test`, `npm run build`.
