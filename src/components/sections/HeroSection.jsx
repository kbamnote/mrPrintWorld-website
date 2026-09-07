import { Suspense, lazy } from 'react'
import { useDeviceCapability } from '../../lib/useDeviceCapability'

// Code-split: three.js lives in its own chunk, loaded only on capable devices.
const HeroParticles = lazy(() => import('./HeroParticles'))

export default function HeroSection() {
  const { enable3d, enableVideo } = useDeviceCapability()

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-dark text-white">
      {/*
        The page still needs exactly one <h1> — it is the strongest on-page
        signal Google has for what this site is, and the hero is where it
        belongs. Visually hidden (sr-only) rather than deleted: screen readers
        and crawlers get it, nobody sees it over the video.
      */}
      <h1 className="sr-only">
        MRPrint World Pvt. Ltd. — printing, signage, fabrication and branding
        execution in Nagpur
      </h1>

      {/* Static backdrop — paints immediately, no JS required, and stays
          visible underneath while the video buffers. */}
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

      {/* Background video (decorative). Fades in once it can actually play, so
          a slow connection never shows a black or half-loaded frame. */}
      {enableVideo && (
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={(e) => e.currentTarget.classList.remove('opacity-0')}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Lazy WebGL atmosphere — skipped when the video is carrying the
          background, so the two don't compete visually or for GPU time. */}
      {enable3d && !enableVideo && (
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>
      )}

      {/* Bottom fade into the next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-dark"
      />
    </section>
  )
}
