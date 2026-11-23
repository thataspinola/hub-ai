const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const errors = require('../error')
const cpfValidator = require('./cpfValidatorService')

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajv.addFormat('cpf', { type: 'string', validate: cpfValidator.isValid })

exports.validate = (payload, schema) => {
  const validate = ajv.compile(schema)
  if (validate(payload)) return
  const fields = (validate.errors || [])
    .filter(error => error.keyword !== 'anyOf')
    .map(error => error.params?.missingProperty || error.instancePath?.split('/').filter(Boolean).pop() || 'can not determine property')
  throw new errors.ValidationError(
    'The attributes values are not valid: ' + [...new Set(fields.length ? fields : ['can not determine property'])].join(', '),
  )
}
