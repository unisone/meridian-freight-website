"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
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
  Send,
  Sprout,
  Tractor,
  TreePine,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { track as vercelTrack } from "@vercel/analytics";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { CONTACT } from "@/lib/constants";
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

// ─── Cargo type options ──────────────────────────────────────────────────────

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

// ─── Props ───────────────────────────────────────────────────────────────────

interface ScheduleBookingFormProps {
  container: ContainerWithPendingCount;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ScheduleBookingForm({
  container,
  onSuccess,
  onCancel,
}: ScheduleBookingFormProps) {
  const t = useTranslations("ScheduleBooking");

  // ─── State ─────────────────────────────────────────────
  const [selectedCargoTypes, setSelectedCargoTypes] = useState<string[]>([]);
  const [cargoDescription, setCargoDescription] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingActionResult | null>(null);
  const submittingRef = useRef(false);

  const hasOtherOnly = selectedCargoTypes.length === 1 && selectedCargoTypes[0] === "other";

  const totalEstimatedCbm = useMemo(() => {
    return selectedCargoTypes.reduce((sum, id) => {
      const type = CARGO_TYPES.find((t) => t.id === id);
      return sum + (type?.estimatedCbm ?? 0);
    }, 0);
  }, [selectedCargoTypes]);

  const availableCbm = container.available_cbm ?? 0;

  // ─── Submit ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    // Honeypot
    if (honeypot) {
      setResult({ success: true });
      setIsSubmitting(false);
      submittingRef.current = false;
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const payload: BookingRequestData = {
      name,
      email,
      phone,
      cargoDescription: (() => {
        const labels = selectedCargoTypes
          .map((id) => t(`cargo.${id}`))
          .join(", ");
        return cargoDescription ? `[${labels}] ${cargoDescription}` : labels;
      })(),
      containerId: container.id,
      projectNumber: container.project_number,
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

        trackGA4Event("generate_lead", {
          event_category: "shared_shipping",
          event_label: "booking_request",
          value: 300,
          currency: "USD",
        });

        vercelTrack("generate_lead", {
          source: "booking_request",
          value: 300,
        });

        const eventId = res.eventId ?? generateEventId();
        trackPixelEvent(
          "Lead",
          { content_name: "shared_shipping_booking_request" },
          eventId,
        );

        trackBookingFunnel("request_submit", {
          project_number: container.project_number,
          destination: container.destination,
        });

        onSuccess?.();
      } else {
        const errorKey = res.error === "CONTAINER_UNAVAILABLE" ? "errorContainerUnavailable" : "errorDefault";
        setError(t(errorKey));
      }
    } catch {
      setError(t("errorDefault"));
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }

  // ─── Success state ─────────────────────────────────────
  if (result?.success) {
    return (
      <div className="flex flex-col items-center px-4 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <h4 className="mt-3 text-base font-semibold text-foreground">
          {t("requestSubmitted")}
        </h4>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t.rich("successMessage", {
            projectNum: container.project_number,
            destName: container.destination,
            bold: (chunks) => (
              <span className="font-medium text-foreground">{chunks}</span>
            ),
          })}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("successFollowUp")}
        </p>
        <Separator className="my-4 w-full" />
        <div className="flex items-center gap-3">
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContactClick("whatsapp", "booking_success")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            {t("chatOnWhatsApp")}
          </a>
          <span className="text-muted-foreground">{t("or")}</span>
          <a
            href={CONTACT.emailHref}
            onClick={() => trackContactClick("email", "booking_success")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {CONTACT.email}
          </a>
        </div>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 px-1 ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
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

      {/* Cargo type chips — horizontal scrollable */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {t("whatAreYouShipping")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CARGO_TYPES.map((type) => {
            const isSelected = selectedCargoTypes.includes(type.id);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setSelectedCargoTypes((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== type.id)
                      : [...prev, type.id],
                  );
                }}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 min-h-[44px] sm:min-h-0 sm:py-1 sm:px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
                aria-pressed={isSelected}
              >
                <type.icon className="h-3 w-3" />
                {t(`cargo.${type.id}`)}
              </button>
            );
          })}
        </div>

        {/* Fit indicator */}
        {totalEstimatedCbm > 0 && availableCbm > 0 && (
          <p
            className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${
              totalEstimatedCbm <= availableCbm
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {totalEstimatedCbm <= availableCbm ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                {t("cargoFits", { cbm: totalEstimatedCbm })}
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3" />
                {t("cargoMayNotFit", { cbm: totalEstimatedCbm })}
              </>
            )}
          </p>
        )}

        {/* Combine warning */}
        {selectedCargoTypes.includes("combine") && (
          <p className="mt-1.5 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1.5 text-[11px] text-amber-700">
            {t.rich("combineWarning", {
              calcLink: (chunks) => (
                <Link
                  href="/pricing/calculator"
                  className="font-medium underline underline-offset-2"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        )}
      </div>

      {/* Details textarea */}
      {selectedCargoTypes.length > 0 && (
        <div>
          <Label htmlFor={`booking-cargo-${container.id}`} className="text-xs">
            {hasOtherOnly ? (
              <>
                {t("describeYourCargo")}{" "}
                <span className="text-destructive">*</span>
              </>
            ) : (
              t("addDetails")
            )}
          </Label>
          <Textarea
            id={`booking-cargo-${container.id}`}
            placeholder={
              hasOtherOnly
                ? t("placeholderOther")
                : t("placeholderDetails")
            }
            className="mt-1 text-sm"
            rows={2}
            value={cargoDescription}
            onChange={(e) => setCargoDescription(e.target.value)}
          />
        </div>
      )}

      <Separator />

      {/* Contact fields */}
      <p className="text-xs font-medium text-muted-foreground">
        {t("yourInfo")}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor={`booking-name-${container.id}`} className="text-xs">
            {t("fullName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`booking-name-${container.id}`}
            name="name"
            required
            placeholder={t("placeholderName")}
            className="mt-1 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor={`booking-email-${container.id}`} className="text-xs">
            {t("email")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`booking-email-${container.id}`}
            name="email"
            type="email"
            required
            placeholder={t("placeholderEmail")}
            className="mt-1 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor={`booking-phone-${container.id}`} className="text-xs">
            {t("phoneWhatsApp")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`booking-phone-${container.id}`}
            name="phone"
            type="tel"
            required
            placeholder={t("placeholderPhone")}
            className="mt-1 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {t("submitRequest")}
              <ArrowRight className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("collapse")}
          </Button>
        )}
      </div>

      {/* Terms */}
      <p className="text-[11px] text-muted-foreground">
        {t.rich("termsAgreement", {
          terms: (chunks) => (
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {chunks}
            </a>
          ),
          privacy: (chunks) => (
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </form>
  );
}
