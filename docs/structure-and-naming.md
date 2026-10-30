# Estrutura e nomenclatura

- `src/app`: rotas Next.js e handlers de API
- `src/components`: componentes de UI do painel
- `src/lib`: serviços, contratos, stores e persistência
- `src/types`: contratos TypeScript
- `__tests__`: testes Jest, integração e Playwright
- `tools`: automação de documentação, pós-build, smoke e doctor somente de leitura
- `docs`: guias de arquitetura, operação, validação e referência gerada

O reviewer é externo: [code-reviewer-plug-and-play](global-reviewer.md). Não recriar `resources/frontend`, `tooling/web-code-reviewer` nem catálogos/skills instaláveis no consumidor.
