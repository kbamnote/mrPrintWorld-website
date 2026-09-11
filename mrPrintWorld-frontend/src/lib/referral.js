import { apiGet, isApiEnabled } from './api'

/**
 * Reseller stores and share links.
 *
 * A reseller shares /store/CODE (or a product inside it). The code is
 * remembered for 30 days, so someone who browses today and signs up next week
 * still becomes that reseller's customer. Attribution itself only happens at
 * REGISTRATION — visiting a store never moves an existing account.
 *
 * Two keys:
 *   mrpw_ref_v1    the last store link followed (30 days) — sent with signup
 *   mrpw_store_v1  the store a signed-in customer belongs to — keeps them in
 *                  their store's view while the session is still loading
 */

const REF_KEY = 'mrpw_ref_v1'
const STORE_KEY = 'mrpw_store_v1'
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000
const CODE = /^[A-Z0-9]{3,16}$/

/** Codes checked against the API in this page session. */
const validated = new Set()

export function normaliseCode(code) {
  const c = String(code ?? '').trim().toUpperCase()
  return CODE.test(c) ? c : null
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode, blocked) — the store link still works */
  }
}

/** The remembered store link, or null if none or expired. */
export function readReferral() {
  const ref = read(REF_KEY)
  if (!ref?.code || Date.now() - ref.at > WINDOW_MS) {
    if (ref) write(REF_KEY, null)
    return null
  }
  return ref
}

export function clearReferral() {
  write(REF_KEY, null)
}

export function readStoreHint() {
  const s = read(STORE_KEY)
  return s?.code ? s : null
}

export function rememberStore(store) {
  if (store?.code) write(STORE_KEY, { code: store.code, storeName: store.storeName ?? null })
}

export function forgetStore() {
  write(STORE_KEY, null)
}

/**
 * Remember a store code once the API confirms it belongs to an ACTIVE
 * reseller. Returns { code, storeName }, or null when the store does not
 * exist or is paused — in which case any remembered copy is dropped, so a
 * stale link cannot keep a visitor inside a closed store.
 */
export async function captureReferralCode(code) {
  const c = normaliseCode(code)
  if (!c || !isApiEnabled) return null

  const current = readReferral()
  if (current?.code === c && current.storeName && validated.has(c)) return current

  try {
    const { data } = await apiGet(`/api/public/resellers/${encodeURIComponent(c)}`)
    const ref = { code: data.code, storeName: data.storeName, at: Date.now() }
    write(REF_KEY, ref)
    validated.add(c)
    return ref
  } catch (err) {
    if (err?.status === 404) {
      if (readReferral()?.code === c) write(REF_KEY, null)
      if (readStoreHint()?.code === c) write(STORE_KEY, null)
      return null
    }
    // Offline or the API hiccuped — keep the visitor in the store rather than
    // bouncing them out over a network error.
    return current?.code === c ? current : { code: c, storeName: null }
  }
}
