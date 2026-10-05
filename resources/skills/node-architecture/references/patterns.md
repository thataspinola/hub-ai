# Padrões de arquitetura

| Fronteira | Responsabilidade | Evidência esperada |
| --- | --- | --- |
| Handler | Envelope e resposta/retry | Teste do transporte real |
| Controller/activity | Sequência e decisão | Teste de efeitos e falhas |
| Factory | Mapping puro | Entrada/saída sem infraestrutura |
| API/service | HTTP/TLS ou SDK | Request/response, timeout, erro |
| Shared | Contrato neutro estável | Consumidores e bundle verificados |

Uma aplicação pequena pode ser plana. Não introduzir controller/factory só para copiar uma estrutura grande. Para Dynamics, manter HTTP na API e mapping na factory quando a integração existir. Para propostas comerciais, avaliar idempotência da submissão. Para consentimento, preservar valor explícito, auditoria e regras de fallback do negócio.
