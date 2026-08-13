import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Counter from '../components/primitives/Counter'
import Button from '../components/primitives/Button'
import Reveal from '../components/primitives/Reveal'
import Eyebrow from '../components/primitives/Eyebrow'
import Icon from '../components/primitives/Icon'
import BusinessCredentialsSection from '../components/sections/BusinessCredentialsSection'
import { company, leadership } from '../data/company'
import { useSeo, breadcrumbLd } from '../lib/seo'

export default function About() {
  useSeo({
    title: 'About — A Complete Brand Execution Partner | MR Print World Pvt. Ltd.',
    description:
      'Founded by Mr. Abid M. Khan, MR Print World Pvt. Ltd. grew from a single vision into a 50+ member organisation delivering end-to-end branding infrastructure under one roof in Nagpur.',
    path: '/about',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  })

  const businessOutlook = [
    {
      title: 'The Industry Problem',
      desc: 'Businesses traditionally stitch together multiple vendors—a design agency, a digital printer, a metal fabricator, and an installation crew. This fragmented workflow causes compounded delays, inconsistent brand execution, and scattered accountability.',
      icon: 'close',
    },
    {
      title: 'Our Integrated Solution',
      desc: 'MR Print World consolidates the entire supply chain. By housing digital print, CNC carving, laser cutting, flatbed UV printing, and metal fabrication under one roof, we guarantee brand consistency, reduce turnaround times, and provide a single accountable partner.',
      icon: 'layers',
    },
    {
      title: 'Our Business Model',
      desc: 'We operate a high-volume B2B and custom manufacturing model. Key revenue streams include corporate branding rollouts, recurring commercial packaging print runs, B2B wholesale fabrication contracts, custom acrylic creations, and direct retail branding projects.',
      icon: 'briefcase',
    },
    {
      title: 'Market Opportunity & Growth',
      desc: 'Nagpur is the commercial hub of Central India. With rapid industrial development and retail expansion, the demand for enterprise-grade branding execution is surging. We are scaling our digital infrastructure to enable online-to-offline ordering across Vidarbha.',
      icon: 'trending-up',
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Built on quality. Grown into infrastructure."
        intro={`Founded by ${company.founder}, MR Print World Pvt. Ltd. began as a one-person vision and grew — through quality, not shortcuts — into a 50+ member organisation trusted by hundreds of businesses across Central India.`}
      />

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                What started at a single press has become an end-to-end branding
                operation: design, printing, signage, fabrication and on-site
                installation — all accountable to one team.
              </p>
              <p>
                That integration is the point. By keeping every stage under one
                roof, we control quality, compress timelines and give clients a
                single partner for everything from a business card to a
                nationwide rollout.
              </p>
              <div className="pt-2">
                <Button to="/contact" variant="primary" iconName="arrow-right">
                  Work with us
                </Button>
              </div>
            </Reveal>

            <Reveal
              delay={0.1}
              className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line"
            >
              {[
                { to: company.experienceYears, suffix: '+', label: 'Years of execution' },
                { to: company.teamSize, suffix: '+', label: 'Professionals' },
                { to: 5000, suffix: '+', label: 'Projects delivered' },
                { to: 1, suffix: '', label: 'Roof — end to end' },
              ].map((s) => (
                <div key={s.label} className="bg-white p-8">
                  <div className="font-display text-4xl font-semibold text-primary">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Leadership */}
      <section className="section-y bg-surface">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <img
                src={leadership.portraitWide}
                alt={`${leadership.name}, ${leadership.role} of ${company.name}`}
                loading="lazy"
                className="aspect-[3/4] w-full rounded-[var(--radius-lg)] border border-line object-cover shadow-soft"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>Leadership</Eyebrow>
              <h2 className="text-display mt-4 text-ink">{leadership.name}</h2>
              <p className="mt-1 font-medium text-gold-deep">{leadership.role}</p>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
                <p>
                  {leadership.name} founded MR Print World Pvt. Ltd. on a conviction that
                  has never changed: a brand deserves to be executed to an
                  enterprise standard, whatever its size.
                </p>
                <p>
                  Over {company.experienceYears}+ years he has built that
                  conviction into infrastructure — a {company.teamSize}+ member
                  team and an integrated floor that takes a brand from idea to
                  installation without a single hand-off.
                </p>
              </div>
              <div className="mt-7">
                <Button to="/contact" variant="outline" iconName="arrow-right">
                  Talk to our team
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Strategic Outlook & Business Model (Funding Ready) */}
      <section className="section-y bg-white border-t border-line">
        <Container>
          <div className="max-w-3xl mb-16">
            <Eyebrow>Strategic Outlook</Eyebrow>
            <h2 className="text-display mt-4 text-ink">Market Opportunity & Scaling Strategy</h2>
            <p className="mt-4 text-lg text-muted">
              Consolidating custom fabrication and digital printing under a single corporate umbrella to streamline brand delivery for growing enterprises.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {businessOutlook.map((item, idx) => (
              <Reveal
                key={item.title}
                delay={idx * 0.05}
                className="rounded-[var(--radius-lg)] border border-line p-6 bg-white shadow-soft transition-all duration-300 hover:shadow-card"
              >
                <div className="flex gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-primary">
                    <Icon name={item.icon} size={24} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Corporate Compliance & Credentials */}
      <BusinessCredentialsSection />
    </>
  )
}
