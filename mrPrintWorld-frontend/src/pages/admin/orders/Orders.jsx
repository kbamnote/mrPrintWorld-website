import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as api from '../adminApi'
import { Badge, Btn, Drawer, EmptyState, ErrorBanner, Input, Spinner, Textarea } from '../ui'

const money = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const when = (d) =>
  d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—'

const STATUS = {
  PENDING_PAYMENT: { label: 'Awaiting payment', tone: 'neutral' },
  PAID: { label: 'Paid', tone: 'amber' },
  IN_PRODUCTION: { label: 'In production', tone: 'blue' },
  DISPATCHED: { label: 'Dispatched', tone: 'blue' },
  DELIVERED: { label: 'Delivered', tone: 'green' },
  CANCELLED: { label: 'Cancelled', tone: 'red' },
  REFUNDED: { label: 'Refunded', tone: 'red' },
  PAYMENT_FAILED: { label: 'Payment failed', tone: 'red' },
}
/** What an admin may move an order to, from the status it is in. */
const NEXT = {
  PAID: ['IN_PRODUCTION', 'CANCELLED', 'REFUNDED'],
  IN_PRODUCTION: ['DISPATCHED', 'CANCELLED', 'REFUNDED'],
  DISPATCHED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  PENDING_PAYMENT: ['CANCELLED'],
  PAYMENT_FAILED: ['CANCELLED'],
}

