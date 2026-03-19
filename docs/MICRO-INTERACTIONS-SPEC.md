# Micro-Interactions & Animation Design Spec

**Project:** Meridian Freight Website (meridianexport.com)
**Author:** Claude Code
**Status:** DRAFT — Awaiting Approval
**Date:** 2026-03-18

---

## 1. Motion Philosophy

Meridian Freight moves heavy machinery across oceans. Our animations should reflect that:

- **Weighted** — Elements feel like they have mass. No floaty/bouncy motion. Ease-out with slight deceleration, like a container settling on a dock.
- **Directional** — Motion implies movement along routes: left→right for progress, bottom→up for arrival, cascading for inventory/manifests.
- **Precise** — Clean, mechanical timing. No wobble, no overshoot. Like a well-calibrated crane.
- **Purposeful** — Every animation communicates: arrival, state change, relationship, or feedback. Zero decorative motion.
- **Restrained** — B2B buyers want confidence, not entertainment. If you notice the animation, it's too much.

### What We Will NOT Do (Anti-Slop List)
- ~~Floating particles or abstract geometric shapes~~
- ~~Gradient border glow animations~~
- ~~Typewriter text effects~~
- ~~Blob/morph backgrounds~~
- ~~Glassmorphism or frosted cards~~
- ~~Infinite marquee scrollers~~
- ~~Cursor trail effects~~
- ~~Parallax on every section~~
- ~~3D card tilts on hover~~
- ~~Bouncy spring physics (we use ease-out, not spring)~~

---

## 2. Motion Tokens (Design System)

All animations share these constants for consistency:

```
Duration:
  instant     : 75ms    — button press, toggle
  fast        : 150ms   — hover states, focus rings
  normal      : 300ms   — card transitions, dropdowns
  entrance    : 500ms   — scroll reveals, section entrance
  slow        : 800ms   — counter animations, timeline draws

Easing:
  default     : cubic-bezier(0.25, 0.1, 0.25, 1.0)   — general purpose
  decelerate  : cubic-bezier(0.0, 0.0, 0.2, 1.0)      — entering elements (arriving, settling)
  accelerate  : cubic-bezier(0.4, 0.0, 1.0, 1.0)      — exiting elements (departing)

Offset:
  slide       : 20px    — scroll reveal slide distance
  micro       : 4px     — hover nudges, icon shifts

Stagger:
  grid        : 60ms    — cards in a grid (per item)
  list        : 40ms    — items in a list (per item)
  section     : 120ms   — major sections on a page
```

---

## 3. Accessibility: `prefers-reduced-motion`

**Every** animation must respect the user's motion preference:

```css
@media (prefers-reduced-motion: reduce) {
  /* All motion becomes instant opacity fade, no transforms */
  transition-duration: 0ms !important;
  animation-duration: 0ms !important;
}
```

Implementation: A `useReducedMotion()` hook checks this at runtime. Motion components receive `duration: 0` when active. CSS transitions get a global `@media` override in `globals.css`.

---

## 4. Global Interactions (All Pages)

### 4.1 — Button Press Feedback
**Where:** Every `<Button>` across the site
**Current:** Hover color change only
**New:** Add tactile press feel

```
Hover:   translateY(-1px), shadow-md              [fast, 150ms]
Press:   scale(0.98), shadow-sm                   [instant, 75ms]
Release: scale(1.0), shadow returns               [fast, 150ms]
```

Implementation: CSS-only via Tailwind utilities on the Button component.
No JS required. Pure `active:scale-[0.98] active:shadow-sm transition-all duration-150`.

---

### 4.2 — Link Hover Underlines
**Where:** All text links in body content, footer, nav
**Current:** Color change only (`hover:text-sky-600`)
**New:** Underline slides in from left

```
Default:   No underline
Hover:     Underline slides in from left to right   [normal, 300ms]
Leave:     Underline slides out to right             [normal, 300ms]
```

