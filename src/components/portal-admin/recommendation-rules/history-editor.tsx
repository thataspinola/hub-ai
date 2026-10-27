'use client'

import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import type { HistoryRecentParams } from './types'

export function HistoryEditor({
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
