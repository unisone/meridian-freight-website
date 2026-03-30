"use client";

import { memo, useRef } from "react";
import { Ship } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";

import { countryFlag, transitDays } from "@/lib/container-display";
import {
  computeTransitProgress,
  cleanOriginText,
  formatDestination,
  shortDate,
} from "@/lib/schedule-display";
import type { SharedContainer } from "@/lib/types/shared-shipping";

interface ScheduleTransitCardProps {
  container: SharedContainer;
  index: number;
}

export const ScheduleTransitCard = memo(function ScheduleTransitCard({
  container,
  index,
}: ScheduleTransitCardProps) {
  const t = useTranslations("ScheduleList");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const transit = computeTransitProgress(
    container.departure_date,
    container.eta_date,
  );
  const transitDayCount = transitDays(container.departure_date, container.eta_date);
  const flag = countryFlag(container.destination_country);
  const { text: destText, isPending: destPending } = formatDestination(container.destination);
  const origin = cleanOriginText(container.origin);
  const progressPercent = transit?.progressPercent ?? 50;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      <div className="rounded-lg border border-border/60 border-l-[3px] border-l-indigo-400 bg-white p-4 sm:p-5 transition-colors hover:bg-muted/20">
        {/* Route */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight truncate">
              {!destPending && (
                <span className="mr-1.5" aria-hidden="true">{flag}</span>
              )}
              <span className="text-muted-foreground">{origin}</span>
              <span className="mx-1.5 text-border">&rarr;</span>
              {destPending ? (
                <span className="text-muted-foreground italic font-normal">{destText}</span>
              ) : (
                <span>{destText}</span>
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

          {/* Transit day counter */}
          {transit && (
            <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1">
              <Ship className="h-3 w-3 text-indigo-500" />
              <span className="text-[11px] font-semibold text-indigo-600 tabular-nums">
                {t("dayOfTransit", {
                  day: transit.transitDay,
                  total: transit.transitTotal,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Progress visualization */}
        {transit && (
          <div className="mt-3 relative">
            {/* Track */}
            <div className="relative h-1.5 w-full rounded-full bg-indigo-100 overflow-visible">
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"
                initial={{ width: 0 }}
                animate={isInView ? { width: `${progressPercent}%` } : { width: 0 }}
                transition={{ delay: index * 0.06 + 0.3, duration: 1, ease: "easeOut" }}
              />
              {/* Ship indicator */}
              <motion.span
                className="absolute top-1/2 text-sm"
                style={{ transform: "translate(-50%, -50%)" }}
                initial={{ left: "0%" }}
                animate={isInView ? { left: `${progressPercent}%` } : { left: "0%" }}
                transition={{ delay: index * 0.06 + 0.3, duration: 1.2, ease: "easeOut" }}
                aria-hidden="true"
              >
                🚢
              </motion.span>
            </div>

            {/* Labels below */}
            <div className="flex justify-between mt-2 text-[11px] text-muted-foreground tabular-nums">
              <span>{shortDate(container.departure_date)}</span>
              {container.eta_date && (
                <span>
                  {shortDate(container.eta_date)}
                  {transitDayCount !== null && (
                    <span className="ml-1">· ~{transitDayCount}d</span>
                  )}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fallback for no transit data */}
        {!transit && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="tabular-nums">{shortDate(container.departure_date)}</span>
            {container.eta_date && (
              <>
                <span>&rarr;</span>
                <span className="tabular-nums">{shortDate(container.eta_date)}</span>
                {transitDayCount !== null && (
                  <span>· ~{transitDayCount} {t("days")}</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});
