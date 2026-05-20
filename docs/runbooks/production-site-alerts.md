# Production Site Alerts Runbook

## Alert Destinations

- Slack channel: `#mfexport-site-alerts`
- Slack channel ID: `C0B4X51JH9R`
- Email recipient: `alex.z@meridianexport.com`

## Current Repo-Owned Canary

The website exposes a lightweight production canary at:

- `https://meridianexport.com/api/health`

Expected response:

- HTTP `200`
- `Cache-Control: no-store`
- JSON with `ok: true` and `service: "meridian-freight-website"`

This route intentionally uses the Next.js Node runtime and dynamic rendering so it tests more than a cached static homepage. It is a target for Vercel alerts, webhooks, or an outside-in uptime provider.

## Vercel-Native Alerting

Vercel Alerts can notify by email, Slack, or webhook for platform-observed anomalies. As of the current Vercel docs, the native alert types are:

- Error anomaly: a spike in `5xx` function invocation rate.
- Usage anomaly: an abnormal usage spike.

Configure this in Vercel:

1. Open the project in the Vercel dashboard.
2. Go to `Observability` -> `Alerts`.
3. Click `Subscribe to Alerts`.
4. Enable email for `alex.z@meridianexport.com` if that account is a Vercel user or team owner.
5. Install the Vercel Slack integration if needed.
6. In `#mfexport-site-alerts`, invite the Vercel app and subscribe the project alerts with the command shown by Vercel, in the form:

```text
/invite @Vercel
/vercel subscribe [team/project] alerts
```

Important limitation: Vercel anomaly alerts are not the same as outside-in uptime checks. They catch Vercel-observed error and usage anomalies, but they are not a multi-region synthetic monitor that repeatedly requests `https://meridianexport.com/api/health` from outside Vercel.

## Outside-In Uptime Monitor

Use a dedicated uptime provider for true "the public website is unreachable" detection. This runs outside Vercel and outside the app, so it can still notify when the app cannot execute code.

Recommended monitor targets:

- `https://meridianexport.com/api/health`
- `https://meridianexport.com/es/blog/paraguay-import-guide`
- `https://meridianexport.com/es/destinations/argentina`
- `https://meridianexport.com/pricing/calculator`
- `https://meridianexport.com/schedule`
- `https://meridianexport.com/`

Recommended settings:

- Check interval: 1-3 minutes.
- Failure threshold: 2-3 consecutive failures.
- Timeout: 10-15 seconds.
- Alert channels: Slack `#mfexport-site-alerts` and email `alex.z@meridianexport.com`.
- Send recovery notifications.
- Treat `5xx`, unexpected `4xx`, DNS errors, TLS errors, timeouts, empty responses, or missing expected body text as failures.

## No GitHub Scheduled Monitor

Do not use GitHub Actions as the production uptime monitor for this site. GitHub scheduled workflows were removed because this alerting path should not depend on GitHub scheduler reliability.

## When An Alert Fires

1. Identify which route failed and whether the failure is broad or isolated.
2. Probe production directly:

```bash
curl -i https://meridianexport.com/api/health
curl -I https://meridianexport.com/es/blog/paraguay-import-guide
curl -I https://meridianexport.com/pricing/calculator
```

3. Check the current Vercel production deployment and runtime logs.
4. For site-wide `5xx` after a deployment, rollback first, then investigate:

```bash
vercel rollback
```

5. After rollback or fix, confirm the canary and affected routes return expected statuses and wait for the recovery alert.

## Manual Canary Check

```bash
curl -i https://meridianexport.com/api/health
```
