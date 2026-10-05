---
name: node-e2e
description: "Criar e revisar testes E2E de backends Node.js, fluxos Lambda/EventBridge/SQS/SNS e integrações HTTP. Usar para validar jornadas completas, smoke tests e evidências de ambiente."
---

# Testes E2E Node

1. Ler documentação, AGENTS.md, contratos e scripts existentes. Definir início, fim, atores, efeitos e critério de aceite da jornada; não presumir navegador em backend.
2. Declarar modo: **local com mocks/emulador** ou **implantado com integrações reais**. Chamar o primeiro de E2E local; não tratá-lo como evidência AWS/OAuth/mTLS.
3. Usar runner e infraestrutura já adotados. Não instalar Playwright, SAM ou LocalStack só pelo nome E2E. Para UI real, adaptar ferramentas à interface e ao projeto.
4. Projetar fixtures sintéticas, recursos/clientes exclusivos e identificador de correlação. Não usar CPF real, credenciais, token ou PEM em fixtures, logs e relatórios.
5. Cobrir sucesso, entrada inválida sem efeito, duplicata/idempotência, falha transitória, falha permanente e DLQ/reprocessamento quando previstos no contrato.
6. Em fluxo assíncrono, aguardar por polling com prazo e intervalo limitados; consultar por correlação, não por “fila vazia”. Não consumir mensagens ou purgar filas compartilhadas para observar o teste.
7. Verificar efeitos de negócio e envelopes reais, não só status de invocação. Conferir source mapping, expiração, retries e alertas conforme o cenário. Validar mTLS real somente no ambiente autorizado.
8. Limpar apenas recursos criados pela execução, identificados por ownership/correlação, em finally/teardown. Registrar falha de limpeza sem ocultar falha principal; respeitar retenção auditável.
9. Para execução real, seguir runbook e autorização existente, VDI quando exigida e clientes aprovados em ambiente de teste. Não assumir que um pedido de gerar testes autoriza invocar serviços ou escrever dados em cloud.
10. Entregar cenário, arquivos, comando real, modo, ambiente, resultados sanitizados e limites. Se ambiente indisponível, preparar a suíte/runbook e marcar execução operacional pendente.

Consultar [matriz de jornadas](references/scenarios.md) e usar [plano de E2E](assets/e2e-plan.md) para registrar execução.

Para NestJS, seguir [cenários HTTP e ciclo da aplicação](../node-testing/references/nestjs.md). Manter pipes/guards/globals reais e declarar mocks de fronteiras; teste direto de controller não valida o caminho HTTP.
