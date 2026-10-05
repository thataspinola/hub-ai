'use strict'
const test = require('node:test'), assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path'), os = require('node:os')
const { spawnSync } = require('node:child_process')
const { ROOT } = require('./hub-resources'), { score } = require('./score-evaluation')
function mutation(t, name, mutate) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-validate-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  fs.cpSync(ROOT, dir, { recursive: true, filter: source => !['.git', 'node_modules', '__pycache__'].includes(path.basename(source)) })
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(dir, 'node_modules'), 'dir')
  const file = path.join(dir, name); fs.writeFileSync(file, mutate(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''))
  const result = spawnSync(process.execPath, [path.join(dir, 'scripts/validate.js')], { encoding: 'utf8' }); assert.notEqual(result.status, 0, result.stdout)
}
test('invalid YAML rejected', t => mutation(t, 'profiles/node/skills/node-e2e/SKILL.md', text => text.replace('name: node-e2e', 'name: [')))
test('non-string metadata rejected', t => mutation(t, 'profiles/node/skills/node-e2e/SKILL.md', text => text.replace('name: node-e2e', 'name: 123')))
test('missing profile resource rejected', t => mutation(t, 'profiles/node/profile.json', text => text.replace('skills/node-testing', 'skills/missing')))
test('prohibited runtime files rejected', t => mutation(t, 'prohibited.py', () => ''))
test('unsupported CI runtime rejected', t => mutation(t, '.gitlab-ci.yml', text => text.replace('image: node:22-bookworm-slim', 'image: python:3.12-slim')))
test('scoring requires human adjudication and rejects invented matches', () => {
  const report = { scenario: 'node-review', matched_expected: ['partial-publication', 'runtime-dependency'], false_positives: 1, raw_report: 'evaluations/results/node-review.raw.md', adjudicator: 'test' }
  const result = score(report); assert.equal(result.recall, 0.5); assert.equal(result.precision, 2 / 3)
  assert.throws(() => score({ ...report, matched_expected: ['invented'] }), /Invalid/)
  assert.throws(() => score({ ...report, false_positives: true }), /Invalid/)
  assert.throws(() => score({ ...report, raw_report: '../outside' }))
})
