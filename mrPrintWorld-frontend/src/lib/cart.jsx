import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext'
import { apiPost, isApiEnabled } from './api'

/**
 * Cart.
 *
 * The browser stores INTENT only — which product, how many, what size, which
 * options. It never stores or computes a price. Every figure on the cart page
 * comes back from POST /api/cart/price, and the server re-prices the whole
 * cart again at checkout.
 *
 * That is why editing localStorage achieves nothing: there is no price in
 * there to edit, and the checkout endpoint rejects any request that tries to
 * supply one.
 */

const STORAGE_KEY = 'mrpw_cart_v1'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Private mode, cleared storage, or a browser blocking site data.
    return []
  }
}

function writeStored(lines) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    /* not fatal — the cart simply won't survive a reload */
  }
}

/** Two lines are the same item only if size AND every option match. */
function sameLine(a, b) {
  if (a.slug !== b.slug) return false
  if ((a.width ?? null) !== (b.width ?? null)) return false
  if ((a.height ?? null) !== (b.height ?? null)) return false
  const key = (l) =>
    JSON.stringify([...(l.selections ?? [])].sort((x, y) => x.group.localeCompare(y.group)))
  return key(a) === key(b)
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(readStored)
  const [priced, setPriced] = useState(null)
  const [pricing, setPricing] = useState(false)

  useEffect(() => writeStored(lines), [lines])

  // Re-price whenever the cart changes. Also re-runs when the customer signs
  // in, because their tier — and therefore every price — may differ.
  const repriceNow = useCallback(async () => {
    if (!isApiEnabled || lines.length === 0) {
      setPriced(null)
      return
    }
    setPricing(true)
    try {
      const { data } = await apiPost('/api/cart/price', { lines })
      setPriced(data)
    } catch {
      setPriced(null)
    } finally {
      setPricing(false)
    }
  }, [lines])

  useEffect(() => {
    repriceNow()
  }, [repriceNow])

  const add = useCallback((line) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => sameLine(l, line))
      if (idx === -1) return [...prev, line]
      const next = [...prev]
      next[idx] = { ...next[idx], quantity: next[idx].quantity + line.quantity }
      return next
    })
  }, [])

  const updateQuantity = useCallback((index, quantity) => {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, quantity: Math.max(1, quantity) } : l)))
  }, [])

  const remove = useCallback((index) => {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(
    () => ({
      lines,
      priced,
      pricing,
      itemCount: lines.reduce((n, l) => n + (l.quantity ?? 1), 0),
      add,
      updateQuantity,
      remove,
      clear,
      reprice: repriceNow,
    }),
    [lines, priced, pricing, add, updateQuantity, remove, clear, repriceNow],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
