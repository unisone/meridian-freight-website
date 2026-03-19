# PRD: Micro-Interactions & Animations — V2

**Project:** Meridian Freight Website
**Status:** DRAFT — Awaiting Approval
**Date:** 2026-03-18
**Version:** 2.0 (post elite UI/UX review)
**Scope:** 30 animation features across 26 files, 5 phases

---

## Executive Summary

Add purposeful micro-interactions across all pages. Currently only the homepage has scroll animations (via `ScrollReveal`). All 7 sub-pages are completely static.

**V2 changes from V1:**
- Hero stays Server Component (CSS-only animations) — protects LCP
- Custom easing curves (Stripe-inspired, not Material Design defaults)
- Scroll-linked process timeline via `useScroll`
- Calculator wizard step transitions added (was ZERO)
- Pulse rings removed from hero CTA (SaaS slop), replaced with shadow-breathe
- Scroll progress indicator added
- Hero text uses clip-path reveal (industrial precision feel)
- Mobile: tap feedback, shorter delays, larger scroll thresholds
- `tabular-nums` on all animated counters
- Exit animations specified for all popups

**Zero new dependencies. Zero new packages.**

---

## 1. Motion Philosophy

**Weighted. Directional. Precise. Purposeful. Restrained.**

Meridian Freight moves heavy machinery across oceans. Animations reflect that:
- **Weighted** — Elements settle with deceleration, like a container on a dock
- **Directional** — Left→right for progress, bottom→up for arrival
- **Precise** — Clean mechanical timing, no wobble or overshoot
- **Purposeful** — Every animation communicates something
- **Restrained** — If you notice it, it's too much

### Anti-Slop List (Banned Patterns)
- ~~Floating particles / abstract geometry~~
- ~~Gradient border glow animations~~
- ~~Typewriter text effects~~
- ~~Blob/morph backgrounds~~
- ~~Glassmorphism / frosted cards~~
- ~~Infinite marquee scrollers~~
- ~~Cursor trail effects~~
- ~~Parallax on every section~~
- ~~3D card tilts on hover~~
- ~~Bouncy spring physics~~
- ~~Pulse rings on primary CTAs~~ (V2: identified as SaaS slop)
- ~~Idle animations on fixed-position buttons~~ (V2: creates visual noise)

### Motion Tokens

**CSS Custom Properties** (merged into existing `:root`):

```css
:root {
  /* Durations */
  --duration-instant: 75ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-entrance: 500ms;
  --duration-slow: 800ms;

  /* Easings — Stripe-inspired, NOT Material Design defaults */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --ease-decelerate: cubic-bezier(0.0, 0.0, 0.15, 1.0);      /* Tighter settle than Material's 0.2 */
  --ease-accelerate: cubic-bezier(0.4, 0.0, 1.0, 1.0);
  --ease-emphasis: cubic-bezier(0.16, 1.0, 0.3, 1.0);        /* Hero entrance — dramatic settle */
  --ease-interactive: cubic-bezier(0.25, 1.0, 0.5, 1.0);     /* Card hover — Stripe's card curve */
}
```

**TypeScript Constants** (`lib/motion.ts`):

```ts
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
} as const;

export const STAGGER = {
  grid: 0.06,
  list: 0.04,
  section: 0.12,
} as const;
```

**Why 5 curves instead of 3:** Stripe uses 5+ distinct curves — buttons feel different from cards feel different from navigation. Material Design's 3 generic curves read as template. The `emphasis` curve has steep initial acceleration for hero-level drama. The `interactive` curve gives cards a snappy-then-gentle-settle feel (the Stripe `scale: 1.018` hover curve).

---

## 2. Accessibility

**Every** animation must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus a `useReducedMotion()` hook for motion components.

---

## Phase 1: Foundation

### 1.1 — `app/globals.css` — Tokens + Keyframes + Utilities

Merge motion tokens into existing `:root` block. Add keyframes and utilities after `@layer base`:

