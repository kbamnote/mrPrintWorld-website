import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const easeOut = (p) => 1 - Math.pow(1 - p, 3)

/** Counts up to `to` when scrolled into view; jumps straight to the value under reduced-motion. */
export default function Counter({ to, duration = 1.8, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    let raf
    let start = null
    const step = (t) => {
      if (start == null) start = t
      const p = Math.min((t - start) / (duration * 1000), 1)
      setVal(Math.round(easeOut(p) * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to, duration])

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
