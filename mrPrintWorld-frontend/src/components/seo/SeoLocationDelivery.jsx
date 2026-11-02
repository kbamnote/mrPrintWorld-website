import Container from '../primitives/Container'
import Icon from '../primitives/Icon'
import { company } from '../../data/company'

export default function SeoLocationDelivery({ page }) {
  const { locationDelivery } = page

  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200 text-stone-900">
      <Container wide>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Local Nagpur Presence</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              Direct Supply & On-Site Installation in {page.targetLocation}
            </h2>
            <p className="text-stone-600 leading-relaxed text-sm md:text-base">
              Unlike online print resellers who broker orders to third parties, MRPRINT WORLD owns and operates its own dedicated manufacturing facility right here in Nagpur. Our logistics and fabrication teams handle on-time dispatches, site measurements, and professional installation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Production Facility</span>
                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  {company.addresses[1].lines.join(' ')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Registered Office</span>
                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  {company.addresses[0].lines.join(' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <Icon name="phone" size={16} className="text-primary" />
                <a href={company.phoneHref} className="hover:text-primary font-semibold">{company.phoneDisplay}</a>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="mail" size={16} className="text-primary" />
                <a href={`mailto:${company.email}`} className="hover:text-primary font-medium">{company.email}</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-stone-300 shadow-md h-80 relative bg-stone-200">
              <iframe
                title="MRPRINT WORLD Factory Nagpur"
                src={company.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-3 text-xs text-stone-500 text-center">
              Coordinates: 21.14291 N, 79.14728 E &bull; Strategic access to Outer Ring Road and Central Nagpur corridors.
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
