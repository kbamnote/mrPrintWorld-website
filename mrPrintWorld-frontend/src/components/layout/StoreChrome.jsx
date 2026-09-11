import { Link, NavLink } from 'react-router-dom'
import { useCustomerAuth } from '../../lib/customerAuthContext'
import { useCart } from '../../lib/cartContext'

/**
 * Header and footer for a reseller's store.
 *
 * A store is products only: no services, portfolio or company pages, no
 * MRPrint World contact buttons. The customer sees the reseller's name, the
 * catalogue, their cart and their account — nothing that leads them away.
 */

const link = 'text-sm font-medium text-ink-soft transition-colors hover:text-primary'

export function StoreHeader({ store }) {
  const { isSignedIn } = useCustomerAuth()
  const { itemCount } = useCart()
  const home = `/store/${store.code}`

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <nav className="container-wide flex h-16 items-center justify-between gap-4" aria-label="Store">
        <Link to={home} className="min-w-0">
          <span className="block truncate font-display text-lg font-bold leading-tight text-ink">
            {store.storeName ?? 'Online store'}
          </span>
          <span className="block text-[0.7rem] leading-tight text-ink-soft">Printed by MRPrint World</span>
        </Link>

        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <NavLink to={home} end className={({ isActive }) => `${link} ${isActive ? 'text-primary' : ''}`}>
            Products
          </NavLink>
          <Link to="/cart" className={link}>
            Cart
            {itemCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to={isSignedIn ? '/account' : '/login'} className={link}>
            {isSignedIn ? 'Account' : 'Sign in'}
          </Link>
        </div>
      </nav>
    </header>
  )
}

export function StoreFooter({ store }) {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-wide flex flex-col gap-4 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl">
          {store.storeName ?? 'This store'} sells through MRPrint World Pvt. Ltd., which prints, invoices and
          delivers every order.
        </p>
        <nav className="flex flex-wrap gap-4 text-xs" aria-label="Policies">
          <Link to="/terms" className="hover:text-primary">Terms</Link>
          <Link to="/privacy-policy" className="hover:text-primary">Privacy</Link>
          <Link to="/refund-policy" className="hover:text-primary">Refunds</Link>
          <Link to="/shipping-policy" className="hover:text-primary">Shipping</Link>
        </nav>
      </div>
    </footer>
  )
}
