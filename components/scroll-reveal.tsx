"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  /** Direction to animate from */
  direction?: "up" | "down" | "left" | "right";
}

const offsets = {
  up: { y: 15, x: 0 },
  down: { y: -15, x: 0 },
  left: { x: 15, y: 0 },
  right: { x: -15, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const offset = offsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wrapper for grid items with staggered animation.
 * Use around each card in a grid.
 */
export function StaggerItem({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <ScrollReveal delay={index * 0.05} className={className}>
      {children}
    </ScrollReveal>
  );
}
