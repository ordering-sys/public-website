'use server'

import { createClient } from '@/lib/supabase/server'
import { sendTelegram } from '@/lib/telegram'
import type { CartItem } from '@/lib/types'

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
      .map((item) => `  • ${item.name_km} x${item.quantity}`)
      .join('\n')

    const kitchenUrl = process.env.KITCHEN_APP_URL
    const adminKdsUrl = process.env.ADMIN_KDS_URL
    const links = [
      kitchenUrl ? `👨‍🍳 Kitchen KDS: ${kitchenUrl}` : null,
      adminKdsUrl ? `🖥 Admin KDS: ${adminKdsUrl}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    await sendTelegram(
      `🔔 <b>ការកុម្ម៉ង់ថ្មី / New order</b>\n\n` +
        `📋 Order #${order.id.slice(0, 8)}\n` +
        `🪑 តុ / Table: ${data.tableId}\n\n` +
        `<b>បញ្ជី / Items:</b>\n${itemList}\n\n` +
        `💵 សរុប / Total: $${data.total.toFixed(2)}` +
        (links ? `\n\n${links}` : '')
    )

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order submission failed:', error)
    return { success: false, error: 'Failed to submit order' }
  }
}
