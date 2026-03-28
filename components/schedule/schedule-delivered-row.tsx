"use client";

import { memo } from "react";
import { CheckCircle2 } from "lucide-react";

import { countryFlag } from "@/lib/container-display";
import { cleanOriginText, formatDestination } from "@/lib/schedule-display";
import type { SharedContainer } from "@/lib/types/shared-shipping";

interface ScheduleDeliveredRowProps {
  container: SharedContainer;
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const ScheduleDeliveredRow = memo(function ScheduleDeliveredRow({
  container,
}: ScheduleDeliveredRowProps) {
  const flag = countryFlag(container.destination_country);
  const { text: destText, isPending: destPending } = formatDestination(container.destination);
  const origin = cleanOriginText(container.origin);

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 sm:px-4 border-b border-border/40 last:border-b-0 transition-colors hover:bg-emerald-50/30">
      {/* Check icon */}
      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />

      {/* Route */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight truncate text-muted-foreground">
          {!destPending && (
            <span className="mr-1" aria-hidden="true">{flag}</span>
          )}
          <span className="hidden sm:inline">{origin} &rarr; </span>
          {destPending ? (
            <span className="italic">{destText}</span>
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
          {shortDate(container.departure_date)}
          {container.eta_date && (
            <span> &rarr; {shortDate(container.eta_date)}</span>
          )}
        </p>
      </div>
    </div>
  );
});
