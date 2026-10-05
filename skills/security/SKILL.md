---
name: security
description: "Segurança para aplicações frontend. Use para: encriptação, sanitização de dados, headers de segurança, storage seguro, proteção contra XSS/CSRF, reCAPTCHA. Keywords: segurança, security, encryption, criptografia, xss, csrf, sanitização, sanitize, cookie, storage."
---

# Security


> Referência reutilizável: confirme stack, versões, scripts e arquivos no projeto alvo antes de aplicar. Os caminhos e exemplos abaixo não comprovam uma implementação existente.

## Modo de Resposta

**Default**: vulnerabilidades encontradas em lista + 1 correção de exemplo. Só gerar implementação completa quando o usuário pedir.

## Quando Usar

- Implementar encriptação de dados sensíveis
- Configurar headers de segurança
- Sanitizar inputs de usuário
- Armazenar dados de forma segura
- Integrar proteção contra bots (reCAPTCHA)
- Prevenir vulnerabilidades XSS/CSRF

## Headers de Segurança

Exemplo de implementação de headers de segurança via middleware Next.js:

```typescript
// middleware.ts
const applySecurityHeaders = (response: NextResponse) => {
  // HSTS - Força HTTPS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  // Previne clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Previne MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
};
```

### Headers Recomendados

| Header                      | Valor                                 | Propósito                                    |
| --------------------------- | ------------------------------------- | -------------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Força HTTPS                                  |
| `X-Frame-Options`           | `DENY`                                | Previne clickjacking                         |
| `X-Content-Type-Options`    | `nosniff`                             | Previne MIME sniffing                        |
| `Content-Security-Policy`   | `configurável`                        | Previne XSS                                  |
| `X-XSS-Protection`          | não usar em código novo               | Header legado e inconsistente entre browsers |

Evite instruções que pareçam "seguras por padrão" quando dependem de segredo real. Se uma chave for obrigatória, documente a falha explícita e nunca ensine fallback inseguro.

## Encriptação de Dados

### Serviço de Encriptação no Servidor

Este exemplo usa segredo somente no servidor. Não importe este serviço em componentes cliente e não exponha a chave com `NEXT_PUBLIC_`. Para dados no navegador, priorize minimização e evite persistência de dados sensíveis; uma chave entregue ao cliente não protege contra XSS.

```typescript
// services/encryption/index.ts
import "server-only";
import * as CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required");
}

// Encriptar dados sensíveis
export const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
};

// Decriptar dados
export const decrypt = (encryptedValue: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

Encriptação no frontend, quando a gestão de chaves é adequada, pode reduzir exposição acidental em storage, mas não substitui controles de backend, rotação de segredo e política de retenção de dados.

### Dados que Devem Ser Encriptados

| Dado       | Encriptar?  | Motivo              |
| ---------- | ----------- | ------------------- |
| CPF        | ✅ Sim      | PII sensível        |
| Email      | ✅ Sim      | PII                 |
| Telefone   | ✅ Sim      | PII                 |
| Nome       | ✅ Sim      | PII                 |
| Session ID | ✅ Sim      | Identificador       |
| Tokens     | ✅ Sim      | Autenticação        |
| CEP        | ⚠️ Opcional | Baixo risco         |
| Placa      | ⚠️ Opcional | Depende do contexto |

## Storage Seguro

### Storage Encriptado para Zustand (pseudocódigo de contrato)

O trecho ilustra a interface de storage, não uma solução pronta para navegador. Não utilize o serviço com segredo de servidor acima neste storage cliente. Defina o modelo de ameaça e a gestão de chaves antes de implementar encrypt/decrypt.

```typescript
// stores/lead/storage.ts
import { encrypt, decrypt } from "@/services/encryption";
import type { StateStorage } from "zustand/middleware";

