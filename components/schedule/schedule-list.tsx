"use client";

import { useEffect, useMemo } from "react";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Ship,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { StaleDataBanner } from "@/components/shared-shipping/stale-data-banner";
import type { SharedContainer } from "@/lib/types/shared-shipping";
import {
  type FilterTab,
  type ScheduleGroup,
  GROUP_CONFIG,
  computeTabCounts,
  deriveCountryList,
  groupContainers,
} from "@/lib/schedule-display";
import { trackScheduleEvent } from "@/lib/tracking";

import { ScheduleFilterBar } from "./schedule-filter-bar";
import { ScheduleRow } from "./schedule-row";
import { ScheduleEmptyState } from "./schedule-empty-state";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScheduleListProps {
  containers: SharedContainer[];
  lastSyncTime: string | null;
}

// ─── Group icon mapping ──────────────────────────────────────────────────────

const GROUP_ICONS: Record<ScheduleGroup, LucideIcon> = {
  "departing-this-week": Clock,
  "departing-this-month": Calendar,
  "departing-later": CalendarDays,
  "in-transit": Ship,
  arrived: CheckCircle2,
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ScheduleList({ containers, lastSyncTime }: ScheduleListProps) {
  const t = useTranslations("ScheduleList");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ─── Filter state from URL ─────────────────────────────
  const activeTab = (searchParams.get("tab") ?? "all") as FilterTab;
  const activeCountry = searchParams.get("country");

  // ─── Derived data (memoized) ───────────────────────────
  const tabCounts = useMemo(
    () => computeTabCounts(containers),
    [containers],
  );

  const countries = useMemo(
    () => deriveCountryList(containers),
    [containers],
  );

  const groups = useMemo(
    () => groupContainers(containers, activeTab, activeCountry),
    [containers, activeTab, activeCountry],
  );

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

  // ─── Render ────────────────────────────────────────────
  let rowIndex = 0;

  return (
    <div className="space-y-6">
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

      {groups.size === 0 ? (
        <ScheduleEmptyState
          variant="no-filter-results"
          filterCountry={activeCountry}
          onClearFilters={clearFilters}
        />
      ) : (
        Array.from(groups.entries()).map(([group, items]) => {
          const config = GROUP_CONFIG[group];
          const Icon = GROUP_ICONS[group];

          return (
            <section key={group} className="space-y-3">
              {/* Group header */}
              <div
                className={`flex items-center gap-2 border-l-4 pl-3 py-1 ${config.borderColor}`}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t(config.label)}
                </h3>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({items.length})
                </span>
              </div>

              {/* Container rows */}
              <div className="space-y-3">
                {items.map((container) => {
                  const idx = rowIndex++;
                  return (
                    <ScheduleRow
                      key={container.id}
                      container={container}
                      index={idx}
                    />
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
