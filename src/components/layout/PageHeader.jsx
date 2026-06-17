import Container from '../primitives/Container'
import Eyebrow from '../primitives/Eyebrow'

/** Standard interior-page header (sits below the fixed navbar). */
export default function PageHeader({ eyebrow, title, intro }) {
  return (
    <header className="border-b border-line bg-surface">
      <Container className="py-16 md:py-24">
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <h1 className="text-display max-w-3xl text-ink">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
      </Container>
    </header>
  )
}
