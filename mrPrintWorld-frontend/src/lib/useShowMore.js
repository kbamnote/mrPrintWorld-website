import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Shows a long list a screenful at a time, adding more as the visitor
 * scrolls near the end or clicks load more.
 *
 * @param {number} total     how many items there are
 * @param {string} resetKey  changes when the list does (another category), which starts it over
 * @param {number} step      batch size (default raised to 100 so all uploaded products under 100 show at once)
 * @returns {{ count, hasMore, sentinelRef, loadMore, showAll }}
 */
export function useShowMore(total, resetKey, step = 100) {
  // Kept with the key it belongs to, so a new list starts over without an
  // effect having to reset it.
  const [state, setState] = useState({ key: resetKey, count: step })
  const count = state.key === resetKey ? state.count : step
  const hasMore = count < total
  const sentinelRef = useRef(null)

  const loadMore = useCallback(() => {
    setState((s) => ({ key: resetKey, count: (s.key === resetKey ? s.count : step) + step }))
  }, [resetKey, step])

  const showAll = useCallback(() => {
    setState({ key: resetKey, count: total })
  }, [resetKey, total])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState((s) => ({ key: resetKey, count: (s.key === resetKey ? s.count : step) + step }))
        }
      },
      // Start the next batch well before the end is on screen.
      { rootMargin: '900px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, resetKey, step])

  return { count, hasMore, sentinelRef, loadMore, showAll }
}
