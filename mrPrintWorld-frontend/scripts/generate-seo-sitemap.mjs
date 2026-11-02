import { writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.mrprintworld.com'
const today = new Date().toISOString().slice(0, 10)

// Import the SEO landing page database
const { seoLandingPages } = await import('../src/data/seoLandingPages.js')

// Generate public/sitemap-seo.xml
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seoLandingPages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq || 'weekly'}</changefreq>
    <priority>${p.priority || '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const sitemapPath = join(root, 'public/sitemap-seo.xml')
writeFileSync(sitemapPath, xml, 'utf8')
console.log(`Generated public/sitemap-seo.xml with ${seoLandingPages.length} landing pages.`)

// Create a unified sitemap index for search engines
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE}/sitemap-seo.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`
writeFileSync(join(root, 'public/sitemap-index.xml'), sitemapIndex, 'utf8')
console.log('Generated public/sitemap-index.xml referencing primary and SEO sitemaps.')

// Safely update robots.txt to mention the new sitemaps without removing any directives
const robotsContent = `User-agent: *
Allow: /

Sitemap: https://www.mrprintworld.com/sitemap.xml
Sitemap: https://www.mrprintworld.com/sitemap-seo.xml
Sitemap: https://www.mrprintworld.com/sitemap-index.xml
`
writeFileSync(join(root, 'public/robots.txt'), robotsContent, 'utf8')
console.log('Updated public/robots.txt with sitemap references.')
