import { cn } from "@/lib/utils";

interface DarkCtaProps {
  heading: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
  /** Extra classes on the outer <section> (e.g. "mt-16 mb-16") */
  className?: string;
  /** Card variant uses rounded-2xl bg-slate-900 + max-w-3xl inner container.
   *  Default full-width variant uses bg-gradient-to-r from-slate-900 to-slate-800. */
  variant?: "full" | "card";
  /** Optional icon rendered above the heading */
  icon?: React.ReactNode;
}

export function DarkCta({
  heading,
  description,
  children,
  className,
  variant = "full",
  icon,
}: DarkCtaProps) {
  const isCard = variant === "card";

  return (
    <section
      className={cn(
        "py-12 sm:py-16",
        isCard
          ? "rounded-2xl bg-slate-900"
          : "bg-gradient-to-r from-slate-900 to-slate-800",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto px-4 text-center text-white",
          isCard ? "max-w-3xl" : "max-w-7xl sm:px-6 lg:px-8",
        )}
      >
        {icon && <div className="mb-4">{icon}</div>}
        <h2 className="text-2xl font-bold text-balance sm:text-3xl">{heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sky-300">{description}</p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {children}
        </div>
      </div>
    </section>
  );
}
