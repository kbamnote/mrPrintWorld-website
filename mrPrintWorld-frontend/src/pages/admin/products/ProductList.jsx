import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as api from '../adminApi'
import { Btn, Badge, Input, Select, Spinner, ErrorBanner, EmptyState } from '../ui'

export default function ProductList() {
  const [params, setParams] = useSearchParams()
  const [state, setState] = useState({ loading: true, items: [], meta: null, error: null })
  const [search, setSearch] = useState(params.get('search') ?? '')
  const [categories, setCategories] = useState([])

  // The category tree, so products can be worked one category at a time and a
  // new product can be created straight into the category being viewed.
  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  const query = {
    search: params.get('search') ?? '',
    isActive: params.get('isActive') ?? '',
    category: params.get('category') ?? '',
    needsImage: params.get('needsImage') ?? '',
    needsPrice: params.get('needsPrice') ?? '',
    page: Number(params.get('page') ?? 1),
    limit: 50,
  }

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }))
    api
      .listProducts(query)
      .then(({ items, meta }) => setState({ loading: false, items, meta, error: null }))
      .catch((error) => setState({ loading: false, items: [], meta: null, error }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  useEffect(load, [load])

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  // Debounce the search box so a query is not fired on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== (params.get('search') ?? '')) setParam('search', search)
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  async function toggleActive(product) {
    // Optimistic: flip locally, revert if the server disagrees.
    const previous = product.isActive
    setState((s) => ({
      ...s,
      items: s.items.map((p) => (p._id === product._id ? { ...p, isActive: !previous } : p)),
    }))
    try {
      await api.updateProduct(product._id, { isActive: !previous })
    } catch (error) {
      setState((s) => ({
        ...s,
        error,
        items: s.items.map((p) => (p._id === product._id ? { ...p, isActive: previous } : p)),
      }))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
          {state.meta && (
            <p className="mt-1 text-sm text-ink-soft">{state.meta.total} in the catalogue</p>
          )}
        </div>
        <Link to={`/admin/products/new${query.category ? `?category=${query.category}` : ''}`}>
          <Btn>New product</Btn>
        </Link>
      </div>

      <ErrorBanner error={state.error} onDismiss={() => setState((s) => ({ ...s, error: null }))} />

      <div className="flex flex-wrap gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full sm:w-64"
        />
        <Select
          value={query.category}
          onChange={(e) => setParam('category', e.target.value)}
          className="w-auto"
        >
          <option value="">All categories</option>
          {categories
            .filter((c) => !c.parent)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((root) => (
              <optgroup key={root._id} label={root.name}>
                {/* The root itself matches everything beneath it. */}
                <option value={root._id}>All {root.name}</option>
                {categories
                  .filter((c) => String(c.parent) === String(root._id))
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.productCount ?? 0})
                    </option>
                  ))}
              </optgroup>
            ))}
        </Select>
        <Select value={query.isActive} onChange={(e) => setParam('isActive', e.target.value)} className="w-auto">
          <option value="">All statuses</option>
          <option value="true">Live</option>
          <option value="false">Draft</option>
        </Select>
        <Btn
          variant={query.needsImage ? 'primary' : 'outline'}
          size="md"
          onClick={() => setParam('needsImage', query.needsImage ? '' : 'true')}
        >
          Needs photo
        </Btn>
        <Btn
          variant={query.needsPrice ? 'primary' : 'outline'}
          size="md"
          onClick={() => setParam('needsPrice', query.needsPrice ? '' : 'true')}
        >
          Needs price
        </Btn>
      </div>

      {state.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : state.items.length === 0 ? (
        <EmptyState
          title="No products match"
          description="Try clearing the filters, or create a new product."
          action={
            <Link to="/admin/products/new">
              <Btn>New product</Btn>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Categories</th>
                <th className="px-4 py-3 font-semibold">Pricing</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {state.items.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                        {(p.images?.[0]?.url ?? p.legacyImageUrl) && (
                          <img
                            referrerPolicy="no-referrer"
                            src={p.images?.[0]?.url ?? p.legacyImageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          to={`/admin/products/${p._id}`}
                          className="block truncate font-medium text-ink hover:text-primary"
                        >
                          {p.name}
                        </Link>
                        <code className="text-[0.7rem] text-ink-soft">/{p.slug}</code>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {(p.categories ?? []).map((c) => c.name ?? '—').join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={p.pricingModel === 'QUOTE_ONLY' ? 'amber' : 'blue'}>
                      {p.pricingModel === 'QUOTE_ONLY' ? 'quote only' : p.pricingModel.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={p.isActive ? 'green' : 'neutral'}>{p.isActive ? 'live' : 'draft'}</Badge>
                      {p.hasLegacyImage && <Badge tone="amber">borrowed photo</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Btn variant="ghost" size="sm" onClick={() => toggleActive(p)}>
                      {p.isActive ? 'Unpublish' : 'Publish'}
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {state.meta && state.meta.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Btn
            variant="outline"
            size="sm"
            disabled={query.page <= 1}
            onClick={() => setParams({ ...Object.fromEntries(params), page: String(query.page - 1) })}
          >
            Previous
          </Btn>
          <span className="text-sm text-ink-soft">
            Page {state.meta.page} of {state.meta.pages}
          </span>
          <Btn
            variant="outline"
            size="sm"
            disabled={query.page >= state.meta.pages}
            onClick={() => setParams({ ...Object.fromEntries(params), page: String(query.page + 1) })}
          >
            Next
          </Btn>
        </div>
      )}
    </div>
  )
}
