"use client";

import { memo } from "react";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { countryFlag } from "@/lib/container-display";
import { shortDate } from "@/lib/schedule-display";
import { cn } from "@/lib/utils";
import type { PublicScheduleContainer } from "@/lib/types/shared-shipping";

interface ScheduleDeliveredRowProps {
  container: PublicScheduleContainer;
  variant?: "delivered" | "fully-booked";
}

export const ScheduleDeliveredRow = memo(function ScheduleDeliveredRow({
  container,
  variant = "delivered",
}: ScheduleDeliveredRowProps) {
  const locale = useLocale();
  const t = useTranslations("ScheduleList");
  const flag = countryFlag(container.destination_country);
  const destText = container.destinationDisplay;
  const destPending = container.isDestinationPending;
  const origin = container.originDisplay;

  const isDelivered = variant === "delivered";

  return (
    <div className={cn(
      "flex items-center gap-3 py-2.5 px-3 sm:px-4 border-b border-border/40 last:border-b-0 transition-colors",
      isDelivered ? "hover:bg-emerald-50/30" : "hover:bg-muted/30",
    )}>
      {/* Status icon */}
      {isDelivered ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <MinusCircle className="h-4 w-4 text-zinc-400 shrink-0" />
      )}

      {/* Route */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight truncate text-muted-foreground">
          {!destPending && (
            <span className="mr-1" aria-hidden="true">{flag}</span>
          )}
          <span className="text-muted-foreground">{origin}</span>
          <span className="mx-1 text-border">&rarr;</span>
          {destPending ? (
            <span className="italic">{t("destinationPending")}</span>
          ) : (
            <span className="text-foreground font-medium">{destText}</span>
          )}
        </p>
      </div>

      {/* Meta */}
      <div className="shrink-0 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="font-mono">{container.project_number}</span>
        <span className="hidden sm:inline">{container.container_type}</span>
      </div>

      {/* Dates */}
      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground tabular-nums">
          {shortDate(container.departure_date, locale)}
          {container.eta_date && (
            <span> &rarr; {shortDate(container.eta_date, locale)}</span>
          )}
        </p>
      </div>
    </div>
  );
});
