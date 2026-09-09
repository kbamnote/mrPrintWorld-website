import { useState } from 'react'
import * as api from './adminApi'
import { Field, Input, Btn, ErrorBanner } from './ui'

export default function Login({ onSignedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const user = await api.login(email.trim(), password)
      onSignedIn(user)
    } catch (err) {
      // The backend returns one message for both "no such user" and "wrong
      // password" so the form cannot be used to discover valid addresses.
      setError({ message: err.message })
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">MRPrint World</h1>
          <p className="mt-1 text-sm text-ink-soft">Catalogue administration</p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-soft"
        >
          <ErrorBanner error={error} onDismiss={() => setError(null)} />

          <Field label="Email" required className="mb-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </Field>

          <Field label="Password" required className="mb-6">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          <Btn type="submit" disabled={busy} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Btn>
        </form>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Sign-in attempts are rate limited. After ten failures you will be locked out for 15 minutes.
        </p>
      </div>
    </div>
  )
}
