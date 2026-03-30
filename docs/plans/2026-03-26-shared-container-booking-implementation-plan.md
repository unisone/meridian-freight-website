# Shared Container Booking Portal — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public container space booking portal at `/shared-shipping` that syncs availability from Google Sheets and lets customers submit booking requests.

**Architecture:** Google Sheets (ops team) → Vercel Cron (15 min) → Supabase `shared_containers` table → Next.js SSG page with ISR revalidation. Booking requests go through a Server Action with Zod validation, saved to Supabase, with email (Resend) + Slack notifications. No auth, no payments — team reviews requests manually.

**Tech Stack:** Next.js 16 (App Router, RSC), shadcn/ui, Tailwind CSS 4, Supabase REST API, Resend, Slack Bot API, Google Sheets REST API v4, Vitest, next-intl, motion

**Design Doc:** `docs/plans/2026-03-26-shared-container-booking-portal-design.md`

---

## Phase 1: Foundation (Types, Schema, DB Helpers)

### Task 1: Types for Shared Shipping

**Files:**
- Create: `lib/types/shared-shipping.ts`

**Step 1: Create the types file**

```typescript
// lib/types/shared-shipping.ts

/** Row from the shared_containers Supabase table */
export interface SharedContainer {
  id: string;
  project_number: string;
  origin: string;
  destination: string;
  destination_country: string | null;
  departure_date: string; // ISO date string "2026-04-15"
  eta_date: string | null;
  container_type: string;
  total_capacity_cbm: number;
  available_cbm: number | null;
  status: ContainerStatus;
  notes: string | null;
  source: "google_sheets" | "portal";
  sheet_row_number: number | null;
  raw_space_value: string | null;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

export type ContainerStatus =
  | "available"
  | "full"
  | "departed"
  | "unlisted"
  | "cancelled";

/** Row from space_booking_requests */
export interface SpaceBookingRequest {
  id: string;
  container_id: string;
  project_number: string;
  name: string;
  email: string;
  phone: string | null;
  cargo_description: string;
  status: BookingRequestStatus;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
  updated_at: string;
}

export type BookingRequestStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "booked"
  | "cancelled";

/** Row from sync_log */
export interface SyncLogEntry {
  id: string;
  source: string;
  status: "success" | "partial" | "failed";
  rows_fetched: number;
  rows_upserted: number;
  rows_skipped: number;
  rows_errored: number;
  error_details: SyncError[] | null;
  duration_ms: number;
  started_at: string;
  completed_at: string | null;
}

export interface SyncError {
  row: number;
  field: string;
  raw: string;
  error: string;
}

/** Computed display state for a container card */
export interface ContainerDisplayState {
  fillPercent: number;
  fillColor: "blue" | "amber" | "zinc";
  isDepartingSoon: boolean;
  isLimited: boolean;
  isFull: boolean;
  demandLevel: "pending" | "popular" | null;
  pendingCount: number;
  daysUntilDeparture: number;
}

/** Data passed to the container grid from the server */
export interface ContainerWithPendingCount extends SharedContainer {
  pending_count: number;
}

/** Result from the sync pipeline */
export interface SyncResult {
  status: "success" | "partial" | "failed";
  rowsFetched: number;
  rowsUpserted: number;
  rowsSkipped: number;
  rowsErrored: number;
  errors: SyncError[];
  durationMs: number;
}

/** Parsed row from Google Sheets before upserting */
export interface ParsedContainerRow {
  project_number: string;
  origin: string;
  destination: string;
  destination_country: string | null;
  departure_date: string; // ISO date
  eta_date: string | null;
  container_type: string;
  total_capacity_cbm: number;
  available_cbm: number | null;
  raw_space_value: string;
  sheet_row_number: number;
  notes: string | null;
}
```

**Step 2: Commit**

```bash
git add lib/types/shared-shipping.ts
git commit -m "feat(shared-shipping): add TypeScript types for containers, bookings, sync"
```

---

### Task 2: Zod Booking Request Schema

**Files:**
- Modify: `lib/schemas.ts` (append at end)

**Step 1: Add the booking request schema**

Append to `lib/schemas.ts` after the existing `calculatorV2Schema`:

```typescript
// --- Shared Shipping Booking Request ---

export const bookingRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required").max(50),
  cargoDescription: z.string().min(5, "Please describe your cargo").max(2000),
  containerId: z.string().uuid("Invalid container ID"),
  projectNumber: z.string().min(1, "Project number is required"),
  // Honeypot — bots fill hidden fields, humans don't
  website: z.string().max(500).optional().default(""),
  // UTM attribution (auto-captured on client)
  source_page: z.string().max(500).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
});

export type BookingRequestData = z.infer<typeof bookingRequestSchema>;
```

**Step 2: Commit**

```bash
git add lib/schemas.ts
git commit -m "feat(shared-shipping): add Zod schema for booking request validation"
```

---

### Task 3: Supabase Helpers for Shared Containers

**Files:**
- Create: `lib/supabase-containers.ts`

**Step 1: Create the Supabase helpers**

Follow the exact same pattern as `lib/supabase-rates.ts` — direct REST API with `fetch`, service role key, `getSupabaseConfig()`.

