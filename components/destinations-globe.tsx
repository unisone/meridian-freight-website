"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MeshPhongMaterial, Color } from "three";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

// ─── Types ──────────────────────────────────────────────────────────────────

interface ArcDatum {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
  stroke: number;
  dashLength: number;
  dashGap: number;
  animateTime: number;
  label: string;
}

interface PointDatum {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
}

interface LabelDatum {
  lat: number;
  lng: number;
  text: string;
  color: string;
  size: number;
  altitude: number;
}

interface GeoFeature {
  properties?: { ISO_A2?: string };
}

// ─── Data ───────────────────────────────────────────────────────────────────

/** Albion, IA — Meridian Freight HQ / packing facility */
const ORIGIN: [number, number] = [42.1172, -92.9835];

/** Featured routes matching the 8 destination pages */
const ROUTES = [
  { name: "Santos", country: "Brazil", lat: -23.96, lng: -46.33, transitDays: "25-30" },
  { name: "Jebel Ali", country: "UAE", lat: 25.01, lng: 55.06, transitDays: "30-38" },
  { name: "Mersin", country: "Turkey", lat: 36.8, lng: 34.63, transitDays: "18-25" },
  { name: "Jeddah", country: "Saudi Arabia", lat: 21.49, lng: 39.19, transitDays: "28-35" },
  { name: "Cartagena", country: "Colombia", lat: 10.39, lng: -75.51, transitDays: "12-18" },
  { name: "Veracruz", country: "Mexico", lat: 19.19, lng: -96.13, transitDays: "10-15" },
  { name: "Constanta", country: "Romania", lat: 44.17, lng: 28.65, transitDays: "22-28" },
  { name: "Aktau", country: "Kazakhstan", lat: 43.65, lng: 51.15, transitDays: "40-50" },
];

/** Additional ports to show as dots (no arcs) — reinforces worldwide reach */
const SECONDARY_PORTS: [number, number][] = [
  // Latin America
  [-34.6, -58.38],   // Buenos Aires, Argentina
  [-33.45, -70.67],  // Santiago, Chile
  [-12.07, -77.15],  // Callao, Peru
  [-2.2, -79.9],     // Guayaquil, Ecuador
  [-34.88, -56.17],  // Montevideo, Uruguay
  [9.35, -79.9],     // Colon, Panama
  [10.0, -83.03],    // Puerto Limon, Costa Rica
  [13.92, -90.79],   // Puerto Quetzal, Guatemala
  [15.83, -87.95],   // Puerto Cortes, Honduras
  [18.47, -69.88],   // Santo Domingo, DR
  [10.6, -66.93],    // La Guaira, Venezuela
  [17.97, -76.79],   // Kingston, Jamaica
  [10.65, -61.52],   // Port of Spain, Trinidad
  [23.13, -82.35],   // Havana, Cuba
  [25.06, -77.35],   // Nassau, Bahamas
  // Africa
  [6.45, 3.39],      // Lagos, Nigeria
  [-4.04, 39.67],    // Mombasa, Kenya
  [-29.87, 31.03],   // Durban, South Africa
  [5.62, -0.02],     // Tema, Ghana
  [31.2, 29.92],     // Alexandria, Egypt
  [33.89, -5.55],    // Casablanca, Morocco
  [36.81, 10.18],    // Tunis, Tunisia
  [-8.84, 13.23],    // Luanda, Angola
  [-25.97, 32.59],   // Maputo, Mozambique
  [4.05, 9.69],      // Douala, Cameroon
  [5.3, -4.01],      // Abidjan, Ivory Coast
  [-22.96, 14.51],   // Walvis Bay, Namibia
  [11.59, 43.15],    // Djibouti
  [-18.15, 49.41],   // Toamasina, Madagascar
  // Europe & Central Asia
  [42.15, 41.67],    // Poti, Georgia
  [43.19, 27.92],    // Varna, Bulgaria
  [46.48, 30.74],    // Odesa, Ukraine
  [59.93, 30.32],    // St. Petersburg, Russia
  // Asia & Oceania
  [35.1, 129.04],    // Busan, South Korea
  [31.23, 121.47],   // Shanghai, China
  [-37.82, 144.95],  // Melbourne, Australia
];

// ─── Palette ────────────────────────────────────────────────────────────────

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/npm/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson";

const LAND_COLOR = "rgba(55, 75, 100, 1)";
const BORDER_COLOR = "rgba(130, 160, 190, 0.8)";
const LAND_SIDE_COLOR = "rgba(35, 50, 70, 0.6)";

// Unified teal palette — matches site design system (single accent color)
// Variation comes from opacity/stagger, not rainbow colors
const ARC_COLOR: [string, string] = ["rgba(0, 200, 200, 0.65)", "rgba(0, 200, 200, 0.18)"];

const MARKER_COLOR = "rgba(0, 200, 200, 1)";
const MARKER_SECONDARY = "rgba(0, 200, 200, 0.5)";
const MARKER_SUBTLE = "rgba(100, 120, 140, 0.4)";
const LABEL_COLOR = "rgba(255, 255, 255, 0.7)";

// ─── Component ──────────────────────────────────────────────────────────────

