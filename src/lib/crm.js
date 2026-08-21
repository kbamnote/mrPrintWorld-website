/**
 * Lead submission — every quote / contact form on the site posts through here.
 *
 * Delivery is EmailJS: the browser sends the lead straight to the connected
 * Gmail account, so there is no backend to run or maintain.
 *
 * Configure via a .env file at the project root (and the matching Environment
 * Variables in Vercel — Vite inlines these at BUILD time, so a redeploy is
 * required after changing them):
 *
 *   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
 *
 * All three are public by design — EmailJS keys are meant to ship in the
 * bundle. Lock them down in the EmailJS dashboard under Account → Security by
 * restricting the allowed domain to mrprintworld.com, or the quota is open to
 * anyone who reads the JS.
 *
 * If the keys are missing, submitLead THROWS. That is deliberate: the form must
 * show its error state rather than a success screen for mail that never sent.
 */

import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const SOURCE = 'mrprintworld.com'

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

/** Human-readable label for a field that wasn't filled in. */
const or = (v, fallback = '—') => {
  const s = typeof v === 'string' ? v.trim() : v
  return s ? String(s) : fallback
}

/**
 * The two forms on the site use different key names for the same things
 * (Contact sends `service` / `companyName`, Request-a-Quote sends
 * `serviceInterest` / `company`). Normalise both here so neither can silently
 * drop a field.
 */
function normalise(lead) {
  return {
    name: or(lead.name),
    phone: or(lead.phone),
    email: or(lead.email),
    companyName: or(lead.companyName ?? lead.company),
    service: or(lead.service ?? lead.serviceInterest),
    product: or(lead.product ?? lead.productInterest),
    quantity: or(lead.quantity),
    dimensions: or(lead.dimensions),
    material: or(lead.material),
    timeline: or(lead.timeline),
    message: or(lead.message),
  }
}

/**
 * Sends the lead as an email via EmailJS.
 *
 * @param {object} lead - raw form state from either form
 * @returns {Promise<{ok:true}>}
 * @throws {Error} if EmailJS is unconfigured or the send fails — the caller
 *                 shows its error state and the visitor is told to retry.
 */
export async function submitLead(lead) {
  const f = normalise(lead)
  const page = typeof window !== 'undefined' ? window.location.pathname : ''

  if (!isConfigured) {
    throw new Error(
      'Lead delivery is not configured — set VITE_EMAILJS_SERVICE_ID, ' +
        'VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY, then redeploy.',
    )
  }

  // A plain-text block so the email is readable even if the EmailJS template
  // only renders {{message_body}}. Individual fields are sent too, so the
  // template can lay them out properly.
  const message_body = [
    `Name:       ${f.name}`,
    `Phone:      ${f.phone}`,
    `Email:      ${f.email}`,
    `Company:    ${f.companyName}`,
    '',
    `Service:    ${f.service}`,
    `Product:    ${f.product}`,
    `Quantity:   ${f.quantity}`,
    `Dimensions: ${f.dimensions}`,
    `Material:   ${f.material}`,
    `Timeline:   ${f.timeline}`,
    '',
    'Message:',
    f.message,
    '',
    `— sent from ${SOURCE}${page} at ${new Date().toLocaleString('en-IN')}`,
  ].join('\n')

  const params = {
    ...f,
    // Convenience aliases for EmailJS's default template variable names.
    from_name: f.name,
    reply_to: f.email,
    subject: `New enquiry from ${f.name}${f.service !== '—' ? ` — ${f.service}` : ''}`,
    source: SOURCE,
    page,
    submitted_at: new Date().toLocaleString('en-IN'),
    message_body,
  }

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY })
  return { ok: true }
}
