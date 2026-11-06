'use client'

import { useRecommendationStore } from '@/lib/recommendations/store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  Link,
  Layers,
  TrendingUp,
  Clock,
  Megaphone,
} from 'lucide-react'
import { DefaultsEditor } from './recommendation-rules/defaults-editor'
import { AffinityEditor } from './recommendation-rules/affinity-editor'
import { PopularityEditor } from './recommendation-rules/popularity-editor'
import { CampaignEditor } from './recommendation-rules/campaign-editor'
import { SlotsEditor } from './recommendation-rules/slots-editor'
import { HistoryEditor } from './recommendation-rules/history-editor'

export function RecommendationRules() {
  const {
    data,
    addAffinityByCategory,
    removeAffinityByCategory,
    addAffinityByUrl,
    removeAffinityByUrl,
    setGlobalRanking,
    addCampaign,
    removeCampaign,
    addCampaignTarget,
    removeCampaignTarget,
    updateCampaignDescription,
    addSlot,
    updateSlot,
    removeSlot,
    updateDefaults,
    updateHistoryRecentsParams,
    updateSameCategoryParams,
  } = useRecommendationStore()

  const { recommendationRules } = data
  const { categories, products } = data.catalog

  return (
    <div className="space-y-6">
      <Tabs defaultValue="defaults">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="defaults" className="gap-2">
            <Settings className="h-4 w-4" />
            Padrões
          </TabsTrigger>

          <TabsTrigger value="affinity" className="gap-2">
            <Link className="h-4 w-4" />
            Afinidade Manual
          </TabsTrigger>

          <TabsTrigger value="popularity" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Popularidade
          </TabsTrigger>

          <TabsTrigger value="campaign" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Campanha
          </TabsTrigger>

          <TabsTrigger value="slots" className="gap-2">
            <Layers className="h-4 w-4" />
            Slots de Contexto
          </TabsTrigger>

          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="defaults" className="mt-6">
          <DefaultsEditor
            defaults={recommendationRules.defaults}
            sameCategoryParams={recommendationRules.types.same_category.params}
            onUpdateDefaults={updateDefaults}
            onUpdateSameCategoryParams={updateSameCategoryParams}
          />
        </TabsContent>

        <TabsContent value="affinity" className="mt-6">
          <AffinityEditor
            affinityMaps={recommendationRules.types.affinity_manual.maps}
            categories={categories}
            products={products}
            onAddByCategory={addAffinityByCategory}
            onRemoveByCategory={removeAffinityByCategory}
            onAddByUrl={addAffinityByUrl}
            onRemoveByUrl={removeAffinityByUrl}
          />
        </TabsContent>

        <TabsContent value="popularity" className="mt-6">
          <PopularityEditor
            globalRanking={
              recommendationRules.types.popularity_global.ranking.urls
            }
            products={products}
            onSetGlobalRanking={setGlobalRanking}
          />
        </TabsContent>

        <TabsContent value="campaign" className="mt-6">
          <CampaignEditor
            campaigns={recommendationRules.types.campaign.campaigns}
            categories={categories}
            products={products}
            onAddCampaign={addCampaign}
            onDeleteCampaign={removeCampaign}
            onAddCampaignTarget={addCampaignTarget}
            onRemoveCampaignTarget={removeCampaignTarget}
            onUpdateCampaignDescription={updateCampaignDescription}
          />
        </TabsContent>

        <TabsContent value="slots" className="mt-6">
          <SlotsEditor
            slots={recommendationRules.types.context_slot.slots}
            onAddSlot={addSlot}
            onUpdateSlot={updateSlot}
            onDeleteSlot={removeSlot}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryEditor
            params={recommendationRules.types.history_recent.params}
            onUpdate={updateHistoryRecentsParams}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
