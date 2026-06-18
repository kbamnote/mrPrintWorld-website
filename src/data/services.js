/**
 * Service ecosystem — five capability groups (brief §12, Section 3).
 * Each group powers a homepage module and (later) a dedicated service page.
 * `icon` maps to a key in components/primitives/Icon.jsx.
 */

export const services = [
  {
    id: 'printing',
    slug: 'printing',
    title: 'Printing Solutions',
    icon: 'printing',
    summary:
      'Precision print across every format — from a single premium business card to nationwide transit media, colour-managed and finished in-house.',
    items: [
      'Business Cards',
      'Brochures',
      'Catalogues',
      'Books',
      'Labels',
      'Stationery',
      'ID Cards',
      'Digital Printing',
      'Flex Printing',
      'Vinyl Printing',
      'Canvas Printing',
      'Transit Media',
    ],
  },
  {
    id: 'signage',
    slug: 'signage',
    title: 'Signage',
    icon: 'signage',
    summary:
      'Architectural signage engineered to last — fabricated, wired and installed by our own teams for a flawless, on-brand storefront.',
    items: [
      'Acrylic Signage',
      'Glow Sign Boards',
      'ACP Sign Boards',
      'Dealer Boards',
      'In-Shop Branding',
    ],
  },
  {
    id: 'corporate',
    slug: 'corporate-solutions',
    title: 'Corporate Solutions',
    icon: 'gift',
    summary:
      'Considered corporate gifting and bespoke collateral that carry a brand with the weight it deserves — at any scale of rollout.',
    items: [
      'Corporate Gifting',
      'Custom Mementos',
      'UV Printing',
      'Customized Stationery',
    ],
  },
  {
    id: 'fabrication',
    slug: 'fabrication',
    title: 'Fabrication',
    icon: 'fabrication',
    summary:
      'A full fabrication floor — CNC cutting and metal work that turns design intent into physical, installation-ready brand environments.',
    items: [
      'ACP Cutting',
      'MDF Cutting',
      'PVC Cutting',
      'Wood Cutting',
      'MS Fabrication',
    ],
  },
  {
    id: 'event',
    slug: 'event-branding',
    title: 'Event Branding',
    icon: 'event',
    summary:
      'Large-format event and transit branding produced, transported and installed on deadline — built for visibility and built to travel.',
    items: [
      'Canopies',
      'Gazebos',
      'Vehicle Branding',
      'Exhibition Branding',
      'Arch Gates',
    ],
  },
]

export const servicesIntro = {
  eyebrow: 'What we do',
  title: 'One ecosystem. Every branding surface.',
  body: 'Most brands stitch together a printer, a signage vendor, a fabricator and an event agency. MR Print World Pvt. Ltd. replaces that supply chain with one accountable partner — design, manufacture, finish and install, all under one roof.',
}
