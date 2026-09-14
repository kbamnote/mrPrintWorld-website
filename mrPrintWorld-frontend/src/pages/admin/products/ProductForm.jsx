import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import * as api from '../adminApi'
import { Field, Input, Textarea, Select, Btn, Badge, Spinner, ErrorBanner } from '../ui'
import PricingTab from './PricingTab'
import OptionsTab from './OptionsTab'
import QuantityPacks from './QuantityPacks'

const TABS = ['General', 'Images', 'Pricing', 'Options', 'Visibility', 'SEO']

const EMPTY = {
  name: '',
  slug: '',
  categories: [],
  primaryCategory: '',
  shortDescription: '',
  description: '',
  images: [],
  specifications: [],
  applications: [],
  materials: [],
  sizes: [],
  customization: [],
  pricingModel: 'QUOTE_ONLY',
  purchaseMode: 'QUOTE_ONLY',
  pricing: null,
  options: [],
  visibility: { b2c: true, b2b: true, corporate: true },
  featured: false,
  isActive: false,
  seo: { title: '', description: '' },
  hsnCode: '',
  taxPercent: null,
}

/**
 * Pricing as the API should receive it. Quantity packs still being typed — an
 * empty quantity, or the same one listed twice — are dropped rather than
 * failing the whole save (the server refuses overlapping quantities).
 */
function cleanPricing(form) {
  const pricing = form.pricing
  if (!pricing) return undefined
  if (form.pricingModel !== 'SLAB' || !pricing.slabs) return pricing
  const seen = new Set()
  const slabs = pricing.slabs.filter((s) => {
    const qty = Number(s.minQty)
    if (!Number.isInteger(qty) || qty < 1 || seen.has(qty)) return false
    seen.add(qty)
    return true
  })
  return { ...pricing, slabs }
}

/** The pack quantities a product is sold in, smallest first. Empty when it isn't priced in packs. */
function packQuantities(form) {
  if (form.pricingModel !== 'SLAB') return []
  const quantities = (form.pricing?.slabs ?? [])
    .map((s) => Number(s.minQty))
    .filter((qty) => Number.isInteger(qty) && qty >= 1)
  return [...new Set(quantities)].sort((a, b) => a - b)
}

/** A field's per-pack prices, keeping only the packs the product still sells. */
function keptPackPrices(po, form) {
  const packs = new Set(packQuantities(form).map(String))
  const kept = Object.fromEntries(Object.entries(po.packOverrides ?? {}).filter(([qty]) => packs.has(qty)))
  return Object.keys(kept).length ? kept : null
}

/** A field's "not offered on this pack" marks, keeping only the packs the product still sells. */
function keptUnavailable(po, form) {
  const packs = new Set(packQuantities(form).map(String))
  const kept = Object.fromEntries(
    Object.entries(po.packUnavailable ?? {}).filter(
      ([qty, codes]) => packs.has(qty) && Array.isArray(codes) && codes.length > 0,
    ),
  )
  return Object.keys(kept).length ? kept : null
}

/** A field's prices per choice of another field, keeping only packs the product still sells. */
function keptDriverPrices(po, form) {
  if (!po.driverPrices) return null
  const packs = new Set(packQuantities(form).map(String))
  const kept = {}
  for (const [driverCode, prices] of Object.entries(po.driverPrices)) {
    const every = prices?.every && Object.keys(prices.every).length ? prices.every : null
    const packEntries = Object.entries(prices?.packs ?? {}).filter(
      ([qty, byChoice]) => packs.has(qty) && byChoice && Object.keys(byChoice).length > 0,
    )
    const entry = {
      ...(every ? { every } : {}),
      ...(packEntries.length ? { packs: Object.fromEntries(packEntries) } : {}),
    }
    if (Object.keys(entry).length) kept[driverCode] = entry
  }
  return Object.keys(kept).length ? kept : null
}

/** The full-page editor at /admin/products/new and /admin/products/:id. */
export default function ProductForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  return (
    <ProductEditor
      key={id ?? 'new'}
      productId={id}
      presetCategory={searchParams.get('category')}
      onCreated={(saved) => navigate(`/admin/products/${saved._id}`, { replace: true })}
    />
  )
}

/**
 * The product editor.
 *
 * Used two ways: as the full page above, and inside the side panel on the
 * Categories screen (pass `onClose`), so a product can be added, photographed
 * and priced without leaving the category it belongs to.
 *
 * @param productId       edit this product; omit to create one
 * @param presetCategory  category id to file a new product under
 * @param onCreated       after the first save — the page version navigates to
 *                        the new URL; without it the editor stays open on the
 *                        newly created product
 * @param onSaved         after every successful save
 * @param onClose         renders a close button (side-panel mode)
 * @param onDirtyChange   true once something is edited, false after a save
 */
