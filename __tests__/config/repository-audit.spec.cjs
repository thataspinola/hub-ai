'use strict'
const test=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const path=require('node:path')
const {inspect,walk}=require('../../tools/audit-repository.cjs')
test('repository scripts and essential files resolve',()=>{
 const result=inspect()
 assert.deepEqual(result.errors,[])
})
test('audit identifies duplicated legacy skill names without deleting assets',()=>{
 const result=inspect()
 assert.ok(result.legacy.some(x=>x.name==='Legacy CLI'))
 assert.ok(Array.isArray(result.duplicates))
 assert.ok(walk().includes('tools/check-global-reviewer.cjs'))
})
