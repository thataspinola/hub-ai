'use strict'
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const ROOT = path.resolve(__dirname, '..')
const STATE = '.github/hub-ai-lock.json'
const digest = data => crypto.createHash('sha256').update(data).digest('hex')
const inside = (root, dest) => dest === root || dest.startsWith(root + path.sep)
function safePath(root, relative) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error(`Unsafe relative path: ${relative}`)
  const dest = path.resolve(root, relative)
  if (!inside(root, dest)) throw new Error(`Path escapes project: ${relative}`)
  for (let current = dest; current !== root; current = path.dirname(current)) {
    let stat
    try { stat = fs.lstatSync(current) } catch (error) { if (error.code === 'ENOENT') continue; throw error }
    if (stat.isSymbolicLink()) throw new Error(`Symlink destination is not supported: ${current}`)
    if (current === dest ? !stat.isFile() : !stat.isDirectory()) throw new Error(`Invalid destination type: ${current}`)
  }
  return dest
}
function walk(root) {
  if (!fs.existsSync(root)) return []
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    if (['.git', 'node_modules', '__pycache__'].includes(entry.name)) return []
    const full = path.join(root, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}
function resources(profile, capabilities) {
  if (!/^[a-z-]+$/.test(profile)) throw new Error('Invalid profile name')
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'profiles', profile, 'profile.json'), 'utf8'))
  const available = manifest.capabilities || {}
  const selected = capabilities === undefined ? Object.keys(available) : capabilities
  for (const name of selected) if (!Object.hasOwn(available, name)) throw new Error(`Unknown capability: ${name}`)
  const spec = Object.fromEntries(['agents', 'skills', 'templates'].map(kind => [kind, [...manifest[kind]]]))
  for (const name of selected) for (const [kind, items] of Object.entries(available[name])) spec[kind].push(...items)
  const files = {}
  for (const [kind, items] of Object.entries(spec)) for (const item of items) {
    const source = path.resolve(ROOT, item)
    if (!inside(ROOT, source) || !fs.existsSync(source) || fs.lstatSync(source).isSymbolicLink()) throw new Error(`Invalid resource: ${item}`)
    if (kind === 'skills' && !fs.existsSync(path.join(source, 'SKILL.md'))) throw new Error(`Missing skill metadata: ${item}`)
    for (const full of kind === 'skills' ? walk(source) : [source]) {
      if (fs.lstatSync(full).isSymbolicLink() || !inside(ROOT, fs.realpathSync(full))) throw new Error(`Unsafe resource: ${full}`)
      const relative = (kind === 'skills' ? path.join('.github/skills', path.basename(source), path.relative(source, full)) : path.join('.github', kind, path.basename(full))).split(path.sep).join('/')
      if (Object.hasOwn(files, relative)) throw new Error(`Duplicate destination: ${relative}`)
      files[relative] = fs.readFileSync(full)
    }
  }
  return { manifest, selected, files }
}
module.exports = { ROOT, STATE, digest, inside, safePath, walk, resources }
