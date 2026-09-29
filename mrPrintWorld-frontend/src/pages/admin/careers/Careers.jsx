import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as api from '../adminApi'
import { useCanDelete } from '../authContext'
import { Badge, Btn, Drawer, EmptyState, ErrorBanner, Field, Input, Select, Spinner, Textarea } from '../ui'

const STATUSES = {
  NEW: { label: 'New', tone: 'amber' },
  REVIEWED: { label: 'Reviewed', tone: 'blue' },
  SHORTLISTED: { label: 'Shortlisted', tone: 'green' },
  REJECTED: { label: 'Not selected', tone: 'red' },
  HIRED: { label: 'Hired', tone: 'green' },
}
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract']
const when = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

/**
 * Careers in the admin panel: applications from the website (default), and
 * the jobs shown there. Both admin and staff use it.
 */
export default function Careers() {
  const [params, setParams] = useSearchParams()
  const asked = params.get('tab')
  const tab = ['jobs', 'partners'].includes(asked) ? asked : 'applications'

  const setTab = (next) => {
    const p = new URLSearchParams()
    if (next !== 'applications') p.set('tab', next)
    setParams(p)
  }
  const tabClass = (active) =>
    `border-b-2 px-1 pb-2 text-sm font-medium transition-colors ${
      active ? 'border-primary text-primary' : 'border-transparent text-ink-soft hover:text-ink'
    }`

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Careers</h1>
        <p className="mt-1 text-sm text-ink-soft">Applications from the website’s Careers page, and the jobs listed there.</p>
      </div>
      <div className="flex gap-6 border-b border-line">
        <button type="button" className={tabClass(tab === 'applications')} onClick={() => setTab('applications')}>
          Applications
        </button>
        <button type="button" className={tabClass(tab === 'jobs')} onClick={() => setTab('jobs')}>
          Jobs
        </button>
        <button type="button" className={tabClass(tab === 'partners')} onClick={() => setTab('partners')}>
          Channel partners
        </button>
      </div>
      {tab === 'jobs' && <Jobs />}
      {tab === 'partners' && <Partners />}
      {tab === 'applications' && <Applications />}
    </div>
  )
}

/* ── Applications ──────────────────────────────────────────────────────── */

