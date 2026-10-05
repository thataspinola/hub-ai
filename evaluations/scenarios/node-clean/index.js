'use strict'
// Pure mapping: no transport, persistence, authentication or runtime dependency.
exports.toEventReference = input => {
  if (!input || typeof input.id !== 'string' || !input.id || typeof input.reference !== 'string' || !input.reference) {
    throw new Error('Invalid input')
  }
  return { id: input.id, reference: input.reference }
}
