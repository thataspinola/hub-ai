'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { ROOT, inside } = require('./hub-resources')

function score(report) {
  const rubric = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'evaluations/rubric.json'), 'utf8')
  )[report.scenario]

  if (!rubric || !Array.isArray(report.matched_expected))
    throw new Error('Invalid scenario or adjudication')

  const expected = new Set(rubric.expected),
    matched = new Set(report.matched_expected),
    fp = report.false_positives

  if (
    [...matched].some((x) => !expected.has(x)) ||
    !Number.isInteger(fp) ||
    fp < 0
  )
    throw new Error('Invalid adjudication')

  if (!report.raw_report || !report.adjudicator)
    throw new Error('Raw report and adjudicator are required')

  const raw = fs.realpathSync(path.resolve(ROOT, report.raw_report))

  if (!inside(ROOT, raw) || !fs.statSync(raw).isFile())
    throw new Error('Raw report must exist inside the hub')

  return {
    recall: expected.size ? matched.size / expected.size : null,
    precision: matched.size + fp ? matched.size / (matched.size + fp) : null,
    missed: [...expected].filter((x) => !matched.has(x)).sort(),
    false_positives: fp,
  }
}

if (require.main === module) {
  try {
    console.log(
      JSON.stringify(
        score(JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))),
        null,
        2
      )
    )
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}

module.exports = { score }
