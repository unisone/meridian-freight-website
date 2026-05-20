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

## Alert Behavior

The monitor sends notifications when a monitored route first fails, when an outage continues past the reminder window, and when the site recovers. It records incident state by reading the alert channel history for messages tagged with `MFX_UPTIME_MONITOR_V1`, so it does not need an extra database just to avoid repeat alerts.

Manual delivery tests can be run against the deployed `/api/check` endpoint with:

- `?force=fail&notify=always`
- `?force=recover&notify=always`

Both manual test calls require the `Authorization: Bearer $CRON_SECRET` header.
