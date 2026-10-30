'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '../../../../resources/frontend/profiles')
const shared = ['accessibility', 'code-quality', 'code-review', 'code-standards', 'performance', 'unit-testing', 'rdm-description', 'security', 'web-quality', 'web-testing']
for (const framework of ['angular', 'react', 'nextjs', 'vue']) {
  test(framework + ' installs shared review skills', () => {
    const profile = JSON.parse(fs.readFileSync(path.join(root, framework, 'profile.json'), 'utf8'))
    for (const skill of shared) assert.ok(profile.skills.some(item => item.endsWith('/' + skill)), framework + ' missing ' + skill)
    assert.ok(profile.skills.some(item => item.endsWith('/' + framework + '-patterns')), framework + ' missing framework patterns')
    if (framework === 'nextjs') assert.ok(profile.skills.some(item => item.endsWith('/react-patterns')))
  })
}
