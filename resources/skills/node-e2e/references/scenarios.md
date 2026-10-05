# Matriz de jornadas E2E

| Jornada | Início → fim | Evidência |
| --- | --- | --- |
| Renovação de token | Evento de elegibilidade → geração → persistência | Correlação, validade e metadados; nunca token |
| Falha de geração | Request inválido/falha controlada → DLQ → consumidor/alerta | IDs da mensagem, retry e alerta sanitizado |
| Falha de credencial | SNS → Lambda → EventBridge | Campos allowlisted e roteamento |
| Duplicata | Mesmo identificador recebido novamente | Efeito idempotente ou comportamento contratual |

No modo local, exercitar envelopes e adaptadores simulados, sem afirmar que IAM, rede ou roteamento implantado funcionam. No modo real, verificar provisionamento e acesso antes da execução. Não provocar incidentes em endpoints de produção para obter uma falha.

Para polling, definir deadline, intervalo e timeout de cada chamada. Registrar último estado sanitizado ao expirar. Evitar retries ilimitados e sleeps arbitrários. Para teardown, usar IDs dos recursos da execução, não prefixos genéricos de ambiente.
