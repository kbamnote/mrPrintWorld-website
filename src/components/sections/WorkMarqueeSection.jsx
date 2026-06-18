import Section from '../primitives/Section'
import SectionHeading from '../primitives/SectionHeading'

// Load every image in src/assets/carausel/ as a URL (no manual imports).
const modules = import.meta.glob('../../assets/carausel/*.{jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const images = Object.keys(modules)
  .sort()
  .map((k) => modules[k])

export default function WorkMarqueeSection() {
  // Duplicate the set so the CSS translateX(-50%) loop is seamless.
  const loop = [...images, ...images]

  return (
    <Section id="highlights" tone="default" container={false}>
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Our work"
          title="Highlights of Our Previous Work"
          intro="A glimpse of recent signage, branding, fabrication and transit-media projects delivered across Central India."
          className="mb-12"
        />
      </div>

      <div
        className="marquee group relative overflow-hidden"
        role="region"
        aria-label="Highlights of our previous work"
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

        <ul className="marquee-track flex gap-5">
          {loop.map((src, i) => (
            <li key={i} className="shrink-0">
              <img
                src={src}
                alt={i < images.length ? 'MR Print World — previous work' : ''}
                aria-hidden={i >= images.length}
                loading="lazy"
                className="h-44 w-64 rounded-[var(--radius-lg)] object-cover sm:h-56 sm:w-80"
              />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
