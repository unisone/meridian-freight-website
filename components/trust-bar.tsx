"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { TrendingUp, Clock, Ship, Star, FileText, Package } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { STATS } from "@/lib/constants";

const items = [
  { icon: TrendingUp, label: "Equipment Exports", value: STATS.projectsCompleted, suffix: "+" },
  { icon: Clock, label: "Years", value: STATS.yearsExperience, suffix: "+" },
  { icon: Ship, label: "Worldwide Shipping", value: null, suffix: null },
  { icon: Star, label: "5.0 Google Rating", value: null, suffix: null },
  { icon: FileText, label: "Export Docs", value: null, suffix: null },
  { icon: Package, label: "Packing & Crating", value: null, suffix: null },
];

function StatItem({ item }: { item: (typeof items)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp({
    end: item.value ?? 0,
    duration: 0.8,
    enabled: isInView && item.value !== null,
  });

  // Stat items (with numeric value): vertical stack — icon → big number → label
  if (item.value !== null) {
    return (
      <div ref={ref} className="flex flex-col items-center gap-1 text-center">
        <item.icon className="h-5 w-5 text-primary" />
        <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
          {count}{item.suffix}
        </span>
        <span className="text-xs text-muted-foreground">{item.label}</span>
      </div>
    );
  }

  // Non-stat items (no value): horizontal — icon + label
  return (
    <div ref={ref} className="flex items-center justify-center gap-2">
      <item.icon className="h-5 w-5 shrink-0 text-primary" />
      <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <section className="bg-muted py-6 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.04),inset_0_-1px_0_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {items.map((item) => (
            <StatItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
