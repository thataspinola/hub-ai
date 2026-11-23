const http = require('node:http')
const app = require('../index')
const CONSTANT = require('../src/property')

exports.createServer = (handler = app.handler) => http.createServer(async (request, response) => {
  response.setHeader('content-type', 'application/json')
  if (request.method === 'GET' && request.url === '/health') {
    response.end(JSON.stringify({ status: 'ok', application: 'app-skeleton' }))
    return
  }
  if (request.method !== 'POST' || request.url !== '/validate') {
    response.writeHead(404).end(JSON.stringify({ status: 'error', message: 'Not found' }))
    return
  }
  try {
    const chunks = []
    let size = 0
    for await (const chunk of request) {
      size += chunk.length
      if (size > CONSTANT.LOCAL_MAX_BODY_BYTES) {
        response.writeHead(413).end(JSON.stringify({ status: 'error', message: 'Payload too large' }))
        return
      }
      chunks.push(chunk)
    }
    const result = await handler({ body: Buffer.concat(chunks).toString('utf8'), headers: request.headers })
    response.writeHead(result.statusCode, result.headers).end(result.body)
  } catch {
    if (!response.headersSent) response.writeHead(500).end(JSON.stringify({ status: 'error', message: 'Internal server error' }))
  }
})

if (require.main === module) {
  const port = Number(process.argv[2] || CONSTANT.LOCAL_PORT)
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid local port')
  const server = exports.createServer()
  server.listen(port, '127.0.0.1', () => {
    console.log(`App skeleton: http://127.0.0.1:${server.address().port}`)
  })
  const shutdown = () => server.close()
  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}
