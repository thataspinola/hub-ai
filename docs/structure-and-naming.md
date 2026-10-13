# Estrutura e nomenclatura

| Caminho | Responsabilidade |
| --- | --- |
| src/ | Painel Next.js, React e TypeScript |
| __tests__/ | Jest da aplicação |
| tests/ | Configuração e E2E local |
| tools/ | Entradas CLI, build e smoke |
| tooling/web-code-reviewer/ | Instalador, diagnóstico, validação e avaliação frontend |
| resources/frontend/ | Perfis, agentes, skills, templates e fixtures frontend |
| .github/ | Configuração instalada do editor |
| config/ e pom.xml | Entrega corporativa existente |
| docs/ | Uso, migração e evidências |

Recursos usam kebab-case: papel.agent.md, documento.template.md e nome/SKILL.md. README.md, AGENTS.md e VERSION mantêm nomes convencionais. Não renomear componentes/rotas da aplicação por associação com o padrão de recursos.

A antiga pasta codigo-a-ser-transcrito foi eliminada. Backend Node/Nest, exemplos e fixtures backend pertencem ao [backend-code-reviewer](https://github.com/thataspinola/backend-code-reviewer). O hub continua suportando Node como runtime de ferramentas e rotas de servidor Next.js.
