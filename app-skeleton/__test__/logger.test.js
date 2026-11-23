const logger = require('../logger')
const MOCKS = require('./mocks/index.mock')

describe('Test suite: logger/index.js', () => {
	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
	})

	it('should export singleton pino logger instance with proper methods', () => {
		expect(logger).toEqual(
			expect.objectContaining({
				info: expect.any(Function),
				error: expect.any(Function),
				warn: expect.any(Function),
			})
		)
	})
})

test('real Pino output removes request bodies, tokens and raw error data', () => {
  const output = []
  const destination = { write: line => output.push(JSON.parse(line)) }
  const isolated = logger.createLogger(destination)
  const error = MOCKS.HANDLER.ERROR()
  error.config = { headers: { authorization: MOCKS.HANDLER.SECRET() } }
  error.response = { data: MOCKS.HANDLER.SECRET() }
  isolated.error({ rawError: error, token: MOCKS.HANDLER.SECRET(), body: { secret: MOCKS.HANDLER.SECRET() } }, 'Falha controlada')
  isolated.error({ rawError: null }, 'Sem erro estruturado')
  expect(JSON.stringify(output)).not.toContain(MOCKS.HANDLER.SECRET())
  expect(output[0].rawError).toEqual({ name: error.name })
})
