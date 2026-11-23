const CONSTANT = require('../../property')
const service = require('../../service')

exports.execute = (parsedInput) => {
	let currentActivity = 'Validação dos dados'
	try {
		service.payloadSchemaValidator.validate(parsedInput, CONSTANT.INPUT_SCHEMA)
	} catch (error) {
		const message = `Erro identificado durante a atividade '${currentActivity}': ${error.message}`
		if (error.name === 'ValidationError') {
			service.logger.warn({ rawError: error }, message)
		} else {
			service.logger.error({ rawError: error }, message)
		}
		throw error
	}
}
