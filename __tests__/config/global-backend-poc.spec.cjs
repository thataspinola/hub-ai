'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { install, render, parse } = require('../../tools/global-review-poc.cjs')

const frontendSkills = [
  'AGENTS.md',
  'resources/frontend/skills/analytics-review/SKILL.md',
  'resources/frontend/skills/observability-review/SKILL.md',
  'resources/frontend/skills/code-standards/SKILL.md',
]
const backendSkills = [
  'AGENTS.md',
  'resources/skills/analytics-review/SKILL.md',
  'resources/skills/observability-review/SKILL.md',
  'resources/skills/backend-security/SKILL.md',
  'resources/skills/backend-testing/SKILL.md',
  'resources/skills/event-contracts/SKILL.md',
  'resources/skills/lambda-review/SKILL.md',
]
function fixture(root, files) {
  for (const relative of files) {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, '# Fixture\n')
  }
}

test('single global agent references backend reviewer while leaving porto_connectivity fixture unchanged', t => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'global-porto-backend-'))
  t.after(() => fs.rmSync(base, { recursive: true, force: true }))
  const hub = path.join(base, 'hub-ai')
  const backend = path.join(base, 'backend-code-reviewer')
  const consumer = path.join(base, 'porto_connectivity')
  const agentDir = path.join(base, 'user', '.github', 'agents')
  fixture(hub, frontendSkills)
  fixture(backend, backendSkills)
  for (const name of [
    'app-token-generator',
    'app-token-generator-error',
    'app-token-generator-requirements',
    'app-credential-usage-failure',
  ]) {
    fixture(consumer, [
      name + '/AGENTS.md',
      name + '/package.json',
      name + '/index.js',
    ])
  }
  const entries = fs.readdirSync(consumer)
  const options = { source: hub, backendSource: backend, agentDir, dryRun: true }
  assert.equal(parse(['--backend-source', backend]).backendSource, backend)
  const preview = install(options)
  assert.equal(fs.existsSync(preview.destination), false)
  install({ ...options, dryRun: false })
  const generated = fs.readFileSync(preview.destination, 'utf8')
  assert.match(generated, /name: code-reviewer/)
  assert.match(generated, /Recursos backend centrais/)
  assert.match(generated, /resources\/skills/)
  assert.match(generated, /não imponha NestJS a Node vanilla/)
  install({ ...options, dryRun: false })
  assert.equal(fs.readFileSync(preview.destination, 'utf8'), generated)
  assert.deepEqual(fs.readdirSync(consumer), entries)
  assert.ok(!fs.existsSync(path.join(consumer, '.github')))
  fs.writeFileSync(preview.destination, 'custom personal agent')
  assert.throws(() => install({ ...options, dryRun: false }), /refusing overwrite/)
})

test('backend setup fails closed when backend skills are missing', t => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'global-backend-missing-'))
  t.after(() => fs.rmSync(base, { recursive: true, force: true }))
  const hub = path.join(base, 'hub')
  const backend = path.join(base, 'backend')
  fixture(hub, frontendSkills)
  fixture(backend, ['AGENTS.md'])
  assert.throws(() => render(hub, backend), /Missing backend resource/)
})
