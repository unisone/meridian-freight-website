"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createWhatsAppRef } from "@/app/actions/whatsapp-ref";
import { buildWhatsAppUrl, interpolateWhatsAppRef } from "@/lib/whatsapp-prefill";
import { trackContactClick } from "@/lib/tracking";
import { CONTACT } from "@/lib/constants";

interface PaidSearchWhatsAppButtonProps {
  routeKey: string;
  /** Prefill template containing the {{whatsapp_ref}} placeholder. */
  prefillTemplate: string;
  location: string;
  label: string;
  className?: string;
}

interface StoredAttr {
  attribution_id?: string;
  first_touch?: Record<string, string | undefined>;
  latest_touch?: Record<string, string | undefined>;
}

function readAttr(routeKey: string): StoredAttr | null {
  try {
    return JSON.parse(sessionStorage.getItem(`ps_attr_${routeKey}`) || "null");
  } catch {
    return null;
  }
}

export function PaidSearchWhatsAppButton({
  routeKey,
  prefillTemplate,
  location,
  label,
  className,
}: PaidSearchWhatsAppButtonProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    let ref: string | undefined;
    const cacheKey = `ps_ref_${routeKey}`;
    try {
      ref = sessionStorage.getItem(cacheKey) || undefined;
    } catch {
      /* sessionStorage blocked */
    }
    if (!ref) {
      try {
        const attr = readAttr(routeKey);
        const result = await createWhatsAppRef({
          routeKey,
          attribution_id: attr?.attribution_id || "",
          first_touch: attr?.first_touch,
          latest_touch: attr?.latest_touch,
        });
        if (result.success && result.whatsapp_ref) {
          ref = result.whatsapp_ref;
          try {
            sessionStorage.setItem(cacheKey, ref);
          } catch {
            /* cache best-effort */
          }
        }
      } catch {
        /* fall back to a ref-less prefill — never block the WhatsApp open */
      }
    }
    const text = interpolateWhatsAppRef(prefillTemplate, ref);
    try {
      trackContactClick("whatsapp", location);
    } catch {
      /* analytics best-effort */
    }
    const url = buildWhatsAppUrl(CONTACT.phoneRaw, text);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    // Popup blocked → fall back to a same-tab navigation so the chat still opens.
    if (!win) window.location.href = url;
    setBusy(false);
  }

  return (
    <Button type="button" onClick={handleClick} disabled={busy} size="lg" className={className}>
      {busy ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          Abriendo…
        </>
      ) : (
        <>
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          {label}
        </>
      )}
    </Button>
  );
}
