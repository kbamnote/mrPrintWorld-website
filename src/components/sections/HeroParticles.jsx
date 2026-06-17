import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Lazy-loaded WebGL atmosphere for the hero (code-split — three.js never enters
 * the main bundle). Drifting ink/raster dots + floating "paper" shards that
 * respond gently to scroll velocity and pointer. Pauses when offscreen or the
 * tab is hidden (brief §10 performance rules). Only mounted on capable devices.
 */

// Window-level pointer/scroll signals (canvas is pointer-events-none so buttons
// stay clickable; we read motion from the window instead of canvas events).
function useDriftSignals() {
  const pointer = useRef({ x: 0, y: 0 })
  const scrollVel = useRef(0)
  useEffect(() => {
    let lastY = window.scrollY
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      const y = window.scrollY
      scrollVel.current += y - lastY
      lastY = y
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])
  return { pointer, scrollVel }
}

function ParticleField({ count, signals }) {
  const group = useRef()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const gold = new THREE.Color('#D4AF37')
    const white = new THREE.Color('#ffffff')
    const green = new THREE.Color('#1A7F52')
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9
      const r = Math.random()
      const c = r < 0.5 ? gold : r < 0.85 ? white : green
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    signals.scrollVel.current *= 0.9
    g.rotation.y += delta * 0.025 + signals.scrollVel.current * 0.00006
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, signals.pointer.current.y * 0.12, 0.04)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, signals.pointer.current.x * 0.05, 0.04)
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.9}
          size={0.06}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

function Shards({ count, signals }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        p: [(Math.random() - 0.5) * 13, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6],
        r: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        s: Math.random() * 0.5 + 0.28,
        spin: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  )

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    const drift = signals.scrollVel.current * 0.002
    data.forEach((d, i) => {
      dummy.position.set(d.p[0], d.p[1] + Math.sin(t * 0.3 + d.phase) * 0.35, d.p[2])
      dummy.rotation.set(d.r[0] + t * d.spin * 0.2, d.r[1] + t * d.spin * 0.15 + drift, d.r[2])
      dummy.scale.setScalar(d.s)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.5, 0.72]} />
      <meshBasicMaterial
        color="#D4AF37"
        transparent
        opacity={0.13}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

export default function HeroParticles() {
  const wrap = useRef(null)
  const [onScreen, setOnScreen] = useState(true)
  const [visible, setVisible] = useState(true)
  const signals = useDriftSignals()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 260 : 640
  const shards = isMobile ? 8 : 24

  useEffect(() => {
    const el = wrap.current
    // Deactivate once the hero is mostly scrolled away, so the hero and the
    // downstream Brand Journey canvas are never both rendering at the same time.
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.intersectionRatio >= 0.35),
      { threshold: [0, 0.35, 0.6] },
    )
    if (el) io.observe(el)
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const active = onScreen && visible

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#0E1111', 6, 17]} />
        <ParticleField count={count} signals={signals} />
        <Shards count={shards} signals={signals} />
      </Canvas>
    </div>
  )
}
