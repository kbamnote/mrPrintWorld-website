import { Link } from 'react-router-dom'
import Logo from '../primitives/Logo'
import Button from '../primitives/Button'
import Icon from '../primitives/Icon'
import {
  company,
  navLinks,
  whatsappLink,
  pending,
} from '../../data/company'
import { services } from '../../data/services'

const year = 2026 // build-stamped; refresh on rebuild

function Pending() {
  return (
    <span className="ml-1 align-middle text-[0.68rem] italic text-white/35">
      (to be confirmed)
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70">
      {/* CTA band */}
      <div className="border-b border-dark-line">
        <div className="container-page flex flex-col gap-7 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-title text-white">
              Let’s give your brand the execution it deserves.
            </h2>
            <p className="mt-3 text-white/55">
              From a single card to a nationwide rollout — one partner, one standard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/contact" variant="gold" size="lg" iconName="arrow-right">
              Contact Us
            </Button>
            <Button
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-light"
              size="lg"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="container-page grid grid-cols-2 gap-y-10 gap-x-6 py-16 md:grid-cols-12">
        <div className="col-span-2 md:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            {company.positioning} — printing, signage, fabrication, corporate
            gifting and large-scale branding, end-to-end under one roof in{' '}
            {company.city}.
          </p>
          <div className="mt-5 flex gap-4">
            <a href={company.social?.instagram || 'https://instagram.com/mrprintworld'} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center -m-1 text-white/40 transition-colors hover:text-accent" aria-label="Instagram">
              <Icon name="instagram" size={18} />
            </a>
            <a href={company.social?.facebook || 'https://facebook.com/mrprintworld'} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center -m-1 text-white/40 transition-colors hover:text-accent" aria-label="Facebook">
              <Icon name="facebook" size={18} />
            </a>
            <a href={company.social?.linkedin || 'https://linkedin.com/company/mrprintworld'} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center -m-1 text-white/40 transition-colors hover:text-accent" aria-label="LinkedIn">
              <Icon name="linkedin" size={18} />
            </a>
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Services">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Services
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/services/${s.slug}`}
                  className="inline-block py-1 text-white/55 transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label="Company">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Company
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-block py-1 text-white/55 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-white/55">
            {company.addresses.map((addr) => (
              <li key={addr.label} className="flex gap-3">
                <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  <span className="block font-medium text-white/75">{addr.label}</span>
                  {addr.lines.join(' ')}
                </span>
              </li>
            ))}
            <li className="flex gap-3">
              <Icon name="phone" size={18} className="mt-0.5 shrink-0 text-accent" />
              <a href={company.phoneHref} className="inline-block py-1 hover:text-white">
                {company.phoneDisplay}
                {pending.phone && <Pending />}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-accent" />
              <a href={`mailto:${company.email}`} className="inline-block py-1 hover:text-white">
                {company.email}
                {pending.email && <Pending />}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-dark-line">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="inline-block py-1 transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="inline-block py-1 transition-colors hover:text-white">Terms & Conditions</Link>
            <Link to="/refund-policy" className="inline-block py-1 transition-colors hover:text-white">Refund Policy</Link>
            <Link to="/shipping-policy" className="inline-block py-1 transition-colors hover:text-white">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
