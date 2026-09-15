import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../adminApi'
import { useCanDelete } from '../authContext'
import { Input, Select, Btn, Badge, Spinner, ErrorBanner, EmptyState, Drawer } from '../ui'
import { ProductEditor } from '../products/ProductForm'
import BulkUpload from './BulkUpload'

/**
 * Categories, subcategories and their products — all managed here.
 *
 * The tree is rendered recursively, so a category can hold a subcategory which
 * holds another, as deep as the business needs. Products are added to the
 * deepest level, which is what keeps the storefront's browse pages meaningful.
 *
 * Each category can carry a photograph; the storefront shows those as the
 * picture tiles customers tap to browse.
 */
export default function CategoryTree() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(null) // 'root' | parent id
  const [editingId, setEditingId] = useState(null)

  const [open, setOpen] = useState(() => new Set()) // categories showing their products
  const [products, setProducts] = useState({}) // category id → { loading, items }
  const [drawer, setDrawer] = useState(null) // { productId } | { category }
  const [bulkFor, setBulkFor] = useState(null) // category being bulk-uploaded into
  const dirtyRef = useRef(false)

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

  const loadProducts = useCallback(async (catId) => {
    setProducts((m) => ({ ...m, [catId]: { items: m[catId]?.items ?? null, loading: true } }))
    try {
      const { items: list } = await api.listProducts({ category: catId, limit: 100 })
      setProducts((m) => ({ ...m, [catId]: { items: list, loading: false } }))
    } catch (err) {
      setProducts((m) => ({ ...m, [catId]: { items: m[catId]?.items ?? [], loading: false } }))
      setError(err)
    }
  }, [])

  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
  const roots = items.filter((c) => !c.parent).sort(byOrder)
  const childrenOf = (id) => items.filter((c) => String(c.parent) === String(id)).sort(byOrder)

  /** Every category beneath this one — a category may never move inside itself. */
  function descendantIds(id, acc = new Set()) {
    for (const child of childrenOf(id)) {
      acc.add(String(child._id))
      descendantIds(child._id, acc)
    }
    return acc
  }

  const isLeaf = (catId) => childrenOf(catId).length === 0

  /**
   * Open or close a category. Open shows what is inside it: its subcategories,
   * or — at the deepest level — its products. Closing also closes everything
   * inside, so reopening it starts tidy instead of springing open three levels.
   */
  function toggleOpen(catId) {
    const next = new Set(open)
    if (next.has(catId)) {
      const inner = descendantIds(catId)
      next.delete(catId)
      for (const innerId of inner) next.delete(innerId)
      // A half-typed subcategory inside a closed branch would float out of place.
      if (adding && (adding === catId || inner.has(adding))) setAdding(null)
    } else {
      next.add(catId)
      if (isLeaf(catId)) loadProducts(catId)
    }
    setOpen(next)
  }

  /** Open a category if it is not already — used before adding inside it. */
  function expand(catId) {
    if (open.has(catId)) return
    setOpen((prev) => new Set(prev).add(catId))
    if (isLeaf(catId)) loadProducts(catId)
  }

  function collapseAll() {
    setOpen(new Set())
    setAdding(null)
  }

  /** After any product change: fresh counts, and every open product list reloaded. */
  async function refreshProducts(alsoOpen) {
    const ids = new Set(open)
    if (alsoOpen) ids.add(alsoOpen)
    if (alsoOpen && !open.has(alsoOpen)) setOpen(ids)
    await Promise.all([load(), ...[...ids].filter(isLeaf).map(loadProducts)])
  }

  async function create(name, parent) {
    const created = await api.createCategory({ name, parent })
    await load()
    return created
  }

  async function removeCategory(cat) {
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

  async function toggleLive(product) {
    try {
      await api.updateProduct(product._id, { isActive: !product.isActive })
      await refreshProducts()
    } catch (err) {
      setError(err)
    }
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await api.deleteProduct(product._id)
      await refreshProducts()
    } catch (err) {
      setError(err)
    }
  }

  const closeDrawer = useCallback(() => {
    if (dirtyRef.current && !window.confirm('Close without saving your changes?')) return
    dirtyRef.current = false
    setDrawer(null)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  const ctx = {
    items,
    childrenOf,
    descendantIds,
    open,
    products,
    adding,
    editingId,
    setAdding,
    setEditingId,
    setError,
    toggleOpen,
    expand,
    create,
    load,
    removeCategory,
    toggleLive,
    removeProduct,
    openProduct: (p) => setDrawer({ productId: String(p._id) }),
    addProduct: (catId) => setDrawer({ category: catId }),
    bulkUpload: (cat) => setBulkFor(cat),
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categories &amp; products</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {roots.length} top level · {items.length - roots.length} inside them. Open one to see and add its
            products. Every category shows on the website unless you hide it, even before it has products.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="outline" onClick={collapseAll} disabled={open.size === 0}>
            Collapse all
          </Btn>
          <Btn onClick={() => setAdding('root')}>New category</Btn>
        </div>
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
              // Straight on to its subcategories, with the category open to show them.
              expand(String(created._id))
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
          {roots.map((root) => (
            <div key={root._id} className="border-b border-line last:border-0">
              <CategoryNode cat={root} depth={0} ctx={ctx} />
            </div>
          ))}
        </div>
      )}

      <Drawer open={Boolean(drawer)} onClose={closeDrawer}>
        {drawer && (
          <div className="p-5">
            <ProductEditor
              key={drawer.productId ?? 'new'}
              productId={drawer.productId}
              presetCategory={drawer.category}
              onClose={closeDrawer}
              onDirtyChange={(dirty) => {
                dirtyRef.current = dirty
              }}
              onSaved={() => refreshProducts(drawer.category)}
            />
          </div>
        )}
      </Drawer>

      <Drawer open={Boolean(bulkFor)} onClose={() => setBulkFor(null)}>
        {bulkFor && (
          <div className="p-5">
            <BulkUpload
              key={bulkFor._id}
              category={bulkFor}
              items={items}
              onClose={() => setBulkFor(null)}
              onImported={() => refreshProducts()}
            />
          </div>
        )}
      </Drawer>
    </div>
  )
}

