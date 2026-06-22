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

interface PaidSearchQuoteFormProps {
  routeKey: string;
  /** Customs-responsibility caveat rendered adjacent to the CTA (spec §15). */
  caveat: string;
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

export function PaidSearchQuoteForm({ routeKey, caveat }: PaidSearchQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const attrRef = useRef<AttrState | null>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("website")) {
      setIsSubmitted(true);
      setIsSubmitting(false);
      return;
    }
    if (!fd.get("consent")) {
      setError("Debe aceptar las condiciones para continuar.");
      setIsSubmitting(false);
      return;
    }
    const attr = attrRef.current;
    try {
      const result = await submitPaidSearchLead({
        routeKey,
        contact_name: (fd.get("contact_name") as string) || "",
        contact_email: (fd.get("contact_email") as string) || "",
        contact_phone: (fd.get("contact_phone") as string) || "",
        preferred_contact_method: "whatsapp",
        equipment_type: (fd.get("equipment_type") as string) || "",
        make_model: (fd.get("make_model") as string) || "",
        year: (fd.get("year") as string) || "",
        listing_url: (fd.get("listing_url") as string) || "",
        origin_location: (fd.get("origin_location") as string) || "",
        destination_location: (fd.get("destination_location") as string) || "",
        purchase_status: (fd.get("purchase_status") as string) || "",
        message: (fd.get("message") as string) || "",
        consent: fd.get("consent") === "on",
        website: (fd.get("website") as string) || "",
        attribution_id: attr?.attribution_id || "",
        lead_id: attr?.lead_id || "",
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
        setError(result.error || "No pudimos enviar su solicitud. Intente nuevamente.");
      }
    } catch {
      setError("No pudimos enviar su solicitud. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="text-xl font-bold text-foreground">Solicitud recibida</h3>
        <p className="mt-2 text-muted-foreground">
          Gracias. Revisaremos los datos del equipo y le responderemos con el alcance del tramo internacional. Le contactaremos dentro de las próximas 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 transition-opacity ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" autoComplete="off" tabIndex={-1} />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        Los campos marcados con <span aria-hidden="true">*</span>
        <span className="sr-only"> asterisco</span> son obligatorios.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact_name">
            Nombre <span aria-hidden="true" className="text-red-500">*</span>
          </Label>
          <Input id="contact_name" name="contact_name" required aria-required="true" autoComplete="name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="contact_phone">WhatsApp o teléfono</Label>
          <Input id="contact_phone" name="contact_phone" type="tel" autoComplete="tel" className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact_email">Email</Label>
          <Input id="contact_email" name="contact_email" type="email" autoComplete="email" spellCheck={false} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="equipment_type">
            Equipo <span aria-hidden="true" className="text-red-500">*</span>
          </Label>
          <Input id="equipment_type" name="equipment_type" required aria-required="true" placeholder="Ej.: cosechadora, tractor, excavadora" className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="make_model">Marca, modelo y año</Label>
          <Input id="make_model" name="make_model" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="purchase_status">Estado de compra</Label>
          <select
            id="purchase_status"
            name="purchase_status"
            defaultValue=""
            className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
          >
            <option value="">Seleccione…</option>
            <option value="evaluando">Evaluando opciones</option>
            <option value="reservado">Reservado</option>
            <option value="comprado">Comprado</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="origin_location">Ubicación en EE. UU./Canadá</Label>
          <Input id="origin_location" name="origin_location" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="destination_location">Ciudad de destino</Label>
          <Input id="destination_location" name="destination_location" className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="listing_url">Link del equipo o factura proforma</Label>
        <Input id="listing_url" name="listing_url" className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="message">Detalles adicionales</Label>
        <Textarea id="message" name="message" rows={4} className="mt-1.5 resize-y" />
      </div>

      <label htmlFor="consent" className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          required
          aria-describedby="ps-form-error"
          className="mt-1 h-4 w-4 rounded border-input"
        />
        <span>{caveat}</span>
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
            Enviando…
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Solicitar cotización
          </>
        )}
      </Button>

      {error && (
        <p id="ps-form-error" role="alert" className="mt-2 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
