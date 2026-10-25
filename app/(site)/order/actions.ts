'use server'

import { createClient } from '@/lib/supabase/server'
import { sendTelegram, type TelegramOrderPhoto } from '@/lib/telegram'
import type { CartItem } from '@/lib/types'

function escapeTelegramHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[char]
  })
}

export async function submitOrder(data: {
  tableId: string
  token: string
  items: CartItem[]
}) {
  try {
    if (!data || typeof data.tableId !== 'string' || typeof data.token !== 'string' ||
        !data.tableId.trim() || !data.token.trim() || data.tableId.length > 64 || data.token.length > 256 ||
        !Array.isArray(data.items) || data.items.length === 0 || data.items.length > 30) {
      return { success: false, error: 'Invalid order' }
    }
    const requested = data.items.map(item => ({ id: item?.id, quantity: item?.quantity, notes: item?.notes }))
    if (requested.some(item => typeof item.id !== 'string' || item.id.length === 0 || item.id.length > 128 ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 ||
        (item.notes !== undefined && (typeof item.notes !== 'string' || item.notes.length > 500))) ||
        new Set(requested.map(item => item.id)).size !== requested.length ||
        requested.reduce((sum, item) => sum + item.quantity, 0) > 100) {
      return { success: false, error: 'Invalid order items' }
    }
    const supabase = await createClient()
    const { data: table, error: tableError } = await supabase.from('tables')
      .select('number').eq('number', data.tableId).eq('token', data.token).eq('active', true).single()
    if (tableError || !table) return { success: false, error: 'Invalid table QR code' }
    const { data: menu, error: menuError } = await supabase.from('menu_items')
      .select('id, name_km, name_en, description, price, category, image_url, available')
      .in('id', requested.map(item => item.id)).eq('available', true)
    if (menuError || !menu || menu.length !== requested.length) {
      return { success: false, error: 'Menu changed; please reload' }
    }
    const byId = new Map(menu.map(item => [item.id, item]))
    const pricedItems: CartItem[] = []
    let cents = 0
    for (const item of requested) {
      const saved = byId.get(item.id)
      if (!saved || typeof saved.price !== 'number' || !Number.isFinite(saved.price) || saved.price < 0 ||
          Math.abs(saved.price * 100 - Math.round(saved.price * 100)) > 0.000001) {
        return { success: false, error: 'Invalid menu price' }
      }
      cents += Math.round(saved.price * 100) * item.quantity
      pricedItems.push({ ...saved, quantity: item.quantity, notes: item.notes?.trim() || undefined })
    }
    const total = cents / 100
    /* ── Insert order ── */
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        table_id: table.number,
        items:    pricedItems,
        total,
        status:   'pending',
      })
      .select()
      .single()

    if (error) throw error

    // Send Telegram notification (optional)
    const itemList = pricedItems
      .map((item, index) => {
        const name = escapeTelegramHtml(item.name_en || item.name_km)
        const khmerName = item.name_en && item.name_km
          ? `\n   ${escapeTelegramHtml(item.name_km)}`
          : ''
        const note = item.notes?.trim()
          ? `\n   📝 ${escapeTelegramHtml(item.notes.trim())}`
          : ''
        return `${index + 1}. <b>${item.quantity} × ${name}</b>${khmerName}${note}`
      })
      .join('\n')

    // Optional KDS deep-links
    const kitchenUrl  = process.env.KITCHEN_APP_URL
    const adminKdsUrl = process.env.ADMIN_KDS_URL
    const links = [
      kitchenUrl ? `👨‍🍳 Kitchen: ${escapeTelegramHtml(kitchenUrl)}` : null,
      adminKdsUrl ? `🖥 Admin: ${escapeTelegramHtml(adminKdsUrl)}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    // Resolve images from the saved menu rather than accepting client-supplied URLs.
    // A lookup failure must not prevent an already-created order's text alert.
    const photos: TelegramOrderPhoto[] = []
    try {
      for (const item of pricedItems) {
        const url = item.image_url
        if (!url) continue
        photos.push({ url, caption:
          `Order #${order.id.slice(0, 8).toUpperCase()} · Table ${table.number}\n` +
          `${item.quantity} × ${item.name_en || item.name_km}\n` +
          (item.name_en && item.name_km ? `${item.name_km}\n` : '') +
          (item.notes?.trim() ? `📝 ${item.notes.trim()}` : ''),
        })
      }
    } catch {
      console.error('Menu images unavailable for order alert; sending text only')
    }

    await sendTelegram(
      `🍽️ <b>NEW ORDER · ការកុម្ម៉ង់ថ្មី</b>\n\n` +
        `<b>Order:</b> <code>#${escapeTelegramHtml(order.id.slice(0, 8).toUpperCase())}</code>\n` +
        `<b>Table / តុ:</b> <b>${escapeTelegramHtml(table.number)}</b>\n\n` +
        `<b>ITEMS · បញ្ជីមុខម្ហូប</b>\n${itemList}\n\n` +
        `<b>Total / សរុប: $${total.toFixed(2)}</b>` +
        (links ? `\n\n${links}` : ''),
      photos
    )

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order submission failed:', error)
    return { success: false, error: 'Failed to submit order' }
  }
}
