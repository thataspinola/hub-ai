'use client'

import { create } from 'zustand'
import type {
  RecommendationData,
  Product,
  AffinityTarget,
  SlotConfig,
  CampaignTarget,
} from './types'
import { saveToIndexedDB, loadFromIndexedDB } from './indexed-db'

// BroadcastChannel for syncing with preview
let broadcastChannel: BroadcastChannel | null = null

const getBroadcastChannel = () => {
  if (typeof window === 'undefined') return null

  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel('recommendation-preview-sync')
  }

  return broadcastChannel
}

const syncToPreview = (data: RecommendationData) => {
  const channel = getBroadcastChannel()

  if (channel) {
    const jsonData = JSON.stringify(data, null, 2)
    localStorage.setItem('recommendation-preview-data', jsonData)
    channel.postMessage({ type: 'DATA_UPDATED', payload: jsonData })
  }
}

// Debounce function for IndexedDB saves
let saveTimeout: ReturnType<typeof setTimeout> | null = null

const debouncedSaveToIndexedDB = (
  data: RecommendationData,
  onSaveStart: () => void,
  onSaveComplete: () => void
) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  onSaveStart()

  saveTimeout = setTimeout(async () => {
    try {
      await saveToIndexedDB(data)
      onSaveComplete()
    } catch (error) {
      console.error('Failed to save to IndexedDB:', error)
      onSaveComplete()
    }
  }, 500)
}

