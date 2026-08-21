// ---------------------------------------------------------------------------
// FAQ Data – MRPrint World Pvt. Ltd.
// ---------------------------------------------------------------------------

export const faqCategories = [
  'All',
  'General',
  'Ordering',
  'Printing & Production',
  'Custom & Bulk Orders',
  'Delivery & Pickup',
  'Pricing & Payment',
]

export const faqs = [
  // ── General ──────────────────────────────────────────────────────────────
  {
    id: 'what-services',
    category: 'General',
    question: 'What services does MRPrint World offer?',
    answer:
      'We provide a wide range of printing and branding solutions including offset and digital printing, signage, packaging, corporate stationery, promotional materials, and large-format graphics. Whether you need business cards or full-scale event branding, our team is equipped to deliver.',
  },
  {
    id: 'what-materials',
    category: 'General',
    question: 'What materials do you work with?',
    answer:
      'We work with a variety of substrates including paper, vinyl, acrylic, flex, PVC, fabric, corrugated board, and more. The right material depends on your project requirements — our team can recommend the best option for durability, finish, and budget.',
  },
  {
    id: 'visit-facility',
    category: 'General',
    question: 'Can I visit your facility?',
    answer:
      'Absolutely. You are welcome to visit our production facility in Nagpur to discuss your project in person, review material samples, or inspect ongoing work. We recommend calling ahead so we can arrange a guided walkthrough with our team.',
  },
  {
    id: 'design-services',
    category: 'General',
    question: 'Do you offer design services?',
    answer:
      'Yes, we have an in-house design team that can help create or refine artwork for your project. If you already have a design, we will review it for print-readiness and suggest adjustments if needed to ensure the best output quality.',
  },

  // ── Ordering ─────────────────────────────────────────────────────────────
  {
    id: 'how-to-request-quote',
    category: 'Ordering',
    question: 'How do I request a quote?',
    answer:
      'You can request a quote through the contact form on our website, via WhatsApp, by phone, or by visiting us in person. Share your requirements — including quantities, dimensions, and any artwork — and our team will respond with a detailed estimate.',
  },
  {
    id: 'file-formats',
    category: 'Ordering',
    question: 'What file formats do you accept for printing?',
    answer:
      'We accept most standard design formats including PDF, AI, EPS, PSD, CDR, and high-resolution JPEG or PNG files. For the best results, we recommend vector-based formats (AI, EPS, or PDF) with fonts outlined and images at 300 DPI or higher.',
  },
  {
    id: 'track-order',
    category: 'Ordering',
    question: 'How do I track my order?',
    answer:
      'Once your order is confirmed, our team will keep you updated on production milestones via WhatsApp or phone. For larger projects, we can schedule check-in updates at key stages so you always know where things stand.',
  },

  // ── Printing & Production ────────────────────────────────────────────────
  {
    id: 'production-time',
    category: 'Printing & Production',
    question: 'How long does production typically take?',
    answer:
      'Turnaround time varies depending on the type of job, quantity, and materials involved. Simple print jobs may be completed quickly, while complex or large-volume orders require more time. We will provide an estimated timeline when you confirm your order.',
  },
  {
    id: 'quality-assurance',
    category: 'Printing & Production',
    question: 'What is your quality assurance process?',
    answer:
      'Every job goes through multiple checkpoints — from pre-press file verification and colour proofing to in-production inspections and a final quality review before dispatch. Our goal is to ensure consistency, accuracy, and a professional finish on every order.',
  },
  {
    id: 'rush-orders',
    category: 'Printing & Production',
    question: 'Can you handle urgent or rush orders?',
    answer:
      'We do our best to accommodate urgent requests depending on our current production schedule and the complexity of the job. If you have a tight deadline, reach out as early as possible and we will let you know what is feasible.',
  },
  {
    id: 'installation-services',
    category: 'Printing & Production',
    question: 'Do you offer installation services?',
    answer:
      'Yes, for products like signage, wall graphics, vehicle wraps, and event branding, we offer professional installation services. Our team ensures proper placement and finishing so the end result looks exactly as intended.',
  },

  // ── Custom & Bulk Orders ─────────────────────────────────────────────────
  {
    id: 'custom-orders',
    category: 'Custom & Bulk Orders',
    question: 'Do you handle custom or bespoke orders?',
    answer:
      'Custom work is at the heart of what we do. From unique packaging designs and speciality finishes to one-of-a-kind signage, we collaborate closely with you to bring your vision to life. Share your idea and we will figure out the best way to execute it.',
  },
  {
    id: 'minimum-order',
    category: 'Custom & Bulk Orders',
    question: 'What is the minimum order quantity?',
    answer:
      'Minimum order quantities depend on the product and printing method. For digital printing, we can often accommodate smaller runs, while offset printing is more cost-effective at higher volumes. Contact us with your specifics and we will advise accordingly.',
  },
  {
    id: 'bulk-pricing',
    category: 'Custom & Bulk Orders',
    question: 'Do you offer bulk or B2B pricing?',
    answer:
      'Yes, we offer competitive pricing for bulk and recurring orders. Businesses, agencies, and event organisers who work with us regularly can benefit from volume-based pricing. Get in touch to discuss your requirements and we will put together a tailored quote.',
  },
  {
    id: 'samples-before-bulk',
    category: 'Custom & Bulk Orders',
    question: 'Do you offer samples before bulk production?',
    answer:
      'For most products, we can produce a sample or proof for your review and approval before proceeding with the full run. This helps ensure colours, materials, and finishes meet your expectations and reduces the risk of any surprises.',
  },

  // ── Delivery & Pickup ────────────────────────────────────────────────────
  {
    id: 'delivery-outside-nagpur',
    category: 'Delivery & Pickup',
    question: 'Do you deliver outside Nagpur?',
    answer:
      'Yes, we can arrange delivery to locations outside Nagpur through trusted courier and logistics partners. Shipping charges and transit times will vary based on destination and order size — we will provide details when you place your order.',
  },
  {
    id: 'pickup-option',
    category: 'Delivery & Pickup',
    question: 'Can I pick up my order from your facility?',
    answer:
      'Of course. Many of our clients prefer to collect their orders directly from our Nagpur facility. We will notify you as soon as your order is ready for pickup, and our team will ensure it is securely packaged for safe transport.',
  },

  // ── Pricing & Payment ────────────────────────────────────────────────────
  {
    id: 'payment-methods',
    category: 'Pricing & Payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept payments via bank transfer (NEFT/RTGS/IMPS), UPI, and cash. For larger orders, we typically work with an advance payment followed by balance upon completion. Specific terms are discussed when your order is confirmed.',
  },
  {
    id: 'return-exchange-policy',
    category: 'Pricing & Payment',
    question: 'What is your return or exchange policy?',
    answer:
      'Because most of our products are custom-made, standard returns are not applicable. However, if there is a genuine quality issue or discrepancy from the approved proof, we will work with you to resolve it promptly — whether through a reprint or other appropriate solution.',
  },
]
