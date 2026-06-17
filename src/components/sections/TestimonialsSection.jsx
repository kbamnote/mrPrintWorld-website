import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Icon from '../primitives/Icon'
import { testimonials } from '../../data/testimonials'
import { EASE } from '../../lib/motion'

export default function TestimonialsSection() {
  const [i, setI] = useState(0)
  const t = testimonials[i]
  const go = (d) => setI((p) => (p + d + testimonials.length) % testimonials.length)

  return (
    <Section id="testimonials" tone="surface">
      <SectionHeading
        eyebrow="What clients say"
        title="Relationships built on delivered results."
        className="mb-12"
      />

      <div className="relative mx-auto max-w-4xl">
        <Icon name="quote" size={56} className="text-accent" />

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <p className="font-display text-2xl font-medium leading-snug text-ink md:text-[2rem]">
              “{t.quote}”
            </p>
            <footer className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-ink">{t.name}</span>
              <span className="text-muted">
                — {t.role}, {t.location}
              </span>
              {t.sample && (
                <span className="rounded-full border border-line px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted">
                  Sample
                </span>
              )}
            </footer>
            {t.result && <p className="mt-2 text-sm text-gold-deep">{t.result}</p>}
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
          >
            <Icon name="arrow-right" size={18} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
          >
            <Icon name="arrow-right" size={18} />
          </button>
          <div className="ml-3 flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                aria-current={idx === i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === i ? 'w-6 bg-primary' : 'w-1.5 bg-line-strong'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
