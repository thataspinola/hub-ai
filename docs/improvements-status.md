# Estado de melhorias

O painel preserva as funcionalidades de autenticação, feature flags, formulários e recomendações. Os recursos do antigo toolkit de revisão foram retirados e substituídos pelo consumo do [Code Reviewer Plug and Play](global-reviewer.md).

Validação necessária: `npm run check:config`, `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, `npm run build` e E2E no ambiente autorizado. Não declarar homologação completa sem executar essas verificações.
