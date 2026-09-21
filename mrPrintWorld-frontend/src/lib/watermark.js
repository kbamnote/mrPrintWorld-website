/**
 * Product photos on the product page carry the MR PRINT WORLD watermark.
 *
 * Cloudinary lays it over each photo as it delivers it, so the stored
 * originals stay clean — the admin panel, listings and catalogue PDF use the
 * same photos untouched. The watermark picture is uploaded by the backend at
 * startup (services/remoteImage.js, WATERMARK_ID); bump the version in both
 * places to change the design.
 *
 * The grid is drawn at 70% of the photo's width and repeated across it, so
 * square and wide photos get the same density, at 45% strength so the
 * product still reads clearly.
 */

const CLOUD = 'dpawkimbc'
const WATERMARK = 'l_mrprintworld:watermark_v1,w_0.7,fl_relative,o_45/fl_layer_apply,fl_tiled'
const UPLOAD = `https://res.cloudinary.com/${CLOUD}/image/upload/`

/**
 * The watermarked version of one of our photos, at most `width` pixels wide
 * and compressed for the browser; any other image is returned as it is.
 * Resized first, so the watermark is laid over the photo as it is shown.
 */
export function watermarked(url, width = 1000) {
  if (typeof url !== 'string' || !url.startsWith(UPLOAD)) return url
  return `${UPLOAD}f_auto,q_auto,c_limit,w_${width}/${WATERMARK}/${url.slice(UPLOAD.length)}`
}
