const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomBytes } = require('node:crypto')
const { encrypt, decrypt } = require('../src/server-encryption')

test('server encryption round trip and tamper detection', () => {
  const key = randomBytes(32)
  const encrypted = encrypt('synthetic-data', key)
  assert.equal(decrypt(encrypted, key), 'synthetic-data')
  encrypted.data[0] ^= 1
  assert.throws(() => decrypt(encrypted, key))
})
test('missing server key fails explicitly', () => {
  assert.throws(() => encrypt('synthetic', undefined))
})