```css
/* ─── Keyframes ──────────────────────────────────────── */
@keyframes text-reveal {
  from { clip-path: inset(0 0 100% 0); transform: translateY(8px); }
  to   { clip-path: inset(0 0 0% 0); transform: translateY(0); }
}

@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-right-fade {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes shadow-breathe {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  50%      { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.08); }
}

@keyframes pulse-ring {
  0%   { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes pulse-ring-outer {
  0%   { transform: scale(1); opacity: 0.2; }
  100% { transform: scale(1.9); opacity: 0; }
}

@keyframes nudge-right {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(4px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-3px); }
  40%      { transform: translateX(3px); }
  60%      { transform: translateX(-3px); }
  80%      { transform: translateX(3px); }
}

@keyframes draw-check {
  0%   { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}

/* ─── Utility classes ────────────────────────────────── */
@layer utilities {
  .link-underline {
    background-image: linear-gradient(currentColor, currentColor);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 1px;
    transition: background-size var(--duration-normal) var(--ease-default);
  }
  .link-underline:hover {
    background-size: 100% 1px;
  }

  /* Hero text reveal — industrial "printing from below" */
  .animate-text-reveal {
    animation: text-reveal var(--duration-entrance) var(--ease-emphasis) both;
  }
  .animate-slide-up {
    animation: slide-up-fade var(--duration-entrance) var(--ease-decelerate) both;
  }
  .animate-slide-right {
    animation: slide-right-fade var(--duration-entrance) var(--ease-decelerate) both;
  }
  .animate-fade-in {
    animation: fade-in var(--duration-entrance) var(--ease-decelerate) both;
  }
  .animate-shadow-breathe {
    animation: shadow-breathe 5s ease-in-out infinite;
  }
  .animate-pulse-ring {
    animation: pulse-ring 3s var(--ease-decelerate) infinite;
  }
  .animate-pulse-ring-outer {
    animation: pulse-ring-outer 3s var(--ease-decelerate) 0.2s infinite;
  }
  .animate-nudge-right {
    animation: nudge-right 3s var(--ease-decelerate) infinite;
  }
  .animate-shake {
    animation: shake var(--duration-normal) var(--ease-default);
  }
}
```

**V2 change:** Added `text-reveal` clip-path keyframe, `shadow-breathe` (replaces pulse rings on hero CTA), removed `subtle-pulse` (was WhatsApp idle animation — now banned as noise).

---

### 1.2 — `lib/motion.ts` — NEW FILE

As shown in §1 Motion Tokens above.

---

### 1.3 — `hooks/use-reduced-motion.ts` — NEW FILE

```ts
"use client";
import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```

---

### 1.4 — `hooks/use-count-up.ts` — NEW FILE

```ts
"use client";
import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  enabled?: boolean;
}

export function useCountUp({ end, duration = 0.8, enabled = true }: UseCountUpOptions): number {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled || hasRun.current) return;
    hasRun.current = true;
    const durationMs = duration * 1000;
    let start: number | null = null;

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic decelerate
      setValue(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [enabled, end, duration]);

  return value;
}
```

---

### 1.5 — `hooks/use-scroll-direction.ts` — NEW FILE

```ts
"use client";
import { useState, useEffect, useRef } from "react";

export function useScrollDirection(): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      // V2: 15px dead zone (up from 5px) to prevent flicker on mobile touch scroll
      if (y > lastY.current + 15) setDirection("down");
      else if (y < lastY.current - 15) setDirection("up");
      lastY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}
```

**V2 change:** Dead zone increased from 5px to 15px to prevent flicker on mobile touch scrolling.

---

### 1.6 — `components/scroll-progress.tsx` — NEW FILE (V2 addition)

```ts
"use client";
import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-sky-500"
    />
  );
}
```

Add in `app/layout.tsx` above `<Header />`. 10 lines, enormous UX payoff on a long-scroll page. Users can see page depth and their position.

---

### 1.7 — `components/ui/button.tsx` — Tactile Press

Add `active:scale-[0.98]` to the CVA base string (line 9):

