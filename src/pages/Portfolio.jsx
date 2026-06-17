import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Reveal from '../components/primitives/Reveal'
import Button from '../components/primitives/Button'
import { projects } from '../data/portfolio'
import { useSeo, breadcrumbLd } from '../lib/seo'

export default function Portfolio() {
  useSeo({
    title: 'Work & Portfolio — Signage, Branding & Fabrication | MR Print World',
    description:
      'Selected work across signage, branding, corporate printing, vehicle graphics, fabrication and event installations delivered by MR Print World.',
    path: '/portfolio',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/portfolio' },
    ]),
  })

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Execution you can see on the street."
        intro="A cross-section of projects across signage, branding, fabrication and events. Detailed case studies are being prepared — real project photography to follow."
      />
      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <article className="group overflow-hidden rounded-[var(--radius-lg)] border border-line">
                  <div
                    className="relative flex items-center justify-center bg-surface"
                    style={{ aspectRatio: p.aspect }}
                  >
                    {/* Labelled placeholder — swap for real photography (see data/portfolio.js) */}
                    <span className="px-6 text-center text-xs uppercase tracking-[0.18em] text-muted">
                      {p.category}
                      <span className="mt-1 block text-[0.65rem] normal-case tracking-normal text-muted/70">
                        Image to be supplied
                      </span>
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-gold-deep">
                      {p.category}
                    </p>
                    <h2 className="mt-2 font-display text-lg font-semibold text-ink">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted">{p.summary}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Button to="/contact" variant="primary" size="lg" iconName="arrow-right">
              Start a project
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
