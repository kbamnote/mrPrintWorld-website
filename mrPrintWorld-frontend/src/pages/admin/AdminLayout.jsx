import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAdminAuth } from './authContext'
import { Btn } from './ui'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/options', label: 'Product Options' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/organizations', label: 'Organizations' },
]

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth()
  const [navOpen, setNavOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `block rounded-[var(--radius-card)] px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-ink-soft hover:bg-gray-100 hover:text-ink'
    }`

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className="rounded p-2 text-ink-soft hover:bg-gray-100 md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
            </button>
            <Link to="/admin" className="font-display text-base font-bold text-ink">
              MRPrint World <span className="font-normal text-ink-soft">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden text-sm text-ink-soft transition-colors hover:text-primary sm:inline"
            >
              View site
            </Link>
            <span className="hidden text-sm text-ink-soft md:inline">{user?.email}</span>
            <Btn variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Btn>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside
          className={`${navOpen ? 'block' : 'hidden'} w-full shrink-0 md:block md:w-52`}
          aria-label="Admin sections"
        >
          <nav className="space-y-1" onClick={() => setNavOpen(false)}>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <p className="mt-6 rounded-[var(--radius-card)] border border-line bg-white p-3 text-xs leading-relaxed text-ink-soft">
            Quotes, artwork and orders arrive in later phases.
          </p>
        </aside>

        <main className={`${navOpen ? 'hidden' : 'block'} min-w-0 flex-1 md:block`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
