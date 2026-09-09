import React from 'react'
import Section from '../primitives/Section'
import Reveal from '../primitives/Reveal'
import Button from '../primitives/Button'
import { whatsappLink } from '../../data/company'

export default function CustomSolutionsSection() {
  return (
    <Section id="custom-cta" tone="dark" container={true}>
      <div className="text-center max-w-3xl mx-auto">
        <Reveal delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
            Have a Custom Requirement?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-xl text-white/80 mb-10">
            From a unique product idea to large-scale branding — tell us what you need.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/contact" variant="gold" size="lg">
            Contact Us
          </Button>
          <Button href={whatsappLink({ service: 'custom requirement' })} target="_blank" rel="noopener noreferrer" variant="outline-light" size="lg" iconName="whatsapp">
            WhatsApp Us
          </Button>
          <Button to="/services" variant="outline-light" size="lg">
            Explore Services
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
