'use strict'
const fs = require('node:fs')
const path = require('node:path')
const { REPOSITORY_ROOT } = require('./hub-resources')
function inspectProject(project) {
  const root = fs.realpathSync(project)
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const dependencies = { ...pkg.devDependencies, ...pkg.dependencies }
  const web = dependencies.next ? 'nextjs' : dependencies['@angular/core'] ? 'angular' : dependencies.vue ? 'vue' : dependencies.react ? 'react' : null
  const backend = ['@nestjs/core', 'express', 'fastify'].some(name => dependencies[name])
  if (web && backend) throw new Error('Mixed frontend/backend package; choose the application and --profile explicitly')
  if (!web) throw new Error('Node/Nest backend review moved to https://github.com/thataspinola/backend-code-reviewer')
  const profile = web
  const declared = ['next', 'react', 'vue', '@angular/core', '@nestjs/core', 'express', 'fastify', 'jest', 'vitest', 'next-auth', 'zustand', 'tailwindcss']
  const exists = name => fs.existsSync(path.join(root, name))
  return {
    name: pkg.name || null, version: pkg.version || null, profile,
    node: pkg.engines?.node || null,
    packages: Object.fromEntries(declared.filter(name => dependencies[name]).map(name => [name, dependencies[name]])),
    scripts: pkg.scripts || {},
    layout: { source: exists('src') ? 'src' : null, tests: exists('__tests__') ? '__tests__' : exists('tests') ? 'tests' : null },
    configuration: ['next.config.ts', 'jest.config.ts', 'tsconfig.json', 'pom.xml', '.gitlab-ci.yml', 'Jenkinsfile'].filter(exists),
    lockfile: exists('package-lock.json') ? (fs.statSync(path.join(root, 'package-lock.json')).size ? 'present' : 'empty') : 'absent',
  }
}
if (require.main === module) {
  try { console.log(JSON.stringify(inspectProject(process.argv[2] || REPOSITORY_ROOT), null, 2)) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
module.exports = { inspectProject }
