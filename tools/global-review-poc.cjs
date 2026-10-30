#!/usr/bin/env node
'use strict'
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')

function parse(argv) {
  const options = { dryRun: false, source: path.resolve(__dirname, '..'), agentDir: path.join(os.homedir(), '.github', 'agents'), backendSource: null, frontSource: null, update: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--update') options.update = true
    else if (arg === '--front-source' && argv[i + 1]) options.frontSource = path.resolve(argv[++i])
    else if (arg === '--source' && argv[i + 1]) options.source = path.resolve(argv[++i])
    else if (arg === '--agent-dir' && argv[i + 1]) options.agentDir = path.resolve(argv[++i])
    else if (arg === '--backend-source' && argv[i + 1]) options.backendSource = path.resolve(argv[++i])
    else throw new Error('Unknown option: ' + arg)
  }
  return options
}

function render(source, backendSource = null, frontSource = null) {
  const paths = frontSource ? [] : [
    'AGENTS.md',
    'resources/frontend/skills/analytics-review/SKILL.md',
    'resources/frontend/skills/observability-review/SKILL.md',
    'resources/frontend/skills/code-standards/SKILL.md',
  ]
  for (const relative of paths) {
    if (!fs.existsSync(path.join(source, relative))) throw new Error('Missing resource: ' + relative)
  }
  if (backendSource) {
    for (const relative of ['AGENTS.md', 'resources/skills/analytics-review/SKILL.md', 'resources/skills/observability-review/SKILL.md', 'resources/skills/backend-security/SKILL.md', 'resources/skills/backend-testing/SKILL.md', 'resources/skills/event-contracts/SKILL.md', 'resources/skills/lambda-review/SKILL.md']) {
      if (!fs.existsSync(path.join(backendSource, relative))) throw new Error('Missing backend resource: ' + relative)
    }
  }
  if (frontSource) {
    for (const relative of ['AGENTS.md', 'resources/frontend/skills/analytics-review/SKILL.md', 'resources/frontend/skills/observability-review/SKILL.md']) {
      if (!fs.existsSync(path.join(frontSource, relative))) throw new Error('Missing frontend resource: ' + relative)
    }
  }
  const root = source.replace(/\\/g, '/')
  const frontRoot = (frontSource || source).replace(/\\/g, '/')
  const backendRoot = backendSource?.replace(/\\/g, '/')
  return [
    '---',
    'name: code-reviewer',
    "description: 'Revisar o projeto aberto com orientações centrais do hub-ai sem instalar recursos no projeto consumidor.'",
    'tools: [read, search, execute]',
    '---',
    '<!-- managed-by: hub-ai/global-review-poc.cjs -->',
    '# Code Reviewer global',
    'Ativação: selecione o agente code-reviewer no Copilot Chat e solicite "revisar".',
    'O workspace atualmente aberto é o consumidor; não o substitua pelo diretório do hub-ai.',
    'Leia o AGENTS.md e as instruções locais do consumidor primeiro.',
    'Repositório central, somente leitura: ' + root,
    'Consulte as skills frontend pertinentes sob ' + frontRoot + '/resources/frontend/skills/.',
    'Para frontend, consulte analytics-review/SKILL.md, observability-review/SKILL.md e as skills específicas do framework.',
    'Detecte por pacote e arquivos reais: Angular, React, Next.js e Vue são frontend; Node APIs, NestJS, Lambdas e eventos são backend. Monorepos podem conter ambos. Não confunda Node de build com backend.',
    backendRoot ? 'Recursos backend centrais, somente leitura: ' + backendRoot : 'Sem backend-source: sinalize a ausência de skills backend em projetos Node/NestJS.',
    backendRoot ? 'Para Node.js, Lambdas, eventos e NestJS, consulte as skills adequadas sob ' + backendRoot + '/resources/skills/ e os AGENTS do consumidor; escolha por evidência, não imponha NestJS a Node vanilla.' : 'Não alegue cobertura backend quando backend-source estiver ausente.',
    'Em monorepo, revise front e back separadamente e depois as interfaces compartilhadas, com relatórios por pacote e achados transversais.',
    'Não altere código ou configurações do consumidor. Não copie skills para .github nem instale dependências.',
    'Reporte arquivos, linhas, severidade, evidências, skills utilizadas, lacunas e comandos efetivamente executados.',
    'Nunca afirme execução ou cobertura sem evidências. Não acesse serviços corporativos ou exponha dados sensíveis.',
    ''
  ].join('\n')
}

function install(options) {
  const source = fs.realpathSync(options.source)
  const defaultFront = path.join(source, 'front')
  const defaultBack = path.join(source, 'back')
  const frontSource = options.frontSource ? fs.realpathSync(options.frontSource) : fs.existsSync(defaultFront) ? fs.realpathSync(defaultFront) : null
  const backendSource = options.backendSource ? fs.realpathSync(options.backendSource) : fs.existsSync(defaultBack) ? fs.realpathSync(defaultBack) : null
  const content = render(source, backendSource, frontSource)
  const destination = path.join(options.agentDir, 'code-reviewer.agent.md')
  const existing = fs.existsSync(destination) ? fs.readFileSync(destination, 'utf8') : null
  if (existing !== null && existing !== content) {
    if (!options.update || !existing.includes('<!-- managed-by: hub-ai/global-review-poc.cjs -->')) {
      throw new Error('Agent already exists with different content; refusing overwrite: ' + destination + '. Use --update only for a managed agent.')
    }
  }
  if (!options.dryRun) {
    fs.mkdirSync(options.agentDir, { recursive: true })
    fs.writeFileSync(destination, content, { flag: existing === null ? 'wx' : 'w' })
  }
  return { destination, source, frontSource, backendSource, dryRun: options.dryRun, unchanged: fs.existsSync(destination) && fs.readFileSync(destination, 'utf8') === content }
}

if (require.main === module) {
  try {
    const result = install(parse(process.argv.slice(2)))
    process.stdout.write(JSON.stringify(result, null, 2) + '\n')
  } catch (error) {
    process.stderr.write(error.message + '\n')
    process.exitCode = 1
  }
}
module.exports = { parse, render, install }
