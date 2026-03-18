"use server";

import { Resend } from "resend";
import { calculatorEmailSchema, type CalculatorEmailData } from "@/lib/schemas";
import { calculateFreight, type FreightEstimate } from "@/lib/freight-engine";
import { CONTACT, COMPANY } from "@/lib/constants";
import { notifySlack } from "@/lib/slack";
import { sendCAPIEvent } from "@/lib/meta-capi";

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
      console.error("Calculator lead insert failed:", resp.status, await resp.text());
    }
  } catch (e) {
    console.error("Calculator lead insert failed:", e);
  }
}

export type CalculatorResult = {
  success: boolean;
  error?: string;
  estimate?: FreightEstimate;
  eventId?: string;
};

export async function submitCalculator(
  raw: CalculatorEmailData
): Promise<CalculatorResult> {
  // 1. Validate
  const parsed = calculatorEmailSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  // 2. Honeypot — bots fill hidden fields, return success silently
  if (data.website) {
    return { success: true };
  }

  // 3. Calculate
  const estimate = calculateFreight(data.equipmentType, data.destination);
  if (!estimate) {
    return { success: false, error: "Could not calculate estimate for this combination." };
  }

  // 4. Save lead with UTM attribution (best-effort)
  await insertCalculatorLead({
    name: data.name || null,
    email: data.email,
    company: data.company || null,
    message: `[Calculator] ${data.equipmentType} via ${data.destination}`,
    source_page: data.source_page || "corporate: /pricing/calculator",
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_term: data.utm_term || null,
    utm_content: data.utm_content || null,
    status: "new",
  });

  // 5. Enforce Resend — fail visibly if email service is not configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured." };
  }

  const resend = new Resend(apiKey);

  // 6. Notify owner
  try {
    const { error } = await resend.emails.send({
      from: CONTACT.fromEmail,
      to: CONTACT.notificationEmail,
      replyTo: data.email,
      subject: `Calculator Lead: ${data.equipmentType}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">New Calculator Lead</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
            ${data.name ? `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>` : ""}
            ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
            <p><strong>Equipment:</strong> ${escapeHtml(data.equipmentType)}</p>
            <p><strong>Route:</strong> ${escapeHtml(data.destination)}</p>
            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:16px 0"/>
            <p><strong>Estimate:</strong> ${estimate.totalEstimate}</p>
            <p>Packing: ${estimate.packingCost} | Shipping: ${estimate.shippingCost} (${estimate.shippingType === "lines" ? "Line's" : "SOC"})</p>
            <p style="font-size:12px;color:#6b7280">
              Source: ${escapeHtml(data.source_page || "direct")}<br/>
              UTM: ${escapeHtml([data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") || "none")}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error (calculator admin notify):", error);
      return {
        success: false,
        error: (error as { message?: string })?.message || "Failed to send email.",
      };
    }
  } catch (err) {
    console.error("Calculator notification failed:", err);
    return { success: false, error: "An unexpected error occurred." };
  }

  // 7. Auto-reply to visitor with estimate (best-effort)
  try {
    await resend.emails.send({
      from: CONTACT.fromEmail,
      to: data.email,
      replyTo: CONTACT.notificationEmail,
      subject: `Your Freight Estimate — ${COMPANY.name}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#111827">
          <p>Hi${data.name ? ` ${escapeHtml(data.name)}` : ""},</p>
          <p>Thanks for using the ${COMPANY.name} freight calculator. Here&rsquo;s your estimate:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr style="background:#f0f9ff">
              <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Equipment</strong></td>
              <td style="padding:10px 14px;border:1px solid #e0e7ef">${escapeHtml(data.equipmentType)}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Route</strong></td>
              <td style="padding:10px 14px;border:1px solid #e0e7ef">${escapeHtml(data.destination)}</td>
            </tr>
            <tr style="background:#f0f9ff">
              <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Packing &amp; Loading</strong></td>
              <td style="padding:10px 14px;border:1px solid #e0e7ef">${estimate.packingCost}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Container Shipping</strong></td>
              <td style="padding:10px 14px;border:1px solid #e0e7ef">${estimate.shippingCost} (${estimate.shippingType === "lines" ? "Line&rsquo;s Container" : "SOC"})</td>
            </tr>
            <tr style="background:#eff6ff">
              <td style="padding:10px 14px;border:1px solid #e0e7ef"><strong>Estimated Total</strong></td>
              <td style="padding:10px 14px;border:1px solid #e0e7ef;font-size:18px"><strong>${estimate.totalEstimate}</strong></td>
            </tr>
          </table>
          <p style="font-size:13px;color:#6b7280">This is an estimate based on reference rates. Actual costs may vary depending on equipment condition, accessibility, and current market rates.</p>
          <p>Ready for a detailed quote? Reply to this email or <a href="${CONTACT.whatsappUrl}" style="color:#2563eb">WhatsApp us</a>.</p>
          <p style="margin-top:20px;color:#6b7280;font-size:13px">&mdash; ${COMPANY.name}</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Calculator auto-reply failed:", e);
  }

  // 8. Slack notification (best-effort)
  const slackLines = [
    `*New calculator lead:* ${data.name || "Anonymous"} <${data.email}>`,
    data.company ? `Company: ${data.company}` : null,
    `Equipment: ${data.equipmentType}`,
    `Route: ${data.destination}`,
    `Estimate: ${estimate.totalEstimate} (Packing: ${estimate.packingCost} + Shipping: ${estimate.shippingCost})`,
  ]
    .filter(Boolean)
    .join("\n");

  await notifySlack(slackLines);

  // 9. Meta CAPI Lead event (best-effort)
  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  await sendCAPIEvent({
    eventName: "Lead",
    eventId,
    email: data.email,
    customData: {
      lead_source: "freight_calculator",
      equipment_type: data.equipmentType,
      route: data.destination,
    },
  });

  return { success: true, estimate, eventId };
}
