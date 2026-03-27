"use client";

import { useState, useRef, useEffect, memo } from "react";
import { CheckCircle2, ChevronDown, Ship, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ScheduleBookingForm } from "./schedule-booking-form";

interface ScheduleBookableRowProps {
  container: ContainerWithPendingCount;
}

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
  const totalCbm = container.total_capacity_cbm > 0 ? container.total_capacity_cbm : 76;
  const fillPercent = totalCbm > 0 ? Math.round((1 - availableCbm / totalCbm) * 100) : 100;
  const barColor = fillPercent >= 80 ? "bg-amber-500" : "bg-primary";

  // Scroll form into view when expanded
  useEffect(() => {
    if (isOpen && formRef.current) {
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }, 300); // wait for collapsible animation
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
      <Card
        className={cn(
          "transition-all duration-200",
          // Distinct bookable styling — stands out from compact rows
          "border-l-[6px] bg-primary/[0.03]",
          isOpen
            ? "border-l-primary ring-1 ring-primary/20 shadow-md"
            : "border-l-primary/60 hover:shadow-sm hover:border-l-primary",
        )}
      >
        <CardContent className="p-4 sm:p-5">
          {/* ─── Top row: Status + Available badge + Type + Book CTA ─── */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full shrink-0",
                  config.dotColor,
                )}
              />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t(config.label)}
              </span>
              {/* Available space badge — key visual differentiator */}
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px] font-semibold">
                <CheckCircle2 className="mr-0.5 h-3 w-3" />
                {availableCbm} CBM {t("available")}
              </Badge>
              {pendingCount >= 3 && (
                <Badge variant="secondary" className="text-[11px] text-amber-700 bg-amber-50 border-amber-200">
                  {tb("pendingRequests", { count: pendingCount })}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-[11px] hidden sm:inline-flex">
                {container.container_type}
              </Badge>
              <Button
                size="sm"
                variant={isOpen ? "secondary" : "default"}
                onClick={handleToggle}
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
          </div>

          {/* ─── Route ─── */}
          <p className="mt-2.5 text-sm font-semibold leading-snug truncate">
            <span className="mr-1.5" aria-hidden="true">{flag}</span>
            <span className="hidden sm:inline">
              {container.origin}
              <span className="mx-1.5 text-muted-foreground">&rarr;</span>
            </span>
            <span className="sm:hidden">&rarr; </span>
            {container.destination}
          </p>

          {/* ─── Dates + Transit + Meta — compact row ─── */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="tabular-nums">
                <span className="font-medium text-foreground">
                  {formatShortDate(container.departure_date)}
                </span>
                {container.eta_date && (
                  <>
                    {" → "}
                    <span className="font-medium text-foreground">
                      {formatShortDate(container.eta_date)}
                    </span>
                  </>
                )}
              </span>
              {transitDayCount !== null && (
                <span>~{transitDayCount} {t("days")}</span>
              )}
              {status === "in-transit" && transit && (
                <span className="hidden sm:inline-flex items-center gap-1 text-indigo-600 font-medium">
                  <Ship className="h-3 w-3" />
                  {t("dayOfTransit", { day: transit.transitDay, total: transit.transitTotal })}
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {container.project_number}
            </span>
          </div>

          {/* ─── Capacity bar — thin ─── */}
          <div className="mt-2.5 space-y-1">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${barColor}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            {pendingCount > 0 && pendingCount < 3 && (
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                {tb("pendingRequests", { count: pendingCount })}
              </p>
            )}
          </div>

          {/* ─── Booking form (collapsible) ─── */}
          <CollapsibleContent>
            <div ref={formRef}>
              <Separator className="my-3" />
              <ScheduleBookingForm
                container={container}
                onSuccess={() => setPendingCount((c) => c + 1)}
                onCancel={() => setIsOpen(false)}
              />
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
});
