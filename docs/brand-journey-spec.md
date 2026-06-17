# Brand Journey 3D — Consolidated Implementation Spec

> One persistent 3D object that appears at the About section and travels the rest of the
> homepage, morphing through six representations of MR Print World's brand ecosystem:
> **paper sheet → business cards → brochures → signage → vehicle branding → corporate gifting.**
> Premium, calm, cinematic, continuous. Never hurts readability. Respects reduced-motion.
> Stays inside a strict mobile performance budget.

This spec is the single source of truth. It folds the best of all three proposed designs and
resolves every point in the adversarial critique. **The implementing engineer should follow it
exactly.**

---

## 0. Decision summary (what we are building and why)

**Chosen architecture: a docked "showcase pod" (Approach 3 placement) that morphs ONE
RoundedBox-based object (Approach 1 morph technique), driven by a single out-of-React
scroll-progress ref, on a `frameloop="demand"` canvas.**

Why this and not the alternatives:

- **Readability is solved by construction.** The pod is a small, fixed, lower-LEFT-docked
  canvas (`pointer-events-none`, `z-30`, `hidden xl:block`). It never overlaps the content
  column. This sidesteps the fatal flaw shared by the "right gutter lane" designs (Approaches
  1 & 2): **there is no reliable right-side whitespace** — `container-page` caps at 1280px, and
  the right columns hold the actual copy/cards (verified: `AboutSection` body copy is
  `lg:col-span-7`, `ServicesSection` desktop detail card is `lg:col-span-7`). A translucent
  object over that copy is a direct WCAG/readability regression, which the brief forbids.
- **Performance is honoured by construction.** A ~360px pod composites roughly one-tenth the
  pixels of a full-viewport translucent canvas every scroll frame — fillrate/compositing is the
  real cost here, not draw calls. `frameloop="demand"` keeps idle GPU cost at ~0.
- **Continuity is cleanest with a single morphing mesh.** Morphing ONE RoundedBox (plus one
  fixed-count InstancedMesh and one structure mesh) via damp-to-target avoids object-vs-object
  crossfades and the transparent depth-sort flicker that six-mounted-groups invite. It is the
  most literal match for "one evolving object."

We REJECT Approach 2 outright (full-viewport cost, soft-only mobile gate, per-vertex paper
curl, opacity-over-text). We REJECT Approach 1 & 2 placement (gutter lane, seam-riding). We KEEP
Approach 1's morph architecture and Approach 3's docked pod.

### Pod placement — lower-LEFT, not lower-right

Approach 3 proposed lower-right, but `FloatingActions` (WhatsApp + call FABs) is `fixed bottom-5
right-4 z-40` and the mobile Navbar drawer is `z-40`. To guarantee the pod never sits under or
over the FABs and never competes for the same corner, **dock the pod in the lower-LEFT**, which
is empty on every section at xl widths. (z-30 already keeps it below both FABs and nav, but a
left dock removes any positional overlap risk entirely.)

---

## 1. Files to create / edit

| File | Action | Purpose |
|---|---|---|
| `D:/mrPrintWorld/src/components/journey/BrandJourney.jsx` | **NEW** | Gate + lazy/Suspense wrapper. Returns `null` on `!enable3d`, `reducedMotion`, or `innerWidth < 1280`. Renders the fixed `pointer-events-none fixed z-30 hidden xl:block` pod shell. Owns IntersectionObserver + visibilitychange + width matchMedia. |
| `D:/mrPrintWorld/src/components/journey/BrandJourneyCanvas.jsx` | **NEW** | The lazy chunk. `<Canvas frameloop="demand" dpr={[1,1.5]} alpha>`, lights, the single morphing object, the `useFrame` that reads progress → stage/local → damps transforms/materials, and the invalidate-while-settling loop. |
| `D:/mrPrintWorld/src/lib/useBrandJourneyScroll.js` | **NEW** | Ref-based global scroll progress. One passive `scroll` listener writes a ref; band measured from `#about`→`#contact`, cached, recomputed only on resize / `ResizeObserver(body)` / `document.fonts.ready`. Returns `{ targetProgress, activeRef }` + a `subscribe(cb)` for invalidate. |
| `D:/mrPrintWorld/src/pages/Home.jsx` | **EDIT** | Lazy-import + mount `<BrandJourney />` once as a sibling after `<HeroSection />`, outside any `<Section>`. |
| `D:/mrPrintWorld/src/lib/motion.js` | **OPTIONAL EDIT** | Export `smootherstep(t)` and the 6-stage timing constants so the 3D timing shares the brand EASE vocabulary. (Not strictly required; may inline.) |