```typescript
// lib/supabase-containers.ts
/**
 * Server-side Supabase queries for shared container tables.
 * Uses the same REST API pattern as lib/supabase-rates.ts.
 */

import type {
  SharedContainer,
  ContainerWithPendingCount,
  SyncLogEntry,
  ParsedContainerRow,
  SyncError,
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

// ---------- READ ----------

/** Fetch available containers with pending request counts */
export async function fetchAvailableContainers(): Promise<ContainerWithPendingCount[] | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    // 1. Fetch containers with status = 'available' or 'full' (full shown grayed out)
    const containerParams = new URLSearchParams({
      select: "*",
      status: "in.(available,full)",
      order: "departure_date.asc",
    });

    const containerResp = await fetch(
      `${config.url}/rest/v1/shared_containers?${containerParams}`,
      { headers: buildHeaders(config.key), next: { revalidate: 0 } }
    );

    if (!containerResp.ok) {
      log({ level: "error", msg: "fetch_containers_failed", route: "supabase-containers", status: containerResp.status });
      return null;
    }

    const containers = (await containerResp.json()) as SharedContainer[];

    // 2. Fetch pending request counts per container
    // Using Supabase RPC or a separate query grouped by container_id
    const requestParams = new URLSearchParams({
      select: "container_id",
      status: "in.(new,contacted,quoted)",
    });

    const requestResp = await fetch(
      `${config.url}/rest/v1/space_booking_requests?${requestParams}`,
      { headers: buildHeaders(config.key), next: { revalidate: 0 } }
    );

    const pendingCounts = new Map<string, number>();
    if (requestResp.ok) {
      const requests = (await requestResp.json()) as Array<{ container_id: string }>;
      for (const req of requests) {
        pendingCounts.set(req.container_id, (pendingCounts.get(req.container_id) ?? 0) + 1);
      }
    }

    return containers.map((c) => ({
      ...c,
      pending_count: pendingCounts.get(c.id) ?? 0,
    }));
  } catch (e) {
    log({ level: "error", msg: "fetch_containers_exception", route: "supabase-containers", error: String(e) });
    return null;
  }
}

/** Fetch a single container by ID */
export async function fetchContainerById(id: string): Promise<SharedContainer | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const params = new URLSearchParams({ select: "*", id: `eq.${id}` });
    const resp = await fetch(
      `${config.url}/rest/v1/shared_containers?${params}`,
      { headers: { ...buildHeaders(config.key), Accept: "application/vnd.pgrst.object+json" } }
    );
    if (!resp.ok) return null;
    return (await resp.json()) as SharedContainer;
  } catch {
    return null;
  }
}

/** Get the most recent successful sync timestamp */
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
      { headers: buildHeaders(config.key), next: { revalidate: 0 } }
    );
    if (!resp.ok) return null;
    const rows = (await resp.json()) as Array<{ completed_at: string }>;
    return rows[0]?.completed_at ?? null;
  } catch {
    return null;
  }
}

/** Count pending requests for a container within last 5 minutes for dedup */
export async function countRecentRequests(
  email: string,
  containerId: string,
  withinMinutes: number = 5
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
      { headers: { ...buildHeaders(config.key), Prefer: "count=exact" } }
    );
    // Count is in the content-range header
    const range = resp.headers.get("content-range");
    if (range) {
      const total = range.split("/")[1];
      return total ? parseInt(total, 10) : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/** Count ALL pending requests for a specific container */
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
      { headers: { ...buildHeaders(config.key), Prefer: "count=exact" } }
    );
    const range = resp.headers.get("content-range");
    if (range) {
      const total = range.split("/")[1];
      return total ? parseInt(total, 10) : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

// ---------- WRITE ----------

/** Insert a booking request */
export async function insertBookingRequest(request: {
  container_id: string;
  project_number: string;
  name: string;
  email: string;
  phone: string | null;
  cargo_description: string;
  source_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, error: "Supabase not configured" };

  try {
    const resp = await fetch(`${config.url}/rest/v1/space_booking_requests`, {
      method: "POST",
      headers: { ...buildHeaders(config.key), Prefer: "return=minimal" },
      body: JSON.stringify({ ...request, status: "new" }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      // Check for unique constraint violation (same-day dedup)
      if (resp.status === 409 || text.includes("unique")) {
        return { ok: true }; // Idempotent — treat as success
      }
      log({ level: "error", msg: "insert_booking_failed", route: "supabase-containers", status: resp.status, body: text });
      return { ok: false, error: "Failed to save booking request" };
    }
    return { ok: true };
  } catch (e) {
    log({ level: "error", msg: "insert_booking_exception", route: "supabase-containers", error: String(e) });
    return { ok: false, error: "An unexpected error occurred" };
  }
}

/** Batch upsert containers from sync pipeline */
export async function upsertContainers(
  rows: ParsedContainerRow[]
): Promise<{ ok: boolean; error?: string }> {
  const config = getSupabaseConfig();
  if (!config) return { ok: false, error: "Supabase not configured" };

  try {
    const payload = rows.map((r) => ({
      ...r,
      status: "available",
      source: "google_sheets",
      synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const resp = await fetch(
      `${config.url}/rest/v1/shared_containers`,
      {
        method: "POST",
        headers: {
          ...buildHeaders(config.key),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      log({ level: "error", msg: "upsert_containers_failed", route: "sync-containers", status: resp.status, body: text });
      return { ok: false, error: text };
    }
    return { ok: true };
  } catch (e) {
    log({ level: "error", msg: "upsert_containers_exception", route: "sync-containers", error: String(e) });
    return { ok: false, error: String(e) };
  }
}

/** Mark stale containers (in DB but not in current sheet) */
export async function markStaleContainers(
  activeProjectNumbers: string[]
): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;

  try {
    const today = new Date().toISOString().split("T")[0];

    // Mark past-departure containers as 'departed'
    await fetch(
      `${config.url}/rest/v1/shared_containers?status=eq.available&departure_date=lt.${today}`,
      {
        method: "PATCH",
        headers: { ...buildHeaders(config.key), Prefer: "return=minimal" },
        body: JSON.stringify({ status: "departed", updated_at: new Date().toISOString() }),
      }
    );

    // Mark containers with 0 CBM as 'full'
    await fetch(
      `${config.url}/rest/v1/shared_containers?status=eq.available&available_cbm=eq.0`,
      {
        method: "PATCH",
        headers: { ...buildHeaders(config.key), Prefer: "return=minimal" },
        body: JSON.stringify({ status: "full", updated_at: new Date().toISOString() }),
      }
    );

    // Mark containers not in current sheet as 'unlisted'
    // (only those still marked as 'available' and sourced from google_sheets)
    if (activeProjectNumbers.length > 0) {
      // Supabase REST API doesn't support NOT IN directly with arrays in query params.
      // Fetch all available google_sheets containers, then patch those not in the active list.
      const params = new URLSearchParams({
        select: "id,project_number",
        status: "eq.available",
        source: "eq.google_sheets",
      });
      const resp = await fetch(
        `${config.url}/rest/v1/shared_containers?${params}`,
        { headers: buildHeaders(config.key) }
      );
      if (resp.ok) {
        const dbContainers = (await resp.json()) as Array<{ id: string; project_number: string }>;
        const activeSet = new Set(activeProjectNumbers);
        const staleIds = dbContainers
          .filter((c) => !activeSet.has(c.project_number))
          .map((c) => c.id);

        for (const id of staleIds) {
          await fetch(
            `${config.url}/rest/v1/shared_containers?id=eq.${id}`,
            {
              method: "PATCH",
              headers: { ...buildHeaders(config.key), Prefer: "return=minimal" },
              body: JSON.stringify({ status: "unlisted", updated_at: new Date().toISOString() }),
            }
          );
        }
      }
    }
  } catch (e) {
    log({ level: "error", msg: "mark_stale_exception", route: "sync-containers", error: String(e) });
  }
}

/** Insert a sync log entry */
export async function insertSyncLog(entry: {
  status: "success" | "partial" | "failed";
  rows_fetched: number;
  rows_upserted: number;
  rows_skipped: number;
  rows_errored: number;
  error_details: SyncError[] | null;
  duration_ms: number;
  started_at: string;
}): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;

  try {
    await fetch(`${config.url}/rest/v1/sync_log`, {
      method: "POST",
      headers: { ...buildHeaders(config.key), Prefer: "return=minimal" },
      body: JSON.stringify({
        ...entry,
        source: "google_sheets",
        completed_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    log({ level: "error", msg: "insert_sync_log_exception", route: "sync-containers", error: String(e) });
  }
}
```

