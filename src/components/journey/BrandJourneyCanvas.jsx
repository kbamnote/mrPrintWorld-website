import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useBrandJourneyScroll } from '../../lib/useBrandJourneyScroll'

/* ===========================================================================
   Brand Journey — a custom-built origami paper aeroplane (our own geometry,
   no third-party model) with "MR Print World" printed on it, that weaves
   left ↔ right across the page as you scroll, lit by a CC0 HDRI.
   Desktop-only, lazy/code-split, renders only while on-screen.
   ========================================================================= */

// --- Tunables (safe to tweak in-browser) ---
const TARGET_SIZE = 4.0 // world units the plane's largest dimension fills
const CYCLES = 4 // how many times it weaves left ↔ right across the journey
const BASE_PITCH = 0.16

// Build a paper-dart geometry from flat folded facets (flat-shaded paper look).
function usePlaneGeometry() {
  return useMemo(() => {
    const N = [0, 0, 1.8] // nose (forward +Z)
    const Ct = [0, 0, -1.2] // tail centre / ridge
    const WL = [-1.0, 0.5, -1.2] // left wing tip (back, up, out)
    const WR = [1.0, 0.5, -1.2] // right wing tip
    const Kb = [0, -0.55, -1.2] // keel bottom (the fold you'd hold)
    const tris = [
      ...N, ...WL, ...Ct, // left wing
      ...N, ...Ct, ...WR, // right wing
      ...N, ...Ct, ...Kb, // keel fin
    ]
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(tris, 3))
    g.computeVertexNormals()
    g.computeBoundingBox()
    return g
  }, [])
}

function PaperPlane({ scroll, wrapRef }) {
  const plane = useRef()
  const prog = useRef(0)
  const geo = usePlaneGeometry()

  const fitScale = useMemo(() => {
    const s = geo.boundingBox.getSize(new THREE.Vector3())
    return TARGET_SIZE / Math.max(s.x, s.y, s.z)
  }, [geo])

  useFrame((state, delta) => {
    prog.current = THREE.MathUtils.damp(
      prog.current,
      scroll.targetProgress.current,
      4,
      Math.min(delta, 0.05),
    )
    const p = prog.current
    const dir = Math.sin(p * Math.PI * CYCLES) // travel direction: + = moving right

    // Weave the pod left ↔ right across the viewport as you scroll.
    const el = wrapRef.current
    if (el) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const podW = Math.min(360, Math.max(240, vw * 0.24))
      const padX = Math.max(24, vw * 0.05)
      const range = vw - podW - padX * 2
      const swing = 0.5 - 0.5 * Math.cos(p * Math.PI * CYCLES) // 0 = left, 1 = right
      const x = padX + range * swing
      const y = vh * 0.5 - podW * 0.5 - Math.sin(p * Math.PI * (CYCLES + 1)) * vh * 0.06
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    // Flight: the nose leads the travel direction and the plane turns around at
    // each end — nose points right while moving right, then pivots to point left
    // when it reverses (and vice-versa) — banking into the turn.
    const g = plane.current
    if (g) {
      const t = state.clock.elapsedTime
      const lead = Math.tanh(dir * 3) // -1..1, flips quickly at the turn points
      g.position.y = Math.sin(t * 1.1) * 0.1
      g.rotation.set(
        BASE_PITCH + Math.sin(t * 1.3) * 0.04,
        lead * 1.12, // yaw: nose toward travel direction (~±64°, stays visible)
        -lead * 0.22 + Math.sin(t * 0.85) * 0.04, // bank into the turn
      )
    }
  })

  return (
    <group ref={plane} scale={fitScale}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#7f8d84"
          roughness={0.78}
          metalness={0.0}
          flatShading
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Scene({ scroll, wrapRef }) {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#243029', 0.55]} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} />
      <directionalLight position={[-5, -2, 2]} intensity={0.45} color="#d4af37" />
      <PaperPlane scroll={scroll} wrapRef={wrapRef} />
    </>
  )
}

export default function BrandJourneyCanvas() {
  const scroll = useBrandJourneyScroll()
  const wrap = useRef(null)
  const [active, setActive] = useState(false)

  // Active = scrolled within the About→Contact band. Computed from the scroll
  // position against cached offsets (no per-scroll reflow, no tab-visibility
  // dependency — browsers already throttle hidden tabs). setState bails when the
  // boolean is unchanged, so this re-renders only at the two band edges.
  useEffect(() => {
    const about = document.getElementById('about')
    const contact = document.getElementById('contact')
    if (!about || !contact) return
    let start = 0
    let end = 0
    const inBand = () => {
      const y = window.scrollY
      return y > start && y < end
    }
    const update = () => {
      const on = inBand()
      setActive(on)
      scroll.activeRef.current = on
    }
    const measure = () => {
      start =
        about.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6
      end = contact.getBoundingClientRect().bottom + window.scrollY
      update()
    }
    measure()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {})
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [scroll])

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-30 hidden transition-opacity duration-700 lg:block ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        width: 'clamp(240px,24vw,360px)',
        height: 'clamp(240px,24vw,360px)',
        willChange: 'transform',
        transform: 'translate3d(5vw, 40vh, 0)',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene scroll={scroll} wrapRef={wrap} />
      </Canvas>
    </div>
  )
}