No edits to `Layout.jsx`, `Navbar.jsx`, or `FloatingActions.jsx` are required: nav is `z-50`,
FABs are `z-40`, the pod is `z-30` and lower-LEFT. Verify visually but do not change their
z-index.

---

## 2. Mount + gating (BrandJourney.jsx)

```jsx
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useDeviceCapability } from '../../lib/useDeviceCapability'

const BrandJourneyCanvas = lazy(() => import('./BrandJourneyCanvas'))
const MIN_WIDTH = 1280 // hard width gate — a true left gutter only exists at xl+

export default function BrandJourney() {
  const { enable3d, reducedMotion } = useDeviceCapability()
  const [wide, setWide] = useState(false)

  // Hard width gate. enable3d ALONE is not enough — useDeviceCapability allows
  // capable mobiles/tablets (capableMobile = coarse && cores>=6 && mem>=4 && !narrow).
  // We must NOT create a second WebGL context on those. Tear down on resize-narrow.
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MIN_WIDTH}px)`)
    const apply = () => setWide(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (!enable3d || reducedMotion || !wide) return null

  return (
    <Suspense fallback={null}>
      <BrandJourneyCanvas />
    </Suspense>
  )
}
```

Gating rules (all mandatory):

1. **Code-split**: `BrandJourneyCanvas` is its own `React.lazy` dynamic import, mirroring
   `HeroSection`'s `const HeroParticles = lazy(() => import('./HeroParticles'))`. three.js never
   enters the main bundle. Keep it a separate import from the hero so each chunk loads on demand.
2. **Device gate**: only mount when `enable3d && !reducedMotion`.
3. **Hard width gate**: ALSO require `innerWidth >= 1280` (via matchMedia). Do **not** rely on
   `enable3d` for width — it permits capable mobiles. Below 1280px we return `null` so **no
   Canvas / no WebGL context is ever created**, and we tear the pod down if the user resizes
   narrow (freeing the context). This is the critique's non-negotiable fix.
4. **Graceful fallback = render nothing.** No static stand-in. The DOM page already looks complete.

---

## 3. Scroll progress (useBrandJourneyScroll.js) — outside React

Single source of truth, ref-driven, zero React re-renders during scroll (mirrors
`useDriftSignals` in `HeroParticles.jsx`).

```js
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function useBrandJourneyScroll() {
  const targetProgress = useRef(0) // raw scroll-derived target, 0..1
  const activeRef = useRef(false)  // onScreen && visible (set by the component)
  const band = useRef({ a: 0, span: 1 })
  const subs = useRef(new Set())   // invalidate callbacks

  useEffect(() => {
    const measure = () => {
      const start = document.getElementById('about')
      const end = document.getElementById('contact')
      if (!start || !end) return
      const a = start.getBoundingClientRect().top + window.scrollY
      const b = end.getBoundingClientRect().bottom + window.scrollY
      band.current = { a, span: Math.max(1, (b - a) - window.innerHeight) }
      recompute()
    }
    const recompute = () => {
      const { a, span } = band.current
      targetProgress.current = THREE.MathUtils.clamp(
        (window.scrollY - a) / span, 0, 1,
      )
    }
    // Scroll handler: NO getBoundingClientRect here (avoid reflow). Just read scrollY,
    // recompute the cheap division, notify subscribers (≤1 invalidate/frame on their side).
    const onScroll = () => {
      recompute()
      if (activeRef.current) subs.current.forEach((cb) => cb())
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    let fontsDone = false
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { fontsDone = true; measure() })
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [])

  const subscribe = (cb) => { subs.current.add(cb); return () => subs.current.delete(cb) }
  return { targetProgress, activeRef, subscribe }
}
```

Critical rules:

- **`getBoundingClientRect` only on measure** (mount / resize / `ResizeObserver(body)` /
  `document.fonts.ready`). Never per scroll event — that forces reflow. Scroll reads only
  `window.scrollY`.
- **`ResizeObserver(document.body)` + `document.fonts.ready` re-measure** are mandatory to
  prevent stage-mapping drift from lazy images and the late Clash Display font swap changing
  page height after the first measure.
- **The scroll handler only writes a ref + notifies subscribers.** React state is never set, so
  React renders zero times during scroll.

Band definition: `a = top of #about (page Y)`, `b = bottom of #contact (page Y)`,
`span = (b - a) - innerHeight`. `progress = clamp((scrollY - a)/span, 0, 1)`.

---

## 4. Canvas + scene (BrandJourneyCanvas.jsx)

### 4.1 Canvas config (mirror HeroParticles, with demand frameloop)

```jsx
<div
  ref={wrap}
  aria-hidden="true"
  className="pointer-events-none fixed bottom-[clamp(1.5rem,5vh,4rem)] left-[clamp(1.5rem,4vw,4rem)] z-30 hidden xl:block"
  style={{
    width: 'clamp(240px, 24vw, 380px)',
    height: 'clamp(240px, 24vw, 380px)',
  }}
>
  <Canvas
    dpr={[1, 1.5]}
    frameloop="demand"
    camera={{ position: [0, 0, 6], fov: 42 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  >
    <Scene scroll={scroll} active={active} />
  </Canvas>
</div>
```

- `frameloop="demand"` — NO continuous loop. Render only when invalidated.
- `dpr={[1,1.5]}`, `alpha:true`, `powerPreference:'high-performance'`, `antialias:true` — match
  HeroParticles.
- Camera `z≈6`, `fov 42` — tighter than the hero's 60 for a cinematic, contained product feel.
- Pod sized `clamp(240px,24vw,380px)` square; docked lower-LEFT with `clamp` insets.
- A subtle CSS "display case" surface on the wrapper keeps the object legible over white,
  surface, AND dark sections — apply on the wrapper div, NOT inside WebGL:
  `rounded-[var(--radius-lg)] bg-white/35 backdrop-blur-md ring-1 ring-black/5 shadow-[var(--shadow-card)]`.
  This is the mechanism that makes the object read cleanly over every opaque background.
  Crossfade the wrapper's own CSS opacity near progress 0 and 1 (glide in at About, out at
  Contact) using a CSS class toggled by an IntersectionObserver — not per-frame JS.

