import { NextRequest, NextResponse } from "next/server";
import { storeWaAttribution } from "@/lib/wa-attribution";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ref_code, source_page, utm_source, utm_medium, utm_campaign } =
      body as Record<string, string>;

    if (!ref_code || !source_page) {
      return NextResponse.json(
        { error: "ref_code and source_page are required" },
        { status: 400 }
      );
    }

    await storeWaAttribution({
      ref_code,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
