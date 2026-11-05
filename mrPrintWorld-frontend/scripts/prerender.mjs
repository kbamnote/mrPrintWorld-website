import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const SITE = 'https://www.mrprintworld.com'

if (!existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.')
  process.exit(1)
}

const templatePath = join(distDir, 'index.html')
const templateHtml = readFileSync(templatePath, 'utf8')

// Load the 100+ landing pages database
const { seoLandingPages } = await import('../src/data/seoLandingPages.js')

console.log(`Prerendering ${seoLandingPages.length} landing pages into static HTML files...`)

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE}/#business`,
  name: 'MRPrint World Pvt. Ltd.',
  description:
    'Complete brand-execution partner offering printing, signage, fabrication, corporate gifting and large-scale event branding under one roof.',
  slogan: 'One Stop Solution For All Your Printing & Branding Needs',
  url: `${SITE}/`,
  image: `${SITE}/og-cover.jpg`,
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

// 1. Prerender each SEO landing page
let generatedCount = 0

for (const page of seoLandingPages) {
  const cleanPath = page.url.startsWith('/') ? page.url : `/${page.url}`
  const canonicalUrl = `${SITE}${cleanPath}`
  const title = page.title || page.seoTitle
  const description = page.description || page.metaDescription

  // FAQ Schema
  const faqSchema =
    Array.isArray(page.faqs) && page.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null

  const headInject = `
    <!-- Prerendered Static SEO Tags -->
    <title>${title}</title>
    <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="MRPrint World Pvt. Ltd." />
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${SITE}/og-cover.jpg" />
    <meta property="og:locale" content="en_IN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${SITE}/og-cover.jpg" />
    <script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>
    ${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ''}
  `

  // Static semantic markup for search spiders before JS hydration
  const bodyInject = `
    <article class="seo-prerendered-content" style="max-width:1200px;margin:0 auto;padding:2rem 1rem;">
      <nav aria-label="Breadcrumb">
        <a href="/">Home</a> / <a href="/services">Services</a> / <span>${page.serviceName}</span>
      </nav>
      <header>
        <h1>${page.h1}</h1>
        <p class="lead">${page.introduction}</p>
      </header>
      <section>
        <h2>Service Overview & Technical Specifications</h2>
        <p>${page.overview}</p>
      </section>
      <section>
        <h2>Frequently Asked Questions</h2>
        ${(page.faqs || [])
          .map(
            (faq) => `
          <div class="faq-item">
            <h3>${faq.question}</h3>
            <p>${faq.answer}</p>
          </div>
        `,
          )
          .join('\n')}
      </section>
    </article>
  `

  let html = templateHtml

  // Inject into <head>
  html = html.replace('</head>', `${headInject}\n</head>`)

  // Inject initial HTML inside <div id="root"></div> for non-JS crawlers
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyInject}</div>`)

  // Determine output directory
  const pageRelPath = page.slug.replace(/^\/+/, '').replace(/\/+$/, '')
  const pageDir = join(distDir, pageRelPath)

  mkdirSync(pageDir, { recursive: true })
  writeFileSync(join(pageDir, 'index.html'), html, 'utf8')
  generatedCount++
}

// 2. Also ensure root index.html has homepage baseline tags
const homeTitle = 'MRPrint World Pvt. Ltd. — Printing, Signage & Branding Execution Partner | Nagpur'
const homeDesc =
  'MRPrint World Pvt. Ltd. is a complete brand-execution partner in Nagpur — premium printing, signage, fabrication, corporate gifting and large-scale event branding.'
const homeCanonical = `${SITE}/`

const homeHeadInject = `
  <title>${homeTitle}</title>
  <meta name="description" content="${homeDesc}" />
  <link rel="canonical" href="${homeCanonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="MRPrint World Pvt. Ltd." />
  <meta property="og:title" content="${homeTitle}" />
  <meta property="og:description" content="${homeDesc}" />
  <meta property="og:url" content="${homeCanonical}" />
  <meta property="og:image" content="${SITE}/og-cover.jpg" />
  <script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>
`
const updatedHomeHtml = templateHtml.replace('</head>', `${homeHeadInject}\n</head>`)
writeFileSync(templatePath, updatedHomeHtml, 'utf8')

console.log(`Prerendering complete! Successfully generated ${generatedCount} static HTML pages in dist/`)