### 4.2 Visibility / activity gating

Mirror HeroParticles. `active = onScreen && visible`:

```jsx
const [onScreen, setOnScreen] = useState(false)
const [visible, setVisible] = useState(true)
useEffect(() => {
  const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0 })
  const aboutEl = document.getElementById('about')
  const contactEl = document.getElementById('contact')
  if (aboutEl) io.observe(aboutEl)
  if (contactEl) io.observe(contactEl)
  const onVis = () => setVisible(!document.hidden)
  document.addEventListener('visibilitychange', onVis)
  return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
}, [])
const active = onScreen && visible
```

When `!active`: set `scroll.activeRef.current = false` (scroll handler stops calling
`invalidate`), and demand-mode renders cease entirely → **literal zero rendered frames**
off-screen or tab-hidden. When `active` flips true, fire one `invalidate()` to resync.

### 4.3 Lighting (cheap, no shadows)

- 1 `hemisphereLight` (or `ambientLight`) + 1 `directionalLight`. **Shadows OFF** (no shadow
  maps). No `ContactShadows` (it adds a render-target pass — dropped per the budget critique;
  the CSS display-case surface provides the "grounding" instead). No fog (pod is small).

### 4.4 Coexistence with the hero context

The journey only activates after `#about` intersects, by which point the hero has scrolled away
and its `frameloop` is `'never'`. To be safe against the brief transient overlap at the
hero→about boundary, the IntersectionObserver `threshold: 0` on `#about` means the pod will not
render until About enters the viewport. Two contexts never both render heavily. (Also: the pod
is gated to `>=1280px`, off the capable-mobile tier where context limits bite.)

