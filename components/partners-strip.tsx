import { useTranslations } from "next-intl";

const CARRIERS = [
  "Maersk",
  "Hapag-Lloyd",
  "CMA CGM",
  "MSC",
  "ZIM",
  "Evergreen",
];

const EQUIPMENT_BRANDS = [
  "John Deere",
  "Case IH",
  "Kinze",
  "Kubota",
  "New Holland",
  "AGCO",
  "Claas",
  "MacDon",
];

export function PartnersStrip() {
  const t = useTranslations("PartnersStrip");

  return (
    <section className="border-b border-border/40 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Shipping carriers */}
        <div>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {t("carriers")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            {CARRIERS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-md bg-slate-100 px-3.5 py-1.5 text-[13px] font-semibold text-slate-500 sm:px-4 sm:py-2 sm:text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Equipment brands */}
        <div>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {t("brands")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            {EQUIPMENT_BRANDS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-md bg-slate-100 px-3.5 py-1.5 text-[13px] font-semibold text-slate-500 sm:px-4 sm:py-2 sm:text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
