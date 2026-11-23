const service = require('../../service')

exports.execute = (parsedInput) => {
	let currentActivity = 'Construção do corpo do retorno'
	try {
		const controllerReturn = {}
		return controllerReturn
	} catch (error) {
		const message = `Erro identificado durante a atividade '${currentActivity}': ${error.message}`
		service.logger.error({ rawError: error }, message)
		throw error
	}
}
