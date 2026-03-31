"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { resolveCoordinates, PORT_COORDINATES } from "@/components/freight-calculator/port-coordinates";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────
interface RouteGlobeProps {
  originPort: string | null;
  destinationPort: string | null;
  destinationCountry: string | null;
  containerType?: "fortyhc" | "flatrack" | null;
  className?: string;
}

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

// ─── Constants ────────────────────────────────────────────────────────────────
const ALBION_IA: [number, number] = [42.1172, -92.9835];
const CHICAGO_IL: [number, number] = [41.88, -87.63];

const GEOJSON_URL =
  "https://cdn.jsdelivr.net/npm/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson";

// Dark cartographic palette
const LAND_COLOR = "rgba(25, 25, 38, 0.95)";
const BORDER_COLOR = "rgba(65, 65, 85, 0.5)";
const LAND_SIDE_COLOR = "rgba(15, 15, 25, 0.4)";

// Route colors: TEAL (brand color — matches site design system)
const ARC_PRIMARY = "rgba(0, 200, 200, 0.85)";
const ARC_PRIMARY_FADE = "rgba(0, 200, 200, 0.35)";
const ARC_SECONDARY = "rgba(0, 200, 200, 0.5)";
const ARC_SECONDARY_FADE = "rgba(0, 200, 200, 0.2)";
const MARKER_PRIMARY = "rgba(0, 200, 200, 1)";
const MARKER_SECONDARY = "rgba(0, 200, 200, 0.7)";
const LABEL_COLOR = "rgba(255, 255, 255, 0.75)";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getAltitude(distKm: number): number {
  if (distKm < 2000) return 1.2;
  if (distKm < 4000) return 1.5;
  if (distKm < 7000) return 1.8;
  if (distKm < 12000) return 2.2;
  return 2.5;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RouteGlobe({
  originPort,
  destinationPort,
  destinationCountry,
  containerType,
  className = "",
}: RouteGlobeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeWidth, setGlobeWidth] = useState(600);
  const [countries, setCountries] = useState<{ features: GeoFeature[] }>({
    features: [],
  });

  // Responsive sizing via ResizeObserver
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

  // Load GeoJSON countries on mount with proper cleanup
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

  // Resolve coordinates
  const originCoords = originPort
    ? PORT_COORDINATES[originPort] ?? null
    : null;
  const destCoords = resolveCoordinates(destinationPort, destinationCountry);
  const hasRoute = originCoords !== null && destCoords !== null;

  // Filter out Antarctica
  const polygonData = useMemo(
    () =>
      countries.features.filter(
        (d: GeoFeature) => d.properties?.ISO_A2 !== "AQ"
      ),
    [countries]
  );

  // ─── Build arc data ─────────────────────────────────────────────────
  const arcsData = useMemo<ArcDatum[]>(() => {
    if (!originCoords || !destCoords) return [];

    const arcs: ArcDatum[] = [];

    // Main ocean route arc
    arcs.push({
      startLat: originCoords[0],
      startLng: originCoords[1],
      endLat: destCoords[0],
      endLng: destCoords[1],
      color: [ARC_PRIMARY, ARC_PRIMARY_FADE],
      stroke: 0.4,
      dashLength: 0.4,
      dashGap: 0.2,
      animateTime: 3000,
      label: `${originPort} → ${destinationPort}`,
    });

    // For 40HC: Albion→Chicago rail segment (only if origin is Chicago)
    if (containerType === "fortyhc" && originPort === "Chicago, IL") {
      arcs.push({
        startLat: ALBION_IA[0],
        startLng: ALBION_IA[1],
        endLat: CHICAGO_IL[0],
        endLng: CHICAGO_IL[1],
        color: [ARC_SECONDARY, ARC_SECONDARY_FADE],
        stroke: 0.25,
        dashLength: 0.2,
        dashGap: 0.3,
        animateTime: 1500,
        label: "Albion, IA → Chicago, IL (rail)",
      });
    }

    return arcs;
  }, [originCoords, destCoords, originPort, destinationPort, containerType]);

  // ─── Build point markers ────────────────────────────────────────────
  const pointsData = useMemo<PointDatum[]>(() => {
    if (!originCoords || !destCoords) return [];

    const points: PointDatum[] = [
      {
        lat: originCoords[0],
        lng: originCoords[1],
        size: 0.8,
        color: MARKER_PRIMARY,
        label: originPort ?? "Origin",
      },
      {
        lat: destCoords[0],
        lng: destCoords[1],
        size: 0.5,
        color: MARKER_SECONDARY,
        label: destinationPort ?? "Destination",
      },
    ];

    if (containerType === "fortyhc" && originPort === "Chicago, IL") {
      points.push({
        lat: ALBION_IA[0],
        lng: ALBION_IA[1],
        size: 0.6,
        color: MARKER_SECONDARY,
        label: "Albion, IA (packing hub)",
      });
    }

    return points;
  }, [originCoords, destCoords, originPort, destinationPort, containerType]);

  // ─── Build labels ──────────────────────────────────────────────────
  const labelsData = useMemo<LabelDatum[]>(() => {
    if (!originCoords || !destCoords) return [];

    const labels: LabelDatum[] = [
      {
        lat: originCoords[0],
        lng: originCoords[1],
        text: (originPort ?? "Origin").toUpperCase(),
        color: LABEL_COLOR,
        size: 0.7,
        altitude: 0.015,
      },
      {
        lat: destCoords[0],
        lng: destCoords[1],
        text: (destinationPort ?? "Destination").toUpperCase(),
        color: LABEL_COLOR,
        size: 0.7,
        altitude: 0.015,
      },
    ];

    if (containerType === "fortyhc" && originPort === "Chicago, IL") {
      labels.push({
        lat: ALBION_IA[0],
        lng: ALBION_IA[1],
        text: "ALBION, IA",
        color: "rgba(255, 255, 255, 0.5)",
        size: 0.5,
        altitude: 0.015,
      });
    }

    return labels;
  }, [originCoords, destCoords, originPort, destinationPort, containerType]);

  // ─── Camera positioning ─────────────────────────────────────────────
  const animateCamera = useCallback(() => {
    if (!globeRef.current || !originCoords || !destCoords) return;

    const midLat = (originCoords[0] + destCoords[0]) / 2;
    const midLng = (originCoords[1] + destCoords[1]) / 2;
    const dist = haversineDistance(
      originCoords[0],
      originCoords[1],
      destCoords[0],
      destCoords[1]
    );
    const altitude = getAltitude(dist);

    globeRef.current.pointOfView(
      { lat: midLat, lng: midLng, altitude },
      1200
    );
  }, [originCoords, destCoords]);

  useEffect(() => {
    if (globeReady && hasRoute) {
      animateCamera();
    }
  }, [globeReady, hasRoute, animateCamera]);

  useEffect(() => {
    if (globeReady && globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = false;
        controls.enableZoom = false;
      }
    }
  }, [globeReady]);

  useEffect(() => {
    if (globeReady && globeRef.current && !hasRoute) {
      globeRef.current.pointOfView({ lat: 25, lng: -80, altitude: 2.0 }, 0);
    }
  }, [globeReady, hasRoute]);

  const globeHeight = Math.round(globeWidth * 0.83);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-black ${className}`}
      role="img"
      aria-label="Shipping route visualization"
    >
      <GlobeGL
        ref={globeRef}
        onGlobeReady={() => setGlobeReady(true)}
        width={globeWidth}
        height={globeHeight}
        backgroundColor="rgba(0,0,0,0)"
        showGlobe={true}
        showAtmosphere={false}
        polygonsData={polygonData}
        polygonCapColor={() => LAND_COLOR}
        polygonSideColor={() => LAND_SIDE_COLOR}
        polygonStrokeColor={() => BORDER_COLOR}
        polygonAltitude={0.005}
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
        labelDotRadius={0.4}
        labelResolution={2}
        enablePointerInteraction={true}
        animateIn={true}
      />

      {hasRoute && (
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5" aria-hidden="true">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Live Route Analysis
          </span>
        </div>
      )}
    </div>
  );
}
