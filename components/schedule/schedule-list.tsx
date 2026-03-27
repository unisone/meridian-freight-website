"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Ship,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { ScrollReveal } from "@/components/scroll-reveal";
import { StaleDataBanner } from "@/components/shared-shipping/stale-data-banner";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
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
import { ScheduleBookableRow } from "./schedule-bookable-row";
import { ScheduleEmptyState } from "./schedule-empty-state";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScheduleListProps {
  containers: ContainerWithPendingCount[];
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

// ─── Groups that are collapsed by default ────────────────────────────────────

const COLLAPSED_BY_DEFAULT: Set<ScheduleGroup> = new Set(["arrived"]);

// ─── Component ───────────────────────────────────────────────────────────────

export function ScheduleList({ containers, lastSyncTime }: ScheduleListProps) {
  const t = useTranslations("ScheduleList");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ─── Filter state from URL ─────────────────────────────
  const activeTab = (searchParams.get("tab") ?? "all") as FilterTab;
  const activeCountry = searchParams.get("country");

  // ─── Collapsed groups state ────────────────────────────
  const [collapsedGroups, setCollapsedGroups] = useState<Set<ScheduleGroup>>(
    () => new Set(COLLAPSED_BY_DEFAULT),
  );

  function toggleGroup(group: ScheduleGroup) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }

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
          const isCollapsed = collapsedGroups.has(group);

          return (
            <ScrollReveal key={group}>
              <section className="space-y-2">
                {/* Group header — clickable to collapse */}
                <button
                  onClick={() => toggleGroup(group)}
                  className={`flex items-center gap-2 border-l-4 pl-3 py-1.5 w-full text-left hover:bg-muted/30 rounded-r-md transition-colors ${config.borderColor}`}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                    {t(config.label)}
                  </h3>
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                    {items.length}
                  </span>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Container rows */}
                {!isCollapsed && (
                  <div className="space-y-2">
                    {items.map((container) => {
                      const isBookable =
                        container.status === "available" &&
                        (container.available_cbm ?? 0) > 0;

                      return isBookable ? (
                        <ScheduleBookableRow
                          key={container.id}
                          container={container as ContainerWithPendingCount}
                        />
                      ) : (
                        <ScheduleRow
                          key={container.id}
                          container={container}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            </ScrollReveal>
          );
        })
      )}
    </div>
  );
}
