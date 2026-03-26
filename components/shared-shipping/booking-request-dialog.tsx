"use client";

import { useState } from "react";
import { Loader2, MessageCircle, CheckCircle2, Send } from "lucide-react";
import { track as vercelTrack } from "@vercel/analytics";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT } from "@/lib/constants";
import { countryFlag } from "@/lib/container-display";
import {
  trackGA4Event,
  trackPixelEvent,
  generateEventId,
  trackContactClick,
} from "@/lib/tracking";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";
import type { BookingRequestData } from "@/lib/schemas";

// Server Action will be created in app/actions/booking.ts
// TODO: Create the server action — this import will error until then
import { submitBookingRequest } from "@/app/actions/booking";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookingRequestDialogProps {
  container: ContainerWithPendingCount | null; // null = closed
  onClose: () => void;
}

type FormState = "form" | "submitting" | "success" | "error";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format an ISO date string as "Apr 15, 2026" */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "\u2014";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BookingRequestDialog({
  container,
  onClose,
}: BookingRequestDialogProps) {
  const [formState, setFormState] = useState<FormState>("form");
  const [error, setError] = useState("");

  // Form field state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cargoDescription, setCargoDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const isOpen = container !== null;
  const isSubmitting = formState === "submitting";

  // Reset form state when dialog closes
  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
      // Reset after close animation completes
      setTimeout(() => {
        setFormState("form");
        setError("");
        setName("");
        setEmail("");
        setPhone("");
        setCargoDescription("");
        setHoneypot("");
      }, 200);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!container) return;

    setFormState("submitting");
    setError("");

    // Honeypot check — if filled, fake success
    if (honeypot) {
      setFormState("success");
      return;
    }

    // Capture UTM params from URL
    const params = new URLSearchParams(window.location.search);

    const payload: BookingRequestData = {
      name,
      email,
      phone,
      cargoDescription,
      containerId: container.id,
      projectNumber: container.project_number,
      website: honeypot,
      source_page: window.location.href,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    };

    try {
      const result = await submitBookingRequest(payload);

      if (result.success) {
        setFormState("success");

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
        const eventId = result.eventId ?? generateEventId();
        trackPixelEvent(
          "Lead",
          { content_name: "shared_shipping_booking_request" },
          eventId
        );
      } else {
        setError(
          result.error ||
            // TODO: i18n — t("bookingDialog.errorDefault")
            "Something went wrong. Please try again or contact us via WhatsApp."
        );
        setFormState("error");
      }
    } catch {
      setError(
        // TODO: i18n — t("bookingDialog.errorDefault")
        "Something went wrong. Please try again or contact us via WhatsApp."
      );
      setFormState("error");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {formState === "success" && container ? (
          <SuccessView container={container} onClose={onClose} />
        ) : (
          container && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {/* TODO: i18n — t("bookingDialog.title") */}
                  Request Container Space
                </DialogTitle>
                <DialogDescription>
                  {/* TODO: i18n — t("bookingDialog.description") */}
                  Fill in your details and we will get back to you within 24
                  hours with a quote.
                </DialogDescription>
              </DialogHeader>

              {/* --- Container summary --- */}
              <ContainerSummary container={container} />

              <Separator />

              {/* --- Form --- */}
              <form
                onSubmit={handleSubmit}
                className={`space-y-4 ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}
              >
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
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

                {/* Hidden fields */}
                <input type="hidden" name="containerId" value={container.id} />
                <input
                  type="hidden"
                  name="projectNumber"
                  value={container.project_number}
                />

                {/* Name */}
                <div>
                  <Label htmlFor="booking-name">
                    {/* TODO: i18n — t("bookingDialog.name") */}
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="booking-name"
                    name="name"
                    required
                    // TODO: i18n — t("bookingDialog.namePlaceholder")
                    placeholder="John Smith"
                    className="mt-1.5"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="booking-email">
                    {/* TODO: i18n — t("bookingDialog.email") */}
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="booking-email"
                    name="email"
                    type="email"
                    required
                    // TODO: i18n — t("bookingDialog.emailPlaceholder")
                    placeholder="john@company.com"
                    className="mt-1.5"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <Label htmlFor="booking-phone">
                    {/* TODO: i18n — t("bookingDialog.phone") */}
                    Phone / WhatsApp <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    required
                    // TODO: i18n — t("bookingDialog.phonePlaceholder")
                    placeholder="+1 (555) 000-0000"
                    className="mt-1.5"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Cargo description */}
                <div>
                  <Label htmlFor="booking-cargo">
                    {/* TODO: i18n — t("bookingDialog.cargo") */}
                    What are you shipping?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="booking-cargo"
                    name="cargoDescription"
                    required
                    rows={3}
                    // TODO: i18n — t("bookingDialog.cargoPlaceholder")
                    placeholder="e.g., 2 pallets of agricultural parts, approx 4 CBM total"
                    className="mt-1.5 resize-y"
                    value={cargoDescription}
                    onChange={(e) => setCargoDescription(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Error message */}
                {(formState === "error" || error) && (
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
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {/* TODO: i18n — t("bookingDialog.submitting") */}
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      {/* TODO: i18n — t("bookingDialog.submit") */}
                      Submit Request
                    </>
                  )}
                </Button>

                {/* Terms text */}
                <p className="text-center text-xs text-muted-foreground">
                  {/* TODO: i18n — t("bookingDialog.terms") */}
                  By submitting, you agree to our{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Container Summary ───────────────────────────────────────────────────────

function ContainerSummary({
  container,
}: {
  container: ContainerWithPendingCount;
}) {
  const flag = countryFlag(container.destination_country);
  const availableCbm = container.available_cbm ?? 0;

  return (
    <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
      {/* Route */}
      <p className="text-sm font-semibold leading-snug">
        <span className="mr-1.5" aria-hidden="true">
          {flag}
        </span>
        {container.origin}
        <span className="mx-1.5 text-muted-foreground">&rarr;</span>
        {container.destination}
      </p>

      {/* Details row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          {/* TODO: i18n — t("bookingDialog.departs") */}
          Departs: <span className="font-medium text-foreground">{formatDate(container.departure_date)}</span>
        </span>
        <span>
          {/* TODO: i18n — t("bookingDialog.available") */}
          Available: <span className="font-medium text-foreground">{availableCbm} CBM</span>
        </span>
        <span>
          {container.container_type}
        </span>
      </div>

      {/* Project number */}
      <p className="text-xs text-muted-foreground">
        {/* TODO: i18n — t("bookingDialog.ref") */}
        Ref: {container.project_number}
      </p>
    </div>
  );
}

// ─── Success View ────────────────────────────────────────────────────────────

function SuccessView({
  container,
  onClose,
}: {
  container: ContainerWithPendingCount;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-4 text-center space-y-4">
      <CheckCircle2 className="size-12 text-emerald-500" />

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          {/* TODO: i18n — t("bookingDialog.successTitle") */}
          Request Submitted
        </h3>
        <p className="text-sm text-muted-foreground">
          {/* TODO: i18n — t("bookingDialog.successRef") */}
          Container: {container.project_number} ({container.origin} &rarr;{" "}
          {container.destination})
        </p>
      </div>

      {/* What happens next */}
      <div className="w-full rounded-lg bg-muted/50 p-4 text-left space-y-3">
        <p className="text-sm font-medium text-foreground">
          {/* TODO: i18n — t("bookingDialog.nextStepsTitle") */}
          What happens next:
        </p>
        <ol className="space-y-2 text-sm text-muted-foreground list-none">
          <li className="flex items-start gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              1
            </span>
            {/* TODO: i18n — t("bookingDialog.step1") */}
            <span>We review your request and cargo details</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              2
            </span>
            {/* TODO: i18n — t("bookingDialog.step2") */}
            <span>You receive a quote within 24 hours via email</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              3
            </span>
            {/* TODO: i18n — t("bookingDialog.step3") */}
            <span>
              Once confirmed, we reserve your space and coordinate pickup
            </span>
          </li>
        </ol>
      </div>

      {/* WhatsApp link */}
      <a
        href={CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackContactClick("whatsapp", "booking_dialog_success")
        }
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
      >
        <MessageCircle className="size-4" />
        {/* TODO: i18n — t("bookingDialog.whatsappPrompt") */}
        Questions? Chat on WhatsApp
      </a>

      {/* Browse more button */}
      <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
        {/* TODO: i18n — t("bookingDialog.browseMore") */}
        Browse More Containers
      </Button>
    </div>
  );
}
