'use server'

import { createClient } from '@/lib/supabase/server'
import { sendTelegram } from '@/lib/telegram'
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
  items: CartItem[]
  total: number
}) {
  const supabase = await createClient()

  try {
    // Insert order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        table_id: data.tableId,
        items: data.items,
        total: data.total,
        status: 'pending'
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

    const kitchenUrl = process.env.KITCHEN_APP_URL
    const adminKdsUrl = process.env.ADMIN_KDS_URL
    const links = [
      kitchenUrl ? `👨‍🍳 Kitchen: ${escapeTelegramHtml(kitchenUrl)}` : null,
      adminKdsUrl ? `🖥 Admin: ${escapeTelegramHtml(adminKdsUrl)}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    await sendTelegram(
      `🍽️ <b>NEW ORDER · ការកុម្ម៉ង់ថ្មី</b>\n\n` +
        `<b>Order:</b> <code>#${escapeTelegramHtml(order.id.slice(0, 8).toUpperCase())}</code>\n` +
        `<b>Table / តុ:</b> <b>${escapeTelegramHtml(data.tableId)}</b>\n\n` +
        `<b>ITEMS · បញ្ជីមុខម្ហូប</b>\n${itemList}\n\n` +
        `<b>Total / សរុប: $${data.total.toFixed(2)}</b>` +
        (links ? `\n\n${links}` : '')
    )

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order submission failed:', error)
    return { success: false, error: 'Failed to submit order' }
  }
}
