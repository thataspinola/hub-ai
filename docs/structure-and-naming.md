# Estrutura e nomenclatura

| Caminho                                        | Responsabilidade                                        |
| ---------------------------------------------- | ------------------------------------------------------- |
| src/                                           | Painel Next.js, React e TypeScript                      |
| `__tests__/`                                   | Suíte Jest da aplicação                                 |
| `__tests__/config/`                            | Checks de configuração com node:test                    |
| `__tests__/e2e/`                               | Jornadas Playwright em quatro navegadores               |
| `tooling/web-code-reviewer/__tests__/tooling/` | Testes das ferramentas com node:test                    |
| tools/                                         | Entradas CLI, build e smoke                             |
| tooling/web-code-reviewer/                     | Instalador, diagnóstico, validação e avaliação frontend |
| resources/frontend/                            | Perfis, agentes, skills, templates e fixtures frontend  |
| .github/                                       | Configuração instalada do editor                        |
| config/                                        | Entrega corporativa existente                           |
| docs/                                          | Uso, migração e evidências                              |

Recursos usam kebab-case: papel.agent.md, documento.template.md e nome/SKILL.md. README.md, AGENTS.md e VERSION mantêm nomes convencionais. Não renomear componentes/rotas da aplicação por associação com o padrão de recursos.

Testes novos e realocados usam `.spec` com a extensão adequada ao runner. Testes Jest existentes `.test` continuam aceitos; não é necessário renomeá-los apenas por convenção. Cada runner tem escopo próprio: Jest exclui E2E/config/toolkit, Playwright usa **tests**/e2e e os scripts node:test selecionam seus diretórios explicitamente.