```diff
- active:translate-y-px
+ active:translate-y-px active:scale-[0.98]
```

---

### 1.8 — `components/ui/input.tsx` — Smooth Focus

Replace `transition-colors` with animated box-shadow:

```diff
- transition-colors
+ transition-[color,border-color,box-shadow] duration-150
```

---

### 1.9 — `components/scroll-reveal.tsx` — Variant System

Rewrite with variant support + improved easing + backward compat:

```tsx
"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";

type RevealVariant = "slide-up" | "slide-left" | "slide-right" | "fade" | "scale";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  variant?: RevealVariant;
  margin?: string;
}

const variantConfig: Record<RevealVariant, { initial: object; animate: object }> = {
  "slide-up":    { initial: { opacity: 0, y: 20 },  animate: { opacity: 1, y: 0 } },
  "slide-left":  { initial: { opacity: 0, x: 20 },  animate: { opacity: 1, x: 0 } },
  "slide-right": { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
  "fade":        { initial: { opacity: 0 },          animate: { opacity: 1 } },
  "scale":       { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 } },
};

const directionToVariant: Record<string, RevealVariant> = {
  up: "slide-up", down: "slide-up", left: "slide-left", right: "slide-right",
};

export function ScrollReveal({
  children, className, delay = 0, direction, variant, margin = "-60px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin });
  const resolved = variant ?? (direction ? directionToVariant[direction] : "slide-up");
  const config = variantConfig[resolved];

  return (
    <motion.div
      ref={ref}
      initial={config.initial}
      animate={isInView ? config.animate : undefined}
      transition={{ duration: DURATION.entrance, delay, ease: EASE.decelerate }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children, index, className, variant = "slide-up",
}: {
  children: React.ReactNode; index: number; className?: string; variant?: RevealVariant;
}) {
  return (
    <ScrollReveal delay={index * STAGGER.grid} variant={variant} className={className}>
      {children}
    </ScrollReveal>
  );
}
```

---

## Phase 2: Navigation

### 2.1 — `components/header.tsx`

**Change 1 — Smooth backdrop blur on scroll** (line 43):
```tsx
className={`fixed top-0 w-full z-50 transition-all duration-300 ${
  isScrolled
    ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/50"
    : "bg-white"
}`}
```

**Change 2 — Nav link underlines** (lines 85, 129): Add `link-underline` class.

**Change 3 — Chevron duration** (line 91): Add `duration-300`.

**Change 4 — Dropdown animation**: Replace conditional render with `AnimatePresence` + staggered children using `EASE.decelerate`.

**Change 5 — Mobile sheet stagger**: Wrap nav items in `motion.div` with `delay: idx * 0.04`.

*Exact code in V1 PRD §2.1 — unchanged except easing references now use the V2 `EASE.decelerate`.*

---

## Phase 3: Homepage

### 3.1 — `components/hero.tsx` — CSS-Only Entrance (V2: SERVER COMPONENT)

**V2 CRITICAL CHANGE:** Hero stays a Server Component. No `"use client"`, no `motion.div`. This protects LCP — the hero contains the priority image.

**Implementation:** Pure CSS `@keyframes` with `animation-delay` via inline styles:

