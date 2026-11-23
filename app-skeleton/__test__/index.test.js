const app = require('../index')
const service = require('../src/service')
const factory = require('../src/factory')
const MOCKS = require('./mocks/index.mock')

afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
  jest.resetModules()
})

const createLog = () => ({ warn: jest.fn(), error: jest.fn() })

test('default handler composes the real validation and response pipeline', async () => {
  const result = await app.handler(MOCKS.HANDLER.EVENT())
  expect(result).toEqual(expect.objectContaining({
    statusCode: MOCKS.HANDLER.STATUS().ok,
    headers: expect.objectContaining({ 'carbon-trace-id': MOCKS.HANDLER.TRACE_ID() }),
    body: JSON.stringify(MOCKS.HANDLER.VALIDATED_BODY()),
  }))
})

test('injects controller and supports API Gateway base64 body and mixed-case header', async () => {
  const process = jest.fn().mockResolvedValue(MOCKS.HANDLER.SUCCESS())
  const event = MOCKS.HANDLER.EVENT()
  event.body = Buffer.from(event.body).toString('base64')
  event.isBase64Encoded = true
  event.headers = { 'Carbon-Trace-Id': MOCKS.HANDLER.TRACE_ID() }
  const result = await app.createHandler({ process, log: createLog() })(event)
  expect(result.statusCode).toEqual(MOCKS.HANDLER.STATUS().ok)
  expect(process).toHaveBeenCalledWith(JSON.parse(MOCKS.HANDLER.EVENT().body), MOCKS.HANDLER.TRACE_ID())
})

test.each(MOCKS.HANDLER.INVALID_BODIES())('rejects malformed or non-object input: %p', async body => {
  const event = MOCKS.HANDLER.EVENT()
  event.body = body
  const result = await app.createHandler({ log: createLog() })(event)
  expect(result.statusCode).toEqual(MOCKS.HANDLER.STATUS().badRequest)
})

test('missing event returns a safe validation response', async () => {
  const result = await app.createHandler({ log: createLog() })()
  expect(result.statusCode).toEqual(MOCKS.HANDLER.STATUS().badRequest)
})

test('rejects malformed base64 rather than accepting a valid JSON prefix', async () => {
  const event = MOCKS.HANDLER.EVENT()
  event.body = Buffer.from(event.body).toString('base64') + MOCKS.HANDLER.SECRET()
  event.isBase64Encoded = true
  const result = await app.createHandler({ log: createLog() })(event)
  expect(result.statusCode).toEqual(MOCKS.HANDLER.STATUS().badRequest)
})

test('internal errors are sanitized in responses and structured logs', async () => {
  const log = createLog()
  const result = await app.createHandler({ process: jest.fn().mockRejectedValue(MOCKS.HANDLER.ERROR()), log })(MOCKS.HANDLER.EVENT())
  expect(result.statusCode).toEqual(MOCKS.HANDLER.STATUS().internal)
  expect(JSON.parse(result.body)).toEqual(MOCKS.HANDLER.INTERNAL_BODY())
  expect(JSON.stringify(log.error.mock.calls)).not.toContain(MOCKS.HANDLER.SECRET())
})

test.each([undefined, { statusCode: 0 }, { statusCode: 600 }])('rejects an invalid controller response: %p', async response => {
  const result = await app.createHandler({ process: async () => response, log: createLog() })(MOCKS.HANDLER.EVENT())
  expect(result.statusCode).toEqual(MOCKS.HANDLER.STATUS().internal)
})

test.each(MOCKS.HANDLER.INVALID_TRACE_IDS())('replaces unsafe trace headers: %p', value => {
  expect(factory.carbonTraceId.getTraceId({ 'carbon-trace-id': value })).toMatch(/^[0-9a-f-]{36}$/)
})

test.each(MOCKS.HANDLER.INVALID_CPFS())('rejects invalid CPF values without throwing: %p', value => {
  expect(service.cpfValidator.isValid(value)).toBe(false)
})
