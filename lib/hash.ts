/**
 * Client-side SHA-256 hashing for Enhanced Conversions and Advanced Matching.
 *
 * Uses Web Crypto API (SubtleCrypto) which is available in all modern browsers
 * and Next.js edge/server environments. Falls back gracefully when unavailable.
 */

/**
 * SHA-256 hash a value after normalizing (trim + lowercase).
 * Returns null if crypto.subtle is unavailable or input is empty.
 */
export async function sha256(value: string): Promise<string | null> {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return null

  if (typeof globalThis.crypto?.subtle?.digest !== 'function') return null

  const data = new TextEncoder().encode(normalized)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Hash user data for Google Ads Enhanced Conversions.
 * Returns only fields that are non-empty and successfully hashed.
 */
export async function hashUserDataForGoogleAds(input: {
  email?: string
  phone?: string
}): Promise<{ sha256_email_address?: string; sha256_phone_number?: string }> {
  const result: { sha256_email_address?: string; sha256_phone_number?: string } = {}

  if (input.email) {
    const hashed = await sha256(input.email)
    if (hashed) result.sha256_email_address = hashed
  }

  if (input.phone) {
    // Normalize phone: digits only (Google requires E.164 without '+')
    const digits = input.phone.replace(/\D/g, '')
    if (digits) {
      const hashed = await sha256(digits)
      if (hashed) result.sha256_phone_number = hashed
    }
  }

  return result
}
