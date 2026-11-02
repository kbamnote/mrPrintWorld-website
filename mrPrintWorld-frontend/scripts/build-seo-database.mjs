import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

// 75 Target Services across 5 Categories
const categories = {
  printing: {
    name: 'Printing Services',
    services: [
      { name: 'Printing Services', slug: 'printing-services', desc: 'Complete commercial, digital and offset printing solutions for businesses across Nagpur.' },
      { name: 'Digital Printing', slug: 'digital-printing', desc: 'Fast turnaround short-run digital color printing on Konica Minolta AccurioPress.' },
      { name: 'Offset Printing', slug: 'offset-printing', desc: 'High-volume commercial bulk printing with precise Heidelberg Speedmaster 4-color press.' },
      { name: 'Commercial Printing', slug: 'commercial-printing', desc: 'End-to-end commercial print collateral production for corporate, retail and industrial enterprises.' },
      { name: 'Large Format Printing', slug: 'large-format-printing', desc: 'Ultra-wide photographic quality printing up to 10ft seamlessly on HP Latex & eco-solvent engines.' },
      { name: 'Custom Printing', slug: 'custom-printing', desc: 'Tailor-made customized print specifications with bespoke die-cutting, embossing and foil stamping.' },
      { name: 'Flyer Printing', slug: 'flyer-printing', desc: 'Vibrant single and double-sided promotional flyers on 130 GSM to 300 GSM art paper.' },
      { name: 'Brochure Printing', slug: 'brochure-printing', desc: 'Bi-fold, tri-fold and multi-page brochures with matte, gloss, and velvet lamination.' },
      { name: 'Poster Printing', slug: 'poster-printing', desc: 'High-impact indoor and outdoor advertising posters on synthetic paper, photo gloss, and cardstock.' },
      { name: 'Catalogue Printing', slug: 'catalogue-printing', desc: 'Premium product catalogues with perfect binding, saddle stitching or wire-o binding for manufacturers.' },
      { name: 'Business Card Printing', slug: 'business-card-printing', desc: 'Executive visiting cards with spot UV, soft-touch velvet lamination, metallic foiling, and plastic substrates.' },
      { name: 'Letterhead Printing', slug: 'letterhead-printing', desc: 'Crisp corporate letterheads on 100 GSM super sunshine, executive bond, and textured cotton stock.' },
      { name: 'Envelope Printing', slug: 'envelope-printing', desc: 'Custom printed office envelopes in 9x4, A4, and courier sizes with peel-and-seal gumming.' },
      { name: 'ID Card Printing', slug: 'id-card-printing', desc: 'Thermal and UV fused PVC employee ID cards with RFID, barcode, magnetic strip, and custom lanyards.' },
      { name: 'Corporate Stationery Printing', slug: 'corporate-stationery-printing', desc: 'Unified branding kits with folders, notepads, pens, envelopes, and vouchers.' },
      { name: 'Calendar Printing', slug: 'calendar-printing', desc: 'Custom wall and desk calendar printing with wire-o binding and rigid stand bases.' },
      { name: 'Magazine Printing', slug: 'magazine-printing', desc: 'High-speed editorial and company magazine printing with coated art interiors and glossy UV covers.' },
      { name: 'Book Printing', slug: 'book-printing', desc: 'On-demand and bulk publishing for softcover paperbacks and hardcover books.' },
      { name: 'Label Printing', slug: 'label-printing', desc: 'Self-adhesive product labels on roll or sheet formats, waterproof and oil-resistant.' },
      { name: 'Sticker Printing', slug: 'sticker-printing', desc: 'Custom die-cut vinyl stickers with scratch-resistant lamination for equipment and packaging.' },
    ]
  },
  signage: {
    name: 'Flex and Signage',
    services: [
      { name: 'Flex Printing', slug: 'flex-printing', desc: 'Heavy-duty 280 GSM to 440 GSM flex printing with solvent and eco-solvent weather-proof inks.' },
      { name: 'Banner Printing', slug: 'banner-printing', desc: 'All-weather promotional hoarding and event banners with reinforced eyelets and edge taping.' },
      { name: 'Frontlit Flex Printing', slug: 'frontlit-flex-printing', desc: 'High-opacity white frontlit flex designed for external billboard and hoarding lighting.' },
      { name: 'Backlit Flex Printing', slug: 'backlit-flex-printing', desc: 'Translucent backlit flex banner printing with rich color diffusion for illuminated glow signs.' },
      { name: 'Vinyl Printing', slug: 'vinyl-printing', desc: 'High-resolution cast and calendered self-adhesive vinyl printing with anti-UV lamination.' },
      { name: 'One Way Vision Printing', slug: 'one-way-vision-printing', desc: 'Perforated window film printing allowing outside visibility for retail glass and vehicles.' },
      { name: 'Canvas Printing', slug: 'canvas-printing', desc: 'Museum-grade textured poly-cotton canvas prints for corporate art and showroom interiors.' },
      { name: 'Glow Sign Board', slug: 'glow-sign-board', desc: 'Durable GI/aluminum framed glow sign boards with branded LED tube lighting and backlit skin.' },
      { name: 'LED Sign Board', slug: 'led-sign-board', desc: 'Energy-saving Samsung/Osram module LED signboards with high luminous output.' },
      { name: 'ACP Sign Board', slug: 'acp-sign-board', desc: 'Architectural aluminum composite panel fascia boards routed with 3D acrylic embossed lettering.' },
      { name: 'Acrylic Sign Board', slug: 'acrylic-sign-board', desc: 'Laser-cut cast acrylic letters with side return LED illumination for storefronts and lobbies.' },
      { name: 'Shop Sign Board', slug: 'shop-sign-board', desc: 'Turnkey retail storefront signage fabrication, compliant with local municipal standards in Nagpur.' },
      { name: 'Office Signage', slug: 'office-signage', desc: 'Indoor corporate wayfinding, cabin door plates, reception backdrops, and safety regulatory signs.' },
      { name: 'Outdoor Advertising Boards', slug: 'outdoor-advertising-boards', desc: 'Heavy structural steel hoarding and unipole advertising board manufacturing and skin mounting.' },
      { name: 'Backdrop Printing', slug: 'backdrop-printing', desc: 'Matte reflection-free flex and fabric media backdrops for corporate stages, press conferences, and weddings.' },
    ]
  },
  branding: {
    name: 'Branding and Advertising',
    services: [
      { name: 'Shop Branding', slug: 'shop-branding', desc: 'Complete exterior and interior retail store branding from wall vinyl to pillar wraps and shelf strips.' },
      { name: 'Corporate Branding', slug: 'corporate-branding', desc: 'Unified identity transformation for corporate headquarters, conference rooms, and branch offices.' },
      { name: 'Vehicle Branding', slug: 'vehicle-branding', desc: 'Full and partial vehicle vinyl wraps using 3M / Avery cast vinyl with air-release technology.' },
      { name: 'Car Advertising', slug: 'car-advertising', desc: 'Durable commercial vehicle vinyl graphics for fleets, taxis, and promotional cars.' },
      { name: 'Van Branding', slug: 'van-branding', desc: 'High-impact mobile billboard wraps for logistics delivery vans and distribution fleets.' },
      { name: 'Indoor Branding', slug: 'indoor-branding', desc: 'Architectural wall murals, frosted glass privacy film, and directional signage for offices.' },
      { name: 'Outdoor Branding', slug: 'outdoor-branding', desc: 'Street-level pole kiosks, cantilever signs, building facade wraps, and transit media.' },
      { name: 'Event Branding', slug: 'event-branding', desc: 'Turnkey exhibition and event branding including entry arches, holding areas, and stage backdrops.' },
      { name: 'Promotional Display Stands', slug: 'promotional-display-stands', desc: 'Portable modular display stands, brochure holders, and product sampling kiosks.' },
      { name: 'Roll Up Standee', slug: 'roll-up-standee', desc: 'Heavy-base aluminum pull-up banner standees (3x6 ft and 2x5 ft) with non-tearable synthetic media.' },
      { name: 'Promotional Flags', slug: 'promotional-flags', desc: 'Teardrop, feather, and blade promotional outdoor flags with water-fillable bases.' },
      { name: 'Canopy Branding', slug: 'canopy-branding', desc: 'Heavy-duty 6x6 ft and 8x8 ft promotional folding gazebo tents with full branding print.' },
      { name: 'Exhibition Branding', slug: 'exhibition-branding', desc: 'End-to-end expo stall design, Octanorm panel prints, raised wooden platforms, and lighting.' },
      { name: 'POP Display Stands', slug: 'pop-display-stands', desc: 'Point-of-Purchase display racks and counter units fabricated in sunboard, acrylic, and metal.' },
      { name: 'Corporate Gifts Printing', slug: 'corporate-gifts-printing', desc: 'Personalized branded executive gifts, diaries, vacuum bottles, and electronics in presentation boxes.' },
    ]
  },
  cnc: {
    name: 'CNC, Laser and Custom Manufacturing',
    services: [
      { name: 'CNC Cutting', slug: 'cnc-cutting', desc: 'Computerized numerical 3-axis CNC router routing on MDF, wood, acrylic, PVC, ACP, and aluminum.' },
      { name: 'CNC Wood Cutting', slug: 'cnc-wood-cutting', desc: 'Precision contouring and profiling on solid wood, teak, pine, and commercial ply.' },
      { name: 'MDF Jali Cutting', slug: 'mdf-jali-cutting', desc: 'Decorative architectural jali screens and room dividers cut with micron precision.' },
      { name: 'Acrylic Laser Cutting', slug: 'acrylic-laser-cutting', desc: 'Flame-polished CO2 laser cutting of cast acrylic sheets up to 25mm thickness.' },
      { name: 'PVC Cutting', slug: 'pvc-cutting', desc: 'Clean router and laser cutting of high-density PVC foam sheets for lettering and architectural panels.' },
      { name: 'WPC Cutting', slug: 'wpc-cutting', desc: 'Weather-resistant Wood Plastic Composite cutting for outdoor cladding, louvers, and decorative gates.' },
      { name: 'ACP Cutting', slug: 'acp-cutting', desc: 'Grooving, folding, and laser routing of Aluminum Composite Panels for building envelopes.' },
      { name: 'Metal Cutting', slug: 'metal-cutting', desc: 'High-precision fiber laser profiling of stainless steel, mild steel, and brass sheet lettering.' },
      { name: 'Wood Carving', slug: 'wood-carving', desc: '3D Relief computerized wood carving for decorative temple work, furniture, and feature walls.' },
      { name: 'Door Carving', slug: 'door-carving', desc: 'Custom CNC carved main doors and entrance portals in teak, engineered hardwood, and PVC.' },
      { name: 'Custom MDF Products', slug: 'custom-mdf-products', desc: 'Fabricated MDF displays, organizers, gift packaging, and craft blanks.' },
      { name: 'Custom Acrylic Products', slug: 'custom-acrylic-products', desc: 'Fabricated acrylic ballot boxes, brochure racks, podiums, and display domes.' },
      { name: '3D Arch Gate', slug: '3d-arch-gate', desc: 'Grand entry welcome arches fabricated in steel trussing with high-definition branding wrap.' },
      { name: 'Custom Fabrication', slug: 'custom-fabrication', desc: 'Heavy industrial metal, MS framework, and architectural fabrication at our Wathoda workshop.' },
      { name: 'Flatbed UV Printing', slug: 'flatbed-uv-printing', desc: 'Direct-to-substrate digital UV printing on glass, ceramic tiles, wood, leather, and metal.' },
    ]
  },
  specialized: {
    name: 'Specialized Printing',
    services: [
      { name: 'Product Packaging Printing', slug: 'product-packaging-printing', desc: 'Monocarton packaging, corrugated shipping boxes, and luxury rigid gift boxes with foil stamping.' },
      { name: 'Customized Gift Printing', slug: 'customized-gift-printing', desc: 'Direct personalized UV and sublimation printing on ceramic mugs, photo frames, and keychains.' },
      { name: 'Memento Printing', slug: 'memento-printing', desc: 'Crystal, acrylic, and wooden awards, trophies, and mementos with gold laser engraving.' },
      { name: 'Customized Notebooks', slug: 'customized-notebooks', desc: 'Corporate leatherette diaries, wire-bound executive journals, and conference notepads.' },
      { name: 'Promotional Merchandise', slug: 'promotional-merchandise', desc: 'Custom printed round-neck tees, polo shirts, caps, umbrellas, and jute bags.' },
      { name: 'Customized Corporate Gifts', slug: 'customized-corporate-gifts', desc: 'Premium festival gifting hampers, curated desk essentials, and branded electronics.' },
      { name: 'Display Board Printing', slug: 'display-board-printing', desc: 'Direct UV printing on sunboard and foamcore sheets for retail POS and presentation boards.' },
      { name: 'Backdrop Stand Printing', slug: 'backdrop-stand-printing', desc: 'Telescopic and magnetic pop-up backdrop banner stands with seamless fabric graphics.' },
      { name: 'LED Backlit Frames', slug: 'led-backlit-frames', desc: 'Ultra-slim magnetic and snap-frame LED lightboxes with silicone edge fabric graphics (SEG).' },
      { name: 'Custom Promotional Tables', slug: 'custom-promotional-tables', desc: 'Collapsible promotional demo counters and sampling podiums with full graphic wrap.' },
    ]
  }
}