```tsx
// hero.tsx — STAYS SERVER COMPONENT (no "use client")
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative bg-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div>
            {/* V2: Clip-path text reveal — industrial "printing from below" */}
            <p
              style={{ animationDelay: "0s" }}
              className="animate-text-reveal text-xs font-medium uppercase tracking-wider text-sky-500 sm:text-sm"
            >
              All-In-One Machinery Export
            </p>

            <h1
              style={{ animationDelay: "0.15s" }}
              className="animate-text-reveal mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl leading-tight"
            >
              From Seller to Port — We Handle Everything
            </h1>

            <p
              style={{ animationDelay: "0.3s" }}
              className="animate-fade-in mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
            >
              One company for the entire chain: equipment pickup, professional
              dismantling, secure packing, export documentation, and worldwide
              shipping. No coordination headaches.
            </p>

            <p
              style={{ animationDelay: "0.35s" }}
              className="animate-fade-in mt-2 text-sm text-slate-500"
            >
              Serving buyers in Latin America, Africa, the Middle East &amp; Central Asia
            </p>

            {/* CTAs — V2: shadow-breathe replaces pulse-rings (anti-slop) */}
            <div
              style={{ animationDelay: "0.5s" }}
              className="animate-slide-up mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4"
            >
              <Button
                size="lg"
                className="h-13 w-full px-7 text-base font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:shadow-lg animate-shadow-breathe sm:w-auto"
                render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Get a Quote on WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full px-7 text-base font-semibold rounded-lg border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 transition-all sm:w-auto"
                render={<Link href="/pricing/calculator" />}
              >
                Get Instant Estimate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image — fade in, no slide (images shouldn't fly in) */}
          <div
            style={{ animationDelay: "0.6s" }}
            className="animate-fade-in relative"
          >
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image ... priority ... />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**V2 differences from V1:**
- Server Component (no `"use client"`, no motion import)
- Heading uses `animate-text-reveal` (clip-path) instead of fade — more industrial
- Description uses `animate-fade-in` — no slide (simpler)
- Timing spread widened to 600ms total (0, 0.15, 0.3, 0.35, 0.5, 0.6)
- WhatsApp button uses `animate-shadow-breathe` (subtle emerald glow) instead of pulse rings
- Image uses `animate-fade-in` with no translate (images shouldn't fly in)

---

### 3.2 — `components/trust-bar.tsx` — Counter Animation

Convert to Client Component (required for `useCountUp` + `useInView`).

**V2 addition:** `tabular-nums` on stat display to prevent layout jitter during counting:

```tsx
<p className={`text-sm font-medium text-slate-700 ${item.value !== null ? "font-mono tabular-nums" : ""}`}>
```

*Full implementation same as V1 PRD §3.2.*

---

### 3.3 — `components/services-grid.tsx` — Stagger + Hover

Same as V1 except:

**V2 change on icon hover** — subtler than V1's full color swap:

```diff
- bg-sky-100 text-sky-500 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110
+ bg-sky-100 text-sky-500 transition-all duration-300 group-hover:bg-sky-200 group-hover:text-sky-600 group-hover:scale-110 group-hover:shadow-sm
```

**Why:** The V1 `bg-sky-500 text-white` swap is a large visual jump that reads as a state change rather than hover preview. The V2 version is subtler — slight darkening, not a full transformation. (Stripe's card hover uses ~1.8% scale with shadow change, not color swap.)

**V2 addition on "Learn More" link** — add `link-underline`:

```diff
- <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-500 transition-colors group-hover:text-sky-600">
+ <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-500 transition-colors group-hover:text-sky-600 link-underline">
```

---

### 3.4 — `components/process-steps.tsx` — Scroll-Linked Timeline (V2)

**V2 CRITICAL CHANGE:** The connecting line uses `useScroll` + `useTransform` instead of timed `scaleX`. The line progresses proportionally as the user scrolls through the section — physically connected to scroll, not a disconnected animation.

```tsx
"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { DURATION, EASE } from "@/lib/motion";
// ...existing icon imports

