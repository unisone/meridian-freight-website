import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  company: z.string().max(200).optional().default(""),
  phone: z.string().max(50).optional().default(""),
  equipmentType: z.string().max(200).optional().default(""),
  message: z.string().min(1, "Message is required").max(5000),
  // Honeypot — bots fill hidden fields, humans don't
  website: z.string().max(500).optional().default(""),
  // UTM attribution (auto-captured on client)
  source_page: z.string().max(500).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  utm_term: z.string().max(200).optional().default(""),
  utm_content: z.string().max(200).optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const calculatorEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(200).optional().default(""),
  company: z.string().max(200).optional().default(""),
  equipmentCategory: z.string().min(1),
  equipmentType: z.string().min(1),
  originRegion: z.string().min(1),
  destination: z.string().min(1),
  // Honeypot — bots fill hidden fields, humans don't
  website: z.string().max(500).optional().default(""),
  // UTM attribution (auto-captured on client)
  source_page: z.string().max(500).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  utm_term: z.string().max(200).optional().default(""),
  utm_content: z.string().max(200).optional().default(""),
});

export type CalculatorEmailData = z.infer<typeof calculatorEmailSchema>;

export const calculatorV2Schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(200).optional().default(""),
  company: z.string().max(200).optional().default(""),
  // Equipment selection
  equipmentId: z.string().min(1),
  equipmentCategory: z.string().min(1),
  equipmentType: z.string().min(1),
  equipmentDisplayName: z.string().min(1),
  equipmentSize: z.number().positive().nullable().default(null),
  equipmentValueUsd: z.number().positive().nullable().default(null),
  containerType: z.enum(["fortyhc", "flatrack"]),
  // Destination
  destinationCountry: z.string().min(1),
  zipCode: z.string().max(10).optional().default(""),
  rateBookSignature: z.string().min(8),
  // Honeypot — bots fill hidden fields, humans don't
  website: z.string().max(500).optional().default(""),
  // UTM attribution (auto-captured on client)
  source_page: z.string().max(500).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  utm_term: z.string().max(200).optional().default(""),
  utm_content: z.string().max(200).optional().default(""),
}).superRefine((data, ctx) => {
  if (data.containerType === "flatrack" && data.equipmentValueUsd == null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["equipmentValueUsd"],
      message: "Equipment value is required for flat rack estimates.",
    });
  }
});

export type CalculatorV2Data = z.infer<typeof calculatorV2Schema>;

export const calculatorV3Schema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().max(200).optional().default(""),
  company: z.string().max(200).optional().default(""),
  phone: z.string().max(50).optional().default(""),
  preferredContact: z.enum(["email", "whatsapp"]).default("email"),
  equipmentProfileId: z.string().min(1),
  modeId: z.enum(["whole", "container"]),
  quantity: z.number().int().positive().max(99),
  equipmentValueUsd: z.number().positive().nullable().default(null),
  destinationCountry: z.string().length(2),
  destinationPortKey: z.string().max(80).nullable().default(null),
  routeId: z.string().max(300).nullable().default(null),
  routePreference: z.enum(["cheapest", "fastest"]).default("cheapest"),
  zipCode: z.string().max(10).optional().default(""),
  rateBookSignature: z.string().min(8),
  // Honeypot — bots fill hidden fields, humans don't
  website: z.string().max(500).optional().default(""),
  // UTM attribution (auto-captured on client)
  source_page: z.string().max(500).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  utm_term: z.string().max(200).optional().default(""),
  utm_content: z.string().max(200).optional().default(""),
}).superRefine((data, ctx) => {
  if (data.preferredContact === "whatsapp" && !data.phone.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["phone"],
      message: "Phone or WhatsApp number is required when WhatsApp is selected.",
    });
  }
});

export type CalculatorV3Data = z.infer<typeof calculatorV3Schema>;

// --- Shared Shipping Booking Request ---