/**
 * One category, its products, and everything nested beneath it. Renders
 * itself for each child, so the tree can go as deep as it needs to.
 */
function CategoryNode({ cat, depth, ctx }) {
  const id = String(cat._id)
  const children = ctx.childrenOf(cat._id)
  const isOpen = ctx.open.has(id)

  return (
    <div>
      {ctx.editingId === id ? (
        <EditRow
          cat={cat}
          depth={depth}
          items={ctx.items}
          blocked={ctx.descendantIds(cat._id)}
          onCancel={() => ctx.setEditingId(null)}
          onError={ctx.setError}
          onSaved={async () => {
            ctx.setEditingId(null)
            await ctx.load()
          }}
        />
      ) : (
        <Row
          cat={cat}
          depth={depth}
          productsOpen={isOpen}
          hasChildren={children.length > 0}
          childCount={children.length}
          onToggleProducts={() => ctx.toggleOpen(id)}
          onAddSub={() => {
            ctx.expand(id)
            ctx.setAdding(id)
          }}
          onAddProduct={children.length === 0 ? () => ctx.addProduct(id) : undefined}
          onBulk={() => ctx.bulkUpload(cat)}
          onEdit={() => ctx.setEditingId(id)}
          onDelete={() => ctx.removeCategory(cat)}
        />
      )}

      {/* Everything inside a category shows only while it is open: its
          subcategories, or — at the deepest level — its products. */}
      {isOpen && children.length === 0 && (
        <ProductPanel
          state={ctx.products[id]}
          depth={depth}
          canAdd
          onAdd={() => ctx.addProduct(id)}
          onEdit={ctx.openProduct}
          onToggleLive={ctx.toggleLive}
          onDelete={ctx.removeProduct}
        />
      )}

      {isOpen &&
        children.map((child) => <CategoryNode key={child._id} cat={child} depth={depth + 1} ctx={ctx} />)}

      {ctx.adding === id && (
        <div className="bg-surface/60 px-4 py-3" style={{ paddingLeft: `${2.75 + depth * 1.75}rem` }}>
          <NameForm
            placeholder={`New subcategory in ${cat.name}`}
            submitLabel="Add subcategory"
            cancelLabel="Done"
            keepOpen
            onCancel={() => ctx.setAdding(null)}
            onError={ctx.setError}
            onSubmit={(name) => ctx.create(name, cat._id)}
          />
        </div>
      )}
    </div>
  )
}

