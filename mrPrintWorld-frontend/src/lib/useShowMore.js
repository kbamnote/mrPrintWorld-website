import { useEffect, useRef, useState } from 'react'

/**
 * Shows a long list a screenful at a time, adding more as the visitor
 * scrolls near the end.
 *
 * Rendering four hundred product cards at once made the browser lay out and
 * start every one of them together. Now the first batch appears straight
 * away and the rest follow as they are needed.
 *
 * @param {number} total     how many items there are
 * @param {string} resetKey  changes when the list does (another category), which starts it over
 * @returns {{ count, hasMore, sentinelRef }} render `count` items, then the sentinel while `hasMore`
 */
export function useShowMore(total, resetKey, step = 24) {
  // Kept with the key it belongs to, so a new list starts over without an
  // effect having to reset it.
  const [state, setState] = useState({ key: resetKey, count: step })
  const count = state.key === resetKey ? state.count : step
  const hasMore = count < total
  const sentinelRef = useRef(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setState({ key: resetKey, count: count + step })
      },
      // Start the next batch well before the end is on screen.
      { rootMargin: '900px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, count, resetKey, step])

  return { count, hasMore, sentinelRef }
}
