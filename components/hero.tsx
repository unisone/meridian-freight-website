"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { trackContactClick } from "@/lib/tracking";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative bg-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div>
            {/* Eyebrow — social proof, not a category label */}
            <p
              style={{ animationDelay: "0s" }}
              className="animate-slide-up text-sm font-semibold uppercase tracking-wider text-primary"
            >
              {t("eyebrow")}
            </p>

            {/* H1 — differentiator + scope + outcome (no jargon) */}
            <h1
              style={{ animationDelay: "0.15s" }}
              className="animate-slide-up mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl leading-tight"
            >
              {t("headingLine1")}{" "}
              <span className="text-primary">{t("headingLine2")}</span>
            </h1>

            {/* Body — PAS: Problem → Agitate → Solution (2 sentences max) */}
            <p
              style={{ animationDelay: "0.3s" }}
              className="animate-fade-in mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              {t("body")}
            </p>

            {/* Authority + geo targeting */}
            <p
              style={{ animationDelay: "0.35s" }}
              className="animate-fade-in mt-3 text-sm font-medium text-muted-foreground"
            >
              {t("authority")}
            </p>

            {/* CTAs — primary is low-commitment (WhatsApp), secondary is self-serve */}
            <div
              style={{ animationDelay: "0.5s" }}
              className="animate-slide-up mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4"
            >
              <Button
                size="lg"
                className="h-13 w-full px-7 text-base font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:shadow-lg animate-shadow-breathe sm:w-auto"
                render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={t("ctaPrimaryAriaLabel")} onClick={() => trackContactClick("whatsapp", "hero")} />}
              >
                <MessageCircle className="mr-2 h-5 w-5 transition-transform group-hover/button:scale-110" />
                {t("ctaPrimary")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full px-7 text-base font-semibold rounded-xl border border-border text-foreground bg-transparent hover:bg-muted transition-all sm:w-auto"
                render={<Link href="/pricing/calculator" />}
              >
                {t("ctaSecondary")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Image — fade in only, no slide (images shouldn't fly in) */}
          <div
            style={{ animationDelay: "0.6s" }}
            className="animate-fade-in relative"
          >
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/hero-jd-s670-crew.jpg"
                alt={t("heroImageAlt")}
                width={720}
                height={540}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
