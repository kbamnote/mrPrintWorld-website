import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Icon from '../components/primitives/Icon'
import { achievements } from '../data/achievements'
import { useSeo, breadcrumbLd } from '../lib/seo'

export default function Achievements() {
  useSeo({
    title: 'Awards & Achievements | MR Print World Pvt. Ltd., Nagpur',
    description:
      'Awards and industry recognition earned by MR Print World Pvt. Ltd. and founder Mr. Abid M. Khan — including the Vidarbha Udyog Ratna Puraskar 2024.',
    path: '/achievements',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Achievements', path: '/achievements' },
    ]),
  })

  const [active, setActive] = useState(null)
  const close = useCallback(() => setActive(null), [])
  const go = useCallback(
    (d) =>
      setActive((p) =>
        p == null ? p : (p + d + achievements.length) % achievements.length,
      ),
    [],
  )

  useEffect(() => {
    if (active == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close, go])

  return (
    <>
      <PageHeader
        eyebrow="Recognition"
        title="Award-winning execution."
        intro="Recognised across the industry — including the Vidarbha Udyog Ratna Puraskar 2024 — for building one of Nagpur’s largest under-one-roof branding and print operations."
      />

      <section className="section-y bg-white">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View: ${a.title}`}
                className="group block overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface text-left transition-shadow duration-300 hover:shadow-card"
              >
                <span className="block aspect-[3/4] overflow-hidden">
                  <img
                    src={a.src}
                    alt={`MR Print World Pvt. Ltd. — ${a.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="flex items-center justify-between gap-3 p-4">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {a.title}
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={16}
                    className="shrink-0 text-muted transition-colors group-hover:text-primary"
                  />
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      {active != null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/92 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Award image viewer"
          onClick={close}
        >
          <img
            src={achievements[active].src}
            alt={`MR Print World Pvt. Ltd. — ${achievements[active].title}`}
            className="max-h-[86vh] max-w-full rounded-[var(--radius-card)] object-contain shadow-card"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Icon name="close" size={22} />
          </button>
          <button
            type="button"
            aria-label="Previous award"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Icon name="arrow-right" size={20} className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next award"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Icon name="arrow-right" size={20} />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-center text-sm text-white">
            {achievements[active].title} · {active + 1}/{achievements.length}
          </p>
        </div>
      )}
    </>
  )
}
