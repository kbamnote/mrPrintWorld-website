import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { THEMES, FONT_PAIRS, templateById, defaultValues } from '../data/designTemplates'
import DesignSurface from '../components/design/DesignSurface'
import { useTemplateFonts } from '../lib/templateFonts'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

/**
 * The editor: fill in the wording, choose colours, fonts and a logo, and see
 * the result at print size.
 *
 * The layout itself is fixed. That is deliberate for a first version — a
 * customer cannot drag text outside the trim or ruin the spacing, which is
 * what makes every file printable without someone checking it by hand.
 */
const MAX_UPLOAD = 5 * 1024 * 1024

function readImage(file, onDone, onError) {
  if (!file) return
  if (!file.type.startsWith('image/')) return onError('Choose an image file.')
  if (file.size > MAX_UPLOAD) return onError('That image is over 5 MB. Please use a smaller one.')
  const reader = new FileReader()
  reader.onload = () => onDone(reader.result)
  reader.onerror = () => onError('That image could not be read.')
  reader.readAsDataURL(file)
}

export default function TemplateEditor() {
  const { id } = useParams()
  const template = templateById(id)

  useTemplateFonts()
  useSeo({
    title: template ? `${template.name} | MRPrint World` : 'Design | MRPrint World',
    description: 'Customise this print template.',
    path: `/templates/${id}`,
    robots: 'noindex, nofollow',
  })

  const [values, setValues] = useState(() => defaultValues(template))
  const [themeId, setThemeId] = useState(THEMES[0].id)
  const [fontId, setFontId] = useState(FONT_PAIRS[0].id)
  const [logo, setLogo] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [side, setSide] = useState('front')
  const [guides, setGuides] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const stage = useRef(null)

  if (!template) return <Navigate to="/templates" replace />

  const theme = (THEMES.find((t) => t.id === themeId) ?? THEMES[0]).color
  const fonts = FONT_PAIRS.find((f) => f.id === fontId) ?? FONT_PAIRS[0]
  const { w, h, safe } = template.size

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }))

  /** Export at 300 dpi — the resolution the press needs. */
  async function download() {
    if (!stage.current) return
    setBusy(true)
    setError(null)
    try {
      const { toPng } = await import('html-to-image')
      const node = stage.current
      const targetWidth = Math.round((w / 25.4) * 300)
      const dataUrl = await toPng(node, {
        pixelRatio: targetWidth / node.offsetWidth,
        backgroundColor: '#ffffff',
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${template.id}-${side}-300dpi.png`
      link.click()
    } catch {
      setError('The image could not be generated in this browser. Try Chrome.')
    } finally {
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <section className="section-y bg-surface">
      <Container>
        <Link to="/templates" className="text-sm text-ink-soft hover:text-primary">
          ← All designs
        </Link>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">{template.name}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {template.kind} · {template.size.trimW} × {template.size.trimH} mm · 3 mm bleed
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {template.sides.length > 1 &&
              template.sides.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSide(s)}
                  className={`rounded-[var(--radius-card)] px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    side === s ? 'bg-primary text-white' : 'border border-line bg-white text-ink-soft hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6 md:p-10">
              <div className="relative mx-auto" style={{ maxWidth: w > 120 ? '26rem' : '34rem' }}>
                <div
                  ref={stage}
                  className="w-full overflow-hidden shadow-lg ring-1 ring-black/5"
                  style={{ aspectRatio: `${w} / ${h}` }}
                >
                  <DesignSurface id={id} v={values} theme={theme} fonts={fonts} logo={logo} photo={photo} side={side} />
                </div>

                {/* Printer's guides, drawn OVER the artboard so they never
                    appear in the exported file. */}
                {guides && (
                  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div
                      className="absolute border border-dashed border-red-400/70"
                      style={{ inset: `${(3 / h) * 100}% ${(3 / w) * 100}%` }}
                    />
                    <div
                      className="absolute border border-dashed border-sky-400/70"
                      style={{ inset: `${(safe / h) * 100}% ${(safe / w) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} />
                  Show trim and safe area
                </label>
                <Button variant="primary" onClick={download} disabled={busy}>
                  {busy ? 'Preparing…' : 'Download preview (300 dpi)'}
                </Button>
              </div>
              {error && <p className="mt-3 text-center text-sm text-red-700">{error}</p>}
              <p className="mt-3 text-center text-xs text-ink-soft">
                Red is the trim line — the piece is cut there. Nothing important should cross the blue line.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
              <h2 className="font-display text-base font-semibold text-ink">Your details</h2>
              <div className="mt-4 space-y-3">
                {template.fields.map((f) => (
                  <label key={f.key} className="block">
                    <span className="mb-1 block text-xs font-medium text-ink">{f.label}</span>
                    <input
                      value={values[f.key] ?? ''}
                      maxLength={f.max}
                      onChange={(e) => set(f.key, e.target.value)}
                      className={field}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
              <h2 className="font-display text-base font-semibold text-ink">Colour</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setThemeId(t.id)}
                    aria-label={t.name}
                    title={t.name}
                    className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition-transform ${
                      themeId === t.id ? 'scale-110 ring-ink' : 'ring-transparent'
                    }`}
                    style={{ backgroundColor: t.color }}
                  />
                ))}
              </div>

              <h2 className="mt-5 font-display text-base font-semibold text-ink">Lettering</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {FONT_PAIRS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontId(f.id)}
                    className={`rounded-[var(--radius-card)] border px-3 py-2 text-sm transition-colors ${
                      fontId === f.id ? 'border-primary bg-primary/5 text-ink' : 'border-line text-ink-soft hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: f.display }}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
              <h2 className="font-display text-base font-semibold text-ink">Your logo</h2>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={(e) => {
                  readImage(e.target.files?.[0], setLogo, setError)
                  e.target.value = ''
                }}
                className="mt-2 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
              />
              {logo && (
                <button type="button" onClick={() => setLogo(null)} className="mt-2 text-xs text-ink-soft underline">
                  Remove logo
                </button>
              )}
              <p className="mt-2 text-xs text-ink-soft">A PNG with a transparent background works best.</p>

              {template.accepts?.photo && (
                <>
                  <h2 className="mt-5 font-display text-base font-semibold text-ink">Photograph</h2>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      readImage(e.target.files?.[0], setPhoto, setError)
                      e.target.value = ''
                    }}
                    className="mt-2 block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
                  />
                  {photo && (
                    <button type="button" onClick={() => setPhoto(null)} className="mt-2 text-xs text-ink-soft underline">
                      Remove photograph
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-4 text-xs text-ink-soft">
              Demonstration only. In the full version this design is saved to the customer&rsquo;s account, added to
              the cart at the product&rsquo;s price, and exported as a print-ready CMYK PDF with trim marks.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
