"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { TrendingUp, Clock, Ship, Globe, FileText, Package } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { STATS } from "@/lib/constants";
import { formatCount } from "@/lib/i18n-utils";
import { useLocale, useTranslations } from "next-intl";

type TrustItem = {
  icon: typeof TrendingUp;
  labelKey: string;
  value: number | null;
  suffix: string | null;
};

function StatItem({ item, label, locale }: { item: TrustItem; label: string; locale: string }) {
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
          {formatCount(count, locale)}{item.suffix}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    );
  }

  // Non-stat items (no value): horizontal — icon + label
  return (
    <div ref={ref} className="flex items-center justify-center gap-2">
      <item.icon className="h-5 w-5 shrink-0 text-primary" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export function TrustBar() {
  const t = useTranslations("TrustBar");
  const locale = useLocale();

  const items: TrustItem[] = [
    { icon: TrendingUp, labelKey: "machinesShipped", value: STATS.projectsCompleted, suffix: "+" },
    { icon: Clock, labelKey: "yearsInBusiness", value: STATS.yearsExperience, suffix: "+" },
    { icon: Ship, labelKey: "airOceanFreight", value: null, suffix: null },
    { icon: Globe, labelKey: "multilingualTeam", value: null, suffix: null },
    { icon: FileText, labelKey: "exportDocs", value: null, suffix: null },
    { icon: Package, labelKey: "fullyInsured", value: null, suffix: null },
  ];

  return (
    <section className="bg-muted py-6 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.04),inset_0_-1px_0_0_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {items.map((item) => (
            <StatItem key={item.labelKey} item={item} label={t(item.labelKey)} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