**Step 2: Commit**

```bash
git add lib/supabase-containers.ts
git commit -m "feat(shared-shipping): add Supabase helpers for containers, bookings, sync log"
```

---

## Phase 2: Google Sheets Sync Pipeline

### Task 4: Google Sheets REST API Client

**Files:**
- Create: `lib/google-sheets.ts`

**Step 1: Create the Google Sheets client**

This uses direct `fetch` with a self-signed JWT — no `googleapis` npm package needed. The JWT generation uses the built-in `crypto` module.

```typescript
// lib/google-sheets.ts
/**
 * Google Sheets REST API v4 client using Service Account auth.
 * Direct fetch — no googleapis npm package.
 */

import { log } from "@/lib/logger";

// ---------- JWT Generation ----------

/** Create a signed JWT for Google Service Account auth */
async function createServiceAccountJWT(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKeyPem = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (!email || !privateKeyPem) {
    log({ level: "error", msg: "google_sheets_not_configured", route: "google-sheets" });
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  try {
    // Import the private key
    const pemBody = privateKeyPem
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/\s/g, "");

    const keyBuffer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signingInput)
    );

    const signature = base64url(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    );

    return `${signingInput}.${signature}`;
  } catch (e) {
    log({ level: "error", msg: "jwt_sign_failed", route: "google-sheets", error: String(e) });
    return null;
  }
}

function base64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Exchange JWT for access token */
async function getAccessToken(): Promise<string | null> {
  const jwt = await createServiceAccountJWT();
  if (!jwt) return null;

  try {
    const resp = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      log({ level: "error", msg: "google_token_exchange_failed", route: "google-sheets", status: resp.status, body: text });
      return null;
    }

    const data = (await resp.json()) as { access_token: string };
    return data.access_token;
  } catch (e) {
    log({ level: "error", msg: "google_token_exception", route: "google-sheets", error: String(e) });
    return null;
  }
}

// ---------- Sheet Reading ----------

export interface SheetData {
  values: string[][];
}

/** Fetch all values from a Google Sheet tab */
export async function fetchSheetValues(
  spreadsheetId?: string,
  tabName?: string
): Promise<SheetData | null> {
  const sheetId = spreadsheetId ?? process.env.GOOGLE_SPREADSHEET_ID?.trim();
  const tab = tabName ?? process.env.GOOGLE_SHEET_TAB_NAME?.trim() ?? "Sheet1";

  if (!sheetId) {
    log({ level: "error", msg: "spreadsheet_id_missing", route: "google-sheets" });
    return null;
  }

  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const range = encodeURIComponent(tab);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!resp.ok) {
      const text = await resp.text();
      log({ level: "error", msg: "google_sheets_fetch_failed", route: "google-sheets", status: resp.status, body: text });
      return null;
    }

    const data = (await resp.json()) as { values?: string[][] };
    return { values: data.values ?? [] };
  } catch (e) {
    log({ level: "error", msg: "google_sheets_exception", route: "google-sheets", error: String(e) });
    return null;
  }
}
```

**Step 2: Commit**

```bash
git add lib/google-sheets.ts
git commit -m "feat(shared-shipping): add Google Sheets REST API client with JWT auth"
```

---

### Task 5: Sync Pipeline (Parsers + Orchestrator)

**Files:**
- Create: `lib/sync-containers.ts`

**Step 1: Create the sync pipeline**

This is the core logic — column detection, date parsing, space parsing, country extraction, and the orchestration function that ties it all together.

