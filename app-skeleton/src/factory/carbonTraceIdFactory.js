const nodeCrypto = require('node:crypto')

/**
 * Generates or acquire Trace ID using requests headers as source.
 * If 'carbon-trace-id' header exists in request headers array it's value will be considered.
 * Otherwise, a new UUID value will be generated and considered.
 *
 * @param {array} requestHeaders - HTTP request headers array
 * @returns {string} - Generated carbon-trace-id
 */

exports.getTraceId = (requestHeaders) => {
	const traceId =
		requestHeaders &&
		Object.keys(requestHeaders).length &&
		requestHeaders['carbon-trace-id'] &&
		typeof requestHeaders['carbon-trace-id'] === 'string'
			? requestHeaders['carbon-trace-id']
			: nodeCrypto.randomUUID()

	return traceId
}
