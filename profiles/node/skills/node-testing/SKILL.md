---
name: node-testing
description: "Criar e executar testes backend Node.js por pacote, Jest ou runner real do projeto, mocks AWS/HTTP e contratos entre serviços. Usar para testes unitários, integração, funcionais, E2E e cobertura."
---

# node-testing

1. Descobrir package.json por pacote, lockfiles, test runner e configuração. Não presumir package.json na raiz, workspaces, Vitest ou scripts de lint/typecheck.
2. Ler scripts antes de executar. Instalar com o gerenciador/lockfile real; registry corporativo requer ambiente autorizado. Não trocar registry por conveniência sem verificar dependências privadas.
3. Priorizar testes de comportamento: validação antes de efeitos, contratos, expiração, timeout/cancelamento, retries, redaction e falhas parciais.
4. Mocks AWS SDK v3 devem expor os símbolos realmente importados (Client, Command, send); mocks HTTP devem reproduzir resposta e erro usados pelo consumidor.
5. Separar testes com mocks de integração real. Um teste chamado E2E com mocks não comprova AWS, TLS, OAuth nem deploy.
6. Rodar scripts disponíveis nos pacotes afetados e nos consumidores do módulo compartilhado. Usar gates de cobertura existentes sem reduzir limiares para passar.
7. Verificar bundle de produção e resolução de imports além dos testes de desenvolvimento. Relatar comando, diretório, resultado e checks não executados com motivo.

Consultar [padrões e cenários](references/patterns.md) para adaptar a análise a um projeto concreto.
