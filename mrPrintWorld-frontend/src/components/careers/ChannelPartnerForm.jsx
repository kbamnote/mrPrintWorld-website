import { useState } from 'react'
import { submitChannelPartner } from '../../lib/api'
import { BUSINESS_TYPES } from '../../data/vidarbha'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'

const field =
  'w-full rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

const POINTS = [
  'Sell our full range — printing, signage, gifting and branding — in your city',
  'Our production, your customers: no machines or staff to buy',
  'Trade rates, design support and marketing material from us',
]

/** Businesses applying to represent MRPrint World in their city. */
export default function ChannelPartnerForm() {
  const [status, setStatus] = useState({ sending: false, error: null, done: false })

  async function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body = Object.fromEntries([...form.entries()].filter(([, v]) => String(v).trim() !== ''))
    setStatus({ sending: true, error: null, done: false })
    try {
      await submitChannelPartner(body)
      setStatus({ sending: false, error: null, done: true })
    } catch (err) {
      setStatus({ sending: false, error: err.message ?? 'Could not send your enquiry. Please try again.', done: false })
    }
  }

  if (status.done) {
    return (
      <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-line bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name="check" size={30} />
        </span>
        <h3 className="mb-2 font-display text-2xl font-bold text-ink">Enquiry sent</h3>
        <p className="text-sm text-ink-soft">
          Thank you for your interest in partnering with us. Our team will call you to discuss the terms for your city.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Become a channel partner</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Run a printing press, stationery shop or advertising agency? Partner with us and offer your customers
          everything we make, without buying a single machine.
        </p>
        <ul className="mt-6 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-ink-soft">
              <Icon name="check" size={18} className="mt-0.5 shrink-0 text-primary" /> {point}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={submit} className="rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="cp-name">Your name *</label>
            <input id="cp-name" name="name" required minLength={2} maxLength={100} className={field} autoComplete="name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="cp-firm">Firm / shop name</label>
            <input id="cp-firm" name="firm" maxLength={120} className={field} autoComplete="organization" />
          </div>
          <div>
            <label className={labelClass} htmlFor="cp-phone">Phone *</label>
            <input id="cp-phone" name="phone" type="tel" required maxLength={18} className={field} autoComplete="tel" placeholder="+91" />
          </div>
          <div>
            <label className={labelClass} htmlFor="cp-email">Email *</label>
            <input id="cp-email" name="email" type="email" required maxLength={160} className={field} autoComplete="email" />
          </div>
          <div>
            <label className={labelClass} htmlFor="cp-city">City *</label>
            <input id="cp-city" name="city" required minLength={2} maxLength={80} className={field} autoComplete="address-level2" />
          </div>
          <div>
            <label className={labelClass} htmlFor="cp-business">Current business</label>
            <select id="cp-business" name="businessType" className={field} defaultValue="">
              <option value="">Select</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="cp-years">Years in business</label>
            <input id="cp-years" name="years" maxLength={40} className={field} placeholder="e.g. 8 years" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="cp-message">Tell us about your business</label>
            <textarea id="cp-message" name="message" rows={4} maxLength={2000} className={field} />
          </div>
        </div>

        {/* Hidden from people; only bots fill it in. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {status.error && (
          <p className="mt-4 rounded-[var(--radius-card)] bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {status.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="mt-6 w-full justify-center" disabled={status.sending}>
          {status.sending ? 'Sending…' : 'Send enquiry'}
        </Button>
      </form>
    </div>
  )
}
