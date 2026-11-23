const factory = require('../../../src/factory')
const MOCKS = require('../../mocks/index.mock')
const nodeCrypto = require('node:crypto')
jest.mock('node:crypto')

afterEach(() => {
	jest.clearAllMocks()
	jest.restoreAllMocks()
	jest.resetModules()
})

beforeEach(() => {
	nodeCrypto.randomUUID.mockImplementation(() => {
		return MOCKS.FACTORY_CARBONTRACEID.GENERATED_CARBON_TRACE_ID()
	})
})

describe('Test suite for the factory: carbonTraceIdFactory.js', () => {
	describe('Given a call to the `getTraceId` method', () => {
		test('It should return the carbon-trace-id present in the headers.', () => {
			expect(
				factory.carbonTraceId.getTraceId(
					MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_VALID_REQUESTHEADERS_INPUT()
				)
			).toEqual(MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_VALID_RETURN())
		})

		test('It should return a new carbon-trace-id if the one present in the headers has an invalid type.', () => {
			expect(
				factory.carbonTraceId.getTraceId(
					MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_INVALID_CARBONTRACEID_TYPE_REQUESTHEADERS_INPUT()
				)
			).toEqual(
				MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_VALID_NEWCARBONTRACEID_RETURN()
			)
		})

		test('It should return a new carbon-trace-id if there are no headers.', () => {
			expect(
				factory.carbonTraceId.getTraceId(
					MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_INVALID_EMPTY_REQUESTHEADERS_INPUT()
				)
			).toEqual(
				MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_VALID_NEWCARBONTRACEID_RETURN()
			)
		})

		test('It should return a new carbon-trace-id if there are headers but the carbon-trace-id key is missing.', () => {
			expect(
				factory.carbonTraceId.getTraceId(
					MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_INVALID_WITHOUT_CARBONTRACEID_REQUESTHEADERS_INPUT()
				)
			).toEqual(
				MOCKS.FACTORY_CARBONTRACEID.GETTRACEID_VALID_NEWCARBONTRACEID_RETURN()
			)
		})
	})
})
