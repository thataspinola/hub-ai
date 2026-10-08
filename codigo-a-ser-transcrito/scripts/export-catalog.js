'use strict'
const fs = require('node:fs')
const path = require('node:path')
const YAML = require('yaml')
const { ROOT, REPOSITORY_ROOT, sourcePath, profiles, resources } = require('./hub-resources')
const { atomicWrite } = require('./install')
function exportCatalog() {
  const catalog = { schema: 1, version: fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim(), profiles: [], resources: [] }
  const collected = new Map()
  for (const profile of profiles()) {
    const { manifest, files } = resources(profile)
    catalog.profiles.push({ name: profile, setup: manifest.setup, capabilities: Object.keys(manifest.capabilities || {}).sort(), files: Object.keys(files).sort() })
    for (const [kind, items] of Object.entries(manifest).filter(([kind]) => ['agents', 'skills', 'templates'].includes(kind))) for (const item of items) collected.set(item, kind)
    for (const capability of Object.values(manifest.capabilities || {})) for (const [kind, items] of Object.entries(capability)) for (const item of items) collected.set(item, kind)
  }
  for (const [source, kind] of [...collected].sort(([a], [b]) => a.localeCompare(b))) {
    const file = path.join(sourcePath(source), kind === 'skills' ? 'SKILL.md' : '')
    const text = fs.readFileSync(file, 'utf8'), match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
    const metadata = match ? YAML.parse(match[1]) : null
    catalog.resources.push({ kind, id: path.basename(source).replace(/\.(agent|template)\.md$/, ''), name: kind === 'templates' ? path.basename(source).replace(/\.template\.md$/, '') : metadata?.name || path.basename(source), description: kind === 'templates' ? null : metadata?.description || null, source: source.startsWith('resources/frontend/') ? source : 'codigo-a-ser-transcrito/' + source })
  }
  return catalog
}
if (require.main === module) {
  try {
    const output = path.join(REPOSITORY_ROOT, 'src/data/ai-resources.json')
    atomicWrite(output, Buffer.from(JSON.stringify(exportCatalog(), null, 2) + '\n'))
    console.log('Exported src/data/ai-resources.json')
  } catch (error) { console.error(error.message); process.exitCode = 1 }
}
module.exports = { exportCatalog }
