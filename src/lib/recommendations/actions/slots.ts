import type { RecommendationStore } from '../store-types'
import { SlotConfig } from '../types'
import type { RecommendationActionContext } from './types'

export function createSlotsActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  'addSlot' | 'updateSlot' | 'removeSlot'
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

    updateSlot: (slotId: string, config: SlotConfig) => {
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
      })
    },

    removeSlot: (slotId) =>
      set((state) => {
        const remainingSlots = {
          ...state.data.recommendationRules.types.context_slot.slots,
        }
        delete remainingSlots[slotId]

        const newData = {
          ...state.data,
          recommendationRules: {
            ...state.data.recommendationRules,
            types: {
              ...state.data.recommendationRules.types,
              context_slot: {
                ...state.data.recommendationRules.types.context_slot,
                slots: remainingSlots,
              },
            },
          },
        }

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),
  }
}
