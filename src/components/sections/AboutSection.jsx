import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Counter from '../primitives/Counter'
import { company, leadership } from '../../data/company'

const stats = [
  { to: company.experienceYears, suffix: '+', label: 'Years of execution' },
  { to: company.teamSize, suffix: '+', label: 'Professionals on team' },
  { to: 5000, suffix: '+', label: 'Projects delivered' },
  { to: 100, suffix: '%', label: 'Built under one roof' },
]

export default function AboutSection() {
  return (
    <Section id="about" tone="default">
      <SectionHeading
        eyebrow="Legacy of Trust"
        title="From one person’s vision to an organisation of fifty."
        className="max-w-3xl"
      />

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Founder portrait */}
        <Reveal className="lg:col-span-5">
          <figure className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line shadow-soft">
            <span
              className="absolute left-0 top-0 z-10 h-16 w-1 bg-accent"
              aria-hidden="true"
            />
            <img
              src={leadership.portrait}
              alt={`${leadership.name}, ${leadership.role} of ${company.name}`}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent p-5">
              <p className="font-display text-lg font-semibold text-white">
                {leadership.name}
              </p>
              <p className="text-sm text-white/75">{leadership.role}</p>
            </figcaption>
          </figure>
        </Reveal>

        {/* Story */}
        <Reveal
          delay={0.1}
          className="space-y-5 text-lg leading-relaxed text-ink-soft lg:col-span-7"
        >
          <p>
            MR Print World Pvt. Ltd. was founded by {company.founder} on a simple belief —
            that a brand should be <em>executed</em>, not merely designed. The
            first jobs were delivered by a single pair of hands, to a standard
            that left no room for compromise.
          </p>
          <p>
            That standard is what grew the company. Project by project, referral
            by referral, a one-person operation became a {company.teamSize}+
            member organisation trusted by hundreds of businesses across Central
            India — from local retailers to national brands.
          </p>
          <p>
            Today that same discipline runs across an integrated floor: design,
            printing, signage, fabrication and on-site installation, all
            accountable to one team. Scale changed. The standard did not.
          </p>
        </Reveal>
      </div>

      <Reveal
        delay={0.15}
        className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line lg:grid-cols-4"
      >
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8">
            <div className="font-display text-4xl font-semibold text-primary md:text-5xl">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
