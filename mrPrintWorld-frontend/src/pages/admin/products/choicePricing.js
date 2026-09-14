/** Shared by the Options tab's price tables. */

export const TIERS = ['B2C', 'B2B', 'CORPORATE']
export const TIER_LABELS = { B2C: 'Retail', B2B: 'Trade', CORPORATE: 'Corporate' }

/** What a choice's number means, shown beside its name. */
export const DELTA_HINT = { FLAT: '+ ₹', PERCENT: '+ %', PER_SQFT: '+ ₹ per sq.ft', MULTIPLIER: '×' }

/** One tier's price, from a Map or a plain object. */
export const readTier = (map, tier) => (map ? (typeof map.get === 'function' ? map.get(tier) : map[tier]) : undefined)
