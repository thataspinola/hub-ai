'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { install, parse } = require('../../tools/global-review-poc.cjs')

const front = ['AGENTS.md', 'resources/frontend/skills/analytics-review/SKILL.md', 'resources/frontend/skills/observability-review/SKILL.md']
const back = ['AGENTS.md', 'resources/skills/analytics-review/SKILL.md', 'resources/skills/observability-review/SKILL.md', 'resources/skills/backend-security/SKILL.md', 'resources/skills/backend-testing/SKILL.md', 'resources/skills/event-contracts/SKILL.md', 'resources/skills/lambda-review/SKILL.md']
function files(root, paths) {
  for (const relative of paths) {
    const dest = path.join(root, relative)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, 'fixture')
  }
}

test('central monorepo front/back installs one agent and leaves consumer untouched', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-global-'))
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }))
  const central = path.join(temp, 'hub-ai')
  const consumer = path.join(temp, 'porto_connectivity')
  const agentDir = path.join(temp, 'user', '.github', 'agents')
  files(path.join(central, 'front'), front)
  files(path.join(central, 'back'), back)
  files(consumer, ['app-token-generator/package.json', 'app-token-generator/AGENTS.md', 'app-token-generator/index.js', 'app-token-generator-error/package.json'])
  const before = fs.readdirSync(consumer)
  const options = { source: central, agentDir, dryRun: true }
  assert.equal(parse(['--update']).update, true)
  const preview = install(options)
  assert.equal(preview.frontSource, path.join(central, 'front'))
  assert.equal(preview.backendSource, path.join(central, 'back'))
  assert.equal(fs.existsSync(preview.destination), false)
  install({ ...options, dryRun: false })
  const agent = fs.readFileSync(preview.destination, 'utf8')
  assert.match(agent, /managed-by: hub-ai/)
  assert.match(agent, /Monorepos podem conter ambos/)
  assert.match(agent, /resources\/frontend\/skills/)
  assert.match(agent, /resources\/skills/)
  assert.deepEqual(fs.readdirSync(consumer), before)
  assert.equal(fs.existsSync(path.join(consumer, '.github')), false)
  const alternate = path.join(temp, 'backend-alternative')
  files(alternate, back)
  assert.throws(() => install({ ...options, dryRun: false, backendSource: alternate }), /refusing overwrite/)
  const refreshed = install({ ...options, dryRun: false, update: true, backendSource: alternate })
  assert.equal(refreshed.destination, preview.destination)
  fs.writeFileSync(preview.destination, 'personal customization')
  assert.throws(() => install({ ...options, dryRun: false, update: true }), /refusing overwrite/)
})

test('missing backend resources fail before writing personal agent', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'unified-missing-'))
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }))
  const source = path.join(temp, 'hub')
  files(path.join(source, 'front'), front)
  files(path.join(source, 'back'), ['AGENTS.md'])
  const agentDir = path.join(temp, 'agents')
  assert.throws(() => install({ source, agentDir, dryRun: false }), /Missing backend resource/)
  assert.equal(fs.existsSync(agentDir), false)
})
