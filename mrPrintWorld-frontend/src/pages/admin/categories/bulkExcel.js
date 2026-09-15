/**
 * The bulk-upload Excel: building the file to download, and reading a filled
 * one back into rows for the API.
 *
 * ExcelJS is passed in rather than imported, so the admin panel only loads it
 * (about 1 MB) when someone actually downloads or uploads a file.
 */

import { percentOrNull, tiersFromRetail } from '../products/tierPercents.js'

export const MAX_PACKS = 10
export const MAX_ROWS = 500

const LIST_NOTE = 'One per line (Alt + Enter inside the cell), or separate them with ;'

/** Every column, in order. `hasSubcategories` adds the Subcategory dropdown. */
export function columnsFor(hasSubcategories) {
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
    { key: 'name', header: 'Product name *', width: 34, list: false, note: 'Required. A name already in this category updates that product; a new name creates one.' },
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
    { key: 'tradeOff', header: 'Trade % below retail', width: 12, note: 'Optional. Fills every blank pack Trade price from its Retail price, e.g. 15.' },
    { key: 'corporateOff', header: 'Corporate % below retail', width: 13, note: 'Optional. Fills every blank pack Corporate price from its Retail price, e.g. 22.' },
    ...packs,
  ]
}

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

const readTier = (amounts, tier) => (amounts ? (amounts instanceof Map ? amounts.get(tier) : amounts[tier]) : undefined)

/** A product as a spreadsheet row, so existing products can be changed and uploaded again. */
function rowFromProduct(p, leaves) {
  const leaf = (p.categories ?? []).map((c) => String(c._id ?? c)).map((id) => leaves.find((l) => l.id === id)).find(Boolean)
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
  for (const key of ['specifications', 'materials', 'sizes', 'customization', 'applications']) {
    if (p[key]?.length) row[key] = p[key].join('\n')
  }
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

const GREEN = 'FFE8F3EC'
const PACK_FILLS = ['FFFFF4DB', 'FFE6F0FA']

/**
 * The file to download: an Instructions sheet, the Products sheet (with the
 * category's current products already in it), and a hidden list feeding the
 * Subcategory dropdown.
 */
export async function buildWorkbook(ExcelJS, { categoryName, leaves, hasSubcategories, products = [] }) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'MRPrint World'
  const columns = columnsFor(hasSubcategories)

  /* Instructions */
  const guide = wb.addWorksheet('Instructions')
  guide.getColumn(1).width = 110
  const lines = [
    [`Bulk upload — ${categoryName}`, { bold: true, size: 16 }],
    [''],
    ['How it works', { bold: true, size: 12 }],
    ['1. Fill in the Products sheet: one row per product. Do not rename or delete the header row.'],
    ['2. Save the file (keep it as .xlsx) and upload it from the admin panel: Categories → Bulk upload.'],
    ['3. You will see what every row will do before anything is saved. Rows with a problem are listed and skipped.'],
    ['4. Add photos afterwards, from each product in the admin panel.'],
    [''],
    ['Rules', { bold: true, size: 12 }],
    ['• Columns marked * are required. A product name that already exists in this category updates that product.'],
    ['• When updating, a blank cell leaves that detail as it is. To remove something, edit the product in the admin panel.'],
    ['• Specifications, Materials, Sizes, Customisation and Common applications: one item per line (Alt + Enter), or separate with ;'],
    ['• Quantity packs: fill "Pack 1 quantity" and its prices, then Pack 2, and so on — up to 10 packs. Each price is for the whole pack.'],
    ['• Filling any pack replaces all the packs of an existing product. Leave every pack blank to keep its prices as they are.'],
    ['• Trade and corporate prices can be typed, or filled from "Trade % below retail" and "Corporate % below retail".'],
    ['• A customer type left without a price is asked to contact you instead of buying online.'],
    ['• Live on website: Yes or No. New products stay hidden unless you write Yes.'],
    ['• Fields such as Size or Printing sides, and their prices, are set afterwards in the product\'s Options tab.'],
    [`• Up to ${MAX_ROWS} products per file.`],
    [''],
    ['Example', { bold: true, size: 12 }],
    ['Product name: Matt Visiting Card   |   Subcategory: Visiting Cards   |   Live on website: Yes'],
    ['Specifications: 350 GSM (new line) Matt lamination   |   Sold in: pieces   |   GST %: 18'],
    ['Pack 1 quantity: 500, retail 1000, trade 850, corporate 780   |   Pack 2 quantity: 1000, retail 1500 …'],
  ]
  for (const [text, font] of lines) {
    const row = guide.addRow([text])
    if (font) row.font = font
  }

  /* Products */
  const sheet = wb.addWorksheet('Products', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] })
  sheet.columns = columns.map((c) => ({ header: c.header, key: c.key, width: c.width }))
  const header = sheet.getRow(1)
  header.height = 32
  columns.forEach((c, i) => {
    const cell = header.getCell(i + 1)
    cell.font = { bold: true }
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: c.pack ? PACK_FILLS[c.pack % 2] : GREEN },
    }
    if (c.note) cell.note = c.note
  })

  for (const p of products) sheet.addRow(rowFromProduct(p, leaves))

  const listColumns = new Set(columns.filter((c) => c.list).map((c) => c.key))
  const lastRow = Math.max(products.length + 1, MAX_ROWS + 1)
  const colOf = (key) => columns.findIndex((c) => c.key === key) + 1

  /* Hidden list for the Subcategory dropdown */
  if (hasSubcategories) {
    const lists = wb.addWorksheet('Lists', { state: 'hidden' })
    lists.addRow(['Subcategories'])
    for (const leaf of leaves) lists.addRow([leaf.label])
  }

  for (let r = 2; r <= lastRow; r += 1) {
    const row = sheet.getRow(r)
    if (hasSubcategories) {
      row.getCell(colOf('category')).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`Lists!$A$2:$A$${leaves.length + 1}`],
        showErrorMessage: true,
        errorTitle: 'Subcategory',
        error: 'Pick a subcategory from the list.',
      }
    }
    row.getCell(colOf('live')).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"Yes,No"'],
      showErrorMessage: true,
      errorTitle: 'Live on website',
      error: 'Choose Yes or No.',
    }
    if (r <= products.length + 1) {
      for (const key of listColumns) row.getCell(colOf(key)).alignment = { wrapText: true, vertical: 'top' }
    }
  }

  return wb.xlsx.writeBuffer()
}

