'use client'

import { useFormStore, validateSlug } from '@/lib/form-wizard/form-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Trash2,
  Plus,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  X,
} from 'lucide-react'
import type {
  TitleConfig,
  ParagraphConfig,
  TextInputConfig,
  SelectConfig,
  RadioConfig,
  CheckboxConfig,
  ConditionalRouteConfig,
  ConditionalOperator,
  NavigationConfig,
  ServiceCallConfig,
  ServiceType,
  SelectOption,
  PlansConfig,
  Plan,
  PlanBenefit,
  CPFInputConfig,
  CNPJInputConfig,
  PhoneInputConfig,
  CEPInputConfig,
  SocialNameInputConfig,
  PrivacyPolicyConfig,
  EmailInputConfig,
} from '@/lib/form-wizard/types'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

function StepProperties() {
  const form = useFormStore((s) => s.form)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const updateStep = useFormStore((s) => s.updateStep)
  const deleteStep = useFormStore((s) => s.deleteStep)

  const step = form.steps.find((s) => s.id === selectedStepId)
  const [localSlug, setLocalSlug] = useState(step?.slug || '')
  const [slugError, setSlugError] = useState<string | null>(null)

  useEffect(() => {
    if (step) {
      setLocalSlug(step.slug)
      setSlugError(null)
    }
  }, [step])

  if (!step) return null

  const handleSlugChange = (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setLocalSlug(formatted)
    const validation = validateSlug(formatted)

    if (!validation.valid) {
      setSlugError(validation.error || 'Invalid slug')
      return
    }

    // Check uniqueness
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
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => deleteStep(step.id)}
          >
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
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="No back button" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_none_">No back button</SelectItem>
              {form.steps
                .filter((s) => s.id !== step.id)
                .map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>
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

function TitleProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: TitleConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="title-text">Text</Label>
        <Textarea
          id="title-text"
          value={config.text}
          onChange={(e) =>
            updateElement(stepId, elementId, { text: e.target.value })
          }
          className="mt-1"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="title-size">Size</Label>
        <Select
          value={config.size || 'lg'}
          onValueChange={(value) =>
            updateElement(stepId, elementId, {
              size: value as TitleConfig['size'],
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function ParagraphProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: ParagraphConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div>
      <Label htmlFor="para-text">Text</Label>
      <Textarea
        id="para-text"
        value={config.text}
        onChange={(e) =>
          updateElement(stepId, elementId, { text: e.target.value })
        }
        className="mt-1"
        rows={4}
      />
    </div>
  )
}

function TextInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: TextInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="input-label">Label</Label>
        <Input
          id="input-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="input-placeholder">Placeholder</Label>
        <Input
          id="input-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="input-required">Required</Label>
        <Switch
          id="input-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
    </div>
  )
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: SelectOption[]
  onChange: (options: SelectOption[]) => void
}) {
  const addOption = () => {
    const newIndex = options.length + 1
    onChange([
      ...options,
      { label: `Option ${newIndex}`, value: `option-${newIndex}` },
    ])
  }

  const updateOption = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    onChange(newOptions)
  }

  const removeOption = (index: number) => {
    if (options.length <= 1) return
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label>Options</Label>
      {options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Label"
            value={option.label}
            onChange={(e) => updateOption(index, 'label', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={option.value}
            onChange={(e) => updateOption(index, 'value', e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeOption(index)}
            disabled={options.length <= 1}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full bg-transparent"
      >
        <Plus className="mr-1 h-3 w-3" />
        Add Option
      </Button>
    </div>
  )
}

function SelectProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: SelectConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="select-label">Label</Label>
        <Input
          id="select-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="select-required">Required</Label>
        <Switch
          id="select-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <OptionsEditor
        options={config.options}
        onChange={(options) => updateElement(stepId, elementId, { options })}
      />
    </div>
  )
}

function RadioProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: RadioConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="radio-label">Label</Label>
        <Input
          id="radio-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="radio-required">Required</Label>
        <Switch
          id="radio-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <OptionsEditor
        options={config.options}
        onChange={(options) => updateElement(stepId, elementId, { options })}
      />
    </div>
  )
}

function CheckboxProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CheckboxConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="checkbox-label">Label</Label>
        <Input
          id="checkbox-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="checkbox-required">Required</Label>
        <Switch
          id="checkbox-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
    </div>
  )
}

function CPFInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CPFInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cpf-label">Label</Label>
        <Input
          id="cpf-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cpf-placeholder">Placeholder</Label>
        <Input
          id="cpf-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cpf-required">Required</Label>
        <Switch
          id="cpf-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: 000.000.000-00
        <br />
        Includes automatic validation
      </div>
    </div>
  )
}

function CNPJInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CNPJInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cnpj-label">Label</Label>
        <Input
          id="cnpj-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cnpj-placeholder">Placeholder</Label>
        <Input
          id="cnpj-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cnpj-required">Required</Label>
        <Switch
          id="cnpj-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: 00.000.000/0000-00
        <br />
        Includes automatic validation
      </div>
    </div>
  )
}

function PhoneInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: PhoneInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="phone-label">Label</Label>
        <Input
          id="phone-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="phone-placeholder">Placeholder</Label>
        <Input
          id="phone-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="phone-required">Required</Label>
        <Switch
          id="phone-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="phone-international">Allow International</Label>
        <Switch
          id="phone-international"
          checked={config.allowInternational || false}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { allowInternational: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: (00) 00000-0000
        <br />
        Supports mobile and landline
      </div>
    </div>
  )
}

function CEPInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CEPInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cep-label">Label</Label>
        <Input
          id="cep-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cep-placeholder">Placeholder</Label>
        <Input
          id="cep-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cep-required">Required</Label>
        <Switch
          id="cep-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: 00000-000
        <br />
        Includes automatic mask
      </div>
    </div>
  )
}

function SocialNameInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: SocialNameInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="social-name-label">Label</Label>
        <Input
          id="social-name-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="social-name-placeholder">Placeholder</Label>
        <Input
          id="social-name-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="social-name-required">Required</Label>
        <Switch
          id="social-name-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
    </div>
  )
}

function PrivacyPolicyProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: PrivacyPolicyConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="privacy-label">Label</Label>
        <Input
          id="privacy-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="privacy-url">Policy URL</Label>
        <Input
          id="privacy-url"
          value={config.policyUrl || ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { policyUrl: e.target.value })
          }
          placeholder="https://..."
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="privacy-required">Required</Label>
        <Switch
          id="privacy-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Renders as a checkbox with a link to the privacy policy
      </div>
    </div>
  )
}

function EmailInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: EmailInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="email-label">Label</Label>
        <Input
          id="email-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email-placeholder">Placeholder</Label>
        <Input
          id="email-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="email-required">Required</Label>
        <Switch
          id="email-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Includes e-mail format validation
      </div>
    </div>
  )
}

function DeprecatedElementNotice({ elementType }: { elementType: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-700">
        <p className="font-semibold mb-1">Deprecated Element</p>
        <p>
          The <span className="font-mono">{elementType}</span> element is
          deprecated. Please remove it and use the new Actions instead:
        </p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Navigation</span> - Link to a URL or
            path
          </li>
          <li>
            <span className="font-medium">Service Call</span> - Call a service
            and route based on result
          </li>
          <li>
            <span className="font-medium">Conditional Route</span> - Route based
            on field values
          </li>
        </ul>
      </div>
    </div>
  )
}

function NavigationProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: NavigationConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)
  const form = useFormStore((s) => s.form)

  const allStepSlugs = form.steps.map((s) => ({
    slug: s.slug,
    name: s.name,
  }))

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-violet-500/10 p-3 text-xs text-violet-600">
        Navigate the user to a specific step in the journey.
      </div>

      <div>
        <Label htmlFor="nav-label">Button Label</Label>
        <Input
          id="nav-label"
          value={config.label || ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
          placeholder="Navigate"
        />
      </div>

      <div>
        <Label htmlFor="nav-url">Target Step</Label>
        <Select
          value={config.url || ''}
          onValueChange={(value) =>
            updateElement(stepId, elementId, { url: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select target step" />
          </SelectTrigger>
          <SelectContent>
            {allStepSlugs.map((step) => (
              <SelectItem key={step.slug} value={step.slug}>
                {step.name} - /{step.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">
          The step the user will navigate to when clicking this button.
        </p>
      </div>

      {config.url && (
        <div className="rounded-md border bg-muted/50 p-3">
          <p className="text-xs font-medium mb-1">Preview:</p>
          <p className="text-xs text-muted-foreground">
            Button &ldquo;{config.label || 'Navigate'}&rdquo; will go to{' '}
            <span className="font-mono text-foreground">/{config.url}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function ServiceCallProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: ServiceCallConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)
  const form = useFormStore((s) => s.form)

  const allStepSlugs = form.steps.map((s) => ({
    slug: s.slug,
    name: s.name,
  }))

  const serviceOptions: {
    value: ServiceType
    label: string
    description: string
  }[] = [
    {
      value: 'eligibility',
      label: 'Eligibility',
      description: 'Check if the customer is eligible',
    },
    {
      value: 'cotation',
      label: 'Cotation',
      description: 'Get a price quote for the customer',
    },
    {
      value: 'proposal',
      label: 'Proposal',
      description: 'Submit a proposal for the customer',
    },
    {
      value: 'simulation',
      label: 'Simulation',
      description: 'Run a simulation for the customer',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-violet-500/10 p-3 text-xs text-violet-600">
        Call an external service and route the user based on the result. If the
        service returns success, the user navigates to the configured step.
      </div>

      <div>
        <Label htmlFor="service-label">Button Label</Label>
        <Input
          id="service-label"
          value={config.label || ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
          placeholder="Submit"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          The text displayed on the action button
        </p>
      </div>

      <div>
        <Label htmlFor="service-type">Service</Label>
        <Select
          value={config.service || 'eligibility'}
          onValueChange={(value) =>
            updateElement(stepId, elementId, { service: value as ServiceType })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {config.service && (
          <p className="mt-1 text-xs text-muted-foreground">
            {
              serviceOptions.find((o) => o.value === config.service)
                ?.description
            }
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="service-target">Target Step (on Success)</Label>
        <Select
          value={config.targetStepSlugOnSuccess || ''}
          onValueChange={(value) =>
            updateElement(stepId, elementId, { targetStepSlugOnSuccess: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select target step" />
          </SelectTrigger>
          <SelectContent>
            {allStepSlugs.map((step) => (
              <SelectItem key={step.slug} value={step.slug}>
                {step.name} - /{step.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">
          The step to navigate to when the service returns a successful
          response.
        </p>
      </div>

      {config.service && config.targetStepSlugOnSuccess && (
        <div className="rounded-md border bg-muted/50 p-3">
          <p className="text-xs font-medium mb-1">Flow Preview:</p>
          <p className="text-xs text-muted-foreground">
            Call{' '}
            <span className="font-mono text-foreground">{config.service}</span>{' '}
            service
            <br />
            On success → go to{' '}
            <span className="font-mono text-foreground">
              /{config.targetStepSlugOnSuccess}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

function ConditionalRouteProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: ConditionalRouteConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)
  const form = useFormStore((s) => s.form)

  // Get all field names from all steps (for the dropdown)
  const allFields: { name: string; label: string; stepName: string }[] = []
  form.steps.forEach((step) => {
    step.elements.forEach((element) => {
      const elConfig = element.config as unknown as Record<string, unknown>
      if (elConfig.name && typeof elConfig.name === 'string') {
        allFields.push({
          name: elConfig.name,
          label: (elConfig.label as string) || elConfig.name,
          stepName: step.name,
        })
      }
    })
  })

  // Get all step slugs (for target step dropdown)
  const allStepSlugs = form.steps.map((s) => ({
    slug: s.slug,
    name: s.name,
  }))

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-violet-500/10 p-3 text-xs text-violet-600">
        Configure a condition to redirect the user to a different step based on
        their input.
      </div>

      <div>
        <Label htmlFor="condition-label">Button Label</Label>
        <Input
          id="condition-label"
          value={config.label || ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
          placeholder="Continue"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          The text displayed on the action button
        </p>
      </div>

      <div>
        <Label htmlFor="condition-field">Field to Compare</Label>
        <Select
          value={config.fieldName || ''}
          onValueChange={(value) =>
            updateElement(stepId, elementId, { fieldName: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a field" />
          </SelectTrigger>
          <SelectContent>
            {allFields.length === 0 ? (
              <SelectItem value="" disabled>
                No fields available
              </SelectItem>
            ) : (
              allFields.map((field) => (
                <SelectItem key={field.name} value={field.name}>
                  {field.label} ({field.stepName})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">
          The field value to check
        </p>
      </div>

      <div>
        <Label htmlFor="condition-operator">Operator</Label>
        <Select
          value={config.operator || 'EQUALS'}
          onValueChange={(value) =>
            updateElement(stepId, elementId, {
              operator: value as ConditionalOperator,
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EQUALS">Equals (=)</SelectItem>
            <SelectItem value="NOT_EQUALS">Not Equals (!=)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="condition-value">Value to Compare</Label>
        <Input
          id="condition-value"
          value={config.value || ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { value: e.target.value })
          }
          className="mt-1"
          placeholder="Enter value..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          The value to match against
        </p>
      </div>

      <div>
        <Label htmlFor="condition-target">Target Step (if TRUE)</Label>
        <Select
          value={config.targetStepSlug || ''}
          onValueChange={(value) =>
            updateElement(stepId, elementId, { targetStepSlug: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select target step" />
          </SelectTrigger>
          <SelectContent>
            {allStepSlugs.map((step) => (
              <SelectItem key={step.slug} value={step.slug}>
                {step.name} - /{step.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">
          If condition is TRUE, redirect here.
        </p>
      </div>

      <div>
        <Label htmlFor="condition-fallback">Fallback Step (if FALSE)</Label>
        <Select
          value={config.fallbackStepSlug || ''}
          onValueChange={(value) =>
            updateElement(stepId, elementId, { fallbackStepSlug: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select fallback step" />
          </SelectTrigger>
          <SelectContent>
            {allStepSlugs.map((step) => (
              <SelectItem key={step.slug} value={step.slug}>
                {step.name} - /{step.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">
          If condition is FALSE, redirect here.
        </p>
      </div>

      {/* Preview */}
      {config.fieldName && config.targetStepSlug && (
        <div className="rounded-md border bg-muted/50 p-3">
          <p className="text-xs font-medium mb-2">Rule Preview:</p>
          <p className="text-xs text-muted-foreground">
            If{' '}
            <span className="font-mono text-foreground">
              {config.fieldName}
            </span>{' '}
            {config.operator === 'NOT_EQUALS' ? '!=' : '='}{' '}
            <span className="font-mono text-foreground">
              &ldquo;{config.value}&rdquo;
            </span>
            <br />
            <span className="text-emerald-600">TRUE</span> →{' '}
            <span className="font-mono text-foreground">
              /{config.targetStepSlug}
            </span>
            {config.fallbackStepSlug && (
              <>
                <br />
                <span className="text-amber-600">FALSE</span> →{' '}
                <span className="font-mono text-foreground">
                  /{config.fallbackStepSlug}
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function PlansProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: PlansConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(
    config.plans[0]?.id || null
  )

  const generateId = () => Math.random().toString(36).substring(2, 11)

  const addPlan = () => {
    const newPlan: Plan = {
      id: generateId(),
      name: `Plan ${config.plans.length + 1}`,
      description: 'Plan description',
      price: 49,
      currency: 'BRL',
      installments: 1,
      installmentPrice: 49,
      buttonText: 'Select Plan',
      highlighted: false,
      benefits: [{ id: generateId(), text: 'Feature 1', included: true }],
    }
    updateElement(stepId, elementId, { plans: [...config.plans, newPlan] })
    setExpandedPlanId(newPlan.id)
  }

  const updatePlan = (planId: string, updates: Partial<Plan>) => {
    const updatedPlans = config.plans.map((p) =>
      p.id === planId ? { ...p, ...updates } : p
    )
    updateElement(stepId, elementId, { plans: updatedPlans })
  }

  const deletePlan = (planId: string) => {
    if (config.plans.length <= 1) return
    const updatedPlans = config.plans.filter((p) => p.id !== planId)
    updateElement(stepId, elementId, { plans: updatedPlans })
    if (expandedPlanId === planId) {
      setExpandedPlanId(updatedPlans[0]?.id || null)
    }
  }

  const addBenefit = (planId: string) => {
    const plan = config.plans.find((p) => p.id === planId)
    if (!plan) return
    const newBenefit: PlanBenefit = {
      id: generateId(),
      text: 'New benefit',
      included: true,
    }
    updatePlan(planId, { benefits: [...plan.benefits, newBenefit] })
  }

  const updateBenefit = (
    planId: string,
    benefitId: string,
    updates: Partial<PlanBenefit>
  ) => {
    const plan = config.plans.find((p) => p.id === planId)
    if (!plan) return
    const updatedBenefits = plan.benefits.map((b) =>
      b.id === benefitId ? { ...b, ...updates } : b
    )
    updatePlan(planId, { benefits: updatedBenefits })
  }

  const deleteBenefit = (planId: string, benefitId: string) => {
    const plan = config.plans.find((p) => p.id === planId)
    if (!plan || plan.benefits.length <= 1) return
    const updatedBenefits = plan.benefits.filter((b) => b.id !== benefitId)
    updatePlan(planId, { benefits: updatedBenefits })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="plans-title">Section Title</Label>
        <Input
          id="plans-title"
          value={config.title}
          onChange={(e) =>
            updateElement(stepId, elementId, { title: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Plans ({config.plans.length})</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addPlan}
            className="h-7 text-xs bg-transparent"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Plan
          </Button>
        </div>

        <div className="space-y-2">
          {config.plans.map((plan, index) => {
            const isExpanded = expandedPlanId === plan.id
            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-md border transition-all',
                  isExpanded ? 'border-primary bg-primary/5' : 'border-border',
                  plan.highlighted && 'ring-1 ring-amber-500/50'
                )}
              >
                {/* Plan Header */}
                <button
                  type="button"
                  onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">
                      Plan {index + 1}: {plan.name}
                    </span>
                    {plan.highlighted && (
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {plan.currency} {plan.price}
                  </span>
                </button>

                {/* Plan Details */}
                {isExpanded && (
                  <div className="border-t p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={plan.name}
                          onChange={(e) =>
                            updatePlan(plan.id, { name: e.target.value })
                          }
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Currency</Label>
                        <Select
                          value={plan.currency}
                          onValueChange={(value) =>
                            updatePlan(plan.id, { currency: value })
                          }
                        >
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">BRL</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={plan.description}
                        onChange={(e) =>
                          updatePlan(plan.id, { description: e.target.value })
                        }
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) =>
                            updatePlan(plan.id, {
                              price: Number(e.target.value),
                            })
                          }
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Installments</Label>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={plan.installments || 1}
                          onChange={(e) => {
                            const installments = Number(e.target.value)
                            updatePlan(plan.id, {
                              installments,
                              installmentPrice: plan.price / installments,
                            })
                          }}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>

                    {(plan.installments || 1) > 1 && (
                      <div className="rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                        {plan.installments}x of {plan.currency}{' '}
                        {(plan.price / (plan.installments || 1)).toFixed(2)}
                      </div>
                    )}

                    <div>
                      <Label className="text-xs">Button Text</Label>
                      <Input
                        value={plan.buttonText}
                        onChange={(e) =>
                          updatePlan(plan.id, { buttonText: e.target.value })
                        }
                        className="mt-1 h-8 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Highlight this plan</Label>
                      <Switch
                        checked={plan.highlighted || false}
                        onCheckedChange={(checked) =>
                          updatePlan(plan.id, { highlighted: checked })
                        }
                      />
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Benefits</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBenefit(plan.id)}
                          className="h-6 text-xs px-2"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-1.5">
                        {plan.benefits.map((benefit) => (
                          <div
                            key={benefit.id}
                            className="flex items-center gap-2"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateBenefit(plan.id, benefit.id, {
                                  included: !benefit.included,
                                })
                              }
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded',
                                benefit.included
                                  ? 'bg-emerald-500/20 text-emerald-600'
                                  : 'bg-destructive/20 text-destructive'
                              )}
                            >
                              {benefit.included ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </button>
                            <Input
                              value={benefit.text}
                              onChange={(e) =>
                                updateBenefit(plan.id, benefit.id, {
                                  text: e.target.value,
                                })
                              }
                              className="h-7 text-xs flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteBenefit(plan.id, benefit.id)}
                              disabled={plan.benefits.length <= 1}
                              className="h-6 w-6"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delete Plan */}
                    {config.plans.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-destructive hover:text-destructive mt-2"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete Plan
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ElementProperties() {
  const form = useFormStore((s) => s.form)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const selectedElementId = useFormStore((s) => s.selectedElementId)
  const deleteElement = useFormStore((s) => s.deleteElement)

  if (!selectedStepId || !selectedElementId) return null

  const step = form.steps.find((s) => s.id === selectedStepId)
  const element = step?.elements.find((e) => e.id === selectedElementId)

  if (!element) return null

  const elementTypeLabels: Record<string, string> = {
    TITLE: 'Title',
    PARAGRAPH: 'Paragraph',
    TEXT_INPUT: 'Text Input',
    SELECT: 'Select',
    RADIO: 'Radio',
    CHECKBOX: 'Checkbox',
    SUCCESS_SCREEN: 'Success Screen (Deprecated)',
    GO_TO_CHECKOUT: 'Go To Checkout (Deprecated)',
    CONDITIONAL_ROUTE: 'Conditional Route',
    NAVIGATION: 'Navigation',
    SERVICE_CALL: 'Service Call',
    PLANS: 'Plans',
    CPF_INPUT: 'CPF Input',
    CNPJ_INPUT: 'CNPJ Input',
    PHONE_INPUT: 'Phone Input',
    CEP_INPUT: 'CEP Input',
    SOCIAL_NAME_INPUT: 'Nome Social Input',
    PRIVACY_POLICY: 'Política de Privacidade',
    EMAIL_INPUT: 'E-mail Input',
  }

  const renderProperties = () => {
    switch (element.type) {
      case 'TITLE':
        return (
          <TitleProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as TitleConfig}
          />
        )
      case 'PARAGRAPH':
        return (
          <ParagraphProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as ParagraphConfig}
          />
        )
      case 'TEXT_INPUT':
        return (
          <TextInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as TextInputConfig}
          />
        )
      case 'SELECT':
        return (
          <SelectProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as SelectConfig}
          />
        )
      case 'RADIO':
        return (
          <RadioProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as RadioConfig}
          />
        )
      case 'CHECKBOX':
        return (
          <CheckboxProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as CheckboxConfig}
          />
        )
      case 'SUCCESS_SCREEN':
        return <DeprecatedElementNotice elementType="Success Screen" />
      case 'GO_TO_CHECKOUT':
        return <DeprecatedElementNotice elementType="Go To Checkout" />
      case 'NAVIGATION':
        return (
          <NavigationProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as NavigationConfig}
          />
        )
      case 'SERVICE_CALL':
        return (
          <ServiceCallProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as ServiceCallConfig}
          />
        )
      case 'CONDITIONAL_ROUTE':
        return (
          <ConditionalRouteProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as ConditionalRouteConfig}
          />
        )
      case 'PLANS':
        return (
          <PlansProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as PlansConfig}
          />
        )
      case 'CPF_INPUT':
        return (
          <CPFInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as CPFInputConfig}
          />
        )
      case 'CNPJ_INPUT':
        return (
          <CNPJInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as CNPJInputConfig}
          />
        )
      case 'PHONE_INPUT':
        return (
          <PhoneInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as PhoneInputConfig}
          />
        )
      case 'CEP_INPUT':
        return (
          <CEPInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as CEPInputConfig}
          />
        )
      case 'SOCIAL_NAME_INPUT':
        return (
          <SocialNameInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as SocialNameInputConfig}
          />
        )
      case 'PRIVACY_POLICY':
        return (
          <PrivacyPolicyProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as PrivacyPolicyConfig}
          />
        )
      case 'EMAIL_INPUT':
        return (
          <EmailInputProperties
            stepId={selectedStepId}
            elementId={element.id}
            config={element.config as EmailInputConfig}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{elementTypeLabels[element.type]}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => deleteElement(selectedStepId, element.id)}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </div>
      {renderProperties()}
    </div>
  )
}

export function PropertiesPanel() {
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const selectedElementId = useFormStore((s) => s.selectedElementId)

  return (
    <div className="flex h-full w-72 flex-col border-l bg-card">
      <div className="border-b p-4">
        <h2 className="font-semibold">Properties</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {selectedElementId ? (
          <ElementProperties />
        ) : selectedStepId ? (
          <StepProperties />
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a step or element to edit its properties
          </p>
        )}
      </div>
    </div>
  )
}
