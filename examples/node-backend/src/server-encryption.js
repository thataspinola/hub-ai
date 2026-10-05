'use strict'
const { randomBytes, createCipheriv, createDecipheriv } = require('node:crypto')

function keyCheck(key) {
  if (!Buffer.isBuffer(key) || key.length !== 32) throw new Error('A 32-byte server key is required')
}
function encrypt(value, key) {
  keyCheck(key)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return { iv, data, tag: cipher.getAuthTag() }
}
function decrypt(payload, key) {
  keyCheck(key)
  const decipher = createDecipheriv('aes-256-gcm', key, payload.iv)
  decipher.setAuthTag(payload.tag)
  return Buffer.concat([decipher.update(payload.data), decipher.final()]).toString('utf8')
}
module.exports = { encrypt, decrypt }
