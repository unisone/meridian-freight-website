"use client";

import { CheckCircle2 } from "lucide-react";
import {
  type ScheduleStatus,
  computeTransitProgress,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";

interface TransitProgressProps {
  status: ScheduleStatus;
  departureDate: string;
  etaDate: string | null;
}

export function TransitProgress({
  status,
  departureDate,
  etaDate,
}: TransitProgressProps) {
  const progress = computeTransitProgress(departureDate, etaDate);
  const isDashed =
    status === "scheduled" ||
    status === "departing-soon" ||
    status === "fully-booked";

  return (
    <div
      className="flex flex-1 items-center relative h-4 min-w-[40px]"
      aria-hidden="true"
    >
      {/* Track */}
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 h-px",
          isDashed
            ? "border-t border-dashed border-border"
            : status === "arrived"
              ? "bg-emerald-300"
              : "bg-indigo-200",
        )}
      />

      {/* Fill (in-transit and arrived) */}
      {(status === "in-transit" || status === "arrived") && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 left-0 h-0.5 rounded-full transition-all duration-700",
            status === "arrived" ? "bg-emerald-500" : "bg-indigo-500",
          )}
          style={{
            width:
              status === "arrived"
                ? "100%"
                : `${progress?.progressPercent ?? 50}%`,
          }}
        />
      )}

      {/* Ship indicator (in-transit only) */}
      {status === "in-transit" && progress && (
        <span
          className="absolute top-1/2 text-xs animate-ship-bob"
          style={{
            left: `${progress.progressPercent}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          🚢
        </span>
      )}

      {/* Check indicator (arrived) */}
      {status === "arrived" && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </span>
      )}

      {/* Pulse dot (departing-soon) */}
      {status === "departing-soon" && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </div>
  );
}
