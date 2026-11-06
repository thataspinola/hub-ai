/**
 * @jest-environment jsdom
 */

import {
  LocalStorageCrudStorage,
  SEED_STORE,
  storeToFlagValueMap,
  syncProviderStorage,
  generateId,
  createBooleanFlag,
  createMultivariantFlag,
  createAttributeFlag,
} from '@/lib/feature-flags/crud-storage'

const CRUD_KEY = 'feature_flags_crud'
const PROVIDER_KEY = 'appconfig_feature_flags'

describe('crud-storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // ── LocalStorageCrudStorage ────────────────────────────

  describe('LocalStorageCrudStorage', () => {
    it('retorna SEED_STORE e inicializa localStorage quando vazio', () => {
      const storage = new LocalStorageCrudStorage()
      const result = storage.load()

      expect(result).toEqual(SEED_STORE)
      expect(JSON.parse(localStorage.getItem(CRUD_KEY)!)).toEqual(SEED_STORE)
    })

    it('retorna dados do localStorage quando disponíveis', () => {
      const custom = {
        booleanFlags: [],
        multivariantFlags: [],
        attributeFlags: [],
      }

      localStorage.setItem(CRUD_KEY, JSON.stringify(custom))

      const storage = new LocalStorageCrudStorage()
      expect(storage.load()).toEqual(custom)
    })

    it('retorna SEED_STORE quando localStorage contém JSON inválido', () => {
      localStorage.setItem(CRUD_KEY, '{broken')

      const storage = new LocalStorageCrudStorage()
      expect(storage.load()).toEqual(SEED_STORE)
    })

    it('persiste store no localStorage via save()', () => {
      const storage = new LocalStorageCrudStorage()
      const store = { ...SEED_STORE, booleanFlags: [] }
      storage.save(store)

      expect(JSON.parse(localStorage.getItem(CRUD_KEY)!)).toEqual(store)
    })
  })

  // ── storeToFlagValueMap ────────────────────────────────

  describe('storeToFlagValueMap()', () => {
    it('converte booleanFlags para FlagValueMap', () => {
      const map = storeToFlagValueMap(SEED_STORE)

      expect(map['new_checkout_v2']).toBeDefined()
      expect(map['new_checkout_v2'].enabled).toBe(true)
    })

    it('converte multivariantFlags com variant e valueType', () => {
      const map = storeToFlagValueMap(SEED_STORE)

      expect(map['ui_dark_mode']).toBeDefined()
      expect(map['ui_dark_mode'].enabled).toBe(true)
      expect(map['ui_dark_mode'].variant).toBe('beta')
      expect(map['ui_dark_mode'].valueType).toBe('string')
    })

    it('converte multivariantFlags number corretamente', () => {
      const map = storeToFlagValueMap(SEED_STORE)

      expect(map['rate_limit']).toBeDefined()
      expect(map['rate_limit'].variant).toBe(100)
    })

    it('converte attributeFlags espalhando atributos', () => {
      const map = storeToFlagValueMap(SEED_STORE)

      expect(map['ml_rec_engine']).toBeDefined()
      expect(map['ml_rec_engine'].enabled).toBe(false)
      expect(map['ml_rec_engine']).toHaveProperty('rolloutPercentage', 50)
      expect(map['ml_rec_engine']).toHaveProperty('model', 'v3-collaborative')
    })
  })

  // ── syncProviderStorage ────────────────────────────────

  describe('syncProviderStorage()', () => {
    it('sincroniza FlagValueMap para o localStorage do provider', () => {
      syncProviderStorage(SEED_STORE)

      const map = JSON.parse(localStorage.getItem(PROVIDER_KEY)!)
      expect(map).toHaveProperty('new_checkout_v2')
      expect(map).toHaveProperty('ui_dark_mode')
      expect(map).toHaveProperty('ml_rec_engine')
    })
  })

  // ── generateId ─────────────────────────────────────────

  describe('generateId()', () => {
    it('gera IDs únicos', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()))
      expect(ids.size).toBe(100)
    })
  })

  // ── create helpers ────────────────────────────────────

  describe('create helpers', () => {
    it('createBooleanFlag gera flag com id, createdAt e updatedAt', () => {
      const flag = createBooleanFlag({
        key: 'test',
        name: 'Test',
        description: 'Desc',
        enabled: true,
        owner: 'Dev',
      })

      expect(flag.id).toBeTruthy()
      expect(flag.createdAt).toBeTruthy()
      expect(flag.updatedAt).toBeTruthy()
      expect(flag.key).toBe('test')
    })

    it('createMultivariantFlag gera flag com campos corretos', () => {
      const flag = createMultivariantFlag({
        key: 'mv',
        name: 'MV',
        description: 'D',
        enabled: false,
        owner: 'Dev',
        valueType: 'string',
        value: 'a',
        variants: [],
      })

      expect(flag.id).toBeTruthy()
      expect(flag.valueType).toBe('string')
    })

    it('createAttributeFlag gera flag com campos corretos', () => {
      const flag = createAttributeFlag({
        key: 'attr',
        name: 'Attr',
        description: 'D',
        enabled: true,
        owner: 'Dev',
        attributes: { color: 'red' },
      })

      expect(flag.id).toBeTruthy()
      expect(flag.attributes).toEqual({ color: 'red' })
    })
  })

  // ── SSR safety ─────────────────────────────────────────

  describe('SSR safety', () => {
    it('load retorna SEED_STORE quando window não existe', () => {
      const originalWindow = globalThis.window
      // @ts-expect-error — Simula SSR
      delete globalThis.window

      try {
        const storage = new LocalStorageCrudStorage()
        expect(storage.load()).toEqual(SEED_STORE)
      } finally {
        globalThis.window = originalWindow
      }
    })
  })
})
