import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'
import type { RecommendationData } from '../types'
import { createEmptyData, migrateData } from '../data-model'

export function createLifecycleActions({
  set,
  get,
  saveChange,
  load,
  publish,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  'loadFromStorage' | 'setData' | 'resetData' | 'importData' | 'exportData'
> {
  return {
    loadFromStorage: async () => {
      set({ isLoading: true })

      try {
        const storedData = await load()

        if (storedData) {
          const migratedData = migrateData(storedData)

          set({
            data: migratedData,
            isDirty: false,
            isLoading: false,
            syncStatus: 'saved',
          })

          publish(migratedData)
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

      saveChange(data)
    },

    resetData: () => {
      const newData = createEmptyData()
      set({ data: newData, isDirty: false })

      saveChange(newData)
    },

    importData: (json) => {
      try {
        const parsed = JSON.parse(json) as Partial<RecommendationData>

        if (!parsed.catalog || !parsed.recommendationRules) {
          throw new Error('Invalid data structure')
        }

        const migratedData = migrateData(parsed)
        set({ data: migratedData, isDirty: false })

        saveChange(migratedData)

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
  }
}
