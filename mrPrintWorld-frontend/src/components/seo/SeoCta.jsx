import Container from '../primitives/Container'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import { company, whatsappLink } from '../../data/company'

export default function SeoCta({ page }) {
  const waUrl = whatsappLink({ service: `${page.serviceName} in ${page.targetLocation}` })

  return (
    <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />

      <Container wide>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-accent/20 text-amber-300 border border-accent/30">
            Factory-Direct Manufacturing &bull; Nagpur
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            Ready to Start Your {page.serviceName} Project in {page.targetLocation}?
          </h2>

          <p className="text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Get precision proofing, transparent bulk rates, and rapid turnaround directly from our Nagpur production factory.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-base shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Icon name="whatsapp" size={22} />
              <span>Chat on WhatsApp</span>
            </a>

            <Button
              to="/contact"
              variant="gold"
              size="lg"
              iconName="arrowRight"
              className="font-semibold text-base shadow-xl"
            >
              Request an Instant Quote
            </Button>

            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 transition-colors font-medium text-sm"
            >
              <Icon name="phone" size={18} />
              <span>Call Us: {company.phoneDisplay}</span>
            </a>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-stone-400 flex items-center justify-center gap-6 flex-wrap">
            <span>Operating Hours: {company.businessHours.days} &bull; {company.businessHours.hours}</span>
            <span>Delivery Across Nagpur & Vidarbha</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
