import type { CartItem, MenuItem } from './types'

export function isSugarSchemaUnavailable(error: { code?: string; message?: string; details?: string } | null | undefined) {
  if (!error || !['42703', 'PGRST204'].includes(error.code ?? '')) return false
  const description = `${error.message ?? ''} ${error.details ?? ''}`
  return description.includes('sugar_levels') || description.includes('default_sugar_level')
}

export function cartItemKey(item: Pick<CartItem, 'id' | 'sugar_level' | 'notes'>) {
  return JSON.stringify([item.id, item.sugar_level ?? null, item.notes?.trim() || ''])
}

export function addCartItem(cart: CartItem[], item: MenuItem, quantity: number, notes: string, sugar_level?: number): CartItem[] {
  const next = { ...item, quantity, notes: notes.trim() || undefined, ...(sugar_level !== undefined ? { sugar_level } : {}) }
  const key = cartItemKey(next)
  const exists = cart.some(line => cartItemKey(line) === key)
  return exists ? cart.map(line => cartItemKey(line) === key ? { ...line, quantity: line.quantity + quantity } : line) : [...cart, next]
}

// Resolve every selection and price against the current saved menu on the server.
export function prepareOrderItems(
  requested: Array<Pick<CartItem, 'id' | 'quantity'> & Pick<Partial<CartItem>, 'notes' | 'sugar_level'>>,
  menu: MenuItem[],
) {
  if (!Array.isArray(requested) || !requested.length || requested.length > 100) throw new Error('Invalid order items. / ការកុម្ម៉ង់មិនត្រឹមត្រូវ។')
  return requested.map(line => {
    const item = menu.find(item => item.id === line?.id)
    if (!item?.available || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 100) {
      throw new Error('An item is unavailable or its quantity is invalid. / សូមពិនិត្យការកុម្ម៉ង់។')
    }
    const levels = item.sugar_levels ?? []
    if (levels.length
      ? typeof line.sugar_level !== 'number' || !levels.includes(line.sugar_level)
      : line.sugar_level != null) {
      throw new Error('Sugar options changed. Please select your drink again. / សូមជ្រើសរើសកម្រិតជាតិស្ករម្ដងទៀត។')
    }
    if (line.notes != null && (typeof line.notes !== 'string' || line.notes.length > 200)) throw new Error('Invalid item notes.')
    const price = Number(item.price)
    if (!Number.isFinite(price) || price < 0) throw new Error('Invalid menu price.')
    return {
      id: item.id, name_en: item.name_en, name_km: item.name_km, category: item.category,
      price, available: item.available, quantity: line.quantity,
      ...(line.notes?.trim() ? { notes: line.notes.trim() } : {}),
      ...(levels.length ? { sugar_level: line.sugar_level } : {}),
    } satisfies CartItem
  })
}
