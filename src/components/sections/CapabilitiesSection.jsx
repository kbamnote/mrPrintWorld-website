import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Icon from '../primitives/Icon'
import { capabilities } from '../../data/capabilities'

export default function CapabilitiesSection() {
  return (
    <Section id="capabilities" tone="dark">
      <SectionHeading
        light
        eyebrow="Capabilities"
        title="The infrastructure behind the finish."
        intro="Enterprise-grade execution isn’t one machine or one team — it’s the whole system working to a single standard."
        className="mb-14"
      />
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-dark-line bg-dark-line md:grid-cols-4">
        {capabilities.map((c, i) => (
          <Reveal
            key={c.title}
            delay={(i % 4) * 0.05}
            className="group bg-dark p-7 transition-colors duration-300 hover:bg-dark-soft"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-white/5 text-accent transition-colors duration-300 group-hover:bg-accent/15">
              <Icon name={c.icon} size={24} />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{c.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
