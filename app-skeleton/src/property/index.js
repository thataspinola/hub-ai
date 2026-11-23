/* istanbul ignore next */
const NODE_ENV_VALUE = process.env.NODE_ENV || 'development'
exports.INPUT_SCHEMA = require('./inputSchema')
exports.NODE_ENV = NODE_ENV_VALUE
const AWS_REGION_VALUE = process.env.AWS_REGION || 'ca-central-1'
exports.AWS_REGION = AWS_REGION_VALUE
exports.AWS_CLIENT_BASECONFIG = {
	region: AWS_REGION_VALUE,
}
