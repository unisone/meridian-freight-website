/**
 * Google Sheets REST API v4 client using Service Account JWT authentication.
 * No `googleapis` npm package — direct `fetch` only.
 */

import { log } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SheetData {
  values: string[][];
}

// ---------------------------------------------------------------------------
// base64url helper
// ---------------------------------------------------------------------------

function base64url(input: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ---------------------------------------------------------------------------
// PEM → binary DER
// ---------------------------------------------------------------------------

function pemToDer(pem: string): ArrayBuffer {
  const lines = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binary = atob(lines);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
// JWT Generation
// ---------------------------------------------------------------------------

async function createServiceAccountJWT(): Promise<string | null> {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !rawKey) {
      log({
        level: "error",
        msg: "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY",
        route: "google-sheets",
      });
      return null;
    }

    // Handle escaped newlines from env vars
    const privateKey = rawKey.replace(/\\n/g, "\n");

    const now = Math.floor(Date.now() / 1000);

    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // Import the private key for RS256 signing
    const der = pemToDer(privateKey);
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      der,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );

    // Sign the JWT
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signingInput),
    );

    return `${signingInput}.${base64url(signature)}`;
  } catch (err) {
    log({
      level: "error",
      msg: "Failed to create service account JWT",
      route: "google-sheets",
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

// ---------------------------------------------------------------------------
// Token Exchange
// ---------------------------------------------------------------------------

async function getAccessToken(): Promise<string | null> {
  try {
    const jwt = await createServiceAccountJWT();
    if (!jwt) return null;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      log({
        level: "error",
        msg: "Token exchange failed",
        route: "google-sheets",
        status: res.status,
        body: text,
      });
      return null;
    }

    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) {
      log({
        level: "error",
        msg: "Token response missing access_token",
        route: "google-sheets",
      });
      return null;
    }

    return data.access_token;
  } catch (err) {
    log({
      level: "error",
      msg: "Failed to exchange token",
      route: "google-sheets",
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

// ---------------------------------------------------------------------------
// Sheet Reading
// ---------------------------------------------------------------------------

export async function fetchSheetValues(options?: {
  spreadsheetId?: string;
  tabName?: string;
}): Promise<SheetData | null> {
  try {
    const spreadsheetId = options?.spreadsheetId ?? process.env.GOOGLE_SPREADSHEET_ID;
    const tabName = options?.tabName ?? process.env.GOOGLE_SHEET_TAB_NAME ?? "Sheet1";

    if (!spreadsheetId) {
      log({
        level: "error",
        msg: "Missing spreadsheetId (param or GOOGLE_SPREADSHEET_ID env)",
        route: "google-sheets",
      });
      return null;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}` +
      `/values/${encodeURIComponent(tabName)}` +
      `?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      log({
        level: "error",
        msg: "Sheets API request failed",
        route: "google-sheets",
        status: res.status,
        body: text,
      });
      return null;
    }

    const data = (await res.json()) as { values?: string[][] };
    return { values: data.values ?? [] };
  } catch (err) {
    log({
      level: "error",
      msg: "Failed to fetch sheet values",
      route: "google-sheets",
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
