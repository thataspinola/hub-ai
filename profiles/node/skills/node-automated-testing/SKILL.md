---
name: node-automated-testing
description: "Criar e organizar suítes automatizadas Node.js e gates de CI por pacote. Usar para testes automated, regressão, contratos, matriz de execução e relatórios automatizados."
---

# Testes automatizados Node

1. Inventariar package.json, scripts e configuração de runner por pacote; ler testes existentes e contratos. “Automatizado” descreve execução, não um nível de teste: declarar escopo de cada suíte.
2. Usar unit/integration/functional/contract/E2E conforme comportamento. Reservar automated para verificações executáveis de invariantes, contratos públicos, schemas, configuração e compatibilidade entre pacotes quando esse padrão já existir.
3. Validar comportamento e riscos reais, evitando snapshot de estrutura que apenas espelha a implementação. Exercitar exports consumidos, produtores contra schemas, entradas inválidas e falhas parciais relevantes.
4. Manter suites determinísticas: relógio controlado, fixtures sintéticas, isolamento de mocks, dependências explícitas e concorrência segura. Evitar dependência da ordem, horário real ou rede externa em checks locais.
5. Adicionar script test:automated somente se a pasta/configuração e runner existirem. Separar test:e2e local de comando para ambiente real; não ligar cloud por variável implícita em npm test.
6. Montar matriz por pacote e por consumidores de shared-modules. Rodar comandos reais do projeto; não inventar workspaces, lint ou typing. Manter gates existentes de cobertura, sem reduzir limiar para passar.
7. Integrar checks locais no pipeline já adotado. Manter Jenkins/GitLab como entrega quando vigente, GitHub como suplementar; execução operacional precisa da infraestrutura/autorização documentada.
8. Preservar exit code não zero e relatórios sanitizados. Não usar continue-on-error para mascarar regressão. Para flakiness, investigar causa; retries não substituem correção. Registrar skips com motivo e responsável.
9. Verificar dependências no bundle de produção além da instalação de desenvolvimento. Classificar relatórios: executado/passou, falhou, preparado/não executado e pendência operacional.

Consultar [matriz de automação](references/matrix.md) e usar [plano de automação](assets/automation-plan.md) para adaptar gates e evidências.
