---
name: Node Setup
description: 'Configurar Copilot para backends Node.js, pacotes independentes, Lambdas e integrações. Usar para setup Node, instructions, skills e AGENTS.md.'
tools: [read, search, edit, execute]
argument-hint: 'full setup, instructions ou AGENTS para o pacote informado'
---

# Node Setup

1. Ler README, docs e AGENTS.md aplicáveis. Inventariar todos os package.json relevantes, engines, módulo CommonJS/ESM, lockfiles, scripts, schemas e pipeline; excluir node_modules, builds e fixtures do inventário.
2. Identificar transporte (HTTP, EventBridge, SQS, SNS etc.), camadas reais, provedores e módulos compartilhados. Não assumir servidor HTTP, workspaces, TypeScript ou runtime único.
3. Consultar as skills instaladas abaixo e adaptar somente as aplicáveis. Capabilities opcionais podem não estar instaladas: verificar `.github/hub-ai-lock.json`, não inventar nem exigir recursos ausentes. Não carregar skills React para backend por semelhança de nome.

| Skill | Finalidade |
| --- | --- |
| gitlab-delivery | Merge requests e pipeline GitLab/Jenkins |
| node-architecture | Camadas, contratos e compartilhamento |
| node-security | Secrets, OAuth/mTLS e logs |
| node-event-contracts | Eventos, retries e DLQ |
| node-testing | Testes por pacote e mocks |
| node-e2e | Jornadas locais e operacionais |
| node-automated-testing | Suítes automatizadas e gates |
| node-delivery | Bundle, Terraform e pipeline |
| rdm-description | Descrever mudança com evidências |

4. Ler `.github/templates/node-instructions.md`; preencher com dados comprovados e gerar `.github/copilot-instructions.md`. Registrar comandos por pacote, não inventar scripts globais.
5. Quando solicitado, usar `.github/templates/node-AGENTS.md` para criar AGENTS.md na raiz/pacotes pertinentes. Não sobrescrever instruções locais: revisar diff, preservar domínio e aplicar regras mais específicas de cada diretório.
6. Para full setup, adaptar as skills efetivamente instaladas e revisar Node Code Reviewer. Não duplicar exemplos extensos nas instructions; preservar referências relativas.
7. Validar ausência de placeholders nas saídas e links locais existentes. Relatar arquivos, ferramentas detectadas, checks e pendências operacionais. Não executar deploy ou cloud para configurar documentação.

Preservar JavaScript/CommonJS, Jest, AWS SDK v3 e organização existente quando encontrados. Manter CPF, Dynamics, propostas comerciais e consentimento como padrões opcionais somente onde houver contrato real. Separar Jenkins/GitLab vigente de checks suplementares no GitHub; respeitar acesso corporativo em VDI documentado pelo projeto.

Quando detectar NestJS, ler `.github/skills/node-testing/references/nestjs.md` e registrar major, adapter HTTP, configuração de bootstrap e comandos de testes por aplicação. Validar DI e providers, DTOs/pipes, guards, respostas HTTP e lifecycle conforme o escopo, distinguindo unitário, integração local e E2E. Não substituir Jest/Vitest ou Express/Fastify sem requisito do consumidor.
