/**
 * Generates public/sitemap.xml at build time.
 *
 * Product and category URLs come from the catalogue API when VITE_API_BASE_URL
 * is set; otherwise the script falls back to scraping src/data/products.js so
 * the build still works locally and before the API is deployed.
 *
 * IMPORTANT — the MIN_PRODUCT_URLS assertion below.
 *
 * The previous version regex-scraped products.js. Once products moved into
 * MongoDB that file would empty out and this script would silently emit a
 * sitemap with no product URLs at all: the build would still succeed, nothing
 * would look wrong, and the site would quietly drop 27 pages from Google. A
 * short sitemap must FAIL the build, not pass it.
 *
 * Runs automatically via `npm run build`. Standalone: npm run sitemap
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.mrprintworld.com'
const today = new Date().toISOString().slice(0, 10)

/**
 * Vite loads .env for the app, but this script runs BEFORE vite as a plain
 * Node process and would not see it. On Vercel the variables are real process
 * env vars so this is a no-op there — it exists so a local build behaves the
 * same way as a production one, rather than silently using the static fallback.
 */
function loadDotEnv() {
  try {
    const raw = readFileSync(join(root, '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    /* no .env — production, or a fresh clone */
  }
}
loadDotEnv()

const API = (process.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

/**
 * How many product URLs we expect. Below this the build stops — but only when
 * the figure came from a FALLBACK, which is the dangerous case: the API was
 * unreachable at build time and the sitemap silently lost the catalogue.
 *
 * An API that answers "zero products" is telling the truth (the catalogue is
 * genuinely empty, or being rebuilt), and must not block a deploy — otherwise
 * an empty catalogue locks you out of shipping the very fixes needed to fill
 * it again. That case warns loudly instead.
 */
const MIN_PRODUCT_URLS = Number(process.env.SITEMAP_MIN_PRODUCTS ?? 20)

/** Fallback: pull `slug: 'value'` out of a data file. */
function slugsFromFile(file) {
  try {
    const src = readFileSync(join(root, 'src/data', file), 'utf8')
    return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  } catch {
    return []
  }
}

async function fetchJson(path) {
  const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(15_000) })
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`)
  const json = await res.json()
  if (!json.ok) throw new Error(`${path} → API returned ok:false`)
  return json.data
}

/** Flatten the category tree into browse URLs. */
function categoryUrls(tree, parentSlug = null) {
  const out = []
  for (const node of tree) {
    const path = parentSlug ? `/products/c/${parentSlug}/${node.slug}` : `/products/c/${node.slug}`
    out.push([path, 'weekly', parentSlug ? '0.7' : '0.8'])
    if (node.children?.length) out.push(...categoryUrls(node.children, parentSlug ?? node.slug))
  }
  return out
}

async function collectDynamicUrls() {
  if (!API) {
    console.log('  VITE_API_BASE_URL not set — falling back to static data files')
    return {
      products: slugsFromFile('products.js').map((s) => [`/products/${s}`, 'monthly', '0.7']),
      categories: [],
      source: 'static',
    }
  }

  try {
    const [slugs, tree] = await Promise.all([
      fetchJson('/api/public/products/slugs'),
      fetchJson('/api/public/categories'),
    ])
    return {
      products: slugs.map((p) => [`/products/${p.slug}`, 'monthly', '0.7']),
      categories: categoryUrls(tree),
      source: 'api',
    }
  } catch (err) {
    console.warn(`  API unreachable (${err.message}) — falling back to static data files`)
    return {
      products: slugsFromFile('products.js').map((s) => [`/products/${s}`, 'monthly', '0.7']),
      categories: [],
      source: 'static-fallback',
    }
  }
}

// Static routes, highest priority first. Mirrors App.jsx, minus /404 and /admin.
const staticRoutes = [
  ['/', 'weekly', '1.0'],
  ['/services', 'monthly', '0.9'],
  ['/products', 'weekly', '0.9'],
  ['/portfolio', 'weekly', '0.8'],
  ['/contact', 'monthly', '0.8'],
  ['/about', 'monthly', '0.7'],
  ['/achievements', 'monthly', '0.6'],
  ['/faq', 'monthly', '0.6'],
  ['/privacy-policy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/refund-policy', 'yearly', '0.3'],
  ['/shipping-policy', 'yearly', '0.3'],
]

const serviceRoutes = slugsFromFile('services.js').map((s) => [`/services/${s}`, 'monthly', '0.7'])

const { products, categories, source } = await collectDynamicUrls()

if (products.length < MIN_PRODUCT_URLS) {
  if (source === 'api') {
    // The catalogue itself is short or empty. That is a real answer from the
    // API, so the sitemap reflects it rather than blocking the deploy.
    console.warn(
      `\n!  sitemap: only ${products.length} product URLs — the catalogue is nearly empty.\n` +
        `   Publishing anyway because the API answered. Search engines will pick the\n` +
        `   products back up once they are live again.\n`,
    )
  } else {
    console.error(
      `\n✗ sitemap: only ${products.length} product URLs (source: ${source}).\n` +
        `  The catalogue API was unreachable, so this sitemap would silently deindex\n` +
        `  every product page. Refusing to publish it.\n`,
    )
    process.exit(1)
  }
}

const routes = [...staticRoutes, ...serviceRoutes, ...categories, ...products]

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
    `(${staticRoutes.length} static, ${serviceRoutes.length} services, ` +
    `${categories.length} categories, ${products.length} products · source: ${source})`,
)
