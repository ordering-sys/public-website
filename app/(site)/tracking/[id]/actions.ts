'use server'

import { sendTelegram } from '@/lib/telegram'
import { createClient } from '@/lib/supabase/server'

export async function sendWaiterAlert(orderId: string) {
  if (typeof orderId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(orderId)) {
    throw new Error('Invalid order')
  }
  const supabase = await createClient()
  const { data: order, error } = await supabase.from('orders')
    .select('id, table_id, status').eq('id', orderId).single()
  if (error || !order || !['preparing', 'ready'].includes(order.status)) {
    throw new Error('Order is unavailable for waiter calls')
  }
  const table = String(order.table_id).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!)
  await sendTelegram(
    `🔔 <b>ហៅបុគ្គលិក / Waiter Called</b>\n\n` +
    `📋 Order #${order.id.slice(0, 8)}\n` +
    `🪑 តុ / Table: ${table}\n\n` +
    `Customer needs assistance at the table.`
  )
}
