import { useParams, useLocation } from 'react-router-dom'
import { getSeoPageBySlug } from '../../data/seoLandingPages'
import NotFound from '../NotFound'
import SEO from '../../components/seo/SEO'
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

  return (
    <article className="min-h-screen bg-white text-stone-900">
      {/* Reusable Helmet SEO Component: title, description, self-referencing canonical, OG, schemas */}
      <SEO
        title={page.title || page.seoTitle}
        description={page.description || page.metaDescription}
        path={page.url}
        faqs={page.faqs}
      />

      {/* Exactly one H1 rendered inside SeoHero */}
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
