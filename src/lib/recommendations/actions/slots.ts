import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'

export function createSlotsActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  'addSlot' | 'updateSlot' | 'deleteSlot'
> {
  return {
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

        saveChange(newData)

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

        saveChange(newData)

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

        saveChange(newData)

        return { data: newData, isDirty: true }
      }),
  }
}
