import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../primitives/Logo'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import { navLinks, company, whatsappLink } from '../../data/company'
import { useCustomerAuth } from '../../lib/customerAuthContext'
import { useCart } from '../../lib/cartContext'
import { isApiEnabled } from '../../lib/api'

export default function Navbar() {
  const { pathname } = useLocation()
  const { isSignedIn, tierCode, tierName } = useCustomerAuth()
  const { itemCount } = useCart()
  const [atTop, setAtTop] = useState(true)
  const [open, setOpen] = useState(false)
  const isHome = pathname === '/'
  const transparent = isHome && atTop && !open

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // Escape to close + lock background scroll while the menu is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const linkColor = transparent
    ? 'text-white/85 hover:text-white'
    : 'text-ink-soft hover:text-primary'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          transparent
            ? 'bg-transparent'
            : 'border-b border-line bg-white/90 backdrop-blur-md'
        }`}
      >
        <nav
          className="container-wide flex h-[4.75rem] items-center justify-between"
          aria-label="Primary"
        >
          <Logo light={transparent} />

          <ul className="hidden items-center lg:flex lg:gap-5 xl:gap-8">
            {navLinks.map((l) => (
              <li key={l.to} className="relative group">
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1 text-[0.95rem] font-medium transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-300 ${linkColor} ${
                      isActive ? 'after:scale-x-100' : 'after:scale-x-0'
                    }`
                  }
                >
                  {l.label}
                  {l.isDropdown && <Icon name="chevron-down" size={14} className="transition-transform duration-200 group-hover:rotate-180" />}
                </NavLink>

                {l.isDropdown && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 w-96">
                    <div className="rounded-2xl border border-line bg-white p-4 shadow-xl text-left">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase text-primary">
                          IT &amp; Digital Solutions
                        </span>
                        <span className="text-[0.75rem] font-semibold text-ink-soft">Tapify</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-ink">
                        Tapify — Smart NFC &amp; Digital Platform
                      </h4>
                      <p className="mt-1 text-xs text-ink-soft leading-relaxed">
                        NFC Cards, Standees &amp; Keychains, AI Google Review Cards, E-Commerce, Meta Ads, GMB &amp; Social Posting.
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-1.5 text-[0.725rem] font-medium text-ink bg-surface/70 p-2.5 rounded-xl border border-line">
                        <span className="flex items-center gap-1.5"><Icon name="credit-card" size={13} className="text-primary" /> NFC Cards</span>
                        <span className="flex items-center gap-1.5"><Icon name="layout" size={13} className="text-primary" /> NFC Standees</span>
                        <span className="flex items-center gap-1.5"><Icon name="key" size={13} className="text-primary" /> NFC Keychains</span>
                        <span className="flex items-center gap-1.5"><Icon name="star" size={13} className="text-primary" /> AI Review Cards</span>
                        <span className="flex items-center gap-1.5"><Icon name="globe" size={13} className="text-primary" /> Web &amp; E-Commerce</span>
                        <span className="flex items-center gap-1.5"><Icon name="target" size={13} className="text-primary" /> Meta Ads &amp; GMB</span>
                      </div>

                      <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-line">
                        <a
                          href="https://tapify.co.in"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                        >
                          <span>Visit tapify.co.in</span>
                          <Icon name="external-link" size={14} />
                        </a>
                        <Link
                          to="/it-solutions"
                          className="text-center text-xs font-semibold text-ink-soft hover:text-primary py-1"
                        >
                          Explore All IT Solutions &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            {isApiEnabled && itemCount > 0 && (
              <Link
                to="/cart"
                className={`relative text-sm font-medium transition-colors ${
                  transparent ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-primary'
                }`}
              >
                Cart
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                  {itemCount}
                </span>
              </Link>
            )}
            {isApiEnabled && (
              isSignedIn ? (
                <Link
                  to="/account"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    transparent ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-primary'
                  }`}
                >
                  Account
                  {/* Only shown for approved trade/corporate — a visible
                      reminder that the prices on screen are their rates. */}
                  {tierCode !== 'B2C' && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary">
                      {tierName}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    transparent ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-primary'
                  }`}
                >
                  Sign in
                </Link>
              )
            )}
            <Button
              to="/contact"
              variant={transparent ? 'gold' : 'primary'}
              iconName="arrow-right"
            >
              Contact Us
            </Button>
          </div>

          <button
            type="button"
            className={`-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden ${
              transparent ? 'text-white' : 'text-ink'
            }`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={26} />
          </button>
        </nav>
      </header>

      {/* Rendered OUTSIDE the header: a backdrop-filter ancestor would otherwise
          become the containing block and collapse this fixed overlay. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[4.75rem] z-40 overflow-y-auto bg-white lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="container-page flex flex-col py-6">
              {navLinks.map((l) => (
                <div key={l.to} className="border-b border-line py-3">
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block font-display text-2xl font-medium ${
                        isActive ? 'text-primary' : 'text-ink'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                  {l.isDropdown && (
                    <div className="mt-2 rounded-xl border border-line bg-surface/70 p-3.5 space-y-2">
                      <p className="text-xs font-bold text-primary">Tapify — Smart NFC &amp; Digital Growth</p>
                      <p className="text-xs text-ink-soft leading-relaxed">
                        NFC Cards, Standees, Keychains, AI Google Review Cards, E-Commerce &amp; Meta Ads Management.
                      </p>
                      <a
                        href="https://tapify.co.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary underline pt-1"
                      >
                        Visit tapify.co.in <Icon name="external-link" size={12} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                iconName="arrow-right"
                className="mt-7"
              >
                Contact Us
              </Button>
              <div className="mt-4 flex gap-3">
                <Button
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  WhatsApp
                </Button>
                <Button
                  href={company.phoneHref}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Call
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
