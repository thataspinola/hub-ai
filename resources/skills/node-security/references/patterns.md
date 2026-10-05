# Cenários de segurança

| Cenário | Verificar |
| --- | --- |
| Evento de renovação | Referência ao segredo, sem Basic ou access_token |
| OAuth | Grant real, encoding, resposta obrigatória e expiração válida |
| mTLS | CA/cert/key corretos, verificação de peer e timeout |
| Falha HTTP | Erro público estável e causa interna não serializada |
| Persistência | Acesso mínimo, concorrência, retenção e expiração |
| Logs | Redaction em objetos, arrays e mensagens |

Usar valores sintéticos nos testes. Não copiar certificados, tokens ou configurações sensíveis do repositório de referência. Regras de CPF e consentimento dependem do domínio; minimização de dados vale em todas as fronteiras.
