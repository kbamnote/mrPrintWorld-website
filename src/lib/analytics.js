// ---------------------------------------------------------------------------
// Google Analytics / Conversion Tracking – MRPrint World Pvt. Ltd.
// ---------------------------------------------------------------------------

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID || ''

/**
  * Safely track custom events in Google Analytics if active.
  * Falls back to logging to console in development.
  */
export function trackEvent(eventName, eventParams = {}) {
  const params = {
    ...eventParams,
    send_to: GA_MEASUREMENT_ID || undefined,
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  } else {
    // Simulated event tracking in console for development
    console.debug(`[Analytics simulated event] "${eventName}":`, params)
  }
}

/** Track click on the main WhatsApp Floating Action Button / CTA */
export function trackWhatsAppClick(label = 'floating') {
  trackEvent('whatsapp_click', {
    event_category: 'engagement',
    event_label: label,
  })
}

/** Track click on the call action buttons */
export function trackPhoneClick(label = 'floating') {
  trackEvent('phone_click', {
    event_category: 'engagement',
    event_label: label,
  })
}

/** Track email clicks */
export function trackEmailClick(label = 'footer') {
  trackEvent('email_click', {
    event_category: 'engagement',
    event_label: label,
  })
}

/** Track quote form request submission */
export function trackQuoteRequest(service, page = 'request-quote') {
  trackEvent('generate_lead', {
    event_category: 'lead',
    event_label: service,
    value: 1.0,
    currency: 'INR',
    page_location: page,
  })
}

/** Track contact form submission */
export function trackContactSubmit(service) {
  trackEvent('contact_form_submit', {
    event_category: 'lead',
    event_label: service,
  })
}

/** Track product enquiry action */
export function trackProductEnquiry(productName) {
  trackEvent('product_enquiry', {
    event_category: 'engagement',
    event_label: productName,
  })
}

/**
 * One delegated listener covers every WhatsApp / phone / email CTA on the site
 * — the floating buttons, navbar, footer, contact panel, product and service
 * pages. Wiring each call site individually would mean ~14 onClick handlers
 * that silently rot as soon as someone adds a new button; matching on the href
 * scheme instead means new CTAs are tracked automatically.
 *
 * Called once from main.jsx.
 */
export function initClickTracking() {
  if (typeof document === 'undefined') return

  document.addEventListener(
    'click',
    (e) => {
      const a = e.target?.closest?.('a[href]')
      if (!a) return

      const href = a.getAttribute('href') || ''
      // Which route the visitor converted from — more useful than the button's name.
      const page = window.location.pathname

      if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        trackWhatsAppClick(page)

        // The wa.me links carry a prefilled message naming the product or
        // service (see whatsappLink() in data/company.js). Pull it back out so
        // enquiries are attributed to what the visitor was actually looking at.
        try {
          const text = new URL(href, window.location.origin).searchParams.get('text') || ''
          const match = text.match(/interested in (?:your )?(.+?)(?:\.|,| services)/i)
          if (match) trackProductEnquiry(match[1].trim())
        } catch {
          /* malformed href — the whatsapp_click above still recorded */
        }
        return
      }

      if (href.startsWith('tel:')) trackPhoneClick(page)
      else if (href.startsWith('mailto:')) trackEmailClick(page)
    },
    // Capture phase: still fires if a handler downstream stops propagation.
    true,
  )
}
