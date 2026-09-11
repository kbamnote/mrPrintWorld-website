import { apiGet, isApiEnabled } from './api'

/**
 * Reseller share links: ?ref=CODE on any page.
 *
 * The code is remembered for 30 days, so someone who browses today and signs
 * up next week still becomes that reseller's customer. It only ever takes
 * effect at REGISTRATION — clicking a link never moves an existing account.
 */

const KEY = 'mrpw_ref_v1'
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000
const CODE = /^[A-Za-z0-9]{3,16}$/

/** The remembered referral, or null if none or expired. */
export function readReferral() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const ref = JSON.parse(raw)
    if (!ref?.code || Date.now() - ref.at > WINDOW_MS) {
      localStorage.removeItem(KEY)
      return null
    }
    return ref
  } catch {
    return null
  }
}

export function clearReferral() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable — nothing to clear */
  }
}

/** Remember a ?ref= code, once the API confirms it belongs to an active reseller. */
export async function captureReferral(search) {
  const code = new URLSearchParams(search).get('ref')
  if (!code || !CODE.test(code) || !isApiEnabled) return
  if (readReferral()?.code === code.toUpperCase()) return

  try {
    const { data } = await apiGet(`/api/public/resellers/${encodeURIComponent(code)}`)
    localStorage.setItem(KEY, JSON.stringify({ code: data.code, storeName: data.storeName, at: Date.now() }))
  } catch {
    /* unknown or paused reseller — the link just works as a normal link */
  }
}
