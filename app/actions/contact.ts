"use server";

import { Resend } from "resend";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { CONTACT, COMPANY } from "@/lib/constants";
import { notifySlack } from "@/lib/slack";

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function insertLeadToSupabase(lead: Record<string, unknown>) {
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
      body: JSON.stringify(lead),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.error("Supabase insert failed:", resp.status, text);
    }
  } catch (e) {
    console.error("Supabase insert exception:", e);
  }
}

export type ContactActionResult = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  raw: ContactFormData
): Promise<ContactActionResult> {
  // 1. Validate
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid form data";
    return { success: false, error: firstError };
  }

  const data = parsed.data;

  // 2. Honeypot check — bots fill hidden fields, return success silently
  if (data.website) {
    return { success: true };
  }

  const { name, email, company, phone, equipmentType, message } = data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  // 3. Supabase INSERT (best-effort)
  await insertLeadToSupabase({
    name,
    email,
    company: company || null,
    phone: phone || null,
    equipment_type: equipmentType || null,
    message,
    source_page: data.source_page || null,
    source: "corporate",
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_term: data.utm_term || null,
    utm_content: data.utm_content || null,
    status: "new",
  });

  // 4. Email to owner (must succeed)
  try {
    const { error } = await resend.emails.send({
      from: CONTACT.fromEmail,
      to: CONTACT.notificationEmail,
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">New Contact Form — Corporate Site</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
            ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
            ${equipmentType ? `<p><strong>Equipment:</strong> ${escapeHtml(equipmentType)}</p>` : ""}
            <p><strong>Message:</strong><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>
            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:16px 0"/>
            <p style="font-size:12px;color:#6b7280">
              Source: ${escapeHtml(data.source_page || "direct")}<br/>
              UTM: ${escapeHtml([data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") || "none")}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error (admin notify):", error);
      return {
        success: false,
        error: (error as { message?: string })?.message || "Failed to send email.",
      };
    }
  } catch (err) {
    console.error("Contact API error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }

  // 5. Auto-reply to visitor (best-effort)
  try {
    await resend.emails.send({
      from: CONTACT.fromEmail,
      to: email,
      replyTo: CONTACT.notificationEmail,
      subject: `We received your message — ${COMPANY.name}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#111827">
          <p>Hi ${safeName},</p>
          <p>Thanks for reaching out to ${COMPANY.name}. We received your message and will respond within <strong>24 hours</strong>.</p>
          <p style="margin-top:16px;color:#374151"><strong>Your message:</strong><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>
          <p style="margin-top:20px;color:#6b7280;font-size:13px">If you need to add anything, just reply to this email.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Auto-reply failed:", e);
  }

  // 6. Slack notify (best-effort)
  const slackLines = [
    `*New lead (corporate site):* ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    phone ? `Phone: ${phone}` : null,
    equipmentType ? `Equipment: ${equipmentType}` : null,
    `Message: ${message.length > 280 ? message.slice(0, 280) + "…" : message}`,
  ]
    .filter(Boolean)
    .join("\n");

  await notifySlack(slackLines);

  return { success: true };
}
