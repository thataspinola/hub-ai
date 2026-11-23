const factory = require('../../../src/factory')
const MOCKS = require('../../mocks/index.mock')

describe('Test suite for the factory: responseFactory.js', () => {
	describe('Given an error call', () => {
		test('It should a response with the expected value without body.message when message parameter is undefined or an empty string', async () => {
			const errorReturnValue = factory.response.error()
			expect(errorReturnValue).toEqual(
				MOCKS.FACTORY_RESPONSE.DEFAULT_ERROR_RETURN()
			)
		})

		test('It should a response with the expected value with body.message when message parameter is not undefined and not an empty string', async () => {
			const errorReturnValue = factory.response.error(
				MOCKS.FACTORY_RESPONSE.ERROR_MESSAGE()
			)
			expect(errorReturnValue).toEqual(
				MOCKS.FACTORY_RESPONSE.ERROR_WITH_MESSAGE_RETURN()
			)
		})
	})

	describe('Given a badRequestError call', () => {
		test('It should a response with the expected value with a default body.message when message parameter is undefined or an empty string', async () => {
			const badRequestErrorReturnValue = factory.response.badRequestError()
			expect(badRequestErrorReturnValue).toEqual(
				MOCKS.FACTORY_RESPONSE.DEFAULT_BAD_REQUEST_ERROR_RETURN()
			)
		})

		test('It should a response with the expected value with body.message when message parameter is not undefined and not an empty string', async () => {
			const badRequestErrorReturnValue = factory.response.badRequestError(
				MOCKS.FACTORY_RESPONSE.ERROR_MESSAGE()
			)
			expect(badRequestErrorReturnValue).toEqual(
				MOCKS.FACTORY_RESPONSE.BAD_REQUEST_ERROR_WITH_MESSAGE_RETURN()
			)
		})
	})

	describe('Given a success call', () => {
		test('It should a response with the expected value with the body with the equivalent parameter value', async () => {
			const successReturnValue = factory.response.success(
				MOCKS.FACTORY_RESPONSE.SUCCESS_BODY_CONTENT()
			)
			expect(successReturnValue).toEqual(
				MOCKS.FACTORY_RESPONSE.SUCCESS_RETURN()
			)
		})

		test('It should a response with the expected value with the body empty when parameter value is not provided', async () => {
			const successReturnValue = factory.response.success()
			expect(successReturnValue).toEqual(
				MOCKS.FACTORY_RESPONSE.SUCCESS_EMPTY_BODY_RETURN()
			)
		})
	})

	describe('Given an invalidSusepError call', () => {
		test('It should return a response with statusCode 400 and invalidSusep true with a default message', () => {
			const result = factory.response.invalidSusepError()
			expect(result).toEqual({
				statusCode: 400,
				body: {
					status: 'error',
					invalidSusep: true,
					message: 'Invalid ELIGIBILITYSUSEP',
				},
			})
		})

		test('It should return a response with statusCode 400 and the provided message', () => {
			const result = factory.response.invalidSusepError(
				MOCKS.FACTORY_RESPONSE.ERROR_MESSAGE()
			)
			expect(result).toEqual({
				statusCode: 400,
				body: {
					status: 'error',
					invalidSusep: true,
					message: MOCKS.FACTORY_RESPONSE.ERROR_MESSAGE(),
				},
			})
		})
	})
})
