import { motion, useReducedMotion } from 'framer-motion'
import { EASE, viewportOnce } from '../../lib/motion'

/**
 * Scroll-into-view reveal. Returns a plain element under prefers-reduced-motion
 * so nothing animates for users who opt out.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 26,
  as = 'div',
  ...rest
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
      }}
      {...rest}
    >
      {children}
    </M>
  )
}
