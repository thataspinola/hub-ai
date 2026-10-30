# Copilot Setup deste projeto

O [Copilot Setup](../resources/frontend/agents/copilot-setup.agent.md) está ativo em .github/agents/copilot-setup.agent.md. As origens de agentes/skills/templates/perfis frontend ficam em resources/frontend, fora de tooling/web-code-reviewer.

O painel usa o perfil nextjs, com React, web-quality, web-testing, security e gitlab-delivery. Sua sessão NextAuth/Keycloak, flags, formulários e recomendações permanecem no código original. Instructions e AGENTS concretos foram gerados na raiz; não há placeholders pendentes.

Selecionar Copilot Setup e solicitar full setup, instructions, AGENTS, skills ou agent `<nome>`. O agente deve ler o projeto antes de alterar regras, preservar o agente frontend existente e usar o runner real (Jest/React Testing Library). APIs/BFFs e NestJS usam o backend-code-reviewer; rotas de servidor Next.js permanecem neste perfil.

Para atualizar recursos, na raiz:

```sh
node tooling/web-code-reviewer/scripts/install.js . --profile nextjs --dry-run
node tooling/web-code-reviewer/scripts/doctor.js .
```

O doctor informa arquivos não gerenciados, incluindo o frontend_engineering_expert existente. Essa referência é preservada; não apagá-la para deixar o diagnóstico vazio. Revisar preview/conflitos antes de sobrescrever customizações. Não instalar pipelines, ferramentas de testes ou integrações externas automaticamente. A descoberta/execução efetiva dos agentes deve ser validada no editor.
