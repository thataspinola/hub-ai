const { test } = require('node:test')
const assert = require('node:assert/strict')
const { publish, createProcessor } = require('../src/flow')

test('E2E local: event -> reference resolution -> OAuth adapter -> state', async () => {
  const queue = [], store = new Map()
  const event = { id: 'local-run', credentialReference: 'synthetic-ref' }
  await publish([event], async entries => {
    queue.push(...entries)
    return { FailedEntryCount: 0, Entries: [{ EventId: 'local' }] }
  })
  let calls = 0
  const process = createProcessor({ store, resolveSecret: async ref => { assert.equal(ref, event.credentialReference); return 'synthetic-secret' }, requestToken: async () => { calls++; return { access_token: 'synthetic-token', expires_in: 60 } } })
  const response = await process(queue[0])
  assert.deepEqual(response, { id: 'local-run', expiresIn: 60 })
  assert.ok(store.has(event.id))
  assert.equal((await process(event)).duplicate, true)
  assert.equal(calls, 1)
})

test('E2E local failure does not persist state or expose transport error', async () => {
  const store = new Map()
  const process = createProcessor({ store, resolveSecret: async () => 'synthetic', requestToken: async () => { throw new Error('synthetic-sensitive-body') } })
  await assert.rejects(process({ id: 'failure', credentialReference: 'ref' }), { message: 'Token request failed' })
  assert.equal(store.size, 0)
})

test('invalid lifetime fails before persistence', async () => {
  const store = new Map()
  const process = createProcessor({ store, resolveSecret: async () => 'synthetic', requestToken: async () => ({ access_token: 'synthetic', expires_in: -1 }) })
  await assert.rejects(process({ id: 'failure', credentialReference: 'ref' }))
  assert.equal(store.size, 0)
})
