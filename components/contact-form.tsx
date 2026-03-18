"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

    // TODO: Wire to Server Action in Phase 5 (Task 25)
    // For now, simulate success
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="mt-4 text-2xl font-bold text-gray-900">Message Sent!</h3>
        <p className="mt-2 text-gray-600">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
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
