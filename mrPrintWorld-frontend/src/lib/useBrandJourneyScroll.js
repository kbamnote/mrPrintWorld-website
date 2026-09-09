import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * Global scroll progress (0..1) across the brand-journey band (#about → #contact),
 * driven entirely through refs so React never re-renders while scrolling.
 *
 * - getBoundingClientRect runs ONLY on measure (mount / resize / ResizeObserver /
 *   fonts.ready) — never per scroll event (which would force reflow).
 * - The scroll handler just reads window.scrollY, recomputes a cheap division, and
 *   notifies subscribers (the canvas invalidate) when active.
 */
export function useBrandJourneyScroll() {
  const targetProgress = useRef(0)
  const activeRef = useRef(false)
  const band = useRef({ a: 0, span: 1 })
  const subs = useRef(new Set())

  useEffect(() => {
    const recompute = () => {
      const { a, span } = band.current
      targetProgress.current = THREE.MathUtils.clamp(
        (window.scrollY - a) / span,
        0,
        1,
      )
    }
    const measure = () => {
      const start = document.getElementById('about')
      const end = document.getElementById('contact')
      if (!start || !end) return
      const a = start.getBoundingClientRect().top + window.scrollY
      const b = end.getBoundingClientRect().bottom + window.scrollY
      band.current = { a, span: Math.max(1, b - a - window.innerHeight) }
      recompute()
    }
    const onScroll = () => {
      recompute()
      if (activeRef.current) subs.current.forEach((cb) => cb())
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {})

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [])

  const subscribe = useCallback((cb) => {
    subs.current.add(cb)
    return () => subs.current.delete(cb)
  }, [])

  return useMemo(
    () => ({ targetProgress, activeRef, subscribe }),
    [subscribe],
  )
}
