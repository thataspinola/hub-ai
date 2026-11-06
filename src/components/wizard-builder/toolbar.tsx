'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useFormStore, validateSlug } from '@/lib/form-wizard/form-store'
import { getFormsIndex } from '@/lib/form-wizard/forms-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  RotateCcw,
  Code,
  CheckCircle2,
  Save,
  ArrowLeft,
  Clipboard,
  Check,
  Download,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormPreview } from './form-preview'
import { Eye } from 'lucide-react'

export function Toolbar() {
  const form = useFormStore((s) => s.form)
  const setFormName = useFormStore((s) => s.setFormName)
  const setFormSlug = useFormStore((s) => s.setFormSlug)
  const getValidationErrors = useFormStore((s) => s.getValidationErrors)
  const exportForm = useFormStore((s) => s.exportForm)
  const importForm = useFormStore((s) => s.importForm)
  const resetForm = useFormStore((s) => s.resetForm)
  const saveFormToStorage = useFormStore((s) => s.saveFormToStorage)

  const storageError = useFormStore((s) => s.storageError)

  const [showPreview, setShowPreview] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      saveFormToStorage()
      if (!useFormStore.getState().storageError) setLastSaved(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [saveFormToStorage])

  const [localSlug, setLocalSlug] = useState(form.slug)
  const [slugError, setSlugError] = useState<string | null>(null)

  const [previousSlug, setPreviousSlug] = useState(form.slug)
  if (previousSlug !== form.slug) {
    setPreviousSlug(form.slug)
    setLocalSlug(form.slug)
    setSlugError(null)
  }

  const handleSlugChange = (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setLocalSlug(formatted)

    const validation = validateSlug(formatted)
    if (!validation.valid) {
      setSlugError(validation.error || 'Invalid slug')
      return
    }

    const index = getFormsIndex()
    const otherSlugs = index.filter((f) => f.id !== form.id).map((f) => f.slug)
    if (otherSlugs.includes(formatted)) {
      setSlugError('Slug must be unique')
      return
    }

    setSlugError(null)
    setFormSlug(formatted)
  }

  const errors = getValidationErrors()
  const isValid = errors.length === 0

  const handleSave = useCallback(() => {
    setIsSaving(true)
    saveFormToStorage()
    setLastSaved(new Date())
    setTimeout(() => setIsSaving(false), 500)
  }, [saveFormToStorage])

  const handleExport = () => {
    const json = exportForm()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.name.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    setImportError(null)
    const success = importForm(importJson)
    if (success) {
      setShowImport(false)
      setImportJson('')
    } else {
      setImportError('Invalid JSON format. Please check your input.')
    }
  }

  return (
    <div className="flex items-center justify-between border-b bg-card px-4 py-3">
      {storageError && <span role="alert">{storageError}</span>}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/form-wizard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="flex flex-col gap-1">
          <Input
            value={form.name}
            onChange={(e) => setFormName(e.target.value)}
            className="h-8 w-48 font-semibold"
            placeholder="Form name"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">/</span>
            <Input
              value={localSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className={cn(
                'h-6 w-40 font-mono text-xs',
                slugError && 'border-destructive'
              )}
              placeholder="form-slug"
            />
            {slugError && (
              <span className="text-xs text-destructive">{slugError}</span>
            )}
          </div>
        </div>

        <Badge
          variant={isValid ? 'default' : 'destructive'}
          className={cn(
            'gap-1',
            isValid ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''
          )}
        >
          {isValid ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Valid
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3" />
              {errors.length} issue{errors.length !== 1 && 's'}
            </>
          )}
        </Badge>

        {lastSaved && (
          <span className="text-xs text-muted-foreground">
            Saved{' '}
            {lastSaved.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isValid && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Issues
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Validation Issues</DialogTitle>
                <DialogDescription>
                  Fix these issues before publishing your form
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="mr-1 h-3 w-3" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="mr-1 h-4 w-4" />
              Visualizar formulário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pré-visualização da jornada</DialogTitle>
              <DialogDescription>
                Teste a aparência e navegue pelas etapas sem enviar dados.
              </DialogDescription>
            </DialogHeader>
            <FormPreview form={form} />
          </DialogContent>
        </Dialog>

        {/* View JSON Dialog */}
        <Dialog open={showJson} onOpenChange={setShowJson}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Code className="mr-1 h-3 w-3" />
              JSON
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Form JSON Structure</DialogTitle>
                  <DialogDescription>
                    Current form configuration in JSON format
                  </DialogDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    navigator.clipboard.writeText(exportForm())
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </DialogHeader>
            <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-4 text-xs">
              {exportForm()}
            </pre>
          </DialogContent>
        </Dialog>

        {/* Import JSON Dialog */}
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="mr-1 h-3 w-3" />
              Import
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Form JSON</DialogTitle>
              <DialogDescription>Paste a form JSON to import</DialogDescription>
            </DialogHeader>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              className="h-48 w-full rounded-md border bg-muted p-3 text-xs font-mono"
              placeholder="Paste JSON here..."
            />
            {importError && (
              <p className="text-xs text-destructive">{importError}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImport(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>Import</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1 h-3 w-3" />
          Export
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetForm}
          className="text-muted-foreground"
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset
        </Button>
      </div>
    </div>
  )
}
