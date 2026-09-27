import { useEffect, useState } from 'react'
import { isApiEnabled, fetchProducts, fetchProduct } from './api'

/**
 * Catalogue data — from the admin-managed backend, and ONLY from there.
 *
 * There used to be a fallback to the old bundled product list whenever the
 * API was slow or down. That meant the website could show products the admin
 * had never added, renamed or deleted — so it is gone. If the API fails, the
 * pages say so and offer a refresh instead of quietly showing stale data.
 */

/**
 * @param {object} params  { category, featured, search, enabled }
 *   `enabled: false` skips the request entirely (a page with nothing to ask for).
 * @returns {{ items, loading, error }}
 */
export function useProducts({ category, featured, search, enabled = true } = {}) {
  const active = isApiEnabled && enabled
  const [state, setState] = useState(() => ({
    items: [],
    loading: active,
    error: isApiEnabled ? null : new Error('Catalogue API not configured'),
  }))

  useEffect(() => {
    if (!active) return

    const controller = new AbortController()
    let cancelled = false

    setState((s) => ({ ...s, loading: true, error: null }))

    // Fetch EVERY page. Asking for one page silently hid 28 of 88 products;
    // stopping after ten pages of sixty later hid 292 of 892, and the page
    // said "600 products" as if that were all of them. The only bound now is
    // a guard against a runaway loop.
    //
    // The first page is shown as soon as it arrives; the rest follow four
    // requests at a time, appended in order.
    ;(async () => {
      const PER_PAGE = 100 // the API's maximum
      const MAX_PAGES = 60 // 6,000 products — a guard, not a catalogue limit
      const AT_A_TIME = 4

      const get = (page) =>
        fetchProducts({ category, featured, search, page, limit: PER_PAGE }, { signal: controller.signal })

      const first = await get(1)
      if (cancelled) return
      const all = [...first.items]
      setState({ items: [...all], loading: false, error: null })

      const pages = Math.min(first.meta?.pages ?? 1, MAX_PAGES)
      for (let page = 2; page <= pages; page += AT_A_TIME) {
        const batch = await Promise.all(
          Array.from({ length: Math.min(AT_A_TIME, pages - page + 1) }, (_, i) => get(page + i)),
        )
        if (cancelled) return
        for (const result of batch) all.push(...result.items)
        setState({ items: [...all], loading: false, error: null })
      }
    })().catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        // A category that no longer exists (renamed or removed in the admin
        // panel) is simply empty, not an outage.
        if (err.status === 404) {
          setState({ items: [], loading: false, error: null })
          return
        }
        setState({ items: [], loading: false, error: err })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [active, category, featured, search])

  // A disabled hook is never loading, even if it was mid-request when disabled.
  return active ? state : { ...state, loading: false }
}

/** Single product by slug. */
export function useProduct(slug) {
  const [state, setState] = useState(() => ({
    product: null,
    loading: isApiEnabled,
    notFound: !isApiEnabled,
  }))

  useEffect(() => {
    if (!isApiEnabled) return

    const controller = new AbortController()
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    fetchProduct(slug, { signal: controller.signal })
      .then((product) => {
        if (!cancelled) setState({ product, loading: false, notFound: false })
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        // Deleted, unpublished, or unreachable — either way there is nothing
        // real to show, and the product list explains an outage properly.
        setState({ product: null, loading: false, notFound: true })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [slug])

  return state
}
