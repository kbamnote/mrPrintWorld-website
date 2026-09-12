import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import ScrollToTop from './ScrollToTop'
import { StoreHeader, StoreFooter } from './StoreChrome'
import { useActiveStore } from '../../lib/useActiveStore'
import { normaliseCode } from '../../lib/referral'

/**
 * Pages a store customer may visit. Everything else (home, services, about,
 * portfolio, contact…) sends them back to their store, so a reseller's
 * customer only ever sees products and the steps to buy them.
 */
const STORE_PAGE_PREFIXES = ['/store/', '/account', '/templates']
const STORE_PAGES_EXACT = new Set([
  '/login',
  '/register',
  '/cart',
  '/checkout',
  '/terms',
  '/privacy-policy',
  '/refund-policy',
  '/shipping-policy',
])

function isStorePage(pathname) {
  if (STORE_PAGES_EXACT.has(pathname)) return true
  return STORE_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))
}

/** The store address for a main-site address: a product keeps its product. */
function storePathFor(pathname, code) {
  const product = pathname.match(/^\/products\/([^/]+)$/)
  return product && product[1] !== 'c' ? `/store/${code}/products/${product[1]}` : `/store/${code}`
}

export default function Layout() {
  const location = useLocation()
  const { store, routeCode, invalidRoute, booting } = useActiveStore()
  const isHome = location.pathname === '/'

  // Share links from before stores existed: /?ref=CODE, /products/slug?ref=CODE.
  const refCode = normaliseCode(new URLSearchParams(location.search).get('ref'))
  if (refCode) return <Navigate to={storePathFor(location.pathname, refCode)} replace />

  // A store that does not exist or is paused: the normal catalogue instead.
  if (invalidRoute) return <Navigate to="/products" replace />

  if (store) {
    const path = location.pathname
    if (booting) {
      // Still finding out who this is. Show nothing rather than either the
      // main site (which would flash for a store customer) or a redirect
      // based on a guess (which could strand someone who is not one).
      if (!isStorePage(path)) return null
    } else {
      // A customer belongs to one reseller — another store's link opens theirs.
      if (routeCode && routeCode !== store.code) {
        return <Navigate to={path.replace(/^\/store\/[^/]+/, `/store/${store.code}`)} replace />
      }
      if (!isStorePage(path)) return <Navigate to={storePathFor(path, store.code)} replace />
    }
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      {store ? <StoreHeader store={store} /> : <Navbar />}
      {/* The main navbar is fixed and needs clearing; the store header is sticky. */}
      <main id="main" className={store || isHome ? '' : 'pt-[4.75rem]'}>
        <Outlet />
      </main>
      {store ? (
        <StoreFooter store={store} />
      ) : (
        <>
          <Footer />
          <FloatingActions />
        </>
      )}
    </>
  )
}
