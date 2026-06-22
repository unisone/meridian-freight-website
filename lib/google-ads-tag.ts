/**
 * Google Ads tag guard (spec §6.8, §9.13).
 *
 * The expected tag lives in config; the runtime value comes from env
 * (NEXT_PUBLIC_GOOGLE_ADS_ID). We NEVER hardcode the live tag — instead we
 * compare runtime vs expected and report a mismatch so preview QA can HOLD
 * readiness. We never throw and never add a conversion action here.
 */

import { TRACKING } from "@/lib/constants";

export const EXPECTED_GOOGLE_ADS_TAG = "AW-17952470509";

export interface GoogleAdsTagCheck {
  ok: boolean;
  runtime: string;
  expected: string;
  reason: "match" | "absent" | "mismatch";
}

export function assertGoogleAdsTagMatches(
  expected: string = EXPECTED_GOOGLE_ADS_TAG,
): GoogleAdsTagCheck {
  const runtime = TRACKING.googleAdsId;
  if (!runtime) return { ok: false, runtime, expected, reason: "absent" };
  if (runtime !== expected) return { ok: false, runtime, expected, reason: "mismatch" };
  return { ok: true, runtime, expected, reason: "match" };
}
