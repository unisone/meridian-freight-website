-- Shared Container Booking Portal — Tables, Indexes, RLS, Test Data

-- ============================================================
-- 1. shared_containers
-- ============================================================
CREATE TABLE IF NOT EXISTS shared_containers (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_number      TEXT UNIQUE NOT NULL,
  origin              TEXT NOT NULL DEFAULT 'Albion, IA',
  destination         TEXT NOT NULL,
  destination_country TEXT,
  departure_date      DATE NOT NULL,
  eta_date            DATE,
  container_type      TEXT NOT NULL DEFAULT '40HC',
  total_capacity_cbm  NUMERIC NOT NULL DEFAULT 76,
  available_cbm       NUMERIC,
  status              TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'full', 'departed', 'unlisted', 'cancelled')),
  notes               TEXT,
  source              TEXT NOT NULL DEFAULT 'google_sheets',
  sheet_row_number    INTEGER,
  raw_space_value     TEXT,
  synced_at           TIMESTAMPTZ DEFAULT NOW(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_containers_active
  ON shared_containers (status, departure_date)
  WHERE status IN ('available', 'full');

CREATE INDEX IF NOT EXISTS idx_containers_destination
  ON shared_containers (destination_country);

-- ============================================================
-- 2. space_booking_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS space_booking_requests (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  container_id        UUID REFERENCES shared_containers(id) ON DELETE SET NULL,
  project_number      TEXT NOT NULL,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  cargo_description   TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'cancelled')),
  source_page         TEXT,
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  created_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Dedup: same person can only request same container once per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_dedup
  ON space_booking_requests (email, container_id, created_date);

CREATE INDEX IF NOT EXISTS idx_booking_pending
  ON space_booking_requests (container_id, status)
  WHERE status IN ('new', 'contacted', 'quoted');

-- ============================================================
-- 3. sync_log
-- ============================================================
CREATE TABLE IF NOT EXISTS sync_log (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source              TEXT NOT NULL DEFAULT 'google_sheets',
  status              TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  rows_fetched        INTEGER DEFAULT 0,
  rows_upserted       INTEGER DEFAULT 0,
  rows_skipped        INTEGER DEFAULT 0,
  rows_errored        INTEGER DEFAULT 0,
  error_details       JSONB,
  duration_ms         INTEGER,
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  completed_at        TIMESTAMPTZ
);

-- ============================================================
-- 4. RLS Policies
-- ============================================================
ALTER TABLE shared_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read available containers"
  ON shared_containers FOR SELECT
  USING (status IN ('available', 'full'));

-- ============================================================
-- 5. Test data (for dev verification)
-- ============================================================
INSERT INTO shared_containers (project_number, origin, destination, destination_country, departure_date, eta_date, container_type, total_capacity_cbm, available_cbm, status)
VALUES
  ('MF-2026-TEST-001', 'Albion, IA', 'Almaty, Kazakhstan', 'KZ', '2026-05-01', '2026-06-05', '40HC', 76, 29, 'available'),
  ('MF-2026-TEST-002', 'Albion, IA', 'Santos, Brazil', 'BR', '2026-05-10', '2026-06-15', '40HC', 76, 53, 'available'),
  ('MF-2026-TEST-003', 'Albion, IA', 'Montevideo, Uruguay', 'UY', '2026-04-28', '2026-05-30', 'Flatrack', 28, 8, 'available'),
  ('MF-2026-TEST-004', 'Albion, IA', 'Bogota, Colombia', 'CO', '2026-05-15', '2026-06-20', '40HC', 76, 0, 'full');
