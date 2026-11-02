import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { seoLandingPages } = await import('../src/data/seoLandingPages.js')

const newPage = {
  id: 'seo-page-101',
  slug: 'product-packaging-printing-in-nagpur',
  url: '/product-packaging-printing-in-nagpur',
  serviceName: 'Product Packaging Printing',
  category: 'Specialized Printing',
  targetLocation: 'Nagpur',
  locationType: 'City-wide Headquarters & Delivery',
  isLocalityPage: false,
  seoTitle: 'Product Packaging Printing in Nagpur | Custom Boxes - MRPRINT',
  metaDescription: 'Custom product packaging printing in Nagpur by MRPRINT WORLD. Premium monocartons, rigid boxes, corrugated packaging & custom finishes. Get factory quote!',
  h1: 'Product Packaging Printing in Nagpur',
  tagline: 'Premium custom product packaging and boxes engineered in-house at our Nagpur production facility.',
  introduction: 'MRPRINT WORLD provides professional, factory-direct product packaging printing in Nagpur. Backed by 12+ years of brand execution expertise and advanced production machinery, we deliver unmatched color precision, durable substrates, and rapid local turnaround.',
  overview: "Whether you require short-run bespoke production or heavy high-volume manufacturing, our in-house facility guarantees strict quality tolerances. All production is executed directly at MRPRINT WORLD's company-owned manufacturing plant in Wathoda, Nagpur, serving corporate clients, retail brands, and institutions across the entire Vidarbha region.",
  specs: {
    materials: [
      'Virgin Kraft & Duplex Monocarton (250-450 GSM)',
      'Rigid Grey Board (1.5mm - 3mm) for Luxury Packaging',
      'Corrugated 3-Ply & 5-Ply E/F Flute Shipping Boxes',
      'Food-Grade Certified Barrier Boards',
      'Textured Specialty Kraft & Fancy Paper Wraps'
    ],
    finishes: [
      'Drip-Off Matt & Gloss UV Effects',
      'Gold / Silver Metallic Thermal Foil Stamping',
      'Precision Die-Cut Window Patching with Clear PVC',
      'Embossing & 3D Debossing for Brand Accents',
      'Soft-Touch Velvet & Anti-Scratch Lamination'
    ],
    machines: [
      'Heidelberg Speedmaster CD 102 (4-Color Offset Press)',
      'Automatic Heavy-Duty Platen Die-Cutting & Creasing Machine',
      'High-Speed Folder Gluer Line with Auto Quality Check'
    ],
    turnaround: '3 to 5 business days with structural mockup and 3D prototype approval prior to mass run.',
    minOrder: 'From 250 units for bespoke runs; scalable to 50,000+ units for retail lines.'
  },
  useCases: [
    {
      title: 'FMCG, Food & Bakery Packaging',
      desc: 'Custom sweet boxes, bakery packaging, spices, teas, and confectionery boxes with food-safe barrier coatings.'
    },
    {
      title: 'Pharmaceutical & Healthcare',
      desc: 'Medicine monocartons, tamper-evident blister packaging, and diagnostic kit boxes adhering to batch printing norms.'
    },
    {
      title: 'Cosmetics & Personal Care',
      desc: 'High-end luxury cosmetic boxes, perfume outer packaging with foil embossing, and retail display cartons.'
    },
    {
      title: 'Electronics, Hardware & Industrial',
      desc: 'Durable corrugated inner cartons, rigid luxury gift packaging, and protective custom-fit inserts.'
    }
  ],
  whyChoose: [
    {
      title: '100% In-House Production',
      desc: 'No outsourcing. Full end-to-end execution at our Wathoda manufacturing plant in Nagpur.'
    },
    {
      title: 'Advanced Press & Cutting Fleet',
      desc: 'Equipped with Heidelberg 4-color offset, Konica Minolta digital, HP Latex, and industrial 3-axis CNC/Laser cutters.'
    },
    {
      title: '12+ Years Industry Leadership',
      desc: 'Over 5,000 completed branding and print projects for leading corporates, retail chains, and SMEs.'
    },
    {
      title: 'Transparent Factory Pricing',
      desc: 'Direct manufacturer pricing with zero middleman commissions or broker markups.'
    }
  ],
  locationDelivery: {
    locationName: 'Nagpur',
    coverage: 'Nagpur & Surrounding Nagpur Zones',
    dispatchCenter: 'MRPRINT WORLD Factory, Shailesh Nagar, Behind Kohinoor Lawn, Wathoda, Nagpur',
    regOffice: 'Bungalow No. 22B, Kalawati Kunj, Kalawati Nagar, Pipla, Nagpur',
    contactPhone: '+91 78418 40840',
    whatsapp: '917841840840',
    email: 'info@mrprintworld.com'
  },
  faqs: [
    {
      question: 'What is the minimum order quantity (MOQ) for custom product packaging in Nagpur?',
      answer: 'Our standard MOQ starts from 250 units for custom printed monocartons and 100 units for luxury rigid boxes. For large FMCG and pharmaceutical production, we handle runs upwards of 50,000 units with volume discounts.'
    },
    {
      question: 'Do you help with structural design and die-line preparation?',
      answer: 'Yes! Our in-house packaging prepress team assists with CAD die-line design, 3D digital renderings, and physical white dummy prototypes to verify product fit before manufacturing starts.'
    },
    {
      question: 'Are your packaging materials and inks certified safe for food contact?',
      answer: 'Yes, we supply food-grade certified virgin kraft, SBS boards, and food-compliant barrier varnishes suitable for direct food and confectionery contact.'
    },
    {
      question: 'Can you deliver packaging orders to MIDC Hingna and Butibori industrial areas?',
      answer: 'Yes, MRPRINT WORLD provides daily commercial dispatches to factories and warehouses across MIDC Hingna, Butibori, Kalmeshwar, and throughout Nagpur.'
    },
    {
      question: 'What premium finishing options are available for luxury gift packaging?',
      answer: 'We offer hot foil stamping in gold, silver, and copper, drip-off textured UV, soft-touch velvet lamination, blind embossing, magnetic snap closures, and customized EVA foam inserts.'
    }
  ],
  relatedServices: [
    { name: 'Label Printing', slug: 'label-printing-in-nagpur', url: '/label-printing-in-nagpur' },
    { name: 'Sticker Printing', slug: 'sticker-printing-in-nagpur', url: '/sticker-printing-in-nagpur' },
    { name: 'Offset Printing', slug: 'offset-printing-in-nagpur', url: '/offset-printing-in-nagpur' },
    { name: 'Commercial Printing', slug: 'commercial-printing-in-nagpur', url: '/commercial-printing-in-nagpur' }
  ],
  relatedLocations: [
    { name: 'MIDC Hingna', slug: 'locations/product-packaging-printing-in-midc-hingna', url: '/locations/product-packaging-printing-in-midc-hingna' },
    { name: 'Butibori', slug: 'locations/catalogue-printing-in-butibori', url: '/locations/catalogue-printing-in-butibori' },
    { name: 'Wathoda', slug: 'locations/vehicle-branding-in-wathoda', url: '/locations/vehicle-branding-in-wathoda' },
    { name: 'Sitabuldi', slug: 'locations/led-sign-board-in-sitabuldi', url: '/locations/led-sign-board-in-sitabuldi' }
  ],
  status: 'published',
  indexingStatus: 'index, follow',
  priority: '0.9',
  changefreq: 'weekly'
}

// Check if page already exists
const existingIndex = seoLandingPages.findIndex((p) => p.slug === newPage.slug)
let updatedList = []
if (existingIndex >= 0) {
  updatedList = [...seoLandingPages]
  updatedList[existingIndex] = newPage
} else {
  updatedList = [...seoLandingPages, newPage]
}

const fileContent = `/**
 * MRPRINT WORLD - Local SEO Landing Pages Database
 * Generated with verified local business data and technical specifications.
 * All rights reserved: MRPRINT WORLD PVT LTD, Nagpur, Maharashtra.
 */

export const seoLandingPages = ${JSON.stringify(updatedList, null, 2)}

export function getSeoPageBySlug(slug) {
  if (!slug) return null
  const clean = slug.replace(/^\\/+/, '').replace(/\\/+$/, '')
  return seoLandingPages.find((p) => p.slug === clean || p.slug === \`locations/\${clean}\`) || null
}

export function getAllSeoSlugs() {
  return seoLandingPages.map((p) => p.slug)
}
`

writeFileSync(join(root, 'src/data/seoLandingPages.js'), fileContent, 'utf8')
console.log(`Successfully updated database. Total pages: ${updatedList.length}`)
