'use strict'
const test=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const os=require('node:os')
const path=require('node:path')
const {check}=require('../../tools/check-global-reviewer.cjs')
test('detects missing personal reviewer without changing workspace',t=>{
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'hub-global-'))
 t.after(()=>fs.rmSync(home,{recursive:true,force:true}))
 const result=check({home})
 assert.equal(result.ready,false)
 assert.equal(fs.readdirSync(home).length,0)
})
test('detects installed agent and both personal skill groups',t=>{
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'hub-global-'))
 t.after(()=>fs.rmSync(home,{recursive:true,force:true}))
 const agent=path.join(home,'.github','agents','code-reviewer.agent.md')
 const skills=path.join(home,'.copilot','skills')
 fs.mkdirSync(path.dirname(agent),{recursive:true})
 fs.writeFileSync(agent,'<!-- managed-by: code-reviewer-plug-and-play -->')
 for(const group of ['front','back']){
   const dir=path.join(skills,'code-reviewer-'+group+'-review')
   fs.mkdirSync(dir,{recursive:true})
   fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: example\n---')
 }
 assert.equal(check({home}).ready,true)
})
