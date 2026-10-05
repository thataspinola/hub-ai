# Validação de testes em NestJS

Detectar `@nestjs/core`, `@nestjs/testing`, versão major, adapter HTTP (Express/Fastify), `nest-cli.json`, tsconfig, Jest/Vitest e scripts por aplicação. Nest continua no perfil `node`; não migrar framework nem runner para adequar ao exemplo do hub. Nest 11 e projetos legados podem usar Jest; versões/geradores mais novos podem usar Vitest. Confirmar o projeto real.

| Nível | Montagem | Evidência necessária |
| --- | --- | --- |
| Unitário | `Test.createTestingModule` com serviço alvo e providers substituídos por token real | Regra de negócio, retorno, erros e ausência de efeitos inválidos |
| Integração local | Módulo real com service/repository reais locais | DI, imports/exports, persistência local e isolamento entre casos |
| E2E HTTP local | AppModule real, `createNestApplication`, bootstrap compartilhado, `app.init` | Método/rota, DTO, pipes, guards, filtros/interceptors e efeitos de negócio |
| Artefato | Build existente + carregar/inicializar aplicação compilada | Imports de produção resolvidos; não prova deploy |
| Operacional | Aplicação implantada e dependências reais aprovadas | Banco, identidade, TLS e mensageria no ambiente autorizado |

## Módulos e mocks

- Usar `overrideProvider(Token).useValue(...)` antes de `compile()`, com o mesmo token usado no código (classe, símbolo ou string). Não simular serviços internos no E2E: substituir somente fronteiras externas declaradas.
- Mocks não devem esconder erros de import/export, circular dependencies ou lifecycle. Para request scope, usar `resolve`/contexto correto; `get` não resolve providers scoped.
- `compile()` instancia o módulo, mas não reproduz sozinho o ciclo HTTP nem globals de `main.ts`. Extrair uma função de configuração usada em bootstrap e E2E: prefixo, versionamento, pipes, filtros, interceptors e demais regras reais.
- Manter `APP_GUARD`, `APP_PIPE`, `APP_FILTER` e `APP_INTERCEPTOR` reais quando pertencem ao módulo. Se o projeto exigir override, documentar o que deixou de ser testado; overrides globais dependem de como o enhancer foi registrado.
- Preparar/resetar fixtures e mocks por caso. Fechar `app`/`TestingModule`, conexões, filas e timers no teardown. Não usar `forceExit` para ocultar handles abertos.

## HTTP e contratos

- Express: Supertest contra `app.getHttpServer()` após `app.init()`. Fastify: aguardar `app.getHttpAdapter().getInstance().ready()` e usar `inject()`; não trocar adapter para fazer o teste passar.
- Testar DTO inválido, campo desconhecido segundo a política existente, transformação esperada e entrada ausente. DTO precisa de classe runtime/decorators; interface TypeScript não carrega metadados para ValidationPipe. Não mudar política de rejeitar/remover campos sem contrato.
- Cobrir 2xx com corpo e estado persistido, 400 sem efeito, 401/403 quando houver autenticação/autorização, 404/409 conforme contrato e falha externa com resposta sanitizada. Testar autenticação mockada local separadamente da autenticação real.
- Teste direto de controller/service não passa pelos pipes/guards HTTP e não é E2E. Asserts somente de status ou `toBeDefined()` não demonstram a jornada.
- Para GraphQL/microservices/WebSockets, montar o transporte real do projeto. Supertest não valida consumer EventBridge/SQS/Kafka nem DLQ; manter cenários por transporte e correlação.

## Comandos e gates

Confirmar comandos reais de `test`, `test:unit`, `test:integration`, `test:e2e`, `test:cov`, `typecheck` e `build` antes de usá-los. Jest e ts-jest precisam de majors/peer dependencies compatíveis; preservar configuração de decorators, aliases e módulo. Não remover erro de compilação nem diminuir cobertura para obter resultado verde.

No hub, `examples/nest-backend` contém um exemplo TypeScript/Nest 11, Jest e Supertest com lockfile, suites separadas, cobertura e build. É referência local, não uma integração automática em outro repositório. Usa repository em memória e verificador de identidade substituído nos testes; não comprova banco, OAuth/JWT, AWS ou Jenkins. Não executar serviços corporativos fora da VDI.

Fontes oficiais: [Testing](https://docs.nestjs.com/fundamentals/testing), [Testing Nest 11](https://docs.nestjs.com/v11/fundamentals/testing) e [Validation Nest 11](https://docs.nestjs.com/v11/techniques/validation). Conferir documentação da major detectada.