```typescript
// lib/sync-containers.ts
/**
 * Google Sheets → Supabase sync pipeline for shared containers.
 * Handles column detection, multi-format parsing, safety gates.
 */

import { fetchSheetValues } from "@/lib/google-sheets";
import {
  upsertContainers,
  markStaleContainers,
  insertSyncLog,
} from "@/lib/supabase-containers";
import type { ParsedContainerRow, SyncError, SyncResult } from "@/lib/types/shared-shipping";
import { log } from "@/lib/logger";

// ---------- Column Detection ----------

/** Map of DB field name → possible header texts (case-insensitive) */
const COLUMN_HEADERS: Record<string, string[]> = {
  project_number: ["номер проекта", "project #", "project number", "project", "проект"],
  origin: ["откуда грузится", "origin", "from", "откуда", "loading from"],
  destination: ["куда идет", "destination", "to", "куда", "dest"],
  departure_date: ["дата выхода", "departure", "departure date", "дата отправки", "etd"],
  eta_date: ["eta", "arrival", "estimated arrival", "дата прибытия", "eta date"],
  space_available: ["space available", "space", "свободно", "available cbm", "cbm", "свободное место"],
  container_type: ["container", "type", "тип контейнера", "container type"],
  notes: ["notes", "примечания", "comments", "заметки"],
};

const REQUIRED_COLUMNS = ["project_number", "destination", "departure_date", "space_available"];

interface ColumnMap {
  [field: string]: number; // field name → column index
}

export function detectColumns(headerRow: string[]): ColumnMap | null {
  const map: ColumnMap = {};
  const normalizedHeaders = headerRow.map((h) => String(h ?? "").toLowerCase().trim());

  for (const [field, aliases] of Object.entries(COLUMN_HEADERS)) {
    const index = normalizedHeaders.findIndex((h) =>
      aliases.some((alias) => h.includes(alias))
    );
    if (index !== -1) {
      map[field] = index;
    }
  }

  // Check required columns
  for (const required of REQUIRED_COLUMNS) {
    if (map[required] === undefined) {
      log({
        level: "error",
        msg: "required_column_missing",
        route: "sync-containers",
        column: required,
        available: Object.keys(map),
      });
      return null;
    }
  }

  return map;
}

// ---------- Date Parsing ----------

export function parseSheetDate(raw: unknown): string | null {
  if (raw == null || raw === "") return null;

  // 1. Google Sheets serial number (days since Dec 30, 1899)
  if (typeof raw === "number" && raw > 40000 && raw < 60000) {
    const date = new Date((raw - 25569) * 86400000);
    return date.toISOString().split("T")[0];
  }

  const str = String(raw).trim();
  if (!str) return null;

  // 2. ISO: "2026-04-15"
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }

  // 3. DD.MM.YYYY: "15.04.2026"
  const dotMatch = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    const d = new Date(+dotMatch[3], +dotMatch[2] - 1, +dotMatch[1]);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }

  // 4. MM/DD/YYYY: "04/15/2026"
  const slashMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const d = new Date(+slashMatch[3], +slashMatch[1] - 1, +slashMatch[2]);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }

  // 5. Try generic Date constructor as last resort
  const generic = new Date(str);
  if (!isNaN(generic.getTime())) return generic.toISOString().split("T")[0];

  return null;
}

// ---------- Space Parsing ----------

const DEFAULT_CAPACITY_CBM: Record<string, number> = {
  "40hc": 76,
  "40ft": 67,
  "20ft": 33,
  flatrack: 28,
};

export function parseSpaceAvailable(
  raw: unknown,
  totalCapacity: number = 76
): { cbm: number | null; rawValue: string } {
  const rawStr = String(raw ?? "").trim();
  if (!rawStr) return { cbm: null, rawValue: rawStr };

  // Direct number
  if (typeof raw === "number") {
    return { cbm: raw, rawValue: rawStr };
  }

  // Percentage: "40%" → compute from capacity
  const pctMatch = rawStr.match(/([\d]+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const cbm = Math.round((pct / 100) * totalCapacity * 10) / 10;
    return { cbm, rawValue: rawStr };
  }

  // Extract first number: "30 CBM", "~30", "30 кб.м"
  const numMatch = rawStr.match(/([\d]+(?:\.\d+)?)/);
  if (numMatch) {
    return { cbm: parseFloat(numMatch[1]), rawValue: rawStr };
  }

  // Can't parse
  return { cbm: null, rawValue: rawStr };
}

// ---------- Country Extraction ----------

const COUNTRY_MAP: Record<string, string> = {
  // English
  kazakhstan: "KZ", brazil: "BR", uruguay: "UY", argentina: "AR",
  colombia: "CO", chile: "CL", peru: "PE", ecuador: "EC",
  mexico: "MX", "south africa": "ZA", australia: "AU",
  "new zealand": "NZ", nigeria: "NG", ghana: "GH",
  kenya: "KE", tanzania: "TZ", uganda: "UG",
  ethiopia: "ET", mozambique: "MO", zambia: "ZM",
  thailand: "TH", vietnam: "VN", indonesia: "ID",
  philippines: "PH", malaysia: "MY", turkey: "TR",
  georgia: "GE", uzbekistan: "UZ", kyrgyzstan: "KG",
  tajikistan: "TJ", turkmenistan: "TM", mongolia: "MN",
  paraguay: "PY", bolivia: "BO", guatemala: "GT",
  // Russian
  казахстан: "KZ", бразилия: "BR", уругвай: "UY",
  аргентина: "AR", колумбия: "CO", чили: "CL",
  перу: "PE", эквадор: "EC", мексика: "MX",
  "южная африка": "ZA", австралия: "AU",
  нигерия: "NG", кения: "KE", гана: "GH",
  турция: "TR", грузия: "GE", узбекистан: "UZ",
  кыргызстан: "KG", парагвай: "PY", боливия: "BO",
};

export function extractCountryCode(destination: string): string | null {
  const lower = destination.toLowerCase().trim();
  for (const [name, code] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(name)) return code;
  }
  // Check for trailing ISO code: "Almaty, KZ"
  const isoMatch = destination.match(/\b([A-Z]{2})$/);
  if (isoMatch) return isoMatch[1];
  return null;
}

// ---------- Row Parsing ----------

function getCell(row: string[], colMap: ColumnMap, field: string): string {
  const idx = colMap[field];
  if (idx === undefined) return "";
  return String(row[idx] ?? "").trim();
}

export function parseRow(
  row: string[],
  rowIndex: number,
  colMap: ColumnMap
): { parsed: ParsedContainerRow | null; error: SyncError | null } {
  const projectNumber = getCell(row, colMap, "project_number");
  if (!projectNumber) {
    return { parsed: null, error: null }; // Skip silently (empty row)
  }

  const destination = getCell(row, colMap, "destination");
  if (!destination) {
    return { parsed: null, error: { row: rowIndex, field: "destination", raw: "", error: "empty" } };
  }

  const rawDate = row[colMap.departure_date];
  const departureDate = parseSheetDate(rawDate);
  if (!departureDate) {
    return { parsed: null, error: { row: rowIndex, field: "departure_date", raw: String(rawDate ?? ""), error: "unparsable" } };
  }

  const origin = getCell(row, colMap, "origin") || "Albion, IA";
  const etaRaw = colMap.eta_date !== undefined ? row[colMap.eta_date] : undefined;
  const etaDate = parseSheetDate(etaRaw);
  const containerTypeRaw = getCell(row, colMap, "container_type") || "40HC";
  const containerType = containerTypeRaw.toUpperCase().includes("FLAT") ? "Flatrack" : containerTypeRaw;

  const totalCapacity = DEFAULT_CAPACITY_CBM[containerType.toLowerCase()] ?? 76;
  const rawSpace = colMap.space_available !== undefined ? row[colMap.space_available] : undefined;
  const { cbm, rawValue } = parseSpaceAvailable(rawSpace, totalCapacity);
  const notes = getCell(row, colMap, "notes") || null;

  return {
    parsed: {
      project_number: projectNumber,
      origin,
      destination,
      destination_country: extractCountryCode(destination),
      departure_date: departureDate,
      eta_date: etaDate,
      container_type: containerType,
      total_capacity_cbm: totalCapacity,
      available_cbm: cbm,
      raw_space_value: rawValue,
      sheet_row_number: rowIndex + 1, // 1-based for Google Sheets
      notes,
    },
    error: null,
  };
}

// ---------- Main Sync Orchestrator ----------

export async function syncContainersFromSheet(): Promise<SyncResult> {
  const startedAt = new Date().toISOString();
  const startMs = Date.now();

  // ① FETCH
  const sheet = await fetchSheetValues();
  if (!sheet || sheet.values.length === 0) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: 0,
      rowsUpserted: 0,
      rowsSkipped: 0,
      rowsErrored: 0,
      errors: [{ row: 0, field: "sheet", raw: "", error: "Empty or unavailable" }],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });
    return result;
  }

  const allRows = sheet.values;

  // ② DETECT COLUMNS
  const headerRow = allRows[0];
  if (!headerRow) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: allRows.length,
      rowsUpserted: 0,
      rowsSkipped: 0,
      rowsErrored: 0,
      errors: [{ row: 0, field: "header", raw: "", error: "No header row" }],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });
    return result;
  }

  const colMap = detectColumns(headerRow);
  if (!colMap) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: allRows.length,
      rowsUpserted: 0,
      rowsSkipped: 0,
      rowsErrored: 0,
      errors: [{ row: 0, field: "columns", raw: headerRow.join(", "), error: "Required columns missing" }],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });
    return result;
  }

  // ③ PARSE ROWS
  const dataRows = allRows.slice(1); // Skip header
  const parsed: ParsedContainerRow[] = [];
  const errors: SyncError[] = [];
  let skipped = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    // Skip empty rows
    if (!row || row.every((cell) => !cell && cell !== 0)) {
      skipped++;
      continue;
    }

    const { parsed: parsedRow, error } = parseRow(row, i + 1, colMap);
    if (parsedRow) {
      parsed.push(parsedRow);
    } else if (error) {
      errors.push(error);
    } else {
      skipped++; // No project number — silent skip
    }
  }

  // ④ SAFETY GATE
  if (parsed.length === 0) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: dataRows.length,
      rowsUpserted: 0,
      rowsSkipped: skipped,
      rowsErrored: errors.length,
      errors: [{ row: 0, field: "safety", raw: "", error: "0 parseable rows — aborting to prevent data wipe" }, ...errors],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });
    return result;
  }

  const errorRate = errors.length / (parsed.length + errors.length);
  if (errorRate > 0.8) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: dataRows.length,
      rowsUpserted: 0,
      rowsSkipped: skipped,
      rowsErrored: errors.length,
      errors: [{ row: 0, field: "safety", raw: "", error: `Error rate ${Math.round(errorRate * 100)}% > 80% — aborting` }, ...errors],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });
    return result;
  }

  // ⑤ UPSERT
  const upsertResult = await upsertContainers(parsed);
  if (!upsertResult.ok) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: dataRows.length,
      rowsUpserted: 0,
      rowsSkipped: skipped,
      rowsErrored: errors.length,
      errors: [{ row: 0, field: "upsert", raw: "", error: upsertResult.error ?? "Upsert failed" }, ...errors],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });
    return result;
  }

  // ⑥ HANDLE STALE + AUTO-EXPIRE
  const activeProjectNumbers = parsed.map((r) => r.project_number);
  await markStaleContainers(activeProjectNumbers);

  // ⑦ RESULT
  const result: SyncResult = {
    status: errors.length > 0 ? "partial" : "success",
    rowsFetched: dataRows.length,
    rowsUpserted: parsed.length,
    rowsSkipped: skipped,
    rowsErrored: errors.length,
    errors,
    durationMs: Date.now() - startMs,
  };

  await insertSyncLog({ ...toLogEntry(result), started_at: startedAt });

  log({
    level: result.status === "success" ? "info" : "warn",
    msg: "sync_complete",
    route: "sync-containers",
    ...result,
  });

  return result;
}

function toLogEntry(r: SyncResult) {
  return {
    status: r.status,
    rows_fetched: r.rowsFetched,
    rows_upserted: r.rowsUpserted,
    rows_skipped: r.rowsSkipped,
    rows_errored: r.rowsErrored,
    error_details: r.errors.length > 0 ? r.errors : null,
    duration_ms: r.durationMs,
  };
}
```

