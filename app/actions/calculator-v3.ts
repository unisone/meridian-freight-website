"use server";

import { Resend } from "resend";
import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import { calculateFreightV3 } from "@/lib/calculator-v3/engine";
import {
  CALCULATOR_V3_POLICY_VERSION,
  getEquipmentProfile,
  getLocalizedText,
} from "@/lib/calculator-v3/policy";
import { buildRateBookSignature } from "@/lib/calculator-contract.server";
import { CONTACT, COMPANY } from "@/lib/constants";
import { formatDollar } from "@/lib/freight-engine-v2";
import { log, startTimer } from "@/lib/logger";
import { sendCAPIEvent } from "@/lib/meta-capi";
import { calculatorV3Schema, type CalculatorV3Data } from "@/lib/schemas";
import { notifySlack } from "@/lib/slack";
import { fetchEquipmentRates, fetchOceanRates } from "@/lib/supabase-rates";
import { COUNTRY_NAMES } from "@/lib/types/calculator";
import type {
  FreightEstimateV3,
  FreightLineItemV3,
} from "@/lib/calculator-v3/contracts";

function escapeHtml(input: string | number | null | undefined): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function insertCalculatorV3Lead(data: Record<string, unknown>) {
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
      log({
        level: "error",
        msg: "supabase_insert_failed",
        route: "action:calculator-v3",
        status: resp.status,
        body: await resp.text(),
      });
    }
  } catch (e) {
    log({
      level: "error",
      msg: "supabase_insert_exception",
      route: "action:calculator-v3",
      error: String(e),
    });
  }
}

export type CalculatorV3Result = {
  success: boolean;
  error?: string;
  estimate?: FreightEstimateV3;
  eventId?: string;
  rateBookChanged?: boolean;
  currentRateBookSignature?: string;
};

const CALCULATOR_V3_ERROR_COPY = {
  en: {
    rateDataUnavailable:
      "Rate data is temporarily unavailable. Please try again.",
    unsupportedSelection:
      "This equipment, mode, and destination cannot be quoted automatically. Please request a manual quote.",
    equipmentValueRequired:
      "Equipment value is required for whole-unit or import-cost estimates.",
    routeChanged:
      "The selected route is no longer available. Review the refreshed route and submit again.",
    rateBookChanged:
      "Freight rates were updated while you were using the calculator. Review the refreshed estimate and submit again.",
    emailServiceUnavailable: "Email service is not configured.",
    ownerEmailFailed: "Failed to send email.",
    unexpected: "An unexpected error occurred.",
  },
  es: {
    rateDataUnavailable:
      "Las tarifas de flete no estan disponibles temporalmente. Intente nuevamente.",
    unsupportedSelection:
      "Este equipo, modo y destino no se pueden cotizar automaticamente. Solicite una cotizacion manual.",
    equipmentValueRequired:
      "El valor del equipo es obligatorio para envios completos o estimaciones de importacion.",
    routeChanged:
      "La ruta seleccionada ya no esta disponible. Revise la ruta actualizada y envie de nuevo.",
    rateBookChanged:
      "Las tarifas de flete se actualizaron mientras usaba la calculadora. Revise la cotizacion actualizada y envie de nuevo.",
    emailServiceUnavailable: "El servicio de correo no esta configurado.",
    ownerEmailFailed: "No se pudo enviar el correo.",
    unexpected: "Ocurrio un error inesperado.",
  },
  ru: {
    rateDataUnavailable:
      "Тарифы на фрахт временно недоступны. Повторите попытку позже.",
    unsupportedSelection:
      "Для этой техники, способа отправки и страны нельзя сделать автоматический расчет. Запросите ручной расчет.",
    equipmentValueRequired:
      "Для отправки целиком или импортной оценки требуется стоимость техники.",
    routeChanged:
      "Выбранный маршрут больше недоступен. Проверьте обновленный маршрут и отправьте форму снова.",
    rateBookChanged:
      "Тарифы обновились, пока вы пользовались калькулятором. Проверьте обновленную оценку и отправьте форму еще раз.",
    emailServiceUnavailable: "Почтовый сервис не настроен.",
    ownerEmailFailed: "Не удалось отправить письмо.",
    unexpected: "Произошла непредвиденная ошибка.",
  },
} as const;

function getCalculatorV3Error(
  locale: string,
  key: keyof (typeof CALCULATOR_V3_ERROR_COPY)["en"],
): string {
  const normalizedLocale = locale.toLowerCase();
  return (
    CALCULATOR_V3_ERROR_COPY[
      normalizedLocale as keyof typeof CALCULATOR_V3_ERROR_COPY
    ]?.[key] ?? CALCULATOR_V3_ERROR_COPY.en[key]
  );
}

