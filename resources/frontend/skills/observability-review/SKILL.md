---
name: observability-review
description: 'Revisar logs, métricas, tracing, SLOs e alertas sem acoplar a Datadog, Grafana, Prometheus ou nuvem.'
---

# Observabilidade independente de fornecedor

Descobrir a instrumentação real; não presumir Datadog, Grafana, Prometheus, CloudWatch, New Relic ou OpenTelemetry instalado. Avaliar logs estruturados, níveis, contexto e redaction; métricas de latência, taxa de erros, volume e saturação; traces com propagação W3C traceparent/tracestate e correlação entre frontend, APIs e mensageria quando aplicável. OpenTelemetry é uma opção aberta de instrumentação e OTLP é um protocolo de exportação; não exigir implantação nem exporter específico para revisar.

Verificar instrumentação opcional, falha aberta do exporter sem bloquear negócio, sampling, custo, retenção, cardinalidade limitada (nunca CPF, token, URL com segredo como label), fronteiras de confiança e CORS/propagação segura. Em frontend, conferir Web Vitals, erros de runtime, recursos e navegação sem capturar PII. Em backend, conferir HTTP, dependências, filas, retry, DLQ, timeout, readiness/liveness, métricas RED e correlação entre mensagens. Verificar alertas ligados a SLO/runbook com limiares definidos pela operação, não inventados.

Cobrir testes de redaction, ausência de segredos, propagação de contexto, degradação do coletor e ausência de duplicação. Separar instrumentação no código de coleta e visualização externas. Revisão estática não comprova telemetria recebida ou alertas funcionando.