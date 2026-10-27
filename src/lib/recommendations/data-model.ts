import type { RecommendationData } from './types'

export const migrateData = (
  data: Partial<RecommendationData>,
): RecommendationData => {
  const defaults = createEmptyData()

  const catalog = {
    products: data.catalog?.products || [],
    categories: data.catalog?.categories || [],
  }

  const types = (data.recommendationRules?.types || {}) as Partial<
    RecommendationData['recommendationRules']['types']
  >

  const migratedData: RecommendationData = {
    version: data.version || defaults.version,
    generatedFrom: data.generatedFrom || defaults.generatedFrom,
    schemaVersion: data.schemaVersion || defaults.schemaVersion,
    catalog,
    recommendationRules: {
      defaults: {
        ...defaults.recommendationRules.defaults,
        ...data.recommendationRules?.defaults,
      },
      types: {
        same_category: {
          ...defaults.recommendationRules.types.same_category,
          ...types.same_category,
        },
        affinity_manual: {
          ...defaults.recommendationRules.types.affinity_manual,
          ...types.affinity_manual,
          maps: {
            byCategory: types.affinity_manual?.maps?.byCategory || {},
            byUrl: types.affinity_manual?.maps?.byUrl || {},
          },
        },
        history_recent: {
          ...defaults.recommendationRules.types.history_recent,
          ...types.history_recent,
        },
        popularity_global: {
          ...defaults.recommendationRules.types.popularity_global,
          ...types.popularity_global,
          ranking: {
            ...defaults.recommendationRules.types.popularity_global.ranking,
            ...types.popularity_global?.ranking,
          },
        },
        campaign: {
          description:
            types.campaign?.description ||
            'Recomenda produtos baseados no ID da campanha (utm_campaign).',
          campaigns: types.campaign?.campaigns || {},
          params: {
            expandCategoryToUrlsTake:
              types.campaign?.params?.expandCategoryToUrlsTake || 10,
            sessionStorageKey:
              types.campaign?.params?.sessionStorageKey || 'reco_campaign_id',
          },
        },
        context_slot: {
          ...defaults.recommendationRules.types.context_slot,
          ...types.context_slot,
          slots:
            types.context_slot?.slots ||
            defaults.recommendationRules.types.context_slot.slots,
        },
        profile_static: {
          ...defaults.recommendationRules.types.profile_static,
          ...types.profile_static,
          profiles:
            types.profile_static?.profiles ||
            defaults.recommendationRules.types.profile_static.profiles,
        },
      },
    },
  }

  return migratedData
}

export const createEmptyData = (): RecommendationData => ({
  version: '2.0.0',
  generatedFrom: 'admin-panel',
  schemaVersion: '2.0',
  catalog: {
    products: [],
    categories: [],
  },
  recommendationRules: {
    defaults: {
      limit: 8,
      minItems: 4,
      filters: {
        excludeCurrentUrl: true,
        deduplicate: true,
      },
    },
    types: {
      same_category: {
        description:
          'Recomenda produtos da mesma categoria do item atual (via catálogo).',
        params: {
          maxCandidates: 50,
        },
      },
      affinity_manual: {
        description: 'Afinidade curada entre categorias e/ou URLs específicas.',
        maps: {
          byCategory: {},
          byUrl: {},
        },
        params: {
          expandCategoryToUrlsTake: 10,
          sortBy: 'weight_desc_then_popularity',
        },
        metadata: {
          source: 'admin-panel',
          updatedAt: new Date().toISOString(),
        },
      },
      history_recent: {
        description:
          'Recomenda baseado no histórico do usuário (URLs vistas recentemente).',
        params: {
          maxRecentUrlsStored: 20,
          takeFromRecentUrls: 6,
          ifEmptyThenUseRecentCategories: true,
          takeFromRecentCategories: 2,
          expandCategoryToUrlsTake: 5,
        },
      },
      popularity_global: {
        description: 'Ranking global de URLs mais populares.',
        ranking: {
          urls: [],
          windowDays: 7,
          metric: 'sortWeight',
        },
        metadata: {
          source: 'admin-panel',
          computedAt: new Date().toISOString(),
        },
      },
      campaign: {
        description:
          'Recomenda produtos baseados no ID da campanha (utm_campaign).',
        campaigns: {},
        params: {
          expandCategoryToUrlsTake: 10,
          sessionStorageKey: 'reco_campaign_id',
        },
      },
      context_slot: {
        description: 'Config por slot/página: define cascata e limites.',
        slots: {
          pdp_related: {
            limit: 8,
            minItems: 4,
            cascade: [
              'history_recent',
              'affinity_manual',
              'same_category',
              'popularity_global',
            ],
          },
          home_trending: {
            limit: 8,
            minItems: 4,
            cascade: ['popularity_global'],
          },
        },
      },
      profile_static: {
        description: 'Escolhe cascata com base em perfil simples.',
        profiles: {
          new_visitor: {
            when: { hasHistory: false },
            useCascade: ['popularity_global'],
          },
          returning: {
            when: { hasHistory: true },
            useCascade: [
              'history_recent',
              'affinity_manual',
              'popularity_global',
            ],
          },
        },
      },
    },
  },
})
