# Evidências locais — 2026-10-05

Exemplo Nest 11.2.7 / TypeScript 5.9.3 / Jest 30.5.2 / ts-jest 29.4.14 / Supertest 7.1.4, com lockfile reproduzido por `npm ci --ignore-scripts --no-audit --no-fund`.

| Check | Node 22.23.3 / Linux | Node 24.19.0 / Linux |
| --- | --- | --- |
| Typecheck | Passou | Passou |
| Build TypeScript | Passou | Passou |
| Smoke HTTP do artefato compilado | Passou | Passou |
| Unitários (3) | Passaram | Passaram |
| Integração local (4) | Passaram | Passaram |
| E2E HTTP local (11) | Passaram | Passaram |
| Cobertura de branches/functions/lines/statements | 100% no exemplo | 100% no exemplo |

Comandos na raiz do hub:

```sh
npm --prefix examples/nest-backend run test:automated
npm --prefix examples/nest-backend run test:cov
npm exec --yes --package=node@22 -- npm --prefix examples/nest-backend run test:automated
npm exec --yes --package=node@22 -- npm --prefix examples/nest-backend run test:cov
```

O runtime padrão desta execução foi Node 24.19.0; Node 22 foi selecionado explicitamente para a segunda execução. Em ambiente corporativo, usar o runtime provisionado/aprovado; os comandos npm exec acima registram a reprodução local e não orientam baixar ferramentas fora da VDI.

Os 21 testes de instalação/diagnóstico/validação do hub e os 8 testes do exemplo Node anterior também passaram. A instalação Node foi verificada com a referência NestJS presente; perfis Angular/React/Next.js/Vue/legado continuam passando.

Limites: estas evidências pertencem ao exemplo do hub. Não foram executados testes de uma aplicação Nest corporativa, banco real, OAuth/JWT real, mensageria/cloud, runner GitLab/Jenkins ou VDI. O repository é em memória e a identidade é substituída no E2E local. A cobertura alta de um exemplo pequeno não certifica segurança nem qualidade de outros projetos.
