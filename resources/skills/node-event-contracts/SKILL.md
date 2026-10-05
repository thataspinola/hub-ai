---
name: node-event-contracts
description: "Criar ou revisar contratos assíncronos Node.js com EventBridge, SQS, SNS e Lambda. Usar para schemas, publicação, retries, DLQ, idempotência e falhas parciais."
---

# node-event-contracts

1. Mapear produtor, evento, schema, consumidor e efeitos. Distinguir entrada EventBridge, Records de SQS e Records.Sns de SNS; não pressupor que possuem o mesmo envelope.
2. Validar/normalizar na fronteira. Usar allowlist de campos publicados, identificadores e referências, sem valores sensíveis.
3. Testar o payload real produzido pela factory contra o schema real do consumidor. Alterações compatíveis e campos opcionais devem ter comportamento definido.
4. Inspecionar falhas parciais de publicação, além de exceções. Em EventBridge, tratar FailedEntryCount e Entries com ErrorCode e correlacionar entradas com falhas; sucesso HTTP não implica aceitação de todos os eventos.
5. Projetar duplicatas, ordem, concorrência e idempotência antes de repetir efeitos. Retry e DLQ devem concordar com Terraform e source mapping.
6. Para SQS, usar batchItemFailures somente quando ReportBatchItemFailures estiver habilitado; usar messageId das mensagens com falha. Para SNS, respeitar a semântica de retry da invocação e não reutilizar o formato SQS.
7. Testar envelope malformado, lote misto, duplicata, falha transitória e permanente, preservando rastreabilidade sem dados sensíveis.

Consultar [padrões e cenários](references/patterns.md) para adaptar a análise a um projeto concreto.
