'use strict'
const test = require('node:test'), assert = require('node:assert/strict')
const fs = require('node:fs'), os = require('node:os'), path = require('node:path')
const { inspectProject } = require('../../scripts/project-context')
const { install } = require('../../scripts/install')
function project(t, dependencies) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-context-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'synthetic', dependencies, scripts: { test: 'echo test' } }))
  return dir
}
for (const [name, dependencies] of Object.entries({ nextjs: { next: '16', react: '19' }, react: { react: '19' }, angular: { '@angular/core': '20' }, vue: { vue: '3' }, node: { '@nestjs/core': '11' } })) test(`auto profile selects ${name} without changing consumer files`, t => {
  const dir = project(t, dependencies), file = path.join(dir, 'package.json'), before = fs.readFileSync(file)
  assert.equal(inspectProject(dir).profile, name)
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), 'local guidance')
  fs.mkdirSync(path.join(dir, '.github/agents'), { recursive: true })
  const expert = path.join(dir, '.github/agents/frontend_engineering_expert.agent.md')
  fs.writeFileSync(expert, 'existing expert')
  install({ project: dir, profile: 'auto' }, undefined, () => {})
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir, '.github/hub-ai-lock.json'))).profile, name)
  assert.deepEqual(fs.readFileSync(file), before)
  assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), 'local guidance')
  assert.equal(fs.readFileSync(expert, 'utf8'), 'existing expert')
})
test('mixed frontend/backend packages require an explicit scope', t => {
  const dir = project(t, { react: '19', '@nestjs/core': '11' })
  assert.throws(() => inspectProject(dir), /Mixed/)
  assert.throws(() => install({ project: dir, profile: 'auto' }, undefined, () => {}), /Mixed/)
  assert.equal(fs.existsSync(path.join(dir, '.github')), false)
})
test('Nest examples inside the toolkit do not change a Next app detection', t => {
  const dir = project(t, { next: '16', react: '19' })
  const nested = path.join(dir, 'codigo-a-ser-transcrito/examples/nest-backend')
  fs.mkdirSync(nested, { recursive: true }); fs.writeFileSync(path.join(nested, 'package.json'), JSON.stringify({ dependencies: { '@nestjs/core': '11' } }))
  assert.equal(inspectProject(dir).profile, 'nextjs')
})
