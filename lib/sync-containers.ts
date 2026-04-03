/**
 * Google Sheets → Supabase sync pipeline for shared containers.
 * Handles column detection, multi-format parsing, safety gates.
 *
 * Only syncs rows where "Available space %" > 0 AND "Final Destination" is filled.
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

/** Map of DB field name → possible header texts (case-insensitive substring match) */
const COLUMN_HEADERS: Record<string, string[]> = {
  project_number: [
    "reference #", "reference", "номер проекта",
    "project #", "project number", "проект",
  ],
  origin: [
    "packaging facility", "facility", "packaging",
    "откуда грузится", "origin", "from", "откуда", "loading from",
  ],
  destination: [
    "final destination", "куда идет", "destination", "dest",
  ],
  departure_date: [
    "vessel etd", "дата выхода", "departure", "departure date", "дата отправки", "etd",
  ],
  loading_date: [
    "loading date", "дата загрузки",
  ],
  eta_date: [
    "eta", "arrival", "estimated arrival", "дата прибытия", "eta date",
  ],
  space_available: [
    "available space", "space available", "space %",
    "space", "свободно", "available cbm", "cbm", "свободное место",
  ],
  container_type: [
    "container type", "тип контейнера",
  ],
  commodities: [
    "commodities", "commodity", "cargo", "груз",
  ],
  notes: ["notes", "примечания", "comments", "заметки"],
  booking_ref: ["booking #", "booking", "бронирование", "q#"],
};

/**
 * Only project_number is truly required. destination and space_available are optional —
 * shipped containers often lack both. departure_date falls back to loading_date.
 */
const REQUIRED_COLUMNS = ["project_number"];

interface ColumnMap {
  [field: string]: number; // field name → column index
}

export function detectColumns(headerRow: string[]): ColumnMap | null {
  const map: ColumnMap = {};
  const normalizedHeaders = headerRow.map((h) => String(h ?? "").toLowerCase().trim());

  for (const [field, aliases] of Object.entries(COLUMN_HEADERS)) {
    // Try longest alias first to avoid "container" matching "Container#" before "container type"
    const sortedAliases = [...aliases].sort((a, b) => b.length - a.length);
    const index = normalizedHeaders.findIndex((h) =>
      sortedAliases.some((alias) => h.includes(alias))
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
        headers: normalizedHeaders.filter(Boolean),
      });
      return null;
    }
  }

  // Soft-require at least one date column (departure_date or loading_date)
  if (map.departure_date === undefined && map.loading_date === undefined) {
    log({
      level: "error",
      msg: "required_column_missing",
      route: "sync-containers",
      column: "departure_date or loading_date",
      available: Object.keys(map),
    });
    return null;
  }

  return map;
}

// ---------- Date Parsing ----------

/**
 * Parse a date from various Google Sheets formats.
 * Handles: serial numbers, ISO, DD.MM.YYYY, MM/DD/YYYY, MM/DD (infer year),
 * and text-prefixed dates like "loading 04/01".
 */
