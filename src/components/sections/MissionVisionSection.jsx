import Eyebrow from '../primitives/Eyebrow'
import Reveal from '../primitives/Reveal'

/** Split-screen Mission / Vision — reads like a corporate annual report (brief §12.6). */
export default function MissionVisionSection() {
  return (
    <section id="mission" className="grid lg:grid-cols-2">
      {/* Mission — dark pane */}
      <div className="bg-dark px-6 py-20 sm:px-10 md:px-14 lg:py-28">
        <Reveal className="lg:ml-auto lg:max-w-xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-sm text-gold-deep">01</span>
            <Eyebrow light>Our Mission</Eyebrow>
          </div>
          <p className="mt-7 font-display text-3xl font-medium leading-tight text-white md:text-4xl">
            To give every business — whatever its size — branding executed to an
            enterprise standard, end to end, under one roof.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            We remove the gap between how a brand is imagined and how it actually
            appears in the world — by owning every stage of production ourselves.
          </p>
        </Reveal>
      </div>

      {/* Vision — light pane */}
      <div className="bg-surface px-6 py-20 sm:px-10 md:px-14 lg:py-28">
        <Reveal delay={0.1} className="lg:max-w-xl">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-sm text-gold-deep">02</span>
            <Eyebrow>Our Vision</Eyebrow>
          </div>
          <p className="mt-7 font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
            To be Central India’s most trusted brand-execution partner — the
            benchmark for quality, scale and craftsmanship.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Not the biggest print shop, but the most dependable partner a brand
            can hand its reputation to — and know it will be delivered.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
