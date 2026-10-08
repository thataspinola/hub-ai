import type { FlagValueMap, FlagEntry } from './types'

// ----------------------------------------------------------------------------
// CRUD Types para adminitração de Feature Flags
// ----------------------------------------------------------------------------

/** Flag booleana - controle de binário on/off. */
export interface BooleanFlag {
  id: string
  key: string
  name: string
  description: string
  enabled: boolean
  owner: string
  createdAt: string
  updatedAt: string
}

/** Flag multivariante - retorna valores dinâmicos (string, number, JSON). */
export interface MultivariantFlag {
  id: string
  key: string
  name: string
  description: string
  enabled: boolean
  /** Tipo do valor retornado. */
  valueType: 'string' | 'number' | 'json'
  /** Valor atual da variante (armazenado como string, parseado conforme valueType) */
  value: string
  /** Variantes possíveis com seus pesos de distribuição. */
  variants: { label: string; value: string; weight: number }[]
  owner: string
  createdAt: string
  updatedAt: string
}

/** Flag com atributos - possui metadados/configurações adicionais. */
export interface AttributeFlag {
  id: string
  key: string
  name: string
  description: string
  enabled: boolean
  /** Pares chave-valor de atributos adicionais */
  attributes: Record<string, string | number | boolean>
  owner: string
  createdAt: string
  updatedAt: string
}

/** Payload completo salvo no storage. */
export interface FlagStore {
  booleanFlags: BooleanFlag[]
  multivariantsFlags: MultivariantFlag[]
  attributeFlags: AttributeFlag[]
}

// ----------------------------------------------------------------------------
// Storage abstraction (Strategy pattern - swap para AWS futuramente)
// ----------------------------------------------------------------------------

export interface FlagCrudStorage {
  load(): FlagStore
  save(store: FlagStore): void
}

const CRUD_STORAGE_KEY = 'feature_flags_crud'

function now(): string {
  return new Date().toISOString()
}

// ----------------------------------------------------------------------------
// Seed data
// ----------------------------------------------------------------------------

export const SEED_STORE: FlagStore = {
  booleanFlags: [
    {
      id: '1',
      key: 'new_checkout_v2',
      name: 'Checkout V2 Redesign',
      description: 'Habilitar interface de checkout integrada ao Stripe.',
      enabled: true,
      owner: 'Engenharia',
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-03-19T08:00:00.000Z',
    },
    {
      id: '2',
      key: 'maintenance_mode',
      name: 'Modo manutenção',
      description:
        'Coloca o sistema em modo de manutenção para todos os usuários.',
      enabled: false,
      owner: 'Infraestrutura',
      createdAt: '2026-02-01T14:00:00.000Z',
      updatedAt: '2026-03-10T09:00:00.000Z',
    },
  ],
  multivariantsFlags: [
    {
      id: '1',
      key: 'ui_dark_mode',
      name: 'Dark Mode',
      description: 'Controla qual variante do modo escuro é exibida.',
      enabled: true,
      valueType: 'string',
      value: 'beta',
      variants: [
        { label: 'Desativado', value: 'disabled', weight: 50 },
        { label: 'Beta', value: 'beta', weight: 30 },
        { label: 'Full', value: 'full', weight: 20 },
      ],
      owner: 'Equipe de Design',
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-03-19T08:00:00.000Z',
    },
    {
      id: '2',
      key: 'rate_limit',
      name: 'Rate Limit',
      description: 'Limite de requisições por segundo configurável.',
      enabled: true,
      valueType: 'number',
      value: '100',
      variants: [
        { label: 'Low', value: '50', weight: 20 },
        { label: 'Medium', value: '100', weight: 60 },
        { label: 'High', value: '200', weight: 20 },
      ],
      owner: 'Engenharia',
      createdAt: '2026-01-10T14:00:00.000Z',
      updatedAt: '2026-03-14T09:00:00.000Z',
    },
  ],
  attributeFlags: [
    {
      id: '1',
      key: 'ml_rec_engine',
      name: 'ML Recommendation Engine',
      description: 'Sugerir produtos usando modelo de ML interno.',
      enabled: false,
      attributes: {
        rolloutPercentage: 50,
        model: 'V3-collaborative',
        maxResults: 12,
        abTestGroup: 'control',
      },
      owner: 'Crescimento',
      createdAt: '2026-01-10T14:00:00.000Z',
      updatedAt: '2026-03-14T09:00:00.000Z',
    },
  ],
}

// ----------------------------------------------------------------------------
// LocalStorage
// ----------------------------------------------------------------------------

export class LocalStorageCrudStore implements FlagCrudStorage {
  load(): FlagStore {
    if (typeof window === 'undefined') return SEED_STORE

    try {
      const raw = localStorage.getItem(CRUD_STORAGE_KEY)
      if (raw) return JSON.parse(raw) as FlagStore
    } catch {
      /* fallback */
    }
  }

  save(store: FlagStore): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(CRUD_STORAGE_KEY, JSON.stringify(store))
  }
}

// ----------------------------------------------------------------------------
// Sync helpers - converte o FlagStore CRUD para FlagValueMap do provider
// ----------------------------------------------------------------------------

/** Converte o store CRUD para o formato FlagValueMap (AppConfig nativo). */
export function storeToFlagValueMap(store: FlagStore): FlagValueMap {
  const map: FlagValueMap = {}

  for (const flag of store.booleanFlags) {
    map[flag.key] = {
      enabled: flag.enabled,
      description: flag.description,
      owner: flag.owner,
    }
  }

  for (const flag of store.multivariantsFlags) {
    let variant: unknown = flag.value

    if (flag.valueType === 'number') {
      variant = Number(flag.value)
    } else if (flag.valueType === 'json') {
      try {
        variant = JSON.parse(flag.value)
      } catch {
        /* keep string */
      }
    }

    map[flag.key] = {
      enabled: flag.enabled,
      variant,
      valueType: flag.valueType,
      value: flag.value,
      variants: flag.variants,
      description: flag.description,
      owner: flag.owner,
    }
  }

  for (const flag of store.attributeFlags) {
    const entry: FlagEntry = {
      enabled: flag.enabled,
      description: flag.description,
      owner: flag.owner,
      ...flag.attributes,
    }

    map[flag.key] = entry
  }

  return map
}

/** Sincroniza o FlagValueMap do provider (localStorage) com o store CRUD */
export function syncProviderStorage(store: FlagStore): void {
  if (typeof window === 'undefined') return
  const map = storeToFlagValueMap(store)
  localStorage.setItem('appconfig_feature_flags', JSON.stringify(map))
}

// ----------------------------------------------------------------------------
// CRUD
// ----------------------------------------------------------------------------

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function createBooleanFlag(
  partial: Omit<BooleanFlag, 'id' | 'createdAt' | 'updatedAt'>
): BooleanFlag {
  return { ...partial, id: generateId(), createdAt: now(), updatedAt: now() }
}

export function createMultivariantFlag(
  partial: Omit<MultivariantFlag, 'id' | 'createdAt' | 'updatedAt'>
): MultivariantFlag {
  return { ...partial, id: generateId(), createdAt: now(), updatedAt: now() }
}

export function createAttributeFlag(
  partial: Omit<AttributeFlag, 'id' | 'createdAt' | 'updatedAt'>
): AttributeFlag {
  return { ...partial, id: generateId(), createdAt: now(), updatedAt: now() }
}
