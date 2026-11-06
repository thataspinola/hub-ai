'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { SlotConfig } from '@/lib/recommendations/types'
import { CASCADE_OPTIONS } from '@/lib/recommendations/types'

export function SlotsEditor({
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
