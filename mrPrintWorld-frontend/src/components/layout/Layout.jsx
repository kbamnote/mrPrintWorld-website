import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import ScrollToTop from './ScrollToTop'
import { captureReferral } from '../../lib/referral'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  // A reseller's share link can land on any page.
  useEffect(() => {
    captureReferral(location.search)
  }, [location.search])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      {/* Home hero sits under the transparent navbar; other pages clear it. */}
      <main id="main" className={isHome ? '' : 'pt-[4.75rem]'}>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
