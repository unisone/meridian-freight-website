"use server";

import { after } from "next/server";
import { Resend } from "resend";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
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
      log({ level: "error", msg: "supabase_insert_failed", route: "action:contact-form", status: resp.status, body: text });
    }
  } catch (e) {
    log({ level: "error", msg: "supabase_insert_exception", route: "action:contact-form", error: String(e) });
  }
}

export type ContactActionResult = {
  success: boolean;
  error?: string;
  eventId?: string;
};

const AUTO_REPLY_SUBJECTS: Record<string, string> = {
  en: `We received your message — ${COMPANY.name}`,
  es: `Hemos recibido su mensaje — ${COMPANY.name}`,
  ru: `Мы получили ваше сообщение — ${COMPANY.name}`,
};

const AUTO_REPLY_BODY: Record<string, (name: string, message: string) => string> = {
  en: (name, message) => `
    <p>Hi ${name},</p>
    <p>Thanks for reaching out to ${COMPANY.name}. We received your message and will respond within <strong>24 hours</strong>.</p>
    <p style="margin-top:16px;color:#374151"><strong>Your message:</strong><br/>${message}</p>
    <p style="margin-top:20px;color:#6b7280;font-size:13px">If you need to add anything, just reply to this email.</p>
  `,
  es: (name, message) => `
    <p>Hola ${name},</p>
    <p>Gracias por comunicarse con ${COMPANY.name}. Hemos recibido su mensaje y le responderemos dentro de las proximas <strong>24 horas</strong>.</p>
    <p style="margin-top:16px;color:#374151"><strong>Su mensaje:</strong><br/>${message}</p>
    <p style="margin-top:20px;color:#6b7280;font-size:13px">Si necesita agregar algo, simplemente responda a este correo.</p>
  `,
  ru: (name, message) => `
    <p>Здравствуйте, ${name},</p>
    <p>Спасибо за обращение в ${COMPANY.name}. Мы получили ваше сообщение и ответим в течение <strong>24 часов</strong>.</p>
    <p style="margin-top:16px;color:#374151"><strong>Ваше сообщение:</strong><br/>${message}</p>
    <p style="margin-top:20px;color:#6b7280;font-size:13px">Если вам нужно что-то добавить, просто ответьте на это письмо.</p>
  `,
};

export async function submitContactForm(
  raw: ContactFormData,
  locale: string = "en"
): Promise<ContactActionResult> {
  const timer = startTimer("action:contact-form");

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
    timer.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  // 3. Supabase INSERT (best-effort)
  // Note: `source` and `equipment_type` columns require this migration:
  //   ALTER TABLE leads ADD COLUMN IF NOT EXISTS source text DEFAULT 'lp';
  //   ALTER TABLE leads ADD COLUMN IF NOT EXISTS equipment_type text;
  await insertLeadToSupabase({
    name,
    email,
    company: company || null,
    phone: phone || null,
    message: equipmentType ? `[${equipmentType}] ${message}` : message,
    source_page: `corporate: ${data.source_page || "direct"}`,
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
      cc: CONTACT.notificationCc as unknown as string[],
      replyTo: email,
      subject: `New Contact Form: ${name}${locale !== "en" ? ` [${locale.toUpperCase()}]` : ""}`,
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

  // 5-8. Best-effort work runs AFTER the response is sent to the user.
  // This saves ~700-1300ms of perceived latency.
  after(async () => {
    // 5. Auto-reply to visitor in their language
    try {
      const replySubject = AUTO_REPLY_SUBJECTS[locale] ?? AUTO_REPLY_SUBJECTS.en;
      const replyBodyFn = AUTO_REPLY_BODY[locale] ?? AUTO_REPLY_BODY.en;
      await resend.emails.send({
        from: CONTACT.fromEmail,
        to: email,
        replyTo: CONTACT.email,
        subject: replySubject,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;line-height:1.6;color:#111827">
            ${replyBodyFn(safeName, safeMessage.replace(/\n/g, "<br/>"))}
          </div>
        `,
      });
    } catch (e) {
      log({ level: "error", msg: "auto_reply_failed", route: "action:contact-form", error: String(e) });
    }

    // 6. Slack notify
    const slackLines = [
      `*New lead (corporate site${locale !== "en" ? ` — ${locale.toUpperCase()}` : ""}):* ${name} <${email}>`,
      company ? `Company: ${company}` : null,
      phone ? `Phone: ${phone}` : null,
      equipmentType ? `Equipment: ${equipmentType}` : null,
      `Message: ${message.length > 280 ? message.slice(0, 280) + "…" : message}`,
    ]
      .filter(Boolean)
      .join("\n");

    await notifySlack(slackLines);

    // 7. Meta CAPI Lead event
    await sendCAPIEvent({
      eventName: "Lead",
      eventId,
      email,
      phone: phone || undefined,
      sourceUrl: data.source_page || undefined,
      customData: { lead_source: "corporate_contact_form" },
    });

    // 8. Vercel Analytics server-side event
    await track("lead_submitted", { source: "contact_form", locale }).catch(() => {});
  });

  timer.done({ email, locale });
  return { success: true, eventId };
}
