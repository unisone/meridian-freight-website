import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { storeWaAttribution } from "@/lib/wa-attribution";

const waClickSchema = z.object({
  ref_code: z.string().regex(/^MF-[A-HJ-NP-Z2-9]{4}$/),
  source_page: z.string().max(200),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waClickSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await storeWaAttribution(parsed.data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
