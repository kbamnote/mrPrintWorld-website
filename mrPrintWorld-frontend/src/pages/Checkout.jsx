import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/cartContext'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { apiPost } from '../lib/api'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

/** Load Razorpay's checkout script once, on demand. */
function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(window.Razorpay)
    s.onerror = () => reject(new Error('Could not load the payment window. Check your connection.'))
    document.body.appendChild(s)
  })
}

export default function Checkout() {
  const { lines, priced, pricing, clear } = useCart()
  const { user, isSignedIn, booting } = useCustomerAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
  })
  const [note, setNote] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useSeo({
    title: 'Checkout | MRPrint World',
    description: 'Complete your order.',
    path: '/checkout',
    robots: 'noindex, nofollow',
  })

  // Prefill from the account so a returning customer types less.
  useEffect(() => {
    if (user) setAddress((a) => ({ ...a, name: a.name || user.name, phone: a.phone || (user.phone ?? '') }))
  }, [user])

  if (booting) return null
  if (!isSignedIn) return <Navigate to="/login" state={{ from: '/checkout' }} replace />
  if (lines.length === 0) return <Navigate to="/cart" replace />

  async function pay(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    try {
      // The server re-prices the whole cart here and returns the amount IT
      // computed. Nothing about the total is taken from this page.
      const { data } = await apiPost('/api/orders', {
        lines,
        shippingAddress: address,
        ...(note ? { customerNote: note } : {}),
      })

      const Razorpay = await loadRazorpay()

      const rzp = new Razorpay({
        key: data.razorpayKeyId,
        order_id: data.razorpayOrderId,
        amount: Math.round(data.amount * 100),
        currency: data.currency,
        name: 'MRPrint World Pvt. Ltd.',
        description: `Order ${data.orderNumber}`,
        prefill: {
          name: data.customer?.name ?? address.name,
          email: data.customer?.email ?? '',
          contact: address.phone,
        },
        theme: { color: '#0B6B43' },

        handler: async (response) => {
          try {
            // The signature is verified server-side. This callback alone
            // proves nothing — the HMAC does.
            await apiPost(`/api/orders/${data.orderId}/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            clear()
            navigate(`/account/orders/${data.orderId}`, { replace: true })
          } catch (err) {
            // The webhook is the backstop: if money moved, the order still
            // becomes paid server-side even though this call failed.
            setError(
              `${err.message} If you were charged, your order will still be confirmed automatically — order ${data.orderNumber}.`,
            )
            setBusy(false)
          }
        },

        modal: {
          ondismiss: () => {
            setBusy(false)
            setError(`Payment cancelled. Order ${data.orderNumber} is saved and can be paid from your account.`)
          },
        },
      })

      rzp.on('payment.failed', (resp) => {
        setError(resp.error?.description ?? 'Payment failed. No money has been taken.')
        setBusy(false)
      })

      rzp.open()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <section className="section-y bg-surface">
      <Container>
        <h1 className="font-display text-3xl font-bold text-ink">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <form onSubmit={pay} className="space-y-6 lg:col-span-2">
            {error && (
              <div className="rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}

            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">Delivery address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Name *</span>
                  <input required value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Phone *</span>
                  <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className={field} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Address *</span>
                  <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className={field} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Address line 2</span>
                  <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">City *</span>
                  <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">State *</span>
                  <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">PIN code *</span>
                  <input required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className={field} />
                </label>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Notes for our team</span>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`${field} resize-y`}
                  placeholder="Artwork details, deadlines, site access…"
                />
              </label>
              <p className="mt-2 text-xs text-ink-soft">
                Send artwork over WhatsApp after ordering and we&rsquo;ll match it to your order number.
              </p>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={busy || pricing} className="w-full justify-center">
              {busy ? 'Opening payment…' : `Pay ${priced ? money(priced.grandTotal) : ''}`}
            </Button>
          </form>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {priced?.items?.map((it, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="min-w-0 text-ink-soft">
                      <span className="block truncate text-ink">{it.name}</span>
                      <span className="text-xs">
                        Qty {it.quantity}
                        {it.area ? ` · ${it.area} sq.ft` : ''}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums text-ink">{money(it.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              {priced && (
                <>
                  <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">Subtotal</dt>
                      <dd className="tabular-nums text-ink">{money(priced.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">GST</dt>
                      <dd className="tabular-nums text-ink">{money(priced.taxTotal)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                    <span className="font-medium text-ink">Total</span>
                    <span className="font-display text-2xl font-bold tabular-nums text-ink">
                      {money(priced.grandTotal)}
                    </span>
                  </div>
                </>
              )}
              <p className="mt-4 text-xs text-ink-soft">
                The final amount is confirmed by our server at the moment of payment, so it always matches
                the current rate for your account.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
