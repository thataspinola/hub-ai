# Estrutura e nomenclatura do projeto atual

| Caminho | Escopo |
| --- | --- |
| src/ | Aplicação Next.js/React nova, preservada |
| __tests__/ | Testes Jest da aplicação, preservados |
| resources/frontend/ | Agentes, skills, templates e perfis frontend extraídos do toolkit |
| .github/ | Configuração ativa do Copilot para este painel |
| docs/ | Documentação da integração frontend |
| src/data/ai-resources.json | Catálogo de recursos preparado para o frontend |
| examples/nest-backend/ | Exemplo independente TypeScript/Nest movido para fora do toolkit |
| codigo-a-ser-transcrito/ | Backend Node, exemplos JavaScript e ferramentas compartilhadas |
| config/, pom.xml | Infraestrutura nova existente, preservada |

Aplicar kebab-case aos arquivos de recursos novos: papel.agent.md, escopo-documento.template.md e nome/SKILL.md. README.md, CHANGELOG.md, VERSION, AGENTS.md e SKILL.md mantêm os nomes convencionais. Não renomear componentes/rotas/testes do código novo nem o agente frontend existente para impor o padrão dos recursos.

Não restam fontes .ts/.tsx ou perfis React/Next.js dentro de codigo-a-ser-transcrito. Ferramentas JS compartilhadas podem inspecionar stacks frontend para selecionar o perfil do consumidor. Recursos backend mantêm suporte Node/Nest sem converter o painel em servidor Nest.

A raiz da aplicação mantém seus scripts e dependências. O toolkit tem seu package.json e lockfile; o exemplo Nest também tem dependências próprias. TypeScript/Jest da aplicação excluem esses escopos. Perfis resolvem fontes apenas no toolkit e na árvore explícita resources/frontend; referências a caminhos externos arbitrários/symlinks são recusadas.

Para instalar/atualizar recursos do painel, usar o perfil nextjs e revisar o preview antes de substituir arquivos. --migrate remove somente recursos gerenciados antigos sem modificações locais. Não remover código novo, scripts corporativos ou agentes não gerenciados.
