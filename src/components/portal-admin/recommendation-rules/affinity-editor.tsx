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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Plus, Trash2 } from 'lucide-react'
import type { AffinityTarget } from '@/lib/recommendations/types'

export function AffinityEditor({
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
                ),
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
                            (p) => p.url === target.targetId,
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
