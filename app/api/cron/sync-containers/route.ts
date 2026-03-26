/**
 * Cron job: Sync shared shipping containers from Google Sheet.
 * Runs every 15 minutes — upserts container listings into Supabase
 * and revalidates the /shared-shipping page on success.
 *
 * Protected by CRON_SECRET header verification (Vercel auto-sends this).
 */

import { revalidatePath } from "next/cache";
import { notifySlack } from "@/lib/slack";
import { log, startTimer } from "@/lib/logger";
import { syncContainersFromSheet } from "@/lib/sync-containers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const timer = startTimer("cron:sync-containers");

  try {
    const result = await syncContainersFromSheet();

    const { upserted, errors } = result;

    // Revalidate shared-shipping page and all locale variants on success/partial
    revalidatePath("/shared-shipping");
    revalidatePath("/en/shared-shipping");
    revalidatePath("/es/shared-shipping");
    revalidatePath("/ru/shared-shipping");

    // Warn if error rate is high (more errors than successful upserts)
    if (errors > upserted) {
      const message = [
        ":warning: *Container Sync — High Error Rate*",
        `• Upserted: ${upserted}`,
        `• Errors: ${errors}`,
        "",
        "Check Vercel logs for details: cron:sync-containers",
      ].join("\n");

      await notifySlack(message);
      log({
        level: "warn",
        msg: "sync_containers_high_error_rate",
        route: "cron:sync-containers",
        upserted,
        errors,
      });
    } else {
      timer.done({ upserted, errors });
    }

    return Response.json({
      status: errors > 0 ? "partial" : "ok",
      upserted,
      errors,
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);

    await notifySlack(
      [
        ":x: *Container Sync — Failed*",
        `• Error: ${errorMessage}`,
        "",
        "Check Vercel logs for details: cron:sync-containers",
      ].join("\n")
    );

    timer.error(e);

    return Response.json(
      { status: "error", error: errorMessage },
      { status: 500 }
    );
  }
}
