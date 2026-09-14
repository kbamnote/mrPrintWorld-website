import { useState } from 'react'
import { Field, Input, Btn, Badge } from '../ui'
import { percentOrNull, fromRetail, tiersFromRetail, inferPercent } from './tierPercents'

const TIERS = [
  { code: 'B2C', label: 'Retail' },
  { code: 'B2B', label: 'Trade' },
  { code: 'CORPORATE', label: 'Corporate' },
]

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

// Trade and corporate as a percentage below retail live in ./tierPercents,
// shared with every option field's price table.

/**
 * Quantity packs — 500, 1,000, 1,500 — set alongside the product's other
 * options.
 *
 * Stored as price slabs whose start and end are the same quantity, so the
 * price engine, the storefront quantity dropdown and the cart all use them
 * unchanged. Each price is for the whole pack, not per piece.
 */
export default function QuantityPacks({ value, onChange }) {
  const isPacks = value.pricingModel === 'SLAB'
  const pricing = value.pricing ?? {}
  const slabs = pricing.slabs ?? []
  // Products set up before packs used ranges ("100 to 499").
  const hasRanges = slabs.some((s) => s.maxQty !== s.minQty)
  const packs = slabs.map((s) => ({ qty: s.minQty, amounts: s.amounts ?? {} }))

  // How much cheaper trade and corporate are than RETAIL — both off retail.
  // Not saved with the product; the prices they fill in are. Read back from
  // the saved packs when those all follow one percentage.
  const [tradeOff, setTradeOff] = useState(() => inferPercent(packs.map((p) => [p.amounts.B2C, p.amounts.B2B])))
  const [corporateOff, setCorporateOff] = useState(() =>
    inferPercent(packs.map((p) => [p.amounts.B2C, p.amounts.CORPORATE])),
  )

  const writePacks = (next) =>
    onChange({
      pricing: {
        ...pricing,
        slabs: next.map((p) => ({ minQty: p.qty, maxQty: p.qty, amounts: p.amounts })),
      },
    })

  const timesListed = new Map()
  packs.forEach((p) => timesListed.set(p.qty, (timesListed.get(p.qty) ?? 0) + 1))

  function startPacks() {
    onChange({
      pricingModel: 'SLAB',
      purchaseMode: value.purchaseMode && value.purchaseMode !== 'QUOTE_ONLY' ? value.purchaseMode : 'BUY_NOW',
      pricing: {
        ...pricing,
        unit: pricing.unit || 'pieces',
        slabs: slabs.length ? slabs : [{ minQty: 500, maxQty: 500, amounts: {} }],
      },
    })
  }

  /** The next pack follows the last step: 500, 1,000 → 1,500. */
  function addPack() {
    const last = Number(packs[packs.length - 1]?.qty) || 0
    const prev = Number(packs[packs.length - 2]?.qty) || 0
    const step = last && prev && last > prev ? last - prev : 500
    writePacks([...packs, { qty: last ? last + step : 500, amounts: {} }])
  }

  const setQty = (i, raw) =>
    writePacks(packs.map((p, pi) => (pi === i ? { ...p, qty: raw === '' ? '' : Math.floor(Number(raw)) } : p)))

  const setAmount = (i, tier, raw) =>
    writePacks(
      packs.map((p, pi) => {
        if (pi !== i) return p
        const amounts = { ...p.amounts }
        if (raw === '') delete amounts[tier]
        else amounts[tier] = Number(raw)
        // With percentages set, trade and corporate follow the retail price.
        const follow = tier === 'B2C' ? tiersFromRetail(amounts.B2C, tradeOff, corporateOff) : {}
        return { ...p, amounts: { ...amounts, ...follow } }
      }),
    )

  /** Recalculate trade and corporate on every pack that has a retail price. */
  function applyPercents(nextTradeOff, nextCorporateOff) {
    writePacks(
      packs.map((p) => ({
        ...p,
        amounts: { ...p.amounts, ...tiersFromRetail(p.amounts.B2C, nextTradeOff, nextCorporateOff) },
      })),
    )
  }

  // A worked example, from the first pack's retail price when there is one.
  const exampleRetail = Number(packs.find((p) => Number(p.amounts.B2C) > 0)?.amounts.B2C) || 1000
  const exampleTradeOff = percentOrNull(tradeOff) ?? 15
  const exampleCorporateOff = percentOrNull(corporateOff) ?? 22
  const exampleTrade = fromRetail(exampleRetail, exampleTradeOff)
  const exampleCorporate = fromRetail(exampleRetail, exampleCorporateOff)

  if (!isPacks) {
    return (
      <section className="rounded-[var(--radius-card)] border border-line bg-white p-4">
        <h3 className="font-display text-base font-semibold text-ink">Quantity packs</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Sell this product in fixed quantities — 500, 1,000, 1,500 — each with its own price. Customers choose a
          pack from a dropdown.
        </p>
        <Btn variant="outline" size="sm" className="mt-3" onClick={startPacks}>
          Sell in quantity packs
        </Btn>
        {value.pricingModel && value.pricingModel !== 'QUOTE_ONLY' && (
          <p className="mt-2 text-xs text-ink-soft">
            This replaces the pricing method currently set on the Pricing tab.
          </p>
        )}
      </section>
    )
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-ink">Quantity packs</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Each price is for the whole pack, not per piece. Leave a customer type blank and they are asked to
            contact you instead.
          </p>
        </div>
        <Field label="Sold in" className="w-36">
          <Input
            value={pricing.unit ?? ''}
            onChange={(e) => onChange({ pricing: { ...pricing, unit: e.target.value } })}
            placeholder="pieces"
            maxLength={24}
          />
        </Field>
      </div>

      {hasRanges && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span>
            This product still has quantity ranges from before, like 100 – 499. Each becomes a single pack at its
            starting quantity.
          </span>
          <Btn size="sm" variant="outline" onClick={() => writePacks(packs)}>
            Convert to packs
          </Btn>
        </div>
      )}

      <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-surface p-3">
        <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Fill trade and corporate prices from retail
        </span>
        <div className="mt-2 flex flex-wrap items-end gap-x-6 gap-y-3">
          <label className="text-sm text-ink">
            <span className="mb-1 block text-xs text-ink-soft">Trade is below retail by</span>
            <span className="flex items-center gap-1.5">
              <Input
                type="number"
                min="0"
                max="99"
                step="0.5"
                value={tradeOff}
                onChange={(e) => {
                  setTradeOff(e.target.value)
                  applyPercents(e.target.value, corporateOff)
                }}
                placeholder="15"
                aria-label="Trade price, percent below retail"
                className="w-20 tabular-nums"
              />
              %
            </span>
          </label>
          <label className="text-sm text-ink">
            <span className="mb-1 block text-xs text-ink-soft">Corporate is below retail by</span>
            <span className="flex items-center gap-1.5">
              <Input
                type="number"
                min="0"
                max="99"
                step="0.5"
                value={corporateOff}
                onChange={(e) => {
                  setCorporateOff(e.target.value)
                  applyPercents(tradeOff, e.target.value)
                }}
                placeholder="22"
                aria-label="Corporate price, percent below retail"
                className="w-20 tabular-nums"
              />
              %
            </span>
          </label>
          <p className="text-sm tabular-nums text-ink">
            <span className="text-ink-soft">Example: </span>
            {money(exampleRetail)} retail → {money(exampleTrade)} trade ({exampleTradeOff}% less) ·{' '}
            {money(exampleCorporate)} corporate ({exampleCorporateOff}% less than retail)
          </p>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Both percentages are taken off the retail price. Entering one fills every pack that has a retail price;
          while it is set, typing a retail price fills that pack too, rounded to the nearest rupee. Clear a
          percentage to type those prices by hand.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead>
            <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
              <th className="pb-2 font-semibold">Quantity</th>
              {TIERS.map((t) => (
                <th key={t.code} className="pb-2 font-semibold">
                  {t.label} price
                </th>
              ))}
              <th className="pb-2 font-semibold">Retail per piece</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {packs.map((p, i) => {
              const duplicate = p.qty !== '' && timesListed.get(p.qty) > 1
              const invalid = p.qty === '' || !(Number(p.qty) >= 1)
              return (
                <tr key={i} className="border-t border-line">
                  <td className="py-2 pr-2 align-top">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={p.qty}
                      onChange={(e) => setQty(i, e.target.value)}
                      aria-label={`Pack ${i + 1} quantity`}
                      className={`w-28 tabular-nums ${duplicate || invalid ? 'border-red-400' : ''}`}
                    />
                    {duplicate && <span className="mt-1 block text-xs text-red-700">Listed twice</span>}
                  </td>
                  {TIERS.map((t) => (
                    <td key={t.code} className="py-2 pr-2 align-top">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={p.amounts[t.code] ?? ''}
                        onChange={(e) => setAmount(i, t.code, e.target.value)}
                        aria-label={`${t.label} price for pack ${i + 1}`}
                        placeholder="—"
                        className="w-28 tabular-nums"
                      />
                    </td>
                  ))}
                  <td className="py-2 pr-2 align-top text-xs tabular-nums text-ink-soft">
                    {Number(p.qty) >= 1 && p.amounts.B2C ? `${money(p.amounts.B2C / Number(p.qty))} each` : '—'}
                  </td>
                  <td className="py-2 text-right align-top">
                    <Btn variant="ghost" size="sm" onClick={() => writePacks(packs.filter((_, pi) => pi !== i))}>
                      Remove
                    </Btn>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="outline" size="sm" onClick={addPack}>
          + Add pack
        </Btn>
        {packs.length === 0 && <Badge tone="amber">Add at least one pack</Badge>}
        <span className="text-xs text-ink-soft">
          To stop selling in packs, choose another pricing method on the Pricing tab.
        </span>
      </div>
    </section>
  )
}
