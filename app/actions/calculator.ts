"use server";

import { Resend } from "resend";
import { calculatorEmailSchema, type CalculatorEmailData } from "@/lib/schemas";
import { calculateFreight, type FreightEstimate } from "@/lib/freight-engine";
import { CONTACT } from "@/lib/constants";
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
    await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(data),
    });
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

  // 2. Calculate
  const estimate = calculateFreight(data.equipmentType, data.destination);
  if (!estimate) {
    return { success: false, error: "Could not calculate estimate for this combination." };
  }

  // 3. Save lead (best-effort)
  await insertCalculatorLead({
    name: data.name || null,
    email: data.email,
    company: data.company || null,
    equipment_type: data.equipmentType,
    message: `Calculator: ${data.equipmentType} via ${data.destination}`,
    source: "calculator",
    status: "new",
  });

  // 4. Notify owner (best-effort)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: CONTACT.fromEmail,
        to: CONTACT.notificationEmail,
        subject: `Calculator Lead: ${data.equipmentType}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:500px">
            <h2 style="color:#2563eb">New Calculator Lead</h2>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            ${data.name ? `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>` : ""}
            ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ""}
            <p><strong>Equipment:</strong> ${escapeHtml(data.equipmentType)}</p>
            <p><strong>Route:</strong> ${escapeHtml(data.destination)}</p>
            <hr/>
            <p><strong>Estimate:</strong> ${estimate.totalEstimate}</p>
            <p>Packing: ${estimate.packingCost} | Shipping: ${estimate.shippingCost}</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Calculator notification failed:", e);
    }
  }

  // 5. Meta CAPI Lead event (best-effort)
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
