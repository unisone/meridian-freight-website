"use client";

import { motion, useScroll } from "motion/react";

/** Thin progress bar at the top of the viewport that fills as the user scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-primary"
    />
  );
}
