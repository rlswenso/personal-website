# Agent Handoff — Ryder Swenson Personal Website

**Owner:** Ryder Swenson  
**Domain:** `ryderswenson.com` (registered on Porkbun)  
**Workspace:** `/Users/swense/Desktop/Personal Website`  
**Last updated:** June 2026

---

## Project goal

Build a clean, professional personal website inspired by friends' portfolios (Ryan Lalani, Max Xing, Joshua Ta) but with Ryder's own look. The site should:

- Work on mobile and desktop
- Be modular and scalable (Next.js + React)
- Signal interest in **technology, startups, AI, and venture**
- Feel **minimal** but **alive** (3D particles, cursor interaction, scramble activity line)

**Not yet done:** Deploy to Vercel and connect Porkbun DNS.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| 3D | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Theme | `next-themes` (light/dark, system default) |
| Icons | `lucide-react` |
| Planned hosting | Vercel (free tier) |

**Commands:**
```bash
cd "/Users/swense/Desktop/Personal Website"
npm run dev    # http://localhost:3000
npm run build
```

**Note:** Workspace folder name has a space; `package.json` name is `ryderswenson-site`.

---

## Site structure

### Single-page scroll (not tabs)

One continuous page. Sections in order:

**Home (hero) → About → Projects → Experience → Writing**

- Entry: `src/app/page.tsx` → `SinglePage` in `src/components/sections/single-page.tsx`
- Section content components live in `src/components/tabs/` (legacy folder name; they are scroll sections, not tabs)
- Section IDs and nav labels: `src/lib/sections.ts`
- Smooth scroll via `scrollToSection()` in `src/context/scroll-context.tsx`

### Navigation

Two nav surfaces, both **cursor-aware** (magnetic links + glow via `cursor-nav-link.tsx`):

| Surface | When visible | Controlled by |
|---------|--------------|---------------|
| **Top header** | Start of page; hides during hero zoom | `topNavHideAt` in `transition-config.ts` |
| **Side Contents** | Desktop (`lg+`) after hero transition | `sideTocShowAt` in `transition-config.ts` |

**Top header** (`header.tsx`):
- Name (home link) + all section links + theme toggle
- Hides when `transitionProgress >= topNavHideAt`
- Floating theme toggle (top-right) appears when header is hidden

**Side Contents** (`side-toc.tsx`):
- About · Projects · Experience · Writing (no Home)
- Appears when `transitionProgress >= sideTocShowAt`

**Active section highlighting:** scroll spy in `scroll-context.tsx` — Home until side TOC threshold, then marker-based tracking at ~30% viewport height.

**Footer:** always visible (`footer.tsx`).

---

## Hero & scroll transition

### Layout
1. **"Hey, I'm Ryder!"** — large `h1`
2. **"Right now I am …"** — scramble encode/decode rotation (`activity-scramble.tsx`)
3. Location

### Zoom transition (sticky hero)

The hero is a **sticky scroll zone** (`hero-scroll-zone`, default `170vh`). While scrolling through it:

1. Hero intro text fades and drifts up
2. Camera **zooms into** the particle field
3. Particles **spread outward** from center (portal effect)
4. Page background fades in (theme `bg-background`, not black)
5. User lands in About and below

No black void or duplicate About section — removed after user feedback.

**Transition progress** (`0` = top of home, `1` = end of zoom) is computed in `computeTransitionProgress()` and tracked centrally by `ScrollProvider` (rAF loop + scroll events). All nav timing, zoom, and hero fades read this same value.

### 3D particle field

```
src/components/three/
  particle-field-loader.tsx   # dynamic import, ssr: false
  particle-field.tsx          # Canvas wrapper
  particle-field-scene.tsx    # Physics + rendering
  transition-camera.tsx       # Scroll-driven camera zoom

src/lib/three-config.ts       # Particle count, physics, colors
src/lib/transition-config.ts  # Zoom + UI timing + portal tuning
```

**Behavior:**
- ~4,800 particles in an invisible 3D bounding box
- Free-float with velocity, bounce off walls, spawned in a sphere
- Cursor repulsion via raycast (works over text overlay)
- Rotating box tilts with cursor position/velocity
- Scroll portal: particles push outward during zoom; fade as background takes over
- Scroll-back: inward influx + swirl when returning to hero (tunable in `transition-config.ts`)

**Cursor glow:** `src/components/ui/cursor-glow.tsx` — visible when `transitionProgress < 0.2`

**Contexts on hero:**
```
ScrollProvider (layout)
  PointerProvider
    HomeEffectsProvider
      TransitionProvider
        HeroScrollZone → ParticleField + CursorGlow + content
```

---

## Where to edit content

**Primary file:** `src/lib/data.ts`

- `siteConfig` — name, email, location, tagline, SEO description
- `homeIntro` — greeting, activity prefix, rotating activities list
- `aboutParagraphs`, `experiences`, `projects`, `writings`
- `education`, `socialLinks` — placeholder data, not displayed yet

**Section labels:** `src/lib/sections.ts`

---

## Key config tuning

### UI timing — `src/lib/transition-config.ts` ⭐

Two standalone constants at the top (edit these directly):

```ts
export const topNavHideAt = 0;      // when top nav hides (0–1)
export const sideTocShowAt = 0.1;   // when side contents appear (0–1)
```

Same scale as zoom progress through `hero-scroll-zone`. Lower = sooner.

