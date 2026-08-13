import React from 'react'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Icon from '../primitives/Icon'
import Button from '../primitives/Button'

const advantages = [
  {
    icon: 'layers',
    title: 'One-Stop Solution',
    description: 'All printing, branding, fabrication under one roof'
  },
  {
    icon: 'sliders',
    title: 'Custom Manufacturing',
    description: 'Non-standard sizes, materials and finishes'
  },
  {
    icon: 'cog',
    title: 'Multiple Capabilities',
    description: 'Digital, offset, large-format, laser, CNC, UV'
  },
  {
    icon: 'briefcase',
    title: 'B2B Solutions',
    description: 'Corporate, bulk, dealer network support'
  },
  {
    icon: 'shield-check',
    title: 'Quality Assured',
    description: 'Quality checks at every production stage'
  },
  {
    icon: 'bolt',
    title: 'Fast Turnaround',
    description: 'In-house production compresses timelines'
  }
];

export default function WhyChooseSection() {
  return (
    <Section id="why-choose" tone="surface" container={true}>
      <SectionHeading
        eyebrow="Why Choose Us"
        title="More than just a print shop"
        intro="We provide end-to-end solutions for all your printing and branding needs."
        align="center"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {advantages.map((adv, index) => (
          <Reveal key={index} delay={index * 0.1} className="bg-white p-6 rounded-[var(--radius-lg)] shadow-soft border border-line">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Icon name={adv.icon} size={24} />
            </div>
            <h3 className="text-xl font-display text-ink mb-2">{adv.title}</h3>
            <p className="text-muted">{adv.description}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button to="/quote" variant="primary" size="lg">Request a Quote</Button>
      </div>
    </Section>
  );
}
