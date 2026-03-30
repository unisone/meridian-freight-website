"use client";

import { Package, Ship, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

interface ScheduleEmptyStateProps {
  variant: "no-data" | "no-filter-results";
  filterCountry?: string | null;
  onClearFilters?: () => void;
}

export function ScheduleEmptyState({
  variant,
  filterCountry,
  onClearFilters,
}: ScheduleEmptyStateProps) {
  const t = useTranslations("ScheduleList");

  if (variant === "no-filter-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Ship className="h-10 w-10 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold">
          {filterCountry
            ? t("noResultsCountry", { country: filterCountry })
            : t("noResults")}
        </h3>
        {filterCountry && (
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            {t("noResultsCountryDescription")}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          {onClearFilters && (
            <Button
              variant="default"
              size="sm"
              onClick={onClearFilters}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              {t("clearFilters")}
            </Button>
          )}
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("contactUs")}
          </a>
        </div>
      </div>
    );
  }

  // no-data
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Package className="h-10 w-10 text-muted-foreground/40" />
      <h3 className="mt-4 text-lg font-semibold">{t("noData")}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {t("noDataDescription")}
      </p>
      <div className="mt-6">
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {t("contactUs")}
        </a>
      </div>
    </div>
  );
}
