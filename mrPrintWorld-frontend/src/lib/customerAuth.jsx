import { useCallback, useEffect, useMemo, useState } from 'react'
import { setAuthToken, apiPost, apiGet, isApiEnabled } from './api'
import { CustomerAuthContext } from './customerAuthContext'
import { readReferral, clearReferral } from './referral'

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
    // A reseller's share link, remembered from an earlier visit.
    const ref = readReferral()
    const { data } = await apiPost('/api/auth/register', {
      ...payload,
      ...(ref ? { referralCode: ref.code } : {}),
    })
    clearReferral()
    setAuthToken(data.accessToken)
    setUser(data.user)
    return data
  }, [])

  /** Re-read the account after something server-side changed it. */
  const refreshUser = useCallback(async () => {
    const { data } = await apiGet('/api/auth/me')
    setUser(data)
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
      // The reseller this customer buys through — shown as "Sold via …".
      soldBy: user?.soldBy ?? null,
      resellerStatus: user?.reseller?.status ?? null,
      signIn,
      register,
      signOut,
      applyForTier,
      refreshUser,
    }),
    [user, booting, signIn, register, signOut, applyForTier, refreshUser],
  )

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

