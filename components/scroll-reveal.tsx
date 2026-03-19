"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

type RevealVariant = "slide-up" | "slide-left" | "slide-right" | "fade" | "scale";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  /** Legacy direction prop (backward compat) */
  direction?: "up" | "down" | "left" | "right";
  /** Animation variant */
  variant?: RevealVariant;
  /** Viewport margin for triggering (default: "-60px") */
  margin?: string;
}

const variantConfig = {
  "slide-up":    { initial: { opacity: 0, y: 20 },       animate: { opacity: 1, y: 0 } },
  "slide-left":  { initial: { opacity: 0, x: 20 },       animate: { opacity: 1, x: 0 } },
  "slide-right": { initial: { opacity: 0, x: -20 },      animate: { opacity: 1, x: 0 } },
  "fade":        { initial: { opacity: 0 },               animate: { opacity: 1 } },
  "scale":       { initial: { opacity: 0, scale: 0.97 },  animate: { opacity: 1, scale: 1 } },
} as const;

const directionToVariant: Record<string, RevealVariant> = {
  up: "slide-up",
  down: "slide-up",
  left: "slide-left",
  right: "slide-right",
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction,
  variant,
  margin = "-60px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion's MarginType is not exported
  const isInView = useInView(ref, { once: true, margin: margin as any });

  const resolved = variant ?? (direction ? directionToVariant[direction] : "slide-up");
  const config = variantConfig[resolved];

  return (
    <motion.div
      ref={ref}
      initial={config.initial}
      animate={isInView ? config.animate : undefined}
      transition={{
        duration: DURATION.entrance,
        delay,
        ease: EASE.decelerate,
      }}
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
  variant = "slide-up",
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
  variant?: RevealVariant;
}) {
  return (
    <ScrollReveal delay={index * STAGGER.grid} variant={variant} className={className}>
      {children}
    </ScrollReveal>
  );
}
