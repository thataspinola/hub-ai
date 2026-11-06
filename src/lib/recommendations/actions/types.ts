import { StoreApi } from 'zustand'
import type { RecommendationStore } from '../store-types'
import type { RecommendationData } from '../types'
import type { RecommendationEffects } from '../persistence'

export interface RecommendationActionContext {
  set: StoreApi<RecommendationStore>['setState']
  get: StoreApi<RecommendationStore>['getState']
  saveChange(data: RecommendationData): void
  load: RecommendationEffects['load']
  publish: RecommendationEffects['publish']
}
