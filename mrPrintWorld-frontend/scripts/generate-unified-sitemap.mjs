import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.mrprintworld.com'
const today = new Date().toISOString().slice(0, 10)

// 1. Static Core Pages
const staticRoutes = [
  ['/', 'weekly', '1.0'],
  ['/services', 'monthly', '0.9'],
  ['/products', 'weekly', '0.9'],
  ['/portfolio', 'weekly', '0.8'],
  ['/contact', 'monthly', '0.8'],
  ['/careers', 'weekly', '0.6'],
  ['/about', 'monthly', '0.7'],
  ['/achievements', 'monthly', '0.6'],
  ['/faq', 'monthly', '0.6'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/refund-policy', 'yearly', '0.3'],
  ['/shipping-policy', 'yearly', '0.3'],
]

// 2. Service Pages from services.js
function getServiceSlugs() {
  try {
    const src = readFileSync(join(root, 'src/data/services.js'), 'utf8')
    return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  } catch {
    return []
  }
}
const serviceRoutes = getServiceSlugs().map((s) => [`/services/${s}`, 'monthly', '0.8'])

// 3. All 100+ SEO Landing Pages from config
const { seoLandingPages } = await import('../src/data/seoLandingPages.js')
const seoRoutes = seoLandingPages.map((p) => [
  p.url.startsWith('/') ? p.url : `/${p.url}`,
  p.changefreq || 'weekly',
  p.priority || '0.8',
])

// 4. Combine all routes into one master sitemap.xml
const allRoutes = [...staticRoutes, ...serviceRoutes, ...seoRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    ([path, changefreq, priority]) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml, 'utf8')
console.log(`Generated public/sitemap.xml with ${allRoutes.length} total URLs (${seoLandingPages.length} SEO landing pages).`)

// 5. Update robots.txt to point directly to sitemap.xml
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.mrprintworld.com/sitemap.xml
`
writeFileSync(join(root, 'public/robots.txt'), robotsTxt, 'utf8')
console.log('Updated public/robots.txt pointing to https://www.mrprintworld.com/sitemap.xml')
