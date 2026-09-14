import { useState } from 'react'
import { Field, Input, Select, Btn, Badge } from '../ui'
import { percentOrNull, fromRetail, tiersFromRetail, inferPercent } from './tierPercents'
import FieldForm from './FieldForm'
import DriverPrices from './DriverPrices'

import { TIERS, TIER_LABELS, DELTA_HINT, readTier } from './choicePricing'

const hasLegacyOverride = (po) => Boolean(po.deltaOverrides && Object.keys(po.deltaOverrides).length)

/** What a pack cell accepts to mean "not offered on this pack": –, x, na or n/a. */
const NOT_AVAILABLE = /^\s*(-|–|—|x|na|n\/a)\s*$/i

/** Flat and per-sq.ft choices are amounts; percentage and multiplier ones already scale with the price. */
const scales = (choice) => !choice?.deltaType || choice.deltaType === 'FLAT' || choice.deltaType === 'PER_SQFT'

/** Whole rupees for a flat amount, paise for a per-sq.ft rate. */
const decimalsFor = (choice) => (choice?.deltaType === 'PER_SQFT' ? 2 : 0)

const rupees = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

/**
 * Which specification fields this product asks the customer, in what order.
 *
 * The fields themselves live in the shared library (Product Options), so
 * "Paper / card stock" is defined once and reused across every product. Here
 * you only choose which ones apply, whether they must be answered, and
 * whether this product charges differently for them.
 */
