import { useRef, useState } from 'react'
import { applyVidarbha } from '../../lib/api'
import { VIDARBHA_CITIES } from '../../data/vidarbha'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import Reveal from '../primitives/Reveal'

const MAX_RESUME = 5 * 1024 * 1024
const RESUME_TYPES = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const field =
  'w-full rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

/**
 * Hiring across Vidarbha: a card per district, and a short form for the one
 * chosen. There need not be a job listed for that district — the application
 * is filed against the city and reaches the admin panel as
 * "Vidarbha Hiring — Nagpur".
 */
export default function VidarbhaHiring() {
  const [city, setCity] = useState(null)

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">We are hiring across Vidarbha</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choose your district and tell us what work you do. You do not need to match a listed job.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {VIDARBHA_CITIES.map((name, i) => {
          const active = city === name
          return (
            <Reveal key={name} delay={Math.min(i, 8) * 0.03}>
              <button
                type="button"
                onClick={() => setCity(active ? null : name)}
                aria-pressed={active}
                className={`group flex w-full items-center gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-all ${
                  active
                    ? 'border-primary bg-primary text-white shadow-card'
                    : 'border-line bg-white text-ink shadow-sm hover:border-primary hover:shadow-card'
                }`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                    active ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Icon name="map-pin" size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{name}</span>
                  <span className={`block text-xs ${active ? 'text-white/80' : 'text-ink-soft'}`}>
                    {active ? 'Selected' : 'Apply here'}
                  </span>
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>

      {city ? (
        <CityForm key={city} city={city} onClose={() => setCity(null)} />
      ) : (
        <p className="mt-6 text-center text-sm text-ink-soft">Tap a district to apply.</p>
      )}
    </div>
  )
}

function CityForm({ city, onClose }) {
  const [status, setStatus] = useState({ sending: false, error: null, done: false })
  const [fileError, setFileError] = useState(null)
  const fileRef = useRef(null)

  function checkFile(e) {
    const file = e.target.files?.[0]
    setFileError(file && file.size > MAX_RESUME ? 'Your resume must be smaller than 5 MB' : null)
  }

  async function submit(e) {
    e.preventDefault()
    if (fileError) return
    const fd = new FormData(e.currentTarget)
    // An empty file input still sends an empty part; leave it out instead.
    if (!fileRef.current?.files?.length) fd.delete('resume')
    setStatus({ sending: true, error: null, done: false })
    try {
      await applyVidarbha(city, fd)
      setStatus({ sending: false, error: null, done: true })
    } catch (err) {
      setStatus({ sending: false, error: err.message ?? 'Could not send your application. Please try again.', done: false })
    }
  }

  if (status.done) {
    return (
      <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name="check" size={30} />
        </span>
        <h3 className="mb-2 font-display text-2xl font-bold text-ink">Application sent</h3>
        <p className="mb-6 text-sm text-ink-soft">
          Thank you. Our team will call you about work in <strong className="text-ink">{city}</strong>.
        </p>
        <Button onClick={onClose} variant="outline">
          Apply for another district
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">Apply for work in {city}</h3>
          <p className="mt-1 text-sm text-ink-soft">Takes two minutes. No account needed.</p>
        </div>
        <button type="button" onClick={onClose} className="text-sm font-medium text-ink-soft hover:text-ink">
          Close
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="vid-name">Full Name *</label>
          <input id="vid-name" name="name" required minLength={2} maxLength={100} className={field} autoComplete="name" placeholder="Enter your full name" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-phone">Phone Number *</label>
          <input id="vid-phone" name="phone" type="tel" required maxLength={18} className={field} autoComplete="tel" placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-email">Email Address *</label>
          <input id="vid-email" name="email" type="email" required maxLength={160} className={field} autoComplete="email" placeholder="name@example.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-district">District *</label>
          <input id="vid-district" name="city" value={city} readOnly className={`${field} bg-gray-50 font-medium`} />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-taluka">City / Taluka *</label>
          <input id="vid-taluka" name="taluka" required maxLength={80} className={field} placeholder="e.g. Hingna, Umred" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-age">Age</label>
          <input id="vid-age" name="age" type="number" min={18} max={70} className={field} placeholder="e.g. 25" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-occ">Current Occupation</label>
          <input id="vid-occ" name="currentOccupation" maxLength={120} className={field} placeholder="e.g. Sales Executive, Business" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-salesexp">Sales Experience</label>
          <select id="vid-salesexp" name="salesExperience" className={field} defaultValue="">
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher (0 Years)</option>
            <option value="1-2 Years">1 - 2 Years</option>
            <option value="3-5 Years">3 - 5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-prevind">Previous Industry</label>
          <input id="vid-prevind" name="previousIndustry" maxLength={120} className={field} placeholder="e.g. Printing, FMCG, Telecom" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-currsal">Current / Last Salary</label>
          <input id="vid-currsal" name="currentSalary" maxLength={60} className={field} placeholder="e.g. ₹15,000 / month" />
        </div>
        <div>
          <label className={labelClass} htmlFor="vid-expected">Expected Salary</label>
          <input id="vid-expected" name="expectedSalary" maxLength={60} className={field} placeholder="e.g. ₹20,000 / month" />
        </div>

        {/* Requirements & Checklist (Yes/No) */}
        <div className="md:col-span-2 mt-2 pt-4 border-t border-line">
          <h4 className="font-bold text-sm text-ink mb-3">Work Requirements &amp; Assets</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="vid-bike">Two-wheeler?</label>
              <select id="vid-bike" name="hasTwoWheeler" className={field} defaultValue="Yes">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="vid-android">Android Phone?</label>
              <select id="vid-android" name="hasAndroidPhone" className={field} defaultValue="Yes">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="vid-laptop">Laptop?</label>
              <select id="vid-laptop" name="hasLaptop" className={field} defaultValue="No">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="vid-field">Full-time Field Work?</label>
              <select id="vid-field" name="fullTimeFieldWork" className={field} defaultValue="Yes">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="vid-team">Team Handling Exp.?</label>
              <select id="vid-team" name="teamHandlingExp" className={field} defaultValue="No">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="vid-join">Immediate Joining?</label>
              <select id="vid-join" name="immediateJoining" className={field} defaultValue="Yes">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 pt-2">
          <label className={labelClass} htmlFor="vid-resume">
            CV / Resume Upload <span className="font-normal text-ink-soft">(PDF or Word, up to 5 MB)</span>
          </label>
          <input
            ref={fileRef}
            id="vid-resume"
            name="resume"
            type="file"
            accept={RESUME_TYPES}
            onChange={checkFile}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-[var(--radius-card)] file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-medium file:text-primary hover:file:bg-primary/15"
          />
          {fileError && <p className="mt-1 text-sm text-red-700">{fileError}</p>}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="vid-message">Additional Notes / Message</label>
          <textarea id="vid-message" name="message" rows={3} maxLength={2000} className={field} placeholder="Tell us anything else about your experience..." />
        </div>
      </div>

      {/* Hidden from people; only bots fill it in. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status.error && (
        <p className="mt-4 rounded-[var(--radius-card)] bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {status.error}
        </p>
      )}

      <Button type="submit" variant="primary" className="mt-6 w-full justify-center sm:w-auto" disabled={status.sending}>
        {status.sending ? 'Sending…' : `Apply for ${city}`}
      </Button>
      <p className="mt-3 text-xs text-ink-soft">Your details are only seen by our hiring team.</p>
    </form>
  )
}
