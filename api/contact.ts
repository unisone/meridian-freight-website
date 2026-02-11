import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

type LeadPayload = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  // attribution
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  // honeypot
  website?: string;
};

function escapeHtml(input: string) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(req: VercelRequest): string | undefined {
  const xf = req.headers["x-forwarded-for"];
  const raw = Array.isArray(xf) ? xf[0] : xf;
  if (!raw) return undefined;
  // x-forwarded-for can be a comma-separated list
  return raw.split(",")[0]?.trim() || undefined;
}

async function insertLeadToSupabase(lead: any) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: false as const, skipped: true as const };

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
    return { ok: false as const, skipped: false as const, status: resp.status, text };
  }

  return { ok: true as const };
}

async function notifySlack(payload: { text: string }) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return { ok: false as const, skipped: true as const };

  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: payload.text }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return { ok: false as const, skipped: false as const, status: resp.status, text };
  }

  return { ok: true as const };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const body: LeadPayload = (req.body || {}) as any;

  // Honeypot: bots often fill hidden fields. Return success but do nothing.
  if (body.website) {
    return res.status(200).json({ success: true });
  }

  const { name, email, company, phone, message } = body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : "";
  const safePhone = phone ? escapeHtml(phone) : "";
  const safeMessage = escapeHtml(message);

  const ip = getClientIp(req);

  // 1) Store lead (best-effort)
  try {
    const leadRecord = {
      name,
      email,
      company: company || null,
      phone: phone || null,
      message,
      source_page: body.source_page || req.headers.referer || null,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_term: body.utm_term || null,
      utm_content: body.utm_content || null,
      ip_address: ip || null,
      status: "new",
    };

    const r = await insertLeadToSupabase(leadRecord);
    if (!r.ok && !r.skipped) {
      console.error("Supabase insert failed:", r.status, r.text);
    }
  } catch (e) {
    console.error("Supabase insert exception:", e);
  }

  // 2) Email Alex (must succeed)
  try {
    const { error } = await resend.emails.send({
      from: "Meridian Freight Contact <contact@meridianexport.com>",
      to: "alex.z@meridianexport.com",
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 22px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 18px; }
              .label { font-weight: 600; color: #374151; margin-bottom: 4px; display: block; }
              .value { color: #1f2937; }
              .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px; }
              .meta { margin-top: 16px; padding-top: 12px; border-top: 1px dashed #e5e7eb; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📬 New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Name:</span>
                  <span class="value">${safeName}</span>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></span>
                </div>
                ${company ? `<div class="field"><span class="label">Company:</span><span class="value">${safeCompany}</span></div>` : ""}
                ${phone ? `<div class="field"><span class="label">Phone:</span><span class="value">${safePhone}</span></div>` : ""}
                <div class="field">
                  <span class="label">Message:</span>
                  <span class="value">${safeMessage.replace(/\n/g, "<br/>")}</span>
                </div>

                <div class="meta">
                  <div><strong>Source:</strong> ${escapeHtml(String(body.source_page || req.headers.referer || ""))}</div>
                  <div><strong>UTM:</strong> ${escapeHtml([body.utm_source, body.utm_medium, body.utm_campaign].filter(Boolean).join(" / "))}</div>
                  <div><strong>IP:</strong> ${escapeHtml(String(ip || ""))}</div>
                </div>

                <div class="footer">Sent via Meridian Freight Contact Form</div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error (admin notify):", error);
      return res.status(500).json({ error: (error as any)?.message || "Failed to send email." });
    }
  } catch (err) {
    console.error("Contact API error (admin notify):", err);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }

  // 3) Auto-reply to visitor (best-effort)
  try {
    await resend.emails.send({
      from: "Meridian Freight <contact@meridianexport.com>",
      to: email,
      replyTo: "alex.z@meridianexport.com",
      subject: "We received your message — Meridian Freight",
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.6;color:#111827">
          <p>Hi ${safeName},</p>
          <p>Thanks for reaching out to Meridian Freight. We received your message and will respond within <strong>24 hours</strong>.</p>
          <p style="margin-top:16px;color:#374151"><strong>Your message:</strong><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>
          <p style="margin-top:20px;color:#6b7280;font-size:13px">If you need to add anything, just reply to this email.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Auto-reply failed:", e);
  }

  // 4) Slack notify (best-effort)
  try {
    const lines = [
      `New lead: *${name}* <${email}>`,
      company ? `Company: ${company}` : null,
      phone ? `Phone: ${phone}` : null,
      body.source_page ? `Source: ${body.source_page}` : null,
      [body.utm_source, body.utm_medium, body.utm_campaign].filter(Boolean).length
        ? `UTM: ${[body.utm_source, body.utm_medium, body.utm_campaign].filter(Boolean).join(" / ")}`
        : null,
      `Message: ${message.length > 280 ? message.slice(0, 280) + "…" : message}`,
    ].filter(Boolean) as string[];

    const r = await notifySlack({ text: lines.join("\n") });
    if (!r.ok && !r.skipped) {
      console.error("Slack notify failed:", (r as any).status, (r as any).text);
    }
  } catch (e) {
    console.error("Slack notify exception:", e);
  }

  return res.status(200).json({ success: true });
}
