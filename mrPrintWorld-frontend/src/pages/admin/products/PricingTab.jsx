import { useState } from 'react'
import * as api from '../adminApi'
import { Field, Input, Select, Btn, Card, Badge, Spinner } from '../ui'

const TIERS = [
  { code: 'B2C', label: 'B2C', sub: 'Retail' },
  { code: 'B2B', label: 'B2B', sub: 'Trade' },
  { code: 'CORPORATE', label: 'Corporate', sub: 'Contract' },
]

const MODELS = [
  { value: 'QUOTE_ONLY', label: 'Quote only — no automatic price' },
  { value: 'FIXED', label: 'Fixed price per unit' },
  { value: 'SLAB', label: 'Quantity packs, e.g. visiting cards — set on the Options tab' },
  { value: 'AREA', label: 'Per sq.ft (e.g. flex, ACP board)' },
]

/** Percentage below B2C — the number the sales team actually reasons about. */
function marginVsRetail(retail, tierValue) {
  const r = Number(retail)
  const t = Number(tierValue)
  if (!r || !t) return null
  return (((t - r) / r) * 100).toFixed(1)
}

/**
 * The pricing tab.
 *
 * Two things here are deliberate and worth keeping:
 *   1. All three tiers sit side by side in ONE table, with a computed margin
 *      row. Splitting them across screens is what makes tiered pricing hard to
 *      reason about.
 *   2. The live preview calls the same /preview-price endpoint that the public
 *      calculator uses, so what is shown here is what a customer is quoted.
 *      A second calculation in the UI is how admin and customer drift apart.
 */
