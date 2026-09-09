import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../adminApi'
import { Field, Input, Select, Btn, Card, Badge, Spinner, ErrorBanner, EmptyState } from '../ui'

export default function OrganizationList() {
  const [state, setState] = useState({ loading: true, items: [], error: null })
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true }))
    api
      .listOrganizations({ limit: 100 })
      .then(({ items }) => setState({ loading: false, items, error: null }))
      .catch((error) => setState({ loading: false, items: [], error }))
  }, [])

  useEffect(load, [load])

  if (state.loading) {
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
          <h1 className="font-display text-2xl font-bold text-ink">Organizations</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Corporate accounts with their own staff, product access and negotiated rates.
          </p>
        </div>
        <Btn onClick={() => setCreating(true)}>New organization</Btn>
      </div>

      <ErrorBanner error={state.error} onDismiss={() => setState((s) => ({ ...s, error: null }))} />

      {creating && (
        <OrgCreateForm
          onCancel={() => setCreating(false)}
          onSaved={() => {
            setCreating(false)
            load()
          }}
          onError={(error) => setState((s) => ({ ...s, error }))}
        />
      )}

      {state.items.length === 0 ? (
        <EmptyState
          title="No organizations yet"
          description="Create one for a corporate client, then add their staff and any agreed rates."
          action={<Btn onClick={() => setCreating(true)}>New organization</Btn>}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-line bg-white">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 font-semibold">Organization</th>
                <th className="px-4 py-3 font-semibold">Tier</th>
                <th className="px-4 py-3 font-semibold">Product access</th>
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Contracts</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.items.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 hover:bg-surface/60">
                  <td className="px-4 py-3">
                    <Link to={`/admin/organizations/${o.id}`} className="font-medium text-ink hover:text-primary">
                      {o.name}
                    </Link>
                    {o.gstin && <code className="mt-0.5 block text-[0.7rem] text-ink-soft">{o.gstin}</code>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="blue">{o.tierCode}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {o.productAccessMode === 'ALL' ? (
                      'Full catalogue'
                    ) : (
                      <Badge tone="amber">
                        {o.productAccessMode === 'ALLOWLIST' ? 'selected products' : 'selected categories'}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink-soft">{o.memberCount}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-soft">
                    {o.overrideCount > 0 ? <Badge tone="green">{o.overrideCount}</Badge> : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={o.status === 'ACTIVE' ? 'green' : o.status === 'SUSPENDED' ? 'red' : 'neutral'}>
                      {o.status.toLowerCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function OrgCreateForm({ onCancel, onSaved, onError }) {
  const [form, setForm] = useState({ name: '', gstin: '', tierCode: 'CORPORATE', contactEmail: '' })
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      await api.createOrganization({
        name: form.name.trim(),
        ...(form.gstin ? { gstin: form.gstin.trim().toUpperCase() } : {}),
        tierCode: form.tierCode,
        ...(form.contactEmail ? { contact: { email: form.contactEmail.trim() } } : {}),
      })
      onSaved()
    } catch (err) {
      onError(err)
      setBusy(false)
    }
  }

  return (
    <Card
      title="New organization"
      actions={
        <>
          <Btn variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn size="sm" onClick={save} disabled={busy || !form.name.trim()}>
            {busy ? 'Creating…' : 'Create'}
          </Btn>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ambuja Cement" />
        </Field>
        <Field label="GSTIN">
          <Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
        </Field>
        <Field label="Pricing tier" hint="Every member is priced at this tier unless given their own.">
          <Select value={form.tierCode} onChange={(e) => setForm({ ...form, tierCode: e.target.value })}>
            <option value="CORPORATE">Corporate</option>
            <option value="B2B">B2B — Trade</option>
            <option value="B2C">B2C — Retail</option>
          </Select>
        </Field>
        <Field label="Contact email">
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
          />
        </Field>
      </div>
      <p className="mt-4 text-xs text-ink-soft">
        Staff are added after creating the organization — they must have registered on the site first.
      </p>
    </Card>
  )
}
