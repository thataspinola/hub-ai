const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const errors = require('../error')
const cpfValidator = require('./cpfValidatorService')

exports.validate = (payload, schema) => {
	const payloadAttributesValueError = validateRequestedElements(payload, schema)
	if (payloadAttributesValueError.length > 0) {
		throw new errors.ValidationError(
			`The attributes values are not valid: ${payloadAttributesValueError.join(
				', '
			)}`
		)
	}
}

function validateRequestedElements(inputData, schema) {
	const ajv = new Ajv()
	addFormats(ajv)
	ajv.addFormat('cpf', {
		type: 'string',
		validate: (x) => {
			return cpfValidator.isValid(x)
		},
	})

	const validate = ajv.compile(schema)
	const inputDataIsValid = validate(inputData)

	var valueErrors = []

	if (!inputDataIsValid) {
		validate.errors.forEach((validateError) => {
			if (validateError.schemaPath !== '#/anyOf') {
				if (validateError.keyword === 'required') {
					valueErrors.push(validateError.params.missingProperty)
				} else if (
					[
						'type',
						'minLength',
						'maxLength',
						'enum',
						'format',
						'pattern',
						'minimum',
						'multipleOf',
					].includes(validateError.keyword)
				) {
					const lastInstancePathNodeRegex = /[^\/]+$/
					const lastInstancePathNodeRegexMatches =
						validateError.instancePath.match(lastInstancePathNodeRegex)
					if (
						Array.isArray(lastInstancePathNodeRegexMatches) &&
						lastInstancePathNodeRegexMatches.length > 0
					) {
						valueErrors.push(lastInstancePathNodeRegexMatches[0])
					} else {
						valueErrors.push('can not determine property')
					}
				} else {
					valueErrors.push('can not determine property')
				}
			}
		})
	}

	return valueErrors
}
