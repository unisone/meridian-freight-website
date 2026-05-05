"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/constants";
import { formatDollar } from "@/lib/calculator-v3/format";
import { trackContactClick } from "@/lib/tracking";
import type {
  EquipmentQuoteProfile,
  FreightEstimateV3,
} from "@/lib/calculator-v3/contracts";
import type { CalculatorV3Result } from "@/app/actions/calculator-v3";

import type { WizardCopy } from "./types";

export function WizardLoadingSkeleton() {
  return (
    <div>
      <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-1.5 flex-1 rounded-full" />
        ))}
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-[3] space-y-8">
          <div>
            <Skeleton className="mb-4 h-5 w-48" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="opacity-40">
            <Skeleton className="mb-4 h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="opacity-40">
            <Skeleton className="mb-4 h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="hidden flex-[2] lg:block">
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

interface WizardMobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: FreightEstimateV3 | null;
  profile: EquipmentQuoteProfile | null;
  result: CalculatorV3Result | null;
  step3Done: boolean;
  t: WizardCopy;
  estimateCard: ReactNode;
}

export function WizardMobileSheet({
  open,
  onOpenChange,
  preview,
  profile,
  result,
  step3Done,
  t,
  estimateCard,
}: WizardMobileSheetProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <div className="flex items-center justify-between bg-slate-900 px-4 py-3 shadow-2xl">
          <SheetTrigger
            aria-label={t.viewEstimateDetails}
            className="flex items-center gap-2 text-white"
          >
            {preview ? (
              <>
                <span className="text-xs text-slate-400">Est.</span>
                <span className="font-mono text-lg font-bold">
                  {formatDollar(preview.freightTotal)}
                </span>
              </>
            ) : profile ? (
              <span className="text-sm text-slate-400">
                {t.selectDestinationForEstimate}
              </span>
            ) : (
              <span className="text-sm text-slate-400">
                {t.selectEquipmentToBegin}
              </span>
            )}
          </SheetTrigger>
          <Button
            size="sm"
            className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            disabled={!step3Done}
            onClick={() => onOpenChange(true)}
          >
            {result?.success ? t.viewEstimate : t.bookThisFreight}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-0"
          showCloseButton={true}
        >
          <SheetHeader className="bg-muted px-5 py-4">
            <SheetTitle>{t.yourFreightEstimate}</SheetTitle>
          </SheetHeader>
          <div className="p-5">{estimateCard}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function WizardUnavailableCard({ t }: { t: WizardCopy }) {
  return (
    <Card className="mx-auto max-w-2xl border-primary/20 shadow-xl">
      <CardContent className="space-y-4 p-8 text-center">
        <h3 className="text-lg font-bold text-foreground">{t.unavailableTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.unavailableDescription}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/contact" />}
            className="bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Contact us
          </Button>
          <Button
            render={
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackContactClick("whatsapp", "calculator_v3_unavailable")
                }
              />
            }
            variant="outline"
            className="border-emerald-600 py-5 font-semibold text-emerald-600 hover:bg-emerald-50"
          >
            {t.whatsAppUs}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