Implementation: CSS `background-size` trick on a `background-image: linear-gradient(currentColor, currentColor)` — zero JS, hardware-accelerated. Applied via a utility class `.link-underline`.

---

### 4.3 — Focus Ring Transition
**Where:** All focusable elements
**Current:** Instant ring appearance on `focus-visible`
**New:** Ring fades in smoothly

```
Focus:     ring-2 ring-primary/50, opacity 0→1     [fast, 150ms]
Blur:      ring opacity 1→0                         [fast, 150ms]
```

Implementation: CSS transition on `box-shadow` (ring is box-shadow under the hood in Tailwind).

---

### 4.4 — Enhanced Scroll Reveal
**Where:** All sections wrapped in `<ScrollReveal>`
**Current:** Uniform fade-up for everything (15px slide + opacity)
**New:** Contextual reveal directions based on content type

```
Text blocks:     Fade in + slight scale (0.98→1.0), no slide         [entrance, 500ms]
Cards in grid:   Stagger left→right, top→bottom (reading order)      [entrance, 500ms, stagger 60ms]
Stats/numbers:   Slide up from below (20px)                          [entrance, 500ms]
Timeline steps:  Reveal left→right sequentially                      [entrance, 500ms, stagger 120ms]
Images:          Fade in only (no slide — images shouldn't fly in)   [entrance, 500ms]
CTAs:            Fade in last, after surrounding content              [entrance, 500ms, delay 200ms]
```

Implementation: Add `variant` prop to `ScrollReveal`: `"fade" | "slide-up" | "slide-left" | "scale" | "none"`. Update existing usage across all pages.

---

## 5. Header / Navigation

### 5.1 — Scroll-Aware Background
**Where:** `header.tsx`
**Current:** `isScrolled` adds `shadow-sm` + `border-b` (binary toggle)
**New:** Smooth transition from transparent to solid

```
Top of page:    bg-white/0, no shadow, no border
Scrolled 20px:  bg-white/95 backdrop-blur-sm, shadow-sm, border-b    [normal, 300ms]
```

Implementation: Keep `isScrolled` state, add `transition-all duration-300` to header element. Change classes to use opacity-based background.

---

### 5.2 — Nav Link Hover
**Where:** Desktop nav items in header
**Current:** `hover:text-slate-900` (color only)
**New:** Active indicator bar slides under the link

```
Hover:    2px bottom border slides in from center outward    [fast, 150ms]
Leave:    Border recedes back to center                      [fast, 150ms]
Active:   Solid 2px bottom border (no animation, just present)
```

Implementation: CSS pseudo-element `::after` with `transform: scaleX(0) → scaleX(1)`, `transform-origin: center`.

---

### 5.3 — Dropdown Menu
**Where:** Services/Pricing dropdown menus
**Current:** Instant show/hide, instant chevron rotation
**New:** Smooth expand with staggered items

```
Open:     Menu fades in + scaleY(0.97→1.0) from top         [normal, 300ms, decelerate]
          Each item fades in sequentially                     [stagger 40ms per item]
          Chevron rotates 180°                                [normal, 300ms]
Close:    Menu fades out                                      [fast, 150ms, accelerate]
          Chevron rotates back                                [normal, 300ms]
```

Implementation: Motion `AnimatePresence` + staggered children for dropdown items. CSS transition for chevron (already has rotate-180, just add `duration-300`).

---

### 5.4 — Mobile Menu (Sheet)
**Where:** Mobile hamburger → Sheet component
**Current:** Sheet slides in from right (default shadcn)
**New:** Add staggered link reveal inside the sheet

```
Open:     Sheet slides from right (keep default)
          Each nav item fades in + slides 10px from right     [stagger 40ms, decelerate]
          CTA button fades in last                            [delay 200ms]
Close:    All items fade simultaneously (no stagger on exit)  [fast, 150ms]
```

Implementation: Motion `staggerChildren` inside Sheet content.

---

## 6. Homepage Sections

### 6.1 — Hero Entrance
**Where:** `hero.tsx` — first thing users see
**Current:** Static, no entrance animation
**New:** Choreographed entrance sequence on page load

