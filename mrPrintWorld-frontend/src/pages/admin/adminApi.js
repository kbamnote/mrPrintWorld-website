/**
 * Authenticated API client for the admin panel.
 *
 * The access token is short-lived and held in memory only — never in
 * localStorage, where any XSS on the marketing site could read it. Durability
 * comes from the httpOnly refresh cookie the backend sets, which JavaScript
 * cannot touch at all.
 *
 * A 401 triggers exactly one refresh attempt, then the original request is
 * replayed. Concurrent 401s share a single refresh promise so a page loading
 * five widgets does not fire five refreshes and rotate the cookie five times.
 */

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

let accessToken = null
let refreshPromise = null
let onUnauthenticated = () => {}

export function setAccessToken(token) {
  accessToken = token
}
export function getAccessToken() {
  return accessToken
}
export function setUnauthenticatedHandler(fn) {
  onUnauthenticated = fn
}

class AdminApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.details = details
  }
}

async function raw(path, { method = 'GET', body, isFormData = false } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include', // carries the refresh cookie
    headers: {
      ...(isFormData ? {} : { 'content-type': 'application/json' }),
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  })
  return res
}

async function refresh() {
  // Share one in-flight refresh across all callers.
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE}/api/admin/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new AdminApiError('Session expired', 401)
        const json = await res.json()
        accessToken = json.data.accessToken
        return json.data
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function request(path, opts = {}, { retry = true } = {}) {
  let res = await raw(path, opts)

  if (res.status === 401 && retry) {
    try {
      await refresh()
      res = await raw(path, opts)
    } catch {
      accessToken = null
      onUnauthenticated()
      throw new AdminApiError('Please sign in again', 401)
    }
  }

  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.ok) {
    throw new AdminApiError(
      json?.error?.message ?? `Request failed (${res.status})`,
      res.status,
      json?.error?.details,
    )
  }
  return json
}

/* ── Auth ──────────────────────────────────────────────────────────────── */
export async function login(email, password) {
  const res = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.ok) {
    throw new AdminApiError(json?.error?.message ?? 'Sign in failed', res.status)
  }
  accessToken = json.data.accessToken
  return json.data.user
}

export async function restoreSession() {
  const data = await refresh()
  return data.user
}

export async function logout() {
  await fetch(`${BASE}/api/admin/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
  accessToken = null
}

/* ── Categories ────────────────────────────────────────────────────────── */
export const listCategories = () => request('/api/admin/categories').then((r) => r.data)
export const createCategory = (body) => request('/api/admin/categories', { method: 'POST', body }).then((r) => r.data)
export const updateCategory = (id, body) =>
  request(`/api/admin/categories/${id}`, { method: 'PATCH', body }).then((r) => r.data)
export const deleteCategory = (id) => request(`/api/admin/categories/${id}`, { method: 'DELETE' })

/* ── Products ──────────────────────────────────────────────────────────── */
export function listProducts(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v))
  })
  return request(`/api/admin/products?${qs}`).then((r) => ({ items: r.data, meta: r.meta }))
}
export const getProduct = (id) => request(`/api/admin/products/${id}`).then((r) => r.data)
export const createProduct = (body) => request('/api/admin/products', { method: 'POST', body }).then((r) => r.data)
export const updateProduct = (id, body) =>
  request(`/api/admin/products/${id}`, { method: 'PATCH', body }).then((r) => r.data)
export const deleteProduct = (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' })
export const previewPrice = (id, body) =>
  request(`/api/admin/products/${id}/preview-price`, { method: 'POST', body }).then((r) => r.data)

/* ── Option groups ─────────────────────────────────────────────────────── */
export const listOptionGroups = () => request('/api/admin/option-groups').then((r) => r.data)
export const createOptionGroup = (body) =>
  request('/api/admin/option-groups', { method: 'POST', body }).then((r) => r.data)
export const updateOptionGroup = (id, body) =>
  request(`/api/admin/option-groups/${id}`, { method: 'PATCH', body }).then((r) => r.data)
export const deleteOptionGroup = (id) => request(`/api/admin/option-groups/${id}`, { method: 'DELETE' })

/* ── Customers (Phase 3) ───────────────────────────────────────────────── */
export function listCustomers(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v))
  })
  return request(`/api/admin/customers?${qs}`).then((r) => ({ items: r.data, meta: r.meta }))
}
export const approveCustomer = (id, body = {}) =>
  request(`/api/admin/customers/${id}/approve`, { method: 'PATCH', body }).then((r) => r.data)
export const rejectCustomer = (id, reason) =>
  request(`/api/admin/customers/${id}/reject`, { method: 'PATCH', body: { reason } }).then((r) => r.data)
export const revokeCustomerTier = (id, reason) =>
  request(`/api/admin/customers/${id}/revoke`, { method: 'PATCH', body: reason ? { reason } : {} }).then((r) => r.data)

/* ── Organizations (Phase 4) ───────────────────────────────────────────── */
export function listOrganizations(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v))
  })
  return request(`/api/admin/organizations?${qs}`).then((r) => ({ items: r.data, meta: r.meta }))
}
export const getOrganization = (id) => request(`/api/admin/organizations/${id}`).then((r) => r.data)
export const createOrganization = (body) =>
  request('/api/admin/organizations', { method: 'POST', body }).then((r) => r.data)
export const updateOrganization = (id, body) =>
  request(`/api/admin/organizations/${id}`, { method: 'PATCH', body }).then((r) => r.data)
export const deleteOrganization = (id) => request(`/api/admin/organizations/${id}`, { method: 'DELETE' })
export const addOrgMember = (id, body) =>
  request(`/api/admin/organizations/${id}/members`, { method: 'POST', body }).then((r) => r.data)
export const removeOrgMember = (id, userId) =>
  request(`/api/admin/organizations/${id}/members/${userId}`, { method: 'DELETE' })

/* ── Negotiated rates ──────────────────────────────────────────────────── */
export const createPriceOverride = (body) =>
  request('/api/admin/price-overrides', { method: 'POST', body }).then((r) => r.data)
export const deletePriceOverride = (id) => request(`/api/admin/price-overrides/${id}`, { method: 'DELETE' })
export const previewOverride = (body) =>
  request('/api/admin/price-overrides/preview', { method: 'POST', body }).then((r) => r.data)

/* ── Uploads ───────────────────────────────────────────────────────────── */
export function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  return request('/api/admin/uploads/image', { method: 'POST', body: fd, isFormData: true }).then((r) => r.data)
}

export { AdminApiError }
