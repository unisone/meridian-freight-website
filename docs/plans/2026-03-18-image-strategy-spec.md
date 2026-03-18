# Image Strategy — PRD & Implementation Spec

**Date:** 2026-03-18
**Status:** DRAFT — Awaiting approval
**Branch:** `feat/design-refactor` (continue on same branch)
**Source:** Visual analysis of 3 asset folders (38 photos total) vs 11 current website images

---

## 1. Problem Statement

### Current Website Images — Critical Issues

| Image | Used Where | Problem | Severity |
|-------|-----------|---------|----------|
| `logistics1.jpg` | **Hero** (homepage) | **STOCK PHOTO** — aerial container port. Not Meridian's work. Generic, impersonal. Screams "template." | CRITICAL |
| `warehousing.jpg` | Warehousing service page | **STOCK PHOTO** — generic warehouse with forklift. Not Meridian's facility. | CRITICAL |
| `excavator-cat.jpg` | CAT Excavator project | Timestamp from **2009**. Tiny resolution, very dated. | MAJOR |
| `john-deere-s670.jpg` | JD S670 project | Low quality phone photo, equipment at odd angle, messy background | MAJOR |
| `grain-headers-case.jpg` | Case IH Headers project | Dark, shadowy, hard to see details | MAJOR |
| `kinze-3700.jpg` | Kinze project | Shows boxes/parts in container, not the actual Kinze planter | MINOR |
| `john-deere-wil-rich.jpg` | Tillage project | Needs review (not analyzed) | TBD |
| `self-propelled-sprayer-john-deere.jpg` | Sprayer project | Needs review (not analyzed) | TBD |
| `stripper-headers-shelbourne.jpg` | Shelbourne project | Needs review (not analyzed) | TBD |

**Bottom line:** 2 stock photos + 3 low-quality real photos = 5 of 11 images need replacement. The hero (most important image on the site) is a stock photo.

### Available New Assets

38 real operational photos across 3 folders showing:
- Combines, sprayers, headers on flat rack containers (Hapag-Lloyd, Maersk, COSCO branding visible)
- Crane lifts at ports
- Container loading operations
- Parts packing and documentation
- Crew at work (hi-vis vests, professional)
- Multiple equipment brands (John Deere, Case IH, CAT Challenger)

---

## 2. Strategic Image Selections

### 2.1 HERO IMAGE — Replace stock port photo

**Current:** `logistics1.jpg` — stock aerial container port photo
**Replace with:** `Oversized Loading (4).jpg` from Machinary Photos folder

**Why this photo:**
- John Deere W260 windrower secured on Hapag-Lloyd flat rack
- Clear blue sky background — clean, professional
- Landscape orientation — perfect for hero split layout
- Professional strapping/blocking visible — shows quality workmanship
- Hapag-Lloyd carrier branding visible — implicit social proof for the carrier partnerships mentioned in copy
- Port/container yard setting — establishes the export/logistics context
- Equipment is prominent and identifiable — tells visitors immediately what the business does

**New filename:** `hero-jd-w260-flatrack.jpg`

### 2.2 PROJECT IMAGES — Replace low-quality photos

| Project | Current Image | Replace With | New Filename | Why |
|---------|--------------|-------------|-------------|-----|
| JD S670 Combine to Brazil | `john-deere-s670.jpg` (low quality, odd angle) | `Oversized Loading (3).jpg` — S670 on Hapag-Lloyd flat rack | `project-jd-s670-combine.jpg` | Same exact model (S670 visible), professional port setting, carrier branding |
| CAT Excavators to UAE | `excavator-cat.jpg` (2009, tiny) | `Oversized Loading (2).jpg` — CAT Challenger on COSCO flat rack | `project-cat-challenger-flatrack.jpg` | Same brand (CAT), modern photo, port setting, proper flat rack |
| Case IH Headers to Ukraine | `grain-headers-case.jpg` (dark, shadowy) | `Oversized Loading (6).jpg` — Case IH 9250 on Hapag-Lloyd flat rack | `project-case-ih-combine.jpg` | Same brand (Case IH), clean composition, professional strapping |
| JD Sprayer to Turkey | `self-propelled-sprayer-john-deere.jpg` | `Oversized Loading Mar 1 2022.jpeg` — JD sprayer being crane-lifted onto Maersk | `project-jd-sprayer-crane.jpg` | Dramatic action shot, Maersk branding, shows heavy lift capability |
| Shelbourne Headers to Romania | `stripper-headers-shelbourne.jpg` | `Container Loading.jpg` — Blue Shelbourne being loaded at facility | `project-shelbourne-loading.jpg` | Shows actual Shelbourne equipment being loaded into container |

### 2.3 SERVICE PAGE — Additional images

| Service | Potential Image | Source | Filename |
|---------|----------------|--------|----------|
| Container Loading page | Two JD combines in side-by-side containers | `Container Loading (4).jpg` | `service-container-dual-jd.jpg` |
| Agricultural Equipment page | JD S670 with crew in hi-vis vests | `IMG_1074.JPEG` | `service-agricultural-crew.jpg` |

### 2.4 ABOUT PAGE

| Usage | Image | Source | Filename |
|-------|-------|--------|----------|
| About hero or operations section | Port crane lifting JD sprayer with containers/crew | `Oversized Loading (1).jpg` | `about-port-operations.jpg` |

### 2.5 Images NOT Selected (and why)

