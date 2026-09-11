import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { apiPost } from '../lib/api'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

const STATUS_COPY = {
  ACTIVE: { tone: 'neutral', label: 'Active' },
  B2B_PENDING: { tone: 'amber', label: 'Trade application under review' },
  B2B_APPROVED: { tone: 'green', label: 'Trade account approved' },
  B2B_REJECTED: { tone: 'red', label: 'Trade application declined' },
  CORPORATE_PENDING: { tone: 'amber', label: 'Corporate application under review' },
  CORPORATE_APPROVED: { tone: 'green', label: 'Corporate account approved' },
  CORPORATE_REJECTED: { tone: 'red', label: 'Corporate application declined' },
  SUSPENDED: { tone: 'red', label: 'Suspended' },
}

const TONES = {
  neutral: 'bg-gray-100 text-ink-soft',
  amber: 'bg-amber-50 text-amber-800',
  green: 'bg-green-50 text-green-800',
  red: 'bg-red-50 text-red-800',
}

export default function Account() {
  const { user, booting, isSignedIn, signOut, applyForTier, hasPendingApplication, refreshUser } = useCustomerAuth()
  const [showApply, setShowApply] = useState(false)

  useSeo({
    title: 'Your account | MRPrint World',
    description: 'Manage your MRPrint World account.',
    path: '/account',
    robots: 'noindex, nofollow',
  })

  if (booting) {
    return (
      <section className="section-y bg-surface">
        <Container>
          <div className="flex justify-center py-20">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" />
          </div>
        </Container>
      </section>
    )
  }

  if (!isSignedIn) return <Navigate to="/login" state={{ from: '/account' }} replace />

  const status = STATUS_COPY[user.status] ?? STATUS_COPY.ACTIVE
  const canApply = user.tier.code === 'B2C' && !hasPendingApplication

  return (
    <section className="section-y bg-surface">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">Your account</h1>
              <p className="mt-1 text-ink-soft">{user.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>

          {/* Pricing tier — the thing a trade customer actually logs in to check */}
          <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-white p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Your pricing
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-bold text-ink">{user.tier.name}</span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${TONES[status.tone]}`}>
                {status.label}
              </span>
            </div>

            {user.tier.code === 'B2C' && hasPendingApplication && (
              <p className="mt-3 text-sm text-ink-soft">
                Your application is with our team. Until it is approved you are on retail pricing —
                you can still order, and we will confirm by email once the review is done.
              </p>
            )}

            {user.status?.endsWith('_REJECTED') && user.rejectionReason && (
              <p className="mt-3 rounded-[var(--radius-card)] bg-red-50 px-4 py-3 text-sm text-red-800">
                {user.rejectionReason}
              </p>
            )}

            {user.tier.code !== 'B2C' && (
              <p className="mt-3 text-sm text-ink-soft">
                Prices shown across the site are your {user.tier.name.toLowerCase()} rates.
              </p>
            )}
          </div>

          {canApply && (
            <div className="mt-4 rounded-[var(--radius-lg)] border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Buying for a business?
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Apply for a trade or corporate account to be quoted at contract rates.
              </p>
              {showApply ? (
                <ApplyForm
                  onCancel={() => setShowApply(false)}
                  onSubmit={applyForTier}
                  initial={user.businessProfile}
                />
              ) : (
                <Button variant="primary" className="mt-4" onClick={() => setShowApply(true)}>
                  Apply for trade pricing
                </Button>
              )}
            </div>
          )}

          <ResellerCard user={user} onApplied={refreshUser} />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Detail label="Name" value={user.name} />
            <Detail label="Phone" value={user.phone ?? '—'} />
            <Detail label="Account type" value={user.accountType} />
            {user.businessProfile?.businessName && (
              <Detail label="Business" value={user.businessProfile.businessName} />
            )}
            {user.businessProfile?.gstin && <Detail label="GSTIN" value={user.businessProfile.gstin} />}
          </div>

          <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-line bg-white p-6 text-center">
            <p className="text-sm text-ink-soft">
              Need something not in the catalogue?{' '}
              <Link to="/contact" className="font-medium text-primary hover:underline">
                Contact us
              </Link>{' '}
              and our team will follow up directly.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

/**
 * The reseller programme, from the customer's side: apply (approved trade
 * accounts only), wait for review, then open the dashboard.
 */
function ResellerCard({ user, onApplied }) {
  const [storeName, setStoreName] = useState(user.businessProfile?.businessName ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const status = user.reseller?.status

  if (status === 'ACTIVE' || status === 'PAUSED') {
    return (
      <div className="mt-4 rounded-[var(--radius-lg)] border border-primary/30 bg-white p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Reseller</span>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block font-display text-xl font-bold text-ink">{user.reseller.storeName}</span>
            <span className="text-sm text-ink-soft">
              Your code <code className="font-semibold text-ink">{user.reseller.code}</code>
              {status === 'PAUSED' && ' · paused'}
            </span>
          </div>
          <Button to="/account/reseller" variant="primary">
            Open reseller dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'PENDING') {
    return (
      <div className="mt-4 rounded-[var(--radius-lg)] border border-line bg-white p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Reseller</span>
        <p className="mt-2 text-sm text-ink-soft">
          Your application to resell as <strong className="text-ink">{user.reseller.storeName}</strong> is with
          our team. We&rsquo;ll let you know once it is approved.
        </p>
      </div>
    )
  }

  // Reselling earns the gap between trade price and the customer's price.
  if (user.tier.code === 'B2C') return null

  async function apply(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await apiPost('/api/reseller/apply', { storeName: storeName.trim() })
      await onApplied()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 rounded-[var(--radius-lg)] border border-line bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Resell our products</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Share products with your own customers at a price you set. They pay MRPrint World; the difference
        between your trade price and theirs is credited to you.
      </p>
      <form onSubmit={apply} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block min-w-[14rem] flex-1">
          <span className="mb-1 block text-xs font-medium text-ink">Store name your customers will see</span>
          <input
            required
            minLength={2}
            maxLength={80}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <Button type="submit" variant="primary" disabled={busy || storeName.trim().length < 2}>
          {busy ? 'Applying…' : 'Apply to resell'}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-4">
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</span>
      <span className="mt-1 block text-ink">{value}</span>
    </div>
  )
}

function ApplyForm({ onCancel, onSubmit, initial }) {
  const [accountType, setAccountType] = useState('B2B')
  const [form, setForm] = useState({
    businessName: initial?.businessName ?? '',
    gstin: initial?.gstin ?? '',
    businessType: initial?.businessType ?? '',
    address: initial?.address ?? '',
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const field =
    'w-full rounded-[var(--radius-card)] border border-line bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSubmit(accountType, {
        businessName: form.businessName.trim(),
        ...(form.gstin ? { gstin: form.gstin.trim().toUpperCase() } : {}),
        ...(form.businessType ? { businessType: form.businessType.trim() } : {}),
        ...(form.address ? { address: form.address.trim() } : {}),
      })
      onCancel()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 border-t border-line pt-4">
      {error && (
        <div className="rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {['B2B', 'CORPORATE'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setAccountType(t)}
            className={`rounded-[var(--radius-card)] border px-4 py-2 text-sm font-medium transition-colors ${
              accountType === t ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink-soft'
            }`}
          >
            {t === 'B2B' ? 'Trade' : 'Corporate'}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Business name *</span>
          <input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">GSTIN</span>
          <input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Business type</span>
          <input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink">Address</span>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={field} />
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? 'Submitting…' : 'Submit application'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
