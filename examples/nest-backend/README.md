# Exemplo executável de testes NestJS

Referência local para projetos Node que usam NestJS: TypeScript, Nest 11, Express, Jest, `@nestjs/testing` e Supertest. Não substituir a versão, adapter ou runner de aplicações consumidoras por estes. O código é didático; não é uma API pronta para produção.

```sh
npm ci --prefix examples/nest-backend --ignore-scripts --no-audit --no-fund
npm --prefix examples/nest-backend run test:unit
npm --prefix examples/nest-backend run test:integration
npm --prefix examples/nest-backend run test:e2e
npm --prefix examples/nest-backend run test:automated
npm --prefix examples/nest-backend run test:cov
```

`test:automated` executa typecheck, build, smoke HTTP do artefato compilado e todas as suites. `test:cov` falha abaixo dos gates globais: 80% branches e 90% functions/lines/statements. Relatório local em `coverage/lcov.info`; não reduzir gates para passar. O GitLab CI executa a suíte e a cobertura em Node 22/24.

| Suíte | Escopo | Substituições |
| --- | --- | --- |
| Unitária | Serviço e regras de criação/consulta | Repository mockado pelo token da classe |
| Integração | AppModule, DI, repository, persistência e bootstrap | Repository real em memória; identidade padrão nega acesso |
| E2E local HTTP | POST/GET, prefixo, guard, ValidationPipe, DTO, controller e serviço | Apenas verificador de identidade, com fixture sintética |

Os testes cobrem criação/consulta, duplicata sem substituição, DTO inválido/campo extra sem escrita, ausência de credencial, token inválido, indisponibilidade da identidade sem vazamento de detalhes e registro inexistente. Cada caso recebe um módulo e estado novos; teardown fecha a aplicação/módulo sem `forceExit`.

`configureApp` é compartilhado entre bootstrap e E2E. Testar `compile()` ou chamar controller diretamente não passa pelos globals HTTP. `TokenVerifier` padrão nega todos os tokens; o token sintético só é aceito pelo override de teste. Este exemplo não implementa OAuth/JWT real nem autorização por domínio. O repository em memória não garante atomicidade/distribuição e não substitui banco.

Não há AWS, banco externo, rede corporativa ou deploy nesta validação. Integrações reais devem ser validadas em ambiente aprovado, pela VDI quando exigida. Para Fastify, usar o adapter real, `ready()` e `inject()`; para mensageria, acrescentar cenários por transporte.

Ver [evidências de execução e limites](validation.md).
