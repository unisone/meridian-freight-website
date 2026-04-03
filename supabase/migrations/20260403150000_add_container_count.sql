-- Add container_count to track multi-container shipments per project
-- The sync pipeline now aggregates multiple sheet rows (one per physical container)
-- into a single DB row per Reference #, with this column tracking the count.

ALTER TABLE shared_containers
  ADD COLUMN IF NOT EXISTS container_count INTEGER NOT NULL DEFAULT 1;

COMMENT ON COLUMN shared_containers.container_count IS
  'Number of physical containers in this shipment. Populated by Google Sheets sync aggregation.';
