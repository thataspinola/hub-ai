import type { FeatureFlagDataProvider, FlagValueMap } from '../types'

const STORAGE_KEY = 'appconfig_feature_flag'

/**
 * Seed data no formato AppConfig Feature Flags nativo.
 * Derivado dos dados mock existentes em `@/constants/featureops.
 */
export const SEED_FLAGS: FlagValueMap = {
  new_checkout_v2: {
    enabled: true,
    variant: 'redesign',
    rolloutPercentage: 15,
    description: 'Habilitar interface de checkout integrada ao Stripe.',
    owner: 'Engenharia',
  },
  ui_dark_mode: {
    enabled: true,
    variant: 'beta',
    rolloutPercentage: 15,
    description: 'Suporte a modo escuro em todo o sistema.',
    owner: 'Equipe de Design',
  },
  ml_rec_engine: {
    enabled: false,
    variant: 'control',
    rolloutPercentage: 50,
    description: 'Sugerir produtos usando modelo de ML interno.',
    owner: 'Crescrimento',
  },
}

/**
 * Provider mock que persiste flags no localStorage.
 *
 * - No server (SSR), retorna os dados seed estáticos.
 * - No client, lê do localStorage e faz fallback para o seed.
 */
export class LocalStorageProvider implements FeatureFlagDataProvider {
  async fetchFlags(): Promise<FlagValueMap> {
    if (typeof window === 'undefined') {
      return SEED_FLAGS
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (raw) {
        return JSON.parse(raw) as FlagValueMap
      }
    } catch {
      // Se o parse falhar, faz fallback para seed
    }

    // Inicializa localStorage com seed data na primeira vez
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FLAGS))
    return SEED_FLAGS
  }
}
