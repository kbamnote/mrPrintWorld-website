import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import { projects, portfolioCategories } from '../../data/portfolio'
import { EASE } from '../../lib/motion'

function TileInner({ p }) {
  return (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {p.image ? (
          <img
            src={p.image}
            alt={p.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Icon name="signage" size={28} className="text-line-strong" />
            <span className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
              {p.category}
            </span>
            <span className="mt-1 text-[0.65rem] text-muted/70">Image to be supplied</span>
          </div>
        )}
        {/* Hover / focus reveal (enhancement; caption below is the touch fallback) */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <h3 className="font-display text-lg font-semibold text-white">{p.title}</h3>
          <p className="mt-1 text-sm text-white/75">{p.summary}</p>
          {p.featured && (
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
              View case study <Icon name="arrow-up-right" size={16} />
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-gold-deep">{p.category}</p>
        <h3 className="mt-2 font-display text-lg font-semibold text-ink">{p.title}</h3>
      </div>
    </>
  )
}

export default function PortfolioSection() {
  const [cat, setCat] = useState('All')
  const filtered =
    cat === 'All' ? projects : projects.filter((p) => p.category === cat)

  return (
    <Section id="portfolio" tone="default">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Selected work"
          title="Execution you can see on the street."
          intro="A cross-section of projects across signage, branding, fabrication and events."
        />
        <Button to="/portfolio" variant="outline" iconName="arrow-right" className="shrink-0">
          View all work
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-10 flex flex-wrap gap-2">
        {portfolioCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              cat === c
                ? 'border-primary bg-primary text-white'
                : 'border-line text-ink-soft hover:border-ink/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => {
            const cls =
              'group block overflow-hidden rounded-[var(--radius-lg)] border border-line transition-shadow duration-300 hover:shadow-card'
            return (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {p.featured ? (
                  <Link to="/portfolio" className={cls} aria-label={`${p.title} — view case study`}>
                    <TileInner p={p} />
                  </Link>
                ) : (
                  <div className={cls}>
                    <TileInner p={p} />
                  </div>
                )}
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
