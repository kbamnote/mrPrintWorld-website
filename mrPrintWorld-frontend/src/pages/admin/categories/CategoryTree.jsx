import { useCallback, useEffect, useState } from 'react'
import * as api from '../adminApi'
import { Field, Input, Select, Btn, Card, Badge, Spinner, ErrorBanner, EmptyState } from '../ui'

export default function CategoryTree() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null) // category object or 'new'

  const load = useCallback(() => {
    setLoading(true)
    api
      .listCategories()
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  // Assemble the flat list into a tree for display.
  const roots = items.filter((c) => !c.parent).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const childrenOf = (id) =>
    items.filter((c) => String(c.parent) === String(id)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  async function remove(cat) {
    // The API refuses when a category still holds products or children, and
    // returns a 409 explaining which — surface that rather than a generic error.
    if (!window.confirm(`Delete "${cat.name}"?`)) return
    try {
      await api.deleteCategory(cat._id)
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
          <h1 className="font-display text-2xl font-bold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {items.length} categories · {roots.length} top level
          </p>
        </div>
        <Btn onClick={() => setEditing('new')}>New category</Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {editing && (
        <CategoryEditor
          category={editing === 'new' ? null : editing}
          categories={items}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
          onError={setError}
        />
      )}

      {roots.length === 0 ? (
        <EmptyState title="No categories yet" description="Create a top-level category to begin." />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-line bg-white">
          {roots.map((root) => (
            <div key={root._id} className="border-b border-line last:border-0">
              <Row cat={root} onEdit={setEditing} onDelete={remove} />
              {childrenOf(root._id).map((child) => (
                <Row key={child._id} cat={child} depth={1} onEdit={setEditing} onDelete={remove} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ cat, depth = 0, onEdit, onDelete }) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-surface/60"
      style={{ paddingLeft: `${1 + depth * 1.75}rem` }}
    >
      <div className="flex min-w-0 items-center gap-3">
        {depth > 0 && <span className="text-ink-soft/50">└</span>}
        <div className="min-w-0">
          <span className={`block truncate ${depth === 0 ? 'font-semibold text-ink' : 'text-ink'}`}>
            {cat.name}
          </span>
          <code className="text-[0.7rem] text-ink-soft">/{cat.slug}</code>
        </div>
        {!cat.isActive && <Badge tone="neutral">hidden</Badge>}
        {cat.productCount > 0 && <Badge tone="blue">{cat.productCount} products</Badge>}
      </div>
      <div className="flex gap-1">
        <Btn variant="ghost" size="sm" onClick={() => onEdit(cat)}>
          Edit
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => onDelete(cat)}>
          Delete
        </Btn>
      </div>
    </div>
  )
}

function CategoryEditor({ category, categories, onCancel, onSaved, onError }) {
  const isNew = !category
  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    parent: category?.parent ? String(category.parent) : '',
    description: category?.description ?? '',
    order: category?.order ?? 0,
    isActive: category?.isActive ?? true,
  })
  const [saving, setSaving] = useState(false)

  // Only roots may be chosen as a parent here — the tree is two levels in the
  // admin UI even though the data model supports more.
  const possibleParents = categories.filter(
    (c) => !c.parent && String(c._id) !== String(category?._id),
  )

  async function save() {
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        parent: form.parent || null,
        description: form.description || undefined,
        order: Number(form.order),
        isActive: form.isActive,
        ...(isNew && form.slug ? { slug: form.slug } : {}),
      }
      if (isNew) await api.createCategory(payload)
      else await api.updateCategory(category._id, payload)
      onSaved()
    } catch (err) {
      onError(err)
      setSaving(false)
    }
  }

  return (
    <Card
      title={isNew ? 'New category' : `Edit “${category.name}”`}
      actions={
        <>
          <Btn variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn size="sm" onClick={save} disabled={saving || !form.name}>
            {saving ? 'Saving…' : 'Save'}
          </Btn>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" required>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>

        <Field label="Parent" hint="Leave empty for a top-level category.">
          <Select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}>
            <option value="">— Top level —</option>
            {possibleParents.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>

        {isNew && (
          <Field label="Slug" hint="Leave blank to generate. Used in browse URLs.">
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto" />
          </Field>
        )}

        <Field label="Sort order" hint="Lower numbers appear first.">
          <Input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            className="tabular-nums"
          />
        </Field>

        <Field label="Description" className="sm:col-span-2">
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Visible on the website
        </label>
      </div>
    </Card>
  )
}
