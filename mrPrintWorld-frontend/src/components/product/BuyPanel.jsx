import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useCart } from '../../lib/cartContext'
import { useCustomerAuth } from '../../lib/customerAuthContext'
import { calculatePrice } from '../../lib/api'
import Button from '../primitives/Button'

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

/**
 * Configure-and-buy panel.
 *
 * Every price shown here comes from POST /api/pricing/calculate. The component
 * holds the CONFIGURATION and renders whatever number the server returns; it
 * never multiplies anything itself. That is what keeps the product page, the
 * cart and the payment amount in agreement — there is only one calculator.
 */
export default function BuyPanel({ product }) {
  const { add } = useCart()
  const { tierCode, tierName, isSignedIn, booting } = useCustomerAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const needsSize = ['AREA', 'OPTION'].includes(product.pricingModel)
  const [qty, setQty] = useState(product.moq?.qty ?? 1)
  const [dims, setDims] = useState({ width: 4, height: 8 })
  const [selections, setSelections] = useState({})
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const buyable = product.purchaseMode !== 'QUOTE_ONLY' && product.pricingModel !== 'QUOTE_ONLY'

  // Ask the server for a price whenever the configuration changes.
  useEffect(() => {
    if (!buyable || !isSignedIn) return
    const controller = new AbortController()
    const t = setTimeout(() => {
      setLoading(true)
      calculatePrice(
        {
          slug: product.slug,
          quantity: qty,
          ...(needsSize ? { width: dims.width, height: dims.height } : {}),
          selections: Object.entries(selections).map(([group, value]) => ({ group, value })),
        },
        { signal: controller.signal },
      )
        .then(setQuote)
        .catch(() => setQuote(null))
        .finally(() => setLoading(false))
    }, 300) // debounce while someone types a dimension

    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [product.slug, qty, dims, selections, needsSize, buyable, isSignedIn])

  if (booting) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <div className="h-10 animate-pulse rounded bg-gray-100" />
      </div>
    )
  }

  /**
   * Signed-out gate.
   *
   * Pricing is for account holders, so an anonymous visitor gets a "View
   * price" prompt rather than a figure. `state.from` carries them straight
   * back to this product after signing in, so the sign-in is not a dead end.
   */
  if (!isSignedIn) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-ink">Pricing for account holders</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Sign in to see pricing for this product and order online.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-4 w-full justify-center"
          onClick={() => navigate('/login', { state: { from: location.pathname } })}
        >
          View Price
        </Button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          No account?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>{' '}
          — it takes a minute.
        </p>
      </div>
    )
  }

  if (!buyable) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <h3 className="font-display text-lg font-semibold text-ink">Priced on specification</h3>
        <p className="mt-1 text-sm text-ink-soft">
          This one depends on site, materials and finish, so our team prices it directly. Send us the
          details and we&rsquo;ll come back with a figure.
        </p>
        <Button to="/contact" variant="primary" size="lg" className="mt-4 w-full justify-center">
          Contact Us
        </Button>
      </div>
    )
  }

  function addToCart() {
    add({
      slug: product.slug,
      quantity: qty,
      ...(needsSize ? { width: Number(dims.width), height: Number(dims.height) } : {}),
      selections: Object.entries(selections).map(([group, value]) => ({ group, value })),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const field =
    'w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
      <div className="space-y-4">
        {needsSize && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Width (ft)</span>
              <input
                type="number" min="0.5" step="0.5" value={dims.width}
                onChange={(e) => setDims({ ...dims, width: Number(e.target.value) })}
                className={`${field} tabular-nums`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Height (ft)</span>
              <input
                type="number" min="0.5" step="0.5" value={dims.height}
                onChange={(e) => setDims({ ...dims, height: Number(e.target.value) })}
                className={`${field} tabular-nums`}
              />
            </label>
          </div>
        )}

        {/* Options are rendered from the API's description of them — this
            component has no knowledge of any specific product. */}
        {product.options?.map((opt) => (
          <label key={opt.code} className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              {opt.label}
              {opt.required && <span className="ml-0.5 text-red-500">*</span>}
            </span>
            <select
              value={selections[opt.code] ?? ''}
              onChange={(e) => setSelections({ ...selections, [opt.code]: e.target.value })}
              className={field}
            >
              <option value="">Choose…</option>
              {opt.values.map((v) => (
                <option key={v.code} value={v.code}>{v.label}</option>
              ))}
            </select>
            {opt.helpText && <span className="mt-1 block text-xs text-ink-soft">{opt.helpText}</span>}
          </label>
        ))}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Quantity</span>
          <input
            type="number" min={product.moq?.qty ?? 1} value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className={`${field} tabular-nums`}
          />
          {product.moq?.qty > 1 && (
            <span className="mt-1 block text-xs text-ink-soft">
              Minimum order {product.moq.qty} {product.moq.unit ?? 'units'}.
            </span>
          )}
        </label>
      </div>

      {/* Price */}
      <div className="mt-5 border-t border-line pt-5">
        {loading ? (
          <span className="text-sm text-ink-soft">Calculating…</span>
        ) : quote?.quotable ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold tabular-nums text-ink">
                {money(quote.total)}
              </span>
              {tierCode !== 'B2C' && (
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {tierName}
                </span>
              )}
            </div>
            {quote.area && (
              <p className="mt-1 text-sm text-ink-soft">{quote.area} sq.ft · excluding GST</p>
            )}
            {quote.negotiated && (
              <p className="mt-1 text-sm font-medium text-green-700">Your contracted rate</p>
            )}
            {quote.soldBy && <p className="mt-1 text-sm text-ink-soft">Sold via {quote.soldBy}</p>}
          </>
        ) : (
          <p className="text-sm text-ink-soft">
            {quote?.reason ?? 'Enter the details above to see a price.'}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3">
        <Button
          variant="primary" size="lg" className="w-full justify-center"
          disabled={!quote?.quotable || loading}
          onClick={addToCart}
        >
          {added ? 'Added to cart' : 'Add to cart'}
        </Button>

        {added && (
          <Button variant="outline" size="lg" className="w-full justify-center" onClick={() => navigate('/cart')}>
            View cart
          </Button>
        )}

        {/* Even a priced product can need a conversation — bespoke sizes,
            site surveys, unusual finishes. */}
        {quote?.requiresQuote && (
          <Button to="/contact" variant="outline" className="w-full justify-center">
            Talk to us about a custom job
          </Button>
        )}
      </div>
    </div>
  )
}
