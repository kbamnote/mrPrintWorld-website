/**
 * Legal page content — Privacy Policy, Terms & Conditions,
 * Refund & Cancellation Policy, and Shipping & Delivery Policy.
 *
 * All text is written for MRPrint World Pvt. Ltd., a printing and branding
 * business in Nagpur, Maharashtra, India. Contact details reference
 * the centralised `company` object from company.js.
 */

import { company } from './company'

/* ------------------------------------------------------------------ */
/*  1. Privacy Policy                                                  */
/* ------------------------------------------------------------------ */

export const privacyPolicy = {
  title: 'Privacy Policy',
  lastUpdated: '2026-08-13',
  sections: [
    {
      heading: 'Information We Collect',
      content:
        `When you interact with ${company.name} — whether through our website contact forms, WhatsApp, email or in-person meetings — we may collect personal information such as your name, phone number, email address, company or organisation name, and details related to your project requirements. We may also automatically collect non-personal usage data such as browser type, device information, pages visited and time spent on our website for analytics purposes.`,
    },
    {
      heading: 'How We Use Your Information',
      content:
        `We use the information we collect to respond to your enquiries and provide accurate quotations, process and fulfil your orders, communicate production updates, delivery timelines and invoices, improve our website, services and customer experience, and send relevant updates about our offerings where you have opted in or where permitted by applicable law. We do not use your information for any purpose unrelated to the services you have engaged us for.`,
    },
    {
      heading: 'Information Sharing',
      content:
        `${company.name} does not sell, rent or trade your personal information to any third party. We may share limited information with trusted service providers — such as courier and logistics partners, payment processors or IT service vendors — strictly to the extent necessary to fulfil your order or maintain our operations. All such partners are expected to handle your data in accordance with applicable data protection standards.`,
    },
    {
      heading: 'Data Security',
      content:
        'We implement reasonable administrative, technical and physical safeguards to protect your personal information from unauthorised access, alteration, disclosure or destruction. However, no method of electronic storage or transmission over the internet is entirely secure, and we cannot guarantee absolute security.',
    },
    {
      heading: 'Cookies',
      content:
        'Our website may use minimal cookies or similar technologies for essential site functionality and, if enabled, anonymous analytics to understand how visitors use our pages. We do not use cookies for targeted advertising. You can manage cookie preferences through your browser settings at any time.',
    },
    {
      heading: 'Your Rights',
      content:
        `You have the right to request access to, correction of, or deletion of any personal information we hold about you. To exercise any of these rights, please write to us at ${company.email}. We will respond to your request within a reasonable timeframe and in accordance with applicable law.`,
    },
    {
      heading: 'Contact Us',
      content:
        `If you have any questions or concerns about this Privacy Policy or our data practices, you may reach us at ${company.email} or call us at ${company.phoneDisplay}. Our registered office address is available on the Contact page of our website.`,
    },
    {
      heading: 'Changes to This Policy',
      content:
        `${company.name} reserves the right to update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically. Continued use of our website or services after any modifications constitutes acceptance of the revised policy.`,
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  2. Terms & Conditions                                              */
/* ------------------------------------------------------------------ */

export const termsAndConditions = {
  title: 'Terms & Conditions',
  lastUpdated: '2026-08-13',
  sections: [
    {
      heading: 'Acceptance of Terms',
      content:
        `By accessing this website or engaging ${company.name} for any products or services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.`,
    },
    {
      heading: 'Services',
      content:
        `${company.name} provides a comprehensive range of printing, branding, signage, fabrication and corporate gifting services as described on this website. Service descriptions and images are provided for general reference; actual output may vary based on material, finish and production specifications agreed upon at the time of order confirmation.`,
    },
    {
      heading: 'Ordering Process',
      content:
        'Quotations provided by us are for informational purposes and do not constitute a binding offer. An order is considered confirmed only upon receipt of your written approval — via email, signed proforma or WhatsApp confirmation — along with any applicable advance payment as communicated. We reserve the right to decline or modify orders based on production feasibility.',
    },
    {
      heading: 'Pricing & Payment',
      content:
        `All prices are quoted in Indian Rupees (₹) and are exclusive of applicable taxes unless stated otherwise. Prices are subject to change without prior notice based on material costs, market conditions and order specifications. Payment terms — including advance requirements, milestone payments and final settlement — will be specified on each invoice or proforma. Late payments may attract interest as mentioned on the invoice.`,
    },
    {
      heading: 'Production & Delivery',
      content:
        `Production and delivery timelines communicated at the time of order confirmation are estimates and may be affected by factors such as design revision cycles, material availability, weather conditions or circumstances beyond our reasonable control. ${company.name} will proactively communicate any significant delays and work towards timely fulfilment of every order.`,
    },
    {
      heading: 'Quality & Approval',
      content:
        `The customer is responsible for reviewing and approving all design proofs, artwork, content and specifications before production begins. Once approved, any errors in the approved material remain the customer's responsibility. Please note that colours displayed on digital screens may not exactly match the final printed output due to inherent differences between screen (RGB) and print (CMYK) colour spaces. Minor variations in shade, texture and finish are characteristic of physical printing and fabrication processes.`,
    },
    {
      heading: 'Intellectual Property',
      content:
        `The customer warrants that all designs, logos, text, images and other creative material submitted for production are either owned by the customer or used with proper licence or authorisation. ${company.name} shall not be held liable for any intellectual property infringement arising from material provided by the customer. ${company.name} retains the right to feature completed work in its portfolio, website and marketing materials unless the customer explicitly requests otherwise in writing prior to production.`,
    },
    {
      heading: 'Limitation of Liability',
      content:
        `To the maximum extent permitted by applicable law, ${company.name}'s total liability for any claim arising out of or related to its products or services shall not exceed the amount paid by the customer for the specific order in question. ${company.name} shall not be liable for any indirect, incidental, consequential or punitive damages, including loss of profit, revenue or business opportunity.`,
    },
    {
      heading: 'Governing Law',
      content:
        'These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Nagpur, Maharashtra, India.',
    },
    {
      heading: 'Contact',
      content:
        `For any questions regarding these Terms & Conditions, please contact us at ${company.email} or call ${company.phoneDisplay}.`,
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  3. Refund & Cancellation Policy                                    */
/* ------------------------------------------------------------------ */

export const refundPolicy = {
  title: 'Refund & Cancellation Policy',
  lastUpdated: '2026-08-13',
  sections: [
    {
      heading: 'Cancellation',
      content:
        'If you wish to cancel an order before production has commenced, you are eligible for a full refund of any advance payment made. Once production has started, cancellation requests will be assessed on a case-by-case basis. Depending on the stage of production and materials already consumed, a partial refund may be offered after deducting costs incurred up to the point of cancellation.',
    },
    {
      heading: 'Refunds',
      content:
        'Approved refunds will be processed to the original payment method — bank transfer, UPI or other instrument — within a reasonable timeframe, typically 7 to 14 business days from the date of approval. We will notify you once the refund has been initiated.',
    },
    {
      heading: 'Defective or Damaged Products',
      content:
        `If you receive a product that is defective in material, workmanship or significantly different from the approved specification, ${company.name} will offer a replacement or refund at its discretion. Please report any defects within 48 hours of delivery along with clear photographs of the issue. Claims reported after this period may not be eligible for resolution.`,
    },
    {
      heading: 'Custom Products',
      content:
        'Given the bespoke nature of our work, custom-manufactured products — including but not limited to signage, printed materials, branded merchandise and fabricated items — are non-refundable once the design has been approved by the customer and production has commenced. This policy does not apply where the product is found to be genuinely defective or materially different from the approved proof.',
    },
    {
      heading: 'How to Request',
      content:
        `To request a cancellation or refund, please contact us at ${company.email} or reach out via WhatsApp at ${company.phoneDisplay} with your order reference, a brief description of the issue and any supporting photographs. Our team will review your request and respond within 2 business days.`,
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  4. Shipping & Delivery Policy                                      */
/* ------------------------------------------------------------------ */

export const shippingPolicy = {
  title: 'Shipping & Delivery Policy',
  lastUpdated: '2026-08-13',
  sections: [
    {
      heading: 'Delivery Area',
      content:
        `${company.name} primarily serves Nagpur city and the wider Vidarbha region with direct delivery through our own vehicles and logistics team. For customers across India, we ship applicable products via trusted courier and transport partners on a pan-India basis. Delivery feasibility for oversized or installation-dependent items (such as large signage) outside our local area will be assessed on a case-by-case basis.`,
    },
    {
      heading: 'Delivery Timeline',
      content:
        'Delivery timelines vary depending on the product type, order volume, customisation requirements and material availability. Estimated timelines will be communicated at the time of order confirmation. While we make every effort to meet the agreed schedule, timelines are estimates and may be affected by unforeseen circumstances.',
    },
    {
      heading: 'Shipping Charges',
      content:
        'Local delivery within Nagpur may be provided complimentary for orders above a specified value, which will be communicated at the time of quotation. For outstation and pan-India shipments, actual shipping and freight charges will apply and will be communicated to you before dispatch. Any applicable customs, octroi or entry-tax charges for specific regions shall be borne by the customer unless agreed otherwise.',
    },
    {
      heading: 'Packaging',
      content:
        'All products are professionally packaged to ensure safe transit. Printed materials are shrink-wrapped or boxed, signage and fabricated items are bubble-wrapped, corner-protected and crated where necessary. Special packaging requirements, if any, should be communicated at the time of order placement.',
    },
    {
      heading: 'Installation',
      content:
        `${company.name} offers professional installation services for signage, hoarding, branding and fabrication products within Nagpur and surrounding areas. Installation charges, if applicable, will be quoted separately. For outstation projects, installation can be arranged on request and will be quoted based on project scope and location.`,
    },
    {
      heading: 'Pickup',
      content:
        'Customers may choose to pick up their orders directly from our factory or office during business hours. We will notify you when your order is ready for collection. Orders not collected within 14 days of the ready notification may attract storage charges.',
    },
    {
      heading: 'Damage During Transit',
      content:
        `If your order arrives damaged during transit, please report the issue within 48 hours of delivery by contacting us at ${company.email} or via WhatsApp at ${company.phoneDisplay}. Include clear photographs of the packaging and the damaged product. ${company.name} will arrange for a replacement or appropriate resolution after review. We recommend inspecting all deliveries at the time of receipt and noting any visible damage on the courier's proof of delivery.`,
    },
  ],
}
