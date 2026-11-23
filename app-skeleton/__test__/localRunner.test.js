const runner = require('../scripts/localRunner')
const MOCKS = require('./mocks/index.mock')

let server
let baseUrl

beforeEach(async () => {
  server = runner.createServer()
  await new Promise(resolve => server.listen(0, MOCKS.HANDLER.LOCAL().host, resolve))
  baseUrl = `http://${MOCKS.HANDLER.LOCAL().host}:${server.address().port}`
})
afterEach(async () => {
  await new Promise(resolve => server.close(resolve))
  jest.clearAllMocks()
  jest.restoreAllMocks()
  jest.resetModules()
})

test('localhost HTTP integration validates a body and returns the trace id', async () => {
  const event = MOCKS.HANDLER.EVENT()
  const result = await fetch(baseUrl + MOCKS.HANDLER.LOCAL().validate, { method: 'POST', headers: event.headers, body: event.body })
  expect(result.status).toEqual(MOCKS.HANDLER.STATUS().ok)
  expect(result.headers.get('carbon-trace-id')).toEqual(MOCKS.HANDLER.TRACE_ID())
  expect(await result.json()).toEqual(MOCKS.HANDLER.VALIDATED_BODY())
})

test('localhost health responds without calling external services', async () => {
  expect((await fetch(baseUrl + MOCKS.HANDLER.LOCAL().health)).status).toEqual(MOCKS.HANDLER.STATUS().ok)
})

test('localhost refuses an unknown route', async () => {
  expect((await fetch(baseUrl + MOCKS.HANDLER.LOCAL().missing)).status).toEqual(MOCKS.HANDLER.STATUS().notFound)
})

test('localhost rejects oversized input', async () => {
  const result = await fetch(baseUrl + MOCKS.HANDLER.LOCAL().validate, { method: 'POST', body: 'x'.repeat(MOCKS.HANDLER.LOCAL().maxBytes + 1) })
  expect(result.status).toEqual(MOCKS.HANDLER.STATUS().tooLarge)
})
