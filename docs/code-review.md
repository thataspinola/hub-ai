# Revisão do painel

Usar o Web Code Reviewer ativo em .github/agents/web-code-reviewer.agent.md para revisar Next.js/React e os recursos instalados. O agente considera diff/base reais, arquivos completos, fronteiras server/client, contratos, segurança e testes existentes; gera web-code-review.md ou o caminho indicado pelo usuário.

Fontes de recursos frontend ficam em resources/frontend. O reviewer legado de React/Next existe apenas como referência nessa árvore; ele não foi instalado sobre o reviewer atual. Node Code Reviewer permanece no toolkit backend para outros consumidores Node/Nest, sem impor arquitetura backend ao painel.

Preservar código novo e agents/instructions locais. Não executar deploy, acessar serviços corporativos ou instalar dependências apenas para produzir relatório. Separar resultados locais de validação real na VDI; não aprovar comportamento de produção com base em mocks.
