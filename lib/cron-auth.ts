import { timingSafeEqual } from "crypto";

export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret !== secret.trim()) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }

  const expected = `Bearer ${secret}`;
  const received = Buffer.from(authHeader);
  const target = Buffer.from(expected);

  return received.length === target.length && timingSafeEqual(received, target);
}