export function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Scroll-linked line progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: DURATION.entrance, ease: EASE.decelerate }}
          className="mb-12 text-center sm:mb-16"
        >
          {/* ...existing header unchanged... */}
        </motion.div>

        <div ref={sectionRef} className="relative">
          {/* Desktop line — scroll-linked */}
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: "left" }}
            className="absolute left-0 right-0 top-16 hidden h-0.5 bg-sky-200 lg:block"
          />

          <div className="grid gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: DURATION.entrance,
                  delay: 0.2 + idx * 0.25,
                  ease: EASE.decelerate,
                }}
                className="relative flex lg:flex-col lg:items-center lg:text-center"
              >
                {/* Mobile vertical line — timed (scroll-link not practical on mobile) */}
                {step.number < 4 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : undefined}
                    transition={{
                      duration: DURATION.slow,
                      delay: 0.4 + idx * 0.25,
                      ease: EASE.decelerate,
                    }}
                    style={{ transformOrigin: "top" }}
                    className="absolute left-6 top-16 h-full w-0.5 bg-sky-200 lg:hidden"
                  />
                )}

                {/* Number circle — scale entrance */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : undefined}
                  transition={{
                    duration: DURATION.normal,
                    delay: 0.15 + idx * 0.25,
                    ease: EASE.decelerate,
                  }}
                  className="relative z-10 mr-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white shadow-lg lg:mr-0 lg:mb-6"
                >
                  {step.number}
                </motion.div>

                {/* Content — unchanged */}
                <div className="pb-8 lg:pb-0">
                  {/* ...same as original... */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

### 3.5 — `components/project-grid.tsx` — Stagger + Depth (V2)

**V2 additions:**

Card depth effect — add `hover:-translate-y-0.5` and `transition-all`:
```diff
- className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
+ className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
```

Cinematic image zoom — slower, reduced scale:
```diff
- className="object-cover transition-transform duration-300 group-hover:scale-105"
+ className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
```

"View all projects" link — add `link-underline`:
```diff
- className="inline-flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600 transition-colors"
+ className="inline-flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600 transition-colors link-underline"
```

Mobile tap feedback on cards:
```diff
- className="group overflow-hidden rounded-xl ...
+ className="group overflow-hidden rounded-xl ... active:scale-[0.99]
```

---

### 3.6 — `components/video-section.tsx` — Pulse Rings on Play Button

Same as V1 — pulse rings stay on the play button (contextually appropriate for "press play"). Two `<span>` elements with `animate-pulse-ring` and `animate-pulse-ring-outer`.

**V2 addition:** "Watch More Videos" link gets `link-underline`:
```diff
- className="inline-flex items-center gap-2 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-600"
+ className="inline-flex items-center gap-2 text-sm font-semibold text-sky-500 transition-colors hover:text-sky-600 link-underline"
```

---

### 3.7 — `app/page.tsx` — ScrollReveal Cleanup + CTA Animations

Remove `<ScrollReveal>` from components that now self-animate (ServicesGrid, ProcessSteps, ProjectGrid). Keep/add for CTAs and remaining sections.

**Calculator CTA** — individual staggered elements instead of single `ScrollReveal variant="fade"`:

```tsx
<ScrollReveal variant="scale">
  <section className="bg-slate-900 py-12 sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
      <BarChart3 className="mx-auto h-8 w-8 text-sky-400" />
      <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
        Estimate Your Freight Cost in 60 Seconds
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-300">
        Select your equipment and destination — get an instant cost estimate.
      </p>
      <Button ...>
        Open Calculator
        <ArrowRight className="ml-2 h-4 w-4 animate-nudge-right" />
      </Button>
    </div>
  </section>
</ScrollReveal>
```

---

## Phase 4: Interactive Components

### 4.1 — `components/contact-form.tsx` — AnimatePresence + Error Shake

Wrap form/success in `AnimatePresence mode="wait"`. Success state has SVG checkmark with `draw-check` animation. Error triggers `animate-shake` on button.

**V2 addition:** Dim entire form during submission:

```tsx
<motion.form
  key="form"
  exit={{ opacity: 0 }}
  transition={{ duration: DURATION.fast }}
  onSubmit={handleSubmit}
  className={`space-y-5 transition-opacity ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}
