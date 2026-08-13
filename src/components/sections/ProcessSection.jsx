import React from 'react'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Reveal from '../primitives/Reveal'
import Icon from '../primitives/Icon'
import { processSteps } from '../../data/process'

export default function ProcessSection() {
  return (
    <Section id="process" tone="default" container={true}>
      <SectionHeading
        eyebrow="How we work"
        title="From brief to delivery, one accountable partner."
        align="center"
      />
      <div className="mt-16 relative">
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-6 left-0 w-full h-0.5 bg-line -z-10 transform -translate-y-1/2"></div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {processSteps.map((step, index) => (
            <Reveal key={index} delay={index * 0.1} className="relative flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center text-ink-soft mb-4 shadow-soft">
                <span className="font-display font-medium text-sm">{(index + 1).toString().padStart(2, '0')}</span>
              </div>
              <div className="mb-3 text-primary">
                <Icon name={step.icon} size={28} />
              </div>
              <h3 className="text-lg font-display text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
