"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Info,
  Loader2,
  Package,
  Ship,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { track as vercelTrack } from "@vercel/analytics";
import { trackGA4Event, trackPixelEvent, trackCalcFunnel, trackContactClick } from "@/lib/tracking";
import { submitCalculator, type CalculatorResult } from "@/app/actions/calculator";
import { getCalculatorData } from "@/app/actions/calculator-data";
import { calculateFreightV2, formatDollar } from "@/lib/freight-engine-v2";
import type {
  CalculatorData,
  EquipmentPackingRate,
  FreightEstimateV2,
} from "@/lib/types/calculator";
import {
  CATEGORY_LABELS,
  UNIT_LABELS,
  COUNTRY_NAMES,
} from "@/lib/types/calculator";
import { CONTACT } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { CalculatorProgressBar } from "./calculator-progress-bar";
import { RouteGlobe } from "./route-globe";
import { CalculatorEstimateCard } from "./calculator-estimate-card";
import { CATEGORY_ICONS } from "./category-icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CalculatorWizard() {
  const t = useTranslations("Calculator");
  const tc = useTranslations("Common");

  // ─── Data ──────────────────────────────────────────────────────────────
  const [data, setData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  // ─── Form state ────────────────────────────────────────────────────────
  const [category, setCategory] = useState("");
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentPackingRate | null>(null);
  const [equipmentSize, setEquipmentSize] = useState<number | null>(null);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [zipCode, setZipCode] = useState("");

  // ─── Email gate state ──────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const submittingRef = useRef(false);

  // ─── Preview estimate ──────────────────────────────────────────────────
  const [preview, setPreview] = useState<FreightEstimateV2 | null>(null);

  // ─── Mobile sheet ──────────────────────────────────────────────────────
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // ─── Category expansion (for >8 categories) ───────────────────────────
  const [showAllCategories, setShowAllCategories] = useState(false);

  // ─── Fetch rate data on mount ──────────────────────────────────────────
  useEffect(() => {
    getCalculatorData()
      .then((d) => {
        if (d) setData(d);
        else setDataError(true);
      })
      .catch(() => setDataError(true))
      .finally(() => setLoading(false));
  }, []);

  // ─── Recalculate preview when inputs change ────────────────────────────
  useEffect(() => {
    if (!selectedEquipment || !destinationCountry || !data) {
      setPreview(null);
      return;
    }
    const est = calculateFreightV2({
      equipment: selectedEquipment,
      equipmentSize,
      destinationCountry,
      zipCode: zipCode || null,
      oceanRates: data.oceanRates,
    });
    setPreview(est);
  }, [selectedEquipment, equipmentSize, destinationCountry, zipCode, data]);

  // ─── Derived state ─────────────────────────────────────────────────────
  const filteredEquipment = data
    ? category
      ? data.equipment.filter((e) => e.equipment_category === category)
      : data.equipment
    : [];

  const unitLabel = selectedEquipment
    ? UNIT_LABELS[selectedEquipment.packing_unit]
    : null;
  const needsSize =
    selectedEquipment !== null && selectedEquipment.packing_unit !== "flat";
  const isFlatrack = selectedEquipment?.container_type === "flatrack";
  const containerLabel =
    selectedEquipment?.container_type === "fortyhc"
      ? t("fortyHC")
      : t("flatRack");

  // Progress: how many steps are complete?
  const step1Done = selectedEquipment !== null;
  const step2Done =
    step1Done && (!needsSize || (equipmentSize !== null && equipmentSize > 0));
  const step3Done = step2Done && destinationCountry !== "" && preview !== null;
  const step4Done = result?.success === true;
  const completedSteps =
    (step1Done ? 1 : 0) +
    (step2Done ? 1 : 0) +
    (step3Done ? 1 : 0) +
    (step4Done ? 1 : 0);
  const isComplete = step3Done; // all 3 input sections filled

  // Categories to display (first 8 + expansion)
  const visibleCategories =
    data && !showAllCategories && data.categories.length > 8
      ? data.categories.slice(0, 8)
      : data?.categories ?? [];

  // ─── Handlers ──────────────────────────────────────────────────────────
  async function handleCalculate() {
    if (!EMAIL_RE.test(email) || !selectedEquipment || !destinationCountry)
      return;
    if (website) return; // honeypot — silent reject before any state changes
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    try {
      const params = new URLSearchParams(window.location.search);

      const res = await submitCalculator({
        email,
        name,
        company,
        equipmentCategory: selectedEquipment.equipment_category,
        equipmentType: selectedEquipment.equipment_type,
        equipmentDisplayName: selectedEquipment.display_name_en,
        equipmentSize: needsSize ? equipmentSize : null,
        containerType: selectedEquipment.container_type,
        destinationCountry,
        zipCode,
        website,
        source_page: window.location.pathname,
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        utm_content: params.get("utm_content") || "",
      });

      if (res.success && res.estimate) {
        setResult(res);
        trackGA4Event("generate_lead", {
          event_category: "calculator",
          lead_source: "freight_calculator_v2",
          value: 300,
          currency: "USD",
        });
        vercelTrack("generate_lead", { source: "calculator", value: 300 });
        if (res.eventId) {
          trackPixelEvent(
            "Lead",
            { content_name: "freight_calculator_v2" },
            res.eventId
          );
        }
      } else {
        setError(res.error || "Something went wrong");
      }
    } catch {
      setError("Failed to calculate. Please try again.");
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }

  function resetAll() {
    setCategory("");
    setSelectedEquipment(null);
    setEquipmentSize(null);
    setDestinationCountry("");
    setZipCode("");
    setEmail("");
    setName("");
    setCompany("");
    setWebsite("");
    setError("");
    setResult(null);
    setPreview(null);
    setMobileSheetOpen(false);
    setShowAllCategories(false);
  }

  // ─── Loading state — content-aware skeleton ────────────────────────────
  if (loading) {
    return (
      <div>
        {/* Progress bar skeleton */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-1.5 flex-1 rounded-full" />
          ))}
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left column — form skeleton */}
          <div className="min-w-0 flex-[3] space-y-8">
            {/* Section 1: Category grid */}
            <div>
              <Skeleton className="mb-4 h-5 w-48" />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
            {/* Section 2: Specs */}
            <div className="opacity-40">
              <Skeleton className="mb-4 h-5 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
            {/* Section 3: Route */}
            <div className="opacity-40">
              <Skeleton className="mb-4 h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          {/* Right column — estimate card skeleton */}
          <div className="hidden flex-[2] lg:block">
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Data unavailable ──────────────────────────────────────────────────
  if (dataError || !data) {
    return (
      <Card className="mx-auto max-w-2xl border-primary/20 shadow-xl">
        <CardContent className="space-y-4 p-8 text-center">
          <h3 className="text-lg font-bold text-foreground">
            {t("unavailableTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("unavailableDescription")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              render={<Link href="/contact" />}
              className="bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {tc("contactUs")}
            </Button>
            <Button
              render={
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick("whatsapp", "calculator_unavailable")}
                />
              }
              variant="outline"
              className="border-emerald-600 py-5 font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              {tc("whatsAppUs")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Shared estimate card props ────────────────────────────────────────
  const estimateCardProps = {
    preview,
    result,
    selectedEquipment,
    destinationCountry,
    isComplete,
    email,
    onEmailChange: setEmail,
    name,
    onNameChange: setName,
    company,
    onCompanyChange: setCompany,
    website,
    onWebsiteChange: setWebsite,
    isSubmitting,
    error,
    onSubmit: handleCalculate,
    onReset: resetAll,
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div>
      {/* Progress bar */}
      <CalculatorProgressBar completedSteps={completedSteps} />

      {/* Two-column layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ─── LEFT COLUMN: Form sections ─────────────────────────── */}
        <div className="min-w-0 flex-[3] space-y-8">
          {/* ╔═══════════════════════════════════════════════╗ */}
          {/* ║ Section 01: Select Equipment                  ║ */}
          {/* ╚═══════════════════════════════════════════════╝ */}
          <section>
            <SectionHeader num={1} title={t("selectEquipmentCategory")} />

            {/* Category cards grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {visibleCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat] ?? Package;
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setSelectedEquipment(null);
                      setEquipmentSize(null);
                    }}
                    className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`h-6 w-6 transition-colors ${
                        isSelected
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary/70"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium leading-tight ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {CATEGORY_LABELS[cat] ?? cat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Show more categories */}
            {data.categories.length > 8 && !showAllCategories && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="mt-2 flex items-center gap-1 py-2 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded"
              >
                {t("showAllCategories", { count: data.categories.length })}{" "}
                <ChevronDown className="h-3 w-3" />
              </button>
            )}

            {/* Equipment type list */}
            {category && (
              <div className="mt-4">
                <Label className="text-sm text-muted-foreground">
                  {t("equipmentType")}
                </Label>
                <ScrollArea className="mt-2 max-h-64 rounded-xl shadow-sm bg-muted/30">
                  <div className="space-y-1 p-2">
                    {filteredEquipment.map((eq) => {
                      const isSelected = selectedEquipment?.id === eq.id;
                      return (
                        <button
                          key={eq.id}
                          onClick={() => {
                            setSelectedEquipment(eq);
                            setEquipmentSize(null);
                            trackCalcFunnel("start", {
                              equipment_type: eq.display_name_en,
                              container_type: eq.container_type,
                            });
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div>
                            <div className="font-medium">
                              {eq.display_name_en}
                            </div>
                            {eq.models && (
                              <div
                                className={`text-xs ${
                                  isSelected
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {eq.models}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${
                              isSelected
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : ""
                            }`}
                          >
                            {eq.container_type === "fortyhc" ? (
                              <>
                                <Ship className="mr-0.5 h-2.5 w-2.5" /> 40&apos;HC
                              </>
                            ) : (
                              <>
                                <Truck className="mr-0.5 h-2.5 w-2.5" /> Flat
                              </>
                            )}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </section>

          {/* ╔═══════════════════════════════════════════════╗ */}
          {/* ║ Section 02: Equipment Specs                   ║ */}
          {/* ╚═══════════════════════════════════════════════╝ */}
          <section
            aria-disabled={!selectedEquipment || undefined}
            className={`transition-all duration-300 ${
              !selectedEquipment ? "pointer-events-none opacity-40 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <SectionHeader num={2} title={t("equipmentSpecs")} />

            {!selectedEquipment ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {t("selectEquipmentHint")}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Size input for variable pricing */}
                {needsSize && (
                  <div>
                    <Label htmlFor="equipment-size" className="text-sm">
                      {selectedEquipment.packing_unit === "per_row" &&
                        t("numberOfRows")}
                      {selectedEquipment.packing_unit === "per_foot" &&
                        t("widthInFeet")}
                      {selectedEquipment.packing_unit === "per_shank" &&
                        t("numberOfShanks")}
                      {selectedEquipment.packing_unit === "per_bottom" &&
                        t("numberOfBottoms")}
                    </Label>
                    <Input
                      id="equipment-size"
                      type="number"
                      min={1}
                      value={equipmentSize ?? ""}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        setEquipmentSize(
                          !isNaN(parsed) && parsed > 0 && parsed <= 999
                            ? parsed
                            : e.target.value ? null : null
                        );
                      }}
                      placeholder={t("enterSize")}
                      className="mt-1.5 max-w-40"
                    />
                  </div>
                )}

                {/* Packing cost preview */}
                <div className="rounded-xl bg-muted p-4">
                  {isFlatrack ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {t("packingIncludedInSea")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {t("flatrackPackingNote")}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {t("estimatedPackingCost")}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger aria-label={t("packingCostInfo")}>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {t("packingTooltip", { container: containerLabel.toLowerCase() })}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="font-mono text-xl font-bold text-primary">
                        {needsSize && equipmentSize && equipmentSize > 0
                          ? formatDollar(
                              selectedEquipment.packing_cost * equipmentSize
                            )
                          : needsSize
                            ? `${formatDollar(selectedEquipment.packing_cost)}/${unitLabel ? unitLabel.slice(0, -1) : "unit"}`
                            : formatDollar(selectedEquipment.packing_cost)}
                      </div>
                      {needsSize && equipmentSize && equipmentSize > 0 && (
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {formatDollar(selectedEquipment.packing_cost)}/
                          {unitLabel ? unitLabel.slice(0, -1) : "unit"} ×{" "}
                          {equipmentSize} {unitLabel}
                        </div>
                      )}
                    </>
                  )}
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {selectedEquipment.container_type === "fortyhc" ? (
                        <>
                          <Ship className="mr-1 h-3 w-3" /> 40&apos; High Cube
                        </>
                      ) : (
                        <>
                          <Truck className="mr-1 h-3 w-3" /> Flat Rack
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ╔═══════════════════════════════════════════════╗ */}
          {/* ║ Section 03: Shipping Route                    ║ */}
          {/* ╚═══════════════════════════════════════════════╝ */}
          <section
            aria-disabled={!step2Done || undefined}
            className={`transition-all duration-300 ${
              !step2Done ? "pointer-events-none opacity-40 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            <SectionHeader num={3} title={t("shippingRoute")} />

            {!step2Done ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {t("completeEquipmentHint")}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Country */}
                  <div>
                    <Label
                      htmlFor="dest-country"
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      {t("destinationCountry")}
                    </Label>
                    <select
                      id="dest-country"
                      value={destinationCountry}
                      onChange={(e) => {
                        const country = e.target.value;
                        setDestinationCountry(country);
                        if (country && selectedEquipment) {
                          trackCalcFunnel("step", {
                            step_number: "3",
                            step_name: "destination",
                            destination_country: country,
                          });
                          trackCalcFunnel("complete", {
                            equipment_type: selectedEquipment.display_name_en,
                            destination_country: country,
                            container_type: selectedEquipment.container_type,
                          });
                        }
                      }}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base md:text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">{t("selectCountry")}</option>
                      {data.countries.map((code) => (
                        <option key={code} value={code}>
                          {COUNTRY_NAMES[code] ?? code}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ZIP */}
                  <div>
                    <Label
                      htmlFor="zip-code"
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <Package className="h-3.5 w-3.5 text-primary" />
                      {t("usPickupZip")}
                      <span className="text-xs text-muted-foreground">
                        {tc("optional")}
                      </span>
                    </Label>
                    <Input
                      id="zip-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={zipCode}
                      onChange={(e) =>
                        setZipCode(
                          e.target.value.replace(/\D/g, "").slice(0, 5)
                        )
                      }
                      placeholder={t("zipPlaceholder")}
                      className="mt-1.5"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("zipHint")}
                    </p>
                  </div>
                </div>

                {/* Route preview */}
                {destinationCountry && selectedEquipment && (
                  <div className="rounded-xl bg-muted p-4 text-sm">
                    <div className="font-semibold text-foreground">
                      {t("shippingRouteLabel")}
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {selectedEquipment.container_type === "fortyhc" ? (
                        <>
                          {zipCode ? `ZIP ${zipCode}` : t("pickupLocation")} →
                          Albion, IA {t("packingLabel")} → Chicago, IL {t("railLabel")} →{" "}
                          {COUNTRY_NAMES[destinationCountry] ??
                            destinationCountry}
                        </>
                      ) : (
                        <>
                          {zipCode ? `ZIP ${zipCode}` : t("pickupLocation")} →
                          {t("nearestUSPort")} →{" "}
                          {COUNTRY_NAMES[destinationCountry] ??
                            destinationCountry}
                        </>
                      )}
                    </div>
                    {preview && (
                      <div className="mt-2 font-mono text-lg font-bold text-primary">
                        {t("est")} {formatDollar(preview.estimatedTotal)}
                        {preview.totalExcludesInland && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            {t("exclInland")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive route globe */}
                <div className="mt-4 overflow-hidden rounded-xl">
                  <RouteGlobe
                    originPort={preview?.originPort ?? null}
                    destinationPort={preview?.destinationPort ?? null}
                    destinationCountry={destinationCountry || null}
                    containerType={selectedEquipment?.container_type ?? null}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>

        {/* ─── RIGHT COLUMN: Estimate sidebar (desktop) ────────── */}
        <div className="hidden flex-[2] lg:block">
          <div className="sticky top-24">
            <CalculatorEstimateCard {...estimateCardProps} />
          </div>
        </div>
      </div>

      {/* ─── MOBILE: Sticky bottom bar + Sheet ──────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          {/* Bottom bar */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 shadow-2xl">
            <SheetTrigger
              aria-label={t("viewEstimateDetails")}
              className="flex items-center gap-2 text-white"
            >
              {preview ? (
                <>
                  <span className="text-xs text-slate-400">{t("est")}</span>
                  <span className="font-mono text-lg font-bold">
                    {formatDollar(preview.estimatedTotal)}
                  </span>
                </>
              ) : selectedEquipment ? (
                <span className="text-sm text-slate-400">
                  {t("selectDestinationForEstimate")}
                </span>
              ) : (
                <span className="text-sm text-slate-400">
                  {t("selectEquipmentToBegin")}
                </span>
              )}
            </SheetTrigger>
            <Button
              size="sm"
              className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              disabled={!isComplete}
              onClick={() => setMobileSheetOpen(true)}
            >
              {result?.success ? t("viewEstimate") : t("bookThisFreight")}
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Sheet content */}
          <SheetContent
            side="bottom"
            className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-0"
            showCloseButton={true}
          >
            <SheetHeader className="bg-muted px-5 py-4">
              <SheetTitle>{t("yourFreightEstimate")}</SheetTitle>
            </SheetHeader>
            <div className="p-5">
              <CalculatorEstimateCard {...estimateCardProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom spacing for mobile sticky bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Section header with numbered circle
// ═══════════════════════════════════════════════════════════════════════════
function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {String(num).padStart(2, "0")}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
    </div>
  );
}
