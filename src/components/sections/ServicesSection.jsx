import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Icon from '../primitives/Icon'
import Button from '../primitives/Button'
import { services, servicesIntro } from '../../data/services'
import { EASE } from '../../lib/motion'

function Detail({ s }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-[var(--radius-card)] bg-primary/10 text-primary">
          <Icon name={s.icon} size={32} />
        </span>
        <h3 className="text-title text-ink">{s.title}</h3>
      </div>
      <p className="mt-5 max-w-xl text-lg text-muted">{s.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {s.items.map((it) => (
          <li
            key={it}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink-soft"
          >
            {it}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button to="/contact" variant="primary" iconName="arrow-right">
          Request a {s.title} quote
        </Button>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  const [active, setActive] = useState(0)

  return (
    <Section id="services" tone="surface">
      <SectionHeading
        eyebrow={servicesIntro.eyebrow}
        title={servicesIntro.title}
        intro={servicesIntro.body}
        className="mb-12"
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Master list — selectable via click, hover and keyboard (no hover dependency) */}
        <ul className="lg:col-span-5">
          {services.map((s, i) => {
            const on = active === i
            return (
              <li key={s.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-expanded={on}
                  className={`group flex w-full items-center gap-4 py-5 text-left transition-colors ${
                    on ? 'text-primary' : 'text-ink hover:text-primary'
                  }`}
                >
                  <span
                    className={`font-display text-sm tabular-nums ${
                      on ? 'text-gold-deep' : 'text-muted'
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <Icon
                    name={s.icon}
                    size={26}
                    className={on ? 'text-primary' : 'text-ink-soft'}
                  />
                  <span className="flex-1 font-display text-xl font-medium">
                    {s.title}
                  </span>
                  <Icon
                    name="arrow-right"
                    size={20}
                    className={`transition-all duration-300 ${
                      on ? 'translate-x-0 text-primary opacity-100' : '-translate-x-1 opacity-0'
                    }`}
                  />
                </button>

                {/* Mobile: inline expanding detail */}
                <div className="overflow-hidden lg:hidden">
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <div className="pb-8 pt-1">
                          <Detail s={s} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Desktop: detail panel */}
        <div className="hidden lg:col-span-7 lg:block">
          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Detail s={services[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}
