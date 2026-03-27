import { Breadcrumbs } from "@/components/breadcrumbs";

interface PageHeroProps {
  /** Visual variant: dark slate gradient, light white, or subtle primary tint */
  variant?: "dark" | "light" | "gradient";
  /** Breadcrumb items — always rendered above the hero content */
  breadcrumbs: Array<{ label: string; href?: string }>;
  /** Page heading (h1) */
  heading: string | React.ReactNode;
  /** Description paragraph below the heading */
  description?: string | React.ReactNode;
  /** Lucide icon component — rendered as a badge above the heading (dark variant only) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Eyebrow text above the heading (gradient variant) */
  eyebrow?: string;
  /** Authority/trust text below description (gradient variant) */
  authority?: string;
  /** Center-align all text (gradient variant default) */
  centered?: boolean;
  /** Button slot — rendered below the description */
  children?: React.ReactNode;
  /** Right column content for 2-col grid layout (e.g., globe on destinations) */
  rightContent?: React.ReactNode;
}

export function PageHero({
  variant = "light",
  breadcrumbs,
  heading,
  description,
  icon: Icon,
  eyebrow,
  authority,
  centered,
  children,
  rightContent,
}: PageHeroProps) {
  const isCentered = centered ?? variant === "gradient";

  return (
    <div className="pt-20">
      {/* Breadcrumbs — always in standard container above hero band */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {variant === "light" ? (
        /* ─── Light: heading + desc in same container, no background ─── */
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {heading}
          </h1>
          {description && (
            <div className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {typeof description === "string" ? <p>{description}</p> : description}
            </div>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      ) : variant === "dark" ? (
        /* ─── Dark: slate-900 gradient band ────────────────────────── */
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {rightContent ? (
              /* 2-col grid layout (destinations page with globe) */
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-white lg:max-w-xl">
                  {Icon && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    {heading}
                  </h1>
                  {description && (
                    <div className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
                      {typeof description === "string" ? <p>{description}</p> : description}
                    </div>
                  )}
                  {children && <div className="mt-8">{children}</div>}
                </div>
                <div className="flex-shrink-0">{rightContent}</div>
              </div>
            ) : (
              /* Standard single-column dark layout */
              <div className="text-white">
                {Icon && (
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {heading}
                </h1>
                {description && (
                  <div className="mt-4 max-w-3xl text-lg text-sky-300 leading-relaxed">
                    {typeof description === "string" ? <p>{description}</p> : description}
                  </div>
                )}
                {children && <div className="mt-8">{children}</div>}
              </div>
            )}
          </div>
        </section>
      ) : (
        /* ─── Gradient: subtle primary/5 tint band ─────────────────── */
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-16 md:py-20">
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${isCentered ? "text-center" : ""}`}>
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {eyebrow}
              </p>
            )}
            <h1 className={`${eyebrow ? "mt-2" : ""} text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl`}>
              {heading}
            </h1>
            {description && (
              <div className={`mt-4 max-w-2xl text-lg text-muted-foreground ${isCentered ? "mx-auto" : ""}`}>
                {typeof description === "string" ? <p>{description}</p> : description}
              </div>
            )}
            {authority && (
              <p className={`mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground ${isCentered ? "mx-auto" : ""}`}>
                {authority}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </section>
      )}
    </div>
  );
}
