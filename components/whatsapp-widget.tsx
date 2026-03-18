"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { MessageCircle, X, Send } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { generateRefCode, buildWhatsAppUrl } from "@/lib/wa-attribution";
import { trackGA4Event, trackPixelEvent, generateEventId } from "@/lib/tracking";

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Generate a unique ref code per session for attribution
  const refCode = useMemo(() => generateRefCode(), []);
  const waUrl = useMemo(() => buildWhatsAppUrl(refCode), [refCode]);

  function handleWhatsAppClick() {
    // Track the click
    const eventId = generateEventId();
    trackGA4Event("contact_whatsapp", { event_category: "contact", ref_code: refCode });
    trackPixelEvent("Contact", { content_name: "whatsapp_widget" }, eventId);

    // Fire attribution tracking (best-effort)
    fetch("/api/track/wa-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref_code: refCode,
        source_page: window.location.href,
        utm_source: new URLSearchParams(window.location.search).get("utm_source") || "",
      }),
    }).catch(() => {}); // best-effort
  }

  return (
    <>
      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-50 w-80 overflow-hidden rounded-xl border bg-white shadow-2xl lg:bottom-24 lg:right-6 sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/20">
                <Image
                  src="/logos/MF Logos White/meridianFreight-logo-mobile-w-150.png"
                  alt={COMPANY.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-semibold">{COMPANY.name}</div>
                <div className="text-sm opacity-90">Typically replies within minutes</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 transition-colors hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="mb-4 rounded-xl bg-slate-100 p-4">
              <p className="text-sm text-slate-700">
                Have questions about equipment pickup or export? We&apos;re here to help!
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
            >
              <Send className="h-5 w-5" />
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all hover:bg-emerald-700 hover:scale-110 active:scale-95 lg:bottom-6 lg:right-6 sm:h-16 sm:w-16"
        aria-label="Open WhatsApp chat"
      >
        <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
      </button>
    </>
  );
}
