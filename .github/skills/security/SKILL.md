---
name: security
description: 'Revisar segurança frontend: XSS/CSRF, cookies, headers, minimização de dados, armazenamento e integração com backend. Usar ao tratar CPF, sessão, formulários, consentimento e reCAPTCHA.'
---

# Segurança frontend

1. Ler contratos e separar fronteiras navegador/servidor antes de sugerir solução. Confirmar stack e controles existentes.
2. Minimizar dados: não persistir CPF, credenciais ou tokens no navegador por conveniência. localStorage e sessionStorage são acessíveis por JavaScript e XSS; criptografar com chave entregue ao cliente não remove esse risco.
3. Para sessão baseada em cookie, definir HttpOnly, Secure e SameSite no servidor conforme fluxo. JavaScript não define HttpOnly. Validar proteção CSRF e autorização no backend; SameSite isoladamente não comprova proteção completa.
