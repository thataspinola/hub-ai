'use client'

import { useFormStore, validateSlug } from '@/lib/form-wizard/form-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function StepProperties() {
  const form = useFormStore((s) => s.form)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const updateStep = useFormStore((s) => s.updateStep)
  const deleteStep = useFormStore((s) => s.deleteStep)
  const step = form.steps.find((s) => s.id === selectedStepId)
  const [localSlug, setLocalSlug] = useState(step?.slug || '')
  const [slugError, setSlugError] = useState<string | null>(null)
  const [previousStep, setPreviousStep] = useState(step)

  if (step !== previousStep) {
    setPreviousStep(step)
    setLocalSlug(step?.slug || '')
    setSlugError(null)
  }

  if (!step) return null

  const handleSlugChange = (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    setLocalSlug(formatted)
    const validation = validateSlug(formatted)

    if (!validation.valid) {
      setSlugError(validation.error || 'Invalid Slug')
      return
    }

    // Check uniqueness of the slug
    const otherSlugs = form.steps
      .filter((s) => s.id !== step.id)
      .map((s) => s.slug)

    if (otherSlugs.includes(formatted)) {
      setSlugError('Slug must be unique')
      return
    }

    setSlugError(null)
    updateStep(step.id, { slug: formatted })
  }

  const canDelete = form.steps.length > 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Step Properties</h3>

        {canDelete && (
          <Button variant="ghost" size="sm" onClick={() => deleteStep(step.id)}>
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="step-name">Name</Label>

          <Input
            id="step-name"
            value={step.name}
            onChange={(e) => updateStep(step.id, { name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="step-slug">Slug</Label>

          <Input
            id="step-slug"
            value={localSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className={cn('mt-1', slugError && 'border-destructive')}
          />

          {slugError && (
            <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {slugError}
            </p>
          )}

          <p className="mt-1 text-xs text-muted-foreground">
            URL path: /{localSlug}
          </p>
        </div>

        <div>
          <Label htmlFor="step-back">Back Navigation</Label>

          <Select
            value={step.backStepSlug || '_none_'}
            onValueChange={(value) =>
              updateStep(step.id, {
                backStepSlug: value === '_none_' ? '' : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="No back button" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="_none_">No back button</SelectItem>

              {form.steps
                .filter((s) => s.id !== step.id)
                .map((s) => (
                  <SelectItem key={s.id} value={s.slug}>
                    {s.name} - /{s.slug}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <p className="mt-1 text-xs text-muted-foreground">
            Which step the back arrow navigates to. Leave empty to hide the back
            button.
          </p>
        </div>

        <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          Step {step.order + 1} of {form.steps.length}
        </div>
      </div>
    </div>
  )
}
