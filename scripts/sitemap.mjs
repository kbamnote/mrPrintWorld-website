/**
 * Generates public/sitemap.xml at build time.
 *
 * The hand-maintained sitemap listed 13 top-level URLs and none of the service
 * or product detail pages — which are the long-tail search entries ("acrylic
 * LED name plate Nagpur"). Generating it means slugs and dates can't drift out
 * of sync with the data files again.
 *
 * Slugs are read with a regex rather than by importing the data modules,
 * because those modules `import` image assets that only Vite can resolve.
 *
 * Runs automatically via the "build" script. Run standalone with: npm run sitemap
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.mrprintworld.com'
const today = new Date().toISOString().slice(0, 10)

/** Pull every `slug: 'value'` out of a data file. */
function slugs(file) {
  const src = readFileSync(join(root, 'src/data', file), 'utf8')
  return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

// Static routes, highest priority first. Mirrors App.jsx, minus /404.
const staticRoutes = [
  ['/', 'weekly', '1.0'],
  ['/services', 'monthly', '0.9'],
  ['/products', 'weekly', '0.9'],
  ['/portfolio', 'weekly', '0.8'],
  ['/contact', 'monthly', '0.8'],
  ['/request-quote', 'monthly', '0.8'],
  ['/about', 'monthly', '0.7'],
  ['/achievements', 'monthly', '0.6'],
  ['/faq', 'monthly', '0.6'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/refund-policy', 'yearly', '0.3'],
  ['/shipping-policy', 'yearly', '0.3'],
]

const serviceRoutes = slugs('services.js').map((s) => [`/services/${s}`, 'monthly', '0.7'])
const productRoutes = slugs('products.js').map((s) => [`/products/${s}`, 'monthly', '0.7'])

const routes = [...staticRoutes, ...serviceRoutes, ...productRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
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

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(
  `sitemap.xml → ${routes.length} URLs ` +
    `(${staticRoutes.length} static, ${serviceRoutes.length} services, ${productRoutes.length} products)`,
)
