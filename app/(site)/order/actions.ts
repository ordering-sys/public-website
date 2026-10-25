'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { checkTableAccess } from '@/lib/table-access'
import type { LocationFix } from '@/lib/location'
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
  location: LocationFix
  items: CartItem[]
  total: number
}) {
  const supabase = createAdminClient()

  try {
    await checkTableAccess(data.tableId, data.token, data.location)
    /* ── Insert order ── */
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        table_id: data.tableId,
        items:    data.items,
        total:    data.total,
        status:   'pending',
      })
      .select()
      .single()

    if (error) throw error

    // Send Telegram notification (optional)
    const itemList = data.items
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
      const { data: menu, error: menuError } = await supabase.from('menu_items')
        .select('id, image_url')
        .in('id', [...new Set(data.items.map(item => item.id))])
      if (menuError) throw menuError
      for (const item of data.items) {
        const url = menu?.find(entry => entry.id === item.id)?.image_url
        if (!url) continue
        photos.push({ url, caption:
          `Order #${order.id.slice(0, 8).toUpperCase()} · Table ${data.tableId}\n` +
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
        `<b>Table / តុ:</b> <b>${escapeTelegramHtml(data.tableId)}</b>\n\n` +
        `<b>ITEMS · បញ្ជីមុខម្ហូប</b>\n${itemList}\n\n` +
        `<b>Total / សរុប: $${data.total.toFixed(2)}</b>` +
        (links ? `\n\n${links}` : ''),
      photos
    )

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order submission failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit order' }
  }
}