function countryName(country: string): string {
  return COUNTRY_NAMES[country.toUpperCase()] ?? country.toUpperCase();
}

function routeLabel(estimate: FreightEstimateV3): string {
  return `${estimate.route.origin.label} -> ${estimate.route.destination.label} (${countryName(estimate.route.destinationCountry)} route)`;
}

function lineItemHtml(item: FreightLineItemV3): string {
  const amount =
    item.amountUsd == null
      ? "Quote-confirmed"
      : item.includedInTotal
        ? formatDollar(item.amountUsd)
        : `${formatDollar(item.amountUsd)} (not included)`;
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb">
      ${escapeHtml(item.label)}
      ${item.note ? `<div style="font-size:12px;color:#6b7280">${escapeHtml(item.note)}</div>` : ""}
    </td>
    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${escapeHtml(amount)}</td>
  </tr>`;
}

function importCostHtml(estimate: FreightEstimateV3, locale: string): string {
  const importCost = estimate.importCost;
  if (!importCost.available || importCost.amountUsd == null) {
    const note = importCost.note ? getLocalizedText(importCost.note, locale) : "Not available for this selection.";
    return `<p style="font-size:13px;color:#6b7280"><strong>Indicative import-cost estimate:</strong> ${escapeHtml(note)}</p>`;
  }

  return `
    <div style="margin-top:18px;padding:14px;border:1px solid #dbeafe;border-radius:8px;background:#eff6ff">
      <p style="margin:0 0 8px;font-weight:bold">Indicative import-cost estimate: ${formatDollar(importCost.amountUsd)}</p>
      <p style="margin:0;color:#374151;font-size:13px">
        Duty: ${formatDollar(importCost.dutyUsd ?? 0)} (${Math.round((importCost.dutyRatePct ?? 0) * 1000) / 10}%),
        tax: ${formatDollar(importCost.taxUsd ?? 0)} (${Math.round((importCost.taxRatePct ?? 0) * 1000) / 10}%).
        HS ${escapeHtml(importCost.hsCode)}, ${escapeHtml(importCost.sourceLabel)} (${escapeHtml(importCost.sourceVersion)}), retrieved ${escapeHtml(importCost.retrievedAt)}.
      </p>
      <p style="margin:8px 0 0;color:#6b7280;font-size:12px">${escapeHtml(importCost.note ? getLocalizedText(importCost.note, locale) : "")}</p>
    </div>
  `;
}

function estimateSummaryHtml(estimate: FreightEstimateV3, locale: string): string {
  const profileName = getLocalizedText(estimate.equipmentDisplayName, locale);
  const modeName = getLocalizedText(estimate.mode.label, locale);
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb">Equipment</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${escapeHtml(profileName)} x ${estimate.quantity}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb">Mode</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${escapeHtml(modeName)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb">Route</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:bold">${escapeHtml(routeLabel(estimate))}</td>
      </tr>
      ${estimate.lineItems.map(lineItemHtml).join("")}
      <tr>
        <td style="padding:10px 0;font-size:16px;font-weight:bold">Freight total</td>
        <td style="padding:10px 0;text-align:right;font-size:18px;font-weight:bold;color:#2563eb">${formatDollar(estimate.freightTotal)}${estimate.totalExcludesInland ? " <span style='font-size:12px;color:#6b7280'>(excludes U.S. inland)</span>" : ""}</td>
      </tr>
    </table>
    ${estimate.dedicatedContainerFreightTotal != null ? `<p style="font-size:13px;color:#6b7280">Dedicated-container comparison: ${formatDollar(estimate.dedicatedContainerFreightTotal)}.</p>` : ""}
    ${importCostHtml(estimate, locale)}
  `;
}