export const storage: StateStorage = {
  getItem: (name: string) => {
    const value = sessionStorage.getItem(name);
    if (!value) return null;

    try {
      return decrypt(value);
    } catch {
      // Se falhar decriptação, limpa storage corrompido
      sessionStorage.removeItem(name);
      return null;
    }
  },

  setItem: (name: string, value: string) => {
    const encrypted = encrypt(value);
    sessionStorage.setItem(name, encrypted);
  },

  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};
```

### Cookies Seguros

```typescript
// utils/cookies.ts
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
) => {
  const secure = process.env.NODE_ENV === "production";

  const cookieOptions = {
    path: "/",
    secure, // Apenas HTTPS em produção
    sameSite: "lax", // Proteção CSRF
    ...options,
  };

  document.cookie = `${name}=${encodeURIComponent(value)}; ${serializeOptions(cookieOptions)}`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};
```

## Sanitização de Input

### Padrões de Sanitização

```typescript
// utils/sanitize.ts

// Remove caracteres especiais (mantém apenas alfanuméricos)
export const removeSpecialCharacters = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\s]/g, "");
};

// Extrai apenas dígitos
export const onlyDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Sanitiza para prevenir XSS básico
export const sanitizeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

// Limita tamanho de input
export const truncate = (value: string, maxLength: number): string => {
  return value.slice(0, maxLength);
};
```

### Uso em Componentes

```typescript
// ✅ Sanitizar no onChange
<Input
  name="cpf"
  value={formatCpf(values.cpf)}
  maxLength={14}
  onChange={(e) => {
    const sanitized = onlyDigits(e.target.value);
    const truncated = truncate(sanitized, 11);
    setFieldValue('cpf', truncated);
  }}
/>

// ✅ Validar formato antes de submit
const validateCpf = (cpf: string): boolean => {
  const digits = onlyDigits(cpf);
  return digits.length === 11 && isValidCpfChecksum(digits);
};
```

## Proteção reCAPTCHA

### Configuração

```typescript
// lib/recaptcha.ts
const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const ENABLED = process.env.NEXT_PUBLIC_ENABLE_RECAPTCHA === "true";

export const recaptcha = async (action: string): Promise<string> => {
  if (!ENABLED || !window.grecaptcha) {
    return "";
  }

  try {
    return await window.grecaptcha.enterprise.execute(RECAPTCHA_KEY, {
      action,
    });
  } catch (error) {
    console.error("reCAPTCHA error:", error);
    return "";
  }
};
```

### Uso em Actions Críticas

```typescript
// ✅ Sempre usar em ações sensíveis
const executeProposal = async () => {
  const recaptchaToken = await recaptcha("createProposal");

  const result = await createProposal(data, recaptchaToken);
  // ...
};
```

## Anti-Padrões de Segurança

### ❌ Nunca Fazer

```typescript
// ❌ Expor dados sensíveis em logs
console.log('User data:', { cpf, email, phone });

// ❌ Usar dangerouslySetInnerHTML sem sanitização
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ Armazenar tokens em localStorage (prefira cookies HttpOnly definidos pelo servidor; sessionStorage também é acessível por XSS)
localStorage.setItem('auth-token', token);

// ❌ Construir queries com concatenação
const url = `/api/user?cpf=${cpf}`;

// ❌ Confiar em dados do cliente sem validação
const { isAdmin } = userInput;
if (isAdmin) grantAccess();
```

### ✅ Boas Práticas

```typescript
// ✅ Mascarar dados em logs
console.log('User:', { cpf: maskCpf(cpf), email: maskEmail(email) });

// ✅ Usar componentes React ao invés de innerHTML
<SafeContent content={userContent} />

// ✅ Usar sessionStorage ou cookies seguros
sessionStorage.setItem('session-data', encrypt(data));

// ✅ Usar URLSearchParams
const params = new URLSearchParams({ cpf });
const url = `/api/user?${params}`;

// ✅ Validar no backend, não confiar no cliente
await api.post('/validate-admin', { userId });
```

## Referências

- [Padrões detalhados de segurança](./references/patterns.md)

