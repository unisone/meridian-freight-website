"use client";

import { AlertTriangle, Clock, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CONTACT } from "@/lib/constants";

interface StaleDataBannerProps {
  lastSyncTime: string | null;
  hasContainers?: boolean;
}

type FreshnessLevel = "fresh" | "aging" | "stale" | "critical";

function getFreshnessLevel(lastSyncTime: string | null, hasContainers: boolean): {
  level: FreshnessLevel;
  minutesAgo: number;
} {
  // No sync history but containers exist → data was seeded/imported, treat as fresh
  if (!lastSyncTime) return { level: hasContainers ? "fresh" : "critical", minutesAgo: Infinity };

  const syncDate = new Date(lastSyncTime);
  if (isNaN(syncDate.getTime())) return { level: "critical", minutesAgo: Infinity };

  const minutesAgo = Math.floor((Date.now() - syncDate.getTime()) / (1000 * 60));

  if (minutesAgo < 30) return { level: "fresh", minutesAgo };
  if (minutesAgo < 120) return { level: "aging", minutesAgo };
  if (minutesAgo < 1440) return { level: "stale", minutesAgo };
  return { level: "critical", minutesAgo };
}

function formatTimeAgo(minutes: number, t: ReturnType<typeof useTranslations>): string {
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("daysAgo", { count: days });
}

export function StaleDataBanner({ lastSyncTime, hasContainers = false }: StaleDataBannerProps) {
  const t = useTranslations("StaleDataBanner");
  const { level, minutesAgo } = getFreshnessLevel(lastSyncTime, hasContainers);

  if (level === "fresh") {
    if (minutesAgo === Infinity) return null; // no sync history, seeded data
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
        <Clock className="h-3 w-3" />
        <span>{t("updated", { timeAgo: formatTimeAgo(minutesAgo, t) })}</span>
      </div>
    );
  }

  if (level === "aging") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{t("updated", { timeAgo: formatTimeAgo(minutesAgo, t) })}</span>
      </div>
    );
  }

  if (level === "stale") {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          {t.rich("staleWarning", {
            timeAgo: formatTimeAgo(minutesAgo, t),
            contact: (chunks) => (
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                {chunks}
              </a>
            ),
          })}
        </AlertDescription>
      </Alert>
    );
  }

  // critical
  return (
    <Alert className="border-red-200 bg-red-50 text-red-800">
      <MessageCircle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        {t.rich("criticalWarning", {
          phoneNumber: CONTACT.phone,
          whatsapp: (chunks) => (
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              {chunks}
            </a>
          ),
          phone: (chunks) => (
            <a href={CONTACT.phoneHref} className="font-medium underline underline-offset-2">
              {chunks}
            </a>
          ),
        })}
      </AlertDescription>
    </Alert>
  );
}
