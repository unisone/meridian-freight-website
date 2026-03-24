/**
 * Server-side Meta Conversions API (CAPI).
 * Sends events from Server Actions for accurate attribution.
 */

const PIXEL_ID = (process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID)?.trim();
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN?.trim();
const API_VERSION = "v21.0";

interface CAPIEvent {
  event_name: string;
  event_id: string;
  event_time: number;
  user_data: {
    em?: string[]; // hashed email
    ph?: string[]; // hashed phone
    client_ip_address?: string;
    client_user_agent?: string;
  };
  custom_data?: Record<string, unknown>;
  event_source_url?: string;
  action_source: "website";
}

async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sendCAPIEvent(params: {
  eventName: string;
  eventId: string;
  email?: string;
  phone?: string;
  sourceUrl?: string;
  customData?: Record<string, unknown>;
}): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const userData: CAPIEvent["user_data"] = {};
  if (params.email) {
    userData.em = [await hashSHA256(params.email)];
  }
  if (params.phone) {
    userData.ph = [await hashSHA256(params.phone)];
  }

  const event: CAPIEvent = {
    event_name: params.eventName,
    event_id: params.eventId,
    event_time: Math.floor(Date.now() / 1000),
    user_data: userData,
    action_source: "website",
    event_source_url: params.sourceUrl,
    custom_data: params.customData,
  };

  try {
    await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ data: [event] }),
      }
    );
  } catch (e) {
    console.error("CAPI event failed:", e);
  }
}
