"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryFlag } from "@/lib/container-display";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";

interface DestinationFilterProps {
  containers: ContainerWithPendingCount[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  sortBy: "soonest" | "most-space";
  onSortChange: (sort: "soonest" | "most-space") => void;
}

/** Extract unique destination countries with labels */
function getUniqueDestinations(
  containers: ContainerWithPendingCount[]
): Array<{ code: string; label: string }> {
  const seen = new Map<string, string>();

  for (const c of containers) {
    if (c.destination_country && !seen.has(c.destination_country)) {
      // Extract country name from destination (e.g., "Almaty, Kazakhstan" → "Kazakhstan")
      const parts = c.destination.split(",").map((s) => s.trim());
      const countryName = parts.length > 1 ? parts[parts.length - 1] : c.destination;
      seen.set(c.destination_country, countryName);
    }
  }

  return Array.from(seen.entries())
    .map(([code, label]) => ({ code, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function DestinationFilter({
  containers,
  selectedCountry,
  onCountryChange,
  sortBy,
  onSortChange,
}: DestinationFilterProps) {
  const destinations = getUniqueDestinations(containers);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        {/* Destination filter */}
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Destinations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            {destinations.map(({ code, label }) => (
              <SelectItem key={code} value={code}>
                {countryFlag(code)} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as "soonest" | "most-space")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soonest">Soonest First</SelectItem>
            <SelectItem value="most-space">Most Space</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
