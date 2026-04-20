import { useTranslations } from "next-intl";
import { SOURCING_PARTNERS } from "@/content/sourcing-partners";

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
        {/* Dealer and auction network */}
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              {t("networkEyebrow")}
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("networkHeading")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("networkDescription")}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            {SOURCING_PARTNERS.map((partner) => (
              <span
                key={partner.name}
                className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-[13px] font-semibold text-sky-900 sm:px-4 sm:py-2 sm:text-sm"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>

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
