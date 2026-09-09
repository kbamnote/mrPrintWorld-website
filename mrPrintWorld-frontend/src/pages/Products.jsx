import { useEffect, useState } from 'react'
import { useProducts } from '../lib/useCatalogue'
import { isApiEnabled, fetchCategories } from '../lib/api'
import { useSeo, breadcrumbLd } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Reveal from '../components/primitives/Reveal'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'

export default function Products() {
  // A category SLUG, or 'all'. Filtering happens server-side: the API matches
  // a category and everything beneath it, so choosing "Signage" returns every
  // outdoor, indoor, retail and custom product too. The previous version
  // filtered client-side against a hard-coded list of eleven old category
  // names that no longer existed, so most filters matched nothing.
  const [activeRoot, setActiveRoot] = useState('all')
  const [activeSub, setActiveSub] = useState(null)

  const [tree, setTree] = useState([])
  const { items, loading } = useProducts({
    category: activeSub ?? (activeRoot === 'all' ? undefined : activeRoot),
  })

  useEffect(() => {
    if (!isApiEnabled) return
    let cancelled = false
    fetchCategories()
      .then((data) => !cancelled && setTree(data))
      .catch(() => !cancelled && setTree([]))
    return () => {
      cancelled = true
    }
  }, [])

  useSeo({
    title: 'Products | MRPrint World',
    description: 'Explore our high-quality printing products. Built to your specification.',
    path: '/products',
    schema: [
      breadcrumbLd([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
      ]),
    ],
  })

  const currentRoot = tree.find((r) => r.slug === activeRoot)
  const subcategories = currentRoot?.children ?? []

  function chooseRoot(slug) {
    setActiveRoot(slug)
    setActiveSub(null)
  }

  const pill = (isActive) =>
    `px-4 py-2 rounded-[var(--radius-card)] text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary text-white shadow-soft'
        : 'bg-white text-ink-soft hover:text-ink hover:bg-gray-50 border border-line'
    }`

  return (
    <>
      <PageHeader
        eyebrow="Our Products"
        title="Quality products, built to your specification."
        description="Browse our comprehensive range of printing products designed to meet your specific needs."
      />
      <section className="section-y bg-surface">
        <Container>
          {/* Top-level categories */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => chooseRoot('all')} className={pill(activeRoot === 'all')}>
              All Products
            </button>
            {tree.map((root) => (
              <button
                key={root.slug}
                type="button"
                onClick={() => chooseRoot(root.slug)}
                className={pill(activeRoot === root.slug)}
              >
                {root.name}
              </button>
            ))}
          </div>

          {/* Subcategories, only once a root with children is chosen */}
          {subcategories.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2 border-l-2 border-line pl-4">
              <button
                type="button"
                onClick={() => setActiveSub(null)}
                className={`text-sm font-medium transition-colors ${
                  activeSub === null ? 'text-primary' : 'text-ink-soft hover:text-ink'
                }`}
              >
                All {currentRoot.name}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setActiveSub(sub.slug)}
                  className={`text-sm font-medium transition-colors ${
                    activeSub === sub.slug ? 'text-primary' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  · {sub.name}
                </button>
              ))}
            </div>
          )}

          {!loading && (
            <p className="mb-6 text-sm text-ink-soft">
              {items.length} product{items.length === 1 ? '' : 's'}
            </p>
          )}

          {loading && (
            <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white">
                  <div className="aspect-[4/3] animate-pulse bg-gray-100" />
                  <div className="space-y-3 p-4 md:p-6">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
              <Icon name="Image" size={40} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
              <h2 className="mb-2 font-display text-lg font-semibold text-ink">Nothing here yet</h2>
              <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">
                We are still adding products to this category.
              </p>
              <Button to="/contact" variant="primary">
                Contact Us
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3">
            {!loading &&
              items.map((product, idx) => (
                <Reveal key={product.slug} delay={Math.min(idx, 8) * 0.05}>
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
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        {(product.categories ?? [])
                          .map((c) => (typeof c === 'string' ? c : c.name))
                          .join(' · ')}
                      </div>
                      <h3 className="mb-2 line-clamp-1 text-lg font-bold text-ink">{product.name}</h3>
                      <p className="mb-6 line-clamp-2 flex-grow text-sm text-ink-soft">
                        {product.shortDescription}
                      </p>

                      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                        <Button
                          to={`/products/${product.slug}`}
                          variant="outline"
                          size="sm"
                          className="w-full justify-center"
                        >
                          View Details
                        </Button>
                        <Button
                          to={`/products/${product.slug}`}
                          variant="primary"
                          size="sm"
                          className="w-full justify-center"
                        >
                          View Price
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        </Container>
      </section>
    </>
  )
}
