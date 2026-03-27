"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { StaggerItem } from "@/components/scroll-reveal";
import { countryFlag, transitDays } from "@/lib/container-display";
import {
  deriveScheduleStatus,
  computeTransitProgress,
  SCHEDULE_STATUS_CONFIG,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import { trackScheduleEvent } from "@/lib/tracking";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import { TransitProgress } from "./transit-progress";
import { ScheduleBookingForm } from "./schedule-booking-form";

interface ScheduleBookableRowProps {
  container: ContainerWithPendingCount;
  index: number;
}

/** Format an ISO date string as "Apr 15" */
function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ScheduleBookableRow({
  container,
  index,
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
  const availablePercent = 100 - fillPercent;
  const barColor = fillPercent >= 80 ? "bg-amber-500" : "bg-primary";

  // Scroll into view when expanded
  useEffect(() => {
    if (isOpen && formRef.current) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      formRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
      });
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
    <StaggerItem index={index}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card
          className={cn(
            "border-l-4 transition-all duration-200",
            isOpen
              ? "border-primary ring-1 ring-primary/20 shadow-sm"
              : "hover:shadow-sm",
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

            {/* Transit day counter */}
            {transit && status === "in-transit" && (
              <p className="text-center text-[11px] text-muted-foreground">
                {t("dayOfTransit", {
                  day: transit.transitDay,
                  total: transit.transitTotal,
                })}
              </p>
            )}

            {/* ─── Capacity bar ─── */}
            <div className="space-y-1.5">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${barColor}`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {tb("cbmAvailable", { cbm: availableCbm })}
                  </span>{" "}
                  {tb("availablePercent", { percent: availablePercent })}
                </span>
                <span className="text-muted-foreground">
                  {tb("cbmTotal", { cbm: totalCbm })}
                </span>
              </div>
            </div>

            {/* ─── Meta + CTA ─── */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-mono">{container.project_number}</span>
                {transitDayCount !== null && (
                  <span>
                    ~{transitDayCount} {t("days")}
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {tb("pendingRequests", { count: pendingCount })}
                  </span>
                )}
              </div>

              <CollapsibleTrigger asChild>
                <Button
                  size="sm"
                  variant={isOpen ? "secondary" : "default"}
                  className="shrink-0"
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
              </CollapsibleTrigger>
            </div>

            {/* ─── Booking form (collapsible) ─── */}
            <CollapsibleContent>
              <div ref={formRef}>
                <Separator className="my-2" />
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
    </StaggerItem>
  );
}

// ─── Date Pill (same as ScheduleRow) ─────────────────────────────────────────

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
