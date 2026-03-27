"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Droplets,
  FileText,
  Grip,
  HardHat,
  Leaf,
  Loader2,
  MessageCircle,
  Mountain,
  Package,
  Phone,
  Send,
  Ship,
  Sprout,
  Tractor,
  TreePine,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { track as vercelTrack } from "@vercel/analytics";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { CONTACT } from "@/lib/constants";
import { countryFlag, transitDays } from "@/lib/container-display";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import type { BookingRequestData } from "@/lib/schemas";
import {
  submitBookingRequest,
  type BookingActionResult,
} from "@/app/actions/booking";
import {
  trackGA4Event,
  trackPixelEvent,
  trackBookingFunnel,
  trackContactClick,
  generateEventId,
} from "@/lib/tracking";

import { StaleDataBanner } from "./stale-data-banner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingWizardProps {
  containers: ContainerWithPendingCount[];
  lastSyncTime: string | null;
}

interface Destination {
  code: string;
  name: string;
  count: number;
  nextDeparture: string;
}

// ─── Helpers (module-level, not exported) ─────────────────────────────────────

/** Format an ISO date string as "May 1" */
function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Format an ISO date string as "May 1, 2026" */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Days until departure (used for departure label logic) */
function daysUntilDeparture(isoDate: string): number | null {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ─── Cargo type options for Step 1 ────────────────────────────────────────────

const CARGO_TYPES: Array<{
  id: string;
  icon: LucideIcon;
  estimatedCbm: number;
}> = [
  { id: "header", icon: Grip, estimatedCbm: 20 },
  { id: "tractor", icon: Tractor, estimatedCbm: 38 },
  { id: "combine", icon: Wheat, estimatedCbm: 99 },
  { id: "sprayer", icon: Droplets, estimatedCbm: 45 },
  { id: "planter", icon: Sprout, estimatedCbm: 76 },
  { id: "seeder", icon: Leaf, estimatedCbm: 76 },
  { id: "tillage", icon: Mountain, estimatedCbm: 20 },
  { id: "construction", icon: HardHat, estimatedCbm: 30 },
  { id: "forestry", icon: TreePine, estimatedCbm: 40 },
  { id: "parts", icon: Package, estimatedCbm: 5 },
  { id: "other", icon: FileText, estimatedCbm: 0 },
];

// Approximate CBM for common cargo — used for "what fits" hints on containers
const CARGO_CBM_EXAMPLES = [
  { key: "pallets", cbmEach: 2 },
  { key: "headers", cbmEach: 20 },
  { key: "tractors", cbmEach: 38 },
  { key: "tillage", cbmEach: 20 },
] as const;

// ─── Progress bar steps (module-level constant) ──────────────────────────────

const WIZARD_STEPS = [
  { num: 1, id: "what" },
  { num: 2, id: "where" },
  { num: 3, id: "select" },
  { num: 4, id: "submit" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function ShippingWizard({
  containers,
  lastSyncTime,
}: ShippingWizardProps) {
  const t = useTranslations("ShippingWizard");

  // ─── Step state ────────────────────────────────────────
  const [selectedCargoTypes, setSelectedCargoTypes] = useState<string[]>([]);
  const [cargoDescription, setCargoDescription] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] =
    useState<ContainerWithPendingCount | null>(null);

  // ─── Form state (Step 4: contact info) ────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingActionResult | null>(null);

  // ─── Refs ──────────────────────────────────────────────
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false); // prevent double submit

  // ─── Boolean gates ─────────────────────────────────────
  const hasOtherOnly = selectedCargoTypes.length === 1 && selectedCargoTypes[0] === "other";
  const step1Done = selectedCargoTypes.length > 0 && (
    !hasOtherOnly || cargoDescription.trim().length >= 5
  );

  // Total estimated CBM from selected cargo types
  const totalEstimatedCbm = useMemo(() => {
    return selectedCargoTypes.reduce((sum, id) => {
      const type = CARGO_TYPES.find(t => t.id === id);
      return sum + (type?.estimatedCbm ?? 0);
    }, 0);
  }, [selectedCargoTypes]);
  const step2Done = step1Done && selectedCountry !== null;
  const step3Done = step2Done && selectedContainer !== null;
  const step4Done = result?.success === true;

  // ─── Derived: unique destinations ──────────────────────
  const destinations = useMemo<Destination[]>(() => {
    const countryMap = new Map<string, { name: string; count: number; nextDeparture: string }>();
    for (const c of containers) {
      if (c.destination_country && c.status === "available") {
        const existing = countryMap.get(c.destination_country);
        if (existing) {
          existing.count++;
          if (c.departure_date < existing.nextDeparture) {
            existing.nextDeparture = c.departure_date;
          }
        } else {
          // Extract country name from destination (e.g. "Almaty, Kazakhstan" -> "Kazakhstan")
          const parts = c.destination.split(",").map((s) => s.trim());
          const countryName =
            parts.length > 1 ? parts[parts.length - 1] : c.destination;
          countryMap.set(c.destination_country, {
            name: countryName,
            count: 1,
            nextDeparture: c.departure_date,
          });
        }
      }
    }
    return Array.from(countryMap.entries())
      .map(([code, { name: countryName, count, nextDeparture }]) => ({
        code,
        name: countryName,
        count,
        nextDeparture,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [containers]);

  // ─── Derived: filtered containers ──────────────────────
  const matchingContainers = useMemo(() => {
    if (!selectedCountry) return [];
    return containers
      .filter(
        (c) =>
          c.destination_country === selectedCountry && c.status === "available"
      )
      .sort(
        (a, b) =>
          new Date(a.departure_date).getTime() -
          new Date(b.departure_date).getTime()
      );
  }, [containers, selectedCountry]);

  // ─── Derived: selected destination name ────────────────
  const selectedDestinationName = useMemo(() => {
    if (!selectedCountry) return "";
    const dest = destinations.find((d) => d.code === selectedCountry);
    return dest?.name ?? selectedCountry;
  }, [selectedCountry, destinations]);

  // ─── Scroll behavior ──────────────────────────────────
  const getScrollBehavior = (): ScrollBehavior =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";

  useEffect(() => {
    if (step1Done && step2Ref.current) {
      step2Ref.current.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
    }
  }, [step1Done]);

  useEffect(() => {
    if (step2Done && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
    }
  }, [step2Done, selectedCountry]);

  useEffect(() => {
    if (step3Done && step4Ref.current) {
      step4Ref.current.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
    }
  }, [step3Done]);

  // ─── Track destination selection ───────────────────────
  useEffect(() => {
    if (selectedCountry) {
      trackBookingFunnel("filter", {
        destination_country: selectedCountry,
      });
    }
  }, [selectedCountry]);

  // ─── Reset helpers ─────────────────────────────────────
  function resetContactState() {
    setName("");
    setEmail("");
    setPhone("");
    setHoneypot("");
    setError("");
    setResult(null);
  }

  function handleSelectCountry(code: string) {
    if (code === selectedCountry) return;
    setSelectedCountry(code);
    setSelectedContainer(null);
    resetContactState();
  }

  function handleResetToStep2() {
    setSelectedCountry(null);
    setSelectedContainer(null);
    resetContactState();
  }

  function handleSelectContainer(container: ContainerWithPendingCount) {
    setSelectedContainer(container);
    resetContactState();
    trackBookingFunnel("request_start", {
      project_number: container.project_number,
      destination: container.destination,
    });
  }

  function handleSubmitAnother() {
    setSelectedContainer(null);
    resetContactState();
  }

  // ─── Form submission ───────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedContainer) return;
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    // Honeypot check — if filled, fake success
    if (honeypot) {
      setResult({ success: true });
      setIsSubmitting(false);
      submittingRef.current = false;
      return;
    }

    // Capture UTM params from URL
    const params = new URLSearchParams(window.location.search);

    const payload: BookingRequestData = {
      name,
      email,
      phone,
      cargoDescription: (() => {
        const labels = selectedCargoTypes
          .map(id => t(`cargo.${id}`))
          .join(", ");
        return cargoDescription
          ? `[${labels}] ${cargoDescription}`
          : labels;
      })(),
      containerId: selectedContainer.id,
      projectNumber: selectedContainer.project_number,
      website: honeypot,
      source_page: window.location.href,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    };

    try {
      const res = await submitBookingRequest(payload);

      if (res.success) {
        setResult(res);

        // Track GA4 generate_lead event
        trackGA4Event("generate_lead", {
          event_category: "shared_shipping",
          event_label: "booking_request",
          value: 300,
          currency: "USD",
        });

        // Track Vercel Analytics
        vercelTrack("generate_lead", {
          source: "booking_request",
          value: 300,
        });

        // Fire Pixel event with eventId for CAPI deduplication
        const eventId = res.eventId ?? generateEventId();
        trackPixelEvent(
          "Lead",
          { content_name: "shared_shipping_booking_request" },
          eventId
        );

        // Track booking funnel completion
        trackBookingFunnel("request_submit", {
          project_number: selectedContainer.project_number,
          destination: selectedContainer.destination,
        });
      } else {
        setError(res.error || t("errorDefault"));
      }
    } catch {
      setError(t("errorDefault"));
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const completedSteps =
    (step1Done ? 1 : 0) +
    (step2Done ? 1 : 0) +
    (step3Done ? 1 : 0) +
    (step4Done ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Stale data banner */}
      <StaleDataBanner lastSyncTime={lastSyncTime} hasContainers={containers.length > 0} />

      {/* Progress bar — matches calculator-progress-bar pattern */}
      <div className="mb-4">
        <div className="mb-2 flex">
          {WIZARD_STEPS.map((step) => (
            <div
              key={step.num}
              className={`flex-1 text-xs font-medium uppercase tracking-wider ${
                step.num <= completedSteps
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <span className="hidden sm:inline">{t("stepPrefix", { num: step.num })}</span>{t(`step.${step.id}`)}
            </div>
          ))}
        </div>
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={completedSteps}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={t("progressLabel", { completed: completedSteps })}
        >
          {WIZARD_STEPS.map((step) => (
            <div
              key={step.num}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step.num <= completedSteps ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {t("intro")}
      </p>

      {/* ╔═══════════════════════════════════════════════╗ */}
      {/* ║ Step 01: What are you shipping?               ║ */}
      {/* ╚═══════════════════════════════════════════════╝ */}
      <section>
        <SectionHeader num={1} title={t("section1")} />

        {/* Cargo type grid — multi-select */}
        <p className="mt-2 text-xs text-muted-foreground">{t("selectAllThatApply")}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CARGO_TYPES.map((type) => {
            const isSelected = selectedCargoTypes.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedCargoTypes(prev =>
                    isSelected
                      ? prev.filter(id => id !== type.id)
                      : [...prev, type.id]
                  );
                }}
                className={`relative flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/40 cursor-pointer"
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    ✓
                  </span>
                )}
                <type.icon className={`h-6 w-6 ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`} />
                <span className={`text-xs font-medium leading-tight ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}>
                  {t(`cargo.${type.id}`)}
                </span>
                {type.estimatedCbm > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {t("estimatedCbm", { cbm: type.estimatedCbm })}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Estimated total CBM */}
        {totalEstimatedCbm > 0 && (
          <div className="mt-3 space-y-0.5">
            <p className="text-sm text-muted-foreground">
              {t("estimatedSpaceNeeded")}{" "}
              <span className="font-semibold text-foreground">{t("estimatedCbm", { cbm: totalEstimatedCbm })}</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              {t("estimatedSpaceApprox")}
            </p>
          </div>
        )}

        {/* Full container note for oversized equipment */}
        {selectedCargoTypes.includes("combine") && (
          <p className="mt-2 flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
            ⚠️ {t.rich("combineWarning", {
              calcLink: (chunks) => (
                <a href="/pricing/calculator" className="font-medium underline underline-offset-2">
                  {chunks}
                </a>
              ),
            })}
          </p>
        )}

        {/* Details textarea */}
        {selectedCargoTypes.length > 0 && (
          <div className="mt-4 max-w-xl">
            <Label htmlFor="wizard-cargo">
              {hasOtherOnly ? (
                <>{t("describeYourCargo")} <span className="text-destructive">*</span></>
              ) : (
                t("addDetails")
              )}
            </Label>
            <Textarea
              id="wizard-cargo"
              placeholder={hasOtherOnly ? t("placeholderOther") : t("placeholderDetails")}
              className="mt-1.5"
              rows={2}
              value={cargoDescription}
              onChange={(e) => setCargoDescription(e.target.value)}
            />
          </div>
        )}
      </section>

      {/* ╔═══════════════════════════════════════════════╗ */}
      {/* ║ Step 02: Where are you shipping?              ║ */}
      {/* ╚═══════════════════════════════════════════════╝ */}
      <section
        ref={step2Ref}
        className={`transition-all duration-300 ${
          !step1Done
            ? "pointer-events-none opacity-40 translate-y-2"
            : "opacity-100 translate-y-0"
        }`}
      >
        <SectionHeader num={2} title={t("section2")} />

        {destinations.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t.rich("noContainersNow", {
              emailAddress: CONTACT.email,
              whatsapp: (chunks) => (
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2"
                  onClick={() => trackContactClick("whatsapp", "wizard_no_containers")}
                >
                  {chunks}
                </a>
              ),
              email: (chunks) => (
                <a
                  href={CONTACT.emailHref}
                  className="font-medium text-primary underline underline-offset-2"
                  onClick={() => trackContactClick("email", "wizard_no_containers")}
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {destinations.map((dest) => {
              const isSelected = selectedCountry === dest.code;
              return (
                <button
                  key={dest.code}
                  onClick={() => handleSelectCountry(dest.code)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-4 text-center transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary hover:bg-primary/5 cursor-pointer"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {countryFlag(dest.code)}
                  </span>
                  <span
                    className={`text-sm font-medium leading-tight ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {dest.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(() => {
                      const days = daysUntilDeparture(dest.nextDeparture);
                      if (days === null) return "";
                      if (days <= 7) return t("departingSoon");
                      return t("departsDate", { date: formatShortDate(dest.nextDeparture) });
                    })()}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ╔═══════════════════════════════════════════════╗ */}
      {/* ║ Step 03: Available containers                 ║ */}
      {/* ╚═══════════════════════════════════════════════╝ */}
      {step2Done && (
      <section
        ref={step3Ref}
        className="animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <SectionHeader num={3} title={t("section3")} />

          <div className="mt-4 space-y-3">
            {/* Heading with flag and count */}
            <p className="text-sm text-muted-foreground">
              {countryFlag(selectedCountry)}{" "}
              {t("containerCount", { count: matchingContainers.length, destination: selectedDestinationName })}
            </p>

            {matchingContainers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t.rich("noContainersFor", {
                    destination: selectedDestinationName,
                    contact: (chunks) => (
                      <a
                        href={CONTACT.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline underline-offset-2"
                        onClick={() =>
                          trackContactClick("whatsapp", "wizard_no_matching")
                        }
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingContainers.map((container) => {
                  const isSelected =
                    selectedContainer?.id === container.id;
                  const transit = transitDays(
                    container.departure_date,
                    container.eta_date
                  );
                  const availableCbm = container.available_cbm ?? 0;
                  const totalCbm =
                    container.total_capacity_cbm > 0
                      ? container.total_capacity_cbm
                      : 76;

                  const fillPercent = totalCbm > 0
                    ? Math.round((1 - availableCbm / totalCbm) * 100)
                    : 100;
                  const availablePercent = 100 - fillPercent;
                  const barColor = fillPercent >= 80 ? "bg-amber-500" : "bg-primary";

                  return (
                    <Card
                      key={container.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                          : "hover:border-primary/40 hover:shadow-sm"
                      }`}
                      onClick={() => !isSelected && handleSelectContainer(container)}
                    >
                      <CardContent className="px-5 py-5 space-y-4">
                        {/* Top row: dates + transit + type badge */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              {t("departsLabel", { date: formatShortDate(container.departure_date) })}
                              {container.eta_date && (
                                <>
                                  <span className="text-muted-foreground">&rarr;</span>
                                  {t("arrivesLabel", { date: formatShortDate(container.eta_date) })}
                                </>
                              )}
                            </div>
                            {transit !== null && (
                              <p className="text-xs text-muted-foreground">
                                {t("transitDays", { days: transit })}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[11px]">
                              <Ship className="mr-1 h-3 w-3" />
                              {container.container_type}
                            </Badge>
                            {isSelected && (
                              <Badge className="bg-primary text-primary-foreground">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                {t("selected")}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Capacity bar with estimated cargo overlay */}
                        <div className="space-y-2">
                          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                            {/* Already booked space */}
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${barColor}`}
                              style={{ width: `${fillPercent}%` }}
                            />
                            {/* Customer's estimated cargo (green overlay) */}
                            {totalEstimatedCbm > 0 && (
                              <div
                                className={`absolute inset-y-0 rounded-full transition-all duration-500 ease-out ${
                                  totalEstimatedCbm <= availableCbm
                                    ? "bg-emerald-400/70"
                                    : "bg-red-400/70"
                                }`}
                                style={{
                                  left: `${fillPercent}%`,
                                  width: `${Math.min(
                                    (totalEstimatedCbm / totalCbm) * 100,
                                    100 - fillPercent
                                  )}%`,
                                }}
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              <span className="font-semibold text-foreground">
                                {t("cbmAvailable", { cbm: availableCbm })}
                              </span>{" "}
                              {t("availablePercent", { percent: availablePercent })}
                            </span>
                            <span className="text-muted-foreground">
                              {t("cbmTotal", { cbm: totalCbm })}
                            </span>
                          </div>

                          {/* Fit indicator */}
                          {totalEstimatedCbm > 0 ? (
                            totalEstimatedCbm <= availableCbm ? (
                              <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" />
                                {t("cargoFits", { cbm: totalEstimatedCbm })}
                              </p>
                            ) : (
                              <p className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                                ⚠️ {t("cargoMayNotFit", { cbm: totalEstimatedCbm })}
                              </p>
                            )
                          ) : availableCbm > 0 ? (
                            <p className="text-[11px] text-muted-foreground italic">
                              {t("fitsApprox", {
                                hint: (() => {
                                  const fits: string[] = [];
                                  for (const item of CARGO_CBM_EXAMPLES) {
                                    const count = Math.floor(availableCbm / item.cbmEach);
                                    if (count >= 1) fits.push(t(`whatFits.${item.key}`, { count }));
                                  }
                                  return fits.length === 0
                                    ? t("whatFits.smallItems")
                                    : fits.slice(0, 2).join(` ${t("or")} `);
                                })(),
                              })}
                            </p>
                          ) : null}
                        </div>

                        {/* Demand indicator */}
                        {container.pending_count > 0 && (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                            {t("pendingRequests", { count: container.pending_count })}
                          </p>
                        )}

                        {/* CTA */}
                        {!isSelected && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectContainer(container);
                            }}
                          >
                            {t("selectThisContainer")}
                            <ArrowRight className="ml-1.5 h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Back link */}
            <button
              onClick={handleResetToStep2}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              {t("chooseDifferentDestination")}
            </button>
          </div>
      </section>
      )}

      {/* ╔═══════════════════════════════════════════════╗ */}
      {/* ║ Step 04: Your info / Confirmation              ║ */}
      {/* ╚═══════════════════════════════════════════════╝ */}
      {step3Done && (
      <section
        ref={step4Ref}
        className="animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <SectionHeader num={4} title={t("section4")} />

        {step4Done && selectedContainer ? (
          /* ─── Success / Confirmation ─── */
          <div className="mt-4">
            <Card>
              <CardContent className="flex flex-col items-center px-6 py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {t("requestSubmitted")}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {t.rich("successMessage", {
                    projectNum: selectedContainer.project_number,
                    destName: selectedDestinationName,
                    bold: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
                  })}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t("successFollowUp")}
                </p>

                <Separator className="my-6 w-full" />

                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackContactClick("whatsapp", "wizard_success")
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t("chatOnWhatsApp")}
                  </a>

                  <span className="hidden text-muted-foreground sm:inline">
                    {t("or")}
                  </span>

                  <a
                    href={CONTACT.emailHref}
                    onClick={() =>
                      trackContactClick("email", "wizard_success")
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {CONTACT.email}
                  </a>
                </div>

                <Button
                  variant="outline"
                  className="mt-6 w-full sm:w-auto"
                  onClick={handleSubmitAnother}
                >
                  {t("submitAnother")}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : selectedContainer ? (
          /* ─── Request form ─── */
          <div className="mt-4 space-y-4">
            {/* Container summary */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
              <p className="text-sm font-semibold leading-snug">
                <span className="mr-1.5" aria-hidden="true">
                  {countryFlag(selectedContainer.destination_country)}
                </span>
                {selectedContainer.origin}
                <span className="mx-1.5 text-muted-foreground">&rarr;</span>
                {selectedContainer.destination}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  {t("formDeparts")}{" "}
                  <span className="font-medium text-foreground">
                    {formatDate(selectedContainer.departure_date)}
                  </span>
                </span>
                {selectedContainer.eta_date && (
                  <span>
                    {t("formArrives")}{" "}
                    <span className="font-medium text-foreground">
                      {formatDate(selectedContainer.eta_date)}
                    </span>
                  </span>
                )}
                <span>
                  {t("formAvailable")}{" "}
                  <span className="font-medium text-foreground">
                    {t("cbmAvailable", { cbm: selectedContainer.available_cbm ?? 0 })}
                  </span>
                </span>
                <span>{selectedContainer.container_type}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("formRef", { ref: selectedContainer.project_number })}
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className={`space-y-4 ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
            >
              {/* Honeypot */}
              <div className="sr-only" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="wizard-name">
                  {t("fullName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="wizard-name"
                  name="name"
                  required
                  placeholder={t("placeholderName")}
                  className="mt-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="wizard-email">
                  {t("email")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="wizard-email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("placeholderEmail")}
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <Label htmlFor="wizard-phone">
                  {t("phoneWhatsApp")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="wizard-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder={t("placeholderPhone")}
                  className="mt-1.5"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Cargo summary (from Step 1, read-only) */}
              <div className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">{t("formCargo")}</p>
                <p className="text-sm text-foreground">
                  {selectedCargoTypes
                    .map(id => t(`cargo.${id}`))
                    .join(", ")}
                  {cargoDescription ? ` — ${cargoDescription}` : ""}
                  {totalEstimatedCbm > 0 && (
                    <span className="text-muted-foreground"> (~{totalEstimatedCbm} CBM)</span>
                  )}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("submitRequest")}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </>
                )}
              </Button>

              {/* Change container link */}
              <button
                type="button"
                onClick={() => {
                  setSelectedContainer(null);
                  resetContactState();
                }}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-3 w-3" />
                {t("chooseDifferentContainer")}
              </button>

              {/* Terms text */}
              <p className="text-center text-xs text-muted-foreground">
                {t.rich("termsAgreement", {
                  terms: (chunks) => (
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                      {chunks}
                    </a>
                  ),
                  privacy: (chunks) => (
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </form>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("selectContainerPrompt")}
          </p>
        )}
      </section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section header with numbered circle (matches calculator-wizard pattern)
// ═══════════════════════════════════════════════════════════════════════════════
function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {String(num).padStart(2, "0")}
      </div>
      <h3 className="text-lg font-bold text-foreground">
        {title}
      </h3>
    </div>
  );
}
