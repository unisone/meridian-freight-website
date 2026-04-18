import { describe, it, expect } from "vitest";
import {
  detectColumns,
  parseSheetDate,
  parseSpaceAvailable,
  extractCountryCode,
  isUSLocation,
  parseRow,
  aggregateByProject,
} from "@/lib/sync-containers";
import type { ParsedContainerRow } from "@/lib/types/shared-shipping";

function localDatePlusDays(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

describe("detectColumns", () => {
  it("detects Russian headers", () => {
    const headers = ["ID", "Дата", "Номер проекта", "Клиент", "откуда грузится", "Вес", "куда идет", "Carrier", "дата выхода", "Status", "Transit", "ETA", "Notes", "Cost", "Invoice", "Docs", "Paid", "Tax", "Manifest", "Container", "Format", "Dims", "Photos", "Tags", "Space available"];
    const map = detectColumns(headers);
    expect(map).not.toBeNull();
    expect(map!.project_number).toBe(2);
    expect(map!.origin).toBe(4);
    expect(map!.destination).toBe(6);
    expect(map!.departure_date).toBe(8);
    expect(map!.eta_date).toBe(11);
    expect(map!.space_available).toBe(24);
  });

  it("detects English headers", () => {
    const headers = ["Project #", "Origin", "Destination", "Departure Date", "ETA", "Space"];
    const map = detectColumns(headers);
    expect(map).not.toBeNull();
    expect(map!.project_number).toBe(0);
    expect(map!.destination).toBe(2);
  });

  it("returns null when required columns are missing", () => {
    const headers = ["Name", "Email", "Phone"];
    const map = detectColumns(headers);
    expect(map).toBeNull();
  });
});

describe("parseSheetDate", () => {
  it("parses ISO format", () => {
    expect(parseSheetDate("2026-04-15")).toBe("2026-04-15");
  });

  it("parses DD.MM.YYYY", () => {
    expect(parseSheetDate("15.04.2026")).toBe("2026-04-15");
  });

  it("parses MM/DD/YYYY", () => {
    expect(parseSheetDate("04/15/2026")).toBe("2026-04-15");
  });

  it("parses Google Sheets serial number", () => {
    // 46127 = 2026-04-15
    const result = parseSheetDate(46127);
    expect(result).toBe("2026-04-15");
  });

  it("returns null for empty/invalid", () => {
    expect(parseSheetDate("")).toBeNull();
    expect(parseSheetDate(null)).toBeNull();
    expect(parseSheetDate("not a date")).toBeNull();
  });

  it("parses MM/DD (no year) — infers current year", () => {
    const year = new Date().getFullYear();
    const result = parseSheetDate("06/15");
    expect(result).toMatch(new RegExp(`^${year}(-\\d{2}){2}$`));
  });

  it("handles MM/DD year-rollover when date is >60 days in the past", () => {
    // If we parse "01/05" and it would be >60 days ago, it should use next year
    const now = new Date();
    const result = parseSheetDate("01/05");
    const parsed = new Date(result!);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    // Result should be in the future or within 60 days of today
    expect(parsed.getTime()).toBeGreaterThanOrEqual(sixtyDaysAgo.getTime());
  });

  it("strips text prefix from date ('loading 04/01')", () => {
    const result = parseSheetDate("loading 04/01");
    expect(result).not.toBeNull();
    // Should extract and parse the date portion
    expect(result).toMatch(/^\d{4}-04-01$/);
  });

  it("strips 'departed' prefix from date", () => {
    const result = parseSheetDate("departed 03/15/2026");
    expect(result).toBe("2026-03-15");
  });

  it("takes first date from multi-date string", () => {
    const result = parseSheetDate("01/25/2026 01/06/2024");
    expect(result).toBe("2026-01-25");
  });
});

describe("parseSpaceAvailable", () => {
  it("parses plain number", () => {
    expect(parseSpaceAvailable(30)).toEqual({ cbm: 30, rawValue: "30" });
  });

  it("parses string number", () => {
    expect(parseSpaceAvailable("30")).toEqual({ cbm: 30, rawValue: "30" });
  });

  it("parses CBM suffix", () => {
    expect(parseSpaceAvailable("30 CBM")).toEqual({ cbm: 30, rawValue: "30 CBM" });
  });

  it("parses Russian CBM", () => {
    expect(parseSpaceAvailable("30 кб.м")).toEqual({ cbm: 30, rawValue: "30 кб.м" });
  });

  it("parses approximate", () => {
    expect(parseSpaceAvailable("~30")).toEqual({ cbm: 30, rawValue: "~30" });
  });

  it("parses percentage with capacity 76", () => {
    const result = parseSpaceAvailable("40%", 76);
    expect(result.cbm).toBeCloseTo(30.4, 1);
    expect(result.rawValue).toBe("40%");
  });

  it("returns null for unparsable text", () => {
    expect(parseSpaceAvailable("half")).toEqual({ cbm: null, rawValue: "half" });
    expect(parseSpaceAvailable("")).toEqual({ cbm: null, rawValue: "" });
  });

  it("treats bare number as percentage when headerHint contains %", () => {
    const result = parseSpaceAvailable(15, 76, "Available space %");
    // 15% of 76 = 11.4
    expect(result.cbm).toBeCloseTo(11.4, 1);
    expect(result.rawValue).toBe("15%");
  });

  it("treats bare string number as percentage when headerHint contains %", () => {
    const result = parseSpaceAvailable("40", 76, "Space %");
    expect(result.cbm).toBeCloseTo(30.4, 1);
  });

  it("returns 0 CBM for zero value regardless of headerHint", () => {
    const result = parseSpaceAvailable(0, 76, "Available space %");
    expect(result.cbm).toBe(0);
  });
});

describe("extractCountryCode", () => {
  it("extracts from English country name", () => {
    expect(extractCountryCode("Almaty, Kazakhstan")).toBe("KZ");
    expect(extractCountryCode("Santos, Brazil")).toBe("BR");
  });

  it("extracts from Russian country name", () => {
    expect(extractCountryCode("Алматы, Казахстан")).toBe("KZ");
  });

  it("extracts trailing ISO code", () => {
    expect(extractCountryCode("Almaty, KZ")).toBe("KZ");
  });

  it("returns null for unknown", () => {
    expect(extractCountryCode("Unknown Place")).toBeNull();
  });

  it("does not match US state codes as country codes", () => {
    expect(extractCountryCode("Houston, TX")).not.toBe("TX");
    expect(extractCountryCode("Savannah, GA")).not.toBe("GA");
  });
});

describe("isUSLocation", () => {
  it("detects City, STATE pattern", () => {
    expect(isUSLocation("Houston, TX")).toBe(true);
    expect(isUSLocation("Norfolk, VA")).toBe(true);
    expect(isUSLocation("Savannah, GA")).toBe(true);
    expect(isUSLocation("Baltimore, MD")).toBe(true);
  });

  it("detects known US port city names", () => {
    expect(isUSLocation("Houston")).toBe(true);
    expect(isUSLocation("Savannah")).toBe(true);
    expect(isUSLocation("Norfolk")).toBe(true);
    expect(isUSLocation("Albion")).toBe(true);
    expect(isUSLocation("Minneapolis")).toBe(true);
  });

  it("does NOT flag international destinations", () => {
    expect(isUSLocation("Almaty, Kazakhstan")).toBe(false);
    expect(isUSLocation("Klaipeda, Lithuania")).toBe(false);
    expect(isUSLocation("Poti, Georgia")).toBe(false);
    expect(isUSLocation("Constanta, Romania")).toBe(false);
    expect(isUSLocation("Santos, Brazil")).toBe(false);
  });

  it("returns false for empty/TBD", () => {
    expect(isUSLocation("")).toBe(false);
    expect(isUSLocation("TBD")).toBe(false);
  });
});

describe("parseRow", () => {
  const colMap = {
    project_number: 0,
    origin: 1,
    destination: 2,
    departure_date: 3,
    eta_date: 4,
    space_available: 5,
  };

  it("parses a valid row", () => {
    const row = [
      "MF-2026-047",
      "Chicago, IL",
      "Almaty, Kazakhstan",
      localDatePlusDays(7),
      localDatePlusDays(42),
      "29",
    ];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(error).toBeNull();
    expect(parsed).not.toBeNull();
    expect(parsed!.project_number).toBe("MF-2026-047");
    expect(parsed!.destination_country).toBe("KZ");
    expect(parsed!.available_cbm).toBe(29);
    expect(parsed!.status).toBe("available");
  });

  it("skips row with empty project number", () => {
    const row = ["", "Chicago, IL", "Almaty", localDatePlusDays(7), "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error).toBeNull(); // Silent skip
  });

  it("parses row with missing destination as TBD", () => {
    const row = ["MF-001", "Chicago", "", localDatePlusDays(7), "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(error).toBeNull();
    expect(parsed).not.toBeNull();
    expect(parsed!.destination).toBe("TBD");
    expect(parsed!.destination_country).toBeNull();
  });

  it("silently skips row with unparsable date", () => {
    const row = ["MF-001", "Chicago", "Almaty, KZ", "not-a-date", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error).toBeNull(); // Silent skip — container not scheduled yet
  });

  it("defaults origin to Albion, IA when empty", () => {
    const row = ["MF-001", "", "Almaty, KZ", localDatePlusDays(7), "", "29"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.origin).toBe("Albion, IA");
  });

  it("treats US location destination as TBD", () => {
    const row = ["LionH1126", "Houston,TX", "Houston, TX", localDatePlusDays(7), "", "0"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed).not.toBeNull();
    expect(parsed!.destination).toBe("TBD");
    expect(parsed!.destination_country).toBeNull();
  });

  it("treats Norfolk, VA destination as TBD", () => {
    const row = ["LionN1127", "Norfolk, VA", "Norfolk, VA", localDatePlusDays(7), "", "0"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.destination).toBe("TBD");
  });

  it("preserves valid international destination", () => {
    const row = [
      "NRD68",
      "Minneapolis",
      "Kokshetau, Kazakhstan",
      localDatePlusDays(7),
      "",
      "29",
    ];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.destination).toBe("Kokshetau, Kazakhstan");
    expect(parsed!.destination_country).toBe("KZ");
  });

  it("nullifies ETA when it equals departure date", () => {
    const sameDay = localDatePlusDays(7);
    const row = ["LionH1126", "Houston,TX", "", sameDay, sameDay, "0"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.departure_date).toBe(sameDay);
    expect(parsed!.eta_date).toBeNull();
  });

  it("keeps ETA when it differs from departure date", () => {
    const departure = localDatePlusDays(7);
    const eta = localDatePlusDays(26);
    const row = ["NRD66", "Albion,IA", "", departure, eta, "0"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.departure_date).toBe(departure);
    expect(parsed!.eta_date).toBe(eta);
  });
});

describe("aggregateByProject", () => {
  function makeRow(overrides: Partial<ParsedContainerRow> = {}): ParsedContainerRow {
    return {
      project_number: "TEST-001",
      origin: "Albion, IA",
      destination: "TBD",
      destination_country: null,
      departure_date: localDatePlusDays(7),
      eta_date: null,
      container_type: "40HC",
      total_capacity_cbm: 76,
      available_cbm: null,
      raw_space_value: "",
      sheet_row_number: 1,
      notes: null,
      status: "full",
      container_count: 1,
      ...overrides,
    };
  }

  it("single-row groups pass through unchanged", () => {
    const rows = [
      makeRow({ project_number: "A", destination: "Brazil" }),
      makeRow({ project_number: "B", destination: "Kazakhstan" }),
    ];
    const result = aggregateByProject(rows);
    expect(result).toHaveLength(2);
    expect(result[0].container_count).toBe(1);
    expect(result[1].container_count).toBe(1);
  });

  it("multi-container group aggregates with container_count", () => {
    const rows = [
      makeRow({ project_number: "LION-1", departure_date: "2026-04-10" }),
      makeRow({ project_number: "LION-1", departure_date: "2026-04-12" }),
      makeRow({ project_number: "LION-1", departure_date: "2026-04-08" }),
    ];
    const result = aggregateByProject(rows);
    expect(result).toHaveLength(1);
    expect(result[0].container_count).toBe(3);
    expect(result[0].project_number).toBe("LION-1");
  });

  it("picks earliest departure_date from group", () => {
    const rows = [
      makeRow({ project_number: "X", departure_date: "2026-04-20" }),
      makeRow({ project_number: "X", departure_date: "2026-04-10" }),
      makeRow({ project_number: "X", departure_date: "2026-04-15" }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].departure_date).toBe("2026-04-10");
  });

  it("picks latest eta_date from group", () => {
    const rows = [
      makeRow({ project_number: "X", eta_date: "2026-05-01" }),
      makeRow({ project_number: "X", eta_date: "2026-05-15" }),
      makeRow({ project_number: "X", eta_date: null }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].eta_date).toBe("2026-05-15");
  });

  it("prefers non-TBD destination with country code", () => {
    const rows = [
      makeRow({ project_number: "X", destination: "TBD", destination_country: null }),
      makeRow({ project_number: "X", destination: "Almaty, Kazakhstan", destination_country: "KZ" }),
      makeRow({ project_number: "X", destination: "TBD", destination_country: null }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].destination).toBe("Almaty, Kazakhstan");
    expect(result[0].destination_country).toBe("KZ");
  });

  it("falls back to non-TBD without country if no international dest", () => {
    const rows = [
      makeRow({ project_number: "X", destination: "TBD", destination_country: null }),
      makeRow({ project_number: "X", destination: "Warwick, NY (local)", destination_country: null }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].destination).toBe("Warwick, NY (local)");
  });

  it("sums total_capacity_cbm across containers", () => {
    const rows = [
      makeRow({ project_number: "X", total_capacity_cbm: 76 }),
      makeRow({ project_number: "X", total_capacity_cbm: 76 }),
      makeRow({ project_number: "X", total_capacity_cbm: 28 }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].total_capacity_cbm).toBe(180);
    expect(result[0].container_count).toBe(3);
  });

  it("sums available_cbm when any container reports space", () => {
    const rows = [
      makeRow({ project_number: "X", available_cbm: 20 }),
      makeRow({ project_number: "X", available_cbm: null }),
      makeRow({ project_number: "X", available_cbm: 10 }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].available_cbm).toBe(30);
    expect(result[0].status).toBe("available");
  });

  it("keeps available_cbm null when no container reports space", () => {
    const rows = [
      makeRow({ project_number: "X", available_cbm: null }),
      makeRow({ project_number: "X", available_cbm: null }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].available_cbm).toBeNull();
    expect(result[0].status).toBe("full");
  });

  it("marks container_type as Mixed when heterogeneous", () => {
    const rows = [
      makeRow({ project_number: "X", container_type: "40HC" }),
      makeRow({ project_number: "X", container_type: "Flatrack" }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].container_type).toBe("Mixed");
  });

  it("keeps uniform container_type", () => {
    const rows = [
      makeRow({ project_number: "X", container_type: "Flatrack" }),
      makeRow({ project_number: "X", container_type: "Flatrack" }),
      makeRow({ project_number: "X", container_type: "Flatrack" }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].container_type).toBe("Flatrack");
  });

  it("prefers non-default origin", () => {
    const rows = [
      makeRow({ project_number: "X", origin: "Albion, IA" }),
      makeRow({ project_number: "X", origin: "Norfolk, VA" }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].origin).toBe("Norfolk, VA");
  });

  it("merges unique notes", () => {
    const rows = [
      makeRow({ project_number: "X", notes: "Fragile" }),
      makeRow({ project_number: "X", notes: "Fragile" }),
      makeRow({ project_number: "X", notes: "Heavy" }),
    ];
    const result = aggregateByProject(rows);
    expect(result[0].notes).toBe("Fragile; Heavy");
  });

  it("mixes single and multi-container groups correctly", () => {
    const rows = [
      makeRow({ project_number: "SINGLE", destination: "Brazil", container_count: 1 }),
      makeRow({ project_number: "MULTI", departure_date: "2026-04-10" }),
      makeRow({ project_number: "MULTI", departure_date: "2026-04-05" }),
    ];
    const result = aggregateByProject(rows);
    expect(result).toHaveLength(2);

    const single = result.find((r) => r.project_number === "SINGLE")!;
    expect(single.container_count).toBe(1);

    const multi = result.find((r) => r.project_number === "MULTI")!;
    expect(multi.container_count).toBe(2);
    expect(multi.departure_date).toBe("2026-04-05");
  });
});