| Photo | Reason Excluded |
|-------|----------------|
| `Container Loading (1).jpg` | Muddy conditions, overcast, not polished enough |
| `Container Loading (2).jpg` | Too close-up, partially gray/corrupted rendering |
| `Oversized Loading Image.PNG` | PNG format, 2.3MB, not optimized |
| `Oversized Loading Aug 15 2022.jpg` | Good but redundant — already have better JD combine shots |
| `Oversized Loading May 14 2022.jpg` | Similar to Mar 1 shot but less dramatic angle |
| `Parts Image from Google Drive.JPG` | Rotated 90 degrees (portrait sideways), shows parts not equipment |
| `Pictures from Google Drive.png` | PNG, 1.6MB, not analyzed |
| All videos from META/Equipment folders | Video content — separate initiative, not for this spec |

---

## 3. Image Processing Pipeline

### 3.1 Optimization Requirements

All images must be processed before adding to `public/images/`:

1. **Resize:** Max 1920px wide (hero), 1200px wide (project cards), 800px (service thumbnails)
2. **Compress:** Target 80-120KB per image (JPEG quality 80-85)
3. **Format:** Keep as JPEG (Next.js image optimization handles WebP/AVIF conversion)
4. **Aspect ratio:** Maintain original, crop if needed for landscape consistency
5. **Naming:** SEO-friendly kebab-case filenames (as specified above)

### 3.2 Processing Command

```bash
# Using sips (macOS built-in) for resize + quality
sips --resampleWidth 1920 --setProperty formatOptions 82 "source.jpg" --out "dest.jpg"
```

Or if sharper/better compression needed:
```bash
# Using ffmpeg for higher quality processing
ffmpeg -i "source.jpg" -vf "scale=1920:-1" -q:v 3 "dest.jpg"
```

---

## 4. Code Changes

### 4.1 Hero Image Replacement

**File:** `components/hero.tsx`

```diff
  <Image
-   src="/images/logistics1.jpg"
-   alt="Heavy machinery being loaded into shipping containers"
+   src="/images/hero-jd-w260-flatrack.jpg"
+   alt="John Deere W260 windrower secured on a Hapag-Lloyd flat rack container for export"
    width={720}
    height={540}
```

### 4.2 Project Image Replacements

**File:** `content/projects.ts`

| Project ID | Current `image` | New `image` |
|-----------|----------------|------------|
| 1 (JD S670) | `/images/john-deere-s670.jpg` | `/images/project-jd-s670-combine.jpg` |
| 2 (CAT Excavators) | `/images/excavator-cat.jpg` | `/images/project-cat-challenger-flatrack.jpg` |
| 3 (Case IH Headers) | `/images/grain-headers-case.jpg` | `/images/project-case-ih-combine.jpg` |
| 7 (JD Sprayer) | `/images/self-propelled-sprayer-john-deere.jpg` | `/images/project-jd-sprayer-crane.jpg` |
| 6 (Shelbourne) | `/images/stripper-headers-shelbourne.jpg` | `/images/project-shelbourne-loading.jpg` |

### 4.3 Old Images Cleanup

After replacements are verified, delete replaced stock photos:
- `public/images/logistics1.jpg` (stock photo)
- `public/images/warehousing.jpg` (stock photo)
- `public/images/excavator-cat.jpg` (2009 photo)
- Other replaced originals

### 4.4 Alt Text Updates

All new images get descriptive, keyword-rich alt text:

| Image | Alt Text |
|-------|---------|
| Hero | "John Deere W260 windrower secured on a Hapag-Lloyd flat rack container for export" |
| JD S670 project | "John Deere S670 combine harvester on Hapag-Lloyd flat rack ready for ocean shipping" |
| CAT project | "CAT Challenger tracked tractor on COSCO flat rack container at shipping port" |
| Case IH project | "Case IH 9250 combine with tires on Hapag-Lloyd flat rack for international export" |
| JD Sprayer project | "John Deere self-propelled sprayer being crane-lifted onto Maersk flat rack" |
| Shelbourne project | "Shelbourne stripper header being loaded into shipping container at packing facility" |

---

## 5. Impact Assessment

### Visual Credibility Upgrade

| Aspect | Before | After |
|--------|--------|-------|
| Hero image | Stock photo (any logistics company) | Real Meridian operation with carrier branding |
| Project photos | 2009 photos, phone snapshots | Professional port/facility shots |
| Carrier visibility | Mentioned in copy only | Visible on flat racks (Hapag-Lloyd, Maersk, COSCO) |
| Equipment brands | Named in text only | Visible in photos (JD, Case IH, CAT logos) |
| Human element | No people visible | Crew in hi-vis vests (select photos) |

### SEO Benefits

- Descriptive alt text with equipment brands + carrier names
- Real operational photos rank better in Google Images than stock
- Image filenames contain target keywords

---

## 6. Acceptance Criteria

- [ ] Hero image shows real Meridian operation (not stock)
- [ ] No stock photos remain on the site
- [ ] All new images under 150KB each after optimization
- [ ] All images have descriptive, keyword-rich alt text
- [ ] `npm run build` — 22/22 pages, 0 errors
- [ ] Visual verification — all images load, no broken images
- [ ] Old stock photos deleted from `/public/images/`

---

## 7. Files Changed

| File | Change |
|------|--------|
| `public/images/` | Add 5-7 optimized photos, delete 5 replaced originals |
| `components/hero.tsx` | Update image src + alt text |
| `content/projects.ts` | Update 5 project image paths |
| `components/project-grid.tsx` | Verify alt text rendering |
