"use client";

import { useState, useRef, useEffect, memo } from "react";
import { CheckCircle2, ChevronDown, Ship, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { countryFlag, transitDays } from "@/lib/container-display";
import {
  deriveScheduleStatus,
  computeTransitProgress,
  SCHEDULE_STATUS_CONFIG,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import { trackScheduleEvent } from "@/lib/tracking";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import { formatShortDate } from "./schedule-row";
import { TransitProgress } from "./transit-progress";
import { ScheduleBookingForm } from "./schedule-booking-form";

interface ScheduleBookableRowProps {
  container: ContainerWithPendingCount;
}

/**
 * Elevated booking card — warm, inviting, clearly distinct from departure board rows.
 * Inspired by Airbnb listing cards: left border accent, subtle gradient, generous spacing.
 */
export const ScheduleBookableRow = memo(function ScheduleBookableRow({
  container,
}: ScheduleBookableRowProps) {
  const t = useTranslations("ScheduleList");
  const tb = useTranslations("ScheduleBooking");
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(container.pending_count);
  const formRef = useRef<HTMLDivElement>(null);

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
  const availableCbm = container.available_cbm ?? 0;
  const totalCbm =
    container.total_capacity_cbm > 0 ? container.total_capacity_cbm : 76;
  const fillPercent =
    totalCbm > 0 ? Math.round((1 - availableCbm / totalCbm) * 100) : 100;
  const barColor = fillPercent >= 80 ? "bg-amber-500" : "bg-sky-500";

  // Scroll form into view when expanded
  useEffect(() => {
    if (isOpen && formRef.current) {
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  function handleToggle() {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      trackScheduleEvent("book_click", {
        project_number: container.project_number,
        destination: container.destination_country ?? "",
      });
    }
  }

  return (
    <Collapsible open={isOpen}>
      <div
        className={cn(
          "rounded-lg border transition-all duration-200",
          // Left border accent — sky-500
          "border-l-4 border-l-sky-500",
          // Subtle warm gradient background
          "bg-gradient-to-r from-sky-50/60 to-transparent",
          isOpen
            ? "shadow-md ring-1 ring-sky-200/50"
            : "shadow-sm hover:shadow-md",
        )}
      >
        <div className="p-4 sm:p-5">
          {/* ─── Top row: Route + Book CTA ─── */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Route */}
              <p className="text-base font-semibold leading-snug truncate">
                <span className="mr-1.5" aria-hidden="true">
                  {flag}
                </span>
                <span className="hidden sm:inline">
                  {container.origin}
                  <span className="mx-1.5 text-muted-foreground">&rarr;</span>
                </span>
                <span className="sm:hidden text-muted-foreground">
                  &rarr;{" "}
                </span>
                {container.destination}
              </p>

              {/* Dates + transit + meta */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="font-mono tabular-nums">
                  {formatShortDate(container.departure_date)}
                  {container.eta_date && (
                    <>
                      {" \u2192 "}
                      {formatShortDate(container.eta_date)}
                    </>
                  )}
                </span>
                {transitDayCount !== null && (
                  <span className="text-xs">
                    ~{transitDayCount} {t("days")}
                  </span>
                )}
                <span className="text-xs">{container.container_type}</span>
                <span className="text-xs font-mono text-muted-foreground/60">
                  {container.project_number}
                </span>
                {status === "in-transit" && transit && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
                    <Ship className="h-3 w-3" />
                    {t("dayOfTransit", {
                      day: transit.transitDay,
                      total: transit.transitTotal,
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Book Space CTA — always visible top-right */}
            <Button
              size="sm"
              variant={isOpen ? "secondary" : "default"}
              onClick={handleToggle}
              className="shrink-0"
            >
              {isOpen ? (
                <>
                  <X className="mr-1 h-3 w-3" />
                  {tb("collapse")}
                </>
              ) : (
                <>
                  {tb("bookSpace")}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </div>

          {/* ─── Badges + Capacity ─── */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Space Available badge — key visual differentiator */}
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px] font-semibold">
              <CheckCircle2 className="mr-0.5 h-3 w-3" />
              {availableCbm} CBM {t("available")}
            </Badge>

            {/* Status */}
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  config.dotColor,
                )}
              />
              <span className="text-[11px] text-muted-foreground">
                {t(config.label)}
              </span>
            </div>

            {pendingCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                {tb("pendingRequests", { count: pendingCount })}
              </span>
            )}
          </div>

          {/* ─── Capacity bar — thin ─── */}
          <div className="mt-3">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${barColor}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>

          {/* In-transit progress bar (rare for bookable, but possible) */}
          {status === "in-transit" && (
            <TransitProgress
              status={status}
              departureDate={container.departure_date}
              etaDate={container.eta_date}
              showBar
            />
          )}

          {/* ─── Booking form (collapsible) ─── */}
          <CollapsibleContent>
            <div ref={formRef}>
              <Separator className="my-4" />
              <ScheduleBookingForm
                container={container}
                onSuccess={() => setPendingCount((c) => c + 1)}
                onCancel={() => setIsOpen(false)}
              />
            </div>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
});
