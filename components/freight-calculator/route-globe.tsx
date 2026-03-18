"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type Globe } from "cobe";
import { resolveCoordinates, PORT_COORDINATES } from "./port-coordinates";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RouteGlobeProps {
  originPort: string | null;
  destinationPort: string | null;
  destinationCountry: string | null;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEG2RAD = Math.PI / 180;
const CAMERA_LERP = 0.04;
const IDLE_ROTATION_SPEED = 0.003;
const INITIAL_THETA = 0.25;

// Theme: dark globe matching our slate-900 sidebar
const GLOBE_BASE: Omit<
  Parameters<typeof createGlobe>[1],
  "width" | "height" | "devicePixelRatio" | "phi" | "theta"
> = {
  dark: 1,
  diffuse: 1.2,
  mapSamples: 20000,
  mapBrightness: 5,
  baseColor: [0.18, 0.18, 0.22],
  markerColor: [0.1, 0.78, 0.78],
  glowColor: [0.04, 0.12, 0.18],
  arcColor: [0.1, 0.78, 0.78],
  arcWidth: 1.5,
  arcHeight: 0.3,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function RouteGlobe({
  originPort,
  destinationPort,
  destinationCountry,
  className = "",
}: RouteGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<Globe | null>(null);
  const phiRef = useRef(0);
  const targetPhiRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pointerDownRef = useRef(false);
  const pointerXRef = useRef(0);

  // Resolve coordinates
  const originCoords = originPort
    ? PORT_COORDINATES[originPort] ?? null
    : null;
  const destCoords = resolveCoordinates(
    destinationPort,
    destinationCountry
  );
  const hasRoute = originCoords !== null && destCoords !== null;

  // ─── Create globe ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const size = container.offsetWidth;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const pixelSize = size * dpr;

    canvas.width = pixelSize;
    canvas.height = pixelSize;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const globe = createGlobe(canvas, {
      width: pixelSize,
      height: pixelSize,
      devicePixelRatio: dpr,
      phi: phiRef.current,
      theta: INITIAL_THETA,
      ...GLOBE_BASE,
      markers: [],
      arcs: [],
    });

    globeRef.current = globe;

    // Animation loop
    const animate = () => {
      if (!pointerDownRef.current) {
        if (hasRoute) {
          // Lerp toward route center
          const diff = targetPhiRef.current - phiRef.current;
          phiRef.current += diff * CAMERA_LERP;
        } else {
          // Idle auto-rotation
          phiRef.current += IDLE_ROTATION_SPEED;
        }
      }
      globe.update({ phi: phiRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      globe.destroy();
      globeRef.current = null;
    };
    // Only recreate on mount — we use update() for dynamic changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Update markers & arcs when route changes ─────────────────────────
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    if (originCoords && destCoords) {
      globe.update({
        markers: [
          { location: originCoords, size: 0.07 },
          { location: destCoords, size: 0.07 },
        ],
        arcs: [{ from: originCoords, to: destCoords }],
      });

      // Animate camera to route midpoint
      const midLon = (originCoords[1] + destCoords[1]) / 2;
      targetPhiRef.current = -midLon * DEG2RAD;
    } else {
      globe.update({ markers: [], arcs: [] });
    }
  }, [originCoords, destCoords, hasRoute]);

  // ─── Pointer interaction (drag to rotate) ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      pointerDownRef.current = true;
      pointerXRef.current = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current) return;
      const dx = e.clientX - pointerXRef.current;
      pointerXRef.current = e.clientX;
      phiRef.current -= dx * 0.005;
      targetPhiRef.current = phiRef.current;
    };
    const onPointerUp = () => {
      pointerDownRef.current = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto aspect-square w-full max-w-[420px] select-none ${className}`}
    >
      {/* Ambient glow behind globe */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,200,200,0.06)_0%,transparent_70%)]" />

      {/* Cobe WebGL globe */}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Live route analysis badge */}
      {hasRoute && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Live Route Analysis Active
          </span>
        </div>
      )}
    </div>
  );
}
