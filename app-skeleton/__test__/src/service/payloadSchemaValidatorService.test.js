const MOCKS = require('../../mocks/index.mock')
const Ajv = require('ajv')
const addFormats = require('ajv-formats')

const service = require('../../../src/service')

afterEach(() => {
	jest.clearAllMocks()
})

describe('Given a validate call', () => {
	test('It should not throw errors after validate an object that follows expected schema', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.VALID_PAYLOAD_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).not.toThrow()
	})

	test('It should not throw errors after validate an object that follows expected schema (that includes fields with cpf and cnpj formats', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.VALID_PAYLOAD_CPF_CNPJ_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA_CPF_CNPJ()
			)
		}).not.toThrow()
	})
	test('It should return error after validate an object that follows expected schema with an invalid cpf field format', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_CPF_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA_CPF_CNPJ()
			)
		}).toThrow(`The attributes values are not valid: cpf`)
	})
	test('It should return error after validate an object that follows expected schema with an invalid cnpj field format', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_CNPJ_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA_CPF_CNPJ()
			)
		}).toThrow(`The attributes values are not valid: cnpj`)
	})
	test('It should not throw errors after validate an object that follows expected schema', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.VALID_ANYOF_PAYLOAD_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA_ANYOF()
			)
		}).not.toThrow()
	})
	test('It should return error after validate an object that follows expected schema with neither conditions of anyOf', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_ANYOF_PAYLOAD_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA_ANYOF()
			)
		}).toThrow(`The attributes values are not valid: cpf, cnpj`)
	})

	test('It should throw error after validate an object that follows expected schema but with a missing property', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_MISSING_PROPERTY(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			`The attributes values are not valid: ${MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_MISSING_PROPERTY_NAME()}`
		)
	})

	test('It should return error after validate an object that follows expected schema with an invalid property type', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_TYPE_PROPERTY(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			`The attributes values are not valid: ${MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_TYPE_PROPERTY_NAME()}`
		)
	})

	test('It should return error after validate an object that follows expected schema with an invalid property size', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_SIZE_PROPERTY(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			`The attributes values are not valid: ${MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_SIZE_PROPERTY_NAME()}`
		)
	})

	test('It should return error after validate an object that follows expected schema with an invalid property value', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_VALUE_PROPERTY(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			`The attributes values are not valid: ${MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_VALUE_PROPERTY_NAME()}`
		)
	})

	test('It should return error after validate an object that follows expected schema with an invalid property format', async () => {
		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_FORMAT_PROPERTY(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			`The attributes values are not valid: ${MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.INVALID_PAYLOAD_DATA_WRONG_FORMAT_PROPERTY_NAME()}`
		)
	})

	test('It should return error after an object validation give an unexpected validation error', async () => {
		Ajv.prototype.compile = jest.fn(() => {
			const returnObj = jest.fn(() => {})
			returnObj.errors = [
				{
					keyword: 'unexpected',
				},
			]

			return returnObj
		})

		addFormats.default = jest.fn(() => {})

		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.VALID_PAYLOAD_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			'The attributes values are not valid: can not determine property'
		)

		jest.clearAllMocks()

		Ajv.prototype.compile = jest.fn(() => {
			const returnObj = jest.fn(() => {})
			returnObj.errors = [
				{
					keyword: 'type',
					instancePath: '',
				},
			]

			return returnObj
		})

		addFormats.default = jest.fn(() => {})

		expect(() => {
			service.payloadSchemaValidator.validate(
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.VALID_PAYLOAD_DATA(),
				MOCKS.SERVICE_PAYLOADSCHEMA_VALIDATOR.SCHEMA()
			)
		}).toThrow(
			'The attributes values are not valid: can not determine property'
		)
	})
})
