# Padrões por fronteira

| Fronteira | Prática | Teste |
| --- | --- | --- |
| Navegador | Estado mínimo em memória; persistir só preferências não sensíveis quando necessário | Storage não contém token, CPF ou credencial |
| Sessão | Cookie definido no servidor com HttpOnly/Secure/SameSite adequados | Flags, expiração, autorização e fluxo cross-site |
| HTML | Renderizar como texto por padrão; sanitizar HTML se permitido pelo produto | Payload XSS e contexto de saída |
| Backend | Validar entrada e autorização antes de efeitos | Usuário sem permissão, entrada inválida e replay |
| Criptografia no servidor | Mecanismo autenticado e chaves fora do cliente | Tamper detection, chave ausente e rotação |
| reCAPTCHA | Verificação no servidor e política de falha explícita | Token ausente/inválido/action divergente |

CPF: normalizar e validar apenas quando o domínio exigir. Não enviar dados pessoais em query string só porque URLSearchParams está disponível: encoding não impede exposição em logs/histórico. Dynamics e propostas comerciais devem ter autorização e privacidade próprias. Consentimento requer regra de negócio explícita, não valor presumido.

Não ensinar criptografia cliente como proteção contra XSS nem cookie escrito por document.cookie como sessão HttpOnly. Não copiar segredos para fixtures.

O exemplo Node executável no hub (`examples/node-backend/README.md`) inclui teste de criptografia autenticada somente no servidor, com chave sintética. Ele demonstra o mecanismo, não substitui KMS, rotação, controles de acesso ou avaliação de produção.