export const bookingRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required").max(50),
  cargoDescription: z.string().min(5, "Please describe your cargo").max(2000),
  containerId: z.string().uuid("Invalid container ID"),
  projectNumber: z.string().min(1, "Project number is required"),
  // Honeypot — bots fill hidden fields, humans don't
  website: z.string().max(500).optional().default(""),
  // UTM attribution (auto-captured on client)
  source_page: z.string().max(500).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
});

export type BookingRequestData = z.infer<typeof bookingRequestSchema>;

// --- LATAM Paid-Search Lead (Gate B) ---
// The client sends ONLY routeKey for route context; the server rederives
// country/segment/cargo_class/landing_route/request_type from the registry
// (trust boundary, spec §9.2). Click IDs/UTMs ride in first/latest touch.

export const paidSearchTouchSchema = z.object({
  capturedAt: z.string().max(40).optional(),
  landingUrl: z.string().max(2048).optional(),
  referrer: z.string().max(2048).optional(),
  gclid: z.string().max(256).optional(),
  gbraid: z.string().max(256).optional(),
  wbraid: z.string().max(256).optional(),
  fbclid: z.string().max(256).optional(),
  utm_source: z.string().max(512).optional(),
  utm_medium: z.string().max(512).optional(),
  utm_campaign: z.string().max(512).optional(),
  utm_term: z.string().max(512).optional(),
  utm_content: z.string().max(512).optional(),
  utm_matchtype: z.string().max(512).optional(),
  utm_network: z.string().max(512).optional(),
  utm_device: z.string().max(512).optional(),
});

export const paidSearchLeadSchema = z
  .object({
    routeKey: z.string().min(3).max(120),
    contact_name: z.string().min(1, "Name is required").max(200),
    contact_email: z.string().email("Invalid email address").optional().or(z.literal("")).default(""),
    contact_phone: z.string().max(50).optional().default(""),
    preferred_contact_method: z.enum(["whatsapp", "email", "phone"]).default("whatsapp"),
    equipment_type: z.string().min(1, "Equipment is required").max(200),
    make_model: z.string().max(200).optional().default(""),
    year: z.string().max(10).optional().default(""),
    listing_url: z.string().max(500).optional().default(""),
    origin_location: z.string().max(200).optional().default(""),
    destination_location: z.string().max(200).optional().default(""),
    dimensions: z.string().max(300).optional().default(""),
    weight: z.string().max(100).optional().default(""),
    purchase_status: z.string().max(100).optional().default(""),
    requested_timing: z.string().max(100).optional().default(""),
    buyer_role: z.string().max(100).optional().default(""),
    message: z.string().max(5000).optional().default(""),
    consent: z.boolean().optional().default(false),
    // Honeypot
    website: z.string().max(500).optional().default(""),
    // Attribution (server re-trusts by attribution_id where available)
    attribution_id: z.string().max(80).optional().default(""),
    whatsapp_ref: z.string().max(32).optional().default(""),
    // Stable dedupe key (from createWhatsAppRef or a per-session id); server
    // generates one if absent. idempotency_key === lead_id (spec §9.11).
    lead_id: z.string().max(80).optional().default(""),
    first_touch: paidSearchTouchSchema.optional(),
    latest_touch: paidSearchTouchSchema.optional(),
  })
  .superRefine((d, ctx) => {
    if (!d.contact_email && !d.contact_phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["contact_email"],
        message: "Provide an email or a phone/WhatsApp number.",
      });
    }
  });

export type PaidSearchLeadData = z.infer<typeof paidSearchLeadSchema>;
export type PaidSearchLeadInput = z.input<typeof paidSearchLeadSchema>;

export const whatsappRefRequestSchema = z.object({
  routeKey: z.string().min(3).max(120),
  attribution_id: z.string().max(80).optional().default(""),
  first_touch: paidSearchTouchSchema.optional(),
  latest_touch: paidSearchTouchSchema.optional(),
});

export type WhatsAppRefRequestData = z.infer<typeof whatsappRefRequestSchema>;
