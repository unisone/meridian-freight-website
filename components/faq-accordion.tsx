"use client";

import { Link } from "@/i18n/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { trackGA4Event } from "@/lib/tracking";
import { useTranslations } from "next-intl";
import type { FaqEntry } from "@/content/faq";

interface FaqAccordionProps {
  entries: FaqEntry[];
  showViewAll?: boolean;
}

export function FaqAccordion({ entries, showViewAll = false }: FaqAccordionProps) {
  const t = useTranslations("FaqAccordion");

  function handleValueChange(value: string | string[]) {
    const expanded = Array.isArray(value) ? value : value ? [value] : [];
    if (expanded.length > 0) {
      const lastValue = expanded[expanded.length - 1];
      const idx = parseInt(lastValue.replace("faq-", ""), 10);
      const question = entries[idx]?.question ?? lastValue;
      trackGA4Event("faq_expand", { faq_question: question });
    }
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            {t("heading")}
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-3" onValueChange={handleValueChange}>
            {entries.map((entry, idx) => (
              <AccordionItem
                key={`faq-${idx}`}
                value={`faq-${idx}`}
                className="rounded-xl border-0 bg-white px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary py-5">
                  {entry.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {entry.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {showViewAll && (
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 link-underline"
              >
                {t("viewAllQuestions")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
