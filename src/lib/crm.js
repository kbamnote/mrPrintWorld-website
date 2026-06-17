/**
 * Lead submission — the quote form posts here.
 *
 * ⚠️  CONFIRM BEFORE LAUNCH (brief §13): the exact CRM endpoint URL, HTTP method,
 * payload shape and any auth/API key. This module centralises ALL of that so
 * wiring the real CRM is a one-file change.
 *
 * Configure without editing code via a .env file at the project root:
 *   VITE_CRM_ENDPOINT=https://crm.mrprintworld.com/api/leads
 *   VITE_CRM_API_KEY=xxxxxxxx           (optional; sent as Authorization: Bearer)
 *
 * If VITE_CRM_ENDPOINT is unset, submissions are simulated (resolve after a
 * short delay) and logged to the console so the form is fully testable in dev
 * without a live backend — nothing is silently lost.
 */

const ENDPOINT = import.meta.env.VITE_CRM_ENDPOINT || ''
const API_KEY = import.meta.env.VITE_CRM_API_KEY || ''
const SOURCE = 'mrprintworld.com'

/**
 * @param {{name:string, phone:string, service:string, message:string, email?:string}} lead
 * @returns {Promise<{ok:true, simulated?:boolean}>}
 * @throws {Error} on network / non-2xx responses (caller shows the error state)
 */
export async function submitLead(lead) {
  const payload = {
    name: lead.name?.trim(),
    phone: lead.phone?.trim(),
    email: lead.email?.trim() || '',
    service: lead.service || '',
    message: lead.message?.trim() || '',
    source: SOURCE,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
  }

  // No endpoint configured yet → simulate so the form is testable end-to-end.
  if (!ENDPOINT) {
    console.info('[CRM simulated submit] set VITE_CRM_ENDPOINT to go live:', payload)
    await new Promise((r) => setTimeout(r, 900))
    return { ok: true, simulated: true }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`CRM responded ${res.status}`)
    return { ok: true }
  } finally {
    clearTimeout(timeout)
  }
}
