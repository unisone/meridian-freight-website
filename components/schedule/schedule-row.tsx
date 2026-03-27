"use client";

import { memo } from "react";
import { Ship } from "lucide-react";
import { useTranslations } from "next-intl";

import { countryFlag, transitDays } from "@/lib/container-display";
import {
  deriveScheduleStatus,
  computeTransitProgress,
  cleanOriginText,
  formatDestination,
  SCHEDULE_STATUS_CONFIG,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import type { SharedContainer } from "@/lib/types/shared-shipping";

interface ScheduleRowProps {
  container: SharedContainer;
}

/** Format an ISO date string as "Apr 15" */
export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const ScheduleRow = memo(function ScheduleRow({ container }: ScheduleRowProps) {
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
  const { text: destText, isPending: destPending } = formatDestination(container.destination);
  const origin = cleanOriginText(container.origin);

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-l-3 py-2.5 px-3 sm:px-4 border-b border-border/50 transition-colors hover:bg-muted/30",
        config.borderColor,
        destPending && "opacity-60",
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full shrink-0",
          config.dotColor,
        )}
      />

      {/* Route — takes available space */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight truncate">
          <span className="mr-1" aria-hidden="true">
            {destPending ? "" : flag}
          </span>
          <span className="hidden sm:inline text-muted-foreground">
            {origin} &rarr;{" "}
          </span>
          {destPending ? (
            <span className="text-muted-foreground italic">{destText}</span>
          ) : (
            container.destination
          )}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-mono text-muted-foreground">
            {container.project_number}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {container.container_type}
          </span>
        </div>
      </div>

      {/* Transit progress (in-transit only) — compact inline */}
      {status === "in-transit" && transit && (
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          {/* Mini progress bar */}
          <div className="relative w-16 h-1 rounded-full bg-indigo-100 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${transit.progressPercent}%` }}
            />
          </div>
          <Ship className="h-3 w-3 text-indigo-500" />
          <span className="text-[11px] font-medium text-indigo-600 tabular-nums">
            {t("dayOfTransit", {
              day: transit.transitDay,
              total: transit.transitTotal,
            })}
          </span>
        </div>
      )}

      {/* Dates — right-aligned */}
      <div className="shrink-0 text-right">
        <p className="text-xs font-medium tabular-nums">
          {formatShortDate(container.departure_date)}
          {container.eta_date && (
            <span className="text-muted-foreground">
              {" → "}
              {formatShortDate(container.eta_date)}
            </span>
          )}
        </p>
        {transitDayCount !== null && (
          <p className="text-[11px] text-muted-foreground tabular-nums">
            ~{transitDayCount} {t("days")}
          </p>
        )}
      </div>
    </div>
  );
});
