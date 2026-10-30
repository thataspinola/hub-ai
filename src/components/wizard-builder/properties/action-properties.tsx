'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  ConditionalRouteConfig,
  ConditionalOperator,
  NavigationConfig,
  ServiceCallConfig,
  ServiceType,
} from '@/lib/form-wizard/types'

export function DeprecatedElementNotice({
  elementType,
}: {
  elementType: string
}) {
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

export function NavigationProperties({
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

export function ServiceCallProperties({
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

export function ConditionalRouteProperties({
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
