# Diretrizes do painel Hub AI

## Escopo e preservação

Ler agent.md e as instruções mais específicas antes de alterar arquivos. Preservar o código novo da aplicação. Não editar .env/.npmrc, certificados ou configurações corporativas para contornar o ambiente. Não excluir arquivos para silenciar erro de lint/typecheck.

## Frontend real

A aplicação usa Next.js App Router, React, TypeScript, Tailwind, Radix UI e Zustand. Fontes em src/, testes da aplicação em `__tests__/`. Manter aliases @/\*, rotas, basePath, DTOs/tipos e fronteiras cliente/servidor existentes. Zustand/localStorage/IndexedDB devem permanecer em contextos client-safe. Tratar imports/exports de JSON de formulários, flags e recomendações como contratos; validar entradas e preservar dados existentes.

A autenticação existente usa NextAuth/Keycloak. Não registrar tokens, secrets ou dados pessoais nem presumir que a presença de uma sessão equivale a autorização. Não substituir a sessão, provider de flags, estrutura de formulários ou stores de recomendações pelo exemplo backend.

## Validação

Usar Jest e React Testing Library adotados pelo projeto. Verificar package.json e configurações antes de executar scripts. npm test/build da raiz pertencem à aplicação; registry e certificados corporativos podem exigir a VDI. Não trocar Jest por outro runner. A suíte Playwright autorizada fica em `__tests__/e2e`, com servidor localhost e bloqueio de rede externa. Não reduzir gates, criar scripts fictícios ou ocultar falhas.

As ferramentas compartilhadas estão em tooling/web-code-reviewer; recursos frontend em resources/frontend; configuração ativa do editor em .github. Backend Node/Nest e exemplos são mantidos no backend-code-reviewer. Não incluir ferramentas ou fixtures na suíte/build Next. Validar o toolkit separadamente com npm --prefix tooling/web-code-reviewer run check.

## Recursos do Copilot

Usar Copilot Setup e Web Code Reviewer da configuração instalada. Consultar .github/hub-ai-lock.json e todas as skills instaladas aplicáveis, compartilhadas e específicas do framework. Registrar lacunas. Verificar SOLID, Clean Code, duplicação, código morto, code smells e cobertura real de testes >=90% por métrica, sem confundir testes aprovados com cobertura. Preservar o agente frontend já existente. A pasta .github é formato do editor; não define o provedor da entrega.

## Entrega e evidências

Preservar config/ e o fluxo de entrega corporativo existente. Não executar deploy ou acessar Keycloak/AppConfig/serviços corporativos fora do ambiente autorizado. Reportar arquivos, comandos executados, resultados e pendências; não declarar funcionamento em produção ou no editor sem evidência.

## Separação de responsabilidades

Consultar docs/architecture.md antes de ampliar os módulos administrativos. Manter os componentes públicos como composição: editores de formulário em wizard-builder/properties, flags em portal-admin/feature-flag-crud e recomendações em portal-admin/recommendation-rules. Não misturar I/O do browser com regras de domínio.

Recomendações usam actions por capacidade, modelo de dados e contratos de persistência/preview; adapters concretos ficam em browser-adapters.ts. Preservar chaves, schemas e assinaturas públicas. Novas dependências de I/O devem ser injetáveis e testadas com falhas controladas. Não desativar regras de lint para evitar separação de responsabilidades.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Manutenção automatizada

Consultar docs/automation.md. Manter referência com npm run docs:generate e validar com npm run verify. Usar Conventional Commits; documentar incompatibilidades. Não editar referência gerada manualmente, sobrescrever hooks ou instalar hooks/alterar CI dos consumidores silenciosamente. CHANGELOG.md mantém notas editoriais; diário em reports/change-journal.md é regenerável.
