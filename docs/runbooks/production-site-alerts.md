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

## Production Uptime Monitor

Primary production availability monitoring is handled by a separate Vercel Cron project:

- Project: `meridianexport-uptime-monitor`
- Project ID: `prj_fbhvHIMYSqRaC745jOQZTiMIRUf8`
- Production URL: `https://meridianexport-uptime-monitor.vercel.app`
- Cron path: `/api/check`
- Cron schedule: every minute (`* * * * *`)
- Source: `ops/site-uptime-monitor`

This monitor is intentionally deployed as a separate project from `meridian-freight-export`, so a broken website deployment does not remove the alerting code path. It checks the public production website from Vercel infrastructure, retries failed checks, and sends alerts through:

- Slack Bot API to `#mfexport-site-alerts` (`C0B4X51JH9R`)
- Resend email to `alex.z@meridianexport.com`

The monitor currently checks:

- `https://meridianexport.com/api/health`
- `https://meridianexport.com/`
- `https://meridianexport.com/pricing/calculator`
- `https://meridianexport.com/schedule`
- `https://meridianexport.com/es/blog/paraguay-import-guide`
- `https://meridianexport.com/es/destinations/argentina`

The endpoint is protected with `CRON_SECRET`. Manual test calls must include:

```bash
Authorization: Bearer $CRON_SECRET
```

Manual alert-delivery tests:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://meridianexport-uptime-monitor.vercel.app/api/check?force=fail&notify=always"

curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://meridianexport-uptime-monitor.vercel.app/api/check?force=recover&notify=always"
```

The monitor stores incident state by reading recent `#mfexport-site-alerts` messages tagged with `MFX_UPTIME_MONITOR_V1`. It sends on first failure, recovery, and a continuing-failure reminder after the configured reminder window.

### Verified Setup

Verified on May 20, 2026:

- Deployment `dpl_e7NWzSRWcEo1zbPBM6z7JqaNekKX` was `READY`.
- Vercel deployment metadata showed cron `{ "path": "/api/check", "schedule": "* * * * *" }`.
- Authenticated non-forced run checked all six production URLs successfully.
- Forced failure test sent Slack message TS `1779298401.041299` to `#mfexport-site-alerts`.
- Forced failure test sent Resend email ID `4b6d2eea-85ab-41e0-b99e-4ae8f8be317a` to `alex.z@meridianexport.com`; Gmail confirmed it in the inbox.
- Forced recovery test sent Slack message TS `1779298422.550809`.
- Forced recovery test sent Resend email ID `6a1d66e8-4caf-42e2-b6ab-bbdaf9723af5`; Gmail confirmed it in the inbox.

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

## External Uptime Provider Upgrade

The current monitor is separate from the website project and uses the required Slack and Resend destinations. A dedicated multi-region uptime provider can still be added later for broader geographic independence. If that is added, keep the same targets, one- to three-minute checks, recovery notifications, and alert destinations above.

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
