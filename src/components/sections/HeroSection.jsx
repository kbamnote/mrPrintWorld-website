import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import Button from '../primitives/Button'
import Eyebrow from '../primitives/Eyebrow'
import { useDeviceCapability } from '../../lib/useDeviceCapability'
import { staggerContainer, fadeUp } from '../../lib/motion'
import { company } from '../../data/company'

// Code-split: three.js lives in its own chunk, loaded only on capable devices.
const HeroParticles = lazy(() => import('./HeroParticles'))

const trust = [
  ['12+', 'years'],
  ['50+', 'professionals'],
  ['End-to-end', 'under one roof'],
  ['Nagpur', 'India'],
]

export default function HeroSection() {
  const { enable3d } = useDeviceCapability()

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-dark text-white">
      {/* Static premium backdrop — paints immediately, no JS required */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 85% at 78% 8%, rgba(11,107,67,0.32), transparent 58%), radial-gradient(85% 65% at 8% 100%, rgba(20,90,62,0.28), transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(80% 80% at 50% 40%, #000, transparent 75%)',
          }}
        />
      </div>

      {/* Lazy WebGL atmosphere (enhancement layer) */}
      {enable3d && (
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>
      )}

      {/* Bottom fade into the next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-dark"
      />

      <div className="container-wide relative z-10 py-32">
        <motion.div
          variants={staggerContainer(0.12, 0.08)}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow light>{company.positioning}</Eyebrow>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-hero mt-6 text-white">
            Transforming Ideas Into <span className="text-accent">Powerful</span>{' '}
            Brand Experiences
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70"
          >
            From premium printing and signage to fabrication, corporate gifting,
            and large-scale branding execution, MR Print World Pvt. Ltd. delivers complete
            solutions that help businesses stand out, scale, and succeed.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
            <Button to="/services" variant="gold" size="lg" iconName="arrow-right">
              Explore Our Services
            </Button>
            <Button to="/contact" variant="outline-light" size="lg">
              Request a Quote
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-8"
          >
            {trust.map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <dt className="font-display text-xl font-semibold text-white">{value}</dt>
                <dd className="text-sm text-white/55">{label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 md:flex"
      >
        <span className="text-[0.7rem] uppercase tracking-[0.2em]">Scroll</span>
        <span className="h-9 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}
