# Meridian Export Uptime Monitor

This is a small, separate Vercel Cron project for production availability alerts for `meridianexport.com`.

It is intentionally separate from the website project so a broken website deployment does not remove the monitor code path. The monitor checks public production URLs, retries failures, and alerts:

- Slack: `#mfexport-site-alerts`
- Email: `alex.z@meridianexport.com`

## Runtime

- Vercel project: `meridianexport-uptime-monitor`
- Vercel project ID: `prj_fbhvHIMYSqRaC745jOQZTiMIRUf8`
- Cron path: `/api/check`
- Schedule: every minute
- Base URL: `https://meridianexport.com`

## Deployment

This project **auto-deploys from `main` via Vercel's Git integration** (connected 2026-06-30), exactly like the website project:

- Git repo: `unisone/meridian-freight-website`
- Production branch: `main`
- **Root Directory: `ops/site-uptime-monitor`** — Vercel builds only this folder
- Ignored Build Step: `git diff --quiet HEAD^ HEAD .` — skips the rebuild unless this folder changed, so site-only pushes do not redeploy the monitor

**Any change to the monitor (e.g. the `monitor.mjs` target list) ships automatically on merge to `main`.** Do not assume a repo edit is live until the deploy lands: before this was wired (2026-05-20 → 2026-06-30) the project was deployed once by hand and never updated, so a corrected target URL kept firing a stale 404 alert for weeks. For a one-off manual deploy, run `vercel deploy --prod` from this directory linked to project `prj_fbhvHIMYSqRaC745jOQZTiMIRUf8`.

## Alert Behavior

The monitor sends notifications when a monitored route first fails, when an outage continues past the reminder window, and when the site recovers. It records incident state by reading the alert channel history for messages tagged with `MFX_UPTIME_MONITOR_V1`, so it does not need an extra database just to avoid repeat alerts.

Manual delivery tests can be run against the deployed `/api/check` endpoint with:

- `?force=fail&notify=always`
- `?force=recover&notify=always`

Both manual test calls require the `Authorization: Bearer $CRON_SECRET` header.
