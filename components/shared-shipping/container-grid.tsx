"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

import { BookingRequestDialog } from "@/components/shared-shipping/booking-request-dialog";
import { ContainerCard } from "@/components/shared-shipping/container-card";
import { DestinationFilter } from "@/components/shared-shipping/destination-filter";
import { EmptyState } from "@/components/shared-shipping/empty-state";
import { StaleDataBanner } from "@/components/shared-shipping/stale-data-banner";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContainerGridProps {
  containers: ContainerWithPendingCount[];
  lastSyncTime: string | null;
}

type SortOption = "soonest" | "most-space";

// ─── Component ────────────────────────────────────────────────────────────────

export function ContainerGrid({ containers, lastSyncTime }: ContainerGridProps) {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("soonest");
  const [selectedContainer, setSelectedContainer] =
    useState<ContainerWithPendingCount | null>(null);

  // Filter by destination country
  const filtered = useMemo(() => {
    const base =
      selectedCountry === "all"
        ? containers
        : containers.filter((c) => c.destination_country === selectedCountry);

    // Sort: soonest departure first, or most available CBM first
    return [...base].sort((a, b) => {
      if (sortBy === "soonest") {
        return (
          new Date(a.departure_date).getTime() -
          new Date(b.departure_date).getTime()
        );
      }
      // most-space: descending by available_cbm
      return (b.available_cbm ?? 0) - (a.available_cbm ?? 0);
    });
  }, [containers, selectedCountry, sortBy]);

  const handleRequestSpace = useCallback(
    (container: ContainerWithPendingCount) => {
      setSelectedContainer(container);
    },
    []
  );

  const handleDialogClose = useCallback(() => {
    setSelectedContainer(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCountry("all");
  }, []);

  // ── No data at all ──────────────────────────────────────────────────────────
  if (containers.length === 0) {
    return (
      <div className="space-y-6">
        <StaleDataBanner lastSyncTime={lastSyncTime} />
        <EmptyState variant="no-data" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StaleDataBanner lastSyncTime={lastSyncTime} />

      <DestinationFilter
        containers={containers}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* ── Grid or empty state ──────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          variant="no-results"
          filterCountry={selectedCountry}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((container) => (
              <motion.div
                key={container.id}
                layoutId={container.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <ContainerCard
                  container={container}
                  index={0}
                  onRequestSpace={handleRequestSpace}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Booking dialog ───────────────────────────────────────────────── */}
      <BookingRequestDialog
        container={selectedContainer}
        onClose={handleDialogClose}
      />
    </div>
  );
}