function Applications() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const job = params.get('job') ?? ''
  // JOB — applied for a listed job; VIDARBHA — applied from a district card.
  const source = params.get('source') ?? ''
  const city = params.get('city') ?? ''
  const search = params.get('search') ?? ''
  const [typed, setTyped] = useState(search)
  const [jobs, setJobs] = useState([])
  const [state, setState] = useState({ loading: true, error: null, items: [], meta: null })
  const [openId, setOpenId] = useState(null)

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  // The current list stays on screen until the new one arrives.
  const load = useCallback(() => {
    api
      .listApplications({ status, job, source, city, search, limit: 100 })
      .then(({ items, meta }) => setState({ loading: false, error: null, items, meta }))
      .catch((error) => setState({ loading: false, error, items: [], meta: null }))
  }, [status, job, source, city, search])

  useEffect(load, [load])
  useEffect(() => {
    api.listJobs().then(setJobs).catch(() => setJobs([]))
  }, [])

  const counts = state.meta?.counts ?? {}
  const all = Object.values(counts).reduce((a, b) => a + b, 0)
  const chip = (active) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
      active ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:border-primary'
    }`

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(!status)} onClick={() => set('status', '')}>
          All {state.meta ? `(${all})` : ''}
        </button>
        {Object.entries(STATUSES).map(([key, s]) => (
          <button key={key} type="button" className={chip(status === key)} onClick={() => set('status', key)}>
            {s.label} {state.meta ? `(${counts[key] ?? 0})` : ''}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: '', label: 'Everything' },
          { id: 'JOB', label: 'Job applications' },
          { id: 'VIDARBHA', label: 'Vidarbha hiring' },
        ].map((s) => (
          <button key={s.id || 'all'} type="button" className={chip(source === s.id)} onClick={() => set('source', s.id)}>
            {s.label}
          </button>
        ))}
        {city && (
          <button type="button" className={chip(true)} onClick={() => set('city', '')} title="Clear district">
            {city} ×
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={job} onChange={(e) => set('job', e.target.value)} className="max-w-xs">
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </Select>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            set('search', typed.trim())
          }}
          className="flex gap-2"
        >
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Name, phone, email or city" />
          <Btn type="submit" variant="outline">
            Search
          </Btn>
        </form>
      </div>

      <ErrorBanner error={state.error} />

      {state.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : state.items.length === 0 ? (
        <EmptyState
          title="No applications here"
          description={status || job || search ? 'Try another filter.' : 'Applications from the Careers page will appear here.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Job</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Applied</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setOpenId(a.id)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-surface/60"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{a.name}</span>
                    <span className="block text-xs text-ink-soft">
                      {a.phone}
                      {a.city ? ` · ${a.city}` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{a.jobTitle}</td>
                  <td className="px-4 py-3 text-ink-soft">{a.experience || '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{when(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUSES[a.status]?.tone ?? 'neutral'}>{STATUSES[a.status]?.label ?? a.status}</Badge>
                    {a.resume?.file && <span className="ml-2 text-xs text-ink-soft">resume</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={Boolean(openId)} onClose={() => setOpenId(null)}>
        {openId && (
          <ApplicationDetail
            key={openId}
            application={state.items.find((a) => a.id === openId)}
            onClose={() => setOpenId(null)}
            onChanged={load}
          />
        )}
      </Drawer>
    </div>
  )
}

function ApplicationDetail({ application: a, onClose, onChanged }) {
  const canDelete = useCanDelete()
  const [notes, setNotes] = useState(a?.notes ?? '')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!a) return null
  const phoneDigits = a.phone.replace(/[^\d]/g, '')
  const whatsapp = `https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}`

  async function save(body) {
    setBusy(true)
    setError(null)
    try {
      await api.updateApplication(a.id, body)
      onChanged()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  async function openResume() {
    // Opened before the fetch, or the browser blocks it as a pop-up.
    const tab = window.open('', '_blank')
    try {
      const blob = await api.fetchResume(a.id)
      const url = URL.createObjectURL(blob)
      if (tab) tab.location.href = url
      else window.location.href = url
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (err) {
      tab?.close()
      setError(err)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${a.name}'s application? This cannot be undone.`)) return
    try {
      await api.deleteApplication(a.id)
      onChanged()
      onClose()
    } catch (err) {
      setError(err)
    }
  }

  const row = (label, value) =>
    value ? (
      <div className="flex gap-3 py-1.5 text-sm">
        <dt className="w-32 shrink-0 text-ink-soft">{label}</dt>
        <dd className="text-ink">{value}</dd>
      </div>
    ) : null

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">{a.name}</h2>
          <p className="text-sm text-ink-soft">
            {a.jobTitle} · applied {when(a.createdAt)}
          </p>
        </div>
        <Btn variant="ghost" size="sm" onClick={onClose}>
          Close
        </Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="flex flex-wrap gap-2">
        <a href={`tel:${a.phone}`} className="inline-flex items-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-gray-50">
          Call {a.phone}
        </a>
        <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-gray-50">
          WhatsApp
        </a>
        <a href={`mailto:${a.email}`} className="inline-flex items-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-gray-50">
          Email
        </a>
        {a.resume?.file && (
          <Btn size="sm" onClick={openResume}>
            Open resume
          </Btn>
        )}
      </div>

      <dl className="rounded-[var(--radius-lg)] border border-line bg-white px-4 py-2">
        {row('Email', a.email)}
        {row('District', a.city)}
        {row('City / Taluka', a.taluka)}
        {row('Age', a.age)}
        {row('Current Occupation', a.currentOccupation)}
        {row('Sales Experience', a.salesExperience || a.experience)}
        {row('Previous Industry', a.previousIndustry)}
        {row('Current salary', a.currentSalary)}
        {row('Expected salary', a.expectedSalary)}
        {row('Two-wheeler', a.hasTwoWheeler)}
        {row('Android Phone', a.hasAndroidPhone)}
        {row('Laptop', a.hasLaptop)}
        {row('Full-time field work', a.fullTimeFieldWork)}
        {row('Team handling exp.', a.teamHandlingExp)}
        {row('Immediate joining', a.immediateJoining)}
        {row('Resume', a.resume?.file ? `${a.resume.name} (${Math.max(1, Math.round((a.resume.size ?? 0) / 1024))} KB)` : 'Not uploaded')}
        {a.message && (
          <div className="py-1.5 text-sm">
            <dt className="mb-1 text-ink-soft">Message / Notes</dt>
            <dd className="whitespace-pre-line text-ink">{a.message}</dd>
          </div>
        )}
      </dl>

      <section className="space-y-3 rounded-[var(--radius-lg)] border border-line bg-white p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUSES).map(([key, s]) => (
            <Btn key={key} size="sm" variant={a.status === key ? 'primary' : 'outline'} disabled={busy || a.status === key} onClick={() => save({ status: key })}>
              {s.label}
            </Btn>
          ))}
        </div>
        <Field label="Notes for the team">
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} placeholder="e.g. Called on Monday, interview Thursday 11am" />
        </Field>
        <Btn size="sm" variant="outline" disabled={busy || notes === (a.notes ?? '')} onClick={() => save({ notes })}>
          Save notes
        </Btn>
        {a.reviewedAt && <p className="text-xs text-ink-soft">Last updated {when(a.reviewedAt)}</p>}
      </section>

      {canDelete && (
        <Btn variant="danger" size="sm" onClick={remove}>
          Delete application
        </Btn>
      )}
    </div>
  )
}

