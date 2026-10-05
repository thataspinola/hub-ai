const { test } = require('node:test')
const assert = require('node:assert/strict')
const { validateEvent, publish } = require('../src/flow')

test('producer emits allowlisted fields and consumer accepts them', async () => {
  const input = { id: 'run-1', credentialReference: 'synthetic-reference', unexpected: 'discard' }
  const emitted = validateEvent(input)
  assert.deepEqual(emitted, { id: input.id, credentialReference: input.credentialReference })
  assert.equal(await publish([emitted], async entries => {
    assert.deepEqual(entries, [emitted])
    return { FailedEntryCount: 0, Entries: [{ EventId: 'synthetic-id' }] }
  }), 1)
})

test('partial publication fails and identifies failed entries', async () => {
  const events = ['good', 'bad'].map(id => ({ id, credentialReference: 'ref' }))
  await assert.rejects(publish(events, async () => ({ FailedEntryCount: 1, Entries: [{ EventId: 'ok' }, { ErrorCode: 'InternalFailure' }] })), error => {
    assert.deepEqual(error.failedIds, ['bad'])
    return true
  })
})

test('invalid event is rejected before publish side effect', async () => {
  let calls = 0
  await assert.rejects(publish([{}], async () => { calls++ }))
  assert.equal(calls, 0)
})
