/**
 * The bulk-upload Excel: building the file to download, and reading a filled
 * one back into rows for the API.
 *
 * ExcelJS is passed in rather than imported, so the admin panel only loads it
 * (about 1 MB) when someone actually downloads or uploads a file.
 *
 * Sheets: Instructions · Products (one row per product) · Options (one row
 * per field choice price) · Field choices (reference) · Lists (hidden, feeds
 * the dropdowns).
 */

import { percentOrNull, tiersFromRetail } from '../products/tierPercents.js'

export const MAX_PACKS = 10
export const MAX_IMAGES = 10
export const MAX_ROWS = 500
/** Row ids for products named only on the Options sheet, clear of Products sheet rows. */
export const OPTIONS_ONLY_ROW = 100_000

const LIST_NOTE = 'One per line (Alt + Enter inside the cell), or separate them with ;'
const LIST_KEYS = ['specifications', 'materials', 'sizes', 'customization', 'applications']

const normalise = (s) =>
  String(s ?? '')
    .replace(/\*/g, '')
    .replace(/₹/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
const nameKey = (s) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
const readTier = (amounts, tier) => (amounts ? (amounts instanceof Map ? amounts.get(tier) : amounts[tier]) : undefined)
/** Rupee and per-sq.ft choices follow the % columns; percentage and multiplier choices don't. */
const scales = (choice) => !choice?.deltaType || choice.deltaType === 'FLAT' || choice.deltaType === 'PER_SQFT'
const decimalsFor = (choice) => (choice?.deltaType === 'PER_SQFT' ? 2 : 0)

/** true, false, undefined when blank, null when it is neither. */
function yesNo(raw) {
  const v = normalise(raw)
  if (!v) return undefined
  if (['yes', 'y', 'true', '1', 'live'].includes(v)) return true
  if (['no', 'n', 'false', '0', 'hidden'].includes(v)) return false
  return null
}

/* ── Columns ───────────────────────────────────────────────────────────── */

/** Every Products sheet column, in order. `hasSubcategories` adds the Subcategory dropdown. */
export function columnsFor(hasSubcategories) {
  const images = []
  for (let i = 1; i <= MAX_IMAGES; i += 1) {
    images.push({
      key: `image${i}`,
      header: `Image ${i} link`,
      width: 24,
      image: true,
      note:
        i === 1
          ? 'A link to the photo (website link, or Google Drive shared with "Anyone with the link"). Photos are copied to our storage and ADDED to the product; a link it already has is skipped. The first photo of a new product is its main photo.'
          : undefined,
    })
  }
  const packs = []
  for (let i = 1; i <= MAX_PACKS; i += 1) {
    packs.push(
      { key: `pack${i}Qty`, header: `Pack ${i} quantity`, width: 11, pack: i, note: i === 1 ? 'e.g. 500. Each pack is a quantity the customer can pick.' : undefined },
      { key: `pack${i}Retail`, header: `Pack ${i} retail ₹`, width: 11, pack: i, note: i === 1 ? 'Price for the whole pack, not per piece.' : undefined },
      { key: `pack${i}Trade`, header: `Pack ${i} trade ₹`, width: 11, pack: i },
      { key: `pack${i}Corporate`, header: `Pack ${i} corporate ₹`, width: 12, pack: i },
    )
  }
  return [
    { key: 'name', header: 'Product name *', width: 34, note: 'Required. A name already in this category updates that product; a new name creates one.' },
    ...(hasSubcategories
      ? [{ key: 'category', header: 'Subcategory *', width: 28, note: 'Required for new products. Pick from the dropdown.' }]
      : []),
    { key: 'live', header: 'Live on website', width: 13, note: 'Yes or No. Left blank, a new product stays hidden and an existing one keeps its setting.' },
    { key: 'shortDescription', header: 'Short description', width: 36, note: 'Up to 400 characters.' },
    { key: 'description', header: 'Description', width: 44 },
    { key: 'specifications', header: 'Specifications', width: 32, list: true, note: LIST_NOTE },
    { key: 'materials', header: 'Materials', width: 26, list: true, note: LIST_NOTE },
    { key: 'sizes', header: 'Sizes', width: 22, list: true, note: LIST_NOTE },
    { key: 'customization', header: 'Customisation', width: 26, list: true, note: LIST_NOTE },
    { key: 'applications', header: 'Common applications', width: 26, list: true, note: LIST_NOTE },
    { key: 'unit', header: 'Sold in', width: 10, note: 'e.g. pieces, sheets, sets' },
    { key: 'hsnCode', header: 'HSN code', width: 11 },
    { key: 'taxPercent', header: 'GST %', width: 8 },
    { key: 'seoTitle', header: 'SEO title', width: 28 },
    { key: 'seoDescription', header: 'SEO description', width: 36 },
    ...images,
    { key: 'tradeOff', header: 'Trade % below retail', width: 12, note: 'Optional. Fills every blank Trade price from its Retail price — packs, and this product\'s rows on the Options sheet. e.g. 15' },
    { key: 'corporateOff', header: 'Corporate % below retail', width: 13, note: 'Optional. Fills every blank Corporate price from its Retail price — packs, and this product\'s rows on the Options sheet. e.g. 22' },
    ...packs,
  ]
}

/** The Options sheet: one row per price (or availability) of one choice of one field. */
export const OPTION_COLUMNS = [
  { key: 'product', header: 'Product name *', width: 32, note: 'As on the Products sheet, or a product already in this category. A product with rows here gets exactly these fields — its other fields are removed.' },
  { key: 'field', header: 'Field *', width: 24, note: 'Pick from the dropdown. Fields come from the field library (Admin → Product Options); the "Field choices" sheet lists their choices.' },
  { key: 'required', header: 'Customer must answer', width: 12, note: 'Yes on any row of a field makes it required.' },
  { key: 'choice', header: 'Choice', width: 22, note: 'One of the field\'s choices (see "Field choices"). Leave blank on a row that only adds the field with its usual prices.' },
  { key: 'dependsOn', header: 'Price depends on', width: 20, note: 'Optional: another field of this product, e.g. Size — then "When" says which of its choices this price is for.' },
  { key: 'when', header: 'When', width: 14, note: 'A choice of the "Price depends on" field, e.g. A4.' },
  { key: 'pack', header: 'Pack', width: 10, note: 'A quantity pack of this product, e.g. 1000. Blank = every quantity.' },
  { key: 'retail', header: 'Retail ₹', width: 10, note: 'What this choice adds for retail customers. Blank = the field\'s usual price.' },
  { key: 'trade', header: 'Trade ₹', width: 10 },
  { key: 'corporate', header: 'Corporate ₹', width: 11 },
  { key: 'notAvailable', header: 'Not available', width: 11, note: 'Yes = this choice cannot be picked on this Pack. Needs a Choice and a Pack, and no prices.' },
  { key: 'tradeOff', header: 'Trade % below retail', width: 12, note: 'Optional. Fills a blank Trade price from Retail. Blank here uses the product\'s % from the Products sheet.' },
  { key: 'corporateOff', header: 'Corporate % below retail', width: 13 },
]

/* ── Categories and fields ─────────────────────────────────────────────── */

/**
 * The deepest categories inside a category, where products are filed, each
 * labelled with its path below it: "Visiting Cards", "Leaflets > Flyers".
 * A category with nothing inside it is its own single entry.
 */
export function branchLeaves(category, items) {
  const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
  const childrenOf = (id) => items.filter((c) => String(c.parent) === String(id)).sort(byOrder)
  const leaves = []
  const walk = (cat, trail) => {
    const children = childrenOf(cat._id)
    if (!children.length) {
      leaves.push({ id: String(cat._id), label: trail.join(' > ') })
      return
    }
    for (const child of children) walk(child, [...trail, child.name])
  }
  walk(category, [])
  return { leaves, hasSubcategories: childrenOf(category._id).length > 0 }
}

/** How each library field is named in the Excel: its label, or "Label (CODE)" when two share a label. */
export function fieldNames(library) {
  const counts = new Map()
  for (const g of library) counts.set(normalise(g.label), (counts.get(normalise(g.label)) ?? 0) + 1)
  return new Map(library.map((g) => [String(g._id), counts.get(normalise(g.label)) > 1 ? `${g.label} (${g.code})` : g.label]))
}

/** Finds a field by its Excel name, label or code: the field, undefined when none, null when ambiguous. */
function fieldFinder(library) {
  const names = fieldNames(library)
  const found = new Map()
  const add = (text, group) => {
    const key = normalise(text)
    found.set(key, found.has(key) && found.get(key) !== group ? null : group)
  }
  for (const g of library) {
    add(names.get(String(g._id)), g)
    add(g.code, g)
  }
  // A label two fields share never picks one of them silently.
  const counts = new Map()
  for (const g of library) counts.set(normalise(g.label), (counts.get(normalise(g.label)) ?? 0) + 1)
  for (const g of library) {
    if (counts.get(normalise(g.label)) > 1) found.set(normalise(g.label), null)
    else add(g.label, g)
  }
  return (text) => found.get(normalise(text))
}

const findChoice = (group, text) =>
  (group?.values ?? []).find((v) => normalise(v.label) === normalise(text)) ??
  (group?.values ?? []).find((v) => normalise(v.code) === normalise(text))

/* ── Download ──────────────────────────────────────────────────────────── */

/** A product as a Products sheet row, so existing products can be changed and uploaded again. */
function productRow(p, leaves) {
  const leaf = (p.categories ?? [])
    .map((c) => leaves.find((l) => l.id === String(c._id ?? c)))
    .find(Boolean)
  const row = {
    name: p.name,
    category: leaf?.label || undefined,
    live: p.isActive ? 'Yes' : 'No',
    shortDescription: p.shortDescription,
    description: p.description,
    unit: p.pricing?.unit ?? undefined,
    hsnCode: p.hsnCode ?? undefined,
    taxPercent: p.taxPercent ?? undefined,
    seoTitle: p.seo?.title,
    seoDescription: p.seo?.description,
  }
  for (const key of LIST_KEYS) if (p[key]?.length) row[key] = p[key].join('\n')
  ;(p.images ?? []).slice(0, MAX_IMAGES).forEach((img, i) => {
    row[`image${i + 1}`] = img.url
  })
  // Only single-quantity packs fit the columns. Anything else is left blank,
  // which leaves that product's pricing untouched when the file comes back.
  const slabs = [...(p.pricing?.slabs ?? [])].sort((a, b) => a.minQty - b.minQty)
  if (slabs.length && slabs.length <= MAX_PACKS && slabs.every((s) => s.maxQty === s.minQty)) {
    slabs.forEach((s, i) => {
      row[`pack${i + 1}Qty`] = s.minQty
      row[`pack${i + 1}Retail`] = readTier(s.amounts, 'B2C')
      row[`pack${i + 1}Trade`] = readTier(s.amounts, 'B2B')
      row[`pack${i + 1}Corporate`] = readTier(s.amounts, 'CORPORATE')
    })
  }
  return row
}

/** A product's fields as Options sheet rows — everything they are priced at on this product. */
function optionRows(p, byId, names) {
  const rows = []
  const choiceName = (group, code) => group?.values?.find((v) => v.code === code)?.label ?? code
  const tiers = (amounts) => ({
    retail: readTier(amounts, 'B2C'),
    trade: readTier(amounts, 'B2B'),
    corporate: readTier(amounts, 'CORPORATE'),
  })
  const entries = (obj) => Object.entries(obj ?? {})

  for (const o of [...(p.options ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
    const group = byId.get(String(o.optionGroup?._id ?? o.optionGroup))
    if (!group) continue
    const driver = o.dependsOn ? byId.get(String(o.dependsOn?._id ?? o.dependsOn)) : null
    const start = rows.length
    const add = (cells) => rows.push({ product: p.name, field: names.get(String(group._id)), ...cells })

    for (const [code, amounts] of entries(o.valueOverrides)) add({ choice: choiceName(group, code), ...tiers(amounts) })
    for (const [pack, byChoice] of entries(o.packOverrides)) {
      for (const [code, amounts] of entries(byChoice)) add({ choice: choiceName(group, code), pack: Number(pack), ...tiers(amounts) })
    }
    for (const [pack, codes] of entries(o.packUnavailable)) {
      for (const code of codes ?? []) add({ choice: choiceName(group, code), pack: Number(pack), notAvailable: 'Yes' })
    }
    if (driver) {
      const dependsOn = names.get(String(driver._id))
      for (const [driverCode, prices] of entries(o.driverPrices)) {
        const when = choiceName(driver, driverCode)
        for (const [code, amounts] of entries(prices?.every)) {
          add({ choice: choiceName(group, code), dependsOn, when, ...tiers(amounts) })
        }
        for (const [pack, byChoice] of entries(prices?.packs)) {
          for (const [code, amounts] of entries(byChoice)) {
            add({ choice: choiceName(group, code), dependsOn, when, pack: Number(pack), ...tiers(amounts) })
          }
        }
      }
      if (!rows.slice(start).some((r) => r.dependsOn)) add({ dependsOn })
    }
    if (rows.length === start) add({})
    if (o.required) rows[start].required = 'Yes'
  }
  return rows
}

const GREEN = 'FFE8F3EC'
const PACK_FILLS = ['FFFFF4DB', 'FFE6F0FA']
const IMAGE_FILL = 'FFF3E8F8'

function addSheet(wb, name, columns, fillFor) {
  const sheet = wb.addWorksheet(name, { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] })
  sheet.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width }))
  const header = sheet.getRow(1)
  header.height = 32
  columns.forEach((c, i) => {
    const cell = header.getCell(i + 1)
    cell.font = { bold: true }
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillFor(c) } }
    if (c.note) cell.note = c.note
  })
  return sheet
}

