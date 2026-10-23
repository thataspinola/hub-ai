'use strict'

const fs = require('node:fs')
const path = require('node:path')

const { STATE, digest, resources, safePath, walk } = require('./hub-resources')

function diagnose(project) {
  const root = fs.realpathSync(project),
    issues = []

  try {
    const state = JSON.parse(fs.readFileSync(safePath(root, STATE), 'utf8'))
    const { files: expected } = resources(state.profile, state.capabilities)

    for (const [name, checksum] of Object.entries(state.files)) {
      if (!/^\.github\/(agents|skills|templates)\//.test(name))
        throw new Error(`Invalid managed path: ${name}`)

      const file = safePath(root, name)

      if (!fs.existsSync(file)) issues.push(`Missing: ${name}`)
      else if (digest(fs.readFileSync(file)) !== checksum)
        issues.push(`Locally modified: ${name}`)

      if (!expected[name]) issues.push(`Obsolete managed resource: ${name}`)
    }

    for (const [name, data] of Object.entries(expected)) {
      if (!Object.hasOwn(state.files, name))
        issues.push(`Untracked required resource: ${name}`)
      else if (digest(data) !== state.files[name])
        issues.push(`Hub update available: ${name}`)
    }

    let otherManaged = {}
    const otherStatePath = safePath(root, '.github/backend-reviewer-lock.json')

    if (fs.existsSync(otherStatePath)) {
      const other = JSON.parse(fs.readFileSync(otherStatePath, 'utf8'))

      if (other.schema !== 1 || !other.files || Array.isArray(other.files))
        throw new Error('Invalid other toolkit state')

      otherManaged = other.files
    }

    for (const folder of ['agents', 'skills', 'templates']) {
      const directory = path.join(root, '.github', folder)

      if (fs.existsSync(directory) && fs.lstatSync(directory).isSymbolicLink())
        throw new Error(`Symlink folder: ${directory}`)

      for (const file of walk(directory)) {
        const name = path.relative(root, file).split(path.sep).join('/')

        if (fs.lstatSync(file).isSymbolicLink())
          issues.push(`Symlink resource: ${name}`)
        else if (
          !Object.hasOwn(state.files, name) &&
          !Object.hasOwn(otherManaged, name)
        )
          issues.push(`Unmanaged resource (review, do not delete): ${name}`)
      }
    }

    const generated = [
      path.join(root, '.github/copilot-instructions.md'),
      path.join(root, 'AGENTS.md'),
    ]

    const files = [
      ...Object.keys(state.files)
        .filter((n) => n.endsWith('.md') && !n.includes('/templates/'))
        .map((n) => safePath(root, n)),
      ...generated,
    ]

    for (const file of files) {
      if (!fs.existsSync(file) || fs.lstatSync(file).isSymbolicLink()) continue
      const text = fs.readFileSync(file, 'utf8')

      if (/\{\{[A-Z][A-Z0-9_]*\}\}/.test(text))
        issues.push(`Unresolved placeholder: ${path.relative(root, file)}`)

      for (const match of text
        .replace(/```[\s\S]*?```/g, '')
        .matchAll(/\[[^\]]+\]\(([^\s)]+)\)/g)) {
        const link = match[1]

        if (
          !link.includes('://') &&
          !/^(#|mailto:)/.test(link) &&
          !fs.existsSync(path.resolve(path.dirname(file), link.split('#')[0]))
        )
          issues.push(`Broken link in ${path.relative(root, file)}: ${link}`)
      }
    }

    if (!fs.existsSync(generated[0]))
      issues.push(
        'Instructions not generated yet; run the installed setup agent'
      )

    if (
      ['.hub-ai-transaction.json', '.hub-ai-install.lock'].some((n) =>
        fs.existsSync(path.join(root, n))
      )
    )
      issues.push('Installation locked/interrupted; inspect and recover')
  } catch (error) {
    issues.push(error.message)
  }

  return issues
}

if (require.main === module) {
  try {
    if (process.argv.length !== 3)
      throw new Error('Usage: node scripts/doctor.js PROJECT')

    const issues = diagnose(process.argv[2])

    console.log(
      issues.length
        ? issues.join('\n')
        : 'Installation is consistent with this hub; executor behavior is not certified.'
    )

    process.exitCode = issues.length ? 1 : 0
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = { diagnose }
