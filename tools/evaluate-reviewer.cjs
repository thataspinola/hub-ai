'use strict'
const fs = require('node:fs')
const { score } = require('../tooling/web-code-reviewer/scripts/score-evaluation')
try {
  if (process.argv[2] === 'score' && process.argv[3]) console.log(JSON.stringify(score(JSON.parse(fs.readFileSync(process.argv[3], 'utf8'))), null, 2))
  else if (process.argv[2] === 'list') console.log('Frontend: resources/frontend/evaluations/review and clean\nRun each case separately in the editor. Save raw reports; a human must adjudicate findings before scoring. Do not give the expected findings/rubric to the reviewer.')
  else throw new Error('Usage: node tools/evaluate-reviewer.cjs list | score ADJUDICATION_JSON')
} catch (error) { console.error(error.message); process.exitCode = 1 }
