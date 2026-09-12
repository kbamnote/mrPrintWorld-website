/**
 * Demo design templates.
 *
 * Every template is drawn at REAL PRINT SIZE in millimetres, including 3mm
 * bleed on each edge, so what the customer edits is already the shape of the
 * printed piece rather than a screen mock-up. `safe` is the margin from the
 * artboard edge that nothing important may cross — bleed plus the trimming
 * tolerance our press works to.
 *
 * These five are originals, drawn from type and shapes with Google Fonts, so
 * there is no licence attached to any of them. A designer can add more by
 * copying one of the components in components/design/.
 */

/** Colour themes. One click recolours a whole design. */
export const THEMES = [
  { id: 'forest', name: 'Forest', color: '#0B6B43' },
  { id: 'ink', name: 'Ink', color: '#141A21' },
  { id: 'saffron', name: 'Saffron', color: '#C2410C' },
  { id: 'royal', name: 'Royal', color: '#1D4ED8' },
  { id: 'plum', name: 'Plum', color: '#7B2D57' },
  { id: 'brass', name: 'Brass', color: '#8A6A12' },
]

/** Type pairings — a display face for names and headlines, a plain one for details. */
export const FONT_PAIRS = [
  { id: 'classic', name: 'Classic', display: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
  { id: 'modern', name: 'Modern', display: "'Bebas Neue', Impact, sans-serif", body: "'Inter', system-ui, sans-serif" },
  { id: 'warm', name: 'Warm', display: "'Lora', Georgia, serif", body: "'Karla', system-ui, sans-serif" },
]

/** One stylesheet for every face used above. Loaded only on the design pages. */
export const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&family=Bebas+Neue&family=Lora:wght@600;700&family=Karla:wght@400;600&display=swap'

const CARD = { w: 95, h: 57, trimW: 89, trimH: 51, safe: 6 }
const A5 = { w: 154, h: 216, trimW: 148, trimH: 210, safe: 8 }
const DL = { w: 105, h: 216, trimW: 99, trimH: 210, safe: 8 }

/** Field groups reused across the card templates. */
const CARD_FIELDS = [
  { key: 'name', label: 'Full name', default: 'Akshay Sharma', max: 28 },
  { key: 'role', label: 'Designation', default: 'Managing Director', max: 34 },
  { key: 'company', label: 'Company', default: 'Sharma Prints', max: 30 },
  { key: 'tagline', label: 'Tagline', default: 'Printing & Branding, Nagpur', max: 40 },
  { key: 'phone', label: 'Phone', default: '+91 98765 43210', max: 24 },
  { key: 'email', label: 'Email', default: 'akshay@sharmaprints.in', max: 40 },
  { key: 'website', label: 'Website', default: 'www.sharmaprints.in', max: 36 },
  { key: 'address', label: 'Address', default: 'Dharampeth, Nagpur 440010', max: 46 },
]

export const TEMPLATES = [
  {
    id: 'meridian',
    name: 'Meridian',
    kind: 'Visiting card',
    blurb: 'A quiet serif name with a full-height colour edge. Reads as established.',
    size: CARD,
    sides: ['front', 'back'],
    fields: CARD_FIELDS,
    accepts: { logo: true },
  },
  {
    id: 'studio',
    name: 'Studio',
    kind: 'Visiting card',
    blurb: 'Colour band across the top for the logo, details in two clean columns.',
    size: CARD,
    sides: ['front', 'back'],
    fields: CARD_FIELDS,
    accepts: { logo: true },
  },
  {
    id: 'monogram',
    name: 'Monogram',
    kind: 'Visiting card',
    blurb: 'An initial in a ring. Works best for a personal name.',
    size: CARD,
    sides: ['front', 'back'],
    fields: CARD_FIELDS,
    accepts: { logo: true },
  },
  {
    id: 'offer-a5',
    name: 'Offer A5',
    kind: 'Leaflet A5',
    blurb: 'Photo on top, offer badge, three selling points, contact bar at the foot.',
    size: A5,
    sides: ['front'],
    accepts: { logo: true, photo: true },
    fields: [
      { key: 'headline', label: 'Headline', default: 'Festive Season Sale', max: 26 },
      { key: 'subhead', label: 'Sub-heading', default: 'Everything you need to launch your brand', max: 52 },
      { key: 'offer', label: 'Offer badge', default: '30% OFF', max: 10 },
      { key: 'point1', label: 'Point 1', default: 'Visiting cards from ₹499 for 500', max: 44 },
      { key: 'point2', label: 'Point 2', default: 'Same-day flex and vinyl printing', max: 44 },
      { key: 'point3', label: 'Point 3', default: 'Free delivery across Nagpur', max: 44 },
      { key: 'company', label: 'Company', default: 'Sharma Prints', max: 26 },
      { key: 'phone', label: 'Phone', default: '+91 98765 43210', max: 24 },
      { key: 'website', label: 'Website', default: 'www.sharmaprints.in', max: 36 },
    ],
  },
  {
    id: 'services-dl',
    name: 'Services DL',
    kind: 'Leaflet DL',
    blurb: 'Rate-card leaflet: your services and prices, one per line.',
    size: DL,
    sides: ['front'],
    accepts: { logo: true },
    fields: [
      { key: 'company', label: 'Company', default: 'Sharma Prints', max: 24 },
      { key: 'tagline', label: 'Tagline', default: 'Printing, signage & branding', max: 36 },
      { key: 'headline', label: 'Headline', default: 'Our rates', max: 20 },
      { key: 'subhead', label: 'Sub-heading', default: 'Straight prices, no surprises.', max: 44 },
      { key: 'item1', label: 'Service 1', default: 'Visiting cards, 500 pcs', max: 30 },
      { key: 'price1', label: 'Price 1', default: '₹499', max: 12 },
      { key: 'item2', label: 'Service 2', default: 'Flex banner, per sq.ft', max: 30 },
      { key: 'price2', label: 'Price 2', default: '₹25', max: 12 },
      { key: 'item3', label: 'Service 3', default: 'ACP sign board, per sq.ft', max: 30 },
      { key: 'price3', label: 'Price 3', default: '₹220', max: 12 },
      { key: 'phone', label: 'Phone', default: '+91 98765 43210', max: 24 },
      { key: 'website', label: 'Website', default: 'www.sharmaprints.in', max: 36 },
      { key: 'address', label: 'Address', default: 'Dharampeth, Nagpur 440010', max: 44 },
    ],
  },
]

export const templateById = (id) => TEMPLATES.find((t) => t.id === id) ?? null

/** Starting values for a template's form. */
export function defaultValues(template) {
  return Object.fromEntries((template?.fields ?? []).map((f) => [f.key, f.default]))
}
