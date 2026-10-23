'use strict'

const fs = require('node:fs')
const path = require('node:path')
const YAML = require('yaml')

const {
  ROOT,
  REPOSITORY_ROOT,
  FRONTEND_ROOT,
  sourcePath,
  profiles,
  walk,
  resources,
} = require('./hub-resources')

function validate() {
  const errors = [],
    names = new Set()

  const metadata = (text) => {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
    if (!match) throw new Error('Missing frontmatter')
    const data = YAML.parse(match[1])

    if (
      !data ||
      !['name', 'description'].every(
        (k) => typeof data[k] === 'string' && data[k].trim()
      )
    )
      throw new Error('name and description must be nonempty strings')

    return data
  }

  for (const file of [...walk(ROOT), ...walk(FRONTEND_ROOT)]) {
    const relative = path.relative(
      file.startsWith(FRONTEND_ROOT) ? REPOSITORY_ROOT : ROOT,
      file
    )

    const exceptions = new Set([
      'README.md',
      'CHANGELOG.md',
      'VERSION',
      'SKILL.md',
      'AGENTS.md',
      '.gitignore',
      '.gitlab-ci.yml',
    ])

    for (const part of relative.split(path.sep))
      if (
        !exceptions.has(part) &&
        !/^\.?[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(part)
      )
        errors.push(relative + ': invalid file/directory naming')

    if (!file.endsWith('.md')) continue

    const text = fs.readFileSync(file, 'utf8'),
      prose = text.replace(/```[\s\S]*?```/g, '')

    for (const match of prose.matchAll(/(?<!!)\[[^\]]+\]\(([^\s)]+)\)/g)) {
      const link = match[1]

      if (
        link.includes('://') ||
        /^(#|mailto:)/.test(link) ||
        ([
          path.join(ROOT, 'resources/templates'),
          path.join(FRONTEND_ROOT, 'templates'),
        ].includes(path.dirname(file)) &&
          link === './references/patterns.md')
      )
        continue

      if (!fs.existsSync(path.resolve(path.dirname(file), link.split('#')[0])))
        errors.push(`${relative}: broken link ${link}`)
    }

    try {
      if (
        path.basename(file) === 'SKILL.md' ||
        file.endsWith('.agent.md') ||
        (file.endsWith('.template.md') && text.startsWith('---'))
      ) {
        const data = metadata(text)

        if (!relative.split(path.sep).includes('templates')) {
          const skill = path.basename(file) === 'SKILL.md',
            key = `${skill ? 'skill' : 'agent'}:${data.name}`

          if (
            skill &&
            (!/^[a-z0-9-]{1,64}$/.test(data.name) ||
              data.name !== path.basename(path.dirname(file)))
          )
            throw new Error('Invalid skill name/directory')

          if (names.has(key)) throw new Error(`Duplicate name: ${key}`)
          names.add(key)

          if (
            !skill &&
            (!Array.isArray(data.tools) ||
              !data.tools.every((x) => typeof x === 'string'))
          )
            throw new Error('Agent tools must be a list of strings')
        }
      }

      if (
        ['!===', 'aria-describedBy=', 'tab-index='].some((x) =>
          text.includes(x)
        )
      )
        throw new Error('Invalid example syntax')

      if (
        relative.split(path.sep).includes('templates') &&
        /\{\s+\{/.test(text)
      )
        throw new Error('Malformed placeholder')
    } catch (error) {
      errors.push(`${relative}: ${error.message}`)
    }
  }

  for (const profile of profiles()) {
    try {
      const { manifest, files } = resources(profile)

      for (const [kind, paths] of Object.entries(manifest).filter(([k]) =>
        ['agents', 'skills', 'templates'].includes(k)
      ))
        for (const source of paths) {
          if (
            !source.startsWith(`resources/${kind}/`) &&
            !source.startsWith(`resources/frontend/${kind}/`)
          )
            throw new Error(`Noncanonical resource path: ${source}`)

          if (kind === 'agents' && !source.endsWith('.agent.md'))
            throw new Error(`Agent filename requires .agent.md: ${source}`)

          if (kind === 'templates' && !source.endsWith('.template.md'))
            throw new Error(
              `Template filename requires .template.md: ${source}`
            )
        }

      if (
        manifest.setup !== 'Copilot Setup' ||
        manifest.agents[0] !==
          'resources/frontend/agents/copilot-setup.agent.md'
      )
        throw new Error('Every profile must use the shared Copilot Setup')

      if (manifest.name !== profile)
        throw new Error('Manifest name does not match directory')

      const available = Object.keys(files)
        .filter(
          (x) => x.startsWith('.github/skills/') && x.endsWith('/SKILL.md')
        )
        .map((x) => x.split('/')[2])

      const setup = manifest.agents.filter(
        (x) =>
          metadata(fs.readFileSync(sourcePath(x), 'utf8')).name ===
          manifest.setup
      )

      if (setup.length !== 1)
        throw new Error('Exactly one setup agent is required')

      const catalog = fs.readFileSync(sourcePath(setup[0]), 'utf8')

      for (const name of available)
        if (!new RegExp('^\\|\\s*`?' + name + '`?\\s*\\|', 'm').test(catalog))
          errors.push(`${profile}: setup catalog missing ${name}`)

      for (const agent of manifest.agents) {
        const text = fs.readFileSync(sourcePath(agent), 'utf8')

        for (const match of text.matchAll(/\.github\/templates\/([\w.-]+)/g))
          if (!files[`.github/templates/${match[1]}`])
            errors.push(`${agent}: missing template ${match[1]}`)
      }
    } catch (error) {
      errors.push(`${profile}: ${error.message}`)
    }
  }

  try {
    const ci = path.join(ROOT, '.gitlab-ci.yml')

    if (fs.existsSync(ci)) {
      const text = fs.readFileSync(ci, 'utf8'),
        data = YAML.parse(text)

      if (!data || typeof data !== 'object' || Array.isArray(data))
        throw new Error('Workflow must be a mapping')
    }
  } catch (error) {
    errors.push(`.gitlab-ci.yml: ${error.message}`)
  }

  try {
    const { exportCatalog } = require('./export-catalog')

    const current = JSON.parse(
      fs.readFileSync(
        path.join(REPOSITORY_ROOT, 'src/data/ai-resources.json'),
        'utf8'
      )
    )

    if (JSON.stringify(current) !== JSON.stringify(exportCatalog()))
      throw new Error('Stale resource catalog; run npm run catalog:export')
  } catch (error) {
    errors.push(error.message)
  }

  return { errors, count: names.size }
}

if (require.main === module) {
  const result = validate()

  if (result.errors.length) {
    console.error(result.errors.join('\n'))
    process.exitCode = 1
  } else
    console.log(
      `Validated ${result.count} unique skills/agents, YAML, links, profiles and runtime policy.`
    )
}

module.exports = { validate }
