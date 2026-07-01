"use server";

import { whatsappRefRequestSchema, type WhatsAppRefRequestData } from "@/lib/schemas";
import { resolvePaidSearchRoute } from "@/lib/latam-paid-search-routes";
import { log } from "@/lib/logger";

// Opaque, URL-safe ref (spec §6.5): MF- + 8 Crockford base32 chars (no I/L/O/U).
// Random token — NOT an encoding of click IDs, which never appear in WhatsApp text.
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const REF_TTL_DAYS = 90;
const SOURCE_ACCOUNT_ID = "3783002123";
/** es refs keep the existing #FRT_ES (env-overridable); en (Africa) refs use #FRT_EN. */
const ROUTER_TAG_ES = (process.env.FREIGHT_ROUTER_TAG ?? "#FRT_ES").trim() || "#FRT_ES";
const ROUTER_TAG_EN = "#FRT_EN";

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

/**
 * Persist the ref -> attribution mapping (best-effort) so a pure-WhatsApp lead
 * (one that opens WhatsApp but never submits the form) is still reconnectable to
 * its click IDs. Writes to the website-owned `paid_search_refs` (NOT the chatbot's
 * pipeline-attached `wa_attribution`, which would risk firing OCI/CAPI during the
 * Gate-B hold). Never throws — the WhatsApp open must not be blocked.
 */
async function persistRef(row: Record<string, unknown>): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    const resp = await fetch(`${url}/rest/v1/paid_search_refs?on_conflict=ref_code`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      log({ level: "warn", msg: "paid_search_ref_persist_failed", route: "action:whatsapp-ref", status: resp.status, body });
    }
  } catch (e) {
    log({ level: "warn", msg: "paid_search_ref_persist_exception", route: "action:whatsapp-ref", error: String(e) });
  }
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

  // TRUST BOUNDARY: route context is rederived from the validated routeKey, never
  // the client. Locale is derived server-side from record.locale (es→LATAM,
  // en→Africa), so the router tag follows the resolved record, not a client value.
  const record = resolvePaidSearchRoute(data.routeKey);
  if (!record) return { success: false, error: "unknown_route" };
  const ROUTER_TAG = record.locale === "en" ? ROUTER_TAG_EN : ROUTER_TAG_ES;

  const lead_id = newLeadId();
  const whatsapp_ref = generateRef();
  const expires_at = new Date(Date.now() + REF_TTL_DAYS * 86400000).toISOString();

  const lt: Record<string, string | undefined> = data.latest_touch ?? data.first_touch ?? {};
  const ft: Record<string, string | undefined> = data.first_touch ?? {};
  await persistRef({
    ref_code: whatsapp_ref,
    lead_id,
    attribution_id: data.attribution_id || null,
    route_key: record.routeKey,
    country: record.country.code,
    segment: record.segment.key,
    cargo_class: record.segment.cargoClass,
    landing_route: record.seo.canonicalPath,
    gclid: lt.gclid || ft.gclid || null,
    gbraid: lt.gbraid || ft.gbraid || null,
    wbraid: lt.wbraid || ft.wbraid || null,
    fbclid: lt.fbclid || ft.fbclid || null,
    utm_source: lt.utm_source || ft.utm_source || null,
    utm_medium: lt.utm_medium || ft.utm_medium || null,
    utm_campaign: lt.utm_campaign || ft.utm_campaign || null,
    utm_term: lt.utm_term || ft.utm_term || null,
    utm_content: lt.utm_content || ft.utm_content || null,
    utm_matchtype: lt.utm_matchtype || ft.utm_matchtype || null,
    utm_network: lt.utm_network || ft.utm_network || null,
    utm_device: lt.utm_device || ft.utm_device || null,
    first_touch: data.first_touch ?? null,
    latest_touch: data.latest_touch ?? null,
    source_account_id: SOURCE_ACCOUNT_ID,
    router_tag: ROUTER_TAG,
    expires_at,
  });

  return { success: true, lead_id, whatsapp_ref, expires_at };
}
