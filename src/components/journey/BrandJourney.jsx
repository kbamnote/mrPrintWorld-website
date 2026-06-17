import { Suspense, lazy, useEffect, useState } from 'react'
import { useDeviceCapability } from '../../lib/useDeviceCapability'

// Code-split: three.js scene loads on demand, only on capable wide desktops.
const BrandJourneyCanvas = lazy(() => import('./BrandJourneyCanvas'))

const MIN_WIDTH = 1280 // a docked pod only has room at xl+ widths

/**
 * Gate for the scroll-driven 3D brand journey. Renders nothing — and never
 * creates a WebGL context — unless the device is capable, motion is allowed and
 * the viewport is wide. The canvas itself stays paused (frameloop "never") until
 * the About→Contact band is on screen, so it costs nothing over the hero.
 */
export default function BrandJourney() {
  const { enable3d, reducedMotion } = useDeviceCapability()
  const [wide, setWide] = useState(false)

  // Hard width gate via matchMedia — useDeviceCapability alone permits capable
  // mobiles/tablets, where we must NOT spin up a second WebGL context.
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