export function ProductEditor({ productId, presetCategory, onCreated, onSaved, onClose, onDirtyChange }) {
  const embedded = Boolean(onClose)
  const [id, setId] = useState(productId ?? null)
  const isNew = !id

  const [tab, setTab] = useState('General')
  // A preset category means adding several products to one category does not
  // mean re-picking it every time.
  const [form, setForm] = useState(() =>
    presetCategory ? { ...EMPTY, categories: [presetCategory], primaryCategory: presetCategory } : EMPTY,
  )
  const [categories, setCategories] = useState([])
  const [optionGroups, setOptionGroups] = useState([])
  const [loading, setLoading] = useState(Boolean(productId))
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState(null)
  const [legacyImageUrl, setLegacyImageUrl] = useState(null)
  const [uploading, setUploading] = useState(null) // { done, total } while photos upload

  useEffect(() => {
    api.listCategories().then(setCategories).catch(setError)
    api.listOptionGroups().then(setOptionGroups).catch(setError)
  }, [])

  useEffect(() => {
    if (!id) return
    api
      .getProduct(id)
      .then((p) => {
        setLegacyImageUrl(p.legacyImageUrl ?? null)
        setForm({
          ...EMPTY,
          ...p,
          categories: (p.categories ?? []).map((c) => (typeof c === 'object' ? c._id : c)),
          primaryCategory: p.primaryCategory ? String(p.primaryCategory._id ?? p.primaryCategory) : '',
          seo: { title: p.seo?.title ?? '', description: p.seo?.description ?? '' },
          // Mongo returns Maps as plain objects through .lean() — normalise so
          // the pricing inputs are always editing the same shape.
          pricing: p.pricing ?? null,
          // The API populates each option's group: keep the id for saving and
          // the group itself for display.
          options: (p.options ?? []).map((po, i) => ({
            optionGroup: String(po.optionGroup?._id ?? po.optionGroup),
            group: typeof po.optionGroup === 'object' ? po.optionGroup : null,
            order: po.order ?? i,
            required: Boolean(po.required),
            labelOverride: po.labelOverride ?? '',
            deltaOverrides: po.deltaOverrides ?? null,
            valueOverrides: po.valueOverrides ?? null,
            packOverrides: po.packOverrides ?? null,
            packUnavailable: po.packUnavailable ?? null,
            dependsOn: po.dependsOn ? String(po.dependsOn._id ?? po.dependsOn) : null,
            driverPrices: po.driverPrices ?? null,
          })),
        })
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  // Only leaf categories are selectable: assigning a product to "Signage"
  // rather than "Outdoor Signage" makes browse pages meaningless.
  const leafCategories = useMemo(() => {
    const parentIds = new Set(categories.map((c) => String(c.parent)).filter(Boolean))
    return categories.filter((c) => !parentIds.has(String(c._id)))
  }, [categories])

  const nameOf = (cid) => categories.find((c) => String(c._id) === String(cid))?.name ?? cid

  function set(patch) {
    setSavedAt(null)
    onDirtyChange?.(true)
    setForm((f) => ({ ...f, ...patch }))
  }

  function toggleCategory(cid) {
    const has = form.categories.includes(cid)
    const next = has ? form.categories.filter((c) => c !== cid) : [...form.categories, cid]
    set({
      categories: next,
      primaryCategory: next.includes(form.primaryCategory) ? form.primaryCategory : (next[0] ?? ''),
    })
  }

  async function save() {
    setSaving(true)
    setError(null)
    setSavedAt(null)

    // Send only what the API accepts — its schemas are strict and reject
    // unknown keys, so echoing back _id/createdAt would fail the request.
    const payload = {
      name: form.name,
      categories: form.categories,
      ...(form.primaryCategory ? { primaryCategory: form.primaryCategory } : {}),
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      // Send only the fields the API accepts. Loading a product returns
      // Mongoose-generated keys (_id) that a strict write schema rejects, so
      // echoing the object straight back would fail the save.
      images: form.images?.length
        ? form.images.map(({ url, publicId, alt, isPrimary, order }) => ({
            url,
            ...(publicId ? { publicId } : {}),
            ...(alt ? { alt } : {}),
            ...(isPrimary !== undefined ? { isPrimary: Boolean(isPrimary) } : {}),
            ...(order !== undefined ? { order } : {}),
          }))
        : undefined,
      specifications: form.specifications,
      applications: form.applications,
      materials: form.materials,
      sizes: form.sizes,
      customization: form.customization,
      pricingModel: form.pricingModel,
      purchaseMode: form.purchaseMode,
      pricing: form.pricingModel === 'QUOTE_ONLY' ? null : cleanPricing(form),
      // Only the fields the API accepts: the populated group is display-only.
      options: (form.options ?? []).map((po, i) => {
        const packPrices = keptPackPrices(po, form)
        const packBlocked = keptUnavailable(po, form)
        // Only depend on a field still on this product — the server refuses anything else.
        const dependsOn =
          po.dependsOn &&
          po.dependsOn !== po.optionGroup &&
          (form.options ?? []).some((o) => o.optionGroup === po.dependsOn)
            ? po.dependsOn
            : null
        const driverPrices = keptDriverPrices(po, form)
        return {
          optionGroup: po.optionGroup,
          order: i,
          required: Boolean(po.required),
          ...(po.labelOverride ? { labelOverride: po.labelOverride } : {}),
          ...(po.deltaOverrides && Object.keys(po.deltaOverrides).length
            ? { deltaOverrides: po.deltaOverrides }
            : {}),
          // This product's own prices for individual choices, at every quantity…
          ...(po.valueOverrides && Object.keys(po.valueOverrides).length
            ? { valueOverrides: po.valueOverrides }
            : {}),
          // …and for particular quantity packs.
          ...(packPrices ? { packOverrides: packPrices } : {}),
          // …and choices not offered on particular packs.
          ...(packBlocked ? { packUnavailable: packBlocked } : {}),
          // Prices by another field's choice (e.g. per Size). Kept even while not
          // depending on anything, so switching back does not lose them.
          ...(dependsOn ? { dependsOn } : {}),
          ...(driverPrices ? { driverPrices } : {}),
        }
      }),
      visibility: form.visibility,
      featured: form.featured,
      isActive: form.isActive,
      seo: {
        ...(form.seo?.title ? { title: form.seo.title } : {}),
        ...(form.seo?.description ? { description: form.seo.description } : {}),
      },
      ...(form.hsnCode ? { hsnCode: form.hsnCode } : {}),
      ...(form.taxPercent != null && form.taxPercent !== '' ? { taxPercent: Number(form.taxPercent) } : {}),
      // A slug is only sent when creating. Editing never changes it silently —
      // these URLs are indexed.
      ...(isNew && form.slug ? { slug: form.slug } : {}),
    }

    try {
      const saved = isNew ? await api.createProduct(payload) : await api.updateProduct(id, payload)
      onDirtyChange?.(false)
      if (isNew && onCreated) {
        onCreated(saved)
      } else {
        // In the side panel a new product stays open, now in edit mode, so
        // photos and prices can be added straight after naming it.
        if (isNew) setId(String(saved._id))
        setLegacyImageUrl(saved.legacyImageUrl ?? null)
        // Without this the form looked identical after a successful save, so
        // there was no way to tell it had worked.
        setSavedAt(new Date())
      }
      onSaved?.(saved)
    } catch (err) {
      setError(err)
      // Jump to the tab most likely to hold the problem.
      if (err.details?.some((d) => d.field?.startsWith('pricing'))) setTab('Pricing')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Several photographs at once — how a product actually arrives from a shoot.
   * Uploaded one after another rather than all at once, so a slow connection
   * cannot stall every request, and progress can be shown honestly. Whatever
   * succeeded before a failure is still kept.
   */
  async function handleUploads(fileList) {
    const files = Array.from(fileList ?? [])
    if (!files.length) return
    setError(null)
    setUploading({ done: 0, total: files.length })

    const added = []
    try {
      for (const file of files) {
        const img = await api.uploadImage(file)
        added.push({ url: img.url, publicId: img.publicId, alt: form.name })
        setUploading({ done: added.length, total: files.length })
      }
    } catch (err) {
      setError(err)
    } finally {
      setUploading(null)
      if (added.length) {
        set({
          images: [
            ...form.images,
            ...added.map((img, i) => ({ ...img, isPrimary: form.images.length === 0 && i === 0 })),
          ],
        })
      }
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
      <div
        className={`flex flex-wrap items-start justify-between gap-3 ${
          embedded ? 'sticky top-0 z-10 -mx-5 -mt-5 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur' : ''
        }`}
      >
        <div className="min-w-0">
          {!embedded && (
            <Link to="/admin/products" className="text-sm text-ink-soft hover:text-primary">
              ← Products
            </Link>
          )}
          <h1 className="mt-1 truncate font-display text-2xl font-bold text-ink">
            {isNew ? 'New product' : form.name || 'Untitled'}
          </h1>
          {isNew && form.categories.length > 0 && (
            <p className="mt-1 text-sm text-ink-soft">in {form.categories.map(nameOf).join(', ')}</p>
          )}
          {!isNew && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <code className="text-xs text-ink-soft">/products/{form.slug}</code>
              <Badge tone={form.isActive ? 'green' : 'neutral'}>{form.isActive ? 'live' : 'draft'}</Badge>
              {legacyImageUrl && <Badge tone="amber">borrowed photo</Badge>}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Also on the Visibility tab — surfaced here because "is it on the
              website?" is the question asked most. Takes effect on Save. */}
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
            Live on website
          </label>
          {!isNew && form.isActive && (
            <a href={`/products/${form.slug}`} target="_blank" rel="noreferrer">
              <Btn variant="outline">View on site</Btn>
            </a>
          )}
          {savedAt && (
            <span
              className="flex items-center gap-1.5 text-sm font-medium text-green-700"
              role="status"
              aria-live="polite"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2.5 8.5l3.5 3.5 7.5-8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Saved {savedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <Btn onClick={save} disabled={saving || !form.name || form.categories.length === 0}>
            {saving ? 'Saving…' : 'Save'}
          </Btn>
          {embedded && (
            <Btn variant="ghost" onClick={onClose} aria-label="Close">
              ✕
            </Btn>
          )}
        </div>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
        {tab === 'General' && (
          <div className="space-y-4">
            <Field label="Product name" required>
              <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>

            {isNew && (
              <Field label="Slug" hint="Leave blank to generate from the name. This becomes the URL and cannot be changed later without breaking links.">
                <Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="auto" />
              </Field>
            )}

            <Field
              label="Categories"
              required
              hint="A product may sit in several — e.g. Corporate Signage belongs under both Indoor and Custom."
            >
              <div className="flex flex-wrap gap-2 rounded-[var(--radius-card)] border border-line p-3">
                {leafCategories.map((c) => {
                  const on = form.categories.includes(String(c._id))
                  return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => toggleCategory(String(c._id))}
                      className={`rounded-[var(--radius-card)] border px-3 py-1.5 text-xs font-medium transition-colors ${
                        on ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink-soft hover:bg-gray-50'
                      }`}
                    >
                      {c.name}
                    </button>
                  )
                })}
              </div>
            </Field>

            {form.categories.length > 1 && (
              <Field label="Primary category" hint="Used for the breadcrumb and the canonical URL.">
                <Select value={form.primaryCategory} onChange={(e) => set({ primaryCategory: e.target.value })}>
                  {form.categories.map((cid) => (
                    <option key={cid} value={cid}>
                      {nameOf(cid)}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            <Field label="Short description" hint="One line, shown on product cards.">
              <Input
                value={form.shortDescription ?? ''}
                onChange={(e) => set({ shortDescription: e.target.value })}
                maxLength={400}
              />
            </Field>

            <Field label="Full description">
              <Textarea rows={6} value={form.description ?? ''} onChange={(e) => set({ description: e.target.value })} />
            </Field>

            <ListField label="Specifications" value={form.specifications} onChange={(v) => set({ specifications: v })} />
            <ListField label="Applications" value={form.applications} onChange={(v) => set({ applications: v })} />
            <ListField label="Materials" value={form.materials} onChange={(v) => set({ materials: v })} />
            <ListField label="Sizes" value={form.sizes} onChange={(v) => set({ sizes: v })} />
          </div>
        )}

        {tab === 'Images' && (
          <div className="space-y-4">
            {legacyImageUrl && form.images.length === 0 && (
              <div className="rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900">
                  This product is still showing an image hotlinked from a third-party website. It will be replaced
                  automatically the moment you upload a real photograph.
                </p>
                <img
                  referrerPolicy="no-referrer"
                  src={legacyImageUrl}
                  alt=""
                  className="mt-3 h-32 w-32 rounded object-cover"
                />
              </div>
            )}

            <Field
              label="Upload"
              hint="JPEG, PNG, WebP or AVIF, up to 8 MB each. Select several at once to add them together."
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => {
                  handleUploads(e.target.files)
                  e.target.value = ''
                }}
                className="block w-full text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
              />
              {uploading && (
                <span className="mt-2 block text-sm font-medium text-primary" role="status" aria-live="polite">
                  Uploading {Math.min(uploading.done + 1, uploading.total)} of {uploading.total}…
                </span>
              )}
            </Field>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.images.map((img, i) => (
                  <div key={img.url} className="overflow-hidden rounded-[var(--radius-card)] border border-line">
                    <img src={img.url} alt={img.alt ?? ''} className="aspect-square w-full object-cover" />
                    <div className="space-y-1 p-2">
                      <Input
                        value={img.alt ?? ''}
                        onChange={(e) =>
                          set({ images: form.images.map((x, xi) => (xi === i ? { ...x, alt: e.target.value } : x)) })
                        }
                        placeholder="Alt text"
                        className="text-xs"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1 text-[0.7rem] text-ink-soft">
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={Boolean(img.isPrimary)}
                            onChange={() =>
                              set({ images: form.images.map((x, xi) => ({ ...x, isPrimary: xi === i })) })
                            }
                          />
                          Primary
                        </label>
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={() => set({ images: form.images.filter((_, xi) => xi !== i) })}
                        >
                          Remove
                        </Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'Pricing' && (
          <PricingTab
            productId={id}
            value={form}
            // Routed through set() so editing a price clears the "Saved"
            // confirmation, same as every other field.
            onChange={(next) => set(next)}
            onGoToOptions={() => setTab('Options')}
          />
        )}

        {tab === 'Options' && (
          <div className="space-y-6">
            <QuantityPacks value={form} onChange={(patch) => set(patch)} />
            <OptionsTab
              value={form.options ?? []}
              groups={optionGroups}
              packs={packQuantities(form)}
              onChange={(options) => set({ options })}
              onGroupCreated={(group) => setOptionGroups((list) => [...list, group])}
              // Keep what the list already knew (like how many products use the
              // field), refreshed with the saved definition.
              onGroupUpdated={(group) =>
                setOptionGroups((list) =>
                  list.map((g) => (String(g._id) === String(group._id) ? { ...g, ...group } : g)),
                )
              }
            />
          </div>
        )}

        {tab === 'Visibility' && (
          <div className="space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink">Show this product to</legend>
              <div className="space-y-2">
                {[
                  ['b2c', 'B2C — retail customers and anonymous visitors'],
                  ['b2b', 'B2B — approved trade accounts'],
                  ['corporate', 'Corporate — approved corporate accounts'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={Boolean(form.visibility?.[key])}
                      onChange={(e) => set({ visibility: { ...form.visibility, [key]: e.target.checked } })}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Unchecking B2C hides this product from the public site and from Google.
              </p>
            </fieldset>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.featured} onChange={(e) => set({ featured: e.target.checked })} />
              Featured — appears in the homepage carousel
            </label>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
              Live — publish to the website and include in the sitemap
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="HSN code" hint="Used on GST invoices from Phase 6.">
                <Input value={form.hsnCode ?? ''} onChange={(e) => set({ hsnCode: e.target.value })} />
              </Field>
              <Field label="GST %">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={form.taxPercent ?? ''}
                  onChange={(e) => set({ taxPercent: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="18"
                />
              </Field>
            </div>
          </div>
        )}

        {tab === 'SEO' && (
          <div className="space-y-4">
            <Field label="Page title" hint="Falls back to the product name. Around 60 characters reads best in Google.">
              <Input
                value={form.seo?.title ?? ''}
                onChange={(e) => set({ seo: { ...form.seo, title: e.target.value } })}
                maxLength={200}
              />
            </Field>
            <Field label="Meta description" hint="Falls back to the short description. Aim for 150–160 characters.">
              <Textarea
                rows={3}
                value={form.seo?.description ?? ''}
                onChange={(e) => set({ seo: { ...form.seo, description: e.target.value } })}
                maxLength={400}
              />
            </Field>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
              <p className="text-xs uppercase tracking-wider text-ink-soft">Google preview</p>
              <p className="mt-2 text-base text-blue-800">{form.seo?.title || form.name || 'Product name'}</p>
              <p className="text-xs text-green-700">
                www.mrprintworld.com/products/{form.slug || 'product-slug'}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {form.seo?.description || form.shortDescription || 'No description set.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Repeating one-line list (specs, materials, sizes…). */
function ListField({ label, value = [], onChange }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={(e) => onChange(value.map((v, vi) => (vi === i ? e.target.value : v)))} />
            <Btn variant="ghost" size="sm" onClick={() => onChange(value.filter((_, vi) => vi !== i))}>
              Remove
            </Btn>
          </div>
        ))}
        <Btn variant="outline" size="sm" onClick={() => onChange([...value, ''])}>
          Add {label.toLowerCase().replace(/s$/, '')}
        </Btn>
      </div>
    </Field>
  )
}
