"use client";

import { formatDollar } from "@/lib/calculator-v3/format";
import { getLocalizedText } from "@/lib/calculator-v3/policy";
import type { CalculatorLocale, ImportCostEstimateV3 } from "@/lib/calculator-v3/contracts";

import { COPY, missingInputLabel } from "./copy";

export function ImportCostNote({
  importCost,
  locale,
}: {
  importCost: ImportCostEstimateV3;
  locale: CalculatorLocale;
}) {
  const t = COPY[locale];
  if (importCost.available) {
    return (
      <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-400">
        <p>{t.importBrokerNote}</p>
        {importCost.recoverableCreditsUsd != null &&
          importCost.recoverableCreditsUsd > 0 && (
            <p>
              {t.recoverableCredits}:{" "}
              {formatDollar(importCost.recoverableCreditsUsd)}
            </p>
          )}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-400">
      {importCost.note && <p>{getLocalizedText(importCost.note, locale)}</p>}
      {importCost.missingInputs.length > 0 && (
        <p>
          {t.missingInputs}:{" "}
          {importCost.missingInputs
            .map((key) => missingInputLabel(key, locale))
            .join(", ")}
        </p>
      )}
    </div>
  );
}

export function DetailRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span
        className={`text-right ${
          highlight ? "font-semibold text-primary" : "font-medium text-white"
        }${mono ? " font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
