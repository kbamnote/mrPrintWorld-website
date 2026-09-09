import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/cartContext'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

export default function Cart() {
  const { lines, priced, pricing, updateQuantity, remove } = useCart()
  const { isSignedIn, tierCode, tierName } = useCustomerAuth()
  const navigate = useNavigate()

  useSeo({
    title: 'Your cart | MRPrint World',
    description: 'Review the items in your cart.',
    path: '/cart',
    robots: 'noindex, nofollow',
  })

  const hasIssues = (priced?.issues?.length ?? 0) > 0
  const canCheckout = !pricing && !hasIssues && (priced?.items?.length ?? 0) > 0

  if (lines.length === 0) {
    return (
      <section className="section-y bg-surface">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <Icon name="Image" size={44} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
            <h1 className="font-display text-2xl font-bold text-ink">Your cart is empty</h1>
            <p className="mt-2 text-ink-soft">
              Browse the catalogue and add what you need — or tell us about a custom job and we&rsquo;ll quote it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/products" variant="primary">
                Browse products
              </Button>
              <Button to="/request-quote" variant="outline">
                Request a quote
              </Button>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="section-y bg-surface">
      <Container>
        <h1 className="font-display text-3xl font-bold text-ink">Your cart</h1>
        {tierCode !== 'B2C' && (
          <p className="mt-1 text-sm text-ink-soft">
            Prices shown are your <strong className="text-ink">{tierName}</strong> rates.
          </p>
        )}

        {hasIssues && (
          <div className="mt-6 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-900">Some items need attention</p>
            <ul className="mt-1 list-disc pl-5 text-sm text-amber-900">
              {priced.issues.map((i, n) => (
                <li key={n}>{i.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {lines.map((line, i) => {
              // Match the priced item back to this line by position among the
              // successfully priced items.
              const item = priced?.items?.find((it) => it.slug === line.slug)
              return (
                <div
                  key={`${line.slug}-${i}`}
                  className="flex gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-4"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    {item?.imageUrl && (
                      <img
                        referrerPolicy="no-referrer"
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${line.slug}`} className="font-medium text-ink hover:text-primary">
                      {item?.name ?? line.slug}
                    </Link>

                    <div className="mt-1 space-y-0.5 text-xs text-ink-soft">
                      {line.width && line.height && (
                        <p>
                          {line.width} × {line.height} ft
                          {item?.area ? ` · ${item.area} sq.ft` : ''}
                        </p>
                      )}
                      {item?.selections?.map((s) => (
                        <p key={s.group}>
                          {s.groupLabel}: {s.valueLabel}
                        </p>
                      ))}
                      {item?.negotiated && (
                        <p className="font-medium text-green-700">Your contracted rate applied</p>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <span className="text-ink-soft">Qty</span>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateQuantity(i, Number(e.target.value))}
                          className="w-20 rounded-[var(--radius-card)] border border-line px-2 py-1 text-sm tabular-nums"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="text-sm text-ink-soft underline-offset-2 hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {pricing ? (
                      <span className="text-sm text-ink-soft">…</span>
                    ) : item ? (
                      <>
                        <span className="block font-display text-lg font-bold tabular-nums text-ink">
                          {money(item.lineTotal)}
                        </span>
                        {item.taxPercent > 0 && (
                          <span className="block text-xs text-ink-soft">+{item.taxPercent}% GST</span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-amber-700">Unavailable</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-ink">Summary</h2>

              {pricing ? (
                <p className="mt-4 text-sm text-ink-soft">Calculating…</p>
              ) : priced ? (
                <>
                  <dl className="mt-4 space-y-2 text-sm">
                    <Row label="Subtotal" value={money(priced.subtotal)} />
                    <Row label="GST" value={money(priced.taxTotal)} />
                    <Row label="Delivery" value="Quoted separately" muted />
                  </dl>
                  <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                    <span className="font-medium text-ink">Total</span>
                    <span className="font-display text-2xl font-bold tabular-nums text-ink">
                      {money(priced.grandTotal)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-ink-soft">Could not price this cart right now.</p>
              )}

              <Button
                variant="primary"
                size="lg"
                className="mt-6 w-full justify-center"
                disabled={!canCheckout}
                onClick={() => navigate(isSignedIn ? '/checkout' : '/login', { state: { from: '/checkout' } })}
              >
                {isSignedIn ? 'Checkout' : 'Sign in to checkout'}
              </Button>

              <p className="mt-3 text-center text-xs text-ink-soft">
                Delivery is quoted separately once we confirm the job.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}

function Row({ label, value, muted }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={muted ? 'text-ink-soft' : 'tabular-nums text-ink'}>{value}</dd>
    </div>
  )
}
