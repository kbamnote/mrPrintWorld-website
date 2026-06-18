import { useId, useMemo, useState } from 'react'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Icon from '../primitives/Icon'
import { submitLead } from '../../lib/crm'
import { company, pending, whatsappLink } from '../../data/company'
import { services } from '../../data/services'

const serviceOptions = [...services.map((s) => s.title), 'Not sure / Other']

function Pending() {
  return <span className="ml-1 text-[0.68rem] italic text-white/40">(to be confirmed)</span>
}

export default function ContactSection({ embedded = false }) {
  const ids = useId()
  // Lightweight challenge (anti-spam) — generated once per mount.
  const challenge = useMemo(
    () => ({ a: 1 + Math.floor(Math.random() * 8), b: 1 + Math.floor(Math.random() * 8) }),
    [],
  )

  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
    answer: '',
    company_website: '', // honeypot
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[+()\d][\d\s()-]{7,}$/.test(form.phone.trim()))
      e.phone = 'Enter a valid phone number.'
    if (!form.service) e.service = 'Please choose a service.'
    if (Number(form.answer) !== challenge.a + challenge.b)
      e.answer = 'Please answer the quick check.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    if (status === 'submitting') return

    // Honeypot: a real user never fills this. Pretend success, send nothing.
    if (form.company_website) {
      setStatus('success')
      return
    }
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setStatus('submitting')
    try {
      await submitLead({
        name: form.name,
        phone: form.phone,
        service: form.service,
        message: form.message,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full rounded-[var(--radius-card)] border bg-white px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus:border-primary focus:outline-none'

  return (
    <Section id="contact" tone={embedded ? 'default' : 'surface'}>
      {!embedded && (
        <SectionHeading
          eyebrow="Let’s talk"
          title="Tell us what you need to brand."
          intro="Share a few details and our team will come back with a quote. Prefer to talk now? WhatsApp or call us directly."
          className="mb-12"
        />
      )}

      <div className="grid overflow-hidden rounded-[var(--radius-lg)] border border-line lg:grid-cols-2">
        {/* Details — dark pane */}
        <div className="flex flex-col gap-8 bg-dark p-8 text-white md:p-10">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">
              Reach us directly
            </h3>
            <p className="mt-2 text-white/55">
              {company.city}, {company.region} — serving Central India and beyond.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-card)] bg-[#25D366] px-5 py-3 font-medium text-white transition-transform hover:scale-[1.02]"
            >
              <Icon name="whatsapp" size={20} /> WhatsApp
            </a>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-[var(--radius-card)] border border-white/25 px-5 py-3 font-medium text-white transition-colors hover:border-white/60"
            >
              <Icon name="phone" size={18} /> Call now
            </a>
          </div>

          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-accent" />
              <span className="text-white/70">
                {company.phoneDisplay}
                {pending.phone && <Pending />}
              </span>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-accent" />
              <span className="text-white/70">
                {company.email}
                {pending.email && <Pending />}
              </span>
            </li>
            {company.addresses.map((addr) => (
              <li key={addr.label} className="flex gap-3">
                <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-accent" />
                <span className="text-white/70">
                  <span className="block font-medium text-white/85">{addr.label}</span>
                  {addr.lines.join(' ')}
                </span>
              </li>
            ))}
          </ul>

          {/* Map */}
          <div className="mt-auto overflow-hidden rounded-[var(--radius-card)] border border-dark-line">
            {company.mapEmbedUrl ? (
              <iframe
                src={company.mapEmbedUrl}
                title="MR Print World Pvt. Ltd. location map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-44 w-full"
              />
            ) : (
              <div className="flex h-44 flex-col items-center justify-center gap-2 bg-dark-soft text-white/40">
                <Icon name="map-pin" size={24} />
                <span className="text-xs">Google Map embed to be added</span>
              </div>
            )}
          </div>
        </div>

        {/* Form — light pane */}
        <div className="bg-white p-8 md:p-10">
          {status === 'success' ? (
            <div className="flex h-full flex-col items-start justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                <Icon name="check" size={28} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                Thank you — we’ve got it.
              </h3>
              <p className="mt-2 text-muted">
                Our team will review your request and get back to you shortly. For
                anything urgent, WhatsApp or call us directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: '',
                    phone: '',
                    service: '',
                    message: '',
                    answer: '',
                    company_website: '',
                  })
                  setStatus('idle')
                }}
                className="mt-6 font-medium text-primary hover:underline"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {/* Honeypot */}
              <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor={`${ids}-cw`}>Company website</label>
                <input
                  id={`${ids}-cw`}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company_website}
                  onChange={set('company_website')}
                />
              </div>

              <div>
                <label htmlFor={`${ids}-name`} className="mb-1.5 block text-sm font-medium text-ink">
                  Name
                </label>
                <input
                  id={`${ids}-name`}
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  aria-invalid={!!errors.name}
                  placeholder="Your full name"
                  className={`${field} ${errors.name ? 'border-red-400' : 'border-line'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor={`${ids}-phone`} className="mb-1.5 block text-sm font-medium text-ink">
                  Phone
                </label>
                <input
                  id={`${ids}-phone`}
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  aria-invalid={!!errors.phone}
                  placeholder="+91 …"
                  className={`${field} ${errors.phone ? 'border-red-400' : 'border-line'}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor={`${ids}-service`} className="mb-1.5 block text-sm font-medium text-ink">
                  Service interest
                </label>
                <select
                  id={`${ids}-service`}
                  value={form.service}
                  onChange={set('service')}
                  aria-invalid={!!errors.service}
                  className={`${field} ${errors.service ? 'border-red-400' : 'border-line'}`}
                >
                  <option value="">Select a service…</option>
                  {serviceOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service}</p>}
              </div>

              <div>
                <label htmlFor={`${ids}-msg`} className="mb-1.5 block text-sm font-medium text-ink">
                  Message <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  id={`${ids}-msg`}
                  rows={3}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us a little about your project…"
                  className={`${field} resize-none border-line`}
                />
              </div>

              <div>
                <label htmlFor={`${ids}-ans`} className="mb-1.5 block text-sm font-medium text-ink">
                  Quick check: what is {challenge.a} + {challenge.b}?
                </label>
                <input
                  id={`${ids}-ans`}
                  type="text"
                  inputMode="numeric"
                  value={form.answer}
                  onChange={set('answer')}
                  aria-invalid={!!errors.answer}
                  className={`${field} max-w-32 ${errors.answer ? 'border-red-400' : 'border-line'}`}
                />
                {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
              </div>

              {status === 'error' && (
                <p className="rounded-[var(--radius-card)] bg-red-50 px-4 py-3 text-sm text-red-700">
                  Something went wrong sending your request. Please try again, or
                  reach us on WhatsApp.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-card)] bg-primary px-6 py-3.5 font-medium text-white shadow-soft transition-all hover:bg-primary-700 hover:shadow-float disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === 'submitting' ? 'Sending…' : 'Request a Quote'}
                {status !== 'submitting' && <Icon name="arrow-right" size={18} />}
              </button>

              <p className="text-xs text-muted">
                We’ll only use your details to respond to this enquiry.
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}
