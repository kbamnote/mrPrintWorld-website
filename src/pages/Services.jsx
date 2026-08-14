import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Icon from '../components/primitives/Icon'
import Button from '../components/primitives/Button'
import Reveal from '../components/primitives/Reveal'
import { services, servicesIntro } from '../data/services'
import { useSeo, breadcrumbLd } from '../lib/seo'
import { Link } from 'react-router-dom'

export default function Services() {
  useSeo({
    title: 'Services — Printing, Signage, Fabrication & Branding | MR Print World Pvt. Ltd.',
    description:
      'Printing, signage, corporate solutions, fabrication and event branding — designed, manufactured, finished and installed end-to-end under one roof in Nagpur.',
    path: '/services',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
  })

  return (
    <>
      <PageHeader
        eyebrow={servicesIntro.eyebrow}
        title="Every branding surface, one accountable partner."
        intro={servicesIntro.body}
      />
      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal
                key={s.id}
                delay={i * 0.05}
              >
                <Link
                  to={`/services/${s.slug}`}
                  className="group block rounded-[var(--radius-lg)] border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-card md:p-9 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Icon name={s.icon} size={28} />
                    </div>
                    <h2 className="text-title mt-5 text-ink group-hover:text-primary transition-colors">{s.title}</h2>
                    <p className="mt-3 text-muted text-sm leading-relaxed">{s.summary}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.items.map((it) => (
                        <li
                          key={it}
                          className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                        >
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 pt-4 border-t border-line flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Explore Service & Machine Specs</span>
                    <Icon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <Button to="/request-quote" variant="primary" size="lg" iconName="arrow-right">
              Request a Quote
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
