import { Link } from 'react-router-dom'
import { TEMPLATES, THEMES, FONT_PAIRS, defaultValues } from '../data/designTemplates'
import DesignSurface from '../components/design/DesignSurface'
import { useTemplateFonts } from '../lib/templateFonts'
import { useSeo } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

/**
 * Design templates — a demonstration of the Vistaprint-style flow: pick a
 * design, make it yours, see it at print size.
 *
 * These five are originals drawn in code, so there is no third-party licence
 * on any of them. A designer adds more by copying one component.
 */
export default function TemplateGallery() {
  useTemplateFonts()
  useSeo({
    title: 'Design templates | MRPrint World',
    description: 'Customisable print templates — visiting cards and leaflets.',
    path: '/templates',
    robots: 'noindex, nofollow',
  })

  const theme = THEMES[0].color
  const fonts = FONT_PAIRS[0]

  return (
    <>
      <PageHeader
        eyebrow="Demo"
        title="Pick a design, make it yours."
        description="Edit the wording, colours, fonts and logo, and see it at real print size — bleed and all."
      />

      <section className="section-y bg-surface">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => {
              return (
                <div
                  key={t.id}
                  className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-sm transition-shadow hover:shadow-card"
                >
                  <div className="flex items-center justify-center bg-gray-50 p-6">
                    <div
                      className="w-full overflow-hidden shadow-md ring-1 ring-black/5"
                      style={{ aspectRatio: `${t.size.w} / ${t.size.h}`, maxWidth: t.size.w > 120 ? '11rem' : '100%' }}
                    >
                      <DesignSurface id={t.id} v={defaultValues(t)} theme={theme} fonts={fonts} side="front" />
                    </div>
                  </div>

                  <div className="flex flex-grow flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t.kind}</span>
                    <h2 className="mt-1 font-display text-lg font-bold text-ink">{t.name}</h2>
                    <p className="mt-1 flex-grow text-sm text-ink-soft">{t.blurb}</p>
                    <p className="mt-3 text-xs text-ink-soft">
                      {t.size.trimW} × {t.size.trimH} mm · 3 mm bleed
                      {t.sides.length > 1 ? ' · both sides' : ''}
                    </p>
                    <Button to={`/templates/${t.id}`} variant="primary" size="sm" className="mt-4 w-full justify-center">
                      Customise
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-5 text-sm text-ink-soft">
            This is a working demonstration. In the full version a finished design is saved to the customer&rsquo;s
            account, added to the cart at the product&rsquo;s price, and exported as a print-ready PDF in CMYK with
            trim marks for production.{' '}
            <Link to="/products" className="font-medium text-primary hover:underline">
              Back to products
            </Link>
          </p>
        </Container>
      </section>
    </>
  )
}
