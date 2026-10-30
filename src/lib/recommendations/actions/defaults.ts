import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'

export function createDefaultsActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  'updateDefaults' | 'updateHistoryRecentParams' | 'updateSameCategoryParams'
> {
  return {
    updateDefaults: (defaults) =>
      set((state) => {
        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            defaults,
          },
        }

        saveChange(newData)

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

        saveChange(newData)

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

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),
  }
}
