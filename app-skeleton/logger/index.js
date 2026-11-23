const CONSTANT = require('../src/property')
const pino = require('pino')
const packageJson = require('../package.json')
/* istanbul ignore file */
// Serializer para limpar objetos sensíveis de erros do Axios
const sanitizeAxiosError = (error) => {
	if (!error) return error
	if (typeof error !== 'object') return error

	// Cria um objeto mínimo com apenas informações essenciais
	const sanitized = {
		name: error.name,
		message: error.message,
		code: error.code,
		isAxiosError: error.isAxiosError,
	}

	// Se houver config, inclui apenas as partes essenciais
	if (error.config) {
		sanitized.config = {
			method: error.config.method,
			url: error.config.url,
			timeout: error.config.timeout,
		}
	}

	// Se houver response, inclui apenas status e dados
	if (error.response) {
		sanitized.response = {
			status: error.response.status,
			statusText: error.response.statusText,
			data: error.response.data,
		}
	}

	return sanitized
}

const logger = pino({
	formatters: {
		bindings() {
			return {
				environment: CONSTANT.NODE_ENV,
				application: packageJson.name.slice(packageJson.name.indexOf('/') + 1),
				version: packageJson.version,
			}
		},
		level(label) {
			return {
				log_level: label.toUpperCase(),
			}
		},
	},
	timestamp: () => `,"date":"${new Date().toISOString()}"`,
	messageKey: 'log_message',
})

module.exports = logger
