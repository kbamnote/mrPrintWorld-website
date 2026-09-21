/**
 * Photos at the size they are shown, not the size they were uploaded.
 *
 * Product photos are stored at full resolution (often 1,200px and several
 * hundred KB). A listing card is about 300px wide, so each card was
 * downloading roughly ten times the pixels it displayed. Cloudinary resizes
 * and converts on delivery — WebP or AVIF where the browser supports it,
 * compressed to what the eye can tell apart — and caches the result.
 *
 * Anything not on Cloudinary (older linked images) is returned untouched.
 */

const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/

/** One photo, at most `width` pixels wide. */
export function sizedImage(url, width) {
  const match = typeof url === 'string' ? url.match(CLOUDINARY) : null
  if (!match) return url
  return `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}`
}

/** A srcset of several widths, so each screen downloads only what it needs. */
export function imageSrcSet(url, widths) {
  if (typeof url !== 'string' || !CLOUDINARY.test(url)) return undefined
  return widths.map((w) => `${sizedImage(url, w)} ${w}w`).join(', ')
}

/** Widths and sizes for product cards in the two- and three-column grids. */
export const CARD_WIDTHS = [320, 480, 640, 800]
export const CARD_SIZES = '(min-width: 1024px) 380px, 50vw'
