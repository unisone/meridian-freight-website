"use client";

import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryFlag } from "@/lib/container-display";
import type { FilterTab } from "@/lib/schedule-display";

interface ScheduleFilterBarProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  tabCounts: Record<FilterTab, number>;
  activeCountry: string | null;
  onCountryChange: (country: string | null) => void;
  countries: Array<{ code: string; name: string }>;
}

const TAB_KEYS: FilterTab[] = ["all", "upcoming", "in-transit", "delivered"];

const TAB_LABEL_MAP: Record<FilterTab, string> = {
  all: "tabAll",
  upcoming: "tabUpcoming",
  "in-transit": "tabInTransit",
  delivered: "tabDelivered",
};

export function ScheduleFilterBar({
  activeTab,
  onTabChange,
  tabCounts,
  activeCountry,
  onCountryChange,
  countries,
}: ScheduleFilterBarProps) {
  const t = useTranslations("ScheduleList");

  return (
    <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-sm border-b">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => onTabChange(val as FilterTab)}
        >
          <TabsList className="h-auto flex-wrap">
            {TAB_KEYS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs sm:text-sm">
                {t(TAB_LABEL_MAP[tab])}
                <span className="ml-1 text-[10px] text-muted-foreground tabular-nums">
                  ({tabCounts[tab]})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Country filter */}
        <Select
          value={activeCountry ?? ""}
          onValueChange={(val) => onCountryChange(val || null)}
        >
          <SelectTrigger size="sm" className="min-w-[160px]">
            <SelectValue placeholder={t("allCountries")} />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="">
              {t("allCountries")}
            </SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="mr-1.5" aria-hidden="true">
                  {countryFlag(c.code)}
                </span>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
