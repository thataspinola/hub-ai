import type { RecommendationStore } from '../store-types'
import type { RecommendationActionContext } from './types'

export function createCampaignActions({
  set,
  saveChange,
}: RecommendationActionContext): Pick<
  RecommendationStore,
  | 'addCampaign'
  | 'removeCampaign'
  | 'addCampaignTarget'
  | 'removeCampaignTarget'
  | 'updateCampaignDescription'
> {
  return {
    addCampaign: (campaignId, description) =>
      set((state) => {
        if (state.data.recommendationRules.types.campaign.campaigns[campaignId])
          return state

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
                  [campaignId]: { description: description || '', targets: [] },
                },
              },
            },
          },
        }

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),

    removeCampaign: (campaignId) =>
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

        saveChange(newData)
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

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),

    removeCampaignTarget: (campaignId, targetIndex) =>
      set((state) => {
        const currentCampaign =
          state.data.recommendationRules.types.campaign.campaigns[campaignId]

        if (!currentCampaign) return state

        const newTargets = currentCampaign.targets.filter(
          (_, index) => index !== targetIndex
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

        saveChange(newData)
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

        saveChange(newData)
        return { data: newData, isDirty: true }
      }),
  }
}
