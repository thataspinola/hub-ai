const { spawn } = require('node:child_process')
const path = require('node:path')
const assert = require('node:assert/strict')

async function main() {
  const child = spawn(process.execPath, [path.join(__dirname, 'localRunner.js'), '0'], { stdio: ['ignore', 'pipe', 'pipe'] })
  try {
    const baseUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Local runner startup timeout')), 10000)
      const finish = callback => value => { clearTimeout(timer); callback(value) }
      child.once('error', finish(reject))
      child.once('exit', finish(() => reject(new Error('Local runner exited before readiness'))))
      child.stdout.on('data', finish(data => {
        const url = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/)
        if (url) resolve(url[0])
        else reject(new Error('Unexpected startup output'))
      }))
    })
    const health = await fetch(baseUrl + '/health')
    assert.equal(health.status, 200)
    const valid = await fetch(baseUrl + '/validate', { method: 'POST', body: '{}', headers: { 'carbon-trace-id': 'smoke-local' } })
    assert.equal(valid.status, 200)
    assert.equal(valid.headers.get('carbon-trace-id'), 'smoke-local')
    assert.deepEqual(await valid.json(), { status: 'validated' })
    console.log('Local runner smoke passed: health and validation')
  } finally {
    child.kill('SIGTERM')
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
