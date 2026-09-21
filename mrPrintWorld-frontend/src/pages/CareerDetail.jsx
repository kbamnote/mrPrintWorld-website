import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchJob, applyForJob } from '../lib/api'
import { useSeo, breadcrumbLd } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'

const MAX_RESUME = 5 * 1024 * 1024
const RESUME_TYPES = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

/** One job, and the form to apply for it. No account needed. */
export default function CareerDetail() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, error: null, job: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchJob(slug, { signal: controller.signal })
      .then((job) => setState({ loading: false, error: null, job }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ loading: false, error, job: null })
      })
    return () => controller.abort()
  }, [slug])

  const job = state.job
  useSeo({
    title: job ? `${job.title} — Careers | MRPrint World` : 'Careers | MRPrint World',
    description: job?.summary ?? 'Job opening at MRPrint World, Nagpur.',
    path: `/careers/${slug}`,
    jsonLd: job
      ? breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
          { name: job.title, path: `/careers/${slug}` },
        ])
      : undefined,
  })

  if (state.loading) {
    return (
      <section className="section-y bg-surface">
        <Container>
          <div className="h-64 animate-pulse rounded-[var(--radius-lg)] border border-line bg-white" />
        </Container>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="section-y bg-surface">
        <Container>
          <div className="mx-auto max-w-lg rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
            <h1 className="mb-2 font-display text-2xl font-bold text-ink">This job is no longer open</h1>
            <p className="mb-6 text-sm text-ink-soft">It may have been filled. Have a look at our other openings.</p>
            <Button to="/careers" variant="primary">See all openings</Button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="section-y bg-surface">
      <Container>
        <nav className="mb-6 text-sm text-ink-soft" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/careers" className="hover:text-primary">Careers</Link> /{' '}
          <span className="text-ink">{job.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm md:p-8">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{job.department}</div>
            <h1 className="mb-4 font-display text-3xl font-bold text-ink md:text-4xl">{job.title}</h1>
            <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5"><Icon name="map-pin" size={16} /> {job.location}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="briefcase" size={16} /> {job.type}</span>
              {job.experience && <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={16} /> {job.experience}</span>}
              {job.salary && <span className="font-semibold text-ink">{job.salary}</span>}
            </div>
            {job.summary && <p className="mb-8 text-ink-soft">{job.summary}</p>}

            {job.responsibilities?.length > 0 && (
              <>
                <h2 className="mb-3 text-lg font-bold text-ink">What you will do</h2>
                <ul className="mb-8 space-y-2">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2 text-ink-soft">
                      <Icon name="check" size={18} className="mt-0.5 shrink-0 text-primary" /> {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {job.requirements?.length > 0 && (
              <>
                <h2 className="mb-3 text-lg font-bold text-ink">What we are looking for</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex gap-2 text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" /> {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>

          <ApplyForm job={job} />
        </div>
      </Container>
    </section>
  )
}

function ApplyForm({ job }) {
  const [status, setStatus] = useState({ sending: false, error: null, done: false })
  const [fileError, setFileError] = useState(null)
  const fileRef = useRef(null)

  const field =
    'w-full rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
  const label = 'mb-1.5 block text-sm font-medium text-ink'

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
      await applyForJob(job.slug, fd)
      setStatus({ sending: false, error: null, done: true })
    } catch (err) {
      setStatus({ sending: false, error: err.message ?? 'Could not send your application. Please try again.', done: false })
    }
  }

  if (status.done) {
    return (
      <div className="h-fit rounded-[var(--radius-lg)] border border-line bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name="check" size={30} />
        </span>
        <h2 className="mb-2 font-display text-2xl font-bold text-ink">Application sent</h2>
        <p className="mb-6 text-sm text-ink-soft">
          Thank you for applying for <strong className="text-ink">{job.title}</strong>. Our team reviews every
          application and will call you if your profile fits.
        </p>
        <Button to="/careers" variant="outline">See other openings</Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="h-fit rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-24">
      <h2 className="mb-1 font-display text-2xl font-bold text-ink">Apply for this job</h2>
      <p className="mb-6 text-sm text-ink-soft">Takes two minutes. No account needed.</p>

      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="apply-name">Full name *</label>
          <input id="apply-name" name="name" required minLength={2} maxLength={100} className={field} autoComplete="name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="apply-phone">Phone *</label>
            <input id="apply-phone" name="phone" type="tel" required maxLength={18} className={field} autoComplete="tel" placeholder="+91" />
          </div>
          <div>
            <label className={label} htmlFor="apply-email">Email *</label>
            <input id="apply-email" name="email" type="email" required maxLength={160} className={field} autoComplete="email" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="apply-city">City</label>
            <input id="apply-city" name="city" maxLength={80} className={field} autoComplete="address-level2" />
          </div>
          <div>
            <label className={label} htmlFor="apply-experience">Experience</label>
            <input id="apply-experience" name="experience" maxLength={60} className={field} placeholder="e.g. 2 years" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="apply-current">Current salary</label>
            <input id="apply-current" name="currentSalary" maxLength={60} className={field} placeholder="per month" />
          </div>
          <div>
            <label className={label} htmlFor="apply-expected">Expected salary</label>
            <input id="apply-expected" name="expectedSalary" maxLength={60} className={field} placeholder="per month" />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="apply-resume">Resume <span className="font-normal text-ink-soft">(PDF or Word, up to 5 MB)</span></label>
          <input
            ref={fileRef}
            id="apply-resume"
            name="resume"
            type="file"
            accept={RESUME_TYPES}
            onChange={checkFile}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-[var(--radius-card)] file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-medium file:text-primary hover:file:bg-primary/15"
          />
          {fileError && <p className="mt-1 text-sm text-red-700">{fileError}</p>}
        </div>
        <div>
          <label className={label} htmlFor="apply-message">Anything you would like to tell us</label>
          <textarea id="apply-message" name="message" rows={4} maxLength={2000} className={field} />
        </div>
        {/* Hidden from people; only bots fill it in. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {status.error && (
          <p className="rounded-[var(--radius-card)] bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {status.error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full justify-center" disabled={status.sending}>
          {status.sending ? 'Sending…' : 'Send application'}
        </Button>
        <p className="text-center text-xs text-ink-soft">
          Your details are only seen by our hiring team.
        </p>
      </div>
    </form>
  )
}
