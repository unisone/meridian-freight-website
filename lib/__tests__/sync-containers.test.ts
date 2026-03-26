import { describe, it, expect } from "vitest";
import {
  detectColumns,
  parseSheetDate,
  parseSpaceAvailable,
  extractCountryCode,
  parseRow,
} from "@/lib/sync-containers";

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
    const row = ["MF-2026-047", "Chicago, IL", "Almaty, Kazakhstan", "2026-04-15", "2026-05-20", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(error).toBeNull();
    expect(parsed).not.toBeNull();
    expect(parsed!.project_number).toBe("MF-2026-047");
    expect(parsed!.destination_country).toBe("KZ");
    expect(parsed!.available_cbm).toBe(29);
  });

  it("skips row with empty project number", () => {
    const row = ["", "Chicago, IL", "Almaty", "2026-04-15", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error).toBeNull(); // Silent skip
  });

  it("errors on missing destination", () => {
    const row = ["MF-001", "Chicago", "", "2026-04-15", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error).not.toBeNull();
    expect(error!.field).toBe("destination");
  });

  it("errors on unparsable date", () => {
    const row = ["MF-001", "Chicago", "Almaty, KZ", "not-a-date", "", "29"];
    const { parsed, error } = parseRow(row, 1, colMap);
    expect(parsed).toBeNull();
    expect(error!.field).toBe("departure_date");
  });

  it("defaults origin to Albion, IA when empty", () => {
    const row = ["MF-001", "", "Almaty, KZ", "2026-04-15", "", "29"];
    const { parsed } = parseRow(row, 1, colMap);
    expect(parsed!.origin).toBe("Albion, IA");
  });
});
