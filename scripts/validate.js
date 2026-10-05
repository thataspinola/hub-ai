'use strict'
const fs = require('node:fs')
const path = require('node:path')
const YAML = require('yaml')
const { ROOT, walk, resources } = require('./hub-resources')
function validate() {
  const errors = [], names = new Set()
  const metadata = text => {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
    if (!match) throw new Error('Missing frontmatter')
    const data = YAML.parse(match[1])
    if (!data || !['name', 'description'].every(k => typeof data[k] === 'string' && data[k].trim())) throw new Error('name and description must be nonempty strings')
    return data
  }
  for (const file of walk(ROOT)) {
    const relative = path.relative(ROOT, file)
    if (/\.py[cow]?$/.test(file)) errors.push(`${relative}: prohibited runtime file`)
    if (!file.endsWith('.md')) continue
    const text = fs.readFileSync(file, 'utf8'), prose = text.replace(/```[\s\S]*?```/g, '')
    for (const match of prose.matchAll(/(?<!!)\[[^\]]+\]\(([^\s)]+)\)/g)) {
      const link = match[1]
      if (link.includes('://') || /^(#|mailto:)/.test(link) || (path.dirname(file) === path.join(ROOT, 'templates') && link === './references/patterns.md')) continue
      if (!fs.existsSync(path.resolve(path.dirname(file), link.split('#')[0]))) errors.push(`${relative}: broken link ${link}`)
    }
    try {
      if (path.basename(file) === 'SKILL.md' || file.endsWith('.agent.md')) {
        const data = metadata(text)
        if (!relative.split(path.sep).includes('templates')) {
          const skill = path.basename(file) === 'SKILL.md', key = `${skill ? 'skill' : 'agent'}:${data.name}`
          if (skill && (!/^[a-z0-9-]{1,64}$/.test(data.name) || data.name !== path.basename(path.dirname(file)))) throw new Error('Invalid skill name/directory')
          if (names.has(key)) throw new Error(`Duplicate name: ${key}`)
          names.add(key)
          if (!skill && (!Array.isArray(data.tools) || !data.tools.every(x => typeof x === 'string'))) throw new Error('Agent tools must be a list of strings')
        }
      }
      if (['!===', 'aria-describedBy=', 'tab-index='].some(x => text.includes(x))) throw new Error('Invalid example syntax')
      if (relative.split(path.sep).includes('templates') && /\{\s+\{/.test(text)) throw new Error('Malformed placeholder')
    } catch (error) { errors.push(`${relative}: ${error.message}`) }
  }
  for (const profile of fs.readdirSync(path.join(ROOT, 'profiles'))) {
    try {
      const { manifest, files } = resources(profile)
      if (manifest.name !== profile) throw new Error('Manifest name does not match directory')
      const available = Object.keys(files).filter(x => x.startsWith('.github/skills/') && x.endsWith('/SKILL.md')).map(x => x.split('/')[2])
      const setup = manifest.agents.filter(x => metadata(fs.readFileSync(path.join(ROOT, x), 'utf8')).name === manifest.setup)
      if (setup.length !== 1) throw new Error('Exactly one setup agent is required')
      const catalog = fs.readFileSync(path.join(ROOT, setup[0]), 'utf8')
      for (const name of available) if (!new RegExp('^\\|\\s*`?' + name + '`?\\s*\\|', 'm').test(catalog)) errors.push(`${profile}: setup catalog missing ${name}`)
      for (const agent of manifest.agents) {
        const text = fs.readFileSync(path.join(ROOT, agent), 'utf8')
        for (const match of text.matchAll(/\.github\/templates\/([\w.-]+)/g)) if (!files[`.github/templates/${match[1]}`]) errors.push(`${agent}: missing template ${match[1]}`)
        for (const match of text.matchAll(/\bnode-[a-z-]+\b/g)) if (!['node-setup', 'node-code-reviewer', 'node-instructions', 'node-architecture'].includes(match[0]) && !match[0].endsWith('-') && !available.includes(match[0])) errors.push(`${agent}: missing skill ${match[0]}`)
      }
    } catch (error) { errors.push(`${profile}: ${error.message}`) }
  }
  try {
    const text = fs.readFileSync(path.join(ROOT, '.gitlab-ci.yml'), 'utf8'), data = YAML.parse(text)
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Workflow must be a mapping')
    if (/python|pip\s|\.py\b/i.test(text)) throw new Error('Unsupported runtime in pipeline')
  } catch (error) { errors.push(`.gitlab-ci.yml: ${error.message}`) }
  return { errors, count: names.size }
}
if (require.main === module) {
  const result = validate()
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1 }
  else console.log(`Validated ${result.count} unique skills/agents, YAML, links, profiles and runtime policy.`)
}
module.exports = { validate }
