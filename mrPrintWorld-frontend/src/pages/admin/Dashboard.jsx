import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from './adminApi'
import { Spinner, ErrorBanner } from './ui'

const money = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

/**
 * Dashboard — every number is a door. Each card opens the admin page already
 * filtered to exactly what it counts, so "3 waiting for approval" is one
 * click from the three customers. Cards that need attention are highlighted.
 */
export default function Dashboard() {
  const [state, setState] = useState({ loading: true, error: null, data: null })

  useEffect(() => {
    let cancelled = false
    api
      .getDashboard()
      .then((data) => !cancelled && setState({ loading: false, error: null, data }))
      .catch((error) => !cancelled && setState({ loading: false, error, data: null }))
    return () => {
      cancelled = true
    }
  }, [])

  if (state.loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  const d = state.data
  return (
    <div className="space-y-8">
      <ErrorBanner error={state.error} />
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">Click any card to open it. Highlighted cards need attention.</p>
      </div>

      {d && (
        <>
          <Section title="Orders" link={{ to: '/admin/orders', label: 'All orders' }}>
            <Stat label="Orders today" value={d.orders.today} to="/admin/orders" />
            <Stat
              label="Paid, not started"
              hint="Waiting to go into production"
              value={d.orders.awaitingAction}
              to="/admin/orders?status=PAID"
              attention={d.orders.awaitingAction > 0}
            />
            <Stat label="In production" value={d.orders.inProduction} to="/admin/orders?status=IN_PRODUCTION" />
            <Stat
              label="Sales this month"
              hint={`${d.orders.monthCount} paid order${d.orders.monthCount === 1 ? '' : 's'}, before GST`}
              value={money(d.orders.monthSales)}
              to="/admin/orders"
            />
          </Section>

          <Section title="Customers" link={{ to: '/admin/customers', label: 'All customers' }}>
            <Stat label="Customers" value={d.customers.total} to="/admin/customers" />
            <Stat
              label="Waiting for approval"
              hint="Trade and corporate accounts"
              value={d.customers.pendingApproval}
              to="/admin/customers?status=PENDING"
              attention={d.customers.pendingApproval > 0}
            />
            <Stat
              label="Reseller applications"
              value={d.customers.resellerPending}
              to="/admin/customers?status=RESELLER_PENDING"
              attention={d.customers.resellerPending > 0}
            />
            <Stat label="Resellers" value={d.customers.resellers} to="/admin/customers?status=RESELLERS" />
            <Stat label="Organizations" value={d.customers.organizations} to="/admin/organizations" />
          </Section>

          <Section title="Careers" link={{ to: '/admin/careers', label: 'Open Careers' }}>
            <Stat
              label="New applications"
              hint="Not yet reviewed"
              value={d.careers.newApplications}
              to="/admin/careers?status=NEW"
              attention={d.careers.newApplications > 0}
            />
            <Stat label="All applications" value={d.careers.applications} to="/admin/careers" />
            <Stat label="Open jobs" hint="Shown on the website" value={d.careers.openJobs} to="/admin/careers?tab=jobs" />
          </Section>

          <Section title="Catalogue" link={{ to: '/admin/categories', label: 'Categories & products' }}>
            <Stat label="Products" value={d.products.total} to="/admin/products" />
            <Stat label="Live on the website" value={d.products.live} to="/admin/products?isActive=true" />
            <Stat label="Hidden" value={d.products.hidden} to="/admin/products?isActive=false" />
            <Stat
              label="Need a photo"
              value={d.products.needsImage}
              to="/admin/products?needsImage=true"
              attention={d.products.needsImage > 0}
            />
            <Stat
              label="Need pricing"
              hint="Quote-only until priced"
              value={d.products.needsPrice}
              to="/admin/products?needsPrice=true"
              attention={d.products.needsPrice > 0}
            />
            <Stat
              label="Categories"
              hint={`${d.catalogue.topLevel} top level`}
              value={d.catalogue.categories}
              to="/admin/categories"
            />
            <Stat label="Product option fields" value={d.catalogue.fields} to="/admin/options" />
          </Section>
        </>
      )}
    </div>
  )
}

function Section({ title, link, children }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {link && (
          <Link to={link.to} className="text-sm font-medium text-primary hover:underline">
            {link.label} →
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </section>
  )
}

function Stat({ label, value, hint, to, attention = false }) {
  return (
    <Link
      to={to}
      className={`group block rounded-[var(--radius-lg)] border bg-white p-5 transition-shadow hover:shadow-card ${
        attention ? 'border-amber-300 bg-amber-50/40' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-display text-3xl font-bold tabular-nums text-ink">{value}</div>
        <span className="text-ink-soft/60 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          →
        </span>
      </div>
      <div className={`mt-1 text-sm ${attention ? 'font-medium text-amber-800' : 'text-ink-soft'}`}>{label}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-soft">{hint}</div>}
    </Link>
  )
}
