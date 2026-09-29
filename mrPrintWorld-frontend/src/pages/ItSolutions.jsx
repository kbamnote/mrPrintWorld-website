import { useSeo, breadcrumbLd } from '../lib/seo'
import PageHeader from '../components/layout/PageHeader'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import Icon from '../components/primitives/Icon'
import Reveal from '../components/primitives/Reveal'

const TAPIFY_FEATURES = [
  {
    icon: 'smartphone',
    title: 'Smart NFC Cards',
    description: 'Share your contact details, social profiles, and business links with a single tap on any smartphone.',
  },
  {
    icon: 'star',
    title: 'Instant Review Cards',
    description: 'Collect 5-star Google & social media reviews effortlessly with tap-to-review NFC cards and stands.',
  },
  {
    icon: 'sliders',
    title: 'Custom Digital Profiles',
    description: 'Real-time updated digital profiles without needing to reprint physical business cards ever again.',
  },
  {
    icon: 'shield',
    title: 'Enterprise Branding',
    description: 'Customized metallic, PVC, or wooden NFC cards engraved with your corporate logo and brand identity.',
  },
]

export default function ItSolutions() {
  useSeo({
    title: 'IT Solutions & Tapify NFC Cards | MRPrint World',
    description:
      'Explore IT Solutions by MRPrint World featuring Tapify smart NFC business cards, digital contact sharing, and modern branding technology.',
    path: '/it-solutions',
    jsonLd: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name: 'IT Solutions', path: '/it-solutions' },
    ]),
  })

  return (
    <>
      <PageHeader
        eyebrow="IT Solutions"
        title="Digital Innovation Meets Physical Print"
        intro="Transform your networking and brand presence with our digital IT solutions powered by Tapify."
      />

      <section className="section-y bg-surface">
        <Container>
          {/* Tapify Highlight Card */}
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
            <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Icon name="zap" size={14} /> Powered by Tapify
                </div>
                <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
                  Tapify — Next-Gen Smart Digital Business Cards
                </h2>
                <p className="text-base text-ink-soft leading-relaxed">
                  Tapify by MRPrint World bridges the gap between premium printing and digital technology.
                  Replace paper cards with reusable, eco-friendly smart NFC business cards that instantly transfer your contact information, portfolio, social links, and Google Review page to any smartphone.
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
                    Enquire Custom Order
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface/50 p-6 md:p-8">
                <h3 className="mb-4 text-lg font-bold text-ink">Why Choose Tapify?</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {TAPIFY_FEATURES.map((feature, i) => (
                    <Reveal key={feature.title} delay={i * 0.05}>
                      <div className="h-full rounded-xl border border-line bg-white p-4 shadow-sm">
                        <span className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon name={feature.icon} size={18} />
                        </span>
                        <h4 className="font-bold text-ink text-sm">{feature.title}</h4>
                        <p className="mt-1 text-xs text-ink-soft leading-snug">{feature.description}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* External link CTA Banner */}
          <div className="mt-12 text-center">
            <p className="text-sm text-ink-soft">
              Looking for custom NFC card orders or digital profile management? Visit official website:{' '}
              <a
                href="https://tapify.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline hover:text-primary-dark"
              >
                tapify.co.in
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
