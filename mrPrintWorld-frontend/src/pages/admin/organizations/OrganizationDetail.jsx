import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as api from '../adminApi'
import { useCanDelete } from '../authContext'
import { Field, Input, Select, Btn, Card, Badge, Spinner, ErrorBanner } from '../ui'

export default function OrganizationDetail() {
  const { id } = useParams()
  const [org, setOrg] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    Promise.all([
      api.getOrganization(id),
      api.listProducts({ limit: 100, isActive: 'true' }),
      api.listCategories(),
    ])
      .then(([o, p, c]) => {
        setOrg(o)
        setProducts(p.items)
        setCategories(c)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(load, [load])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }
  if (!org) return <ErrorBanner error={error ?? { message: 'Organization not found' }} />

  return (
    <div className="space-y-5">
      <div>
        <Link to="/admin/organizations" className="text-sm text-ink-soft hover:text-primary">
          ← Organizations
        </Link>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">{org.name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge tone="blue">{org.tierCode}</Badge>
          <Badge tone={org.status === 'ACTIVE' ? 'green' : 'red'}>{org.status.toLowerCase()}</Badge>
          {org.gstin && <code className="text-xs text-ink-soft">{org.gstin}</code>}
        </div>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <AccessPanel org={org} categories={categories} products={products} onSaved={load} onError={setError} />
      <MembersPanel org={org} onSaved={load} onError={setError} />
      <OverridesPanel org={org} products={products} categories={categories} onSaved={load} onError={setError} />
    </div>
  )
}

/* ── Product access ─────────────────────────────────────────────────────── */

function AccessPanel({ org, categories, products, onSaved, onError }) {
  const [mode, setMode] = useState(org.productAccessMode)
  const [cats, setCats] = useState((org.allowedCategories ?? []).map((c) => String(c._id ?? c)))
  const [prods, setProds] = useState((org.allowedProducts ?? []).map((p) => String(p._id ?? p)))
  const [busy, setBusy] = useState(false)

  const leafCategories = categories.filter((c) => {
    const parentIds = new Set(categories.map((x) => String(x.parent)).filter(Boolean))
    return !parentIds.has(String(c._id))
  })

  async function save() {
    setBusy(true)
    try {
      await api.updateOrganization(org.id, {
        productAccessMode: mode,
        ...(mode === 'CATEGORY_ALLOWLIST' ? { allowedCategories: cats } : {}),
        ...(mode === 'ALLOWLIST' ? { allowedProducts: prods } : {}),
      })
      onSaved()
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  const toggle = (list, setList, id) =>
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  return (
    <Card
      title="Product access"
      description="Which part of the catalogue this organization's staff can see."
      actions={
        <Btn size="sm" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save access'}
        </Btn>
      }
    >
      <Field label="Access mode">
        <Select value={mode} onChange={(e) => setMode(e.target.value)} className="sm:w-72">
          <option value="ALL">Full catalogue</option>
          <option value="CATEGORY_ALLOWLIST">Selected categories only</option>
          <option value="ALLOWLIST">Selected products only</option>
        </Select>
      </Field>

      {mode === 'CATEGORY_ALLOWLIST' && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-ink-soft">
            Products added to these categories later become visible automatically — which is usually
            what a contract means, and why this is easier to maintain than a product list.
          </p>
          <div className="flex flex-wrap gap-2 rounded-[var(--radius-card)] border border-line p-3">
            {leafCategories.map((c) => {
              const on = cats.includes(String(c._id))
              return (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => toggle(cats, setCats, String(c._id))}
                  className={`rounded-[var(--radius-card)] border px-3 py-1.5 text-xs font-medium transition-colors ${
                    on ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink-soft hover:bg-gray-50'
                  }`}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {mode === 'ALLOWLIST' && (
        <div className="mt-4 max-h-72 overflow-y-auto rounded-[var(--radius-card)] border border-line p-3">
          {products.map((p) => (
            <label key={p._id} className="flex items-center gap-2 py-1 text-sm">
              <input
                type="checkbox"
                checked={prods.includes(String(p._id))}
                onChange={() => toggle(prods, setProds, String(p._id))}
              />
              {p.name}
            </label>
          ))}
        </div>
      )}

      {mode !== 'ALL' && (
        <p className="mt-3 rounded-[var(--radius-card)] bg-amber-50 px-4 py-2 text-xs text-amber-900">
          Restricting access hides everything else from this organization&rsquo;s staff entirely — those
          products return &ldquo;not found&rdquo; rather than appearing and being blocked.
        </p>
      )}
    </Card>
  )
}

/* ── Members ────────────────────────────────────────────────────────────── */

function MembersPanel({ org, onSaved, onError }) {
  const canDelete = useCanDelete()
  const [email, setEmail] = useState('')
  const [orgRole, setOrgRole] = useState('PURCHASER')
  const [busy, setBusy] = useState(false)

  async function add() {
    setBusy(true)
    try {
      await api.addOrgMember(org.id, { email: email.trim().toLowerCase(), orgRole, inheritTier: true })
      setEmail('')
      onSaved()
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  async function remove(m) {
    if (!window.confirm(`Remove ${m.name} from ${org.name}? They return to retail pricing.`)) return
    try {
      await api.removeOrgMember(org.id, m.id)
      onSaved()
    } catch (err) {
      onError(err)
    }
  }

  return (
    <Card title="Staff" description={`${org.members?.length ?? 0} people buy under this account.`}>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Add by email" hint="They must have registered on the site first." className="flex-1 min-w-[16rem]">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="buyer@company.com" />
        </Field>
        <Field label="Role" className="w-40">
          <Select value={orgRole} onChange={(e) => setOrgRole(e.target.value)}>
            <option value="PURCHASER">Purchaser</option>
            <option value="OWNER">Owner</option>
            <option value="ACCOUNTS">Accounts</option>
            <option value="VIEWER">Viewer</option>
          </Select>
        </Field>
        <Btn onClick={add} disabled={busy || !email.trim()}>
          Add
        </Btn>
      </div>

      {org.members?.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold">Priced at</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {org.members.map((m) => (
                <tr key={m.id} className="border-t border-line">
                  <td className="py-2">
                    <span className="block text-ink">{m.name}</span>
                    <span className="text-xs text-ink-soft">{m.email}</span>
                  </td>
                  <td className="py-2 text-ink-soft">{m.orgRole ?? '—'}</td>
                  <td className="py-2">
                    <Badge tone={m.resolvedTier === 'B2C' ? 'neutral' : 'green'}>{m.resolvedTier}</Badge>
                  </td>
                  <td className="py-2 text-right">
                    {canDelete && (
                      <Btn variant="ghost" size="sm" onClick={() => remove(m)}>
                        Remove
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

/* ── Negotiated rates ───────────────────────────────────────────────────── */

function OverridesPanel({ org, products, categories, onSaved, onError }) {
  const canDelete = useCanDelete()
  const [form, setForm] = useState({
    target: 'product',
    product: '',
    category: '',
    overrideType: 'ABSOLUTE',
    value: '',
    baseTier: org.tierCode,
    note: '',
  })
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)

  async function runPreview() {
    if (!form.product || !form.value) return
    try {
      const data = await api.previewOverride({
        productId: form.product,
        tier: org.tierCode,
        overrideType: form.overrideType,
        value: Number(form.value),
        baseTier: form.baseTier,
        quantity: 1,
        width: 4,
        height: 8,
      })
      setPreview(data)
    } catch (err) {
      onError(err)
    }
  }

  async function save() {
    setBusy(true)
    try {
      await api.createPriceOverride({
        scope: 'ORGANIZATION',
        scopeId: org.id,
        ...(form.target === 'product' ? { product: form.product } : { category: form.category }),
        overrideType: form.overrideType,
        value: Number(form.value),
        baseTier: form.baseTier,
        ...(form.note ? { note: form.note } : {}),
      })
      setForm({ ...form, value: '', note: '' })
      setPreview(null)
      onSaved()
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  async function remove(o) {
    if (!window.confirm('Remove this negotiated rate?')) return
    try {
      await api.deletePriceOverride(o.id)
      onSaved()
    } catch (err) {
      onError(err)
    }
  }

  const canSave = form.value && (form.target === 'product' ? form.product : form.category)

  return (
    <Card
      title="Negotiated rates"
      description="Contract pricing for this organization only. The master product is never duplicated."
    >
      {org.overrides?.length > 0 && (
        <div className="mb-5 overflow-x-auto rounded-[var(--radius-card)] border border-line">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="bg-surface text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                <th className="px-3 py-2 font-semibold">Applies to</th>
                <th className="px-3 py-2 font-semibold">Rate</th>
                <th className="px-3 py-2 font-semibold">Note</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {org.overrides.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="px-3 py-2 text-ink">
                    {o.product?.name ?? (o.category ? `All of ${o.category.name}` : 'Every product')}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-ink">
                    {o.overrideType === 'ABSOLUTE' && `₹${o.value}`}
                    {o.overrideType === 'PERCENT_OFF' && `${o.value}% off ${o.baseTier}`}
                    {o.overrideType === 'MARKUP_ON_TIER' && `×${o.value} of ${o.baseTier}`}
                  </td>
                  <td className="px-3 py-2 text-xs text-ink-soft">{o.note ?? '—'}</td>
                  <td className="px-3 py-2 text-right">
                    {canDelete && (
                      <Btn variant="ghost" size="sm" onClick={() => remove(o)}>
                        Remove
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Applies to">
          <Select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}>
            <option value="product">One product</option>
            <option value="category">A whole category</option>
          </Select>
        </Field>

        {form.target === 'product' ? (
          <Field label="Product">
            <Select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
              <option value="">Choose…</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field label="Category" hint="Products added here later inherit this rate automatically.">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Choose…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Field label="Rate type">
          <Select
            value={form.overrideType}
            onChange={(e) => setForm({ ...form, overrideType: e.target.value })}
          >
            <option value="ABSOLUTE">Fixed rate (₹)</option>
            <option value="PERCENT_OFF">Percentage off</option>
            <option value="MARKUP_ON_TIER">Multiplier</option>
          </Select>
        </Field>

        <Field
          label={form.overrideType === 'ABSOLUTE' ? 'Contracted rate (₹)' : form.overrideType === 'PERCENT_OFF' ? 'Discount (%)' : 'Multiplier'}
          required
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="tabular-nums"
            placeholder={form.overrideType === 'ABSOLUTE' ? '158' : form.overrideType === 'PERCENT_OFF' ? '12' : '0.95'}
          />
        </Field>

        <Field label="Note" className="sm:col-span-2">
          <Input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Annual contract 2026"
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Btn variant="outline" onClick={runPreview} disabled={!form.product || !form.value}>
          Preview on a 4×8 ft board
        </Btn>
        <Btn onClick={save} disabled={busy || !canSave}>
          {busy ? 'Saving…' : 'Add rate'}
        </Btn>
      </div>

      {preview && (
        <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-surface p-4">
          <div className="flex flex-wrap gap-8">
            <div>
              <span className="block text-xs uppercase tracking-wider text-ink-soft">Standard</span>
              <span className="font-display text-xl font-bold tabular-nums text-ink-soft line-through">
                {preview.standard.quotable ? `₹${preview.standard.total.toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-ink-soft">Contracted</span>
              <span className="font-display text-xl font-bold tabular-nums text-ink">
                {preview.contracted.quotable ? `₹${preview.contracted.total.toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            {preview.saving !== null && (
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink-soft">They save</span>
                <span className="font-display text-xl font-bold tabular-nums text-green-700">
                  ₹{preview.saving.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Calculated by the same engine that quotes the customer.
          </p>
        </div>
      )}
    </Card>
  )
}
