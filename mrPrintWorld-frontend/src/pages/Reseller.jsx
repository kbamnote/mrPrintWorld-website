import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { apiGet, apiSend } from '../lib/api'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

/**
 * The reseller's dashboard: share links, prices, customers, orders and
 * commission. Every figure comes from the API — this page never works out a
 * price or a commission itself.
 */

const money = (n) =>
  n === null || n === undefined ? '—' : `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const day = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
const whatsapp = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products & prices' },
  { id: 'customers', label: 'Customers' },
  { id: 'orders', label: 'Orders' },
]

const smallBtn =
  'inline-flex items-center justify-center rounded-[var(--radius-card)] border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-gray-50'
const th = 'px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft'
const td = 'px-4 py-3 align-top'

export default function Reseller() {
  const { user, booting, isSignedIn } = useCustomerAuth()
  const [tab, setTab] = useState('overview')
  const [me, setMe] = useState(null)
  const [error, setError] = useState(null)

  useSeo({
    title: 'Reseller dashboard | MRPrint World',
    description: 'Your reseller dashboard.',
    path: '/account/reseller',
    robots: 'noindex, nofollow',
  })

  const isReseller = ['ACTIVE', 'PAUSED'].includes(user?.reseller?.status)

  const loadMe = useCallback(
    () =>
      apiGet('/api/reseller/me')
        .then(({ data }) => setMe(data))
        .catch((err) => setError(err.message)),
    [],
  )

  useEffect(() => {
    if (isSignedIn && isReseller) loadMe()
  }, [isSignedIn, isReseller, loadMe])

  if (booting) return null
  if (!isSignedIn) return <Navigate to="/login" state={{ from: '/account/reseller' }} replace />
  if (!isReseller) return <Navigate to="/account" replace />

  const code = me?.code ?? user.reseller.code
  const origin = window.location.origin
  const links = {
    store: `${origin}/?ref=${code}`,
    product: (slug) => `${origin}/products/${slug}?ref=${code}`,
  }
  const storeName = me?.storeName ?? user.reseller.storeName

  return (
    <section className="section-y bg-surface">
      <Container>
        <div className="mx-auto max-w-5xl">
          <Link to="/account" className="text-sm text-ink-soft hover:text-primary">
            ← Account
          </Link>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">{storeName}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Reseller dashboard · your code <code className="font-semibold text-ink">{code}</code>
          </p>

          {(me?.status ?? user.reseller.status) === 'PAUSED' && (
            <p className="mt-4 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Your reseller account is paused. Your customers currently pay our normal prices and no commission
              is recorded. Contact us to resume.
            </p>
          )}
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-1 border-b border-line" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? 'border-primary text-primary' : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === 'overview' && <Overview me={me} links={links} storeName={storeName} onChanged={loadMe} />}
            {tab === 'products' && <ProductsTab links={links} defaultMarkup={me?.defaultMarkupPercent ?? null} />}
            {tab === 'customers' && <CustomersTab />}
            {tab === 'orders' && <OrdersTab holdDays={me?.holdDays ?? 7} />}
          </div>
        </div>
      </Container>
    </section>
  )
}

function Loading() {
  return (
    <div className="flex justify-center py-16">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" />
    </div>
  )
}

function CopyButton({ text, label = 'Copy link' }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link', text)
    }
  }
  return (
    <button type="button" onClick={copy} className={smallBtn}>
      {copied ? 'Copied' : label}
    </button>
  )
}

function Stat({ label, value, hint, accent }) {
  return (
    <div className={`rounded-[var(--radius-lg)] border bg-white p-5 ${accent ? 'border-primary/40' : 'border-line'}`}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</span>
      <span className={`mt-2 block font-display text-2xl font-bold tabular-nums ${accent ? 'text-primary' : 'text-ink'}`}>
        {value}
      </span>
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </div>
  )
}

/* ── Overview ──────────────────────────────────────────────────────────── */

function Overview({ me, links, storeName, onChanged }) {
  if (!me) return <Loading />
  const s = me.stats

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Customers" value={s.customers} />
        <Stat label="Orders" value={s.orders} hint={`${money(s.sales)} sales before GST`} />
        <Stat
          label="Commission pending"
          value={money(s.commissionPending)}
          hint={`Ready ${me.holdDays} days after the order is delivered`}
        />
        <Stat
          label="Commission ready"
          value={money(s.commissionReady)}
          hint="Withdrawals open with your wallet, coming next"
          accent
        />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Your store link</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Anyone who signs up through your link becomes your customer, for good — even if they come back to
          the site directly later.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            readOnly
            value={links.store}
            onFocus={(e) => e.target.select()}
            className="min-w-[16rem] flex-1 rounded-[var(--radius-card)] border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
          <CopyButton text={links.store} />
          <a
            href={whatsapp(`${storeName} — printing, signage and branding. Browse and order here: ${links.store}`)}
            target="_blank"
            rel="noreferrer"
            className={smallBtn}
          >
            Share on WhatsApp
          </a>
        </div>
      </div>

      <DefaultPricing me={me} onChanged={onChanged} />
    </div>
  )
}

function DefaultPricing({ me, onChanged }) {
  const [mode, setMode] = useState(me.defaultMarkupPercent === null ? 'retail' : 'markup')
  const [percent, setPercent] = useState(me.defaultMarkupPercent ?? 20)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      await apiSend('PATCH', '/api/reseller/settings', {
        defaultMarkupPercent: mode === 'retail' ? null : Number(percent),
      })
      await onChanged()
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Your prices</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Applies to every product, unless you set a different markup on the Products tab. You can never be
        charged more than you earn — prices below your own cost are not allowed.
      </p>

      <div className="mt-4 space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <input type="radio" name="mode" checked={mode === 'retail'} onChange={() => setMode('retail')} className="mt-1" />
          <span>
            <span className="block font-medium text-ink">Our retail price</span>
            <span className="text-ink-soft">You earn the difference between your trade price and retail.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="radio" name="mode" checked={mode === 'markup'} onChange={() => setMode('markup')} className="mt-1" />
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-ink">Your trade price plus</span>
            <input
              type="number"
              min="0"
              step="1"
              value={percent}
              disabled={mode !== 'markup'}
              onChange={(e) => setPercent(e.target.value)}
              className="w-20 rounded-[var(--radius-card)] border border-line px-2 py-1 text-sm tabular-nums disabled:opacity-50"
            />
            <span className="text-ink-soft">%</span>
          </span>
        </label>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={saving || (mode === 'markup' && (percent === '' || Number(percent) < 0))}>
          {saving ? 'Saving…' : 'Save prices'}
        </Button>
        {saved && <span className="text-sm font-medium text-green-700">Saved</span>}
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </form>
  )
}

/* ── Products & prices ─────────────────────────────────────────────────── */

function ProductsTab({ links, defaultMarkup }) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [state, setState] = useState({ loading: true, items: [], error: null })

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 350)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(() => {
    const qs = new URLSearchParams({ limit: '100' })
    if (query.length >= 2) qs.set('search', query)
    return apiGet(`/api/reseller/products?${qs}`)
      .then(({ data }) => setState({ loading: false, items: data, error: null }))
      .catch((err) => setState({ loading: false, items: [], error: err.message }))
  }, [query])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-sm sm:w-72"
        />
        <p className="text-xs text-ink-soft">
          Prices are &ldquo;from&rdquo; the smallest order. Leave a markup blank to use your default
          {defaultMarkup === null ? ' (retail price)' : ` (${defaultMarkup}%)`}.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      {state.loading ? (
        <Loading />
      ) : state.items.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-8 text-center text-sm text-ink-soft">
          No products match.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="border-b border-line bg-surface">
              <tr>
                <th className={th}>Product</th>
                <th className={`${th} text-right`}>Your cost</th>
                <th className={`${th} text-right`}>Customer pays</th>
                <th className={`${th} text-right`}>You earn</th>
                <th className={th}>Markup</th>
                <th className={th}>Share</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((p) => (
                <tr key={`${p.id}:${p.markupPercent}`} className="border-b border-line last:border-0">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                        {p.image && (
                          <img src={p.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{p.name}</span>
                        {p.unit && !p.quoteOnly && <span className="text-xs text-ink-soft">per {p.unit}</span>}
                        {p.quoteOnly && <span className="text-xs text-ink-soft">Priced on request</span>}
                      </span>
                    </div>
                  </td>
                  <td className={`${td} text-right tabular-nums text-ink-soft`}>{money(p.costFrom)}</td>
                  <td className={`${td} text-right tabular-nums text-ink`}>{money(p.sellFrom)}</td>
                  <td className={`${td} text-right font-medium tabular-nums text-primary`}>{money(p.earnFrom)}</td>
                  <td className={td}>
                    {p.costFrom === null ? (
                      <span className="text-xs text-ink-soft">—</span>
                    ) : (
                      <MarkupCell product={p} defaultMarkup={defaultMarkup} onSaved={load} />
                    )}
                  </td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1">
                      <CopyButton text={links.product(p.slug)} />
                      <a
                        href={whatsapp(
                          `${p.name}${p.sellFrom ? ` — from ${money(p.sellFrom)}${p.unit ? ` per ${p.unit}` : ''}` : ''}. Order here: ${links.product(p.slug)}`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className={smallBtn}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/** Per-product markup. Blank means "use my default". Saves on Enter or when leaving the box. */
function MarkupCell({ product, defaultMarkup, onSaved }) {
  const [value, setValue] = useState(product.markupPercent ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function save() {
    const next = value === '' ? null : Number(value)
    if (next === (product.markupPercent ?? null)) return
    if (next !== null && (!Number.isFinite(next) || next < 0)) {
      setError('Use 0 or more')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await apiSend('PUT', `/api/reseller/products/${product.id}/markup`, { markupPercent: next })
      await onSaved()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          step="1"
          value={value}
          disabled={saving}
          placeholder={defaultMarkup === null ? 'Retail' : String(defaultMarkup)}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          aria-label={`Markup for ${product.name}`}
          className="w-20 rounded-[var(--radius-card)] border border-line px-2 py-1 text-sm tabular-nums"
        />
        <span className="text-xs text-ink-soft">%</span>
      </div>
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </div>
  )
}

/* ── Customers ─────────────────────────────────────────────────────────── */

function CustomersTab() {
  const [state, setState] = useState({ loading: true, items: [], error: null })

  useEffect(() => {
    apiGet('/api/reseller/customers')
      .then(({ data }) => setState({ loading: false, items: data, error: null }))
      .catch((err) => setState({ loading: false, items: [], error: err.message }))
  }, [])

  if (state.loading) return <Loading />
  if (state.error) return <p className="text-sm text-red-700">{state.error}</p>
  if (state.items.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-8 text-center text-sm text-ink-soft">
        No customers yet. Share your store link — anyone who signs up through it becomes your customer.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="border-b border-line bg-surface">
          <tr>
            <th className={th}>Customer</th>
            <th className={th}>City</th>
            <th className={th}>Joined</th>
            <th className={`${th} text-right`}>Orders</th>
            <th className={`${th} text-right`}>Spent before GST</th>
          </tr>
        </thead>
        <tbody>
          {state.items.map((c) => (
            <tr key={c.id} className="border-b border-line last:border-0">
              <td className={`${td} font-medium text-ink`}>{c.name}</td>
              <td className={`${td} text-ink-soft`}>{c.city ?? '—'}</td>
              <td className={`${td} text-ink-soft`}>{day(c.joinedAt)}</td>
              <td className={`${td} text-right tabular-nums`}>{c.orders}</td>
              <td className={`${td} text-right tabular-nums`}>{money(c.spent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Orders ────────────────────────────────────────────────────────────── */

const COMMISSION_BADGE = {
  PENDING: 'bg-amber-50 text-amber-800',
  READY: 'bg-green-50 text-green-800',
  CANCELLED: 'bg-gray-100 text-ink-soft',
}

function OrdersTab({ holdDays }) {
  const [state, setState] = useState({ loading: true, items: [], error: null })

  useEffect(() => {
    apiGet('/api/reseller/orders')
      .then(({ data }) => setState({ loading: false, items: data, error: null }))
      .catch((err) => setState({ loading: false, items: [], error: err.message }))
  }, [])

  if (state.loading) return <Loading />
  if (state.error) return <p className="text-sm text-red-700">{state.error}</p>
  if (state.items.length === 0) {
    return (
      <p className="rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-8 text-center text-sm text-ink-soft">
        No orders yet. When your customers order, each one appears here with the commission you earn on it.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-ink-soft">
        Commission is ready {holdDays} days after an order is delivered. Cancelled or refunded orders earn nothing.
      </p>
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
        <table className="w-full min-w-[52rem] text-sm">
          <thead className="border-b border-line bg-surface">
            <tr>
              <th className={th}>Order</th>
              <th className={th}>Customer</th>
              <th className={`${th} text-right`}>Sale before GST</th>
              <th className={`${th} text-right`}>Your commission</th>
              <th className={th}>Commission</th>
            </tr>
          </thead>
          <tbody>
            {state.items.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className={td}>
                  <span className="block font-medium text-ink">{o.orderNumber}</span>
                  <span className="text-xs text-ink-soft">
                    {day(o.createdAt)} · {o.firstItem}
                    {o.itemCount > 1 ? ` and ${o.itemCount - 1} more` : ''}
                  </span>
                </td>
                <td className={td}>
                  <span className="block text-ink">{o.customerName}</span>
                  {o.city && <span className="text-xs text-ink-soft">{o.city}</span>}
                </td>
                <td className={`${td} text-right tabular-nums`}>{money(o.sale)}</td>
                <td className={`${td} text-right font-medium tabular-nums text-primary`}>{money(o.commission)}</td>
                <td className={td}>
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${COMMISSION_BADGE[o.commissionState]}`}>
                    {o.commissionState === 'READY' ? 'Ready' : o.commissionState === 'CANCELLED' ? 'Cancelled' : 'Pending'}
                  </span>
                  <span className="mt-1 block text-xs text-ink-soft">
                    {o.commissionState === 'PENDING'
                      ? o.readyOn
                        ? `Ready ${day(o.readyOn)}`
                        : `Order ${o.status.replace(/_/g, ' ').toLowerCase()}`
                      : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
