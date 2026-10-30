#!/usr/bin/env node
'use strict'
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
function check(options = {}) {
 const home = options.home || os.homedir()
 const agent = path.join(options.agentDir || path.join(home,'.github','agents'),'code-reviewer.agent.md')
 const skills = options.skillDir || path.join(home,'.copilot','skills')
 const errors=[]
 if(!fs.existsSync(agent)) errors.push('Agente pessoal ausente: '+agent)
 else {
   const content=fs.readFileSync(agent,'utf8')
   if(!content.includes('managed-by: code-reviewer-plug-and-play')) errors.push('Agente não gerenciado pelo code-reviewer-plug-and-play: '+agent)
 }
 for(const group of ['front','back']){
   const names=fs.existsSync(skills)?fs.readdirSync(skills).filter(x=>x.startsWith('code-reviewer-'+group+'-')&&fs.existsSync(path.join(skills,x,'SKILL.md'))):[]
   if(!names.length) errors.push('Skills pessoais '+group+' ausentes em '+skills)
 }
 return {ready:errors.length===0,agent,skills,errors}
}
function main(args){
 const options={}
 for(let i=0;i<args.length;i++){
   if(args[i]==='--agent-dir'&&args[i+1])options.agentDir=path.resolve(args[++i])
   else if(args[i]==='--skill-dir'&&args[i+1])options.skillDir=path.resolve(args[++i])
   else throw Error('Opção inválida: '+args[i])
 }
 const result=check(options)
 console.log(JSON.stringify(result,null,2))
 if(!result.ready)process.exitCode=1
}
if(require.main===module){try{main(process.argv.slice(2))}catch(e){console.error(e.message);process.exitCode=1}}
module.exports={check}