// Ensure backward compatibility by adding missing structures
const migrateData = (data: Partial<RecommendationData>): RecommendationData => {
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

// Default empty data structure
const createEmptyData = (): RecommendationData => ({
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

type SyncStatus = 'idle' | 'saving' | 'saved' | 'synced'

interface RecommendationStore {
  data: RecommendationData
  isDirty: boolean
  isLoading: boolean
  syncStatus: SyncStatus
  lastSyncTime: Date | null

  // Data actions
  setData: (data: RecommendationData) => void
  resetData: () => void
  importData: (json: string) => boolean
  exportData: () => string
  loadFromStorage: () => Promise<void>

  // Catalog actions
  addProduct: (product: Product) => void
  updateProduct: (url: string, product: Product) => void
  deleteProduct: (url: string) => void
  addCategory: (category: string) => void
  deleteCategory: (category: string) => void

  // Affinity actions
  addAffinityByCategory: (
    sourceCategory: string,
    target: AffinityTarget
  ) => void

  removeAffinityByCategory: (
    sourceCategory: string,
    targetIndex: number
  ) => void

  addAffinityByUrl: (sourceUrl: string, target: AffinityTarget) => void
  removeAffinityByUrl: (sourceUrl: string, targetIndex: number) => void

  // Popularity actions
  setGlobalRanking: (urls: string[]) => void

  // Campaign actions
  addCampaign: (campaignId: string, description?: string) => void
  deleteCampaign: (campaignId: string) => void
  addCampaignTarget: (campaignId: string, target: CampaignTarget) => void
  removeCampaignTarget: (campaignId: string, targetIndex: number) => void
  updateCampaignDescription: (campaignId: string, description: string) => void

  // Slot actions
  addSlot: (slotId: string, config: SlotConfig) => void
  updateSlot: (slotId: string, config: SlotConfig) => void
  deleteSlot: (slotId: string) => void

  // Defaults actions
  updateDefaults: (
    defaults: RecommendationData['recommendationRules']['defaults']
  ) => void

  // History Recent params
  updateHistoryRecentParams: (
    params: RecommendationData['recommendationRules']['types']['history_recent']['params']
  ) => void

  // Same Category params
  updateSameCategoryParams: (
    params: RecommendationData['recommendationRules']['types']['same_category']['params']
  ) => void

  // Internal
  _setSyncStatus: (status: SyncStatus) => void
}

export const useRecommendationStore = create<RecommendationStore>(
  (set, get) => ({
    data: createEmptyData(),
    isDirty: false,
    isLoading: true,
    syncStatus: 'idle',
    lastSyncTime: null,

    _setSyncStatus: (status) =>
      set({
        syncStatus: status,
        lastSyncTime: status === 'synced' ? new Date() : get().lastSyncTime,
      }),

    loadFromStorage: async () => {
      set({ isLoading: true })

      try {
        const storedData =
          await loadFromIndexedDB<Partial<RecommendationData>>()

        if (storedData) {
          const migratedData = migrateData(storedData)

          set({
            data: migratedData,
            isDirty: false,
            isLoading: false,
            syncStatus: 'saved',
          })

          syncToPreview(migratedData)
        } else {
          set({ isLoading: false })
        }
      } catch (error) {
        console.error('Failed to load from IndexedDB:', error)
        set({ isLoading: false })
      }
    },

    setData: (data) => {
      set({ data, isDirty: false })

      debouncedSaveToIndexedDB(
        data,
        () => get()._setSyncStatus('saving'),
        () => {
          get()._setSyncStatus('synced')
          syncToPreview(data)
        }
      )
    },

    resetData: () => {
      const newData = createEmptyData()
      set({ data: newData, isDirty: false })

      debouncedSaveToIndexedDB(
        newData,
        () => get()._setSyncStatus('saving'),
        () => {
          get()._setSyncStatus('synced')
          syncToPreview(newData)
        }
      )
    },

    importData: (json) => {
      try {
        const parsed = JSON.parse(json) as Partial<RecommendationData>

        if (!parsed.catalog || !parsed.recommendationRules) {
          throw new Error('Invalid data structure')
        }

        const migratedData = migrateData(parsed)
        set({ data: migratedData, isDirty: false })

        debouncedSaveToIndexedDB(
          migratedData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(migratedData)
          }
        )

        return true
      } catch {
        return false
      }
    },

    exportData: () => {
      const { data } = get()

      const exportData = {
        ...data,
        recommendationRules: {
          ...data.recommendationRules,
          types: {
            ...data.recommendationRules.types,
            affinity_manual: {
              ...data.recommendationRules.types.affinity_manual,
              metadata: {
                ...data.recommendationRules.types.affinity_manual.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
            popularity_global: {
              ...data.recommendationRules.types.popularity_global,
              metadata: {
                ...data.recommendationRules.types.popularity_global.metadata,
                computedAt: new Date().toISOString(),
              },
            },
          },
        },
      }

      return JSON.stringify(exportData, null, 2)
    },

    addProduct: (product) =>
      set((state) => {
        const newCategories = state.data.catalog.categories.includes(
          product.category
        )
          ? state.data.catalog.categories
          : [...state.data.catalog.categories, product.category]

        const newData = {
          ...state.data,
          catalog: {
            products: [...state.data.catalog.products, product],
            categories: newCategories,
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    updateProduct: (url, product) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            products: state.data.catalog.products.map((p) =>
              p.url === url ? product : p
            ),
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    deleteProduct: (url) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            products: state.data.catalog.products.filter((p) => p.url !== url),
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    addCategory: (category) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            categories: [...state.data.catalog.categories, category],
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    deleteCategory: (category) =>
      set((state) => {
        const newData = {
          ...state.data,
          catalog: {
            ...state.data.catalog,
            categories: state.data.catalog.categories.filter(
              (c) => c !== category
            ),
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    addAffinityByCategory: (sourceCategory, target) =>
      set((state) => {
        const currentTargets =
          state.data.recommendationRules.types.affinity_manual.maps.byCategory[
            sourceCategory
          ] || []

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              affinity_manual: {
                ...state.data.recommendationRules.types.affinity_manual,
                maps: {
                  ...state.data.recommendationRules.types.affinity_manual.maps,
                  byCategory: {
                    ...state.data.recommendationRules.types.affinity_manual.maps
                      .byCategory,
                    [sourceCategory]: [...currentTargets, target],
                  },
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    removeAffinityByCategory: (sourceCategory, targetIndex) =>
      set((state) => {
        const currentTargets =
          state.data.recommendationRules.types.affinity_manual.maps.byCategory[
            sourceCategory
          ] || []

        const newTargets = currentTargets.filter((_, i) => i !== targetIndex)

        const newByCategory = {
          ...state.data.recommendationRules.types.affinity_manual.maps
            .byCategory,
        }

        if (newTargets.length === 0) {
          delete newByCategory[sourceCategory]
        } else {
          newByCategory[sourceCategory] = newTargets
        }

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              affinity_manual: {
                ...state.data.recommendationRules.types.affinity_manual,
                maps: {
                  ...state.data.recommendationRules.types.affinity_manual.maps,
                  byCategory: newByCategory,
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    addAffinityByUrl: (sourceUrl, target) =>
      set((state) => {
        const currentTargets =
          state.data.recommendationRules.types.affinity_manual.maps.byUrl[
            sourceUrl
          ] || []

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              affinity_manual: {
                ...state.data.recommendationRules.types.affinity_manual,
                maps: {
                  ...state.data.recommendationRules.types.affinity_manual.maps,
                  byUrl: {
                    ...state.data.recommendationRules.types.affinity_manual.maps
                      .byUrl,
                    [sourceUrl]: [...currentTargets, target],
                  },
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    removeAffinityByUrl: (sourceUrl, targetIndex) =>
      set((state) => {
        const currentTargets =
          state.data.recommendationRules.types.affinity_manual.maps.byUrl[
            sourceUrl
          ] || []

        const newTargets = currentTargets.filter((_, i) => i !== targetIndex)

        const newByUrl = {
          ...state.data.recommendationRules.types.affinity_manual.maps.byUrl,
        }

        if (newTargets.length === 0) {
          delete newByUrl[sourceUrl]
        } else {
          newByUrl[sourceUrl] = newTargets
        }

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              affinity_manual: {
                ...state.data.recommendationRules.types.affinity_manual,
                maps: {
                  ...state.data.recommendationRules.types.affinity_manual.maps,
                  byUrl: newByUrl,
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    setGlobalRanking: (urls) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              popularity_global: {
                ...state.data.recommendationRules.types.popularity_global,
                ranking: {
                  ...state.data.recommendationRules.types.popularity_global
                    .ranking,
                  urls,
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    addCampaign: (campaignId, description) =>
      set((state) => {
        const currentCampaign =
          state.data.recommendationRules.types.campaign.campaigns[campaignId]

        if (!currentCampaign) return state

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              campaign: {
                ...state.data.recommendationRules.types.campaign,
                campaigns: {
                  ...state.data.recommendationRules.types.campaign.campaigns,
                  [campaignId]: {
                    description: description || '',
                    targets: [],
                  },
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    deleteCampaign: (campaignId) =>
      set((state) => {
        const newCampaigns = {
          ...state.data.recommendationRules.types.campaign.campaigns,
        }

        delete newCampaigns[campaignId]

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              campaign: {
                ...state.data.recommendationRules.types.campaign,
                campaigns: newCampaigns,
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    addCampaignTarget: (campaignId, target) =>
      set((state) => {
        const currentCampaign =
          state.data.recommendationRules.types.campaign.campaigns[campaignId]

        if (!currentCampaign) return state

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              campaign: {
                ...state.data.recommendationRules.types.campaign,
                campaigns: {
                  ...state.data.recommendationRules.types.campaign.campaigns,
                  [campaignId]: {
                    ...currentCampaign,
                    targets: [...currentCampaign.targets, target],
                  },
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    removeCampaignTarget: (campaignId, targetIndex) =>
      set((state) => {
        const currentCampaign =
          state.data.recommendationRules.types.campaign.campaigns[campaignId]

        if (!currentCampaign) return state

        const newTargets = currentCampaign.targets.filter(
          (_, i) => i !== targetIndex
        )

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              campaign: {
                ...state.data.recommendationRules.types.campaign,
                campaigns: {
                  ...state.data.recommendationRules.types.campaign.campaigns,
                  [campaignId]: {
                    ...currentCampaign,
                    targets: newTargets,
                  },
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    updateCampaignDescription: (campaignId, description) =>
      set((state) => {
        const currentCampaign =
          state.data.recommendationRules.types.campaign.campaigns[campaignId]

        if (!currentCampaign) return state

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              campaign: {
                ...state.data.recommendationRules.types.campaign,
                campaigns: {
                  ...state.data.recommendationRules.types.campaign.campaigns,
                  [campaignId]: {
                    ...currentCampaign,
                    description,
                  },
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    addSlot: (slotId, config) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              context_slot: {
                ...state.data.recommendationRules.types.context_slot,
                slots: {
                  ...state.data.recommendationRules.types.context_slot.slots,
                  [slotId]: config,
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    updateSlot: (slotId, config) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              context_slot: {
                ...state.data.recommendationRules.types.context_slot,
                slots: {
                  ...state.data.recommendationRules.types.context_slot.slots,
                  [slotId]: config,
                },
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    deleteSlot: (slotId) =>
      set((state) => {
        const newSlots = {
          ...state.data.recommendationRules.types.context_slot.slots,
        }

        delete newSlots[slotId]

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              context_slot: {
                ...state.data.recommendationRules.types.context_slot,
                slots: newSlots,
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    updateDefaults: (defaults) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            defaults,
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    updateHistoryRecentParams: (params) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              history_recent: {
                ...state.data.recommendationRules.types.history_recent,
                params,
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),

    updateSameCategoryParams: (params) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              same_category: {
                ...state.data.recommendationRules.types.same_category,
                params,
              },
            },
          },
        }

        debouncedSaveToIndexedDB(
          newData,
          () => get()._setSyncStatus('saving'),
          () => {
            get()._setSyncStatus('synced')
            syncToPreview(newData)
          }
        )

        return { data: newData, isDirty: true }
      }),
  })
)
