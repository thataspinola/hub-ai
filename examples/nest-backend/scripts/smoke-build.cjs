'use strict'
const assert = require('node:assert/strict')
const { createApp } = require('../dist/bootstrap')
async function main() {
  const app = await createApp()
  try {
    await app.listen(0, '127.0.0.1')
    const address = app.getHttpServer().address()
    const origin = `http://127.0.0.1:${address.port}`
    assert.equal((await fetch(`${origin}/api/jobs/missing`)).status, 401)
    assert.equal((await fetch(`${origin}/jobs/missing`)).status, 404)
    console.log(`Compiled Nest application on ${process.version}: initialized, HTTP globals verified, default access denied.`)
  } finally { await app.close() }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
