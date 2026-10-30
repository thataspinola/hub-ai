---
name: analytics-review
description: 'Revisar contratos de tagueamento e analytics sem exigir GTM, GA4, Adobe, Segment ou outro fornecedor.'
---

# Analytics e tagueamento independentes de fornecedor

Identificar o contrato real e o destino configurado; não presumir Google Analytics, GTM, Adobe Analytics, Segment ou dataLayer. Diferenciar evento de produto (ação de usuário) de evento operacional (logs/traces/métricas). Revisar esquema versionado, nome, origem, timestamp, propriedades, consentimento, ambiente e destino. Exigir tipos e campos obrigatórios conforme contrato do consumidor; não inventar nomes ou atributos. Preferir interface/adapter de eventos, com saída opcional para dataLayer, SDK ou HTTP, e testes de contrato sem rede.

Validar emissão no momento correto (exibição real, clique, sucesso, erro), deduplicação em re-render/StrictMode, navegação, retry e reprocessamento, sem suprimir eventos legítimos distintos. Verificar que falha de analytics não bloqueia a jornada e que o destino pode ser desabilitado. Em SSR e backend, evitar APIs de navegador; conferir idempotência e política de retry. Não enviar CPF, tokens, cookies, identificadores pessoais ou payloads de serviços sem necessidade/base legal; aplicar minimização e consentimento quando exigido.

Cobrir eventos positivos e negativos, ausência de disparo fora do escopo, propriedades omitidas quando indisponíveis, falha do adapter, e2e quando possível. Documentar lacunas como inconclusivas; não afirmar coleta real sem ambiente ou evidência de destino.