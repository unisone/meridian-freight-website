"use client";

import { Ship } from "lucide-react";
import {
  type ScheduleStatus,
  computeTransitProgress,
} from "@/lib/schedule-display";
import { cn } from "@/lib/utils";

interface TransitProgressProps {
  status: ScheduleStatus;
  departureDate: string;
  etaDate: string | null;
  /** Render a thin inline bar (for bookable cards). Default: false */
  showBar?: boolean;
}

/**
 * Transit progress display.
 * - In compact mode (default): renders "Day X of Y" text only.
 * - In bar mode (showBar=true): renders a thin progress bar with ship icon.
 */
export function TransitProgress({
  status,
  departureDate,
  etaDate,
  showBar = false,
}: TransitProgressProps) {
  const progress = computeTransitProgress(departureDate, etaDate);

  if (status !== "in-transit" || !progress) return null;

  if (!showBar) {
    return null; // Text rendering is handled inline by ScheduleRow
  }

  // Thin bar for bookable cards
  return (
    <div className="mt-2">
      <div
        className="relative h-1 w-full overflow-hidden rounded-full bg-indigo-100"
        aria-hidden="true"
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all duration-700",
          )}
          style={{ width: `${progress.progressPercent}%` }}
        />
        <span
          className="absolute top-1/2"
          style={{
            left: `${progress.progressPercent}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Ship className="h-2.5 w-2.5 text-indigo-600" />
        </span>
      </div>
    </div>
  );
}
