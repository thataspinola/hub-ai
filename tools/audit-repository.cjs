#!/usr/bin/env node
'use strict'
const fs=require('node:fs')
const path=require('node:path')
const root=path.resolve(__dirname,'..')
const IGNORE=new Set(['node_modules','.git','.next','dist','coverage','playwright-report','test-results'])
function walk(dir=root){
 if(!fs.existsSync(dir))return []
 return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
   if(IGNORE.has(e.name))return []
   const full=path.join(dir,e.name)
   if(e.isSymbolicLink())return []
   return e.isDirectory()?walk(full):e.isFile()?[path.relative(root,full).replace(/\\/g,'/')]:[]
 })
}
function inspect(files=walk()){
 const errors=[],warnings=[]
 const fileSet=new Set(files)
 const required=['tools/check-global-reviewer.cjs','docs/global-reviewer.md','docs/generated/reference.md','README.md','AGENTS.md','CHANGELOG.md','package.json']
 for(const f of required)if(!fileSet.has(f))errors.push('Required file missing: '+f)
 const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
 for(const [name,cmd] of Object.entries(pkg.scripts||{})){
   for(const match of cmd.matchAll(/(?:node\s+)(tools\/[\w./-]+\.cjs)/g))if(!fileSet.has(match[1]))errors.push('Broken script '+name+': '+match[1])
 }
 for(const f of files.filter(f=>f.startsWith('docs/')&&f.endsWith('.md')&&!f.startsWith('docs/generated/'))){
   const content=fs.readFileSync(path.join(root,f),'utf8')
   for(const match of content.matchAll(/\]\((\.{1,2}\/[^)#?]+)(?:#[^)]*)?\)/g)){
     const dest=path.posix.normalize(path.posix.join(path.posix.dirname(f),decodeURIComponent(match[1])))
     if(!fileSet.has(dest)&&!files.some(x=>x.startsWith(dest+'/')))warnings.push('Potential broken link: '+f+' -> '+dest)
   }
 }
 const groups=[
   {name:'Legacy CLI',paths:['tools/code-reviewer.cjs','tooling/web-code-reviewer/scripts/install.js','tooling/web-code-reviewer/scripts/doctor.js']},
   {name:'Legacy editor assets',paths:['.github/agents/web-code-reviewer.agent.md','resources/frontend/agents/web-code-reviewer.agent.md']},
   {name:'Legacy evaluator',paths:['tools/evaluate-reviewer.cjs','tooling/web-code-reviewer/scripts/score-evaluation.js']}
 ]
 const legacy=groups.map(g=>({name:g.name,files:g.paths.filter(x=>fileSet.has(x))}))
 const duplicates=[]
 const roots=['resources/frontend/skills','.github/skills']
 const map=new Map()
 for(const prefix of roots)for(const f of files.filter(x=>x.startsWith(prefix+'/')&&x.endsWith('/SKILL.md'))){
   const name=path.posix.basename(path.posix.dirname(f))
   if(!map.has(name))map.set(name,[])
   map.get(name).push(f)
 }
 for(const [name,paths] of map)if(paths.length>1)duplicates.push({name,paths})
 return {errors,warnings,legacy,duplicates,files:files.length}
}
function main(){
 const result=inspect()
 console.log(JSON.stringify(result,null,2))
 if(result.errors.length)process.exitCode=1
}
if(require.main===module)main()
module.exports={walk,inspect}
