"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { resolveCoordinates, PORT_COORDINATES } from "./port-coordinates";

// Dynamic import — react-globe.gl uses Three.js/WebGL, no SSR
const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────
interface RouteGlobeProps {
  originPort: string | null;
  destinationPort: string | null;
  destinationCountry: string | null;
  /** For 40HC: show Albion→Chicago rail segment */
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

// ─── Constants ────────────────────────────────────────────────────────────────
const ALBION_IA: [number, number] = [42.1172, -92.9835];
const CHICAGO_IL: [number, number] = [41.88, -87.63];

const EARTH_DARK_URL =
  "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg";
const EARTH_TOPO_URL =
  "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png";

// Brand color for arcs/markers (teal)
const TEAL = "rgba(0, 200, 200, 1)";
const TEAL_70 = "rgba(0, 200, 200, 0.7)";
const TEAL_40 = "rgba(0, 200, 200, 0.4)";
const TEAL_20 = "rgba(0, 200, 200, 0.2)";
const WHITE_70 = "rgba(255, 255, 255, 0.7)";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Calculate great-circle distance between two points (degrees) */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Calculate appropriate camera altitude based on route distance */
function getAltitude(distKm: number): number {
  if (distKm < 3000) return 1.4;
  if (distKm < 6000) return 1.8;
  if (distKm < 10000) return 2.2;
  return 2.8;
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
  const globeRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);

  // Resolve coordinates
  const originCoords = originPort
    ? PORT_COORDINATES[originPort] ?? null
    : null;
  const destCoords = resolveCoordinates(destinationPort, destinationCountry);
  const hasRoute = originCoords !== null && destCoords !== null;

  // ─── Build arc data ─────────────────────────────────────────────────
  const arcsData = useMemo<ArcDatum[]>(() => {
    if (!originCoords || !destCoords) return [];

    const arcs: ArcDatum[] = [];

    // Main ocean route arc (prominent)
    arcs.push({
      startLat: originCoords[0],
      startLng: originCoords[1],
      endLat: destCoords[0],
      endLng: destCoords[1],
      color: [TEAL_70, TEAL_40],
      stroke: 0.6,
      dashLength: 0.4,
      dashGap: 0.2,
      animateTime: 3000,
      label: `${originPort} → ${destinationPort}`,
    });

    // For 40HC: show Albion→Chicago rail segment
    if (containerType === "fortyhc") {
      arcs.push({
        startLat: ALBION_IA[0],
        startLng: ALBION_IA[1],
        endLat: CHICAGO_IL[0],
        endLng: CHICAGO_IL[1],
        color: [TEAL_20, TEAL_40],
        stroke: 0.3,
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
        size: 0.6,
        color: TEAL,
        label: originPort ?? "Origin",
      },
      {
        lat: destCoords[0],
        lng: destCoords[1],
        size: 0.5,
        color: TEAL_70,
        label: destinationPort ?? "Destination",
      },
    ];

    // Hub marker at Albion for 40HC
    if (containerType === "fortyhc") {
      points.push({
        lat: ALBION_IA[0],
        lng: ALBION_IA[1],
        size: 0.4,
        color: TEAL_40,
        label: "Albion, IA (packing)",
      });
    }

    return points;
  }, [
    originCoords,
    destCoords,
    originPort,
    destinationPort,
    containerType,
  ]);

  // ─── Build labels ──────────────────────────────────────────────────
  const labelsData = useMemo<LabelDatum[]>(() => {
    if (!originCoords || !destCoords) return [];

    const labels: LabelDatum[] = [
      {
        lat: originCoords[0],
        lng: originCoords[1],
        text: originPort ?? "Origin",
        color: WHITE_70,
        size: 0.7,
        altitude: 0.01,
      },
      {
        lat: destCoords[0],
        lng: destCoords[1],
        text: destinationPort ?? "Destination",
        color: WHITE_70,
        size: 0.7,
        altitude: 0.01,
      },
    ];

    return labels;
  }, [originCoords, destCoords, originPort, destinationPort]);

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

    globeRef.current.pointOfView({ lat: midLat, lng: midLng, altitude }, 1200);
  }, [originCoords, destCoords]);

  // Animate camera when route changes
  useEffect(() => {
    if (globeReady && hasRoute) {
      animateCamera();
    }
  }, [globeReady, hasRoute, animateCamera]);

  // Disable auto-rotation when globe is ready
  useEffect(() => {
    if (globeReady && globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = false;
        controls.enableZoom = false;
      }
    }
  }, [globeReady]);

  // Initial camera position (show Americas)
  useEffect(() => {
    if (globeReady && globeRef.current && !hasRoute) {
      globeRef.current.pointOfView({ lat: 25, lng: -80, altitude: 2.2 }, 0);
    }
  }, [globeReady, hasRoute]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#080a12] ${className}`}
    >
      <GlobeGL
        ref={globeRef}
        onGlobeReady={() => setGlobeReady(true)}
        width={600}
        height={500}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={EARTH_DARK_URL}
        bumpImageUrl={EARTH_TOPO_URL}
        showAtmosphere={true}
        atmosphereColor="rgba(0, 180, 180, 0.15)"
        atmosphereAltitude={0.12}
        // Arcs
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
        // Points
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"
        pointLabel="label"
        // Labels
        labelsData={labelsData}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelAltitude="altitude"
        labelDotRadius={0.3}
        labelResolution={2}
        // Interaction
        enablePointerInteraction={true}
        animateIn={true}
      />

      {/* Live route badge */}
      {hasRoute && (
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
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
