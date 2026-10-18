'use server'

import { sendTelegram } from '@/lib/telegram'

export async function sendWaiterAlert(orderId: string, tableId: string) {
  await sendTelegram(
    `🔔 <b>ហៅបុគ្គលិក / Waiter Called</b>\n\n` +
    `📋 Order #${orderId.slice(0, 8)}\n` +
    `🪑 តុ / Table: ${tableId}\n\n` +
    `Customer needs assistance at the table.`
  )
}