**Step 2: Commit**

```bash
git add lib/sync-containers.ts
git commit -m "feat(shared-shipping): add sync pipeline with column detection, multi-format parsing, safety gates"
```

---

### Task 6: Sync Pipeline Unit Tests

**Files:**
- Create: `lib/__tests__/sync-containers.test.ts`

**Step 1: Write tests for all parsers and column detection**

```typescript
// lib/__tests__/sync-containers.test.ts
import { describe, it, expect } from "vitest";
import {
  detectColumns,
  parseSheetDate,
  parseSpaceAvailable,
  extractCountryCode,
  parseRow,
} from "@/lib/sync-containers";

describe("detectColumns", () => {
  it("detects Russian headers", () => {
    const headers = ["ID", "Дата", "Номер проекта", "Клиент", "откуда грузится", "Вес", "куда идет", "Carrier", "дата выхода", "Status", "Transit", "ETA", "Notes", "Cost", "Invoice", "Docs", "Paid", "Tax", "Manifest", "Container", "Format", "Dims", "Photos", "Tags", "Space available"];
    const map = detectColumns(headers);
    expect(map).not.toBeNull();
    expect(map!.project_number).toBe(2);
    expect(map!.origin).toBe(4);
    expect(map!.destination).toBe(6);
    expect(map!.departure_date).toBe(8);
    expect(map!.eta_date).toBe(11);
    expect(map!.space_available).toBe(24);
  });

  it("detects English headers", () => {
    const headers = ["Project #", "Origin", "Destination", "Departure Date", "ETA", "Space"];
    const map = detectColumns(headers);
    expect(map).not.toBeNull();
    expect(map!.project_number).toBe(0);
    expect(map!.destination).toBe(2);
  });

  it("returns null when required columns are missing", () => {
    const headers = ["Name", "Email", "Phone"];
    const map = detectColumns(headers);
    expect(map).toBeNull();
  });
});

describe("parseSheetDate", () => {
  it("parses ISO format", () => {
    expect(parseSheetDate("2026-04-15")).toBe("2026-04-15");
  });

  it("parses DD.MM.YYYY", () => {
    expect(parseSheetDate("15.04.2026")).toBe("2026-04-15");
  });

  it("parses MM/DD/YYYY", () => {
    expect(parseSheetDate("04/15/2026")).toBe("2026-04-15");
  });

  it("parses Google Sheets serial number", () => {
    // 46132 = 2026-04-15
    const result = parseSheetDate(46132);
    expect(result).toBe("2026-04-15");
  });

  it("returns null for empty/invalid", () => {
    expect(parseSheetDate("")).toBeNull();
    expect(parseSheetDate(null)).toBeNull();
    expect(parseSheetDate("not a date")).toBeNull();
  });
});

describe("parseSpaceAvailable", () => {
  it("parses plain number", () => {
    expect(parseSpaceAvailable(30)).toEqual({ cbm: 30, rawValue: "30" });
  });

  it("parses string number", () => {
    expect(parseSpaceAvailable("30")).toEqual({ cbm: 30, rawValue: "30" });
  });

  it("parses CBM suffix", () => {
    expect(parseSpaceAvailable("30 CBM")).toEqual({ cbm: 30, rawValue: "30 CBM" });
  });

  it("parses Russian CBM", () => {
    expect(parseSpaceAvailable("30 кб.м")).toEqual({ cbm: 30, rawValue: "30 кб.м" });
  });

  it("parses approximate", () => {
    expect(parseSpaceAvailable("~30")).toEqual({ cbm: 30, rawValue: "~30" });
  });

  it("parses percentage with capacity 76", () => {
    const result = parseSpaceAvailable("40%", 76);
    expect(result.cbm).toBeCloseTo(30.4, 1);
    expect(result.rawValue).toBe("40%");
  });

  it("returns null for unparsable text", () => {
    expect(parseSpaceAvailable("half")).toEqual({ cbm: null, rawValue: "half" });
    expect(parseSpaceAvailable("")).toEqual({ cbm: null, rawValue: "" });
  });
});

describe("extractCountryCode", () => {
  it("extracts from English country name", () => {
    expect(extractCountryCode("Almaty, Kazakhstan")).toBe("KZ");
    expect(extractCountryCode("Santos, Brazil")).toBe("BR");
  });

  it("extracts from Russian country name", () => {
    expect(extractCountryCode("Алматы, Казахстан")).toBe("KZ");
  });

  it("extracts trailing ISO code", () => {
    expect(extractCountryCode("Almaty, KZ")).toBe("KZ");
  });

  it("returns null for unknown", () => {
    expect(extractCountryCode("Unknown Place")).toBeNull();
  });
});

describe("parseRow", () => {
  const colMap = {
    project_number: 0,
    origin: 1,
    destination: 2,
    departure_date: 3,
    eta_date: 4,
    space_available: 5,
  };

  it("parses a valid row", () => {
    const row = ["MF-2026-047", "Chicago, IL", "Almaty, Kazakhstan", "2026-04-15", "2026-05-20", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(error).toBeNull();
    expect(parsed).not.toBeNull();
    expect(parsed!.project_number).toBe("MF-2026-047");
    expect(parsed!.destination_country).toBe("KZ");
    expect(parsed!.available_cbm).toBe(29);
  });

  it("skips row with empty project number", () => {
    const row = ["", "Chicago, IL", "Almaty", "2026-04-15", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error).toBeNull(); // Silent skip
  });

  it("errors on missing destination", () => {
    const row = ["MF-001", "Chicago", "", "2026-04-15", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error).not.toBeNull();
    expect(error!.field).toBe("destination");
  });

  it("errors on unparsable date", () => {
    const row = ["MF-001", "Chicago", "Almaty, KZ", "not-a-date", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error!.field).toBe("departure_date");
  });

  it("defaults origin to Albion, IA when empty", () => {
    const row = ["MF-001", "", "Almaty, KZ", "2026-04-15", "", "29"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.origin).toBe("Albion, IA");
  });
});
```

