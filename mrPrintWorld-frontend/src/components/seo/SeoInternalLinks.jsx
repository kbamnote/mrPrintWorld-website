import { Link } from 'react-router-dom'
import Container from '../primitives/Container'

export default function SeoInternalLinks({ page }) {
  const { relatedServices, relatedLocations } = page

  return (
    <section className="py-16 bg-stone-50 text-stone-900 border-b border-stone-200">
      <Container wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Related Services */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>Related Printing & Signage Services</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {relatedServices.map((srv, i) => (
                <Link
                  key={i}
                  to={srv.url}
                  className="px-3.5 py-2 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:text-primary hover:border-primary/40 hover:shadow-xs transition-all"
                >
                  {srv.name} in Nagpur
                </Link>
              ))}
              <Link
                to="/services"
                className="px-3.5 py-2 rounded-lg bg-stone-200 text-xs font-semibold text-stone-800 hover:bg-stone-300 transition-colors"
              >
                View All Services &rarr;
              </Link>
            </div>
          </div>

          {/* Related Locations */}
          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span>Nearby Serviceable Areas in Nagpur</span>
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {relatedLocations.map((loc, i) => (
                <Link
                  key={i}
                  to={loc.url}
                  className="px-3.5 py-2 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-700 hover:text-accent hover:border-accent/40 hover:shadow-xs transition-all"
                >
                  {page.serviceName} in {loc.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="px-3.5 py-2 rounded-lg bg-stone-200 text-xs font-semibold text-stone-800 hover:bg-stone-300 transition-colors"
              >
                Check Your Location &rarr;
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
