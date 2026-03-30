"use server";

import { after } from "next/server";
import { Resend } from "resend";
import { bookingRequestSchema, type BookingRequestData } from "@/lib/schemas";
import { CONTACT } from "@/lib/constants";
import { buildBookingConfirmationEmail } from "@/lib/emails/booking-confirmation";
import { track } from "@vercel/analytics/server";
import { notifySlack } from "@/lib/slack";
import { sendCAPIEvent } from "@/lib/meta-capi";
import { startTimer, log } from "@/lib/logger";
import {
  fetchContainerById,
  countRecentRequests,
  countPendingRequests,
  insertBookingRequest,
} from "@/lib/supabase-containers";

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export type BookingActionResult = {
  success: boolean;
  error?: string;
  eventId?: string;
};

/** Generate a short booking reference: BK-XXXXXXX */
function generateBookingRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `BK-${ts.slice(-4)}${rand}`;
}

export async function submitBookingRequest(
  raw: BookingRequestData,
  locale: string = "en",
): Promise<BookingActionResult> {
  const timer = startTimer("action:booking-request");

  // 1. Validate
  const parsed = bookingRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid form data";
    return { success: false, error: firstError };
  }

  const data = parsed.data;

  // 2. Honeypot check — bots fill hidden fields, return success silently
  if (data.website) {
    return { success: true };
  }

  // 3. Verify email service is configured (fail fast before DB operations)
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    timer.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service is not configured." };
  }

  const { name, email, phone, cargoDescription, containerId, projectNumber } = data;

  // 4. Container status + departure date re-check (after email config verified)
  const container = await fetchContainerById(containerId);
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  if (!container || container.status !== "available" || container.departure_date < todayStr) {
    return {
      success: false,
      error: "CONTAINER_UNAVAILABLE",
    };
  }

  // 5. Dedup check — if same email submitted for same container within 5 minutes, return success (idempotent)
  const recentCount = await countRecentRequests(email, containerId, 5);
  if (recentCount > 0) {
    return { success: true };
  }

  // 6. Insert booking request to Supabase
  const insertResult = await insertBookingRequest({
    container_id: containerId,
    project_number: projectNumber,
    name,
    email,
    phone: phone || null,
    cargo_description: cargoDescription,
    status: "new",
    source_page: data.source_page || null,
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
  });

  if (!insertResult.ok) {
    log({
      level: "error",
      msg: "booking_insert_failed",
      route: "action:booking-request",
      error: insertResult.error,
    });
    // Continue — email is the must-succeed step, not Supabase
  }

  // 7. Get pending count for notifications
  const pendingCount = await countPendingRequests(containerId);

  // 8. Send owner notification email via Resend (MUST succeed)
  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCargo = escapeHtml(cargoDescription);
  const safePhone = escapeHtml(phone);

  const route = `${escapeHtml(container.origin)} → ${escapeHtml(container.destination)}`;
  const departureDate = container.departure_date;
  const availableCbm = container.available_cbm != null ? `${container.available_cbm} CBM` : "N/A";

  try {
    const { error } = await resend.emails.send({
      from: CONTACT.fromEmail,
      to: CONTACT.bookingNotificationEmail,
      cc: CONTACT.bookingNotificationCc as unknown as string[],
      replyTo: email,
      subject: `New Booking Request: ${name} — ${container.destination}${locale !== "en" ? ` [${locale.toUpperCase()}]` : ""}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:24px;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:20px">New Booking Request — Shared Container</h1>
          </div>
          <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px">
            <h3 style="margin:0 0 12px;color:#1f2937">Customer Details</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Cargo Description:</strong><br/>${safeCargo.replace(/\n/g, "<br/>")}</p>

            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:20px 0"/>

            <h3 style="margin:0 0 12px;color:#1f2937">Container Details</h3>
            <p><strong>Project #:</strong> ${escapeHtml(container.project_number)}</p>
            <p><strong>Route:</strong> ${route}</p>
            <p><strong>Departure:</strong> ${escapeHtml(departureDate)}</p>
            <p><strong>Available Space:</strong> ${escapeHtml(availableCbm)}</p>
            <p><strong>Container Type:</strong> ${escapeHtml(container.container_type)}</p>
            <p><strong>Pending Requests:</strong> ${pendingCount} (including this one)</p>

            <hr style="border:none;border-top:1px dashed #e5e7eb;margin:20px 0"/>

            <p style="font-size:13px;color:#6b7280;background:#fef3c7;padding:12px;border-radius:6px;border-left:4px solid #f59e0b">
              <strong>Reminder:</strong> Update availability in Google Sheets after reviewing this request.
            </p>

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

  // 9. Generate event ID for Pixel/CAPI dedup
  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // 9-10. Best-effort work runs AFTER the response is sent to the user.
  after(async () => {
    // a. Auto-reply to customer (enterprise-branded)
    try {
      const confirmation = buildBookingConfirmationEmail({
        name: safeName,
        cargo: safeCargo.replace(/\n/g, "<br/>"),
        locale,
        bookingRef: generateBookingRef(),
        container: {
          origin: escapeHtml(container.origin),
          destination: escapeHtml(container.destination),
          departureDate: container.departure_date,
          etaDate: container.eta_date ?? null,
          containerType: escapeHtml(container.container_type),
          projectNumber: escapeHtml(container.project_number),
        },
      });
      await resend.emails.send({
        from: CONTACT.fromEmail,
        to: email,
        replyTo: CONTACT.bookingNotificationEmail,
        subject: confirmation.subject,
        html: confirmation.html,
      });
    } catch (e) {
      log({ level: "error", msg: "auto_reply_failed", route: "action:booking-request", error: String(e) });
    }

    // b. Slack notification
    const slackLines = [
      `*New shared container booking request${locale !== "en" ? ` (${locale.toUpperCase()})` : ""}:*`,
      `Customer: ${name} <${email}> | ${phone}`,
      `Cargo: ${cargoDescription.length > 200 ? cargoDescription.slice(0, 200) + "..." : cargoDescription}`,
      `Container: ${container.project_number} | ${container.origin} → ${container.destination}`,
      `Departure: ${container.departure_date} | Available: ${availableCbm}`,
      `Pending requests: ${pendingCount}`,
    ].join("\n");

    await notifySlack(slackLines);

    // c. Meta CAPI Lead event
    await sendCAPIEvent({
      eventName: "Lead",
      eventId,
      email,
      phone: phone || undefined,
      sourceUrl: data.source_page || undefined,
      customData: { lead_source: "shared_shipping_booking" },
    });

    // d. Vercel Analytics server-side event
    await track("lead_submitted", { source: "shared_shipping", locale }).catch(() => {});
  });

  timer.done({ email, locale, containerId, projectNumber });
  return { success: true, eventId };
}
