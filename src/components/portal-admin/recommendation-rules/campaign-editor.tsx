'use client'

import { useState } from 'react'
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
import type { CampaignTarget } from '@/lib/recommendations/types'

export function CampaignEditor({
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
        newCampaignDescription.trim() || undefined,
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
                              e.target.value,
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
                                    (p) => p.url === target.targetId,
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