---

## 5. The object — fixed allocation, morph by parameter lerp

**The whole scene has a FIXED, constant set of objects, allocated once via `useMemo`. Nothing is
ever mounted/unmounted or geometry-swapped during scroll. Every visual change is a parameter
lerp.** This is the core continuity + perf guarantee.

Allocated once:

1. **Hero RoundedBox** (`@react-three/drei` `RoundedBox`) — the protagonist. Its `scale.xyz`,
   `position`, `rotation`, radius factor, and material drive paper → card-block → brochure base
   → sign panel → van body → gift box.
2. **One structure mesh** — a thin RoundedBox/cylinder used as the signage post / van underframe.
   Hidden in other stages by lerping `scale.y → 0.001` (stays allocated, costs ~nothing).
3. **One `InstancedMesh`** with a **fixed instance count of 6**, reused across stages:
   - Stage 2: 6 fanned card slabs (a deck).
   - Stage 3: 3 brochure panels (other 3 lerp scale → ~0).
   - Stage 5: 2 instances become wheels (dark slabs low on the body); others → ~0.
   - Stage 6: 2 instances become crossed gold ribbon straps; others → ~0.
   Instances never change in count — only per-instance matrix + `instanceColor`.

Per-frame work uses **one module-scope `THREE.Object3D` dummy + one `THREE.Color` scratch**
(the pattern `Shards` already uses). **Zero per-frame allocation. No runtime geometry
create/dispose.**

Materials: shared `MeshStandardMaterial` instances. A single damped color / emissive /
emissiveIntensity / roughness value set is animated across stages so it reads as "same matter,
new form." Because the pod has its own opaque-ish display-case backdrop, the object itself can
stay **fully opaque** (no `transparent`, no `depthWrite:false`, no crossfade) — this **avoids
the transparent depth-sort flicker entirely**, which is the single biggest reason to morph one
mesh rather than crossfade six groups.

### 5.1 STAGES descriptor

Define a module-level `STAGES` array of 6 target descriptors. Each entry:

```js
{
  boxScale:        [x, y, z],   // hero RoundedBox scale
  boxRadiusFactor: number,      // soft-edge amount
  groupPos:        [x, y, z],
  groupRot:        [x, y, z],
  matColor:        '#......',
  emissive:        '#......',
  emissiveIntensity: number,
  roughness:       number,
  structureScaleY: number,      // 0.001 = hidden, 1 = post/underframe visible
  instances: [ { pos:[x,y,z], rot:[x,y,z], scale:[x,y,z], color:'#...' }, ...6 ],
}
```

Anchor values per stage (tune in-browser; these are the starting targets):

| Stage | Section anchor (progress) | Representation | Hero box scale (rel.) | Notes |
|---|---|---|---|---|
| 1 | About (≈0.00) | Premium floating paper sheet | tall, thin `[2.2, 3.0, 0.04]` | white `#ffffff`, roughness 0.55, gentle whole-group tilt wobble (sin), NOT per-vertex curl |
| 2 | Services (≈0.20) | Business cards (fanned deck) | landscape `[1.7, 1.0, 0.5]` depth grows = "stack" | 6 instanced slabs fanned; gold `#D4AF37` emissive edge |
| 3 | Capabilities (≈0.40) | Tri-fold brochures | wide/thin `[3.0, 2.0, 0.05]` | 3 panel instances hinge open ±35°; faint primary-green inner band via `instanceColor` |
| 4 | Portfolio (≈0.60) | Signage on a post | bold panel `[3.4, 1.9, 0.12]`, translate up | structure post `scaleY 0→1`; panel face emissive primary-green `#0B6B43` + gold border; slight forward tilt |
| 5 | Industries (≈0.80) | Vehicle branding (stylized van) | van body `[3.2, 1.4, 1.5]` depth grows hard | 2 instances → low wheels; gold side stripe via `instanceColor`+emissive; slow wheel spin while weight>0 |
| 6 | Testimonials/Contact (≈1.00) | Corporate gift box | cube-ish `[1.8, 1.8, 1.8]`, radius up | 2 instances → crossed gold ribbon; luminous gold-accented white; slow auto-rotate.y to present |

