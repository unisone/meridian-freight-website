"use client";

import { useState, useRef, useEffect, memo } from "react";
import {
  ArrowRight,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  shortDate,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import { trackScheduleEvent } from "@/lib/tracking";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import { ScheduleBookingForm } from "./schedule-booking-form";

interface ScheduleBookableCardProps {
  container: ContainerWithPendingCount;
  index: number;
}

export const ScheduleBookableCard = memo(function ScheduleBookableCard({
  container,
  index,
}: ScheduleBookableCardProps) {
  const locale = useLocale();
  const t = useTranslations("ScheduleList");
  const tb = useTranslations("ScheduleBooking");
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(container.pending_count);
  const formRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });

  const countdown = computeDepartureCountdown(container.departure_date);
  const transitDayCount = transitDays(container.departure_date, container.eta_date);
  const { text: destText, isPending: destPending } = formatDestination(container.destination);
  const flag = countryFlag(container.destination_country);
  const origin = cleanOriginText(container.origin);
  const availableCbm = container.available_cbm ?? 0;
  const totalCbm = container.total_capacity_cbm > 0 ? container.total_capacity_cbm : 76;
  const { fillPercent, label: capacityLabel } = computeCapacityFill(availableCbm, totalCbm);
  const isNearlyFull = fillPercent >= 80;

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

  const departureDisplay = shortDate(container.departure_date, locale);
  const countdownHint = (() => {
    if (countdown.urgency === "today") return t("countdown.leavesToday");
    if (countdown.urgency === "past") return t("countdown.departed", { date: departureDisplay });
    if (countdown.daysUntil === 1) return t("countdown.leavesTomorrow");
    if (countdown.daysUntil <= 7) return t("countdown.leavesInDays", { days: countdown.daysUntil });
    return null;
  })();

  const isUrgent = countdown.urgency === "urgent" || countdown.urgency === "today";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0, 0, 0.15, 1] }}
    >
      <Collapsible open={isOpen}>
        <div
          className={cn(
            "group/card rounded-xl ring-1 transition-all duration-300",
            isOpen
              ? "ring-primary/30 shadow-lg bg-white"
              : "ring-foreground/10 bg-white hover:shadow-lg hover:-translate-y-1 hover:ring-primary/20",
          )}
        >
          {/* ─── Main content ─── */}
          <div className="p-5 sm:p-6">
            {/* Row 1: Flag + Destination + CTA */}
            <div className="flex items-start gap-4">
              {/* Flag circle */}
              {!destPending && (
                <div className="hidden sm:flex items-center justify-center h-12 w-12 rounded-xl bg-primary/5 text-2xl shrink-0 group-hover/card:bg-primary/10 transition-colors">
                  {flag}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="text-base sm:text-lg font-bold leading-tight truncate">
                  <span className="sm:hidden mr-1.5 text-lg" aria-hidden="true">
                    {destPending ? "" : flag}
                  </span>
                  {destPending ? (
                    <span className="text-muted-foreground italic font-normal">{t("destinationPending")}</span>
                  ) : (
                    destText
                  )}
                </h4>
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  {t("fromOrigin", { origin })}
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

            {/* Row 2: Route timeline */}
            <div className="mt-4 rounded-lg bg-muted/40 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                {/* Departure */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2.5 w-2.5 rounded-full shrink-0",
                    isUrgent ? "bg-amber-500" : "bg-primary",
                  )} />
                  <div>
                    <p className={cn(
                      "text-sm font-semibold tabular-nums",
                      isUrgent ? "text-amber-700" : "text-foreground",
                    )}>
                      {departureDisplay}
                    </p>
                    {countdownHint && (
                      <p className={cn(
                        "text-[11px]",
                        isUrgent ? "text-amber-600" : "text-muted-foreground",
                      )}>
                        {countdownHint}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dashed line */}
                <div className="flex-1 mx-3 border-t border-dashed border-border/80" />

                {/* Arrival */}
                {container.eta_date ? (
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground text-right tabular-nums">
                        {shortDate(container.eta_date, locale)}
                      </p>
                      {transitDayCount !== null && (
                        <p className="text-[11px] text-muted-foreground text-right">
                          {t("transitDays", { days: transitDayCount })}
                        </p>
                      )}
                    </div>
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground italic">{t("countdown.etaPending")}</p>
                    <MapPin className="h-3.5 w-3.5 text-border shrink-0" />
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Capacity bar + demand */}
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    isNearlyFull
                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-primary/80 to-primary",
                  )}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${fillPercent}%` } : { width: 0 }}
                  transition={{ delay: index * 0.08 + 0.4, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="shrink-0 flex items-center gap-1.5 text-xs tabular-nums">
                <span className={cn(
                  "font-bold font-mono",
                  isNearlyFull ? "text-amber-600" : "text-emerald-600",
                )}>
                  {availableCbm} CBM
                </span>
                <span className="text-muted-foreground">{t("available")}</span>
                <span className="text-border">·</span>
                <span className="text-muted-foreground">{t("capacityBooked", { percent: capacityLabel })}</span>
              </div>
            </div>

            {/* Demand signal */}
            {pendingCount > 0 && (
              <div className="mt-3">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[11px]",
                    pendingCount >= 3
                      ? "text-amber-700 bg-amber-50 border-amber-200"
                      : "text-blue-700 bg-blue-50 border-blue-200",
                  )}
                >
                  <Sparkles className="mr-0.5 h-3 w-3" />
                  {tb("pendingRequests", { count: pendingCount })}
                </Badge>
              </div>
            )}
          </div>

          {/* ─── Booking form (collapsible) ─── */}
          <CollapsibleContent>
            <div ref={formRef}>
              <Separator />
              <div className="p-5 sm:p-6 bg-muted/30">
                <ScheduleBookingForm
                  container={container}
                  onSuccess={() => setPendingCount((c) => c + 1)}
                  onCancel={() => setIsOpen(false)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.div>
  );
});
