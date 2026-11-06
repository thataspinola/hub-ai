import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'

export function createAffinityActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  | 'addAffinityByCategory'
  | 'removeAffinityByCategory'
  | 'addAffinityByUrl'
  | 'removeAffinityByUrl'
> {
  return {
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

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),

    removeAffinityByCategory: (sourceCategory, targetIndex) =>
      set((state) => {
        const currentTargets =
          state.data.recommendationRules.types.affinity_manual.maps.byCategory[
            sourceCategory
          ] || []

        const newTargets = currentTargets.filter(
          (_, index) => index !== targetIndex
        )

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

        saveChange(newData)
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

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),

    removeAffinityByUrl: (sourceUrl, targetIndex) =>
      set((state) => {
        const currentTargets =
          state.data.recommendationRules.types.affinity_manual.maps.byUrl[
            sourceUrl
          ] || []

        const newTargets = currentTargets.filter(
          (_, index) => index !== targetIndex
        )

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

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),
  }
}
