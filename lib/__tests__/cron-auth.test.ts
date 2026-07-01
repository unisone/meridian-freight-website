import { afterEach, describe, expect, it } from "vitest";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

const originalCronSecret = process.env.CRON_SECRET;

function requestWithAuth(value?: string) {
  return new Request("https://example.com/api/cron/rate-check", {
    headers: value ? { authorization: value } : undefined,
  });
}

describe("isAuthorizedCronRequest", () => {
  afterEach(() => {
    if (originalCronSecret === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = originalCronSecret;
    }
  });

  it("fails closed when CRON_SECRET is missing", () => {
    delete process.env.CRON_SECRET;

    expect(isAuthorizedCronRequest(requestWithAuth("Bearer undefined"))).toBe(false);
    expect(isAuthorizedCronRequest(requestWithAuth())).toBe(false);
  });

  it("fails closed when CRON_SECRET contains surrounding whitespace", () => {
    process.env.CRON_SECRET = " secret-with-newline\n";

    expect(isAuthorizedCronRequest(requestWithAuth("Bearer secret-with-newline"))).toBe(false);
  });

  it("accepts only the exact configured bearer token", () => {
    process.env.CRON_SECRET = "qa-cron-secret";

    expect(isAuthorizedCronRequest(requestWithAuth("Bearer qa-cron-secret"))).toBe(true);
    expect(isAuthorizedCronRequest(requestWithAuth("Bearer wrong"))).toBe(false);
    expect(isAuthorizedCronRequest(requestWithAuth("qa-cron-secret"))).toBe(false);
  });
});
