import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { useSeo } from '../lib/seo'
import { readReferral } from '../lib/referral'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

const ACCOUNT_TYPES = [
  {
    code: 'B2C',
    label: 'Personal',
    blurb: 'Individual or one-off orders. Retail pricing, no approval needed.',
  },
  {
    code: 'B2B',
    label: 'Business / Trade',
    blurb: 'Regular trade buyers. Trade rates once your application is approved.',
  },
  {
    code: 'CORPORATE',
    label: 'Corporate',
    blurb: 'Companies with ongoing contract requirements and multiple users.',
  },
]

export default function Register() {
  const { register } = useCustomerAuth()
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('B2C')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    gstin: '',
    businessType: '',
    address: '',
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [referral] = useState(() => readReferral())

  useSeo({
    title: 'Create an account | MRPrint World',
    description: 'Create an MRPrint World account. Business and corporate accounts can apply for trade pricing.',
    path: '/register',
    robots: 'noindex, follow',
  })

  const needsBusiness = accountType !== 'B2C'

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.phone ? { phone: form.phone.trim() } : {}),
        accountType,
        ...(needsBusiness
          ? {
              businessProfile: {
                businessName: form.businessName.trim(),
                ...(form.gstin ? { gstin: form.gstin.trim().toUpperCase() } : {}),
                ...(form.businessType ? { businessType: form.businessType.trim() } : {}),
                ...(form.address ? { address: form.address.trim() } : {}),
              },
            }
          : {}),
      })
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const field =
    'w-full rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <section className="section-y bg-surface">
      <Container>
        <div className="mx-auto max-w-xl">
          <h1 className="font-display text-3xl font-bold text-ink">Create an account</h1>
          <p className="mt-2 text-ink-soft">
            Track your enquiries and, for trade and corporate accounts, see your agreed pricing.
          </p>

          {referral && (
            <p className="mt-4 rounded-[var(--radius-card)] border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-ink">
              You&rsquo;re joining through <strong>{referral.storeName}</strong>. They&rsquo;ll look after your
              orders, and can see your name, city and order history.
            </p>
          )}

          <form onSubmit={submit} className="mt-8 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-soft md:p-8">
            {error && (
              <div className="mb-5 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <fieldset className="mb-6">
              <legend className="mb-2 text-sm font-medium text-ink">Account type</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {ACCOUNT_TYPES.map((t) => (
                  <button
                    key={t.code}
                    type="button"
                    onClick={() => setAccountType(t.code)}
                    className={`rounded-[var(--radius-card)] border p-3 text-left transition-colors ${
                      accountType === t.code
                        ? 'border-primary bg-primary/5'
                        : 'border-line bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-sm font-semibold text-ink">{t.label}</span>
                    <span className="mt-1 block text-xs leading-snug text-ink-soft">{t.blurb}</span>
                  </button>
                ))}
              </div>

              {needsBusiness && (
                <p className="mt-3 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Trade and corporate pricing is applied after our team reviews your application.
                  You can order straight away — at retail pricing — while that is in progress.
                </p>
              )}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Full name *</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Phone</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Email *</span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={field}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Password *</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={field}
                />
                <span className="mt-1 block text-xs text-ink-soft">At least 8 characters.</span>
              </label>
            </div>

            {needsBusiness && (
              <div className="mt-6 border-t border-line pt-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-ink">Business details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink">Business name *</span>
                    <input
                      required
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink">GSTIN</span>
                    <input
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                      className={field}
                      placeholder="27AAAAA0000A1Z5"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink">Business type</span>
                    <input
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      className={field}
                      placeholder="Retailer, agency, manufacturer…"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-ink">Business address</span>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={field}
                    />
                  </label>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={busy} className="mt-8 w-full justify-center">
              {busy ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
