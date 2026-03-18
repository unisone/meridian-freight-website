# Spec: Route Globe V2 — Dark Cartographic Style

**Status:** Approved for implementation
**Date:** 2026-03-18

## Goal

Replace the current NASA night-photo globe with a dark cartographic-style globe matching the reference video aesthetic: dark gray landmasses with visible borders, thin red route arcs, white port labels, no atmosphere glow.

## Changes

### Globe Base
- Remove `globeImageUrl` (no photographic texture)
- Load GeoJSON country polygons from `ne_110m_admin_0_countries.geojson`
- Dark gray polygon fill: `rgba(25, 25, 35, 0.9)`
- Visible border strokes: `rgba(70, 70, 90, 0.5)`
- Flat polygons: `polygonAltitude: 0.005`
- No atmosphere: `showAtmosphere: false`
- Black background: `rgba(0,0,0,0)`

### Arc Style
- Color: red/pink `rgba(220, 60, 60, 0.8)` → `rgba(220, 60, 60, 0.3)`
- Thin stroke: 0.3
- Animated dash: length 0.4, gap 0.2, time 3000ms
- Multiple segments for 40HC routes (Albion→Chicago + Chicago→dest)

### Markers
- Hub marker: larger (0.8), red color
- Destination marker: smaller (0.5), red/pink

### Labels
- White text: `rgba(255, 255, 255, 0.7)`
- Size: 0.6-0.8
- Port names at endpoints

### Camera
- No auto-spin
- Zoom closer: altitude 1.2-2.0 (was 1.4-2.8)
- Auto-position to route midpoint

## Files Changed
- `components/freight-calculator/route-globe.tsx` — config changes only
