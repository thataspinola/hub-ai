const CONSTANT = require('../../property')
const service = require('../../service')

exports.execute = (parsedInput) => {
	service.payloadSchemaValidator.validate(parsedInput, CONSTANT.INPUT_SCHEMA)
}
