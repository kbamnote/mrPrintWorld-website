import { Field, Input, Select, Btn, Badge } from '../ui'

const TIERS = ['B2C', 'B2B', 'CORPORATE']

/**
 * Which specification fields this product asks the customer, in what order.
 *
 * The fields themselves live in the shared library (Product Options), so
 * "Paper / card stock" is defined once and reused across every product. Here
 * you only choose which ones apply, whether they must be answered, and
 * whether this product charges differently for them.
 */
export default function OptionsTab({ value = [], groups = [], onChange }) {
  const attachedIds = new Set(value.map((po) => String(po.optionGroup)))
  const available = groups.filter((g) => !attachedIds.has(String(g._id)) && g.isActive !== false)

  const groupFor = (po) => groups.find((g) => String(g._id) === String(po.optionGroup)) ?? po.group ?? null

  const patch = (i, changes) => onChange(value.map((po, pi) => (pi === i ? { ...po, ...changes } : po)))

  function add(id) {
    if (!id) return
    onChange([
      ...value,
      { optionGroup: id, order: value.length, required: false, labelOverride: '', deltaOverrides: null },
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

  function setOverride(i, tier, raw) {
    const deltaOverrides = { ...(value[i].deltaOverrides ?? {}) }
    if (raw === '') delete deltaOverrides[tier]
    else deltaOverrides[tier] = Number(raw)
    patch(i, { deltaOverrides: Object.keys(deltaOverrides).length ? deltaOverrides : null })
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
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Charge differently on this product
                  </span>
                  <p className="mt-1 text-xs text-ink-soft">
                    Replaces the library price for <strong>every</strong> choice in this field, on this product
                    only. Leave blank to use the library prices.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {TIERS.map((tier) => (
                      <label key={tier} className="text-xs text-ink-soft">
                        <span className="mb-1 block font-medium text-ink">{tier}</span>
                        <Input
                          type="number"
                          value={po.deltaOverrides?.[tier] ?? ''}
                          onChange={(e) => setOverride(i, tier, e.target.value)}
                          placeholder="library"
                          className="w-28 tabular-nums"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Field label="Add a specification field" hint="Fields come from the shared library.">
        <Select value="" onChange={(e) => add(e.target.value)} className="w-auto" disabled={available.length === 0}>
          <option value="">{available.length === 0 ? 'Every field is already added' : 'Choose a field…'}</option>
          {available.map((g) => (
            <option key={g._id} value={String(g._id)}>
              {g.label}
              {g.values?.length ? ` (${g.values.length} choices)` : ''}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  )
}
