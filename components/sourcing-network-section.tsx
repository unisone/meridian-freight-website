import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SOURCING_PARTNERS } from "@/content/sourcing-partners";

const FLOW_STEPS = ["listingReview", "pickup", "export"] as const;

export function SourcingNetworkSection() {
  const t = useTranslations("SourcingNetwork");

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.25fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
            {t("description")}
          </p>

          <ul className="mt-6 space-y-3">
            {FLOW_STEPS.map((step) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t(`steps.${step}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOURCING_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="rounded-lg border border-border/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight text-foreground">
                      {partner.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(`focus.${partner.focusKey}`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-slate-900 p-5 text-white shadow-lg">
            <p className="text-sm font-semibold text-sky-300">{t("ctaLead")}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {t("ctaDescription")}
            </p>
            <Button
              render={<Link href="/contact" />}
              className="mt-4 h-11 rounded-lg bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              {t("ctaButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
