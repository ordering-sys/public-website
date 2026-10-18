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

    /* ── Build Telegram message ── */
    const hasNotes = data.items.some(i => i.notes && i.notes.trim() !== '')

    // Each item line: bullet + name (km) + English + qty + optional note
    const itemLines = data.items.map(item => {
      const note = item.notes?.trim()
      const noteLine = note ? `\n     📝 <i>${note}</i>` : ''
      return `  • ${item.name_km} <i>(${item.name_en})</i> ×${item.quantity} — $${(item.price * item.quantity).toFixed(2)}${noteLine}`
    }).join('\n')

    // Optional KDS deep-links
    const kitchenUrl  = process.env.KITCHEN_APP_URL
    const adminKdsUrl = process.env.ADMIN_KDS_URL
    const links = [
      kitchenUrl  ? `👨‍🍳 <a href="${kitchenUrl}">Kitchen KDS</a>`  : null,
      adminKdsUrl ? `🖥 <a href="${adminKdsUrl}">Admin KDS</a>`     : null,
    ].filter(Boolean).join('   ')

    const specialNote = hasNotes
      ? '\n⚠️ <b>This order has special requests — check notes above.</b>'
      : ''

    const message =
      `🔔 <b>ការកុម្ម៉ង់ថ្មី / New Order</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 Order <code>#${order.id.slice(0, 8).toUpperCase()}</code>\n` +
      `🪑 Table: <b>${data.tableId}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<b>Items:</b>\n${itemLines}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 Total: <b>$${data.total.toFixed(2)}</b>` +
      specialNote +
      (links ? `\n\n${links}` : '')

    await sendTelegram(message)

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order submission failed:', error)
    return { success: false, error: 'Failed to submit order' }
  }
}
