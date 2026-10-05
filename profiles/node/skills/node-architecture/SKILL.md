---
name: node-architecture
description: "Organizar e implementar backends Node.js, handlers, controllers, activities, factories, APIs e serviços. Usar ao criar ou alterar pacotes CommonJS/ESM, integrações e módulos compartilhados."
---

# node-architecture

1. Ler README, documentação e AGENTS.md da raiz até o diretório alterado. Identificar módulos, scripts, runtime e contratos reais.
2. Preservar CommonJS ou ESM existente; não migrar para TypeScript nem impor Express a uma Lambda sem servidor HTTP.
3. Manter handler como fronteira de transporte; controller como orquestração; activity como etapa; factory como transformação pura; API como HTTP/TLS; service como adaptador de infraestrutura; properties como configuração e schemas. Adaptar nomes à arquitetura real, sem criar camadas vazias.
4. Validar entrada externa antes de efeitos. Passar dependências explicitamente onde o projeto permitir, evitando ciclos e imports de pacotes consumidores em shared-modules.
5. Centralizar somente comportamento estável com consumidores comprovados. Não extrair regras de CPF, Dynamics, propostas comerciais ou consentimento só pela semelhança visual.
6. Atualizar contratos, testes, empacotamento e documentação junto com a mudança. Relatar caminhos alterados e checks executados.

Consultar [padrões e cenários](references/patterns.md) para adaptar a análise a um projeto concreto.
