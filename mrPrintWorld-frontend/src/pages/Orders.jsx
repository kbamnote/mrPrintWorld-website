import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { apiGet } from '../lib/api'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

const STATUS = {
  PENDING_PAYMENT: { label: 'Awaiting payment', tone: 'bg-amber-50 text-amber-800' },
  PAID: { label: 'Paid — in queue', tone: 'bg-green-50 text-green-800' },
  IN_PRODUCTION: { label: 'In production', tone: 'bg-blue-50 text-blue-800' },
  DISPATCHED: { label: 'Dispatched', tone: 'bg-blue-50 text-blue-800' },
  DELIVERED: { label: 'Delivered', tone: 'bg-green-50 text-green-800' },
  CANCELLED: { label: 'Cancelled', tone: 'bg-gray-100 text-ink-soft' },
  REFUNDED: { label: 'Refunded', tone: 'bg-gray-100 text-ink-soft' },
  PAYMENT_FAILED: { label: 'Payment failed', tone: 'bg-red-50 text-red-800' },
}

export function OrderList() {
  const { isSignedIn, booting } = useCustomerAuth()
  const [state, setState] = useState({ loading: true, items: [] })

  useSeo({
    title: 'Your orders | MRPrint World',
    description: 'Your order history.',
    path: '/account/orders',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    if (!isSignedIn) return
    apiGet('/api/orders')
      .then(({ data }) => setState({ loading: false, items: data }))
      .catch(() => setState({ loading: false, items: [] }))
  }, [isSignedIn])

  if (booting) return null
  if (!isSignedIn) return <Navigate to="/login" state={{ from: '/account/orders' }} replace />

  return (
    <section className="section-y bg-surface">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link to="/account" className="text-sm text-ink-soft hover:text-primary">
            ← Account
          </Link>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Your orders</h1>

          {state.loading ? (
            <p className="mt-8 text-ink-soft">Loading…</p>
          ) : state.items.length === 0 ? (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-10 text-center">
              <p className="text-ink-soft">You haven&rsquo;t placed an order yet.</p>
              <Button to="/products" variant="primary" className="mt-4">
                Browse products
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {state.items.map((o) => {
                const s = STATUS[o.status] ?? STATUS.PENDING_PAYMENT
                return (
                  <Link
                    key={o.id}
                    to={`/account/orders/${o.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-line bg-white p-5 transition-shadow hover:shadow-card"
                  >
                    <div>
                      <span className="block font-medium text-ink">{o.orderNumber}</span>
                      <span className="text-sm text-ink-soft">
                        {o.firstItem}
                        {o.itemCount > 1 ? ` and ${o.itemCount - 1} more` : ''}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-soft">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block font-display text-lg font-bold tabular-nums text-ink">
                        {money(o.grandTotal)}
                      </span>
                      <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${s.tone}`}>
                        {s.label}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export function OrderDetail() {
  const { id } = useParams()
  const { isSignedIn, booting } = useCustomerAuth()
  const [state, setState] = useState({ loading: true, order: null, error: null })

  useSeo({
    title: 'Order | MRPrint World',
    description: 'Order details.',
    path: `/account/orders/${id}`,
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    if (!isSignedIn) return
    apiGet(`/api/orders/${id}`)
      .then(({ data }) => setState({ loading: false, order: data, error: null }))
      .catch((err) => setState({ loading: false, order: null, error: err.message }))
  }, [id, isSignedIn])

  if (booting) return null
  if (!isSignedIn) return <Navigate to="/login" state={{ from: `/account/orders/${id}` }} replace />

  const o = state.order
  const s = o ? (STATUS[o.status] ?? STATUS.PENDING_PAYMENT) : null

  return (
    <section className="section-y bg-surface">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link to="/account/orders" className="text-sm text-ink-soft hover:text-primary">
            ← Orders
          </Link>

          {state.loading && <p className="mt-8 text-ink-soft">Loading…</p>}
          {state.error && <p className="mt-8 text-red-700">{state.error}</p>}

          {o && (
            <>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-ink">{o.orderNumber}</h1>
                <span className={`rounded px-2 py-1 text-xs font-medium ${s.tone}`}>{s.label}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                Placed {new Date(o.createdAt).toLocaleString('en-IN')}
              </p>

              <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-white">
                {o.items.map((it, i) => (
                  <div key={i} className="flex gap-4 border-b border-line p-5 last:border-0">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-gray-100">
                      {it.imageUrl && (
                        <img referrerPolicy="no-referrer" src={it.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${it.slug}`} className="font-medium text-ink hover:text-primary">
                        {it.name}
                      </Link>
                      <div className="mt-1 space-y-0.5 text-xs text-ink-soft">
                        <p>Qty {it.quantity}{it.area ? ` · ${it.area} sq.ft` : ''}</p>
                        {it.selections?.map((sel) => (
                          <p key={sel.group}>{sel.groupLabel}: {sel.valueLabel}</p>
                        ))}
                      </div>
                    </div>
                    <span className="shrink-0 font-display font-bold tabular-nums text-ink">
                      {money(it.lineTotal)}
                    </span>
                  </div>
                ))}

                <div className="space-y-2 border-t border-line bg-surface p-5 text-sm">
                  <Row label="Subtotal" value={money(o.subtotal)} />
                  <Row label="GST" value={money(o.taxTotal)} />
                  <div className="flex justify-between border-t border-line pt-2 text-base">
                    <span className="font-medium text-ink">Total paid</span>
                    <span className="font-display font-bold tabular-nums text-ink">{money(o.grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Panel title="Delivery address">
                  <p className="text-sm text-ink-soft">
                    {o.shippingAddress?.name}<br />
                    {o.shippingAddress?.line1}<br />
                    {o.shippingAddress?.line2 && <>{o.shippingAddress.line2}<br /></>}
                    {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.pincode}<br />
                    {o.shippingAddress?.phone}
                  </p>
                </Panel>
                <Panel title="Progress">
                  <ol className="space-y-2 text-sm">
                    {o.timeline?.map((t, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span className="text-ink">{STATUS[t.status]?.label ?? t.status}</span>
                        <span className="shrink-0 text-xs text-ink-soft">
                          {new Date(t.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Panel>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-soft">{label}</span>
      <span className="tabular-nums text-ink">{value}</span>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
      <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-ink-soft">
        {title}
      </h2>
      {children}
    </div>
  )
}
