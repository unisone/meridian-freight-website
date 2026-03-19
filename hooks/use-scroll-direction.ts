"use client";

import { useState, useEffect, useRef } from "react";

/** Returns "up" or "down" based on scroll direction. 15px dead zone prevents mobile flicker. */
export function useScrollDirection(): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      if (y > lastY.current + 15) setDirection("down");
      else if (y < lastY.current - 15) setDirection("up");
      lastY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}
