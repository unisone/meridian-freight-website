// Shared motion constants for motion/react components.
// CSS uses custom properties in globals.css; JS components use these.

export const DURATION = {
  instant: 0.075,
  fast: 0.15,
  normal: 0.3,
  entrance: 0.5,
  slow: 0.8,
} as const;

export const EASE = {
  default: [0.25, 0.1, 0.25, 1.0] as const,
  decelerate: [0.0, 0.0, 0.15, 1.0] as const,
  accelerate: [0.4, 0.0, 1.0, 1.0] as const,
  emphasis: [0.16, 1.0, 0.3, 1.0] as const,
  interactive: [0.25, 1.0, 0.5, 1.0] as const,
};

export const STAGGER = {
  grid: 0.06,
  list: 0.04,
  section: 0.12,
} as const;
