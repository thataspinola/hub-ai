# Padrões Detalhados de Segurança

## Validação de Dados

### Validação de CPF

```typescript
export const isValidCpf = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, "");

  // Deve ter 11 dígitos
  if (digits.length !== 11) return false;

  // Não pode ser sequência repetida
  if (/^(\d)\1{10}$/.test(digits)) return false;

  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
};
```

### Validação de Email

```typescript
export const isValidEmail = (email: string): boolean => {
  // Regex RFC 5322 simplificada
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) return false;

  // Verificações adicionais
  if (email.length > 254) return false;
  const [local, domain] = email.split("@");
  if (local.length > 64) return false;

  return true;
};
```

### Validação de Telefone

```typescript
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");

  // Celular: 11 dígitos (DDD + 9 + 8 dígitos)
  // Fixo: 10 dígitos (DDD + 8 dígitos)
  if (digits.length < 10 || digits.length > 11) return false;

  // DDD válido (11-99)
  const ddd = parseInt(digits.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  // Celular deve começar com 9
  if (digits.length === 11 && digits[2] !== "9") return false;

  return true;
};
```

## Mascaramento de Dados

### Funções de Máscara

```typescript
// Mascarar CPF: 123.456.789-00 → 123.***.***-00
export const maskCpf = (cpf: string): string => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
};

// Mascarar Email: email@domain.com → e****@domain.com
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local[0]}****@${domain}`;
};

// Mascarar Telefone: (11) 99999-9999 → (11) 9****-****
export const maskPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return phone;
  return `(${digits.slice(0, 2)}) ${digits[2]}****-****`;
};
```

## Prevenção de Ataques

### XSS Prevention

```typescript
// ❌ Vulnerável
const UserComment = ({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
);

// ✅ Seguro - usar texto puro
const UserComment = ({ content }: { content: string }) => (
  <div>{content}</div>
);

// ✅ Se HTML for necessário, usar biblioteca de sanitização
import DOMPurify from 'dompurify';

const SafeHtml = ({ content }: { content: string }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: [],
      }),
    }}
  />
);
```

### CSRF Protection

```typescript
// O projeto usa cookies SameSite=Lax por padrão
// Para APIs críticas, adicionar token CSRF

// Backend deve validar:
// 1. Origin header
// 2. CSRF token em header customizado
// 3. Cookie de sessão

const securePost = async (url: string, data: unknown) => {
  const csrfToken = getCookie("csrf-token");

  return fetch(url, {
    method: "POST",
    credentials: "include", // Envia cookies
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "",
    },
    body: JSON.stringify(data),
  });
};
```

### Rate Limiting (Frontend)

```typescript
// Debounce para prevenir spam de requests
import { useDebounce } from '@/hooks/useDebounce';

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      searchApi(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
};

// Throttle para prevenir cliques múltiplos
const useThrottledCallback = (callback: () => void, delay: number) => {
  const lastCall = useRef(0);

  return useCallback(() => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback();
    }
  }, [callback, delay]);
};
```

## Gerenciamento de Tokens

### Token Storage Strategy

```typescript
// Hierarquia de segurança de storage:
// 1. HttpOnly Cookie (mais seguro, mas precisa de backend)
// 2. sessionStorage encriptado (atual do projeto)
// 3. localStorage (menos seguro, evitar para tokens)

// Para tokens de autenticação
const setAuthToken = (token: string) => {
  // Encripta antes de armazenar
  const encrypted = encrypt(token);
  sessionStorage.setItem("auth-token", encrypted);
};

const getAuthToken = (): string | null => {
  const encrypted = sessionStorage.getItem("auth-token");
  if (!encrypted) return null;

  try {
    return decrypt(encrypted);
  } catch {
    // Token corrompido, limpar
    sessionStorage.removeItem("auth-token");
    return null;
  }
};

// Limpar tokens no logout
const clearAuthData = () => {
  sessionStorage.removeItem("auth-token");
  sessionStorage.removeItem("lead-storage");

  // Limpar cookies não-HttpOnly
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
};
```

### Token Expiration

```typescript
interface TokenData {
  value: string;
  expiresAt: number;
}

const setTokenWithExpiry = (
  name: string,
  value: string,
  ttlMinutes: number,
) => {
  const data: TokenData = {
    value,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  };

  sessionStorage.setItem(name, encrypt(JSON.stringify(data)));
};

const getTokenWithExpiry = (name: string): string | null => {
  const encrypted = sessionStorage.getItem(name);
  if (!encrypted) return null;

  try {
    const data: TokenData = JSON.parse(decrypt(encrypted));

    if (Date.now() > data.expiresAt) {
      sessionStorage.removeItem(name);
      return null;
    }

    return data.value;
  } catch {
    sessionStorage.removeItem(name);
    return null;
  }
};
```

## Logging Seguro

### O que NÃO Logar

```typescript
// Lista de campos sensíveis
const SENSITIVE_FIELDS = [
  "cpf",
  "email",
  "phone",
  "cellPhone",
  "password",
  "token",
  "authToken",
  "sessionId",
  "creditCard",
  "cvv",
  "name",
  "socialName",
  "address",
];

// Sanitizar objeto antes de logar
const sanitizeForLog = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeForLog(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Uso
console.log("API Response:", sanitizeForLog(response));
```

## reCAPTCHA Enterprise v3

```typescript
// src/lib/recaptcha.ts
export async function recaptcha(action: string) {
  const enabled = env('NEXT_PUBLIC_ENABLERECAPTCHA') === 'true';
  if (!enabled || !window.grecaptcha?.enterprise) return '';
  return window.grecaptcha.enterprise.execute(RECAPTCHA_KEY, { action });
}

// Em services - headers obrigatórios
headers: {
  'X-Recaptcha-Token': recaptchaToken,
  'X-Recaptcha-Action': 'fetchPlate',
}
```

## Encrypt do Projeto

```typescript
// src/services/encryption - usa CryptoJS + AES-JS
import * as CryptoJS from "crypto-js";

export const encrypt = (value: string) =>
  CryptoJS.AES.encrypt(value, DEFAULT_ENCRYPTION_KEY).toString();
```

> ⚠️ A chave deve vir de env var, nunca hardcoded.

## Checklist de Segurança

### Antes de Deploy

- [ ] Todos os dados sensíveis estão encriptados no storage
- [ ] Headers de segurança configurados
- [ ] reCAPTCHA habilitado em produção
- [ ] Validação de input em todos os formulários
- [ ] Nenhum console.log com dados sensíveis
- [ ] Tokens têm expiração definida
- [ ] Cookies com flags Secure e SameSite
- [ ] CSP configurado (se aplicável)
- [ ] Dependências sem vulnerabilidades conhecidas (npm audit)
