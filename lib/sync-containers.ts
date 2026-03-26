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
  destination: ["куда идет", "destination", "dest"],
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

  // 1. FETCH
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
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
    return result;
  }

  const allRows = sheet.values;

  // 2. DETECT COLUMNS
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
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
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
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
    return result;
  }

  // 3. PARSE ROWS
  const dataRows = allRows.slice(1); // Skip header
  const parsed: ParsedContainerRow[] = [];
  const errors: SyncError[] = [];
  let skipped = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    // Skip empty rows
    if (!row || row.every((cell) => !cell && cell !== "0")) {
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

  // 4. SAFETY GATE
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
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
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
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
    return result;
  }

  // 5. UPSERT
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
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
    return result;
  }

  // 6. HANDLE STALE + AUTO-EXPIRE
  const activeProjectNumbers = parsed.map((r) => r.project_number);
  await markStaleContainers(activeProjectNumbers);

  // 7. RESULT
  const result: SyncResult = {
    status: errors.length > 0 ? "partial" : "success",
    rowsFetched: dataRows.length,
    rowsUpserted: parsed.length,
    rowsSkipped: skipped,
    rowsErrored: errors.length,
    errors,
    durationMs: Date.now() - startMs,
  };

  await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });

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
