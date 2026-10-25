const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(relative, dependencies = {}) {
  const filename = path.join(__dirname, '..', relative)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', code)(name => {
    if (name in dependencies) return dependencies[name]
    throw new Error(`Unexpected import: ${name}`)
  }, module, module.exports)
  return module.exports
}

const location = load('lib/location.ts')
const table = { id: 'table-id', number: 'T1', active: true, latitude: 11.5564, longitude: 104.9282, radius_meters: 100 }
const fix = { latitude: table.latitude, longitude: table.longitude, accuracy: 20 }

function access(row = table, databaseError = null) {
  const filters = {}
  const query = {
    select: () => query,
    eq: (key, value) => { filters[key] = value; return query },
    maybeSingle: async () => ({ data: row, error: databaseError }),
  }
  const { checkTableAccess } = load('lib/table-access.ts', {
    'server-only': {}, './location': location,
    '@/lib/supabase/admin': { createAdminClient: () => ({ from: () => query }) },
  })
  return { checkTableAccess, filters }
}

test('distance handles identical points, known distance and the date line', () => {
  assert.equal(location.distanceMeters(0, 0, 0, 0), 0)
  assert.ok(Math.abs(location.distanceMeters(0, 0, 0, 1) - 111195) < 1)
  assert.ok(location.distanceMeters(0, 179.9999, 0, -179.9999) < 23)
  assert.equal(location.validCoordinates(NaN, 0), false)
  assert.equal(location.validCoordinates(91, 0), false)
})

test('allows an accurate fix inside the radius and checks table, token and active status', async () => {
  const { checkTableAccess, filters } = access()
  assert.equal((await checkTableAccess('T1', 'secret', fix)).id, table.id)
  assert.deepEqual(filters, { number: 'T1', token: 'secret', active: true })
})

test('rejects missing, invalid, rotated or inactive QR codes and database failures', async () => {
  await assert.rejects(access().checkTableAccess('', '', fix))
  await assert.rejects(access(null).checkTableAccess('T1', 'old-token', fix))
  await assert.rejects(access(table, new Error('offline')).checkTableAccess('T1', 'secret', fix))
})

test('fails closed for unconfigured tables and missing or malformed GPS', async () => {
  await assert.rejects(access({ ...table, latitude: null }).checkTableAccess('T1', 'secret', fix))
  await assert.rejects(access().checkTableAccess('T1', 'secret'))
  for (const invalid of [{ ...fix, latitude: NaN }, { ...fix, longitude: 181 }, { ...fix, accuracy: -1 }]) {
    await assert.rejects(access().checkTableAccess('T1', 'secret', invalid))
  }
})

test('rejects outside locations and inaccurate fixes without expanding the radius', async () => {
  await assert.rejects(access().checkTableAccess('T1', 'secret', { ...fix, latitude: fix.latitude + 0.01 }), /within 100 meters/)
  await assert.rejects(access().checkTableAccess('T1', 'secret', { ...fix, accuracy: 101 }), /accuracy/)
})

test('guest Wi-Fi details are returned only after table access succeeds', async () => {
  let checked = 0
  const authorized = load('app/table-access-actions.ts', {
    '@/lib/table-access': { checkTableAccess: async () => { checked++ } },
    '@/lib/server-secret': { serverSecret: name => name === 'GUEST_WIFI_SSID' ? 'Cafe Guest' : 'guest-password' },
  })
  assert.deepEqual(await authorized.getGuestWifi('T1', 'secret', fix), {
    success: true, ssid: 'Cafe Guest', password: 'guest-password',
  })
  assert.equal(checked, 1)

  let secretReads = 0
  const denied = load('app/table-access-actions.ts', {
    '@/lib/table-access': { checkTableAccess: async () => { throw new Error('Invalid QR') } },
    '@/lib/server-secret': { serverSecret: () => { secretReads++; return 'hidden' } },
  })
  assert.equal((await denied.getGuestWifi('T1', 'invalid', fix)).success, false)
  assert.equal(secretReads, 0)
})
