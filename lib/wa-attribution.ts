import { CONTACT } from "@/lib/constants";

/**
 * Generate a unique MF-XXXX ref code for WhatsApp attribution.
 */
export function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MF-${code}`;
}

/**
 * Build a WhatsApp URL with a pre-filled message containing the ref code.
 */
export function buildWhatsAppUrl(
  refCode: string,
  context?: string
): string {
  const message = context
    ? `Hi! Ref: ${refCode}. ${context}`
    : `Hi! Ref: ${refCode}. I'm interested in your machinery export services.`;
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Store WhatsApp click attribution in Supabase (best-effort, server-side).
 */
export async function storeWaAttribution(data: {
  ref_code: string;
  source_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url}/rest/v1/wa_attribution`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ...data,
        created_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error("WA attribution insert failed:", e);
  }
}
