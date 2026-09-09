import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCustomerAuth } from '../lib/customerAuthContext'
import { useSeo } from '../lib/seo'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'

export default function Login() {
  const { signIn, isSignedIn } = useCustomerAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useSeo({
    title: 'Sign in | MRPrint World',
    description: 'Sign in to your MRPrint World account to see your pricing and manage enquiries.',
    path: '/login',
    // An account page has nothing for a search engine and should not compete
    // with the product pages for crawl budget.
    robots: 'noindex, follow',
  })

  if (isSignedIn) {
    navigate(location.state?.from ?? '/account', { replace: true })
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(form.email.trim(), form.password)
      navigate(location.state?.from ?? '/account', { replace: true })
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
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-3xl font-bold text-ink">Sign in</h1>
          <p className="mt-2 text-ink-soft">
            Access your account, saved details and your agreed pricing.
          </p>

          <form onSubmit={submit} className="mt-8 rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-soft">
            {error && (
              <div className="mb-5 rounded-[var(--radius-card)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                required
                autoComplete="username"
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={field}
              />
            </label>

            <label className="mb-6 block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={field}
              />
            </label>

            <Button type="submit" variant="primary" size="lg" disabled={busy} className="w-full justify-center">
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            No account yet?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
