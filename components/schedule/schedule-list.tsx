"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { StaleDataBanner } from "@/components/shared-shipping/stale-data-banner";
import type {
  ContainerWithPendingCount,
} from "@/lib/types/shared-shipping";
import {
  type FilterTab,
  classifyContainers,
  computeTabCounts,
  deriveCountryList,
} from "@/lib/schedule-display";
import { trackScheduleEvent } from "@/lib/tracking";

import { ScheduleFilterBar } from "./schedule-filter-bar";
import { ScheduleBookableCard } from "./schedule-bookable-card";
import { ScheduleTransitCard } from "./schedule-transit-card";
import { ScheduleDeliveredRow } from "./schedule-delivered-row";
import { ScheduleSectionHeader } from "./schedule-section-header";
import { ScheduleEmptyState } from "./schedule-empty-state";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScheduleListProps {
  containers: ContainerWithPendingCount[];
  lastSyncTime: string | null;
}

/** Filter containers by tab and country before classifying. */
function filterContainers(
  containers: ContainerWithPendingCount[],
  tab: FilterTab,
  country: string | null,
): ContainerWithPendingCount[] {
  let filtered = containers;
  const todayStr = new Date().toISOString().split("T")[0];

  if (country) {
    filtered = filtered.filter((c) => c.destination_country === country);
  }

  if (tab === "upcoming") {
    filtered = filtered.filter(
      (c) => c.status === "available" || (c.status === "full" && c.departure_date > todayStr),
    );
  } else if (tab === "in-transit") {
    filtered = filtered.filter(
      (c) => c.status === "departed" && (c.eta_date === null || c.eta_date > todayStr),
    );
  } else if (tab === "delivered") {
    filtered = filtered.filter(
      (c) => c.status === "departed" && c.eta_date !== null && c.eta_date <= todayStr,
    );
  }

  return filtered;
}

// ─── Time sub-group helpers ─────────────────────────────────────────────────

interface TimeGroup {
  label: string;
  containers: ContainerWithPendingCount[];
}

function subGroupByTime(
  bookable: ContainerWithPendingCount[],
  t: ReturnType<typeof useTranslations>,
): TimeGroup[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekOut = new Date(today);
  weekOut.setDate(weekOut.getDate() + 7);
  const weekStr = weekOut.toISOString().split("T")[0];

  const monthOut = new Date(today);
  monthOut.setDate(monthOut.getDate() + 30);
  const monthStr = monthOut.toISOString().split("T")[0];

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

  // ─── Derived data (memoized) ───────────────────────────
  const tabCounts = useMemo(
    () => computeTabCounts(containers),
    [containers],
  );

  const countries = useMemo(
    () => deriveCountryList(containers),
    [containers],
  );

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

      {!hasContent ? (
        <ScheduleEmptyState
          variant="no-filter-results"
          filterCountry={activeCountry}
          onClearFilters={clearFilters}
        />
      ) : (
        <div className="space-y-12">
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

              {/* Collapsed by default — show expand button */}
              {!deliveredExpanded ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeliveredExpanded(true)}
                  className="w-full justify-center gap-2"
                >
                  <span>
                    {t("group.arrived")} ({classified.delivered.length})
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-lg border border-border/60 overflow-hidden">
                      {classified.delivered.map((container) => (
                        <ScheduleDeliveredRow
                          key={container.id}
                          container={container}
                        />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeliveredExpanded(false)}
                      className="w-full mt-2 text-muted-foreground"
                    >
                      Collapse
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
