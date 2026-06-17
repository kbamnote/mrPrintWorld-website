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
}) {
  useEffect(() => {
    const url = `${SITE}${path}`
    if (title) document.title = title
    if (description) upsertMeta('name', 'description', description)
    upsertCanonical(url)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:image', image)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)

    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', 'route')
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => {
      if (script) script.remove()
    }
  }, [title, description, path, image, type, jsonLd])
}

/** Helper: BreadcrumbList JSON-LD for sub-pages. */
export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  }
}
