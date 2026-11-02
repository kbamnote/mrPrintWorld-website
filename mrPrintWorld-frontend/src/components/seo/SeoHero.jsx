import { Link } from 'react-router-dom'
import Container from '../primitives/Container'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import { company, whatsappLink } from '../../data/company'

export default function SeoHero({ page }) {
  const waUrl = whatsappLink({ service: `${page.serviceName} (${page.targetLocation})` })

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <Container wide>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-stone-400 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-white transition-colors">Services</Link>
          <span>/</span>
          <span className="text-stone-300">{page.category}</span>
          <span>/</span>
          <span className="text-accent font-medium">{page.targetLocation}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            {/* Location & Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-emerald-300 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>In-House Production &bull; {page.targetLocation}, Nagpur</span>
            </div>

            {/* H1 Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white leading-[1.15]">
              {page.h1}
            </h1>

            {/* Subheading / Tagline */}
            <p className="text-lg md:text-xl text-stone-300 max-w-3xl leading-relaxed font-light">
              {page.introduction}
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 pb-2">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-accent">12+</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-emerald-400">100%</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider">In-House Unit</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-accent">5,000+</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider">Jobs Delivered</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-emerald-400">24-48h</div>
                <div className="text-xs text-stone-400 uppercase tracking-wider">Fast Turnaround</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold shadow-lg shadow-emerald-950/40 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Icon name="whatsapp" size={20} />
                <span>WhatsApp Enquiry</span>
              </a>

              <Button
                to="/contact"
                variant="gold"
                size="lg"
                iconName="arrowRight"
                className="font-semibold shadow-lg"
              >
                Request a Quote
              </Button>

              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-stone-200 border border-white/15 transition-colors font-medium text-sm"
              >
                <Icon name="phone" size={16} />
                <span>Call {company.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Quick Specifications Card */}
          <div className="lg:col-span-4">
            <div className="p-6 md:p-8 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-semibold text-lg text-white">Execution Snapshot</h3>
                <span className="text-xs px-2.5 py-1 rounded bg-accent/20 text-amber-200 font-mono">Direct Factory</span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400">Location Served</span>
                  <span className="font-medium text-stone-100">{page.targetLocation}, Nagpur & Vidarbha</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400">Production Unit</span>
                  <span className="font-medium text-stone-100">Wathoda Industrial Area, Nagpur</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400">Key Technology</span>
                  <span className="font-medium text-stone-100">Heidelberg, Konica Minolta & HP Latex</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400">Turnaround Guarantee</span>
                  <span className="font-medium text-emerald-300">{page.specs.turnaround}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs text-stone-400">
                Registered Office: Pipla, Nagpur &bull; Factory: Wathoda, Nagpur
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
