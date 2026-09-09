import corporateEventImg from '../assets/corporateEvent.jpeg'

/**
 * Service ecosystem
 * Each group powers a homepage module and a dedicated service page.
 * `icon` maps to a key in components/primitives/Icon.jsx.
 */

export const services = [
  {
    id: 'printing',
    slug: 'printing',
    title: 'Printing Solutions',
    icon: 'printing',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jXgpNhqkdnfSWgcGQz0a7n2empZuqN2OAxfJrHE4-Ka2DuFhwRkLDTc&s=10',
    summary:
      'Precision print across every format — from a single premium business card to nationwide transit media, colour-managed and finished in-house.',
    description:
      'We deliver uncompromising print quality across an extensive range of formats and substrates. Utilizing state-of-the-art digital and large-format printing technology, our team ensures color accuracy and crisp detailing on every run. Whether producing high-volume marketing collateral or short-run bespoke stationery, we manage the entire process from prepress to final finishing. Our comprehensive bindery and finishing options guarantee a polished end product that elevates your brand.',
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
    machines: [
      'Heidelberg Speedmaster CD 102 (4-Color Offset Press)',
      'Konica Minolta AccurioPress C4080 (High-Speed Digital Press)',
      'HP Latex 365 (Eco-Friendly Wide Format Printer)',
    ],
    applications: [
      'Marketing Campaigns',
      'Corporate Communications',
      'Product Packaging',
      'Retail Point-of-Sale',
      'Brand Collateral',
      'Educational Materials',
    ],
    industries: [
      'Retail',
      'Corporate',
      'Education',
      'Healthcare',
      'Hospitality',
      'Real Estate',
    ],
    seo: {
      title: 'Professional Printing Services & Solutions | MRPrint World',
      description:
        'High-quality digital, offset, and large format printing services in Nagpur. From business cards to transit media, we deliver precision and scale.',
    },
  },
  {
    id: 'signage',
    slug: 'signage',
    title: 'Signage',
    icon: 'signage',
    image: 'https://5.imimg.com/data5/SELLER/Default/2026/7/628940677/RL/DL/XI/21735062/safety-signage-printing-service-500x500.jpg',
    summary:
      'Architectural signage engineered to last — fabricated, wired and installed by our own teams for a flawless, on-brand storefront.',
    description:
      'Our custom signage solutions bridge the gap between architectural design and brand identity. We conceptualize, fabricate, and install a diverse array of signs, ranging from illuminated storefront displays to sophisticated internal wayfinding systems. By combining durable materials like ACP and acrylic with energy-efficient LED technology, we create signage that is both striking and sustainable. Every project is meticulously executed to endure environmental elements while maintaining visual impact.',
    items: [
      'Acrylic Signage',
      'Glow Sign Boards',
      'ACP Sign Boards',
      'Dealer Boards',
      'In-Shop Branding',
    ],
    machines: [
      'Automatic Channel Letter Bending Machine (CNC-controlled)',
      'Pneumatic Acrylic Panel Bending & Heating Tables',
      'High-output LED Module Testing & Wire Harnessing Bench',
    ],
    applications: [
      'Storefront Identification',
      'Wayfinding',
      'Promotional Displays',
      'Corporate Office Branding',
      'Franchise Signage',
      'Safety & Regulatory Signs',
    ],
    industries: [
      'Retail',
      'Healthcare',
      'Corporate Offices',
      'Hospitality',
      'Automotive',
      'Real Estate',
    ],
    seo: {
      title: 'Custom Signage & Glow Sign Boards | MRPrint World',
      description:
        'Expert fabrication and installation of architectural signage, ACP boards, and illuminated glow signs to elevate your brand presence.',
    },
  },
  {
    id: 'corporate',
    slug: 'corporate-solutions',
    title: 'Corporate Solutions',
    icon: 'gift',
    image: 'https://img.magnific.com/free-photo/modern-printing-press-produces-multi-colored-printouts-accurately-generated-by-ai_188544-15381.jpg?semt=ais_test_b&w=740&q=80',
    summary:
      'Considered corporate gifting and bespoke collateral that carry a brand with the weight it deserves — at any scale of rollout.',
    description:
      "We curate and manufacture premium corporate gifting and customized business solutions that reflect your organization's prestige. Our personalized mementos, custom stationery, and unique promotional products are crafted to foster enduring relationships with clients and employees alike. Leveraging advanced UV printing and engraving techniques, we ensure immaculate branding on a wide variety of materials. From onboarding kits to executive awards, our solutions are tailored to suit your specific corporate ethos.",
    items: [
      'Corporate Gifting',
      'Custom Mementos',
      'UV Printing',
      'Customized Stationery',
    ],
    machines: [
      'Mimaki UJF-6042 MkII e (High-precision Flatbed UV Printer)',
      'Direct-to-Garment (DTG) Textile Printers',
      'Trotec Speedy 400 (Laser Engraving & Marking System)',
    ],
    applications: [
      'Employee Onboarding Kits',
      'Client Appreciation',
      'Event Giveaways',
      'Milestone Awards',
      'Holiday Gifting',
      'Brand Awareness',
    ],
    industries: [
      'Corporate Sectors',
      'IT & Tech',
      'Banking & Finance',
      'Pharmaceuticals',
      'Education',
      'Events & PR',
    ],
    seo: {
      title: 'Corporate Gifting & Business Solutions | MRPrint World',
      description:
        'Bespoke corporate gifting, custom mementos, and premium branded stationery to help you build lasting business relationships.',
    },
  },
  {
    id: 'fabrication',
    slug: 'fabrication',
    title: 'Fabrication',
    icon: 'fabrication',
    image: 'https://5.imimg.com/data5/SELLER/Default/2021/6/CL/ON/CU/75133011/indoor-outdoor-printing-fabrication-service-500x500.jpg',
    summary:
      'A full fabrication floor — CNC cutting and metal work that turns design intent into physical, installation-ready brand environments.',
    description:
      'Our in-house fabrication facility translates ambitious designs into robust, physical realities. Equipped with advanced machinery for metalworking, cutting, and shaping, we process a vast array of materials including mild steel, aluminum, wood, and composites. We construct durable frameworks and structural elements essential for signage, exhibitions, and architectural accents. Rigorous quality control at every stage ensures structural integrity and precise alignment for seamless installation.',
    items: [
      'ACP Cutting',
      'MDF Cutting',
      'PVC Cutting',
      'Wood Cutting',
      'MS Fabrication',
    ],
    machines: [
      'Industrial CNC Router Station (8x4 ft Heavy-Duty Bed)',
      'AC/DC TIG & MIG Metal Welding Stations',
      'Hydraulic Sheet Metal Shearing & Folding Machinery',
    ],
    applications: [
      'Structural Signage Frameworks',
      'Exhibition Booths',
      'Retail Fixtures',
      'Architectural Cladding',
      'Custom Displays',
      'Industrial Enclosures',
    ],
    industries: [
      'Construction',
      'Architecture',
      'Retail',
      'Events & Exhibitions',
      'Manufacturing',
      'Advertising',
    ],
    seo: {
      title: 'Custom Fabrication & Metalwork | MRPrint World',
      description:
        'Comprehensive fabrication services including MS fabrication, CNC cutting, and structural builds for robust branding and architectural projects.',
    },
  },
  {
    id: 'event',
    slug: 'event-branding',
    title: 'Event Branding',
    icon: 'event',
    image: corporateEventImg,
    summary:
      'Large-format event and transit branding produced, transported and installed on deadline — built for visibility and built to travel.',
    description:
      'We provide end-to-end event branding solutions designed to capture attention in high-traffic environments. From sprawling exhibition stalls to dynamic vehicle graphics, our large-format prints deliver bold, vibrant imagery. We understand the critical nature of event deadlines and offer agile production alongside expert on-site installation and dismantling services. Our solutions are engineered for both temporary visual impact and long-term outdoor durability.',
    items: [
      'Canopies',
      'Gazebos',
      'Vehicle Branding',
      'Exhibition Branding',
      'Arch Gates',
    ],
    machines: [
      'Avery Dennison App Cutter & Vinyl Lamination Tables',
      'High-Speed Wide-Format Solvent/Eco-Solvent Printers',
      'Heavy-Duty Eyeleting & Hemming Operations',
    ],
    applications: [
      'Trade Shows & Exhibitions',
      'Product Launches',
      'Fleet Branding',
      'Outdoor Activations',
      'Sports Events',
      'Conferences',
    ],
    industries: [
      'Events & Management',
      'Automotive',
      'FMCG',
      'Real Estate',
      'Sports & Entertainment',
      'Tourism',
    ],
    seo: {
      title: 'Event Branding & Exhibition Solutions | MRPrint World',
      description:
        'Impactful large-format event branding, exhibition stalls, vehicle graphics, and outdoor activations designed to maximize your visibility.',
    },
  },
  {
    id: 'laser-cutting',
    slug: 'laser-cutting',
    title: 'Laser Cutting Services',
    icon: 'laser',
    image: 'https://proarcindia.com/images/laser-cutting.jpg',
    summary:
      'Precision laser cutting of acrylic, MDF, wood, paper, and fabric for flawless signage, intricate art, and custom packaging.',
    description:
      'Our precision laser cutting services provide immaculate detailing and clean edges across a diverse range of non-metallic materials. We transform acrylic, MDF, wood, and even delicate paper or fabric into complex shapes and intricate patterns with exacting accuracy. This technology allows for rapid prototyping and seamless scalability for production runs. Ideal for creating custom signage components, decorative screens, bespoke packaging, and unique artistic installations.',
    items: [
      'Acrylic Cutting',
      'MDF & Wood Cutting',
      'Paper & Cardboard Profiling',
      'Fabric & Leather Cutting',
      'Custom Stencils',
      'Signage Components',
    ],
    machines: [
      '130W CO2 Laser Cutting & Engraving Machine (Acrylic/Wood)',
      'Fiber Laser Metal Sheet Cutter (1000W Precision Source)',
      'Rotary Attachment for Laser Engraving Cylindrical Objects',
    ],
    applications: [
      'Signage Letters',
      'Decorative Panels',
      'Architectural Models',
      'Custom Packaging',
      'Stencils & Templates',
      'Craft Components',
    ],
    industries: [
      'Signage & Display',
      'Interior Design',
      'Packaging',
      'Fashion & Apparel',
      'Arts & Crafts',
      'Architecture',
    ],
    seo: {
      title: 'Precision Laser Cutting Services | MRPrint World',
      description:
        'Expert laser cutting for acrylic, MDF, wood, and paper. Delivering precise, clean cuts for custom signage, crafts, and architectural projects.',
    },
  },
  {
    id: 'cnc-cutting',
    slug: 'cnc-cutting',
    title: 'CNC Cutting & Carving',
    icon: 'cnc',
    image: 'https://m.media-amazon.com/images/I/71EAspWgE1L._SL1329_.jpg',
    summary:
      'Advanced 2D cutting and 3D carving via CNC routing for wood, acrylic, MDF, PVC, and foam.',
    description:
      'We harness advanced CNC routing technology to deliver robust 2D cutting and elaborate 3D carving solutions. Our capabilities extend across dense and rigid materials such as solid wood, MDF, PVC, acrylic, and foam boards. This process is essential for creating high-relief textures, structural signage backing, and custom decorative panels with remarkable consistency. Our CNC services bridge the gap between digital design and tactile, three-dimensional forms.',
    items: [
      '2D Profile Cutting',
      '3D Relief Carving',
      'Wood Engraving',
      'MDF Jaali Cutting',
      'PVC & Foam Shaping',
      'Custom Molds & Patterns',
    ],
    machines: [
      '3-Axis Heavy-Duty Wood/MDF/ACP CNC Router Table',
      'High-Definition CNC Plasma Metal Plate Cutting Machine',
      'Precision Vacuum Bed Substrate Clamping System',
    ],
    applications: [
      'Decorative Jaali Panels',
      '3D Signage',
      'Furniture Components',
      'Textured Wall Cladding',
      'Industrial Molds',
      'Exhibition Props',
    ],
    industries: [
      'Interior Design',
      'Furniture Manufacturing',
      'Signage',
      'Architecture',
      'Events & Exhibitions',
      'Industrial Tooling',
    ],
    seo: {
      title: 'CNC Cutting & 3D Carving Services | MRPrint World',
      description:
        'Professional CNC routing, 2D cutting, and 3D carving on wood, MDF, acrylic, and PVC for intricate signage and interior decor.',
    },
  },
  {
    id: 'metal-marking',
    slug: 'metal-marking',
    title: 'Metal Marking Solutions',
    icon: 'metal-mark',
    image: 'https://cpimg.tistatic.com/07059702/b/4/Metal-Marking-Engraving-Service.jpg',
    summary:
      'Permanent, high-contrast laser marking and engraving on metals for industrial tags, corporate awards, and tools.',
    description:
      'Our metal marking solutions utilize specialized fiber lasers to create permanent, high-contrast designs on a wide spectrum of metals. This precise, non-contact process etches barcodes, serial numbers, logos, and intricate graphics onto steel, aluminum, brass, and coated metals. The resulting marks are highly resistant to wear, chemicals, and extreme temperatures, making them ideal for industrial traceability. We also apply this technology to produce elegant metal nameplates, premium tools, and bespoke corporate awards.',
    items: [
      'Industrial Tags & Plates',
      'Serial & Barcode Marking',
      'Metal Nameplates',
      'Tool & Part Engraving',
      'Corporate Metal Awards',
      'Coated Metal Etching',
    ],
    machines: [
      '50W Fiber Laser Metal Marking System (High-speed engraving)',
      'Pneumatic Dot Peen Marking Machine',
      'Electrochemical Etching & Stenciling Stations',
    ],
    applications: [
      'Asset Tracking',
      'Product Identification',
      'Compliance Labeling',
      'Personalized Awards',
      'Medical Device Marking',
      'Branded Tools',
    ],
    industries: [
      'Manufacturing',
      'Automotive',
      'Aerospace',
      'Healthcare',
      'Corporate Gifting',
      'Electronics',
    ],
    seo: {
      title: 'Laser Metal Marking & Engraving | MRPrint World',
      description:
        'Permanent laser marking and engraving on metals. High-contrast solutions for industrial tags, nameplates, tools, and awards.',
    },
  },
  {
    id: 'uv-printing',
    slug: 'uv-printing',
    title: 'Flatbed UV Printing',
    icon: 'uv-print',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/4/409580617/BD/AL/KM/6947069/uv-digital-flatbed-roll-to-roll-printing-machine-500x500.png',
    summary:
      'Direct-to-substrate UV printing on rigid materials like acrylic, wood, glass, metal, and PVC for vibrant, durable graphics.',
    description:
      'Flatbed UV printing revolutionizes how graphics are applied, allowing direct printing onto virtually any flat, rigid substrate. Our state-of-the-art UV printers cure ink instantly using ultraviolet light, resulting in vibrant, scratch-resistant, and weather-proof images. We can print on acrylic, glass, wood, metal, ceramics, and PVC with stunning photographic quality. This versatile technology is perfect for custom promotional items, architectural finishes, and bespoke personalized gifts.',
    items: [
      'Direct Glass & Acrylic Printing',
      'Wood & Metal Graphics',
      'Custom Phone Cases',
      'Personalized Gifts',
      'Textured / Embossed Printing',
      'Signage Boards',
    ],
    machines: [
      'Mimaki JFX200-2513 EX (Large Flatbed UV LED Printer)',
      'Dual LED UV Curing System (Instant dry & scratch-resistant)',
      'Bespoke Cylinder Printing Rotary Attachment',
    ],
    applications: [
      'Architectural Glass',
      'Custom Trophies',
      'Promotional Merchandise',
      'Interior Wall Panels',
      'Retail Displays',
      'Personalized Accessories',
    ],
    industries: [
      'Retail',
      'Interior Design',
      'Corporate Gifting',
      'Signage',
      'Architecture',
      'Consumer Goods',
    ],
    seo: {
      title: 'Direct Flatbed UV Printing Services | MRPrint World',
      description:
        'Vibrant, durable UV printing directly onto acrylic, glass, wood, and metal. Ideal for custom signs, gifts, and architectural graphics.',
    },
  },
  {
    id: 'diy-craft',
    slug: 'diy-craft-manufacturing',
    title: 'DIY Craft Manufacturing',
    icon: 'craft',
    image: 'https://protomont.com/wp-content/uploads/2026/07/2-500x500.png',
    summary:
      'Custom manufacturing of craft supplies, MDF blanks, and laser-cut shapes for hobbyists and craft businesses.',
    description:
      'We cater to the booming creative community by designing and manufacturing high-quality DIY craft supplies and structural blanks. Our production line churns out precision-cut MDF bases, intricate acrylic shapes, and custom stencil designs ready for embellishment. We support craft businesses, educators, and hobbyists with bulk manufacturing or customized small-batch orders. From pre-assembled kits to raw materials, we provide the foundation for your creative endeavors.',
    items: [
      'MDF Craft Blanks',
      'Acrylic Bases & Shapes',
      'Custom Stencils',
      'DIY Assembly Kits',
      'Wooden Cutouts',
      'Engraved Craft Elements',
    ],
    machines: [
      'High-Speed Laser Cutter Array for MDF Blanks & Shapes',
      'Hydraulic Die-Cutting & Embossing Presses',
      'Industrial MDF Surface Sanding & Dust Extraction Plant',
    ],
    applications: [
      'Resin Art Bases',
      'Decoupage Supplies',
      'Educational Craft Kits',
      'Home Decor DIY',
      'Scrapbooking Elements',
      'Custom Workshop Materials',
    ],
    industries: [
      'Arts & Crafts Retailers',
      'Education',
      'Hobbyists',
      'Event Planners',
      'E-commerce',
      'Creative Workshops',
    ],
    seo: {
      title: 'DIY Craft Supplies & MDF Blanks Manufacturer | MRPrint World',
      description:
        'Wholesale and custom manufacturing of MDF craft blanks, acrylic shapes, and DIY kits for craft businesses and hobbyists.',
    },
  },
  {
    id: 'acrylic-creations',
    slug: 'acrylic-creations',
    title: 'Unique Acrylic Creations',
    icon: 'acrylic',
    image: 'https://5.imimg.com/data5/SELLER/Default/2025/7/529451202/OT/OJ/EE/98937243/uv-acrylic-printing-service-500x500.jpg',
    summary:
      'Bespoke acrylic products including LED signs, premium trophies, displays, and personalized photo frames.',
    description:
      'Acrylic is a modern, versatile material that we transform into striking, premium products. We design and fabricate custom acrylic creations ranging from sophisticated illuminated LED signs and edge-lit displays to elegant corporate trophies and awards. Our capabilities include bending, polishing, and seamless joining to create pristine product displays, name plates, and personalized photo frames. The inherent clarity and durability of acrylic make these products stand out in any retail or corporate setting.',
    items: [
      'LED Acrylic Signs',
      'Custom Trophies & Awards',
      'Product Display Stands',
      'Table Tops & Desk Accessories',
      'Name Plates',
      'Photo Frames',
    ],
    machines: [
      'Diamond-Edge Acrylic Sheet Polishing Machine',
      'Pneumatic Hot-Wire Acrylic Strip Bending Tables',
      'Precision Vacuum Acrylic Thermoforming Station',
    ],
    applications: [
      'Point of Purchase Displays',
      'Corporate Recognition',
      'Office Decor',
      'Exhibition Showcases',
      'Retail Merchandising',
      'Personalized Gifting',
    ],
    industries: [
      'Retail Merchandising',
      'Corporate',
      'Events & Awards',
      'Hospitality',
      'Interior Design',
      'Jewelry & Cosmetics',
    ],
    seo: {
      title: 'Custom Acrylic Displays, Signs & Trophies | MRPrint World',
      description:
        'Design and fabrication of premium acrylic creations. Custom LED signs, trophies, display stands, and name plates.',
    },
  },
  {
    id: 'interior-solutions',
    slug: 'interior-solutions',
    title: 'Interior Design Solutions',
    icon: 'interior',
    image: 'https://officebanao.com/wp-content/uploads/2024/06/room-with-sign-that-says-m-it-1024x701.jpg',
    summary:
      'Customized interior branding, decorative wall panels, 3D art, and reception aesthetics for offices and commercial spaces.',
    description:
      'We transform commercial environments through customized interior design and branding solutions. Our expertise encompasses the creation of decorative wall panels, acoustic baffles, bespoke 3D wall art, and impactful reception area branding. By blending various materials and manufacturing techniques—such as CNC routing, UV printing, and specialized fabrication—we deliver cohesive interior aesthetics. We collaborate closely with architects and interior designers to bring their visions to life, enhancing spatial identity and user experience.',
    items: [
      'Custom Wall Panels',
      '3D Wall Art',
      'Reception Branding',
      'Frosted Glass Films',
      'Acoustic Panels',
      'Ceiling Installations',
    ],
    machines: [
      'Wide-Format Wallpaper & Canvas Eco-Solvent Printer',
      'Precision Sliding Table Panel Saw (Wood/Acrylic/Sunboard)',
      'Pneumatic Large-Format Cold Lamination Station',
    ],
    applications: [
      'Corporate Office Makeovers',
      'Retail Store Interiors',
      'Restaurant Decor',
      'Hotel Lobbies',
      'Co-working Spaces',
      'Clinic Waiting Areas',
    ],
    industries: [
      'Architecture & Design',
      'Corporate Real Estate',
      'Hospitality',
      'Healthcare',
      'Retail',
      'Education',
    ],
    seo: {
      title: 'Custom Interior Branding & Decor Solutions | MRPrint World',
      description:
        'Elevate your commercial space with custom interior solutions. Decorative wall panels, 3D art, and reception branding for modern offices.',
    },
  },
]

export const servicesIntro = {
  eyebrow: 'What we do',
  title: 'One ecosystem. Every branding surface.',
  body: 'Most brands stitch together a printer, a signage vendor, a fabricator, and specialized craftsmen. MRPrint World Pvt. Ltd. replaces that fragmented supply chain with a single, accountable partner. From expansive large-format prints and intricate CNC routing to bespoke acrylic creations and DIY craft manufacturing, we design, manufacture, finish, and install everything under one roof.',
}
