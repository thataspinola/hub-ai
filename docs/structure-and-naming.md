# Estrutura e nomenclatura

| Caminho                    | Responsabilidade                                        |
| -------------------------- | ------------------------------------------------------- |
| src/                       | Painel Next.js, React e TypeScript                      |
| `__tests__/`               | Suíte Jest da aplicação                                 |
| `__tests__/config/`        | Checks de configuração com node:test                    |
| `__tests__/e2e/`           | Jornadas Playwright em quatro navegadores                |
| `tooling/web-code-reviewer/__tests__/tooling/` | Testes das ferramentas com node:test |
| tools/                     | Entradas CLI, build e smoke                             |
| tooling/web-code-reviewer/ | Instalador, diagnóstico, validação e avaliação frontend |
| resources/frontend/        | Perfis, agentes, skills, templates e fixtures frontend  |
| .github/                   | Configuração instalada do editor                        |
| config/          | Entrega corporativa existente                           |
| docs/                      | Uso, migração e evidências                              |

Recursos usam kebab-case: papel.agent.md, documento.template.md e nome/SKILL.md. README.md, AGENTS.md e VERSION mantêm nomes convencionais. Não renomear componentes/rotas da aplicação por associação com o padrão de recursos.

A antiga pasta codigo-a-ser-transcrito foi eliminada. Backend Node/Nest, exemplos e fixtures backend pertencem ao [backend-code-reviewer](https://github.com/thataspinola/backend-code-reviewer). O hub continua suportando Node como runtime de ferramentas e rotas de servidor Next.js.

Testes novos e realocados usam `.spec` com a extensão adequada ao runner. Testes Jest existentes `.test` continuam aceitos; não é necessário renomeá-los apenas por convenção. Cada runner tem escopo próprio: Jest exclui E2E/config/toolkit, Playwright usa __tests__/e2e e os scripts node:test selecionam seus diretórios explicitamente.