Note the anchors are evenly spaced 0.0 / 0.2 / 0.4 / 0.6 / 0.8 / 1.0. The MissionVision split
section sits between Capabilities and Industries in DOM order; see §7 for its special-case.

### 5.2 Stage mapping + morph math (in useFrame)

```js
useFrame((state, delta) => {
  // 1) damp live progress toward scroll target (frame-rate independent inertia)
  prog.current = THREE.MathUtils.damp(prog.current, scroll.targetProgress.current, 4, delta)

  // 2) map to stage index + local fraction (6 stages = 5 transitions)
  const f = prog.current * 5
  const i = THREE.MathUtils.clamp(Math.floor(f), 0, 4)
  const local = smootherstep(f - i)          // 6t^5 - 15t^4 + 10t^3 (flat at both ends)

  // 3) per field: lerp STAGES[i] -> STAGES[i+1] by local => target, then DAMP live toward it
  //    box scale, group pos/rot, material color/emissive/intensity/roughness,
  //    structureScaleY, and each instance pos/rot/scale/color.
  //    Use THREE.MathUtils.damp for every live value (factor ~4-6).

  // 4) write instance matrices ONLY for instances whose target scale > epsilon
  //    (skip per-instance work for hidden instances)

  // 5) invalidate-while-settling: if any |live-target| > EPS, request another frame
  if (stillAnimating) state.invalidate()
})
```

- **`smootherstep` = `6t^5 − 15t^4 + 10t^3`** — flat at both ends so each form "sets" and is
  legible before melting into the next (calm, EASE-flavored).
- **Damp everything** with `THREE.MathUtils.damp` (factor ~4–6) so fast scroll flicks settle
  smoothly instead of snapping, and so demand-mode keeps rendering a few frames after scroll
  stops.
- **Invalidate-while-settling (the critical demand-mode fix):** at the end of `useFrame`, if any
  live value is still more than `EPS` from its target, call `state.invalidate()` (or the
  `invalidate` from `useThree`). This guarantees the morph runs to completion after the last
  scroll event. **Without this loop the morph freezes mid-transition** — a likely shipped bug.
  Once all values are within `EPS`, stop invalidating → GPU goes idle.
- **Instance guard:** `if (targetInstanceScale <= EPS) continue` before writing that instance's
  matrix — non-adjacent/hidden instances do zero per-instance work.

---

## 6. Transition technique (continuity)

Continuity comes from **never unmounting/remounting and never swapping geometry**:

- A single PARENT `<group>` owns the continuous identity: a slow base Y-bob
  (`sin(t*0.5)*0.04`), the master progress-linked rotation, and the damped position. All meshes
  are its children, so the assembly shares one coherent motion the whole journey.
- The hero RoundedBox visibly stretches, thickens, unfolds, stands up, wraps — one breathing
  form. No object-vs-object crossfade → no double-draw, no popping, no transparency sorting.
- Instances that are "unused" in a stage lerp `scale → 0.001` (invisible, still one draw call)
  rather than being removed.
- The only crossfade anywhere is the wrapper's CSS opacity glide-in/out at the band edges
  (progress→0 and progress→1), done in CSS, not WebGL.

---

## 7. MissionVision carve-out (mandatory)

