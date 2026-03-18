/** @deprecated Use lib/freight-engine-v2.ts which uses real Supabase rates. This file is kept for pricing-table.tsx compatibility. */

import { equipmentPricing, deliveryRates } from "@/content/pricing";
import type { EquipmentPricing, DeliveryRate } from "@/content/pricing";

export interface FreightEstimate {
  equipment: EquipmentPricing;
  route: DeliveryRate;
  packingCost: string;
  shippingCost: string;
  shippingType: "lines" | "soc";
  containerPercent: string;
  totalEstimate: string;
}

/**
 * Parse a dollar string like "$8,250.00" into a number (8250).
 * Returns null if the string contains variable pricing keywords
 * ("per row", "per foot", "per shank", "per bottom").
 */
function parseDollar(s: string): number | null {
  if (/per\s+(row|foot|shank|bottom)/i.test(s)) return null;
  const cleaned = s.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

function formatDollar(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Calculate a freight estimate given equipment type and delivery route.
 */
export function calculateFreight(
  equipmentType: string,
  routeStr: string
): FreightEstimate | null {
  const equipment = equipmentPricing.find((e) => e.type === equipmentType);
  const route = deliveryRates.find((r) => r.route === routeStr);

  if (!equipment || !route) return null;

  const packingNum = parseDollar(equipment.containerized);
  // Prefer Line's container, fall back to SOC
  const shippingType: "lines" | "soc" = route.lines ? "lines" : "soc";
  const shippingStr = route.lines || route.soc;
  const shippingNum = parseDollar(shippingStr);

  // If pricing is variable (per row, per foot), show the base rate with context
  const packingCost = packingNum !== null
    ? formatDollar(packingNum)
    : equipment.containerized;

  const shippingCost = shippingNum !== null
    ? formatDollar(shippingNum)
    : shippingStr;

  let totalEstimate = "Contact for quote";
  if (packingNum !== null && shippingNum !== null) {
    totalEstimate = formatDollar(packingNum + shippingNum);
  }

  return {
    equipment,
    route,
    packingCost,
    shippingCost,
    shippingType,
    containerPercent: equipment.container,
    totalEstimate,
  };
}

/**
 * Get unique equipment types for the selector.
 */
export function getEquipmentTypes(): string[] {
  return equipmentPricing.map((e) => e.type);
}

/**
 * Get unique routes for the selector.
 */
export function getRoutes(): string[] {
  return deliveryRates.map((r) => r.route);
}
