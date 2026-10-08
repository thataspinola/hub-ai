---
name: security
description: "Revisar segurança frontend: XSS/CSRF, cookies, headers, minimização de dados, armazenamento e integração com backend. Usar ao tratar CPF, sessão, formulários, consentimento e reCAPTCHA."
---

# Segurança frontend

1. Ler contratos e separar fronteiras navegador/servidor antes de sugerir solução. Confirmar stack e controles existentes.
2. Minimizar dados: não persistir CPF, credenciais ou tokens no navegador por conveniência. localStorage e sessionStorage são acessíveis por JavaScript e XSS; criptografar com chave entregue ao cliente não remove esse risco.
3. Para sessão baseada em cookie, definir HttpOnly, Secure e SameSite no servidor conforme fluxo. JavaScript não define HttpOnly. Validar proteção CSRF e autorização no backend; SameSite isoladamente não comprova proteção completa.
4. Manter segredos e criptografia de servidor fora do bundle cliente. Não expor chaves via NEXT_PUBLIC_ nem importar módulo server-only em stores cliente. Para persistência no servidor, usar mecanismo autenticado e gestão de chaves/rotação/retensão conforme ambiente.
5. Usar rendering seguro do framework. Não tratar normalização de CPF/dígitos ou escaping de texto como sanitização universal de HTML. Se HTML for necessário, usar sanitizador adequado ao contexto e validar entradas também no servidor.
6. Revisar CSP, HSTS e frame policy conforme domínios, HTTPS e integrações reais; não copiar headers que inviabilizem recursos legítimos sem testar.
7. reCAPTCHA é controle complementar: validar token, action e política no servidor. Falha ou ausência do token em ação protegida deve seguir política explícita; não retornar vazio e considerar ação protegida.
8. Não logar dados pessoais ou erros brutos de transporte. Mascaramento pode reduzir exposição, mas preferir identificadores sem PII quando suficientes.
9. Para propostas e consentimento, testar submissão duplicada, autorização, valor explícito e auditoria sem expor dados do cliente.

Consultar [padrões por fronteira](references/patterns.md). Para OAuth/mTLS de backend Node, usar a skill node-security quando instalada.
