/**
 * Pure helpers for the paid-search WhatsApp CTA (spec §6.5, §9.7).
 * The visible message carries the opaque ref only — never click IDs/UTMs.
 */

/** Insert the opaque ref into the prefill, or strip the placeholder if no ref. */
export function interpolateWhatsAppRef(template: string, ref?: string): string {
  if (ref) return template.replace(/\{\{whatsapp_ref\}\}/g, ref);
  // No ref → remove the "Ref: {{whatsapp_ref}}" tail (and any stray placeholder).
  return template
    .replace(/\s*Ref:\s*\{\{whatsapp_ref\}\}/g, "")
    .replace(/\{\{whatsapp_ref\}\}/g, "")
    .trim();
}

/** Build a wa.me deep link. Phone is digits-only; text is URL-encoded. */
export function buildWhatsAppUrl(phoneRaw: string, text: string): string {
  const digits = phoneRaw.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
