import { useEffect, useState } from 'react'
import { useProducts } from '../../lib/useCatalogue'
import { isApiEnabled, fetchCategories } from '../../lib/api'
import { useCustomerAuth } from '../../lib/customerAuthContext'
import Container from '../primitives/Container'
import Reveal from '../primitives/Reveal'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'

/**
 * The browsable catalogue: category pills, subcategories, product grid.
 *
 * Shared by the main Products page and every reseller store, so both always
 * show the same admin-managed categories and products. `productHref` decides
 * where a card leads — /products/:slug on the main site, the store's own
 * product URL inside a store.
 */
export default function Catalogue({ productHref = (slug) => `/products/${slug}`, showContact = true }) {
  // A category SLUG, or 'all'. Filtering happens server-side: the API matches
  // a category and everything beneath it, so choosing "Signage" returns every
  // outdoor, indoor, retail and custom product too.
  const [activeRoot, setActiveRoot] = useState('all')
  const [activeSub, setActiveSub] = useState(null)

  const [tree, setTree] = useState([])
  const { items, loading, error } = useProducts({
    category: activeSub ?? (activeRoot === 'all' ? undefined : activeRoot),
  })

  // The tree comes from the admin panel and only lists categories that hold
  // products this visitor can see — so it is re-read after sign-in, when a
  // trade or corporate account may see a different set.
  const { isSignedIn, booting } = useCustomerAuth()
  useEffect(() => {
    if (!isApiEnabled || booting) return
    let cancelled = false
    fetchCategories()
      .then((data) => !cancelled && setTree(data))
      .catch(() => !cancelled && setTree([]))
    return () => {
      cancelled = true
    }
  }, [isSignedIn, booting])

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

  const subPill = (isActive) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary ring-1 ring-primary/40'
        : 'bg-surface text-ink-soft hover:bg-gray-100 hover:text-ink'
    }`

  return (
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

        {/* Subcategories — appear once a category that has them is chosen */}
        {subcategories.length > 0 && (
          <div className="mb-8 rounded-[var(--radius-lg)] border border-line bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">{currentRoot.name}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setActiveSub(null)} className={subPill(activeSub === null)}>
                All {currentRoot.name}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setActiveSub(sub.slug)}
                  className={subPill(activeSub === sub.slug)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {subcategories.length === 0 && <div className="mb-6" />}

        {error && !loading && (
          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Couldn&rsquo;t load products</h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">
              Please check your connection and refresh the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Refresh
            </Button>
          </div>
        )}

        {!loading && !error && (
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

        {!loading && !error && items.length === 0 && (
          <div className="rounded-[var(--radius-lg)] border border-line bg-white p-10 text-center">
            <Icon name="Image" size={40} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Nothing here yet</h2>
            <p className="mx-auto mb-6 max-w-md text-sm text-ink-soft">
              We are still adding products to this category.
            </p>
            {showContact && (
              <Button to="/contact" variant="primary">
                Contact Us
              </Button>
            )}
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
                      {(product.categories ?? []).map((c) => (typeof c === 'string' ? c : c.name)).join(' · ')}
                    </div>
                    <h3 className="mb-2 line-clamp-1 text-lg font-bold text-ink">{product.name}</h3>
                    <p className="mb-6 line-clamp-2 flex-grow text-sm text-ink-soft">{product.shortDescription}</p>

                    <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                      <Button to={productHref(product.slug)} variant="outline" size="sm" className="w-full justify-center">
                        View Details
                      </Button>
                      <Button to={productHref(product.slug)} variant="primary" size="sm" className="w-full justify-center">
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
  )
}
