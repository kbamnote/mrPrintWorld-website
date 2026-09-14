/**
 * Trade and corporate prices worked out as a percentage below retail.
 *
 * Both are always taken off the RETAIL price — corporate is not a discount
 * on trade — so "15% and 22%" means the same thing on every product. Used by
 * the quantity packs and by every option field's price table.
 *
 * A typing aid only: the percentages are not saved with the product; the
 * prices they fill in are.
 */

/** A usable percentage (0 to 99), or null when blank or invalid. */
export function percentOrNull(raw) {
  if (raw === '' || raw === null || raw === undefined) return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 && n < 100 ? n : null
}

/** A retail price less a percentage: whole rupees by default, paise for per-sq.ft rates. */
export function fromRetail(retail, percent, decimals = 0) {
  const factor = 10 ** decimals
  return Math.round(Number(retail) * (1 - percent / 100) * factor) / factor
}

/** { B2B, CORPORATE } from a retail price, for whichever percentages are set. */
export function tiersFromRetail(retail, tradeOff, corporateOff, decimals = 0) {
  const r = Number(retail)
  if (!(r > 0)) return {}
  const t = percentOrNull(tradeOff)
  const c = percentOrNull(corporateOff)
  return {
    ...(t !== null ? { B2B: fromRetail(r, t, decimals) } : {}),
    ...(c !== null ? { CORPORATE: fromRetail(r, c, decimals) } : {}),
  }
}

/**
 * The one percentage a set of [retail, price] pairs all follow, as a string
 * for an input, or '' when they don't agree. Needs two pairs or more: a single
 * price could just be a figure someone typed.
 */
export function inferPercent(pairs, decimals = 0) {
  const usable = pairs
    .map(([retail, price]) => [Number(retail), Number(price)])
    .filter(([retail, price]) => retail > 0 && price > 0 && price <= retail)
  if (usable.length < 2) return ''
  const [retail0, price0] = usable[0]
  const pct = Math.round((1 - price0 / retail0) * 1000) / 10
  if (!(pct > 0)) return ''
  const tolerance = decimals ? 10 ** -decimals : 1
  const fits = usable.every(([retail, price]) => Math.abs(fromRetail(retail, pct, decimals) - price) <= tolerance)
  return fits ? String(pct) : ''
}