export async function submitCalculatorV3(
  raw: CalculatorV3Data,
  locale: string = "en",
): Promise<CalculatorV3Result> {
  const timer = startTimer("action:calculator-v3");

  const parsed = calculatorV3Schema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const data = parsed.data;
  if (data.website) {
    return { success: true };
  }

  const [equipmentRates, oceanRates] = await Promise.all([
    fetchEquipmentRates(),
    fetchOceanRates(),
  ]);

  if (!equipmentRates || !oceanRates) {
    return {
      success: false,
      error: getCalculatorV3Error(locale, "rateDataUnavailable"),
    };
  }

  const currentRateBookSignature = buildRateBookSignature({
    equipmentRates,
    oceanRates,
  });
  const profile = getEquipmentProfile(data.equipmentProfileId);
  const mode = profile?.modes.find((candidate) => candidate.id === data.modeId);
  if (!profile || !mode || !mode.enabled) {
    return {
      success: false,
      error: getCalculatorV3Error(locale, "unsupportedSelection"),
      currentRateBookSignature,
    };
  }

  if (mode.requiresEquipmentValue && data.equipmentValueUsd == null) {
    return {
      success: false,
      error: getCalculatorV3Error(locale, "equipmentValueRequired"),
      currentRateBookSignature,
    };
  }

  const destinationCountry = data.destinationCountry.toUpperCase();
  const estimate = calculateFreightV3({
    equipmentRates,
    oceanRates,
    equipmentProfileId: data.equipmentProfileId,
    modeId: data.modeId,
    quantity: data.quantity,
    equipmentValueUsd: data.equipmentValueUsd,
    destinationCountry,
    destinationPortKey: data.destinationPortKey,
    routeId: data.routeId,
    routePreference: data.routePreference,
    zipCode: data.zipCode || null,
  });

  if (!estimate) {
    return {
      success: false,
      error: getCalculatorV3Error(locale, "unsupportedSelection"),
      currentRateBookSignature,
    };
  }

  if (data.routeId && estimate.route.id !== data.routeId) {
    return {
      success: false,
      error: getCalculatorV3Error(locale, "routeChanged"),
      estimate,
      currentRateBookSignature,
    };
  }

  if (data.rateBookSignature !== currentRateBookSignature) {
    log({
      level: "warn",
      msg: "calculator_v3_ratebook_changed",
      route: "action:calculator-v3",
      clientRateBookSignature: data.rateBookSignature,
      currentRateBookSignature,
      equipmentProfileId: data.equipmentProfileId,
      destinationCountry,
    });
    return {
      success: false,
      error: getCalculatorV3Error(locale, "rateBookChanged"),
      estimate,
      rateBookChanged: true,
      currentRateBookSignature,
    };
  }

  const profileName = getLocalizedText(profile.label, locale);
  const modeName = getLocalizedText(mode.label, locale);
  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  await insertCalculatorV3Lead({
    name: data.name || null,
    email: data.email,
    phone: data.phone || null,
    company: data.company || null,
    message: `[Calculator V3 ${currentRateBookSignature} / ${CALCULATOR_V3_POLICY_VERSION}] ${profileName} x ${estimate.quantity} -> ${countryName(destinationCountry)} | ${modeName} | ${estimate.route.id} | Freight: ${formatDollar(estimate.freightTotal)}${estimate.importCost.available && estimate.importCost.amountUsd != null ? ` | Import estimate: ${formatDollar(estimate.importCost.amountUsd)}` : " | Import estimate: not available"} | Preferred contact: ${data.preferredContact}`,
    source_page: data.source_page || "corporate: /pricing/calculator-v3",
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_term: data.utm_term || null,
    utm_content: data.utm_content || null,
    status: "new",
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    timer.error("RESEND_API_KEY is not configured");
    return {
      success: false,
      error: getCalculatorV3Error(locale, "emailServiceUnavailable"),
      currentRateBookSignature,
    };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: CONTACT.fromEmail,
      to: CONTACT.notificationEmail,
      cc: CONTACT.notificationCc as unknown as string[],
      replyTo: data.email,
      subject: `Calculator V3 Lead: ${profileName} -> ${countryName(destinationCountry)}${locale !== "en" ? ` [${locale.toUpperCase()}]` : ""}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:0 auto;color:#111827">
          <div style="background:#0f172a;color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">New Calculator Lead (V3)</h1>
            <p style="margin:8px 0 0;color:#cbd5e1">Policy ${escapeHtml(CALCULATOR_V3_POLICY_VERSION)} | Rate book ${escapeHtml(currentRateBookSignature)}</p>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            ${data.name ? `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>` : ""}
            ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
            ${data.phone ? `<p><strong>Phone/WhatsApp:</strong> ${escapeHtml(data.phone)} (${escapeHtml(data.preferredContact)})</p>` : `<p><strong>Preferred contact:</strong> ${escapeHtml(data.preferredContact)}</p>`}
            ${data.zipCode ? `<p><strong>ZIP:</strong> ${escapeHtml(data.zipCode)}</p>` : ""}
            ${data.equipmentValueUsd ? `<p><strong>Declared equipment value:</strong> ${formatDollar(data.equipmentValueUsd)}</p>` : ""}
            <hr style="border:none;border-top:1px dashed #d1d5db;margin:18px 0"/>
            ${estimateSummaryHtml(estimate, locale)}
            ${estimate.warnings.length > 0 ? `<h3 style="margin-top:18px">Warnings</h3><ul>${estimate.warnings.map((warning) => `<li>${escapeHtml(getLocalizedText(warning, locale))}</li>`).join("")}</ul>` : ""}
            <p style="font-size:12px;color:#6b7280;margin-top:16px">
              Route ID: ${escapeHtml(estimate.route.id)}<br/>
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
        error:
          (error as { message?: string })?.message ||
          getCalculatorV3Error(locale, "ownerEmailFailed"),
        currentRateBookSignature,
      };
    }
  } catch (err) {
    timer.error(err, { step: "owner_email" });
    return {
      success: false,
      error: getCalculatorV3Error(locale, "unexpected"),
      currentRateBookSignature,
    };
  }

  after(async () => {
    try {
      await resend.emails.send({
        from: CONTACT.fromEmail,
        to: data.email,
        replyTo: CONTACT.replyToEmails as unknown as string[],
        subject: `Your Freight Estimate - ${COMPANY.name}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:680px;margin:0 auto;line-height:1.6;color:#111827">
            <p>Hi${data.name ? ` ${escapeHtml(data.name)}` : ""},</p>
            <p>Thanks for using the ${COMPANY.name} freight calculator. Here is your V3 preview estimate:</p>
            ${estimateSummaryHtml(estimate, locale)}
            <p style="font-size:13px;color:#6b7280">Freight and import costs are shown separately. Import duties and taxes are indicative public-data estimates only and must be confirmed by the importer or customs broker before shipment.</p>
            <p>For a confirmed quote, reply to this email or <a href="${CONTACT.whatsappUrl}" style="color:#2563eb">continue on WhatsApp</a>.</p>
            <p style="margin-top:20px;color:#6b7280;font-size:13px">- ${COMPANY.name}</p>
          </div>
        `,
      });
    } catch (e) {
      log({
        level: "error",
        msg: "auto_reply_failed",
        route: "action:calculator-v3",
        error: String(e),
      });
    }

    const slackLines = [
      `*New calculator lead (V3${locale !== "en" ? ` - ${locale.toUpperCase()}` : ""}):* ${data.name || "Anonymous"} <${data.email}>`,
      data.company ? `Company: ${data.company}` : null,
      data.phone ? `Phone/WhatsApp: ${data.phone} (${data.preferredContact})` : `Preferred contact: ${data.preferredContact}`,
      `Equipment: ${profileName} x ${estimate.quantity} (${modeName})`,
      data.equipmentValueUsd
        ? `Declared value: ${formatDollar(data.equipmentValueUsd)}`
        : null,
      `Route: ${routeLabel(estimate)}`,
      `Transit: ${estimate.route.transitTimeDays ?? "not published"}`,
      `Freight: ${formatDollar(estimate.freightTotal)} (${estimate.lineItems.map((line) => `${line.label}: ${line.amountUsd == null ? "quote-confirmed" : formatDollar(line.amountUsd)}`).join(" + ")})`,
      estimate.importCost.available && estimate.importCost.amountUsd != null
        ? `Import estimate: ${formatDollar(estimate.importCost.amountUsd)} | HS ${estimate.importCost.hsCode} | ${estimate.importCost.sourceVersion}`
        : "Import estimate: not available",
      estimate.warnings.length > 0
        ? `Warnings: ${estimate.warnings.map((warning) => getLocalizedText(warning, locale)).join(" | ")}`
        : null,
      `Route ID: ${estimate.route.id}`,
      `Rate book: ${currentRateBookSignature} | Policy: ${CALCULATOR_V3_POLICY_VERSION}`,
    ]
      .filter(Boolean)
      .join("\n");

    await notifySlack(slackLines);

    await sendCAPIEvent({
      eventName: "Lead",
      eventId,
      email: data.email,
      phone: data.phone || undefined,
      customData: {
        lead_source: "freight_calculator_v3",
        equipment_profile: data.equipmentProfileId,
        shipping_mode: data.modeId,
        route_preference: data.routePreference,
        route_id: estimate.route.id,
        origin_port: estimate.route.origin.label,
        destination_port: estimate.route.destination.label,
        destination_country: destinationCountry,
        freight_total: estimate.freightTotal,
        import_estimate_available: estimate.importCost.available,
        preferred_contact: data.preferredContact,
      },
    });

    await track("lead_submitted", {
      source: "calculator_v3",
      equipment_profile: data.equipmentProfileId,
      shipping_mode: data.modeId,
      destination: destinationCountry,
      route_preference: data.routePreference,
      route_id: estimate.route.id,
    }).catch(() => {});
  });

  timer.done({
    email: data.email,
    equipmentProfileId: data.equipmentProfileId,
    destinationCountry,
    routeId: estimate.route.id,
  });

  return {
    success: true,
    estimate,
    eventId,
    currentRateBookSignature,
  };
}
