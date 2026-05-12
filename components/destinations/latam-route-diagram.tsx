import { Anchor, Plane, Ship, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LatamMarketSlug } from "@/content/latam-market-pages";

interface RouteStep {
  title: string;
  description: string;
}

interface LatamRouteDiagramProps {
  /** Four route legs: origin → transit → ... → destination */
  steps: RouteStep[];
  /** Country slug — drives accent color */
  country: LatamMarketSlug;
  /** Step number label (e.g. "Paso") */
  stepLabel: string;
}

const ACCENT: Record<LatamMarketSlug, { bg: string; ring: string; line: string; chip: string }> = {
  paraguay: {
    bg: "bg-rose-500",
    ring: "ring-rose-200",
    line: "from-rose-200 via-rose-400 to-rose-200",
    chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60",
  },
  uruguay: {
    bg: "bg-sky-500",
    ring: "ring-sky-200",
    line: "from-sky-200 via-sky-400 to-sky-200",
    chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/60",
  },
  bolivia: {
    bg: "bg-emerald-600",
    ring: "ring-emerald-200",
    line: "from-emerald-200 via-emerald-500 to-emerald-200",
    chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  },
  chile: {
    bg: "bg-blue-600",
    ring: "ring-blue-200",
    line: "from-blue-200 via-red-400 to-blue-200",
    chip: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
  },
};

const STEP_ICONS: LucideIcon[] = [Truck, Anchor, Ship, Plane];

export function LatamRouteDiagram({ steps, country, stepLabel }: LatamRouteDiagramProps) {
  const accent = ACCENT[country];

  return (
    <div className="relative">
      {/* Desktop: horizontal flowchart */}
      <ol className="hidden md:grid gap-6" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const StepIcon = STEP_ICONS[index] ?? Ship;
          const isLast = index === steps.length - 1;
          return (
            <li key={step.title} className="relative flex flex-col items-start">
              {/* Connector line to next step */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`absolute left-[2.75rem] right-[-1.25rem] top-7 h-px bg-gradient-to-r ${accent.line}`}
                />
              )}

              {/* Marker */}
              <div className="flex items-center gap-3">
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full ${accent.bg} text-white shadow-sm ring-4 ring-white`}
                >
                  <StepIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider ${accent.chip}`}
                >
                  {stepLabel} {index + 1}
                </span>
              </div>

              {/* Body */}
              <div className="mt-5">
                <h3 className="text-base font-bold leading-snug text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile: vertical timeline */}
      <ol className="md:hidden space-y-6">
        {steps.map((step, index) => {
          const StepIcon = STEP_ICONS[index] ?? Ship;
          const isLast = index === steps.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4">
              {/* Vertical line connector */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-7 top-14 bottom-[-1.5rem] w-px bg-gradient-to-b ${accent.line}`}
                />
              )}

              {/* Marker */}
              <div
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${accent.bg} text-white shadow-sm ring-4 ring-white`}
              >
                <StepIcon className="h-6 w-6" aria-hidden="true" />
              </div>

              {/* Body */}
              <div className="flex-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider ${accent.chip}`}
                >
                  {stepLabel} {index + 1}
                </span>
                <h3 className="mt-2 text-base font-bold leading-snug text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
