const STEPS = [
  { num: 1, label: "TYPE" },
  { num: 2, label: "SPECS" },
  { num: 3, label: "ROUTE" },
  { num: 4, label: "REVIEW" },
] as const;

interface CalculatorProgressBarProps {
  completedSteps: number; // 0-4
}

export function CalculatorProgressBar({ completedSteps }: CalculatorProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Labels */}
      <div className="mb-2 flex">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className={`flex-1 text-xs font-medium uppercase tracking-wider ${
              step.num <= completedSteps
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Step {step.num}: {step.label}
          </div>
        ))}
      </div>

      {/* Progress bar segments */}
      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuenow={completedSteps}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label={`Calculator progress: ${completedSteps} of 4 steps complete`}
      >
        {STEPS.map((step) => (
          <div
            key={step.num}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              step.num <= completedSteps ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
