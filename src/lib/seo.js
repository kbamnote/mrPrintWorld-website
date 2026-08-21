import { useEffect } from 'react'
import { company } from '../data/company'

/**
 * Imperative SEO manager. Updates the document's existing <title>/<meta>/<link>
 * tags (seeded statically in index.html) on client-side route changes, and
 * injects optional per-route JSON-LD. Mutating the existing tags — rather than
 * rendering new ones — avoids duplicate <title>/OG tags in an SPA.
 */

const SITE = company.url

function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({
  title,
  description,
  path = '/',
  image = `${SITE}/og-cover.jpg`,
  type = 'website',
  jsonLd = null,
  // Pages were written against both names. `schema` is accepted as an alias so
  // the nine pages that pass it don't silently lose their structured data.
  schema = null,
  // Defaults to indexable on every route. This MUST be re-asserted per route:
  // the meta tag is shared across the SPA, so a noindex page would otherwise
  // leave the whole site noindexed after the visitor navigates away from it.
  robots = 'index, follow',
}) {
  // Both props accept a single object or an array of blocks. Serialising here
  // gives the effect a stable primitive dependency — passing the array itself
  // would rebuild it on every render and thrash the <script> tags.
  const blocks = [jsonLd, schema].flat().filter(Boolean)
  const serialised = blocks.length ? JSON.stringify(blocks) : ''

  useEffect(() => {
    const url = `${SITE}${path}`
    if (title) document.title = title
    if (description) upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)
    upsertCanonical(url)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', image)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    const scripts = (serialised ? JSON.parse(serialised) : []).map((block) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', 'route')
      script.textContent = JSON.stringify(block)
      document.head.appendChild(script)
      return script
    })
    return () => scripts.forEach((s) => s.remove())
  }, [title, description, path, image, type, robots, serialised])
}

/**
 * Helper: BreadcrumbList JSON-LD for sub-pages.
 * Call sites use both `path` and `url` for the same thing — accept either, or
 * the emitted crumb resolves to "https://www.mrprintworld.com/undefined".
 */
export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path ?? it.url ?? ''}`,
    })),
  }
}

/** Helper: Service JSON-LD */
export function serviceLd(s) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': s.title,
    'description': s.summary || s.description,
    'provider': {
      '@type': 'LocalBusiness',
      'name': company.name,
      'url': SITE,
    },
    'areaServed': ['Nagpur', 'Vidarbha', 'Maharashtra', 'India'],
  }
}

/** Helper: Product JSON-LD */
export function productLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': p.name,
    'description': p.shortDescription || p.description,
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'INR',
      'seller': {
        '@type': 'LocalBusiness',
        'name': company.name,
      }
    }
  }
}

/** Helper: FAQPage JSON-LD */
export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': items.map((it) => ({
      '@type': 'Question',
      'name': it.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': it.answer,
      },
    })),
  }
}
