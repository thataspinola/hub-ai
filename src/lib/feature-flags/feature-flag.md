# Feature Flags - Definições e Guia de Uso

## O que são Feature Flags?

Feature Flags (também chamads de _feature toggles_) são uma técnica de engenharia de software que permite **ativar ou desativar funcionalidades** em tempo de execução, sem necessidade de deploy. Elas desacoplam o lançamento de uma feature do deploy do código.

---

## Por que usar Feature Flags?

| Benefício           | Descrição                                                    |
| ------------------- | ------------------------------------------------------------ |
| **Deploys seguros** | Código pode ser deployed sem expor a feature ao usuário      |
| **Rellout gradual** | Lançar para 5%, 10%, 50% dos usuários progressivamente       |
| **Testes A/B**      | Comparar variantes de uma feature com métricas               |
| **Kill switch**     | Desligar imediatamente uma feature problemática sem rollback |
| **Personalização**  | Configurar comportamento diferente por segmento de usuário   |

---

## Tipos de Feature Flags

### 1. Flag Booleana (`BooleanFlag`)

A forma mais simples: **ligado ou desligado**.

**Quando usar:**

- Esconder/mostrar uma functionalidade inteira
- Modo de manutenção
- Kill switches de emergência

**Exemplo:**

```tsx
// Server-side (RSC)
import { isEnabled } from '@/lib/feature-flags/server'

export default async function Page() {
  const showNewCheckout = await isEnabled('new_checkout_v2')
  return showNewCheckout ? <NewCheckout /> : <LegacyCheckout />
}

// Client-side (hook)
import { useIsEnabled } from '@/lib/feature-flags/client'

function MyComponent() {
  const showNewCheckout = useIsEnabled('new_checkout_v2')
  return showNewCheckout ? <NewCheckout /> : <LegacyCheckout />
}
```

**Campos:**

| Campo         | Tipo      | Descrição                        |
| ------------- | --------- | -------------------------------- |
| `key`         | `string`  | Identificador único (snake case) |
| `name`        | `string`  | Nome legível                     |
| `description` | `string`  | Propósito da flag                |
| `enabled`     | `boolean` | Estado atual                     |
| `owner`       | `string`  | Equipe responsável               |

---

### 2. Flag Multivariante (`MultivariantFlag`)

Retorna **valores dinâmicos** ao invés de apenas true/false. O valor pode ser `string`, `number` ou `JSON`.

**Quando usar:**

- Testes A/B com múltiplas variantes
- Configuração de limites (rate limit, max items)
- Temas ou modos visuais (dar/light/auto)
- Configurações numéricas ajustáveis

**Exemplo:**

```tsx
// Server-side (RSC)
import { getFlagValue } from '@/lib/feature-flags/server'

export default async function Page() {
  const theme = await getFlagValue<string>('ui_dark_mode', 'disabled')
  const rateLimit = await getFlagValue<number>('rate_limit', 100)

  return <App theme={theme} rateLimit={rateLimit} />
}

//Client-side (Hook)
import { useFlagValue } from '@/lib/feature-flags/server'

function MyComponent() {
  const theme = useFlagValue<string>('ui_datk_mode', 'disabled')
  const rateLimit = useFlagValue<number>('rate_limit', 100)

  return <Config theme={theme} limit={rateLimit} />
}
```

**Campos:**

| Campo       | Tipo                             | Descrição                               |
| ----------- | -------------------------------- | --------------------------------------- |
| `key`       | `string`                         | Identificador único                     |
| `valueType` | `'string' \| 'number' \| 'json'` | Tipo do valor retornado                 |
| `value`     | `string`                         | Valor atual (serializado)               |
| `variants`  | `{ labels, value, weight }[]`    | Variantes possíveis com pesos           |
| `enabled`   | `boolean`                        | Se desabilitada, retorna `defaultValue` |

---

### 3. Flag com Atributos (`AttributeFlag`)

Carrega **metadados/configurações adicionais** em pares chave-valor. Útil quando a flag precisa expor múltiplas configurações associadas.

**Quando usar:**

- Configuração complexa de um motor de ML (modelo, max resultados, grupo de testes)
- Regras de negócio com múltiplos parâmetros
- Feature com configuração de rollout detalhada

**Exemplo:**

```tsx
// Server-side (RSC)
import { getFlagAttributes } from '@/lib/feature-flags/server'

export default async function Page() {
  const recConfig = await getFlagAttributes('ml_rec_engine')
  // {rolloutPercentage: 50, model: 'v3-collaborative', maxResults: 12}
  return recConfig ? <RecEngine config={recConfig} /> : <FallbackRec />
}

// Client-side (Hook)
import { useFlagAttributes } from '@/lib/feature-flags/server'

function MyComponent() {
  const recConfig = useFlagAttributes('ml_rec_engine')
  if (!recConfig) return <FallbackRec />
  return <RecEngine model={recConfig.model as string} />
}
```

