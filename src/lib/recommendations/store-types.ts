import type {
  RecommendationData,
  Product,
  AffinityTarget,
  SlotConfig,
  CampaignTarget,
} from './types'

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'synced' | 'error'

export interface RecommendationStore {
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
    target: AffinityTarget,
  ) => void

  removeAffinityByCategory: (
    sourceCategory: string,
    targetIndex: number,
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
    defaults: RecommendationData['recommendationRules']['defaults'],
  ) => void

  // History Recent params
  updateHistoryRecentParams: (
    params: RecommendationData['recommendationRules']['types']['history_recent']['params'],
  ) => void

  // Same Category params
  updateSameCategoryParams: (
    params: RecommendationData['recommendationRules']['types']['same_category']['params'],
  ) => void

  // Internal
  _setSyncStatus: (status: SyncStatus) => void
}
