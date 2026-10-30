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
| npm run verify | npm run docs:check && npm run check:local && npm --prefix tooling/web-code-reviewer run check |

## Guias e recursos

- [.github/agents/copilot-setup.agent.md](../../.github/agents/copilot-setup.agent.md)
- [.github/agents/frontend\_engineering\_expert.agent.md](../../.github/agents/frontend%5C_engineering%5C_expert.agent.md)
- [.github/agents/web-code-reviewer.agent.md](../../.github/agents/web-code-reviewer.agent.md)
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- [.github/skills/gitlab-delivery/SKILL.md](../../.github/skills/gitlab-delivery/SKILL.md)
- [.github/skills/nextjs-patterns/SKILL.md](../../.github/skills/nextjs-patterns/SKILL.md)
- [.github/skills/react-patterns/SKILL.md](../../.github/skills/react-patterns/SKILL.md)
- [.github/skills/security/SKILL.md](../../.github/skills/security/SKILL.md)
- [.github/skills/security/references/patterns.md](../../.github/skills/security/references/patterns.md)
- [.github/skills/web-quality/SKILL.md](../../.github/skills/web-quality/SKILL.md)
- [.github/skills/web-testing/SKILL.md](../../.github/skills/web-testing/SKILL.md)
- [.github/templates/agent.template.md](../../.github/templates/agent.template.md)
- [.github/templates/skill.template.md](../../.github/templates/skill.template.md)
- [.github/templates/web-agents.template.md](../../.github/templates/web-agents.template.md)
- [.github/templates/web-instructions.template.md](../../.github/templates/web-instructions.template.md)
- [AGENTS.md](../../AGENTS.md)
- [CHANGELOG.md](../../CHANGELOG.md)
- [README.md](../../README.md)
- [agent.md](../../agent.md)
- [docs/ai-toolkit.md](../../docs/ai-toolkit.md)
- [docs/architecture.md](../../docs/architecture.md)
- [docs/automation.md](../../docs/automation.md)
- [docs/code-review.md](../../docs/code-review.md)
- [docs/code-reviewer-cli.md](../../docs/code-reviewer-cli.md)
- [docs/copilot-setup.md](../../docs/copilot-setup.md)
- [docs/current-project.md](../../docs/current-project.md)
- [docs/improvements-status.md](../../docs/improvements-status.md)
- [docs/local-validation.md](../../docs/local-validation.md)
- [docs/reviewer-evaluation.md](../../docs/reviewer-evaluation.md)
- [docs/reviewer-migration.md](../../docs/reviewer-migration.md)
- [docs/structure-and-naming.md](../../docs/structure-and-naming.md)
- [docs/telemetry-vendor-neutral.md](../../docs/telemetry-vendor-neutral.md)
- [docs/validation-current.md](../../docs/validation-current.md)
- [resources/frontend/agents/copilot-setup.agent.md](../../resources/frontend/agents/copilot-setup.agent.md)
- [resources/frontend/agents/frontend-code-reviewer.agent.md](../../resources/frontend/agents/frontend-code-reviewer.agent.md)
- [resources/frontend/agents/web-code-reviewer.agent.md](../../resources/frontend/agents/web-code-reviewer.agent.md)
- [resources/frontend/skills/accessibility/SKILL.md](../../resources/frontend/skills/accessibility/SKILL.md)
- [resources/frontend/skills/accessibility/references/patterns.md](../../resources/frontend/skills/accessibility/references/patterns.md)
- [resources/frontend/skills/analytics-review/SKILL.md](../../resources/frontend/skills/analytics-review/SKILL.md)
- [resources/frontend/skills/angular-patterns/SKILL.md](../../resources/frontend/skills/angular-patterns/SKILL.md)
- [resources/frontend/skills/code-quality/SKILL.md](../../resources/frontend/skills/code-quality/SKILL.md)
- [resources/frontend/skills/code-quality/references/patterns.md](../../resources/frontend/skills/code-quality/references/patterns.md)
- [resources/frontend/skills/code-review/SKILL.md](../../resources/frontend/skills/code-review/SKILL.md)
- [resources/frontend/skills/code-review/references/patterns.md](../../resources/frontend/skills/code-review/references/patterns.md)
- [resources/frontend/skills/code-standards/SKILL.md](../../resources/frontend/skills/code-standards/SKILL.md)
- [resources/frontend/skills/code-standards/references/patterns.md](../../resources/frontend/skills/code-standards/references/patterns.md)
- [resources/frontend/skills/nextjs-patterns/SKILL.md](../../resources/frontend/skills/nextjs-patterns/SKILL.md)
- [resources/frontend/skills/observability-review/SKILL.md](../../resources/frontend/skills/observability-review/SKILL.md)
- [resources/frontend/skills/performance/SKILL.md](../../resources/frontend/skills/performance/SKILL.md)
- [resources/frontend/skills/performance/references/patterns.md](../../resources/frontend/skills/performance/references/patterns.md)
- [resources/frontend/skills/react-patterns/SKILL.md](../../resources/frontend/skills/react-patterns/SKILL.md)
- [resources/frontend/skills/security/SKILL.md](../../resources/frontend/skills/security/SKILL.md)
- [resources/frontend/skills/security/references/patterns.md](../../resources/frontend/skills/security/references/patterns.md)
- [resources/frontend/skills/unit-testing/SKILL.md](../../resources/frontend/skills/unit-testing/SKILL.md)
- [resources/frontend/skills/unit-testing/references/patterns.md](../../resources/frontend/skills/unit-testing/references/patterns.md)
- [resources/frontend/skills/vue-patterns/SKILL.md](../../resources/frontend/skills/vue-patterns/SKILL.md)
- [resources/frontend/skills/web-quality/SKILL.md](../../resources/frontend/skills/web-quality/SKILL.md)
- [resources/frontend/skills/web-testing/SKILL.md](../../resources/frontend/skills/web-testing/SKILL.md)
- [resources/frontend/templates/agent.template.md](../../resources/frontend/templates/agent.template.md)
- [resources/frontend/templates/frontend-agents.template.md](../../resources/frontend/templates/frontend-agents.template.md)
- [resources/frontend/templates/frontend-instructions.template.md](../../resources/frontend/templates/frontend-instructions.template.md)
- [resources/frontend/templates/skill.template.md](../../resources/frontend/templates/skill.template.md)
- [resources/frontend/templates/web-agents.template.md](../../resources/frontend/templates/web-agents.template.md)
- [resources/frontend/templates/web-instructions.template.md](../../resources/frontend/templates/web-instructions.template.md)
- [src/app/recommendations/README.md](../../src/app/recommendations/README.md)
- [src/lib/feature-flags/feature-flag.md](../../src/lib/feature-flags/feature-flag.md)
- [tooling/web-code-reviewer/CHANGELOG.md](../../tooling/web-code-reviewer/CHANGELOG.md)
- [tooling/web-code-reviewer/README.md](../../tooling/web-code-reviewer/README.md)
- [tooling/web-code-reviewer/docs/compatibility.md](../../tooling/web-code-reviewer/docs/compatibility.md)
- [tooling/web-code-reviewer/docs/gitlab.md](../../tooling/web-code-reviewer/docs/gitlab.md)
- [tooling/web-code-reviewer/docs/updating.md](../../tooling/web-code-reviewer/docs/updating.md)
- [tooling/web-code-reviewer/evaluations/README.md](../../tooling/web-code-reviewer/evaluations/README.md)
- [tooling/web-code-reviewer/resources/skills/gitlab-delivery/SKILL.md](../../tooling/web-code-reviewer/resources/skills/gitlab-delivery/SKILL.md)
- [tooling/web-code-reviewer/resources/skills/rdm-description/SKILL.md](../../tooling/web-code-reviewer/resources/skills/rdm-description/SKILL.md)
- [tooling/web-code-reviewer/resources/skills/rdm-description/assets/rdm-example.md](../../tooling/web-code-reviewer/resources/skills/rdm-description/assets/rdm-example.md)
- [tooling/web-code-reviewer/resources/skills/rdm-description/assets/rdm.template.md](../../tooling/web-code-reviewer/resources/skills/rdm-description/assets/rdm.template.md)
