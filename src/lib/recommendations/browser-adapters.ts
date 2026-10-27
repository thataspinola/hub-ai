'use client'

import { loadFromIndexedDB, saveToIndexedDB } from './indexed-db'
import type { RecommendationData } from './types'
import type {
  RecommendationRepository,
  RecommendationPreview,
} from './persistence'

export const indexedDBRecommendationRepository: RecommendationRepository = {
  load: () => loadFromIndexedDB<Partial<RecommendationData>>(),
  save: (data) => saveToIndexedDB(data),
}

let broadcastChannel: BroadcastChannel | null = null

export const browserRecommendationPreview: RecommendationPreview = {
  publish(data) {
    if (typeof window === 'undefined') return
    const jsonData = JSON.stringify(data, null, 2)
    localStorage.setItem('recommendation-preview-data', jsonData)
    if (typeof BroadcastChannel === 'undefined') return
    broadcastChannel ??= new BroadcastChannel('recommendation-preview-sync')
    broadcastChannel.postMessage({ type: 'DATA_UPDATED', payload: jsonData })
  },
}
