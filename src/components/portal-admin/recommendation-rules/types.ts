import type { RecommendationData } from '@/lib/recommendations/types'

export type RecommendationDefaults =
  RecommendationData['recommendationRules']['defaults']
export type SameCategoryParams =
  RecommendationData['recommendationRules']['types']['same_category']['params']
export type HistoryRecentParams =
  RecommendationData['recommendationRules']['types']['history_recent']['params']
