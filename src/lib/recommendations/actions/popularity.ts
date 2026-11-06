import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'

export function createPopularityActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<RecommendationStore, 'setGlobalRanking'> {
  return {
    setGlobalRanking: (urls) => {
      set((state) => {
        const newState = {
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

        saveChange(newState)
        return { data: newState, isDirty: true }
      })
    },
  }
}
