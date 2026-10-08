---
name: node-security
description: "Revisar segurança de backend Node.js, OAuth, tokens, mTLS, secrets, logs, configuração e IAM. Usar para autenticação, integrações HTTP, armazenamento de tokens e fronteiras de confiança."
---

# node-security

1. Mapear origem, resolução, uso, persistência e expiração de credenciais/tokens. Diferenciar referência ao segredo de seu valor.
2. Transportar referências de segredo em eventos; resolver o valor na fronteira autorizada. Não colocar credenciais, CPF, passwords, PEM, headers de autenticação ou tokens em logs, fixtures, traces e tfvars.
3. Manter verificação TLS habilitada. Configurar CA, certificado cliente e chave quando o contrato exigir mTLS; não desabilitar verificação para resolver falhas.
4. Validar request/response, timeout e cancelamento; limitar retries a falhas transitórias e operações seguras. Não universalizar grant, header partner, path ou profundidade de pastas de Sensedia.
5. Validar duração/expiração e evitar renovar um token com um valor inválido. Confirmar consistência, concorrência e política de retenção do armazenamento.
6. Preservar cause internamente sem serializar erro bruto de Axios/AWS: pode conter request, resposta e segredo. Testar redaction inclusive em mensagens, campos aninhados e arrays.
7. Verificar IAM por ação/recurso e rede. Tratar grants legados como contratos específicos sujeitos a revisão, sem apresentá-los como padrão para novos serviços.
8. Reportar evidências sanitizadas e limitações; não acessar sistemas corporativos fora do ambiente autorizado.

Consultar [padrões e cenários](references/patterns.md) para adaptar a análise a um projeto concreto.