/* ── Reading a filled file ─────────────────────────────────────────────── */

const normalise = (s) => String(s).replace(/\*/g, '').replace(/₹/g, '').replace(/\s+/g, ' ').trim().toLowerCase()

/** A cell's text, whatever Excel stored: plain, rich text, a formula result, a link. */
function cellText(value) {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'object') {
    if (Array.isArray(value.richText)) return value.richText.map((t) => t.text).join('')
    if ('result' in value) return cellText(value.result)
    if ('text' in value) return cellText(value.text)
    return ''
  }
  return String(value)
}

const LIMITS = {
  name: 200,
  shortDescription: 400,
  description: 8000,
  unit: 24,
  hsnCode: 20,
  seoTitle: 200,
  seoDescription: 400,
}
const LABELS = Object.fromEntries(columnsFor(true).map((c) => [c.key, c.header.replace(' *', '')]))

/**
 * Rows from a filled workbook. Each is { row, name, categoryLabel, packCount,
 * errors, payload } — payload is what the API takes, sent only when errors is
 * empty. Throws when the file is not a usable bulk-upload sheet at all.
 */
export async function parseWorkbook(ExcelJS, buffer, { leaves, hasSubcategories, categoryName }) {
  const wb = new ExcelJS.Workbook()
  try {
    await wb.xlsx.load(buffer)
  } catch {
    throw new Error('Could not read this file. Save it as an Excel workbook (.xlsx) and try again.')
  }

  const sheet =
    wb.getWorksheet('Products') ??
    wb.worksheets.find((ws) => ws.state !== 'hidden' && ws.state !== 'veryHidden' && ws.name !== 'Instructions')
  if (!sheet) throw new Error('This file has no Products sheet. Download the Excel from here and fill that in.')

  // Columns are found by their header, so moved columns still work.
  const byHeader = new Map(columnsFor(true).map((c) => [normalise(c.header), c.key]))
  const keyAt = new Map()
  sheet.getRow(1).eachCell((cell, col) => {
    const key = byHeader.get(normalise(cellText(cell.value)))
    if (key) keyAt.set(col, key)
  })
  if (![...keyAt.values()].includes('name')) {
    throw new Error('Could not find the "Product name" column. Download the Excel from here and keep its header row.')
  }

  const leafByLabel = new Map(leaves.map((l) => [normalise(l.label.replace(/\s*>\s*/g, ' > ')), l]))
  const leafByLastName = new Map()
  for (const l of leaves) {
    const last = normalise(l.label.split('>').pop())
    leafByLastName.set(last, leafByLastName.has(last) ? null : l) // null = ambiguous
  }

  const parsed = []
  sheet.eachRow((sheetRow, rowNumber) => {
    if (rowNumber === 1) return
    const cells = {}
    for (const [col, key] of keyAt) cells[key] = cellText(sheetRow.getCell(col).value).trim()
    if (!Object.values(cells).some(Boolean)) return

    const errors = []
    const payload = { row: rowNumber }
    const text = (key) => cells[key] ?? ''

    const number = (key, { min = 0, max = Infinity, integer = false } = {}) => {
      const raw = text(key).replace(/[₹,%\s]/g, '')
      if (!raw) return undefined
      const n = Number(raw)
      if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) {
        errors.push(`${LABELS[key]}: "${text(key)}" is not a valid ${integer ? 'whole number' : 'number'}`)
        return undefined
      }
      return n
    }

    payload.name = text('name')
    if (!payload.name) errors.push('Product name is missing')

    for (const key of Object.keys(LIMITS)) {
      if (key === 'name' || !text(key)) continue
      payload[key] = text(key)
    }
    for (const [key, limit] of Object.entries(LIMITS)) {
      if ((key === 'name' ? payload.name : payload[key])?.length > limit) {
        errors.push(`${LABELS[key]} is longer than ${limit} characters`)
      }
    }

    for (const key of ['specifications', 'materials', 'sizes', 'customization', 'applications']) {
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

    const live = normalise(text('live'))
    if (live) {
      if (['yes', 'y', 'true', '1', 'live'].includes(live)) payload.isActive = true
      else if (['no', 'n', 'false', '0', 'hidden'].includes(live)) payload.isActive = false
      else errors.push(`Live on website: write Yes or No, not "${text('live')}"`)
    }

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

    // Quantity packs, with blank trade and corporate filled from the % columns.
    const tradeOffRaw = text('tradeOff').replace('%', '').trim()
    const corporateOffRaw = text('corporateOff').replace('%', '').trim()
    const tradeOff = percentOrNull(tradeOffRaw)
    const corporateOff = percentOrNull(corporateOffRaw)
    if (tradeOffRaw && tradeOff === null) errors.push('Trade % below retail must be between 0 and 99')
    if (corporateOffRaw && corporateOff === null) errors.push('Corporate % below retail must be between 0 and 99')

    const packs = []
    for (let i = 1; i <= MAX_PACKS; i += 1) {
      const keys = [`pack${i}Qty`, `pack${i}Retail`, `pack${i}Trade`, `pack${i}Corporate`]
      if (!keys.some((k) => text(k))) continue
      const qty = number(keys[0], { min: 1, max: 999_999_999, integer: true })
      const amounts = {}
      const retail = number(keys[1])
      const trade = number(keys[2])
      const corporate = number(keys[3])
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
      else {
        if (packs.some((p) => p.qty === qty)) errors.push(`Pack ${i}: quantity ${qty} is already used by another pack`)
        else packs.push({ qty, amounts })
      }
    }
    if (packs.length) payload.packs = packs

    parsed.push({ row: rowNumber, name: payload.name, categoryLabel, packCount: packs.length, errors, payload })
  })

  if (parsed.length > MAX_ROWS) {
    throw new Error(`This file has ${parsed.length} products. Upload up to ${MAX_ROWS} at a time.`)
  }
  return parsed
}
