import PageHeader from '../components/layout/PageHeader'
import { useSeo, breadcrumbLd } from '../lib/seo'
import ContactSection from '../components/sections/ContactSection'

export default function Contact() {
  useSeo({
    title: 'Contact & Request a Quote | MR Print World Pvt. Ltd., Nagpur',
    description:
      'Request a quote, WhatsApp or call MR Print World Pvt. Ltd. in Nagpur for printing, signage, fabrication and large-scale branding execution.',
    path: '/contact',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  })

  return (
    <>
      <PageHeader
        eyebrow="Let’s talk"
        title="Tell us what you need to brand."
        intro="Share a few details and our team will come back with a quote. Prefer to talk now? WhatsApp or call us directly."
      />
      <ContactSection embedded />
    </>
  )
}
