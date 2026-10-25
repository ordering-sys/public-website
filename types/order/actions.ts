'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { checkTableAccess } from '@/lib/table-access'
import type { LocationFix } from '@/lib/location'
import { sendTelegram, type TelegramOrderPhoto } from '@/lib/telegram'
import type { CartItem } from '@/lib/types'
import { isSugarSchemaUnavailable, prepareOrderItems } from '@/lib/sugar'

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
  location: LocationFix
  items: CartItem[]
  total?: number
}) {
  try {
    if (!data || typeof data.tableId !== 'string' || typeof data.token !== 'string' ||
        !data.tableId.trim() || !data.token.trim() || data.tableId.length > 64 || data.token.length > 256 ||
        !Array.isArray(data.items) || data.items.length === 0 || data.items.length > 30) {
      return { success: false, error: 'Invalid order' }
    }
    const requested = data.items.map(item => ({
      id: item?.id,
      quantity: item?.quantity,
      notes: item?.notes,
      sugar_level: item?.sugar_level,
    }))
    if (requested.some(item => typeof item.id !== 'string' || item.id.length === 0 || item.id.length > 128 ||
        !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 ||
        (item.notes !== undefined && (typeof item.notes !== 'string' || item.notes.length > 200)) ||
        (item.sugar_level !== undefined && item.sugar_level !== null && !Number.isInteger(item.sugar_level))) ||
        requested.reduce((sum, item) => sum + item.quantity, 0) > 100) {
      return { success: false, error: 'Invalid order items' }
    }

    let table: Awaited<ReturnType<typeof checkTableAccess>>
    try {
      table = await checkTableAccess(data.tableId, data.token, data.location)
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Table access denied' }
    }
    const supabase = createAdminClient()
    const ids = [...new Set(requested.map(item => item.id))]
    let { data: menu, error: menuError } = await supabase.from('menu_items')
      .select('id, name_km, name_en, description, price, category, image_url, available, sugar_levels, default_sugar_level')
      .in('id', ids).eq('available', true)
    if (isSugarSchemaUnavailable(menuError)) {
      const legacyResult = await supabase.from('menu_items')
        .select('id, name_km, name_en, description, price, category, image_url, available')
        .in('id', ids).eq('available', true)
      menu = legacyResult.data?.map(item => ({ ...item, sugar_levels: [], default_sugar_level: null })) ?? null
      menuError = legacyResult.error
    }
    if (menuError || !menu || menu.length !== ids.length) {
      return { success: false, error: 'Menu changed; please reload' }
    }
    let pricedItems: CartItem[]
    try {
      pricedItems = prepareOrderItems(requested, menu)
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Invalid order items' }
    }
    let cents = 0
    for (const item of pricedItems) {
      if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0 ||
          Math.abs(item.price * 100 - Math.round(item.price * 100)) > 0.000001) {
        return { success: false, error: 'Invalid menu price' }
      }
      cents += Math.round(item.price * 100) * item.quantity
    }
    const total = cents / 100
    if (data.total !== undefined && (
      !Number.isFinite(data.total) || data.total < 0 ||
      Math.abs(data.total * 100 - cents) > 0.000001
    )) {
      return { success: false, error: 'Order total changed; please review your cart' }
    }
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
        const sugar = item.sugar_level !== undefined
          ? `\n   ☕ Sugar: ${item.sugar_level}%`
          : ''
        return `${index + 1}. <b>${item.quantity} × ${name}</b>${khmerName}${sugar}${note}`
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
        const url = menu.find(entry => entry.id === item.id)?.image_url
        if (!url) continue
        photos.push({ url, caption:
          `Order #${order.id.slice(0, 8).toUpperCase()} · Table ${table.number}\n` +
          `${item.quantity} × ${item.name_en || item.name_km}\n` +
          (item.name_en && item.name_km ? `${item.name_km}\n` : '') +
          (item.sugar_level != null ? `Sugar / កម្រិតជាតិស្ករ: ${item.sugar_level}%\n` : '') +
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
