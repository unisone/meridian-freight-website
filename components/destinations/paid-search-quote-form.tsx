"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitPaidSearchLead } from "@/app/actions/paid-search-lead";
import {
  generateAttributionId,
  hasPaidSignal,
  parsePaidTouch,
  type PaidAttributionTouch,
} from "@/lib/lead-attribution";
import { trackGA4Event, trackPixelEvent } from "@/lib/tracking";
import { track as vercelTrack } from "@vercel/analytics";
import { CONTACT } from "@/lib/constants";
import { getPaidSearchChromeLabels } from "@/content/paid-search-labels";

interface PaidSearchQuoteFormProps {
  routeKey: string;
  /** Customs-responsibility caveat rendered adjacent to the CTA (spec §15). */
  caveat: string;
  /** Drives which locale's UI-chrome labels render (es LATAM / en Africa). */
  locale: "es" | "en";
}

interface AttrState {
  attribution_id: string;
  lead_id: string;
  first_touch: PaidAttributionTouch;
  latest_touch: PaidAttributionTouch;
}

function newLeadId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PaidSearchQuoteForm({ routeKey, caveat, locale }: PaidSearchQuoteFormProps) {
  const t = getPaidSearchChromeLabels(locale).form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const attrRef = useRef<AttrState | null>(null);
  const successRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const touch = parsePaidTouch(window.location.href, document.referrer);
    const sk = `ps_attr_${routeKey}`;
    let stored: AttrState | null = null;
    try {
      stored = JSON.parse(sessionStorage.getItem(sk) || "null");
    } catch {
      stored = null;
    }
    const next: AttrState = {
      attribution_id: stored?.attribution_id || generateAttributionId(),
      lead_id: stored?.lead_id || newLeadId(),
      first_touch: stored?.first_touch || touch,
      latest_touch: hasPaidSignal(touch) ? touch : stored?.latest_touch || stored?.first_touch || touch,
    };
    try {
      sessionStorage.setItem(sk, JSON.stringify(next));
    } catch {
      /* storage blocked — keep attribution in memory only */
    }
    attrRef.current = next;
  }, [routeKey]);

  // Move keyboard focus to the confirmation heading once the lead is accepted.
  useEffect(() => {
    if (isSubmitted) successRef.current?.focus();
  }, [isSubmitted]);

  function focusField(form: HTMLFormElement, name: string) {
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLElement) el.focus();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — silently "succeed" for bots.
    if (fd.get("website")) {
      setIsSubmitted(true);
      return;
    }

    // Spanish client-side validation. The form is `noValidate`, so the browser's
    // native (English) constraint bubbles never pre-empt these messages.
    const name = ((fd.get("contact_name") as string) || "").trim();
    const equipment = ((fd.get("equipment_type") as string) || "").trim();
    const email = ((fd.get("contact_email") as string) || "").trim();
    const phone = ((fd.get("contact_phone") as string) || "").trim();
    if (!name) {
      setError(t.errName);
      focusField(form, "contact_name");
      return;
    }
    if (!equipment) {
      setError(t.errEquipment);
      focusField(form, "equipment_type");
      return;
    }
    if (!email && !phone) {
      setError(t.errContact);
      focusField(form, "contact_email");
      return;
    }
    if (email && !EMAIL_RE.test(email)) {
      setError(t.errEmail);
      focusField(form, "contact_email");
      return;
    }
    if (!fd.get("consent")) {
      setError(t.errConsent);
      focusField(form, "consent");
      return;
    }

    setIsSubmitting(true);
    const attr = attrRef.current;
    // Persist a prior WhatsApp-click ref (if any) so the WhatsApp→form-submit path correlates.
    let whatsapp_ref = "";
    try {
      whatsapp_ref = sessionStorage.getItem(`ps_ref_${routeKey}`) || "";
    } catch {
      /* sessionStorage blocked — no prior WhatsApp ref to correlate */
    }
    try {
      const result = await submitPaidSearchLead({
        routeKey,
        contact_name: name,
        contact_email: email,
        contact_phone: phone,
        preferred_contact_method: phone ? "whatsapp" : "email",
        equipment_type: equipment,
        make_model: (fd.get("make_model") as string) || "",
        listing_url: (fd.get("listing_url") as string) || "",
        origin_location: (fd.get("origin_location") as string) || "",
        destination_location: (fd.get("destination_location") as string) || "",
        dimensions: (fd.get("dimensions") as string) || "",
        weight: (fd.get("weight") as string) || "",
        purchase_status: (fd.get("purchase_status") as string) || "",
        buyer_role: (fd.get("buyer_role") as string) || "",
        requested_timing: (fd.get("requested_timing") as string) || "",
        message: (fd.get("message") as string) || "",
        consent: fd.get("consent") === "on",
        website: (fd.get("website") as string) || "",
        attribution_id: attr?.attribution_id || "",
        lead_id: attr?.lead_id || "",
        whatsapp_ref,
        first_touch: attr?.first_touch,
        latest_touch: attr?.latest_touch,
      });
      if (result.success) {
        setIsSubmitted(true);
        trackGA4Event("generate_lead", {
          event_category: "paid_search",
          event_label: routeKey,
          value: 300,
          currency: "USD",
        });
        vercelTrack("generate_lead", { source: "paid_search", value: 300 });
        if (result.eventId) {
          trackPixelEvent("Lead", { content_name: `paid_search:${routeKey}` }, result.eventId);
        }
      } else {
        setError(result.error || t.errSubmit);
      }
    } catch {
      setError(t.errSubmit);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 ref={successRef} tabIndex={-1} className="text-xl font-bold text-foreground outline-none">
          {t.successHeading}
        </h3>
        <p className="mt-2 text-muted-foreground">
          {t.successBody}
        </p>
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
        >
          {t.successWhatsApp}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-5 transition-opacity ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" autoComplete="off" tabIndex={-1} />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {t.requiredHintPrefix}<span aria-hidden="true">*</span>
        <span className="sr-only">{t.requiredHintAsteriskSr}</span>{t.requiredHintSuffix}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact_name">
            {t.labelName} <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="contact_name"
            name="contact_name"
            required
            aria-required="true"
            aria-describedby="ps-form-error"
            autoComplete="name"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="contact_phone">{t.labelPhone}</Label>
          <Input id="contact_phone" name="contact_phone" type="tel" autoComplete="tel" className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact_email">{t.labelEmail}</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            aria-describedby="ps-form-error"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="equipment_type">
            {t.labelEquipment} <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="equipment_type"
            name="equipment_type"
            required
            aria-required="true"
            aria-describedby="ps-form-error"
            placeholder={t.equipmentPlaceholder}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="make_model">{t.labelMakeModel}</Label>
        <Input id="make_model" name="make_model" className="mt-1.5" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="purchase_status">{t.labelPurchaseStatus}</Label>
          <select
            id="purchase_status"
            name="purchase_status"
            defaultValue=""
            className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
          >
            <option value="">{t.selectPlaceholder}</option>
            <option value="evaluando">{t.purchaseEvaluating}</option>
            <option value="reservado">{t.purchaseReserved}</option>
            <option value="comprado">{t.purchasePurchased}</option>
          </select>
        </div>
        <div>
          <Label htmlFor="buyer_role">{t.labelBuyerRole}</Label>
          <select
            id="buyer_role"
            name="buyer_role"
            defaultValue=""
            className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
          >
            <option value="">{t.selectPlaceholder}</option>
            <option value="importador_usuario_final">{t.roleImporter}</option>
            <option value="concesionario_revendedor">{t.roleDealer}</option>
            <option value="despachante_gestor">{t.roleBroker}</option>
            <option value="otro">{t.roleOther}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="origin_location">{t.labelOrigin}</Label>
          <Input id="origin_location" name="origin_location" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="destination_location">{t.labelDestination}</Label>
          <Input id="destination_location" name="destination_location" className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="dimensions">{t.labelDimensions}</Label>
          <Input id="dimensions" name="dimensions" placeholder={t.dimensionsPlaceholder} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="weight">{t.labelWeight}</Label>
          <Input id="weight" name="weight" placeholder={t.weightPlaceholder} className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="listing_url">{t.labelListingUrl}</Label>
          <Input id="listing_url" name="listing_url" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="requested_timing">{t.labelTiming}</Label>
          <Input id="requested_timing" name="requested_timing" placeholder={t.timingPlaceholder} className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t.labelMessage}</Label>
        <Textarea id="message" name="message" rows={4} className="mt-1.5 resize-y" />
      </div>

      <label htmlFor="consent" className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          required
          aria-required="true"
          aria-describedby="ps-form-error"
          className="mt-1 h-4 w-4 rounded border-input"
        />
        <span>
          {t.consentText}{" "}
          <span className="text-muted-foreground/80">{caveat}</span>
        </span>
      </label>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full rounded-xl bg-primary py-5 text-base font-semibold text-white shadow-lg transition-[background-color,box-shadow] hover:bg-primary/90 hover:shadow-xl"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            {t.submit}
          </>
        )}
      </Button>

      <p
        id="ps-form-error"
        role="alert"
        aria-live="polite"
        className="min-h-[1.25rem] text-center text-sm text-destructive"
      >
        {error}
      </p>
    </form>
  );
}
