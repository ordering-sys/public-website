import { serverSecret } from '@/lib/server-secret'

/** All chats that should receive alerts (deduplicated). */
export function getTelegramAlertChatIds(): string[] {
  const ids = [
    process.env.TELEGRAM_CHAT_ID,
    process.env.TELEGRAM_ADMIN_CHAT_ID,
    process.env.TELEGRAM_KITCHEN_CHAT_ID,
  ].filter((id): id is string => Boolean(id?.trim()))

  return [...new Set(ids.map(id => id.trim()))]
}

export interface TelegramOrderPhoto {
  url: string
  caption: string
}

async function sendTelegramToChat(
  botToken: string,
  chatId: string,
  message: string,
  photos: TelegramOrderPhoto[] = []
) {
  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
      signal: AbortSignal.timeout(10000),
    }
  )

  if (!res.ok) {
    console.error(`Telegram message failed (chat ${chatId}): HTTP ${res.status}`)
    return
  }

  for (const photo of photos) {
    try {
      const url = new URL(photo.url)
      if (!['https:', 'http:'].includes(url.protocol)) continue
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, photo: url.toString(), caption: photo.caption.slice(0, 1024) }),
        signal: AbortSignal.timeout(10000),
      })
      if (!response.ok) console.error(`Telegram photo failed (chat ${chatId}): HTTP ${response.status}`)
    } catch {
      console.error(`Telegram photo could not be delivered (chat ${chatId})`)
    }
  }
}

/** Send the same message to admin, kitchen, and/or default staff chats. */
export async function sendTelegram(message: string, photos: TelegramOrderPhoto[] = []) {
  try {
    const botToken = serverSecret('TELEGRAM_BOT_TOKEN')
    const chatIds = getTelegramAlertChatIds()

    if (!botToken || chatIds.length === 0) {
      console.warn(
        'Telegram not configured (need TELEGRAM_BOT_TOKEN and at least one chat id)'
      )
      return
    }

    await Promise.allSettled(
      chatIds.map(async (chatId) => {
        try { await sendTelegramToChat(botToken, chatId, message, photos) }
        catch { console.error(`Telegram alert could not be delivered (chat ${chatId})`) }
      })
    )
  } catch {
    console.error('Telegram send failed')
  }
}