`#mission` is a full-bleed `grid lg:grid-cols-2` split: dark-left pane (`bg-dark`, content
`lg:ml-auto`), surface-right pane (`bg-surface`, content `lg:max-w-xl`), with text pushed toward
the center seam on both sides. Because our pod is docked lower-LEFT and is a self-contained
display case (not composited directly over section text), it does **not** overlap Mission's
copy. But the object's tone/material is driven by progress, and Mission's background luminance
is ambiguous.

Rule: when `progress` falls within the Mission band (compute its sub-range once from
`#mission` bounds at measure time), **hold the material on the luminous gold/white treatment**
(which reads on both the dark-left and surface-right panes inside the pod's own backdrop). Do
NOT attempt section-index tone detection across the Mission band. This is a fixed special-case,
not optional polish.

The pod's own `bg-white/35 backdrop-blur-md` display case means tone-adaptation is a *nicety*,
not a readability requirement — the object is always legible against its own surface regardless
of the section behind it.

---

## 8. Performance gates (all enforced)

1. **One WebGL context** for the whole journey (one `<Canvas>`), only ever created at
   `>=1280px`. Hero context is separate and is `frameloop:'never'` by the time the journey
   activates (gated on `#about` intersection).
2. **`frameloop="demand"`** — render only on: progress change (scroll), an in-flight settle
   frame (invalidate-while-settling), `active` flip, or resize. Idle GPU cost ≈ 0. Do NOT use
   `frameloop="always"` — "always while merely on-screen" burns frames when the user has
   stopped scrolling.
3. **Scroll outside React**: passive listener → ref + subscriber notify; ≤1 `invalidate`/frame
   (coalesced by demand mode). React never re-renders on scroll.
4. **Draw calls ≤ ~3**: hero RoundedBox + structure mesh + one InstancedMesh. No GLTF, no HDRI,
   no textures, no postprocessing, no shadows.
5. **DPR cap `[1,1.5]`**. `alpha:true`, `powerPreference:'high-performance'`.
6. **Small pod (~240–380px)** = ~1/10th the composited pixels of a full-viewport canvas. This is
   the single biggest real saving.
7. **IntersectionObserver(#about,#contact) + visibilitychange** → off-screen/hidden reaches
   literal zero rendered frames (active=false short-circuits invalidate).
8. **Fixed allocation**: geometries/materials/instances `useMemo`'d once; module-scope dummy +
   color scratch; per-instance matrix writes only for visible instances and only while settling.
9. **Lighting**: 1 ambient/hemisphere + 1 directional, shadows off, no ContactShadows.
10. **`getBoundingClientRect` only on measure** (resize / ResizeObserver / fonts.ready), never
    per scroll.

---

## 9. Mobile + reduced-motion behavior

- **Reduced motion**: `useDeviceCapability` returns `enable3d=false` under
  `prefers-reduced-motion: reduce`; `BrandJourney` ALSO checks `reducedMotion` directly and
  returns `null`. The three.js chunk is never fetched. App-wide `MotionConfig reducedMotion` +
  the `index.css` reduced-motion block already neutralize transitions. **Fallback = render
  nothing.**
- **Mobile / low-power / tablet**: two layers. (1) `useDeviceCapability` only enables 3D on
  capable desktops or clearly-capable large mobiles; save-data and missing-WebGL disable it.
  (2) Independent **hard width gate** (`hidden xl:block` CSS **and** `innerWidth >= 1280` in JS
  via matchMedia) → **no Canvas / no WebGL context below 1280px**, even on a capable tablet on
  the `capableMobile` path. Resize-narrow tears the pod down and frees the context. No second
  context is ever created on the capable-mobile tier.
- **No GLTF/HDRI/poster** is ever fetched on any device. The journey is a desktop/large-laptop
  enhancement only. Phones/tablets get the unchanged, fast, fully-readable page — intentionally
  nothing.
- iOS Safari `100svh`/URL-bar resize is a non-issue: the pod is a small fixed box sized in `px`
  via `clamp`, not `100vh`, and it is gated off the mobile tier anyway.

---

## 10. StrictMode / cleanup

- All effects (scroll, resize, ResizeObserver, IntersectionObserver, visibilitychange,
  matchMedia, fonts.ready) clean up in their effect `return` (HeroParticles models this).
- React.lazy + a single Canvas means dev StrictMode double-invoke must not create duplicate
  listeners or two contexts: keep every listener registration inside an effect with a matching
  teardown; do not register listeners in module scope or in render.

---

## 11. Build order (step by step)

1. Add `smootherstep(t)` to `motion.js` (or inline in the canvas file).
2. Create `useBrandJourneyScroll.js` (band measure + cached recompute + subscribe). Unit-verify
   `progress` goes 0→1 from About-top to Contact-bottom by logging on scroll.
3. Create `BrandJourney.jsx` (gate + lazy + pod shell + IO/visibility/width matchMedia). Confirm
   it returns `null` below 1280px and under reduced-motion, and that no three.js chunk loads
   then (check Network tab).
4. Create `BrandJourneyCanvas.jsx`: Canvas + lights + the fixed-allocation object + `STAGES` +
   the `useFrame` morph + invalidate-while-settling. Start with stage 1↔2 only, verify the
   morph + demand settle, then fill in stages 3–6.
5. Mount `<BrandJourney />` in `Home.jsx` after `<HeroSection />`.
6. In-browser tune: stage anchors, damp factors, camera, pod size/inset, display-case opacity,
   Mission carve-out band. Verify on white (about/portfolio/industries), surface
   (services/testimonials), and dark (capabilities/mission-left) sections.
7. Profile: confirm idle GPU ~0 when not scrolling (demand), zero frames off-screen/tab-hidden,
   one context at a time, no scroll-time reflow, no per-frame allocation (Performance/Memory).

---

## 12. Risks + mitigations

| Risk | Mitigation |
|---|---|
| Readability over content | Pod is docked lower-LEFT, `hidden xl:block`, `pointer-events-none`, never composited over the content column; has its own display-case backdrop. The "right gutter lane" premise is abandoned entirely. |
| Two WebGL contexts coexisting | Journey activates only on `#about` intersection (hero already `frameloop:'never'`); pod gated to `>=1280px` (off the capable-mobile context-limit tier). |
| Demand-render starvation (morph freeze) | `invalidate`-while-settling loop in `useFrame` until `|live-target| < EPS`. |
| Scroll-band drift (lazy images, font swap) | `ResizeObserver(body)` + `resize` + `document.fonts.ready` re-measure; `getBoundingClientRect` only on measure. |
| Mission split luminance flip | Hold luminous gold/white treatment across the Mission band; no per-section tone detection there. |
| Pod overlapping the WhatsApp/call FABs | FABs are lower-RIGHT `z-40`; pod is lower-LEFT `z-30`. No positional or stacking overlap. |
| StrictMode double-mount (dev) | Every listener/observer registered in an effect with matching teardown; no module-scope/render-time registration. |
| Capable-tablet stutter | Hard 1280px gate means tablets never run it; no soft-opacity tier. |

---

## 13. Acceptance checklist

- [ ] three.js chunk does NOT load on: reduced-motion, save-data, low-core/mem, or `<1280px`.
- [ ] Below 1280px: no `<Canvas>` in the DOM, no WebGL context created; resizing narrow tears
      the existing pod down.
- [ ] React renders zero times during scroll (verify with a render counter / Profiler).
- [ ] Idle GPU ≈ 0 when scrolling has stopped (demand mode), and literally zero rendered frames
      when off-screen or the tab is hidden.
- [ ] Only one WebGL context renders at a time (hero vs. journey).
- [ ] The object never overlaps body text/cards on any section at any xl+ width.
- [ ] FABs and Navbar remain fully clickable and on top of the pod.
- [ ] Morph completes smoothly after a fast scroll flick (no mid-transition freeze).
- [ ] Stage anchors line up: paper@About → cards@Services → brochures@Capabilities →
      signage@Portfolio → vehicle@Industries → gift@Testimonials/Contact.
- [ ] Object legible over white, surface, and dark sections (display-case backdrop).
- [ ] No console errors in dev StrictMode; no duplicate listeners.