export default function PricingTab({ productId, value, onChange, onGoToOptions }) {
  const [preview, setPreview] = useState({ loading: false, result: null, error: null })
  const [previewInput, setPreviewInput] = useState({ tier: 'B2C', quantity: 1, width: 4, height: 8 })

  const model = value.pricingModel ?? 'QUOTE_ONLY'
  const pricing = value.pricing ?? {}

  const setModel = (pricingModel) =>
    onChange({
      ...value,
      pricingModel,
      purchaseMode: pricingModel === 'QUOTE_ONLY' ? 'QUOTE_ONLY' : (value.purchaseMode ?? 'PRICE_AND_QUOTE'),
      pricing: pricingModel === 'QUOTE_ONLY' ? null : { unit: pricing.unit ?? '', ...pricing },
    })

  const setPricing = (patch) => onChange({ ...value, pricing: { ...pricing, ...patch } })

  const setTierAmount = (bucket, tier, amount) => {
    const next = { ...(pricing[bucket] ?? {}) }
    if (amount === '' || amount === null) delete next[tier]
    else next[tier] = Number(amount)
    setPricing({ [bucket]: next })
  }

  async function runPreview() {
    if (!productId) {
      setPreview({ loading: false, result: null, error: { message: 'Save the product once before previewing.' } })
      return
    }
    setPreview({ loading: true, result: null, error: null })
    try {
      const result = await api.previewPrice(productId, previewInput)
      setPreview({ loading: false, result, error: null })
    } catch (error) {
      setPreview({ loading: false, result: null, error })
    }
  }

  const bucket = model === 'AREA' ? 'rates' : 'amounts'
  const unitLabel = model === 'AREA' ? '₹ per sq.ft' : '₹ per unit'

  return (
    <div className="space-y-5">
      <Field label="Pricing model" hint="Determines what the customer sees and how the price is worked out.">
        <Select value={model} onChange={(e) => setModel(e.target.value)}>
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>
      </Field>

      {model === 'QUOTE_ONLY' && (
        <div className="rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This product shows <strong>Request a Quote</strong> instead of a price. That is the right choice for
          anything genuinely bespoke — but a customer cannot buy it online.
        </div>
      )}

      {model !== 'QUOTE_ONLY' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Unit" hint={model === 'AREA' ? 'Usually sqft' : 'e.g. piece, set, sheet'}>
              <Input
                value={pricing.unit ?? ''}
                onChange={(e) => setPricing({ unit: e.target.value })}
                placeholder={model === 'AREA' ? 'sqft' : 'piece'}
              />
            </Field>
            <Field label="Purchase mode">
              <Select
                value={value.purchaseMode ?? 'PRICE_AND_QUOTE'}
                onChange={(e) => onChange({ ...value, purchaseMode: e.target.value })}
              >
                <option value="BUY_NOW">Show price, allow purchase</option>
                <option value="PRICE_AND_QUOTE">Show price, also offer a quote</option>
                <option value="QUOTE_ONLY">Quote only</option>
              </Select>
            </Field>
          </div>

          {model === 'AREA' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Minimum chargeable area" hint="Small jobs bill at this minimum. Leave blank for none.">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={pricing.minChargeableArea ?? ''}
                  onChange={(e) =>
                    setPricing({ minChargeableArea: e.target.value === '' ? null : Number(e.target.value) })
                  }
                  placeholder="10"
                />
              </Field>
              <Field label="Round area up to" hint="e.g. 0.5 rounds 31.2 sq.ft up to 31.5.">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={pricing.roundUpTo ?? ''}
                  onChange={(e) => setPricing({ roundUpTo: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="0.5"
                />
              </Field>
            </div>
          )}

          {/* ── The tier table ─────────────────────────────────────────── */}
          {model !== 'SLAB' && (
            <Card title="Price by customer type" description={unitLabel}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] text-sm">
                  <thead>
                    <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                      <th className="pb-2 font-semibold" />
                      {TIERS.map((t) => (
                        <th key={t.code} className="pb-2 font-semibold">
                          {t.label}
                          <span className="ml-1 font-normal normal-case text-ink-soft/70">{t.sub}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 text-ink-soft">{unitLabel}</td>
                      {TIERS.map((t) => (
                        <td key={t.code} className="py-2 pr-3">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={pricing[bucket]?.[t.code] ?? ''}
                            onChange={(e) => setTierAmount(bucket, t.code, e.target.value)}
                            className="w-28 tabular-nums"
                            placeholder="—"
                          />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-line">
                      <td className="py-2 pr-4 text-xs text-ink-soft">vs retail</td>
                      {TIERS.map((t) => {
                        const m = t.code === 'B2C' ? null : marginVsRetail(pricing[bucket]?.B2C, pricing[bucket]?.[t.code])
                        return (
                          <td key={t.code} className="py-2 pr-3 text-xs tabular-nums text-ink-soft">
                            {t.code === 'B2C' ? '—' : m === null ? '—' : `${m}%`}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-soft">
                Leave a tier blank and that customer type sees <em>Request a Quote</em> — never another tier&rsquo;s
                price.
              </p>
            </Card>
          )}

          {/* Packs moved to the Options tab, beside the product's other choices. */}
          {model === 'SLAB' && (
            <Card title="Quantity packs" description="Priced per pack — for example 500, 1,000, 1,500.">
              <p className="text-sm text-ink-soft">
                {(pricing.slabs ?? []).length} pack{(pricing.slabs ?? []).length === 1 ? '' : 's'} set. Packs and
                their prices are managed on the Options tab, with the product&rsquo;s other choices.
              </p>
              {onGoToOptions && (
                <Btn size="sm" className="mt-3" onClick={onGoToOptions}>
                  Set quantity packs
                </Btn>
              )}
            </Card>
          )}

          {/* ── Live preview ───────────────────────────────────────────── */}
          <Card title="Live preview" description="Runs through the same engine that quotes the customer.">
            <div className="flex flex-wrap items-end gap-3">
              <Field label="As" className="w-32">
                <Select
                  value={previewInput.tier}
                  onChange={(e) => setPreviewInput({ ...previewInput, tier: e.target.value })}
                >
                  {TIERS.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Qty" className="w-24">
                <Input
                  type="number"
                  min="1"
                  value={previewInput.quantity}
                  onChange={(e) => setPreviewInput({ ...previewInput, quantity: Number(e.target.value) })}
                />
              </Field>
              {model === 'AREA' && (
                <>
                  <Field label="Width" className="w-24">
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={previewInput.width}
                      onChange={(e) => setPreviewInput({ ...previewInput, width: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Height" className="w-24">
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={previewInput.height}
                      onChange={(e) => setPreviewInput({ ...previewInput, height: Number(e.target.value) })}
                    />
                  </Field>
                </>
              )}
              <Btn variant="outline" onClick={runPreview} disabled={preview.loading}>
                {preview.loading ? 'Calculating…' : 'Calculate'}
              </Btn>
            </div>

            {preview.loading && <Spinner className="mt-4" />}

            {preview.error && (
              <p className="mt-4 text-sm text-red-700">{preview.error.message}</p>
            )}

            {preview.result && (
              <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-surface p-4">
                {preview.result.quotable ? (
                  <>
                    <div className="font-display text-2xl font-bold tabular-nums text-ink">
                      ₹{preview.result.total.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1 text-xs text-ink-soft">
                      {preview.result.tier}
                      {preview.result.area ? ` · ${preview.result.area} sq.ft` : ''}
                      {preview.result.requiresQuote ? ' · also offers a quote' : ''}
                    </div>
                    <ul className="mt-3 space-y-1 border-t border-line pt-3 text-xs text-ink-soft">
                      {preview.result.breakdown.map((line, i) => (
                        <li key={i} className="flex justify-between gap-4">
                          <span>{line.label}</span>
                          {line.amount !== null && line.amount !== undefined && (
                            <span className="tabular-nums">₹{Number(line.amount).toLocaleString('en-IN')}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="text-sm">
                    <Badge tone="amber">Quote required</Badge>
                    <p className="mt-2 text-ink-soft">{preview.result.reason}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

