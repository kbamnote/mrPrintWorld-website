import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from './adminApi'
import { Card, Spinner, Badge, ErrorBanner } from './ui'

/**
 * Dashboard — deliberately a work queue rather than vanity metrics.
 *
 * The two numbers that matter right now are how many products still need a
 * real photograph and how many still need pricing, because those are what
 * stand between the migrated catalogue and a publishable one.
 */
export default function Dashboard() {
  const [state, setState] = useState({ loading: true, error: null, data: null })

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.listProducts({ limit: 1 }),
      api.listProducts({ limit: 1, isActive: 'true' }),
      api.listProducts({ limit: 1, needsImage: 'true' }),
      api.listProducts({ limit: 1, needsPrice: 'true' }),
      api.listCategories(),
    ])
      .then(([all, active, noImage, noPrice, cats]) => {
        if (cancelled) return
        setState({
          loading: false,
          error: null,
          data: {
            total: all.meta.total,
            active: active.meta.total,
            needsImage: noImage.meta.total,
            needsPrice: noPrice.meta.total,
            categories: cats.length,
            roots: cats.filter((c) => c.depth === 0).length,
          },
        })
      })
      .catch((err) => !cancelled && setState({ loading: false, error: err, data: null }))
    return () => {
      cancelled = true
    }
  }, [])

  if (state.loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  const d = state.data

  return (
    <div className="space-y-6">
      <ErrorBanner error={state.error} />

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Catalogue</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {d ? `${d.total} products across ${d.categories} categories (${d.roots} top level).` : ''}
        </p>
      </div>

      {d && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total products" value={d.total} />
            <Stat label="Live on the site" value={d.active} tone={d.active > 0 ? 'green' : 'neutral'} />
            <Stat
              label="Need a real photo"
              value={d.needsImage}
              tone={d.needsImage > 0 ? 'amber' : 'green'}
              to="/admin/products?needsImage=true"
            />
            <Stat
              label="Need pricing"
              value={d.needsPrice}
              tone={d.needsPrice > 0 ? 'amber' : 'green'}
              to="/admin/products?needsPrice=true"
            />
          </div>

          {d.needsImage > 0 && (
            <Card title="Photography backlog">
              <p className="text-sm text-ink-soft">
                <strong className="text-ink">{d.needsImage}</strong> product
                {d.needsImage === 1 ? '' : 's'} still show a migrated third-party image rather than your own
                photography. Those images are hotlinked from other companies&rsquo; servers, so they can break
                without warning — and they are the most likely thing to be noticed in due diligence.
              </p>
              <Link
                to="/admin/products?needsImage=true"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Review them →
              </Link>
            </Card>
          )}

          {d.needsPrice > 0 && (
            <Card title="Pricing backlog">
              <p className="text-sm text-ink-soft">
                <strong className="text-ink">{d.needsPrice}</strong> product
                {d.needsPrice === 1 ? '' : 's'} are quote-only because no price is set. That is a valid state —
                but a product with a price can be bought online, and a quote-only one cannot.
              </p>
              <Link
                to="/admin/products?needsPrice=true"
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Add pricing →
              </Link>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function Stat({ label, value, tone = 'neutral', to }) {
  const body = (
    <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
      <div className="font-display text-3xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm text-ink-soft">{label}</span>
        {tone !== 'neutral' && value > 0 && <Badge tone={tone}>{tone === 'amber' ? 'todo' : 'ok'}</Badge>}
      </div>
    </div>
  )
  return to ? (
    <Link to={to} className="block transition-shadow hover:shadow-card">
      {body}
    </Link>
  ) : (
    body
  )
}
