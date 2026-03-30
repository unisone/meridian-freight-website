"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        {t("description")}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg"
        >
          {t("tryAgain")}
        </Button>
        <Button
          variant="outline"
          className="rounded-lg"
          render={<Link href="/" />}
        >
          {t("backToHome")}
        </Button>
      </div>

      {/* Suggested pages */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {([
          { href: "/services", labelKey: "services" },
          { href: "/pricing", labelKey: "pricing" },
          { href: "/pricing/calculator", labelKey: "freightCalculator" },
          { href: "/projects", labelKey: "projects" },
          { href: "/contact", labelKey: "contact" },
        ] as const).map(({ href, labelKey }) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t(labelKey)}
          </Link>
        ))}
      </div>

      {/* Contact fallback */}
      <div className="mt-6 rounded-xl bg-muted p-6 text-center max-w-md">
        <p className="text-sm text-muted-foreground">
          {t("persistentError")}
        </p>
        <div className="mt-3 flex flex-col items-center gap-2 text-sm">
          <a href={CONTACT.phoneHref} className="font-medium text-primary hover:underline">
            {CONTACT.phone}
          </a>
          <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline">
            {t("chatOnWhatsApp")}
          </a>
          <a href={CONTACT.emailHref} className="font-medium text-primary hover:underline">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </main>
  );
}
