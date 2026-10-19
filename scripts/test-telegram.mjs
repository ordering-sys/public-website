import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function load(file, globals = {}, imports = {}) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8')
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const context = { exports: {}, process: { env: {} }, console: { warn() {}, error() {} }, URL, AbortSignal, require: name => {
    if (!(name in imports)) throw new Error(`Unexpected import: ${name}`)
    return imports[name]
  }, ...globals }
  runInNewContext(code, context)
  return context.exports
}

function telegram(env, fetch) {
  return load('../lib/telegram.ts', { process: { env }, fetch }, {
    '@/lib/server-secret': { serverSecret: name => env[name] },
  })
}

test('sends summary before photos to each distinct staff chat', async () => {
  const calls = []
  const api = telegram({ TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_CHAT_ID: ' 1 ', TELEGRAM_ADMIN_CHAT_ID: '1', TELEGRAM_KITCHEN_CHAT_ID: '2' }, async (url, init) => {
    calls.push({ method: url.split('/').at(-1), ...JSON.parse(init.body) })
    return { ok: true }
  })
  await api.sendTelegram('<b>Order</b>', [{ url: 'https://images.example.com/item.jpg', caption: '2 × Coffee & milk' }])
  for (const id of ['1', '2']) {
    const sent = calls.filter(call => call.chat_id === id)
    assert.deepEqual(sent.map(call => call.method), ['sendMessage', 'sendPhoto'])
    assert.equal(sent[1].caption, '2 × Coffee & milk')
    assert.equal(sent[1].parse_mode, undefined)
  }
  assert.equal(calls.length, 4)
})

test('photo rejection and network failure do not stop subsequent images or other chats', async () => {
  const calls = []
  const api = telegram({ TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_CHAT_ID: '1', TELEGRAM_KITCHEN_CHAT_ID: '2' }, async (url, init) => {
    const body = JSON.parse(init.body)
    calls.push(body)
    if (body.chat_id === '1') throw new Error('Network unavailable')
    return { ok: !url.endsWith('sendPhoto'), status: 400 }
  })
  await api.sendTelegram('Order', [{ url: 'https://example.com/a.png', caption: 'A' }, { url: 'https://example.com/b.png', caption: 'B' }])
  assert.equal(calls.filter(call => call.chat_id === '2').length, 3)
})

test('skips invalid image schemes and bounds photo captions', async () => {
  const calls = []
  const api = telegram({ TELEGRAM_BOT_TOKEN: 'test-only', TELEGRAM_CHAT_ID: '1' }, async (_url, init) => { calls.push(JSON.parse(init.body)); return { ok: true } })
  await api.sendTelegram('Order', [{ url: 'javascript:alert(1)', caption: 'Invalid' }, { url: 'https://example.com/a.jpg', caption: 'a'.repeat(1500) }])
  assert.equal(calls.length, 2)
  assert.equal(calls[1].caption.length, 1024)
})

test('missing Telegram configuration makes no requests', async () => {
  let calls = 0
  await telegram({}, async () => { calls++; return { ok: true } }).sendTelegram('Order')
  assert.equal(calls, 0)
})

async function submitWithMenu(menuResult) {
  const alerts = []
  const api = load('../app/(site)/order/actions.ts', {}, {
    '@/lib/supabase/server': { createClient: async () => ({ from: table => table === 'orders'
      ? { insert: () => ({ select: () => ({ single: async () => ({ data: { id: 'order-123456' }, error: null }) }) }) }
      : { select: () => ({ in: async () => menuResult }) } }) },
    '@/lib/telegram': { sendTelegram: async (...args) => alerts.push(args) },
  })
  const result = await api.submitOrder({ tableId: 'T1', total: 8, items: [{ id: 'coffee', name_en: 'Coffee <milk>', name_km: 'កាហ្វេ', quantity: 2, notes: 'Less sugar', image_url: 'https://untrusted.example.com/client.jpg' }] })
  return { result, alerts }
}

test('order photos use database URLs and captions identify order, quantity and notes', async () => {
  const { result, alerts } = await submitWithMenu({ data: [{ id: 'coffee', image_url: 'https://images.example.com/saved.jpg' }], error: null })
  assert.equal(result.success, true)
  assert.equal(alerts[0][1][0].url, 'https://images.example.com/saved.jpg')
  assert.match(alerts[0][1][0].caption, /2 × Coffee/)
  assert.match(alerts[0][1][0].caption, /Less sugar/)
  assert.match(alerts[0][0], /Coffee &lt;milk&gt;/)
})

test('image lookup failure still sends text and returns the saved order', async () => {
  const { result, alerts } = await submitWithMenu({ data: null, error: { message: 'unavailable' } })
  assert.equal(result.success, true)
  assert.equal(alerts.length, 1)
  assert.equal(alerts[0][1].length, 0)
})
