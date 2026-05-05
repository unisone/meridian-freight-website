"use client";

import { Clock3, DollarSign, Globe, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDollar } from "@/lib/calculator-v3/format";

import { RouteGlobeV3 } from "../route-globe-v3";
import {
  countryLabel,
  formatTransit,
  getDestinationPortLabel,
  routeSortCostLabel,
} from "./copy";
import type { StepRouteProps } from "./types";

export function StepRoute({
  profile,
  enabledMode,
  eligibleCountries,
  activeDestinationCountry,
  zipCode,
  routePreference,
  showPortTabs,
  destinationPortKeys,
  selectedDestinationPortKey,
  routesForCountry,
  routeOptions,
  selectedRoute,
  preview,
  step2Done,
  hasRequiredValue,
  quantity,
  equipmentValueUsd,
  locale,
  t,
  onSetDestinationCountry,
  onSetDestinationPortKey,
  onSetRoutePreference,
  onSelectRoute,
  onSetZip,
  onResetEstimate,
}: StepRouteProps) {
  return (
    <section
      aria-disabled={!step2Done || undefined}
      className={`transition-[opacity,transform] duration-300 ${
        !step2Done
          ? "pointer-events-none translate-y-2 opacity-40"
          : "translate-y-0 opacity-100"
      }`}
    >
      <SectionHeader num={3} title={t.shippingRoute} />

      {!step2Done ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {profile && enabledMode?.requiresEquipmentValue && !hasRequiredValue
            ? t.valueRequired
            : t.completeEquipmentHint}
        </p>
      ) : eligibleCountries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <div className="font-semibold">{t.noPublishedRoutesTitle}</div>
          <p className="mt-1 text-amber-900/80">
            {t.noPublishedRoutesDescription}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label
                htmlFor="v3-dest-country"
                className="flex items-center gap-1.5 text-sm"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                {t.destinationCountry}
              </Label>
              <select
                id="v3-dest-country"
                aria-label={t.destinationCountry}
                value={activeDestinationCountry}
                onChange={(event) => onSetDestinationCountry(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:text-sm"
              >
                <option value="">{t.selectCountry}</option>
                {eligibleCountries.map((code) => (
                  <option key={code} value={code}>
                    {countryLabel(code)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label
                htmlFor="v3-zip-code"
                className="flex items-center gap-1.5 text-sm"
              >
                <Package className="h-3.5 w-3.5 text-primary" />
                {t.usPickupZip}
                <span className="text-xs text-muted-foreground">
                  {t.optional}
                </span>
              </Label>
              <Input
                id="v3-zip-code"
                aria-label={`${t.usPickupZip} ${t.optional}`}
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={zipCode}
                onChange={(event) => {
                  onSetZip(event.target.value.replace(/\D/g, "").slice(0, 5));
                  onResetEstimate();
                }}
                placeholder={t.zipPlaceholder}
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t.zipHint}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-sm">{t.routePreference}</Label>
              <div
                className="mt-2 grid max-w-xs grid-cols-2 overflow-hidden rounded-lg border"
                role="group"
                aria-label={t.routePreference}
              >
                {(["cheapest", "fastest"] as const).map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => {
                      onSetRoutePreference(preference);
                      onResetEstimate();
                    }}
                    className={`h-10 text-sm font-medium transition-colors ${
                      routePreference === preference
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {preference === "cheapest" ? t.cheapest : t.fastest}
                  </button>
                ))}
              </div>
            </div>

            {showPortTabs && (
              <div>
                <Label className="text-sm">{t.destinationPort}</Label>
                <div
                  className="mt-2 flex flex-wrap gap-2"
                  role="group"
                  aria-label={t.destinationPort}
                >
                  {destinationPortKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        onSetDestinationPortKey(key);
                        onResetEstimate();
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        selectedDestinationPortKey === key
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      {getDestinationPortLabel(routesForCountry, key)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeDestinationCountry && (
            <div>
              <div className="mb-2 text-sm font-semibold text-foreground">
                {t.routeOptions}
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {routeOptions.slice(0, 4).map((route) => {
                  const active = selectedRoute?.id === route.id;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => onSelectRoute(route)}
                      className={`rounded-xl border-2 px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {t.route}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-foreground">
                            {route.origin.label} → {route.destination.label}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {route.carrier}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-700" />
                          {enabledMode
                            ? routeSortCostLabel({
                                route,
                                mode: enabledMode,
                                quantity,
                                equipmentValueUsd,
                                zipCode: zipCode || null,
                              })
                            : "—"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-primary" />
                          {formatTransit(route, locale)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {preview && (
            <div className="rounded-xl bg-muted p-4 text-sm">
              <div className="font-semibold text-foreground">
                {t.shippingRoute}
              </div>
              <div className="mt-1 text-muted-foreground">
                {zipCode ? `ZIP ${zipCode}` : t.usPickup} →{" "}
                {preview.route.origin.label} → {preview.route.destination.label}
              </div>
              <div className="mt-2 font-mono text-lg font-bold text-primary">
                {formatDollar(preview.freightTotal)}
                {preview.totalExcludesInland && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    ({t.exclInlandTransport})
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-xl">
            <RouteGlobeV3
              originPort={
                preview?.route.origin.label ?? selectedRoute?.origin.label ?? null
              }
              destinationPort={
                preview?.route.destination.label ??
                selectedRoute?.destination.label ??
                null
              }
              destinationCountry={activeDestinationCountry || null}
              containerType={enabledMode?.containerType ?? null}
            />
          </div>
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
