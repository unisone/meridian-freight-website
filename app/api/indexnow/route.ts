import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/constants";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

export async function POST(req: NextRequest) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "IndexNow not configured" },
      { status: 503 },
    );
  }

  // Simple auth: require a secret header
  const secret = req.headers.get("x-indexnow-secret");
  if (secret !== process.env.INDEXNOW_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const urls: string[] = body.urls ?? [];

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  const payload = {
    host: SITE.domain,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE.url}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({
    status: response.status,
    submitted: urls.length,
  });
}