// 40 Prominent Nagpur Localities
const localities = [
  { name: 'Sitabuldi', type: 'Commercial & Retail Heart' },
  { name: 'Dharampeth', type: 'Premium Retail & Business Hub' },
  { name: 'Sadar', type: 'Central Commercial & Corporate' },
  { name: 'Manish Nagar', type: 'South Nagpur Growth Corridor' },
  { name: 'Wardhaman Nagar', type: 'East Nagpur Trade & Commercial Hub' },
  { name: 'Wathoda', type: 'Industrial & Manufacturing Hub (Factory Location)' },
  { name: 'Pardi', type: 'Industrial & Logistics Center' },
  { name: 'Itwari', type: 'Wholesale Trade & Commercial Center' },
  { name: 'Mahal', type: 'Historic Retail & Market Center' },
  { name: 'Gandhibagh', type: 'Wholesale Textile & Trade Market' },
  { name: 'Lakadganj', type: 'Timber, Plywood & Industrial Zone' },
  { name: 'Nandanvan', type: 'Educational & Commercial Hub' },
  { name: 'Sakkardara', type: 'South-East Commercial District' },
  { name: 'Dighori', type: 'Ring Road Commercial Corridor' },
  { name: 'Hingna', type: 'Major Industrial & Educational Zone' },
  { name: 'MIDC Hingna', type: 'Large-Scale Manufacturing & Engineering Hub' },
  { name: 'Butibori', type: '5-Star Industrial Estate & Manufacturing Hub' },
  { name: 'Mihan', type: 'SEZ & Multi-modal Logistics Hub' },
  { name: 'Civil Lines', type: 'Administrative & Corporate Headquarters' },
  { name: 'Ramdaspeth', type: 'Corporate Consulting & Healthcare Hub' },
  { name: 'Bajaj Nagar', type: 'West Nagpur Commercial Center' },
  { name: 'Laxmi Nagar', type: 'Commercial & Retail Junction' },
  { name: 'Pratap Nagar', type: 'South-West Business Corridor' },
  { name: 'Narendra Nagar', type: 'Commercial & Residential Nexus' },
  { name: 'Somalwada', type: 'Wardha Road Commercial Corridor' },
  { name: 'Trimurti Nagar', type: 'West Nagpur Retail Market' },
  { name: 'Manewada', type: 'High-Traffic Ring Road Trade Zone' },
  { name: 'Besa', type: 'Fast-Developing Commercial Corridor' },
  { name: 'Beltarodi', type: 'South Nagpur Modern Business Hub' },
  { name: 'Khamla', type: 'Wholesale & Retail Market' },
  { name: 'Ajni', type: 'Railway & Logistics Transit Zone' },
  { name: 'Medical Square', type: 'Healthcare & Institutional District' },
  { name: 'Reshimbagh', type: 'Central Sports & Retail Area' },
  { name: 'Kamptee Road', type: 'Automotive & Industrial Corridor' },
  { name: 'Mankapur', type: 'North Nagpur Sports & Commercial Zone' },
  { name: 'Gittikhadan', type: 'West Nagpur Logistics & Business Corridor' },
  { name: 'Koradi Road', type: 'Highway Commercial & Industrial Corridor' },
  { name: 'Zingabai Takli', type: 'North-West Commercial Center' },
  { name: 'Nari', type: 'North Nagpur Transport & Industrial Hub' },
  { name: 'Chhatrapati Square', type: 'High-Density Wardha Road Junction' }
]

