import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle, Package, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, CONTACT } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

const suggestedLinks = [
  { labelKey: "machineryPacking", href: "/services/machinery-packing", icon: Package },
  { labelKey: "containerLoading", href: "/services/container-loading", icon: Package },
  { labelKey: "agriculturalEquipment", href: "/services/agricultural", icon: Package },
  { labelKey: "shipToBrazil", href: "/destinations/brazil", icon: Globe },
  { labelKey: "shipToUAE", href: "/destinations/uae", icon: Globe },
  { labelKey: "shipToTurkey", href: "/destinations/turkey", icon: Globe },
  { labelKey: "pricingCalculator", href: "/pricing", icon: FileText },
  { labelKey: "completedProjects", href: "/projects", icon: FileText },
] as const;

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {t("subtitle")}
        </p>
        <p className="mt-2 text-muted-foreground">
          {COMPANY.name} — {COMPANY.tagline}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg"
            render={<Link href="/" />}
          >
            {t("backToHome")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
            render={
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("chatOnWhatsApp")}
              />
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("chatOnWhatsApp")}
          </Button>
        </div>

        {/* Suggested links */}
        <div className="mt-12 text-left">
          <h2 className="text-lg font-semibold text-foreground">
            {t("suggestedLinksHeading")}
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {suggestedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <link.icon className="h-4 w-4 shrink-0 text-primary" />
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact fallback */}
        <div className="mt-10 rounded-xl bg-muted p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            {t("needHelp")}{" "}
            <a href={CONTACT.phoneHref} className="text-primary hover:underline">
              {CONTACT.phone}
            </a>{" "}
            {t("orEmail")}{" "}
            <a href={CONTACT.emailHref} className="text-primary hover:underline">
              {CONTACT.email}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
