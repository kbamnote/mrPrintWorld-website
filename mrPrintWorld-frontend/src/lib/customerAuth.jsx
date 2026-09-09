import { useCallback, useEffect, useMemo, useState } from 'react'
import { setAuthToken, apiPost, isApiEnabled } from './api'
import { CustomerAuthContext } from './customerAuthContext'

/**
 * Customer session.
 *
 * The access token lives in memory only. Persistence comes from the httpOnly
 * refresh cookie the API sets, which JavaScript cannot read — so an XSS on the
 * marketing site cannot lift a session.
 *
 * Note what this provider does NOT do: it never decides pricing. It knows which
 * tier the server says the customer is on, purely so the UI can label a price
 * ("Trade price"). Every figure still comes from the server.
 */

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(isApiEnabled)

  useEffect(() => {
    if (!isApiEnabled) return
    let cancelled = false

    // Exchange the refresh cookie for an access token on load. A 401 here is
    // the normal case for a visitor who is not signed in, so it is not an
    // error state — it just means anonymous.
    apiPost('/api/auth/refresh')
      .then(({ data }) => {
        if (cancelled) return
        setAuthToken(data.accessToken)
        setUser(data.user)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => !cancelled && setBooting(false))

    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data } = await apiPost('/api/auth/login', { email, password })
    setAuthToken(data.accessToken)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await apiPost('/api/auth/register', payload)
    setAuthToken(data.accessToken)
    setUser(data.user)
    return data
  }, [])

  const signOut = useCallback(async () => {
    await apiPost('/api/auth/logout').catch(() => {})
    setAuthToken(null)
    setUser(null)
  }, [])

  const applyForTier = useCallback(async (accountType, businessProfile) => {
    const { data } = await apiPost('/api/auth/apply', { accountType, businessProfile })
    setUser(data.user)
    return data
  }, [])

  const value = useMemo(
    () => ({
      user,
      booting,
      isSignedIn: Boolean(user),
      // What the server is actually pricing this customer at.
      tierCode: user?.tier?.code ?? 'B2C',
      tierName: user?.tier?.name ?? 'Retail',
      hasPendingApplication: ['B2B_PENDING', 'CORPORATE_PENDING'].includes(user?.status),
      signIn,
      register,
      signOut,
      applyForTier,
    }),
    [user, booting, signIn, register, signOut, applyForTier],
  )

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