/** Orders from the website: filter by status, open one to see it and move it along. */
export default function Orders() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const search = params.get('search') ?? ''
  const page = Number(params.get('page') ?? 1)
  const [typed, setTyped] = useState(search)
  const [state, setState] = useState({ loading: true, error: null, items: [], meta: null })
  const [openId, setOpenId] = useState(null)

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  // The current list stays on screen until the new one arrives.
  const load = useCallback(() => {
    api
      .listOrders({ status, search, page, limit: 50 })
      .then(({ items, meta }) => setState({ loading: false, error: null, items, meta }))
      .catch((error) => setState({ loading: false, error, items: [], meta: null }))
  }, [status, search, page])

  useEffect(load, [load])

  const chip = (active) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
      active ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:border-primary'
    }`

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {state.meta ? `${state.meta.total} order${state.meta.total === 1 ? '' : 's'}` : ''}
          {state.meta?.awaitingAction ? ` · ${state.meta.awaitingAction} paid and waiting to start` : ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(!status)} onClick={() => set('status', '')}>
          All
        </button>
        {Object.entries(STATUS).map(([key, s]) => (
          <button key={key} type="button" className={chip(status === key)} onClick={() => set('status', key)}>
            {s.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          set('search', typed.trim())
        }}
        className="flex max-w-md gap-2"
      >
        <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Order number, customer name or email" />
        <Btn type="submit" variant="outline">
          Search
        </Btn>
      </form>

      <ErrorBanner error={state.error} />

      {state.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : state.items.length === 0 ? (
        <EmptyState title="No orders here" description={status || search ? 'Try another filter.' : 'Orders placed on the website will appear here.'} />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[46rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setOpenId(o.id)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-surface/60"
                >
                  <td className="px-4 py-3 font-medium text-ink">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-ink-soft">{when(o.createdAt)}</td>
                  <td className="px-4 py-3 text-ink">
                    {o.customer?.name ?? '—'}
                    {o.resellerSnapshot?.storeName && (
                      <span className="block text-xs text-ink-soft">via {o.resellerSnapshot.storeName}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{o.items?.length ?? 0}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink">{money(o.grandTotal)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS[o.status]?.tone ?? 'neutral'}>{STATUS[o.status]?.label ?? o.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {state.meta && state.meta.pages > 1 && (
        <div className="flex items-center gap-3 text-sm text-ink-soft">
          <Btn variant="outline" size="sm" disabled={page <= 1} onClick={() => set('page', String(page - 1))}>
            Previous
          </Btn>
          Page {page} of {state.meta.pages}
          <Btn variant="outline" size="sm" disabled={page >= state.meta.pages} onClick={() => set('page', String(page + 1))}>
            Next
          </Btn>
        </div>
      )}

      <Drawer open={Boolean(openId)} onClose={() => setOpenId(null)}>
        {openId && <OrderDetail key={openId} id={openId} onClose={() => setOpenId(null)} onChanged={load} />}
      </Drawer>
    </div>
  )
}

function address(a) {
  if (!a) return null
  const skip = new Set(['name', 'phone', 'country', '_id'])
  return Object.entries(a)
    .filter(([k, v]) => !skip.has(k) && typeof v === 'string' && v.trim())
    .map(([, v]) => v)
    .join(', ')
}

function OrderDetail({ id, onClose, onChanged }) {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    api.getOrder(id).then(setOrder).catch(setError)
  }, [id])
  useEffect(load, [load])

  async function move(status) {
    setBusy(true)
    setError(null)
    try {
      await api.setOrderStatus(id, status, note.trim())
      setNote('')
      load()
      onChanged()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(false)
    }
  }

  if (!order) {
    return (
      <div className="p-6">
        <ErrorBanner error={error} />
        {!error && <Spinner />}
      </div>
    )
  }

  const next = NEXT[order.status] ?? []
  return (
    <div className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Order {order.orderNumber}</h2>
          <p className="text-sm text-ink-soft">
            {when(order.createdAt)} ·{' '}
            <Badge tone={STATUS[order.status]?.tone ?? 'neutral'}>{STATUS[order.status]?.label ?? order.status}</Badge>{' '}
            · payment {order.payment?.status?.toLowerCase()}
          </p>
        </div>
        <Btn variant="ghost" size="sm" onClick={onClose}>
          Close
        </Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <section className="grid gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">Customer</h3>
          <p className="text-sm text-ink">{order.customer?.name}</p>
          {order.customer?.phone && (
            <a href={`tel:${order.customer.phone}`} className="block text-sm text-primary">
              {order.customer.phone}
            </a>
          )}
          {order.customer?.email && (
            <a href={`mailto:${order.customer.email}`} className="block text-sm text-primary">
              {order.customer.email}
            </a>
          )}
          {order.customer?.gstin && <p className="text-xs text-ink-soft">GSTIN {order.customer.gstin}</p>}
          {order.resellerSnapshot?.storeName && (
            <p className="mt-1 text-xs text-ink-soft">
              Reseller sale via {order.resellerSnapshot.storeName} ({order.resellerSnapshot.code})
            </p>
          )}
        </div>
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">Deliver to</h3>
          <p className="text-sm text-ink">{order.shippingAddress?.name}</p>
          <p className="text-sm text-ink-soft">{address(order.shippingAddress) ?? '—'}</p>
          {order.shippingAddress?.phone && <p className="text-sm text-ink-soft">{order.shippingAddress.phone}</p>}
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">Items</h3>
        <ul className="divide-y divide-line">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3 py-2 text-sm">
              <div>
                <p className="font-medium text-ink">
                  {item.name} × {item.quantity.toLocaleString('en-IN')}
                </p>
                {item.selections?.length > 0 && (
                  <p className="text-xs text-ink-soft">
                    {item.selections.map((s) => `${s.groupLabel}: ${s.valueLabel}`).join(' · ')}
                  </p>
                )}
              </div>
              <span className="tabular-nums text-ink">{money(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between text-ink-soft">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{money(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink-soft">
            <dt>GST</dt>
            <dd className="tabular-nums">{money(order.taxTotal)}</dd>
          </div>
          {order.shippingTotal > 0 && (
            <div className="flex justify-between text-ink-soft">
              <dt>Shipping</dt>
              <dd className="tabular-nums">{money(order.shippingTotal)}</dd>
            </div>
          )}
          <div className="flex justify-between font-semibold text-ink">
            <dt>Total</dt>
            <dd className="tabular-nums">{money(order.grandTotal)}</dd>
          </div>
        </dl>
        {order.customerNote && <p className="mt-3 text-sm text-ink-soft">Note from customer: {order.customerNote}</p>}
      </section>

      {next.length > 0 && (
        <section className="space-y-3 rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Move this order to</h3>
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional) — e.g. courier and tracking number" maxLength={500} />
          <div className="flex flex-wrap gap-2">
            {next.map((s) => (
              <Btn
                key={s}
                variant={['CANCELLED', 'REFUNDED'].includes(s) ? 'danger' : 'primary'}
                size="sm"
                disabled={busy}
                onClick={() => {
                  if (['CANCELLED', 'REFUNDED'].includes(s) && !window.confirm(`Mark order ${order.orderNumber} as ${STATUS[s].label.toLowerCase()}?`)) return
                  move(s)
                }}
              >
                {STATUS[s].label}
              </Btn>
            ))}
          </div>
        </section>
      )}

      {order.timeline?.length > 0 && (
        <section className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">History</h3>
          <ol className="space-y-2 text-sm">
            {[...order.timeline].reverse().map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-28 shrink-0 text-xs text-ink-soft">{when(t.at)}</span>
                <span className="text-ink">
                  {STATUS[t.status]?.label ?? t.status}
                  {t.note && <span className="block text-xs text-ink-soft">{t.note}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
