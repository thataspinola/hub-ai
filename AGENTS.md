# Hub AI — instruções para agentes

Este repositório é exclusivamente o painel administrativo Next.js/React. O Code Reviewer é **externo**, no repositório `thataspinola/code-reviewer-plug-and-play`, instalado uma vez no perfil pessoal do Copilot. Não criar, instalar ou copiar agentes, skills, perfis, templates, catálogos ou CLIs de revisão neste repositório.

## Código e arquitetura

Preservar contratos de autenticação NextAuth/Keycloak, rotas, basePath, sessão, feature flags, formulários dinâmicos, recomendações, configuração de entrega e CI/CD corporativo GitLab/Jenkins. Respeitar boundaries server/client, segurança, SOLID, Clean Code, acessibilidade e padrões existentes. Não alterar variáveis de ambiente, certificados, registry ou credenciais. Não acessar serviços corporativos fora da VDI.

## Validação

Usar os scripts reais do `package.json`: `npm run check:config`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build` e Playwright quando disponível. Testes do aplicativo usam Jest/React Testing Library; não migrar de runner por pressuposição. Não afirmar cobertura ou homologação sem evidência.

## Manutenção

Testes fora de `src`, em `__tests__`; seguir a nomenclatura do código existente. Atualizar README, documentos afetados, referência gerada (`npm run docs:generate`) e CHANGELOG. Conventional Commits para commits. Não adicionar ferramentas de revisão ao projeto. `npm run reviewer:doctor` é um check somente de leitura do perfil pessoal, não instala nem valida execução real do Copilot.
