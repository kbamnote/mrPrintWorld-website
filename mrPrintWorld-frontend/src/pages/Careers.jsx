import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchJobs } from '../lib/api'
import { useSeo, breadcrumbLd } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Reveal from '../components/primitives/Reveal'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'

const PERKS = [
  { icon: 'printing', title: 'Real print work', text: 'Offset, digital, large format and finishing under one roof — you see every job from design to delivery.' },
  { icon: 'trending-up', title: 'Room to grow', text: 'Learn new machines and skills on the job. Many of our supervisors started on the shop floor.' },
  { icon: 'users', title: 'A steady team', text: '12+ years in Nagpur, 50+ people, and customers who come back every year.' },
]

/**
 * The Careers page: why work here, then every open job, filterable by
 * department. Jobs are managed in the admin panel (Careers).
 */
export default function Careers() {
  const [state, setState] = useState({ loading: true, error: null, jobs: [] })
  const [department, setDepartment] = useState('all')

  useSeo({
    title: 'Careers at MRPrint World | Printing Jobs in Nagpur',
    description:
      'Join MRPrint World in Nagpur — openings for graphic designers, printing machine operators, sales, customer support, accounts and more.',
    path: '/careers',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Careers', path: '/careers' },
    ]),
  })

  useEffect(() => {
    const controller = new AbortController()
    fetchJobs({ signal: controller.signal })
      .then((jobs) => setState({ loading: false, error: null, jobs }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ loading: false, error, jobs: [] })
      })
    return () => controller.abort()
  }, [])

  const internships = useMemo(() => state.jobs.filter((j) => j.type === 'Internship'), [state.jobs])
  const regularJobs = useMemo(() => state.jobs.filter((j) => j.type !== 'Internship'), [state.jobs])

  const departments = useMemo(() => [...new Set(regularJobs.map((j) => j.department))].sort(), [regularJobs])
  const shown = department === 'all' ? regularJobs : regularJobs.filter((j) => j.department === department)

  const chip = (active) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:border-primary'
    }`

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build your career in print"
        intro="We are growing, and looking for people who take pride in good work — from the design desk to the press to the customer's door."
      />

      <section className="section-y bg-surface">
        <Container>
          {/* 
          <div className="mb-12 grid gap-4 md:grid-cols-3">
            {PERKS.map((perk, i) => (
              <Reveal key={perk.title} delay={i * 0.05}>
                <div className="h-full rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm">
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon name={perk.icon} size={22} />
                  </span>
                  <h2 className="mb-2 text-lg font-bold text-ink">{perk.title}</h2>
                  <p className="text-sm text-ink-soft">{perk.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          */}

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Open positions</h2>
              {!state.loading && !state.error && (
                <p className="mt-1 text-sm text-ink-soft">
                  {shown.length} opening{shown.length === 1 ? '' : 's'}
                  {department === 'all' ? '' : ` in ${department}`}
                </p>
              )}
            </div>
            {departments.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button type="button" className={chip(department === 'all')} onClick={() => setDepartment('all')}>
                  All
                </button>
                {departments.map((d) => (
                  <button key={d} type="button" className={chip(department === d)} onClick={() => setDepartment(d)}>
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {state.loading && (
            <div className="grid gap-4 md:grid-cols-2" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-[var(--radius-lg)] border border-line bg-white" />
              ))}
            </div>
          )}

          {state.error && (
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">Couldn&rsquo;t load the openings</h3>
              <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">Please refresh the page, or send your resume to us directly.</p>
              <Button to="/contact" variant="primary">Contact Us</Button>
            </div>
          )}

          {!state.loading && !state.error && shown.length === 0 && (
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">No openings right now</h3>
              <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">
                We are always happy to hear from good people. Get in touch and tell us what you do.
              </p>
              <Button to="/contact" variant="primary">Contact Us</Button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {shown.map((job, i) => (
              <Reveal key={job.slug} delay={Math.min(i, 8) * 0.04}>
                <Link
                  to={`/careers/${job.slug}`}
                  className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-card"
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{job.department}</div>
                  <h3 className="mb-2 text-lg font-bold text-ink group-hover:text-primary">{job.title}</h3>
                  {job.summary && <p className="mb-4 line-clamp-2 text-sm text-ink-soft">{job.summary}</p>}
                  <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="map-pin" size={15} /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="briefcase" size={15} /> {job.type}
                    </span>
                    {job.experience && (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="clock" size={15} /> {job.experience}
                      </span>
                    )}
                  </div>
                  {job.salary && <div className="mt-3 text-sm font-semibold text-ink">{job.salary}</div>}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View &amp; apply <Icon name="arrow-right" size={16} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {internships.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink md:text-3xl">Internships</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {internships.map((job, i) => (
                  <Reveal key={job.slug} delay={Math.min(i, 8) * 0.04}>
                    <Link
                      to={`/careers/${job.slug}`}
                      className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-card"
                    >
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{job.department}</div>
                      <h3 className="mb-2 text-lg font-bold text-ink group-hover:text-primary">{job.title}</h3>
                      {job.summary && <p className="mb-4 line-clamp-2 text-sm text-ink-soft">{job.summary}</p>}
                      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="map-pin" size={15} /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="briefcase" size={15} /> {job.type}
                        </span>
                        {job.experience && (
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="clock" size={15} /> {job.experience}
                          </span>
                        )}
                      </div>
                      {job.salary && <div className="mt-3 text-sm font-semibold text-ink">{job.salary}</div>}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        View &amp; apply <Icon name="arrow-right" size={16} />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
