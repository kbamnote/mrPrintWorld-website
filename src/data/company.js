import directorOne from '../assets/directorOne.jpg'
import directorTwo from '../assets/directorTwo.jpg'

/**
 * Single source of truth for company identity, contact channels and navigation.
 *
 * ⚠️  CONTACT DETAILS BELOW ARE PLACEHOLDERS (see `pending`). Do NOT ship the
 * zeroed phone / sample email to production — replace them with the real,
 * client-supplied values and flip the matching `pending.*` flags to false.
 * The UI surfaces a small "to be confirmed" marker wherever a value is pending.
 */

export const company = {
  name: 'MR Print World',
  legalName: 'MR Print World',
  tagline: 'One Stop Solution For All Your Printing & Branding Needs',
  positioning: 'A Complete Brand Execution Partner',
  founder: 'Mr. Abid M. Khan',
  experienceYears: 12,
  teamSize: 50,
  city: 'Nagpur',
  region: 'Maharashtra',
  country: 'India',
  url: 'https://www.mrprintworld.com',

  // --- Contact channels (placeholders until client confirms) --------------
  phoneDisplay: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  whatsapp: '910000000000', // intl digits only, used for wa.me links
  email: 'enquiry@mrprintworld.com',
  addressLines: ['Address line to be confirmed', 'Nagpur, Maharashtra, India'],
  gst: 'GSTIN to be confirmed',
  mapEmbedUrl: '', // Google Maps "embed" iframe src — supplied before launch
  hours: 'Mon – Sat · 10:00 – 19:00',

  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },
}

/**
 * Which contact fields are still placeholders. Flip to false as real data
 * arrives so the "to be confirmed" markers disappear.
 */
/** Leadership — director photos imported from src/assets. */
export const leadership = {
  name: 'Mr. Abid M. Khan',
  role: 'Founder & Director',
  portrait: directorOne, // formal desk portrait (4:5)
  portraitWide: directorTwo, // editorial full-length (3:4)
}

export const pending = {
  phone: true,
  whatsapp: true,
  email: true,
  address: true,
  gst: true,
  map: true,
}

export const headlineStats = [
  { value: 12, suffix: '+', label: 'Years of execution' },
  { value: 50, suffix: '+', label: 'Professionals on team' },
  { value: 5000, suffix: '+', label: 'Projects delivered', approx: true },
  { value: 1, suffix: '', label: 'Roof — end to end', isText: true, text: 'One' },
]

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Contact', to: '/contact' },
]

/** wa.me deep link with a prefilled enquiry message. */
export function whatsappLink(message = "Hello MR Print World, I'd like a quote.") {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`
}
