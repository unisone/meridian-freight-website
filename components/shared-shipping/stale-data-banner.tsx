"use client";

import { AlertTriangle, Clock, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTACT } from "@/lib/constants";

interface StaleDataBannerProps {
  lastSyncTime: string | null;
}

type FreshnessLevel = "fresh" | "aging" | "stale" | "critical";

function getFreshnessLevel(lastSyncTime: string | null): {
  level: FreshnessLevel;
  minutesAgo: number;
} {
  if (!lastSyncTime) return { level: "critical", minutesAgo: Infinity };

  const syncDate = new Date(lastSyncTime);
  if (isNaN(syncDate.getTime())) return { level: "critical", minutesAgo: Infinity };

  const minutesAgo = Math.floor((Date.now() - syncDate.getTime()) / (1000 * 60));

  if (minutesAgo < 30) return { level: "fresh", minutesAgo };
  if (minutesAgo < 120) return { level: "aging", minutesAgo };
  if (minutesAgo < 1440) return { level: "stale", minutesAgo };
  return { level: "critical", minutesAgo };
}

function formatTimeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export function StaleDataBanner({ lastSyncTime }: StaleDataBannerProps) {
  const { level, minutesAgo } = getFreshnessLevel(lastSyncTime);

  if (level === "fresh") return null;

  if (level === "aging") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Updated {formatTimeAgo(minutesAgo)}</span>
      </div>
    );
  }

  if (level === "stale") {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          Availability data may be outdated (last updated {formatTimeAgo(minutesAgo)}).{" "}
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            Contact us
          </a>{" "}
          for the latest info.
        </AlertDescription>
      </Alert>
    );
  }

  // critical
  return (
    <Alert className="border-red-200 bg-red-50 text-red-800">
      <Phone className="h-4 w-4 text-red-600" />
      <AlertDescription>
        Container availability is currently unavailable. Call us at{" "}
        <a href={CONTACT.phoneHref} className="font-medium underline underline-offset-2">
          {CONTACT.phone}
        </a>{" "}
        for the latest schedule.
      </AlertDescription>
    </Alert>
  );
}
