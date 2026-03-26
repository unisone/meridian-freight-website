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
