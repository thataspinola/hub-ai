# Estrutura e nomenclatura

| Pasta | Responsabilidade |
| --- | --- |
| resources/agents/ | Agentes reutilizáveis; um arquivo por papel |
| resources/skills/ | Skills reutilizáveis, uma pasta por skill |
| resources/templates/ | Modelos para gerar documentos do consumidor |
| profiles/ | Manifests que selecionam recursos por stack; sem cópias de recursos |
| scripts/ | Instalação, diagnóstico, validação e avaliação |
| tests/tooling/ | Testes das ferramentas do hub |
| examples/ | Aplicações de referência, com src/ e tests/ |
| evaluations/ | Cenários sintéticos, rubrica e resultados de reviewers |
| docs/ | Guias de operação, convenções e referências de origem |

Frontend e backend usam o mesmo `resources/agents/copilot-setup.agent.md`. O perfil seleciona skills, reviewer e templates; Copilot Setup identifica stack e escopo no código e confirma os recursos instalados pelo lock. Manter Node/NestJS e frameworks frontend em seus perfis, sem duplicar setup por tecnologia.

## Nomes

| Tipo | Padrão | Exemplo |
| --- | --- | --- |
| Pasta e arquivo comum | inglês, minúsculas, kebab-case | node-testing/, structure-and-naming.md |
| Agente | papel.agent.md | copilot-setup.agent.md |
| Template | escopo-documento.template.md | node-instructions.template.md |
| Skill | nome/SKILL.md; name igual à pasta | node-testing/SKILL.md |
| Teste JS das ferramentas | comportamento.test.js | install.test.js |
| Teste TS do exemplo Nest | comportamento.nivel.spec.ts | jobs.unit.spec.ts, jobs.integration.spec.ts, jobs.e2e.spec.ts |
| Configuração | nome convencional da ferramenta | package.json, tsconfig.build.json, jest.config.cjs |
| Resultado de avaliação | cenário.formato.extensão | node-review.raw.md, node-review.json |

Exceções com caixa alta: README.md, CHANGELOG.md, VERSION, SKILL.md e AGENTS.md. No consumidor, preservar `.github/copilot-instructions.md`, `.github/hub-ai-lock.json` e nomes exigidos pelo editor. A origem `resources/` não é copiada como subpasta para `.github`: recursos vão diretamente para `.github/agents`, `.github/skills` e `.github/templates`.

Não renomear fontes de aplicações consumidoras para impor estas convenções do hub. NestJS, Angular e demais projetos devem manter as convenções reais já adotadas. Não adicionar arquivos .py nem dependências Python.

## Atualizar instalação anterior

A versão 1.4.0 unifica os antigos Node Setup/Web Setup em Copilot Setup, corrige a skill `acessibility` para `accessibility` e renomeia templates. `--migrate` remove apenas arquivos antigos gerenciados e inalterados. Customizações bloqueiam remoção e devem ser revisadas/preservadas antes da migração.

```sh
node scripts/install.js /caminho/do/projeto --profile node --dry-run --overwrite --migrate
node scripts/install.js /caminho/do/projeto --profile node --overwrite --migrate
node scripts/doctor.js /caminho/do/projeto
```

Escolher angular/react/nextjs/vue quando for frontend. `frontend` permanece o perfil legado padrão do instalador; indicar o perfil em novos projetos. O instalador preserva AGENTS.md, instructions e o CI do consumidor. Sem --migrate, recursos antigos são mantidos e sinalizados pelo diagnóstico. Revise o preview antes de sobrescrever recursos.

Relatórios gerados pelos reviewers seguem kebab-case: `node-code-review.md`, `web-code-review.md` e `frontend-code-review.md`, ou o caminho explicitamente indicado pelo usuário.
