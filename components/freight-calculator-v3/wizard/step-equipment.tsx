"use client";

import { ChevronDown, Package } from "lucide-react";

import { CATEGORY_ICONS } from "@/components/freight-calculator/category-icons";
import { getLocalizedText } from "@/lib/calculator-v3/policy";

import type { StepEquipmentProps } from "./types";

export function StepEquipment({
  visibleProfiles,
  profileId,
  showAllProfiles,
  profileCount,
  onSelectProfile,
  onShowAll,
  locale,
  t,
}: StepEquipmentProps) {
  return (
    <section>
      <SectionHeader num={1} title={t.selectEquipmentCategory} />

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {visibleProfiles.map((candidate) => {
          const Icon = CATEGORY_ICONS[candidate.equipmentCategory] ?? Package;
          const isSelected = profileId === candidate.id;
          return (
            <button
              key={candidate.id}
              type="button"
              onClick={() => onSelectProfile(candidate)}
              className={`group flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
              }`}
              aria-pressed={isSelected}
            >
              <Icon
                aria-hidden="true"
                className={`h-6 w-6 transition-colors ${
                  isSelected
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary/70"
                }`}
              />
              <span
                className={`text-xs font-medium leading-tight ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {getLocalizedText(candidate.label, locale)}
              </span>
            </button>
          );
        })}
      </div>

      {profileCount > 8 && !showAllProfiles && (
        <button
          type="button"
          onClick={onShowAll}
          className="mt-2 flex items-center gap-1 rounded py-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {t.showAllCategories} <ChevronDown className="h-3 w-3" />
        </button>
      )}
    </section>
  );
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {String(num).padStart(2, "0")}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}
