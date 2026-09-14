import { useEffect, useMemo, useState } from 'react'
import { useProducts } from '../../lib/useCatalogue'
import { isApiEnabled, fetchCategories } from '../../lib/api'
import { useCustomerAuth } from '../../lib/customerAuthContext'
import Container from '../primitives/Container'
import Reveal from '../primitives/Reveal'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'

/**
 * The browsable catalogue: picture tiles for the categories, then the
 * products inside the one you are looking at.
 *
 * Browsing is a DRILL-DOWN of any depth, matching the admin tree: tapping a
 * category shows the categories inside it, and so on, until a level has none
 * — the same way a customer expects a shop to work. The products shown are
 * always everything beneath the current category, so a parent is never empty.
 *
 * Shared by the main Products page and every reseller store; `productHref`
 * decides where a card leads.
 */
export default function Catalogue({ productHref = (slug) => `/products/${slug}`, showContact = true }) {
  const [tree, setTree] = useState([])
  // Where the customer has drilled to, as category slugs.
  const [trail, setTrail] = useState([])

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

  // Resolve the trail against the current tree, so renamed or removed
  // categories cannot leave the page pointing at something that is gone.
  const path = useMemo(() => {
    const out = []
    let level = tree
    for (const slug of trail) {
      const found = level.find((node) => node.slug === slug)
      if (!found) break
      out.push(found)
      level = found.children ?? []
    }
    return out
  }, [tree, trail])

  const current = path[path.length - 1] ?? null
  const { items, loading, error } = useProducts({ category: current?.slug })

  // One row per level of the chosen path: the top categories, then the
  // subcategories of whichever is chosen, and so on down. Every earlier row
  // stays on screen, so choosing a different category never hides the rest.
  const rows = [{ parent: null, nodes: tree }]
  for (const node of path) {
    if (node.children?.length) rows.push({ parent: node, nodes: node.children })
  }

  /** Choose a tile on a row. Choosing the chosen tile again closes that level. */
  function choose(level, slug) {
    setTrail(trail[level] === slug ? trail.slice(0, level) : [...trail.slice(0, level), slug])
  }

  const tile = 'group flex w-24 shrink-0 flex-col items-center gap-2 text-center sm:w-28'
  const circle = (selected, small) =>
    `grid place-items-center overflow-hidden rounded-full border bg-white shadow-sm transition ${
      small ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-20 w-20 sm:h-24 sm:w-24'
    } ${selected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-line group-hover:shadow-card'}`
  const label = (selected) =>
    `text-xs leading-snug sm:text-sm ${selected ? 'font-semibold text-primary' : 'font-medium text-ink'}`

  return (
    <section className="section-y bg-surface">
      <Container>
        {rows.map((row, level) => (
          <div
            key={row.parent?.slug ?? 'all'}
            className={level === 0 ? 'mb-4' : 'mb-4 rounded-[var(--radius-lg)] border border-line bg-white px-4 pt-4'}
          >
            {row.parent && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">{row.parent.name}</p>
            )}
            {/* Padding keeps the selected tile's ring from being clipped by the scroller. */}
            <div className="overflow-x-auto px-1 pb-3 pt-1">
              <div className="flex gap-4 sm:gap-6">
                {level === 0 && (
                  <button
                    type="button"
                    onClick={() => setTrail([])}
                    aria-pressed={trail.length === 0}
                    className={tile}
                  >
                    <span className={circle(trail.length === 0, false)}>
                      <span className="font-display text-sm font-bold text-primary/80">All</span>
                    </span>
                    <span className={label(trail.length === 0)}>All products</span>
                  </button>
                )}
                {row.nodes.map((node) => {
                  const selected = trail[level] === node.slug
                  return (
                    <button
                      key={node.slug}
                      type="button"
                      onClick={() => choose(level, node.slug)}
                      aria-pressed={selected}
                      className={tile}
                    >
                      <span className={circle(selected, level > 0)}>
                        {node.image?.url ? (
                          <img
                            src={node.image.url}
                            alt=""
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-display text-2xl font-bold text-primary/70" aria-hidden="true">
                            {node.name.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span className={label(selected)}>{node.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
        <div className="mb-4" />

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
            {current ? ` in ${current.name}` : ''}
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
