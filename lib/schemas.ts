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
});

export type CalculatorEmailData = z.infer<typeof calculatorEmailSchema>;
