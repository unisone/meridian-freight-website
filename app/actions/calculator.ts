"use server";

import { Resend } from "resend";
import { calculatorV2Schema, type CalculatorV2Data } from "@/lib/schemas";
import { calculateFreightV2, formatDollar } from "@/lib/freight-engine-v2";
import { fetchEquipmentRates, fetchOceanRates } from "@/lib/supabase-rates";
import type { FreightEstimateV2 } from "@/lib/types/calculator";
import { COUNTRY_NAMES } from "@/lib/types/calculator";
import { after } from "next/server";
import { CONTACT, COMPANY } from "@/lib/constants";
import { track } from "@vercel/analytics/server";
import { notifySlack } from "@/lib/slack";
import { sendCAPIEvent } from "@/lib/meta-capi";
import { startTimer, log } from "@/lib/logger";

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function insertCalculatorLead(data: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    const resp = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(data),
    });
    if (!resp.ok) {
      log({ level: "error", msg: "supabase_insert_failed", route: "action:calculator", status: resp.status, body: await resp.text() });
    }
  } catch (e) {
    log({ level: "error", msg: "supabase_insert_exception", route: "action:calculator", error: String(e) });
  }
}

export type CalculatorResult = {
  success: boolean;
  error?: string;
  estimate?: FreightEstimateV2;
  eventId?: string;
};

const CALC_REPLY_SUBJECTS: Record<string, string> = {
  en: `Your Freight Estimate — ${COMPANY.name}`,
  es: `Su Cotizacion de Flete — ${COMPANY.name}`,
  ru: `Ваш расчет стоимости доставки — ${COMPANY.name}`,
};

const CALC_REPLY_INTRO: Record<string, (name: string) => string> = {
  en: (name) => `<p>Hi${name ? ` ${name}` : ""},</p><p>Thanks for using the ${COMPANY.name} freight calculator. Here&rsquo;s your estimate:</p>`,
  es: (name) => `<p>Hola${name ? ` ${name}` : ""},</p><p>Gracias por usar la calculadora de flete de ${COMPANY.name}. Aqui tiene su cotizacion:</p>`,
  ru: (name) => `<p>Здравствуйте${name ? `, ${name}` : ""},</p><p>Спасибо за использование калькулятора доставки ${COMPANY.name}. Вот ваш расчет:</p>`,
};

const CALC_REPLY_FOOTER: Record<string, string> = {
  en: `<p style="font-size:13px;color:#6b7280">This estimate covers packing, loading, and ocean freight. Customs duties, import taxes, insurance, and destination inland transport are not included.</p><p>Ready for a detailed quote? Reply to this email or <a href="${CONTACT.whatsappUrl}" style="color:#2563eb">WhatsApp us</a>.</p>`,
  es: `<p style="font-size:13px;color:#6b7280">Esta cotizacion cubre embalaje, carga y flete maritimo. Aranceles aduaneros, impuestos de importacion, seguro y transporte terrestre en destino no estan incluidos.</p><p>Listo para una cotizacion detallada? Responda a este correo o <a href="${CONTACT.whatsappUrl}" style="color:#2563eb">escribanos por WhatsApp</a>.</p>`,
  ru: `<p style="font-size:13px;color:#6b7280">Данный расчет включает упаковку, погрузку и морской фрахт. Таможенные пошлины, импортные налоги, страхование и доставка по стране назначения не включены.</p><p>Готовы к детальному расчету? Ответьте на это письмо или <a href="${CONTACT.whatsappUrl}" style="color:#2563eb">напишите нам в WhatsApp</a>.</p>`,
};

