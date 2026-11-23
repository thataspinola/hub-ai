const factory = require('../../factory')

// The starter acknowledges validation only. Add business activities explicitly.
exports.execute = () => factory.response.success({ status: 'validated' })
