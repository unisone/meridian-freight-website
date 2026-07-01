"use server";

import { after } from "next/server";
import { Resend } from "resend";
import { track } from "@vercel/analytics/server";
import { paidSearchLeadSchema, type PaidSearchLeadInput } from "@/lib/schemas";
import { resolvePaidSearchRoute } from "@/lib/latam-paid-search-routes";
import { assertGoogleAdsTagMatches } from "@/lib/google-ads-tag";
import { CONTACT } from "@/lib/constants";
import { notifySlack } from "@/lib/slack";
import { sendCAPIEvent } from "@/lib/meta-capi";
import { startTimer, log } from "@/lib/logger";

const SOURCE_ACCOUNT_ID = "3783002123";
/** es leads keep the existing #FRT_ES (env-overridable); en (Africa) leads use #FRT_EN. */
const ROUTER_TAG_ES = (process.env.FREIGHT_ROUTER_TAG ?? "#FRT_ES").trim() || "#FRT_ES";
const ROUTER_TAG_EN = "#FRT_EN";
const CONSENT_VERSION = "paid-search-consent-v1";

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Neutralize Slack mrkdwn control chars (<!channel>, <@user>, links) in untrusted text. */
function escapeSlack(input: string | null | undefined): string {
  return String(input ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function newLeadId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Returns inserted=false ONLY on a confirmed duplicate (ok + empty rows). */
async function insertPaidSearchLead(
  lead: Record<string, unknown>,
): Promise<{ inserted: boolean; configured: boolean }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { inserted: true, configured: false };
  try {
    const resp = await fetch(`${url}/rest/v1/leads?on_conflict=idempotency_key`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify(lead),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      log({ level: "error", msg: "supabase_insert_failed", route: "action:paid-search-lead", status: resp.status, body: text });
      return { inserted: true, configured: true }; // failure ≠ duplicate; don't drop a real lead
    }
    const rows = (await resp.json().catch(() => [])) as unknown[];
    return { inserted: Array.isArray(rows) ? rows.length > 0 : true, configured: true };
  } catch (e) {
    log({ level: "error", msg: "supabase_insert_exception", route: "action:paid-search-lead", error: String(e) });
    return { inserted: true, configured: true };
  }
}

export interface PaidSearchLeadResult {
  success: boolean;
  error?: string;
  lead_id?: string;
  eventId?: string;
  duplicate?: boolean;
}

export async function submitPaidSearchLead(
  raw: PaidSearchLeadInput,
): Promise<PaidSearchLeadResult> {
  const timer = startTimer("action:paid-search-lead");

  // 1. Validate
  const parsed = paidSearchLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }
  const data = parsed.data;

  // 2. Honeypot
  if (data.website) return { success: true };

  // 3. TRUST BOUNDARY: rederive route context from the validated routeKey ONLY.
  // Locale is derived SERVER-SIDE from the resolved record (never a client value);
  // es → LATAM registry, en → Africa registry, both keyed off record.locale.
  const record = resolvePaidSearchRoute(data.routeKey);
  if (!record) {
    timer.error("unknown_route", { routeKey: data.routeKey });
    return { success: false, error: "Unsupported route." };
  }
  const locale = record.locale;
  const ROUTER_TAG = locale === "en" ? ROUTER_TAG_EN : ROUTER_TAG_ES;

  // 4. Google Ads tag guard (record mismatch, never throw / never add a conversion).
  const tagCheck = assertGoogleAdsTagMatches();
  if (!tagCheck.ok) {
    log({ level: "warn", msg: "google_ads_tag_mismatch", route: "action:paid-search-lead", reason: tagCheck.reason, expected: tagCheck.expected });
  }

  // 5. Identity / dedupe (idempotency_key === lead_id)
  const lead_id = data.lead_id || newLeadId();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    timer.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service is not configured." };
  }
  const resend = new Resend(apiKey);

  const ft: Record<string, string | undefined> = data.first_touch ?? {};
  const lt: Record<string, string | undefined> = data.latest_touch ?? data.first_touch ?? {};
  const nowIso = new Date().toISOString();

  // 6. Contract-compliant payload — route context REDERIVED from the registry,
  // never from the client. To stay light on the SHARED leads table, only the
  // queryable/dedupe/correlation fields are real columns; the full contract
  // (extended UTMs, click IDs, route context, touches) rides in one jsonb.
  const gclid = lt.gclid || ft.gclid || null;
  const gbraid = lt.gbraid || ft.gbraid || null;
  const wbraid = lt.wbraid || ft.wbraid || null;
  // These pages are indexable, so only label a lead "google_ads" when a paid
  // signal is actually present; organic/direct leads stay "website".
  const isPaid = Boolean(
    gclid || gbraid || wbraid || lt.fbclid || ft.fbclid || lt.msclkid || ft.msclkid || lt.utm_source || ft.utm_source,
  );

  const paid_search_metadata = {
    schema_version: "paid-search-lead-v1",
    attribution_id: data.attribution_id || null,
    whatsapp_ref: data.whatsapp_ref || null,
    source_account_id: SOURCE_ACCOUNT_ID,
    google_ads_tag: tagCheck.ok ? tagCheck.runtime : null,
    landing_route: record.seo.canonicalPath,
    page_route: record.seo.canonicalPath,
    request_type: record.segment.requestType,
    router_tag: ROUTER_TAG,
    fbclid: lt.fbclid || ft.fbclid || null,
    msclkid: lt.msclkid || ft.msclkid || null,
    utm_matchtype: lt.utm_matchtype || ft.utm_matchtype || null,
    utm_network: lt.utm_network || ft.utm_network || null,
    utm_device: lt.utm_device || ft.utm_device || null,
    first_touch: data.first_touch ?? null,
    latest_touch: data.latest_touch ?? null,
    preferred_contact_method: data.preferred_contact_method,
    equipment_type: data.equipment_type,
    make_model: data.make_model || null,
    purchase_status: data.purchase_status || null,
    origin_location: data.origin_location || null,
    destination_location: data.destination_location || null,
    consent_version: data.consent ? CONSENT_VERSION : null,
    submitted_at: nowIso,
    listing_url: data.listing_url || null,
    dimensions: data.dimensions || null,
    weight: data.weight || null,
    requested_timing: data.requested_timing || null,
    buyer_role: data.buyer_role || null,
  };

  const payload = {
    // existing leads columns
    name: data.contact_name,
    email: data.contact_email || null,
    phone: data.contact_phone || null,
    // leads.message is NOT NULL — synthesize a summary when the user leaves it blank.
    // Locale-aware: es keeps the Spanish summary byte-for-byte; en gets English.
    message:
      data.message?.trim() ||
      (locale === "en"
        ? `Quote request (paid-search): ${data.equipment_type} → ${record.country.name}`
        : `Solicitud de cotización (paid-search): ${data.equipment_type} → ${record.country.name}`),
    source_page: `paid-search: ${record.seo.canonicalPath}`,
    status: "new",
    utm_source: lt.utm_source || ft.utm_source || null,
    utm_medium: lt.utm_medium || ft.utm_medium || null,
    utm_campaign: lt.utm_campaign || ft.utm_campaign || null,
    utm_term: lt.utm_term || ft.utm_term || null,
    utm_content: lt.utm_content || ft.utm_content || null,
    // new flat columns (queryable / dedupe / correlation)
    lead_id,
    idempotency_key: lead_id,
    source_platform: isPaid ? "google_ads" : "website",
    country: record.country.code,
    segment: record.segment.key,
    cargo_class: record.segment.cargoClass,
    gclid,
    gbraid,
    wbraid,
    // full contract (extended UTMs, click IDs, route context, touches, equipment)
    paid_search_metadata,
  };

  // 7. Insert (best-effort) with dedupe.
  const { inserted } = await insertPaidSearchLead(payload);
  if (!inserted) {
    timer.done({ lead_id, duplicate: true });
    return { success: true, lead_id, duplicate: true };
  }

  // 8. Owner email (must succeed). Skipped only on a confirmed duplicate (above).
  const safe = (v: string | null | undefined) => escapeHtml(v ?? "");
  try {
    const { error } = await resend.emails.send({
      from: CONTACT.fromEmail,
      to: CONTACT.notificationEmail,
      cc: CONTACT.notificationCc as unknown as string[],
      replyTo: data.contact_email || undefined,
      subject: `Paid-search lead: ${data.equipment_type} → ${record.country.name} [${record.segment.key}]`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0ea5e9;color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">Paid-search lead — ${safe(record.country.name)}</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Name:</strong> ${safe(data.contact_name)}</p>
            <p><strong>Email:</strong> ${safe(data.contact_email)}</p>
            <p><strong>Phone:</strong> ${safe(data.contact_phone)}</p>
            <p><strong>Equipment:</strong> ${safe(data.equipment_type)} ${safe(data.make_model)}</p>
            <p><strong>Route:</strong> ${safe(record.seo.canonicalPath)} (${safe(record.segment.cargoClass)})</p>
            <p><strong>Origin → Destination:</strong> ${safe(data.origin_location)} → ${safe(data.destination_location)}</p>
            <p><strong>Message:</strong><br/>${safe(data.message).replace(/\n/g, "<br/>")}</p>
            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:16px 0"/>
            <p style="font-size:12px;color:#6b7280">
              lead_id: ${safe(lead_id)}<br/>
              click IDs: ${safe([payload.gclid, payload.gbraid, payload.wbraid, paid_search_metadata.fbclid].filter(Boolean).join(" / ") || "none")}<br/>
              UTM: ${safe([payload.utm_source, payload.utm_medium, payload.utm_campaign, paid_search_metadata.utm_matchtype, paid_search_metadata.utm_network, paid_search_metadata.utm_device].filter(Boolean).join(" / ") || "none")}
            </p>
          </div>
        </div>
      `,
    });
    if (error) {
      timer.error(error, { step: "owner_email" });
      return { success: false, error: (error as { message?: string })?.message || "Failed to send email." };
    }
  } catch (err) {
    timer.error(err, { step: "owner_email" });
    return { success: false, error: "An unexpected error occurred." };
  }

  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 9. Background best-effort. Diagnostic events only; NO Google Ads upload (Gate B).
  after(async () => {
    const slackLines = [
      `*New paid-search lead — ${record.country.name} [${record.segment.key}]:* ${escapeSlack(data.contact_name)}`,
      data.contact_email ? `Email: ${escapeSlack(data.contact_email)}` : null,
      data.contact_phone ? `Phone: ${escapeSlack(data.contact_phone)}` : null,
      `Equipment: ${escapeSlack(data.equipment_type)} ${escapeSlack(data.make_model)}`.trim(),
      `Route: ${record.seo.canonicalPath}`,
    ]
      .filter(Boolean)
      .join("\n");
    await notifySlack(slackLines);

    await sendCAPIEvent({
      eventName: "Lead",
      eventId,
      email: data.contact_email || undefined,
      phone: data.contact_phone || undefined,
      sourceUrl: record.seo.canonicalPath,
      customData: {
        lead_source: "paid_search",
        country: record.country.code,
        segment: record.segment.key,
        request_type: record.segment.requestType,
        equipment_type: data.equipment_type,
      },
    });

    await track("lead_submitted", {
      source: "paid_search",
      country: record.country.code,
      segment: record.segment.key,
    }).catch(() => {});

    // Visitor auto-reply (best-effort). Locale-aware: es keeps the Spanish body
    // byte-for-byte; en (Africa) gets an English body. Only when an email is present.
    if (data.contact_email) {
      const autoReply =
        locale === "en"
          ? {
              subject: `We received your request — Meridian (${record.country.name})`,
              html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#0ea5e9;color:white;padding:24px;border-radius:8px 8px 0 0">
                <h1 style="margin:0;font-size:20px">Thanks for your enquiry</h1>
              </div>
              <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;color:#111827">
                <p>We received your quote request for ${safe(data.equipment_type)} bound for ${safe(record.country.name)}.</p>
                <p>We source the machine in the USA, inspect it at origin before you pay, ship it, and clear your customs. We'll review the details and reply with the scope of the international leg within the next 24 business hours. The exact duty line and admissibility are confirmed by your licensed customs broker at destination.</p>
                <p>If you'd rather move now, message us on <a href="${CONTACT.whatsappUrl}">WhatsApp</a>.</p>
                <p style="color:#6b7280;font-size:13px">— The Meridian Freight team</p>
              </div>
            </div>
          `,
            }
          : {
              subject: `Recibimos su solicitud — Meridian (${record.country.name})`,
              html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#0ea5e9;color:white;padding:24px;border-radius:8px 8px 0 0">
                <h1 style="margin:0;font-size:20px">Gracias por su consulta</h1>
              </div>
              <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;color:#111827">
                <p>Recibimos su solicitud de cotización para ${safe(data.equipment_type)} con destino a ${safe(record.country.name)}.</p>
                <p>Revisaremos los datos del equipo y le responderemos con el alcance del tramo internacional (origen, exportación y flete marítimo) dentro de las próximas 24 horas hábiles. La nacionalización y los tributos los confirma su despachante en destino.</p>
                <p>Si prefiere avanzar ahora, escríbanos por <a href="${CONTACT.whatsappUrl}">WhatsApp</a>.</p>
                <p style="color:#6b7280;font-size:13px">— Equipo Meridian Freight</p>
              </div>
            </div>
          `,
            };
      try {
        await resend.emails.send({
          from: CONTACT.fromEmail,
          to: data.contact_email,
          subject: autoReply.subject,
          html: autoReply.html,
        });
      } catch (e) {
        log({ level: "warn", msg: "visitor_autoreply_failed", route: "action:paid-search-lead", error: String(e) });
      }
    }
  });

  timer.done({ lead_id, country: record.country.code, segment: record.segment.key });
  return { success: true, lead_id, eventId };
}
