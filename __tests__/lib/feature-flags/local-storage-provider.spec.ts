/**
 * @jest-environment jsdom
 */

import {
  LocalStorageProvider,
  SEED_FLAGS,
} from '@/lib/feature-flags/providers/local-storage-provider'

const STORAGE_KEY = 'appconfig_feature_flags'

describe('LocalStorageProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna dados do localStorage quando disponíveis', async () => {
    const customFlags = {
      test_flag: { enabled: true, variant: 'alpha' },
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(customFlags))

    const provider = new LocalStorageProvider()
    const result = await provider.fetchFlags()

    expect(result).toEqual(customFlags)
  })

  it('retorna SEED_FLAGS e inicializa localStorage quando vazio', async () => {
    const provider = new LocalStorageProvider()
    const result = await provider.fetchFlags()

    expect(result).toEqual(SEED_FLAGS)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(SEED_FLAGS)
  })

  it('retorna SEED_FLAGS quando localStorage contém JSON inválido', async () => {
    localStorage.setItem(STORAGE_KEY, '{invalid json}')

    const provider = new LocalStorageProvider()
    const result = await provider.fetchFlags()

    expect(result).toEqual(SEED_FLAGS)
  })

  it('SEED_FLAGS contém as flags esperadas no formato AppConfig nativo', () => {
    expect(SEED_FLAGS).toHaveProperty('new_checkout_v2')
    expect(SEED_FLAGS).toHaveProperty('ui_dark_mode')
    expect(SEED_FLAGS).toHaveProperty('ml_rec_engine')

    // Cada flag tem `enabled` como booleano
    expect(typeof SEED_FLAGS.new_checkout_v2.enabled).toBe('boolean')
    expect(typeof SEED_FLAGS.ui_dark_mode.enabled).toBe('boolean')
    expect(typeof SEED_FLAGS.ml_rec_engine.enabled).toBe('boolean')

    // Flags habilitadas/desabilitadas corretamente
    expect(SEED_FLAGS.new_checkout_v2.enabled).toBe(true)
    expect(SEED_FLAGS.ui_dark_mode.enabled).toBe(true)
    expect(SEED_FLAGS.ml_rec_engine.enabled).toBe(false)
  })

  it('retorna SEED_FLAGS quando window não está definido (SSR)', async () => {
    // Simula ambiente SSR removendo temporariamente window
    const originalWindow = globalThis.window
    // @ts-expect-error — Simula SSR
    delete globalThis.window

    try {
      const provider = new LocalStorageProvider()
      const result = await provider.fetchFlags()
      expect(result).toEqual(SEED_FLAGS)
    } finally {
      globalThis.window = originalWindow
    }
  })
})
