"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/app/actions/contact";
import { trackGA4Event, trackPixelEvent } from "@/lib/tracking";
import { CONTACT } from "@/lib/constants";
import type { ContactFormData } from "@/lib/schemas";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check — if filled, silently "succeed"
    if (formData.get("website")) {
      setIsSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    // Capture UTM params
    const params = new URLSearchParams(window.location.search);
    formData.set("source_page", window.location.href);
    formData.set("utm_source", params.get("utm_source") ?? "");
    formData.set("utm_medium", params.get("utm_medium") ?? "");
    formData.set("utm_campaign", params.get("utm_campaign") ?? "");
    formData.set("utm_term", params.get("utm_term") ?? "");
    formData.set("utm_content", params.get("utm_content") ?? "");

    const payload: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: (formData.get("company") as string) || "",
      phone: (formData.get("phone") as string) || "",
      equipmentType: (formData.get("equipmentType") as string) || "",
      message: formData.get("message") as string,
      website: (formData.get("website") as string) || "",
      source_page: formData.get("source_page") as string,
      utm_source: (formData.get("utm_source") as string) || "",
      utm_medium: (formData.get("utm_medium") as string) || "",
      utm_campaign: (formData.get("utm_campaign") as string) || "",
      utm_term: (formData.get("utm_term") as string) || "",
      utm_content: (formData.get("utm_content") as string) || "",
    };

    try {
      const result = await submitContactForm(payload);
      if (result.success) {
        setIsSubmitted(true);
        trackGA4Event("generate_lead", {
          event_category: "contact",
          event_label: "corporate_contact_form",
        });
        // Fire Pixel event with same eventId as CAPI for deduplication
        if (result.eventId) {
          trackPixelEvent("Lead", { content_name: "corporate_contact_form" }, result.eventId);
        }
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="mt-4 text-2xl font-bold text-slate-900">Message Sent!</h3>
        <p className="mt-2 text-slate-600">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
        >
          <MessageCircle className="h-4 w-4" />
          Can&apos;t wait? Chat with us now on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" autoComplete="off" tabIndex={-1} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required placeholder="Your full name" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="your@email.com" className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Company name (optional)" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="Phone number (optional)" className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="equipmentType">Equipment Type</Label>
        <select
          id="equipmentType"
          name="equipmentType"
          className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue=""
        >
          <option value="">Select equipment type (optional)</option>
          <option value="Combine">Combine Harvester</option>
          <option value="Tractor">Tractor</option>
          <option value="Planter">Planter / Seeder</option>
          <option value="Sprayer">Sprayer</option>
          <option value="Header">Header / Platform</option>
          <option value="Tillage">Tillage Equipment</option>
          <option value="Excavator">Excavator</option>
          <option value="Construction">Construction Equipment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell us about your machinery logistics needs..."
          className="mt-1.5 resize-y"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </>
        )}
      </Button>

      {error && (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      )}
    </form>
  );
}
