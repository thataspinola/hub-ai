# Hub AI — painel administrativo

Aplicação @porto/react-ssr-corp-hubv-painel-administrativo. Stack declarada: Next.js ^16.2.2, React ^19, TypeScript, Tailwind ^4 e Zustand ^5. Fontes em src/, testes em `__tests__/`. Preservar os requisitos de Node e scripts da aplicação; o toolkit usa Node 22+ independentemente.

Ler AGENTS.md e agent.md. Priorizar o código e os contratos reais: App Router, server/client boundaries, NextAuth/Keycloak, feature flags via strategy localStorage/AppConfig, builder de formulários e recomendações com persistência local. Não impor arquitetura Nest/backend ao painel nem tratar exemplos como serviços reais.

Testes existentes usam Jest/React Testing Library. Scripts declarados na raiz: npm run dev, npm run build, npm test, npm run test:watch e npm run lint. Confirmar suporte/configuração antes de executar; script declarado não é evidência de execução. O lockfile corporativo da aplicação foi recuperado e deve ser preservado. A instalação usa configuração corporativa: não trocar registry nem alterar certificados para contornar acesso.

Recursos de frontend ficam em resources/frontend; recursos ativos em .github/agents, .github/skills e .github/templates. Copilot Setup é compartilhado; Web Code Reviewer revisa esta aplicação. O frontend_engineering_expert existente permanece preservado. Usar as skills instaladas Next/React, qualidade/testes web, segurança e entrega conforme o lock; não instalar runners diferentes apenas por orientação genérica.

tooling/web-code-reviewer contém as ferramentas frontend; fixtures e ferramentas estão excluídas da suíte/build Next. Validar o toolkit separadamente com npm --prefix tooling/web-code-reviewer run check. Catálogo de recursos disponível em src/data/ai-resources.json; regenerar com npm --prefix tooling/web-code-reviewer run catalog:export. Não remover dados existentes da aplicação.

Não inserir secrets, tokens, CPF real ou certificados em logs/fixtures. Não editar .env. Respeitar VDI e a infraestrutura/pipeline existente, sem deploy automático. Reportar validações realizadas e limites; mocks locais não comprovam Keycloak, AppConfig ou deploy.

Validação local autorizada: npm run check:local, npm run build e npm run test:e2e. E2E em `__tests__/e2e` usa fixtures locais e bloqueia hosts externos. O catálogo é apresentado na página /code-reviewer, sem enviar código a um modelo. Não declarar VDI, autenticação real ou deploy validados com base nesses checks.