export default function OptionsTab({
  value = [],
  groups = [],
  packs = [],
  onChange,
  onGroupCreated,
  onGroupUpdated,
}) {
  // Which customer type each field's pack price table is showing.
  const [tierFor, setTierFor] = useState({})
  // The field whose library definition is open for editing, by id.
  const [editingField, setEditingField] = useState(null)
  // Each field's trade and corporate percentages below retail, by field id, once typed.
  const [percentsFor, setPercentsFor] = useState({})
  // For a field priced by another field (e.g. Size), which of that field's choices is showing.
  const [driverTabFor, setDriverTabFor] = useState({})
  const attachedIds = new Set(value.map((po) => String(po.optionGroup)))
  const available = groups.filter((g) => !attachedIds.has(String(g._id)) && g.isActive !== false)

  const groupFor = (po) => groups.find((g) => String(g._id) === String(po.optionGroup)) ?? po.group ?? null

  const patch = (i, changes) => onChange(value.map((po, pi) => (pi === i ? { ...po, ...changes } : po)))

  function add(id) {
    if (!id) return
    onChange([
      ...value,
      {
        optionGroup: id,
        order: value.length,
        required: false,
        labelOverride: '',
        deltaOverrides: null,
        valueOverrides: null,
      },
    ])
  }

  function move(i, by) {
    const next = [...value]
    const target = i + by
    if (target < 0 || target >= next.length) return
    const held = next[i]
    next[i] = next[target]
    next[target] = held
    onChange(next.map((po, pi) => ({ ...po, order: pi })))
  }

  /** This product's own price for one choice and customer type. Blank means the library price. */
  function setChoicePrice(i, code, tier, raw) {
    const all = { ...(value[i].valueOverrides ?? {}) }
    const forChoice = { ...(all[code] ?? {}) }
    if (raw === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0) delete forChoice[tier]
    else {
      forChoice[tier] = Number(raw)
      // With the field's percentages set, trade and corporate follow retail.
      if (tier === 'B2C') Object.assign(forChoice, followRetail(i, code, Number(raw)))
    }
    if (Object.keys(forChoice).length) all[code] = forChoice
    else delete all[code]
    patch(i, { valueOverrides: Object.keys(all).length ? all : null })
  }

  /** The field this one's prices depend on (e.g. Size), with its name and choices — or null. */
  function driverOf(i) {
    const po = value[i]
    if (!po.dependsOn || String(po.dependsOn) === String(po.optionGroup)) return null
    const driverPo = value.find((o) => String(o.optionGroup) === String(po.dependsOn))
    const driverChoices = driverPo ? (groupFor(driverPo)?.values ?? []) : []
    if (!driverChoices.length) return null
    return { label: driverPo.labelOverride || groupFor(driverPo)?.label || 'Other field', choices: driverChoices }
  }

  /** Which of the driving field's choices is showing: the one picked, else the first. */
  function driverCodeFor(i, driver) {
    const picked = driverTabFor[String(value[i].optionGroup)]
    return driver.choices.some((c) => c.code === picked) ? picked : driver.choices[0].code
  }

  /**
   * This field's price for one choice while another field (e.g. Size) has a
   * given choice: for every quantity (pack null) or for one pack. Blank falls back.
   */
  function setDriverPrice(i, driverCode, pack, code, tier, raw) {
    const all = { ...(value[i].driverPrices ?? {}) }
    const every = { ...(all[driverCode]?.every ?? {}) }
    const packsMap = { ...(all[driverCode]?.packs ?? {}) }
    const target = pack === null ? every : { ...(packsMap[pack] ?? {}) }
    const forChoice = { ...(target[code] ?? {}) }

    if (raw === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0) delete forChoice[tier]
    else {
      forChoice[tier] = Number(raw)
      // With the field's percentages set, trade and corporate follow retail.
      if (tier === 'B2C') Object.assign(forChoice, followRetail(i, code, Number(raw)))
    }

    if (Object.keys(forChoice).length) target[code] = forChoice
    else delete target[code]
    if (pack !== null) {
      if (Object.keys(target).length) packsMap[pack] = target
      else delete packsMap[pack]
    }

    const entry = {
      ...(Object.keys(every).length ? { every } : {}),
      ...(Object.keys(packsMap).length ? { packs: packsMap } : {}),
    }
    if (Object.keys(entry).length) all[driverCode] = entry
    else delete all[driverCode]
    patch(i, { driverPrices: Object.keys(all).length ? all : null })
  }

  /** This product's retail price for a choice, falling back to the library's. */
  const retailOf = (po, choice) => po.valueOverrides?.[choice.code]?.B2C ?? readTier(choice.priceDelta, 'B2C')

  /**
   * A field's trade and corporate percentages below retail: as typed, or read
   * back from its saved prices when every priced choice follows one figure.
   */
  function fieldPercents(i) {
    const po = value[i]
    const typed = percentsFor[String(po.optionGroup)]
    if (typed) return typed
    const priced = (groupFor(po)?.values ?? []).filter(scales)
    const pairsFor = (tier) => priced.map((c) => [retailOf(po, c), po.valueOverrides?.[c.code]?.[tier]])
    return { trade: inferPercent(pairsFor('B2B')), corporate: inferPercent(pairsFor('CORPORATE')) }
  }

  /** The trade and corporate prices that follow a retail price just typed, when percentages are set. */
  function followRetail(i, code, retail) {
    const choice = groupFor(value[i])?.values?.find((v) => v.code === code)
    if (!choice || !scales(choice)) return {}
    const pct = fieldPercents(i)
    return tiersFromRetail(retail, pct.trade, pct.corporate, decimalsFor(choice))
  }

  /**
   * Set a field's percentages and fill trade and corporate from retail for
   * every choice priced in rupees: its every-quantity price, and any pack
   * where a retail price was typed for it. Packs without one inherit the
   * every-quantity prices, so they need nothing written.
   */
  function applyFieldPercents(i, next) {
    const po = value[i]
    setPercentsFor((m) => ({ ...m, [String(po.optionGroup)]: next }))
    const valueOverrides = { ...(po.valueOverrides ?? {}) }
    const packOverrides = { ...(po.packOverrides ?? {}) }

    for (const choice of (groupFor(po)?.values ?? []).filter(scales)) {
      const decimals = decimalsFor(choice)
      const everyQty = tiersFromRetail(retailOf(po, choice), next.trade, next.corporate, decimals)
      if (Object.keys(everyQty).length) valueOverrides[choice.code] = { ...(valueOverrides[choice.code] ?? {}), ...everyQty }

      for (const pack of Object.keys(packOverrides)) {
        const own = packOverrides[pack]?.[choice.code]
        const onPack = tiersFromRetail(own?.B2C, next.trade, next.corporate, decimals)
        if (Object.keys(onPack).length) packOverrides[pack] = { ...packOverrides[pack], [choice.code]: { ...own, ...onPack } }
      }
    }

    // Prices set per choice of another field (e.g. per Size) follow the same percentages.
    const driverPrices = { ...(po.driverPrices ?? {}) }
    const priced = (groupFor(po)?.values ?? []).filter(scales)
    for (const [driverCode, prices] of Object.entries(driverPrices)) {
      const every = { ...(prices?.every ?? {}) }
      const packsMap = { ...(prices?.packs ?? {}) }
      for (const choice of priced) {
        const decimals = decimalsFor(choice)
        const own = every[choice.code]
        const filled = tiersFromRetail(own?.B2C, next.trade, next.corporate, decimals)
        if (Object.keys(filled).length) every[choice.code] = { ...own, ...filled }
        for (const pack of Object.keys(packsMap)) {
          const ownOnPack = packsMap[pack]?.[choice.code]
          const onPack = tiersFromRetail(ownOnPack?.B2C, next.trade, next.corporate, decimals)
          if (Object.keys(onPack).length) {
            packsMap[pack] = { ...packsMap[pack], [choice.code]: { ...ownOnPack, ...onPack } }
          }
        }
      }
      driverPrices[driverCode] = {
        ...(Object.keys(every).length ? { every } : {}),
        ...(Object.keys(packsMap).length ? { packs: packsMap } : {}),
      }
    }

    patch(i, {
      valueOverrides: Object.keys(valueOverrides).length ? valueOverrides : null,
      packOverrides: Object.keys(packOverrides).length ? packOverrides : null,
      driverPrices: Object.keys(driverPrices).length ? driverPrices : null,
    })
  }

  /** "₹200 retail → ₹170 trade · ₹156 corporate", from the field's first priced choice. */
  function percentExample(i) {
    const po = value[i]
    const priced = (groupFor(po)?.values ?? []).filter(scales)
    const choice = priced.find((c) => Number(retailOf(po, c)) > 0)
    const retail = choice ? Number(retailOf(po, choice)) : 200
    const decimals = decimalsFor(choice)
    const pct = fieldPercents(i)
    const t = percentOrNull(pct.trade) ?? 15
    const c = percentOrNull(pct.corporate) ?? 22
    return `${rupees(retail)} retail → ${rupees(fromRetail(retail, t, decimals))} trade (${t}% less) · ${rupees(
      fromRetail(retail, c, decimals),
    )} corporate (${c}% less)`
  }

  /**
   * One cell of a field's pack price table. A price sets this choice's price
   * on the pack for one customer type; "–" (or x, na) marks the choice as not
   * offered on that pack, for every customer type; clearing it offers the
   * choice again. Both are written in one change so neither overwrites the other.
   */
  function setPackCell(i, pack, code, tier, raw) {
    const po = value[i]
    const unavailable = { ...(po.packUnavailable ?? {}) }
    const blocked = new Set(unavailable[pack] ?? [])
    const prices = { ...(po.packOverrides ?? {}) }
    const forPack = { ...(prices[pack] ?? {}) }
    const forChoice = { ...(forPack[code] ?? {}) }

    if (NOT_AVAILABLE.test(raw)) {
      blocked.add(code)
      // A price for something not offered on this pack would mean nothing.
      delete forPack[code]
    } else {
      blocked.delete(code)
      if (raw === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0) delete forChoice[tier]
      else {
        forChoice[tier] = Number(raw)
        if (tier === 'B2C') Object.assign(forChoice, followRetail(i, code, Number(raw)))
      }
      if (Object.keys(forChoice).length) forPack[code] = forChoice
      else delete forPack[code]
    }

    if (blocked.size) unavailable[pack] = [...blocked]
    else delete unavailable[pack]
    if (Object.keys(forPack).length) prices[pack] = forPack
    else delete prices[pack]

    patch(i, {
      packUnavailable: Object.keys(unavailable).length ? unavailable : null,
      packOverrides: Object.keys(prices).length ? prices : null,
    })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        The questions a customer answers before adding this to their cart — paper, printing sides, corners,
        lamination and so on. Each choice can carry a price, set once in Product Options.
      </p>

      {value.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface px-5 py-8 text-center">
          <p className="text-sm text-ink-soft">
            No specification fields on this product yet. Add one below — or create the field first in Product
            Options, where the library has ready-made ones for printing.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((po, i) => {
            const group = groupFor(po)
            const choices = group?.values ?? []
            return (
              <div
                key={`${po.optionGroup}-${i}`}
                className="rounded-[var(--radius-card)] border border-line bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink">
                        {po.labelOverride || group?.label || 'Unknown field'}
                      </span>
                      {group?.inputType && <Badge tone="blue">{group.inputType.toLowerCase()}</Badge>}
                      {po.required && <Badge tone="amber">must be answered</Badge>}
                    </div>
                    {choices.length > 0 && (
                      <p className="mt-1 text-xs text-ink-soft">
                        {choices.slice(0, 5).map((c) => c.label).join(' · ')}
                        {choices.length > 5 ? ` · +${choices.length - 5} more` : ''}
                      </p>
                    )}
                    {!group && (
                      <p className="mt-1 text-xs text-red-700">
                        This field is no longer in the library. Remove it, or recreate the field.
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {group && (
                      <Btn
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingField(editingField === String(po.optionGroup) ? null : String(po.optionGroup))
                        }
                      >
                        {editingField === String(po.optionGroup) ? 'Close editor' : 'Edit field'}
                      </Btn>
                    )}
                    <Btn variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                      ↑
                    </Btn>
                    <Btn
                      variant="ghost"
                      size="sm"
                      onClick={() => move(i, 1)}
                      disabled={i === value.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </Btn>
                    <Btn variant="ghost" size="sm" onClick={() => onChange(value.filter((_, pi) => pi !== i))}>
                      Remove
                    </Btn>
                  </div>
                </div>

                {editingField === String(po.optionGroup) && group && (
                  <div className="mt-4">
                    <FieldForm
                      key={group.updatedAt ?? group._id}
                      group={group}
                      onCancel={() => setEditingField(null)}
                      onSaved={(saved) => {
                        onGroupUpdated?.(saved)
                        setEditingField(null)
                      }}
                    />
                  </div>
                )}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={Boolean(po.required)}
                      onChange={(e) => patch(i, { required: e.target.checked })}
                    />
                    Customer must answer this
                  </label>

                  <Field label="Rename on this product" hint="Leave blank to use the library name.">
                    <Input
                      value={po.labelOverride ?? ''}
                      onChange={(e) => patch(i, { labelOverride: e.target.value })}
                      placeholder={group?.label ?? ''}
                      maxLength={120}
                    />
                  </Field>

                  {value.some((o) => o.optionGroup !== po.optionGroup && (groupFor(o)?.values?.length ?? 0) > 0) && (
                    <Field
                      label="Price depends on"
                      hint="Give this field its own prices for each choice of another field — for example, per Size."
                    >
                      <Select value={po.dependsOn ?? ''} onChange={(e) => patch(i, { dependsOn: e.target.value || null })}>
                        <option value="">Nothing — one set of prices</option>
                        {value
                          .filter((o) => o.optionGroup !== po.optionGroup && (groupFor(o)?.values?.length ?? 0) > 0)
                          .map((o) => (
                            <option key={o.optionGroup} value={String(o.optionGroup)}>
                              {o.labelOverride || groupFor(o)?.label}
                            </option>
                          ))}
                      </Select>
                    </Field>
                  )}
                </div>

                {choices.length > 0 && (
                  <div className="mt-4 border-t border-line pt-4">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      Prices on this product
                    </span>
                    <p className="mt-1 text-xs text-ink-soft">
                      {packs.length > 0
                        ? 'Faded figures show what applies when a box is left blank. Set a price under All quantities, then change it for any pack that costs differently. Type – in a pack where a choice is not offered.'
                        : 'Faded figures are the library prices. Type a price to charge differently on this product only — leave it blank to keep the library price.'}
                    </p>

                    {hasLegacyOverride(po) && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] bg-amber-50 px-3 py-2 text-xs text-amber-900">
                        <span>An older setting charges one price for every choice here. Prices typed below take priority.</span>
                        <Btn size="sm" variant="outline" onClick={() => patch(i, { deltaOverrides: null })}>
                          Clear it
                        </Btn>
                      </div>
                    )}

                    {choices.some(scales) && (
                      <FieldPercents
                        value={fieldPercents(i)}
                        example={percentExample(i)}
                        onChange={(next) => applyFieldPercents(i, next)}
                      />
                    )}

                    {driverOf(i) ? (
                      <DriverPrices
                        po={po}
                        fieldIndex={i}
                        choices={choices}
                        packs={packs}
                        driver={driverOf(i)}
                        driverCode={driverCodeFor(i, driverOf(i))}
                        onDriverCode={(code) => setDriverTabFor((m) => ({ ...m, [po.optionGroup]: code }))}
                        tier={tierFor[po.optionGroup] ?? 'B2C'}
                        onTier={(tier) => setTierFor((m) => ({ ...m, [po.optionGroup]: tier }))}
                        setDriverPrice={setDriverPrice}
                      />
                    ) : packs.length > 0 ? (
                      <PackPriceTable
                        po={po}
                        fieldIndex={i}
                        choices={choices}
                        packs={packs}
                        tier={tierFor[po.optionGroup] ?? 'B2C'}
                        onTier={(tier) => setTierFor((m) => ({ ...m, [po.optionGroup]: tier }))}
                        setChoicePrice={setChoicePrice}
                        setPackCell={setPackCell}
                      />
                    ) : (
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full min-w-[34rem] text-sm">
                        <thead>
                          <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                            <th className="pb-2 font-semibold">Choice</th>
                            {TIERS.map((tier) => (
                              <th key={tier} className="pb-2 font-semibold">
                                {TIER_LABELS[tier]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {choices.map((choice) => (
                            <tr key={choice.code} className="border-t border-line">
                              <td className="py-2 pr-3">
                                <span className="text-ink">{choice.label}</span>
                                <span className="ml-1.5 text-xs text-ink-soft">
                                  {DELTA_HINT[choice.deltaType ?? 'FLAT']}
                                </span>
                              </td>
                              {TIERS.map((tier) => {
                                const library = readTier(choice.priceDelta, tier)
                                return (
                                  <td key={tier} className="py-2 pr-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      step="any"
                                      value={po.valueOverrides?.[choice.code]?.[tier] ?? ''}
                                      onChange={(e) => setChoicePrice(i, choice.code, tier, e.target.value)}
                                      placeholder={library === undefined || library === null ? '0' : String(library)}
                                      aria-label={`${TIER_LABELS[tier]} price for ${choice.label}`}
                                      className="w-24 tabular-nums"
                                    />
                                  </td>
                                )
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Field label="Add an existing field" hint="Fields already in your library.">
        <Select value="" onChange={(e) => add(e.target.value)} className="w-auto" disabled={available.length === 0}>
          <option value="">
            {groups.length === 0
              ? 'No fields in your library yet — create one below'
              : available.length === 0
                ? 'Every library field is already on this product'
                : 'Choose a field…'}
          </option>
          {available.map((g) => (
            <option key={g._id} value={String(g._id)}>
              {g.label}
              {g.values?.length ? ` (${g.values.length} choices)` : ''}
            </option>
          ))}
        </Select>
      </Field>

      <FieldForm
        existingCodes={groups.map((g) => g.code)}
        startOpen={groups.length === 0}
        onSaved={(group) => {
          onGroupCreated?.(group)
          add(String(group._id))
        }}
      />
    </div>
  )
}

/**
 * A field's prices on a product sold in packs: one row per choice, one column
 * per pack, for one customer type at a time. "All quantities" is the fallback
 * for any pack left blank, and the library price is the fallback for that.
 */
function PackPriceTable({ po, fieldIndex, choices, packs, tier, onTier, setChoicePrice, setPackCell }) {
  const faded = (n) => (n === undefined || n === null ? '0' : String(n))

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-ink-soft">Prices for</span>
        {TIERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTier(t)}
            aria-pressed={tier === t}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              tier === t ? 'bg-primary text-white' : 'bg-surface text-ink-soft hover:bg-gray-100'
            }`}
          >
            {TIER_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: `${16 + (packs.length + 1) * 7}rem` }}>
          <thead>
            <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
              <th className="pb-2 font-semibold">Choice</th>
              <th className="pb-2 font-semibold">All quantities</th>
              {packs.map((qty) => (
                <th key={qty} className="pb-2 font-semibold tabular-nums">
                  {qty.toLocaleString('en-IN')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {choices.map((choice) => {
              const library = readTier(choice.priceDelta, tier)
              const everyQty = po.valueOverrides?.[choice.code]?.[tier]
              return (
                <tr key={choice.code} className="border-t border-line">
                  <td className="py-2 pr-3">
                    <span className="text-ink">{choice.label}</span>
                    <span className="ml-1.5 text-xs text-ink-soft">{DELTA_HINT[choice.deltaType ?? 'FLAT']}</span>
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      min="0"
                      step="any"
                      value={everyQty ?? ''}
                      onChange={(e) => setChoicePrice(fieldIndex, choice.code, tier, e.target.value)}
                      placeholder={faded(library)}
                      aria-label={`${TIER_LABELS[tier]} price for ${choice.label} at every quantity`}
                      className="w-24 tabular-nums"
                    />
                  </td>
                  {packs.map((qty) => {
                    const unavailable = (po.packUnavailable?.[String(qty)] ?? []).includes(choice.code)
                    return (
                      <td key={qty} className="py-2 pr-2">
                        {/* Text, not number: the cell also accepts "–" for not available. */}
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={unavailable ? '–' : (po.packOverrides?.[String(qty)]?.[choice.code]?.[tier] ?? '')}
                          onChange={(e) => setPackCell(fieldIndex, String(qty), choice.code, tier, e.target.value)}
                          placeholder={faded(everyQty ?? library)}
                          title={
                            unavailable
                              ? 'Not available on this pack — clear it to offer this choice again'
                              : 'Type – if this choice is not available on this pack'
                          }
                          aria-label={`${TIER_LABELS[tier]} price for ${choice.label} on ${qty}${unavailable ? ', not available' : ''}`}
                          className={`w-24 tabular-nums ${unavailable ? 'bg-gray-100 text-center text-ink-soft' : ''}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

/**
 * A field's "trade and corporate are this much below retail" controls. Both
 * are taken off the retail price; the parent does the filling.
 */
function FieldPercents({ value, example, onChange }) {
  return (
    <div className="mt-3 rounded-[var(--radius-card)] bg-surface px-3 py-2">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
        <label className="text-xs text-ink-soft">
          <span className="mb-1 block">Trade below retail by</span>
          <span className="flex items-center gap-1.5 text-sm text-ink">
            <Input
              type="number"
              min="0"
              max="99"
              step="0.5"
              value={value.trade}
              onChange={(e) => onChange({ ...value, trade: e.target.value })}
              placeholder="15"
              aria-label="Trade price, percent below retail"
              className="w-20 tabular-nums"
            />
            %
          </span>
        </label>
        <label className="text-xs text-ink-soft">
          <span className="mb-1 block">Corporate below retail by</span>
          <span className="flex items-center gap-1.5 text-sm text-ink">
            <Input
              type="number"
              min="0"
              max="99"
              step="0.5"
              value={value.corporate}
              onChange={(e) => onChange({ ...value, corporate: e.target.value })}
              placeholder="22"
              aria-label="Corporate price, percent below retail"
              className="w-20 tabular-nums"
            />
            %
          </span>
        </label>
        <p className="text-xs tabular-nums text-ink">
          <span className="text-ink-soft">Example: </span>
          {example}
        </p>
      </div>
      <p className="mt-1.5 text-xs text-ink-soft">
        Fills trade and corporate for every choice priced in rupees, from its retail price. Percentage and multiplier
        choices already scale with the price, so they are left as they are.
      </p>
    </div>
  )
}
