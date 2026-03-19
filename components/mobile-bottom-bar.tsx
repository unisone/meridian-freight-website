"use client";

import Link from "next/link";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { trackGA4Event, trackPixelEvent, generateEventId } from "@/lib/tracking";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

export function MobileBottomBar() {
  const scrollDir = useScrollDirection();

  function handleWhatsAppClick() {
    const eventId = generateEventId();
    trackGA4Event("contact_whatsapp", { event_category: "contact", source: "mobile_bar" });
    trackPixelEvent("Contact", { content_name: "mobile_bar_whatsapp" }, eventId);
  }

  function handlePhoneClick() {
    trackGA4Event("contact_phone", { event_category: "contact", source: "mobile_bar" });
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden transition-transform duration-300 ${
        scrollDir === "down" ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="grid grid-cols-3">
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex flex-col items-center gap-1 py-3 text-emerald-600 transition-colors hover:bg-emerald-50"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>
        <a
          href={CONTACT.phoneHref}
          onClick={handlePhoneClick}
          className="flex flex-col items-center gap-1 py-3 text-primary transition-colors hover:bg-sky-50"
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs font-medium">Call</span>
        </a>
        <Link
          href="/contact"
          className="flex flex-col items-center gap-1 py-3 text-primary transition-colors hover:bg-sky-50"
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs font-medium">Get Quote</span>
        </Link>
      </div>
    </div>
  );
}