Also in `transitionConfig`:
- `scrollHeightVh` — length of sticky zoom zone (default `170`)
- `heroFadeEnd`, `backgroundFadeStart/End` — hero text + background handoff
- `cameraZEnd`, `portalSpreadStrength` — zoom intensity
- `scrollBackInfluxStrength`, `scrollBackSwirlStrength` — particle re-entry on scroll up

### Particles — `src/lib/three-config.ts`

```ts
particleFieldConfig.count      // 4800
particleFieldConfig.spread     // 10
particleFieldConfig.size       // 0.04
particlePhysicsConfig.repulsion, influence, damping, bounce
particlePhysicsConfig.rotationFromPointer, rotationFromVelocity
```

### Activity animation — locked to scramble

- **Active:** `activity-scramble.tsx` (encode/decode) wired directly in `single-page.tsx`
- **Default in config:** `defaultActivityAnimationMode: "scramble"` in `activity-animations.ts`
- Draft picker + alternate modes (`typewriter`, `slot`, `burst`) still exist in `src/components/home/` but are **not mounted** — safe to delete if cleaning up

### Cursor glow — `src/app/globals.css`

`--cursor-glow-core`, `--cursor-glow-mid`

### Theme toggle

Borderless icon button (`theme-toggle.tsx`).

---

## Design decisions & history

1. **Started** with scroll-based single page, constellation motif, pattern drafts — removed (too cluttered).
2. **Pivoted** to tab navigation — then **back to single-page scroll** with section anchors.
3. **3D:** React Three Fiber particle field (not Spline).
4. **Nav:** tried scramble / cursor-aware / context-aware drafts — **locked cursor-aware**.
5. **Transition:** tried black void + About preview — removed; now zoom into particles → theme background → content.
6. **Nav timing:** decoupled into `topNavHideAt` and `sideTocShowAt`; progress unified in `ScrollProvider` after timing bugs with separate scroll handlers.
7. **Typography:** Geist Sans; greeting large, activity line muted body text.
8. **devIndicators:** `next.config.ts` → `devIndicators: false`.

---

## File map (quick reference)

```
src/
├── app/
│   ├── layout.tsx              # Fonts, ThemeProvider, ScrollProvider, header/footer/side-toc
│   ├── page.tsx                # Renders SinglePage
│   └── globals.css
├── components/
│   ├── sections/
│   │   └── single-page.tsx     # ⭐ Hero scroll zone + all sections
│   ├── home/                   # Activity animations (scramble active)
│   ├── layout/
│   │   ├── header.tsx          # Top nav (cursor-aware)
│   │   ├── side-toc.tsx        # Side contents (desktop)
│   │   ├── cursor-nav-link.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   ├── tabs/                   # Section content (about, projects, etc.)
│   ├── three/                  # Particle field + transition camera
│   └── ui/                     # cursor-glow
├── context/
│   ├── scroll-context.tsx      # ⭐ transitionProgress, scroll spy, scrollToSection
│   ├── transition-context.tsx  # heroOpacity, backgroundOpacity, physicsProgressRef
│   ├── pointer-context.tsx
│   └── home-effects-context.tsx
├── lib/
│   ├── data.ts                 # ⭐ MAIN CONTENT
│   ├── sections.ts             # Section IDs + labels
│   ├── transition-config.ts    # ⭐ UI timing + zoom tuning
│   ├── three-config.ts
│   ├── activity-animations.ts
│   └── types.ts
└── providers/
    └── theme-provider.tsx
```

**Removed / obsolete:** `tab-context.tsx`, `tab-panel.tsx`, `home-tab.tsx`, `tabs.ts`, nav style drafts, black transition overlay, `about-transition-preview.tsx`.

---

## Domain & deployment (TODO)

1. Push repo to GitHub
2. Import to **Vercel**
3. In Porkbun DNS, point domain to Vercel (A/CNAME per Vercel instructions)
4. Add `ryderswenson.com` in Vercel project settings

**Registrar:** Porkbun for `ryderswenson.com`

---

## Known constraints

- 3D components must be **client-only** (`"use client"`, dynamic `ssr: false` for Canvas)
- `Particles` uses `useHomeEffects()` + `useTransition()` — must stay inside `HomeEffectsProvider` + `TransitionProvider` on hero
- `TransitionProvider` must be inside `ScrollProvider` (layout wraps both)
- `prefers-reduced-motion` shortens hero scroll zone (`scrollHeightVhReduced`) and disables camera zoom
- Particle count (~4800) may be heavy on low-end mobile — tune `count` in `three-config.ts`
- Side Contents hidden below `lg` breakpoint — no mobile TOC yet

---

## Likely next steps (user may ask)

1. **Tune** `topNavHideAt` / `sideTocShowAt` to taste
2. **Fill in real content** in `data.ts` (experience, projects, writing, social links)
3. **Add Education / Contact sections** (data stubbed in `data.ts`)
4. **Mobile navigation** when side TOC is hidden
5. **Delete unused activity animation drafts** if no longer needed
6. **Deploy to Vercel** + connect domain
7. **Tune particles** — density, zoom, scroll-back motion

---

## Inspiration sites (user shared)

- https://ryanlalani.com/ — custom Next.js, typewriter activities
- https://max-xing.lovable.app/ — Lovable-built, fade activities, constellation motif
- https://joshuataportfolio.com/ — template-style portfolio

User wants similar professionalism but **own clean look** with **3D particle home + zoom transition** as differentiator.

---

## Git

Repo was initialized by `create-next-app`. User rules: **only commit when explicitly asked.**
