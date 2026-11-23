const nodeCrypto = require('node:crypto')

exports.getTraceId = (requestHeaders) => {
  if (requestHeaders && typeof requestHeaders === 'object') {
    const key = Object.keys(requestHeaders).find(name => name.toLowerCase() === 'carbon-trace-id')
    const value = requestHeaders[key]
    if (typeof value === 'string' && /^[A-Za-z0-9._:-]{1,128}$/.test(value)) return value
  }
  return nodeCrypto.randomUUID()
}
