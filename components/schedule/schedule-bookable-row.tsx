"use client";

import { useState, useRef, useEffect, memo } from "react";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  X,
} from "lucide-react";
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
  computeDepartureCountdown,
  computeCapacityFill,
  cleanOriginText,
  formatDestination,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import { trackScheduleEvent } from "@/lib/tracking";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import { ScheduleBookingForm } from "./schedule-booking-form";

interface ScheduleBookableRowProps {
  container: ContainerWithPendingCount;
}

/** Format an ISO date string as "Mar 29" */
function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const ScheduleBookableRow = memo(function ScheduleBookableRow({
  container,
}: ScheduleBookableRowProps) {
  const t = useTranslations("ScheduleList");
  const tb = useTranslations("ScheduleBooking");
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(container.pending_count);
  const formRef = useRef<HTMLDivElement>(null);

  const countdown = computeDepartureCountdown(container.departure_date);
  const transitDayCount = transitDays(container.departure_date, container.eta_date);
  const { text: destText, isPending: destPending } = formatDestination(container.destination);
  const flag = countryFlag(container.destination_country);
  const origin = cleanOriginText(container.origin);
  const availableCbm = container.available_cbm ?? 0;
  const totalCbm = container.total_capacity_cbm > 0 ? container.total_capacity_cbm : 76;
  const { fillPercent, label: capacityLabel } = computeCapacityFill(availableCbm, totalCbm);
  const barColor = fillPercent >= 80 ? "bg-amber-500" : "bg-primary";

  // Scroll form into view when expanded
  useEffect(() => {
    if (isOpen && formRef.current) {
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "nearest",
        });
      }, 250);
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
          "group/card transition-all duration-300",
          isOpen
            ? "ring-2 ring-primary/20 shadow-lg border-primary/30"
            : "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40",
        )}
      >
        <CardContent className="p-0">
          {/* ─── Main content ─── */}
          <div className="p-4 sm:p-5">
            {/* Row 1: Route hero + Book CTA */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {/* Destination as hero */}
                <h4 className="text-base sm:text-lg font-bold leading-tight truncate">
                  <span className="mr-2 text-lg" aria-hidden="true">
                    {destPending ? "" : flag}
                  </span>
                  {destPending ? (
                    <span className="text-muted-foreground italic font-normal">{destText}</span>
                  ) : (
                    destText
                  )}
                </h4>
                {/* Origin + type */}
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  from {origin}
                  <span className="mx-1.5 text-border">·</span>
                  <span className="font-mono text-xs">{container.container_type}</span>
                  <span className="mx-1.5 text-border">·</span>
                  <span className="font-mono text-xs">{container.project_number}</span>
                </p>
              </div>

              <Button
                size="sm"
                variant={isOpen ? "secondary" : "default"}
                onClick={handleToggle}
                className={cn(
                  "shrink-0 transition-all duration-200",
                  !isOpen && "group-hover/card:shadow-md",
                )}
              >
                {isOpen ? (
                  <>
                    <X className="mr-1 h-3 w-3" />
                    {tb("collapse")}
                  </>
                ) : (
                  <>
                    {tb("bookSpace")}
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/card:translate-x-0.5" />
                  </>
                )}
              </Button>
            </div>

            {/* Row 2: Dates + Transit + Demand — info bar */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* Departure countdown */}
              <div className="flex items-center gap-1.5">
                <Calendar className={cn(
                  "h-3.5 w-3.5",
                  countdown.urgency === "urgent" || countdown.urgency === "today"
                    ? "text-amber-500"
                    : "text-muted-foreground",
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  countdown.urgency === "urgent" || countdown.urgency === "today"
                    ? "text-amber-700"
                    : "text-foreground",
                )}>
                  {countdown.urgency === "today"
                    ? "Leaves today"
                    : countdown.urgency === "past"
                      ? `Departed ${shortDate(container.departure_date)}`
                      : countdown.daysUntil === 1
                        ? "Leaves tomorrow"
                        : countdown.daysUntil <= 7
                          ? `Leaves in ${countdown.daysUntil} days`
                          : shortDate(container.departure_date)}
                </span>
              </div>

              {/* ETA */}
              {container.eta_date && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  ETA {shortDate(container.eta_date)}
                  {transitDayCount !== null && ` · ~${transitDayCount}d`}
                </span>
              )}

              {/* Demand signal */}
              {pendingCount > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[11px] ml-auto",
                    pendingCount >= 3
                      ? "text-amber-700 bg-amber-50 border-amber-200"
                      : "text-blue-700 bg-blue-50 border-blue-200",
                  )}
                >
                  <Sparkles className="mr-0.5 h-3 w-3" />
                  {tb("pendingRequests", { count: pendingCount })}
                </Badge>
              )}
            </div>

            {/* Row 3: Capacity bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                    barColor,
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <div className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                <span className={cn(
                  "font-semibold",
                  fillPercent >= 80 ? "text-amber-600" : "text-emerald-600",
                )}>
                  {availableCbm} CBM
                </span>
                <span>{t("available")}</span>
                <span className="text-border">·</span>
                <span>{capacityLabel}</span>
              </div>
            </div>
          </div>

          {/* ─── Booking form (collapsible) ─── */}
          <CollapsibleContent>
            <div ref={formRef}>
              <Separator />
              <div className="p-4 sm:p-5 bg-muted/20">
                <ScheduleBookingForm
                  container={container}
                  onSuccess={() => setPendingCount((c) => c + 1)}
                  onCancel={() => setIsOpen(false)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
});
