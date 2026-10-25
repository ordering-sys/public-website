const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(relative, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', code)(name => {
    if (name in imports) return imports[name]
    throw new Error('Unexpected import: ' + name)
  }, module, module.exports)
  return module.exports
}
const sugar = load('lib/sugar.ts')
const coffee = { id: 'coffee', name_en: 'Latte', name_km: 'កាហ្វេ', category: 'Coffee', price: 2.5, available: true, sugar_levels: [0, 25, 50, 75, 100], default_sugar_level: 100 }
const line = { ...coffee, quantity: 1, sugar_level: 25 }

test('different sugar levels and notes stay separate; identical selections combine', () => {
  let cart = sugar.addCartItem([], coffee, 1, '', 0)
  cart = sugar.addCartItem(cart, coffee, 2, '', 100)
  cart = sugar.addCartItem(cart, coffee, 1, '', 0)
  cart = sugar.addCartItem(cart, coffee, 1, 'Extra ice', 0)
  assert.equal(cart.length, 3)
  assert.deepEqual(cart.map(item => [item.sugar_level, item.quantity]), [[0, 2], [100, 2], [0, 1]])
  assert.notEqual(sugar.cartItemKey(cart[0]), sugar.cartItemKey(cart[1]))
  assert.equal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0), 12.5)
})

test('detects missing sugar columns without masking unrelated database errors', () => {
  assert.equal(sugar.isSugarSchemaUnavailable({ code: '42703', message: 'column menu_items.sugar_levels does not exist' }), true)
  assert.equal(sugar.isSugarSchemaUnavailable({ code: 'PGRST204', message: "Could not find the 'default_sugar_level' column" }), true)
  assert.equal(sugar.isSugarSchemaUnavailable({ code: '42703', message: 'column menu_items.price does not exist' }), false)
  assert.equal(sugar.isSugarSchemaUnavailable({ code: '08000', message: 'database unavailable' }), false)
})

test('server accepts all configured levels, including zero, using saved names and prices', () => {
  for (const level of coffee.sugar_levels) {
    const [saved] = sugar.prepareOrderItems([{ ...line, name_en: 'Forged', price: 0, sugar_level: level }], [coffee])
    assert.equal(saved.sugar_level, level)
    assert.equal(saved.price, 2.5)
    assert.equal(saved.name_en, 'Latte')
  }
})

test('rejects unsupported, missing, stale and nonnumeric sugar selections', () => {
  for (const value of [undefined, null, 30, '25', NaN, Infinity]) {
    assert.throws(() => sugar.prepareOrderItems([{ ...line, sugar_level: value }], [coffee]))
  }
  assert.throws(() => sugar.prepareOrderItems([line], [{ ...coffee, sugar_levels: [0, 100] }]))
})

test('ordinary items and historical orders need no sugar field', () => {
  const bread = { ...coffee, id: 'bread', category: 'Food', sugar_levels: [], default_sugar_level: null }
  const [saved] = sugar.prepareOrderItems([{ ...bread, quantity: 1 }], [bread])
  assert.equal('sugar_level' in saved, false)
  assert.throws(() => sugar.prepareOrderItems([{ ...bread, quantity: 1, sugar_level: 0 }], [bread]))
})

test('rejects unavailable items, invalid quantities and oversized notes', () => {
  assert.throws(() => sugar.prepareOrderItems([line], [{ ...coffee, available: false }]))
  for (const quantity of [0, -1, 1.5, 101]) assert.throws(() => sugar.prepareOrderItems([{ ...line, quantity }], [coffee]))
  assert.throws(() => sugar.prepareOrderItems([{ ...line, notes: 'x'.repeat(201) }], [coffee]))
  assert.throws(() => sugar.prepareOrderItems([], [coffee]))
})

function orderAction(legacySchema = false) {
  const inserted = [], messages = []
  const db = { from: table => table === 'menu_items'
    ? { select: columns => ({ in: async () => {
      if (legacySchema && columns.includes('sugar_levels')) {
        return { data: null, error: { code: '42703', message: 'column menu_items.sugar_levels does not exist' } }
      }
      const menuItem = legacySchema
        ? Object.fromEntries(Object.entries(coffee).filter(([key]) => !['sugar_levels', 'default_sugar_level'].includes(key)))
        : coffee
      return { data: [menuItem], error: null }
    } }) }
    : { insert: values => { inserted.push(values); return { select: () => ({ single: async () => ({ data: { id: 'order-123456' }, error: null }) }) } } } }
  const { submitOrder } = load('app/(site)/order/actions.ts', {
    '@/lib/sugar': sugar,
    '@/lib/supabase/admin': { createAdminClient: () => db },
    '@/lib/table-access': { checkTableAccess: async () => ({}) },
    '@/lib/telegram': { sendTelegram: async text => messages.push(text) },
  })
  return { submitOrder, inserted, messages }
}

test('orders continue to work before the sugar migration, without sugar options', async () => {
  const { submitOrder, inserted } = orderAction(true)
  const result = await submitOrder({ tableId: 'T1', token: 'qr', location: {}, items: [{ ...coffee, quantity: 1 }], total: 2.5 })
  assert.equal(result.success, true)
  assert.equal(inserted[0].items[0].sugar_level, undefined)
})

test('order submission persists sugar and includes it in the staff notification', async () => {
  const { submitOrder, inserted, messages } = orderAction()
  const result = await submitOrder({ tableId: 'T1', token: 'qr', location: {}, items: [{ ...line, sugar_level: 0 }], total: 2.5 })
  assert.equal(result.success, true)
  assert.equal(inserted[0].items[0].sugar_level, 0)
  assert.equal(inserted[0].total, 2.5)
  assert.match(messages[0], /Sugar .*0%/)
})

test('invalid options or tampered totals never insert an order', async () => {
  const { submitOrder, inserted } = orderAction()
  for (const input of [{ items: [{ ...line, sugar_level: 40 }], total: 2.5 }, { items: [line], total: 0 }]) {
    const result = await submitOrder({ tableId: 'T1', token: 'qr', location: {}, ...input })
    assert.equal(result.success, false)
  }
  assert.equal(inserted.length, 0)
})
