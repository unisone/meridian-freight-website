"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Lazy-loaded RouteGlobe for the v3 wizard.
 *
 * Why this wrapper exists: `components/freight-calculator/route-globe.tsx`
 * already uses `next/dynamic` internally for `react-globe.gl`, but that
 * inner boundary is defeated when the wizard does a static
 * `import { RouteGlobe } from ".../route-globe"`. Static parent imports
 * collapse the lazy boundary at build time and pull `react-globe.gl`
 * (and its ~600 KB three.js dependency tree) into the wizard's initial
 * client chunk for `/pricing/calculator`.
 *
 * Lifting `dynamic()` to module-import level here gives the bundler a
 * stable async boundary: this file is what the wizard imports, and this
 * file's `dynamic(() => import(...))` is what defers the route-globe
 * chunk. Three.js stays out of the calculator route's initial JS.
 */
export const RouteGlobeV3 = dynamic(
  () =>
    import("@/components/freight-calculator/route-globe").then((m) => ({
      default: m.RouteGlobe,
    })),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="aspect-square w-full max-w-md mx-auto rounded-2xl bg-muted"
        aria-hidden
      />
    ),
  },
);