/** A category's picture, or a lettered placeholder when it has none. */
function Thumb({ cat, size = 'h-9 w-9' }) {
  if (cat.image?.url) {
    return (
      <img
        src={cat.image.url}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`${size} shrink-0 rounded object-cover`}
      />
    )
  }
  return (
    <span
      className={`${size} grid shrink-0 place-items-center rounded bg-primary/10 text-xs font-semibold text-primary`}
      aria-hidden="true"
    >
      {cat.name.charAt(0).toUpperCase()}
    </span>
  )
}

function Row({
  cat,
  depth = 0,
  productsOpen,
  hasChildren,
  childCount = 0,
  onToggleProducts,
  onAddSub,
  onAddProduct,
  onBulk,
  onEdit,
  onDelete,
}) {
  const canDelete = useCanDelete()
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-surface/60"
      style={{ paddingLeft: `${1 + depth * 1.75}rem` }}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {depth > 0 && <span className="text-ink-soft/50">└</span>}
        <button
          type="button"
          onClick={onToggleProducts}
          aria-expanded={productsOpen}
          className="flex min-w-0 items-center gap-2 text-left"
        >
          <span
            className={`inline-block text-xs text-ink-soft transition-transform ${productsOpen ? 'rotate-90' : ''}`}
            aria-hidden="true"
          >
            ▶
          </span>
          <Thumb cat={cat} />
          <span className={`truncate hover:text-primary ${depth === 0 ? 'font-semibold text-ink' : 'text-ink'}`}>
            {cat.name}
          </span>
          {hasChildren && (
            <Badge tone="neutral">
              {childCount} subcategor{childCount === 1 ? 'y' : 'ies'}
            </Badge>
          )}
          <Badge tone={cat.productCount > 0 ? 'blue' : 'neutral'}>
            {cat.productCount} product{cat.productCount === 1 ? '' : 's'}
          </Badge>
        </button>
        {!cat.image?.url && <Badge tone="amber">No picture</Badge>}
        {!cat.isActive ? (
          <Badge tone="neutral">Hidden from website</Badge>
        ) : (
          cat.liveCount === 0 && (
            <span title="Shown on the website, but customers will find it empty until a product is live.">
              <Badge tone="amber">No live products</Badge>
            </span>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        <Btn variant="outline" size="sm" onClick={onAddSub}>
          + Subcategory
        </Btn>
        {onAddProduct && (
          <Btn variant="outline" size="sm" onClick={onAddProduct}>
            + Product
          </Btn>
        )}
        <Btn variant="outline" size="sm" onClick={onBulk} title="Add or change many products from an Excel sheet">
          Bulk upload
        </Btn>
        <Btn variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Btn>
        {canDelete && (
          <Btn variant="ghost" size="sm" onClick={onDelete} disabled={hasChildren && cat.productCount > 0}>
            Delete
          </Btn>
        )}
      </div>
    </div>
  )
}

const money = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`

/** The retail price as the team thinks of it, or null when there is none. */
function priceLabel(p) {
  if (p.pricingModel === 'QUOTE_ONLY' || !p.pricing) return null
  if (p.pricingModel === 'AREA') {
    const rate = p.pricing.rates?.B2C
    return rate ? `${money(rate)} per sq.ft` : null
  }
  if (p.pricingModel === 'FIXED') {
    const amount = p.pricing.amounts?.B2C
    return amount ? `${money(amount)} each` : null
  }
  return 'Quantity slab pricing'
}

function ProductPanel({ state, depth, canAdd, onAdd, onEdit, onToggleLive, onDelete }) {
  const indent = { paddingLeft: `${2.75 + depth * 1.75}rem`, paddingRight: '1rem' }

  if (!state || (state.loading && !state.items)) {
    return (
      <div className="border-t border-dashed border-line bg-surface/40 py-4" style={indent}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className="border-t border-dashed border-line bg-surface/40 py-2" style={indent}>
      {state.items.length === 0 ? (
        <p className="py-2 text-sm text-ink-soft">
          No products here yet.{' '}
          {canAdd ? (
            <button type="button" onClick={onAdd} className="font-medium text-primary hover:underline">
              Add the first one
            </button>
          ) : (
            'Add them inside a subcategory.'
          )}
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {state.items.map((p) => (
            <ProductItem
              key={p._id}
              p={p}
              onEdit={() => onEdit(p)}
              onToggleLive={() => onToggleLive(p)}
              onDelete={() => onDelete(p)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function ProductItem({ p, onEdit, onToggleLive, onDelete }) {
  const canDelete = useCanDelete()
  const image = p.images?.find((i) => i.isPrimary)?.url ?? p.images?.[0]?.url ?? p.legacyImageUrl
  const price = priceLabel(p)

  return (
    <li className="flex flex-wrap items-center gap-3 py-2">
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="h-11 w-11 shrink-0 overflow-hidden rounded bg-gray-100">
          {image && (
            <img src={image} alt="" referrerPolicy="no-referrer" loading="lazy" className="h-full w-full object-cover" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink hover:text-primary">{p.name}</span>
          <span className="block text-xs text-ink-soft">{price ?? 'No price — customers contact you'}</span>
        </span>
      </button>
      <div className="flex flex-wrap items-center gap-1">
        {!p.images?.length && <Badge tone="amber">No photo</Badge>}
        <Badge tone={p.isActive ? 'green' : 'neutral'}>{p.isActive ? 'Live' : 'Draft'}</Badge>
        <Btn variant="outline" size="sm" onClick={onToggleLive}>
          {p.isActive ? 'Unpublish' : 'Make live'}
        </Btn>
        <Btn variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Btn>
        {canDelete && (
          <Btn variant="ghost" size="sm" onClick={onDelete}>
            Delete
          </Btn>
        )}
      </div>
    </li>
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
      // Adding several in a row is the common case — keep the box open.
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

/** Upload, replace or remove the picture customers see on the browse page. */
function PictureField({ value, alt, onChange, onError }) {
  const [busy, setBusy] = useState(false)

  async function upload(file) {
    if (!file) return
    setBusy(true)
    try {
      const img = await api.uploadImage(file)
      onChange({ url: img.url, publicId: img.publicId, alt })
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
        {value?.url && <img src={value.url} alt="" className="h-full w-full object-cover" />}
      </span>
      <div className="min-w-0">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => {
            upload(e.target.files?.[0])
            e.target.value = ''
          }}
          className="block w-full text-xs text-ink-soft file:mr-2 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
        />
        <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
          {busy && <span>Uploading…</span>}
          {value?.url && !busy && (
            <button type="button" onClick={() => onChange(null)} className="underline">
              Remove picture
            </button>
          )}
          {!value?.url && !busy && <span>Square pictures look best.</span>}
        </div>
      </div>
    </div>
  )
}

/** Rename, add a picture, show or hide, and move a category anywhere in the tree. */
function EditRow({ cat, depth = 0, items, blocked, onCancel, onSaved, onError }) {
  const [name, setName] = useState(cat.name)
  const [isActive, setIsActive] = useState(cat.isActive ?? true)
  const [parent, setParent] = useState(cat.parent ? String(cat.parent) : '')
  const [image, setImage] = useState(cat.image?.url ? cat.image : null)
  const [saving, setSaving] = useState(false)

  // Anywhere except itself and its own descendants.
  const moveTargets = items
    .filter((c) => String(c._id) !== String(cat._id) && !blocked.has(String(c._id)))
    .sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0) || a.name.localeCompare(b.name))

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const body = { isActive, image: image ? { url: image.url, publicId: image.publicId, alt: name } : null }
      if (name.trim() !== cat.name) body.name = name.trim()
      if (parent !== String(cat.parent ?? '')) body.parent = parent || null
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
      className="space-y-3 bg-surface/60 px-4 py-4"
      style={{ paddingLeft: `${1 + depth * 1.75}rem` }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onCancel()}
          maxLength={120}
          className="w-full sm:w-72"
        />
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Inside
          <Select value={parent} onChange={(e) => setParent(e.target.value)} className="w-auto">
            <option value="">— Top level —</option>
            {moveTargets.map((c) => (
              <option key={c._id} value={String(c._id)}>
                {'— '.repeat(c.depth ?? 0)}
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Show on website
        </label>
      </div>

      <PictureField value={image} alt={name} onChange={setImage} onError={onError} />

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
