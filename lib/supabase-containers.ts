/**
 * Server-side Supabase queries for shared container booking tables.
 * Uses the same REST API pattern as lib/supabase-rates.ts.
 */

import type {
  SharedContainer,
  ContainerWithPendingCount,
  ParsedContainerRow,
} from "@/lib/types/shared-shipping";
import { log } from "@/lib/logger";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

function buildHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

/**
 * Fetch a single container by UUID.
 */
export async function fetchContainerById(id: string): Promise<SharedContainer | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const params = new URLSearchParams({
      select: "*",
      id: `eq.${id}`,
    });

    const resp = await fetch(
      `${config.url}/rest/v1/shared_containers?${params}`,
      {
        headers: {
          ...buildHeaders(config.key),
          Accept: "application/vnd.pgrst.object+json",
        },
      },
    );

    if (!resp.ok) {
      if (resp.status === 406) {
        // No matching row — PostgREST returns 406 for single-object with no match
        return null;
      }
      log({
        level: "error",
        msg: "Failed to fetch container by id",
        route: "supabase-containers",
        status: resp.status,
        containerId: id,
      });
      return null;
    }

    return (await resp.json()) as SharedContainer;
  } catch (e) {
    log({
      level: "error",
      msg: "fetchContainerById error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
      containerId: id,
    });
    return null;
  }
}

/**
 * Get the most recent successful sync timestamp.
 */
