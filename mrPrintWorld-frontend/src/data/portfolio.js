import vehicleBrandingOne from '../assets/VehicleBrandingNecoBlasters.jpeg'
import vehicleBrandingTwo from '../assets/VehicleBrandingNecoBlastersTwo.jpeg'
import corporateEventImg from '../assets/corporateEvent.jpeg'

/**
 * Portfolio / Work — brief §12, Section 5 (the most important section).
 *
 * ⚠️  IMAGES PENDING. `image: null` renders a labelled placeholder block of the
 * correct aspect ratio (never a fake stock photo). Drop a real file in
 * /public/portfolio/ and set `image: '/portfolio/<file>.webp'` to swap it in.
 * `featured: true` items are eligible for a dedicated case-study page.
 */

export const portfolioCategories = [
  'All',
  'Signage',
  'Branding',
  'Corporate Printing',
  'Vehicle Graphics',
  'Fabrication',
  'Event Installations',
]

export const projects = [
  {
    id: 'acrylic-retail-flagship',
    title: 'Acrylic Storefront — Retail Flagship',
    category: 'Signage',
    client: 'Retail brand, Nagpur',
    summary: 'Backlit acrylic facade with fabricated 3D lettering and night-grade illumination.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQew4nfzitf1lY2o4gmftPdIRz9wVk1f8QvZ7uXhnbxiOKiqUgpBB40fwU&s=10',
    aspect: '4/5',
    featured: true,
  },
  {
    id: 'multi-store-rollout',
    title: 'Multi-Store Brand Rollout',
    category: 'Branding',
    client: 'Regional chain',
    summary: 'Consistent in-shop branding deployed across multiple locations on a single timeline.',
    image: 'https://buildory.in/images/offset-digital-printing.webp',
    aspect: '4/3',
    featured: true,
  },
  {
    id: 'annual-report-suite',
    title: 'Corporate Print Suite',
    category: 'Corporate Printing',
    client: 'Enterprise client',
    summary: 'Catalogues, annual report and stationery — colour-managed for a unified house style.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/7/325809157/QX/ZX/XU/2172028/office-stationery-printing-service.jpg',
    aspect: '1/1',
    featured: false,
  },
  {
    id: 'fleet-wrap',
    title: 'Commercial Fleet Wrap',
    category: 'Vehicle Graphics',
    client: 'Logistics operator',
    summary: 'Full vehicle wraps engineered for legibility at speed and durability on the road.',
    image: vehicleBrandingOne,
    aspect: '16/10',
    featured: true,
  },
  {
    id: 'neco-blasters-wrap',
    title: 'Neco Blasters Vehicle Branding',
    category: 'Vehicle Graphics',
    client: 'Neco Blasters',
    summary: 'High-impact full-body vehicle branding with bold graphics for maximum road presence.',
    image: vehicleBrandingTwo,
    aspect: '16/10',
    featured: true,
  },
  {
    id: 'acp-facade',
    title: 'ACP Facade Fabrication',
    category: 'Fabrication',
    client: 'Commercial complex',
    summary: 'CNC-cut ACP cladding and structural fabrication, measured and installed on site.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2026/2/581381316/VF/RH/UN/255569530/acp-fabrication-service-500x500.jpg',
    aspect: '4/3',
    featured: false,
  },
  {
    id: 'exhibition-stand',
    title: 'Exhibition Stand Build',
    category: 'Event Installations',
    client: 'Trade expo',
    summary: 'Modular exhibition branding produced, transported and assembled to deadline.',
    image: corporateEventImg,
    aspect: '4/5',
    featured: true,
  },
  {
    id: 'glow-sign-network',
    title: 'Dealer Glow-Sign Network',
    category: 'Signage',
    client: 'Distribution network',
    summary: 'Standardised glow sign boards manufactured for a network of dealer outlets.',
    image: 'https://content.jdmagicbox.com/v2/comp/delhi/b1/011pxx11.xx11.180529013142.x5b1/catalogue/s-s-graphics-ina-market-delhi-acrylic-letter-manufacturers-fiscxhph33.jpg',
    aspect: '4/3',
    featured: false,
  },
  {
    id: 'corporate-gifting',
    title: 'Corporate Gifting Programme',
    category: 'Branding',
    client: 'Corporate client',
    summary: 'Bespoke mementos and gift sets with UV-printed detailing and custom packaging.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIyd0G8wFmkE5Y6MNgE75eGMtzCQRFH0Jom0hk101qrEiUCNz05T1PxCY&s=10',
    aspect: '1/1',
    featured: false,
  },
  {
    id: 'arch-gate-event',
    title: 'Event Arch Gate & Canopies',
    category: 'Event Installations',
    client: 'Public event',
    summary: 'Large-format arch gates and canopy branding for a high-footfall outdoor event.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2026/1/574915920/JA/PO/FY/101500808/promotional-arch-gate-500x500.jpg',
    aspect: '16/10',
    featured: false,
  },
]
