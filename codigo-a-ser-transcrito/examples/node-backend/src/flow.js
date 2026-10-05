'use strict'

// Transport-neutral example. Real adapters must enforce IAM, TLS and timeouts.
function validateEvent(event) {
  if (!event || typeof event.id !== 'string' || !event.id || typeof event.credentialReference !== 'string' || !event.credentialReference) {
    throw new Error('Invalid event contract')
  }
  return { id: event.id, credentialReference: event.credentialReference }
}

async function publish(events, adapter) {
  const entries = events.map(validateEvent)
  const result = await adapter(entries)
  if (!result || !Array.isArray(result.Entries) || result.Entries.length !== entries.length) {
    throw new Error('Invalid publish response')
  }
  const failures = result.Entries.flatMap((entry, index) => entry.ErrorCode ? [entries[index].id] : [])
  if (failures.length || result.FailedEntryCount > 0) {
    const error = new Error('Event publication partially failed')
    error.failedIds = failures
    throw error
  }
  return entries.length
}

function createProcessor({ resolveSecret, requestToken, store }) {
  // Sequential demo only. Distributed idempotency requires a conditional write/lock.
  return async (input) => {
    const event = validateEvent(input)
    if (store.has(event.id)) return { id: event.id, duplicate: true }
    const secret = await resolveSecret(event.credentialReference)
    let response
    try {
      response = await requestToken(secret)
    } catch (cause) {
      throw new Error('Token request failed', { cause })
    }
    if (!response || typeof response.access_token !== 'string' || !response.access_token || !Number.isSafeInteger(response.expires_in) || response.expires_in <= 0) {
      throw new Error('Invalid token response')
    }
    store.set(event.id, { token: response.access_token, expiresIn: response.expires_in })
    return { id: event.id, expiresIn: response.expires_in }
  }
}

module.exports = { validateEvent, publish, createProcessor }
