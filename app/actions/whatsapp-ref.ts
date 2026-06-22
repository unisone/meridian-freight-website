"use server";

import { whatsappRefRequestSchema, type WhatsAppRefRequestData } from "@/lib/schemas";
import { getPaidSearchDestination } from "@/lib/latam-paid-search-routes";

// Opaque, URL-safe ref (spec §6.5): MF- + 8 Crockford base32 chars (no I/L/O/U).
// Random token — NOT an encoding of click IDs, which never appear in WhatsApp text.
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const REF_TTL_DAYS = 90;

function generateRef(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let s = "";
  for (let i = 0; i < 8; i++) s += CROCKFORD[bytes[i] % 32];
  return `MF-${s}`;
}

function newLeadId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export interface WhatsAppRefResult {
  success: boolean;
  lead_id?: string;
  whatsapp_ref?: string;
  expires_at?: string;
  error?: string;
}

export async function createWhatsAppRef(raw: WhatsAppRefRequestData): Promise<WhatsAppRefResult> {
  const parsed = whatsappRefRequestSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "invalid_request" };
  const data = parsed.data;

  const [country, segment] = data.routeKey.split("/");
  const record = getPaidSearchDestination("es", country ?? "", segment ?? "");
  if (!record) return { success: false, error: "unknown_route" };

  // Stateless: generate an opaque ref + lead_id; no DB write. The website does
  // NOT own a ref store — that would duplicate the chatbot's wa_attribution.ref_code.
  // The ref is included in the WhatsApp message and persisted on the lead row at
  // form submit (leads.whatsapp_ref in paid_search_metadata). The client caches the
  // ref per session so repeated CTA clicks reuse it (idempotency).
  const lead_id = newLeadId();
  const whatsapp_ref = generateRef();
  const expires_at = new Date(Date.now() + REF_TTL_DAYS * 86400000).toISOString();
  return { success: true, lead_id, whatsapp_ref, expires_at };
}
