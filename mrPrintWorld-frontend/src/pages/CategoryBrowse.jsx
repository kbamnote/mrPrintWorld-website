import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { isApiEnabled, fetchCategory } from '../lib/api'
import { useProducts } from '../lib/useCatalogue'
import { useSeo, breadcrumbLd } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Reveal from '../components/primitives/Reveal'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'

/**
 * Browse a category or subcategory: /products/c/signage/outdoor-signage
 *
 * These pages are new — they did not exist in the static site — so they add
 * roughly fifteen indexable landing pages targeting the terms customers
 * actually search ("outdoor signage Nagpur") rather than only the generic
 * /products page.
 */
export default function CategoryBrowse() {
  const { category, subcategory } = useParams()
  const activeSlug = subcategory ?? category

  const [meta, setMeta] = useState({ data: null, loading: isApiEnabled, notFound: false })
  const { items, loading: productsLoading } = useProducts({ category: activeSlug })

  useEffect(() => {
    if (!isApiEnabled) return
    const controller = new AbortController()
    let cancelled = false
    setMeta((m) => ({ ...m, loading: true }))

    fetchCategory(activeSlug, { signal: controller.signal })
      .then((data) => !cancelled && setMeta({ data, loading: false, notFound: false }))
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        setMeta({ data: null, loading: false, notFound: err.status === 404 })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [activeSlug])

  const title = meta.data?.name ?? 'Products'
  const crumbs = meta.data?.breadcrumb ?? []

  useSeo({
    title: meta.data ? `${meta.data.name} | MRPrint World` : 'Products | MRPrint World',
    description:
      meta.data?.seo?.description ??
      meta.data?.description ??
      `Browse ${title} from MRPrint World Pvt. Ltd. — printing, signage and branding in Nagpur.`,
    path: subcategory ? `/products/c/${category}/${subcategory}` : `/products/c/${category}`,
    schema: meta.data
      ? [
          breadcrumbLd([
            { name: 'Home', url: '/' },
            { name: 'Products', url: '/products' },
            ...crumbs.map((c) => ({ name: c.name, url: `/products/c/${c.slug}` })),
            {
              name: meta.data.name,
              url: subcategory ? `/products/c/${category}/${subcategory}` : `/products/c/${category}`,
            },
          ]),
        ]
      : undefined,
  })

  // Category browsing only exists with the API; without it, send visitors to
  // the flat product list rather than showing a broken page.
  if (!isApiEnabled || meta.notFound) return <Navigate to="/products" replace />

  const children = meta.data?.children ?? []

  return (
    <>
      <PageHeader
        eyebrow={crumbs.length ? crumbs.map((c) => c.name).join(' / ') : 'Our Products'}
        title={meta.loading ? 'Loading…' : title}
        description={meta.data?.description ?? undefined}
      />

      <section className="section-y bg-surface">
        <Container>
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-ink-soft" aria-label="Breadcrumb">
            <Link to="/products" className="transition-colors hover:text-primary">
              All Products
            </Link>
            {crumbs.map((c) => (
              <span key={c.slug} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link to={`/products/c/${c.slug}`} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              </span>
            ))}
            {meta.data && (
              <span className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="font-medium text-ink">{meta.data.name}</span>
              </span>
            )}
          </nav>

          {/* Subcategory rail — only on a root category that has children */}
          {children.length > 0 && (
            <div className="mb-12 flex flex-wrap gap-2">
              {children.map((child) => (
                <Link
                  key={child.slug}
                  to={`/products/c/${category}/${child.slug}`}
                  className="rounded-[var(--radius-card)] border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-gray-50 hover:text-ink"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}

          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
                  <div className="aspect-[4/3] animate-pulse bg-gray-100" />
                  <div className="space-y-3 p-4 md:p-6">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
              <Icon name="Image" size={40} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
              <h2 className="mb-2 font-display text-lg font-semibold text-ink">Nothing here yet</h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">
                We are still adding products to this category. Tell us what you need and we will quote it directly.
              </p>
              <Button to="/request-quote" variant="primary">
                Request a Quote
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
              {items.map((product, idx) => (
                <Reveal key={product.slug} delay={idx * 0.05}>
                  <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-sm transition-shadow hover:shadow-card">
                    <div className="group relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {product.image?.url ? (
                        <img
                          referrerPolicy="no-referrer"
                          src={product.image.url}
                          alt={product.image.alt ?? product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Icon name="Image" size={48} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-grow flex-col p-4 md:p-6">
                      <h3 className="mb-2 line-clamp-1 text-lg font-bold text-ink">{product.name}</h3>
                      <p className="mb-6 line-clamp-2 flex-grow text-sm text-ink-soft">
                        {product.shortDescription}
                      </p>
                      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                        <Button to={`/products/${product.slug}`} variant="outline" size="sm" className="w-full justify-center">
                          View Details
                        </Button>
                        <Button
                          to={`/request-quote?product=${product.slug}`}
                          variant="primary"
                          size="sm"
                          className="w-full justify-center"
                        >
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