```
0ms:      Heading fades in + slides from left (20px)         [entrance, 500ms, decelerate]
100ms:    Subtitle/description fades in                       [entrance, 500ms]
200ms:    CTA buttons fade in + slide up (10px)              [entrance, 500ms]
300ms:    Hero image fades in + slides from right (20px)     [entrance, 500ms, decelerate]
```

- NOT scroll-triggered — this fires on page mount
- WhatsApp CTA button: Add subtle pulse ring (2px emerald ring expands + fades every 4s). Very subtle — opacity maxes at 0.3. Communicates "live/active channel."

Implementation: Motion `motion.div` with individual delays. Pulse via CSS `@keyframes pulse-ring`.

---

### 6.2 — Trust Bar (Stats Counter)
**Where:** `trust-bar.tsx` — stats bar below hero
**Current:** Static numbers
**New:** Numbers count up when scrolled into view

```
Trigger:   Element enters viewport (IntersectionObserver)
Animation: Number counts from 0 → target value              [slow, 800ms, decelerate]
           Suffix (+, %, "countries") fades in after count   [fast, 150ms, delay: after count]
           Icon above number does a subtle scale-in (0.9→1)  [normal, 300ms, decelerate]
```

Values to animate:
- "20+" → counts 0→20, then "+" fades in
- "50+" → counts 0→50
- "15+" → counts 0→15
- Any year values stay static (don't count from 0 to 2020)

Implementation: `useCountUp` custom hook using `requestAnimationFrame`. Runs once when `useInView` triggers.

---

### 6.3 — Services Grid
**Where:** `services-grid.tsx` — 6 service cards in 3×2 grid
**Current:** ScrollReveal fade-up + hover translate-y + border change
**New:** Enhanced entrance stagger + improved hover

**Entrance:**
```
Cards stagger in reading order (L→R, T→B)                   [entrance, 500ms, stagger 60ms]
Each card: opacity 0→1, translateY 20px→0                    [decelerate]
```

**Hover (enhanced):**
```
Current behavior kept (translate-y, shadow, border)
Add: Icon does a subtle scale pulse (1.0→1.08→1.0)          [normal, 300ms]
Add: Arrow icon slides right with decelerate easing          [fast, 150ms]
     (current is linear, feels mechanical — decelerate feels intentional)
```

---

### 6.4 — Process Steps
**Where:** `process-steps.tsx` — 4-step horizontal timeline
**Current:** ScrollReveal fade-up (all at once)
**New:** Sequential reveal like a shipment progressing through stages

```
Trigger:   Section enters viewport

Step 1:    Circle pops in (scale 0.5→1.0)                   [normal, 300ms, decelerate]
           Content fades in below                             [entrance, 500ms, delay 100ms]
           Connecting line draws toward Step 2                [slow, 800ms, decelerate]

Step 2:    Circle pops in after line reaches it               [normal, 300ms, decelerate]
           Content fades in                                   [entrance, 500ms, delay 100ms]
           Line continues to Step 3                           [slow, 800ms]

...repeat for Steps 3, 4

Total sequence: ~3.5s for all 4 steps
```

Implementation: Motion `useInView` trigger → `useAnimate` sequence with timeline. Line draw via CSS `scaleX(0→1)` with `transform-origin: left`.

On mobile (vertical layout): Same concept but vertical — line draws downward, steps reveal top-to-bottom.

---

### 6.5 — Project Grid Cards
**Where:** `project-grid.tsx`
**Current:** Image scale-105 on hover
**New:** More refined image + metadata reveal

**Hover:**
```
Image:     scale(1.0→1.04) — slightly reduced from 1.05      [slow, 800ms, decelerate]
           (slower scale = feels more cinematic, less "web template")
Shadow:    shadow-sm → shadow-lg                              [normal, 300ms]
Category badge: translateY(0) — stays put (currently static, keep it)
Metadata:  Very subtle opacity boost (0.7→1.0) on icon text  [fast, 150ms]
```

---

### 6.6 — Video Section
**Where:** `video-section.tsx`
**Current:** Play button scale-110 on hover
**New:** Concentric pulse ring on the play button

```
Idle:      Two concentric rings pulse outward every 3s        [slow, 800ms]
           Ring 1: scale 1.0→1.5, opacity 0.4→0
           Ring 2: scale 1.0→1.8, opacity 0.2→0 (200ms delay)
Hover:     Play icon scale(1.0→1.1)                           [fast, 150ms]
           Rings pulse faster (every 1.5s)
Click:     Play button scales down (0.95), thumbnail cross-fades to iframe
```

Implementation: CSS `@keyframes` for rings (two `::before`/`::after` pseudo-elements). No JS needed for the pulse.

---

### 6.7 — FAQ Accordion
**Where:** `faq-accordion.tsx`
**Current:** Default shadcn accordion (content appears, chevron rotates)
**New:** Smoother height + content reveal

```
Open:      Height animates smoothly (0→auto)                  [normal, 300ms, decelerate]
           Content fades in (opacity 0→1, slight delay)       [normal, 300ms, delay 50ms]
           Chevron rotates smoothly                           [normal, 300ms]
Close:     Content fades out first                            [fast, 150ms]
           Height collapses                                   [normal, 300ms, decelerate]
```

Note: shadcn accordion already has height animation via Radix. We just need to ensure it's smooth and add the opacity fade on content.

---

### 6.8 — CTA Bands (Mid-page & Calculator CTA)
**Where:** The two CTA sections on the homepage
**Current:** Static
**New:** Subtle entrance + button attention

```
Entrance:  Text fades in                                      [entrance, 500ms]
           Buttons stagger in (100ms apart)                   [entrance, 500ms, stagger 100ms]

Calculator CTA (dark bg):
           ArrowRight icon does a periodic nudge right         [every 3s, micro shift 4px→0px]
           Very subtle — just enough to draw the eye
```

---

## 7. Contact Form

### 7.1 — Input Focus
**Where:** `contact-form.tsx` + all input fields
**Current:** Browser default focus or basic ring
**New:** Smooth border + subtle shadow on focus

```
Focus:     Border transitions to primary color               [fast, 150ms]
           Subtle shadow glow (0 0 0 2px primary/10)         [fast, 150ms]
Blur:      Border returns to default                         [normal, 300ms]
           Shadow fades                                       [normal, 300ms]
```

Implementation: CSS transition on `border-color` and `box-shadow` in the Input component.

---

### 7.2 — Form Submission States
**Current:** Button text changes, Loader2 spinner, success screen appears
**New:** Smooth state transitions

```
Submitting:
  Button text cross-fades to "Sending..."                    [fast, 150ms]
  Spinner fades in (already has animate-spin)

Success:
  Form fields fade out as a group                            [normal, 300ms]
  Success message scales in (0.95→1.0) + fades in            [entrance, 500ms, delay 200ms]
  CheckCircle icon draws itself (SVG stroke animation)       [slow, 800ms]

Error:
  Button shakes horizontally (3px, 3 oscillations)           [normal, 300ms]
  Error message fades in below form                          [normal, 300ms]
```

Implementation: Motion `AnimatePresence` with `mode="wait"` for form↔success transition. SVG stroke animation via `stroke-dasharray` + `stroke-dashoffset`. Shake via CSS keyframes.

---

## 8. Calculator Wizard

### 8.1 — Step Transitions
**Where:** `calculator-wizard.tsx`
**Current:** Content swaps instantly between steps
**New:** Horizontal slide transition

```
Forward (Step 1→2):  Current slides out left, next slides in from right  [normal, 300ms, decelerate]
Backward (Step 2→1): Current slides out right, next slides in from left  [normal, 300ms, decelerate]
```

Implementation: Motion `AnimatePresence` with `custom` prop for direction. `mode="wait"` to prevent overlap.

---

### 8.2 — Progress Bar
**Where:** `calculator-progress-bar.tsx`
**Current:** Segments change color instantly
**New:** Segment fills with smooth transition

```
Complete:   bg-muted → bg-primary with width fill animation   [normal, 300ms, decelerate]
            Small checkmark fades in at segment end             [fast, 150ms, delay 200ms]
```

Implementation: CSS `transition-all duration-300` on segment background-color (might already work with current classes).

---

### 8.3 — Equipment Selection
**Where:** Category buttons + equipment list in Step 1
**Current:** Instant border/background change on selection
**New:** Smooth selection transition

```
Select category:    Border + ring transitions smoothly        [fast, 150ms]
                    Icon color transitions                    [fast, 150ms]
Select equipment:   Row background transitions                [fast, 150ms]
                    Subtle checkmark or highlight fades in    [fast, 150ms]
```

Implementation: CSS transitions — just add `transition-all duration-150` to the relevant elements.

---

### 8.4 — Estimate Card Price
**Where:** `calculator-estimate-card.tsx` — the big price number
**Current:** Number updates instantly
**New:** Number counter animation on change

```
Price change:  Old value counts to new value                  [normal, 300ms]
               If increasing: green flash                     [fast, 150ms, then fade]
               If decreasing: no flash (price going down is good, no alert needed)
```

Implementation: `useCountUp` hook with start/end values, triggered by price change.

---

## 9. Other Pages

### 9.1 — Services Overview (`/services`)
- Service cards: Same enhanced hover as homepage grid (§6.3)
- Page entrance: Heading fades in, then cards stagger

### 9.2 — Service Detail Pages (`/services/[slug]`)
- Feature badges: Stagger in on scroll (40ms per badge)
- Related services grid: Same hover behavior as services grid
- Hero image: Fade in (no slide)

### 9.3 — Projects Page (`/projects`)
- Project cards: Same enhanced hover as homepage (§6.5)
- Grid stagger: 60ms per card

### 9.4 — Pricing Page (`/pricing`)
- Filter pills: Smooth background transition on active state toggle [fast, 150ms]
- Table rows: Subtle highlight on hover (`bg-slate-50` with transition) [fast, 150ms]
- Search input focus: Same as contact form inputs (§7.1)

### 9.5 — About Page (`/about`)
- Differentiator cards: Stagger entrance like services grid
- Location cards: Hover shadow transition (shadow-sm → shadow-md) [normal, 300ms]
- Stats: Counter animation same as trust bar (§6.2)

### 9.6 — FAQ Page (`/faq`)
- Same accordion behavior as homepage FAQ (§6.7)
- Category tabs: Smooth underline indicator transition between tabs

### 9.7 — Privacy & Terms Pages
- No animations beyond standard scroll reveal for content blocks
- These are legal pages — motion would be inappropriate

---

## 10. Floating Elements

### 10.1 — WhatsApp Widget
**Where:** `whatsapp-widget.tsx`
**Current:** Static floating button
**New:** Entrance animation + idle pulse

```
Entrance:    Slides up from below viewport edge (30px)        [entrance, 500ms, delay 1500ms]
             (delayed so it doesn't compete with hero entrance)
Idle:        Very subtle scale pulse every 5s (1.0→1.03→1.0)  [slow, 800ms]
             Opacity of pulse: max 1.0 (barely noticeable)
Hover:       Scale(1.05) + shadow-lg                          [fast, 150ms]
Press:       Scale(0.98)                                      [instant, 75ms]
```

---

### 10.2 — Cookie Consent Banner
**Where:** `cookie-consent.tsx`
**Current:** Appears (assumed instant)
**New:** Slides up from bottom edge

```
Enter:     Slides up from translateY(100%) + fade in          [normal, 300ms, delay 2000ms]
Accept:    Slides down + fades out                            [normal, 300ms]
```

---

### 10.3 — Mobile Bottom Bar
**Where:** `mobile-bottom-bar.tsx`
**Current:** Static fixed bar
**New:** Slides up on page load

```
Enter:     Slides up from below                               [normal, 300ms, delay 1000ms]
Scroll up: Visible (stays put)
Scroll down: Slides down to hide (saves screen space)         [normal, 300ms]
```

Implementation: Track scroll direction. On scroll-down, `translateY(100%)`. On scroll-up, `translateY(0)`.

---

## 11. Implementation Plan

### Phase 1: Foundation (affects everything)
1. Add motion tokens to `globals.css` (CSS custom properties for durations/easings)
2. Add `prefers-reduced-motion` global override
3. Create `useReducedMotion` hook
4. Create `useCountUp` hook
5. Update `<Button>` with press feedback (CSS-only)
6. Add `.link-underline` utility class
7. Enhance input focus styles

### Phase 2: Navigation
8. Smooth header background transition
9. Nav link hover underlines
10. Dropdown stagger animation
11. Mobile sheet stagger

### Phase 3: Homepage
12. Hero entrance choreography
13. Trust bar counter animation
14. Enhanced scroll reveal variants
15. Process steps sequential reveal
16. Video section pulse rings
17. CTA band animations

### Phase 4: Interactive Components
18. Contact form state transitions (AnimatePresence)
19. Calculator step slide transitions
20. Calculator estimate counter
21. FAQ accordion smoothing
22. Equipment selection transitions

### Phase 5: Polish
23. WhatsApp widget entrance + idle pulse
24. Cookie consent slide
25. Mobile bottom bar scroll behavior
26. Project card hover refinement
27. Footer social icon polish

### Files Modified (estimated)

| File | Changes |
|------|---------|
| `app/globals.css` | Motion tokens, reduced-motion, keyframes, utility classes |
| `components/ui/button.tsx` | Active press state |
| `components/ui/input.tsx` | Focus transition styles |
| `components/scroll-reveal.tsx` | Variant prop, contextual directions |
| `components/header.tsx` | Smooth bg, nav underlines, dropdown stagger |
| `components/hero.tsx` | Entrance choreography |
| `components/trust-bar.tsx` | Counter animation |
| `components/services-grid.tsx` | Enhanced hover, icon pulse |
| `components/process-steps.tsx` | Sequential timeline reveal |
| `components/project-grid.tsx` | Refined hover |
| `components/video-section.tsx` | Pulse rings |
| `components/faq-accordion.tsx` | Smoothed transitions |
| `components/contact-form.tsx` | AnimatePresence state transitions |
| `components/whatsapp-widget.tsx` | Entrance + idle pulse |
| `components/cookie-consent.tsx` | Slide entrance |
| `components/mobile-bottom-bar.tsx` | Scroll-aware show/hide |
| `components/freight-calculator/calculator-wizard.tsx` | Step slide transitions |
| `components/freight-calculator/calculator-estimate-card.tsx` | Price counter |
| `components/freight-calculator/calculator-progress-bar.tsx` | Fill animation |
| `hooks/use-count-up.ts` | NEW — counter animation hook |
| `hooks/use-reduced-motion.ts` | NEW — accessibility hook |

### New Dependencies
**None.** Everything uses the existing `motion` library + CSS. No new packages needed.

### Performance Budget
- Total new JS for animations: < 3KB gzipped (hooks + motion variants)
- All animations use `transform` + `opacity` only (GPU-composited, no layout thrashing)
- No `will-change` applied permanently — only during active animations
- Animations are disabled entirely for `prefers-reduced-motion: reduce`

---

## 12. What This Does NOT Include

- **Page transitions** (route-to-route animation) — Next.js View Transitions API is experimental. Revisit when stable.
- **Scroll-linked animations** (parallax, scroll-driven color changes) — Too distracting for a B2B corporate site.
- **Skeleton loading states** — Current data loading is fast enough. Add only if performance degrades.
- **SVG line-draw animations** — Only used for the success checkmark. No decorative SVG animation.
- **Canvas/WebGL effects** — The route globe already covers 3D. No additional WebGL.
- **Sound effects** — Obviously not.