**Step 2: Run the tests**

```bash
npm test -- lib/__tests__/sync-containers.test.ts
```

Expected: All tests pass. If any fail, fix the parser logic.

**Step 3: Commit**

```bash
git add lib/__tests__/sync-containers.test.ts
git commit -m "test(shared-shipping): add unit tests for sync pipeline parsers"
```

---

### Task 7: Cron API Route

**Files:**
- Create: `app/api/cron/sync-containers/route.ts`
- Modify: `vercel.json` (add cron entry)

**Step 1: Create the cron route**

Follow the exact pattern from `app/api/cron/rate-check/route.ts`.

```typescript
// app/api/cron/sync-containers/route.ts
import { revalidatePath } from "next/cache";
import { syncContainersFromSheet } from "@/lib/sync-containers";
import { notifySlack } from "@/lib/slack";
import { log } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await syncContainersFromSheet();

    // Revalidate the shared-shipping page on successful sync
    if (result.status !== "failed") {
      revalidatePath("/shared-shipping");
      // Revalidate all locale variants
      revalidatePath("/en/shared-shipping");
      revalidatePath("/es/shared-shipping");
      revalidatePath("/ru/shared-shipping");
    }

    // Alert on failure or high error rate
    if (result.status === "failed") {
      const errorMsg = result.errors[0]?.error ?? "Unknown error";
      await notifySlack(
        `:warning: *Container sync FAILED*\n` +
        `Error: ${errorMsg}\n` +
        `Rows fetched: ${result.rowsFetched}, Errors: ${result.rowsErrored}\n` +
        `Duration: ${result.durationMs}ms`
      );
    } else if (result.rowsErrored > result.rowsUpserted) {
      await notifySlack(
        `:warning: *Container sync high error rate*\n` +
        `Upserted: ${result.rowsUpserted}, Errors: ${result.rowsErrored}, Skipped: ${result.rowsSkipped}\n` +
        `Duration: ${result.durationMs}ms`
      );
    }

    log({
      level: result.status === "failed" ? "error" : "info",
      msg: "cron_sync_complete",
      route: "cron:sync-containers",
      ...result,
    });

    return Response.json({
      status: result.status,
      upserted: result.rowsUpserted,
      errors: result.rowsErrored,
      duration: result.durationMs,
    });
  } catch (e) {
    log({ level: "error", msg: "cron_sync_exception", route: "cron:sync-containers", error: String(e) });
    return Response.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
```

**Step 2: Add cron entry to vercel.json**

Read `vercel.json`, then add the new cron entry to the existing `crons` array.

```jsonc
// Add to vercel.json "crons" array:
{
  "path": "/api/cron/sync-containers",
  "schedule": "*/15 * * * *"
}
```

**Step 3: Commit**

```bash
git add app/api/cron/sync-containers/route.ts vercel.json
git commit -m "feat(shared-shipping): add cron route for Google Sheets sync (every 15 min)"
```

---

## Phase 3: UI Components

### Task 8: Add shadcn/ui Progress Component

**Step 1: Install Progress**

```bash
npx shadcn@latest add progress
```

**Step 2: Commit**

```bash
git add components/ui/progress.tsx
git commit -m "chore(ui): add shadcn Progress component"
```

---

### Task 9: Container Display State Helper

**Files:**
- Create: `lib/container-display.ts`

**Step 1: Create the display state computation**

