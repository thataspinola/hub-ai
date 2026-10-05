---
name: Web Setup
description: 'Configurar instruções para Angular, React, Next.js ou Vue em projetos GitLab. Usar para full setup, instructions e AGENTS.md web.'
tools: [read, search, edit, execute]
---

# Web Setup

1. Ler `.github/hub-ai-lock.json` para o perfil/skills instalados. A pasta .github é formato de customização do editor Copilot, não provedor de Git/CI. Ler AGENTS.md, docs e manifests do projeto.
2. Detectar framework/versão, workspaces, runtime, bundler, router, runner, lockfile e scripts. Conferir que o perfil corresponde ao código. Projeto misto precisa de regras por aplicação; não aplicar um framework a tudo.
3. Ler somente as skills instaladas deste catálogo:

| Skill | Finalidade |
| --- | --- |
| web-quality | Qualidade e comandos reais |
| web-testing | Unit/componentes, automatizados e E2E |
| security | Fronteiras navegador/servidor |
| gitlab-delivery | Merge requests, GitLab CI e Jenkins |
| angular-patterns | Angular e DI/reatividade |
| react-patterns | React e hooks/estado |
| nextjs-patterns | Next.js, router e server/client |
| vue-patterns | Vue e contratos/reatividade |

4. Preencher `.github/templates/web-instructions.md` e gerar `.github/copilot-instructions.md`. Quando solicitado, usar `.github/templates/web-AGENTS.md` para regras por aplicação. Preservar regras locais, sem sobrescrita cega.
5. Validar placeholders/links e reportar comandos, arquivos, validações e pendências. Não executar deploy nem instalar ferramentas só para preencher documentação.
