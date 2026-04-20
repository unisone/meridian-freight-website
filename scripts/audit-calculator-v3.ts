/**
 * Audit calculator V3 route/transit health from live Supabase data.
 *
 * Usage:
 *   npm run audit:calculator-v3
 */

import { fetchEquipmentRates, fetchOceanRates } from "../lib/supabase-rates";
import { buildRouteCatalog } from "../lib/calculator-v3/routes";
import { buildRouteHealthReport } from "../lib/calculator-v3/route-health";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const [equipmentRates, oceanRates] = await Promise.all([
    fetchEquipmentRates(),
    fetchOceanRates(),
  ]);

  if (!equipmentRates || !oceanRates) {
    console.error("Error: live Supabase equipment and ocean rates are required for this audit.");
    console.error("Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.");
    process.exit(1);
  }

  const catalog = buildRouteCatalog(oceanRates);
  const routeHealth = buildRouteHealthReport(catalog);

  const report = {
    sourceCounts: {
      equipmentRates: equipmentRates.length,
      oceanRates: oceanRates.length,
    },
    routeHealth,
  };

  console.log(JSON.stringify(report, null, 2));

  if (routeHealth.criticalIssues.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Route health audit failed: ${message}`);
  process.exit(1);
});
