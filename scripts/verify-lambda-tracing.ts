#!/usr/bin/env tsx
/**
 * verify-lambda-tracing.ts
 *
 * Guard against the @swc/helpers ESM tracing regression that caused the
 * 2026-05-19 MIDDLEWARE_INVOCATION_FAILED production SEV.
 *
 * Background: Vercel's NFT (Node File Tracing) intermittently drops the ESM
 * `@swc/helpers/esm/_interop_require_default.js` file from Node-runtime lambda
 * traces. The deployed lambda then crashes at startup with
 * `Cannot find module '/var/task/node_modules/@swc/helpers/esm/_interop_require_default.js'`.
 *
 * This script parses every `.next/server/**\/*.nft.json` produced by `next build`
 * and asserts the canary helper file is present in every Node-runtime trace. Run
 * as a CI step after the build — fails the PR before the broken artifact ships.
 */

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const CANARY_FILE = "node_modules/@swc/helpers/esm/_interop_require_default.js";

interface NftTrace {
  version?: number;
  files?: string[];
}

function checkTrace(path: string): { ok: boolean; reason?: string } {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    return { ok: false, reason: `unreadable: ${(err as Error).message}` };
  }
  let trace: NftTrace;
  try {
    trace = JSON.parse(raw);
  } catch (err) {
    return { ok: false, reason: `invalid JSON: ${(err as Error).message}` };
  }
  const files = trace.files ?? [];
  const hit = files.some((f) => f.endsWith(CANARY_FILE));
  if (!hit) {
    return {
      ok: false,
      reason: `missing canary "${CANARY_FILE}" in ${files.length} traced files`,
    };
  }
  return { ok: true };
}

function main(): void {
  // App Router lambdas only: page.js (page lambdas) and route.js (API route
  // handlers). These were the ones that crashed in the 2026-05-19 SEV. Skip
  // - middleware.js (Edge runtime, bundles inline)
  // - instrumentation.js (Next.js hook, not a deployable lambda — its NFT is
  //   informational and merged into parent lambda traces at deploy time)
  const traces = [
    ...globSync(".next/server/app/**/page.js.nft.json", { cwd: process.cwd() }),
    ...globSync(".next/server/app/**/route.js.nft.json", { cwd: process.cwd() }),
  ];

  if (traces.length === 0) {
    console.error(
      "verify-lambda-tracing: no page.js/route.js .nft.json files found — did `next build` run?",
    );
    process.exit(2);
  }

  const nodeRuntimeTraces = traces;

  const failures: { path: string; reason: string }[] = [];
  for (const p of nodeRuntimeTraces) {
    const result = checkTrace(p);
    if (!result.ok) failures.push({ path: p, reason: result.reason ?? "?" });
  }

  console.log(
    `verify-lambda-tracing: checked ${nodeRuntimeTraces.length} traces`,
  );

  if (failures.length === 0) {
    console.log(`  All traces include "${CANARY_FILE}" — OK`);
    process.exit(0);
  }

  console.error(`\nverify-lambda-tracing: ${failures.length} failure(s):`);
  for (const f of failures.slice(0, 10)) {
    console.error(`  ${f.path}`);
    console.error(`    ${f.reason}`);
  }
  if (failures.length > 10) {
    console.error(`  ... and ${failures.length - 10} more`);
  }
  console.error(
    `\nThis usually means \`outputFileTracingIncludes\` no longer covers @swc/helpers.`,
  );
  console.error(
    `See PR #136 and Vercel community thread #41956 for context.`,
  );
  process.exit(1);
}

main();