export async function submitCalculator(
  raw: CalculatorV2Data,
  locale: string = "en"
): Promise<CalculatorResult> {
  const timer = startTimer("action:calculator");

  // 1. Validate
  const parsed = calculatorV2Schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  // 2. Honeypot — bots fill hidden fields, return success silently
  if (data.website) {
    return { success: true };
  }

  // 3. Server-side re-calculation for integrity
  const [equipmentRates, oceanRates] = await Promise.all([
    fetchEquipmentRates(),
    fetchOceanRates(),
  ]);

  if (!equipmentRates || !oceanRates) {
    return { success: false, error: "Rate data temporarily unavailable. Please try again." };
  }

  const equipment = equipmentRates.find((e) => e.equipment_type === data.equipmentType);
  if (!equipment) {
    return { success: false, error: "Equipment type not found in current rates." };
  }

  const estimate = calculateFreightV2({
    equipment,
    equipmentSize: data.equipmentSize,
    destinationCountry: data.destinationCountry,
    zipCode: data.zipCode || null,
    oceanRates,
  });

  if (!estimate) {
    return { success: false, error: "No shipping rates available for this destination." };
  }

  const countryName = COUNTRY_NAMES[data.destinationCountry] ?? data.destinationCountry;

  // 4. Save lead with UTM attribution (best-effort)
  await insertCalculatorLead({
    name: data.name || null,
    email: data.email,
    company: data.company || null,
    message: `[Calculator V2] ${estimate.equipmentDisplayName} → ${countryName} | ${estimate.containerType === "fortyhc" ? "40HC" : "Flatrack"} | Est: ${formatDollar(estimate.estimatedTotal)}`,
    source_page: data.source_page || "corporate: /pricing/calculator",
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_term: data.utm_term || null,
    utm_content: data.utm_content || null,
    status: "new",
  });

  // 5. Enforce Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    timer.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured." };
  }

  const resend = new Resend(apiKey);
  const containerLabel = estimate.containerType === "fortyhc" ? "40' High Cube" : "Flat Rack";

  // 6. Notify owner
  try {
    const { error } = await resend.emails.send({
      from: CONTACT.fromEmail,
      to: CONTACT.notificationEmail,
      replyTo: data.email,
      subject: `Calculator Lead: ${estimate.equipmentDisplayName} → ${countryName}${locale !== "en" ? ` [${locale.toUpperCase()}]` : ""}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">New Calculator Lead (V2)</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            ${data.name ? `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>` : ""}
            ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:16px 0"/>
            <p><strong>Equipment:</strong> ${escapeHtml(estimate.equipmentDisplayName)}</p>
            ${data.equipmentSize ? `<p><strong>Size:</strong> ${data.equipmentSize} units</p>` : ""}
            <p><strong>Container:</strong> ${containerLabel}</p>
            <p><strong>Route:</strong> ${escapeHtml(estimate.originPort)} → ${escapeHtml(estimate.destinationPort)}, ${escapeHtml(countryName)}</p>
            ${data.zipCode ? `<p><strong>ZIP:</strong> ${escapeHtml(data.zipCode)}</p>` : ""}
            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:16px 0"/>
            <table style="width:100%;border-collapse:collapse">
              ${estimate.usInlandTransport !== null ? `<tr><td style="padding:6px 0">US Inland Transport</td><td style="text-align:right;font-weight:bold">${formatDollar(estimate.usInlandTransport)}</td></tr>` : ""}
              ${estimate.packingAndLoading > 0 ? `<tr><td style="padding:6px 0">Packing & Loading</td><td style="text-align:right;font-weight:bold">${formatDollar(estimate.packingAndLoading)}</td></tr>` : ""}
              <tr><td style="padding:6px 0">${estimate.containerType === "flatrack" ? "Sea Freight & Loading" : "Ocean Freight"} (${escapeHtml(estimate.carrier)})</td><td style="text-align:right;font-weight:bold">${formatDollar(estimate.oceanFreight)}</td></tr>
              <tr style="border-top:2px solid #2563eb"><td style="padding:8px 0;font-weight:bold;font-size:16px">Estimated Total</td><td style="text-align:right;font-weight:bold;font-size:16px;color:#2563eb">${formatDollar(estimate.estimatedTotal)}</td></tr>
            </table>
            <p style="font-size:12px;color:#6b7280;margin-top:16px">
              Source: ${escapeHtml(data.source_page || "direct")}<br/>
              UTM: ${escapeHtml([data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") || "none")}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      timer.error(error, { step: "owner_email" });
      return {
        success: false,
        error: (error as { message?: string })?.message || "Failed to send email.",
      };
    }
  } catch (err) {
    timer.error(err, { step: "owner_email" });
    return { success: false, error: "An unexpected error occurred." };
  }

  // Generate event ID before returning (needed for Pixel/CAPI dedup)
  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 7-10. Best-effort work runs AFTER the response is sent to the user.
  // This saves ~700-1300ms of perceived latency.
  after(async () => {
    // 7. Auto-reply to visitor with estimate in their language
    try {
      const calcSubject = CALC_REPLY_SUBJECTS[locale] ?? CALC_REPLY_SUBJECTS.en;
      const calcIntro = (CALC_REPLY_INTRO[locale] ?? CALC_REPLY_INTRO.en)(data.name ? escapeHtml(data.name) : "");
      const calcFooter = CALC_REPLY_FOOTER[locale] ?? CALC_REPLY_FOOTER.en;
      await resend.emails.send({
        from: CONTACT.fromEmail,
        to: data.email,
        replyTo: CONTACT.notificationEmail,
        subject: calcSubject,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#111827">
            ${calcIntro}
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr style="background:#f0f9ff">
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Equipment</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef">${escapeHtml(estimate.equipmentDisplayName)}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Container Type</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef">${containerLabel}</td>
              </tr>
              <tr style="background:#f0f9ff">
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Route</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef">${escapeHtml(estimate.originPort)} &rarr; ${escapeHtml(estimate.destinationPort)}, ${escapeHtml(countryName)}</td>
              </tr>
              ${estimate.usInlandTransport !== null ? `
              <tr>
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>US Inland Transport</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef">${formatDollar(estimate.usInlandTransport)}</td>
              </tr>` : ""}
              ${estimate.packingAndLoading > 0 ? `
              <tr style="background:#f0f9ff">
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Packing &amp; Loading</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef">${formatDollar(estimate.packingAndLoading)}${estimate.packingBreakdown ? ` <span style="color:#6b7280;font-size:12px">(${escapeHtml(estimate.packingBreakdown)})</span>` : ""}</td>
              </tr>` : ""}
              <tr${estimate.packingAndLoading > 0 ? "" : ' style="background:#f0f9ff"'}>
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>${estimate.containerType === "flatrack" ? "Sea Freight &amp; Loading" : "Ocean Freight"}</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef">${formatDollar(estimate.oceanFreight)} (${escapeHtml(estimate.carrier)}${estimate.transitTimeDays ? `, ${escapeHtml(estimate.transitTimeDays)} days` : ""})</td>
              </tr>
              <tr style="background:#eff6ff">
                <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Estimated Total</strong></td>
                <td style="padding:10px 14px;border:1px solid #e0e7ef;font-size:18px"><strong>${formatDollar(estimate.estimatedTotal)}</strong>${estimate.totalExcludesInland ? " <span style='color:#6b7280;font-size:12px'>(excludes US inland)</span>" : ""}</td>
              </tr>
            </table>
            ${calcFooter}
            <p style="margin-top:20px;color:#6b7280;font-size:13px">&mdash; ${COMPANY.name}</p>
          </div>
        `,
      });
    } catch (e) {
      log({ level: "error", msg: "auto_reply_failed", route: "action:calculator", error: String(e) });
    }

    // 8. Slack notification
    const slackLines = [
      `*New calculator lead (V2${locale !== "en" ? ` — ${locale.toUpperCase()}` : ""}):* ${data.name || "Anonymous"} <${data.email}>`,
      data.company ? `Company: ${data.company}` : null,
      `Equipment: ${estimate.equipmentDisplayName} (${containerLabel})`,
      `Route: ${estimate.originPort} → ${estimate.destinationPort}, ${countryName}`,
      `Estimate: ${formatDollar(estimate.estimatedTotal)} (Inland: ${estimate.usInlandTransport !== null ? formatDollar(estimate.usInlandTransport) : "N/A"} + Packing: ${formatDollar(estimate.packingAndLoading)} + Ocean: ${formatDollar(estimate.oceanFreight)})`,
    ]
      .filter(Boolean)
      .join("\n");

    await notifySlack(slackLines);

    // 9. Meta CAPI Lead event
    await sendCAPIEvent({
      eventName: "Lead",
      eventId,
      email: data.email,
      customData: {
        lead_source: "freight_calculator_v2",
        equipment_type: data.equipmentType,
        destination_country: data.destinationCountry,
        container_type: data.containerType,
      },
    });

    // 10. Vercel Analytics server-side event
    await track("lead_submitted", {
      source: "calculator",
      equipment: data.equipmentType,
      destination: data.destinationCountry,
      container: data.containerType,
    }).catch(() => {});
  });

  timer.done({ email: data.email, equipment: data.equipmentType, destination: data.destinationCountry });
  return { success: true, estimate, eventId };
}
