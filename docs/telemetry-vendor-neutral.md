# Analytics, monitoramento e observabilidade sem dependência de fornecedor

## Escopo

As skills de revisão avaliam **contratos e código existente**; não instalam agentes, SDKs, coletores ou dashboards. O projeto consumidor pode utilizar GTM/GA4, Adobe, Segment, Datadog, Grafana, Prometheus, CloudWatch, New Relic, OpenTelemetry ou nenhuma dessas ferramentas. Não presumir fornecedor nem substituir a instrumentação em produção.

- **Analytics/tagueamento:** nomes e schemas versionados, consentimento, payload, disparo correto, deduplicação, falhas não bloqueantes e testes.
- **Monitoramento:** sinais de saúde, disponibilidade, erros, latência, alertas, SLOs e runbooks, conforme requisitos da operação.
- **Observabilidade:** logs estruturados, métricas, tracing distribuído, correlação e propagação W3C quando aplicável.

## Arquitetura portável

Preferir contratos e adaptadores desacoplados dos SDKs: produtor → interface de eventos/telemetria → adaptador configurável → destino existente. OpenTelemetry e OTLP são opções abertas para instrumentação e exportação; Prometheus é um sistema de métricas, Grafana visualiza dados e Datadog é uma plataforma comercial. Nenhum deles é obrigatório para executar os reviewers. Diferenciar eventos de negócio de logs/traces operacionais.

## Critérios de revisão

1. Identificar o contrato e as dependências reais no repositório; consultar AGENTS e documentação do consumidor.
2. Verificar schema, propriedades, momento de emissão, ausência de duplicidade e idempotência em retries.
3. Proteger CPF, cookies, tokens, segredos e demais dados pessoais; minimizar dados, redigir logs e evitar labels de alta cardinalidade.
4. Validar propagação de trace/correlation IDs em HTTP, navegação e mensageria, respeitando limites de confiança.
5. Conferir métricas, sampling, tolerância a indisponibilidade do exporter e impacto de performance.
6. Exigir testes de contrato, redaction, falha de destino e deduplicação conforme stack real.
7. Registrar evidências e limites; sem ambiente real, não afirmar que o evento chegou ao destino ou que alertas funcionam.

## Onde estão as skills

- Frontend e hub-ai: `resources/frontend/skills/analytics-review/SKILL.md` e `resources/frontend/skills/observability-review/SKILL.md`.
- Backend: `resources/skills/analytics-review/SKILL.md` e `resources/skills/observability-review/SKILL.md`.

Os perfis de revisão distribuem essas orientações. As skills não criam, por si, instrumentação em aplicações consumidoras.

## Manutenção

Após alterar skills, perfis ou documentação, atualizar o índice gerado com `npm run docs:generate`, validar `npm run docs:check` e executar `npm run verify` em ambiente preparado. No frontend, regenerar também o catálogo com `npm run catalog:export`. Não editar `docs/generated/reference.md` manualmente.
