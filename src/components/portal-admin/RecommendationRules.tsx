'use client'

import { useState } from 'react'
import { useRecommendationStore } from '@/lib/recommendations/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Empty } from '@/components/ui/empty'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Plus,
  Trash2,
  Settings,
  Link,
  Layers,
  TrendingUp,
  Clock,
  ChevronUp,
  ChevronDown,
  Megaphone,
  GripVertical,
} from 'lucide-react'
import type {
  AffinityTarget,
  SlotConfig,
  CampaignTarget,
} from '@/lib/recommendations/types'
import { CASCADE_OPTIONS } from '@/lib/recommendations/types'

export function RecommendationRules() {
  const {
    data,
    addAffinityByCategory,
    removeAffinityByCategory,
    addAffinityByUrl,
    removeAffinityByUrl,
    setGlobalRanking,
    addCampaign,
    deleteCampaign,
    addCampaignTarget,
    removeCampaignTarget,
    updateCampaignDescription,
    addSlot,
    updateSlot,
    deleteSlot,
    updateDefaults,
    updateHistoryRecentParams,
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
            onDeleteCampaign={deleteCampaign}
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
            onDeleteSlot={deleteSlot}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistoryEditor
            params={recommendationRules.types.history_recent.params}
            onUpdate={updateHistoryRecentParams}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Defaults Editor
type RecommendationDefaults = ReturnType<
  typeof useRecommendationStore.getState
>['data']['recommendationRules']['defaults']
type SameCategoryParams = { maxCandidates: number }
type HistoryRecentParams = ReturnType<
  typeof useRecommendationStore.getState
>['data']['recommendationRules']['types']['history_recent']['params']

function DefaultsEditor({
  defaults,
  sameCategoryParams,
  onUpdateDefaults,
  onUpdateSameCategoryParams,
}: {
  defaults: RecommendationDefaults
  sameCategoryParams: SameCategoryParams
  onUpdateDefaults: (defaults: RecommendationDefaults) => void
  onUpdateSameCategoryParams: (params: SameCategoryParams) => void
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Configurações Padrão</CardTitle>
          <CardDescription>
            Valores padrão aplicados a todas as recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>Limite de itens</FieldLabel>
              <Input
                type="number"
                value={defaults.limit}
                onChange={(e) =>
                  onUpdateDefaults({
                    ...defaults,
                    limit: parseInt(e.target.value) || 8,
                  })
                }
                min={1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Número máximo de recomendações
              </p>
            </Field>
            <Field>
              <FieldLabel>Mínimo de itens</FieldLabel>
              <Input
                type="number"
                value={defaults.minItems}
                onChange={(e) =>
                  onUpdateDefaults({
                    ...defaults,
                    minItems: parseInt(e.target.value) || 4,
                  })
                }
                min={1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Mínimo de itens obrigatórios
              </p>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Regras de filtragem das recomendações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Excluir URL atual</p>
                <p className="text-sm text-slate-500">
                  Remove o produto atual das recomendações
                </p>
              </div>
              <Switch
                checked={defaults.filters.excludeCurrentUrl}
                onCheckedChange={(checked) =>
                  onUpdateDefaults({
                    ...defaults,
                    filters: {
                      ...defaults.filters,
                      excludeCurrentUrl: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deduplicar</p>
                <p className="text-sm text-slate-500">
                  Evita produtos repetidos
                </p>
              </div>
              <Switch
                checked={defaults.filters.deduplicate}
                onCheckedChange={(checked) =>
                  onUpdateDefaults({
                    ...defaults,
                    filters: { ...defaults.filters, deduplicate: checked },
                  })
                }
              />
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Mesma Categoria</CardTitle>
          <CardDescription>
            Configurações da regra de mesma categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>Máximo de candidatos</FieldLabel>
            <Input
              type="number"
              value={sameCategoryParams.maxCandidates}
              onChange={(e) =>
                onUpdateSameCategoryParams({
                  maxCandidates: parseInt(e.target.value) || 50,
                })
              }
              min={1}
            />
            <p className="text-xs text-slate-500 mt-1">
              Número máximo de produtos a considerar
            </p>
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}

// Affinity Editor
function AffinityEditor({
  affinityMaps,
  categories,
  products,
  onAddByCategory,
  onRemoveByCategory,
  onAddByUrl,
  onRemoveByUrl,
}: {
  affinityMaps: ReturnType<
    typeof useRecommendationStore.getState
  >['data']['recommendationRules']['types']['affinity_manual']['maps']
  categories: string[]
  products: { url: string; name: string }[]
  onAddByCategory: (source: string, target: AffinityTarget) => void
  onRemoveByCategory: (source: string, index: number) => void
  onAddByUrl: (source: string, target: AffinityTarget) => void
  onRemoveByUrl: (source: string, index: number) => void
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addType, setAddType] = useState<'category' | 'url'>('category')
  const [sourceValue, setSourceValue] = useState('')
  const [targetType, setTargetType] = useState<'url' | 'category'>('category')
  const [targetValue, setTargetValue] = useState('')
  const [weight, setWeight] = useState(80)

  const handleAdd = () => {
    const target: AffinityTarget = { targetType, targetId: targetValue, weight }
    if (addType === 'category') {
      onAddByCategory(sourceValue, target)
    } else {
      onAddByUrl(sourceValue, target)
    }
    setAddDialogOpen(false)
    setSourceValue('')
    setTargetValue('')
    setWeight(80)
  }

  const openAddDialog = (type: 'category' | 'url') => {
    setAddType(type)
    setAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Afinidade por Categoria</CardTitle>
              <CardDescription>
                Define relações entre categorias de origem e destino
              </CardDescription>
            </div>
            <Button
              onClick={() => openAddDialog('category')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(affinityMaps.byCategory).length === 0 ? (
            <Empty
              title="Nenhuma afinidade por categoria"
              description="Adicione regras de afinidade entre categorias"
            />
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(affinityMaps.byCategory).map(
                ([source, targets]) => (
                  <AccordionItem key={source} value={source}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{source}</Badge>
                        <span className="text-slate-500 text-sm">
                          ({targets.length} regras)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {targets.map((target, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md bg-slate-50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">
                                {target.targetType === 'category'
                                  ? 'Categoria:'
                                  : 'URL:'}
                              </span>
                              <span className="font-medium">
                                {target.targetId}
                              </span>
                              <Badge variant="secondary">
                                peso: {target.weight}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveByCategory(source, index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Afinidade por URL</CardTitle>
              <CardDescription>
                Define relações entre URLs específicas
              </CardDescription>
            </div>
            <Button
              onClick={() => openAddDialog('url')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(affinityMaps.byUrl).length === 0 ? (
            <Empty
              title="Nenhuma afinidade por URL"
              description="Adicione regras de afinidade entre URLs"
            />
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(affinityMaps.byUrl).map(([source, targets]) => {
                const product = products.find((p) => p.url === source)
                return (
                  <AccordionItem key={source} value={source}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium truncate">
                          {product?.name || source}
                        </span>
                        <span className="text-slate-500 text-sm shrink-0">
                          ({targets.length} regras)
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        {targets.map((target, index) => {
                          const targetProduct = products.find(
                            (p) => p.url === target.targetId
                          )
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-md bg-slate-50"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm text-slate-500 shrink-0">
                                  {target.targetType === 'category'
                                    ? 'Categoria:'
                                    : 'URL:'}
                                </span>
                                <span className="font-medium truncate">
                                  {target.targetType === 'url'
                                    ? targetProduct?.name || target.targetId
                                    : target.targetId}
                                </span>
                                <Badge variant="secondary" className="shrink-0">
                                  peso: {target.weight}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveByUrl(source, index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Add Affinity Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Adicionar Afinidade por{' '}
              {addType === 'category' ? 'Categoria' : 'URL'}
            </DialogTitle>
            <DialogDescription>
              Configure a relação de afinidade entre origem e destino
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>
                Origem ({addType === 'category' ? 'Categoria' : 'URL'})
              </FieldLabel>
              {addType === 'category' ? (
                <Select value={sourceValue} onValueChange={setSourceValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={sourceValue} onValueChange={setSourceValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a URL de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.url} value={p.url}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field>
              <FieldLabel>Tipo de Destino</FieldLabel>
              <Select
                value={targetType}
                onValueChange={(v) => setTargetType(v as 'url' | 'category')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Destino</FieldLabel>
              {targetType === 'category' ? (
                <Select value={targetValue} onValueChange={setTargetValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={targetValue} onValueChange={setTargetValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a URL de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.url} value={p.url}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field>
              <FieldLabel>Peso (0-100)</FieldLabel>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                min={0}
                max={100}
              />
              <p className="text-xs text-slate-500 mt-1">
                Quanto maior o peso, maior a prioridade
              </p>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!sourceValue || !targetValue}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Popularity Editor
function PopularityEditor({
  globalRanking,
  products,
  onSetGlobalRanking,
}: {
  globalRanking: string[]
  products: { url: string; name: string; category: string }[]
  onSetGlobalRanking: (urls: string[]) => void
}) {
  const moveItem = (arr: string[], from: number, to: number): string[] => {
    const result = [...arr]
    const [removed] = result.splice(from, 1)
    result.splice(to, 0, removed)
    return result
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Popularidade Global</CardTitle>
          <CardDescription>
            Ranking geral de todos os produtos ordenados por popularidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              onValueChange={(url) => {
                if (!globalRanking.includes(url))
                  onSetGlobalRanking([...globalRanking, url])
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Adicionar produto ao ranking" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((p) => !globalRanking.includes(p.url))
                  .map((p) => (
                    <SelectItem key={p.url} value={p.url}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {globalRanking.length === 0 ? (
              <Empty
                title="Ranking vazio"
                description="Adicione produtos ao ranking global"
              />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {globalRanking.map((url, index) => {
                  const product = products.find((p) => p.url === url)
                  return (
                    <div
                      key={url}
                      className="flex items-center gap-2 p-2 rounded-md bg-slate-50"
                    >
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => {
                            if (index > 0)
                              onSetGlobalRanking(
                                moveItem(globalRanking, index, index - 1)
                              )
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => {
                            if (index < globalRanking.length - 1)
                              onSetGlobalRanking(
                                moveItem(globalRanking, index, index + 1)
                              )
                          }}
                          disabled={index === globalRanking.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-medium text-slate-500 w-6">
                        {index + 1}.
                      </span>
                      <GripVertical className="h-4 w-4 text-slate-400" />
                      <span className="flex-1 truncate">
                        {product?.name || url}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onSetGlobalRanking(
                            globalRanking.filter((u) => u !== url)
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Campaign Editor
function CampaignEditor({
  campaigns,
  categories,
  products,
  onAddCampaign,
  onDeleteCampaign,
  onAddCampaignTarget,
  onRemoveCampaignTarget,
  onUpdateCampaignDescription,
}: {
  campaigns: Record<string, { description?: string; targets: CampaignTarget[] }>
  categories: string[]
  products: { url: string; name: string }[]
  onAddCampaign: (campaignId: string, description?: string) => void
  onDeleteCampaign: (campaignId: string) => void
  onAddCampaignTarget: (campaignId: string, target: CampaignTarget) => void
  onRemoveCampaignTarget: (campaignId: string, targetIndex: number) => void
  onUpdateCampaignDescription: (campaignId: string, description: string) => void
}) {
  const [addCampaignOpen, setAddCampaignOpen] = useState(false)
  const [newCampaignId, setNewCampaignId] = useState('')
  const [newCampaignDescription, setNewCampaignDescription] = useState('')
  const [addTargetDialogOpen, setAddTargetDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [targetType, setTargetType] = useState<'url' | 'category'>('category')
  const [targetValue, setTargetValue] = useState('')
  const [targetWeight, setTargetWeight] = useState(80)

  const handleAddCampaign = () => {
    if (newCampaignId.trim()) {
      onAddCampaign(
        newCampaignId.trim(),
        newCampaignDescription.trim() || undefined
      )
      setAddCampaignOpen(false)
      setNewCampaignId('')
      setNewCampaignDescription('')
    }
  }

  const handleAddTarget = () => {
    if (selectedCampaign && targetValue) {
      onAddCampaignTarget(selectedCampaign, {
        targetType,
        targetId: targetValue,
        weight: targetWeight,
      })
      setAddTargetDialogOpen(false)
      setTargetValue('')
      setTargetWeight(80)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Campanhas de Recomendação</CardTitle>
              <CardDescription>
                Configure recomendações personalizadas por campanha
                (utm_campaign).
              </CardDescription>
            </div>
            <Button
              onClick={() => setAddCampaignOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(campaigns).length === 0 ? (
            <Empty
              title="Nenhuma campanha configurada"
              description="Adicione campanhas para criar recomendações personalizadas baseadas em utm_campaign"
            />
          ) : (
            <Accordion type="multiple" className="w-full">
              {Object.entries(campaigns).map(([campaignId, campaign]) => (
                <AccordionItem key={campaignId} value={campaignId}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {campaignId}
                      </Badge>
                      <span className="text-slate-500 text-sm">
                        ({campaign.targets.length}{' '}
                        {campaign.targets.length === 1 ? 'regra' : 'regras'})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-4">
                      <div className="flex items-center gap-2">
                        <Input
                          value={campaign.description || ''}
                          onChange={(e) =>
                            onUpdateCampaignDescription(
                              campaignId,
                              e.target.value
                            )
                          }
                          placeholder="Descrição da campanha..."
                          className="max-w-md text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCampaign(campaignId)
                            setAddTargetDialogOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar Regra
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteCampaign(campaignId)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {campaign.targets.length === 0 ? (
                        <p className="text-sm text-slate-500 py-2">
                          Nenhuma regra configurada.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {campaign.targets.map((target, index) => {
                            const product =
                              target.targetType === 'url'
                                ? products.find(
                                    (p) => p.url === target.targetId
                                  )
                                : null
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-md bg-slate-50"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant={
                                      target.targetType === 'category'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                  >
                                    {target.targetType === 'category'
                                      ? 'Categoria'
                                      : 'URL'}
                                  </Badge>
                                  <span className="font-medium">
                                    {target.targetType === 'url'
                                      ? product?.name || target.targetId
                                      : target.targetId}
                                  </span>
                                  <Badge variant="outline">
                                    peso: {target.weight}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    onRemoveCampaignTarget(campaignId, index)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Add Campaign Dialog */}
      <Dialog open={addCampaignOpen} onOpenChange={setAddCampaignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
            <DialogDescription>
              Crie uma nova campanha de recomendação. O ID será usado para
              corresponder ao valor de utm_campaign.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>ID da Campanha (utm_campaign)</FieldLabel>
              <Input
                value={newCampaignId}
                onChange={(e) => setNewCampaignId(e.target.value)}
                placeholder="ex: black-friday-2024"
              />
            </Field>
            <Field>
              <FieldLabel>Descrição (opcional)</FieldLabel>
              <Input
                value={newCampaignDescription}
                onChange={(e) => setNewCampaignDescription(e.target.value)}
                placeholder="ex: Campanha de Black Friday 2024"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCampaignOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddCampaign}
              disabled={!newCampaignId.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Criar Campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Target Dialog */}
      <Dialog open={addTargetDialogOpen} onOpenChange={setAddTargetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Regra à Campanha</DialogTitle>
            <DialogDescription>
              Adicione uma categoria ou URL específica para recomendar nesta
              campanha
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>Tipo de Destino</FieldLabel>
              <Select
                value={targetType}
                onValueChange={(v) => setTargetType(v as 'url' | 'category')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="url">URL/SKU</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Destino</FieldLabel>
              {targetType === 'category' ? (
                <Select value={targetValue} onValueChange={setTargetValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select value={targetValue} onValueChange={setTargetValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.url} value={p.url}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field>
              <FieldLabel>Peso (0-100)</FieldLabel>
              <Input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseInt(e.target.value) || 0)}
                min={0}
                max={100}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTargetDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddTarget}
              disabled={!targetValue}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Slots Editor
function SlotsEditor({
  slots,
  onAddSlot,
  onUpdateSlot,
  onDeleteSlot,
}: {
  slots: Record<string, SlotConfig>
  onAddSlot: (slotId: string, config: SlotConfig) => void
  onUpdateSlot: (slotId: string, config: SlotConfig) => void
  onDeleteSlot: (slotId: string) => void
}) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newSlotId, setNewSlotId] = useState('')
  const [newSlotConfig, setNewSlotConfig] = useState<SlotConfig>({
    limit: 8,
    minItems: 4,
    cascade: ['popularity_global'],
  })

  const handleAdd = () => {
    if (newSlotId.trim()) {
      onAddSlot(newSlotId.trim(), newSlotConfig)
      setAddDialogOpen(false)
      setNewSlotId('')
      setNewSlotConfig({
        limit: 8,
        minItems: 4,
        cascade: ['popularity_global'],
      })
    }
  }

  const moveCascadeUp = (slotId: string, index: number) => {
    const cascade = [...slots[slotId].cascade]
    if (index > 0) {
      const temp = cascade[index]
      cascade[index] = cascade[index - 1]
      cascade[index - 1] = temp
      onUpdateSlot(slotId, { ...slots[slotId], cascade })
    }
  }

  const moveCascadeDown = (slotId: string, index: number) => {
    const cascade = [...slots[slotId].cascade]
    if (index < cascade.length - 1) {
      const temp = cascade[index]
      cascade[index] = cascade[index + 1]
      cascade[index + 1] = temp
      onUpdateSlot(slotId, { ...slots[slotId], cascade })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Slots de Contexto</h3>
          <p className="text-sm text-slate-500">
            Configure os slots de exibição com suas cascatas de regras
          </p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Slot
        </Button>
      </div>

      {Object.keys(slots).length === 0 ? (
        <Empty
          title="Nenhum slot configurado"
          description="Adicione slots de contexto para diferentes páginas"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(slots).map(([slotId, config]) => (
            <Card key={slotId} className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{slotId}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteSlot(slotId)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="text-xs">Limite</FieldLabel>
                    <Input
                      type="number"
                      value={config.limit}
                      onChange={(e) =>
                        onUpdateSlot(slotId, {
                          ...config,
                          limit: parseInt(e.target.value) || 8,
                        })
                      }
                      min={1}
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-xs">Mínimo</FieldLabel>
                    <Input
                      type="number"
                      value={config.minItems}
                      onChange={(e) =>
                        onUpdateSlot(slotId, {
                          ...config,
                          minItems: parseInt(e.target.value) || 4,
                        })
                      }
                      min={1}
                    />
                  </Field>
                </div>
                <div>
                  <FieldLabel className="text-xs mb-2 block">
                    Cascata de Regras (ordem de prioridade)
                  </FieldLabel>
                  <div className="space-y-1">
                    {config.cascade.map((item, index) => {
                      const option = CASCADE_OPTIONS.find(
                        (o) => o.value === item
                      )
                      return (
                        <div
                          key={item}
                          className="flex items-center gap-2 p-2 rounded-md bg-slate-50"
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={() => moveCascadeUp(slotId, index)}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={() => moveCascadeDown(slotId, index)}
                              disabled={index === config.cascade.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-xs font-medium text-slate-500 w-4">
                            {index + 1}.
                          </span>
                          <span className="flex-1 text-sm">
                            {option?.label || item}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              onUpdateSlot(slotId, {
                                ...config,
                                cascade: config.cascade.filter(
                                  (c) => c !== item
                                ),
                              })
                            }
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-2">
                    <Select
                      onValueChange={(value) => {
                        if (!config.cascade.includes(value))
                          onUpdateSlot(slotId, {
                            ...config,
                            cascade: [...config.cascade, value],
                          })
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Adicionar regra..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CASCADE_OPTIONS.filter(
                          (o) => !config.cascade.includes(o.value)
                        ).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Slot de Contexto</DialogTitle>
            <DialogDescription>
              Configure um novo slot para exibição de recomendações
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>ID do Slot</FieldLabel>
              <Input
                value={newSlotId}
                onChange={(e) => setNewSlotId(e.target.value)}
                placeholder="ex: pdp_related, home_trending"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Limite</FieldLabel>
                <Input
                  type="number"
                  value={newSlotConfig.limit}
                  onChange={(e) =>
                    setNewSlotConfig((prev) => ({
                      ...prev,
                      limit: parseInt(e.target.value) || 8,
                    }))
                  }
                  min={1}
                />
              </Field>
              <Field>
                <FieldLabel>Mínimo</FieldLabel>
                <Input
                  type="number"
                  value={newSlotConfig.minItems}
                  onChange={(e) =>
                    setNewSlotConfig((prev) => ({
                      ...prev,
                      minItems: parseInt(e.target.value) || 4,
                    }))
                  }
                  min={1}
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!newSlotId.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// History Editor
function HistoryEditor({
  params,
  onUpdate,
}: {
  params: HistoryRecentParams
  onUpdate: (params: HistoryRecentParams) => void
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Configurações do Histórico Recente</CardTitle>
        <CardDescription>
          Ajuste os parâmetros para recomendações baseadas no histórico do
          usuário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>Máximo de URLs armazenadas</FieldLabel>
              <Input
                type="number"
                value={params.maxRecentUrlsStored}
                onChange={(e) =>
                  onUpdate({
                    ...params,
                    maxRecentUrlsStored: parseInt(e.target.value) || 20,
                  })
                }
                min={1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Quantidade máxima de URLs recentes a manter
              </p>
            </Field>
            <Field>
              <FieldLabel>URLs recentes a usar</FieldLabel>
              <Input
                type="number"
                value={params.takeFromRecentUrls}
                onChange={(e) =>
                  onUpdate({
                    ...params,
                    takeFromRecentUrls: parseInt(e.target.value) || 6,
                  })
                }
                min={1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Quantas URLs recentes usar para recomendações
              </p>
            </Field>
            <Field>
              <FieldLabel>Categorias recentes a usar</FieldLabel>
              <Input
                type="number"
                value={params.takeFromRecentCategories}
                onChange={(e) =>
                  onUpdate({
                    ...params,
                    takeFromRecentCategories: parseInt(e.target.value) || 2,
                  })
                }
                min={1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Quantas categorias recentes usar como fallback
              </p>
            </Field>
          </FieldGroup>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>URLs por categoria expandida</FieldLabel>
              <Input
                type="number"
                value={params.expandCategoryToUrlsTake}
                onChange={(e) =>
                  onUpdate({
                    ...params,
                    expandCategoryToUrlsTake: parseInt(e.target.value) || 5,
                  })
                }
                min={1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Quantas URLs pegar ao expandir uma categoria
              </p>
            </Field>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
              <div>
                <p className="font-medium">Usar categorias se vazio</p>
                <p className="text-sm text-slate-500">
                  Se não houver URLs recentes, usar categorias recentes
                </p>
              </div>
              <Switch
                checked={params.ifEmptyThenUseRecentCategories}
                onCheckedChange={(checked) =>
                  onUpdate({
                    ...params,
                    ifEmptyThenUseRecentCategories: checked,
                  })
                }
              />
            </div>
          </FieldGroup>
        </div>
      </CardContent>
    </Card>
  )
}
