import { useEffect, useState } from 'react'
import { isApiEnabled, fetchProducts, fetchProduct } from './api'
import { products as staticProducts, productCategories } from '../data/products'

/**
 * Catalogue data with a static fallback.
 *
 * These hooks are the ONLY place that knows the catalogue might come from
 * either source. Pages just render `{ items, loading, error }` and never have
 * to think about the migration.
 *
 * The fallback is deliberate and temporary: it stays until the API has run in
 * production without incident, then both it and src/data/products.js are
 * deleted (migration plan, step 5).
 */

/** Shape a static product to look like an API card, so pages need one branch. */
function asCard(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription ?? null,
    image: p.image ? { url: p.image, alt: p.name } : null,
    featured: Boolean(p.featured),
    purchaseMode: 'QUOTE_ONLY',
    categories: [{ name: p.category, slug: p.category }],
    price: null,
  }
}

function asDetail(p) {
  return {
    ...asCard(p),
    description: p.description ?? null,
    images: p.image ? [{ url: p.image, alt: p.name, isPrimary: true }] : [],
    specifications: p.specifications ?? [],
    applications: p.applications ?? [],
    customization: p.customization ?? [],
    materials: p.materials ?? [],
    sizes: p.sizes ?? [],
    moq: p.moq ? { qty: null, unit: p.moq } : null,
    primaryCategory: { name: p.category, slug: p.category },
    pricingModel: 'QUOTE_ONLY',
    options: [],
    seo: { title: p.seo?.title ?? p.name, description: p.seo?.description ?? p.shortDescription ?? null },
  }
}

/**
 * @param {object} params  { category, featured, search }
 * @returns {{ items, loading, error, usingFallback }}
 */
export function useProducts({ category, featured, search } = {}) {
  const [state, setState] = useState(() => ({
    items: isApiEnabled ? [] : staticProducts.map(asCard),
    loading: isApiEnabled,
    error: null,
    usingFallback: !isApiEnabled,
  }))

  useEffect(() => {
    if (!isApiEnabled) return

    const controller = new AbortController()
    let cancelled = false

    setState((s) => ({ ...s, loading: true }))

    // Fetch EVERY page. The API caps a single page at 60; asking for one page
    // silently hid 28 of 88 products, with nothing to indicate anything was
    // missing. Bounded at 10 pages so a runaway catalogue cannot loop forever.
    ;(async () => {
      const all = []
      for (let page = 1; page <= 10; page += 1) {
        const { items, meta } = await fetchProducts(
          { category, featured, search, page, limit: 60 },
          { signal: controller.signal },
        )
        all.push(...items)
        if (!meta || page >= meta.pages) break
      }
      return all
    })()
      .then((items) => {
        if (cancelled) return
        setState({ items, loading: false, error: null, usingFallback: false })
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        // Degrade to the static catalogue rather than showing an empty shop.
        console.warn('Catalogue API unavailable, using bundled data:', err.message)
        setState({
          items: staticProducts.map(asCard),
          loading: false,
          error: null,
          usingFallback: true,
        })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [category, featured, search])

  return state
}

/** Single product by slug, with the same fallback behaviour. */
export function useProduct(slug) {
  const [state, setState] = useState(() => {
    if (isApiEnabled) return { product: null, loading: true, notFound: false, usingFallback: false }
    const found = staticProducts.find((p) => p.slug === slug)
    return { product: found ? asDetail(found) : null, loading: false, notFound: !found, usingFallback: true }
  })

  useEffect(() => {
    if (!isApiEnabled) return

    const controller = new AbortController()
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))

    fetchProduct(slug, { signal: controller.signal })
      .then((product) => {
        if (!cancelled) setState({ product, loading: false, notFound: false, usingFallback: false })
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        // A genuine 404 is a real "not found" — do NOT mask it with the
        // fallback, or a deleted product would resurrect from the bundle.
        if (err.status === 404) {
          setState({ product: null, loading: false, notFound: true, usingFallback: false })
          return
        }
        const found = staticProducts.find((p) => p.slug === slug)
        console.warn('Product API unavailable, using bundled data:', err.message)
        setState({
          product: found ? asDetail(found) : null,
          loading: false,
          notFound: !found,
          usingFallback: true,
        })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [slug])

  return state
}

/** Category list — falls back to the flat string list from the static data. */
export const staticCategoryNames = productCategories
