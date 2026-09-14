import { createContext, useContext } from 'react'

/**
 * Admin auth context.
 *
 * Kept in its own module because a file that exports both a component and a
 * hook breaks React Fast Refresh — editing the component would drop the
 * provider's state on every save.
 */
export const AuthContext = createContext(null)

export function useAdminAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminApp')
  return ctx
}

/**
 * Whether the signed-in account may delete. Staff can create and edit
 * everything but not delete, so their Delete/Remove buttons are hidden.
 * The server refuses a staff delete regardless — this only tidies the screen.
 */
export function useCanDelete() {
  return useAdminAuth().user?.role !== 'STAFF'
}
