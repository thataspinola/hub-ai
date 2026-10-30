# Hub AI — instruções de desenvolvimento

Este repositório contém apenas a aplicação administrativa Next.js/React e seus recursos de execução, testes e entrega. Revisão de código utiliza o agente pessoal independente `thataspinola/code-reviewer-plug-and-play`. Não instalar nem copiar skills, agentes, catálogos ou CLIs de revisão neste projeto.

Preservar autenticação NextAuth/Keycloak, rotas, basePath, APIs, feature flags, formulários, recomendações, stores, contratos e configuração corporativa. Seguir SOLID, Clean Code, acessibilidade e os padrões existentes. Não modificar segredos, certificados, registry ou integrações fora da VDI.

Executar, quando o ambiente permitir, `npm run check:config`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build` e E2E. Os testes existentes usam Jest e React Testing Library. Manter testes fora de `src`, em `__tests__`. Documentar alterações relevantes no README, guias e CHANGELOG, seguindo Conventional Commits. Não afirmar validação sem evidência.
