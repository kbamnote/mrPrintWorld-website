import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  const isHome = useLocation().pathname === '/'
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
