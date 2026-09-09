/**
 * API client for the catalogue backend.
 *
 * Designed around one constraint: the public website must never be worse off
 * than it is today. Until the backend is deployed (VITE_API_BASE_URL unset),
 * `isApiEnabled` is false and every caller falls back to the static data in
 * src/data/products.js — which is exactly what the site serves now.
 *
 * Once the API is live, a request that times out or errors ALSO falls back
 * rather than rendering an empty catalogue. An outage should look like a stale
 * catalogue, not a broken shop.
 */

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

/** False until the backend is deployed and configured. */
export const isApiEnabled = Boolean(BASE)

const TIMEOUT_MS = 8000

/**
 * Customer access token, held in memory only — never localStorage, where any
 * XSS could read it. Set by the auth provider after login/refresh.
 *
 * Sending it makes catalogue and pricing responses tier-aware: an approved
 * trade customer gets their rates, everyone else gets retail. The token only
 * IDENTIFIES the caller — it never states a tier, because the server derives
 * that itself and would reject the claim anyway.
 */
let authToken = null

export function setAuthToken(token) {
  authToken = token
}

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  if (!isApiEnabled) throw new ApiError('API not configured', 0)

  // Abort on our own timeout as well as any caller-supplied signal, so a hung
  // request cannot leave a page spinning indefinitely.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include', // carries the httpOnly refresh cookie
      headers: {
        'content-type': 'application/json',
        ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    })

    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.ok) {
      throw new ApiError(json?.error?.message ?? `Request failed (${res.status})`, res.status)
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

/* ── Catalogue ─────────────────────────────────────────────────────────── */

export function fetchCategories(opts) {
  return request('/api/public/categories', opts).then((r) => r.data)
}

export function fetchCategory(slug, opts) {
  return request(`/api/public/categories/${encodeURIComponent(slug)}`, opts).then((r) => r.data)
}

export function fetchProducts({ category, featured, search, page = 1, limit = 24 } = {}, opts) {
  const qs = new URLSearchParams()
  if (category) qs.set('category', category)
  if (featured !== undefined) qs.set('featured', String(featured))
  if (search) qs.set('search', search)
  qs.set('page', String(page))
  qs.set('limit', String(limit))
  return request(`/api/public/products?${qs}`, opts).then((r) => ({ items: r.data, meta: r.meta }))
}

export function fetchProduct(slug, opts) {
  return request(`/api/public/products/${encodeURIComponent(slug)}`, opts).then((r) => r.data)
}

/**
 * Ask the server for a price.
 *
 * Note there is no tier argument and there never will be — the backend derives
 * it from the session. Anything this client sent would be rejected.
 */
export function calculatePrice({ slug, quantity = 1, width, height, selections = [] }, opts) {
  return request('/api/public/pricing/calculate', {
    method: 'POST',
    body: { slug, quantity, ...(width ? { width } : {}), ...(height ? { height } : {}), selections },
    ...opts,
  }).then((r) => r.data)
}

/** Generic POST for the auth endpoints, which return their own shapes. */
export function apiPost(path, body) {
  return request(path, { method: 'POST', body })
}

export { ApiError }