**Campos:**

| Campo        | Tipo                                          | Descrição                                           |
| ------------ | --------------------------------------------- | --------------------------------------------------- |
| `key`        | `string`                                      | Identificador único                                 |
| `attributes` | `Record<string, string \| number \| boolean>` | Pares chave-valor                                   |
| `enabled`    | `boolean`                                     | Se desabilitada, `getFlagAttributes` retorna `null` |

---

## Arquitetura

```bash
+--------------------------------------------------+
|          FeatureFlagDataProvider (Strategy)      |
|                                                  |
| +-----------------+   +-----------------------+  |
| | LocalStorage    |   | AppConfigProvider     |  |
| | Provider (mock) |   | (AWS AppConfig Agent) |  |
| +-----------------+   +-----------------------+  |
|         |                         |              |
+---------|-------------------------|--------------+
          |                         |
  +-----------------+   +-----------------------+
  | server.ts       |   | client.tsx            |
  | (RSC/Actions)   |   | (React Hooks)         |
  | cache Map + TTL |   | polling 30z           |
  +-----------------+   +-----------------------+
          |                         |
  +---------------------------------------------+
  | crud-storage.ts                             |
  | FlagCrudStorage (Strategy)                  |
  | |- LocalStorageCrudStore (mock)             |
  | |- [AwsCrudStorage] (futuro)                |
  +---------------------------------------------+
```

## Como administrar flags

Acesse a página de adminitração em:

```bash
/feature-flags
```

A interface permite:

- **Criar** flags de qualquer tipo (abas: Booleanas, Multivariantes, Com Atributos)
- **Editar** nome, chave, descrição, responsável e valores específicos
- **Ativar/Desativar** com toggle direto na tabela
- **Excluir** com confirmação
- **Visualizar JSON** da estrutura interna da flag

As alterações feitas na UI de admin são sincronizadas automaticamente com o `FeatureFlagProvider` (Context), de modo que os hooks `useIsEnabled`, `useFlagValue` e `useFlagAttributes` refletem as mudanças no próximo ciclo de polling.

---

## Integração com AWS AppConfig (futuro)

A camada de abstração foi projetada com **Strategy Pattern** para facilitar a migração:

### 1. Instalar o AWS SDK

```bash
npm install @aws-sdk/client-appconfigdata
```

### 2. Configurar variáveis de ambiente

```yml
# config/values_dev.yml
APPCONFIG_APPLICATION_ID: 'sua-app-id'
APPCONFIG_ENVIRONMENT_ID: 'dev'
APPCONFIG_CONFIGURATION_PROFILE_ID: 'feature-flags'
FEATURE_FLAGS_PROVIDER: 'appconfig'
```

### 3. O AppConfigProvider já existe como stub

O arquivo `src/lib/feature-flags/providers/appconfig-provider.ts` está pronto para ser ativado. Ele consome o AppConfig Agent (sidecar) via HTTP:

```bash
GET http://localhost:2772/applications/{app}/environments/{env}/configurations/{config}
```

### 4. Para o CRUD, implementar `AwsCrudStorage`

Basta criar uma nova classe que implemente a interface `FlagCrudStorage`:

```typescript
import type { FlagCrudStorage, FlagStore } from './crud-storage'

export class AwsCrudStorage implements FlagCrudStorage {
  load(): FlagStore {
    /* fetch da API */
  }
  save(store: FlagStore): void {
    /* PUT na API */
  }
}
```

E passar como prop:

```tsx
<FeatureFlagCrud storage={new AwsCrudStorage()} />
```

---

## Estrutura de Arquivos

```bash
src/lib/feature-flags/
+- types.ts                     # Tipos e interfaces
+- index.ts                     # Barrel exports
+- server.ts                    # Serviço server-side (RSC)
+- client.tsx                   # Provider + Hooks (client)
+- crud-storage.ts              # CRUD storage abstraction
+- providers/
  +- local-storage-provider.ts  # Mock (localStorage)
  +- appconfig-provider.ts      # Stub (AWS AppConfig Agent)

src/components/portal-admin/
+- FeatureFlagCrud.tsx          # UI CRUD com abas
+- FeatireFlagExample.tsx       # Exemplo de consumo (hooks)

src/app/feature-flags/
+- page.tsx

__tests__/lib/feature-flags/
+- local-storage-provider.test.ts
+- server.test.ts
+- client.test.tsx
```
