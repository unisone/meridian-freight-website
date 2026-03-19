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

  return (
    <div ref={ref} className="flex items-center gap-3">
      <item.icon className="h-5 w-5 shrink-0 text-sky-500" />
      <p
        className={`text-sm font-medium text-slate-700 ${
          item.value !== null ? "font-mono tabular-nums" : ""
        }`}
      >
        {item.value !== null ? (
          <>
            {count}
            {item.suffix} {item.label}
          </>
        ) : (
          item.label
        )}
      </p>
    </div>
  );
}

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-6">
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