export async function getLastSyncTime(): Promise<string | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const params = new URLSearchParams({
      select: "completed_at",
      status: "eq.success",
      order: "completed_at.desc",
      limit: "1",
    });

    const resp = await fetch(
      `${config.url}/rest/v1/sync_log?${params}`,
      {
        headers: {
          ...buildHeaders(config.key),
          Accept: "application/vnd.pgrst.object+json",
        },
        next: { revalidate: 0 },
      },
    );

    if (!resp.ok) {
      // 406 = no rows match (no successful syncs yet)
      if (resp.status === 406) return null;
      log({
        level: "warn",
        msg: "Failed to fetch last sync time",
        route: "supabase-containers",
        status: resp.status,
      });
      return null;
    }

    const row = (await resp.json()) as { completed_at: string | null };
    return row.completed_at;
  } catch (e) {
    log({
      level: "error",
      msg: "getLastSyncTime error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

/**
 * Count recent booking requests from the same email for the same container.
 * Used for deduplication checks (e.g., prevent double-submit within 10 minutes).
 */
export async function countRecentRequests(
  email: string,
  containerId: string,
  withinMinutes: number = 10,
): Promise<number> {
  const config = getSupabaseConfig();
  if (!config) return 0;

  try {
    const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000).toISOString();

    const params = new URLSearchParams({
      select: "id",
      email: `eq.${email}`,
      container_id: `eq.${containerId}`,
      created_at: `gte.${cutoff}`,
    });

    const resp = await fetch(
      `${config.url}/rest/v1/space_booking_requests?${params}`,
      {
        headers: {
          ...buildHeaders(config.key),
          Prefer: "count=exact",
        },
      },
    );

    if (!resp.ok) {
      log({
        level: "warn",
        msg: "Failed to count recent requests",
        route: "supabase-containers",
        status: resp.status,
      });
      return 0;
    }

    // PostgREST returns content-range header like "0-0/1" or "*/0"
    const range = resp.headers.get("content-range");
    if (!range) return 0;

    const match = range.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  } catch (e) {
    log({
      level: "error",
      msg: "countRecentRequests error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
    });
    return 0;
  }
}

/**
 * Count ALL pending booking requests for a container (status: new, contacted, quoted).
 * Used in notification emails to show demand level.
 */
export async function countPendingRequests(containerId: string): Promise<number> {
  const config = getSupabaseConfig();
  if (!config) return 0;

  try {
    const params = new URLSearchParams({
      select: "id",
      container_id: `eq.${containerId}`,
      status: "in.(new,contacted,quoted)",
    });

    const resp = await fetch(
      `${config.url}/rest/v1/space_booking_requests?${params}`,
      {
        headers: {
          ...buildHeaders(config.key),
          Prefer: "count=exact",
        },
      },
    );

    if (!resp.ok) {
      log({
        level: "warn",
        msg: "Failed to count pending requests",
        route: "supabase-containers",
        status: resp.status,
        containerId,
      });
      return 0;
    }

    const range = resp.headers.get("content-range");
    if (!range) return 0;

    const match = range.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  } catch (e) {
    log({
      level: "error",
      msg: "countPendingRequests error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
      containerId,
    });
    return 0;
  }
}

/**
 * Insert a new space booking request.
 * Handles 409 (unique constraint violation) as success for idempotent dedup.
 */
export async function insertBookingRequest(request: {
  container_id: string;
  project_number: string;
  name: string;
  email: string;
  phone?: string | null;
  cargo_description: string;
  status?: string;
  source_page?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, error: "Supabase not configured" };

  try {
    const resp = await fetch(
      `${config.url}/rest/v1/space_booking_requests`,
      {
        method: "POST",
        headers: {
          ...buildHeaders(config.key),
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          container_id: request.container_id,
          project_number: request.project_number,
          name: request.name,
          email: request.email,
          phone: request.phone ?? null,
          cargo_description: request.cargo_description,
          status: request.status ?? "new",
          source_page: request.source_page ?? null,
          utm_source: request.utm_source ?? null,
          utm_medium: request.utm_medium ?? null,
          utm_campaign: request.utm_campaign ?? null,
        }),
      },
    );

    // 409 = unique constraint violation — treat as success (idempotent dedup)
    if (resp.status === 409) {
      log({
        level: "info",
        msg: "Duplicate booking request (409), treating as success",
        route: "supabase-containers",
        email: request.email,
        containerId: request.container_id,
      });
      return { ok: true };
    }

    if (!resp.ok) {
      const body = await resp.text();
      log({
        level: "error",
        msg: "Failed to insert booking request",
        route: "supabase-containers",
        status: resp.status,
        body,
      });
      return { ok: false, error: `Supabase error ${resp.status}: ${body}` };
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    log({
      level: "error",
      msg: "insertBookingRequest error",
      route: "supabase-containers",
      error: message,
    });
    return { ok: false, error: message };
  }
}

/**
 * Batch upsert containers from Google Sheets sync.
 * Uses merge-duplicates on the project_number unique constraint.
 */
export async function upsertContainers(
  rows: ParsedContainerRow[],
): Promise<{ ok: boolean; error?: string }> {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, error: "Supabase not configured" };

  if (rows.length === 0) return { ok: true };

  try {
    const now = new Date().toISOString();

    const payload = rows.map((row) => ({
      project_number: row.project_number,
      origin: row.origin,
      destination: row.destination,
      destination_country: row.destination_country,
      departure_date: row.departure_date,
      eta_date: row.eta_date,
      container_type: row.container_type,
      total_capacity_cbm: row.total_capacity_cbm,
      available_cbm: row.available_cbm,
      raw_space_value: row.raw_space_value,
      sheet_row_number: row.sheet_row_number,
      notes: row.notes,
      status: row.status,
      source: "google_sheets",
      synced_at: now,
    }));

    const resp = await fetch(
      `${config.url}/rest/v1/shared_containers?on_conflict=project_number`,
      {
        method: "POST",
        headers: {
          ...buildHeaders(config.key),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!resp.ok) {
      const body = await resp.text();
      log({
        level: "error",
        msg: "Failed to upsert containers",
        route: "supabase-containers",
        status: resp.status,
        body,
        rowCount: rows.length,
      });
      return { ok: false, error: `Supabase error ${resp.status}: ${body}` };
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    log({
      level: "error",
      msg: "upsertContainers error",
      route: "supabase-containers",
      error: message,
      rowCount: rows.length,
    });
    return { ok: false, error: message };
  }
}

/**
 * Mark stale containers that are no longer active.
 * - Past departure_date → status='departed'
 * - available_cbm = 0 → status='full'
 * - Not in activeProjectNumbers list → status='unlisted'
 * NEVER hard deletes rows.
 */
export async function markStaleContainers(activeProjectNumbers: string[]): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;

  const headers = buildHeaders(config.key);
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // 1. Mark departed: departure_date < today AND status is still active
    const departedParams = new URLSearchParams({
      departure_date: `lt.${today}`,
      status: "in.(available,full)",
    });

    const departedResp = await fetch(
      `${config.url}/rest/v1/shared_containers?${departedParams}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: "departed" }),
      },
    );

    if (!departedResp.ok) {
      log({
        level: "warn",
        msg: "Failed to mark departed containers",
        route: "supabase-containers",
        status: departedResp.status,
      });
    }

    // 2. Mark full: available_cbm = 0 AND status is 'available'
    const fullParams = new URLSearchParams({
      available_cbm: "eq.0",
      status: "eq.available",
    });

    const fullResp = await fetch(
      `${config.url}/rest/v1/shared_containers?${fullParams}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: "full" }),
      },
    );

    if (!fullResp.ok) {
      log({
        level: "warn",
        msg: "Failed to mark full containers",
        route: "supabase-containers",
        status: fullResp.status,
      });
    }

    // 3. Mark unlisted: containers in DB with active status but NOT in the current sheet
    if (activeProjectNumbers.length > 0) {
      // PostgREST "not in" filter: project_number=not.in.(val1,val2,...)
      const unlistedParams = new URLSearchParams({
        project_number: `not.in.(${activeProjectNumbers.join(",")})`,
        status: "in.(available,full)",
      });

      const unlistedResp = await fetch(
        `${config.url}/rest/v1/shared_containers?${unlistedParams}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: "unlisted" }),
        },
      );

      if (!unlistedResp.ok) {
        log({
          level: "warn",
          msg: "Failed to mark unlisted containers",
          route: "supabase-containers",
          status: unlistedResp.status,
        });
      }
    }
  } catch (e) {
    log({
      level: "error",
      msg: "markStaleContainers error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

/**
 * Insert a sync log entry.
 */
export async function insertSyncLog(entry: {
  source: string;
  status: "success" | "partial" | "failed";
  rows_fetched: number;
  rows_upserted: number;
  rows_skipped: number;
  rows_errored: number;
  error_details?: Array<{ row: number; field: string; raw: string; error: string }> | null;
  duration_ms: number;
  started_at: string;
  completed_at: string;
}): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;

  try {
    const resp = await fetch(
      `${config.url}/rest/v1/sync_log`,
      {
        method: "POST",
        headers: {
          ...buildHeaders(config.key),
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          source: entry.source,
          status: entry.status,
          rows_fetched: entry.rows_fetched,
          rows_upserted: entry.rows_upserted,
          rows_skipped: entry.rows_skipped,
          rows_errored: entry.rows_errored,
          error_details: entry.error_details ?? null,
          duration_ms: entry.duration_ms,
          started_at: entry.started_at,
          completed_at: entry.completed_at,
        }),
      },
    );

    if (!resp.ok) {
      log({
        level: "error",
        msg: "Failed to insert sync log",
        route: "supabase-containers",
        status: resp.status,
        body: await resp.text(),
      });
    }
  } catch (e) {
    log({
      level: "error",
      msg: "insertSyncLog error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

/**
 * Fetch ALL schedule containers WITH booking data (pending request counts).
 * Used by the unified /schedule page (replaces separate fetch functions).
 * Merges pending_count for available containers so bookable rows can show demand.
 */
export async function fetchScheduleContainersWithBookingData(): Promise<ContainerWithPendingCount[] | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const cutoff = sixtyDaysAgo.toISOString().split("T")[0];

  try {
    const params = new URLSearchParams({
      select: "*",
      status: "in.(available,full,departed)",
      departure_date: `gte.${cutoff}`,
      order: "departure_date.asc",
    });

    const resp = await fetch(
      `${config.url}/rest/v1/shared_containers?${params}`,
      {
        headers: buildHeaders(config.key),
        next: { revalidate: 0 },
      },
    );

    if (!resp.ok) {
      log({
        level: "error",
        msg: "Failed to fetch schedule containers with booking data",
        route: "supabase-containers",
        status: resp.status,
        body: await resp.text(),
      });
      return null;
    }

    const containers = (await resp.json()) as SharedContainer[];

    // Fetch pending request counts for bookable containers
    const bookableIds = containers
      .filter((c) => c.status === "available" && (c.available_cbm ?? 0) > 0)
      .map((c) => c.id);

    const countMap = new Map<string, number>();

    if (bookableIds.length > 0) {
      const countParams = new URLSearchParams({
        select: "container_id",
        container_id: `in.(${bookableIds.join(",")})`,
        status: "in.(new,contacted,quoted)",
      });

      const countResp = await fetch(
        `${config.url}/rest/v1/space_booking_requests?${countParams}`,
        { headers: buildHeaders(config.key) },
      );

      if (countResp.ok) {
        const requests = (await countResp.json()) as Array<{ container_id: string }>;
        for (const r of requests) {
          countMap.set(r.container_id, (countMap.get(r.container_id) ?? 0) + 1);
        }
      }
    }

    return containers.map((c) => ({
      ...c,
      pending_count: countMap.get(c.id) ?? 0,
    }));
  } catch (e) {
    log({
      level: "error",
      msg: "fetchScheduleContainersWithBookingData error",
      route: "supabase-containers",
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}
