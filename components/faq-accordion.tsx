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
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-500">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion className="space-y-3">
            {entries.map((entry) => (
              <AccordionItem
                key={entry.question}
                value={entry.question}
                className="rounded-xl border border-slate-200 bg-white px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-sky-500 py-5">
                  {entry.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                  {entry.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {showViewAll && (
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-600"
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
