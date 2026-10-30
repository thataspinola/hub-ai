'use client'

import { create } from 'zustand'
import type { RecommendationData } from './types'
import type { RecommendationStore } from './store-types'
import { createEmptyData } from './data-model'
import {
  createRecommendationEffects,
  type RecommendationEffects,
} from './persistence'
import {
  indexedDBRecommendationRepository,
  browserRecommendationPreview,
} from './browser-adapters'
import { createLifecycleActions } from './actions/lifecycle'
import { createCatalogActions } from './actions/catalog'
import { createAffinityActions } from './actions/affinity'
import { createPopularityActions } from './actions/popularity'
import { createCampaignActions } from './actions/campaign'
import { createSlotsActions } from './actions/slots'
import { createDefaultsActions } from './actions/defaults'

export function createRecommendationStore(
  effects: RecommendationEffects = createRecommendationEffects(
    indexedDBRecommendationRepository,
    browserRecommendationPreview,
  ),
) {
  return create<RecommendationStore>((set, get) => {
    const saveChange = (data: RecommendationData) =>
      effects.scheduleSave(
        data,
        () => get()._setSyncStatus('saving'),
        () => {
          get()._setSyncStatus('synced')
          effects.publish(data)
        },
        () => get()._setSyncStatus('error'),
      )
    const context = {
      set,
      get,
      saveChange,
      load: effects.load,
      publish: effects.publish,
    }
    return {
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
      ...createLifecycleActions(context),
      ...createCatalogActions(context),
      ...createAffinityActions(context),
      ...createPopularityActions(context),
      ...createCampaignActions(context),
      ...createSlotsActions(context),
      ...createDefaultsActions(context),
    }
  })
}

export const useRecommendationStore = createRecommendationStore()
