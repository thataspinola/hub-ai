const logger = require('../logger')

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
