import { cn } from "@/lib/utils";

interface ScheduleSectionHeaderProps {
  eyebrow: string;
  heading: string;
  count: number;
  accentColor: "primary" | "indigo" | "emerald";
  className?: string;
}

const ACCENT_MAP = {
  primary: "text-primary",
  indigo: "text-indigo-500",
  emerald: "text-emerald-500",
} as const;

const COUNT_BG_MAP = {
  primary: "bg-primary/10 text-primary",
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
} as const;

export function ScheduleSectionHeader({
  eyebrow,
  heading,
  count,
  accentColor,
  className,
}: ScheduleSectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-5", className)}>
      <div>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wider",
            ACCENT_MAP[accentColor],
          )}
        >
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
          {heading}
        </h2>
      </div>
      <span
        className={cn(
          "inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full text-sm font-bold font-mono tabular-nums",
          COUNT_BG_MAP[accentColor],
        )}
      >
        {count}
      </span>
    </div>
  );
}
