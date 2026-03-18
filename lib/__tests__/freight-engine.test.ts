import { describe, it, expect } from "vitest";
import { calculateFreight, getEquipmentTypes, getRoutes } from "@/lib/freight-engine";

describe("calculateFreight", () => {
  // --- Fixed-price equipment ---
  it("calculates correct total for fixed-price equipment", () => {
    const est = calculateFreight(
      "Combines - Small Series",
      "Albion, IA → Novorossiysk"
    );
    expect(est).not.toBeNull();
    // $8,250 packing + $11,800 shipping = $20,050
    expect(est!.packingCost).toBe("$8,250");
    expect(est!.shippingCost).toBe("$11,800");
    expect(est!.totalEstimate).toBe("$20,050");
    expect(est!.shippingType).toBe("lines");
  });

  // --- Variable pricing: "per row" ---
  it('returns "Contact for quote" for per-row pricing (Corn header)', () => {
    const est = calculateFreight("Corn header", "Albion, IA → Novorossiysk");
    expect(est).not.toBeNull();
    expect(est!.packingCost).toBe("$140 per row");
    expect(est!.totalEstimate).toBe("Contact for quote");
  });

  // --- Variable pricing: "per foot" ---
  it('returns "Contact for quote" for per-foot pricing (Field cultivators)', () => {
    const est = calculateFreight("Field cultivators", "Albion, IA → Busan");
    expect(est).not.toBeNull();
    expect(est!.packingCost).toBe("$80 per foot");
    expect(est!.totalEstimate).toBe("Contact for quote");
  });

  // --- Variable pricing: "per shank" ---
  it('returns "Contact for quote" for per-shank pricing (Rippers)', () => {
    const est = calculateFreight("Rippers", "Hankinson, ND → Novorossiysk");
    expect(est).not.toBeNull();
    expect(est!.packingCost).toBe("$315 per shank");
    expect(est!.totalEstimate).toBe("Contact for quote");
  });

  // --- Variable pricing: "per bottom" ---
  it('returns "Contact for quote" for per-bottom pricing (Plows)', () => {
    const est = calculateFreight("Plows", "Charleston, IL → Novorossiysk");
    expect(est).not.toBeNull();
    expect(est!.packingCost).toBe("$150 per bottom");
    expect(est!.totalEstimate).toBe("Contact for quote");
  });

  // --- Unknown equipment ---
  it("returns null for unknown equipment type", () => {
    expect(calculateFreight("Nonexistent Machine", "Albion, IA → Novorossiysk")).toBeNull();
  });

  // --- Unknown route ---
  it("returns null for unknown route", () => {
    expect(calculateFreight("Combines - Small Series", "Mars → Jupiter")).toBeNull();
  });

  // --- Lines preferred over SOC ---
  it("prefers lines shipping over SOC when both available", () => {
    const est = calculateFreight("Tractors", "Albion, IA → Novorossiysk");
    expect(est).not.toBeNull();
    expect(est!.shippingType).toBe("lines");
    expect(est!.shippingCost).toBe("$11,800");
  });

  // --- Empty SOC falls back to lines ---
  it("uses lines when SOC is empty", () => {
    // Chicago → Istanbul → Almaty has lines but no SOC
    const est = calculateFreight("Tractors", "Chicago, IL → Istanbul → Almaty");
    expect(est).not.toBeNull();
    expect(est!.shippingType).toBe("lines");
    expect(est!.shippingCost).toBe("$17,980");
  });

  // --- Misc items present ---
  it("calculates correctly for misc item (Wheels)", () => {
    const est = calculateFreight("Wheels", "Albion, IA → Busan");
    expect(est).not.toBeNull();
    // $200 packing + $5,925 shipping = $6,125
    expect(est!.packingCost).toBe("$200");
    expect(est!.totalEstimate).toBe("$6,125");
    expect(est!.equipment.category).toBe("misc");
  });

  it("calculates correctly for misc item (Balers)", () => {
    const est = calculateFreight("Balers", "Savannah, GA → Novorossiysk");
    expect(est).not.toBeNull();
    // $2,200 packing + $10,500 shipping = $12,700
    expect(est!.totalEstimate).toBe("$12,700");
  });
});

describe("getEquipmentTypes", () => {
  it("includes misc items", () => {
    const types = getEquipmentTypes();
    expect(types).toContain("Wheels");
    expect(types).toContain("Balers");
    expect(types).toContain("Lawn Mowers");
    expect(types).toContain("Mower MOCO");
    expect(types).toContain("Head Carts");
  });

  it("includes standard equipment", () => {
    const types = getEquipmentTypes();
    expect(types).toContain("Combines - Small Series");
    expect(types).toContain("Field cultivators");
    expect(types).toContain("Tractors");
  });
});

describe("getRoutes", () => {
  it("returns all 22 delivery routes", () => {
    const routes = getRoutes();
    expect(routes).toHaveLength(22);
  });

  it("includes key routes", () => {
    const routes = getRoutes();
    expect(routes).toContain("Albion, IA → Novorossiysk");
    expect(routes).toContain("Chicago, IL → Istanbul → Almaty");
    expect(routes).toContain("Albion, IA → Chicago → Montevideo");
    expect(routes).toContain("Montreal → Batumi → Kostanay");
  });
});
