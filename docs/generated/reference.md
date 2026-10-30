<!-- Gerado por npm run docs:generate. Não editar manualmente. -->
# Referência de @porto/react-ssr-corp-hubv-painel-administrativo

Node: \>=20.12.2.

Este índice descreve comandos e documentos versionados; arquitetura e contratos continuam nos guias revisados pela equipe. Não é documentação inferida de APIs.

## Comandos

| Comando | Execução |
| --- | --- |
| npm run build | next build |
| npm run changelog | node tools/automation/cli.cjs changelog |
| npm run check:config | node --test \_\_tests\_\_/config/\*.spec.cjs |
| npm run check:local | npm run check:config && npm run lint && npm run typecheck && npm test -- --runInBand |
| npm run commits:check | node tools/automation/cli.cjs commits |
| npm run dev | next dev --turbopack |
| npm run docs:check | node tools/automation/cli.cjs docs --check |
| npm run docs:generate | node tools/automation/cli.cjs docs |
| npm run hooks:install | node tools/automation/cli.cjs hooks |
| npm run lint | eslint . --max-warnings=0 |
| npm run maintenance | npm run docs:generate && npm run changelog |
| npm run postbuild | node tools/postbuild.cjs |
| npm run release:plan | node tools/automation/cli.cjs release-plan |
| npm run reviewer:doctor | node tools/check-global-reviewer.cjs |
| npm run start | node dist/react-ssr-corp-hubv-painel-administrativo/standalone/server.js |
| npm run test | jest |
| npm run test:automation | node --test \_\_tests\_\_/config/automation.spec.cjs |
| npm run test:e2e | playwright test |
| npm run test:e2e:chrome | playwright test --project=chrome |
| npm run test:e2e:edge | playwright test --project=edge |
| npm run test:e2e:firefox | playwright test --project=firefox |
| npm run test:e2e:install | playwright install webkit firefox |
| npm run test:e2e:list | playwright test --list |
| npm run test:e2e:webkit | playwright test --project=webkit |
| npm run test:standalone | node tools/smoke-standalone.cjs |
| npm run test:watch | jest --watch |
| npm run typecheck | tsc --noEmit |
| npm run verify | npm run docs:check && npm run check:local |

## Guias e recursos

- [.github/agents/frontend\_engineering\_expert.agent.md](../../.github/agents/frontend_engineering_expert.agent.md)
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- [AGENTS.md](../../AGENTS.md)
- [CHANGELOG.md](../../CHANGELOG.md)
- [README.md](../../README.md)
- [agent.md](../../agent.md)
- [docs/ai-toolkit.md](../../docs/ai-toolkit.md)
- [docs/architecture.md](../../docs/architecture.md)
- [docs/automation.md](../../docs/automation.md)
- [docs/code-review.md](../../docs/code-review.md)
- [docs/current-project.md](../../docs/current-project.md)
- [docs/getting-started.md](../../docs/getting-started.md)
- [docs/global-reviewer.md](../../docs/global-reviewer.md)
- [docs/improvements-status.md](../../docs/improvements-status.md)
- [docs/local-validation.md](../../docs/local-validation.md)
- [docs/structure-and-naming.md](../../docs/structure-and-naming.md)
- [docs/telemetry-vendor-neutral.md](../../docs/telemetry-vendor-neutral.md)
- [docs/validation-current.md](../../docs/validation-current.md)
- [src/app/recommendations/README.md](../../src/app/recommendations/README.md)
- [src/lib/feature-flags/feature-flag.md](../../src/lib/feature-flags/feature-flag.md)
