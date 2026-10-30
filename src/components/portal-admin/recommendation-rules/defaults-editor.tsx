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
import type { RecommendationDefaults, SameCategoryParams } from './types'

export function DefaultsEditor({
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
