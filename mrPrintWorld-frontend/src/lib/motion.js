/** Shared Framer Motion variants. Calm, confident, intentional (brief §10). */

export const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

/** Container that staggers its children's `show` transition. */
export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** Sensible default for scroll-triggered reveals. */
export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' }

/** Ken-Perlin smootherstep (6t^5 - 15t^4 + 10t^3) — flat at both ends. */
export const smootherstep = (t) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}
