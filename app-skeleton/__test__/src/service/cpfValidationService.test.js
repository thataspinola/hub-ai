const MOCKS = require('../../mocks/index.mock')
const service = require('../../../src/service')

describe('Given an isValidCPF call', () => {
	test('It should return true if the provided input is a valid CPF number', async () => {
		const isValidCPF = service.cpfValidator.isValid(
			MOCKS.SERVICE_CPF_VALIDATOR.VALID_CPF()
		)
		expect(isValidCPF).toEqual(true)
	})
	test('It should return true if the provided input is a valid CPF number with less characters than a common CPF number', async () => {
		const isValidCPF = service.cpfValidator.isValid(
			MOCKS.SERVICE_CPF_VALIDATOR.VALID_CPF_SHORT()
		)
		expect(isValidCPF).toEqual(true)
	})
	test('It should return false if the provided input is not a valid CPF number - both verification digits wrong', async () => {
		const isValidCPF = service.cpfValidator.isValid(
			MOCKS.SERVICE_CPF_VALIDATOR.INVALID_CPF_BOTH_VERIFICATION_DIGITS()
		)
		expect(isValidCPF).toEqual(false)
	})
	test('It should return false if the provided input is not a valid CPF number - just unit verification digit wrong', async () => {
		const isValidCPF = service.cpfValidator.isValid(
			MOCKS.SERVICE_CPF_VALIDATOR.INVALID_CPF_UNIT_VERIFICATION_DIGIT()
		)
		expect(isValidCPF).toEqual(false)
	})
	test('It should return false if the provided input has more characters then a valid CPF number', async () => {
		const isValidCPF = service.cpfValidator.isValid(
			MOCKS.SERVICE_CPF_VALIDATOR.INVALID_CPF_SIZE()
		)
		expect(isValidCPF).toEqual(false)
	})
	test('It should return false if the provided input has only zeros', async () => {
		const isValidCPF = service.cpfValidator.isValid(
			MOCKS.SERVICE_CPF_VALIDATOR.INVALID_CPF_ALLZERO()
		)
		expect(isValidCPF).toEqual(false)
	})
})