```typescript
// lib/container-display.ts
/**
 * Computes the visual display state for a container card.
 * Pure function — no side effects, no I/O.
 */

import type { ContainerDisplayState, ContainerWithPendingCount } from "@/lib/types/shared-shipping";

export function computeDisplayState(container: ContainerWithPendingCount): ContainerDisplayState {
  const totalCBM = container.total_capacity_cbm || 76;
  const availCBM = container.available_cbm ?? 0;

  const fillPercent = totalCBM > 0
    ? Math.round((1 - availCBM / totalCBM) * 100)
    : 100;

  const now = new Date();
  const departure = new Date(container.departure_date);
  const daysUntilDeparture = Math.ceil(
    (departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isFull = availCBM === 0 || container.status === "full";

  let fillColor: "blue" | "amber" | "zinc";
  if (isFull) fillColor = "zinc";
  else if (fillPercent >= 80) fillColor = "amber";
  else fillColor = "blue";

  const pendingCount = container.pending_count ?? 0;
  let demandLevel: "pending" | "popular" | null = null;
  if (pendingCount > 0 && pendingCount <= 2) demandLevel = "pending";
  else if (pendingCount > 2) demandLevel = "popular";

  return {
    fillPercent: Math.min(fillPercent, 100),
    fillColor,
    isDepartingSoon: daysUntilDeparture <= 3 && daysUntilDeparture >= 0,
    isLimited: fillPercent >= 80 && !isFull,
    isFull,
    demandLevel,
    pendingCount,
    daysUntilDeparture,
  };
}

/** Get country flag emoji from ISO 2-letter code */
export function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = [...code.toUpperCase()].map(
    (c) => 0x1f1e6 + c.charCodeAt(0) - 65
  );
  return String.fromCodePoint(...codePoints);
}

/** Format transit time from departure and ETA dates */
export function transitDays(departureDate: string, etaDate: string | null): number | null {
  if (!etaDate) return null;
  const dep = new Date(departureDate);
  const eta = new Date(etaDate);
  const diff = Math.ceil((eta.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}
```

**Step 2: Commit**

```bash
git add lib/container-display.ts
git commit -m "feat(shared-shipping): add container display state helper and country flag util"
```

---

### Task 10: Container Card Component

**Files:**
- Create: `components/shared-shipping/container-card.tsx`

**Step 1: Build the card**

Use existing shadcn Card, Badge, Button, Progress. Follow the visual spec from the design doc. Use motion for hover + entrance animations.

Key details:
- Country flag + route at top
- Date row (departure → ETA with transit time)
- Progress bar (animated fill, color-coded)
- CBM available + pending count / Popular badge
- CTA button ("Request Space →" or "Contact Us")
- `motion.div` wrapper for hover scale effect (desktop only)
- Receives `container: ContainerWithPendingCount` + `index: number` (for stagger delay) + `onRequestSpace: (container) => void` callback

**Step 2: Commit**

```bash
git add components/shared-shipping/container-card.tsx
git commit -m "feat(shared-shipping): add container card with states, progress bar, animations"
```

---

### Task 11: Container Card Skeleton

**Files:**
- Create: `components/shared-shipping/container-card-skeleton.tsx`

Short file — uses `Skeleton` component to mimic the card layout.

**Commit:**

```bash
git add components/shared-shipping/container-card-skeleton.tsx
git commit -m "feat(shared-shipping): add skeleton loading state for container cards"
```

---

### Task 12: Stale Data Banner

**Files:**
- Create: `components/shared-shipping/stale-data-banner.tsx`

Client component that receives `lastSyncTime: string | null`, computes minutes since sync, displays appropriate banner (none, subtle, yellow, red) per design spec.

**Commit:**

```bash
git add components/shared-shipping/stale-data-banner.tsx
git commit -m "feat(shared-shipping): add stale data freshness banner"
```

---

### Task 13: Destination Filter

**Files:**
- Create: `components/shared-shipping/destination-filter.tsx`

Client component using shadcn `Select`. Extracts unique `destination_country` values from the container list, shows "All Destinations" + each country. Also includes a sort dropdown (Soonest First / Most Space).

**Commit:**

```bash
git add components/shared-shipping/destination-filter.tsx
git commit -m "feat(shared-shipping): add destination filter and sort dropdown"
```

---

### Task 14: Booking Request Dialog

**Files:**
- Create: `components/shared-shipping/booking-request-dialog.tsx`

Client component. Uses `Dialog` on desktop, `Sheet` on mobile (detect via `useMediaQuery` or a simple window width check). Form fields: name, email, phone, cargoDescription, hidden honeypot, hidden containerId/projectNumber/UTMs.

On submit:
1. Disable button, show spinner
2. Call `submitBookingRequest` Server Action
3. On success: show confirmation screen in the dialog
4. On error: show error message
5. Track GA4 + Pixel events on success

**Commit:**

```bash
git add components/shared-shipping/booking-request-dialog.tsx
git commit -m "feat(shared-shipping): add booking request dialog/sheet with form and tracking"
```

---

### Task 15: Container Grid (Assembles Cards + Filter)

**Files:**
- Create: `components/shared-shipping/container-grid.tsx`

Client component that receives `containers: ContainerWithPendingCount[]` and `lastSyncTime: string | null`. Manages filter/sort state, renders the `StaleDataBanner`, `DestinationFilter`, and a grid of `ContainerCard` components. Handles the "Request Space" click by opening `BookingRequestDialog`.

Uses `AnimatePresence` + `layoutId` for smooth filter transitions.

**Commit:**

```bash
git add components/shared-shipping/container-grid.tsx
git commit -m "feat(shared-shipping): add container grid with filtering, sorting, and animation"
```

---

### Task 16: Static Sections (How It Works, Empty State)

**Files:**
- Create: `components/shared-shipping/how-it-works.tsx`
- Create: `components/shared-shipping/empty-state.tsx`

Server Components. "How It Works" is a 3-step process section with icons (from Lucide). Empty state shows illustration + phone/WhatsApp contact.

**Commit:**

```bash
git add components/shared-shipping/how-it-works.tsx components/shared-shipping/empty-state.tsx
git commit -m "feat(shared-shipping): add How It Works and empty state components"
```

---

## Phase 4: Server Action + Page Assembly

### Task 17: Booking Request Server Action

**Files:**
- Create: `app/actions/booking.ts`

Follow the **exact** pattern from `app/actions/contact.ts`:
1. `"use server"` directive
2. Zod validation with `bookingRequestSchema`
3. Honeypot check
4. Container status re-check (fetch from Supabase, verify still 'available')
5. Dedup check (countRecentRequests)
6. Supabase INSERT via `insertBookingRequest`
7. Resend email to `CONTACT.notificationEmail` (MUST succeed)
   - Include pending request count in the email
   - Include "Remember to update Google Sheets" reminder