const dropdown = (formula, title, error) => ({
  type: 'list',
  allowBlank: true,
  formulae: [formula],
  showErrorMessage: true,
  errorTitle: title,
  error,
})

/**
 * The file to download, with the category's current products — details,
 * photos, packs and fields — already filled in.
 */
export async function buildWorkbook(ExcelJS, { categoryName, leaves, hasSubcategories, products = [], library = [] }) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'MRPrint World'
  const columns = columnsFor(hasSubcategories)
  const names = fieldNames(library)
  const byId = new Map(library.map((g) => [String(g._id), g]))

  /* Instructions */
  const guide = wb.addWorksheet('Instructions')
  guide.getColumn(1).width = 120
  const lines = [
    [`Bulk upload — ${categoryName}`, { bold: true, size: 16 }],
    [''],
    ['How it works', { bold: true, size: 12 }],
    ['1. Products sheet: one row per product — details, photo links and quantity packs. Do not rename or delete the header rows.'],
    ['2. Options sheet: the fields a product offers (Size, Printing sides…) and what each choice costs. One row per price.'],
    ['3. Save the file as .xlsx and upload it from the admin panel: Categories → Bulk upload.'],
    ['4. You will see what every product will do before anything is saved. Products with a problem are listed and skipped.'],
    [''],
    ['Products sheet', { bold: true, size: 12 }],
    ['• Columns marked * are required. A product name that already exists in this category updates that product.'],
    ['• When updating, a blank cell leaves that detail as it is. To remove something, edit the product in the admin panel.'],
    ['• Specifications, Materials, Sizes, Customisation, Common applications: one item per line (Alt + Enter), or separate with ;'],
    ['• Image links: paste a link to each photo (Google Drive: share it with "Anyone with the link"). Photos are ADDED — a link the product already has is skipped. Remove photos in the admin panel.'],
    ['• Quantity packs: "Pack 1 quantity" and its prices, then Pack 2… up to 10. Each price is for the whole pack. Filling any pack replaces all the packs; leave them all blank to keep the prices.'],
    ['• Trade and corporate prices can be typed, or filled from "Trade % below retail" and "Corporate % below retail".'],
    ['• A customer type left without a price is asked to contact you instead of buying online.'],
    ['• Live on website: Yes or No. New products stay hidden unless you write Yes.'],
    [''],
    ['Options sheet', { bold: true, size: 12 }],
    ['• Fields must already be in the field library (Admin → Product Options). The "Field choices" sheet lists every field and its choices.'],
    ['• A product with rows here gets exactly these fields — any other field it had is removed. A product with no rows here keeps its fields.'],
    ['• A row with only Product name and Field adds the field at its usual prices. Customer must answer = Yes makes it required.'],
    ['• Choice + prices, Pack blank: that choice\'s price for every quantity. Choice + Pack + prices: its price on that pack only.'],
    ['• Price depends on + When: the price when the other field has that choice — e.g. Printing sides "Both sides" costs 500 When Size is A4.'],
    ['• Not available = Yes with a Choice and a Pack: that choice cannot be picked on that pack.'],
    ['• Blank prices use the field\'s usual price. Trade and corporate can be filled with the % columns.'],
    [''],
    ['Example', { bold: true, size: 12 }],
    ['Products: Matt Visiting Card | Visiting Cards | Yes | … | Image 1 link: https://… | Pack 1 quantity 500, retail 1000 | Pack 2 quantity 1000, retail 1500'],
    ['Options:  Matt Visiting Card | Size | Yes | A4 | | | | 100'],
    ['Options:  Matt Visiting Card | Printing sides | Yes | Both sides | Size | A4 | 1000 | 800 | 680 | 620'],
    ['Options:  Matt Visiting Card | Paper | | Textured | | | 1000 | | | | Yes'],
    [''],
    [`Up to ${MAX_ROWS} products per file.`],
  ]
  for (const [text, font] of lines) {
    const row = guide.addRow([text])
    if (font) row.font = font
  }

  /* Products */
  const sheet = addSheet(wb, 'Products', columns, (c) => (c.pack ? PACK_FILLS[c.pack % 2] : c.image ? IMAGE_FILL : GREEN))
  for (const p of products) sheet.addRow(productRow(p, leaves))

  /* Options */
  const optionSheet = addSheet(wb, 'Options', OPTION_COLUMNS, (c) =>
    ['retail', 'trade', 'corporate', 'tradeOff', 'corporateOff'].includes(c.key) ? PACK_FILLS[0] : GREEN,
  )
  let optionCount = 0
  for (const p of products) {
    for (const row of optionRows(p, byId, names)) {
      optionSheet.addRow(row)
      optionCount += 1
    }
  }

  /* Field choices (reference) */
  const reference = wb.addWorksheet('Field choices', { views: [{ state: 'frozen', ySplit: 1 }] })
  reference.columns = [
    { header: 'Field', key: 'field', width: 30 },
    { header: 'Choices', key: 'choices', width: 70 },
    { header: 'What a price means', key: 'kind', width: 26 },
  ]
  reference.getRow(1).font = { bold: true }
  const KIND = { FLAT: '+ ₹ for the order', PER_SQFT: '+ ₹ per sq.ft', PERCENT: '+ % of the price', MULTIPLIER: '× the price' }
  for (const g of [...library].sort((a, b) => a.label.localeCompare(b.label))) {
    const values = (g.values ?? []).filter((v) => v.isActive !== false)
    const kinds = [...new Set(values.map((v) => KIND[v.deltaType ?? 'FLAT']))]
    reference.addRow({
      field: names.get(String(g._id)),
      choices: values.length ? values.map((v) => v.label).join(', ') : '(no choices — the customer types or picks a value)',
      kind: kinds.join(' / '),
    })
  }

  /* Hidden lists feeding the dropdowns */
  const lists = wb.addWorksheet('Lists', { state: 'hidden' })
  lists.getCell('A1').value = 'Subcategories'
  leaves.forEach((leaf, i) => {
    lists.getCell(`A${i + 2}`).value = leaf.label
  })
  const fieldList = [...names.values()].sort((a, b) => a.localeCompare(b))
  lists.getCell('B1').value = 'Fields'
  fieldList.forEach((name, i) => {
    lists.getCell(`B${i + 2}`).value = name
  })

  const colOf = (cols, key) => cols.findIndex((c) => c.key === key) + 1
  const listKeys = columns.filter((c) => c.list).map((c) => c.key)
  const yesNoList = dropdown('"Yes,No"', 'Yes or No', 'Choose Yes or No.')

  for (let r = 2; r <= Math.max(products.length + 1, MAX_ROWS + 1); r += 1) {
    const row = sheet.getRow(r)
    if (hasSubcategories) {
      row.getCell(colOf(columns, 'category')).dataValidation = dropdown(
        `Lists!$A$2:$A$${leaves.length + 1}`,
        'Subcategory',
        'Pick a subcategory from the list.',
      )
    }
    row.getCell(colOf(columns, 'live')).dataValidation = yesNoList
    if (r <= products.length + 1) {
      for (const key of listKeys) row.getCell(colOf(columns, key)).alignment = { wrapText: true, vertical: 'top' }
    }
  }

  for (let r = 2; r <= Math.max(optionCount + 1, 2000); r += 1) {
    const row = optionSheet.getRow(r)
    if (fieldList.length) {
      const fields = dropdown(`Lists!$B$2:$B$${fieldList.length + 1}`, 'Field', 'Pick a field from the list.')
      row.getCell(colOf(OPTION_COLUMNS, 'field')).dataValidation = fields
      row.getCell(colOf(OPTION_COLUMNS, 'dependsOn')).dataValidation = fields
    }
    row.getCell(colOf(OPTION_COLUMNS, 'required')).dataValidation = yesNoList
    row.getCell(colOf(OPTION_COLUMNS, 'notAvailable')).dataValidation = yesNoList
  }

  return wb.xlsx.writeBuffer()
}

