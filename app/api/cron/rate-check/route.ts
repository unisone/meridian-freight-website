/**
 * Cron job: Freight rate freshness monitor.
 * Runs weekly — checks if ocean_freight_rates and equipment_packing_rates
 * have been updated within the last 45 days. Alerts Slack if stale.
 *
 * Protected by CRON_SECRET header verification (Vercel auto-sends this).
 */

import { notifySlack } from "@/lib/slack";
import { log } from "@/lib/logger";

const STALE_THRESHOLD_DAYS = 45;

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return Response.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  const issues: string[] = [];

  try {
    // Check ocean freight rates
    const oceanResp = await fetch(
      `${url}/rest/v1/ocean_freight_rates?select=updated_at&order=updated_at.desc&limit=1`,
      { headers }
    );
    if (oceanResp.ok) {
      const [latest] = await oceanResp.json() as { updated_at: string }[];
      if (latest) {
        const daysAgo = Math.floor(
          (Date.now() - new Date(latest.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysAgo > STALE_THRESHOLD_DAYS) {
          issues.push(`Ocean freight rates last updated ${daysAgo} days ago (threshold: ${STALE_THRESHOLD_DAYS}d)`);
        }
      } else {
        issues.push("Ocean freight rates table is EMPTY");
      }
    } else {
      issues.push(`Failed to query ocean_freight_rates: HTTP ${oceanResp.status}`);
    }

    // Check equipment packing rates
    const equipResp = await fetch(
      `${url}/rest/v1/equipment_packing_rates?select=updated_at&order=updated_at.desc&limit=1`,
      { headers }
    );
    if (equipResp.ok) {
      const [latest] = await equipResp.json() as { updated_at: string }[];
      if (latest) {
        const daysAgo = Math.floor(
          (Date.now() - new Date(latest.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysAgo > STALE_THRESHOLD_DAYS) {
          issues.push(`Equipment packing rates last updated ${daysAgo} days ago (threshold: ${STALE_THRESHOLD_DAYS}d)`);
        }
      } else {
        issues.push("Equipment packing rates table is EMPTY");
      }
    } else {
      issues.push(`Failed to query equipment_packing_rates: HTTP ${equipResp.status}`);
    }

    // Check for null critical fields (ocean_rate, drayage/packing_drayage)
    const nullCheckResp = await fetch(
      `${url}/rest/v1/ocean_freight_rates?select=id,destination_country,container_type&or=(ocean_rate.is.null,and(container_type.eq.fortyhc,drayage.is.null,origin_port.ilike.*Chicago*),and(container_type.eq.flatrack,packing_drayage.is.null))`,
      { headers }
    );
    if (nullCheckResp.ok) {
      const nullRows = await nullCheckResp.json() as { id: string; destination_country: string; container_type: string }[];
      if (nullRows.length > 0) {
        issues.push(`${nullRows.length} ocean freight rate rows have NULL critical fields (ocean_rate, drayage, or packing_drayage)`);
      }
    }

    // Report results
    if (issues.length > 0) {
      const message = [
        ":warning: *Freight Rate Health Check — Issues Found*",
        ...issues.map((i) => `• ${i}`),
        "",
        "Update rates at: Supabase Dashboard → ocean_freight_rates / equipment_packing_rates",
      ].join("\n");

      await notifySlack(message);
      log({ level: "warn", msg: "rate_check_issues", route: "cron:rate-check", issues });
      return Response.json({ status: "issues_found", issues });
    }

    log({ level: "info", msg: "rate_check_ok", route: "cron:rate-check" });
    return Response.json({ status: "ok", message: "All rates are fresh" });
  } catch (e) {
    log({ level: "error", msg: "rate_check_failed", route: "cron:rate-check", error: String(e) });
    return Response.json({ error: "Rate check failed" }, { status: 500 });
  }
}
