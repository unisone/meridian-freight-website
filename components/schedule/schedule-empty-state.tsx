"use client";

import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { CONTACT } from "@/lib/constants";

interface ScheduleEmptyStateProps {
  variant: "no-data" | "no-filter-results";
  filterCountry?: string | null;
  onClearFilters?: () => void;
}

export function ScheduleEmptyState({
  variant,
  onClearFilters,
}: ScheduleEmptyStateProps) {
  const t = useTranslations("ScheduleList");

  if (variant === "no-filter-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{t("noResults")}</h3>
        <div className="mt-4 flex gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t("clearFilters")}
            </button>
          )}
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
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
      <div className="mb-4 rounded-full bg-muted p-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{t("noData")}</h3>
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
