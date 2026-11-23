# Diretrizes do painel

Este repositório contém a aplicação administrativa Next.js/React e o pacote Node independente app-skeleton, cada qual com recursos de execução e testes próprios. Revisão de código utiliza o agente pessoal independente `code-reviewer-plug-and-play` (repositório externo; URL corporativa definida na documentação).

Preservar autenticação NextAuth/Keycloak, rotas, basePath, APIs, feature flags, formulários, recomendações, stores, contratos e configuração corporativa. Seguir SOLID, Clean Code, acessibilidade e os padrões existentes. Não modificar segredos, certificados, registry ou integrações fora do ambiente corporativo autorizado. Preservar as alterações funcionais incorporadas do projeto original.

Executar, quando o ambiente permitir, `npm run check:config`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build` e E2E. Os testes existentes usam Jest e React Testing Library. Manter testes fora de `src`, em `__tests__`. Documentar alterações relevantes no README, guias e CHANGELOG, seguindo o Conventional Commits. Não afirmar validação sem evidências.

## App Skeleton

Ler app-skeleton/README.md e os AGENTS da camada antes de alterar o pacote. Manter o isolamento do Next.js: nenhum import do skeleton em src/, nenhuma substituição dos contratos/APIs do painel. Os comandos skeleton:* pertencem ao Node; verify:all executa as duas validações. Não ignorar falhas do pacote: validar com npm run skeleton:check. Templates com marcadores ficam em templates/ com extensão .js.template. Preservar .npmrc/credenciais e não acessar AWS nem serviços corporativos.

A geração de novos backends pertence ao CLI externo code-reviewer-plug-and-play (docs/global-reviewer.md). A pasta app-skeleton é referência testável; não reincorporar instalador/skills do reviewer ao painel. Mudanças da referência exigem atualização revisada do template e testes no CLI antes de afirmar compatibilidade com projetos gerados.
