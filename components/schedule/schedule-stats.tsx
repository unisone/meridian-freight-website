import { ArrowRightLeft, Globe, Package, Ship } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ScheduleStats } from "@/lib/schedule-display";

interface ScheduleStatsProps {
  stats: ScheduleStats;
}

const STAT_ITEMS = [
  { key: "containersThisMonth" as const, icon: Ship, labelKey: "statsContainers" },
  { key: "countriesServed" as const, icon: Globe, labelKey: "statsCountries" },
  { key: "inTransitNow" as const, icon: ArrowRightLeft, labelKey: "statsInTransit" },
  { key: "bookableContainers" as const, icon: Package, labelKey: "statsBookable" },
] as const;

export async function ScheduleStats({ stats }: ScheduleStatsProps) {
  const t = await getTranslations("SchedulePage");

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto">
      {STAT_ITEMS.map((item) => (
        <div key={item.key} className="flex flex-col items-center gap-1.5">
          <item.icon className="h-5 w-5 text-primary/70" />
          <span className="text-3xl font-bold font-mono tabular-nums text-foreground">
            {stats[item.key]}
          </span>
          <span className="text-xs text-muted-foreground text-center leading-tight">
            {t(item.labelKey)}
          </span>
        </div>
      ))}
    </div>
  );
}
