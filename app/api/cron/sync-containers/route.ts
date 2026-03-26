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

    // Revalidate shared-shipping page and all locale variants on success/partial
    if (result.status !== "failed") {
      revalidatePath("/shared-shipping");
      revalidatePath("/en/shared-shipping");
      revalidatePath("/es/shared-shipping");
      revalidatePath("/ru/shared-shipping");
    }

    // Warn if error rate is high (more errors than successful upserts)
    if (result.status === "failed") {
      const errorMsg = result.errors[0]?.error ?? "Unknown error";
      await notifySlack(
        `:warning: *Container Sync FAILED*\nError: ${errorMsg}\nRows fetched: ${result.rowsFetched}, Errors: ${result.rowsErrored}\nDuration: ${result.durationMs}ms`
      );
    } else if (result.rowsErrored > result.rowsUpserted) {
      await notifySlack(
        `:warning: *Container Sync — High Error Rate*\nUpserted: ${result.rowsUpserted}, Errors: ${result.rowsErrored}, Skipped: ${result.rowsSkipped}\nDuration: ${result.durationMs}ms`
      );
      log({
        level: "warn",
        msg: "sync_containers_high_error_rate",
        route: "cron:sync-containers",
        upserted: result.rowsUpserted,
        errors: result.rowsErrored,
      });
    } else {
      timer.done({ upserted: result.rowsUpserted, errored: result.rowsErrored });
    }

    return Response.json({
      status: result.status,
      upserted: result.rowsUpserted,
      errors: result.rowsErrored,
      duration: result.durationMs,
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
