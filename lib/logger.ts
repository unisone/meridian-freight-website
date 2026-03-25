/**
 * Structured JSON logger for server-side code.
 * Outputs JSON that Vercel's runtime log viewer can parse, filter, and search.
 */

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  msg: string;
  route?: string;
  ms?: number;
  [key: string]: unknown;
}

export function log(entry: LogEntry): void {
  const output = JSON.stringify({ ...entry, ts: new Date().toISOString() });
  if (entry.level === "error") {
    console.error(output);
  } else if (entry.level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

/** Start a timer for a route/action. Returns done() and error() helpers. */
export function startTimer(route: string) {
  const start = Date.now();
  log({ level: "info", msg: "start", route });

  return {
    done(extra?: Record<string, unknown>) {
      log({ level: "info", msg: "done", route, ms: Date.now() - start, ...extra });
    },
    error(err: unknown, extra?: Record<string, unknown>) {
      log({
        level: "error",
        msg: "failed",
        route,
        ms: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
        ...extra,
      });
    },
  };
}