/* ── Jobs ──────────────────────────────────────────────────────────────── */

function Jobs() {
  const canDelete = useCanDelete()
  const [, setParams] = useSearchParams()
  const [state, setState] = useState({ loading: true, error: null, jobs: [] })
  const [editing, setEditing] = useState(null) // job | 'new'

  const load = useCallback(() => {
    api
      .listJobs()
      .then((jobs) => setState({ loading: false, error: null, jobs }))
      .catch((error) => setState({ loading: false, error, jobs: [] }))
  }, [])
  useEffect(load, [load])

  async function toggle(job) {
    try {
      await api.updateJob(job.id, { isOpen: !job.isOpen })
      load()
    } catch (error) {
      setState((s) => ({ ...s, error }))
    }
  }

  async function remove(job) {
    if (!window.confirm(`Delete "${job.title}"? Its applications are kept.`)) return
    try {
      await api.deleteJob(job.id)
      load()
    } catch (error) {
      setState((s) => ({ ...s, error }))
    }
  }

  const open = state.jobs.filter((j) => j.isOpen).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {open} open on the website · {state.jobs.length - open} closed
        </p>
        <Btn onClick={() => setEditing('new')}>New job</Btn>
      </div>

      <ErrorBanner error={state.error} onDismiss={() => setState((s) => ({ ...s, error: null }))} />

      {state.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : state.jobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="Add a job and it appears on the website's Careers page." action={<Btn onClick={() => setEditing('new')}>New job</Btn>} />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-line bg-white">
          {state.jobs.map((job) => (
            <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0">
              <div className="min-w-0">
                <span className="font-medium text-ink">{job.title}</span>
                <span className="block text-xs text-ink-soft">
                  {job.department} · {job.type}
                  {job.salary ? ` · ${job.salary}` : ''}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={job.isOpen ? 'green' : 'neutral'}>{job.isOpen ? 'Open' : 'Closed'}</Badge>
                <button
                  type="button"
                  onClick={() => setParams({ job: job.id })}
                  className="text-xs font-medium text-primary hover:underline"
                  title="See this job's applications"
                >
                  {job.applications} application{job.applications === 1 ? '' : 's'}
                  {job.newApplications > 0 ? ` (${job.newApplications} new)` : ''}
                </button>
                <Btn variant="outline" size="sm" onClick={() => toggle(job)}>
                  {job.isOpen ? 'Close' : 'Reopen'}
                </Btn>
                <Btn variant="ghost" size="sm" onClick={() => setEditing(job)}>
                  Edit
                </Btn>
                {canDelete && (
                  <Btn variant="ghost" size="sm" onClick={() => remove(job)}>
                    Delete
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={Boolean(editing)} onClose={() => setEditing(null)}>
        {editing && (
          <JobForm
            key={editing === 'new' ? 'new' : editing.id}
            job={editing === 'new' ? null : editing}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null)
              load()
            }}
          />
        )}
      </Drawer>
    </div>
  )
}

const lines = (text) =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

function JobForm({ job, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    title: job?.title ?? '',
    department: job?.department ?? '',
    location: job?.location ?? 'Nagpur, Maharashtra',
    type: job?.type ?? 'Full-time',
    experience: job?.experience ?? '',
    salary: job?.salary ?? '',
    summary: job?.summary ?? '',
    responsibilities: (job?.responsibilities ?? []).join('\n'),
    requirements: (job?.requirements ?? []).join('\n'),
    isOpen: job?.isOpen ?? true,
  }))
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const body = {
      ...form,
      responsibilities: lines(form.responsibilities),
      requirements: lines(form.requirements),
    }
    try {
      if (job) await api.updateJob(job.id, body)
      else await api.createJob(body)
      onSaved()
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink">{job ? 'Edit job' : 'New job'}</h2>
        <Btn variant="ghost" size="sm" onClick={onClose}>
          Close
        </Btn>
      </div>
      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <Field label="Job title" required>
        <Input value={form.title} onChange={set('title')} required minLength={2} maxLength={120} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Department" required hint="e.g. Design, Production, Sales">
          <Input value={form.department} onChange={set('department')} required minLength={2} maxLength={60} />
        </Field>
        <Field label="Type">
          <Select value={form.type} onChange={set('type')}>
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={set('location')} maxLength={80} />
        </Field>
        <Field label="Experience" hint="e.g. 1–3 years">
          <Input value={form.experience} onChange={set('experience')} maxLength={60} />
        </Field>
      </div>
      <Field label="Salary" hint="Shown on the website, e.g. ₹15,000 – ₹25,000 / month. Leave blank to hide.">
        <Input value={form.salary} onChange={set('salary')} maxLength={80} />
      </Field>
      <Field label="Summary" hint="One or two sentences shown on the job card.">
        <Textarea rows={3} value={form.summary} onChange={set('summary')} maxLength={600} />
      </Field>
      <Field label="What they will do" hint="One point per line.">
        <Textarea rows={5} value={form.responsibilities} onChange={set('responsibilities')} />
      </Field>
      <Field label="What we are looking for" hint="One point per line.">
        <Textarea rows={4} value={form.requirements} onChange={set('requirements')} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={form.isOpen} onChange={set('isOpen')} /> Open — show it on the website
      </label>

      <Btn type="submit" disabled={saving}>
        {saving ? 'Saving…' : job ? 'Save changes' : 'Add job'}
      </Btn>
    </form>
  )
}

