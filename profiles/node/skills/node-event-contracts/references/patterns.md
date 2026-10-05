# Cenários de eventos

| Caso | Critério |
| --- | --- |
| Evento válido | Factory produtora aceita pelo schema consumidor |
| Campos extras | Política explícita de rejeição ou descarte |
| PutEvents parcial | Identificar e tratar somente entradas com falha |
| SQS lote misto | IDs das falhas e source mapping compatíveis |
| SNS falha | Sem resposta parcial SQS; retry coerente com invocação |
| Duplicata | Efeito idempotente ou risco documentado |

Não confundir TTL do DynamoDB com expiração OAuth: comparar o instante de validade no fluxo de decisão; remoção pelo TTL não é imediata. Validar margem de renovação, unidades de tempo e concorrência conforme o contrato do serviço.
