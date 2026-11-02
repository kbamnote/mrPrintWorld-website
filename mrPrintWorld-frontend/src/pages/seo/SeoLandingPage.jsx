import { useParams, useLocation } from 'react-router-dom'
import { getSeoPageBySlug } from '../../data/seoLandingPages'
import { useSeo, breadcrumbLd, serviceLd, faqLd } from '../../lib/seo'
import NotFound from '../NotFound'
import SeoHero from '../../components/seo/SeoHero'
import SeoSpecs from '../../components/seo/SeoSpecs'
import SeoUseCases from '../../components/seo/SeoUseCases'
import SeoWhyUs from '../../components/seo/SeoWhyUs'
import SeoLocationDelivery from '../../components/seo/SeoLocationDelivery'
import SeoFaq from '../../components/seo/SeoFaq'
import SeoInternalLinks from '../../components/seo/SeoInternalLinks'
import SeoCta from '../../components/seo/SeoCta'

export default function SeoLandingPage() {
  const params = useParams()
  const location = useLocation()

  // Resolve slug from either /locations/:slug or /:seoSlug
  const slug = params.slug ? `locations/${params.slug}` : params.seoSlug || location.pathname.replace(/^\/+/, '')
  const page = getSeoPageBySlug(slug)

  // If no matching landing page exists, delegate cleanly to standard 404 page
  if (!page) {
    return <NotFound />
  }

  // Structured Data Schema Array
  const schemas = [
    breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: page.serviceName, path: page.url },
    ]),
    serviceLd({
      title: `${page.serviceName} in ${page.targetLocation}`,
      summary: page.overview,
    }),
    faqLd(page.faqs),
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://www.mrprintworld.com${page.url}#localbusiness`,
      name: 'MRPrint World Pvt. Ltd.',
      telephone: '+917841840840',
      email: 'info@mrprintworld.com',
      url: `https://www.mrprintworld.com${page.url}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shailesh Nagar, Behind Kohinoor Lawn, Wathoda',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        postalCode: '440008',
        addressCountry: 'IN',
      },
      areaServed: [page.targetLocation, 'Nagpur', 'Vidarbha', 'Maharashtra'],
    },
  ]

  // Dynamic SEO Injection
  useSeo({
    title: page.seoTitle,
    description: page.metaDescription,
    path: page.url,
    robots: page.indexingStatus || 'index, follow',
    schema: schemas,
  })

  return (
    <article className="min-h-screen bg-white text-stone-900">
      <SeoHero page={page} />
      <SeoSpecs page={page} />
      <SeoUseCases page={page} />
      <SeoWhyUs page={page} />
      <SeoLocationDelivery page={page} />
      <SeoFaq faqs={page.faqs} serviceName={page.serviceName} targetLocation={page.targetLocation} />
      <SeoInternalLinks page={page} />
      <SeoCta page={page} />
    </article>
  )
}
