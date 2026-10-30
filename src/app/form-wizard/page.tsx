'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useHydrated } from '@/lib/use-hydrated'
import {
  FileText,
  Edit,
  Copy,
  Trash2,
  Plus,
  Calendar,
  Layers,
  Eye,
  Type,
  AlignLeft,
  TextCursorInput,
  ChevronDown,
  Circle,
  CheckSquare,
  GitFork,
  ExternalLink,
  Zap,
  CreditCard,
  Award as IdCard,
  Building2,
  Phone,
  AlertTriangle,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  getFormsIndex,
  getFormBySlug,
  deleteForm,
  duplicateForm,
} from '@/lib/form-wizard/forms-storage'
import type { FormIndexEntry, Form, ElementType } from '@/lib/form-wizard/types'
import { cn } from '@/lib/utils'

const elementIcons: Record<string, React.ElementType> = {
  TITLE: Type,
  PARAGRAPH: AlignLeft,
  TEXT_INPUT: TextCursorInput,
  SELECT: ChevronDown,
  RADIO: Circle,
  CHECKBOX: CheckSquare,
  SUCCESS_SCREEN: AlertTriangle,
  GO_TO_CHECKOUT: AlertTriangle,
  CONDITIONAL_ROUTE: GitFork,
  NAVIGATION: ExternalLink,
  SERVICE_CALL: Zap,
  PLANS: CreditCard,
  CPF_INPUT: IdCard,
  CNPJ_INPUT: Building2,
  PHONE_INPUT: Phone,
}

const elementLabels: Record<string, string> = {
  TITLE: 'Título',
  PARAGRAPH: 'Parágrafo',
  TEXT_INPUT: 'Campo de Texto',
  SELECT: 'Select',
  RADIO: 'Radio',
  CHECKBOX: 'Checkbox',
  CONDITIONAL_ROUTE: 'Rota Condicional',
  NAVIGATION: 'Navegação',
  SERVICE_CALL: 'Chamada de Serviço',
  PLANS: 'Planos',
  CPF_INPUT: 'CPF',
  CNPJ_INPUT: 'CNPJ',
  PHONE_INPUT: 'Telefone',
}

const categoryColors: Record<string, string> = {
  content: 'bg-blue-100 text-blue-700 border-blue-200',
  fields: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'special-fields': 'bg-violet-100 text-violet-700 border-violet-200',
  actions: 'bg-amber-100 text-amber-700 border-amber-200',
  plans: 'bg-pink-100 text-pink-700 border-pink-200',
}

function getElementCategory(type: ElementType): string {
  if (['TITLE', 'PARAGRAPH'].includes(type)) return 'content'

  if (['TEXT_INPUT', 'SELECT', 'RADIO', 'CHECKBOX'].includes(type))
    return 'fields'

  if (['CPF_INPUT', 'CNPJ_INPUT', 'PHONE_INPUT'].includes(type))
    return 'special-fields'

  if (['CONDITIONAL_ROUTE', 'NAVIGATION', 'SERVICE_CALL'].includes(type))
    return 'actions'

  if (type === 'PLANS') return 'plans'

  return 'content'
}

function getElementPreview(element: {
  type: ElementType
  config: unknown
}): string {
  const config = element.config as Record<string, unknown>

  if (element.type === 'TITLE' || element.type === 'PARAGRAPH')
    return (config.text as string) || ''

  if (element.type === 'CONDITIONAL_ROUTE') {
    const field = (config.fieldName as string) || '?'
    const target = (config.targetStepSlug as string) || '?'
    return `${field} → /${target}`
  }

  if (element.type === 'NAVIGATION') return (config.label as string) || ''
  if (element.type === 'SERVICE_CALL') return (config.service as string) || ''
  if ('label' in config) return (config.label as string) || ''
  return ''
}

export default function FormWizardListPage() {
  const hydrated = useHydrated()
  return hydrated ? <FormWizardList /> : <p>Loading forms...</p>
}

function FormWizardList() {
  const [forms, setForms] = useState<FormIndexEntry[]>(() =>
    getFormsIndex().sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  )

  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [previewForm, setPreviewForm] = useState<Form | null>(null)

  const loadForms = () => {
    const index = getFormsIndex()

    setForms(
      index.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    )

  }

  const handleDuplicate = (slug: string) => {
    const newForm = duplicateForm(slug)

    if (newForm) {
      loadForms()
    }
  }

  const handleDelete = () => {
    if (deleteSlug) {
      deleteForm(deleteSlug)
      loadForms()
      setDeleteSlug(null)
    }
  }

  const handlePreview = (slug: string) => {
    const form = getFormBySlug(slug)
    if (form) setPreviewForm(form)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Form Wizard Builder</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie seus formulários wizard
            </p>
          </div>
          <Button asChild>
            <Link href="/form-wizard/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Form
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {forms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h2 className="mb-2 text-lg font-semibold">
                Nenhum formulário ainda
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Crie seu primeiro wizard form para começar.
              </p>
              <Button asChild>
                <Link href="/form-wizard/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => (
              <Card
                key={form.id}
                className="group transition-shadow hover:shadow-md"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{form.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">/{form.slug}</span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {form.stepsCount} step
                          {form.stepsCount !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(form.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(form.slug)}
                      title="Visualizar Jornada"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild title="Editar">
                      <Link href={`/form-wizard/${form.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(form.slug)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteSlug(form.slug)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Formulário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este formulário? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!previewForm} onOpenChange={() => setPreviewForm(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Jornada: {previewForm?.name}
            </DialogTitle>
          </DialogHeader>

          {previewForm && (
            <div className="space-y-1 py-2">
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono rounded bg-muted px-2 py-0.5">
                  /{previewForm.slug}
                </span>
                <span>•</span>
                <span>
                  {previewForm.steps.length} etapa
                  {previewForm.steps.length !== 1 ? 's' : ''}
                </span>
              </div>

              {previewForm.steps.map((step, stepIndex) => (
                <div key={step.id}>
                  <div className="rounded-lg border bg-card shadow-sm">
                    <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-3 rounded-t-lg">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {stepIndex + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{step.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          /{step.slug}
                        </p>
                      </div>
                      {step.backStepSlug && (
                        <Badge variant="outline" className="text-xs">
                          ← /{step.backStepSlug}
                        </Badge>
                      )}
                    </div>

                    {step.elements.length > 0 ? (
                      <div className="divide-y">
                        {step.elements.map((element) => {
                          const Icon = elementIcons[element.type]
                          const category = getElementCategory(element.type)
                          const preview = getElementPreview(element)
                          return (
                            <div
                              key={element.id}
                              className="flex items-center gap-3 px-4 py-2.5"
                            >
                              <div
                                className={cn(
                                  'flex h-6 w-6 items-center justify-center rounded',
                                  categoryColors[category]
                                )}
                              >
                                {Icon && <Icon className="h-3.5 w-3.5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium">
                                  {elementLabels[element.type] || element.type}
                                </span>
                                {preview && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {preview}
                                  </p>
                                )}
                              </div>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'text-[10px] shrink-0',
                                  categoryColors[category]
                                )}
                              >
                                {category === 'special-fields'
                                  ? 'campo especial'
                                  : category === 'fields'
                                    ? 'campo'
                                    : category === 'content'
                                      ? 'conteúdo'
                                      : category === 'actions'
                                        ? 'ação'
                                        : category}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-xs text-muted-foreground italic">
                        Nenhum elemento nesta etapa
                      </div>
                    )}
                  </div>

                  {stepIndex < previewForm.steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
