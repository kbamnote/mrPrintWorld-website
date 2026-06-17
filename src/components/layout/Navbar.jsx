import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../primitives/Logo'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import { navLinks, company, whatsappLink } from '../../data/company'

export default function Navbar() {
  const { pathname } = useLocation()
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

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `relative text-[0.95rem] font-medium transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-300 ${linkColor} ${
                      isActive ? 'after:scale-x-100' : 'after:scale-x-0'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button
              to="/contact"
              variant={transparent ? 'gold' : 'primary'}
              iconName="arrow-right"
            >
              Request a Quote
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
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-line py-4 font-display text-2xl font-medium ${
                      isActive ? 'text-primary' : 'text-ink'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                iconName="arrow-right"
                className="mt-7"
              >
                Request a Quote
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
