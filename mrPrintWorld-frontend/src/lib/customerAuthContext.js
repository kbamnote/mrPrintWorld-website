import { createContext, useContext } from 'react'

/**
 * Kept separate from the provider component because a module exporting both a
 * component and a hook breaks React Fast Refresh — editing the provider would
 * drop the session on every save during development.
 */
export const CustomerAuthContext = createContext(null)

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth must be used inside CustomerAuthProvider')
  return ctx
}
