import { useSeo, breadcrumbLd } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'
import Reveal from '../components/primitives/Reveal'

const NFC_PRODUCTS = [
  {
    icon: 'credit-card',
    title: 'NFC Smart Cards',
    subtitle: 'Digital Business Cards',
    description: 'Custom-printed premium PVC, metallic, or wooden cards embedded with NFC chips. Share contact info, digital profiles, and social links instantly with one tap.',
    badge: 'Popular',
  },
  {
    icon: 'layout',
    title: 'NFC Standees',
    subtitle: 'Countertop Review & Payment Stands',
    description: 'Durable acrylic & wooden countertop standees for stores, reception desks, and showrooms. Collect instant Google reviews or receive payments with a simple phone tap.',
    badge: 'High Conversion',
  },
  {
    icon: 'key',
    title: 'NFC Keychains',
    subtitle: 'Portable Tap-to-Share Keychains',
    description: 'Compact, stylish NFC keychains designed for professionals on the move. Always carry your digital profile and contact details right on your key ring.',
    badge: 'Compact',
  },
]

const DIGITAL_SOLUTIONS = [
  {
    icon: 'star',
    title: 'AI-Powered Google Review Cards',
    description: 'Accelerate 5-star customer reviews with smart AI prompts that guide happy clients straight to your Google My Business review page in seconds.',
  },
  {
    icon: 'globe',
    title: 'Professional & E-Commerce Websites',
    description: 'Custom corporate websites and scalable e-commerce online stores designed for lightning speed, mobile responsiveness, and high conversion rates.',
  },
  {
    icon: 'target',
    title: 'Run Meta Ads from One Platform',
    description: 'Launch, track, and optimize targeted Facebook and Instagram ad campaigns with ease from a single, unified dashboard.',
  },
  {
    icon: 'map-pin',
    title: 'Manage Google My Business (GMB)',
    description: 'Control your GMB listings, respond to customer reviews, update business hours, and improve local SEO ranking all in one place.',
  },
  {
    icon: 'share-2',
    title: 'Social & Meta Posting Automation',
    description: 'Schedule, automate, and publish content across Facebook, Instagram, and social channels effortlessly from one central platform.',
  },
]

export default function ItSolutions() {
  useSeo({
    title: 'IT Solutions & Tapify NFC Products | MRPrint World',
    description:
      'Explore Tapify IT Solutions by MRPrint World: NFC Cards, NFC Standees, NFC Keychains, AI Google Review Cards, E-commerce Websites, Meta Ads & GMB Management.',
    path: '/it-solutions',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'IT Solutions', path: '/it-solutions' },
    ]),
  })

  return (
    <>
      {/* 
      <PageHeader
        eyebrow="IT Solutions by Tapify"
        title="Digital Innovation Meets Physical Print"
        intro="Smart NFC Hardware, Professional Web Development, and All-in-One Digital Growth Tools for Modern Businesses."
      />
      */}

      <section className="pb-16 pt-8 md:pt-10 bg-surface min-h-screen">
        <Container>
          {/* Main Tapify Hero Banner */}
          <div className="overflow-hidden rounded-[2.5rem] border border-line bg-white shadow-card">
            <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Icon name="zap" size={14} /> Powered by Tapify
                </div>
                <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
                  Tapify — All-in-One Smart Branding &amp; Digital Growth Platform
                </h2>
                <p className="text-base text-ink-soft leading-relaxed">
                  Tapify by MRPrint World bridges physical brand collateral with cutting-edge IT solutions.
                  From smart NFC hardware to unified digital marketing tools, Tapify helps businesses automate customer engagement, scale online sales, and manage their entire brand presence from a single platform.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    href="https://tapify.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="lg"
                    iconName="external-link"
                  >
                    Visit tapify.co.in
                  </Button>
                  <Button to="/contact" variant="outline" size="lg">
                    Contact Sales &amp; Custom Orders
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface/60 p-6 lg:col-span-5">
                <h3 className="mb-3 text-lg font-bold text-ink">Smart NFC Hardware Solutions</h3>
                <p className="mb-4 text-xs text-ink-soft">
                  Physical tap-and-share products crafted with precision printing and embedded NFC technology:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 shadow-xs">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon name="credit-card" size={16} />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-ink">NFC Smart Cards</h4>
                      <p className="text-xs text-ink-soft">Digital business cards in Metallic, Matte &amp; Wood</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 shadow-xs">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon name="layout" size={16} />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-ink">NFC Standees</h4>
                      <p className="text-xs text-ink-soft">Countertop Google Review &amp; Payment stands</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-xl border border-line bg-white p-3 shadow-xs">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon name="key" size={16} />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-ink">NFC Keychains</h4>
                      <p className="text-xs text-ink-soft">Pocket-sized tap-to-share key rings</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 1: NFC Products Range */}
          <div className="mt-16">
            <div className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Hardware Range</span>
              <h3 className="mt-1 font-display text-2xl font-bold text-ink md:text-3xl">
                NFC Products We Provide
              </h3>
              <p className="mt-2 text-sm text-ink-soft max-w-xl mx-auto">
                No app required. Works seamlessly with both Android and iPhone devices with a single tap.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {NFC_PRODUCTS.map((prod, i) => (
                <Reveal key={prod.title} delay={i * 0.05}>
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-card transition-shadow">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icon name={prod.icon} size={22} />
                        </span>
                        <span className="rounded-full bg-accent/20 px-3 py-1 text-[0.7rem] font-bold text-ink">
                          {prod.badge}
                        </span>
                      </div>
                      <h4 className="font-display text-xl font-bold text-ink">{prod.title}</h4>
                      <p className="text-xs font-semibold text-primary mb-3">{prod.subtitle}</p>
                      <p className="text-sm text-ink-soft leading-relaxed">{prod.description}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-line">
                      <Button
                        href="https://tapify.co.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        className="w-full justify-center"
                      >
                        Order on tapify.co.in &rarr;
                      </Button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 2: IT & Digital Marketing Solutions */}
          <div className="mt-20">
            <div className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Software &amp; Digital Growth</span>
              <h3 className="mt-1 font-display text-2xl font-bold text-ink md:text-3xl">
                Tapify Digital &amp; IT Platform Features
              </h3>
              <p className="mt-2 text-sm text-ink-soft max-w-2xl mx-auto">
                Manage your websites, reviews, social content, and ad campaigns from one powerful dashboard.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {DIGITAL_SOLUTIONS.map((feat, i) => (
                <Reveal key={feat.title} delay={i * 0.04}>
                  <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-sm hover:shadow-card transition-shadow">
                    <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon name={feat.icon} size={20} />
                    </span>
                    <h4 className="font-display text-lg font-bold text-ink mb-2">{feat.title}</h4>
                    <p className="text-sm text-ink-soft leading-relaxed">{feat.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* External Callout Banner */}
          <div className="mt-16 rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
            <h4 className="font-display text-xl font-bold text-ink">Ready to digitize your brand?</h4>
            <p className="mt-2 text-sm text-ink-soft max-w-xl mx-auto">
              Explore the complete Tapify catalog, place custom orders for NFC cards, standees, keychains, or request web development solutions.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                href="https://tapify.co.in"
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                iconName="external-link"
              >
                Explore Everything on tapify.co.in
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
