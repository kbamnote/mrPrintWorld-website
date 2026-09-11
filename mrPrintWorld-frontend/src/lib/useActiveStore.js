import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { useCustomerAuth } from './customerAuthContext'
import {
  normaliseCode,
  readReferral,
  readStoreHint,
  rememberStore,
  forgetStore,
  captureReferralCode,
} from './referral'

/**
 * Which reseller store, if any, this visitor is shopping in.
 *
 *   - A signed-in customer who belongs to a reseller: their reseller, always.
 *     They are that reseller's customer for life, so they always see the store.
 *   - Anyone on /store/:code: that store.
 *   - An anonymous visitor who arrived through a store link: that store.
 *   - Everyone else: no store — the full MRPrint World site.
 *
 * @returns {{ store: {code, storeName}|null, routeCode: string|null, invalidRoute: boolean, booting: boolean }}
 */
export function useActiveStore() {
  const match = useMatch('/store/:code/*')
  const routeCode = normaliseCode(match?.params.code)
  const { user, isSignedIn, booting } = useCustomerAuth()
  // code → { code, storeName } once checked, or null when it is not a live store
  const [checked, setChecked] = useState({})

  useEffect(() => {
    if (!routeCode || routeCode in checked) return
    let cancelled = false
    captureReferralCode(routeCode).then((result) => {
      if (!cancelled) setChecked((m) => ({ ...m, [routeCode]: result }))
    })
    return () => {
      cancelled = true
    }
  }, [routeCode, checked])

  // Keep a signed-in customer's store on hand, so the next visit opens in the
  // store straight away instead of flashing the main site while the session loads.
  useEffect(() => {
    if (booting) return
    if (user?.soldBy?.code) rememberStore(user.soldBy)
    else if (isSignedIn) forgetStore()
  }, [booting, isSignedIn, user])

  const hint = readReferral() ?? readStoreHint()
  const routeStore = routeCode ? checked[routeCode] : undefined // undefined = still checking
  const ownStore = !booting && isSignedIn && user?.soldBy?.code ? user.soldBy : null

  let store = null
  if (routeCode) {
    if (routeStore !== null) {
      store =
        ownStore ??
        routeStore ?? { code: routeCode, storeName: hint?.code === routeCode ? hint.storeName : null }
    }
  } else if (booting) {
    store = hint
  } else if (isSignedIn) {
    store = ownStore
  } else {
    store = hint
  }

  // `booting`: while the session loads, `store` is only a best guess from
  // this browser's memory — good enough to draw the right header, not to
  // redirect anyone on.
  return { store, routeCode, invalidRoute: Boolean(routeCode) && routeStore === null, booting }
}
