'use strict'
const test = require('node:test'), assert = require('node:assert/strict')
const fs = require('node:fs'), os = require('node:os'), path = require('node:path')
const { install, atomicWrite } = require('../../scripts/install')
const { diagnose } = require('../../scripts/doctor')
const temp = t => { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-test-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true })); return dir }
const put = (root, name, text) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); return file }
const run = (project, extra = {}, write = atomicWrite) => install({ project, profile: 'node', ...extra }, write, () => {})
for (const profile of ['frontend', 'node', 'angular', 'react', 'nextjs', 'vue']) test(`install and repeat ${profile}, preserve consumer CI and instructions`, t => {
  const dir = temp(t)
  put(dir, '.gitlab-ci.yml', 'existing CI'); put(dir, 'AGENTS.md', 'domain rules'); put(dir, '.github/copilot-instructions.md', 'Completed rules')
  run(dir, { profile }); run(dir, { profile })
  assert.equal(fs.readFileSync(path.join(dir, '.gitlab-ci.yml'), 'utf8'), 'existing CI')
  assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), 'domain rules')
  assert.deepEqual(diagnose(dir), [])
  const state = JSON.parse(fs.readFileSync(path.join(dir, '.github/hub-ai-lock.json')))
  assert.equal(state.profile, profile); assert.equal(state.version, '1.5.0')
  assert.ok(state.files['.github/agents/copilot-setup.agent.md'])
  assert.equal(fs.existsSync(path.join(dir, '.github/agents/node-setup.agent.md')), false)
  assert.equal(fs.existsSync(path.join(dir, '.github/agents/web-setup.agent.md')), false)
  if (profile === 'nextjs') assert.ok(fs.existsSync(path.join(dir, '.github/skills/react-patterns')))
  if (profile === 'node') assert.ok(fs.existsSync(path.join(dir, '.github/skills/node-testing/references/nestjs.md')))
  if (['angular', 'react', 'nextjs', 'vue'].includes(profile)) for (const other of ['angular', 'react', 'nextjs', 'vue'].filter(x => x !== profile && !(profile === 'nextjs' && x === 'react'))) assert.equal(fs.existsSync(path.join(dir, `.github/skills/${other}-patterns`)), false)
})
test('conflicts prevent partial writes; overwrite is explicit', t => {
  const dir = temp(t); run(dir)
  const file = put(dir, '.github/agents/copilot-setup.agent.md', 'custom')
  const missing = path.join(dir, '.github/templates/node-instructions.template.md'); fs.unlinkSync(missing)
  assert.throws(() => run(dir), /Conflicts/); assert.equal(fs.readFileSync(file, 'utf8'), 'custom'); assert.equal(fs.existsSync(missing), false)
  run(dir, { overwrite: true }); assert.equal(fs.existsSync(missing), true)
})
test('symlinks cannot write outside project', t => {
  const dir = temp(t), outside = temp(t); fs.symlinkSync(outside, path.join(dir, '.github'), 'dir')
  assert.throws(() => run(dir, { overwrite: true }), /Symlink/); assert.deepEqual(fs.readdirSync(outside), [])
})
test('hardlink replacement leaves outside inode intact', t => {
  const dir = temp(t), other = put(temp(t), 'original', 'original')
  const dest = put(dir, '.github/agents/copilot-setup.agent.md', ''); fs.unlinkSync(dest); fs.linkSync(other, dest)
  run(dir, { overwrite: true }); assert.equal(fs.readFileSync(other, 'utf8'), 'original'); assert.notEqual(fs.statSync(other).ino, fs.statSync(dest).ino)
})
test('directory conflict prevents partial install', t => {
  const dir = temp(t); fs.mkdirSync(path.join(dir, '.github/templates/node-instructions.template.md'), { recursive: true })
  assert.throws(() => run(dir, { overwrite: true }), /Invalid destination/); assert.equal(fs.existsSync(path.join(dir, '.github/agents')), false)
})
test('preview writes nothing', t => { const dir = temp(t); run(dir, { 'dry-run': true }); assert.deepEqual(fs.readdirSync(dir), []) })
test('migration refuses changed obsolete files, removes restored managed files', t => {
  const dir = temp(t); run(dir, { profile: 'frontend' }); const file = put(dir, '.github/skills/accessibility/SKILL.md', 'custom')
  assert.throws(() => run(dir, { migrate: true }), /Conflicts/); assert.equal(fs.readFileSync(file, 'utf8'), 'custom')
  run(dir, { profile: 'frontend', overwrite: true }); run(dir, { migrate: true }); assert.equal(fs.existsSync(file), false)
})
test('base capabilities and drift diagnosis', t => {
  const dir = temp(t); run(dir, { capabilities: 'base' }); put(dir, '.github/copilot-instructions.md', 'done')
  assert.equal(fs.existsSync(path.join(dir, '.github/skills/node-e2e')), false); assert.deepEqual(diagnose(dir), [])
  put(dir, '.github/skills/node-testing/SKILL.md', 'changed'); assert.ok(diagnose(dir).some(x => x.startsWith('Locally modified:')))
})
test('write failure rolls back existing content and newly added files', t => {
  const dir = temp(t), file = put(dir, '.github/agents/copilot-setup.agent.md', 'before'); let failed = false
  assert.throws(() => run(dir, { overwrite: true }, (dest, data) => { if (dest.endsWith('node-code-reviewer.agent.md') && !failed) { failed = true; throw new Error('disk error') } atomicWrite(dest, data) }), /disk error/)
  assert.equal(fs.readFileSync(file, 'utf8'), 'before'); assert.equal(fs.existsSync(path.join(dir, '.github/agents/node-code-reviewer.agent.md')), false); assert.equal(fs.existsSync(path.join(dir, '.hub-ai-transaction.json')), false)
})
test('interrupted install recovery and active lock protection', t => {
  const dir = temp(t), name = '.github/agents/copilot-setup.agent.md', file = put(dir, name, 'partial')
  put(dir, '.hub-ai-transaction.json', JSON.stringify({ before: { [name]: Buffer.from('original').toString('base64') } }))
  assert.throws(() => run(dir), /interrupted/)
  put(dir, '.hub-ai-install.lock', String(process.pid)); assert.throws(() => run(dir, { recover: true }), /still running/)
  fs.unlinkSync(path.join(dir, '.hub-ai-install.lock')); run(dir, { recover: true }); assert.equal(fs.readFileSync(file, 'utf8'), 'original')
})

test('migration to unified setup removes only unchanged managed old names', t => {
  const { digest } = require('../../scripts/hub-resources')
  const dir = temp(t); run(dir)
  const oldNames = ['.github/agents/node-setup.agent.md', '.github/templates/node-instructions.md', '.github/skills/acessibility/SKILL.md']
  const stateFile = path.join(dir, '.github/hub-ai-lock.json')
  const state = JSON.parse(fs.readFileSync(stateFile))
  state.version = '1.3.0'
  for (const name of oldNames) { put(dir, name, 'old managed'); state.files[name] = digest(Buffer.from('old managed')) }
  fs.writeFileSync(stateFile, JSON.stringify(state))
  put(dir, oldNames[0], 'custom old setup')
  assert.throws(() => run(dir, { migrate: true, overwrite: true }), /Conflicts/)
  for (const name of oldNames) assert.ok(fs.existsSync(path.join(dir, name)))
  put(dir, oldNames[0], 'old managed')
  run(dir, { migrate: true, overwrite: true })
  for (const name of oldNames) assert.equal(fs.existsSync(path.join(dir, name)), false)
  assert.ok(fs.existsSync(path.join(dir, '.github/agents/copilot-setup.agent.md')))
})
