import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  useSeo({
    title: 'Page not found — MR Print World Pvt. Ltd.',
    description: 'The page you were looking for could not be found.',
    path: '/404',
  })
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-gold-deep">Error 404</p>
      <h1 className="text-display mt-4 text-ink">This page took a different turn.</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you’re after isn’t here. Let’s get you back to something useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/" variant="primary" iconName="arrow-right">
          Back to home
        </Button>
        <Button to="/services" variant="outline">
          Explore services
        </Button>
      </div>
    </Container>
  )
}