8. Return success with eventId
9. `after()` block:
   - Auto-reply to customer
   - Slack notification
   - Meta CAPI Lead event
   - Vercel Analytics track

**Commit:**

```bash
git add app/actions/booking.ts
git commit -m "feat(shared-shipping): add booking request Server Action with all notifications"
```

---

### Task 18: FAQ Content

**Files:**
- Create: `content/shared-shipping-faq.ts`

Follow the pattern from `content/faq.ts`. Include 6-8 common questions:
- What is shared container shipping?
- How much space can I book?
- How are prices determined?
- How quickly will I hear back?
- What happens after I submit a request?
- What types of cargo can I ship?
- Is my cargo insured?
- Which countries do you ship to?

**Commit:**

```bash
git add content/shared-shipping-faq.ts
git commit -m "feat(shared-shipping): add FAQ content for shared shipping page"
```

---

### Task 19: i18n Translations

**Files:**
- Modify: `messages/en.json` — add `SharedShipping` namespace
- Modify: `messages/es.json` — add `SharedShipping` namespace
- Modify: `messages/ru.json` — add `SharedShipping` namespace

Add all translation keys listed in the design doc under `SharedShipping.*`.

**Commit:**

```bash
git add messages/en.json messages/es.json messages/ru.json
git commit -m "feat(shared-shipping): add i18n translations (en, es, ru)"
```

---

### Task 20: Main Page Assembly

**Files:**
- Create: `app/[locale]/shared-shipping/page.tsx`

Server Component page. Follow the pattern from other pages:
- `generateMetadata()` with `pageMetadata()` helper
- `setRequestLocale(locale)`
- Fetch data: `fetchAvailableContainers()` + `getLastSyncTime()`
- Render: Hero → ContainerGrid (or EmptyState) → HowItWorks → FAQ → CTA
- JSON-LD Service schema

**Commit:**

```bash
git add app/[locale]/shared-shipping/page.tsx
git commit -m "feat(shared-shipping): add main page with SSG, data fetching, and SEO"
```

---

### Task 21: Navigation + Sitemap Updates

**Files:**
- Modify: `lib/constants.ts` — add "Shared Shipping" to `NAV_ITEMS`
- Modify: `app/sitemap.ts` — add `/shared-shipping` entry

Insert `{ label: "Shared Shipping", href: "/shared-shipping" }` after the "Pricing" entry in `NAV_ITEMS` (before "FAQ").

Add to sitemap: `{ url: '${SITE.url}/shared-shipping', changeFrequency: 'daily', priority: 0.9 }`.

**Commit:**

```bash
git add lib/constants.ts app/sitemap.ts
git commit -m "feat(shared-shipping): add to navigation and sitemap"
```

---

## Phase 5: Analytics, Final Touches, Verification

### Task 22: Analytics Integration

**Files:**
- Modify: `lib/tracking.ts` — add `trackBookingFunnel()` helper (similar to `trackCalcFunnel`)

Add helper functions for:
- `trackBookingStart(containerId, destination)`
- `trackBookingSubmit(containerId, destination)`

These call `trackGA4Event` + `track` from Vercel Analytics.

**Commit:**

```bash
git add lib/tracking.ts
git commit -m "feat(shared-shipping): add booking analytics tracking helpers"
```

---

### Task 23: Supabase Table Creation

**Manual step — NOT code. Run in Supabase SQL Editor.**

Create the 3 new tables + indexes from the design doc:
1. `shared_containers` with all columns, constraints, indexes
2. `space_booking_requests` with FK, dedup unique index
3. `sync_log`

**Verify:** Check each table exists with correct columns in Supabase dashboard.

---

### Task 24: Google Cloud Service Account Setup

**Manual step:**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create Service Account → name: "meridian-sheets-sync"
3. Generate JSON key
4. Enable Google Sheets API in the project
5. Share the spreadsheet with the service account email (Viewer)
6. Add env vars to Vercel:
   ```bash
   printf 'sync-bot@project.iam.gserviceaccount.com' | vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production preview development
   printf '-----BEGIN PRIVATE KEY-----\n...' | vercel env add GOOGLE_PRIVATE_KEY production preview development
   printf '1m8eah0H8F66vOdMMKzVGKgNzS2OZTcRqpX2KBeYD9vs' | vercel env add GOOGLE_SPREADSHEET_ID production preview development
   ```

---

### Task 25: Build + Lint + Test Verification

**Step 1: Run linter**

```bash
npm run lint
```

Fix any issues.

**Step 2: Run tests**

```bash
npm test
```

Verify all existing tests still pass + new sync tests pass.

**Step 3: Run build**

```bash
npm run build
```

Verify the build succeeds and `/shared-shipping` is generated.

**Step 4: Local dev verification**

```bash
npm run dev
```

Visit `http://localhost:3000/shared-shipping` and verify:
- Page loads without errors
- If no Supabase data: empty state renders correctly
- If data exists: cards render with correct states
- Filter/sort work
- Booking form opens (Dialog on desktop, Sheet on mobile)
- Form validation works
- Console has no errors

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore(shared-shipping): fix lint issues and verify build"
```

---

## Summary: Task Dependency Graph

```
Task 1 (Types) ─────┐
Task 2 (Schema) ─────┤
Task 3 (Supabase) ───┼── Task 5 (Sync Pipeline) ── Task 6 (Tests) ── Task 7 (Cron Route)
Task 4 (GSheets) ────┘
                      │
Task 8 (Progress) ────┤
Task 9 (Display) ─────┼── Task 10 (Card) ── Task 11 (Skeleton)
                      │
                      ├── Task 12 (Stale Banner)
                      ├── Task 13 (Filter)
                      ├── Task 14 (Dialog) ── Task 17 (Server Action)
                      ├── Task 15 (Grid) ──── Task 20 (Page)
                      ├── Task 16 (Static) ── Task 20 (Page)
                      ├── Task 18 (FAQ) ───── Task 20 (Page)
                      ├── Task 19 (i18n) ──── Task 20 (Page)
                      ├── Task 21 (Nav/Sitemap)
                      ├── Task 22 (Analytics)
                      │
                      └── Task 23-25 (Manual setup + verification)
```

**Parallelizable groups:**
- Tasks 1-4 can be done in parallel (no dependencies)
- Tasks 8-9 + 12-13 + 16 + 18 can be done in parallel
- Tasks 10, 11, 14 depend on 8-9
- Task 15 depends on 10, 12, 13
- Task 17 depends on 3 (Supabase helpers)
- Task 20 depends on 15, 16, 17, 18, 19

**Estimated total: ~25 tasks, ~100 steps**
