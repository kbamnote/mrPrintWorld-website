import { Input } from '../ui'
import { TIERS, TIER_LABELS, DELTA_HINT, readTier } from './choicePricing'

const faded = (n) => (n === undefined || n === null ? '0' : String(n))

const pill = (active) =>
  `rounded-full px-3 py-1 font-medium transition-colors ${
    active ? 'bg-primary text-white' : 'bg-surface text-ink-soft hover:bg-gray-100'
  }`

/**
 * Prices for a field that depends on another field's choice — printing sides
 * priced by Size, say. Pick the size, then set this field's prices for it:
 * for every quantity and, on a product sold in packs, for each pack.
 *
 * A blank shows, faded, what applies instead, mirroring the server: this size
 * on this pack, then this size at every quantity, then this field's price on
 * the pack, then its price at every quantity, then the library price.
 */
export default function DriverPrices({
  po,
  fieldIndex,
  choices,
  packs,
  driver,
  driverCode,
  onDriverCode,
  tier,
  onTier,
  setDriverPrice,
}) {
  const forDriver = po.driverPrices?.[driverCode] ?? {}
  const driverName = driver.choices.find((c) => c.code === driverCode)?.label ?? driverCode
  const byPack = packs.length > 0
  // This field's price without regard to size: its every-quantity price, else the library's.
  const unsized = (choice, t) => po.valueOverrides?.[choice.code]?.[t] ?? readTier(choice.priceDelta, t)

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-ink-soft">{driver.label}</span>
        {driver.choices.map((d) => (
          <button
            key={d.code}
            type="button"
            onClick={() => onDriverCode(d.code)}
            aria-pressed={driverCode === d.code}
            title={po.driverPrices?.[d.code] ? 'Has its own prices' : 'Uses this field’s own prices'}
            className={pill(driverCode === d.code)}
          >
            {d.label}
            {po.driverPrices?.[d.code] ? ' •' : ''}
          </button>
        ))}
      </div>

      {byPack && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-ink-soft">Prices for</span>
          {TIERS.map((t) => (
            <button key={t} type="button" onClick={() => onTier(t)} aria-pressed={tier === t} className={pill(tier === t)}>
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: `${16 + (byPack ? packs.length + 1 : 3) * 7}rem` }}>
          <thead>
            <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
              <th className="pb-2 font-semibold">Choice · {driverName}</th>
              {byPack ? (
                <>
                  <th className="pb-2 font-semibold">All quantities</th>
                  {packs.map((qty) => (
                    <th key={qty} className="pb-2 font-semibold tabular-nums">
                      {qty.toLocaleString('en-IN')}
                    </th>
                  ))}
                </>
              ) : (
                TIERS.map((t) => (
                  <th key={t} className="pb-2 font-semibold">
                    {TIER_LABELS[t]}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {choices.map((choice) => {
              const everyFor = (t) => forDriver.every?.[choice.code]?.[t]
              const cell = (pack, t, current, fallback, label) => (
                <td key={`${pack ?? 'every'}-${t}`} className="py-2 pr-2">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={current ?? ''}
                    onChange={(e) => setDriverPrice(fieldIndex, driverCode, pack, choice.code, t, e.target.value)}
                    placeholder={faded(fallback)}
                    aria-label={label}
                    className="w-24 tabular-nums"
                  />
                </td>
              )

              return (
                <tr key={choice.code} className="border-t border-line">
                  <td className="py-2 pr-3">
                    <span className="text-ink">{choice.label}</span>
                    <span className="ml-1.5 text-xs text-ink-soft">{DELTA_HINT[choice.deltaType ?? 'FLAT']}</span>
                  </td>
                  {byPack ? (
                    <>
                      {cell(
                        null,
                        tier,
                        everyFor(tier),
                        unsized(choice, tier),
                        `${TIER_LABELS[tier]} price for ${choice.label} with ${driverName}, every quantity`,
                      )}
                      {packs.map((qty) =>
                        cell(
                          String(qty),
                          tier,
                          forDriver.packs?.[String(qty)]?.[choice.code]?.[tier],
                          everyFor(tier) ?? po.packOverrides?.[String(qty)]?.[choice.code]?.[tier] ?? unsized(choice, tier),
                          `${TIER_LABELS[tier]} price for ${choice.label} with ${driverName} on ${qty}`,
                        ),
                      )}
                    </>
                  ) : (
                    TIERS.map((t) =>
                      cell(null, t, everyFor(t), unsized(choice, t), `${TIER_LABELS[t]} price for ${choice.label} with ${driverName}`),
                    )
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