/* ── Reading a filled file ─────────────────────────────────────────────── */

/** A cell's text, whatever Excel stored: plain, rich text, a formula result, a link. */
function cellText(value) {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'object') {
    if (Array.isArray(value.richText)) return value.richText.map((t) => t.text).join('')
    if ('result' in value) return cellText(value.result)
    if ('text' in value) return cellText(value.text)
    if ('hyperlink' in value) return cellText(value.hyperlink)
    return ''
  }
  return String(value)
}

/** Reads a sheet's rows as { rowNumber, cells: { key: text } }, finding columns by their headers. */
function readRows(sheet, columns, sheetName) {
  const byHeader = new Map(columns.map((c) => [normalise(c.header), c.key]))
  const keyAt = new Map()
  sheet.getRow(1).eachCell((cell, col) => {
    const key = byHeader.get(normalise(cellText(cell.value)))
    if (key) keyAt.set(col, key)
  })
  const first = columns[0]
  if (![...keyAt.values()].includes(first.key)) {
    throw new Error(`The ${sheetName} sheet has no "${first.header.replace(' *', '')}" column. Download the Excel from here and keep its header row.`)
  }
  const rows = []
  sheet.eachRow((sheetRow, rowNumber) => {
    if (rowNumber === 1) return
    const cells = {}
    for (const [col, key] of keyAt) cells[key] = cellText(sheetRow.getCell(col).value).trim()
    if (Object.values(cells).some(Boolean)) rows.push({ rowNumber, cells })
  })
  return rows
}

