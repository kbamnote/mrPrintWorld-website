import { Helmet } from 'react-helmet-async'

const SITE = 'https://www.mrprintworld.com'

export default function SEO({
  title,
  description,
  path = '/',
  faqs = null,
  image = `${SITE}/og-cover.jpg`,
  type = 'website',
}) {
  // Guarantee clean self-referencing canonical URL
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '/'
  const canonicalUrl = `${SITE}${cleanPath}`

  // Verified LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#business`,
    name: 'MRPrint World Pvt. Ltd.',
    description:
      'Complete brand-execution partner offering printing, signage, fabrication, corporate gifting and large-scale event branding under one roof.',
    slogan: 'One Stop Solution For All Your Printing & Branding Needs',
    url: canonicalUrl,
    image: image,
    founder: { '@type': 'Person', name: 'Abid M. Khan' },
    telephone: '+917841840840',
    email: 'info@mrprintworld.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shailesh Nagar, Behind Kohinoor Lawn, Wathoda',
      addressLocality: 'Nagpur',
      addressRegion: 'Maharashtra',
      postalCode: '440008',
      addressCountry: 'IN',
    },
    areaServed: ['Nagpur', 'Vidarbha', 'Maharashtra', 'India'],
    knowsAbout: [
      'Printing',
      'Signage',
      'Fabrication',
      'Corporate Gifting',
      'Event Branding',
      'Vehicle Branding',
    ],
  }

  // FAQPage Schema when faqs prop is provided
  const faqSchema =
    Array.isArray(faqs) && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="MRPrint World Pvt. Ltd." />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data: LocalBusiness */}
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>

      {/* Structured Data: FAQPage (conditional) */}
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
    </Helmet>
  )
}