>
```

**V2 addition:** Error message fades in instead of popping:
```tsx
{error && (
  <motion.p
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: DURATION.fast }}
    className="mt-2 text-center text-sm text-red-600"
  >
    {error}
  </motion.p>
)}
```

---

### 4.2 — Calculator Wizard Step Transitions (V2: NEW — was missing)

**This was the biggest gap in V1.** The calculator is the most complex interactive component and had zero transition animations.

In `calculator-wizard.tsx`, the three sections (Equipment, Specs, Route) are always visible but disabled via `opacity-40 pointer-events-none`. We DON'T add AnimatePresence between steps since they're always rendered — instead, we animate the **enabled/disabled state transition**:

```diff
- className={!selectedEquipment ? "pointer-events-none opacity-40" : ""}
+ className={`transition-all duration-300 ${!selectedEquipment ? "pointer-events-none opacity-40 translate-y-2" : "opacity-100 translate-y-0"}`}
```

And for Section 03:
```diff
- className={!step2Done ? "pointer-events-none opacity-40" : ""}
+ className={`transition-all duration-300 ${!step2Done ? "pointer-events-none opacity-40 translate-y-2" : "opacity-100 translate-y-0"}`}
```

This makes each section "settle into place" as it becomes active — sliding up 8px and fading from 40% to 100% opacity. The `duration-300` matches our interactive duration token.

Equipment list selection:
```diff
- className={`... transition-colors ${
+ className={`... transition-all duration-150 ${
```

---

### 4.3 — `components/freight-calculator/calculator-estimate-card.tsx` — Price Morphing

When the estimate changes (different equipment/destination), the dollar amount should count from old→new, not hard-swap.

This requires tracking the previous value:
```tsx
const [displayTotal, setDisplayTotal] = useState(0);
const prevTotal = useRef(0);

useEffect(() => {
  if (!preview) return;
  const target = preview.estimatedTotal;
  if (target === prevTotal.current) return;
  // Animate from old to new
  const from = prevTotal.current;
  prevTotal.current = target;
  const duration = 300;
  const start = performance.now();

  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    setDisplayTotal(Math.round(from + (target - from) * eased));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}, [preview]);
```

Display: `{formatDollar(displayTotal)}` instead of `{formatDollar(preview.estimatedTotal)}`.

---

### 4.4 — FAQ Accordion — Already Animated

No changes. The `@base-ui/react` accordion already has `animate-accordion-down/up` height transitions.

---

## Phase 5: Sub-Pages & Polish

### 5.1 — Add ScrollReveal to All Sub-Pages

**Every sub-page currently has zero scroll animations.** Add `ScrollReveal` wrappers:

| Page | Sections to Wrap |
|------|-----------------|
| `about/page.tsx` | Header (fade), differentiator cards (StaggerItem), warehouse section (slide-up), CTA (fade) |
| `services/page.tsx` | CTA section (fade) — ServicesGrid/ProcessSteps self-animate |
| `services/[slug]/page.tsx` | Hero header (fade), feature badges (StaggerItem), related cards (StaggerItem), CTA (fade) |
| `projects/page.tsx` | CTA (fade) — ProjectGrid self-animates |
| `pricing/page.tsx` | "Instant estimate" box (fade), CTA (fade) |
| `faq/page.tsx` | CTA (fade) |
| `contact/page.tsx` | Header (fade), form column (slide-left), info column (slide-right) |

---

### 5.2 — `components/whatsapp-widget.tsx` — Entrance Only (V2: no idle pulse)

**V2 changes from V1:**
- Entrance delay reduced from `1.5s` to `0.8s` (1.5s too long — mobile users need the CTA visible)
- **Removed `animate-subtle-pulse`** — idle animations on fixed-position elements create visual noise, undermine trust
- Chat popup wrapped in `AnimatePresence` so exit animation fires (V1 had conditional render without AnimatePresence — exit never animated)

```tsx
<motion.button
  initial={{ y: 30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: DURATION.entrance, delay: 0.8, ease: EASE.decelerate }}
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all hover:bg-emerald-700 hover:scale-110 active:scale-95 lg:bottom-6 lg:right-6 sm:h-16 sm:w-16"
  aria-label="Open WhatsApp chat"
>
  <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
</motion.button>

<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: DURATION.normal, ease: EASE.decelerate }}
      className="fixed bottom-36 right-4 z-50 ..."
    >
      {/* ...popup content unchanged... */}
    </motion.div>
  )}
