const CONSTANT = require('../src/property')
const pino = require('pino')
const packageJson = require('../package.json')

const sanitizeError = (error) => {
  if (!error || typeof error !== 'object') return { name: 'Error' }
  return { name: error.name, code: error.code, status: error.response?.status }
}

const options = {
  serializers: { rawError: sanitizeError, err: sanitizeError },
  redact: ['password', 'token', 'authorization', 'headers', 'body', 'rawData'],
  formatters: {
    bindings() {
      return { environment: CONSTANT.NODE_ENV, application: packageJson.name.split('/').pop(), version: packageJson.version }
    },
    level(label) { return { log_level: label.toUpperCase() } },
  },
  timestamp: () => ',"date":"' + new Date().toISOString() + '"',
  messageKey: 'log_message',
}

module.exports = pino(options)
module.exports.createLogger = (destination) => pino(options, destination)
