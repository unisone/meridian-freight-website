"use client";

import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLocalizedText } from "@/lib/calculator-v3/policy";

import { containerLabel, modeIcon } from "./copy";
import type { StepSpecsProps } from "./types";

export function StepSpecs({
  profile,
  modeId,
  quantity,
  equipmentValueUsd,
  enabledMode,
  locale,
  t,
  onSelectMode,
  onSetQuantity,
  onSetEquipmentValue,
  onResetEstimate,
}: StepSpecsProps) {
  return (
    <section
      aria-disabled={!profile || undefined}
      className={`transition-[opacity,transform] duration-300 ${
        !profile
          ? "pointer-events-none translate-y-2 opacity-40"
          : "translate-y-0 opacity-100"
      }`}
    >
      <SectionHeader num={2} title={t.equipmentSpecs} />

      {!profile ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {t.selectEquipmentHint}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <Label className="text-sm">{t.shippingMode}</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {profile.modes.map((candidate) => {
                const Icon = modeIcon(candidate);
                const isSelected = modeId === candidate.id;
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    disabled={!candidate.enabled}
                    onClick={() => onSelectMode(candidate)}
                    className={`flex min-h-24 items-start gap-3 rounded-xl border-2 px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {getLocalizedText(candidate.label, locale)}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {getLocalizedText(
                          candidate.enabled
                            ? candidate.description
                            : candidate.disabledReason ?? candidate.description,
                          locale,
                        )}
                      </span>
                      <Badge variant="secondary" className="mt-2 text-[10px]">
                        {candidate.enabled
                          ? containerLabel(candidate.containerType)
                          : t.confirmWithMeridian}
                      </Badge>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {enabledMode && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="v3-quantity" className="text-sm">
                  {getLocalizedText(profile.quantityLabel, locale)}
                </Label>
                <Input
                  id="v3-quantity"
                  aria-label={getLocalizedText(profile.quantityLabel, locale)}
                  type="number"
                  min={1}
                  max={profile.maxQuantity}
                  value={quantity}
                  onChange={(event) => {
                    const parsed = Number.parseInt(event.target.value || "1", 10);
                    onSetQuantity(Math.min(profile.maxQuantity, Math.max(1, parsed)));
                    onResetEstimate();
                  }}
                  className="mt-1.5 max-w-40"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {getLocalizedText(profile.quantityHelp, locale)}
                </p>
              </div>

              {enabledMode.requiresEquipmentValue && (
                <div>
                  <Label htmlFor="v3-equipment-value" className="text-sm">
                    {t.equipmentValueUsd}
                  </Label>
                  <Input
                    id="v3-equipment-value"
                    aria-label={t.equipmentValueUsd}
                    type="number"
                    inputMode="decimal"
                    min={1}
                    step={1}
                    value={equipmentValueUsd ?? ""}
                    onChange={(event) => {
                      const parsed = Number.parseFloat(event.target.value);
                      onSetEquipmentValue(
                        Number.isFinite(parsed) && parsed > 0 ? parsed : null,
                      );
                      onResetEstimate();
                    }}
                    placeholder={t.equipmentValuePlaceholder}
                    className="mt-1.5 max-w-56"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {t.equipmentValueHint}
                  </p>
                </div>
              )}
            </div>
          )}

          {enabledMode && (
            <div className="rounded-xl bg-muted p-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {getLocalizedText(enabledMode.shortLabel, locale)} ·{" "}
                  {containerLabel(enabledMode.containerType)}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {getLocalizedText(enabledMode.description, locale)}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {String(num).padStart(2, "0")}
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}
