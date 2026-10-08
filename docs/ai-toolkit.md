# Recursos de IA integrados ao painel

A aplicação nova permanece em src/ e __tests__/. Sua infraestrutura, dependências e autenticação foram preservadas. O material React/Next.js do hub anterior saiu de codigo-a-ser-transcrito e está integrado na estrutura do projeto:

| Caminho | Papel |
| --- | --- |
| resources/frontend/agents | Origem do Copilot Setup e reviewers frontend |
| resources/frontend/skills | React, Next.js, qualidade, testes, segurança e referências frontend |
| resources/frontend/templates | Templates de configuração do frontend |
| resources/frontend/profiles | Seleção de recursos Next.js, React e frontend legado |
| .github/agents e .github/skills | Configurações ativas para este projeto Next.js |
| .github/copilot-instructions.md e AGENTS.md | Regras concretas do painel, sem placeholders |
| src/data/ai-resources.json | Catálogo JSON frontend com origem dos recursos |
| examples/nest-backend | Exemplo independente TypeScript/Nest preservado fora do toolkit |
| codigo-a-ser-transcrito | Backend Node e ferramentas compartilhadas |

O perfil do painel é nextjs, incluindo React para os componentes. Testes usam Jest/React Testing Library existentes; não migrar para Vitest/MSW automaticamente. As referências legado ficam na origem resources/frontend, sem impor suas regras ao frontend moderno.

Na raiz:

```sh
npm --prefix codigo-a-ser-transcrito run check
npm --prefix codigo-a-ser-transcrito run catalog:export
node codigo-a-ser-transcrito/scripts/install.js . --profile nextjs --dry-run
```

O código novo não foi excluído. TypeScript e Jest ignoram o toolkit e o exemplo Nest para evitar misturar os runtimes. O catálogo é uma interface de dados local; a página /code-reviewer agora consome o catálogo para filtros e orientações de instalação. O pipeline e as dependências corporativas permanecem sob o processo aprovado; validar aplicação/serviços reais na VDI.

Distribuição sem pipeline: consultar [Code Reviewer CLI](code-reviewer-cli.md).
