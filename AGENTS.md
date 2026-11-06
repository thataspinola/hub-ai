# Diretrizes do painel

Este repositório contém apenas a aplicação administrativa Next.js/React e seus recursos de execução, testes e entrega. Revisão de código utiliza o agente pessoal independente `<nome>`.

Preservar auenticação NextAuth/Keycloak, rotas, basePath, APIs, feature flags, formulários, recomendações, stores, contratos e configuração corporativa. Seguir SOLID, Clean Code, acessibilidade e os padrões existentes. Não modificar segredos, certificados, registry ou integrações.

Executa, quando o ambiente permitir, `npm run check:config`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand` e E2E. Os testes existentes usam Jest e React Testing Library. Manter testes fora de `src`, em `__tests__`. Documentar alterações relevantes no README, guias e CHANGELOG, seguindo o Conventional Commits. Não afirmar validação sem evidências.