</AnimatePresence>
```

---

### 5.3 — `components/cookie-consent.tsx` — CSS Slide Transition

Always render, toggle visibility via CSS transition instead of `if (!show) return null`:

```tsx
return (
  <div className={`fixed bottom-16 ... transition-all duration-300 ${
    show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
  }`}>
    {/* ...unchanged... */}
  </div>
);
```

---

### 5.4 — `components/mobile-bottom-bar.tsx` — Scroll-Aware Hide

Use `useScrollDirection` (V2: 15px dead zone) to toggle `translate-y-full`:

```tsx
const scrollDir = useScrollDirection();
// ...
className={`... transition-transform duration-300 ${
  scrollDir === "down" ? "translate-y-full" : "translate-y-0"
}`}
```

---

### 5.5 — `components/footer.tsx` — Link Underlines

Add `link-underline` to Quick Links, Services, and Legal links.

---

### 5.6 — Mobile Tap Feedback (V2 addition)

Add `active:scale-[0.98]` or `active:bg-slate-50` to all tappable card-like elements that currently have only hover states:

| Component | Element | Add |
|-----------|---------|-----|
| `services-grid.tsx` | Card `<Link>` | `active:scale-[0.99]` |
| `project-grid.tsx` | Card `<article>` | `active:scale-[0.99]` |
| `contact-info.tsx` | Contact cards | `active:bg-slate-100` |
| `footer.tsx` | Social icons | Already has scale via hover |

---

## File Change Matrix (V2)

| # | File | Phase | Type | Est. Lines |
|---|------|-------|------|-----------|
| 1 | `app/globals.css` | 1 | Edit — tokens, keyframes, utilities | +70 |
| 2 | `lib/motion.ts` | 1 | **NEW** | +22 |
| 3 | `hooks/use-reduced-motion.ts` | 1 | **NEW** | +15 |
| 4 | `hooks/use-count-up.ts` | 1 | **NEW** | +30 |
| 5 | `hooks/use-scroll-direction.ts` | 1 | **NEW** | +20 |
| 6 | `components/scroll-progress.tsx` | 1 | **NEW** | +12 |
| 7 | `components/ui/button.tsx` | 1 | Edit — 1 class addition | +1 word |
| 8 | `components/ui/input.tsx` | 1 | Edit — transition property | +2 words |
| 9 | `components/scroll-reveal.tsx` | 1 | Rewrite — variant system | ~70 lines |
| 10 | `components/header.tsx` | 2 | Edit — blur, dropdown, stagger | ~40 lines |
| 11 | `components/hero.tsx` | 3 | Edit — CSS animation classes | ~15 lines changed |
| 12 | `components/trust-bar.tsx` | 3 | Rewrite — client, counter | ~50 lines |
| 13 | `components/services-grid.tsx` | 3 | Edit — StaggerItem, hover | ~12 lines |
| 14 | `components/process-steps.tsx` | 3 | Rewrite — client, scroll-linked | ~80 lines |
| 15 | `components/project-grid.tsx` | 3 | Edit — StaggerItem, depth | ~12 lines |
| 16 | `components/video-section.tsx` | 3 | Edit — pulse rings | +5 lines |
| 17 | `app/page.tsx` | 3 | Edit — ScrollReveal cleanup | ~12 lines |
| 18 | `components/contact-form.tsx` | 4 | Edit — AnimatePresence | ~25 lines |
| 19 | `components/freight-calculator/calculator-wizard.tsx` | 4 | Edit — step transitions | ~8 lines |
| 20 | `components/freight-calculator/calculator-estimate-card.tsx` | 4 | Edit — price morph | ~20 lines |
| 21 | `components/whatsapp-widget.tsx` | 5 | Edit — entrance, AnimatePresence | ~12 lines |
| 22 | `components/cookie-consent.tsx` | 5 | Edit — CSS slide | ~5 lines |
| 23 | `components/mobile-bottom-bar.tsx` | 5 | Edit — scroll-hide | ~5 lines |
| 24 | `components/footer.tsx` | 5 | Edit — link-underline | ~6 lines |
| 25-31 | 7 sub-page files | 5 | Edit — ScrollReveal wrappers | ~5-15 lines each |
| 32 | `app/layout.tsx` | 1 | Edit — add ScrollProgress | +2 lines |

**Total: 6 new files, 26 modified files, ~350 net new lines**

---

## Performance & Accessibility (V2)

### Performance
- **LCP protected:** Hero stays Server Component with CSS-only animations
- **New JS:** ~3KB gzipped (4 hooks + motion constants)
- **New CSS:** ~2.5KB (keyframes + utilities)
- **GPU-only:** All animations use `transform` + `opacity`
- **Max IntersectionObservers per page:** ~8 (homepage). Documented ceiling: 12.
- **`tabular-nums`** on all animated numbers prevents layout jitter

### Accessibility
- `prefers-reduced-motion: reduce` kills all durations globally
- `useReducedMotion` hook available for motion components
- All ARIA attributes preserved
- Keyboard navigation unaffected
- Focus rings still visible (instant instead of animated)
- Screen reader announcements (`aria-live`) preserved

---

## Testing Checklist

### Phase 1
- [ ] Motion tokens in `:root` (dev tools)
- [ ] `prefers-reduced-motion` disables all animation (dev tools toggle)
- [ ] Button press: visible scale-down on click
- [ ] Input focus: ring animates in smoothly
- [ ] Scroll progress bar visible and tracks scroll position

### Phase 2
- [ ] Header: smooth blur transition on scroll
- [ ] Nav links: underline slides in on hover
- [ ] Dropdown: items stagger in with fade
- [ ] Mobile sheet: nav items stagger in
- [ ] Chevron: smooth 300ms rotation

### Phase 3
- [ ] Hero: text reveals with clip-path (not generic fade)
- [ ] Hero: WhatsApp button has subtle shadow-breathe (NOT pulse rings)
- [ ] Hero: timing spread ~600ms total (not all at once)
- [ ] Hero: LCP not regressed (Lighthouse check)
- [ ] Trust bar: numbers count up on scroll
- [ ] Trust bar: `tabular-nums` — no layout jitter during count
- [ ] Service cards: stagger in reading order
- [ ] Service cards: icon hover is subtle (not full color swap)
- [ ] Process steps: desktop line progresses with scroll
- [ ] Process steps: steps reveal sequentially
- [ ] Project cards: slower image zoom (700ms), card lifts on hover
- [ ] Video: play button has pulse rings

### Phase 4
- [ ] Contact form: cross-fades to success with SVG checkmark
- [ ] Contact form: error triggers button shake
- [ ] Contact form: form dims during submission
- [ ] Calculator: sections slide into place when enabled
- [ ] Calculator: estimate price morphs between values (not hard-swap)

### Phase 5
- [ ] All 7 sub-pages have scroll animations
- [ ] WhatsApp: slides up after 0.8s (not 1.5s)
- [ ] WhatsApp: popup has exit animation (not instant disappear)
- [ ] WhatsApp: NO idle pulse on the floating button
- [ ] Cookie consent: slides up from bottom
- [ ] Mobile bar: hides on scroll down, shows on scroll up
- [ ] Mobile bar: no flicker during touch scrolling
- [ ] Footer: links have sliding underline
- [ ] Cards: tap feedback on mobile

### Cross-Cutting
- [ ] CLS = 0 (no layout shifts from animations)
- [ ] Chrome, Safari, Firefox verified
- [ ] `prefers-reduced-motion` verified
- [ ] Mobile performance acceptable (throttled device)
- [ ] No hydration errors

---

## Out of Scope

- Page-to-page transitions (View Transitions API available in Next.js 16 but adds complexity — revisit later)
- Parallax scrolling (too distracting for B2B)
- Skeleton loading states (not needed yet)
- Canvas/WebGL effects (route globe covers 3D)
- Sound effects
- Scroll-linked color changes
- Logo marquee (would require partner logos — content dependency)
- Section-aware nav highlighting (good idea but separate feature)
