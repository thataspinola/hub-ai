'use strict'

const { spawn } = require('node:child_process')
const net = require('node:net')
const path = require('node:path')
const BASE = '/react-ssr-corp-hubv-painel-administrativo'

async function smoke() {
  const reserve = net.createServer()
  await new Promise((resolve) => reserve.listen(0, 'localhost', resolve))
  const port = reserve.address().port
  await new Promise((resolve) => reserve.close(resolve))

  const child = spawn(
    process.execPath,
    [path.join(__dirname, '../.next/standalone/server.js')],
    {
      env: { ...process.env, HOSTNAME: 'localhost', PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )

  let output = ''

  child.stdout.on('data', (chunk) => {
    output += chunk.toString()
  })

  child.stderr.on('data', (chunk) => {
    output += chunk.toString()
  })

  try {
    let ready = false

    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null)
        throw new Error('Standalone exited before readiness: ' + output)

      try {
        const response = await fetch(
          `http://localhost:${port}${BASE}/code-reviewer`,
          { signal: AbortSignal.timeout(1000) }
        )

        if (response.ok) {
          ready = true
          break
        }
      } catch {
        /* Poll only the local server. */
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (!ready) throw new Error('Standalone did not become ready: ' + output)

    const response = await fetch(
      `http://localhost:${port}${BASE}/code-reviewer`,
      { signal: AbortSignal.timeout(5000) }
    )

    const html = await response.text()

    if (!response.ok || !html.includes('Code Reviewer'))
      throw new Error('Reviewer page failed in standalone')

    const asset = html.match(
      /(?:src|href)="([^\"]+\/_next\/static\/[^\"]+)"/
    )?.[1]

    if (!asset || !asset.startsWith(BASE + '/_next/static/'))
      throw new Error('Expected local static asset not found')

    const staticResponse = await fetch(`http://localhost:${port}${asset}`, {
      signal: AbortSignal.timeout(5000),
    })

    if (!staticResponse.ok)
      throw new Error(
        'Standalone static asset failed: ' + staticResponse.status
      )

    console.log('Standalone page and static asset passed on localhost')
  } finally {
    const stopped = new Promise((resolve) => child.once('exit', resolve))

    if (child.exitCode === null) {
      child.kill('SIGTERM')
      await stopped
    }
  }
}

smoke().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
