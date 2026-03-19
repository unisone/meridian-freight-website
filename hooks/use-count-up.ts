"use client";

import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number; // seconds, default 0.8
  enabled?: boolean; // trigger the animation
}

/** Animates a number from 0 to `end` using requestAnimationFrame. */
export function useCountUp({
  end,
  duration = 0.8,
  enabled = true,
}: UseCountUpOptions): number {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled || hasRun.current) return;
    hasRun.current = true;

    const durationMs = duration * 1000;
    let start: number | null = null;

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // Cubic decelerate easing: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [enabled, end, duration]);

  return value;
}
