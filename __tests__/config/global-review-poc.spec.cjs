'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { install, render } = require('../../tools/global-review-poc.cjs')

test('global reviewer is installed once without touching consumer workspaces', t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-ai-global-poc-'))
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }))
  const source = path.join(tmp, 'hub')
  const workspaceA = path.join(tmp, 'react-app')
  const workspaceB = path.join(tmp, 'next-app')
  const agentDir = path.join(tmp, 'user', '.github', 'agents')
  for (const relative of ['AGENTS.md', 'resources/frontend/skills/analytics-review/SKILL.md', 'resources/frontend/skills/observability-review/SKILL.md', 'resources/frontend/skills/code-standards/SKILL.md']) {
    const file = path.join(source, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, '# Fixture\n')
  }
  for (const dir of [workspaceA, workspaceB]) {
    fs.mkdirSync(dir)
    fs.writeFileSync(path.join(dir, 'package.json'), '{"private":true}\n')
  }
  const before = [workspaceA, workspaceB].map(dir => fs.readdirSync(dir))
  const options = { source, agentDir, dryRun: true }
  const preview = install(options)
  assert.equal(fs.existsSync(preview.destination), false)
  install({ ...options, dryRun: false })
  const first = fs.readFileSync(preview.destination, 'utf8')
  assert.match(first, /name: code-reviewer/)
  assert.match(first, /analytics-review/)
  assert.match(first, /não instale dependências/)
  install({ ...options, dryRun: false })
  assert.equal(fs.readFileSync(preview.destination, 'utf8'), first)
  assert.deepEqual([workspaceA, workspaceB].map(dir => fs.readdirSync(dir)), before)
  fs.writeFileSync(preview.destination, 'custom agent')
  assert.throws(() => install({ ...options, dryRun: false }), /refusing overwrite/)
})

test('missing source skills cause safe failure', t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-ai-missing-'))
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }))
  assert.throws(() => render(tmp), /Missing resource/)
})
