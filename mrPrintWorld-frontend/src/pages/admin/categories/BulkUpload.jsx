import { useMemo, useRef, useState } from 'react'
import * as api from '../adminApi'
import { Btn, Badge, ErrorBanner, Spinner } from '../ui'
import { branchLeaves, buildWorkbook, parseWorkbook, MAX_PACKS, MAX_ROWS } from './bulkExcel'

/** ExcelJS is large, so it loads only when a file is downloaded or read. */
const loadExcel = () => import('exceljs/dist/exceljs.min.js').then((mod) => mod.default ?? mod)

/** Every product in a category branch, across pages. */
async function allProducts(categoryId) {
  const out = []
  for (let page = 1; ; page += 1) {
    const { items, meta } = await api.listProducts({ category: categoryId, limit: 100, page })
    out.push(...items)
    if (!meta || page >= meta.pages) return out
  }
}

const fileName = (name) =>
  `${
    String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'category'
  }-products.xlsx`

/**
 * Bulk upload for one category, Meesho-style: download the Excel, fill it in,
 * upload it, see what every row will do, then import.
 */
export default function BulkUpload({ category, items, onClose, onImported }) {
  const { leaves, hasSubcategories } = useMemo(() => branchLeaves(category, items), [category, items])
  const [busy, setBusy] = useState(null) // 'download' | 'check' | 'import'
  const [error, setError] = useState(null)
  const [rows, setRows] = useState(null) // parsed rows merged with the dry-run result
  const [fileLabel, setFileLabel] = useState('')
  const [done, setDone] = useState(null) // import summary
  const fileInput = useRef(null)

  async function download() {
    setBusy('download')
    setError(null)
    try {
      const [ExcelJS, products] = await Promise.all([loadExcel(), allProducts(category._id)])
      const buffer = await buildWorkbook(ExcelJS, { categoryName: category.name, leaves, hasSubcategories, products })
      const url = URL.createObjectURL(
        new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.download = fileName(category.name)
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (err) {
      setError(err)
    } finally {
      setBusy(null)
    }
  }

  async function check(file) {
    if (!file) return
    setBusy('check')
    setError(null)
    setRows(null)
    setDone(null)
    setFileLabel(file.name)
    try {
      const ExcelJS = await loadExcel()
      const parsed = await parseWorkbook(ExcelJS, await file.arrayBuffer(), {
        leaves,
        hasSubcategories,
        categoryName: category.name,
      })
      if (!parsed.length) throw new Error('The Products sheet has no rows filled in.')

      const valid = parsed.filter((r) => !r.errors.length)
      const outcome = new Map()
      if (valid.length) {
        const result = await api.bulkProducts({
          category: String(category._id),
          dryRun: true,
          rows: valid.map((r) => r.payload),
        })
        for (const r of result.results) outcome.set(r.row, r)
      }
      setRows(
        parsed.map((r) => {
          if (r.errors.length) return { ...r, action: 'error', message: r.errors.join(' · ') }
          const res = outcome.get(r.row)
          return { ...r, action: res?.action ?? 'error', message: res?.message }
        }),
      )
    } catch (err) {
      setError(err)
    } finally {
      setBusy(null)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  async function runImport() {
    const ready = rows.filter((r) => r.action !== 'error')
    setBusy('import')
    setError(null)
    try {
      const result = await api.bulkProducts({
        category: String(category._id),
        dryRun: false,
        rows: ready.map((r) => r.payload),
      })
      const outcome = new Map(result.results.map((r) => [r.row, r]))
      setRows((prev) =>
        prev.map((r) => {
          const res = outcome.get(r.row)
          return res ? { ...r, action: res.action, message: res.message } : r
        }),
      )
      setDone({ created: result.created, updated: result.updated, failed: rows.length - result.created - result.updated })
      onImported?.()
    } catch (err) {
      setError(err)
    } finally {
      setBusy(null)
    }
  }

  const counts = rows
    ? {
        create: rows.filter((r) => r.action === 'create').length,
        update: rows.filter((r) => r.action === 'update').length,
        error: rows.filter((r) => r.action === 'error').length,
      }
    : null
  const ready = counts ? counts.create + counts.update : 0

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Bulk upload · {category.name}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Add or change many products at once from an Excel sheet. Photos are added afterwards, from each product.
          </p>
        </div>
        <Btn variant="ghost" size="sm" onClick={onClose}>
          Close
        </Btn>
      </div>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">1. Download the Excel</h3>
        <p className="mt-1 text-sm text-ink-soft">
          One row per product, with a column for every detail and up to {MAX_PACKS} quantity packs
          {hasSubcategories ? `, and a dropdown of the ${leaves.length} subcategories` : ''}. Products already in{' '}
          {category.name} are filled in, so you can change them and upload them again. The Instructions sheet explains
          each column.
        </p>
        <Btn className="mt-3" variant="outline" onClick={download} disabled={Boolean(busy)}>
          {busy === 'download' ? 'Preparing…' : 'Download Excel'}
        </Btn>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">2. Upload the filled Excel</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Nothing is saved yet — you will see what each row will do first. Up to {MAX_ROWS} products per file.
        </p>
        <label className={`mt-3 inline-block ${busy ? 'pointer-events-none opacity-60' : ''}`}>
          <input
            ref={fileInput}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="sr-only"
            onChange={(e) => check(e.target.files?.[0])}
          />
          <span className="inline-flex cursor-pointer items-center rounded-[var(--radius-card)] bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            {busy === 'check' ? 'Checking…' : rows ? 'Choose another file' : 'Choose Excel file'}
          </span>
        </label>
        {fileLabel && <span className="ml-3 text-sm text-ink-soft">{fileLabel}</span>}
      </section>

      {busy === 'check' && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {rows && (
        <section className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="mr-1 font-semibold text-ink">{done ? 'Imported' : '3. Check and import'}</h3>
              {counts.create > 0 && <Badge tone="green">{counts.create} new</Badge>}
              {counts.update > 0 && <Badge tone="blue">{counts.update} to update</Badge>}
              {counts.error > 0 && <Badge tone="amber">{counts.error} with problems</Badge>}
            </div>
            {!done && (
              <Btn onClick={runImport} disabled={!ready || Boolean(busy)}>
                {busy === 'import' ? 'Importing…' : `Import ${ready} product${ready === 1 ? '' : 's'}`}
              </Btn>
            )}
          </div>

          {done ? (
            <p className="mt-2 text-sm text-ink">
              {done.created} created and {done.updated} updated.
              {done.failed > 0 ? ` ${done.failed} row${done.failed === 1 ? ' was' : 's were'} skipped — fix them in the Excel and upload again.` : ''}{' '}
              New products are hidden until marked live; add their photos from each product.
            </p>
          ) : (
            counts.error > 0 && (
              <p className="mt-2 text-sm text-ink-soft">
                Rows with problems are skipped. Fix them in the Excel and upload it again — rows already imported will
                simply update.
              </p>
            )
          )}

          <div className="mt-3 max-h-[28rem] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
                  <th className="py-2 pr-3 font-semibold">Row</th>
                  <th className="py-2 pr-3 font-semibold">Product</th>
                  {hasSubcategories && <th className="py-2 pr-3 font-semibold">Subcategory</th>}
                  <th className="py-2 pr-3 font-semibold">Packs</th>
                  <th className="py-2 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.row} className="border-t border-line align-top">
                    <td className="py-2 pr-3 tabular-nums text-ink-soft">{r.row}</td>
                    <td className="py-2 pr-3 text-ink">{r.name || '—'}</td>
                    {hasSubcategories && <td className="py-2 pr-3 text-ink-soft">{r.categoryLabel || '—'}</td>}
                    <td className="py-2 pr-3 tabular-nums text-ink-soft">{r.packCount || '—'}</td>
                    <td className="py-2">
                      {r.action === 'create' && <Badge tone="green">{done ? 'Created' : 'New'}</Badge>}
                      {r.action === 'update' && <Badge tone="blue">{done ? 'Updated' : 'Update'}</Badge>}
                      {r.action === 'error' && <span className="text-sm text-red-700">{r.message}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
