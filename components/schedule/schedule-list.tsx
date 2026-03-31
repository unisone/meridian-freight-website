"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

import { StaleDataBanner } from "@/components/shared-shipping/stale-data-banner";
import type {
  ContainerWithPendingCount,
} from "@/lib/types/shared-shipping";
import {
  type FilterTab,
  classifyContainers,
  computeTabCounts,
  deriveCountryList,
  filterContainers,
} from "@/lib/schedule-display";
import { trackScheduleEvent } from "@/lib/tracking";

import { ScheduleFilterBar } from "@/components/schedule/schedule-filter-bar";
import { ScheduleBookableCard } from "@/components/schedule/schedule-bookable-card";
import { ScheduleTransitCard } from "@/components/schedule/schedule-transit-card";
import { ScheduleDeliveredRow } from "@/components/schedule/schedule-delivered-row";
import { ScheduleSectionHeader } from "@/components/schedule/schedule-section-header";
import { ScheduleEmptyState } from "@/components/schedule/schedule-empty-state";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScheduleListProps {
  containers: ContainerWithPendingCount[];
  lastSyncTime: string | null;
}

// ─── Time sub-group helpers ─────────────────────────────────────────────────

interface TimeGroup {
  label: string;
  containers: ContainerWithPendingCount[];
}

function localDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function subGroupByTime(
  bookable: ContainerWithPendingCount[],
  t: ReturnType<typeof useTranslations>,
): TimeGroup[] {
  const weekStr = localDatePlusDays(7);
  const monthStr = localDatePlusDays(30);

  const thisWeek: ContainerWithPendingCount[] = [];
  const thisMonth: ContainerWithPendingCount[] = [];
  const later: ContainerWithPendingCount[] = [];

  for (const c of bookable) {
    if (c.departure_date <= weekStr) {
      thisWeek.push(c);
    } else if (c.departure_date <= monthStr) {
      thisMonth.push(c);
    } else {
      later.push(c);
    }
  }

  const groups: TimeGroup[] = [];
  if (thisWeek.length > 0) groups.push({ label: t("group.departingThisWeek"), containers: thisWeek });
  if (thisMonth.length > 0) groups.push({ label: t("group.departingThisMonth"), containers: thisMonth });
  if (later.length > 0) groups.push({ label: t("group.later"), containers: later });

  return groups;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ScheduleList({ containers, lastSyncTime }: ScheduleListProps) {
  const t = useTranslations("ScheduleList");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ─── Filter state from URL ─────────────────────────────
  const activeTab = (searchParams.get("tab") ?? "all") as FilterTab;
  const activeCountry = searchParams.get("country");

  // ─── Delivered expand state ────────────────────────────
  const [deliveredExpanded, setDeliveredExpanded] = useState(false);

  // ─── Single-open booking card (U2) ────────────────────
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // ─── Derived data (memoized) ───────────────────────────
  // P3: tabCounts and countries depend only on containers (stable from server)
  const tabCounts = useMemo(
    () => computeTabCounts(containers),
    [containers],
  );

  const countries = useMemo(
    () => deriveCountryList(containers),
    [containers],
  );

  // These depend on filter state
  const filtered = useMemo(
    () => filterContainers(containers, activeTab, activeCountry),
    [containers, activeTab, activeCountry],
  );

  const classified = useMemo(
    () => classifyContainers(filtered),
    [filtered],
  );

  const timeGroups = useMemo(
    () => subGroupByTime(classified.bookable, t),
    [classified.bookable, t],
  );

  const totalUpcoming = classified.bookable.length + classified.nonBookableUpcoming.length;

  // AC1: Announce filter result count to screen readers
  const resultCount = classified.bookable.length + classified.nonBookableUpcoming.length + classified.inTransit.length + classified.delivered.length;

  // ─── Track page view on mount ──────────────────────────
  useEffect(() => {
    trackScheduleEvent("view", {
      total: String(containers.length),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Track filter changes ──────────────────────────────
  useEffect(() => {
    if (activeTab !== "all" || activeCountry) {
      trackScheduleEvent("filter", {
        tab: activeTab,
        country: activeCountry ?? "all",
      });
    }
  }, [activeTab, activeCountry]);

  // ─── URL state updaters ────────────────────────────────
  function setTab(tab: FilterTab) {
    const params = new URLSearchParams(searchParams);
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function setCountry(country: string | null) {
    const params = new URLSearchParams(searchParams);
    if (!country) {
      params.delete("country");
    } else {
      params.set("country", country);
    }
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  // ─── Check if anything to show ─────────────────────────
  const hasContent =
    classified.bookable.length > 0 ||
    classified.nonBookableUpcoming.length > 0 ||
    classified.inTransit.length > 0 ||
    classified.delivered.length > 0;

  // ─── Running card index for stagger across all bookable cards
  let cardIndex = 0;

  // ─── Render ────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <StaleDataBanner
        lastSyncTime={lastSyncTime}
        hasContainers={containers.length > 0}
      />

      <ScheduleFilterBar
        activeTab={activeTab}
        onTabChange={setTab}
        tabCounts={tabCounts}
        activeCountry={activeCountry}
        onCountryChange={setCountry}
        countries={countries}
      />

      {/* AC1: Screen reader announcement for filter results */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {hasContent
          ? `${resultCount} containers shown`
          : "No containers match your filters"}
      </div>

      {!hasContent ? (
        <ScheduleEmptyState
          variant="no-filter-results"
          filterCountry={activeCountry ? countries.find((c) => c.code === activeCountry)?.name ?? activeCountry : null}
          onClearFilters={clearFilters}
        />
      ) : (
        <div className="mt-2 space-y-12">
          {/* ═══ SECTION 1: AVAILABLE SPACE ═══ */}
          {totalUpcoming > 0 && (
            <section>
              <ScheduleSectionHeader
                eyebrow={t("status.departingSoon")}
                heading={t("tabUpcoming")}
                count={totalUpcoming}
                accentColor="primary"
              />

              {/* Time sub-groups with bookable cards */}
              {timeGroups.map((group) => (
                <div key={group.label} className="mb-6 last:mb-0">
                  {/* Sub-group label — thin divider */}
                  {timeGroups.length > 1 && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </span>
                      <div className="flex-1 border-t border-border/50" />
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        {group.containers.length}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {group.containers.map((container) => {
                      const idx = cardIndex++;
                      return (
                        <ScheduleBookableCard
                          key={container.id}
                          container={container}
                          index={idx}
                          isExpanded={expandedCardId === container.id}
                          onToggle={() => setExpandedCardId((prev) => prev === container.id ? null : container.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Non-bookable upcoming (full containers, no space) */}
              {classified.nonBookableUpcoming.length > 0 && (
                <div className="mt-4">
                  {classified.bookable.length > 0 && (
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("status.fullyBooked")}
                      </span>
                      <div className="flex-1 border-t border-border/50" />
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        {classified.nonBookableUpcoming.length}
                      </span>
                    </div>
                  )}
                  <div className="rounded-lg border border-border/60 overflow-hidden">
                    {classified.nonBookableUpcoming.map((container) => (
                      <ScheduleDeliveredRow
                        key={container.id}
                        container={container}
                        variant="fully-booked"
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ═══ SECTION 2: ON THE WATER ═══ */}
          {classified.inTransit.length > 0 && (
            <section>
              <ScheduleSectionHeader
                eyebrow={t("status.inTransit")}
                heading={t("group.inTransit")}
                count={classified.inTransit.length}
                accentColor="indigo"
              />

              <div className="space-y-3">
                {classified.inTransit.map((container, i) => (
                  <ScheduleTransitCard
                    key={container.id}
                    container={container}
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ═══ SECTION 3: DELIVERED ═══ */}
          {classified.delivered.length > 0 && (
            <section>
              <ScheduleSectionHeader
                eyebrow={t("status.arrived")}
                heading={t("group.arrived")}
                count={classified.delivered.length}
                accentColor="emerald"
              />

              {/* Collapsed by default — expand/collapse with exit animation */}
              {!deliveredExpanded && (
                <button
                  type="button"
                  onClick={() => setDeliveredExpanded(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                  aria-expanded="false"
                >
                  <span>
                    {t("group.arrived")} ({classified.delivered.length})
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}
              <AnimatePresence>
                {deliveredExpanded && (
                  <motion.div
                    key="delivered-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                    aria-hidden={!deliveredExpanded}
                  >
                    <div className="rounded-lg border border-border/60 overflow-hidden">
                      {classified.delivered.map((container) => (
                        <ScheduleDeliveredRow
                          key={container.id}
                          container={container}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeliveredExpanded(false)}
                      className="w-full mt-2 flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      aria-expanded="true"
                    >
                      {t("collapseDelivered")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
