import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

/**
 * Serves the IndexNow key verification file.
 * Mapped from /{INDEXNOW_KEY}.txt via next.config.ts rewrite.
 * Search engines hit this to verify key ownership.
 */
export async function GET(req: NextRequest) {
  if (!INDEXNOW_KEY) {
    return new NextResponse("Not configured", { status: 404 });
  }

  // Only serve if the requested key matches (defense in depth)
  const requestedKey = req.nextUrl.searchParams.get("key");
  if (requestedKey && requestedKey !== INDEXNOW_KEY) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(INDEXNOW_KEY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