/** A number from a cell, tolerant of ₹, commas and %. */
function numberFrom(raw, { min = 0, max = Infinity, integer = false } = {}) {
  const text = String(raw ?? '').replace(/[₹,%\s]/g, '')
  if (!text) return { value: undefined }
  const n = Number(text)
  if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) {
    return { error: `"${raw}" is not a valid ${integer ? 'whole number' : 'number'}` }
  }
  return { value: n }
}

const LIMITS = { name: 200, shortDescription: 400, description: 8000, unit: 24, hsnCode: 20, seoTitle: 200, seoDescription: 400 }
const LABELS = Object.fromEntries(columnsFor(true).map((c) => [c.key, c.header.replace(' *', '')]))

/**
 * Products from a filled workbook, with their fields from the Options sheet.
 * Each is { row, rowLabel, name, categoryLabel, packCount, imageCount,
 * fieldCount, errors, payload } — payload is what the API takes, sent only
 * when errors is empty. Throws when the file is not a usable bulk-upload
 * file at all.
 */
export async function parseWorkbook(ExcelJS, buffer, { leaves, hasSubcategories, categoryName, library = [] }) {
  const wb = new ExcelJS.Workbook()
  try {
    await wb.xlsx.load(buffer)
  } catch {
    throw new Error('Could not read this file. Save it as an Excel workbook (.xlsx) and try again.')
  }

  const sheet =
    wb.getWorksheet('Products') ??
    wb.worksheets.find((ws) => ws.state !== 'hidden' && ws.state !== 'veryHidden' && !['Instructions', 'Options', 'Field choices'].includes(ws.name))
  if (!sheet) throw new Error('This file has no Products sheet. Download the Excel from here and fill that in.')

  const leafByLabel = new Map(leaves.map((l) => [normalise(l.label.replace(/\s*>\s*/g, ' > ')), l]))
  const leafByLastName = new Map()
  for (const l of leaves) {
    const last = normalise(l.label.split('>').pop())
    leafByLastName.set(last, leafByLastName.has(last) ? null : l) // null = ambiguous
  }

  const products = []
  const byKey = new Map() // product name → its first entry

  for (const { rowNumber, cells } of readRows(sheet, columnsFor(true), 'Products')) {
    const errors = []
    const payload = { row: rowNumber }
    const text = (key) => cells[key] ?? ''
    const number = (key, opts) => {
      const { value, error } = numberFrom(text(key), opts)
      if (error) errors.push(`${LABELS[key]}: ${error}`)
      return value
    }

    payload.name = text('name')
    if (!payload.name) errors.push('Product name is missing')
    for (const [key, limit] of Object.entries(LIMITS)) {
      if (!text(key)) continue
      if (key !== 'name') payload[key] = text(key)
      if (text(key).length > limit) errors.push(`${LABELS[key]} is longer than ${limit} characters`)
    }

    for (const key of LIST_KEYS) {
      if (!text(key)) continue
      const items = text(key)
        .split(/\r?\n|;/)
        .map((s) => s.trim())
        .filter(Boolean)
      if (items.length > 40) errors.push(`${LABELS[key]}: up to 40 items`)
      if (items.some((s) => s.length > 300)) errors.push(`${LABELS[key]}: each item up to 300 characters`)
      payload[key] = items
    }

    const tax = number('taxPercent', { max: 100 })
    if (tax !== undefined) payload.taxPercent = tax

    const live = yesNo(text('live'))
    if (live === null) errors.push(`Live on website: write Yes or No, not "${text('live')}"`)
    else if (live !== undefined) payload.isActive = live

    let categoryLabel = ''
    if (text('category')) {
      const wanted = normalise(text('category').replace(/\s*>\s*/g, ' > '))
      const leaf = leafByLabel.get(wanted) ?? leafByLastName.get(wanted)
      if (leaf) {
        payload.category = leaf.id
        categoryLabel = leaf.label
      } else {
        errors.push(`"${text('category')}" is not a subcategory of ${categoryName} — pick one from the dropdown`)
      }
    } else if (!hasSubcategories) {
      payload.category = leaves[0]?.id
    }

    const images = []
    for (let i = 1; i <= MAX_IMAGES; i += 1) {
      const link = text(`image${i}`)
      if (!link) continue
      if (!/^https?:\/\/\S+$/i.test(link)) errors.push(`Image ${i} link: "${link.slice(0, 40)}" is not a web link`)
      else if (link.length > 2000) errors.push(`Image ${i} link is too long`)
      else images.push(link)
    }
    if (images.length) payload.images = images

    // Quantity packs, with blank trade and corporate filled from the % columns.
    const tradeOff = percentOrNull(text('tradeOff').replace('%', '').trim())
    const corporateOff = percentOrNull(text('corporateOff').replace('%', '').trim())
    if (text('tradeOff') && tradeOff === null) errors.push('Trade % below retail must be between 0 and 99')
    if (text('corporateOff') && corporateOff === null) errors.push('Corporate % below retail must be between 0 and 99')

    const packs = []
    for (let i = 1; i <= MAX_PACKS; i += 1) {
      const keys = [`pack${i}Qty`, `pack${i}Retail`, `pack${i}Trade`, `pack${i}Corporate`]
      if (!keys.some((k) => text(k))) continue
      const qty = number(keys[0], { min: 1, max: 999_999_999, integer: true })
      const amounts = {}
      const [retail, trade, corporate] = keys.slice(1).map((k) => number(k))
      if (retail !== undefined) amounts.B2C = retail
      if (trade !== undefined) amounts.B2B = trade
      if (corporate !== undefined) amounts.CORPORATE = corporate
      const filled = tiersFromRetail(retail, tradeOff, corporateOff)
      if (amounts.B2B === undefined && filled.B2B !== undefined) amounts.B2B = filled.B2B
      if (amounts.CORPORATE === undefined && filled.CORPORATE !== undefined) amounts.CORPORATE = filled.CORPORATE

      const typedPrice = keys.slice(1).some((k) => text(k))
      if (!text(keys[0])) errors.push(`Pack ${i}: the quantity is missing`)
      else if (qty === undefined || (typedPrice && !Object.keys(amounts).length)) {
        // Already reported as not a valid number.
      } else if (!Object.keys(amounts).length) errors.push(`Pack ${i}: enter at least one price`)
      else if (packs.some((p) => p.qty === qty)) errors.push(`Pack ${i}: quantity ${qty} is already used by another pack`)
      else packs.push({ qty, amounts })
    }
    if (packs.length) payload.packs = packs

    const entry = {
      row: rowNumber,
      rowLabel: String(rowNumber),
      name: payload.name,
      categoryLabel,
      packCount: packs.length,
      imageCount: images.length,
      fieldCount: 0,
      errors,
      payload,
      percents: { tradeOff, corporateOff },
    }
    products.push(entry)
    if (payload.name && !byKey.has(nameKey(payload.name))) byKey.set(nameKey(payload.name), entry)
  }

  /* Options sheet */
  const optionSheet = wb.getWorksheet('Options')
  if (optionSheet) {
    const findField = fieldFinder(library)
    const drafts = new Map() // entry → Map(field id → draft)
    const seenCells = new Map() // entry → Map(cell key → row)

    for (const { rowNumber, cells } of readRows(optionSheet, OPTION_COLUMNS, 'Options')) {
      const text = (key) => cells[key] ?? ''
      const productName = text('product')
      if (!productName) {
        products.push({
          row: OPTIONS_ONLY_ROW + rowNumber,
          rowLabel: `Options ${rowNumber}`,
          name: '',
          categoryLabel: '',
          packCount: 0,
          imageCount: 0,
          fieldCount: 0,
          errors: [`Options row ${rowNumber}: Product name is missing`],
          payload: null,
        })
        continue
      }

      let entry = byKey.get(nameKey(productName))
      if (!entry) {
        entry = {
          row: OPTIONS_ONLY_ROW + rowNumber,
          rowLabel: `Options ${rowNumber}`,
          name: productName,
          categoryLabel: '',
          packCount: 0,
          imageCount: 0,
          fieldCount: 0,
          errors: [],
          payload: { row: OPTIONS_ONLY_ROW + rowNumber, name: productName, optionsOnly: true },
          percents: { tradeOff: null, corporateOff: null },
        }
        products.push(entry)
        byKey.set(nameKey(productName), entry)
      }
      if (!drafts.has(entry)) {
        drafts.set(entry, new Map())
        seenCells.set(entry, new Map())
      }
      const fields = drafts.get(entry)
      const seen = seenCells.get(entry)
      const problem = (message) => entry.errors.push(`Options row ${rowNumber}: ${message}`)

      const group = text('field') ? findField(text('field')) : undefined
      if (!text('field')) {
        problem('Field is missing')
        continue
      }
      if (group === null) {
        problem(`"${text('field')}" matches more than one field — pick it from the dropdown`)
        continue
      }
      if (!group) {
        problem(`"${text('field')}" is not in the field library — add it in Admin → Product Options first`)
        continue
      }
      const id = String(group._id)
      if (!fields.has(id)) {
        fields.set(id, { group, required: false, dependsOn: null, valueOverrides: {}, packOverrides: {}, packUnavailable: {}, driverPrices: {} })
      }
      const draft = fields.get(id)

      const required = yesNo(text('required'))
      if (required === null) {
        problem(`Customer must answer: write Yes or No, not "${text('required')}"`)
        continue
      }
      if (required) draft.required = true

      if (text('dependsOn')) {
        const driver = findField(text('dependsOn'))
        if (!driver) {
          problem(`Price depends on: "${text('dependsOn')}" is not ${driver === null ? 'a single field' : 'in the field library'}`)
          continue
        }
        if (String(driver._id) === id) {
          problem('a field cannot depend on itself')
          continue
        }
        if (draft.dependsOn && String(draft.dependsOn._id) !== String(driver._id)) {
          problem(`${group.label} already depends on ${draft.dependsOn.label} — a field can depend on one other field`)
          continue
        }
        draft.dependsOn = driver
      }

      let choice = null
      if (text('choice')) {
        choice = findChoice(group, text('choice'))
        if (!choice) {
          problem(`"${text('choice')}" is not a choice of ${group.label} — see the Field choices sheet`)
          continue
        }
      }

      let when = null
      if (text('when')) {
        if (!draft.dependsOn) {
          problem('"When" needs "Price depends on"')
          continue
        }
        when = findChoice(draft.dependsOn, text('when'))
        if (!when) {
          problem(`"${text('when')}" is not a choice of ${draft.dependsOn.label}`)
          continue
        }
      }

      const pack = numberFrom(text('pack'), { min: 1, max: 999_999_999, integer: true })
      if (pack.error) {
        problem(`Pack: ${pack.error}`)
        continue
      }

      const amounts = {}
      let badNumber = null
      for (const [key, tier] of [['retail', 'B2C'], ['trade', 'B2B'], ['corporate', 'CORPORATE']]) {
        const { value, error } = numberFrom(text(key))
        if (error) badNumber = `${OPTION_COLUMNS.find((c) => c.key === key).header}: ${error}`
        else if (value !== undefined) amounts[tier] = value
      }
      if (badNumber) {
        problem(badNumber)
        continue
      }

      const rowTrade = percentOrNull(text('tradeOff').replace('%', '').trim())
      const rowCorporate = percentOrNull(text('corporateOff').replace('%', '').trim())
      if ((text('tradeOff') && rowTrade === null) || (text('corporateOff') && rowCorporate === null)) {
        problem('% below retail must be between 0 and 99')
        continue
      }
      if (amounts.B2C !== undefined && scales(choice)) {
        const filled = tiersFromRetail(
          amounts.B2C,
          rowTrade ?? entry.percents?.tradeOff,
          rowCorporate ?? entry.percents?.corporateOff,
          decimalsFor(choice),
        )
        if (amounts.B2B === undefined && filled.B2B !== undefined) amounts.B2B = filled.B2B
        if (amounts.CORPORATE === undefined && filled.CORPORATE !== undefined) amounts.CORPORATE = filled.CORPORATE
      }

      const notAvailable = yesNo(text('notAvailable'))
      if (notAvailable === null) {
        problem(`Not available: write Yes or No, not "${text('notAvailable')}"`)
        continue
      }
      const priced = Object.keys(amounts).length > 0

      if (notAvailable) {
        if (!choice || pack.value === undefined) {
          problem('Not available needs a Choice and a Pack')
          continue
        }
        if (when || priced) {
          problem('a choice that is not available has no price and no "When"')
          continue
        }
      } else if (priced && !choice) {
        problem('prices need a Choice')
        continue
      } else if (when && !priced) {
        problem('"When" needs a price')
        continue
      }

      if (choice && (priced || notAvailable)) {
        const cellKey = [id, choice.code, pack.value ?? '', when?.code ?? '', notAvailable ? 'x' : '₹'].join('|')
        if (seen.has(cellKey)) {
          problem(`same field, choice, pack and "When" as row ${seen.get(cellKey)}`)
          continue
        }
        seen.set(cellKey, rowNumber)
      }

      const packKey = pack.value === undefined ? null : String(pack.value)
      if (notAvailable) {
        draft.packUnavailable[packKey] = [...(draft.packUnavailable[packKey] ?? []), choice.code]
      } else if (priced && when) {
        const byDriver = (draft.driverPrices[when.code] ??= {})
        if (packKey) ((byDriver.packs ??= {})[packKey] ??= {})[choice.code] = amounts
        else (byDriver.every ??= {})[choice.code] = amounts
      } else if (priced && packKey) {
        ;(draft.packOverrides[packKey] ??= {})[choice.code] = amounts
      } else if (priced) {
        draft.valueOverrides[choice.code] = amounts
      }
    }

    // Each product's fields, in the order they first appear.
    for (const [entry, fields] of drafts) {
      const options = []
      for (const [id, d] of fields) {
        if (d.dependsOn && !fields.has(String(d.dependsOn._id))) {
          entry.errors.push(`Options: ${d.group.label} depends on ${d.dependsOn.label}, which has no row for this product`)
        }
        const option = { optionGroup: id, required: d.required }
        if (d.dependsOn) option.dependsOn = String(d.dependsOn._id)
        for (const key of ['valueOverrides', 'packOverrides', 'packUnavailable', 'driverPrices']) {
          if (Object.keys(d[key]).length) option[key] = d[key]
        }
        options.push(option)
      }
      if (options.length > 30) entry.errors.push('Options: up to 30 fields per product')
      if (entry.payload) entry.payload.options = options
      entry.fieldCount = options.length
    }
  }

  for (const entry of products) delete entry.percents

  if (products.length > MAX_ROWS) {
    throw new Error(`This file has ${products.length} products. Upload up to ${MAX_ROWS} at a time.`)
  }
  return products
}
