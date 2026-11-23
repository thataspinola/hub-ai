const TRACE_ID = 'fixture-trace-id'
const SUCCESS = { statusCode: 200, body: { status: 'accepted' } }
exports.EVENT = () => ({ body: JSON.stringify({}), headers: { 'carbon-trace-id': TRACE_ID } })
exports.TRACE_ID = () => TRACE_ID
exports.SUCCESS = () => structuredClone(SUCCESS)
exports.STATUS = () => ({ ok: 200, badRequest: 400, internal: 500, notFound: 404, tooLarge: 413 })
exports.VALIDATED_BODY = () => ({ status: 'validated' })
exports.INTERNAL_BODY = () => ({ status: 'error', message: 'Internal server error' })
exports.INVALID_BODIES = () => [undefined, null, 4, '{', 'null', '[]', 'true', '"value"']
exports.INVALID_TRACE_IDS = () => [undefined, '', [], 'x'.repeat(129), 'line\r\ninjection']
exports.INVALID_CPFS = () => [null, undefined, 123, {}, '', '11111111111', 'a06963752060']
exports.ERROR = () => new Error('secret-token-never-return-or-log')
exports.SECRET = () => 'secret-token-never-return-or-log'
exports.LOCAL = () => ({ host: '127.0.0.1', validate: '/validate', health: '/health', missing: '/missing', maxBytes: 64 * 1024 })
