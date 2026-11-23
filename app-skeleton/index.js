const controller = require('./src/controller')
const factory = require('./src/factory')
const errors = require('./src/error')
const logger = require('./logger')

function parseBody(event) {
  if (typeof event?.body !== 'string') {
    throw new errors.ValidationError('The supplied request body is invalid')
  }
  if (event.isBase64Encoded && !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(event.body)) {
    throw new errors.ValidationError('The supplied request body is invalid')
  }
  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body
  try {
    return JSON.parse(body)
  } catch {
    throw new errors.ValidationError('The supplied request body is invalid')
  }
}

exports.createHandler = ({ process = controller.request.process, log = logger } = {}) => {
  return async (event) => {
    const traceId = factory.carbonTraceId.getTraceId(event?.headers)
    let response
    try {
      response = await process(parseBody(event), traceId)
      if (!Number.isInteger(response?.statusCode) || response.statusCode < 100 || response.statusCode > 599) {
        throw new Error('Invalid controller response')
      }
      return {
        isBase64Encoded: false,
        statusCode: response.statusCode,
        headers: { 'content-type': 'application/json', 'carbon-trace-id': traceId },
        body: JSON.stringify(response.body),
      }
    } catch (error) {
      const invalidInput = error instanceof errors.ValidationError
      log[invalidInput ? 'warn' : 'error'](
        { traceId, errorType: invalidInput ? 'ValidationError' : 'InternalError' },
        invalidInput ? 'Requisição inválida' : 'Falha no processamento da requisição',
      )
      response = invalidInput
        ? factory.response.badRequestError()
        : factory.response.error('Internal server error')
      return {
        isBase64Encoded: false,
        statusCode: response.statusCode,
        headers: { 'content-type': 'application/json', 'carbon-trace-id': traceId },
        body: JSON.stringify(response.body),
      }
    }
  }
}

exports.handler = exports.createHandler()