export function parseSheetDate(raw: unknown): string | null {
  if (raw == null || raw === "") return null;

  // 1. Google Sheets serial number (days since Dec 30, 1899)
  if (typeof raw === "number" && raw > 40000 && raw < 60000) {
    const date = new Date((raw - 25569) * 86400000);
    return date.toISOString().split("T")[0];
  }

  let str = String(raw).trim();
  if (!str) return null;

  // Strip text prefixes: "loading 04/01" → "04/01", "cut off 04/01" → "04/01"
  str = str.replace(/^(?:loading|cut\s*off|loaded|in\s*g(?:arage)?|depart(?:ed|ing)?)\s*/i, "").trim();

  // If there are multiple dates ("01/25/2026 01/06/2024"), take the first one
  const multiDateMatch = str.match(/^(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (multiDateMatch) {
    str = multiDateMatch[1];
  }

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
  const slashFullMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashFullMatch) {
    const d = new Date(+slashFullMatch[3], +slashFullMatch[1] - 1, +slashFullMatch[2]);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }

  // 5. MM/DD (no year) — infer current or next year: "04/06" → "2026-04-06"
  // If the resulting date is more than 60 days in the past, assume next year
  const slashShortMatch = str.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (slashShortMatch) {
    const now = new Date();
    const year = now.getFullYear();
    let d = new Date(year, +slashShortMatch[1] - 1, +slashShortMatch[2]);
    if (!isNaN(d.getTime())) {
      const sixtyDaysAgo = new Date(now);
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      if (d < sixtyDaysAgo) {
        d = new Date(year + 1, +slashShortMatch[1] - 1, +slashShortMatch[2]);
      }
      return d.toISOString().split("T")[0];
    }
  }

  // 6. Try generic Date constructor as last resort
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

/**
 * Parse space available value.
 * The "Available space %" column contains percentages of container capacity.
 * A bare number (e.g., 15) from a column with "%" in its header is treated as a percentage.
 */
export function parseSpaceAvailable(
  raw: unknown,
  totalCapacity: number = 76,
  headerHint?: string,
): { cbm: number | null; rawValue: string } {
  const rawStr = String(raw ?? "").trim();
  if (!rawStr) return { cbm: null, rawValue: rawStr };

  // Check if the column header suggests percentages
  const isPercentColumn = headerHint?.toLowerCase().includes("%") ?? false;

  // Direct number — if column header has "%", treat as percentage
  if (typeof raw === "number") {
    if (raw === 0) return { cbm: 0, rawValue: rawStr };
    if (isPercentColumn) {
      const cbm = Math.round((raw / 100) * totalCapacity * 10) / 10;
      return { cbm, rawValue: `${raw}%` };
    }
    return { cbm: raw, rawValue: rawStr };
  }

  // Explicit percentage: "40%" → compute from capacity
  const pctMatch = rawStr.match(/([\d]+(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    const pct = parseFloat(pctMatch[1]);
    const cbm = Math.round((pct / 100) * totalCapacity * 10) / 10;
    return { cbm, rawValue: rawStr };
  }

  // Bare number in a "%" column: "15" → treat as 15%
  if (isPercentColumn) {
    const numMatch = rawStr.match(/^([\d]+(?:\.\d+)?)$/);
    if (numMatch) {
      const pct = parseFloat(numMatch[1]);
      const cbm = Math.round((pct / 100) * totalCapacity * 10) / 10;
      return { cbm, rawValue: `${pct}%` };
    }
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
  ethiopia: "ET", mozambique: "MZ", zambia: "ZM",
  thailand: "TH", vietnam: "VN", indonesia: "ID",
  philippines: "PH", malaysia: "MY", turkey: "TR",
  georgia: "GE", uzbekistan: "UZ", kyrgyzstan: "KG", kyrgystan: "KG",
  tajikistan: "TJ", turkmenistan: "TM", mongolia: "MN",
  paraguay: "PY", bolivia: "BO", guatemala: "GT",
  // New — from actual sheet data
  ukraine: "UA", france: "FR", russia: "RU",
  romania: "RO", poland: "PL", egypt: "EG", lithuania: "LT",
  germany: "DE", belgium: "BE", netherlands: "NL",
  italy: "IT", spain: "ES", "united kingdom": "GB",
  china: "CN", japan: "JP", "south korea": "KR",
  india: "IN", pakistan: "PK", bangladesh: "BD",
  // Russian city/port names that indicate country
  novorossiysk: "RU", новороссийск: "RU",
  kokshetau: "KZ", кокшетау: "KZ",
  kostanai: "KZ", костанай: "KZ",
  almaty: "KZ", алматы: "KZ",
  aktau: "KZ", актау: "KZ",
  bishkek: "KG", бишкек: "KG",
  batumi: "GE", батуми: "GE",
  poti: "GE", поти: "GE",
  odessa: "UA", одесса: "UA",
  gdynia: "PL", alexandria: "EG",
  constanta: "RO",
  istanbul: "TR", стамбул: "TR",
  // Russian
  казахстан: "KZ", бразилия: "BR", уругвай: "UY",
  аргентина: "AR", колумбия: "CO", чили: "CL",
  перу: "PE", эквадор: "EC", мексика: "MX",
  "южная африка": "ZA", австралия: "AU",
  нигерия: "NG", кения: "KE", гана: "GH",
  турция: "TR", грузия: "GE", узбекистан: "UZ",
  кыргызстан: "KG", парагвай: "PY", боливия: "BO",
  украина: "UA", франция: "FR", россия: "RU",
  румыния: "RO", польша: "PL", египет: "EG",
  германия: "DE",
};

/** US state abbreviations that must not be treated as ISO country codes. */
const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
]);

/**
 * Detect US locations that are NOT valid international destinations.
 * These are US port cities or "City, STATE" patterns that the ops team
 * sometimes enters as "Final Destination" when the international leg
 * hasn't been determined yet.
 */
const US_PORT_CITIES = new Set([
  "houston", "savannah", "norfolk", "baltimore", "charleston",
  "tacoma", "los angeles", "long beach", "new york", "newark",
  "jacksonville", "miami", "new orleans", "oakland", "seattle",
  "minneapolis", "st louis", "st. louis", "albion",
]);

export function isUSLocation(destination: string): boolean {
  const trimmed = destination.trim();
  if (!trimmed) return false;

  // Pattern: "City, XX" where XX is a US state code
  const stateMatch = trimmed.match(/,\s*([A-Z]{2})$/);
  if (stateMatch && US_STATE_CODES.has(stateMatch[1])) return true;

  // Known US port city names (without state suffix)
  const lower = trimmed.toLowerCase();
  for (const city of US_PORT_CITIES) {
    if (lower.includes(city)) return true;
  }

  return false;
}

export function extractCountryCode(destination: string): string | null {
  const lower = destination.toLowerCase().trim();
  // Try longest match first (e.g., "south africa" before "south")
  const entries = Object.entries(COUNTRY_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [name, code] of entries) {
    if (lower.includes(name)) return code;
  }
  // Check for trailing ISO code: "Almaty, KZ" — but skip US state abbreviations
  const isoMatch = destination.match(/\b([A-Z]{2})$/);
  if (isoMatch && !US_STATE_CODES.has(isoMatch[1])) return isoMatch[1];
  return null;
}

// ---------- Row Parsing ----------

function getCell(row: string[], colMap: ColumnMap, field: string): string {
  const idx = colMap[field];
  if (idx === undefined) return "";
  return String(row[idx] ?? "").trim();
}

/** Clean project number: take first line (before \n), trim whitespace */
function cleanProjectNumber(raw: string): string {
  return raw.split("\n")[0].trim();
}

/**
 * Try to extract a destination port/city from the Booking# field.
 * Many shipped rows have port names embedded: "Q#W251200541111 - Klaipeda", "NAM8293253 Poti"
 * NOTE: Only international ports — US ports (Houston, Savannah, Norfolk) are origin ports, not destinations.
 */
const PORT_NAMES: Record<string, { destination: string; country: string }> = {
  klaipeda: { destination: "Klaipeda, Lithuania", country: "LT" },
  gdynia: { destination: "Gdynia, Poland", country: "PL" },
  poti: { destination: "Poti, Georgia", country: "GE" },
  batumi: { destination: "Batumi, Georgia", country: "GE" },
  novorossiysk: { destination: "Novorossiysk, Russia", country: "RU" },
  novoross: { destination: "Novorossiysk, Russia", country: "RU" },
  constanta: { destination: "Constanta, Romania", country: "RO" },
  istanbul: { destination: "Istanbul, Turkey", country: "TR" },
  alexandria: { destination: "Alexandria, Egypt", country: "EG" },
  bremerhaven: { destination: "Bremerhaven, Germany", country: "DE" },
  antwerp: { destination: "Antwerp, Belgium", country: "BE" },
  busan: { destination: "Busan, South Korea", country: "KR" },
  qingdao: { destination: "Qingdao, China", country: "CN" },
};

function extractDestinationFromBooking(bookingRef: string): { destination: string; country: string } | null {
  const lower = bookingRef.toLowerCase();
  for (const [port, info] of Object.entries(PORT_NAMES)) {
    if (lower.includes(port)) return info;
  }
  return null;
}

/** Detect container type from the commodities/cargo description */
function detectContainerType(commodities: string): string {
  const lower = commodities.toLowerCase();
  if (lower.includes("flat")) return "Flatrack";
  return "40HC";
}

export function parseRow(
  row: string[],
  rowIndex: number,
  colMap: ColumnMap,
  spaceHeaderHint?: string,
): { parsed: ParsedContainerRow | null; error: SyncError | null } {
  const rawProject = getCell(row, colMap, "project_number");
  if (!rawProject) {
    return { parsed: null, error: null }; // Skip silently (empty row)
  }
  const projectNumber = cleanProjectNumber(rawProject);

  let destination = getCell(row, colMap, "destination");
  let destinationCountry: string | null = destination ? extractCountryCode(destination) : null;

  // Guard: US locations (ports, "City, STATE") are origin points, not international destinations.
  // Ops sometimes enters the US port as "Final Destination" before the international leg is planned.
  if (destination && !destinationCountry && isUSLocation(destination)) {
    destination = "";
    destinationCountry = null;
  }

  // Fallback: try to extract destination from Booking# field (shipped containers often have port names there)
  if (!destination && colMap.booking_ref !== undefined) {
    const bookingRef = getCell(row, colMap, "booking_ref");
    if (bookingRef) {
      const extracted = extractDestinationFromBooking(bookingRef);
      if (extracted) {
        destination = extracted.destination;
        destinationCountry = extracted.country;
      }
    }
  }

  // Parse space if available
  const rawSpace = colMap.space_available !== undefined ? row[colMap.space_available] : undefined;

  // Departure date: prefer Vessel ETD, fall back to Loading date
  let departureDate: string | null = null;
  if (colMap.departure_date !== undefined) {
    departureDate = parseSheetDate(row[colMap.departure_date]);
  }
  if (!departureDate && colMap.loading_date !== undefined) {
    departureDate = parseSheetDate(row[colMap.loading_date]);
  }
  // Departure date is soft-required — skip silently if missing (container not scheduled yet)
  if (!departureDate) {
    return { parsed: null, error: null };
  }

  const origin = getCell(row, colMap, "origin") || "Albion, IA";
  const etaRaw = colMap.eta_date !== undefined ? row[colMap.eta_date] : undefined;
  let etaDate = parseSheetDate(etaRaw);

  // Guard: if ETA equals departure, the ops team likely entered staging/loading dates
  // in both columns. 0-day transit is impossible for international shipping.
  if (etaDate && departureDate && etaDate === departureDate) {
    etaDate = null;
  }

  // Container type: from explicit column or parsed from commodities
  let containerType = "40HC";
  if (colMap.container_type !== undefined) {
    const ctRaw = getCell(row, colMap, "container_type");
    if (ctRaw) containerType = ctRaw.toUpperCase().includes("FLAT") ? "Flatrack" : ctRaw;
  } else if (colMap.commodities !== undefined) {
    containerType = detectContainerType(getCell(row, colMap, "commodities"));
  }

  const totalCapacity = DEFAULT_CAPACITY_CBM[containerType.toLowerCase()] ?? 76;
  const { cbm, rawValue } = parseSpaceAvailable(rawSpace, totalCapacity, spaceHeaderHint);

  const notes = getCell(row, colMap, "notes") || null;

  // Determine status based on data — use US Central time (operations are in Iowa)
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  let status: "available" | "full" | "departed" = "full"; // default: no space info = full
  if (departureDate < today) {
    status = "departed";
  } else if (cbm !== null && cbm > 0) {
    status = "available";
  }

  return {
    parsed: {
      project_number: projectNumber,
      origin,
      destination: destination || "TBD",
      destination_country: destinationCountry,
      departure_date: departureDate,
      eta_date: etaDate,
      container_type: containerType,
      total_capacity_cbm: totalCapacity,
      available_cbm: cbm,
      raw_space_value: rawValue,
      sheet_row_number: rowIndex + 1, // 1-based for Google Sheets
      notes,
      status,
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

  // Get the raw header text for the space column (to detect "%" hint)
  const spaceHeaderHint = colMap.space_available !== undefined
    ? String(headerRow[colMap.space_available] ?? "")
    : undefined;

  // 3. PARSE ROWS (only rows with space > 0 and destination filled)
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

    const { parsed: parsedRow, error } = parseRow(row, i + 1, colMap, spaceHeaderHint);
    if (parsedRow) {
      parsed.push(parsedRow);
    } else if (error) {
      errors.push(error);
    } else {
      skipped++; // No project / no destination / no space — silent skip
    }
  }

  // 4. SAFETY GATE — relaxed: 0 shared containers is valid (none available right now)
  if (parsed.length === 0 && errors.length === 0) {
    // No containers with available space — this is normal, not a failure
    const activeProjectNumbers: string[] = [];
    await markStaleContainers(activeProjectNumbers);

    const result: SyncResult = {
      status: "success",
      rowsFetched: dataRows.length,
      rowsUpserted: 0,
      rowsSkipped: skipped,
      rowsErrored: 0,
      errors: [],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
    return result;
  }

  if (parsed.length === 0 && errors.length > 0) {
    const result: SyncResult = {
      status: "failed",
      rowsFetched: dataRows.length,
      rowsUpserted: 0,
      rowsSkipped: skipped,
      rowsErrored: errors.length,
      errors: [{ row: 0, field: "safety", raw: "", error: "0 parseable rows with available space" }, ...errors],
      durationMs: Date.now() - startMs,
    };
    await insertSyncLog({ ...toLogEntry(result), source: "google_sheets", started_at: startedAt, completed_at: new Date().toISOString() });
    return result;
  }

  // 5. DEDUPLICATE by project_number — last sheet row wins
  const deduped = [...new Map(parsed.map((r) => [r.project_number, r])).values()];
  const duplicateCount = parsed.length - deduped.length;
  if (duplicateCount > 0) {
    log({
      level: "warn",
      msg: "duplicate_project_numbers_in_sheet",
      route: "sync-containers",
      duplicateCount,
      total: parsed.length,
      deduped: deduped.length,
    });
  }

  // 6. UPSERT
  const upsertResult = await upsertContainers(deduped);
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

  // 7. HANDLE STALE + AUTO-EXPIRE
  const activeProjectNumbers = deduped.map((r) => r.project_number);
  await markStaleContainers(activeProjectNumbers);

  // 8. RESULT
  const result: SyncResult = {
    status: errors.length > 0 ? "partial" : "success",
    rowsFetched: dataRows.length,
    rowsUpserted: deduped.length,
    rowsSkipped: skipped + duplicateCount,
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
