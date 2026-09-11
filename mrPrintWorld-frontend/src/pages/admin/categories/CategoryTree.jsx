import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../adminApi'
import { Input, Select, Btn, Badge, Spinner, ErrorBanner, EmptyState } from '../ui'

/**
 * Categories → subcategories → products, managed from one screen.
 *
 * Deliberately minimal: a category is a NAME. Slug, sort order and the rest
 * are derived server-side (slug from the name, order = end of its siblings),
 * so creating one is type-and-Enter.
 *
 * What the website shows follows directly from this tree: a category appears
 * on the storefront once it holds at least one live product, and its
 * subcategories appear beneath it the same way.
 */
export default function CategoryTree() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(null) // 'root' | parent id
  const [editingId, setEditingId] = useState(null)

  const load = useCallback(
    () =>
      api
        .listCategories()
        .then(setItems)
        .catch(setError)
        .finally(() => setLoading(false)),
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
  const roots = items.filter((c) => !c.parent).sort(byOrder)
  const childrenOf = (id) => items.filter((c) => String(c.parent) === String(id)).sort(byOrder)

  async function create(name, parent) {
    const created = await api.createCategory({ name, parent })
    await load()
    return created
  }

  async function remove(cat) {
    // The API refuses when a category still holds products or subcategories,
    // and says which — surface that rather than a generic error.
    if (!window.confirm(`Delete "${cat.name}"?`)) return
    try {
      await api.deleteCategory(cat._id)
      await load()
    } catch (err) {
      setError(err)
    }
  }

  const addProduct = (cat) => navigate(`/admin/products/new?category=${cat._id}`)

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
            {roots.length} categories · {items.length - roots.length} subcategories. A category shows on
            the website once it has at least one live product.
          </p>
        </div>
        <Btn onClick={() => setAdding('root')}>New category</Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      {adding === 'root' && (
        <div className="rounded-[var(--radius-lg)] border border-primary/40 bg-white p-4">
          <NameForm
            placeholder="Category name, e.g. Signage"
            submitLabel="Create category"
            onCancel={() => setAdding(null)}
            onError={setError}
            onSubmit={async (name) => {
              const created = await create(name, null)
              // Straight on to its subcategories — the usual next step.
              setAdding(String(created._id))
            }}
          />
        </div>
      )}

      {roots.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create a category, then add subcategories and products inside it."
        />
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-line bg-white">
          {roots.map((root) => {
            const children = childrenOf(root._id)
            return (
              <div key={root._id} className="border-b border-line last:border-0">
                {editingId === String(root._id) ? (
                  <EditRow
                    cat={root}
                    onCancel={() => setEditingId(null)}
                    onError={setError}
                    onSaved={async () => {
                      setEditingId(null)
                      await load()
                    }}
                  />
                ) : (
                  <Row
                    cat={root}
                    onAddSub={() => setAdding(String(root._id))}
                    onAddProduct={() => addProduct(root)}
                    onEdit={() => setEditingId(String(root._id))}
                    onDelete={() => remove(root)}
                  />
                )}

                {children.map((child) =>
                  editingId === String(child._id) ? (
                    <EditRow
                      key={child._id}
                      cat={child}
                      depth={1}
                      roots={roots}
                      onCancel={() => setEditingId(null)}
                      onError={setError}
                      onSaved={async () => {
                        setEditingId(null)
                        await load()
                      }}
                    />
                  ) : (
                    <Row
                      key={child._id}
                      cat={child}
                      depth={1}
                      onAddProduct={() => addProduct(child)}
                      onEdit={() => setEditingId(String(child._id))}
                      onDelete={() => remove(child)}
                    />
                  ),
                )}

                {adding === String(root._id) && (
                  <div className="bg-surface/60 px-4 py-3" style={{ paddingLeft: '2.75rem' }}>
                    <NameForm
                      placeholder={`New subcategory in ${root.name}`}
                      submitLabel="Add subcategory"
                      cancelLabel="Done"
                      keepOpen
                      onCancel={() => setAdding(null)}
                      onError={setError}
                      onSubmit={(name) => create(name, root._id)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Row({ cat, depth = 0, onAddSub, onAddProduct, onEdit, onDelete }) {
  const navigate = useNavigate()
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-surface/60"
      style={{ paddingLeft: `${1 + depth * 1.75}rem` }}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {depth > 0 && <span className="text-ink-soft/50">└</span>}
        <span className={`truncate ${depth === 0 ? 'font-semibold text-ink' : 'text-ink'}`}>{cat.name}</span>
        {cat.productCount > 0 && (
          <button
            type="button"
            onClick={() => navigate(`/admin/products?category=${cat._id}`)}
            title="See these products"
          >
            <Badge tone="blue">
              {cat.productCount} product{cat.productCount === 1 ? '' : 's'}
            </Badge>
          </button>
        )}
        {!cat.isActive ? (
          <Badge tone="neutral">Hidden</Badge>
        ) : (
          cat.liveCount === 0 && (
            <span title="It appears on the website once it has a live product.">
              <Badge tone="amber">Not on website yet</Badge>
            </span>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {onAddSub && (
          <Btn variant="outline" size="sm" onClick={onAddSub}>
            + Subcategory
          </Btn>
        )}
        <Btn variant="outline" size="sm" onClick={onAddProduct}>
          + Product
        </Btn>
        <Btn variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Btn>
        <Btn variant="ghost" size="sm" onClick={onDelete}>
          Delete
        </Btn>
      </div>
    </div>
  )
}

/** One text box. Enter saves, Escape cancels. */
function NameForm({ placeholder, submitLabel, cancelLabel = 'Cancel', keepOpen, onSubmit, onCancel, onError }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await onSubmit(trimmed)
      // Adding several subcategories in a row is the common case — keep the
      // box open and empty for the next one.
      if (keepOpen) setName('')
    } catch (err) {
      onError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
        placeholder={placeholder}
        maxLength={120}
        className="w-full sm:w-80"
      />
      <Btn type="submit" size="sm" disabled={saving || !name.trim()}>
        {saving ? 'Saving…' : submitLabel}
      </Btn>
      <Btn type="button" variant="ghost" size="sm" onClick={onCancel}>
        {cancelLabel}
      </Btn>
    </form>
  )
}

/** Rename, show/hide, and — for a subcategory — move it under another category. */
function EditRow({ cat, depth = 0, roots = [], onCancel, onSaved, onError }) {
  const [name, setName] = useState(cat.name)
  const [isActive, setIsActive] = useState(cat.isActive ?? true)
  const [parent, setParent] = useState(cat.parent ? String(cat.parent) : '')
  const [saving, setSaving] = useState(false)

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const body = { isActive }
      if (name.trim() !== cat.name) body.name = name.trim()
      if (depth > 0 && parent !== String(cat.parent)) body.parent = parent
      await api.updateCategory(cat._id, body)
      await onSaved()
    } catch (err) {
      onError(err)
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={save}
      className="flex flex-wrap items-center gap-3 bg-surface/60 px-4 py-3"
      style={{ paddingLeft: `${1 + depth * 1.75}rem` }}
    >
      <Input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
        maxLength={120}
        className="w-full sm:w-72"
      />
      {depth > 0 && (
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Under
          <Select value={parent} onChange={(e) => setParent(e.target.value)} className="w-auto">
            {roots.map((r) => (
              <option key={r._id} value={String(r._id)}>
                {r.name}
              </option>
            ))}
          </Select>
        </label>
      )}
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Show on website
      </label>
      <div className="flex gap-1">
        <Btn type="submit" size="sm" disabled={saving || !name.trim()}>
          {saving ? 'Saving…' : 'Save'}
        </Btn>
        <Btn type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Btn>
      </div>
    </form>
  )
}