/* ── Channel Partners ─────────────────────────────────────────────────── */

const PARTNER_STATUSES = {
  NEW: { label: 'New', tone: 'amber' },
  CONTACTED: { label: 'Contacted', tone: 'blue' },
  APPROVED: { label: 'Approved', tone: 'green' },
  REJECTED: { label: 'Rejected', tone: 'red' },
}

function Partners() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const search = params.get('search') ?? ''
  const [typed, setTyped] = useState(search)
  const [state, setState] = useState({ loading: true, error: null, items: [], meta: null })
  const [openId, setOpenId] = useState(null)

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const load = useCallback(() => {
    api
      .listPartners({ status, search, limit: 100 })
      .then(({ items, meta }) => setState({ loading: false, error: null, items, meta }))
      .catch((error) => setState({ loading: false, error, items: [], meta: null }))
  }, [status, search])

  useEffect(load, [load])

  const counts = state.meta?.counts ?? {}
  const all = Object.values(counts).reduce((a, b) => a + b, 0)
  const chip = (active) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
      active ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:border-primary'
    }`

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(!status)} onClick={() => set('status', '')}>
          All {state.meta ? `(${all})` : ''}
        </button>
        {Object.entries(PARTNER_STATUSES).map(([key, s]) => (
          <button key={key} type="button" className={chip(status === key)} onClick={() => set('status', key)}>
            {s.label} {state.meta ? `(${counts[key] ?? 0})` : ''}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            set('search', typed.trim())
          }}
          className="flex gap-2"
        >
          <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Name, firm, phone, email or city" />
          <Btn type="submit" variant="outline">
            Search
          </Btn>
        </form>
      </div>

      <ErrorBanner error={state.error} />

      {state.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : state.items.length === 0 ? (
        <EmptyState
          title="No partner enquiries here"
          description={status || search ? 'Try another filter.' : 'Channel partner enquiries from the Careers page will appear here.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 font-semibold">Applicant / Firm</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Business type</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setOpenId(p.id)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-surface/60"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{p.name}</span>
                    <span className="block text-xs text-ink-soft">
                      {p.firm ? `${p.firm} · ` : ''}
                      {p.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{p.city}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.businessType || '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{when(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={PARTNER_STATUSES[p.status]?.tone ?? 'neutral'}>
                      {PARTNER_STATUSES[p.status]?.label ?? p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={Boolean(openId)} onClose={() => setOpenId(null)}>
        {openId && (
          <PartnerDetail
            key={openId}
            partner={state.items.find((p) => p.id === openId)}
            onClose={() => setOpenId(null)}
            onChanged={load}
          />
        )}
      </Drawer>
    </div>
  )
}

function PartnerDetail({ partner: p, onClose, onChanged }) {
  const canDelete = useCanDelete()
  const [notes, setNotes] = useState(p?.notes ?? '')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!p) return null
  const phoneDigits = p.phone.replace(/[^\d]/g, '')
  const whatsapp = `https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}`

  async function save(body) {
    setBusy(true)
    setError(null)
    try {
      await api.updatePartner(p.id, body)
      onChanged()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${p.name}'s enquiry? This cannot be undone.`)) return
    try {
      await api.deletePartner(p.id)
      onChanged()
      onClose()
    } catch (err) {
      setError(err)
    }
  }

  const row = (label, value) =>
    value ? (
      <div className="flex gap-3 py-1.5 text-sm">
        <dt className="w-32 shrink-0 text-ink-soft">{label}</dt>
        <dd className="text-ink">{value}</dd>
      </div>
    ) : null

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">{p.name}</h2>
          <p className="text-sm text-ink-soft">
            Channel Partner Enquiry · {when(p.createdAt)}
          </p>
        </div>
        <Btn variant="ghost" size="sm" onClick={onClose}>
          Close
        </Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="flex flex-wrap gap-2">
        <a href={`tel:${p.phone}`} className="inline-flex items-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-gray-50">
          Call {p.phone}
        </a>
        <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-gray-50">
          WhatsApp
        </a>
        <a href={`mailto:${p.email}`} className="inline-flex items-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-gray-50">
          Email
        </a>
      </div>

      <dl className="rounded-[var(--radius-lg)] border border-line bg-white px-4 py-2">
        {row('Firm / Shop', p.firm)}
        {row('Phone', p.phone)}
        {row('Email', p.email)}
        {row('City', p.city)}
        {row('Business type', p.businessType)}
        {row('Years in business', p.years)}
        {p.message && (
          <div className="py-1.5 text-sm">
            <dt className="mb-1 text-ink-soft">Business details / Message</dt>
            <dd className="whitespace-pre-line text-ink">{p.message}</dd>
          </div>
        )}
      </dl>

      <section className="space-y-3 rounded-[var(--radius-lg)] border border-line bg-white p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PARTNER_STATUSES).map(([key, s]) => (
            <Btn key={key} size="sm" variant={p.status === key ? 'primary' : 'outline'} disabled={busy || p.status === key} onClick={() => save({ status: key })}>
              {s.label}
            </Btn>
          ))}
        </div>
        <Field label="Notes for the team">
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} placeholder="e.g. Discussed margins, follow-up scheduled for next week" />
        </Field>
        <Btn size="sm" variant="outline" disabled={busy || notes === (p.notes ?? '')} onClick={() => save({ notes })}>
          Save notes
        </Btn>
        {p.reviewedAt && <p className="text-xs text-ink-soft">Last updated {when(p.reviewedAt)}</p>}
      </section>

      {canDelete && (
        <Btn variant="danger" size="sm" onClick={remove}>
          Delete enquiry
        </Btn>
      )}
    </div>
  )
}
