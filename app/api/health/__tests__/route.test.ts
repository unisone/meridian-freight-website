import { describe, expect, it } from "vitest";

import { GET, dynamic, runtime } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns an uncached Node runtime health response", async () => {
    const response = await GET();
    const body = await response.json();

    expect(runtime).toBe("nodejs");
    expect(dynamic).toBe("force-dynamic");
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body).toMatchObject({
      ok: true,
      service: "meridian-freight-website",
    });
    expect(new Date(body.timestamp).toString()).not.toBe("Invalid Date");
  });
});
