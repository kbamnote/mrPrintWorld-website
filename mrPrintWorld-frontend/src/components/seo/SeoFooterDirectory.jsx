import { useState } from 'react'
import { Link } from 'react-router-dom'
import { seoLandingPages } from '../../data/seoLandingPages'

export default function SeoFooterDirectory() {
  const [expanded, setExpanded] = useState(false)

  // Split into city-wide services and locality-specific landing pages
  const cityPages = seoLandingPages.filter((p) => !p.isLocalityPage)
  const localPages = seoLandingPages.filter((p) => p.isLocalityPage)

  return (
    <div className="border-t border-dark-line pt-10 pb-8 text-xs text-white/55">
      <div className="container-page">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h4 className="font-semibold uppercase tracking-wider text-white text-xs">
            Local Printing, Signage & Fabrication Services Across Nagpur
          </h4>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-accent hover:underline text-xs font-medium cursor-pointer"
          >
            {expanded ? '▲ Collapse Directory' : `▼ Browse All ${seoLandingPages.length} Locations & Services`}
          </button>
        </div>

        {/* Featured Top Services (Always Visible for Crawlers & Visitors) */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-white/60">
          {cityPages.slice(0, 20).map((page) => (
            <Link
              key={page.slug}
              to={page.url}
              className="hover:text-white transition-colors"
            >
              {page.serviceName} in Nagpur
            </Link>
          ))}
        </div>

        {/* Complete Expanded Directory (Accessible to all Search Crawlers) */}
        <div className={`${expanded ? 'block' : 'hidden'} pt-4 border-t border-white/10 space-y-6`}>
          <div>
            <h5 className="font-semibold text-white/80 mb-2 uppercase text-[11px] tracking-wider">
              City-Wide Services (Nagpur Central & Industrial Hub)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {cityPages.map((page) => (
                <Link
                  key={page.slug}
                  to={page.url}
                  className="hover:text-accent transition-colors truncate"
                  title={page.title}
                >
                  {page.serviceName} in Nagpur
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white/80 mb-2 uppercase text-[11px] tracking-wider">
              Commercial & Industrial Areas in Nagpur
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {localPages.map((page) => (
                <Link
                  key={page.slug}
                  to={page.url}
                  className="hover:text-accent transition-colors truncate"
                  title={page.title}
                >
                  {page.serviceName} in {page.targetLocation}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
