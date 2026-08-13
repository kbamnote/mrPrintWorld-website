export const productCategories = [
  'Business Branding',
  'Corporate Gifts',
  'Acrylic Products',
  'Signage & Boards',
  'Printing Products',
  'Promotional Products',
  'Custom Products',
  'Laser-Cut Products',
  'CNC Products',
  'UV Printed Products',
  'Interior & Decor'
];

export const products = [
  // Business Branding
  {
    id: 'premium-business-cards',
    name: 'Premium Business Cards',
    slug: 'premium-business-cards',
    category: 'Business Branding',
    shortDescription: 'High-quality, professional business cards that leave a lasting impression.',
    description: 'Elevate your professional image with our premium business cards. Available in a variety of finishes including matte, gloss, and velvet touch, these cards are designed to showcase your brand identity with clarity and elegance.',
    image: 'https://www.redpixels.in/wp-content/uploads/2024/05/Redpixel-Premium-Business-Card-Foil-900x600px-03.jpg',
    specifications: ['300-350 GSM Paper', 'Standard Size: 90x50 mm', 'Die-cut options available'],
    applications: ['Networking', 'Client Meetings', 'Brand Introduction'],
    customization: ['Foil Stamping', 'Spot UV', 'Embossing', 'Rounded Corners'],
    materials: ['Art Card', 'Textured Paper', 'Recycled Paper'],
    sizes: ['90x50 mm', '90x55 mm', 'Custom Sizes'],
    moq: '100 pieces',
    featured: true,
    seo: {
      title: 'Premium Business Cards | MR Print World',
      description: 'Order high-quality custom business cards with various finishes and premium paper stocks in Nagpur.'
    }
  },
  {
    id: 'corporate-letterheads',
    name: 'Corporate Letterheads',
    slug: 'corporate-letterheads',
    category: 'Business Branding',
    shortDescription: 'Professionally printed letterheads for all your official business correspondence.',
    description: 'Maintain a consistent and professional brand image with our custom printed letterheads. Ideal for official communications, invoices, and proposals, our letterheads are printed on premium bond paper for a smooth writing experience.',
    image: 'https://files.inkmonk.com/site/20220325_141233997811_421ab1_Bond.jpg',
    specifications: ['100-120 GSM Executive Bond', 'A4 Size', 'Offset and Digital Printing'],
    applications: ['Official Letters', 'Invoices', 'Quotations', 'Contracts'],
    customization: ['Watermark placement', 'Foil accents', 'Full color printing'],
    materials: ['Executive Bond Paper', 'Alabaster Paper', 'Recycled Paper'],
    sizes: ['A4 (210 x 297 mm)'],
    moq: '100 pieces',
    featured: false,
    seo: {
      title: 'Corporate Letterheads | MR Print World',
      description: 'Professional custom letterhead printing services on premium bond paper for businesses.'
    }
  },
  {
    id: 'business-brochures',
    name: 'Marketing Brochures',
    slug: 'marketing-brochures',
    category: 'Business Branding',
    shortDescription: 'Engaging, full-color brochures to showcase your products and services.',
    description: 'Effectively communicate your brand story and offerings with our high-quality marketing brochures. Available in bi-fold, tri-fold, and custom folding options, they are perfect for trade shows, mailers, and sales presentations.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtEQWRROaf7CWRtueUhSc1-9LzhuhPiQgghT_bcguRBDm49B756hFHxsfh&s=10',
    specifications: ['130-300 GSM Art Paper', 'Various folding options', 'High-resolution printing'],
    applications: ['Trade Shows', 'Sales Meetings', 'Direct Mail', 'In-store Displays'],
    customization: ['Custom folds', 'Lamination (Matte/Gloss)', 'Spot UV'],
    materials: ['Art Paper', 'Art Board', 'Specialty Paper'],
    sizes: ['A4', 'A5', 'DL', 'Custom Sizes'],
    moq: '100 pieces',
    featured: true,
    seo: {
      title: 'Marketing Brochures & Flyers | MR Print World',
      description: 'Custom brochure printing with bi-fold, tri-fold, and multiple finish options.'
    }
  },
  {
    id: 'custom-printed-envelopes',
    name: 'Custom Printed Envelopes',
    slug: 'custom-printed-envelopes',
    category: 'Business Branding',
    shortDescription: 'Professional branded envelopes in various sizes for business correspondence.',
    description: 'Complete your corporate stationery suite with custom printed envelopes. Whether for mailing invoices, sending promotional materials, or general correspondence, our high-quality envelopes ensure your brand is recognized before the mail is even opened.',
    image: 'https://printwala.com/wp-content/uploads/2020/03/EN2.png',
    specifications: ['Available with or without windows', 'Peel and seal options', 'High-quality offset printing'],
    applications: ['Business Mailing', 'Invoices', 'Direct Mail Campaigns'],
    customization: ['Size', 'Paper type', 'Inside security tint'],
    materials: ['Maplitho Paper', 'Executive Bond', 'Kraft Paper'],
    sizes: ['DL (9x4 inch)', 'C5 (9x6 inch)', 'A4 (12x10 inch)'],
    moq: '500 pieces',
    featured: false,
    seo: {
      title: 'Custom Printed Envelopes | MR Print World',
      description: 'Professional custom envelope printing for business stationery in multiple sizes.'
    }
  },
  
  // Corporate Gifts
  {
    id: 'acrylic-corporate-mementos',
    name: 'Acrylic Corporate Mementos',
    slug: 'acrylic-corporate-mementos',
    category: 'Corporate Gifts',
    shortDescription: 'Elegant acrylic mementos and trophies for awards and recognitions.',
    description: 'Honor achievements and celebrate milestones with our custom-designed acrylic mementos. Combining crystal-clear acrylic with advanced laser engraving and UV printing, these awards offer a sophisticated and modern look.',
    image: 'https://creatorstrophies.shop/cdn/shop/files/Acrylic_memento_with_logo_printing_for_corporate_gift.jpg?v=1774031622&width=500',
    specifications: ['Premium Cast Acrylic', 'Precision Laser Cut', 'High-definition UV Print'],
    applications: ['Employee Recognition', 'Corporate Events', 'Sports Tournaments'],
    customization: ['Shape and Size', 'Base material (Wood/Metal)', 'Engraving/Color Print'],
    materials: ['Clear Acrylic', 'Colored Acrylic', 'Wooden Accents'],
    sizes: ['Custom Sizes Available'],
    moq: '10 pieces',
    featured: true,
    seo: {
      title: 'Custom Acrylic Mementos & Trophies | MR Print World',
      description: 'Design and order personalized acrylic mementos and corporate awards in Nagpur.'
    }
  },
  {
    id: 'premium-gift-sets',
    name: 'Premium Corporate Gift Sets',
    slug: 'premium-corporate-gift-sets',
    category: 'Corporate Gifts',
    shortDescription: 'Curated corporate gift sets featuring customized essentials.',
    description: 'Impress clients and reward employees with our thoughtfully curated premium gift sets. These sets typically include a personalized diary, pen, keychain, and a thermos, all branded with your company logo.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWS158cmQdIJLyGvmKNCGHumcgpo-aof0GQI_u1xfjbmnMLsKCw4I743Td&s=10',
    specifications: ['High-quality components', 'Elegant packaging box', 'Consistent branding across items'],
    applications: ['Diwali Gifts', 'New Year Gifts', 'Client Onboarding', 'Employee Kits'],
    customization: ['Item selection', 'Logo engraving/printing', 'Custom box design'],
    materials: ['Leatherette', 'Metal', 'Premium Cardboard Box'],
    sizes: null,
    moq: '25 sets',
    featured: false,
    seo: {
      title: 'Premium Corporate Gift Sets | MR Print World',
      description: 'Customized corporate gifting solutions and personalized executive gift sets.'
    }
  },

  // Acrylic Products
  {
    id: 'acrylic-led-nameplates',
    name: 'Acrylic LED Name Plates',
    slug: 'acrylic-led-nameplates',
    category: 'Acrylic Products',
    shortDescription: 'Illuminated acrylic name plates for homes and offices.',
    description: 'Enhance your entrance with our elegant acrylic LED name plates. Featuring energy-efficient LED lighting and precision-cut lettering, these name plates provide excellent visibility day and night while adding a touch of modern sophistication.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpu8U66MYbLsl8P4p-wdsXS91aLvFqPipWUSAqIwcfHxbljgeiomlkxFE&s=10',
    specifications: ['Weather-resistant acrylic', 'Energy-efficient 12V LEDs', 'Concealed wiring'],
    applications: ['Home Entrances', 'Office Doors', 'Cabin Name Plates'],
    customization: ['Font styles', 'LED color (Warm White, Cool White, Blue)', 'Size and Shape'],
    materials: ['Black/Clear Acrylic', 'LED Strips', 'Metal Standoffs'],
    sizes: ['12x8 inches', '18x12 inches', 'Custom Sizes'],
    moq: '1 piece',
    featured: true,
    seo: {
      title: 'Acrylic LED Name Plates | MR Print World',
      description: 'Custom illuminated acrylic name plates for homes and offices with premium finish.'
    }
  },
  {
    id: 'acrylic-table-tops',
    name: 'Acrylic Table Tops & Organizers',
    slug: 'acrylic-table-tops',
    category: 'Acrylic Products',
    shortDescription: 'Sleek and functional acrylic organizers for desks and retail counters.',
    description: 'Keep your workspace organized and professional with our clear acrylic table tops and organizers. From brochure holders to multi-compartment stationery stands, we manufacture durable and transparent solutions for various needs.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvmudxcPPNzKDeKdQQJ7XCz6GEnxW1-CwzrQ1AIpyCIGDuvmf0UASmcHgT&s=10',
    specifications: ['3mm - 5mm thickness', 'Seamless joints', 'Polished edges'],
    applications: ['Office Desks', 'Retail Counters', 'Exhibition Stalls'],
    customization: ['Compartment sizes', 'Brand logo engraving', 'Tinted acrylic options'],
    materials: ['Clear Cast Acrylic', 'Frosted Acrylic'],
    sizes: ['Custom as per requirement'],
    moq: '10 pieces',
    featured: false,
    seo: {
      title: 'Acrylic Organizers & Table Tops | MR Print World',
      description: 'Custom clear acrylic table top displays, brochure holders, and desk organizers.'
    }
  },

  // Signage & Boards
  {
    id: 'glow-sign-boards',
    name: 'Glow Sign Boards',
    slug: 'glow-sign-boards',
    category: 'Signage & Boards',
    shortDescription: 'High-visibility backlit sign boards for retail shops and businesses.',
    description: 'Ensure your business stands out, day or night, with our durable glow sign boards. Built with robust frames, high-quality translucent flex or acrylic, and bright internal lighting, these signs offer an excellent return on investment for storefront visibility.',
    image: 'https://www.arcprint.in/category/wp-content/uploads/2024/05/2-13.jpg',
    specifications: ['MS/Aluminum Box Frame', 'High-quality Flex/Polycarbonate face', 'LED Tube/Module lighting'],
    applications: ['Retail Storefronts', 'Restaurants', 'Clinics', 'Commercial Buildings'],
    customization: ['Graphics and Design', 'Dimensions', 'Lighting options'],
    materials: ['Backlit Flex', 'Polycarbonate Sheet', 'Metal Frame', 'LEDs'],
    sizes: ['Custom Sizes Available'],
    moq: '1 piece',
    featured: true,
    seo: {
      title: 'Glow Sign Boards & Backlit Signage | MR Print World',
      description: 'High-quality glow sign boards and backlit storefront signage for businesses in Nagpur.'
    }
  },
  {
    id: 'acp-led-sign-boards',
    name: 'ACP LED 3D Sign Boards',
    slug: 'acp-led-sign-boards',
    category: 'Signage & Boards',
    shortDescription: 'Premium 3D letter sign boards on ACP backing for a sophisticated look.',
    description: 'Make a powerful brand statement with our ACP (Aluminum Composite Panel) sign boards featuring 3D LED letters. Combining the sleek finish of ACP with glowing, raised letters, this signage provides a premium, contemporary aesthetic for modern businesses.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/2/388490955/UT/RB/QS/31817474/acp-led-signage-board.jpg',
    specifications: ['3mm ACP Sheet Backing', 'Acrylic 3D Letters', 'Waterproof LED Modules'],
    applications: ['Corporate Offices', 'Malls', 'Showrooms', 'Premium Retail Outlets'],
    customization: ['ACP Color/Texture', 'Letter Style', 'Front-lit or Back-lit letters'],
    materials: ['ACP (Aluminum Composite Panel)', 'Acrylic', 'Metal Frame', 'LEDs'],
    sizes: ['Custom Sizes Available'],
    moq: '1 piece',
    featured: true,
    seo: {
      title: 'ACP Sign Boards with 3D LED Letters | MR Print World',
      description: 'Premium ACP sign boards and 3D acrylic LED signage manufacturing in Nagpur.'
    }
  },
  {
    id: 'dealer-boards',
    name: 'Dealer Boards & Flanges',
    slug: 'dealer-boards',
    category: 'Signage & Boards',
    shortDescription: 'Standardized branding boards for dealer networks and franchises.',
    description: 'Maintain brand consistency across your entire distribution network with our mass-produced dealer boards. Designed for durability and easy installation, these boards are perfect for brand visibility at retail partner locations.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqUzQsdCQLokH91dPLdmKfH8C3Fqm0EH2Zj8yZo5LFHAmL6JZQWjWBuUNI&s=10',
    specifications: ['Sunboard / Flex / Tin options', 'Weather-resistant prints', 'Standardized sizing'],
    applications: ['Dealer Shops', 'Franchise Outlets', 'Distributor Networks'],
    customization: ['Dealer name integration', 'Mounting options', 'Material selection'],
    materials: ['Flex on MS Frame', 'Printed Sunboard', 'Powder-coated Tin'],
    sizes: ['Standardized Custom Sizes (e.g., 6x3 ft, 8x3 ft)'],
    moq: '10 pieces',
    featured: false,
    seo: {
      title: 'Dealer Boards & Franchise Signage | MR Print World',
      description: 'Bulk manufacturing of dealer boards, shop signs, and flanges for brand networks.'
    }
  },
  {
    id: 'led-clip-on-frames',
    name: 'LED Clip-On Frames',
    slug: 'led-clip-on-frames',
    category: 'Signage & Boards',
    shortDescription: 'Slim, edge-lit display frames with easy poster changing mechanism.',
    description: 'Showcase your promotional posters and menus brilliantly with our ultra-slim LED clip-on frames. Featuring a convenient snap-open frame design, changing graphics takes seconds, making it ideal for environments where promotions change frequently.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc4x9mRt1-EeYO53O7vHIpiSM-n9EB6xRAqB-Q5GtNskOfqb91lPsYjpqk&s=10',
    specifications: ['Ultra-slim profile (under 20mm)', 'Edge-lit LED technology', 'Snap-open aluminum frame'],
    applications: ['Restaurant Menus', 'Retail Promotions', 'Movie Posters', 'Elevator Advertising'],
    customization: ['Frame color (Silver/Black)', 'Size'],
    materials: ['Aluminum Profile', 'Acrylic LGP (Light Guide Panel)', 'LEDs'],
    sizes: ['A4', 'A3', 'A2', 'A1', 'Custom Sizes'],
    moq: '1 piece',
    featured: false,
    seo: {
      title: 'LED Clip-On Frames & Slim Light Boxes | MR Print World',
      description: 'Slim LED clip-on frames and edge-lit snap frames for easy poster displays.'
    }
  },

  // Printing Products
  {
    id: 'flex-banners',
    name: 'Flex Banners & Hoardings',
    slug: 'flex-banners',
    category: 'Printing Products',
    shortDescription: 'Large-format flex printing for impactful outdoor advertising.',
    description: 'Maximize your reach with our high-resolution flex banners and hoardings. Printed on durable, weather-resistant materials with vibrant, fade-resistant inks, they are ideal for short-term promotions, events, and long-term outdoor advertising.',
    image: 'https://d3pyarv4eotqu4.cloudfront.net/tagsenind/images/product/High_Quality_Flex_Banner_low_10283711202404.png',
    specifications: ['Solvent/Eco-solvent printing', 'Various GSM options (240 to 340 GSM)', 'Eyelets and edge folding'],
    applications: ['Outdoor Hoardings', 'Event Backdrops', 'Street Banners', 'Exhibitions'],
    customization: ['Size', 'Print quality (Star/Normal flex)', 'Finishing (Eyelets/Pockets)'],
    materials: ['PVC Flex Material'],
    sizes: ['Custom Sizes (Any dimension)'],
    moq: null,
    featured: false,
    seo: {
      title: 'Flex Banner Printing & Hoardings | MR Print World',
      description: 'High-quality flex banner printing and large format outdoor hoardings.'
    }
  },
  {
    id: 'vinyl-stickers-decals',
    name: 'Vinyl Stickers & Decals',
    slug: 'vinyl-stickers',
    category: 'Printing Products',
    shortDescription: 'Versatile adhesive vinyl prints for branding, vehicles, and interiors.',
    description: 'Transform any smooth surface into a branding opportunity with our high-quality vinyl stickers and decals. Suitable for glass partitions, vehicles, product packaging, and walls, our vinyls offer excellent adhesion and vibrant print quality.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSItRc32ln5TYQaM9CGoJXqyGYujbVnSazD6OMsYdBmrSkhukFVJJdnq1fQ&s=10',
    specifications: ['Self-adhesive PVC vinyl', 'Matte or Gloss finish', 'Precision contour cutting'],
    applications: ['Glass Branding', 'Vehicle Wraps', 'Product Labels', 'Wall Graphics'],
    customization: ['Die-cut shapes', 'Lamination for extra life', 'Clear/Opaque/Frosted options'],
    materials: ['Opaque Vinyl', 'Clear Vinyl', 'Frosted Vinyl', 'One-way Vision'],
    sizes: ['Custom Sizes'],
    moq: null,
    featured: true,
    seo: {
      title: 'Custom Vinyl Stickers & Glass Branding | MR Print World',
      description: 'High-resolution vinyl printing, die-cut decals, and frosted film for office glass.'
    }
  },

  // Promotional Products
  {
    id: 'rollup-standees',
    name: 'Roll-up Standees',
    slug: 'rollup-standees',
    category: 'Promotional Products',
    shortDescription: 'Portable and retractable banners for instant displays.',
    description: 'Set up your promotional display in seconds with our premium roll-up standees. Featuring a sturdy aluminum base and high-quality printed media that resists curling, these standees are perfect for events, exhibitions, and retail spaces.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVuHwWjzmcrasnPBqBi2zk-ejtTQ5AnG3Qwsku9DsNZqR0p1cICWWybkA&s=10',
    specifications: ['Aluminum retractable base', 'Non-tearable media or Star Flex', 'Includes carry bag'],
    applications: ['Exhibitions', 'Conferences', 'Retail Entrances', 'Product Launches'],
    customization: ['Media type', 'Base quality (Standard/Premium)'],
    materials: ['Aluminum Frame', 'PP Non-Tearable Film / Star Flex'],
    sizes: ['2x6 ft', '2.5x6 ft', '3x6 ft'],
    moq: '1 piece',
    featured: true,
    seo: {
      title: 'Roll-up Standees & Portable Displays | MR Print World',
      description: 'High-quality roll-up standees and retractable banner stands for exhibitions.'
    }
  },
  {
    id: 'promotional-canopies',
    name: 'Promotional Canopies & Tents',
    slug: 'promotional-canopies',
    category: 'Promotional Products',
    shortDescription: 'Custom printed demo tents for outdoor marketing and activations.',
    description: 'Create a branded space anywhere with our portable promotional canopies. These easy-to-assemble demo tents feature a strong collapsible frame and waterproof, custom-printed fabric roof and side walls, ideal for outdoor campaigns and product sampling.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS244A7Y-EnAz0bqgz_CZqBXrvYXeWazyx8UDUZqW0Ho3sc9uO1vlhDITA&s=10',
    specifications: ['MS Powder Coated Frame', 'Waterproof Tetron Fabric', 'Fully foldable design'],
    applications: ['Outdoor Activations', 'Flea Markets', 'Campaigns', 'Product Demos'],
    customization: ['Full color printing on roof and valance', 'Optional side walls'],
    materials: ['Metal Frame', 'Tetron/Polyester Fabric'],
    sizes: ['4x4 ft', '6x6 ft', '10x10 ft'],
    moq: '1 piece',
    featured: false,
    seo: {
      title: 'Promotional Canopies & Demo Tents | MR Print World',
      description: 'Custom printed promotional canopies, gazebo tents, and demo setups for outdoor marketing.'
    }
  },
  {
    id: 'promotional-apparel',
    name: 'Corporate T-Shirts & Caps',
    slug: 'promotional-apparel',
    category: 'Promotional Products',
    shortDescription: 'Branded apparel for staff, events, and corporate gifting.',
    description: 'Unify your team and boost brand visibility with our custom printed or embroidered promotional apparel. We offer high-quality t-shirts, polo shirts, and caps customized with your company logo, perfect for events, uniforms, and giveaways.',
    image: 'https://3.imimg.com/data3/KH/TT/MY-18247332/t-shirt-caps-key-chains-photo-frames-printing.jpeg',
    specifications: ['Cotton/Polyester blends', 'Screen print, DTF, or Embroidery', 'Various colors available'],
    applications: ['Corporate Events', 'Staff Uniforms', 'Promotional Giveaways'],
    customization: ['Logo placement', 'Printing method', 'Apparel color and style'],
    materials: ['Cotton', 'Dry-Fit', 'Polyester'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    moq: '50 pieces',
    featured: false,
    seo: {
      title: 'Custom Printed T-Shirts & Corporate Caps | MR Print World',
      description: 'Promotional t-shirt printing and branded corporate apparel in Nagpur.'
    }
  },

  // Custom Products
  {
    id: 'custom-packaging-boxes',
    name: 'Custom Packaging Boxes',
    slug: 'custom-packaging-boxes',
    category: 'Custom Products',
    shortDescription: 'Tailor-made packaging solutions to elevate your product presentation.',
    description: 'Enhance your product appeal and unboxing experience with our custom packaging boxes. From sturdy corrugated mailer boxes to premium rigid boxes for luxury items, we design and manufacture packaging that reflects your brands quality.',
    image: 'https://printo-s3.dietpixels.net/site/2024/Sameday%20delivery/12_1727350889.jpg?quality=70&format=webp&w=1920',
    specifications: ['Custom dimensions', 'Various structural designs', 'High-quality offset printing'],
    applications: ['E-commerce Shipping', 'Retail Products', 'Luxury Gifting', 'Food Packaging'],
    customization: ['Material thickness', 'Finishes (Foiling, UV)', 'Die-cut windows', 'Inserts'],
    materials: ['Corrugated Board', 'SBS Board', 'Kappa Board (Rigid)', 'Kraft Paper'],
    sizes: ['Fully Custom Dimensions'],
    moq: '500 pieces',
    featured: true,
    seo: {
      title: 'Custom Packaging Boxes & Printed Cartons | MR Print World',
      description: 'Custom product packaging, printed corrugated boxes, and premium rigid boxes.'
    }
  },

  // Laser-Cut Products
  {
    id: 'laser-cut-mdf-art',
    name: 'Laser-Cut MDF Wall Art',
    slug: 'laser-cut-mdf-art',
    category: 'Laser-Cut Products',
    shortDescription: 'Intricate and decorative MDF panels for interior enhancement.',
    description: 'Add a touch of artistic elegance to any space with our precision laser-cut MDF wall art and jali panels. Our advanced laser technology allows for incredibly detailed patterns, geometric designs, and custom artwork perfect for homes, offices, and restaurants.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2025/11/556727159/EA/WK/WW/250625382/20251101-1908-elegant-mandala-art-panels-simple-compose-01k8zt5j2jenaa8gc48hg7n1f4-500x500.png',
    specifications: ['Intricate precision cutting', 'Smooth, burnt-free edges', 'Ready to paint or polish'],
    applications: ['Wall Decor', 'Room Dividers', 'Ceiling Panels', 'Pooja Room Mandirs'],
    customization: ['Custom patterns/designs', 'Thickness', 'Dimensions'],
    materials: ['MDF (Medium Density Fiberboard)', 'Veneer', 'Plywood'],
    sizes: ['Up to 8x4 ft panels', 'Custom Art Sizes'],
    moq: '1 piece',
    featured: true,
    seo: {
      title: 'Laser Cut MDF Wall Art & Jali Designs | MR Print World',
      description: 'Custom laser cut MDF panels, jali designs, and decorative wall art manufacturing.'
    }
  },
  {
    id: 'laser-engraved-nameplates',
    name: 'Laser Engraved Wooden Nameplates',
    slug: 'laser-engraved-nameplates',
    category: 'Laser-Cut Products',
    shortDescription: 'Classic wooden nameplates with permanent laser engraving.',
    description: 'Welcome guests with the timeless warmth of wood. Our laser-engraved wooden nameplates feature deep, permanent etching of names, designations, and decorative elements on premium wood, finished with a protective coating for durability.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGWWyu18MBOcgcIi69IGkIQGZeskFk4M8sP8f7eEfaC6V08rKutuST8Hzh&s=10',
    specifications: ['Deep engraving', 'Weather-protective clear coat', 'Natural wood grain finish'],
    applications: ['House Entrances', 'Office Cabins', 'Desk Name Plates'],
    customization: ['Wood type', 'Font and border designs', 'Shape and size'],
    materials: ['Teak Wood', 'Pine Wood', 'MDF with Veneer'],
    sizes: ['Custom Sizes'],
    moq: '1 piece',
    featured: false,
    seo: {
      title: 'Laser Engraved Wooden Nameplates | MR Print World',
      description: 'Personalized wooden name plates with custom laser engraving for homes and offices.'
    }
  },

  // CNC Products
  {
    id: 'cnc-router-cut-letters',
    name: 'CNC Cut Solid Letters',
    slug: 'cnc-router-cut-letters',
    category: 'CNC Products',
    shortDescription: 'Thick, dimensional letters cut from solid materials via CNC routing.',
    description: 'Create impactful, non-illuminated 3D signage with our CNC router-cut solid letters. We precision-cut thick materials like MDF, acrylic, and WPC to create substantial, durable lettering suitable for both indoor and outdoor branding applications.',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/427971195/VY/AX/OW/8487645/3-d-letter-cutting-service-500x500.jpg',
    specifications: ['Precise 2D/3D profiling', 'Thickness from 5mm to 30mm+', 'Clean edges'],
    applications: ['Reception Branding', 'Building Exterior Signs', 'Directional Signage'],
    customization: ['Material choice', 'Font style', 'Paint finish (Duco/PU)'],
    materials: ['Solid Acrylic', 'MDF', 'WPC (Wood Plastic Composite)', 'ACP'],
    sizes: ['Custom Heights and Thickness'],
    moq: '1 set',
    featured: true,
    seo: {
      title: 'CNC Cut Solid Letters & 3D Signage | MR Print World',
      description: 'Precision CNC router cut letters in MDF, acrylic, and WPC for corporate signage.'
    }
  },
  {
    id: 'cnc-carved-panels',
    name: '3D CNC Carved Panels',
    slug: 'cnc-carved-panels',
    category: 'CNC Products',
    shortDescription: 'Textured, 3D carved panels for premium interior wall cladding.',
    description: 'Transform flat walls into dynamic visual features with our 3D CNC carved panels. Using advanced multi-axis CNC routers, we create stunning waves, geometric textures, and custom bas-relief designs that add depth and character to architectural spaces.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCFPjIAclCeTpLWN7VQ2i-NNPNL-JFr2XhuVRTcnuk2EZ4aJFqGnLnRct8&s=10',
    specifications: ['Seamless pattern matching', 'Deep 3D carving', 'Sandable and paintable'],
    applications: ['Feature Walls', 'Hotel Lobbies', 'Retail Backgrounds', 'Auditoriums'],
    customization: ['Texture pattern', 'Depth of carve', 'Panel sizing'],
    materials: ['High-Density MDF', 'Solid Wood', 'Corian'],
    sizes: ['Standard 8x4 ft panels', 'Custom dimensions'],
    moq: '1 panel',
    featured: false,
    seo: {
      title: '3D CNC Carved MDF Panels | MR Print World',
      description: 'Custom 3D textured wall panels and CNC carved architectural cladding.'
    }
  },

  // UV Printed Products
  {
    id: 'uv-printed-plaques',
    name: 'UV Printed Commemorative Plaques',
    slug: 'uv-printed-plaques',
    category: 'UV Printed Products',
    shortDescription: 'High-resolution, full-color printed plaques on wood, metal, or acrylic.',
    description: 'Commemorate special events or recognize achievements with our vibrant UV printed plaques. Flatbed UV printing technology allows us to print crisp text, vibrant logos, and even photographic images directly onto hard surfaces with exceptional durability.',
    image: 'https://ids-digital.com/wp-content/uploads/2021/05/Full-color-acrylic-award-UV-printer-768x1024.jpg',
    specifications: ['Direct-to-substrate printing', 'Scratch-resistant UV inks', 'Full CMYK + White printing'],
    applications: ['Awards', 'Inauguration Stones', 'Certificates of Appreciation', 'Memorials'],
    customization: ['Substrate material', 'Full color designs', 'Mounting hardware'],
    materials: ['Wood', 'Acrylic', 'Aluminum', 'Glass'],
    sizes: ['Custom Sizes Available'],
    moq: '1 piece',
    featured: true,
    seo: {
      title: 'UV Printed Plaques & Awards | MR Print World',
      description: 'Direct full-color UV printing on wood, acrylic, and metal for awards and plaques.'
    }
  },
  {
    id: 'uv-printed-promotional-items',
    name: 'UV Printed Corporate Merchandise',
    slug: 'uv-printed-merchandise',
    category: 'UV Printed Products',
    shortDescription: 'Direct full-color printing on diaries, power banks, and keychains.',
    description: 'Elevate your promotional merchandise with direct UV printing. Unlike traditional screen printing, our UV technology allows for full-color, photo-realistic branding directly onto flat and slightly curved items like diaries, tech gadgets, and ID cards.',
    image: 'https://5.imimg.com/data5/FP/WP/LO/SELLER-66737712/uv-printing-on-gift-promotionals-items-500x500.jpg',
    specifications: ['Instant UV curing', 'Textured/Embossed print effects possible', 'High adhesion'],
    applications: ['Corporate Gifting', 'Event Merchandise', 'Employee ID Cards'],
    customization: ['Full color logos', 'Variable data printing (Names/Numbers)'],
    materials: ['Leatherette', 'Plastic', 'Metal', 'PVC'],
    sizes: null,
    moq: '20 pieces',
    featured: false,
    seo: {
      title: 'UV Printed Corporate Merchandise | MR Print World',
      description: 'Full color UV printing on diaries, power banks, pens, and promotional items.'
    }
  },

  // Interior & Decor
  {
    id: 'custom-wall-murals',
    name: 'Custom Wall Murals & Wallpapers',
    slug: 'custom-wall-murals',
    category: 'Interior & Decor',
    shortDescription: 'Personalized, large-scale printed wallpapers for interior transformation.',
    description: 'Redefine your interior spaces with our custom-printed wall murals and wallpapers. Whether you want a sweeping landscape, abstract art, or large-scale corporate branding, we print high-resolution graphics on premium, durable wallpaper materials.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcsW8k33w5tsmrOHPQxGAVW3NskiYs4UoAS9Xd9L8-FkmJifV32wfWjzg&s=10',
    specifications: ['High-resolution eco-solvent/UV print', 'Washable and scratch-resistant options', 'Seamless or panel-based installation'],
    applications: ['Office Interiors', 'Restaurants', 'Home Accent Walls', 'Retail Stores'],
    customization: ['Custom artwork/photos', 'Material texture (Canvas, Sand, Leather finish)'],
    materials: ['Non-Woven Wallpaper', 'Vinyl Wall Covering', 'Canvas Fabric'],
    sizes: ['Custom Wall Dimensions'],
    moq: '100 sq ft',
    featured: true,
    seo: {
      title: 'Custom Printed Wallpapers & Murals | MR Print World',
      description: 'High-quality custom wall murals and textured printed wallpapers for homes and offices.'
    }
  },
  {
    id: 'interior-wayfinding-signage',
    name: 'Interior Wayfinding Signage',
    slug: 'interior-wayfinding-signage',
    category: 'Interior & Decor',
    shortDescription: 'Elegant directional and informational signs for indoor navigation.',
    description: 'Guide visitors seamlessly through your facility with our bespoke interior wayfinding signage. We design and fabricate cohesive sign systems including directory boards, directional arrows, and room identification signs that complement your interior architecture.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd5p6MSx14rVA1PbVJOlm-q5fcCkERoMUzDB0DKGpy_g&s=10',
    specifications: ['Modular or custom designs', 'ADA compliant options', 'Premium finishes'],
    applications: ['Hospitals', 'Corporate Campuses', 'Hotels', 'Educational Institutions'],
    customization: ['Material combinations', 'Iconography', 'Braille inclusion (optional)'],
    materials: ['Acrylic', 'Brushed Aluminum', 'Wood', 'Glass'],
    sizes: ['Various coordinated sizes'],
    moq: 'Project based',
    featured: false,
    seo: {
      title: 'Interior Wayfinding & Directional Signage | MR Print World',
      description: 'Custom interior directional signs, directory boards, and room identification signage.'
    }
  },
  {
    id: 'canvas-photo-prints',
    name: 'Canvas Photo Prints',
    slug: 'canvas-photo-prints',
    category: 'Interior & Decor',
    shortDescription: 'Museum-quality canvas prints wrapped on wooden frames.',
    description: 'Turn your photographs and digital art into stunning wall decor with our premium canvas prints. Printed on high-quality artist canvas and gallery-wrapped over sturdy wooden stretcher bars, these prints add a touch of gallery elegance to any room.',
    image: 'https://cms.cloudinary.vpsvc.com/image/upload/if_ar_gt_1.1/c_scale,t_pdpHeroGallery_Gallery/if_else/c_scale,w_816/if_end/f_auto,q_auto:best,dpr_1.0/India%20LOB/Photo%20Gifts/Canvas%20Prints/IN_Canvas-Prints_Hero-image_01',
    specifications: ['100% Cotton or Poly-cotton canvas', 'Gallery wrap finish', 'UV-protective coating'],
    applications: ['Home Decor', 'Art Exhibitions', 'Office Receptions', 'Gifts'],
    customization: ['Image selection', 'Frame depth', 'Multi-panel splits'],
    materials: ['Artist Canvas', 'Pine Wood Stretcher Bars'],
    sizes: ['8x10 to 40x60 inches', 'Custom Sizes'],
    moq: '1 piece',
    featured: false,
    seo: {
      title: 'Custom Canvas Photo Prints | MR Print World',
      description: 'High-quality canvas printing and gallery wrapped photo prints in Nagpur.'
    }
  }
];

export function getProductsByCategory(category) {
  if (!category) return products;
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(limit = 6) {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}
