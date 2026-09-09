import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Icon from '../primitives/Icon'
import { industries } from '../../data/industries'

export default function IndustriesSection() {
  return (
    <Section id="industries" tone="default">
      <SectionHeading
        eyebrow="Industries we serve"
        title="Trusted across sectors that can’t afford a weak brand."
        className="mb-14"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {industries.map((ind, i) => (
          <Reveal
            key={ind.name}
            delay={(i % 4) * 0.05}
            className="group rounded-[var(--radius-lg)] border border-line p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-primary">
              <Icon name={ind.icon} size={24} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{ind.name}</h3>
            <p className="mt-1 text-sm text-muted">{ind.note}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
