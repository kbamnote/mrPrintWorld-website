import { useState } from 'react'
import * as api from '../adminApi'
import { Field, Input, Select, Btn, ErrorBanner } from '../ui'
import { OPTION_PRESETS, PRESET_SECTIONS } from '../options/presets'

const TIERS = ['B2C', 'B2B', 'CORPORATE']

/** How a choice changes the price, in words that read at a glance. */
const DELTA_LABELS = {
  FLAT: '+ ₹ amount',
  PERCENT: '+ % of price',
  PER_SQFT: '+ ₹ per sq.ft',
  MULTIPLIER: '× multiply by',
}

const blankChoice = () => ({ code: null, label: '', deltaType: 'FLAT', prices: {} })

/** UPPER_SNAKE from a label: "Paper type" becomes "PAPER_TYPE". */
function snake(text) {
  return String(text ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/** A field code the server accepts (letter first, 2-40 chars) that no other field has. */
function fieldCode(label, preferred, taken) {
  if (preferred && !taken.has(preferred)) return preferred
  let base = snake(label).slice(0, 34)
  if (!/^[A-Z]/.test(base)) base = `FIELD_${base}`.slice(0, 34)
  if (base.length < 2) base = 'FIELD'
  let code = base
  for (let n = 2; taken.has(code); n += 1) code = `${base}_${n}`
  return code
}

/** Unique codes for the choices within one field. */
function choiceCodes(choices) {
  const used = new Set()
  return choices.map((c) => {
    const base = c.code || snake(c.label).slice(0, 55) || 'CHOICE'
    let code = base
    for (let n = 2; used.has(code); n += 1) code = `${base}_${n}`
    used.add(code)
    return code
  })
}

/**
 * Create a specification field without leaving the product.
 *
 * The field goes into the shared library straight away (so any other product
 * can reuse it) and is attached to this product. Start blank, or from the
 * print library, where the name and choices arrive filled in.
 */
export default function NewFieldForm({ existingCodes = [], startOpen = false, onCreated }) {
  const [open, setOpen] = useState(startOpen)
  const [presetCode, setPresetCode] = useState(null)
  const [label, setLabel] = useState('')
  const [inputType, setInputType] = useState('RADIO')
  const [helpText, setHelpText] = useState('')
  const [choices, setChoices] = useState([blankChoice(), blankChoice()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const taken = new Set(existingCodes)

  function reset() {
    setPresetCode(null)
    setLabel('')
    setInputType('RADIO')
    setHelpText('')
    setChoices([blankChoice(), blankChoice()])
    setError(null)
  }

  function applyPreset(code) {
    const preset = OPTION_PRESETS.find((p) => p.code === code)
    if (!preset) return
    setPresetCode(preset.code)
    setLabel(preset.label)
    setInputType(preset.inputType)
    setHelpText(preset.helpText ?? '')
    setChoices(
      preset.values.map((v) => ({ code: v.code, label: v.label, deltaType: v.deltaType ?? 'FLAT', prices: {} })),
    )
  }

  const setChoice = (i, patch) => setChoices((list) => list.map((c, ci) => (ci === i ? { ...c, ...patch } : c)))

  const setPrice = (i, tier, raw) =>
    setChoices((list) =>
      list.map((c, ci) => {
        if (ci !== i) return c
        const prices = { ...c.prices }
        if (raw === '') delete prices[tier]
        else prices[tier] = raw
        return { ...c, prices }
      }),
    )

  const named = choices.filter((c) => c.label.trim())
  const canSave = Boolean(label.trim()) && named.length >= 2 && !saving

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const codes = choiceCodes(named)
      const created = await api.createOptionGroup({
        code: fieldCode(label, presetCode, taken),
        label: label.trim(),
        inputType,
        ...(helpText.trim() ? { helpText: helpText.trim() } : {}),
        values: named.map((c, i) => {
          const priceDelta = Object.fromEntries(
            Object.entries(c.prices)
              .filter(([, raw]) => raw !== '' && Number.isFinite(Number(raw)) && Number(raw) >= 0)
              .map(([tier, raw]) => [tier, Number(raw)]),
          )
          return {
            code: codes[i],
            label: c.label.trim(),
            order: i,
            deltaType: c.deltaType,
            ...(Object.keys(priceDelta).length ? { priceDelta } : {}),
          }
        }),
      })
      onCreated(created)
      reset()
      setOpen(false)
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-line px-4 py-3">
        <Btn variant="outline" size="sm" onClick={() => setOpen(true)}>
          + Create a new field
        </Btn>
        <span className="text-xs text-ink-soft">
          Not in the list? Make it here — it is saved to the library for other products too.
        </span>
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-primary/40 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-ink">Create a new field</h3>
        <Btn
          variant="ghost"
          size="sm"
          onClick={() => {
            reset()
            setOpen(false)
          }}
        >
          Cancel
        </Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field label="Start from the print library" hint="Optional — fills in the name and choices for you.">
          <Select value={presetCode ?? ''} onChange={(e) => (e.target.value ? applyPreset(e.target.value) : reset())}>
            <option value="">Blank field</option>
            {PRESET_SECTIONS.map((section) => (
              <optgroup key={section} label={section}>
                {OPTION_PRESETS.filter((p) => p.section === section).map((p) => (
                  <option key={p.code} value={p.code} disabled={taken.has(p.code)}>
                    {p.label}
                    {taken.has(p.code) ? ' (already in the library)' : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>

        <Field label="Field name" required hint="What the customer sees.">
          <Input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={120} placeholder="Printing sides" />
        </Field>

        <Field label="Shown as">
          <Select value={inputType} onChange={(e) => setInputType(e.target.value)}>
            <option value="RADIO">Buttons — best for 2 to 4 choices</option>
            <option value="DROPDOWN">Dropdown — best for a longer list</option>
          </Select>
        </Field>

        <Field label="Help text" hint="Optional, shown under the field.">
          <Input value={helpText} onChange={(e) => setHelpText(e.target.value)} maxLength={300} />
        </Field>
      </div>

      <div className="mt-5">
        <span className="block text-sm font-medium text-ink">Choices</span>
        <span className="block text-xs text-ink-soft">Leave the prices blank for a choice that costs nothing extra.</span>

        <div className="mt-2 space-y-2">
          {choices.map((c, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2 rounded-[var(--radius-card)] bg-surface p-2">
              <label className="min-w-[10rem] flex-1 text-xs text-ink-soft">
                <span className="mb-1 block font-medium text-ink">Choice {i + 1}</span>
                <Input
                  value={c.label}
                  onChange={(e) => setChoice(i, { label: e.target.value })}
                  maxLength={120}
                  placeholder={i === 0 ? 'Single side' : i === 1 ? 'Both sides' : ''}
                />
              </label>
              <label className="text-xs text-ink-soft">
                <span className="mb-1 block font-medium text-ink">Price change</span>
                <Select value={c.deltaType} onChange={(e) => setChoice(i, { deltaType: e.target.value })} className="w-auto">
                  {Object.entries(DELTA_LABELS).map(([type, text]) => (
                    <option key={type} value={type}>
                      {text}
                    </option>
                  ))}
                </Select>
              </label>
              {TIERS.map((tier) => (
                <label key={tier} className="text-xs text-ink-soft">
                  <span className="mb-1 block font-medium text-ink">{tier}</span>
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    value={c.prices[tier] ?? ''}
                    onChange={(e) => setPrice(i, tier, e.target.value)}
                    placeholder={c.deltaType === 'MULTIPLIER' ? '1' : '0'}
                    className="w-24 tabular-nums"
                  />
                </label>
              ))}
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => setChoices((list) => list.filter((_, ci) => ci !== i))}
                disabled={choices.length <= 2}
                aria-label={`Remove choice ${i + 1}`}
              >
                Remove
              </Btn>
            </div>
          ))}
        </div>

        <Btn variant="outline" size="sm" className="mt-2" onClick={() => setChoices((list) => [...list, blankChoice()])}>
          + Add choice
        </Btn>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <Btn onClick={save} disabled={!canSave}>
          {saving ? 'Creating…' : 'Create field and add to this product'}
        </Btn>
        <span className="text-xs text-ink-soft">
          {named.length < 2
            ? 'Give it at least two choices.'
            : 'Saved to your field library straight away — press Save at the top to keep it on this product.'}
        </span>
      </div>
    </div>
  )
}
