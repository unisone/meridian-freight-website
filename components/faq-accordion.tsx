import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import type { FaqEntry } from "@/content/faq";

interface FaqAccordionProps {
  entries: FaqEntry[];
  showViewAll?: boolean;
}

export function FaqAccordion({ entries, showViewAll = false }: FaqAccordionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Before You Ship
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            Questions Every Buyer Asks
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-3">
            {entries.map((entry) => (
              <AccordionItem
                key={entry.question}
                value={entry.question}
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
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 link-underline"
              >
                View All Questions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