export function DestinationsGlobe({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeWidth, setGlobeWidth] = useState(560);
  const [countries, setCountries] = useState<{ features: GeoFeature[] }>({
    features: [],
  });

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setGlobeWidth(Math.round(entry.contentRect.width));
    });
    obs.observe(el);
    setGlobeWidth(el.offsetWidth);
    return () => obs.disconnect();
  }, []);

  // Load GeoJSON
  useEffect(() => {
    const controller = new AbortController();
    fetch(GEOJSON_URL, { signal: controller.signal })
      .then((r) => r.json())
      .then(setCountries)
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("GeoJSON load failed:", err);
        }
      });
    return () => controller.abort();
  }, []);

  // Filter out Antarctica
  const polygonData = useMemo(
    () =>
      countries.features.filter(
        (d: GeoFeature) => d.properties?.ISO_A2 !== "AQ"
      ),
    [countries]
  );

  // ─── Globe ocean material (dark navy, distinct from land) ───────────
  const oceanMaterial = useMemo(() => {
    const mat = new MeshPhongMaterial();
    mat.color = new Color(0x0a1628);       // deep navy ocean
    mat.emissive = new Color(0x061020);    // subtle self-illumination
    mat.emissiveIntensity = 0.2;
    mat.shininess = 5;
    return mat;
  }, []);

  // ─── Build arcs — one per featured route ────────────────────────────
  const arcsData = useMemo<ArcDatum[]>(() => {
    return ROUTES.map((route, idx) => ({
      startLat: ORIGIN[0],
      startLng: ORIGIN[1],
      endLat: route.lat,
      endLng: route.lng,
      color: ARC_COLOR,
      stroke: 0.35,
      dashLength: 0.4,
      dashGap: 0.2,
      animateTime: 2500 + idx * 400, // staggered animation
      label: `${route.country} — ${route.name} (${route.transitDays} days)`,
    }));
  }, []);

  // ─── Build points ───────────────────────────────────────────────────
  const pointsData = useMemo<PointDatum[]>(() => {
    const points: PointDatum[] = [
      // Origin
      {
        lat: ORIGIN[0],
        lng: ORIGIN[1],
        size: 0.7,
        color: MARKER_COLOR,
        label: "Albion, IA — Meridian HQ",
      },
      // Featured destinations
      ...ROUTES.map((route) => ({
        lat: route.lat,
        lng: route.lng,
        size: 0.5,
        color: MARKER_SECONDARY,
        label: `${route.name}, ${route.country}`,
      })),
      // Secondary ports (smaller dots, no arcs)
      ...SECONDARY_PORTS.map(([lat, lng]) => ({
        lat,
        lng,
        size: 0.2,
        color: MARKER_SUBTLE,
        label: "",
      })),
    ];
    return points;
  }, []);

  // ─── Build labels ──────────────────────────────────────────────────
  const labelsData = useMemo<LabelDatum[]>(() => {
    return [
      {
        lat: ORIGIN[0],
        lng: ORIGIN[1],
        text: "ALBION, IA",
        color: "rgba(255, 255, 255, 0.9)",
        size: 0.6,
        altitude: 0.015,
      },
      ...ROUTES.map((route) => ({
        lat: route.lat,
        lng: route.lng,
        text: route.country.toUpperCase(),
        color: LABEL_COLOR,
        size: 0.55,
        altitude: 0.015,
      })),
    ];
  }, []);

  // ─── Globe config on ready ────────────────────────────────────────
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;

    // Set initial camera to see Atlantic — shows Americas + Europe/Africa
    globeRef.current.pointOfView({ lat: 20, lng: -30, altitude: 2.2 }, 0);

    // Static positioning — no auto-spin, no zoom
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableZoom = false;
    }
  }, [globeReady]);

  const globeHeight = Math.round(globeWidth * 0.85);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-black ${className}`}
      role="img"
      aria-label="Interactive map showing worldwide shipping destinations"
    >
      <GlobeGL
        ref={globeRef}
        onGlobeReady={() => setGlobeReady(true)}
        width={globeWidth}
        height={globeHeight}
        backgroundColor="rgba(0,0,0,0)"
        showGlobe={true}
        globeMaterial={oceanMaterial}
        showAtmosphere={true}
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.15}
        polygonsData={polygonData}
        polygonCapColor={() => LAND_COLOR}
        polygonSideColor={() => LAND_SIDE_COLOR}
        polygonStrokeColor={() => BORDER_COLOR}
        polygonAltitude={0.008}
        arcsData={arcsData}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke="stroke"
        arcDashLength="dashLength"
        arcDashGap="dashGap"
        arcDashAnimateTime="animateTime"
        arcLabel="label"
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointLabel="label"
        labelsData={labelsData}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelAltitude="altitude"
        labelDotRadius={0.3}
        labelResolution={2}
        enablePointerInteraction={true}
        animateIn={true}
      />

      {/* Loading skeleton — visible until globe renders */}
      {!globeReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-2 border-muted border-t-primary animate-spin" />
        </div>
      )}

      {/* Route count badge */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
          8 Featured Routes &middot; 40+ Countries
        </span>
      </div>
    </div>
  );
}
