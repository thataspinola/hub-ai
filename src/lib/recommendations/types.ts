// Types for the Recommendation Engine Admin Panel

export interface Price {
  prefix?: string
  value: number
  currency: string
}

export interface CTA {
  text: string
  style: 'primary' | 'secondary'
}

export interface Badge {
  text: string
  variant: 'success' | 'warning' | 'info' | 'default'
}

export interface Product {
  id?: string
  url: string
  name: string
  category: string
  description: string
  imageUrl: string
  price?: Price
  cta?: CTA
  badges?: Badge[]
}

export interface Catalog {
  products: Product[]
  categories: string[]
}

// Affinity types
export interface AffinityTarget {
  targetType: 'url' | 'category'
  targetId: string
  weight: number
}

export interface AffinityMaps {
  byCategory: Record<string, AffinityTarget[]>
  byUrl: Record<string, AffinityTarget[]>
}

export interface AffinityManual {
  description: string
  maps: AffinityMaps
  params: {
    expandCategoryToUrlsTake: number
    sortBy: string
  }
  metadata: {
    source: string
    updatedAt: string
  }
}

// History Recent
export interface HistoryRecent {
  description: string
  params: {
    maxRecentUrlsStored: number
    takeFromRecentUrls: number
    ifEmptyThenUseRecentCategories: boolean
    takeFromRecentCategories: number
    expandCategoryToUrlsTake: number
  }
}

// Popularity Global
export interface PopularityGlobal {
  description: string
  ranking: {
    urls: string[]
    windowDays: number
    metric: string
  }
  metadata: {
    source: string
    computedAt: string
  }
}

// Same Category
export interface SameCategory {
  description: string
  params: {
    maxCandidates: number
  }
}

// Campaign Target (similar to AffinityTarget)
export interface CampaignTarget {
  targetType: 'url' | 'category'
  targetId: string
  weight: number
}

// Campaign Rule
export interface CampaignRule {
  description?: string
  targets: CampaignTarget[]
}

// Campaign Recommendation
export interface CampaignRecommendation {
  description: string
  campaigns: Record<string, CampaignRule>
  params: {
    expandCategoryToUrlsTake: number
    sessionStorageKey: string
  }
}

// Context Slot
export interface SlotConfig {
  limit: number
  minItems: number
  cascade: string[]
}

export interface ContextSlot {
  description: string
  slots: Record<string, SlotConfig>
}

// Profile Static
export interface ProfileConfig {
  when: {
    hasHistory: boolean
  }
  useCascade: string[]
}

export interface ProfileStatic {
  description: string
  profiles: Record<string, ProfileConfig>
}

// Recommendation Rules
export interface RecommendationRules {
  defaults: {
    limit: number
    minItems: number
    filters: {
      excludeCurrentUrl: boolean
      deduplicate: boolean
    }
  }
  types: {
    same_category: SameCategory
    affinity_manual: AffinityManual
    history_recent: HistoryRecent
    popularity_global: PopularityGlobal
    campaign: CampaignRecommendation
    context_slot: ContextSlot
    profile_static: ProfileStatic
  }
}

// Full Data Structure
export interface RecommendationData {
  version: string
  generatedFrom: string
  schemaVersion: string
  catalog: Catalog
  recommendationRules: RecommendationRules
}

// Rule types for UI
export type RuleType =
  | 'same_category'
  | 'affinity_manual'
  | 'history_recent'
  | 'popularity_global'
  | 'campaign'
  | 'context_slot'
  | 'profile_static'

export const RULE_TYPES: {
  value: RuleType
  label: string
  description: string
}[] = [
  {
    value: 'same_category',
    label: 'Mesma Categoria',
    description: 'Recomenda produtos da mesma categoria do item atual',
  },
  {
    value: 'affinity_manual',
    label: 'Afinidade Manual',
    description: 'Afinidade curada entre categorias e/ou URLs específicas',
  },
  {
    value: 'history_recent',
    label: 'Histórico Recente',
    description: 'Recomenda baseado no histórico do usuário',
  },
  {
    value: 'popularity_global',
    label: 'Popularidade Global',
    description: 'Ranking global de URLs mais populares',
  },
  {
    value: 'campaign',
    label: 'Campanha',
    description: 'Recomenda produtos baseados no ID da campanha (utm_campaign)',
  },
  {
    value: 'context_slot',
    label: 'Slots de Contexto',
    description: 'Config por slot/página: define cascata e limites',
  },
  {
    value: 'profile_static',
    label: 'Perfil Estático',
    description: 'Escolhe cascata com base em perfil simples',
  },
]

export const CASCADE_OPTIONS = [
  { value: 'history_recent', label: 'Histórico Recente' },
  { value: 'affinity_manual', label: 'Afinidade Manual' },
  { value: 'same_category', label: 'Mesma Categoria' },
  { value: 'campaign', label: 'Campanha' },
  { value: 'popularity_global', label: 'Popularidade Global' },
]
