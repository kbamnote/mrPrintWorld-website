import { useEffect, useState } from 'react'

/**
 * Decide whether the heavy WebGL hero should run (brief §10 performance rules).
 * Defaults to OFF, then enables only on devices that look capable — so first
 * paint is always the clean static hero and low-power phones never pay for 3D.
 */
export function useDeviceCapability() {
  const [caps, setCaps] = useState({ enable3d: false, reducedMotion: false })

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const saveData = navigator.connection?.saveData === true
    const mem = navigator.deviceMemory ?? 4 // GB (Chromium only; assume 4 if unknown)
    const cores = navigator.hardwareConcurrency ?? 4
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.innerWidth < 768

    // WebGL availability
    const webgl = (() => {
      try {
        const c = document.createElement('canvas')
        return !!(c.getContext('webgl2') || c.getContext('webgl'))
      } catch {
        return false
      }
    })()

    // Enable 3D on capable devices only. Mobile gets it only when clearly able.
    const capableDesktop = !coarse && cores >= 4 && mem >= 4
    const capableMobile = coarse && cores >= 6 && mem >= 4 && !narrow

    const enable3d =
      webgl && !reducedMotion && !saveData && (capableDesktop || capableMobile)

    setCaps({ enable3d, reducedMotion })
  }, [])

  return caps
}
