"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { trackNotFound } from "@/lib/tracking";
import { useTranslations } from "next-intl";

const SUGGESTED_LINKS = [
  { href: "/services/machinery-packing", labelKey: "machineryPacking" },
  { href: "/services/container-loading", labelKey: "containerLoading" },
  { href: "/services/agricultural", labelKey: "agriculturalEquipment" },
  { href: "/destinations/brazil", labelKey: "shipToBrazil" },
  { href: "/destinations/uae", labelKey: "shipToUAE" },
  { href: "/destinations/turkey", labelKey: "shipToTurkey" },
  { href: "/pricing", labelKey: "pricingCalculator" },
  { href: "/projects", labelKey: "completedProjects" },
] as const;

export default function NotFoundPage() {
  const t = useTranslations("NotFoundPage");

  useEffect(() => {
    trackNotFound();
  }, []);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button render={<Link href="/" />} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
          <Button
            render={
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            variant="outline"
            size="lg"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t("chatOnWhatsApp")}
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("suggestedLinksHeading")}
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTED_LINKS.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {t("needHelp")}{" "}
          <a href={CONTACT.phoneHref} className="font-medium text-primary hover:underline">
            {CONTACT.phone}
          </a>{" "}
          {t("orEmail")}{" "}
          <a href={CONTACT.emailHref} className="font-medium text-primary hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
