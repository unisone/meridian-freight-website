"use client";

import { memo } from "react";
import { Ship } from "lucide-react";
import { useTranslations } from "next-intl";

import { countryFlag, transitDays } from "@/lib/container-display";
import {
  deriveScheduleStatus,
  computeTransitProgress,
  SCHEDULE_STATUS_CONFIG,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import type { SharedContainer } from "@/lib/types/shared-shipping";

interface ScheduleRowProps {
  container: SharedContainer;
}

/** Format an ISO date string as "Jan 30" */
export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Departure board row — a dense, single-line horizontal entry.
 * No card wrapper. Border-bottom divider. Monospace dates and project number.
 *
 * Layout: [status dot] [flag route] [dates] [~N days] [container type] [project #]
 */
export const ScheduleRow = memo(function ScheduleRow({
  container,
}: ScheduleRowProps) {
  const t = useTranslations("ScheduleList");
  const status = deriveScheduleStatus(container);
  const config = SCHEDULE_STATUS_CONFIG[status];
  const transit = computeTransitProgress(
    container.departure_date,
    container.eta_date,
  );
  const transitDayCount = transitDays(
    container.departure_date,
    container.eta_date,
  );
  const flag = countryFlag(container.destination_country);
  const isTbd = !container.destination || container.destination === "TBD";

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 py-2.5 px-3 sm:px-4 border-b border-border/40 last:border-b-0 transition-colors hover:bg-zinc-50/80",
        isTbd && "opacity-50",
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full shrink-0",
          config.dotColor,
        )}
        aria-label={t(config.label)}
      />

      {/* Route — takes available space */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight truncate">
          <span className="mr-1" aria-hidden="true">
            {flag}
          </span>
          <span className="hidden sm:inline text-muted-foreground">
            {container.origin}
            <span className="mx-1">&rarr;</span>
          </span>
          {isTbd ? (
            <span className="text-muted-foreground italic">---</span>
          ) : (
            <span className="font-medium">{container.destination}</span>
          )}
        </p>
      </div>

      {/* In-transit indicator — "Day X of Y" text */}
      {status === "in-transit" && transit && (
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <Ship className="h-3 w-3 text-indigo-500" />
          <span className="text-[11px] font-medium text-indigo-600 font-mono tabular-nums">
            {t("dayOfTransit", {
              day: transit.transitDay,
              total: transit.transitTotal,
            })}
          </span>
        </div>
      )}

      {/* Dates — monospace */}
      <div className="shrink-0 text-right">
        <span className="text-xs font-mono tabular-nums text-foreground">
          {formatShortDate(container.departure_date)}
          {container.eta_date && (
            <span className="text-muted-foreground">
              {" \u2192 "}
              {formatShortDate(container.eta_date)}
            </span>
          )}
        </span>
      </div>

      {/* Transit days */}
      {transitDayCount !== null && (
        <span className="hidden md:inline text-[11px] font-mono tabular-nums text-muted-foreground shrink-0">
          ~{transitDayCount} {t("days")}
        </span>
      )}

      {/* Container type */}
      <span className="hidden sm:inline text-[11px] text-muted-foreground shrink-0">
        {container.container_type}
      </span>

      {/* Project number — monospace */}
      <span className="text-[11px] font-mono text-muted-foreground/70 shrink-0 tabular-nums">
        {container.project_number}
      </span>
    </div>
  );
});