const allServices = []
for (const catKey of Object.keys(categories)) {
  for (const s of categories[catKey].services) {
    allServices.push({ ...s, categoryKey: catKey, categoryName: categories[catKey].name })
  }
}

// 60 Core City-wide Nagpur Services
const cityPages = allServices.slice(0, 60).map((srv) => {
  const slug = `${srv.slug}-in-nagpur`
  return {
    slug,
    url: `/${slug}`,
    serviceName: srv.name,
    category: srv.categoryName,
    targetLocation: 'Nagpur',
    locationType: 'City-wide Headquarters & Delivery',
    seoTitle: `${srv.name} in Nagpur | Best Rates - MRPRINT WORLD`,
    metaDescription: `Looking for top-quality ${srv.name.toLowerCase()} in Nagpur? MRPRINT WORLD offers factory-direct production, high precision & quick delivery. Get a free quote!`,
    h1: `${srv.name} in Nagpur`,
    tagline: `Premium ${srv.name.toLowerCase()} engineered in-house at our Nagpur production facility.`,
    isLocalityPage: false,
    status: 'published',
    indexingStatus: 'index, follow',
    priority: '0.9',
    changefreq: 'weekly',
  }
})

// 40 Hyperlocal Area Landing Pages across Nagpur
const hyperlocalPairs = [
  { srvSlug: 'flex-printing', loc: 'Wardhaman Nagar' },
  { srvSlug: 'banner-printing', loc: 'Manewada' },
  { srvSlug: 'vinyl-printing', loc: 'Manish Nagar' },
  { srvSlug: 'printing-services', loc: 'Hingna' },
  { srvSlug: 'cnc-cutting', loc: 'MIDC Hingna' },
  { srvSlug: 'acrylic-sign-board', loc: 'Dharampeth' },
  { srvSlug: 'led-sign-board', loc: 'Sitabuldi' },
  { srvSlug: 'shop-branding', loc: 'Sadar' },
  { srvSlug: 'corporate-branding', loc: 'Civil Lines' },
  { srvSlug: 'vehicle-branding', loc: 'Wathoda' },
  { srvSlug: 'digital-printing', loc: 'Ramdaspeth' },
  { srvSlug: 'offset-printing', loc: 'Itwari' },
  { srvSlug: 'acp-sign-board', loc: 'Chhatrapati Square' },
  { srvSlug: 'brochure-printing', loc: 'Mihan' },
  { srvSlug: 'catalogue-printing', loc: 'Butibori' },
  { srvSlug: 'glow-sign-board', loc: 'Mahal' },
  { srvSlug: 'one-way-vision-printing', loc: 'Gandhibagh' },
  { srvSlug: 'commercial-printing', loc: 'Pardi' },
  { srvSlug: 'acrylic-laser-cutting', loc: 'Lakadganj' },
  { srvSlug: 'mdf-jali-cutting', loc: 'Nandanvan' },
  { srvSlug: 'office-signage', loc: 'Bajaj Nagar' },
  { srvSlug: 'roll-up-standee', loc: 'Laxmi Nagar' },
  { srvSlug: 'product-packaging-printing', loc: 'MIDC Hingna' },
  { srvSlug: 'flatbed-uv-printing', loc: 'Wathoda' },
  { srvSlug: 'id-card-printing', loc: 'Sakkardara' },
  { srvSlug: 'custom-printing', loc: 'Pratap Nagar' },
  { srvSlug: 'letterhead-printing', loc: 'Narendra Nagar' },
  { srvSlug: 'canopy-branding', loc: 'Trimurti Nagar' },
  { srvSlug: 'exhibition-branding', loc: 'Reshimbagh' },
  { srvSlug: 'event-branding', loc: 'Medical Square' },
  { srvSlug: 'car-advertising', loc: 'Kamptee Road' },
  { srvSlug: 'van-branding', loc: 'Besa' },
  { srvSlug: 'outdoor-advertising-boards', loc: 'Beltarodi' },
  { srvSlug: 'promotional-display-stands', loc: 'Somalwada' },
  { srvSlug: 'corporate-gifts-printing', loc: 'Civil Lines' },
  { srvSlug: 'flyer-printing', loc: 'Khamla' },
  { srvSlug: 'metal-cutting', loc: 'Butibori' },
  { srvSlug: 'wood-carving', loc: 'Lakadganj' },
  { srvSlug: 'custom-fabrication', loc: 'Wathoda' },
  { srvSlug: 'led-backlit-frames', loc: 'Dharampeth' }
]

