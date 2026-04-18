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
