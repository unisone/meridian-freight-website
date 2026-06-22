"use server";

import { whatsappRefRequestSchema, type WhatsAppRefRequestData } from "@/lib/schemas";
import { getPaidSearchDestination } from "@/lib/latam-paid-search-routes";
import { log } from "@/lib/logger";

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

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Idempotent reuse per (attribution_id + routeKey) within the TTL window.
  if (url && key && data.attribution_id) {
    try {
      const nowIso = new Date().toISOString();
      const q =
        `${url}/rest/v1/paid_search_refs?attribution_id=eq.${encodeURIComponent(data.attribution_id)}` +
        `&route_key=eq.${encodeURIComponent(data.routeKey)}&expires_at=gt.${encodeURIComponent(nowIso)}` +
        `&select=whatsapp_ref,lead_id,expires_at&limit=1`;
      const resp = await fetch(q, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
      if (resp.ok) {
        const rows = (await resp.json().catch(() => [])) as Array<{
          whatsapp_ref: string;
          lead_id: string;
          expires_at: string;
        }>;
        if (Array.isArray(rows) && rows[0]?.whatsapp_ref) {
          return {
            success: true,
            lead_id: rows[0].lead_id,
            whatsapp_ref: rows[0].whatsapp_ref,
            expires_at: rows[0].expires_at,
          };
        }
      }
    } catch (e) {
      log({ level: "warn", msg: "whatsapp_ref_lookup_failed", route: "action:whatsapp-ref", error: String(e) });
    }
  }

  const lead_id = newLeadId();
  const whatsapp_ref = generateRef();
  const expires_at = new Date(Date.now() + REF_TTL_DAYS * 86400000).toISOString();

  if (url && key) {
    try {
      await fetch(`${url}/rest/v1/paid_search_refs`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          whatsapp_ref,
          attribution_id: data.attribution_id || null,
          route_key: data.routeKey,
          lead_id,
          payload: { first_touch: data.first_touch ?? null, latest_touch: data.latest_touch ?? null },
          expires_at,
        }),
      });
    } catch (e) {
      log({ level: "warn", msg: "whatsapp_ref_persist_failed", route: "action:whatsapp-ref", error: String(e) });
    }
  }

  return { success: true, lead_id, whatsapp_ref, expires_at };
}