const localityPages = hyperlocalPairs.map((pair) => {
  const srv = allServices.find((s) => s.slug === pair.srvSlug) || allServices[0]
  const locObj = localities.find((l) => l.name === pair.loc) || { name: pair.loc, type: 'Commercial Area' }
  const slug = `locations/${srv.slug}-in-${pair.loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return {
    slug,
    url: `/${slug}`,
    serviceName: srv.name,
    category: srv.categoryName,
    targetLocation: pair.loc,
    locationType: locObj.type,
    seoTitle: `${srv.name} in ${pair.loc}, Nagpur | Quick Delivery - MRPRINT`,
    metaDescription: `High-quality ${srv.name.toLowerCase()} in ${pair.loc}, Nagpur. Factory-direct manufacturing, premium materials & fast local installation by MRPRINT WORLD. Enquire now!`,
    h1: `${srv.name} in ${pair.loc}, Nagpur`,
    tagline: `Dedicated ${srv.name.toLowerCase()} and branding services for businesses in ${pair.loc} and nearby areas.`,
    isLocalityPage: true,
    status: 'published',
    indexingStatus: 'index, follow',
    priority: '0.8',
    changefreq: 'monthly',
  }
})

const totalPages = [...cityPages, ...localityPages]

// Material & Specifications Matrix per Category
const specsMatrix = {
  'Printing Services': {
    materials: ['Art Card (250-350 GSM)', 'Art Paper (100-170 GSM)', 'Executive Bond & Textured Cotton', 'Synthetic Non-Tearable Media', 'Self-Adhesive Cast Vinyl'],
    finishes: ['Matte / Gloss Thermal Lamination', 'Spot UV & Raised 3D Gloss', 'Gold / Silver Thermal Foil Stamping', 'Die-Cut Embossing / Debossing', 'Soft-Touch Velvet Finish'],
    machines: ['Heidelberg Speedmaster CD 102 (4-Color Offset)', 'Konica Minolta AccurioPress C4080 (Digital)', 'Polar High-Speed Programmable Guillotines'],
    turnaround: '24 to 48 hours for standard runs; Same-day dispatch available for urgent digital runs.',
    minOrder: 'From 50 units for digital, 500+ units for high-efficiency offset runs.'
  },
  'Flex and Signage': {
    materials: ['Frontlit Heavyweight Flex (320-440 GSM)', 'Star Backlit Translucent Flex', 'Cast Self-Adhesive Vinyl with UV Coat', 'Cast Acrylic Sheets (3mm to 20mm)', 'Aluminum Composite Panels (ACP 3mm/4mm)'],
    finishes: ['Anti-UV Matt / Gloss Overlamination', 'Heat-Welded Hemming with Brass Grommets', 'Waterproof Outdoor LED Module Wiring', 'Powder-Coated Structural MS Framework', 'Laser Flame-Polished Edge Contouring'],
    machines: ['HP Latex 365 Wide-Format Environmental Press', 'Industrial 3.2m High-Speed Solvent Flex Printer', 'Automatic Channel Letter Bending Machine'],
    turnaround: '2 to 4 days including custom fabrication and electrical bench testing.',
    minOrder: 'Custom single pieces to multi-store rollout batches across Nagpur.'
  },
  'Branding and Advertising': {
    materials: ['3M Cast Wrapping Film', 'Avery Dennison High-Performance Vinyl', 'Perforated One-Way Vision Film', 'High-Density Sunboard (3mm to 10mm)', 'Heavy-Duty Anodized Aluminum Hardware'],
    finishes: ['Scratch-Resistant Polymeric Lamination', 'Seamless Panel Overlap Joining', 'Magnetic Snap Frame Closures', 'Reinforced Heavy Base Plates with Carry Cases'],
    machines: ['Precision Graphtec Vinyl Plotters', 'Industrial Cold Laminators with Heat Assist', 'High-Frequency Canvas & Fabric Welders'],
    turnaround: 'Fleet wrapping & event branding completed on tight schedules with on-site deployment.',
    minOrder: 'From single promotional standees to complete commercial fleet wraps.'
  },
  'CNC, Laser and Custom Manufacturing': {
    materials: ['Commercial & BWP Grade MDF / HDF', 'Imported Cast Acrylic Sheets', 'High-Density PVC Foam Boards', 'Weatherproof Wood Plastic Composite (WPC)', 'Aluminum Composite Panels & Brass/SS Sheets'],
    finishes: ['Micron-Accurate Laser Flame Polishing', 'Smooth CNC 3D Relief Routing', 'Duco Primer & Polyurethane Protective Lacquer', 'Gold Leafing & Metallic Pigment Infill'],
    machines: ['Heavy-Duty Industrial 3-Axis CNC Router (8x4 ft)', '130W High-Precision CO2 Laser Engraving System', 'Fiber Laser Metal Sheet Cutter'],
    turnaround: '1 to 3 days depending on thickness, relief depth and post-finishing requirements.',
    minOrder: 'Bespoke custom one-off pieces or repetitive bulk architectural batches.'
  },
  'Specialized Printing': {
    materials: ['Virgin Kraft & Duplex Monocarton Boards', 'Crystal Clear Acrylic & Optical Glass', 'Sublimation-Coated Ceramics & Stainless Steel', 'Premium Leatherette & Hardbound Board', 'Textured Sunboard with Direct UV Ink Fusing'],
    finishes: ['Drip-Off Matt & Gloss UV Effects', 'Gold / Rose Gold Metallic Foil Embossing', 'Laser Micro-Etching on Wood & Metal', 'Food-Grade Varnishing for Packaging'],
    machines: ['Industrial Direct-to-Substrate Flatbed UV Press', 'Rotary UV Bottle & Cylinder Printing Attachment', 'Semi-Automatic Screen Printing with UV Curing Tunnel'],
    turnaround: '3 to 5 working days with personalized proofing prior to mass run.',
    minOrder: 'Low minimums for executive gifts; Scalable volume for corporate campaigns.'
  }
}

// Generate Detailed Rich Content for Each Page
const fullPages = totalPages.map((page, index) => {
  const specs = specsMatrix[page.category] || specsMatrix['Printing Services']
  const locName = page.targetLocation
  const srvName = page.serviceName
  const isLocal = page.isLocalityPage

  const faqs = [
    {
      question: `What is the typical turnaround time for ${srvName.toLowerCase()} in ${locName}?`,
      answer: `Standard orders for ${srvName.toLowerCase()} are processed within 24 to 48 hours at our Wathoda production unit in Nagpur. For large format signage or custom fabrication, timelines typically range from 2 to 4 business days including quality inspection and dispatch.`
    },
    {
      question: `Do you provide delivery and on-site support in ${locName}, Nagpur?`,
      answer: `Yes, MRPRINT WORLD provides comprehensive delivery and professional on-site installation across ${locName} and all major areas in Nagpur. You can also opt for direct pickup from our factory behind Kohinoor Lawn, Wathoda.`
    },
    {
      question: `What file formats do you accept for ${srvName.toLowerCase()}?`,
      answer: `We recommend submitting print-ready vector files in PDF, AI, EPS, or high-resolution CDR (CorelDraw). High-resolution TIFF or JPEG (minimum 300 DPI at actual print size, CMYK color space) are also accepted.`
    },
    {
      question: `Can I inspect a sample or proof before the full production run?`,
      answer: `Absolutely. We provide digital proofs for every job, and hard physical samples or color swatches can be inspected at our Nagpur facility before initiating bulk production.`
    },
    {
      question: `Why choose MRPRINT WORLD over local brokers in ${locName}?`,
      answer: `MRPRINT WORLD operates a fully equipped 100% in-house manufacturing factory in Nagpur with Heidelberg, Konica Minolta, and HP Latex machinery. You deal directly with the manufacturer, ensuring higher quality control, faster turnaround, and genuine factory pricing.`
    }
  ]

  const useCases = [
    { title: 'Corporate & Commercial Identity', desc: `Reinforce your corporate presence across ${locName} with crisp, color-matched ${srvName.toLowerCase()} adhering to your brand guidelines.` },
    { title: 'Retail & Storefront Promotions', desc: `Attract footfall and enhance retail visibility in commercial shopping streets with high-contrast, durable materials.` },
    { title: 'Exhibitions & Industry Events', desc: `Stand out at Nagpur trade expos, conventions, and corporate launches with portable, lightweight and eye-catching displays.` },
    { title: 'Real Estate & Infrastructure Launches', desc: `Deliver high-impact visual communication for project sites, sales galleries, and commercial developments across Nagpur.` }
  ]

  const otherServices = allServices.filter((s) => s.name !== srvName).slice((index * 3) % 40, ((index * 3) % 40) + 4)
  const relatedServices = otherServices.map((s) => ({
    name: s.name,
    slug: `${s.slug}-in-nagpur`,
    url: `/${s.slug}-in-nagpur`
  }))

  const nearbyLocs = localities.filter((l) => l.name !== locName).slice((index * 4) % 30, ((index * 4) % 30) + 4)
  const relatedLocations = nearbyLocs.map((l) => ({
    name: l.name,
    slug: `locations/${allServices[index % allServices.length].slug}-in-${l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    url: `/locations/${allServices[index % allServices.length].slug}-in-${l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  }))

  const verifiedFactoryNote = isLocal
    ? `Our direct manufacturing facility is strategically located at Wathoda, Nagpur, allowing rapid delivery, prompt site inspection, and hands-on installation support directly to businesses operating in ${locName}.`
    : `All production is executed directly at MRPRINT WORLD's company-owned manufacturing plant in Wathoda, Nagpur, serving corporate clients, retail brands, and institutions across the entire Vidarbha region.`

  return {
    id: `seo-page-${index + 1}`,
    slug: page.slug,
    url: page.url,
    serviceName: srvName,
    category: page.category,
    targetLocation: locName,
    locationType: page.locationType,
    isLocalityPage: isLocal,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    h1: page.h1,
    tagline: page.tagline,
    introduction: `MRPRINT WORLD provides professional, factory-direct ${srvName.toLowerCase()} in ${locName}, Nagpur. Backed by 12+ years of brand execution expertise and advanced production machinery, we deliver unmatched color precision, durable substrates, and rapid local turnaround.`,
    overview: `Whether you require short-run bespoke production or heavy high-volume manufacturing, our in-house facility guarantees strict quality tolerances. ${verifiedFactoryNote}`,
    specs,
    useCases,
    whyChoose: [
      { title: '100% In-House Production', desc: 'No outsourcing. Full end-to-end execution at our Wathoda manufacturing plant in Nagpur.' },
      { title: 'Advanced Press & Cutting Fleet', desc: 'Equipped with Heidelberg 4-color offset, Konica Minolta digital, HP Latex, and industrial 3-axis CNC/Laser cutters.' },
      { title: '12+ Years Industry Leadership', desc: 'Over 5,000 completed branding and print projects for leading corporates, retail chains, and SMEs.' },
      { title: 'Transparent Factory Pricing', desc: 'Direct manufacturer pricing with zero middleman commissions or broker markups.' }
    ],
    locationDelivery: {
      locationName: locName,
      coverage: `${locName} & Surrounding Nagpur Zones`,
      dispatchCenter: 'MRPRINT WORLD Factory, Shailesh Nagar, Behind Kohinoor Lawn, Wathoda, Nagpur',
      regOffice: 'Bungalow No. 22B, Kalawati Kunj, Kalawati Nagar, Pipla, Nagpur',
      contactPhone: '+91 78418 40840',
      whatsapp: '917841840840',
      email: 'info@mrprintworld.com'
    },
    faqs,
    relatedServices,
    relatedLocations,
    status: page.status,
    indexingStatus: page.indexingStatus,
    priority: page.priority,
    changefreq: page.changefreq
  }
})

const fileContent = `/**
 * MRPRINT WORLD - 100 Local SEO Landing Pages Database
 * Generated with verified local business data and technical specifications.
 * All rights reserved: MRPRINT WORLD PVT LTD, Nagpur, Maharashtra.
 */

export const seoLandingPages = ${JSON.stringify(fullPages, null, 2)}

export function getSeoPageBySlug(slug) {
  if (!slug) return null
  const clean = slug.replace(/^\\/+/, '').replace(/\\/+$/, '')
  return seoLandingPages.find((p) => p.slug === clean || p.slug === \`locations/\${clean}\`) || null
}

export function getAllSeoSlugs() {
  return seoLandingPages.map((p) => p.slug)
}
`

const targetFile = 'c:/Users/prana/Desktop/MR printworld/mrPrintWorld-frontend/src/data/seoLandingPages.js'
writeFileSync(targetFile, fileContent, 'utf8')
console.log(`Successfully wrote ${fullPages.length} landing pages into ${targetFile}!`);
