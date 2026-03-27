"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerItem } from "@/components/scroll-reveal";
import { countryFlag, transitDays } from "@/lib/container-display";
import {
  deriveScheduleStatus,
  computeTransitProgress,
  SCHEDULE_STATUS_CONFIG,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import { trackScheduleEvent } from "@/lib/tracking";
import type { SharedContainer } from "@/lib/types/shared-shipping";
import { TransitProgress } from "./transit-progress";

interface ScheduleRowProps {
  container: SharedContainer;
  index: number;
}

/** Format an ISO date string as "Apr 15" */
function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ScheduleRow({ container, index }: ScheduleRowProps) {
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
  const hasAvailableSpace =
    container.status === "available" && (container.available_cbm ?? 0) > 0;

  return (
    <StaggerItem index={index}>
      <Card
        className={cn(
          "border-l-4 transition-all duration-200 hover:shadow-sm",
          config.borderColor,
        )}
      >
        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* ─── Top line: Status + Container type ─── */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full shrink-0",
                  config.dotColor,
                )}
              />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t(config.label)}
              </span>
            </div>
            <Badge variant="secondary" className="text-[11px]">
              {container.container_type}
            </Badge>
          </div>

          {/* ─── Route ─── */}
          <p className="text-sm font-semibold leading-snug">
            <span className="mr-1.5" aria-hidden="true">
              {flag}
            </span>
            <span className="hidden sm:inline">
              {container.origin}
              <span className="mx-1.5 text-muted-foreground">&rarr;</span>
            </span>
            <span className="sm:hidden">&rarr; </span>
            {container.destination}
          </p>

          {/* ─── Date + Progress ─── */}
          <div className="flex items-center gap-2 sm:gap-3">
            <DatePill
              date={container.departure_date}
              label={
                status === "in-transit" || status === "arrived"
                  ? t("departed")
                  : t("departs")
              }
            />
            <TransitProgress
              status={status}
              departureDate={container.departure_date}
              etaDate={container.eta_date}
            />
            <DatePill
              date={container.eta_date}
              label={t("eta")}
              fallback="TBD"
            />
          </div>

          {/* Transit day counter (in-transit only) */}
          {transit && status === "in-transit" && (
            <p className="text-center text-[11px] text-muted-foreground">
              {t("dayOfTransit", {
                day: transit.transitDay,
                total: transit.transitTotal,
              })}
            </p>
          )}

          {/* ─── Meta + CTA ─── */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono">{container.project_number}</span>
              {transitDayCount !== null && (
                <span>
                  ~{transitDayCount} {t("days")}
                </span>
              )}
              {hasAvailableSpace && (
                <span className="font-medium text-foreground">
                  {container.available_cbm} CBM {t("available")}
                </span>
              )}
            </div>

            {hasAvailableSpace && (
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  trackScheduleEvent("book_click", {
                    project_number: container.project_number,
                    destination: container.destination_country ?? "",
                  });
                }}
                render={
                  <a
                    href={`/shared-shipping`}
                  />
                }
              >
                {t("bookSpace")}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </StaggerItem>
  );
}

// ─── Date Pill ───────────────────────────────────────────────────────────────

function DatePill({
  date,
  label,
  fallback = "\u2014",
}: {
  date: string | null;
  label: string;
  fallback?: string;
}) {
  const formatted = date ? formatShortDate(date) : fallback;
  return (
    <div className="shrink-0 rounded-md bg-muted/60 px-2.5 py-1.5 text-center min-w-[56px]">
      <p className="text-xs font-semibold leading-tight">{formatted}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
