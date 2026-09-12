import { useLayoutEffect, useRef } from 'react'

/**
 * SVG text that can never grow past `maxWidth` millimetres.
 *
 * Long entries are condensed to fit instead of running past the trim. Without
 * this, a customer typing a long company name or email address produces a
 * design that prints with the text cut off — the single most common way a
 * template like this produces unusable files.
 *
 * The attribute is managed directly rather than through state: measuring
 * feeds back into the width, and state here would loop.
 */
export default function FitText({ maxWidth, children, ...props }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node || !maxWidth) return

    const fit = () => {
      if (!ref.current) return
      ref.current.removeAttribute('textLength')
      ref.current.removeAttribute('lengthAdjust')
      if (ref.current.getComputedTextLength() > maxWidth) {
        ref.current.setAttribute('textLength', String(maxWidth))
        ref.current.setAttribute('lengthAdjust', 'spacingAndGlyphs')
      }
    }

    fit()
    // Letter widths change again once the web fonts have arrived.
    document.fonts?.ready?.then(fit)
  })

  return (
    <text ref={ref} {...props}>
      {children}
    </text>
  )
}
