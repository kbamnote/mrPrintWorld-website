import { useCallback, useEffect, useState } from 'react'
import * as api from '../adminApi'
import { Field, Input, Select, Btn, Card, Badge, Spinner, ErrorBanner, EmptyState } from '../ui'
import { OPTION_PRESETS, PRESET_SECTIONS } from './presets'

const INPUT_TYPES = ['DROPDOWN', 'RADIO', 'CHECKBOX', 'NUMBER', 'DIMENSION', 'TEXT', 'FILE', 'BOOLEAN']
const DELTA_TYPES = ['FLAT', 'PER_SQFT', 'PERCENT', 'MULTIPLIER']
const CHOICE_TYPES = ['DROPDOWN', 'RADIO', 'CHECKBOX']
const TIERS = ['B2C', 'B2B', 'CORPORATE']

/**
 * Reusable option definitions.
 *
 * Options live here rather than on individual products so that "Width" or
 * "ACP Thickness" is defined once and shared, instead of being re-entered on
 * seventy signage products where the definitions would inevitably drift.
 */
export default function OptionGroupList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [library, setLibrary] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    api
      .listOptionGroups()
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  async function remove(group) {
    if (!window.confirm(`Delete option "${group.label}"?`)) return
    try {
      await api.deleteOptionGroup(group._id)
      load()
    } catch (err) {
      setError(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Product Options</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Reusable fields like Width, Thickness or Lighting — defined once, attached to any product.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="outline" onClick={() => setLibrary((open) => !open)}>
            {library ? 'Hide library' : 'Add from library'}
          </Btn>
          <Btn onClick={() => setEditing('new')}>New option</Btn>
        </div>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {library && (
        <Card
          title="Add from the print library"
          description="Ready-made fields for printing work. Clicking one opens the form filled in — set your prices, then save. Nothing is added until you do."
        >
          <div className="space-y-5">
            {PRESET_SECTIONS.map((section) => (
              <div key={section}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">{section}</h3>
                <div className="flex flex-wrap gap-2">
                  {OPTION_PRESETS.filter((p) => p.section === section).map((preset) => {
                    const already = items.some((g) => g.code === preset.code)
                    const priced = preset.values.filter((v) => v.priced).length
                    return (
                      <button
                        key={preset.code}
                        type="button"
                        disabled={already}
                        onClick={() => {
                          setEditing(preset)
                          setLibrary(false)
                        }}
                        className={`rounded-[var(--radius-card)] border px-3 py-2 text-left transition-colors ${
                          already
                            ? 'cursor-not-allowed border-line bg-surface text-ink-soft'
                            : 'border-line bg-white hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        <span className="block text-sm font-medium text-ink">{preset.label}</span>
                        <span className="block text-xs text-ink-soft">
                          {already
                            ? 'already added'
                            : `${preset.values.length} choices${priced ? ` · ${priced} usually priced` : ''}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {editing && (
        <OptionEditor
          group={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
          onError={setError}
        />
      )}

      {items.length === 0 ? (
        <EmptyState
          title="No options yet"
          description="Create one — for example a Width in feet, or an ACP Thickness dropdown."
          action={<Btn onClick={() => setEditing('new')}>New option</Btn>}
        />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-line bg-white">
          {items.map((g) => (
            <div
              key={g._id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-surface/60"
            >
              <div className="min-w-0">
                <span className="block truncate font-medium text-ink">{g.label}</span>
                <code className="text-[0.7rem] text-ink-soft">{g.code}</code>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">{g.inputType.toLowerCase()}</Badge>
                {g.unit && <Badge>{g.unit}</Badge>}
                {g.values?.length > 0 && <Badge>{g.values.length} values</Badge>}
                {g.usedByProducts > 0 && <Badge tone="green">{g.usedByProducts} products</Badge>}
                <Btn variant="ghost" size="sm" onClick={() => setEditing(g)}>
                  Edit
                </Btn>
                <Btn variant="ghost" size="sm" onClick={() => remove(g)}>
                  Delete
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OptionEditor({ group, onCancel, onSaved, onError }) {
  // A library preset arrives shaped like a group but without an id — it is
  // still a NEW option, pre-filled rather than saved.
  const isNew = !group?._id
  const [form, setForm] = useState({
    code: group?.code ?? '',
    label: group?.label ?? '',
    helpText: group?.helpText ?? '',
    inputType: group?.inputType ?? 'DROPDOWN',
    unit: group?.unit ?? '',
    values: group?.values ?? [],
    isActive: group?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)

  const isChoice = CHOICE_TYPES.includes(form.inputType)

  function setValue(i, patch) {
    setForm({ ...form, values: form.values.map((v, vi) => (vi === i ? { ...v, ...patch } : v)) })
  }

  function setDelta(i, tier, raw) {
    const priceDelta = { ...(form.values[i].priceDelta ?? {}) }
    if (raw === '') delete priceDelta[tier]
    else priceDelta[tier] = Number(raw)
    setValue(i, { priceDelta })
  }

  async function save() {
    setSaving(true)
    try {
      const payload = {
        code: form.code.toUpperCase(),
        label: form.label,
        helpText: form.helpText || undefined,
        inputType: form.inputType,
        unit: form.unit || null,
        isActive: form.isActive,
        ...(isChoice
          ? {
              values: form.values.map((v, i) => ({
                code: String(v.code || v.label).toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
                label: v.label,
                order: i,
                deltaType: v.deltaType ?? 'FLAT',
                ...(v.priceDelta && Object.keys(v.priceDelta).length ? { priceDelta: v.priceDelta } : {}),
              })),
            }
          : {}),
      }
      // The code is immutable server-side, so it is never sent on an edit.
      if (!isNew) delete payload.code
      if (isNew) await api.createOptionGroup(payload)
      else await api.updateOptionGroup(group._id, payload)
      onSaved()
    } catch (err) {
      onError(err)
      setSaving(false)
    }
  }

  return (
    <Card
      title={isNew ? 'New option' : `Edit “${group.label}”`}
      actions={
        <>
          <Btn variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn size="sm" onClick={save} disabled={saving || !form.label || (isNew && !form.code)}>
            {saving ? 'Saving…' : 'Save'}
          </Btn>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" required hint="What the customer sees.">
          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="ACP Thickness" />
        </Field>

        <Field
          label="Code"
          required={isNew}
          hint={isNew ? 'UPPER_SNAKE. Permanent once saved.' : 'Cannot be changed — it is referenced by products.'}
        >
          <Input
            value={form.code}
            disabled={!isNew}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="ACP_THICKNESS"
          />
        </Field>

        <Field label="Input type">
          <Select value={form.inputType} onChange={(e) => setForm({ ...form, inputType: e.target.value })}>
            {INPUT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.toLowerCase()}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Unit" hint="ft, mm, sq.ft — leave blank if not a measurement.">
          <Input value={form.unit ?? ''} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        </Field>

        <Field label="Help text" className="sm:col-span-2">
          <Input value={form.helpText} onChange={(e) => setForm({ ...form, helpText: e.target.value })} />
        </Field>
      </div>

      {isChoice && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Choices and their price effect</span>
            <Btn
              variant="outline"
              size="sm"
              onClick={() => setForm({ ...form, values: [...form.values, { code: '', label: '', deltaType: 'FLAT' }] })}
            >
              Add choice
            </Btn>
          </div>

          {form.values.length === 0 ? (
            <p className="text-sm text-ink-soft">No choices yet — a dropdown needs at least one.</p>
          ) : (
            <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="bg-surface text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                    <th className="px-3 py-2 font-semibold">Choice</th>
                    <th className="px-3 py-2 font-semibold">Effect</th>
                    {TIERS.map((t) => (
                      <th key={t} className="px-3 py-2 font-semibold">
                        {t}
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {form.values.map((v, i) => (
                    <tr key={i} className="border-t border-line">
                      <td className="px-3 py-2">
                        <Input value={v.label} onChange={(e) => setValue(i, { label: e.target.value })} placeholder="3mm" />
                      </td>
                      <td className="px-3 py-2">
                        <Select
                          value={v.deltaType ?? 'FLAT'}
                          onChange={(e) => setValue(i, { deltaType: e.target.value })}
                          className="w-32"
                        >
                          {DELTA_TYPES.map((d) => (
                            <option key={d} value={d}>
                              {d.toLowerCase().replace('_', ' ')}
                            </option>
                          ))}
                        </Select>
                      </td>
                      {TIERS.map((t) => (
                        <td key={t} className="px-3 py-2">
                          <Input
                            type="number"
                            value={v.priceDelta?.[t] ?? ''}
                            onChange={(e) => setDelta(i, t, e.target.value)}
                            className="w-20 tabular-nums"
                            placeholder="—"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right">
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => setForm({ ...form, values: form.values.filter((_, vi) => vi !== i) })}
                        >
                          Remove
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-2 text-xs text-ink-soft">
            A blank tier means that choice adds nothing for that customer type — it never borrows another
            tier&rsquo;s figure.
          </p>
        </div>
      )}
    </Card>
  )
}
