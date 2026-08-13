// ---------------------------------------------------------------------------
// Google Analytics / Conversion Tracking – MR Print World Pvt. Ltd.
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
